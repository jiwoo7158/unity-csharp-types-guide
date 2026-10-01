---
layout: default
title: 런타임 / 씬 / 입력 / 이벤트
eyebrow: Runtime / Scene / Input / Events
---
# 런타임 / 씬 / 입력 / 이벤트 타입

이 페이지는 특정 컴포넌트 계층보다는 게임 전체 흐름을 연결할 때 자주 보는 타입을 모아 정리합니다. `Scene`, `SceneManager`, `LayerMask`, `KeyCode`, `UnityEvent`, `Action`, `JsonUtility`, `Resources`처럼 서로 다른 시스템의 타입이 섞여 있지만, 실제 Unity 프로젝트에서 변수/매개변수/반환형으로 자주 만나는 것들입니다.

> 입력 부분은 **별도 Input System 패키지 없이 Unity 기본 API에서 접하는 타입**을 중심으로 합니다. 새로운 Input System 패키지의 `InputAction` 등은 이 가이드의 핵심 범위에서 제외했습니다.

---

# 씬

## `Scene`

`Scene`은 **로드된 Unity Scene을 가리키는 값 타입(struct)** 입니다. Scene 파일 자체를 그대로 들고 있는 에셋 객체라기보다, 현재 SceneManager가 관리하는 씬에 접근하기 위한 핸들/정보 값에 가깝습니다.

```csharp
using UnityEngine.SceneManagement;

Scene scene = SceneManager.GetActiveScene();
Debug.Log(scene.name);
Debug.Log(scene.buildIndex);
```

### 자주 확인하는 정보

- `name`: 씬 이름
- `buildIndex`: 빌드 인덱스
- `path`: 씬 경로
- `isLoaded`: 로드 여부
- `rootCount`: 루트 GameObject 수
- `GetRootGameObjects()`: 루트 오브젝트 조회

```csharp
GameObject[] roots = scene.GetRootGameObjects();
```

### Scene은 GameObject가 아니다

Scene은 여러 GameObject를 포함하는 상위 컨테이너 개념이며 Transform 계층의 부모로 직접 들어가는 것은 아닙니다.

---

## `SceneManager`

`SceneManager`는 Scene을 로드, 언로드, 조회하는 **정적 클래스**입니다. 컴포넌트로 GameObject에 붙이지 않습니다.

```csharp
SceneManager.LoadScene("Game");
```

### 비동기 로드

```csharp
AsyncOperation operation = SceneManager.LoadSceneAsync("Game");
```

비동기 흐름은 코루틴이나 Awaitable/Task와 함께 설계할 수 있습니다.

### 현재 Scene

```csharp
Scene active = SceneManager.GetActiveScene();
```

### 이벤트

```csharp
void OnEnable()
{
    SceneManager.sceneLoaded += OnSceneLoaded;
}

void OnDisable()
{
    SceneManager.sceneLoaded -= OnSceneLoaded;
}

void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{
    Debug.Log($"Loaded: {scene.name}");
}
```

정적 이벤트 구독은 수명이 긴 만큼 해제 시점을 함께 관리하는 것이 좋습니다.

---

## `LoadSceneMode`

Scene을 불러올 때 기존 Scene을 대체할지 추가로 쌓을지를 나타내는 enum입니다.

```csharp
SceneManager.LoadScene("Battle", LoadSceneMode.Single);
SceneManager.LoadScene("UI", LoadSceneMode.Additive);
```

- `Single`: 일반적으로 기존 씬을 교체하는 로드
- `Additive`: 기존 씬을 유지하면서 추가 Scene을 로드

Additive 로드는 레벨과 공통 UI, 조명, 스트리밍 구역 등을 분리하는 구조에서 활용할 수 있습니다.

---

## `AsyncOperation`

SceneManager.LoadSceneAsync 등의 Unity 비동기 API가 반환하는 공통 작업 타입입니다.

```csharp
AsyncOperation op = SceneManager.LoadSceneAsync("Battle");

while (!op.isDone)
{
    Debug.Log(op.progress);
    yield return null;
}
```

자세한 비동기 의미는 [코루틴 / 비동기 문서]({{ '/categories/coroutine-async/#asyncoperation' | relative_url }})를 참고하세요.

---

# Layer

## `LayerMask`

`LayerMask`는 Unity의 여러 Layer를 선택한 상태를 **비트마스크**로 표현하는 struct입니다.

```csharp
[SerializeField] private LayerMask groundMask;
```

물리 쿼리에서 특히 많이 사용합니다.

```csharp
if (Physics.Raycast(transform.position, Vector3.down, 2f, groundMask))
{
    ...
}
```

### GameObject.layer와 다르다

```csharp
int layerIndex = gameObject.layer;
LayerMask mask = groundMask;
```

`layerIndex`는 한 개 레이어 번호이고, LayerMask는 여러 레이어를 동시에 포함할 수 있는 비트 조합입니다.

### 코드로 마스크 만들기

```csharp
int enemyLayer = LayerMask.NameToLayer("Enemy");
int enemyMask = 1 << enemyLayer;
```

여러 레이어를 합칠 수도 있습니다.

```csharp
int mask = (1 << enemyLayer) | (1 << obstacleLayer);
```

비트 연산을 이해하면 Raycast의 LayerMask 인자가 훨씬 자연스럽게 보입니다.

---

# 레거시 입력 API에서 보는 타입

## `KeyCode`

`KeyCode`는 키보드 키, 마우스 버튼, 조이스틱 버튼 등 여러 입력 키를 나타내는 enum입니다. Unity의 기존 `Input` 클래스 API에서 자주 사용합니다.

```csharp
if (Input.GetKeyDown(KeyCode.Space))
{
    Jump();
}
```

### `GetKey`, `GetKeyDown`, `GetKeyUp`

```csharp
Input.GetKey(KeyCode.W);      // 누르는 동안
Input.GetKeyDown(KeyCode.W);  // 눌린 프레임
Input.GetKeyUp(KeyCode.W);    // 뗀 프레임
```

새로운 Input System 패키지에서는 다른 API 구조를 사용하므로, 코드를 볼 때 어떤 입력 시스템을 사용하는 프로젝트인지 구분해야 합니다.

---

## `Touch`

`Touch`는 모바일 터치 하나에 대한 정보를 담는 struct입니다.

```csharp
if (Input.touchCount > 0)
{
    Touch touch = Input.GetTouch(0);
    Debug.Log(touch.position);
}
```

대표 정보:

- `fingerId`
- `position`
- `deltaPosition`
- `phase`
- `tapCount`

여러 손가락 입력에서는 배열 인덱스와 `fingerId`가 동일한 개념이 아니라는 점을 주의해야 합니다.

---

## `TouchPhase`

터치가 현재 어느 단계에 있는지 나타내는 enum입니다.

대표 상태:

- `Began`
- `Moved`
- `Stationary`
- `Ended`
- `Canceled`

```csharp
switch (touch.phase)
{
    case TouchPhase.Began:
        BeginDrag(touch.position);
        break;

    case TouchPhase.Moved:
        UpdateDrag(touch.position);
        break;

    case TouchPhase.Ended:
        EndDrag(touch.position);
        break;
}
```

---

## `DeviceOrientation`

모바일 기기의 방향 상태를 표현하는 enum입니다. 세로/가로 방향과 FaceUp/FaceDown 같은 상태를 구분합니다.

```csharp
DeviceOrientation orientation = Input.deviceOrientation;
```

화면 회전 정책은 Screen.orientation, 플랫폼 설정과도 관련되므로 이 값 하나만으로 전체 UI 회전 정책을 만들기보다 실제 요구에 맞춰 구성해야 합니다.

---

# 화면 / 플랫폼

## `Resolution`

`Resolution`은 화면 해상도와 Refresh Rate 정보를 표현하는 struct입니다.

```csharp
Resolution current = Screen.currentResolution;
Debug.Log($"{current.width} x {current.height}");
```

지원 해상도 목록을 조회할 수도 있습니다.

```csharp
foreach (Resolution resolution in Screen.resolutions)
{
    Debug.Log(resolution);
}
```

게임 내 그래픽 설정 UI에서 자주 만나는 타입입니다.

---

## `FullScreenMode`

`Screen.SetResolution` 등에서 전체 화면 방식을 나타내는 enum입니다.

```csharp
Screen.SetResolution(1920, 1080, FullScreenMode.FullScreenWindow);
```

플랫폼마다 지원/동작 방식이 다를 수 있으므로 데스크톱, 모바일, 콘솔을 같은 감각으로 단정하지 않는 것이 좋습니다.

---

## `CursorLockMode`

마우스 커서를 잠그는 방식을 나타내는 enum입니다.

```csharp
Cursor.lockState = CursorLockMode.Locked;
Cursor.visible = false;
```

대표 값:

- `None`
- `Locked`
- `Confined`

FPS 카메라처럼 마우스를 화면 중앙에 고정해야 하는 게임이나, UI 모드 전환에서 자주 사용합니다.

---

## `RuntimePlatform`

현재 실행 중인 플랫폼을 나타내는 enum입니다.

```csharp
if (Application.platform == RuntimePlatform.WindowsPlayer)
{
    ...
}
```

다만 플랫폼별 컴파일 자체를 나누고 싶다면 `#if UNITY_STANDALONE_WIN` 같은 **플랫폼 컴파일 심볼**이 더 적합한 경우도 있습니다.

- `RuntimePlatform`: 런타임 분기
- 전처리 심볼: 컴파일 단계 분기

둘은 목적이 다릅니다.

---

## `SystemLanguage`

시스템 언어 정보를 나타내는 enum입니다.

```csharp
SystemLanguage language = Application.systemLanguage;
```

로컬라이제이션 기본 언어 추정에 참고할 수 있지만, 사용자가 게임 내에서 직접 선택한 언어 설정이 있다면 보통 그 선택을 우선하는 별도 설정 시스템을 둡니다.

---

# 로그

## `LogType`

Unity 로그 메시지의 종류를 나타내는 enum입니다.

대표적으로:

- Error
- Assert
- Warning
- Log
- Exception

로그 콜백을 받을 때 사용할 수 있습니다.

```csharp
void OnEnable()
{
    Application.logMessageReceived += OnLog;
}

void OnDisable()
{
    Application.logMessageReceived -= OnLog;
}

void OnLog(string condition, string stackTrace, LogType type)
{
    if (type == LogType.Error || type == LogType.Exception)
    {
        // 별도 처리
    }
}
```

---

# Delegate와 이벤트

## `Action`

`Action`은 **반환값이 없는 메서드 참조**를 담는 .NET delegate 타입입니다.

```csharp
Action onDead;
```

구독/호출:

```csharp
onDead += PlayDeathSound;
onDead += ShowGameOver;

onDead?.Invoke();
```

매개변수가 있는 Action도 있습니다.

```csharp
Action<int> onHealthChanged;
onHealthChanged?.Invoke(currentHp);
```

### `event`와 함께 쓰기

```csharp
public event Action<int> HealthChanged;
```

`event`를 붙이면 외부 코드는 일반적으로 구독/해제는 가능하지만 임의로 이벤트를 직접 호출하거나 대입하는 권한은 제한됩니다.

```csharp
HealthChanged?.Invoke(currentHp);
```

이벤트 소유자가 호출 권한을 갖는 구조를 표현하기 좋습니다.

---

## `Func<T>`

`Func`는 **반환값이 있는 메서드 참조**를 표현하는 .NET delegate입니다.

```csharp
Func<int> getScore;
Func<Enemy, bool> canTarget;
```

마지막 제네릭 타입이 반환 타입입니다.

```csharp
Func<int, int, float> operation;
// int, int를 받고 float를 반환
```

콜백으로 계산 규칙을 전달하거나 LINQ API에서 자주 만납니다.

---

## `Predicate<T>`

`Predicate<T>`는 `T` 하나를 받아 bool을 반환하는 조건 delegate입니다.

```csharp
Predicate<Enemy> isAlive = enemy => enemy.IsAlive;
```

`List<T>.Find`, `FindAll`, `RemoveAll` 등의 API에서 볼 수 있습니다.

```csharp
enemies.RemoveAll(enemy => enemy == null);
```

현대 C#에서는 같은 모양의 `Func<T,bool>`도 널리 사용되므로 “둘 다 조건 함수처럼 보이는데 왜 다른가?”라는 의문이 생길 수 있습니다. 일부 .NET API가 역사적으로 Predicate<T>를 매개변수 타입으로 정의했기 때문입니다.

---

## `UnityAction`

`UnityAction`은 UnityEvent 시스템과 함께 사용하는 Unity 측 delegate 타입입니다.

```csharp
UnityAction action = OnButtonClicked;
```

`Action`과 개념은 매우 비슷하지만 UnityEvent API의 Listener 타입으로 자연스럽게 연결됩니다.

---

## `UnityEvent`

`UnityEvent`는 Unity가 직렬화 가능한 이벤트 형태로 제공하는 클래스입니다. Inspector에서 이벤트 Listener를 연결할 수 있다는 점이 일반 C# event/Action과 큰 차이입니다.

```csharp
[SerializeField] private UnityEvent onOpened;

public void Open()
{
    onOpened?.Invoke();
}
```

Inspector에서 다른 GameObject의 public 메서드를 연결할 수 있습니다.

### 코드 Listener

```csharp
void OnEnable()
{
    onOpened.AddListener(HandleOpened);
}

void OnDisable()
{
    onOpened.RemoveListener(HandleOpened);
}
```

### 언제 유용한가?

- 디자이너가 Inspector에서 연결해야 하는 이벤트
- Button 등의 Unity UI 이벤트
- 컴포넌트 간 느슨한 연결을 Inspector에서 구성

### C# event/Action과 비교

`UnityEvent`는 Inspector 직렬화와 Unity Editor 연결에 강점이 있고, C# `event Action`은 코드 중심 API에 간결하고 타입 시스템과 자연스럽게 결합됩니다. 둘 중 하나만 정답이라기보다 누가 연결을 구성하는지에 따라 선택할 수 있습니다.

---

## `UnityEvent<T>`

값 하나를 전달하는 제네릭 UnityEvent입니다.

```csharp
[Serializable]
public class IntEvent : UnityEvent<int> { }

[SerializeField] private IntEvent onScoreChanged;
```

Unity 버전/Inspector 지원 형태에 따라 제네릭 이벤트를 직렬화하는 패턴이 달라질 수 있으므로 실제 프로젝트 버전의 Inspector 동작을 확인하는 편이 좋습니다.

---

# Random

## `Random.State`

`UnityEngine.Random.State`는 Unity 랜덤 생성기의 현재 상태를 저장하는 struct입니다.

```csharp
Random.State saved = Random.state;

Random.InitState(1234);
int value = Random.Range(0, 100);

Random.state = saved;
```

### 왜 상태를 저장하나?

- 재현 가능한 랜덤 테스트
- 특정 생성 과정만 고정 seed로 실행한 뒤 기존 랜덤 상태 복원
- 절차적 생성 디버깅

`System.Random`과 `UnityEngine.Random`은 다른 랜덤 API입니다. 어떤 랜덤 소스를 사용 중인지 구분해야 합니다.

---

# 해시

## `Hash128`

128비트 해시 값을 표현하는 Unity struct입니다. 데이터/콘텐츠 상태를 식별하거나 비교하는 고급 API에서 볼 수 있습니다.

```csharp
Hash128 hash = Hash128.Compute("example");
```

GUID처럼 “고유 식별자 생성”과 완전히 같은 목적이라고 단순화하지 말고, 해시는 입력 데이터로부터 계산되는 식별/비교 값이라는 성격을 이해하는 것이 좋습니다.

---

# JSON

## `JsonUtility`

`JsonUtility`는 Unity가 제공하는 **간단한 JSON 직렬화/역직렬화 정적 클래스**입니다.

```csharp
[Serializable]
public class SaveData
{
    public int level;
    public float hp;
}

SaveData data = new SaveData { level = 3, hp = 50f };
string json = JsonUtility.ToJson(data);
```

역직렬화:

```csharp
SaveData loaded = JsonUtility.FromJson<SaveData>(json);
```

### Unity 직렬화 규칙과 연결

JsonUtility는 일반적인 범용 JSON 라이브러리와 기능 범위가 다르며 Unity 직렬화 시스템의 구조와 관련된 제약이 있습니다. 임의의 Dictionary나 모든 C# 프로퍼티를 자유롭게 처리하는 범용 JSON serializer로 생각하면 안 됩니다.

### `FromJsonOverwrite`

기존 객체에 JSON 값을 덮어쓰는 API도 있습니다.

```csharp
JsonUtility.FromJsonOverwrite(json, data);
```

게임 저장 포맷이 복잡해지면 버전 관리, Dictionary, 다형성, 외부 서비스 JSON 호환성 등을 고려해 다른 데이터 설계를 검토할 수 있습니다.

---

# `Resources`

`Resources`는 `Assets/Resources` 폴더에 포함된 에셋을 런타임에 경로 문자열로 로드하는 **정적 클래스**입니다.

```csharp
GameObject prefab = Resources.Load<GameObject>("Enemies/Goblin");
```

경로에는 일반적으로 Resources 폴더 기준 경로를 사용하고 확장자를 제외합니다.

### 비동기 로드

```csharp
ResourceRequest request = Resources.LoadAsync<GameObject>("Enemies/Goblin");
```

### 편하지만 프로젝트 구조를 생각해야 함

Resources는 간단한 프로젝트와 특정 고정 에셋 로딩에는 편리하지만, 큰 프로젝트의 모든 콘텐츠를 Resources에 몰아넣는 것은 빌드 크기, 로딩, 의존성 관리 측면에서 한계가 있을 수 있습니다.

Addressables 같은 별도 패키지 기반 시스템도 있지만, 이 가이드에서는 “Unity 기본 API 먼저”라는 범위 때문에 Resources를 우선 설명합니다.

---

# 자주 헷갈리는 조합

| 조합 | 차이 |
|---|---|
| `Scene` vs `SceneManager` | 개별 씬을 나타내는 값 vs 씬을 관리하는 정적 API |
| `LayerMask` vs `GameObject.layer` | 여러 레이어 비트 조합 vs 단일 레이어 인덱스 |
| `KeyCode` vs Input System `InputAction` | 레거시 기본 입력 enum vs 별도 Input System 패키지 API |
| `Action` vs `UnityAction` | .NET delegate vs UnityEvent 계열 delegate |
| `event Action` vs `UnityEvent` | 코드 중심 이벤트 vs Inspector 직렬화 가능한 Unity 이벤트 |
| `Func<T,bool>` vs `Predicate<T>` | 둘 다 조건 함수로 쓸 수 있지만 서로 다른 delegate 타입/API 역사 |
| `JsonUtility` vs 범용 JSON 라이브러리 | Unity 직렬화 친화적 간단 API vs 더 광범위한 JSON 기능 |
| `Resources` vs 직접 에셋 참조 | 문자열 런타임 로드 vs SerializeField/에셋 참조 |

## 추천 학습 순서

1. `Scene` / `SceneManager`
2. `LayerMask`
3. `Action` / `event`
4. `UnityEvent`
5. `JsonUtility`
6. `Resources`
7. 사용하는 프로젝트가 레거시 Input이면 `KeyCode` / `Touch`
8. 그래픽 옵션이 필요하면 `Resolution`, `FullScreenMode`, `CursorLockMode`
