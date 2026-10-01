---
layout: default
title: Unity Object / Component 계층
eyebrow: UnityEngine
---
# Unity 오브젝트 계층

Unity 코드를 이해할 때 가장 중요한 관계 중 하나입니다.

```text
UnityEngine.Object
├─ GameObject
├─ Component
│  ├─ Transform
│  │  └─ RectTransform
│  └─ Behaviour
│     ├─ MonoBehaviour
│     ├─ Camera
│     ├─ Light
│     └─ ...
├─ ScriptableObject
├─ Material
├─ Mesh
├─ Texture
├─ AudioClip
└─ ... 각종 에셋
```

| 타입 | 종류 | 상속 기반 | 핵심 | 대표 사용 |
|---|---|---|---|---|
| Object | class | UnityEngine.Object | Unity 엔진 오브젝트의 공통 기반 | 에셋/컴포넌트/게임오브젝트 참조 |
| GameObject | class | Object | 씬에서 존재하는 기본 컨테이너 | 컴포넌트들을 묶는 객체 |
| Component | class | Object | GameObject에 부착되는 기능의 기반 | transform/gameObject 접근 |
| Behaviour | class | Component | enabled로 켜고 끌 수 있는 Component 기반 | Camera, Light, MonoBehaviour 등 |
| MonoBehaviour | class | Behaviour | 사용자 스크립트 컴포넌트의 일반 기반 | Awake/Start/Update/Coroutine |
| ScriptableObject | class | Object | GameObject에 붙지 않는 Unity 데이터 객체 | 공유 설정/데이터 에셋 |
| Transform | class | Component | 위치·회전·스케일·부모자식 계층 | 모든 GameObject가 가짐 |
| RectTransform | class | Transform | 2D UI 레이아웃용 Transform 확장 | Canvas UI 배치 |
| MissingReferenceException | class | SystemException | 파괴된 Unity 오브젝트 참조 관련 예외 | Unity 객체 수명 문제 디버깅 |


## `Object`

`UnityEngine.Object`는 Unity 엔진이 관리하는 많은 객체의 공통 기반입니다. `System.Object`와 이름이 겹치므로 둘을 구분해야 합니다.

```csharp
UnityEngine.Object unityObject;
object csharpObject;
```

UnityEngine.Object 파생형은 Unity 직렬화에서 **객체 자체를 필드 안에 복사해서 저장하는 것이 아니라 해당 Unity 객체에 대한 참조**로 다뤄지는 경우가 핵심입니다.

## `GameObject`

씬에서 보이는 오브젝트의 컨테이너입니다. 실제 기능은 Component들이 담당합니다.

```csharp
GameObject player;
player.SetActive(false);
Transform t = player.transform;
Rigidbody rb = player.GetComponent<Rigidbody>();
```

## `Component`

GameObject에 붙는 기능의 공통 기반입니다. `Transform`, `Rigidbody`, `Collider`, `Renderer`, `MonoBehaviour` 등은 모두 Component 계열입니다.

```csharp
Component c = GetComponent<Rigidbody>();
GameObject owner = c.gameObject;
Transform ownerTransform = c.transform;
```

## `Behaviour`

`enabled`로 켜고 끌 수 있는 Component의 기반입니다. `MonoBehaviour`, `Camera`, `Light` 등이 이 계층에 있습니다.

## `MonoBehaviour`

사용자가 작성하는 대부분의 “GameObject에 붙이는 스크립트” 기반입니다.

```csharp
public class Enemy : MonoBehaviour
{
    void Awake() { }
    void Start() { }
    void Update() { }
}
```

직접 `new Enemy()`로 생성하는 일반 class처럼 쓰는 것이 아니라, GameObject에 Component로 추가되어 Unity 수명주기 안에서 관리됩니다.

## `ScriptableObject`

GameObject에 붙지 않지만 UnityEngine.Object 계층에 속합니다. 에셋 형태의 설정/공유 데이터를 만들 때 유용합니다.

```csharp
[CreateAssetMenu]
public class WeaponData : ScriptableObject
{
    public int damage;
    public Sprite icon;
}
```

## `Transform`

모든 GameObject에 존재하며 위치, 회전, 스케일과 부모-자식 계층을 담당합니다.

```csharp
Transform t = transform;
t.position = new Vector3(1, 0, 0);
t.SetParent(parent);
```

`Transform`은 `Component`이므로 `GameObject`와 동일한 객체가 아니라 **GameObject에 항상 붙어 있는 특별한 Component**입니다.

## `RectTransform`

Transform을 상속한 UI 배치용 타입입니다. anchor, pivot, anchoredPosition 등 사각 UI 레이아웃 개념이 추가됩니다.
