---
layout: default
title: 물리 타입
eyebrow: UnityEngine Physics
---
# 물리 3D / 2D 타입

Unity의 물리 코드를 읽다 보면 `Rigidbody`, `Collider`, `Collision`, `RaycastHit`, `PhysicsMaterial`처럼 이름이 비슷하지만 역할이 전혀 다른 타입을 연속해서 만나게 됩니다. 이 페이지에서는 각 타입을 **무엇을 나타내는지 → 언제 사용하는지 → 어떤 타입과 연결되는지 → 코드에서 어떻게 보이는지 → 주의할 점** 순서로 정리합니다.

> 3D 물리와 2D 물리는 서로 다른 물리 시스템입니다. `Rigidbody`와 `Rigidbody2D`, `Collider`와 `Collider2D`, `RaycastHit`와 `RaycastHit2D`는 이름만 비슷할 뿐 서로 바꾸어 사용할 수 없습니다.

## 한눈에 보기

| 타입 | 종류 | 기반 | 핵심 역할 | 자주 만나는 위치 |
|---|---|---|---|---|
| `Rigidbody` | class | `Component` | 3D 물리 바디 | 힘, 속도, 질량, 회전 |
| `Collider` | class | `Component` | 3D 충돌 형상의 공통 기반 | 충돌 영역, Trigger |
| `BoxCollider` | class | `Collider` | 박스형 충돌체 | 벽, 상자, 단순 히트박스 |
| `SphereCollider` | class | `Collider` | 구형 충돌체 | 범위, 공, 감지 영역 |
| `CapsuleCollider` | class | `Collider` | 캡슐형 충돌체 | 사람형 캐릭터 |
| `MeshCollider` | class | `Collider` | Mesh 기반 충돌체 | 복잡한 지형/정적 형상 |
| `CharacterController` | class | `Collider` | Rigidbody 없이 충돌 제약 이동 | 플레이어 이동 |
| `Collision` | class | - | 한 번의 3D 충돌 사건 정보 | `OnCollisionEnter` 매개변수 |
| `ContactPoint` | struct | - | 충돌 접점 하나 | 접촉 위치/법선 |
| `RaycastHit` | struct | - | 3D 캐스트 적중 결과 | `Physics.Raycast` 결과 |
| `PhysicsMaterial` | class | `Object` | 3D 표면의 마찰/탄성 에셋 | Collider 표면 성질 |
| `Joint` | class | `Component` | 3D Joint 공통 기반 | Rigidbody 연결 |
| `HingeJoint` | class | `Joint` | 한 축을 중심으로 회전 | 문, 경첩 |
| `FixedJoint` | class | `Joint` | 상대 움직임을 강하게 제한 | 물체 결합 |
| `ConfigurableJoint` | class | `Joint` | 축별 이동/회전 제약 | 복잡한 관절 |
| `ForceMode` | enum | - | 힘의 해석 방식 | `AddForce` |
| `QueryTriggerInteraction` | enum | - | 물리 쿼리의 Trigger 처리 | Raycast/Overlap 필터 |
| `Rigidbody2D` | class | `Component` | 2D 물리 바디 | 2D 힘/속도/회전 |
| `Collider2D` | class | `Behaviour` | 2D 충돌 형상의 공통 기반 | 2D 충돌 영역 |
| `BoxCollider2D` | class | `Collider2D` | 2D 사각형 충돌체 | 플랫폼/벽 |
| `CircleCollider2D` | class | `Collider2D` | 2D 원형 충돌체 | 공/감지 범위 |
| `CapsuleCollider2D` | class | `Collider2D` | 2D 캡슐 충돌체 | 캐릭터 |
| `PolygonCollider2D` | class | `Collider2D` | 다각형 충돌체 | 복잡한 2D 형상 |
| `EdgeCollider2D` | class | `Collider2D` | 선분 체인 충돌체 | 지형 경계 |
| `CompositeCollider2D` | class | `Collider2D` | 여러 2D 형상을 합성 | 타일맵/복합 경계 |
| `Collision2D` | class | - | 한 번의 2D 충돌 사건 정보 | `OnCollisionEnter2D` |
| `ContactPoint2D` | struct | - | 2D 접점 하나 | 접촉 위치/법선 |
| `RaycastHit2D` | struct | - | 2D 캐스트 적중 결과 | `Physics2D.Raycast` |
| `PhysicsMaterial2D` | class | `Object` | 2D 마찰/탄성 에셋 | Collider2D 표면 |
| `Joint2D` | class | `Behaviour` | 2D Joint 공통 기반 | 2D 물리 연결 |
| `RigidbodyType2D` | enum | - | Rigidbody2D의 시뮬레이션 방식 | Dynamic/Kinematic/Static |

---

## `Rigidbody`

`Rigidbody`는 **GameObject를 3D 물리 시뮬레이션의 움직이는 바디로 만드는 컴포넌트**입니다. `Transform`만 직접 바꾸는 오브젝트와 달리, Rigidbody가 있는 오브젝트는 질량, 선형 속도, 각속도, 중력, 힘, 충돌 반응 같은 물리 상태를 가집니다.

### 주로 사용하는 상황

- 상자, 공, 차량처럼 충돌에 반응하며 움직이는 오브젝트
- `AddForce`, `AddTorque` 등으로 힘을 가하고 싶은 오브젝트
- 물리 엔진이 위치/회전을 계산하도록 맡기고 싶은 경우
- 다른 Rigidbody 및 Collider와 충돌 반응을 만들어야 하는 경우

### 자주 보는 멤버

- `mass`: 질량
- `linearVelocity`: 월드 공간 선형 속도
- `angularVelocity`: 각속도
- `linearDamping`: 선형 속도 감쇠
- `angularDamping`: 회전 감쇠
- `useGravity`: 중력 적용 여부
- `isKinematic`: 일반적인 동적 힘 계산을 받을지 여부
- `constraints`: 위치/회전 축 고정
- `AddForce`, `AddTorque`: 힘/토크 적용
- `MovePosition`, `MoveRotation`: 물리 이동에 맞춘 위치/회전 갱신

```csharp
public class KnockbackExample : MonoBehaviour
{
    [SerializeField] private Rigidbody body;
    [SerializeField] private float impulse = 8f;

    public void Knockback(Vector3 direction)
    {
        body.AddForce(direction.normalized * impulse, ForceMode.Impulse);
    }
}
```

### `Transform`을 직접 움직이는 것과의 차이

```csharp
transform.position += direction * speed * Time.deltaTime;
```

위 코드는 Transform 값을 직접 바꿉니다. 반면 Rigidbody를 중심으로 움직이는 오브젝트라면 힘 또는 물리 이동 API를 사용하는 편이 충돌 처리와 보간을 일관되게 유지하기 쉽습니다. 특히 동적 Rigidbody의 Transform을 매 프레임 강제로 덮어쓰면 물리 엔진이 계산한 결과와 게임 코드가 서로 경쟁하는 구조가 될 수 있습니다.

### Unity 6에서 이름이 달라진 부분

Unity 6의 현재 API에서는 선형 속도가 `linearVelocity`, 감쇠가 `linearDamping` 이름으로 노출됩니다. 오래된 강의나 예제에서는 `velocity`, `drag`라는 이름을 볼 수 있으므로 **사용 중인 Unity 버전의 Scripting API를 기준으로 확인**하는 습관이 좋습니다.

[Unity 공식 문서: Rigidbody](https://docs.unity3d.com/ScriptReference/Rigidbody.html)

---

## `Collider`

`Collider`는 **3D 공간에서 충돌 판정을 위한 형상(shape)을 제공하는 컴포넌트의 기반 클래스**입니다. 눈에 보이는 Mesh와 Collider는 별개입니다. 화면에 보이는 모델이 복잡하더라도 충돌은 단순한 박스나 캡슐 여러 개로 구성할 수 있습니다.

### Collider가 담당하는 것

- 물체가 어느 공간을 차지하는지 정의
- 다른 Collider와 겹치거나 충돌하는지 판정
- Raycast, SphereCast, Overlap 같은 물리 쿼리의 대상이 됨
- `isTrigger`를 통해 물리 반발 없이 겹침 이벤트만 받을 수 있음
- `PhysicsMaterial`을 통해 마찰/탄성 설정 가능

```csharp
Collider col = GetComponent<Collider>();

Debug.Log(col.bounds.center);
Debug.Log(col.bounds.size);
Debug.Log(col.isTrigger);
```

### `Collider`와 `Collision`은 다르다

- `Collider` = **오브젝트에 붙어 있는 충돌 형상 컴포넌트**
- `Collision` = **이번 프레임에 실제로 발생한 충돌 사건의 상세 데이터**

둘의 이름이 비슷해서 처음에 자주 헷갈립니다.

[Unity 공식 문서: Collider](https://docs.unity3d.com/ScriptReference/Collider.html)

---

## `BoxCollider`

`BoxCollider`는 직육면체 형태의 가장 단순한 3D Collider 중 하나입니다. `center`와 `size`로 로컬 공간에서 위치와 크기를 정합니다.

복잡한 모델이라도 실제 충돌은 여러 개의 BoxCollider로 근사하면 계산 비용과 예측 가능성 측면에서 유리한 경우가 많습니다. 벽, 바닥, 상자, 건물 구조물처럼 각진 오브젝트에서 특히 자주 사용합니다.

```csharp
BoxCollider box = GetComponent<BoxCollider>();
box.center = new Vector3(0f, 1f, 0f);
box.size = new Vector3(1f, 2f, 1f);
```

---

## `SphereCollider`

`SphereCollider`는 구 형태의 충돌체입니다. 중심점과 반지름만으로 표현되기 때문에 단순하고, 모든 방향에 대해 대칭인 오브젝트나 감지 범위에 잘 맞습니다.

공처럼 실제로 둥근 물체뿐 아니라 **공격 탐지, 주변 적 탐색, 상호작용 범위** 같은 보이지 않는 Trigger 영역으로도 자주 사용합니다.

```csharp
SphereCollider sensor = GetComponent<SphereCollider>();
sensor.isTrigger = true;
sensor.radius = 4f;
```

---

## `CapsuleCollider`

`CapsuleCollider`는 원통의 양 끝이 반구로 막힌 캡슐 형태입니다. 사람형 캐릭터처럼 세로로 길고, 바닥이나 벽 모서리에 걸리지 않고 비교적 부드럽게 움직여야 하는 대상에 자주 사용합니다.

`center`, `radius`, `height`, `direction`을 중심으로 크기를 조절합니다. 애니메이션으로 보이는 실제 캐릭터 Mesh와 완전히 같은 모양으로 맞출 필요는 없습니다. 충돌 목적에 맞는 **단순하고 안정적인 형태**를 만드는 것이 일반적입니다.

---

## `MeshCollider`

`MeshCollider`는 Mesh의 형태를 충돌 형상으로 사용하는 Collider입니다. 복잡한 지형이나 단순 프리미티브로 표현하기 어려운 정적 구조물에 유용합니다.

### 사용할 때 생각할 점

- 정적 환경에는 매우 유용할 수 있음
- 복잡한 메시일수록 충돌 계산 비용도 커질 수 있음
- 움직이는 물리 오브젝트에서 사용할 때는 `convex` 설정과 제약을 확인해야 함
- 렌더링 Mesh와 충돌 Mesh를 따로 준비하면 충돌 형상을 더 단순하게 유지할 수 있음

```csharp
MeshCollider collider = GetComponent<MeshCollider>();
collider.sharedMesh = collisionMesh;
collider.convex = true;
```

`MeshFilter.mesh`와 `MeshCollider.sharedMesh`는 역할이 다릅니다. 전자는 렌더링 측 MeshFilter가 사용하는 Mesh이고, 후자는 충돌 계산에 사용하는 Mesh입니다.

---

## `CharacterController`

`CharacterController`는 **Rigidbody의 힘 기반 움직임을 사용하지 않고도 충돌에 의해 제한되는 캐릭터 이동을 만들 수 있는 컴포넌트**입니다. `Collider`를 상속하며, 캡슐 형태의 충돌 영역을 가집니다.

`CharacterController`는 외부 힘에 의해 자동으로 움직이는 Rigidbody와 성격이 다릅니다. 일반적으로 `Move` 또는 `SimpleMove`를 호출할 때 이동하며, 그 이동 과정에서 벽이나 바닥에 의해 제한됩니다.

```csharp
public class CharacterMover : MonoBehaviour
{
    [SerializeField] private CharacterController controller;
    [SerializeField] private float speed = 5f;

    void Update()
    {
        Vector3 input = new Vector3(Input.GetAxisRaw("Horizontal"), 0f,
                                    Input.GetAxisRaw("Vertical"));

        controller.Move(input.normalized * speed * Time.deltaTime);
    }
}
```

### Rigidbody 캐릭터와 차이

- `Rigidbody`: 힘, 충돌 반응, 질량 같은 물리 시뮬레이션을 적극 사용
- `CharacterController`: 코드가 이동량을 결정하고 충돌은 이동을 제한하는 데 사용

둘 중 어느 것이 항상 더 좋은 것은 아니며, 원하는 움직임의 성격에 따라 선택합니다.

[Unity 공식 문서: CharacterController](https://docs.unity3d.com/ScriptReference/CharacterController.html)

---

## `Collision`

`Collision`은 `OnCollisionEnter`, `OnCollisionStay`, `OnCollisionExit` 같은 **3D 충돌 콜백에서 Unity가 넘겨주는 충돌 사건 정보 객체**입니다. Collider 컴포넌트 그 자체가 아니라, “누구와 어떤 속도로 어디에서 부딪혔는가”에 대한 한 번의 사건을 설명합니다.

### 자주 확인하는 정보

- `gameObject`: 상대 GameObject
- `collider`: 상대 Collider
- `transform`: 상대 Transform
- `relativeVelocity`: 두 물체의 상대 속도
- `contactCount`: 접촉점 수
- `GetContact(index)`: 특정 접촉점 조회

```csharp
void OnCollisionEnter(Collision collision)
{
    Debug.Log($"상대: {collision.gameObject.name}");
    Debug.Log($"상대 속도: {collision.relativeVelocity.magnitude}");

    if (collision.contactCount > 0)
    {
        ContactPoint contact = collision.GetContact(0);
        Debug.DrawRay(contact.point, contact.normal, Color.red, 1f);
    }
}
```

Trigger 콜백에서는 일반적으로 `Collision`이 아니라 `Collider`를 받는다는 차이도 중요합니다.

```csharp
void OnTriggerEnter(Collider other)
{
    // Collision이 아니라 Collider
}
```

---

## `ContactPoint`

`ContactPoint`는 두 3D Collider가 실제로 맞닿은 **접촉점 하나**를 나타내는 struct입니다. 충돌 위치, 표면 법선, 관련 Collider 등을 확인할 때 사용합니다.

대표적으로 다음 용도가 있습니다.

- 충돌 위치에 파티클 생성
- 벽/바닥 방향을 법선으로 판단
- 피격 이펙트 방향 결정
- 여러 접촉점 중 특정 지점을 선택

```csharp
ContactPoint contact = collision.GetContact(0);
Vector3 hitPosition = contact.point;
Vector3 surfaceNormal = contact.normal;
```

---

## `RaycastHit`

`RaycastHit`는 `Physics.Raycast`, `SphereCast`, `BoxCast` 같은 3D 물리 캐스트가 무언가를 맞혔을 때 **적중 결과를 담는 struct**입니다.

### 대표 멤버

- `collider`: 맞은 Collider
- `rigidbody`: 해당 Collider와 연결된 Rigidbody가 있으면 참조
- `transform`: 적중 Transform
- `point`: 월드 공간 적중 위치
- `normal`: 맞은 표면의 법선
- `distance`: 캐스트 시작점에서 적중점까지 거리
- `triangleIndex`: MeshCollider 등에서 적중 삼각형 정보가 필요한 경우 사용

```csharp
Ray ray = new Ray(transform.position, transform.forward);

if (Physics.Raycast(ray, out RaycastHit hit, 100f))
{
    Debug.Log(hit.collider.name);
    Debug.Log(hit.point);
    Debug.Log(hit.normal);
    Debug.Log(hit.distance);
}
```

`Ray`는 **질문(어디서 어느 방향으로 쏘는가)**이고, `RaycastHit`는 **답(무엇을 어디에서 맞혔는가)**이라고 생각하면 구분하기 쉽습니다.

---

## `PhysicsMaterial`

`PhysicsMaterial`은 **3D Collider 표면의 마찰과 탄성을 정의하는 Unity 에셋 타입**입니다. 재질이라는 이름이 들어가지만 `Material`처럼 화면에 보이는 색이나 Shader를 결정하는 렌더링 재질이 아닙니다. 오직 **물리적 접촉 반응**에 관여합니다.

### 무엇을 저장하는가

Unity 6의 `PhysicsMaterial`에는 대표적으로 다음 값이 있습니다.

- `staticFriction`: 정지 상태에서 미끄러지기 시작하기 전의 마찰 계수
- `dynamicFriction`: 이미 움직이고 있을 때 사용하는 마찰 계수
- `bounciness`: 탄성. 일반적으로 0이면 튀지 않고, 값이 커질수록 더 튀는 성질
- `frictionCombine`: 두 Collider의 마찰 값을 어떻게 조합할지 결정
- `bounceCombine`: 두 Collider의 탄성 값을 어떻게 조합할지 결정

예를 들어 얼음 바닥에는 마찰이 낮은 PhysicsMaterial을, 고무공에는 탄성이 높은 PhysicsMaterial을 적용할 수 있습니다.

### `Material`과 완전히 다른 타입

```text
Material
└─ 렌더링: Shader, 색, 텍스처, 금속성, 거칠기 등

PhysicsMaterial
└─ 물리: 마찰, 탄성, 두 표면의 결합 방식 등
```

두 타입은 이름에 `Material`이 들어갈 뿐 목적과 시스템이 다릅니다.

### 코드에서 접근

```csharp
[SerializeField] private Collider targetCollider;
[SerializeField] private PhysicsMaterial iceMaterial;

void Start()
{
    targetCollider.sharedMaterial = iceMaterial;
}
```

### `sharedMaterial`과 런타임 변경

Collider가 참조하는 물리 재질을 교체할 때는 해당 API가 공유 에셋을 가리키는지, 런타임 인스턴스가 필요한지 문서를 확인하는 습관이 좋습니다. 프로젝트 에셋 자체의 값을 런타임에 직접 바꾸는 코드는 다른 Collider가 같은 에셋을 공유하는 경우 예상보다 넓은 영향을 줄 수 있습니다.

### 오래된 이름과 Unity 6 이름

오래된 Unity 자료에서는 `PhysicMaterial`이라는 타입명을 볼 수 있습니다. Unity 6의 현재 공식 Scripting API에서는 `PhysicsMaterial`을 사용합니다. 검색할 때 두 이름이 섞여 나올 수 있으므로 버전을 함께 확인하는 편이 안전합니다.

[Unity 공식 문서: PhysicsMaterial](https://docs.unity3d.com/ScriptReference/PhysicsMaterial.html)

---

## `Joint`

`Joint`는 둘 이상의 Rigidbody 사이에 **물리적 연결 또는 제약 조건**을 만드는 3D Joint 계열의 기반 타입입니다. 단순히 부모-자식 Transform 관계를 만드는 것과 달리, 물리 엔진이 힘과 제약을 계산하면서 연결을 유지합니다.

공통적으로 연결 대상 Rigidbody, 파괴 힘/토크, 충돌 허용 여부 같은 설정과 관련됩니다. 실제 게임에서는 `HingeJoint`, `FixedJoint`, `ConfigurableJoint` 등 구체 타입을 사용합니다.

---

## `HingeJoint`

`HingeJoint`는 경첩처럼 **특정 축을 중심으로 회전하도록 제한하는 Joint**입니다. 문, 뚜껑, 바퀴 축, 간단한 관절에 적합합니다.

대표적으로 확인하는 설정은 다음과 같습니다.

- `axis`: 회전축
- `anchor`: 연결 기준점
- `useLimits`: 회전 각도 제한 사용 여부
- `limits`: 최소/최대 회전 범위
- `useMotor`: 모터를 이용한 회전 사용 여부

문이 90도 이상 열리지 않게 하거나, 물리적으로 흔들리는 펜던트 같은 구조를 만들 때 이해하기 쉽습니다.

---

## `FixedJoint`

`FixedJoint`는 두 Rigidbody의 상대적 위치와 회전을 강하게 묶는 Joint입니다. Transform 부모-자식처럼 완전히 수학적으로 고정하는 것이 아니라 **물리 엔진의 제약 조건으로 연결**한다는 점이 중요합니다.

물리적으로 붙어 있다가 특정 힘 이상에서 떨어지는 구조, 손에 잡힌 물체, 임시 결합 등에 사용할 수 있습니다. `breakForce`, `breakTorque` 같은 파괴 기준도 함께 살펴보면 좋습니다.

---

## `ConfigurableJoint`

`ConfigurableJoint`는 이동 X/Y/Z와 회전 축마다 **Free / Limited / Locked** 같은 제약을 세밀하게 지정할 수 있는 고급 Joint입니다. 설정 항목이 많지만, 그만큼 복잡한 관절과 물리 리그를 만들 수 있습니다.

예를 들어 다음과 같은 시스템에 사용될 수 있습니다.

- 래그돌 관절
- 기계식 링크
- 특정 축만 제한된 물리 장치
- 스프링/드라이브 기반 연결

처음부터 이 타입을 모든 연결에 사용하기보다는 `HingeJoint`, `FixedJoint` 등 단순한 Joint로 해결 가능한지 먼저 보는 편이 이해와 유지보수에 유리합니다.

---

## `ForceMode`

`ForceMode`는 `Rigidbody.AddForce`에 전달하여 **입력한 벡터를 어떤 방식의 힘으로 해석할지** 정하는 enum입니다.

대표 값의 개념은 다음처럼 구분할 수 있습니다.

- `Force`: 지속적인 힘처럼 적용
- `Acceleration`: 질량의 영향을 받지 않는 가속도 성격
- `Impulse`: 순간 충격량
- `VelocityChange`: 질량과 무관하게 순간 속도 변화

```csharp
body.AddForce(Vector3.up * 10f, ForceMode.Impulse);
```

같은 벡터 값을 넣어도 ForceMode에 따라 결과의 물리적 의미가 달라집니다. 점프, 폭발 넉백, 지속 추진력처럼 상황의 의미에 맞춰 선택하는 것이 좋습니다.

---

## `QueryTriggerInteraction`

`QueryTriggerInteraction`은 Raycast나 Cast, Overlap 계열 호출에서 **Trigger Collider를 쿼리 결과에 포함할지** 지정하는 enum입니다.

- `UseGlobal`: 프로젝트의 전역 설정을 따름
- `Ignore`: Trigger를 무시
- `Collide`: Trigger도 적중 대상으로 취급

```csharp
if (Physics.Raycast(
        origin,
        direction,
        out RaycastHit hit,
        20f,
        layerMask,
        QueryTriggerInteraction.Ignore))
{
    // Trigger가 아닌 Collider만 대상으로 처리
}
```

LayerMask와 함께 사용하면 “어떤 레이어를 검사할지”와 “Trigger를 포함할지”를 각각 분리해서 제어할 수 있습니다.

---

# 2D 물리 타입

## `Rigidbody2D`

`Rigidbody2D`는 **2D 물리 시뮬레이션의 바디 컴포넌트**입니다. 3D Rigidbody와 비슷하게 보이지만 별도의 2D 물리 엔진을 사용합니다.

대표 상태는 다음과 같습니다.

- `bodyType`: `Dynamic`, `Kinematic`, `Static`
- `mass`: 질량
- `linearVelocity`: X/Y 선형 속도
- `angularVelocity`: 각속도
- `linearDamping`, `angularDamping`: 감쇠
- `gravityScale`: 2D 중력의 적용 배율
- `simulated`: 물리 시뮬레이션 참여 여부

```csharp
Rigidbody2D body = GetComponent<Rigidbody2D>();
body.AddForce(Vector2.up * 5f, ForceMode2D.Impulse);
```

2D에서는 위치/속도 벡터가 `Vector2`이고, 회전은 일반적으로 Z축 회전에 대응하는 각도 값으로 다뤄집니다.

[Unity 공식 문서: Rigidbody2D](https://docs.unity3d.com/ScriptReference/Rigidbody2D.html)

---

## `RigidbodyType2D`

`RigidbodyType2D`는 `Rigidbody2D.bodyType`에 들어가는 enum으로, 2D 바디가 물리 시뮬레이션에서 어떤 방식으로 움직이는지를 구분합니다.

- `Dynamic`: 힘, 중력, 충돌 반응을 일반적으로 받는 동적 바디
- `Kinematic`: 게임 코드가 움직임을 주도하며 동적 바디와 다른 방식으로 상호작용하는 바디
- `Static`: 움직이지 않는 환경/고정 바디

```csharp
Rigidbody2D body = GetComponent<Rigidbody2D>();
body.bodyType = RigidbodyType2D.Dynamic;
```

단순히 “움직이면 Dynamic, 안 움직이면 Static”으로만 외우기보다, 어떤 주체가 이동을 결정하는지와 어떤 충돌 반응이 필요한지를 함께 보고 선택하는 것이 좋습니다.

---

## `Collider2D`

`Collider2D`는 2D 충돌 형상의 공통 기반입니다. `BoxCollider2D`, `CircleCollider2D`, `CapsuleCollider2D`, `PolygonCollider2D` 등이 이를 상속합니다.

3D Collider와 마찬가지로 Trigger로 사용할 수 있고, `bounds`, `isTrigger`, `attachedRigidbody`, `sharedMaterial` 같은 물리 관련 정보를 제공합니다. 하지만 3D `Collider`와 타입 호환은 되지 않습니다.

```csharp
Collider2D col = GetComponent<Collider2D>();
if (col.isTrigger)
{
    Debug.Log("이 Collider2D는 Trigger입니다.");
}
```

---

## `BoxCollider2D`

2D 사각형 충돌 영역입니다. 플랫폼, 벽, 상자, UI와 별개의 월드 공간 히트박스 등에 널리 사용합니다. 단순한 형상이라 조정이 쉽고, 가능하면 복잡한 PolygonCollider2D 대신 여러 단순 Collider로 구성하는 방법도 고려할 수 있습니다.

---

## `CircleCollider2D`

2D 원형 충돌 영역입니다. 공, 원형 투사체, 감지 반경처럼 방향에 따른 형상 차이가 필요 없는 대상에 적합합니다.

```csharp
CircleCollider2D circle = GetComponent<CircleCollider2D>();
circle.radius = 0.75f;
```

---

## `CapsuleCollider2D`

2D 캡슐 형태의 충돌 영역입니다. 세로로 긴 캐릭터가 바닥 모서리나 경사면을 이동할 때 사각형보다 부드러운 결과를 얻기 쉬운 경우가 있습니다.

---

## `PolygonCollider2D`

여러 점으로 구성된 다각형 형태의 2D Collider입니다. 스프라이트 외곽선과 비슷한 복잡한 충돌 영역이 필요한 경우 유용하지만, 점 수가 많을수록 관리와 계산이 복잡해질 수 있습니다.

단순 충돌이면 Box/Circle/Capsule을 우선 고려하고, 실제로 형상 정확도가 필요할 때 PolygonCollider2D를 사용하는 편이 좋습니다.

---

## `EdgeCollider2D`

`EdgeCollider2D`는 내부가 채워진 면이 아니라 **연결된 선분 체인**을 충돌 경계로 사용합니다. 바닥 윤곽선, 지형 경계, 일방향 느낌의 레벨 외곽 등을 구성할 때 유용합니다.

폐곡면 내부까지 충돌 영역으로 채워야 한다면 PolygonCollider2D와 역할이 다르다는 점을 기억하세요.

---

## `CompositeCollider2D`

`CompositeCollider2D`는 여러 2D Collider의 형상을 하나의 복합 충돌 형태로 합치는 데 사용합니다. 특히 많은 타일이나 작은 Collider가 이어지는 환경에서 경계를 정리하는 용도로 자주 등장합니다.

단순히 “Collider 여러 개를 가진다”와는 다르게, 실제 합성 방식과 연결 설정이 관련되므로 Tilemap Collider와 함께 사용할 때 공식 Manual의 설정 흐름을 같이 보는 편이 좋습니다.

---

## `Collision2D`

`Collision2D`는 2D 충돌 콜백의 사건 데이터입니다.

```csharp
void OnCollisionEnter2D(Collision2D collision)
{
    Debug.Log(collision.gameObject.name);
    Debug.Log(collision.relativeVelocity);
}
```

3D의 `Collision`과 개념은 비슷하지만 다른 타입입니다. 따라서 다음 두 콜백은 서로 다른 시스템에 속합니다.

```csharp
void OnCollisionEnter(Collision collision) { }
void OnCollisionEnter2D(Collision2D collision) { }
```

---

## `ContactPoint2D`

`ContactPoint2D`는 2D 충돌의 접촉점 하나입니다. `point`, `normal`, 관련 Collider/Rigidbody 정보 등을 통해 어디서 어떤 방향으로 접촉했는지 확인할 수 있습니다.

발바닥 접촉점을 이용한 바닥 판정, 충돌 위치 이펙트, 벽 방향 판단 등에 활용할 수 있습니다.

---

## `RaycastHit2D`

`RaycastHit2D`는 `Physics2D.Raycast` 등 2D 캐스트의 적중 결과입니다.

```csharp
RaycastHit2D hit = Physics2D.Raycast(transform.position, Vector2.down, 2f, groundMask);

if (hit.collider != null)
{
    Debug.Log(hit.collider.name);
    Debug.Log(hit.point);
    Debug.Log(hit.normal);
}
```

3D Raycast는 보통 `bool` 반환 + `out RaycastHit` 패턴을 많이 보고, 2D API는 `RaycastHit2D` 값을 직접 반환하는 오버로드도 흔히 보게 됩니다. 사용 중인 오버로드의 반환형을 IDE에서 확인하는 습관이 중요합니다.

---

## `PhysicsMaterial2D`

`PhysicsMaterial2D`는 **Collider2D의 표면 마찰과 탄성을 정의하는 2D 전용 에셋**입니다. 3D의 `PhysicsMaterial`과 개념은 유사하지만 서로 다른 타입입니다.

대표 값은 다음과 같습니다.

- `friction`: 마찰 계수
- `bounciness`: 탄성 계수
- `frictionCombine`: 두 표면의 마찰 조합 방법
- `bounceCombine`: 두 표면의 탄성 조합 방법

```csharp
[SerializeField] private Collider2D target;
[SerializeField] private PhysicsMaterial2D slippery;

void Awake()
{
    target.sharedMaterial = slippery;
}
```

[Unity 공식 문서: PhysicsMaterial2D](https://docs.unity3d.com/ScriptReference/PhysicsMaterial2D.html)

---

## `Joint2D`

`Joint2D`는 2D Joint 계열의 공통 기반입니다. 구체적으로 `HingeJoint2D`, `DistanceJoint2D`, `FixedJoint2D`, `SpringJoint2D`, `SliderJoint2D`, `TargetJoint2D`, `WheelJoint2D` 같은 타입이 있습니다.

Joint는 Transform 부모-자식 관계가 아니라 **2D 물리 시뮬레이션의 제약 조건**입니다. 따라서 연결된 Rigidbody2D 사이의 힘과 움직임이 물리적으로 계산됩니다.

---

# 같이 알아두면 좋은 정적 API

## `Physics`

`Physics`는 특정 GameObject에 붙이는 컴포넌트가 아니라 **3D 물리 전역 기능을 제공하는 정적 클래스**입니다. Raycast, SphereCast, OverlapSphere 같은 쿼리와 전역 물리 설정을 여기서 접합니다.

```csharp
bool blocked = Physics.CheckSphere(
    transform.position,
    0.5f,
    obstacleMask,
    QueryTriggerInteraction.Ignore);
```

## `Physics2D`

`Physics2D`는 2D 물리 전역 API입니다. `Raycast`, `OverlapCircle`, `OverlapBox` 등 2D 전용 쿼리를 제공합니다.

```csharp
Collider2D target = Physics2D.OverlapCircle(transform.position, 3f, enemyMask);
```

---

# 자주 헷갈리는 조합

| 조합 | 구분 기준 |
|---|---|
| `Rigidbody` vs `Collider` | Rigidbody는 물리 **상태와 움직임**, Collider는 **충돌 형상** |
| `Collider` vs `Collision` | Collider는 컴포넌트, Collision은 **한 번의 충돌 사건 데이터** |
| `Ray` vs `RaycastHit` | Ray는 입력, RaycastHit는 적중 결과 |
| `Material` vs `PhysicsMaterial` | Material은 렌더링, PhysicsMaterial은 마찰/탄성 |
| `Rigidbody` vs `CharacterController` | 힘 기반 물리 이동 vs 코드 주도 충돌 제약 이동 |
| `Rigidbody` vs `Rigidbody2D` | 3D 물리와 2D 물리는 별도 시스템 |
| `PhysicsMaterial` vs `PhysicsMaterial2D` | 3D Collider용 vs 2D Collider용 |

## 학습 순서 추천

처음 물리를 공부한다면 다음 순서로 보는 것이 이해하기 쉽습니다.

1. `Collider` / `Collider2D` — 충돌 영역이 무엇인지
2. `Rigidbody` / `Rigidbody2D` — 물리적으로 움직이는 바디가 무엇인지
3. `Collision` / `Collision2D` — 실제 충돌 사건을 어떻게 받는지
4. `RaycastHit` / `RaycastHit2D` — 충돌이 일어나기 전에 공간을 어떻게 조회하는지
5. `PhysicsMaterial` / `PhysicsMaterial2D` — 표면 반응을 어떻게 조절하는지
6. `Joint` 계열 — 물리 바디 사이의 관계를 어떻게 제약하는지

이 흐름을 이해하면 이후 `Physics.Raycast`, LayerMask, Trigger, CharacterController 같은 API가 훨씬 자연스럽게 연결됩니다.
