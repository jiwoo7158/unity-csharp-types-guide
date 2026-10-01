---
layout: default
title: 빠른 치트시트
eyebrow: Quick Reference
---
# 빠른 치트시트

## 하고 싶은 일 → 먼저 떠올릴 타입

| 하고 싶은 일 | 우선 볼 타입 | 메모 |
|---|---|---|
| 정수 저장 | `int` | 대부분의 게임 정수 기본 선택 |
| 소수/비율/속도 | `float` | Unity 수학 API의 기본 실수 타입 |
| 문자열 | `string` | 이름, 설명, 경로 |
| 참/거짓 | `bool` | 상태 플래그 |
| 여러 선택지 | `enum` | 모드/상태/종류 |
| 고정 길이 목록 | `T[]` | 배열 |
| 늘고 줄어드는 목록 | `List<T>` | 가장 흔한 가변 목록 |
| 외부에 목록 읽기만 노출 | `IReadOnlyList<T>` | Count + index 읽기 |
| foreach만 필요 | `IEnumerable<T>` | 가장 느슨한 순회 계약 |
| 키로 값 찾기 | `Dictionary<TKey,TValue>` | 기본 Inspector 직렬화는 X |
| 중복 없는 집합 | `HashSet<T>` | 빠른 Contains |
| 먼저 들어온 것부터 처리 | `Queue<T>` | FIFO |
| 마지막에 넣은 것부터 처리 | `Stack<T>` | LIFO |
| 2D 실수 좌표/방향 | `Vector2` | x, y |
| 3D 위치/방향/속도 | `Vector3` | x, y, z |
| 그리드 정수 좌표 | `Vector2Int`, `Vector3Int` | 셀/타일 |
| 3D 회전 | `Quaternion` | Transform.rotation |
| 색 | `Color`, `Color32` | float RGBA / byte RGBA |
| 3D 영역 | `Bounds` | Renderer/Collider bounds |
| 광선 | `Ray` | Raycast 입력 |
| 광선 적중 결과 | `RaycastHit`, `RaycastHit2D` | out 결과 |
| 씬 오브젝트 자체 | `GameObject` | Component 컨테이너 |
| 위치/회전/계층 | `Transform` | 모든 GameObject에 존재 |
| 사용자 컴포넌트 | `MonoBehaviour` | GameObject에 부착 |
| 공유 데이터 에셋 | `ScriptableObject` | 독립 Unity Object |
| 3D 물리 움직임 | `Rigidbody` | AddForce 등 |
| 3D 충돌 영역 | `Collider` | Box/Sphere/Capsule/Mesh |
| 2D 물리 움직임 | `Rigidbody2D` | 3D와 별도 시스템 |
| 렌더링 재질 | `Material` | Shader + property |
| 메시 데이터 | `Mesh` | vertices/triangles/UV |
| 캐릭터 스킨 렌더러 | `SkinnedMeshRenderer` | bones + skinned mesh |
| 애니메이션 상태 머신 | `Animator` | Animator Controller |
| 실제 애니메이션 데이터 | `AnimationClip` | clip asset |
| 소리 데이터 | `AudioClip` | 재생할 에셋 |
| 소리 재생 컴포넌트 | `AudioSource` | clip을 재생 |
| 코루틴 메서드 | `IEnumerator` | yield return |
| 실행 중 코루틴 핸들 | `Coroutine` | StopCoroutine 등에 사용 |
| 초 단위 코루틴 대기 | `WaitForSeconds` | scaled time |
| Unity async/await | `Awaitable` | Unity 6 기본 비동기 타입 |
| 씬 참조/정보 | `Scene` | struct 핸들 |
| 씬 로드 | `SceneManager` | static API |
| C# 콜백 | `Action`, `Func<T>` | delegate |
| Inspector 이벤트 | `UnityEvent` | 직렬화 가능한 이벤트 |

## 컬렉션 선택 미니 가이드

```text
순서가 필요한가?
├─ 아니오 → 중복 제거가 중요? → HashSet<T>
│          키로 조회? → Dictionary<TKey,TValue>
└─ 예
   ├─ 크기가 고정 → T[]
   └─ 크기가 변함 → List<T>
                 ├─ 외부에 수정 허용 → List<T> / IList<T>
                 └─ 외부에 읽기 위주 → IReadOnlyList<T>
```

## Unity 오브젝트 관계 미니 가이드

```text
GameObject = 씬 오브젝트 컨테이너
Component  = GameObject에 붙는 기능
Transform  = 모든 GameObject에 항상 있는 Component
MonoBehaviour = 내가 작성하는 Component 스크립트의 일반 기반
ScriptableObject = GameObject에 붙지 않는 Unity 데이터 Object
```
