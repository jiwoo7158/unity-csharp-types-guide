---
layout: default
title: 타입 시스템 이해
eyebrow: Foundation
---
# C# 타입 시스템을 Unity 관점에서 보기

Unity의 변수 타입을 정리하려면 먼저 “타입” 자체를 몇 가지 축으로 나누어 보는 편이 좋습니다.

## 값 타입 vs 참조 타입

| 구분 | 값 타입 | 참조 타입 |
|---|---|---|
| 대표 | `int`, `float`, `bool`, `enum`, `Vector3`, `Quaternion`, 사용자 `struct` | `string`, 배열, `List<T>`, `GameObject`, `Transform`, `MonoBehaviour`, 사용자 `class` |
| 변수에 들어가는 것 | 값 자체 | 객체를 가리키는 참조 |
| 대입 | 보통 값이 복사됨 | 같은 객체를 가리키는 참조가 복사됨 |
| `null` | 일반 값 타입은 불가. `T?`는 가능 | 가능 |
| Unity 예시 | 위치를 `Vector3`로 전달 | `Transform` 컴포넌트를 참조 |

```csharp
Vector3 a = new Vector3(1, 2, 3);
Vector3 b = a;
b.x = 99;
// a.x는 1: Vector3 값이 복사됨

GameObject x = player;
GameObject y = x;
y.name = "Renamed";
// x와 y가 같은 GameObject를 가리키면 이름 변경도 같은 객체에 반영
```

<div class="callout warn"><div class="callout-title">UnityEngine.Object는 C#의 일반 참조 타입과 한 가지 중요한 차이가 있음</div>
Unity 오브젝트는 엔진 쪽 네이티브 객체와 연결되어 있어, 파괴된 객체를 C# 참조가 잠시 들고 있어도 Unity의 <code>== null</code> 비교가 특별하게 동작할 수 있습니다. 일반 C# 객체와 완전히 같은 null 규칙이라고 가정하면 안 됩니다.</div>

## class

`class`는 참조 타입을 정의합니다. Unity에서 가장 자주 보는 객체 계층도 대부분 class입니다.

```csharp
public class PlayerData
{
    public string name;
    public int level;
}
```

`MonoBehaviour`, `ScriptableObject`, `GameObject`, `Transform`, `Rigidbody` 모두 class입니다.

## struct

`struct`는 값 타입을 정의합니다. 작고 독립적인 데이터 묶음을 표현할 때 자주 사용합니다.

```csharp
public struct DamageInfo
{
    public int amount;
    public Vector3 hitPoint;
}
```

Unity의 `Vector2`, `Vector3`, `Quaternion`, `Color`, `Rect`, `Bounds`, `RaycastHit`, `Scene` 등이 대표적인 struct입니다.

## enum

`enum`은 정해진 선택지 중 하나를 표현하는 값 타입입니다.

```csharp
public enum Team
{
    Player,
    Enemy,
    Neutral
}
```

Unity 예: `KeyCode`, `ForceMode`, `Space`, `PrimitiveType`, `LoadSceneMode`, `CollisionDetectionMode`.

## interface

`interface`는 “이 기능/형태를 제공한다”는 **계약**을 나타냅니다. 직접 인스턴스를 만드는 타입이 아니라, 여러 구현을 같은 관점으로 다루는 타입입니다.

```csharp
IReadOnlyList<Enemy> enemies;
IEnumerable<Item> items;
```

`IReadOnlyList<T>`라고 선언하면 호출자는 “인덱스로 읽을 수 있고 개수를 알 수 있다”는 기능에 의존하면서, 실제 구현이 `List<T>`인지 배열인지에 덜 묶이게 됩니다.

## abstract class

직접 완성된 객체로 쓰기보다 파생 클래스의 공통 기반을 제공하는 class입니다. Unity의 `Collider`, `Renderer`, `YieldInstruction` 등에서도 이런 계층 구조를 자주 봅니다.

## generic: `<T>`

타입을 매개변수처럼 받는 문법입니다.

```csharp
List<int> scores;
List<GameObject> targets;
Dictionary<string, int> itemCounts;
IReadOnlyList<Transform> spawnPoints;
```

여기서 `T`, `TKey`, `TValue`는 “나중에 실제 타입으로 채워질 자리”입니다.

## nullable: `T?`

값 타입에 “값 없음” 상태를 추가합니다.

```csharp
int? optionalScore = null;
Vector3? lastHitPoint = null;
```

일반 Unity Inspector 직렬화에서는 nullable을 그대로 노출하는 방식이 기본적이지 않으므로, Inspector 데이터 설계와 런타임 코드의 타입 설계를 구분해야 합니다.

## delegate / Action / Func

메서드 자체를 값처럼 보관하고 전달하기 위한 타입입니다.

```csharp
Action onDead;
Action<int> onDamaged;
Func<int, bool> canUseItem;
```

이벤트, 콜백, 조건 전달에서 자주 사용합니다.



## 타입처럼 보이지만 “타입”이 아닌 C# 문법

Unity 코드를 읽다 보면 타입 옆에 붙어서 헷갈리는 키워드가 많습니다.

| 문법 | 타입인가? | 의미 |
|---|---:|---|
| `var` | X | 컴파일러가 오른쪽 식으로 **정적 타입을 추론**하게 하는 지역 변수 문법 |
| `const` | X | 컴파일 타임 상수 선언 |
| `readonly` | X | 필드 재대입 제한 또는 readonly struct 관련 한정자 |
| `static` | X | 인스턴스가 아니라 타입 자체에 속함 |
| `ref` | X | 값을 복사하지 않고 참조 형태로 전달/반환 |
| `out` | X | 메서드가 호출자 변수에 결과를 써주는 출력 매개변수 |
| `in` | X | 참조로 전달하되 메서드에서 재할당하지 않는 입력 매개변수 |
| `params` | X | 가변 개수 인자를 배열로 받는 매개변수 문법 |
| `new()` | X | 대상 타입이 이미 문맥에 있을 때 타입명을 생략한 생성식 |
| `?` | 단독 타입 X | nullable 값 타입 또는 nullable reference annotation 문맥에 사용 |

```csharp
var position = transform.position; // 실제 정적 타입은 Vector3

bool TryFind(int id, out Enemy enemy)
{
    // out은 Enemy라는 타입을 바꾸는 것이 아니라 전달 방식을 지정
}
```

`var`는 JavaScript 같은 “동적 변수”가 아닙니다. 컴파일 시점에 구체 타입이 정해집니다.


## 필드 / 프로퍼티 / 지역 변수의 타입은 같은 문법을 사용한다

```csharp
[SerializeField] private int hp;        // 필드
public int Hp => hp;                    // 프로퍼티 반환 타입
void Heal(int amount) {                 // 매개변수 타입
    float ratio = 0.5f;                 // 지역 변수
}
```

“타입”과 “Inspector에 보이느냐”는 별개 문제입니다. Inspector 표시는 Unity 직렬화 규칙이 추가로 결정합니다.
