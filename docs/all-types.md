---
layout: default
title: 전체 타입 인덱스
eyebrow: Full Index
---
# 전체 타입 인덱스

이 페이지는 상세 설명으로 들어가기 전에 타입 이름을 한 번에 훑기 위한 색인입니다. 현재 **207개 항목**을 카테고리별로 수록했습니다. 같은 타입이 역할상 여러 카테고리에 다시 등장할 수 있습니다.

> "Unity에 존재하는 모든 API 타입"을 전수 나열한 것은 아닙니다. 게임 코드에서 변수/필드/매개변수/반환값으로 자주 만나는 타입을 학습 우선순위에 맞춰 선별했습니다.

## C# 기본 타입

[상세 문서 보기]({{ '/categories/csharp-basics/' | relative_url }})

| 타입 | 종류/기반 | 핵심 | 대표 사용 |
|---|---|---|---|
| bool | 값 | 참/거짓 | O |
| byte | 값 | 0~255 부호 없는 8비트 정수 | O |
| sbyte | 값 | 부호 있는 8비트 정수 | O |
| short | 값 | 부호 있는 16비트 정수 | O |
| ushort | 값 | 부호 없는 16비트 정수 | O |
| int | 값 | 가장 일반적인 정수 | O |
| uint | 값 | 부호 없는 32비트 정수 | O |
| long | 값 | 큰 정수 | O |
| ulong | 값 | 큰 부호 없는 정수 | O |
| float | 값 | 32비트 부동소수 | O |
| double | 값 | 64비트 부동소수 | O |
| decimal | 값 | 10진 정밀 계산 | 기본 Inspector X |
| char | 값 | UTF-16 문자 하나 | 제한적/직접 노출 비추천 |
| string | 참조 | 문자열 | O |
| object | 참조 | 모든 C# 타입의 최상위 기반 | 기본 직렬화 X |
| dynamic | 참조/동적 | 컴파일 타임 타입 검사 일부를 런타임으로 | X |
| enum | 값 | 명명된 선택지 | 32비트 이하 O |
| T? | 값 | 값 타입 + null | 기본 Inspector X |
| ValueTuple | 값 | 여러 값을 임시 묶음 | 기본 Inspector X |
| Tuple | 참조 | 여러 값 묶음 | X |
| DateTime | 값 | 날짜/시간 | 기본 Inspector X |
| TimeSpan | 값 | 시간 간격 | 기본 Inspector X |
| Guid | 값 | 128비트 식별자 | 기본 Inspector X |
| Type | 참조 | 런타임 타입 정보 | X |
| Exception | 참조 | 예외 정보 | X |
| CancellationToken | 값 | 비동기 취소 신호 | X |

## 컬렉션 / 인터페이스

[상세 문서 보기]({{ '/categories/collections/' | relative_url }})

| 타입 | 종류/기반 | 핵심 | 대표 사용 |
|---|---|---|---|
| T[] | class | 고정 길이 인덱스 컬렉션 | 인덱스 O / 추가·삭제 X |
| T[,] / T[,,] | class | 다차원 배열 | 격자 데이터 |
| T[][] | class | 재그드 배열 | 행 길이가 다른 데이터 |
| List<T> | class | 가변 길이 순차 컬렉션 | 인덱스/추가/삭제 |
| IEnumerable<T> | interface | 순회 가능한 시퀀스 계약 | foreach 중심 |
| IEnumerator<T> | interface | 열거 상태/현재 요소 | 직접 열거 구현 |
| ICollection<T> | interface | 개수+추가/삭제 중심 계약 | 컬렉션 공통 API |
| IReadOnlyCollection<T> | interface | 개수+순회 읽기 계약 | 외부 수정 제한 API |
| IList<T> | interface | 인덱스 기반 수정 가능 목록 | 구현 교체 가능한 리스트 API |
| IReadOnlyList<T> | interface | 인덱스 기반 읽기 전용 목록 | 외부에 목록 읽기만 노출 |
| Dictionary<TKey,TValue> | class | 키→값 해시 맵 | ID로 빠른 조회 |
| IDictionary<TKey,TValue> | interface | 키-값 수정 계약 | 딕셔너리 추상화 |
| IReadOnlyDictionary<TKey,TValue> | interface | 키-값 읽기 전용 계약 | 외부 조회 API |
| HashSet<T> | class | 중복 없는 집합 | 중복 제거/포함 검사 |
| ISet<T> | interface | 집합 연산 계약 | 교집합/합집합 추상화 |
| Queue<T> | class | FIFO 큐 | 작업/웨이브/메시지 처리 |
| Stack<T> | class | LIFO 스택 | 되돌리기/상태 스택 |
| LinkedList<T> | class | 양방향 연결 리스트 | 중간 노드 조작 |
| SortedSet<T> | class | 정렬된 집합 | 정렬+중복 제거 |
| SortedDictionary<TKey,TValue> | class | 키 정렬 딕셔너리 | 정렬된 키 순회 |
| KeyValuePair<TKey,TValue> | struct | 키-값 한 쌍 | Dictionary foreach 요소 |
| ReadOnlyCollection<T> | class | 기존 IList를 읽기 전용 래핑 | 변경 API 숨김 |
| ObservableCollection<T> | class | 변경 알림 컬렉션 | .NET UI/툴 코드 |
| Span<T> | ref struct | 연속 메모리 뷰 | 할당 줄인 저수준 처리 |
| Memory<T> | struct | 비동기에도 보관 가능한 메모리 뷰 | 버퍼 처리 |
| ArraySegment<T> | struct | 배열 일부 구간 뷰 | 복사 없는 하위 구간 |

## Unity 수학 / 값 타입

[상세 문서 보기]({{ '/categories/unity-value-types/' | relative_url }})

| 타입 | 종류/기반 | 핵심 | 대표 사용 |
|---|---|---|---|
| Vector2 | struct | 2D 실수 벡터 | 좌표, 방향, 속도, UV |
| Vector3 | struct | 3D 실수 벡터 | position, direction, scale |
| Vector4 | struct | 4개 실수 성분 | 셰이더 값, 수학 데이터 |
| Vector2Int | struct | 2D 정수 벡터 | 그리드 좌표 |
| Vector3Int | struct | 3D 정수 벡터 | 타일/복셀 좌표 |
| Quaternion | struct | 3D 회전 | Transform.rotation |
| Matrix4x4 | struct | 4×4 행렬 | 변환, 셰이더 |
| Color | struct | float RGBA 색 | 렌더링/머티리얼 |
| Color32 | struct | byte RGBA 색 | 픽셀/메모리 효율 색 |
| Rect | struct | 2D 사각형(float) | GUI/뷰포트/영역 |
| RectInt | struct | 2D 정수 사각형 | 그리드 영역 |
| Bounds | struct | 3D AABB | Renderer/Collider 경계 |
| BoundsInt | struct | 3D 정수 경계 | 셀/볼륨 영역 |
| Ray | struct | 3D 원점+방향 | Physics.Raycast 입력 |
| Ray2D | struct | 2D 원점+방향 | 2D 광선 |
| Plane | struct | 3D 평면 | 기하 계산 |
| RaycastHit | struct | 3D 레이캐스트 결과 | point/normal/distance/collider |
| RaycastHit2D | struct | 2D 캐스트 결과 | point/normal/distance/collider |
| ContactPoint | struct | 3D 접촉점 정보 | 충돌 접점/법선 |
| ContactPoint2D | struct | 2D 접촉점 정보 | 2D 충돌 접점 |
| LayerMask | struct | 레이어 비트마스크 | Raycast 필터 |
| AnimationCurve | class | 키프레임 곡선 | 시간→값 곡선 |
| Keyframe | struct | AnimationCurve 키 하나 | 커브 구성 |
| Gradient | class | 색상 그라디언트 | 파티클/시각 효과 |
| GradientColorKey | struct | Gradient 색 키 | Gradient 구성 |
| GradientAlphaKey | struct | Gradient 알파 키 | Gradient 구성 |
| Hash128 | struct | 128비트 해시 | 콘텐츠/데이터 식별 |
| PropertyName | struct | 프로퍼티 이름 핸들 | 엔진 내부/고급 API |
| RangeInt | struct | 정수 시작+길이 범위 | 부분 범위 표현 |

## Unity 오브젝트 계층

[상세 문서 보기]({{ '/categories/unity-object-model/' | relative_url }})

| 타입 | 종류/기반 | 핵심 | 대표 사용 |
|---|---|---|---|
| Object | class | UnityEngine.Object | Unity 엔진 오브젝트의 공통 기반 |
| GameObject | class | Object | 씬에서 존재하는 기본 컨테이너 |
| Component | class | Object | GameObject에 부착되는 기능의 기반 |
| Behaviour | class | Component | enabled로 켜고 끌 수 있는 Component 기반 |
| MonoBehaviour | class | Behaviour | 사용자 스크립트 컴포넌트의 일반 기반 |
| ScriptableObject | class | Object | GameObject에 붙지 않는 Unity 데이터 객체 |
| Transform | class | Component | 위치·회전·스케일·부모자식 계층 |
| RectTransform | class | Transform | 2D UI 레이아웃용 Transform 확장 |
| MissingReferenceException | class | SystemException | 파괴된 Unity 오브젝트 참조 관련 예외 |

## 렌더링 / 에셋

[상세 문서 보기]({{ '/categories/rendering-assets/' | relative_url }})

| 타입 | 종류/기반 | 핵심 | 대표 사용 |
|---|---|---|---|
| Texture | class | 텍스처 공통 기반 | Material 텍스처 슬롯 |
| Texture2D | class | 2D 픽셀 텍스처 | 이미지/런타임 텍스처 |
| Texture3D | class | 3D 볼륨 텍스처 | 볼륨 데이터 |
| Cubemap | class | 6면 큐브 텍스처 | 환경 반사 |
| RenderTexture | class | 렌더 타깃 텍스처 | 카메라/후처리/미니맵 |
| Sprite | class | 2D 스프라이트 에셋 | SpriteRenderer |
| Material | class | Shader + 프로퍼티 값 | Renderer 재질 |
| Shader | class | 셰이더 프로그램 에셋 | Material 기반 |
| ComputeShader | class | GPU compute 셰이더 | GPU 계산 |
| Mesh | class | 정점/인덱스/UV/노멀 메시 데이터 | MeshFilter/SkinnedMeshRenderer |
| Renderer | class | 렌더러 공통 기반 | bounds/material/enabled |
| MeshRenderer | class | MeshFilter의 Mesh를 렌더 | 정적/일반 메시 |
| SkinnedMeshRenderer | class | 본 변형 메시 렌더 | 캐릭터 |
| SpriteRenderer | class | Sprite 렌더 | 2D |
| LineRenderer | class | 선 렌더 | 궤적/레이저 |
| TrailRenderer | class | 시간에 따른 트레일 | 칼자국/이동 궤적 |
| MeshFilter | class | 렌더할 Mesh 참조 보관 | MeshRenderer와 조합 |
| Camera | class | 씬을 렌더링하는 카메라 | 화면/RenderTexture |
| Light | class | 광원 컴포넌트 | 조명 |
| LightType | enum | 광원 종류 | Directional/Point/Spot 등 |
| TextAsset | class | 텍스트/바이너리 파일 에셋 | JSON/CSV/텍스트 읽기 |
| Font | class | 폰트 에셋 타입 | 레거시/코어 폰트 API |
| GUIStyle | class | IMGUI 스타일 | Editor/OnGUI |
| GUIContent | class | IMGUI 텍스트/이미지/툴팁 | Editor/OnGUI |

## 물리 3D / 2D

[상세 문서 보기]({{ '/categories/physics/' | relative_url }})

| 타입 | 종류/기반 | 핵심 | 대표 사용 |
|---|---|---|---|
| Rigidbody | class | 3D 물리 바디 | 힘/속도/질량/회전 |
| Collider | class | 3D Collider 공통 기반 | 충돌 영역 |
| BoxCollider | class | 박스 충돌체 | 상자/벽 |
| SphereCollider | class | 구 충돌체 | 구형 범위 |
| CapsuleCollider | class | 캡슐 충돌체 | 캐릭터 |
| MeshCollider | class | Mesh 기반 충돌체 | 복잡한 형상 |
| CharacterController | class | 캐릭터 이동용 충돌 컨트롤러 | 비-Rigidbody 캐릭터 이동 |
| Collision | class | 3D 충돌 콜백 상세 데이터 | OnCollision... 매개변수 |
| ContactPoint | struct | 3D 접촉점 | Collision.GetContact |
| RaycastHit | struct | 3D 캐스트 적중 결과 | Physics.Raycast |
| PhysicsMaterial | class | 마찰/탄성 에셋 | Collider 표면 성질 |
| Joint | class | 3D Joint 기반 | 물리 연결 |
| HingeJoint | class | 힌지 회전 Joint | 문/관절 |
| FixedJoint | class | 고정 연결 Joint | 물체 결합 |
| ConfigurableJoint | class | 고급 제약 Joint | 복잡한 관절 |
| ForceMode | enum | 힘 적용 방식 | Force/Impulse 등 |
| QueryTriggerInteraction | enum | 쿼리의 Trigger 처리 방식 | Raycast 필터 |
| Rigidbody2D | class | 2D 물리 바디 | 2D 힘/속도 |
| Collider2D | class | 2D Collider 공통 기반 | 2D 충돌 영역 |
| BoxCollider2D | class | 2D 박스 | 플랫폼/벽 |
| CircleCollider2D | class | 2D 원 | 원형 히트박스 |
| CapsuleCollider2D | class | 2D 캡슐 | 캐릭터 |
| PolygonCollider2D | class | 2D 폴리곤 | 복잡한 2D 형상 |
| EdgeCollider2D | class | 선분 체인 | 지형 경계 |
| CompositeCollider2D | class | 여러 2D Collider 합성 | 타일맵형 경계 |
| Collision2D | class | 2D 충돌 콜백 데이터 | OnCollision...2D |
| ContactPoint2D | struct | 2D 접촉점 | Collision2D |
| RaycastHit2D | struct | 2D 캐스트 결과 | Physics2D.Raycast |
| PhysicsMaterial2D | class | 2D 마찰/탄성 에셋 | Collider2D 표면 |
| Joint2D | class | 2D Joint 기반 | 2D 물리 연결 |
| RigidbodyType2D | enum | 2D 바디 타입 | Dynamic/Kinematic/Static |

## 애니메이션 / 오디오 / 파티클

[상세 문서 보기]({{ '/categories/animation-audio/' | relative_url }})

| 타입 | 종류 | 핵심 |
|---|---|---|
| Animator | class | Mecanim Animator Controller 재생/파라미터 제어 |
| RuntimeAnimatorController | class | Animator가 사용하는 컨트롤러 기반 에셋 |
| AnimatorOverrideController | class | 클립을 다른 클립으로 오버라이드 |
| AnimatorStateInfo | struct | 현재 Animator State 정보 |
| AnimatorClipInfo | struct | 재생 중 AnimationClip 정보 |
| AnimatorTransitionInfo | struct | 전이 정보 |
| Avatar | class | 휴머노이드/애니메이션 아바타 |
| AvatarMask | class | 애니메이션 적용 부위 마스크 |
| AnimationClip | class | 애니메이션 클립 에셋 |
| AnimationCurve | class | 시간에 따른 값 곡선 |
| HumanBodyBones | enum | Humanoid 본 열거형 |
| AudioClip | class | 오디오 데이터 에셋 |
| AudioSource | class | 오디오 재생 컴포넌트 |
| AudioListener | class | 오디오 수신 지점 |
| AudioMixerGroup | class | 오디오 믹서 그룹 참조 |
| AudioSettings | static class | 전역 오디오 설정/정보 |
| ParticleSystem | class | 파티클 시뮬레이션 |
| ParticleSystem.Particle | struct | 파티클 하나의 데이터 |

## 코루틴 / 비동기

[상세 문서 보기]({{ '/categories/coroutine-async/' | relative_url }})

| 타입 | 종류 | 핵심 |
|---|---|---|
| IEnumerator | interface | Unity 코루틴 메서드의 대표 반환 타입 |
| Coroutine | class | StartCoroutine가 반환하는 실행 핸들 |
| YieldInstruction | class | 여러 yield 대기 객체의 기반 |
| CustomYieldInstruction | abstract class | keepWaiting으로 커스텀 대기를 만드는 기반 |
| WaitForSeconds | class | Time.timeScale 영향을 받는 초 단위 대기 |
| WaitForSecondsRealtime | class | unscaled time 기반 대기 |
| WaitForFixedUpdate | class | 다음 FixedUpdate 타이밍까지 대기 |
| WaitForEndOfFrame | class | 프레임 렌더링 말미까지 대기 |
| WaitUntil | class | 조건이 true가 될 때까지 대기 |
| WaitWhile | class | 조건이 true인 동안 대기 |
| AsyncOperation | class | 씬 로드 등 Unity 비동기 작업의 기반 |
| ResourceRequest | class | Resources.LoadAsync 결과 |
| AssetBundleCreateRequest | class | AssetBundle 비동기 생성 요청 |
| Awaitable | class | Unity용 async/await 반환 및 대기 타입 |
| Awaitable<T> | class | 결과값을 반환하는 Unity Awaitable |
| AwaitableCompletionSource<T> | class | 사용자 코드에서 Awaitable 완료 제어 |
| Task | class | .NET 비동기 작업 타입 |
| Task<T> | class | 결과값을 반환하는 .NET Task |
| CancellationToken | struct | 비동기 취소 신호 |

## 런타임 / 씬 / 입력 / 이벤트

[상세 문서 보기]({{ '/categories/runtime-scene-input/' | relative_url }})

| 타입 | 종류 | 핵심 |
|---|---|---|
| Scene | struct | 로드된 Scene에 대한 값 핸들 |
| SceneManager | static class | 씬 로드/언로드/조회 |
| LoadSceneMode | enum | Single/Additive 로드 방식 |
| AsyncOperation | class | LoadSceneAsync 등 비동기 진행 |
| LayerMask | struct | 32개 레이어 선택 비트마스크 |
| KeyCode | enum | 레거시 Input 키 코드 |
| Touch | struct | 터치 한 점의 상태 |
| TouchPhase | enum | 터치 단계 |
| DeviceOrientation | enum | 기기 방향 |
| Resolution | struct | 화면 해상도 정보 |
| FullScreenMode | enum | 창/전체화면 모드 |
| CursorLockMode | enum | 커서 잠금 상태 |
| LogType | enum | 로그 종류 |
| RuntimePlatform | enum | 실행 플랫폼 |
| SystemLanguage | enum | 언어 코드 |
| UnityEvent | class | Inspector 연결 가능한 직렬화 이벤트 |
| UnityEvent<T> | class | 인자 하나를 전달하는 UnityEvent |
| UnityAction | delegate | UnityEvent 리스너에 쓰이는 delegate |
| Action | delegate | 반환값 없는 일반 C# 콜백 |
| Func<T> | delegate | 결과값을 반환하는 일반 C# 콜백 |
| Predicate<T> | delegate | T를 받아 bool을 반환하는 조건 delegate |
| Random.State | struct | Unity Random 상태 저장/복원 |
| Hash128 | struct | 128비트 해시 |
| JsonUtility | static class | Unity 내장 JSON 직렬화 헬퍼 |
| Resources | static class | Resources 폴더 에셋 로드 API |
