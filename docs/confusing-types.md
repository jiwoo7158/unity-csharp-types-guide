---
layout: default
title: 헷갈리는 타입 비교
eyebrow: Compare
---
# 헷갈리는 타입 조합

## `List<T>` vs `IList<T>` vs `IReadOnlyList<T>` vs `IEnumerable<T>`

| 타입 | 인덱스 읽기 | Count | Add/Remove 계약 | 대표 의도 |
|---|---:|---:|---:|---|
| `List<T>` | O | O | O | 실제 데이터를 저장/수정 |
| `IList<T>` | O | O | O | “수정 가능한 인덱스 목록” 추상화 |
| `IReadOnlyList<T>` | O | O | X | “인덱스로 읽기만 필요” 공개 API |
| `IEnumerable<T>` | 보장 X | 보장 X | X | `foreach` 순회만 필요 |

`IReadOnlyList<T>`를 보고 “새로운 특별한 리스트 저장 방식”이라고 생각하기보다, **목록을 바라보는 읽기 전용 인터페이스**라고 이해하면 쉽습니다.

## 배열 `T[]` vs `List<T>`

- 배열: 길이가 고정된 데이터에 단순하고 직접적
- `List<T>`: 요소 수가 바뀌는 런타임 목록에 편리
- 둘 다 지원 요소 타입이면 Unity 직렬화에 자주 사용

## `GameObject` vs `Transform`

- `GameObject`: 컴포넌트를 담는 씬 오브젝트 자체
- `Transform`: 그 GameObject의 위치/회전/스케일/계층을 담당하는 Component

```csharp
GameObject obj = gameObject;
Transform t = obj.transform;
```

## `GameObject` vs `Component`

`GameObject`가 “개체”라면 Component는 그 개체에 붙는 기능입니다. `Rigidbody`, `Collider`, `Animator`, 사용자 `MonoBehaviour` 모두 Component 계열입니다.

## `MonoBehaviour` vs 일반 `class`

| MonoBehaviour | 일반 class |
|---|---|
| GameObject Component | 독립 C# 객체 |
| Unity가 수명주기 콜백 실행 | 직접 생성/호출 |
| 보통 `new`로 만들지 않음 | `new`로 생성 가능 |
| Inspector/Component 생태계 | 순수 C# 설계에 유리 |

모든 로직을 MonoBehaviour로 만들 필요는 없습니다. Unity 연결이 필요 없는 데이터/규칙은 일반 class가 더 단순할 수 있습니다.

## `MonoBehaviour` vs `ScriptableObject`

- MonoBehaviour: 씬/GameObject의 행동과 상태
- ScriptableObject: GameObject와 독립적인 Unity Object 데이터/에셋

## `Vector3` vs `Vector3Int`

- `Vector3`: 연속적인 float 공간
- `Vector3Int`: 그리드/셀 같은 정수 좌표

## `Quaternion` vs `Vector3 eulerAngles`

`Quaternion`은 Unity 회전의 실제 대표 표현이고, Euler Vector3는 사람이 이해하기 쉬운 각도 표현/입출력 방식입니다. 둘을 같은 타입으로 보지 않습니다.

## `Color` vs `Color32`

- Color: float RGBA
- Color32: byte RGBA

## `Ray` vs `RaycastHit`

- `Ray`: 어디서 어느 방향으로 쏘는가
- `RaycastHit`: 실제로 무엇을 어디서 맞췄는가

## `Collider` vs `Collision`

- `Collider`: GameObject에 붙은 충돌 형상 Component
- `Collision`: 충돌 이벤트 순간에 전달되는 충돌 상세 정보

## `Rigidbody` vs `CharacterController`

둘 다 “캐릭터 이동에 쓸 수 있다”는 이유로 헷갈리지만 설계 철학이 다릅니다. Rigidbody는 일반 물리 바디이고, CharacterController는 캐릭터 이동을 위한 특수 Collider 계열입니다. 원하는 물리 반응/제어 방식에 따라 선택합니다.

## 3D Physics vs 2D Physics

`Rigidbody` ↔ `Rigidbody2D`, `Collider` ↔ `Collider2D`, `Collision` ↔ `Collision2D`, `RaycastHit` ↔ `RaycastHit2D`는 단순 접미사 차이가 아니라 **서로 별도 시스템의 타입**입니다.

## `Material` vs `Shader`

- Shader: 렌더링 프로그램과 프로퍼티 정의
- Material: 특정 Shader를 선택하고 실제 프로퍼티 값을 저장하는 에셋

## `Mesh` vs `MeshFilter` vs `MeshRenderer`

- Mesh: 기하 데이터
- MeshFilter: 사용할 Mesh 참조
- MeshRenderer: 그 Mesh를 Material로 화면에 렌더

## `AudioClip` vs `AudioSource`

- AudioClip: 소리 데이터
- AudioSource: 그 소리를 재생하는 Component

## `AnimationClip` vs `RuntimeAnimatorController` vs `Animator`

- AnimationClip: 움직임 데이터
- RuntimeAnimatorController: 상태/전이 구조의 컨트롤러 에셋 기반
- Animator: GameObject에서 컨트롤러를 실제로 실행하는 Component

## `IEnumerator` vs `Coroutine`

- IEnumerator: yield 순서를 기술하는 열거자
- Coroutine: Unity가 실행 중인 코루틴을 나타내기 위해 반환하는 핸들

## `WaitForSeconds` vs `WaitForSecondsRealtime`

- WaitForSeconds: `Time.timeScale` 영향
- WaitForSecondsRealtime: 실시간 기준

## `Awaitable` vs `Task`

둘 다 async/await에 들어가지만 Unity Awaitable은 Unity 실행 모델에 맞춘 별도 타입입니다. 반환 API, continuation 스레드, 인스턴스 재사용 가능 여부 같은 차이를 확인해야 합니다.

## `Action` vs `UnityEvent`

- Action/event: 일반 C#, 코드 중심, 타입 안전하고 가벼움
- UnityEvent: Inspector에서 리스너 연결 및 Unity 직렬화 흐름과 통합

## `System.Object` vs `UnityEngine.Object`

모든 C# 타입의 기반인 `System.Object`와 Unity 엔진 객체 계층의 기반인 `UnityEngine.Object`는 전혀 다른 역할입니다. `Object`라는 짧은 이름이 문맥에 따라 모호하면 전체 네임스페이스를 적어 확인하세요.
