---
layout: default
title: 컬렉션 / 인터페이스
eyebrow: System.Collections.Generic
---
# 컬렉션 / 인터페이스

Unity 코드를 읽다 보면 `List<T>`처럼 실제 데이터를 들고 있는 **구체 컬렉션 타입**과 `IEnumerable<T>`, `IReadOnlyList<T>`처럼 “이 값으로 무엇을 할 수 있는지”를 표현하는 **인터페이스 타입**이 함께 등장합니다. 특히 `IReadOnlyList<T>`는 처음 보면 별도의 특별한 Unity 타입처럼 느껴질 수 있지만, 실제로는 .NET의 제네릭 컬렉션 인터페이스입니다.

이 페이지에서는 각 타입을 단순 정의보다 **자료 구조의 성격, 가능한 연산, 반환형으로 쓰는 이유, Unity Inspector와의 관계**까지 같이 설명합니다.

## 먼저 알아둘 것: `T`는 무엇인가?

`T`는 제네릭의 **타입 매개변수(type parameter)** 를 나타내는 관례적인 이름입니다.

```csharp
List<int> numbers;
List<string> names;
List<GameObject> objects;
```

위 세 타입은 모두 `List<T>`라는 하나의 설계를 사용하지만, `T` 자리에 각각 `int`, `string`, `GameObject`가 들어갑니다.

`TKey`, `TValue`처럼 이름이 둘 이상이면 각 위치의 역할을 더 명확하게 나타낸 것입니다.

```csharp
Dictionary<int, GameObject> objectsById;
//         ^^^  ^^^^^^^^^^
//        TKey    TValue
```

---

# 배열

## `T[]`

`T[]`는 C#의 **1차원 배열**입니다. 생성할 때 길이가 정해지고, 이후에는 그 배열 자체의 길이를 늘리거나 줄일 수 없습니다. 대신 인덱스 접근이 단순하고, Unity Inspector에서도 지원되는 요소 타입이라면 매우 자연스럽게 직렬화됩니다.

```csharp
[SerializeField] private Transform[] spawnPoints;

void Start()
{
    Transform first = spawnPoints[0];
    int count = spawnPoints.Length;
}
```

### 배열이 잘 맞는 경우

- 개수가 생성 이후 거의 변하지 않음
- Inspector에서 고정된 목록을 설정
- 인덱스로 자주 접근
- 외부 API가 배열을 요구하거나 반환

### `List<T>`와의 가장 큰 차이

배열은 `Length`를 가지며, `Add`나 `Remove`가 없습니다. 요소를 더 넣으려면 더 큰 배열을 새로 만들고 복사해야 합니다. 반면 `List<T>`는 내부 배열의 크기를 관리하면서 가변 길이 목록처럼 동작합니다.

---

## `T[,]`, `T[,,]`

쉼표가 들어간 배열 표기는 **다차원 배열**입니다.

```csharp
int[,] grid = new int[10, 10];
grid[3, 5] = 1;

float[,,] voxel = new float[16, 16, 16];
```

수학적인 격자 표현에는 자연스럽지만, Unity 기본 직렬화는 다차원 배열을 그대로 Inspector에 저장하는 방식에 제한이 있습니다. 게임 런타임 계산용 데이터와 Inspector 편집용 데이터 구조를 반드시 동일하게 만들 필요는 없습니다.

---

## `T[][]`

`T[][]`는 **재그드 배열(jagged array)** 입니다. “배열을 요소로 갖는 배열”이므로 각 행의 길이를 다르게 만들 수 있습니다.

```csharp
int[][] rows = new int[3][];
rows[0] = new int[2];
rows[1] = new int[5];
rows[2] = new int[1];
```

`int[,]`는 직사각형 격자에 가깝고, `int[][]`는 행마다 길이가 다른 구조를 표현할 수 있다는 차이가 있습니다. 이 역시 Unity 기본 Inspector 직렬화 대상으로는 단순한 1차원 배열보다 다루기 까다롭습니다.

---

# 가장 자주 쓰는 순차 컬렉션

## `List<T>`

`List<T>`는 Unity 게임 코드에서 가장 자주 접하는 컬렉션 중 하나입니다. 내부적으로는 배열을 사용하지만, 필요할 때 용량을 늘려 주기 때문에 **가변 길이 목록**처럼 사용할 수 있습니다.

```csharp
private readonly List<Enemy> enemies = new();

public void AddEnemy(Enemy enemy)
{
    enemies.Add(enemy);
}

public void RemoveEnemy(Enemy enemy)
{
    enemies.Remove(enemy);
}
```

### 자주 쓰는 멤버

- `Count`: 현재 요소 수
- `[index]`: 인덱스 접근
- `Add`: 끝에 추가
- `AddRange`: 여러 요소 추가
- `Remove`: 특정 값을 찾아 제거
- `RemoveAt`: 특정 인덱스 제거
- `Clear`: 전체 제거
- `Contains`: 포함 여부 확인
- `Find`, `FindIndex`: 조건에 맞는 요소 검색
- `Sort`: 정렬
- `ToArray`: 배열로 복사

### `Count`와 `Capacity`

`Count`는 실제 요소 수이고, `Capacity`는 내부 배열이 현재 재할당 없이 담을 수 있는 공간입니다.

```csharp
List<int> values = new(capacity: 100);
```

예상 요소 수가 매우 명확하고 빈번하게 대량 추가된다면 초기 Capacity를 지정해 내부 배열 재할당 횟수를 줄일 수 있습니다. 하지만 작은 목록에서 무조건 설정해야 하는 최적화는 아닙니다.

### 반복 중 삭제 주의

```csharp
foreach (Enemy enemy in enemies)
{
    // enemies.Remove(enemy); // 일반적으로 이렇게 수정하면 문제가 생길 수 있음
}
```

컬렉션을 열거하는 동안 구조를 변경하면 열거자가 무효화될 수 있습니다. 뒤에서부터 `for` 문으로 삭제하거나, 삭제 대상을 따로 모으는 방식이 흔합니다.

```csharp
for (int i = enemies.Count - 1; i >= 0; i--)
{
    if (enemies[i] == null)
        enemies.RemoveAt(i);
}
```

### Unity Inspector

지원되는 요소 타입의 `List<T>`는 Unity의 기본 직렬화 시스템에서 매우 흔하게 사용됩니다.

```csharp
[SerializeField] private List<Transform> waypoints = new();
```

[Microsoft 공식 문서: List&lt;T&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.list-1)

---

# 순회 인터페이스

## `IEnumerable<T>`

`IEnumerable<T>`는 가장 핵심적인 컬렉션 인터페이스 중 하나입니다. 핵심 의미는 **“이 객체는 `T` 요소들을 순서대로 열거할 수 있다”** 입니다.

`Count`, 인덱스 접근, 추가/삭제를 약속하지 않습니다. 오직 열거 가능한 시퀀스라는 최소한의 계약에 가깝습니다.

```csharp
void PrintNames(IEnumerable<GameObject> objects)
{
    foreach (GameObject obj in objects)
    {
        Debug.Log(obj.name);
    }
}
```

이 메서드는 배열도 받을 수 있고, `List<GameObject>`도 받을 수 있고, 그 밖의 `IEnumerable<GameObject>` 구현체도 받을 수 있습니다.

### 언제 반환형으로 쓰나?

호출자에게 “순회만 하면 충분하고, 내부 자료 구조가 List인지 배열인지 알 필요가 없다”고 표현하고 싶을 때 좋습니다.

```csharp
public IEnumerable<Enemy> GetAliveEnemies()
{
    foreach (Enemy enemy in enemies)
    {
        if (enemy.IsAlive)
            yield return enemy;
    }
}
```

### 지연 실행 가능성

`IEnumerable<T>`는 실제 컬렉션 그 자체가 아니라 **계산되는 시퀀스**일 수도 있습니다. LINQ나 `yield return` 기반 구현은 순회를 시작할 때 실제 계산이 이루어질 수 있습니다. 따라서 여러 번 열거하면 작업도 여러 번 수행될 수 있다는 점을 기억하면 좋습니다.

[Microsoft 공식 문서: IEnumerable&lt;T&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.ienumerable-1)

---

## `IEnumerator<T>`

`IEnumerator<T>`는 `IEnumerable<T>`가 만들어 내는 **실제 열거 진행 상태**를 나타냅니다. 현재 어느 요소까지 왔는지를 기억하고, 다음 요소로 이동합니다.

주요 개념은 다음 세 가지입니다.

- `Current`: 현재 요소
- `MoveNext()`: 다음 요소로 이동할 수 있는지 시도
- `Reset()`: 초기화 계약이 있지만 일반 게임 코드에서는 직접 사용할 일이 드묾

`foreach` 문은 이런 열거 패턴을 컴파일러가 대신 처리해 준다고 생각하면 좋습니다.

```csharp
IEnumerable<int> values = new List<int> { 1, 2, 3 };
using IEnumerator<int> e = values.GetEnumerator();

while (e.MoveNext())
{
    Debug.Log(e.Current);
}
```

Unity 코루틴에서 보는 비제네릭 `IEnumerator`는 관련은 있지만 목적이 다릅니다. 코루틴에서는 `yield return`으로 “다음에 언제 계속할지”를 표현하는 데 사용합니다.

---

# 컬렉션 계약 인터페이스

## `ICollection<T>`

`ICollection<T>`는 `IEnumerable<T>`보다 더 강한 계약입니다. 단순 순회뿐 아니라 **개수와 컬렉션 수정 관련 기능**을 제공합니다.

대표 멤버는 다음과 같습니다.

- `Count`
- `IsReadOnly`
- `Add`
- `Remove`
- `Clear`
- `Contains`
- `CopyTo`

인덱스 접근은 보장하지 않기 때문에 “목록(list)”보다는 “요소 모음(collection)”에 가까운 추상화입니다.

```csharp
void AddDefaultEnemy(ICollection<Enemy> collection, Enemy enemy)
{
    collection.Add(enemy);
}
```

---

## `IReadOnlyCollection<T>`

`IReadOnlyCollection<T>`는 **`Count`와 순회 기능을 제공하지만 수정 API를 노출하지 않는 인터페이스**입니다.

```csharp
public IReadOnlyCollection<Enemy> Enemies => enemies;
```

호출자는 요소 수를 확인하고 순회할 수 있지만 `Add`, `Remove`, `Clear`를 인터페이스를 통해 호출할 수 없습니다.

### “읽기 전용”의 정확한 의미

이 인터페이스가 보장하는 것은 **컬렉션 구조를 변경하는 API가 노출되지 않는다**는 것입니다. 내부 컬렉션이 실제로 절대 변하지 않는다는 뜻도 아니고, 컬렉션 안의 객체가 불변이라는 뜻도 아닙니다.

```csharp
IReadOnlyCollection<Enemy> view = enemies;
// view.Add(...) // 컴파일되지 않음

// 하지만 Enemy 객체 자체가 mutable이면 내부 상태는 바꿀 수 있음
foreach (Enemy enemy in view)
    enemy.TakeDamage(10);
```

---

## `IList<T>`

`IList<T>`는 **인덱스 접근이 가능한 수정형 목록 계약**입니다. `ICollection<T>`의 기능에 더해 `[index]`, `IndexOf`, `Insert`, `RemoveAt` 등을 제공합니다.

```csharp
void SwapFirstTwo(IList<int> values)
{
    if (values.Count < 2)
        return;

    (values[0], values[1]) = (values[1], values[0]);
}
```

메서드가 `List<T>`의 구체 기능 전체가 아니라 “인덱스 기반 수정 가능한 목록”만 필요하다면 매개변수 타입을 `IList<T>`로 받을 수 있습니다.

### `List<T>`와의 관계

`List<T>`는 `IList<T>`를 구현합니다. 그래서 다음 대입이 가능합니다.

```csharp
List<int> concrete = new();
IList<int> abstraction = concrete;
```

반대 방향은 실제 객체가 List라고 확신하지 않는 한 직접 대입할 수 없습니다.

---

## `IReadOnlyList<T>`

`IReadOnlyList<T>`는 **순회 + `Count` + 읽기 전용 인덱스 접근**을 보장하는 인터페이스입니다. `IReadOnlyCollection<T>`보다 “목록의 순서와 인덱스”라는 개념이 하나 더 강합니다.

```csharp
private readonly List<Enemy> enemies = new();

public IReadOnlyList<Enemy> Enemies => enemies;
```

외부 코드는 이렇게 사용할 수 있습니다.

```csharp
IReadOnlyList<Enemy> enemies = manager.Enemies;

Debug.Log(enemies.Count);
Enemy first = enemies[0];

for (int i = 0; i < enemies.Count; i++)
{
    Debug.Log(enemies[i].name);
}
```

하지만 다음 코드는 불가능합니다.

```csharp
// enemies.Add(enemy);
// enemies.RemoveAt(0);
// enemies.Clear();
```

### 왜 `List<T>`를 그대로 반환하지 않는가?

다음 API를 비교해 봅시다.

```csharp
public List<Enemy> Enemies => enemies;
```

이렇게 하면 호출자는 내부 List에 직접 `Add`, `Remove`, `Clear`를 호출할 수 있습니다. 즉 소유자가 의도한 규칙을 우회할 수 있습니다.

반대로:

```csharp
public IReadOnlyList<Enemy> Enemies => enemies;
```

호출자는 목록을 읽을 수 있지만 목록 구조를 수정하는 API는 보이지 않습니다. “변경은 이 클래스를 통해서만 해라”라는 설계를 타입으로 표현하는 것입니다.

### 중요한 오해 1: 완전한 불변이 아니다

`IReadOnlyList<T>`는 **인터페이스가 수정 메서드를 제공하지 않을 뿐**, 원본 `List<T>`가 다른 곳에서 바뀌면 읽기 전용 뷰에서도 바뀐 결과가 보입니다.

```csharp
List<int> source = new() { 1, 2 };
IReadOnlyList<int> view = source;

source.Add(3);
Debug.Log(view.Count); // 3
```

### 중요한 오해 2: 요소 자체도 읽기 전용이 되는 것은 아니다

`IReadOnlyList<Enemy>`는 Enemy 참조 목록의 구조를 수정하는 API만 제한합니다. `Enemy`의 메서드 호출까지 막지 않습니다.

### 언제 특히 유용한가?

- Manager가 내부 목록을 소유하고 외부는 조회만 해야 할 때
- `List<T>`라는 구현 세부사항을 API 밖으로 노출하고 싶지 않을 때
- 순서와 인덱스가 중요하지만 수정 권한은 주고 싶지 않을 때
- `IEnumerable<T>`보다 `Count`와 `[index]`가 필요할 때

### `IEnumerable<T>`와 비교

| 기능 | `IEnumerable<T>` | `IReadOnlyCollection<T>` | `IReadOnlyList<T>` |
|---|---:|---:|---:|
| `foreach` | O | O | O |
| `Count` | 보장 X | O | O |
| `[index]` | X | X | O |
| 수정 API | X | X | X |

[Microsoft 공식 문서: IReadOnlyList&lt;T&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlylist-1)

---

# 키-값 컬렉션

## `Dictionary<TKey, TValue>`

`Dictionary<TKey, TValue>`는 **키를 이용해 값을 빠르게 찾기 위한 해시 기반 컬렉션**입니다.

```csharp
private readonly Dictionary<int, Enemy> enemyById = new();

public void Register(int id, Enemy enemy)
{
    enemyById[id] = enemy;
}

public bool TryGetEnemy(int id, out Enemy enemy)
{
    return enemyById.TryGetValue(id, out enemy);
}
```

### List와 언제 다르게 쓰나?

List는 보통 순서대로 저장하고 인덱스나 순회로 찾습니다. Dictionary는 “이 ID에 해당하는 Enemy”, “이 문자열 이름의 설정”, “이 enum에 대응하는 데이터”처럼 **키가 명확한 조회**에 적합합니다.

```csharp
Dictionary<string, ItemData> itemByCode;
Dictionary<WeaponType, WeaponConfig> configByType;
```

### 자주 쓰는 멤버

- `[key]`: 키로 읽고 쓰기
- `Add(key, value)`
- `TryGetValue(key, out value)`
- `ContainsKey(key)`
- `Remove(key)`
- `Keys`, `Values`
- `Count`

### `TryGetValue`를 많이 보는 이유

```csharp
if (enemyById.TryGetValue(id, out Enemy enemy))
{
    enemy.TakeDamage(10);
}
```

키가 없을 수 있는 상황에서 조회와 존재 확인을 한 번에 표현하기 좋습니다.

### Unity Inspector 직렬화

Unity의 기본 직렬화 시스템은 `Dictionary<TKey,TValue>`를 일반적인 `[SerializeField]` 필드처럼 직접 직렬화하지 않습니다. 그래서 흔히 **Inspector 편집용 List + 런타임 Dictionary 캐시**를 분리합니다.

```csharp
[Serializable]
public class ItemEntry
{
    public string id;
    public ItemData data;
}

[SerializeField] private List<ItemEntry> entries = new();
private Dictionary<string, ItemData> lookup;

void Awake()
{
    lookup = new Dictionary<string, ItemData>();

    foreach (ItemEntry entry in entries)
        lookup[entry.id] = entry.data;
}
```

[Microsoft 공식 문서: Dictionary&lt;TKey,TValue&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.dictionary-2)

---

## `IDictionary<TKey, TValue>`

`IDictionary<TKey, TValue>`는 키-값 컬렉션의 **수정 가능한 인터페이스 계약**입니다. 구체 구현을 `Dictionary`로 고정하지 않고 “키로 값을 읽고 쓸 수 있는 맵”이라는 요구만 표현하고 싶을 때 사용합니다.

```csharp
void RegisterDefaults(IDictionary<string, int> values)
{
    values["HP"] = 100;
    values["MP"] = 30;
}
```

일반적인 Unity 게임 코드에서 직접 인터페이스 타입을 필드로 Inspector에 노출하기보다는, 메서드 매개변수나 API 경계에서 추상화 목적으로 더 자연스럽게 만납니다.

---

## `IReadOnlyDictionary<TKey, TValue>`

키 조회는 필요하지만 외부에서 추가/삭제/대입을 하게 하고 싶지 않을 때 사용하는 읽기 전용 Dictionary 계약입니다.

```csharp
private readonly Dictionary<int, ItemData> itemById = new();
public IReadOnlyDictionary<int, ItemData> Items => itemById;
```

`IReadOnlyList<T>`와 마찬가지로 “원본이 절대 변하지 않는다”는 뜻은 아닙니다. 공개된 인터페이스를 통해 수정 API를 사용할 수 없다는 의미입니다.

---

## `KeyValuePair<TKey, TValue>`

Dictionary를 `foreach`로 순회할 때 각 요소는 보통 `KeyValuePair<TKey,TValue>` 형태로 보입니다.

```csharp
foreach (KeyValuePair<int, Enemy> pair in enemyById)
{
    int id = pair.Key;
    Enemy enemy = pair.Value;
}
```

최신 C#에서는 다음처럼 구조 분해 문법을 볼 수도 있습니다.

```csharp
foreach (var (id, enemy) in enemyById)
{
    Debug.Log($"{id}: {enemy.name}");
}
```

---

# 집합

## `HashSet<T>`

`HashSet<T>`는 **중복을 허용하지 않는 집합(set)** 입니다. “목록의 몇 번째인가”보다 “이 값이 들어 있는가”가 중요할 때 적합합니다.

```csharp
private readonly HashSet<Enemy> enemiesInRange = new();

void OnTriggerEnter(Collider other)
{
    if (other.TryGetComponent(out Enemy enemy))
        enemiesInRange.Add(enemy);
}

void OnTriggerExit(Collider other)
{
    if (other.TryGetComponent(out Enemy enemy))
        enemiesInRange.Remove(enemy);
}
```

같은 Enemy가 여러 번 Add되어도 하나만 존재합니다.

### 주요 용도

- 중복 없는 등록 목록
- 방문한 노드 기록
- 이미 처리한 객체 기록
- 빠른 포함 여부 확인
- 두 집합의 합집합/교집합/차집합

### 순서를 기대하지 않기

HashSet은 List처럼 “추가한 순서대로 안정적으로 인덱스로 접근하는 목록”이 아닙니다. 순서가 중요하면 다른 자료 구조가 더 적합합니다.

---

## `ISet<T>`

`ISet<T>`는 집합 자료 구조가 제공해야 할 기능의 인터페이스입니다. `UnionWith`, `IntersectWith`, `ExceptWith`처럼 집합 연산이 필요한 API를 추상화할 때 사용할 수 있습니다.

```csharp
void RemoveBlocked(ISet<int> allowed, IEnumerable<int> blocked)
{
    allowed.ExceptWith(blocked);
}
```

---

## `SortedSet<T>`

`SortedSet<T>`는 **중복 없는 집합 + 정렬 유지**가 필요한 경우 사용합니다. HashSet과 달리 정렬 기준을 유지하기 위한 비용이 있고, 목적도 다릅니다.

예를 들어 항상 점수 순서 또는 커스텀 비교 기준 순서로 고유 값을 유지해야 할 때 고려할 수 있습니다.

---

# 큐와 스택

## `Queue<T>`

`Queue<T>`는 **FIFO(First In, First Out)** 자료 구조입니다. 먼저 들어온 데이터가 먼저 나옵니다.

```csharp
Queue<SpawnRequest> requests = new();

requests.Enqueue(request);
SpawnRequest next = requests.Dequeue();
```

### Unity에서 떠올리기 쉬운 예

- 순서대로 처리할 작업 요청
- 대사/메시지 큐
- 적 웨이브 예약
- BFS 탐색
- 네트워크/이벤트 버퍼의 단순 처리 순서

`Peek()`은 제거하지 않고 다음 요소를 확인할 때 사용합니다.

---

## `Stack<T>`

`Stack<T>`는 **LIFO(Last In, First Out)** 입니다. 가장 나중에 들어온 데이터가 먼저 나옵니다.

```csharp
Stack<GameState> states = new();

states.Push(currentState);
GameState previous = states.Pop();
```

### 흔한 예

- 뒤로 가기/되돌리기
- DFS 탐색
- 상태 스택
- 중첩 UI 화면
- 파싱/괄호 처리 같은 알고리즘

---

# 연결/정렬 컬렉션

## `LinkedList<T>`

`LinkedList<T>`는 각 요소가 앞/뒤 노드와 연결되는 **양방향 연결 리스트**입니다. `LinkedListNode<T>`를 알고 있을 때 중간 노드 제거/삽입을 일정한 연결 조작으로 처리할 수 있다는 성격이 있습니다.

하지만 배열 기반 List와 메모리 접근 패턴이 다르고 인덱스 접근도 제공하지 않기 때문에, “중간 삽입이 있어 보인다”는 이유만으로 List 대신 선택하는 것은 좋지 않습니다. 실제 접근 패턴과 성능 요구를 보고 결정해야 합니다.

---

## `SortedDictionary<TKey, TValue>`

키-값 매핑을 유지하면서 **키 정렬 순서로 순회**해야 할 때 사용하는 컬렉션입니다. 일반 `Dictionary`의 핵심 목적은 빠른 키 조회이고, 정렬된 열거 순서를 보장하려는 목적과는 다릅니다.

게임플레이 코드에서 매우 흔한 기본 선택은 아니지만, 정렬된 키가 중요한 툴이나 데이터 처리 코드에서 만날 수 있습니다.

---

# 읽기 전용 래퍼와 변경 알림

## `ReadOnlyCollection<T>`

`ReadOnlyCollection<T>`는 기존 `IList<T>`를 감싸서 **수정 API를 제한한 읽기 전용 래퍼 객체**를 만드는 클래스입니다.

```csharp
List<int> source = new() { 1, 2, 3 };
ReadOnlyCollection<int> view = source.AsReadOnly();
```

`IReadOnlyList<T>`는 인터페이스이고, `ReadOnlyCollection<T>`는 실제 클래스라는 점이 다릅니다. 원본 List가 바뀌면 래퍼를 통해 보는 내용도 바뀔 수 있으므로 “데이터 복사본”과도 다릅니다.

---

## `ObservableCollection<T>`

`ObservableCollection<T>`는 요소가 추가/삭제될 때 변경 알림 이벤트를 제공하는 .NET 컬렉션입니다. 일반 Unity 런타임 게임플레이 코드에서 기본 선택으로 자주 쓰이지는 않지만, 에디터 툴, MVVM 계열 UI, 일반 .NET 코드에서 만날 수 있습니다.

Unity의 기본 Inspector가 이 타입을 특별히 자동 데이터 바인딩해 주는 것은 아니므로, “Observable”이라는 이름만 보고 Unity UI가 자동 갱신된다고 생각하면 안 됩니다.

---

# 메모리 뷰 계열

## `Span<T>`

`Span<T>`는 **연속된 메모리 구간을 복사 없이 바라보는 경량 뷰**입니다. 배열 전체 또는 일부 구간을 별도 배열로 만들지 않고 처리할 수 있습니다.

```csharp
int[] values = { 10, 20, 30, 40 };
Span<int> middle = values.AsSpan(1, 2);

middle[0] = 99;
// 원본 values[1]도 99가 됨
```

`Span<T>`는 `ref struct`라서 일반 클래스 필드에 저장하거나 async 경계를 넘기는 등 사용에 제약이 있습니다. 고성능/저할당 코드에서 강력하지만, 입문 단계에서 모든 배열 처리를 Span으로 바꿀 필요는 없습니다.

---

## `Memory<T>`

`Memory<T>`도 메모리 구간을 나타내지만 `Span<T>`보다 보관과 비동기 흐름에 적합하도록 설계된 struct입니다. 필요할 때 `.Span`을 통해 `Span<T>` 뷰를 얻을 수 있습니다.

Unity 게임플레이의 일반 목록 관리보다는 버퍼 처리, 네트워크/파일 IO, 고급 .NET 코드에서 만날 가능성이 높습니다.

---

## `ArraySegment<T>`

`ArraySegment<T>`는 기존 배열의 **일부 구간을 배열 복사 없이 표현**합니다.

```csharp
byte[] buffer = new byte[1024];
ArraySegment<byte> packet = new(buffer, 100, 200);
```

원본 배열, 시작 오프셋, 길이를 함께 보관하는 방식입니다. 네트워크 버퍼나 부분 데이터 전달에서 볼 수 있습니다.

---

# 반환 타입을 왜 인터페이스로 만드는가?

다음 두 API는 비슷해 보여도 설계 의도가 다릅니다.

```csharp
public List<Enemy> GetEnemies() => enemies;
```

호출자는 List의 모든 수정 기능을 사용할 수 있습니다.

```csharp
public IReadOnlyList<Enemy> Enemies => enemies;
```

호출자는 순서와 인덱스를 읽을 수 있지만, 목록 구조 수정은 직접 할 수 없습니다.

더 좁게:

```csharp
public IEnumerable<Enemy> EnumerateEnemies() => enemies;
```

호출자는 순회 가능하다는 사실만 알면 됩니다.

즉 인터페이스는 단순히 “멋있어 보이는 추상화”가 아니라 **호출자에게 필요한 권한과 기능 범위를 타입 수준에서 표현하는 도구**입니다.

---

# Unity 직렬화 관점에서 보기

다음은 C#에서 사용할 수 있는지와 Unity가 Inspector에 기본 저장할 수 있는지를 구분하는 데 도움이 됩니다.

| 타입 | C#에서 사용 | Unity 기본 필드 직렬화 |
|---|---:|---:|
| `T[]` | O | 지원 요소 타입이면 O |
| `List<T>` | O | 지원 요소 타입이면 O |
| `IEnumerable<T>` | O | 인터페이스 필드 그대로는 일반적으로 X |
| `IReadOnlyList<T>` | O | 인터페이스 필드 그대로는 일반적으로 X |
| `Dictionary<TKey,TValue>` | O | 기본 직렬화 X |
| `HashSet<T>` | O | 기본 직렬화 X |
| 다차원/재그드 배열 | O | 기본 직렬화에 제한 |

따라서 런타임에 가장 편한 구조와 Inspector에서 편집하기 좋은 구조가 다르면, **직렬화용 데이터와 런타임 캐시를 분리**하는 설계가 자연스럽습니다.

[Unity 직렬화 상세 문서]({{ '/serialization/' | relative_url }})

---

# 빠른 선택 기준

| 원하는 것 | 우선 떠올릴 타입 |
|---|---|
| 고정 길이 순차 데이터 | `T[]` |
| 가변 길이 순차 데이터 | `List<T>` |
| 순회만 공개 | `IEnumerable<T>` |
| 개수 + 순회만 공개 | `IReadOnlyCollection<T>` |
| 개수 + 인덱스 읽기 공개 | `IReadOnlyList<T>` |
| 인덱스 기반 수정 가능한 계약 | `IList<T>` |
| 키로 값 찾기 | `Dictionary<TKey,TValue>` |
| 키-값 읽기만 공개 | `IReadOnlyDictionary<TKey,TValue>` |
| 중복 없는 값 | `HashSet<T>` |
| 먼저 들어온 것부터 처리 | `Queue<T>` |
| 마지막에 들어온 것부터 처리 | `Stack<T>` |
| 배열 일부를 복사 없이 다루기 | `Span<T>`, `ArraySegment<T>` |

처음에는 `T[]`, `List<T>`, `IEnumerable<T>`, `IReadOnlyList<T>`, `Dictionary<TKey,TValue>`, `HashSet<T>`, `Queue<T>`, `Stack<T>` 정도를 확실히 구분하는 것만으로도 대부분의 Unity 게임 코드를 읽는 데 큰 도움이 됩니다.
