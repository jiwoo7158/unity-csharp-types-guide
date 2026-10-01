(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  navToggle?.addEventListener('click', () => nav?.classList.toggle('open'));

  const input = document.querySelector('[data-search-input]');
  const box = document.querySelector('[data-search-results]');
  if (!input || !box) return;

  const pages = [
    ['IReadOnlyList<T>', '/categories/collections/#ireadonlylistt', '읽기 전용 인덱스 접근 인터페이스'],
    ['IEnumerable<T>', '/categories/collections/#ienumerablet', 'foreach의 핵심 열거 인터페이스'],
    ['IList<T>', '/categories/collections/#ilistt', '수정 가능한 리스트 계약'],
    ['List<T>', '/categories/collections/#listt', '가변 길이 순차 컬렉션'],
    ['Dictionary<TKey,TValue>', '/categories/collections/#dictionarytkey-tvalue', '키-값 해시 컬렉션'],
    ['HashSet<T>', '/categories/collections/#hashsett', '중복 없는 집합'],
    ['Vector2', '/categories/unity-value-types/#vector2--vector3--vector4', '2차원 벡터'],
    ['Vector3', '/categories/unity-value-types/#vector2--vector3--vector4', '3차원 벡터'],
    ['Quaternion', '/categories/unity-value-types/#quaternion', '회전 표현'],
    ['Color', '/categories/unity-value-types/#color--color32', 'RGBA 색상'],
    ['Bounds', '/categories/unity-value-types/#bounds--boundsint', '축 정렬 바운딩 박스'],
    ['GameObject', '/categories/unity-object-model/#gameobject', '씬 오브젝트 컨테이너'],
    ['Component', '/categories/unity-object-model/#component', 'GameObject 부착 기능의 기반'],
    ['MonoBehaviour', '/categories/unity-object-model/#monobehaviour', 'Unity 스크립트 컴포넌트 기반'],
    ['ScriptableObject', '/categories/unity-object-model/#scriptableobject', 'GameObject와 독립적인 데이터 오브젝트'],
    ['RectTransform', '/categories/unity-object-model/#recttransform', 'UI용 위치·크기·앵커·피벗 Transform'],
    ['UnityEngine.Object', '/categories/unity-object-model/#unityengineobject', 'Unity 엔진 오브젝트의 공통 기반'],
    ['Transform', '/categories/unity-object-model/#transform', '위치·회전·스케일·계층'],
    ['Rigidbody', '/categories/physics/#rigidbody', '3D 물리 바디'],
    ['Collider', '/categories/physics/#collider', '3D 충돌체 기반 타입'],
    ['RaycastHit', '/categories/physics/#raycasthit', '3D 레이캐스트 결과'],
    ['Collision', '/categories/physics/#collision', '3D 충돌 콜백 데이터'],
    ['PhysicsMaterial', '/categories/physics/#physicsmaterial', '3D Collider의 마찰과 탄성을 정의하는 물리 재질'],
    ['CharacterController', '/categories/physics/#charactercontroller', 'Rigidbody 없이 충돌 제약 이동을 제공하는 캐릭터 컨트롤러'],
    ['Rigidbody2D', '/categories/physics/#rigidbody2d', '2D 물리 바디'],
    ['Collider2D', '/categories/physics/#collider2d', '2D 충돌체 기반 타입'],
    ['RaycastHit2D', '/categories/physics/#raycasthit2d', '2D 캐스트 적중 결과'],
    ['PhysicsMaterial2D', '/categories/physics/#physicsmaterial2d', '2D Collider의 마찰과 탄성 재질'],
    ['Material', '/categories/rendering-assets/#material', '머티리얼 에셋'],
    ['Mesh', '/categories/rendering-assets/#mesh', '정점/삼각형 메시 데이터'],
    ['Texture2D', '/categories/rendering-assets/#texture--texture2d--rendertexture', '2D 텍스처'],
    ['Sprite', '/categories/rendering-assets/#sprite', '2D 스프라이트 에셋'],
    ['MeshFilter', '/categories/rendering-assets/#meshfilter', 'MeshRenderer에 Mesh 참조를 제공하는 컴포넌트'],
    ['MeshRenderer', '/categories/rendering-assets/#meshrenderer', '일반 Mesh 렌더링 컴포넌트'],
    ['SkinnedMeshRenderer', '/categories/rendering-assets/#skinnedmeshrenderer', '본/BlendShape로 변형되는 Mesh 렌더러'],
    ['RenderTexture', '/categories/rendering-assets/#rendertexture', '카메라/GPU 렌더링 출력용 텍스처'],
    ['Shader', '/categories/rendering-assets/#shader', 'Material이 사용하는 GPU 렌더링 프로그램'],
    ['Animator', '/categories/animation-audio/#animator', 'Mecanim 애니메이션 제어'],
    ['AudioClip', '/categories/animation-audio/#audioclip', '오디오 에셋'],
    ['AudioSource', '/categories/animation-audio/#audiosource', 'AudioClip을 실제로 재생하는 컴포넌트'],
    ['AnimationClip', '/categories/animation-audio/#animationclip', '애니메이션 데이터 에셋'],
    ['AnimatorStateInfo', '/categories/animation-audio/#animatorstateinfo', '현재 Animator State 정보'],
    ['ParticleSystem', '/categories/animation-audio/#particlesystem', '파티클 시뮬레이션 컴포넌트'],
    ['Coroutine', '/categories/coroutine-async/#coroutine', '실행 중인 코루틴 핸들'],
    ['WaitForSeconds', '/categories/coroutine-async/#waitforseconds', 'scaled time 코루틴 대기'],
    ['Awaitable', '/categories/coroutine-async/#awaitable', 'Unity 6 비동기 타입'],
    ['AsyncOperation', '/categories/coroutine-async/#asyncoperation', '씬 로드 등 Unity 비동기 작업 상태'],
    ['Task', '/categories/coroutine-async/#task', '.NET 표준 비동기 작업 타입'],
    ['CancellationToken', '/categories/coroutine-async/#cancellationtoken', '비동기 취소 요청 신호'],
    ['Scene', '/categories/runtime-scene-input/#scene', '로드된 씬 값 타입'],
    ['LayerMask', '/categories/runtime-scene-input/#layermask', '레이어 비트마스크'],
    ['KeyCode', '/categories/runtime-scene-input/#keycode', '레거시 입력 키 열거형'],
    ['직렬화 가능 여부', '/serialization/', 'Inspector/Scene/Prefab 저장 규칙'],
    ['값 타입 vs 참조 타입', '/type-system/#값-타입-vs-참조-타입', 'struct/class 차이'],
    ['전체 타입', '/all-types/', '카테고리별 전체 인덱스']
  ];

  const base = document.documentElement.getAttribute('data-baseurl') || '';
  const esc = s => s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.hidden = true; box.innerHTML = ''; return; }
    const hits = pages.filter(x => (x[0]+' '+x[2]).toLowerCase().includes(q)).slice(0,10);
    box.innerHTML = hits.length ? hits.map(x => `<a href="${base}${x[1]}"><b>${esc(x[0])}</b><small>${esc(x[2])}</small></a>`).join('') : '<div class="muted" style="padding:8px">검색 결과 없음</div>';
    box.hidden = false;
  });
  document.addEventListener('click', e => { if (!box.contains(e.target) && e.target !== input) box.hidden = true; });
})();
