---
layout: default
title: 렌더링 / 에셋 타입
eyebrow: Rendering / Assets
---
# 렌더링 / 에셋 타입

Unity에서 화면에 보이는 오브젝트는 보통 `Mesh`, `Renderer`, `Material`, `Shader`, `Texture` 같은 타입이 서로 역할을 나눠서 처리합니다. 처음에는 “모델 하나”처럼 보이지만 코드에서는 **형상 데이터, 렌더링 컴포넌트, 재질, 텍스처, 카메라**가 별도 타입으로 분리됩니다.

이 페이지는 각 타입의 역할과 서로의 연결 관계를 중심으로 정리합니다.

## 먼저 큰 그림

```text
GameObject
├─ Transform
├─ MeshFilter --------> Mesh
└─ MeshRenderer ------> Material ------> Shader
                                      └-> Texture
```

스킨드 캐릭터는 구조가 조금 다릅니다.

```text
GameObject
└─ SkinnedMeshRenderer
   ├─ sharedMesh ------> Mesh
   ├─ bones -----------> Transform[]
   └─ materials -------> Material[]
```

---

# 텍스처 계열

## `Texture`

`Texture`는 Unity의 여러 텍스처 타입이 공유하는 기반 클래스입니다. 일반 코드에서 직접 Texture 인스턴스를 만드는 경우보다 `Texture2D`, `RenderTexture`, `Cubemap` 등의 공통 타입으로 참조할 때 만날 가능성이 높습니다.

```csharp
[SerializeField] private Texture texture;
```

Material에 텍스처를 넘기는 API처럼 “구체적인 2D 텍스처인지 렌더 타깃인지보다 텍스처라는 공통 성격”이 중요할 때 기반 타입이 사용됩니다.

---

## `Texture2D`

`Texture2D`는 2차원 픽셀 데이터를 표현하는 대표적인 텍스처 타입입니다. 이미지 파일을 Import하면 Texture2D로 다뤄지는 경우가 많으며, 런타임에 직접 생성할 수도 있습니다.

```csharp
Texture2D texture = new Texture2D(256, 256);
```

### 자주 쓰는 상황

- 일반 이미지 텍스처
- 런타임 생성 이미지
- 픽셀 읽기/쓰기
- 스크린샷 데이터
- Sprite의 원본 텍스처

### 픽셀 수정

```csharp
texture.SetPixel(10, 10, Color.red);
texture.Apply();
```

대량 픽셀 작업에서는 `SetPixel`을 반복하는 것보다 배열/Native 계열 API 등 더 효율적인 방법이 적합할 수 있습니다. 또한 Import된 텍스처를 CPU에서 읽으려면 Read/Write 관련 Import 설정이 필요할 수 있습니다.

### `Texture2D`와 `Sprite`

Texture2D는 **이미지 픽셀 데이터**이고, Sprite는 그 Texture의 특정 영역을 2D 렌더링에 사용하기 위한 별도 에셋/객체입니다.

---

## `Texture3D`

`Texture3D`는 3차원 볼륨 형태의 텍스처 데이터입니다. 일반 캐릭터/배경 이미지보다 볼륨 데이터, LUT, 특수 Shader 입력 같은 고급 렌더링 작업에서 주로 만납니다.

처음 Unity를 공부할 때 자주 직접 사용할 필요는 없지만 `Texture`의 하위 타입 중 하나라는 구조를 알아두면 API를 읽기 쉽습니다.

---

## `Cubemap`

`Cubemap`은 여섯 방향의 이미지를 큐브 형태로 다루는 텍스처입니다. 환경 반사, 스카이박스, Reflection 관련 렌더링에서 자주 등장합니다.

```csharp
[SerializeField] private Cubemap environment;
```

2D 이미지 한 장과 달리 +X/-X/+Y/-Y/+Z/-Z 방향을 표현한다는 것이 핵심입니다.

---

## `RenderTexture`

`RenderTexture`는 **GPU가 렌더링 결과를 출력할 수 있는 텍스처 대상(render target)** 입니다. 일반 Texture2D처럼 저장된 이미지 파일을 읽는 목적보다, 카메라나 렌더링 연산의 결과를 텍스처로 받는 목적이 큽니다.

대표 사용 예:

- 미니맵 카메라
- CCTV/모니터 화면
- 포털
- 후처리 중간 버퍼
- 런타임 렌더 결과 캡처

```csharp
[SerializeField] private Camera sourceCamera;
[SerializeField] private RenderTexture targetTexture;

void Awake()
{
    sourceCamera.targetTexture = targetTexture;
}
```

### Texture2D와의 차이

- `Texture2D`: 일반적인 2D 이미지/픽셀 데이터
- `RenderTexture`: 렌더링 출력 대상으로 쓰이는 GPU 리소스

RenderTexture의 내용을 CPU가 읽는 Texture2D로 복사하려면 별도의 읽기 과정이 필요할 수 있습니다.

---

# `Sprite`

`Sprite`는 2D 렌더링에서 사용하는 스프라이트 에셋입니다. Texture2D 자체와 달리, **원본 텍스처의 어느 영역을 사용할지, Pivot이 어디인지, Pixels Per Unit 등의 2D 표현 정보**와 연결됩니다.

```csharp
[SerializeField] private Sprite icon;
```

보통 `SpriteRenderer.sprite`에 할당합니다.

```csharp
spriteRenderer.sprite = icon;
```

하나의 Texture2D에서 Sprite Mode를 Multiple로 사용하면 여러 Sprite가 만들어질 수도 있습니다. 즉 Texture와 Sprite는 1:1 관계라고 단정할 수 없습니다.

---

# 재질과 Shader

## `Material`

`Material`은 **어떤 Shader를 사용하고 그 Shader의 프로퍼티에 어떤 값을 넣을지 저장하는 렌더링 재질 객체**입니다.

```csharp
[SerializeField] private Material material;
```

Material에는 Shader 외에도 색, 텍스처, float, vector 같은 프로퍼티 값이 들어갑니다.

```csharp
material.SetFloat("_Amount", 0.5f);
material.SetColor("_BaseColor", Color.red);
```

프로퍼티 이름은 Shader에 따라 다릅니다.

### `Renderer.material` vs `Renderer.sharedMaterial`

이 차이는 매우 중요합니다.

- `sharedMaterial`: Renderer가 참조하는 공유 Material 에셋/참조를 다룸
- `material`: Renderer 전용 인스턴스가 필요해질 수 있으며, 접근 시 Material 복제가 발생할 수 있음

```csharp
Material shared = renderer.sharedMaterial;
Material instance = renderer.material;
```

여러 Renderer가 같은 Material을 공유하는 상태에서 개별 오브젝트만 값을 바꾸고 싶은지, 에셋/공유 상태 자체를 바꾸고 싶은지에 따라 접근 방법을 구분해야 합니다.

많은 오브젝트에 개별 프로퍼티만 다르게 주고 싶다면 Material을 무수히 복제하는 대신 `MaterialPropertyBlock` 같은 방식을 살펴볼 가치도 있습니다.

### `PhysicsMaterial`과는 다른 타입

`Material`은 렌더링 재질입니다. `PhysicsMaterial`은 마찰과 탄성을 정하는 물리 재질입니다. 이름만 비슷할 뿐 완전히 다른 시스템입니다.

[Unity 공식 문서: Material](https://docs.unity3d.com/ScriptReference/Material.html)

---

## `Shader`

`Shader`는 **GPU에서 표면이나 픽셀을 어떻게 렌더링할지 정의하는 프로그램/에셋**입니다. Material은 Shader를 참조하고, Shader에 선언된 프로퍼티 값을 저장합니다.

```csharp
Shader shader = material.shader;
```

런타임에 이름으로 찾는 API도 있습니다.

```csharp
Shader shader = Shader.Find("Some/Shader");
```

다만 빌드에서 Shader가 포함되는 조건과 Stripping 등 렌더 파이프라인 설정을 고려해야 하므로, 무조건 문자열 Find에 의존하는 설계는 주의가 필요합니다.

### 역할 구분

```text
Shader   = 어떻게 그릴지 정의
Material = 그 Shader에 넣을 실제 값 묶음
Renderer = 어떤 Mesh/Sprite를 어떤 Material로 그릴지 씬에서 연결
```

---

## `ComputeShader`

`ComputeShader`는 일반적인 화면 렌더링 파이프라인의 정점/픽셀 셰이더와 달리 **GPU에서 범용 병렬 계산을 수행**하기 위한 Shader 에셋입니다.

예:

- 대량 시뮬레이션
- 이미지 처리
- GPU 기반 파티클/데이터 처리
- 버퍼 계산

초기 학습 단계에서는 Material/Shader 구조를 먼저 익힌 뒤 필요할 때 보는 것이 좋습니다.

---

# Mesh 계열

## `Mesh`

`Mesh`는 **3D 형상의 실제 기하 데이터**를 담는 객체입니다. 대표적으로 정점, 삼각형 인덱스, 노멀, UV, tangent, color 등의 데이터가 포함됩니다.

```csharp
[SerializeField] private Mesh mesh;
```

### 기본 구성 개념

- `vertices`: 정점 위치
- `triangles` 또는 index buffer: 어떤 정점을 삼각형으로 연결할지
- `normals`: 표면 방향
- `uv`: 텍스처 좌표
- `tangents`: 노멀맵 계산 등에 사용
- submesh: Material을 나누어 적용할 수 있는 메시 구획

간단한 런타임 Mesh 생성 예:

```csharp
Mesh mesh = new Mesh();
mesh.vertices = new[]
{
    new Vector3(0, 0, 0),
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0)
};
mesh.triangles = new[] { 0, 1, 2 };
mesh.RecalculateNormals();
```

### `mesh`와 `sharedMesh`

`MeshFilter`나 `SkinnedMeshRenderer`에서는 `mesh`/`sharedMesh`와 비슷한 공유/인스턴스 개념을 만나게 됩니다. 원본 에셋을 수정하려는 것인지, 런타임 개별 사본을 수정하려는 것인지 구분해야 합니다.

[Unity 공식 문서: Mesh](https://docs.unity3d.com/ScriptReference/Mesh.html)

---

## `MeshFilter`

`MeshFilter`는 **일반 MeshRenderer가 렌더링할 Mesh 참조를 제공하는 Component**입니다.

```csharp
MeshFilter filter = GetComponent<MeshFilter>();
Mesh mesh = filter.sharedMesh;
```

`MeshFilter` 자체가 화면에 그리는 것은 아닙니다. 실제 렌더링은 같은 GameObject의 `MeshRenderer`가 담당합니다.

```text
MeshFilter -> "어떤 Mesh인가?"
MeshRenderer -> "그 Mesh를 어떻게 렌더링할까?"
```

---

# Renderer 계열

## `Renderer`

`Renderer`는 여러 렌더링 컴포넌트의 공통 기반 클래스입니다.

대표 하위 타입:

- `MeshRenderer`
- `SkinnedMeshRenderer`
- `SpriteRenderer`
- `LineRenderer`
- `TrailRenderer`

공통적으로 Material, bounds, enabled, 그림자/렌더링 관련 정보를 다룹니다.

```csharp
Renderer renderer = GetComponent<Renderer>();
renderer.enabled = false;

Bounds bounds = renderer.bounds;
Material[] materials = renderer.materials;
```

### `enabled`

Renderer만 끄면 오브젝트 자체는 활성 상태이고 다른 컴포넌트도 계속 동작할 수 있습니다.

```csharp
renderer.enabled = false;
```

`gameObject.SetActive(false)`와는 영향 범위가 다릅니다.

[Unity 공식 문서: Renderer](https://docs.unity3d.com/ScriptReference/Renderer.html)

---

## `MeshRenderer`

`MeshRenderer`는 `MeshFilter`가 제공하는 Mesh를 렌더링하는 Component입니다.

```text
GameObject
├─ MeshFilter  -> Mesh 데이터
└─ MeshRenderer -> Material, 그림자, 렌더 상태
```

정적 소품, 환경 Mesh, 일반적인 비변형 3D Mesh에 자주 사용합니다.

스킨닝/본 변형이 필요한 캐릭터 Mesh에는 보통 `SkinnedMeshRenderer`를 사용합니다.

[Unity 공식 문서: MeshRenderer](https://docs.unity3d.com/ScriptReference/MeshRenderer.html)

---

## `SkinnedMeshRenderer`

`SkinnedMeshRenderer`는 **본(Bone), BlendShape 등으로 변형되는 Mesh를 렌더링**하는 Component입니다. 일반 MeshRenderer와 달리 MeshFilter를 별도로 사용하는 구조가 아닙니다.

대표적으로 다음 데이터를 직접 가집니다.

- `sharedMesh`: 스킨드 Mesh
- `bones`: 스키닝에 사용되는 Transform 배열
- `rootBone`
- `quality`
- BlendShape weight
- `updateWhenOffscreen`

```csharp
SkinnedMeshRenderer smr = GetComponent<SkinnedMeshRenderer>();
Transform[] bones = smr.bones;
Mesh mesh = smr.sharedMesh;
```

### `BakeMesh`

현재 스킨 변형 결과를 Mesh로 스냅샷처럼 구울 수 있습니다.

```csharp
Mesh baked = new Mesh();
smr.BakeMesh(baked);
```

캐릭터 파괴, 현재 포즈 Mesh 캡처, 특수 효과 같은 작업에서 보게 됩니다.

### `bounds` 주의

Skinned Mesh는 애니메이션으로 정점 위치가 바뀌기 때문에 컬링 경계를 어떻게 계산하는지가 중요합니다. `updateWhenOffscreen`, local bounds 설정은 성능과 보임 여부에 영향을 줄 수 있습니다.

[Unity 공식 문서: SkinnedMeshRenderer](https://docs.unity3d.com/ScriptReference/SkinnedMeshRenderer.html)

---

## `SpriteRenderer`

`SpriteRenderer`는 Sprite를 씬에 렌더링하는 2D 중심 Component입니다.

```csharp
SpriteRenderer renderer = GetComponent<SpriteRenderer>();
renderer.sprite = sprite;
renderer.color = Color.white;
renderer.flipX = true;
```

대표적으로 다음 요소를 제어합니다.

- 어떤 Sprite를 그릴지
- tint 색상
- flip X/Y
- sorting layer / order
- Material
- draw mode

Sprite 자체가 이미지/2D 에셋이고, SpriteRenderer는 그 Sprite를 **씬에서 실제로 그리는 Component**입니다.

---

## `LineRenderer`

`LineRenderer`는 여러 점을 연결한 선을 렌더링합니다.

```csharp
LineRenderer line = GetComponent<LineRenderer>();
line.positionCount = 2;
line.SetPosition(0, start);
line.SetPosition(1, end);
```

레이저, 궤적, 범위 표시, 디버그 시각화처럼 연속된 선을 화면에 표현할 때 유용합니다.

단순 디버깅만 목적이면 `Debug.DrawLine`과 역할을 비교해 볼 수 있습니다. LineRenderer는 실제 Renderer이므로 빌드 화면에 렌더링할 수 있고 Material/폭 등의 속성을 가집니다.

---

## `TrailRenderer`

`TrailRenderer`는 오브젝트가 이동한 경로를 시간에 따라 남기는 리본 형태의 Renderer입니다.

대표 사용 예:

- 검 휘두름 흔적
- 빠른 투사체 꼬리
- 이동 잔상
- 마법 궤적

`time`, `widthCurve`, `colorGradient`, `minVertexDistance` 같은 설정으로 흔적의 지속 시간과 모양을 조절합니다.

LineRenderer가 코드로 여러 점을 명시하는 성격이 강하다면, TrailRenderer는 **Transform 이동 기록에 따라 자동으로 궤적을 쌓는 성격**이 강합니다.

---

# `Camera`

`Camera`는 씬을 특정 관점에서 렌더링하는 Component입니다.

```csharp
[SerializeField] private Camera playerCamera;
```

대표적으로 사용하는 정보:

- 위치/회전은 Transform
- Field of View / Orthographic Size
- culling mask
- clipping plane
- viewport
- target texture

### 좌표 변환

```csharp
Vector3 screen = playerCamera.WorldToScreenPoint(worldPosition);
Ray ray = playerCamera.ScreenPointToRay(Input.mousePosition);
```

월드 좌표, 화면 좌표, Viewport 좌표 사이 변환에서 자주 사용합니다.

### `Camera.main`

`Camera.main`은 MainCamera 태그를 가진 카메라를 찾는 편의 API입니다. 반복 호출 비용과 구조를 고려해 자주 쓰는 경우 참조를 캐시하거나 직접 SerializeField로 연결하는 설계를 사용하기도 합니다.

---

# `Light`

`Light`는 씬의 광원 Component입니다.

```csharp
Light light = GetComponent<Light>();
light.intensity = 2f;
light.color = Color.orange;
```

광원 타입, 색, 강도, 범위, 그림자 등 렌더 파이프라인에 따라 여러 설정과 상호작용합니다.

## `LightType`

`LightType`은 Light의 종류를 표현하는 enum입니다. Directional, Point, Spot 등 어떤 형태의 광원인지를 구분합니다.

```csharp
if (light.type == LightType.Point)
{
    ...
}
```

렌더 파이프라인/Unity 버전에 따라 지원되는 세부 Light 종류와 동작이 달라질 수 있으므로 실제 프로젝트의 렌더러 문서를 함께 보는 것이 좋습니다.

---

# 텍스트/데이터 에셋

## `TextAsset`

`TextAsset`은 프로젝트에 포함된 텍스트 또는 바이트 기반 파일을 Unity 에셋으로 참조할 때 사용합니다.

```csharp
[SerializeField] private TextAsset configFile;

void Start()
{
    string text = configFile.text;
    byte[] bytes = configFile.bytes;
}
```

JSON, CSV, 텍스트 데이터, 특정 바이너리 파일 등을 에셋 참조 형태로 프로젝트에 포함할 때 편리합니다.

단, 아주 큰 데이터나 런타임 외부 파일 시스템, 다운로드 데이터까지 모두 TextAsset으로 해결해야 하는 것은 아닙니다.

---

## `Font`

`Font`는 Unity 코어/레거시 텍스트 API에서 사용하는 폰트 에셋 타입입니다. 현대 Unity UI 프로젝트에서는 TextMeshPro 계열 타입을 더 자주 보게 될 수 있지만, TextMeshPro는 패키지/API 범위가 별도이므로 이 가이드의 기본 범위에서는 Unity 코어 Font 타입만 간단히 다룹니다.

---

# IMGUI 타입

## `GUIStyle`

`GUIStyle`은 `OnGUI`/IMGUI 계열 UI에서 글꼴, 정렬, 배경, 여백 등 스타일을 지정하는 타입입니다.

```csharp
GUIStyle style = new GUIStyle(GUI.skin.label);
style.fontSize = 24;
style.alignment = TextAnchor.MiddleCenter;
```

런타임 게임 UI의 주력 시스템으로 반드시 사용할 필요는 없지만, Editor 도구와 간단한 OnGUI 디버그 화면에서 만날 수 있습니다.

---

## `GUIContent`

`GUIContent`는 IMGUI 컨트롤에 전달할 **텍스트, 이미지, 툴팁** 묶음을 표현합니다.

```csharp
GUIContent content = new GUIContent("Save", icon, "프로젝트를 저장합니다.");
```

단순 string보다 표시 정보가 더 필요할 때 사용합니다.

---

# 자주 헷갈리는 조합

| 조합 | 차이 |
|---|---|
| `Texture2D` vs `Sprite` | 픽셀 이미지 데이터 vs 2D 스프라이트 표현/슬라이스 정보 |
| `Texture2D` vs `RenderTexture` | 일반 2D 텍스처 vs 렌더링 출력 대상 |
| `Mesh` vs `MeshFilter` | 형상 데이터 객체 vs 그 Mesh를 GameObject에 연결하는 Component |
| `MeshFilter` vs `MeshRenderer` | 어떤 Mesh인지 지정 vs 실제 렌더링 담당 |
| `MeshRenderer` vs `SkinnedMeshRenderer` | 일반 Mesh 렌더링 vs 본/BlendShape 변형 Mesh 렌더링 |
| `Material` vs `Shader` | Shader + 프로퍼티 값 묶음 vs GPU 렌더링 프로그램 정의 |
| `Material` vs `PhysicsMaterial` | 화면 표현 vs 마찰/탄성 |
| `Sprite` vs `SpriteRenderer` | 에셋/데이터 vs 씬 렌더링 Component |
| `LineRenderer` vs `TrailRenderer` | 명시한 점들을 연결 vs 이동 경로를 시간에 따라 누적 |

## 추천 학습 순서

1. `Mesh` / `MeshFilter` / `MeshRenderer`
2. `Material` / `Shader`
3. `Texture2D` / `Sprite` / `SpriteRenderer`
4. `Renderer` 공통 기반
5. `SkinnedMeshRenderer`
6. `Camera`
7. `RenderTexture`
8. 필요에 따라 Line/Trail/ComputeShader/IMGUI 타입 확장
