---
layout: default
title: 컬렉션과 인터페이스
eyebrow: C# / .NET
---
# 컬렉션 / 인터페이스

`IReadOnlyList<T>`처럼 이름이 길어지는 곳입니다. **실제 데이터를 저장하는 구현 타입**과 **외부에 어떤 기능만 보여줄지 정하는 인터페이스 타입**을 분리해서 보면 훨씬 쉽습니다.

| 타입 | 네임스페이스 | 종류 | 핵심 | 접근/변경 | Unity 기본 직렬화 |
|---|---|---|---|---|---|
| T[] | System.Array | class | 고정 길이 인덱스 컬렉션 | 인덱스 O / 추가·삭제 X | 지원 타입 요소면 O |
| T[,] / T[,,] | System.Array | class | 다차원 배열 | 격자 데이터 | Unity 기본 직렬화 X |
| T[][] | System.Array | class | 재그드 배열 | 행 길이가 다른 데이터 | Unity 기본 직렬화 X |
| List<T> | System.Collections.Generic | class | 가변 길이 순차 컬렉션 | 인덱스/추가/삭제 | 지원 타입 요소면 O |
| IEnumerable<T> | System.Collections.Generic | interface | 순회 가능한 시퀀스 계약 | foreach 중심 | 인터페이스 필드 기본 X |
| IEnumerator<T> | System.Collections.Generic | interface | 열거 상태/현재 요소 | 직접 열거 구현 | X |
| ICollection<T> | System.Collections.Generic | interface | 개수+추가/삭제 중심 계약 | 컬렉션 공통 API | X |
| IReadOnlyCollection<T> | System.Collections.Generic | interface | 개수+순회 읽기 계약 | 외부 수정 제한 API | X |
| IList<T> | System.Collections.Generic | interface | 인덱스 기반 수정 가능 목록 | 구현 교체 가능한 리스트 API | X |
| IReadOnlyList<T> | System.Collections.Generic | interface | 인덱스 기반 읽기 전용 목록 | 외부에 목록 읽기만 노출 | X |
| Dictionary<TKey,TValue> | System.Collections.Generic | class | 키→값 해시 맵 | ID로 빠른 조회 | Unity 기본 직렬화 X |
| IDictionary<TKey,TValue> | System.Collections.Generic | interface | 키-값 수정 계약 | 딕셔너리 추상화 | X |
| IReadOnlyDictionary<TKey,TValue> | System.Collections.Generic | interface | 키-값 읽기 전용 계약 | 외부 조회 API | X |
| HashSet<T> | System.Collections.Generic | class | 중복 없는 집합 | 중복 제거/포함 검사 | Unity 기본 직렬화 X |
| ISet<T> | System.Collections.Generic | interface | 집합 연산 계약 | 교집합/합집합 추상화 | X |
| Queue<T> | System.Collections.Generic | class | FIFO 큐 | 작업/웨이브/메시지 처리 | Unity 기본 직렬화 X |
| Stack<T> | System.Collections.Generic | class | LIFO 스택 | 되돌리기/상태 스택 | Unity 기본 직렬화 X |
| LinkedList<T> | System.Collections.Generic | class | 양방향 연결 리스트 | 중간 노드 조작 | Unity 기본 직렬화 X |
| SortedSet<T> | System.Collections.Generic | class | 정렬된 집합 | 정렬+중복 제거 | X |
| SortedDictionary<TKey,TValue> | System.Collections.Generic | class | 키 정렬 딕셔너리 | 정렬된 키 순회 | X |
| KeyValuePair<TKey,TValue> | System.Collections.Generic | struct | 키-값 한 쌍 | Dictionary foreach 요소 | X |
| ReadOnlyCollection<T> | System.Collections.ObjectModel | class | 기존 IList를 읽기 전용 래핑 | 변경 API 숨김 | X |
| ObservableCollection<T> | System.Collections.ObjectModel | class | 변경 알림 컬렉션 | .NET UI/툴 코드 | X |
| Span<T> | System | ref struct | 연속 메모리 뷰 | 할당 줄인 저수준 처리 | 필드 저장/직렬화 X |
| Memory<T> | System | struct | 비동기에도 보관 가능한 메모리 뷰 | 버퍼 처리 | X |
| ArraySegment<T> | System | struct | 배열 일부 구간 뷰 | 복사 없는 하위 구간 | X |


## `List<T>`

가장 흔한 가변 길이 목록입니다.

```csharp
List<GameObject> enemies = new List<GameObject>();
enemies.Add(enemy);
GameObject first = enemies[0];
enemies.Remove(enemy);
```

### 특징

- 순서가 있음
- 인덱스로 접근 가능
- `Add`, `Remove`, `Insert`, `Clear` 등으로 변경 가능
- 지원되는 요소 타입이라면 Unity가 `List<T>` 필드를 기본 직렬화할 수 있음

## `IEnumerable<T>`

“이 요소들을 순서대로 열거할 수 있다”는 가장 기본적인 읽기 관점입니다.

```csharp
void PrintNames(IEnumerable<GameObject> objects)
{
    foreach (var obj in objects)
        Debug.Log(obj.name);
}
```

이 함수는 반드시 `List<GameObject>`만 요구하지 않습니다. 배열이나 다른 열거 가능한 구현도 받을 수 있습니다.

## `IReadOnlyList<T>`

`IEnumerable<T>`보다 강한 계약입니다. **순회뿐 아니라 `Count`와 `[index]` 읽기**를 보장하지만, 인터페이스 자체에는 추가/삭제 API가 없습니다.

```csharp
private readonly List<Enemy> enemies = new();
public IReadOnlyList<Enemy> Enemies => enemies;
```

이 패턴은 내부에서는 `List<Enemy>`를 수정하면서 외부에는 “읽기 중심” API를 노출할 때 자주 사용합니다.

<div class="callout warn"><div class="callout-title">읽기 전용 인터페이스 = 객체가 완전히 불변이라는 뜻은 아님</div>
<code>IReadOnlyList&lt;Enemy&gt;</code>는 목록에 Add/Remove 하는 API를 숨깁니다. 하지만 리스트 안의 <code>Enemy</code> 객체 자체가 mutable하면 그 객체의 상태는 바뀔 수 있습니다. 또한 원본 <code>List&lt;T&gt;</code>를 가진 쪽은 계속 목록을 수정할 수 있습니다.</div>

## `IList<T>`

인덱스 접근과 수정 가능 목록의 계약입니다. API가 “구현은 List가 아닐 수도 있지만, 인덱스 기반 목록으로 수정할 수 있어야 한다”고 말하고 싶을 때 사용합니다.

## `ICollection<T>` / `IReadOnlyCollection<T>`

인덱스는 필요 없지만 `Count`와 컬렉션 자체의 추가/삭제 또는 읽기 기능을 표현합니다.

- `ICollection<T>`: `Count`, `Add`, `Remove`, `Contains` 등
- `IReadOnlyCollection<T>`: `Count` + 열거

## `Dictionary<TKey, TValue>`

키로 값을 찾는 컬렉션입니다.

```csharp
Dictionary<int, Enemy> enemyById = new();
enemyById[10] = enemy;

if (enemyById.TryGetValue(10, out Enemy found))
{
    Debug.Log(found.name);
}
```

ID, 이름, enum 등을 키로 빠르게 조회하는 데 유용합니다. 다만 **Unity 기본 Inspector 직렬화 대상은 아닙니다.** 런타임에 구축하거나, 직렬화 가능한 리스트를 원본으로 두고 Dictionary 캐시를 만드는 패턴을 자주 씁니다.

## `HashSet<T>`

순서보다 “포함되어 있는가 / 중복이 없어야 하는가”가 중요한 집합입니다.

```csharp
HashSet<int> visitedIds = new();
visitedIds.Add(id);
if (visitedIds.Contains(id)) { }
```

## `Queue<T>` / `Stack<T>`

- `Queue<T>`: 먼저 넣은 것이 먼저 나오는 FIFO. 작업 큐, 순차 명령 처리.
- `Stack<T>`: 나중에 넣은 것이 먼저 나오는 LIFO. 되돌리기, 상태 되감기, 탐색.

## 배열 `T[]` vs `List<T>`

배열은 길이가 정해진 연속 데이터에 자연스럽고, `List<T>`는 런타임에 요소 수가 바뀌는 목록에 편합니다. Unity Inspector는 지원되는 요소 타입의 배열과 `List<T>`를 모두 잘 다룹니다.

## 반환 타입을 구체 타입보다 인터페이스로 좁히는 이유

```csharp
// 외부 코드가 내부 List 자체에 강하게 의존
public List<Enemy> Enemies => enemies;

// 외부에서 목록 구조를 직접 수정할 필요가 없다면
public IReadOnlyList<Enemy> Enemies => enemies;
```

두 번째 선언은 “이 API의 사용자는 읽기만 하면 된다”는 설계 의도를 타입으로 표현합니다.
