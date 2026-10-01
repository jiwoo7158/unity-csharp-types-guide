---
layout: default
title: 코루틴 / 비동기 타입
eyebrow: Coroutine / Awaitable / Task
---
# 코루틴 / 비동기 타입

Unity에서 “지금 바로 끝나지 않는 작업”을 표현하는 방법은 하나가 아닙니다. 대표적으로 **코루틴**, Unity 6의 **`Awaitable`**, .NET의 **`Task`**가 있습니다.

셋은 문법이 비슷하게 보이는 부분이 있어도 목적과 생명주기, 스레드, 반환 타입이 다릅니다. 이 페이지에서는 각 타입이 어떤 역할을 하는지부터 구분합니다.

## 먼저 큰 그림

```text
Coroutine 계열
IEnumerator 메서드
  └─ yield return WaitForSeconds(...)
  └─ StartCoroutine(...) -> Coroutine

Unity Awaitable 계열
async Awaitable / Awaitable<T>
  └─ await Awaitable.NextFrameAsync()
  └─ await Awaitable.WaitForSecondsAsync(...)

.NET Task 계열
async Task / Task<T>
  └─ await Task.Delay(...)
  └─ 일반 .NET 비동기 API와 연결
```

어느 방식이 항상 더 좋다고 볼 수는 없습니다. 기존 Unity API가 무엇을 반환하는지, 결과값이 필요한지, 취소가 필요한지, 다른 .NET 비동기 코드와 연결되는지에 따라 선택이 달라집니다.

---

# 코루틴의 핵심

## `IEnumerator`

Unity 코루틴 메서드에서 가장 흔하게 보는 반환 타입은 비제네릭 `System.Collections.IEnumerator`입니다.

```csharp
IEnumerator FlashRoutine()
{
    renderer.enabled = false;
    yield return new WaitForSeconds(0.1f);
    renderer.enabled = true;
}
```

이 메서드를 호출하는 것만으로는 일반적으로 Unity가 코루틴 실행 스케줄에 등록하지 않습니다.

```csharp
IEnumerator routine = FlashRoutine();
```

실제로 MonoBehaviour 코루틴으로 실행하려면 `StartCoroutine`을 사용합니다.

```csharp
StartCoroutine(FlashRoutine());
```

### `yield return`이 의미하는 것

코루틴은 메서드를 완전히 끝내지 않고 중간에 실행을 양보한 뒤, Unity가 적절한 시점에 다시 이어서 실행합니다.

```csharp
IEnumerator Example()
{
    Debug.Log("A");
    yield return null;
    Debug.Log("B");
}
```

`yield return null`은 보통 다음 프레임까지 대기하는 패턴으로 사용합니다.

### 코루틴은 별도 스레드가 아니다

코루틴을 사용한다고 자동으로 무거운 계산이 다른 CPU 스레드에서 실행되는 것은 아닙니다. 메인 스레드에서 큰 반복 계산을 코루틴 안에 그대로 넣으면 프레임이 멈출 수 있습니다.

```csharp
IEnumerator BadExample()
{
    // 엄청 무거운 계산을 한 프레임에 다 하면 여전히 프레임이 멈출 수 있음
    HeavyCalculation();
    yield return null;
}
```

코루틴의 핵심은 **여러 프레임에 걸쳐 실행 흐름을 나누는 것**입니다.

---

## `Coroutine`

`Coroutine`은 `StartCoroutine`이 반환하는 **실행 중인 코루틴에 대한 Unity 핸들 객체**입니다.

```csharp
private Coroutine routine;

void StartEffect()
{
    routine = StartCoroutine(EffectRoutine());
}
```

실행 중인 특정 코루틴을 나중에 멈출 때 보관할 수 있습니다.

```csharp
if (routine != null)
{
    StopCoroutine(routine);
    routine = null;
}
```

### `IEnumerator`와 차이

- `IEnumerator` = 코루틴 메서드가 만들어 내는 열거 실행 상태
- `Coroutine` = Unity가 시작한 코루틴 실행을 가리키는 핸들

```csharp
IEnumerator data = EffectRoutine();
Coroutine handle = StartCoroutine(data);
```

둘을 같은 타입이라고 생각하면 안 됩니다.

---

# YieldInstruction 계열

## `YieldInstruction`

`YieldInstruction`은 Unity가 코루틴 대기를 표현하기 위해 제공하는 여러 객체의 기반 타입입니다. 직접 변수 타입으로 자주 선언하기보다 `WaitForSeconds`, `WaitForFixedUpdate`, `WaitForEndOfFrame` 같은 구체 타입을 통해 접합니다.

---

## `CustomYieldInstruction`

`CustomYieldInstruction`은 사용자 정의 대기 조건을 만들 수 있는 추상 기반 클래스입니다. `keepWaiting` 프로퍼티가 true인 동안 코루틴이 계속 대기합니다.

```csharp
public class WaitForHealthFull : CustomYieldInstruction
{
    private readonly Health health;

    public WaitForHealthFull(Health health)
    {
        this.health = health;
    }

    public override bool keepWaiting => !health.IsFull;
}
```

사용:

```csharp
yield return new WaitForHealthFull(health);
```

간단한 조건이라면 `WaitUntil`을 쓰는 편이 훨씬 짧을 수 있고, 반복적으로 재사용할 도메인 대기 객체가 필요할 때 CustomYieldInstruction을 고려할 수 있습니다.

---

## `WaitForSeconds`

`WaitForSeconds`는 코루틴에서 **게임의 scaled time을 기준으로 일정 시간 대기**할 때 사용합니다.

```csharp
yield return new WaitForSeconds(1.5f);
```

`Time.timeScale`의 영향을 받습니다. 예를 들어 게임 일시정지로 timeScale을 0으로 만들면 이 대기도 진행되지 않는 형태가 될 수 있습니다.

### 정확한 실시간 타이머로 오해하지 않기

프레임 기반 실행 구조이므로 지정한 시간이 지난 바로 그 CPU 순간에 정확히 이어지는 것이 아니라, Unity가 코루틴을 재개할 수 있는 프레임 타이밍과 함께 동작합니다.

---

## `WaitForSecondsRealtime`

`WaitForSecondsRealtime`은 **unscaled real time**을 기준으로 대기합니다.

```csharp
yield return new WaitForSecondsRealtime(1f);
```

게임의 `Time.timeScale`을 0으로 만든 일시정지 화면에서도 실제 시간 기준으로 흘러야 하는 UI 연출 등에 사용할 수 있습니다.

### 둘 비교

| 타입 | `Time.timeScale` 영향 |
|---|---:|
| `WaitForSeconds` | 받음 |
| `WaitForSecondsRealtime` | 받지 않음 |

---

## `WaitForFixedUpdate`

다음 `FixedUpdate` 단계까지 대기합니다.

```csharp
yield return new WaitForFixedUpdate();
```

물리 시뮬레이션 주기와 관련된 코루틴 흐름에서 볼 수 있습니다. 그렇다고 모든 물리 코드를 코루틴으로 옮겨야 한다는 뜻은 아닙니다. 일반적인 Rigidbody 힘 적용은 `FixedUpdate`에서 직접 처리하는 구조도 매우 흔합니다.

---

## `WaitForEndOfFrame`

현재 프레임의 렌더링 작업이 상당 부분 진행된 뒤 프레임 말미까지 대기하는 용도로 사용합니다.

```csharp
yield return new WaitForEndOfFrame();
```

스크린 캡처, 렌더 결과 후처리 등 특정 프레임 타이밍이 중요한 작업에서 볼 수 있습니다. Editor/Game View 상태에 따라 특수한 동작 차이가 있을 수 있으므로 정확한 타이밍 의존 코드는 공식 문서를 확인하는 것이 좋습니다.

---

## `WaitUntil`

주어진 조건이 true가 될 때까지 대기합니다.

```csharp
yield return new WaitUntil(() => player.IsReady);
```

다음처럼 직접 while을 쓰는 것과 비슷한 의도를 더 선언적으로 표현할 수 있습니다.

```csharp
while (!player.IsReady)
    yield return null;
```

람다 안에서 매 프레임 어떤 작업을 하는지와 캡처가 필요한지는 성능이 매우 민감한 코드에서 고려할 수 있습니다.

---

## `WaitWhile`

조건이 true인 동안 계속 대기하고, false가 되면 이어서 실행합니다.

```csharp
yield return new WaitWhile(() => isLoading);
```

`WaitUntil(() => !isLoading)`과 논리적으로 비슷한 형태를 더 읽기 쉽게 표현할 수 있습니다.

---

# Unity 비동기 작업

## `AsyncOperation`

`AsyncOperation`은 Unity가 제공하는 여러 비동기 작업의 공통적인 결과/진행 객체입니다. 씬 비동기 로드 같은 API에서 대표적으로 만납니다.

```csharp
AsyncOperation operation = SceneManager.LoadSceneAsync("Battle");
```

대표 정보:

- `isDone`: 완료 여부
- `progress`: 진행 값
- `priority`: 우선순위 관련 값
- `allowSceneActivation`: 씬 활성화 제어
- `completed`: 완료 이벤트

```csharp
while (!operation.isDone)
{
    Debug.Log(operation.progress);
    yield return null;
}
```

### 진행률 0~1을 단순 로딩바로 쓰기 전 확인

SceneManager의 비동기 Scene Load 등 일부 작업은 activation을 대기하는 동안 progress 의미가 단순 0~1 선형 진행률과 다르게 보일 수 있습니다. 구체 API 문서를 확인하고 로딩 UI를 설계하는 편이 좋습니다.

---

## `ResourceRequest`

`ResourceRequest`는 `Resources.LoadAsync` 같은 비동기 Resources 로드의 결과 객체입니다. `AsyncOperation` 계열이며 완료 후 로드된 asset을 확인합니다.

```csharp
ResourceRequest request = Resources.LoadAsync<GameObject>("Enemies/Goblin");
yield return request;

GameObject prefab = request.asset as GameObject;
```

다만 Resources 폴더는 프로젝트 규모가 커질수록 빌드/메모리/에셋 관리 측면의 특성이 있으므로, 이 타입을 안다고 해서 모든 게임 데이터를 Resources에 넣는 것이 권장된다는 뜻은 아닙니다.

---

## `AssetBundleCreateRequest`

AssetBundle 관련 비동기 로드에서 사용하는 요청 타입입니다. Unity 기본 API에 속하지만, AssetBundle 기반 콘텐츠 관리 자체가 별도 학습 주제에 가깝습니다.

```csharp
AssetBundleCreateRequest request = AssetBundle.LoadFromFileAsync(path);
yield return request;
AssetBundle bundle = request.assetBundle;
```

처음 Unity를 배울 때는 이 타입의 세부 멤버보다 “AsyncOperation 계열의 특정 요청 타입”이라는 관계만 이해해도 충분합니다.

---

# Unity 6 `Awaitable`

## `Awaitable`

`Awaitable`은 Unity에서 async/await 패턴을 사용할 수 있도록 제공하는 Unity 전용 비동기 타입입니다. Unity 6에서는 프레임, FixedUpdate, 시간 대기, 메인/백그라운드 스레드 전환 등 Unity 실행 루프에 맞는 비동기 API와 함께 사용할 수 있습니다.

```csharp
async Awaitable NextFrameExample()
{
    Debug.Log("before");
    await Awaitable.NextFrameAsync();
    Debug.Log("next frame");
}
```

### 시간 대기

```csharp
async Awaitable DelayExample()
{
    await Awaitable.WaitForSecondsAsync(1f);
    Debug.Log("1 second later");
}
```

### 코루틴과 문법 차이

코루틴:

```csharp
IEnumerator AttackRoutine()
{
    yield return new WaitForSeconds(0.5f);
    Fire();
}
```

Awaitable:

```csharp
async Awaitable AttackAsync()
{
    await Awaitable.WaitForSecondsAsync(0.5f);
    Fire();
}
```

async/await 문법은 여러 비동기 호출을 일반 순차 코드처럼 표현하기 쉬운 장점이 있습니다.

### 스레드 주의

Unity API 대부분은 메인 스레드 사용을 전제로 합니다. 백그라운드 스레드로 전환했다면 GameObject, Transform 등 Unity API를 아무 곳에서나 접근해도 된다고 생각하면 안 됩니다.

### 재사용/풀링 특성

Unity의 Awaitable은 Task와 동일한 객체 생명주기라고 가정하면 안 됩니다. Unity 문서에서는 Awaitable 인스턴스를 풀링하며 **일반적으로 같은 Awaitable 인스턴스를 여러 번 await하지 않도록** 안내합니다. Awaitable을 장기간 저장해 여러 호출자가 반복 await하는 설계는 Task와 다른 주의가 필요합니다.

[Unity 공식 문서: Awaitable](https://docs.unity3d.com/ScriptReference/Awaitable.html)

[Unity Manual: async/await와 Awaitable](https://docs.unity3d.com/Manual/async-awaitable-introduction.html)

---

## `Awaitable<T>`

`Awaitable<T>`는 작업이 끝난 뒤 **결과값 T를 반환하는 Awaitable**입니다.

```csharp
async Awaitable<int> LoadScoreAsync()
{
    await Awaitable.NextFrameAsync();
    return 100;
}

async Awaitable UseScoreAsync()
{
    int score = await LoadScoreAsync();
    Debug.Log(score);
}
```

코루틴은 결과 반환을 직접 표현하기 어려워 콜백/필드 등을 함께 사용하는 경우가 있지만, Awaitable<T>는 async 메서드 반환값으로 자연스럽게 표현할 수 있습니다.

---

## `AwaitableCompletionSource<T>`

`AwaitableCompletionSource<T>`는 **사용자 코드에서 Awaitable의 완료 시점과 결과를 직접 제어**해야 할 때 사용할 수 있는 타입입니다.

개념적으로는 어떤 이벤트나 콜백 기반 API를 Awaitable 형태로 감싸는 데 유용할 수 있습니다.

```csharp
private AwaitableCompletionSource<int> source;

public Awaitable<int> WaitForSelectionAsync()
{
    source = new AwaitableCompletionSource<int>();
    return source.Awaitable;
}

public void Select(int index)
{
    source.SetResult(index);
}
```

실제 사용 시 취소, 중복 완료, 생명주기 종료를 함께 설계해야 합니다.

---

# .NET `Task`

## `Task`

`Task`는 .NET의 표준 비동기 작업 타입입니다. Unity 전용이 아니며, 네트워크/파일/라이브러리 등 일반 .NET 비동기 API와 연동할 때 자연스럽게 등장합니다.

```csharp
async Task ExampleAsync()
{
    await Task.Delay(1000);
}
```

### Unity API와 함께 쓸 때

`await` 이후 어느 스레드/컨텍스트에서 이어지는지, Unity 메인 스레드 API를 안전하게 호출할 수 있는지 이해해야 합니다. 특히 백그라운드 작업을 직접 생성하면 Transform/GameObject 접근을 그 작업 안에서 하면 안 되는 상황이 일반적입니다.

---

## `Task<T>`

결과값을 반환하는 .NET Task입니다.

```csharp
async Task<string> LoadTextAsync(string path)
{
    return await File.ReadAllTextAsync(path);
}
```

Unity 프로젝트에서도 일반 .NET API가 Task를 반환하면 그대로 사용할 수 있습니다. Awaitable과 Task를 “문법이 같은 async 타입”이라는 이유로 완전히 동일하게 취급하지 말고 각 타입의 완료/스레드/재사용 규칙을 확인해야 합니다.

---

# `CancellationToken`

`CancellationToken`은 장시간 비동기 작업에 취소 요청을 전달하는 표준 .NET 구조체입니다.

```csharp
async Task WorkAsync(CancellationToken token)
{
    while (true)
    {
        token.ThrowIfCancellationRequested();
        await Task.Delay(100, token);
    }
}
```

### 취소는 강제 종료가 아니다

CancellationToken은 작업을 강제로 중단시키는 마법의 스위치가 아닙니다. 작업 코드 또는 호출하는 API가 token을 확인하고 취소에 협력해야 합니다.

MonoBehaviour의 생명주기와 비동기 작업을 연결할 때는 “오브젝트가 파괴되었는데 비동기 작업이 계속되어 나중에 필드에 접근한다” 같은 문제를 막기 위해 취소 설계가 중요합니다.

---

# `Coroutine` vs `Awaitable` vs `Task`

| 항목 | Coroutine | Awaitable | Task |
|---|---|---|---|
| 대표 반환 | `IEnumerator` | `Awaitable`, `Awaitable<T>` | `Task`, `Task<T>` |
| Unity 프레임 대기 | 매우 자연스러움 | 매우 자연스러움 | 별도 연결 필요 |
| 결과값 반환 | 직접적이지 않음 | 자연스러움 | 자연스러움 |
| 기존 Unity 코드 | 매우 흔함 | Unity 6에서 적극 활용 가능 | 일반 .NET 연동에 흔함 |
| 일반 .NET 라이브러리 연동 | 간접적 | 변환/연결 필요할 수 있음 | 자연스러움 |
| 별도 스레드라는 뜻 | X | X | Task 자체만으로 항상 별도 스레드라는 뜻 X |

### “async = 멀티스레드”가 아니다

`async/await`는 비동기 실행 흐름을 표현하는 언어 기능입니다. `await`를 쓴다고 자동으로 모든 작업이 백그라운드 스레드에서 실행되는 것은 아닙니다.

```csharp
async Task ExampleAsync()
{
    HeavyCalculation(); // 여기서 동기적으로 오래 걸리면 여전히 막힐 수 있음
    await Task.Delay(1);
}
```

무거운 CPU 연산을 병렬 스레드에서 처리하는 문제와 “I/O나 프레임 대기를 비동기로 표현하는 문제”는 구분해서 생각해야 합니다.

---

# 생명주기와 취소를 같이 생각하기

비동기 코드는 시작할 때보다 **끝날 때 대상 객체가 아직 존재하는가**가 더 중요할 수 있습니다.

```csharp
async Awaitable ExampleAsync()
{
    await Awaitable.WaitForSecondsAsync(5f);

    // 5초 사이에 이 MonoBehaviour/GameObject가 파괴되었다면?
    transform.position = Vector3.zero;
}
```

실제 프로젝트에서는 다음을 설계합니다.

- 오브젝트 비활성/파괴 시 작업을 취소할 것인가?
- 씬 전환 후 결과를 적용해도 되는가?
- 같은 작업을 중복 시작해도 되는가?
- 이전 작업 결과가 더 늦게 도착하면 어떻게 할 것인가?

비동기 문법보다 이런 생명주기 규칙이 안정성에 더 큰 영향을 줄 수 있습니다.

---

# 빠른 선택 기준

| 상황 | 먼저 떠올릴 방식 |
|---|---|
| 몇 프레임 뒤/몇 초 뒤 간단한 Unity 흐름 | Coroutine 또는 Awaitable |
| 기존 코루틴 기반 Unity API와 자연스럽게 연결 | Coroutine |
| Unity 6 async/await 스타일로 순차 흐름 표현 | Awaitable |
| 결과값을 async 메서드로 자연스럽게 반환 | Awaitable<T> / Task<T> |
| 일반 .NET 비동기 라이브러리 사용 | Task |
| 취소 가능한 장시간 작업 | CancellationToken을 지원하는 async 설계 |
| CPU가 매우 무거운 계산 | 단순 async 여부가 아니라 실제 스레드/Job/Burst 등 별도 병렬 처리 전략 검토 |

처음에는 코루틴의 `IEnumerator`, `Coroutine`, `WaitForSeconds`를 확실히 이해하고, 이후 Unity 6의 `Awaitable`과 일반 .NET `Task`의 차이를 확장해서 보는 것이 좋습니다.
