---
layout: default
title: Unity 수학과 값 타입
eyebrow: UnityEngine
---
# Unity 수학 / 값 타입

Unity의 위치, 방향, 색, 영역, 충돌 결과는 작은 `struct` 타입으로 자주 전달됩니다.

| 타입 | 종류 | 표현 | 자주 쓰는 곳 | 직렬화/성격 |
|---|---|---|---|---|
| Vector2 | struct | 2D 실수 벡터 | 좌표, 방향, 속도, UV | O |
| Vector3 | struct | 3D 실수 벡터 | position, direction, scale | O |
| Vector4 | struct | 4개 실수 성분 | 셰이더 값, 수학 데이터 | O |
| Vector2Int | struct | 2D 정수 벡터 | 그리드 좌표 | O |
| Vector3Int | struct | 3D 정수 벡터 | 타일/복셀 좌표 | O |
| Quaternion | struct | 3D 회전 | Transform.rotation | O |
| Matrix4x4 | struct | 4×4 행렬 | 변환, 셰이더 | O |
| Color | struct | float RGBA 색 | 렌더링/머티리얼 | O |
| Color32 | struct | byte RGBA 색 | 픽셀/메모리 효율 색 | O |
| Rect | struct | 2D 사각형(float) | GUI/뷰포트/영역 | O |
| RectInt | struct | 2D 정수 사각형 | 그리드 영역 | O |
| Bounds | struct | 3D AABB | Renderer/Collider 경계 | O |
| BoundsInt | struct | 3D 정수 경계 | 셀/볼륨 영역 | O |
| Ray | struct | 3D 원점+방향 | Physics.Raycast 입력 | O |
| Ray2D | struct | 2D 원점+방향 | 2D 광선 | O |
| Plane | struct | 3D 평면 | 기하 계산 | O |
| RaycastHit | struct | 3D 레이캐스트 결과 | point/normal/distance/collider | 런타임 결과 |
| RaycastHit2D | struct | 2D 캐스트 결과 | point/normal/distance/collider | 런타임 결과 |
| ContactPoint | struct | 3D 접촉점 정보 | 충돌 접점/법선 | 런타임 결과 |
| ContactPoint2D | struct | 2D 접촉점 정보 | 2D 충돌 접점 | 런타임 결과 |
| LayerMask | struct | 레이어 비트마스크 | Raycast 필터 | O |
| AnimationCurve | class | 키프레임 곡선 | 시간→값 곡선 | O |
| Keyframe | struct | AnimationCurve 키 하나 | 커브 구성 | O |
| Gradient | class | 색상 그라디언트 | 파티클/시각 효과 | O |
| GradientColorKey | struct | Gradient 색 키 | Gradient 구성 | O |
| GradientAlphaKey | struct | Gradient 알파 키 | Gradient 구성 | O |
| Hash128 | struct | 128비트 해시 | 콘텐츠/데이터 식별 | O/용도별 |
| PropertyName | struct | 프로퍼티 이름 핸들 | 엔진 내부/고급 API | 용도별 |
| RangeInt | struct | 정수 시작+길이 범위 | 부분 범위 표현 | 용도별 |


## `Vector2` / `Vector3` / `Vector4`

```csharp
Vector3 position = transform.position;
Vector3 direction = (target.position - transform.position).normalized;
float distance = Vector3.Distance(transform.position, target.position);
```

- `Vector2`: x, y
- `Vector3`: x, y, z
- `Vector4`: x, y, z, w

`Vector3`는 “위치 전용” 타입이 아닙니다. 위치, 방향, 속도, 크기 등 **3개의 실수 성분이 필요한 데이터**를 표현합니다.

## `Vector2Int` / `Vector3Int`

정수 좌표가 필요한 그리드, 타일, 셀에 적합합니다. 월드 위치처럼 연속 값이면 `Vector3`, 셀 인덱스처럼 불연속 정수 좌표면 `Vector3Int`가 자연스럽습니다.

## `Quaternion`

Unity 3D 회전의 대표 타입입니다.

```csharp
Quaternion rotation = transform.rotation;
transform.rotation = Quaternion.Euler(0f, 90f, 0f);
transform.rotation = Quaternion.LookRotation(direction);
```

Inspector에서는 오일러 각도로 보이는 경우가 많지만 `Transform.rotation`의 실제 타입은 `Quaternion`입니다. 회전을 직접 x/y/z/w 성분으로 수정하기보다 `Quaternion.Euler`, `LookRotation`, `Slerp` 같은 API를 사용하는 편이 안전합니다.

## `Color` / `Color32`

- `Color`: r/g/b/a가 `float`이며 일반적으로 0~1 범위로 사용
- `Color32`: r/g/b/a가 `byte`라 0~255

픽셀 대량 처리나 byte 기반 데이터에서는 `Color32`가 편할 수 있고, 일반 렌더링 API는 `Color`가 흔합니다.

## `Rect` / `RectInt`

2D 사각 영역을 x/y/width/height 형태로 표현합니다. `Rect`는 float, `RectInt`는 int입니다.

## `Bounds` / `BoundsInt`

축에 정렬된 바운딩 박스(AABB)를 나타냅니다. `Renderer.bounds`, `Collider.bounds` 등에서 자주 봅니다.

```csharp
Bounds b = renderer.bounds;
Vector3 center = b.center;
Vector3 size = b.size;
```

## `Ray`

원점과 방향을 묶은 3D 광선 데이터입니다.

```csharp
Ray ray = new Ray(transform.position, transform.forward);
if (Physics.Raycast(ray, out RaycastHit hit, 100f))
{
    Debug.Log(hit.point);
}
```

`Ray`는 **질문**, `RaycastHit`는 그 질문의 **적중 결과**에 가깝습니다.

## `Plane`

3D 평면을 법선과 거리로 표현합니다. 카메라 마우스 위치를 월드 평면과 교차시키는 계산 등에서 유용합니다.

## `LayerMask`

겉보기에는 Inspector의 레이어 선택이지만 내부적으로는 비트마스크입니다. `Physics.Raycast`에서 특정 레이어만 검사할 때 자주 씁니다.

```csharp
[SerializeField] private LayerMask targetMask;
Physics.Raycast(ray, out var hit, 100f, targetMask);
```
