---
layout: default
title: 런타임 / 씬 / 입력 / 이벤트
eyebrow: UnityEngine
---
# 런타임 / 씬 / 입력 / 이벤트 타입

| 타입 | 종류 | 네임스페이스 | 핵심 |
|---|---|---|---|
| Scene | struct | UnityEngine.SceneManagement | 로드된 Scene에 대한 값 핸들 |
| SceneManager | static class | UnityEngine.SceneManagement | 씬 로드/언로드/조회 |
| LoadSceneMode | enum | UnityEngine.SceneManagement | Single/Additive 로드 방식 |
| AsyncOperation | class | UnityEngine | LoadSceneAsync 등 비동기 진행 |
| LayerMask | struct | UnityEngine | 32개 레이어 선택 비트마스크 |
| KeyCode | enum | UnityEngine | 레거시 Input 키 코드 |
| Touch | struct | UnityEngine | 터치 한 점의 상태 |
| TouchPhase | enum | UnityEngine | 터치 단계 |
| DeviceOrientation | enum | UnityEngine | 기기 방향 |
| Resolution | struct | UnityEngine | 화면 해상도 정보 |
| FullScreenMode | enum | UnityEngine | 창/전체화면 모드 |
| CursorLockMode | enum | UnityEngine | 커서 잠금 상태 |
| LogType | enum | UnityEngine | 로그 종류 |
| RuntimePlatform | enum | UnityEngine | 실행 플랫폼 |
| SystemLanguage | enum | UnityEngine | 언어 코드 |
| UnityEvent | class | UnityEngine.Events | Inspector 연결 가능한 직렬화 이벤트 |
| UnityEvent<T> | class | UnityEngine.Events | 인자 하나를 전달하는 UnityEvent |
| UnityAction | delegate | UnityEngine.Events | UnityEvent 리스너에 쓰이는 delegate |
| Action | delegate | System | 반환값 없는 일반 C# 콜백 |
| Func<T> | delegate | System | 결과값을 반환하는 일반 C# 콜백 |
| Predicate<T> | delegate | System | T를 받아 bool을 반환하는 조건 delegate |
| Random.State | struct | UnityEngine | Unity Random 상태 저장/복원 |
| Hash128 | struct | UnityEngine | 128비트 해시 |
| JsonUtility | static class | UnityEngine | Unity 내장 JSON 직렬화 헬퍼 |
| Resources | static class | UnityEngine | Resources 폴더 에셋 로드 API |


## `Scene`

`Scene`은 class가 아니라 struct입니다. 현재 로드된 씬을 가리키는 값 핸들처럼 사용합니다.

```csharp
Scene scene = SceneManager.GetActiveScene();
Debug.Log(scene.name);
```

## `SceneManager`

타입이지만 보통 인스턴스를 저장하지 않는 static class입니다.

```csharp
SceneManager.LoadScene("Main");
AsyncOperation op = SceneManager.LoadSceneAsync("Battle");
```

“Unity에서 보이는 타입”에는 변수로 보관하는 타입뿐 아니라 이런 static API 타입도 있습니다. 다만 이 가이드의 핵심은 변수에 실제로 나타나는 타입입니다.

## `LayerMask`

레이어 여러 개의 선택 상태를 비트로 표현합니다. Inspector에서 체크 목록으로 보이므로 그냥 “레이어 타입”처럼 느껴질 수 있지만 실제로는 마스크입니다.

## `KeyCode`

Unity의 레거시 Input API에서 키를 나타내는 enum입니다.

```csharp
if (Input.GetKey(KeyCode.Space)) { }
```

새 Input System은 별도 패키지 영역이므로 이 기본 가이드에서는 깊게 다루지 않습니다.

## `Touch` / `TouchPhase`

레거시 터치 입력에서 터치 하나의 데이터와 그 상태를 표현합니다.

## `Action` / `Func` / `Predicate`

일반 C# delegate 타입입니다.

```csharp
Action<int> onHpChanged;
Func<Vector3, bool> canMoveTo;
Predicate<Enemy> isBoss;
```

## `UnityEvent` / `UnityAction`

UnityEvent는 Unity가 Inspector에서 리스너를 연결하고 직렬화할 수 있도록 만든 이벤트 계열입니다. 일반 C# `event Action`과 목적이 겹쳐 보여도 Inspector 연결/직렬화 여부가 큰 차이입니다.
