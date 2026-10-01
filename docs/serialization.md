---
layout: default
title: Unity 직렬화와 타입
eyebrow: Inspector / Serialization
---
# “선언할 수 있다”와 “Unity가 저장할 수 있다”는 다르다

Unity 코드에서는 C#이 허용하는 매우 다양한 타입을 사용할 수 있습니다. 하지만 Scene, Prefab, ScriptableObject, Inspector에 Unity 기본 직렬화 방식으로 저장 가능한 필드에는 별도 규칙이 있습니다.

## 필드가 직렬화되기 위한 기본 조건

Unity 6 공식 Manual 기준으로 일반적인 필드 직렬화에서는 다음 조건을 봅니다.

- `public`이거나 `[SerializeField]`가 있음
- `static`이 아님
- `const`가 아님
- `readonly`가 아님
- 타입 자체가 Unity 직렬화 규칙에서 지원됨

## 대표적으로 기본 지원되는 타입

- 기본 데이터: `int`, `float`, `double`, `bool`, `string` 등
- 32비트 이하 enum
- Unity 내장 타입: `Vector2`, `Vector3`, `Rect`, `Matrix4x4`, `Color`, `AnimationCurve` 등
- `[System.Serializable]` 커스텀 struct
- `UnityEngine.Object` 파생 객체에 대한 참조
- `[System.Serializable]` 커스텀 class
- 위 타입의 배열
- 위 타입의 `List<T>`

## 기본 직렬화에서 바로 지원되지 않는 대표 예

- `Dictionary<TKey,TValue>`
- 다차원 배열 `T[,]`
- 재그드 배열 `T[][]`
- 중첩 컨테이너 `List<List<T>>` 같은 구조
- 일반 interface 타입 필드
- 대부분의 일반 C# 전용 타입 (`DateTime`, `Guid`, `Tuple` 등)

> 정확한 지원 여부는 Unity 버전과 타입 세부 조건에 따라 달라질 수 있습니다. “컴파일된다”는 사실만으로 Inspector 저장까지 된다고 판단하지 마세요.

## `List<T>`는 되는데 `IReadOnlyList<T>` 필드는 왜 안 보이나?

```csharp
[SerializeField] private List<Enemy> enemies;
public IReadOnlyList<Enemy> Enemies => enemies;
```

이 방식이 자연스럽습니다.

- 저장용 필드: Unity가 이해하는 구체 컨테이너 `List<Enemy>`
- 외부 공개 API: 수정 기능을 제한한 `IReadOnlyList<Enemy>`

즉 **직렬화 표현과 공개 API 타입을 반드시 같게 만들 필요가 없습니다.**

## `Dictionary`가 필요하면

가장 단순한 학습 단계에서는 직렬화 가능한 Entry 리스트를 저장하고 런타임에 Dictionary를 구축할 수 있습니다.

```csharp
[System.Serializable]
public class ItemEntry
{
    public string id;
    public ItemData item;
}

[SerializeField] private List<ItemEntry> entries;
private Dictionary<string, ItemData> byId;

private void Awake()
{
    byId = new Dictionary<string, ItemData>();
    foreach (var entry in entries)
        byId[entry.id] = entry.item;
}
```

## UnityEngine.Object 참조

```csharp
[SerializeField] private GameObject prefab;
[SerializeField] private Transform spawnPoint;
[SerializeField] private Material material;
```

이들은 UnityEngine.Object 파생 객체에 대한 참조라 Inspector에서 오브젝트 슬롯으로 연결하는 패턴이 흔합니다.

## 사용자 정의 class/struct

```csharp
[System.Serializable]
public class Stat
{
    public string name;
    public float value;
}
```

`[System.Serializable]`을 붙이고 내부 필드들도 지원되는 타입이어야 일반적인 inline 직렬화가 가능합니다.

## `[SerializeReference]`

일반 C# class를 값처럼 inline 직렬화하는 방식 대신 **managed reference**로 저장해야 하는 다형성, null, 공유 참조, 그래프 구조 등의 경우 사용할 수 있습니다. 다만 오버헤드와 관리 복잡도가 있으므로 그런 기능이 실제로 필요할 때 선택합니다.

## 프로퍼티

Unity는 일반적으로 C# 프로퍼티 자체보다 **필드**를 직렬화합니다.

```csharp
[SerializeField] private int hp;
public int Hp => hp;
```

이 패턴은 Inspector 저장과 외부 읽기 API를 분리하기 좋아서 매우 자주 사용합니다.

## 직렬화 판단 체크리스트

1. 이 값은 런타임 임시 값인가, 에디터에서 저장해야 하는 설정값인가?
2. 필드인가, 프로퍼티인가?
3. public 또는 `[SerializeField]`인가?
4. `static`, `const`, `readonly`인가?
5. Unity가 지원하는 타입인가?
6. 컨테이너가 배열/`List<T>`를 넘어서 중첩되거나 Dictionary인가?
7. 다형성/공유 참조가 정말 필요해서 `[SerializeReference]`가 필요한가?
