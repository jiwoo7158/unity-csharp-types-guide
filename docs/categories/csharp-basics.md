---
layout: default
title: C# 기본 타입
eyebrow: C# / .NET
---
# C# 기본 타입

Unity 스크립트는 C#으로 작성되므로 Unity 타입을 이해하기 전에 C#/.NET의 기본 타입을 익혀 두면 좋습니다. `int`, `float`, `string`은 Unity가 만든 별도 문법이 아니라 C#의 타입이며, 대부분은 `System` 네임스페이스의 실제 .NET 타입에 대한 별칭입니다.

```csharp
int hp = 100;          // System.Int32
float speed = 5f;      // System.Single
bool isAlive = true;   // System.Boolean
string name = "Player"; // System.String
```

이 페이지는 단순히 범위를 외우기보다 **값 타입/참조 타입 차이, 숫자 타입 선택, null, enum, tuple, 날짜/시간, 예외와 취소 토큰**이 실제 Unity 코드에서 어떤 의미를 갖는지에 초점을 둡니다.

## 한눈에 보기

| 표기 | 실제 .NET 타입 | 종류 | 대표 용도 | Unity 기본 직렬화 |
|---|---|---|---|---|
| `bool` | `System.Boolean` | 값 | 상태 플래그 | O |
| `byte` | `System.Byte` | 값 | 바이트/픽셀/외부 데이터 | O |
| `sbyte` | `System.SByte` | 값 | 작은 부호 정수 | O |
| `short` | `System.Int16` | 값 | 16비트 정수 포맷 | O |
| `ushort` | `System.UInt16` | 값 | 16비트 양수 포맷 | O |
| `int` | `System.Int32` | 값 | 개수, 체력, 인덱스 | O |
| `uint` | `System.UInt32` | 값 | 비트/외부 API | O |
| `long` | `System.Int64` | 값 | 큰 카운터/틱 | O |
| `ulong` | `System.UInt64` | 값 | 큰 비트값/ID | O |
| `float` | `System.Single` | 값 | Unity의 일반 실수 계산 | O |
| `double` | `System.Double` | 값 | 더 넓은 범위/정밀도 | O |
| `decimal` | `System.Decimal` | 값 | 10진 정밀 계산 | 기본 Inspector X |
| `char` | `System.Char` | 값 | UTF-16 코드 단위 하나 | 제한적 |
| `string` | `System.String` | 참조 | 문자열 | O |
| `object` | `System.Object` | 참조 | 모든 C# 타입의 공통 기반 | 기본 직렬화 X |
| `dynamic` | 런타임 바인딩 | 동적 | 타입 검사를 런타임으로 미룸 | X |
| `enum` | `System.Enum` 기반 | 값 | 명명된 선택지 | 일반적으로 O |
| `T?` | `Nullable<T>` | 값 | 값 타입의 선택적 값 | 기본 Inspector X |
| `(T1, T2)` | `ValueTuple<...>` | 값 | 가벼운 다중 반환 | 기본 Inspector X |
| `Tuple<T...>` | `System.Tuple<...>` | 참조 | 레거시 튜플 | X |
| `DateTime` | `System.DateTime` | 값 | 날짜/시각 | 기본 Inspector X |
| `TimeSpan` | `System.TimeSpan` | 값 | 시간 간격 | 기본 Inspector X |
| `Guid` | `System.Guid` | 값 | 고유 식별자 | 기본 Inspector X |
| `Type` | `System.Type` | 참조 | 런타임 타입 정보 | X |
| `Exception` | `System.Exception` | 참조 | 예외 정보 | X |
| `CancellationToken` | `System.Threading.CancellationToken` | 값 | 비동기 취소 신호 | X |

---

# 값 타입과 참조 타입부터 이해하기

## 값 타입

`int`, `float`, `bool`, 대부분의 `struct`, `enum`은 값 타입입니다. 변수에 다른 변수의 값을 대입하면 일반적으로 **값 자체가 복사**됩니다.

```csharp
int a = 10;
int b = a;
b = 20;

Debug.Log(a); // 10
Debug.Log(b); // 20
```

Unity의 `Vector3`, `Quaternion`, `Color`, `Bounds`도 struct이므로 같은 기본 원리가 적용됩니다.

```csharp
Vector3 a = transform.position;
Vector3 b = a;
b.x = 100f;

// a.x가 같이 바뀌는 것은 아님
```

## 참조 타입

`class`, 배열, `string`, 대부분의 UnityEngine.Object 계열은 참조 타입입니다. 변수는 객체 자체가 아니라 객체를 가리키는 참조를 보관합니다.

```csharp
Enemy a = enemy;
Enemy b = a;

b.TakeDamage(10);
// a와 b가 같은 Enemy 객체를 가리키고 있다면 같은 객체의 상태가 바뀜
```

단, `string`은 참조 타입이면서 **불변(immutable)** 이라는 별도 특성이 있습니다.

[타입 시스템 더 자세히 보기]({{ '/type-system/' | relative_url }})

---

# 논리 타입

## `bool`

`bool`은 `true` 또는 `false` 두 상태를 표현합니다. 게임 코드에서는 매우 자주 보이며, “지금 가능한가?”, “활성화되어 있는가?”, “조건을 만족하는가?” 같은 상태를 나타냅니다.

```csharp
[SerializeField] private bool invincible;

if (invincible)
{
    return;
}
```

### 좋은 이름이 중요하다

```csharp
bool state;      // 의미가 약함
bool isGrounded; // 무엇을 뜻하는지 명확함
bool canAttack;
bool hasKey;
```

`is`, `has`, `can`, `should` 같은 접두어는 bool의 의미를 읽기 쉽게 만들 수 있습니다.

---

# 정수 타입

## `byte`, `sbyte`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`

C#에는 크기와 부호가 다른 여러 정수 타입이 있습니다. 게임플레이 로직에서는 대부분 `int`를 기본 선택으로 삼고, **데이터 포맷이나 API가 특정 비트 수를 요구할 때** 다른 타입을 사용하는 경우가 많습니다.

| 타입 | 비트 | 대략적 성격 |
|---|---:|---|
| `byte` | 8 | 0~255 |
| `sbyte` | 8 | 부호 있음 |
| `short` | 16 | 작은 부호 정수 |
| `ushort` | 16 | 작은 양수 정수 |
| `int` | 32 | 일반적인 정수 기본값 |
| `uint` | 32 | 32비트 부호 없음 |
| `long` | 64 | 매우 큰 정수 |
| `ulong` | 64 | 매우 큰 부호 없음 |

### `int`를 기본으로 보는 이유

```csharp
int hp = 100;
int ammo = 30;
int level = 5;
int enemyCount = enemies.Count;
```

배열/리스트 인덱스, `Count`, 많은 Unity/.NET API가 `int`와 잘 맞습니다. “음수가 필요 없으니 무조건 uint”라는 선택은 다른 API와 계산할 때 형 변환을 늘릴 수 있으므로 실제 이점이 있는지 보고 결정하는 편이 좋습니다.

### `byte`가 자연스러운 경우

```csharp
byte r = 255;
byte g = 128;
byte b = 0;
```

픽셀, 네트워크 패킷, 바이너리 파일, `Color32`의 RGBA 채널처럼 0~255 범위가 의미 자체와 일치할 때 좋습니다.

### 오버플로 생각하기

정수 타입에는 최대/최소 범위가 있습니다. 범위를 넘어서는 산술은 컨텍스트에 따라 오버플로가 발생할 수 있습니다. 매우 큰 누적 카운터나 타임스탬프를 다룬다면 `long`이 더 적합할 수 있습니다.

---

# 실수 타입

## `float`

`float`는 Unity 게임플레이에서 가장 흔한 실수 타입입니다. Unity의 `Vector3`, `Quaternion`, `Mathf`, 물리 설정 등 많은 API가 float를 중심으로 설계되어 있습니다.

```csharp
float moveSpeed = 5.5f;
float cooldown = 0.25f;
float healthRatio = currentHp / (float)maxHp;
```

리터럴 뒤의 `f`는 해당 숫자를 float로 취급하라는 뜻입니다.

```csharp
float value = 1.5f;
```

### 부동소수점 비교

실수 연산에서는 오차가 발생할 수 있으므로 계산 결과를 무조건 `==`로 비교하는 것이 적절하지 않은 경우가 있습니다.

```csharp
if (Mathf.Abs(a - b) < 0.001f)
{
    // 충분히 가깝다고 판단
}
```

Unity에는 상황에 따라 `Mathf.Approximately`도 사용할 수 있습니다.

---

## `double`

`double`은 64비트 부동소수 타입으로 float보다 더 넓은 정밀도와 범위를 제공합니다.

```csharp
double elapsed = 123456.7890123;
```

하지만 Unity의 많은 수학/렌더링/물리 API가 float 기반이므로, “double이 더 정밀하니 항상 더 좋다”라고 생각할 필요는 없습니다. 긴 시간 누적, 지리 좌표, 큰 수치 계산처럼 **실제로 정밀도가 필요한 부분을 double로 유지하고 Unity API 경계에서 float로 변환**하는 설계도 가능합니다.

---

## `decimal`

`decimal`은 10진수 계산에서 정밀도를 중요하게 다루는 타입입니다. 금융 계산처럼 0.1, 0.01 같은 10진 표현이 중요한 일반 C# 영역에 적합합니다.

게임 내 재화가 단순 정수라면 보통 `int`/`long`이 더 자연스럽고, Unity 수학 API와도 직접 연결되지 않습니다. 또한 Unity 기본 Inspector 직렬화 대상이 아니라는 점도 고려해야 합니다.

---

# 문자와 문자열

## `char`

`char`는 하나의 UTF-16 코드 단위를 나타냅니다.

```csharp
char grade = 'A';
```

한 글자처럼 보이는 모든 유니코드 문자가 항상 char 하나로 표현되는 것은 아닙니다. 일반적인 게임 텍스트 처리에서는 `string`을 훨씬 자주 사용합니다.

---

## `string`

`string`은 문자열을 나타내는 참조 타입입니다. Unity에서 이름, 설명, 경로, UI 텍스트, JSON 일부 등 매우 넓게 사용됩니다.

```csharp
string playerName = "Jiwoo";
string message = $"Hello, {playerName}";
```

### 불변 타입

문자열 내용은 생성 후 직접 바뀌지 않습니다.

```csharp
string a = "Player";
a += "_01";
```

겉으로는 문자열이 수정된 것처럼 보이지만 실제로는 새 문자열 결과를 만들어 `a`가 새 문자열을 가리키게 됩니다.

### 반복 연결이 매우 많다면

루프에서 매우 많은 문자열을 이어 붙이는 상황에서는 `StringBuilder`가 더 적합할 수 있습니다. 하지만 일반적인 UI 문구 몇 개를 만드는 수준에서 무조건 StringBuilder를 사용할 필요는 없습니다.

---

# `object`

`object`는 C# 타입 시스템에서 모든 타입의 공통 기반으로 볼 수 있는 타입입니다. 값 타입도 object 변수에 들어갈 수 있지만 그 과정에서 boxing이 일어날 수 있습니다.

```csharp
object value = 10;
object another = "hello";
```

### 장점

- 서로 다른 타입을 하나의 공통 타입으로 다룰 수 있음
- 리플렉션, 범용 프레임워크 코드에서 필요할 수 있음

### 단점

실제 타입 정보가 약해집니다.

```csharp
object value = 10;

if (value is int number)
{
    Debug.Log(number + 1);
}
```

게임플레이 데이터 구조에서 `object`를 남용하기보다는 제네릭이나 명확한 공통 기반 타입을 사용하는 편이 읽기 쉽고 안전한 경우가 많습니다.

---

# `dynamic`

`dynamic`은 컴파일러가 멤버 접근에 대한 타입 검사를 상당 부분 런타임으로 미루도록 합니다.

```csharp
dynamic value = GetSomething();
value.DoSomething(); // 컴파일 시점에 실제 멤버 존재 여부를 엄격히 검사하지 않음
```

유연하지만 오타나 잘못된 멤버 호출이 런타임 오류로 늦게 나타날 수 있습니다. 일반 Unity 게임 코드에서는 명시적인 타입, 인터페이스, 제네릭으로 해결되는 경우가 많아 자주 필요한 타입은 아닙니다.

---

# `enum`

`enum`은 의미 있는 이름을 가진 선택지 집합을 정의합니다.

```csharp
public enum WeaponType
{
    Sword,
    Bow,
    Staff
}

[SerializeField] private WeaponType weaponType;
```

### 숫자 대신 enum을 쓰는 이유

```csharp
int mode = 2; // 2가 무엇인지 알아야 함
```

보다:

```csharp
WeaponType type = WeaponType.Staff;
```

이 훨씬 읽기 쉽습니다.

### 상태 머신에도 자주 사용

```csharp
public enum EnemyState
{
    Idle,
    Chase,
    Attack,
    Dead
}
```

다만 상태가 복잡해지면 enum 하나와 거대한 switch보다 상태 패턴이나 별도 상태 객체가 더 적합할 수 있습니다.

### Flags enum

여러 옵션을 비트 조합으로 동시에 표현할 때 `[Flags]` enum을 볼 수 있습니다. Unity의 LayerMask 개념도 비트마스크 이해와 연결됩니다.

---

# Nullable 값 타입 `T?`

값 타입은 기본적으로 null이 될 수 없습니다.

```csharp
int count = 10;
// count = null; // 불가
```

`int?`는 `Nullable<int>`의 간단한 표기입니다.

```csharp
int? targetId = null;

if (targetId.HasValue)
{
    Debug.Log(targetId.Value);
}
```

또는:

```csharp
if (targetId is int id)
{
    Debug.Log(id);
}
```

“값이 실제로 0인 것”과 “아직 값이 없음”을 구분해야 할 때 유용합니다. Unity 기본 Inspector에서 nullable 값 타입을 일반 필드처럼 바로 다루는 것은 제한적입니다.

---

# 튜플

## `ValueTuple`

현대 C#에서 `(int, string)` 같은 문법으로 자주 보는 튜플은 `ValueTuple` 계열입니다. 짧은 범위에서 여러 값을 묶어 반환할 때 편리합니다.

```csharp
(int min, int max) GetDamageRange()
{
    return (10, 20);
}

var range = GetDamageRange();
Debug.Log(range.min);
```

구조 분해도 가능합니다.

```csharp
(int min, int max) = GetDamageRange();
```

### 언제 class/struct가 더 좋은가?

의미가 오래 유지되는 데이터라면 이름 있는 타입이 더 명확할 수 있습니다.

```csharp
public struct DamageRange
{
    public int Min;
    public int Max;
}
```

튜플은 임시적인 묶음과 메서드 내부 경계에 특히 편합니다.

---

## `Tuple<T...>`

`System.Tuple`은 ValueTuple보다 오래된 참조 타입 기반 튜플입니다.

```csharp
Tuple<int, string> pair = Tuple.Create(1, "Sword");
```

현대 C#에서는 일반적으로 ValueTuple 문법이 더 읽기 쉽지만, 기존 라이브러리 코드에서 만날 수 있습니다.

---

# 날짜와 시간

## `DateTime`

`DateTime`은 날짜와 시각을 표현합니다.

```csharp
DateTime savedAt = DateTime.UtcNow;
```

게임 세이브 메타데이터, 서버 통신 시각, 로그, 툴링 같은 곳에서 사용할 수 있습니다.

### 게임 플레이 시간과는 구분하기

`Time.time`, `Time.deltaTime`은 Unity의 프레임/게임 시간 흐름과 관련된 API입니다. `DateTime`은 달력/실제 시각 개념과 더 가깝습니다. 쿨다운을 무조건 DateTime으로 만들거나, 실제 날짜를 Time.time으로 저장하는 식으로 서로 섞지 않는 것이 좋습니다.

---

## `TimeSpan`

`TimeSpan`은 두 시각 사이의 **시간 간격**을 표현합니다.

```csharp
TimeSpan duration = TimeSpan.FromMinutes(5);
Debug.Log(duration.TotalSeconds);
```

실시간 기반 대기 시간, 서버에서 받은 기간 값, 툴링 코드 등에서 유용합니다. Unity의 프레임 기반 `float seconds`와 어느 쪽이 더 자연스러운지는 시스템 성격에 따라 다릅니다.

---

# `Guid`

`Guid`는 128비트 식별자입니다.

```csharp
Guid id = Guid.NewGuid();
string text = id.ToString();
```

런타임 생성 데이터, 툴, 세이브 엔트리 등에서 “충돌 가능성이 매우 낮은 고유 ID”가 필요할 때 사용할 수 있습니다.

Unity 에셋 데이터베이스에서 말하는 Asset GUID와 `System.Guid` 값은 개념적으로 고유 식별자라는 점은 비슷하지만, Unity가 에셋 메타데이터를 관리하는 방식과 일반 C# `Guid.NewGuid()`를 임의로 생성하는 것은 별개의 시스템입니다.

---

# `Type`

`System.Type`은 “객체의 런타임 타입 자체에 대한 정보”를 나타냅니다.

```csharp
Type type = typeof(Enemy);
Debug.Log(type.Name);

Type runtimeType = enemy.GetType();
```

리플렉션, 커스텀 에디터 툴, 팩토리, 타입 등록 시스템에서 볼 수 있습니다. 일반 게임플레이 로직에서는 제네릭과 인터페이스가 더 단순한 해결책인 경우가 많습니다.

---

# `Exception`

`Exception`은 예외 정보를 나타내는 참조 타입입니다.

```csharp
try
{
    LoadData();
}
catch (Exception ex)
{
    Debug.LogException(ex);
}
```

예외는 보통 “정상적인 게임 분기”를 표현하는 값이 아니라, 호출 계약을 수행할 수 없는 오류 상황을 전달하는 메커니즘입니다.

### 예외를 흐름 제어로 남용하지 않기

```csharp
// 키가 없을 수 있는 정상적인 상황이라면
if (dictionary.TryGetValue(key, out var value))
{
    ...
}
```

처럼 정상적인 실패 경로를 제공하는 API가 더 자연스러운 경우가 많습니다.

---

# `CancellationToken`

`CancellationToken`은 Task나 비동기 작업에 **취소 요청을 전달하는 표준 .NET 값 타입**입니다.

```csharp
async Task LoadAsync(CancellationToken token)
{
    token.ThrowIfCancellationRequested();
    await DoWorkAsync(token);
}
```

중요한 점은 CancellationToken이 스레드를 강제로 죽이는 기능이 아니라는 것입니다. 작업 코드가 토큰을 확인하거나 토큰을 지원하는 API에 전달하여 **협력적으로 취소에 응답**합니다.

Unity의 `Awaitable`을 사용할 때도 비동기 작업의 생명주기와 취소를 함께 설계해야 하는 상황이 있습니다.

---

# 타입 선택 빠른 기준

| 상황 | 기본적으로 먼저 떠올릴 타입 |
|---|---|
| 참/거짓 상태 | `bool` |
| 일반 정수 | `int` |
| Unity 게임플레이 실수 | `float` |
| 매우 긴 카운터/틱 | `long` |
| 문자열 | `string` |
| 명명된 선택지 | `enum` |
| 값이 없을 수도 있는 값 타입 | `T?` |
| 짧은 다중 반환 | ValueTuple |
| 실제 날짜/시각 | `DateTime` |
| 시간 간격 | `TimeSpan` |
| 런타임 타입 정보 | `Type` |
| 비동기 취소 신호 | `CancellationToken` |

처음에는 모든 숫자 타입을 외우기보다 `int`, `float`, `bool`, `string`, `enum`, 값/참조 타입의 차이를 확실히 이해하는 것이 Unity 코드를 읽는 데 더 큰 도움이 됩니다.

[Microsoft 공식 문서: C# 기본 제공 타입](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/built-in-types)
