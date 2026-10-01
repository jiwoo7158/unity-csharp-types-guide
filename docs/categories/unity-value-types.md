---
layout: default
title: Unity 수학 / 값 타입
eyebrow: UnityEngine Structs
---
# Unity 수학 / 값 타입

Unity 코드에서 `Vector3`, `Quaternion`, `Color`, `Bounds`, `Ray` 같은 타입은 매우 자주 등장합니다. 이들은 대부분 `struct`인 **값 타입**이라서 클래스 참조와 다르게 값 자체가 복사되는 성격을 갖습니다.

이 페이지에서는 단순히 “Vector3는 3차원 벡터”라고 끝내지 않고, **같은 타입이 어떤 의미로 쓰이는지, 어떤 프로퍼티와 메서드를 자주 보는지, 무엇과 혼동하기 쉬운지**를 중심으로 정리합니다.

## 먼저 기억할 것: 값 타입은 복사된다

```csharp
Vector3 a = transform.position;
Vector3 b = a;

b.x = 100f;

Debug.Log(a.x); // a 자체가 함께 바뀌는 것은 아님
```

또한 `transform.position` 같은 프로퍼티는 Vector3 값을 반환합니다. 따라서 다음처럼 멤버 하나만 바로 바꾸는 코드는 사용할 수 없습니다.

```csharp
// transform.position.x = 10f; // 불가
```

대신 값을 꺼내 수정한 뒤 다시 넣습니다.

```csharp
Vector3 position = transform.position;
position.x = 10f;
transform.position = position;
```

---

# 벡터

## `Vector2`

`Vector2`는 `x`, `y` 두 개의 `float` 성분을 가진 2차원 벡터입니다. 2D 위치나 방향에만 쓰이는 것이 아니라, **두 개의 실수 값을 한 쌍으로 표현하는 곳**에서 폭넓게 사용됩니다.

### 대표적인 의미

- 2D 월드 위치
- 2D 이동 방향
- `Rigidbody2D.linearVelocity`
- UV 좌표
- 화면/GUI 좌표의 일부
- 폭과 높이처럼 두 수의 묶음

```csharp
Vector2 position = new Vector2(3f, 2f);
Vector2 direction = Vector2.right;
Vector2 velocity = direction * 5f;
```

### 자주 보는 멤버

- `x`, `y`
- `magnitude`: 길이
- `sqrMagnitude`: 길이의 제곱
- `normalized`: 길이가 1인 방향 벡터
- `zero`, `one`, `up`, `down`, `left`, `right`
- `Distance`, `Dot`, `Lerp`, `MoveTowards`

### `magnitude`와 `sqrMagnitude`

거리 비교에서 실제 거리 값이 필요하지 않다면 제곱 길이를 비교할 수 있습니다.

```csharp
float maxDistance = 10f;
Vector2 delta = target - current;

if (delta.sqrMagnitude <= maxDistance * maxDistance)
{
    // 범위 안
}
```

---

## `Vector3`

`Vector3`는 Unity에서 가장 자주 보는 값 타입 중 하나입니다. `x`, `y`, `z` 세 실수 성분을 가집니다.

중요한 점은 **Vector3라는 타입 자체가 위치, 방향, 속도, 스케일 중 하나로 고정된 것이 아니라는 점**입니다. 같은 세 숫자를 상황에 따라 서로 다른 의미로 해석합니다.

```csharp
Vector3 position = transform.position;          // 위치
Vector3 direction = transform.forward;          // 방향
Vector3 scale = transform.localScale;           // 스케일
Vector3 velocity = rigidbody.linearVelocity;    // 속도
Vector3 force = Vector3.up * 10f;                // 힘 벡터
```

### 위치와 방향을 구분해서 생각하기

```csharp
Vector3 from = transform.position;
Vector3 to = target.position;
Vector3 direction = (to - from).normalized;
```

`to - from`은 두 위치의 차이이므로 방향/변위 벡터가 됩니다.

반대로:

```csharp
Vector3 nextPosition = from + direction * distance;
```

위치에 방향×거리를 더하면 새로운 위치를 만들 수 있습니다.

### 자주 보는 정적 값

- `Vector3.zero` = `(0,0,0)`
- `Vector3.one` = `(1,1,1)`
- `Vector3.up` = `(0,1,0)`
- `Vector3.down`
- `Vector3.left`, `right`
- `Vector3.forward` = `(0,0,1)`
- `Vector3.back`

### `normalized`

방향만 필요할 때 벡터의 길이를 1로 맞춥니다.

```csharp
Vector3 direction = (target.position - transform.position).normalized;
```

영 벡터의 정규화처럼 길이가 0인 상황을 포함해, 실제 게임 로직에서는 입력 벡터나 목표점이 같은 경우를 함께 생각하는 것이 좋습니다.

### `Dot`

두 방향의 관계를 판단할 때 자주 사용합니다.

```csharp
Vector3 toTarget = (target.position - transform.position).normalized;
float dot = Vector3.Dot(transform.forward, toTarget);

if (dot > 0.5f)
{
    // 대략 앞쪽에 있음
}
```

### `Cross`

두 벡터에 수직인 벡터를 구합니다. 방향 판정, 회전축 계산 등 3D 수학에서 사용합니다.

### 이동 계열 함수

- `Lerp(a, b, t)`: 비율 `t`에 따른 선형 보간
- `MoveTowards(current, target, maxDistanceDelta)`: 한 프레임에 최대 거리만큼 목표로 이동
- `SmoothDamp`: 부드러운 감쇠 이동

이 함수들은 이름이 비슷하지만 시간에 대한 의미가 다릅니다. 특히 Lerp에 매 프레임 고정 비율을 넣는 방식은 “일정 속도 이동”과 다릅니다.

[Unity 공식 문서: Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html)

---

## `Vector4`

`Vector4`는 `x`, `y`, `z`, `w` 네 개의 float 성분을 가집니다. 일반적인 3D 위치보다 **Shader 프로퍼티, 수학 데이터, 4성분 파라미터**에서 더 자주 보입니다.

```csharp
Vector4 data = new Vector4(1f, 2f, 3f, 4f);
```

`Color`도 네 성분을 가지지만 의미가 RGBA로 고정되어 있습니다. 반면 Vector4는 네 성분의 의미를 호출자가 정합니다.

---

## `Vector2Int`

`Vector2Int`는 두 개의 `int` 성분을 갖는 정수 벡터입니다. 연속적인 공간보다 **격자 좌표**에 적합합니다.

```csharp
Vector2Int cell = new Vector2Int(4, 7);
```

대표 사용 예:

- 타일 좌표
- 보드게임 셀
- 2D 그리드 인덱스
- 정수 크기/해상도 계산

float 기반 Vector2와 달리 중간 소수 위치를 표현하지 않습니다.

---

## `Vector3Int`

`Vector3Int`는 정수 3차원 좌표입니다. Tilemap의 셀 위치, 복셀 좌표, 3D 격자 등에 자연스럽습니다.

```csharp
Vector3Int cell = new Vector3Int(10, 2, -3);
```

`Transform.position`처럼 연속적인 월드 좌표에 직접 쓰는 타입은 `Vector3`이고, “몇 번째 셀인가?” 같은 이산 좌표에는 `Vector3Int`가 적합합니다.

---

# 회전

## `Quaternion`

`Quaternion`은 Unity에서 **3D 회전을 표현하는 핵심 struct**입니다. 네 개의 성분 `x`, `y`, `z`, `w`를 갖지만, 일반적으로 이 성분을 직접 수정하지 않습니다.

```csharp
Quaternion rotation = transform.rotation;
```

### Euler 각도와의 관계

사람은 `(pitch, yaw, roll)`처럼 각도로 생각하기 편하지만 Unity 내부의 일반적인 3D 회전 표현은 Quaternion입니다.

```csharp
Quaternion rotation = Quaternion.Euler(0f, 90f, 0f);
transform.rotation = rotation;
```

Quaternion을 다시 Euler 각도로 읽을 수도 있습니다.

```csharp
Vector3 angles = transform.rotation.eulerAngles;
```

하지만 Euler 각도를 매 프레임 읽어 수정하고 다시 넣는 방식은 0/360도 래핑이나 표현상의 특성 때문에 예상하기 어려운 결과를 만들 수 있습니다. 가능하면 “현재 회전에 회전을 더한다”, “특정 방향을 바라본다” 같은 회전 연산을 Quaternion API로 표현하는 편이 좋습니다.

### 자주 보는 함수

- `Quaternion.identity`: 회전 없음
- `Quaternion.Euler`: Euler 각도로 Quaternion 생성
- `Quaternion.LookRotation`: 특정 방향을 바라보는 회전 생성
- `Quaternion.AngleAxis`: 축과 각도로 회전 생성
- `Quaternion.Lerp`, `Slerp`: 회전 보간
- `Quaternion.RotateTowards`: 제한된 각속도로 목표 회전에 접근

```csharp
Vector3 direction = target.position - transform.position;
if (direction.sqrMagnitude > 0.0001f)
{
    Quaternion targetRotation = Quaternion.LookRotation(direction.normalized);
    transform.rotation = Quaternion.RotateTowards(
        transform.rotation,
        targetRotation,
        180f * Time.deltaTime);
}
```

### 회전 곱셈

Quaternion 곱셈은 회전을 조합합니다. 순서가 결과에 영향을 줍니다.

```csharp
Quaternion yaw = Quaternion.Euler(0f, 90f, 0f);
Vector3 turned = yaw * Vector3.forward;
```

[Unity 공식 문서: Quaternion](https://docs.unity3d.com/ScriptReference/Quaternion.html)

---

# 행렬

## `Matrix4x4`

`Matrix4x4`는 4×4 행렬입니다. 3D 그래픽스에서 위치 이동, 회전, 스케일을 포함한 변환을 하나의 행렬로 표현하는 데 사용합니다.

Unity의 일반 게임플레이 코드는 Transform API만으로 충분한 경우가 많지만, 다음 상황에서 자주 접합니다.

- `localToWorldMatrix`, `worldToLocalMatrix`
- Shader에 행렬 전달
- 커스텀 좌표 변환
- 그래픽스/렌더링 고급 코드

```csharp
Matrix4x4 matrix = transform.localToWorldMatrix;
Vector3 worldPoint = matrix.MultiplyPoint3x4(localPoint);
```

### Point와 Vector 변환 차이

위치는 translation 영향을 받아야 하지만 방향 벡터는 위치 이동 영향을 받으면 안 됩니다. 그래서 행렬 API에서도 점과 방향에 대한 변환 함수가 분리되어 있습니다.

---

# 색

## `Color`

`Color`는 `r`, `g`, `b`, `a`를 float로 갖는 색 타입입니다. 일반적으로 각 성분은 0~1 범위로 다루지만 HDR이나 특정 렌더링 흐름에서는 1보다 큰 값도 의미가 있을 수 있습니다.

```csharp
Color color = new Color(1f, 0.5f, 0f, 1f);
```

자주 보는 정적 색상:

```csharp
Color.red
Color.green
Color.blue
Color.white
Color.black
Color.clear
```

### 보간

```csharp
Color mixed = Color.Lerp(Color.red, Color.blue, 0.5f);
```

Material, SpriteRenderer, UI 색 등 여러 렌더링 API에서 접합니다.

---

## `Color32`

`Color32`는 각 RGBA 성분을 `byte`(0~255)로 저장합니다.

```csharp
Color32 pixel = new Color32(255, 128, 0, 255);
```

대량 픽셀 데이터나 바이트 단위 색상이 자연스러운 곳에서 이해하기 쉽습니다. Unity는 Color와 Color32 사이 변환을 지원하는 API가 많습니다.

### `Color`와 비교

| 타입 | 성분 타입 | 읽기 쉬운 범위 | 대표 용도 |
|---|---|---|---|
| `Color` | `float` | 0~1 중심 | 일반 렌더링 수학 |
| `Color32` | `byte` | 0~255 | 픽셀/바이트 데이터 |

---

# 2D 사각형

## `Rect`

`Rect`는 2D 축 정렬 사각형을 나타내는 struct입니다. 위치와 크기 또는 min/max 경계로 다룰 수 있습니다.

```csharp
Rect area = new Rect(10f, 20f, 100f, 50f);
```

자주 보는 값:

- `x`, `y`, `width`, `height`
- `xMin`, `xMax`, `yMin`, `yMax`
- `center`, `position`, `size`
- `Contains(point)`
- `Overlaps(other)`

IMGUI, 화면 영역, 뷰포트, Sprite/Texture 관련 API 등에서 나타납니다.

---

## `RectInt`

`RectInt`는 정수 좌표/크기를 사용하는 사각형입니다. 그리드 셀 영역처럼 정수 경계가 자연스러운 곳에 맞습니다.

```csharp
RectInt region = new RectInt(0, 0, 16, 16);
```

---

# 3D 경계

## `Bounds`

`Bounds`는 **3D 축 정렬 바운딩 박스(AABB)** 를 나타냅니다. 중심 `center`와 전체 크기 `size`를 중심으로 표현되며, 월드 공간의 Renderer/Collider 경계에서 자주 봅니다.

```csharp
Bounds bounds = renderer.bounds;
Debug.Log(bounds.center);
Debug.Log(bounds.size);
Debug.Log(bounds.extents);
```

### 자주 보는 기능

- `Contains(point)`: 점 포함 여부
- `Intersects(other)`: 다른 Bounds와 겹치는지
- `ClosestPoint(point)`: 가장 가까운 점
- `Encapsulate(...)`: 다른 점/Bounds를 포함하도록 확장
- `Expand(amount)`: 경계 확장

### 회전된 박스 그 자체는 아니다

Bounds는 축 정렬 박스이므로 회전 정보를 직접 저장하지 않습니다. 회전된 Renderer를 감싸는 월드 AABB는 실제 Mesh보다 여유 공간이 생길 수 있습니다.

---

## `BoundsInt`

`BoundsInt`는 정수 3D 영역입니다. Tilemap/셀/복셀처럼 정수 격자 범위를 표현할 때 유용합니다.

```csharp
BoundsInt cells = new BoundsInt(0, 0, 0, 10, 5, 1);
```

---

# 광선과 평면

## `Ray`

`Ray`는 **원점(origin)과 방향(direction)** 으로 정의되는 3D 광선입니다. 자체적으로 충돌 판정을 수행하지 않고, Physics API 등에 전달하는 입력 데이터입니다.

```csharp
Ray ray = new Ray(camera.transform.position, camera.transform.forward);
```

카메라 화면 좌표로부터 Ray를 만들 수도 있습니다.

```csharp
Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
```

그리고 물리 시스템에 질문합니다.

```csharp
if (Physics.Raycast(ray, out RaycastHit hit, 100f))
{
    Debug.Log(hit.collider.name);
}
```

`Ray`와 `RaycastHit`의 차이를 기억하세요.

- `Ray` = 어디에서 어느 방향으로 검사할지
- `RaycastHit` = 무엇을 어디에서 맞혔는지

---

## `Ray2D`

`Ray2D`는 2D 원점과 방향을 가진 값 타입입니다. 다만 Unity 2D 물리 API에서는 `origin`, `direction`을 각각 인자로 받는 오버로드를 자주 보므로 3D Ray만큼 항상 눈에 띄지는 않을 수 있습니다.

---

## `Plane`

`Plane`은 3D 공간의 무한한 평면을 나타냅니다. 법선(normal)과 평면의 거리 정보로 정의됩니다.

```csharp
Plane ground = new Plane(Vector3.up, Vector3.zero);
Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);

if (ground.Raycast(ray, out float enter))
{
    Vector3 point = ray.GetPoint(enter);
}
```

물리 Collider가 없어도 수학적으로 평면과 Ray의 교차점을 구할 수 있다는 점이 특징입니다.

---

# 물리 결과 값 타입

## `RaycastHit`

`RaycastHit`는 3D 물리 캐스트 결과를 담습니다. `point`, `normal`, `distance`, `collider` 등이 대표적입니다.

```csharp
if (Physics.Raycast(origin, direction, out RaycastHit hit, 10f))
{
    Vector3 point = hit.point;
    Vector3 normal = hit.normal;
    Collider collider = hit.collider;
}
```

상세 설명은 [물리 타입 문서]({{ '/categories/physics/#raycasthit' | relative_url }})를 참고하세요.

---

## `RaycastHit2D`

2D 물리 캐스트 결과입니다. 3D 버전과 개념은 비슷하지만 `Collider2D`, `Rigidbody2D`, `Vector2` 중심으로 구성됩니다.

```csharp
RaycastHit2D hit = Physics2D.Raycast(origin, direction, distance, mask);
if (hit.collider != null)
{
    Debug.Log(hit.point);
}
```

---

## `ContactPoint`

3D 충돌 접점 하나를 나타냅니다. `point`, `normal` 등을 통해 실제 접촉 위치와 표면 방향을 얻습니다.

---

## `ContactPoint2D`

2D 충돌 접점 하나를 나타냅니다. 바닥 판정, 충돌 이펙트 위치, 표면 법선 확인 등에 사용할 수 있습니다.

---

# `LayerMask`

`LayerMask`는 Unity의 32개 Layer 선택 상태를 **비트마스크**로 보관하는 struct입니다. Inspector에서는 여러 Layer를 체크하는 UI로 보이지만 내부적으로는 정수 비트 조합입니다.

```csharp
[SerializeField] private LayerMask groundMask;

bool grounded = Physics.Raycast(
    transform.position,
    Vector3.down,
    1.2f,
    groundMask);
```

### Layer 번호와 LayerMask는 다르다

```csharp
int layer = gameObject.layer; // 하나의 Layer 인덱스
LayerMask mask = groundMask;  // 여러 Layer를 선택한 비트마스크
```

레이어 인덱스 8과 “8번 레이어만 포함하는 마스크 값”은 같은 숫자 개념이 아닙니다.

```csharp
int mask = 1 << 8;
```

[Unity 레이어 문서](https://docs.unity3d.com/Manual/use-layers.html)

---

# 곡선

## `AnimationCurve`

`AnimationCurve`는 **입력 시간/값에 따라 float 결과를 반환하는 곡선**을 표현하는 class입니다. 이름에 Animation이 들어가지만 애니메이션 재생에만 쓰이는 타입은 아닙니다.

```csharp
[SerializeField] private AnimationCurve damageByDistance;

float multiplier = damageByDistance.Evaluate(normalizedDistance);
```

### 활용 예

- 시간에 따른 값 변화
- 거리별 데미지 배율
- 카메라 흔들림 세기
- 가속/감속 프로파일
- 난이도 증가 곡선

Inspector에서 곡선을 직접 편집할 수 있다는 점이 큰 장점입니다.

---

## `Keyframe`

`Keyframe`은 AnimationCurve를 구성하는 **키 하나**입니다. 대표적으로 시간과 값, tangent 관련 정보를 갖습니다.

```csharp
AnimationCurve curve = new AnimationCurve(
    new Keyframe(0f, 0f),
    new Keyframe(1f, 1f));
```

대부분은 Inspector에서 AnimationCurve를 편집하지만, 런타임이나 툴 코드에서 곡선을 생성할 때 Keyframe을 직접 만납니다.

---

# 그라디언트

## `Gradient`

`Gradient`는 입력 0~1 구간에 따라 색과 알파가 변하는 그라디언트를 표현합니다.

```csharp
[SerializeField] private Gradient healthColor;

Color color = healthColor.Evaluate(healthRatio);
```

파티클 색, 체력 색상, 온도 맵 등 연속적인 색 변화가 필요한 곳에서 유용합니다.

---

## `GradientColorKey`

Gradient에서 특정 시간 위치의 RGB 색상을 정의하는 키입니다.

```csharp
GradientColorKey key = new GradientColorKey(Color.red, 0f);
```

---

## `GradientAlphaKey`

Gradient에서 특정 위치의 알파 값을 정의하는 키입니다. 색 키와 알파 키를 별도로 관리하기 때문에 “색 변화 시점”과 “투명도 변화 시점”이 다를 수 있습니다.

---

# 식별/고급 값 타입

## `Hash128`

`Hash128`은 128비트 해시 값을 표현합니다. 콘텐츠 상태 비교, 캐시 키, 데이터 식별 등 엔진/에디터/고급 데이터 처리에서 볼 수 있습니다.

```csharp
Hash128 hash = Hash128.Compute("Some Data");
```

해시는 보통 원본 데이터를 복원하기 위한 값이 아니라, 데이터 동일성 비교나 키 생성 같은 목적에 사용합니다.

---

## `PropertyName`

`PropertyName`은 문자열 프로퍼티 이름을 엔진 내부에서 효율적으로 다루기 위한 식별 타입입니다. 일반적인 게임플레이 변수로 자주 선언하는 타입은 아니며, Animation/Playable/엔진 레벨 API 등에서 만날 수 있습니다.

처음 봤을 때 “문자열인가?”라고 생각하기 쉽지만, 단순한 사용자 표시용 string과 목적이 다릅니다. 특별한 API가 이 타입을 요구할 때 해당 문맥을 따라 이해하면 충분한 경우가 많습니다.

---

## `RangeInt`

`RangeInt`는 시작 정수와 길이로 범위를 표현하는 간단한 struct입니다.

```csharp
RangeInt range = new RangeInt(10, 5);
// 시작 10, 길이 5
```

C#의 `System.Range`와 동일한 타입이 아니며, Unity API에서 일부 범위를 전달할 때 등장할 수 있습니다.

---

# 자주 헷갈리는 조합

| 조합 | 차이 |
|---|---|
| `Vector3` 위치 vs 방향 | 타입은 같지만 의미가 다름. 위치는 공간상의 점, 방향은 변화량/축 |
| `Vector3` vs `Vector3Int` | 연속 실수 공간 vs 정수 격자 |
| `Quaternion` vs Euler 각 | Quaternion은 회전 표현 타입, Euler는 사람이 읽기 쉬운 각도 표현 |
| `Color` vs `Color32` | float RGBA vs byte RGBA |
| `Rect` vs `Bounds` | 2D 사각 영역 vs 3D AABB |
| `Ray` vs `RaycastHit` | 캐스트 입력 vs 적중 결과 |
| `LayerMask` vs layer index | 여러 레이어 비트 조합 vs 단일 레이어 번호 |
| `AnimationCurve` vs `AnimationClip` | float 곡선 데이터 vs 애니메이션 클립 에셋 |

## 학습 우선순위

Unity 입문/중급 단계에서는 우선 다음 타입을 확실히 익히는 것이 좋습니다.

1. `Vector2`, `Vector3`
2. `Quaternion`
3. `Color`
4. `Bounds`
5. `Ray`, `RaycastHit`
6. `LayerMask`
7. `AnimationCurve`

그 뒤 `Matrix4x4`, Gradient 키, Hash128 같은 타입을 필요할 때 확장해서 보면 됩니다.
