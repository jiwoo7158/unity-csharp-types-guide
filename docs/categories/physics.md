---
layout: default
title: 물리 타입
eyebrow: UnityEngine Physics
---
# 물리 3D / 2D 타입

3D 물리와 2D 물리는 이름이 비슷해도 **서로 다른 물리 시스템과 타입 계층**입니다.

| 타입 | 종류 | 기반 | 핵심 | 대표 사용 |
|---|---|---|---|---|
| Rigidbody | class | Component | 3D 물리 바디 | 힘/속도/질량/회전 |
| Collider | class | Component | 3D Collider 공통 기반 | 충돌 영역 |
| BoxCollider | class | Collider | 박스 충돌체 | 상자/벽 |
| SphereCollider | class | Collider | 구 충돌체 | 구형 범위 |
| CapsuleCollider | class | Collider | 캡슐 충돌체 | 캐릭터 |
| MeshCollider | class | Collider | Mesh 기반 충돌체 | 복잡한 형상 |
| CharacterController | class | Collider | 캐릭터 이동용 충돌 컨트롤러 | 비-Rigidbody 캐릭터 이동 |
| Collision | class | - | 3D 충돌 콜백 상세 데이터 | OnCollision... 매개변수 |
| ContactPoint | struct | - | 3D 접촉점 | Collision.GetContact |
| RaycastHit | struct | - | 3D 캐스트 적중 결과 | Physics.Raycast |
| PhysicsMaterial | class | Object | 마찰/탄성 에셋 | Collider 표면 성질 |
| Joint | class | Component | 3D Joint 기반 | 물리 연결 |
| HingeJoint | class | Joint | 힌지 회전 Joint | 문/관절 |
| FixedJoint | class | Joint | 고정 연결 Joint | 물체 결합 |
| ConfigurableJoint | class | Joint | 고급 제약 Joint | 복잡한 관절 |
| ForceMode | enum | - | 힘 적용 방식 | Force/Impulse 등 |
| QueryTriggerInteraction | enum | - | 쿼리의 Trigger 처리 방식 | Raycast 필터 |
| Rigidbody2D | class | Component | 2D 물리 바디 | 2D 힘/속도 |
| Collider2D | class | Behaviour | 2D Collider 공통 기반 | 2D 충돌 영역 |
| BoxCollider2D | class | Collider2D | 2D 박스 | 플랫폼/벽 |
| CircleCollider2D | class | Collider2D | 2D 원 | 원형 히트박스 |
| CapsuleCollider2D | class | Collider2D | 2D 캡슐 | 캐릭터 |
| PolygonCollider2D | class | Collider2D | 2D 폴리곤 | 복잡한 2D 형상 |
| EdgeCollider2D | class | Collider2D | 선분 체인 | 지형 경계 |
| CompositeCollider2D | class | Collider2D | 여러 2D Collider 합성 | 타일맵형 경계 |
| Collision2D | class | - | 2D 충돌 콜백 데이터 | OnCollision...2D |
| ContactPoint2D | struct | - | 2D 접촉점 | Collision2D |
| RaycastHit2D | struct | - | 2D 캐스트 결과 | Physics2D.Raycast |
| PhysicsMaterial2D | class | Object | 2D 마찰/탄성 에셋 | Collider2D 표면 |
| Joint2D | class | Behaviour | 2D Joint 기반 | 2D 물리 연결 |
| RigidbodyType2D | enum | - | 2D 바디 타입 | Dynamic/Kinematic/Static |


## `Rigidbody`

3D 물리 시뮬레이션에서 질량, 속도, 힘, 회전을 가지는 바디입니다.

```csharp
Rigidbody rb = GetComponent<Rigidbody>();
rb.AddForce(transform.forward * 10f, ForceMode.Impulse);
Vector3 velocity = rb.linearVelocity;
```

Unity 6 문서에서는 선형 속도 관련 프로퍼티가 `linearVelocity`, 감쇠가 `linearDamping` 이름으로 제공됩니다. 버전별 API 이름 차이를 확인하는 습관이 좋습니다.

## `Collider`

3D 충돌 형상의 공통 기반입니다. `BoxCollider`, `SphereCollider`, `CapsuleCollider`, `MeshCollider` 등이 있습니다.

```csharp
Collider col = GetComponent<Collider>();
Bounds b = col.bounds;
bool trigger = col.isTrigger;
```

## `Collision`

`OnCollisionEnter(Collision collision)` 같은 콜백에서 Unity가 전달하는 **충돌 사건의 상세 정보 객체**입니다. Collider 그 자체와 다릅니다.

```csharp
void OnCollisionEnter(Collision collision)
{
    GameObject other = collision.gameObject;
    Vector3 relative = collision.relativeVelocity;
}
```

## `RaycastHit`

`Physics.Raycast`가 맞춘 결과를 담는 struct입니다.

```csharp
if (Physics.Raycast(ray, out RaycastHit hit, 50f))
{
    Collider hitCollider = hit.collider;
    Vector3 point = hit.point;
    Vector3 normal = hit.normal;
}
```

## `PhysicsMaterial`

3D Collider 표면의 마찰과 탄성을 정의하는 Unity 에셋입니다. 오래된 자료의 `PhysicMaterial` 표기와 최신 Unity 6의 `PhysicsMaterial` 이름을 구분하세요.

## `Rigidbody2D` / `Collider2D`

2D 물리 전용입니다. 3D `Rigidbody`와 `Collider`로 서로 바꾸어 쓸 수 없습니다.

```csharp
Rigidbody2D rb = GetComponent<Rigidbody2D>();
Vector2 v = rb.linearVelocity;
```

## `Collision2D` / `RaycastHit2D`

2D 물리 콜백과 캐스트 결과도 별도 타입을 씁니다. 3D 버전과 멤버 구성이 비슷해 보여도 시스템이 분리되어 있습니다.
