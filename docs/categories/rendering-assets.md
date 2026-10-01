---
layout: default
title: 렌더링과 에셋 타입
eyebrow: UnityEngine
---
# 렌더링 / 에셋 타입

| 타입 | 종류 | 기반 | 핵심 | 대표 사용 |
|---|---|---|---|---|
| Texture | class | Object | 텍스처 공통 기반 | Material 텍스처 슬롯 |
| Texture2D | class | Texture | 2D 픽셀 텍스처 | 이미지/런타임 텍스처 |
| Texture3D | class | Texture | 3D 볼륨 텍스처 | 볼륨 데이터 |
| Cubemap | class | Texture | 6면 큐브 텍스처 | 환경 반사 |
| RenderTexture | class | Texture | 렌더 타깃 텍스처 | 카메라/후처리/미니맵 |
| Sprite | class | Object | 2D 스프라이트 에셋 | SpriteRenderer |
| Material | class | Object | Shader + 프로퍼티 값 | Renderer 재질 |
| Shader | class | Object | 셰이더 프로그램 에셋 | Material 기반 |
| ComputeShader | class | Object | GPU compute 셰이더 | GPU 계산 |
| Mesh | class | Object | 정점/인덱스/UV/노멀 메시 데이터 | MeshFilter/SkinnedMeshRenderer |
| Renderer | class | Component | 렌더러 공통 기반 | bounds/material/enabled |
| MeshRenderer | class | Renderer | MeshFilter의 Mesh를 렌더 | 정적/일반 메시 |
| SkinnedMeshRenderer | class | Renderer | 본 변형 메시 렌더 | 캐릭터 |
| SpriteRenderer | class | Renderer | Sprite 렌더 | 2D |
| LineRenderer | class | Renderer | 선 렌더 | 궤적/레이저 |
| TrailRenderer | class | Renderer | 시간에 따른 트레일 | 칼자국/이동 궤적 |
| MeshFilter | class | Component | 렌더할 Mesh 참조 보관 | MeshRenderer와 조합 |
| Camera | class | Behaviour | 씬을 렌더링하는 카메라 | 화면/RenderTexture |
| Light | class | Behaviour | 광원 컴포넌트 | 조명 |
| LightType | enum | - | 광원 종류 | Directional/Point/Spot 등 |
| TextAsset | class | Object | 텍스트/바이너리 파일 에셋 | JSON/CSV/텍스트 읽기 |
| Font | class | Object | 폰트 에셋 타입 | 레거시/코어 폰트 API |
| GUIStyle | class | - | IMGUI 스타일 | Editor/OnGUI |
| GUIContent | class | - | IMGUI 텍스트/이미지/툴팁 | Editor/OnGUI |


## `Mesh`

정점(vertex), 삼각형 인덱스, 노멀, UV 등 실제 기하 데이터를 담습니다.

```csharp
MeshFilter filter = GetComponent<MeshFilter>();
Mesh mesh = filter.mesh;
Vector3[] vertices = mesh.vertices;
```

`MeshFilter`는 Mesh를 보관하고, `MeshRenderer`가 그것을 화면에 그리는 전형적인 조합입니다.

## `Renderer`

실제로 화면에 그리는 계열의 공통 기반입니다. `MeshRenderer`, `SkinnedMeshRenderer`, `SpriteRenderer`, `LineRenderer`, `TrailRenderer` 등이 파생됩니다.

```csharp
Renderer r = GetComponent<Renderer>();
r.enabled = false;
Bounds worldBounds = r.bounds;
```

## `Material`

Shader와 그 Shader에 전달할 프로퍼티 값들을 묶습니다.

```csharp
Renderer r = GetComponent<Renderer>();
Material runtimeInstance = r.material;
Material shared = r.sharedMaterial;
```

`material`과 `sharedMaterial`은 런타임 인스턴스 생성/공유 에셋 변경 측면에서 동작 차이가 있으므로 실제 프로젝트에서는 구분해서 사용해야 합니다.

## `Texture` / `Texture2D` / `RenderTexture`

- `Texture`: 텍스처 계층의 기반
- `Texture2D`: 일반 2D 이미지 데이터
- `RenderTexture`: GPU 렌더링 결과를 받는 텍스처 타깃

카메라 화면을 텍스처로 받거나 미니맵을 만들 때 `RenderTexture`가 자주 등장합니다.

## `Sprite`

Texture의 특정 영역과 피벗/보더 등의 2D 렌더 정보를 묶은 Unity 객체입니다. Sprite 자체와 원본 `Texture2D`는 같은 타입이 아닙니다.

## `SkinnedMeshRenderer`

본(skeleton)과 스킨 웨이트에 따라 변형되는 Mesh를 렌더합니다. 캐릭터 모델에서 `bones`, `rootBone`, `sharedMesh` 같은 참조를 다룰 때 자주 만납니다.

## `TextAsset`

`.txt`, `.json`, `.csv` 같은 텍스트 에셋을 Unity 프로젝트 안에서 참조할 때 편리한 기본 타입입니다.
