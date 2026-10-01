---
layout: default
title: Unity Object / Component 계층
eyebrow: UnityEngine.Object Model
---
# Unity Object / Component 계층

Unity를 처음 배울 때 가장 중요한 타입 관계 중 하나가 `Object → GameObject / Component → Behaviour → MonoBehaviour`입니다. 여기에 `ScriptableObject`, `Transform`, `RectTransform`이 연결됩니다.

이 구조를 이해하면 다음 질문들이 자연스럽게 풀립니다.

- 왜 `GetComponent<T>()`가 필요한가?
- `gameObject`와 `transform`은 왜 모든 MonoBehaviour에서 바로 보이는가?
- `MonoBehaviour`와 `ScriptableObject`는 무엇이 다른가?
- `GameObject`와 `Component` 중 무엇을 변수로 받아야 하는가?
- Unity 오브젝트의 `null` 비교는 왜 일반 C# 객체와 조금 다른가?

## 계층 구조 한눈에 보기

```text
System.Object
└─ UnityEngine.Object
   ├─ GameObject
   ├─ ScriptableObject
   └─ Component
      ├─ Transform
      │  └─ RectTransform
      └─ Behaviour
         └─ MonoBehaviour
            └─ 여러분이 작성하는 일반 컴포넌트 스크립트
```

> `Renderer`, `Collider`, `Rigidbody`, `Camera`, `AudioSource`, `Animator` 등 수많은 Unity 컴포넌트도 결국 `Component` 계열에 속합니다.

---

## `UnityEngine.Object`

`UnityEngine.Object`는 Unity 엔진이 관리하는 많은 객체의 공통 기반 클래스입니다. `GameObject`, `Component`, `ScriptableObject`, `Material`, `Texture`, `Mesh`, `AnimationClip` 같은 타입들이 이 계층 아래에 있습니다.

C#의 최상위 `System.Object`와 이름이 같아서 `Object`라고만 보면 혼동할 수 있습니다.

```csharp
System.Object normalObject;
UnityEngine.Object unityObject;
```

일반 Unity 스크립트에서는 `using UnityEngine;` 때문에 `Object`가 `UnityEngine.Object`를 가리키는 경우가 많습니다.

### 왜 특별한가?

UnityEngine.Object는 순수 C# 객체와 달리 Unity 엔진 내부의 네이티브 객체와 연결되어 있는 경우가 많습니다. C# 쪽 참조가 존재하더라도 엔진 쪽 오브젝트가 파괴된 상태가 될 수 있습니다.

```csharp
GameObject obj = new GameObject("Temp");
Destroy(obj);
```

`Destroy`는 Unity 오브젝트의 파괴를 예약/처리합니다. 이 계층은 일반 `new SomeClass()`로 만드는 순수 C# 객체와 생명주기 감각이 다릅니다.

### Unity의 특별한 `null` 비교

UnityEngine.Object는 `==` 비교를 오버로드하여 파괴된 Unity 오브젝트가 `null`처럼 비교될 수 있습니다.

```csharp
if (target == null)
{
    // 실제 C# 참조가 완전히 null이거나,
    // Unity 엔진 측 객체가 파괴된 경우를 함께 고려해야 함
}
```

따라서 UnityEngine.Object 계열의 null 동작을 일반 C# 참조 타입과 완전히 동일하다고 가정하지 않는 것이 중요합니다.

### 자주 보는 공통 멤버

- `name`
- `hideFlags`
- `GetInstanceID()`
- `Destroy`
- `Instantiate`
- `FindObjectsByType` 계열의 전역 탐색 API

[Unity 공식 문서: Object](https://docs.unity3d.com/ScriptReference/Object.html)

---

## `GameObject`

`GameObject`는 **씬에 존재하는 오브젝트의 기본 컨테이너**입니다. 캐릭터, 총알, 카메라, 조명, 빈 오브젝트 등 대부분의 씬 요소는 GameObject를 중심으로 구성됩니다.

GameObject 자체가 모든 기능을 직접 구현하는 것이 아니라, **여러 Component를 담아서 기능을 조합**합니다.

```text
Player (GameObject)
├─ Transform
├─ CharacterController
├─ Animator
├─ AudioSource
└─ PlayerController (MonoBehaviour)
```

### 생성

```csharp
GameObject obj = new GameObject("Enemy");
```

### 컴포넌트 추가

```csharp
Rigidbody body = obj.AddComponent<Rigidbody>();
```

### 활성 상태

```csharp
obj.SetActive(false);
```

`activeSelf`와 `activeInHierarchy`는 의미가 다릅니다.

- `activeSelf`: 이 GameObject 자체에 설정된 활성 플래그
- `activeInHierarchy`: 부모 상태까지 고려했을 때 실제 Hierarchy에서 활성인지

부모가 비활성이라면 자식의 `activeSelf`가 true여도 `activeInHierarchy`는 false일 수 있습니다.

### Tag와 Layer

```csharp
if (obj.CompareTag("Enemy"))
{
    ...
}

int layer = obj.layer;
```

문자열 tag 비교는 가능한 경우 `obj.tag == "Enemy"`보다 `CompareTag`를 쓰는 습관을 많이 권장합니다.

[Unity 공식 문서: GameObject](https://docs.unity3d.com/ScriptReference/GameObject.html)

---

## `Component`

`Component`는 **GameObject에 부착되는 모든 기능 컴포넌트의 공통 기반 클래스**입니다.

`Transform`, `Renderer`, `Collider`, `Rigidbody`, `Camera`, `AudioSource`, `Animator`, 여러분이 만든 MonoBehaviour 스크립트가 모두 Component 계열입니다.

### Component는 항상 GameObject와 연결된다

```csharp
Component component = ...;
GameObject owner = component.gameObject;
Transform ownerTransform = component.transform;
```

`Component.gameObject`는 이 컴포넌트가 붙어 있는 GameObject를 가리키고, `Component.transform`은 그 GameObject의 Transform에 빠르게 접근하는 프로퍼티입니다.

### `GetComponent<T>()`

같은 GameObject에 붙은 특정 컴포넌트를 찾습니다.

```csharp
Rigidbody body = GetComponent<Rigidbody>();
```

없으면 null을 반환할 수 있습니다.

```csharp
if (TryGetComponent(out Rigidbody body))
{
    body.AddForce(Vector3.up, ForceMode.Impulse);
}
```

### 자식/부모에서 찾기

```csharp
Renderer renderer = GetComponentInChildren<Renderer>();
PlayerRoot root = GetComponentInParent<PlayerRoot>();
```

이런 탐색 함수는 매우 편리하지만, 매 프레임 무작정 반복 호출하기보다 자주 쓰는 참조는 초기화 시 캐시하는 구조를 고려할 수 있습니다.

[Unity 공식 문서: Component](https://docs.unity3d.com/ScriptReference/Component.html)

---

## `Behaviour`

`Behaviour`는 `Component`를 상속하면서 **활성/비활성(`enabled`) 상태를 가진 컴포넌트**의 기반 클래스입니다.

```csharp
Behaviour behaviour = ...;
behaviour.enabled = false;
```

대표적으로 `MonoBehaviour`, `Camera`, `Light`, `Collider2D` 등 여러 타입이 Behaviour 계열입니다.

### `enabled`와 `GameObject.SetActive` 차이

```csharp
myBehaviour.enabled = false;
```

은 **특정 Behaviour 컴포넌트만 비활성화**합니다.

```csharp
gameObject.SetActive(false);
```

는 GameObject 자체를 비활성화하여 그 아래 여러 컴포넌트와 자식 오브젝트의 활성 상태에 영향을 줍니다.

### `isActiveAndEnabled`

컴포넌트의 `enabled`와 GameObject의 실제 활성 상태를 함께 고려한 결과입니다.

```csharp
if (myBehaviour.isActiveAndEnabled)
{
    ...
}
```

---

## `MonoBehaviour`

`MonoBehaviour`는 Unity에서 **일반적인 사용자 스크립트 컴포넌트를 만드는 기반 클래스**입니다.

```csharp
public class PlayerController : MonoBehaviour
{
}
```

이 클래스를 C#에서 그냥 `new PlayerController()`로 생성하는 것이 아니라, GameObject에 컴포넌트로 붙이거나 `AddComponent<PlayerController>()`로 생성합니다.

### Unity 메시지/이벤트 함수

MonoBehaviour에서는 Unity가 특정 시점에 호출하는 여러 메시지 메서드를 작성할 수 있습니다.

```csharp
void Awake() { }
void OnEnable() { }
void Start() { }
void Update() { }
void FixedUpdate() { }
void LateUpdate() { }
void OnDisable() { }
void OnDestroy() { }
```

이 메서드는 일반 인터페이스 구현과는 다른 Unity의 이벤트 함수 호출 규칙을 따릅니다.

### 역할

MonoBehaviour는 다음처럼 “씬에 있는 특정 오브젝트의 동작”을 구현하는 데 자연스럽습니다.

- 플레이어 이동
- 적 AI 컴포넌트
- 상호작용 오브젝트
- 카메라 제어
- 충돌 콜백
- 코루틴 실행
- Unity 이벤트 함수 수신

### 직렬화 필드

```csharp
public class PlayerController : MonoBehaviour
{
    [SerializeField] private float speed = 5f;
    [SerializeField] private Rigidbody body;
}
```

`[SerializeField]`는 private 필드를 Unity 직렬화 대상으로 만들 수 있습니다. 접근 제한자와 직렬화 여부는 별개의 개념입니다.

### `new`로 만들지 않기

```csharp
// PlayerController controller = new PlayerController(); // 일반적인 사용 방식 아님
```

MonoBehaviour는 Unity 컴포넌트 생명주기에 속하므로 GameObject에 붙여 생성합니다.

```csharp
PlayerController controller = gameObject.AddComponent<PlayerController>();
```

[Unity 공식 문서: MonoBehaviour](https://docs.unity3d.com/ScriptReference/MonoBehaviour.html)

---

## `ScriptableObject`

`ScriptableObject`는 **GameObject에 붙지 않는 UnityEngine.Object 기반 데이터 객체**를 만들 때 사용하는 타입입니다.

```csharp
[CreateAssetMenu(menuName = "Game/Weapon Data")]
public class WeaponData : ScriptableObject
{
    public string displayName;
    public int damage;
    public Sprite icon;
}
```

프로젝트 에셋으로 생성해 여러 오브젝트가 같은 데이터를 참조할 수 있습니다.

### MonoBehaviour와 가장 큰 차이

| 항목 | `MonoBehaviour` | `ScriptableObject` |
|---|---|---|
| GameObject에 부착 | O | X |
| Transform 보유 | GameObject를 통해 O | X |
| Update 등 씬 동작 구현 | 자연스러움 | 일반적인 주 목적 아님 |
| 에셋 데이터 저장 | 가능하지만 컴포넌트에 종속 | 매우 자연스러움 |
| 여러 오브젝트가 하나의 데이터 공유 | 참조 가능 | 특히 적합 |

### 자주 쓰는 예

- 아이템 데이터
- 스킬 설정
- 적 스탯 템플릿
- 무기 설정
- 게임 설정
- 데이터 기반 디자인

```csharp
public class Weapon : MonoBehaviour
{
    [SerializeField] private WeaponData data;

    public void Attack()
    {
        Debug.Log($"{data.displayName}: {data.damage}");
    }
}
```

### 런타임 인스턴스

ScriptableObject도 런타임에 생성할 수 있습니다.

```csharp
WeaponData runtimeData = ScriptableObject.CreateInstance<WeaponData>();
```

하지만 에셋과 런타임 인스턴스의 저장/지속성은 다르므로, “실행 중 값을 바꾸면 프로젝트 에셋에 영구 저장되는가?” 같은 부분은 Editor/런타임 문맥을 구분해야 합니다.

[Unity 공식 문서: ScriptableObject](https://docs.unity3d.com/ScriptReference/ScriptableObject.html)

---

## `Transform`

`Transform`은 **GameObject의 위치, 회전, 스케일, 부모-자식 계층 관계를 담당하는 Component**입니다. 모든 GameObject는 Transform을 가집니다.

```csharp
Transform t = transform;
```

### 월드 공간과 로컬 공간

```csharp
Vector3 worldPosition = transform.position;
Vector3 localPosition = transform.localPosition;

Quaternion worldRotation = transform.rotation;
Quaternion localRotation = transform.localRotation;
```

- `position`, `rotation`: 월드 기준
- `localPosition`, `localRotation`: 부모 Transform 기준

부모가 없을 때는 로컬/월드가 비슷해 보일 수 있지만, 계층 구조가 생기면 의미 차이가 중요해집니다.

### 방향 벡터

```csharp
Vector3 forward = transform.forward;
Vector3 right = transform.right;
Vector3 up = transform.up;
```

이 값들은 Transform의 현재 회전을 반영한 월드 공간 방향입니다.

### 부모-자식 관계

```csharp
transform.SetParent(parentTransform);
```

또는:

```csharp
Transform parent = transform.parent;
int childCount = transform.childCount;
Transform child = transform.GetChild(0);
```

### 좌표 변환

```csharp
Vector3 worldPoint = transform.TransformPoint(localPoint);
Vector3 localPoint2 = transform.InverseTransformPoint(worldPoint);

Vector3 worldDirection = transform.TransformDirection(localDirection);
```

Point와 Direction의 변환 의미가 다르므로 적절한 함수를 구분해서 사용해야 합니다.

### `Transform`과 `GameObject`

`transform`은 GameObject가 아닙니다. Transform도 하나의 Component입니다.

```csharp
GameObject obj = transform.gameObject;
Transform t = gameObject.transform;
```

[Unity 공식 문서: Transform](https://docs.unity3d.com/ScriptReference/Transform.html)

---

## `RectTransform`

`RectTransform`은 `Transform`을 상속하며, **사각형 기반 UI 레이아웃에 필요한 크기, 앵커, 피벗 정보를 추가한 타입**입니다.

일반 Transform의 위치/회전/스케일뿐 아니라 다음 개념이 추가됩니다.

- `anchorMin`, `anchorMax`
- `anchoredPosition`
- `sizeDelta`
- `pivot`
- `rect`
- offset 관련 값

```csharp
RectTransform rectTransform = GetComponent<RectTransform>();
rectTransform.anchoredPosition = new Vector2(100f, -50f);
```

### 왜 `position`만 쓰지 않는가?

UI 레이아웃은 부모 RectTransform의 크기가 바뀌는 상황을 고려해야 합니다. 앵커를 사용하면 해상도나 부모 크기 변화에 따라 상대적인 배치를 표현할 수 있습니다.

### `rect`

```csharp
Rect localRect = rectTransform.rect;
```

현재 RectTransform이 로컬 공간에서 차지하는 계산된 사각 영역을 읽을 수 있습니다.

[Unity 공식 문서: RectTransform](https://docs.unity3d.com/ScriptReference/RectTransform.html)

---

## `MissingReferenceException`

`MissingReferenceException`은 Unity 오브젝트 참조가 **이미 파괴된 UnityEngine.Object를 가리키는 상황** 등에서 접할 수 있는 예외 타입입니다.

예를 들어 참조를 저장한 뒤 대상이 Destroy되었는데, 이후 해당 참조를 통해 Unity 엔진 멤버에 접근하면 문제가 생길 수 있습니다.

```csharp
private GameObject target;

void SomeMethod()
{
    if (target == null)
        return;

    target.SetActive(false);
}
```

UnityEngine.Object의 특별한 null 동작 때문에 이런 코드에서는 일반 C# 참조와 동일한 감각만으로 판단하기보다 Unity 오브젝트 생명주기를 이해하는 것이 중요합니다.

---

# `GameObject`와 `Component`를 언제 변수로 받나?

둘은 서로 다른 정보 수준을 표현합니다.

```csharp
GameObject target;
```

은 “씬 오브젝트 자체”가 중요하다는 뜻에 가깝습니다.

```csharp
Rigidbody targetBody;
```

는 “그 오브젝트의 물리 바디 기능”이 중요하다는 뜻입니다.

```csharp
Health targetHealth;
```

는 “체력 기능”이 필요하다는 뜻입니다.

가능하면 메서드가 실제로 필요한 **가장 구체적인 기능 타입**을 받으면 의도가 선명해집니다.

```csharp
void Heal(Health target, int amount)
{
    target.Restore(amount);
}
```

GameObject를 받아 내부에서 매번 GetComponent를 수행하는 것보다 호출 계약이 더 명확할 수 있습니다.

---

# 컴포지션이 Unity의 기본 설계 방식인 이유

Unity의 GameObject 구조는 상속 하나로 모든 기능을 만드는 것보다 여러 Component를 조합하는 방식에 가깝습니다.

```text
Enemy GameObject
├─ EnemyController
├─ Health
├─ Animator
├─ Nav 관련 컴포넌트
├─ Collider
└─ AudioSource
```

각 컴포넌트가 하나의 책임을 맡도록 나누면 참조 관계와 재사용성이 더 명확해질 수 있습니다.

물론 모든 스크립트를 무조건 작게 쪼개는 것이 정답은 아닙니다. 핵심은 **GameObject는 컨테이너이고, 실제 동작은 Component들이 제공한다**는 Unity의 기본 모델을 이해하는 것입니다.

---

# 자주 헷갈리는 조합

| 조합 | 구분 |
|---|---|
| `System.Object` vs `UnityEngine.Object` | C# 전체 타입 기반 vs Unity 엔진 객체 기반 |
| `GameObject` vs `Component` | 기능을 담는 씬 컨테이너 vs 그 컨테이너에 붙는 기능 |
| `GameObject` vs `Transform` | 씬 오브젝트 자체 vs 위치/회전/계층 컴포넌트 |
| `Component` vs `Behaviour` | 모든 부착 기능 기반 vs enabled 상태를 가진 Component 계열 |
| `MonoBehaviour` vs `ScriptableObject` | GameObject에 붙는 동작 vs 독립적인 Unity 데이터 객체 |
| `Transform` vs `RectTransform` | 일반 3D 변환/계층 vs 사각형 UI 레이아웃 확장 |
| C# `null` vs Unity destroyed object | UnityEngine.Object는 특별한 null 비교 동작이 있음 |

## 추천 학습 순서

1. `GameObject`
2. `Component`
3. `Transform`
4. `Behaviour`
5. `MonoBehaviour`
6. `ScriptableObject`
7. `UnityEngine.Object`의 생명주기와 null 동작
8. `RectTransform`

이 순서를 이해하면 이후 Renderer, Collider, Rigidbody, Animator처럼 수많은 Unity 타입이 “어디에 속하는지”를 빠르게 파악할 수 있습니다.
