---
layout: default
title: 애니메이션 / 오디오 / 파티클 타입
eyebrow: Animation / Audio / VFX
---
# 애니메이션 / 오디오 / 파티클 타입

애니메이션, 오디오, 파티클은 각각 별도의 시스템이지만 Unity 코드에서는 공통적으로 **에셋 타입과 실행 Component 타입이 분리**되어 있다는 점이 중요합니다.

예를 들어:

```text
AnimationClip          = 애니메이션 데이터 에셋
Animator               = 그 애니메이션을 캐릭터에서 실행/제어하는 Component

AudioClip              = 오디오 데이터 에셋
AudioSource            = 그 오디오를 재생하는 Component

ParticleSystem         = 파티클 시뮬레이션 Component
ParticleSystem.Particle = 파티클 하나의 런타임 데이터 struct
```

이 차이를 이해하면 “이 변수는 데이터를 들고 있는가, 씬에서 실제로 실행하는 기능인가?”를 빠르게 판단할 수 있습니다.

---

# 애니메이션

## `Animator`

`Animator`는 Mecanim/Animator Controller 기반 애니메이션을 **씬의 GameObject에서 실행하고 제어하는 Component**입니다.

일반적으로 캐릭터의 Animator에는 Animator Controller가 연결되어 있고, 코드에서는 파라미터 값을 변경하거나 현재 상태를 조회합니다.

```csharp
[SerializeField] private Animator animator;

void Update()
{
    animator.SetFloat("Speed", moveSpeed);
    animator.SetBool("Grounded", isGrounded);
}
```

### 자주 보는 파라미터 API

- `SetBool`
- `SetInteger`
- `SetFloat`
- `SetTrigger`
- `ResetTrigger`

```csharp
animator.SetTrigger("Attack");
```

### 문자열 대신 Hash 사용

같은 파라미터 이름을 매우 자주 사용할 때 `Animator.StringToHash`를 사용해 ID를 미리 만들 수 있습니다.

```csharp
private static readonly int SpeedHash = Animator.StringToHash("Speed");

void Update()
{
    animator.SetFloat(SpeedHash, moveSpeed);
}
```

이 방식은 문자열 오타를 한 곳에 모으고 반복 문자열 처리도 줄일 수 있습니다.

### 현재 상태 조회

```csharp
AnimatorStateInfo state = animator.GetCurrentAnimatorStateInfo(0);
```

`0`은 레이어 인덱스입니다.

### Root Motion

Animator는 애니메이션 자체의 이동을 Transform/캐릭터 이동에 적용하는 Root Motion과도 관련됩니다. `applyRootMotion`, `OnAnimatorMove` 등을 접할 수 있습니다. 코드 이동과 Root Motion을 동시에 어떻게 조합할지 명확히 정하는 것이 중요합니다.

[Unity 공식 문서: Animator](https://docs.unity3d.com/ScriptReference/Animator.html)

---

## `RuntimeAnimatorController`

`RuntimeAnimatorController`는 Animator가 사용하는 **런타임 애니메이터 컨트롤러의 기반 에셋 타입**입니다.

```csharp
RuntimeAnimatorController controller = animator.runtimeAnimatorController;
```

일반적인 Animator Controller와 `AnimatorOverrideController`가 이 계열과 연결됩니다. “Animator Component”가 실제 씬 실행 주체라면, RuntimeAnimatorController는 **상태 머신/클립 연결 정보를 담는 에셋 쪽**에 가깝습니다.

런타임에 Animator의 컨트롤러를 교체할 때도 이 타입을 볼 수 있습니다.

```csharp
animator.runtimeAnimatorController = anotherController;
```

---

## `AnimatorOverrideController`

`AnimatorOverrideController`는 기존 Animator Controller의 구조는 유지하면서 **특정 AnimationClip만 다른 Clip으로 교체**할 수 있도록 하는 컨트롤러 타입입니다.

예를 들어 같은 “Idle → Attack → Hit” 상태 구조를 여러 무기나 캐릭터가 공유하되, 실제 클립만 다르게 쓰고 싶을 때 유용합니다.

```csharp
AnimatorOverrideController overrideController =
    new AnimatorOverrideController(baseController);

overrideController["Attack"] = swordAttackClip;
animator.runtimeAnimatorController = overrideController;
```

실제 프로젝트에서는 클립 이름 문자열 관리, 런타임 할당 비용, Animator 재바인딩 여부 등을 함께 고려합니다.

---

## `AnimatorStateInfo`

`AnimatorStateInfo`는 **현재 Animator State의 상태 정보를 담는 struct**입니다.

```csharp
AnimatorStateInfo state = animator.GetCurrentAnimatorStateInfo(0);
```

대표적으로 다음 정보를 확인합니다.

- `normalizedTime`: 상태 재생 진행도 개념
- `length`: 상태 길이
- `speed`, `speedMultiplier`
- `fullPathHash`, `shortNameHash`
- `IsName(...)`, `IsTag(...)`

```csharp
if (state.IsName("Attack") && state.normalizedTime >= 1f)
{
    // 공격 상태가 한 사이클 이상 진행됨
}
```

### `normalizedTime` 주의

반복 애니메이션에서는 1을 넘을 수 있습니다. 정수 부분은 반복 횟수, 소수 부분은 현재 반복의 진행도를 표현하는 식으로 이해할 수 있습니다. “0~1 사이만 나온다”고 단정하지 않는 것이 좋습니다.

---

## `AnimatorClipInfo`

`AnimatorClipInfo`는 현재 상태에서 실제로 재생/블렌딩되고 있는 **AnimationClip과 가중치(weight)** 정보를 나타냅니다.

Animator State 하나가 항상 AnimationClip 하나와 완전히 동일한 것은 아닙니다. Blend Tree나 전이 과정에서는 여러 Clip이 동시에 기여할 수 있습니다.

```csharp
AnimatorClipInfo[] clips = animator.GetCurrentAnimatorClipInfo(0);
foreach (AnimatorClipInfo info in clips)
{
    Debug.Log($"{info.clip.name}: {info.weight}");
}
```

---

## `AnimatorTransitionInfo`

`AnimatorTransitionInfo`는 Animator가 상태 사이를 전이 중일 때 **현재 Transition의 정보**를 담습니다.

```csharp
if (animator.IsInTransition(0))
{
    AnimatorTransitionInfo transition = animator.GetAnimatorTransitionInfo(0);
}
```

전이의 normalizedTime, 이름/해시 등의 정보를 확인할 수 있습니다. 일반적인 게임플레이에서는 “전이 중인가?” 정도만 필요한 경우가 많지만, 세밀한 애니메이션 제어에서는 유용합니다.

---

## `Avatar`

`Avatar`는 캐릭터의 뼈대와 애니메이션 시스템 사이의 매핑을 표현하는 에셋입니다. 특히 Humanoid 리그에서 중요한 역할을 합니다.

`Animator.avatar`를 통해 현재 Animator의 Avatar를 확인할 수 있습니다.

```csharp
Avatar avatar = animator.avatar;
```

일반 게임플레이 코드에서 Avatar를 자주 직접 조작하기보다는 모델 Import 설정과 Humanoid 리깅 과정에서 더 많이 접하게 됩니다.

---

## `AvatarMask`

`AvatarMask`는 애니메이션이 **어떤 신체 부위/Transform에 적용될지 제한**하는 에셋입니다. Animator Layer와 함께 사용하여 상체/하체 애니메이션을 분리하는 대표적인 용도가 있습니다.

예:

- 하체는 달리기
- 상체는 총 조준
- 특정 팔만 별도 애니메이션

코드에서 직접 조작하는 경우보다 Animator Controller의 Layer 설정에서 참조하는 경우가 많습니다.

---

## `AnimationClip`

`AnimationClip`은 **시간에 따라 여러 프로퍼티가 어떻게 변하는지 저장한 애니메이션 데이터 에셋**입니다.

```csharp
[SerializeField] private AnimationClip attackClip;
```

클립에는 Transform의 위치/회전, SkinnedMeshRenderer의 BlendShape, 사용자 스크립트의 직렬화 가능한 프로퍼티 등 다양한 애니메이션 커브가 포함될 수 있습니다.

### Clip과 State는 다르다

- `AnimationClip`: 실제 애니메이션 데이터
- Animator State: Animator Controller 안에서 Clip/BlendTree를 재생하는 상태 노드

State 이름과 Clip 이름이 같을 수도 있지만 개념적으로는 별개입니다.

### 길이

```csharp
float seconds = attackClip.length;
```

다만 실제 Animator State 재생 시간은 상태 속도, Animator 속도, 전이 등 영향을 받을 수 있으므로 `clip.length` 하나만으로 모든 런타임 완료 시점을 단정하면 안 됩니다.

---

## `AnimationCurve`

`AnimationCurve`는 시간 또는 임의의 float 입력을 받아 float 값을 계산하는 곡선입니다. AnimationClip 내부에서도 쓰이지만, 게임플레이 데이터로도 매우 유용합니다.

```csharp
[SerializeField] private AnimationCurve recoilCurve;

float recoil = recoilCurve.Evaluate(t);
```

자세한 값 타입 관점 설명은 [Unity 값 타입 문서]({{ '/categories/unity-value-types/#animationcurve' | relative_url }})를 참고하세요.

---

## `HumanBodyBones`

`HumanBodyBones`는 Humanoid Avatar에서 표준화된 신체 본을 나타내는 enum입니다.

```csharp
Transform rightHand = animator.GetBoneTransform(HumanBodyBones.RightHand);
```

무기 부착, IK 타깃 설정, 특정 신체 부위 위치 조회 등에 매우 유용합니다.

```csharp
if (rightHand != null)
{
    weapon.transform.SetParent(rightHand, false);
}
```

Humanoid 리그가 아닌 Generic 리그에서는 이 표준 본 매핑을 그대로 사용할 수 없다는 점을 기억하세요.

---

# 오디오

## `AudioClip`

`AudioClip`은 **오디오 샘플 데이터를 담는 에셋 타입**입니다. 음악, 효과음, 음성 파일 등을 Import하면 AudioClip으로 참조하게 됩니다.

```csharp
[SerializeField] private AudioClip hitSound;
```

대표 정보:

- `length`: 길이(초)
- `samples`: 샘플 수
- `channels`: 채널 수
- `frequency`: 샘플링 주파수

### Clip은 재생기가 아니다

AudioClip 자체는 “소리 데이터”입니다. 실제 씬에서 재생하는 역할은 `AudioSource`가 합니다.

```text
AudioClip   = 무엇을 재생할지
AudioSource = 어디서/어떻게 재생할지
```

---

## `AudioSource`

`AudioSource`는 AudioClip을 **씬에서 실제로 재생하는 Component**입니다.

```csharp
[SerializeField] private AudioSource audioSource;
[SerializeField] private AudioClip attackSound;

void PlayAttackSound()
{
    audioSource.PlayOneShot(attackSound);
}
```

### 자주 보는 설정

- `clip`: 기본 Clip
- `volume`
- `pitch`
- `loop`
- `playOnAwake`
- `spatialBlend`: 2D/3D 공간 음향 비율
- `outputAudioMixerGroup`

### `Play`와 `PlayOneShot`

```csharp
audioSource.clip = music;
audioSource.Play();
```

`Play`는 source의 현재 clip을 재생합니다.

```csharp
audioSource.PlayOneShot(hitSound);
```

`PlayOneShot`은 일회성 효과음을 겹쳐 재생하는 데 자주 사용됩니다.

### 2D와 3D 오디오

`spatialBlend`가 0에 가까우면 위치와 무관한 2D 소리에 가깝고, 1에 가까우면 AudioSource의 Transform 위치를 이용한 3D 공간 음향에 가깝습니다.

[Unity 공식 문서: AudioSource](https://docs.unity3d.com/ScriptReference/AudioSource.html)

---

## `AudioListener`

`AudioListener`는 **소리를 듣는 위치**를 나타내는 Component입니다. 일반적으로 메인 Camera 또는 플레이어 관점에 하나를 둡니다.

3D AudioSource의 거리/방향 계산은 AudioListener의 위치와 관계됩니다.

씬에 여러 AudioListener가 동시에 활성화되어 있으면 경고나 의도치 않은 동작이 발생할 수 있으므로 일반적인 게임에서는 활성 Listener를 하나로 유지합니다.

---

## `AudioMixerGroup`

`AudioMixerGroup`은 Audio Mixer 에셋 내부의 그룹을 코드에서 참조하는 타입입니다. AudioSource의 출력을 특정 믹서 그룹으로 보낼 수 있습니다.

```csharp
[SerializeField] private AudioMixerGroup sfxGroup;

void Awake()
{
    audioSource.outputAudioMixerGroup = sfxGroup;
}
```

예를 들어 다음처럼 오디오를 분리할 수 있습니다.

```text
Master
├─ Music
├─ SFX
└─ Voice
```

그룹별 볼륨, 이펙트, 믹싱 처리를 관리하는 구조에 유용합니다.

---

## `AudioSettings`

`AudioSettings`는 특정 GameObject에 붙는 컴포넌트가 아니라 **전역 오디오 설정과 DSP 관련 정보를 제공하는 정적 API**입니다.

오디오 출력 설정, DSP 시간 등 일반적인 효과음 재생보다 낮은 레벨의 정보를 다룰 때 접할 수 있습니다.

```csharp
double dspTime = AudioSettings.dspTime;
```

리듬 게임이나 정확한 오디오 스케줄링처럼 `Time.time`보다 오디오 DSP 시계가 중요한 시스템에서 특히 의미가 있습니다.

---

# 파티클

## `ParticleSystem`

`ParticleSystem`은 수많은 작은 입자를 생성하고 업데이트하는 **파티클 시뮬레이션 Component**입니다.

```csharp
[SerializeField] private ParticleSystem hitEffect;

void PlayHitEffect()
{
    hitEffect.Play();
}
```

### 모듈 구조

ParticleSystem API는 여러 설정을 “모듈 struct” 형태로 제공합니다.

```csharp
var emission = hitEffect.emission;
emission.rateOverTime = 20f;

var main = hitEffect.main;
main.startLifetime = 1f;
```

`main`, `emission`, `shape`, `colorOverLifetime` 등 다양한 모듈이 있습니다.

### 모듈 변수를 받아 쓰는 이유

```csharp
var main = particleSystem.main;
main.startSpeed = 5f;
```

모듈은 struct 형태로 보이지만 ParticleSystem 내부 설정과 연결되는 특별한 API 패턴입니다. 일반 struct 복사와 완전히 같은 감각으로 “복사본을 수정했으니 원본은 안 바뀐다”고 생각하면 혼동할 수 있습니다.

---

## `ParticleSystem.Particle`

`ParticleSystem.Particle`은 **현재 살아 있는 파티클 하나의 상태 데이터**를 나타내는 struct입니다.

대표 정보:

- position
- velocity
- remainingLifetime
- startLifetime
- startColor
- startSize
- rotation

```csharp
ParticleSystem.Particle[] particles =
    new ParticleSystem.Particle[particleSystem.main.maxParticles];

int count = particleSystem.GetParticles(particles);

for (int i = 0; i < count; i++)
{
    particles[i].startColor = Color.red;
}

particleSystem.SetParticles(particles, count);
```

일반적인 파티클 효과는 Inspector 모듈만으로 충분한 경우가 많고, Particle struct 직접 조작은 커스텀 런타임 제어가 필요할 때 사용합니다.

---

# 자주 헷갈리는 조합

| 조합 | 차이 |
|---|---|
| `Animator` vs `AnimationClip` | 실행/상태 제어 Component vs 애니메이션 데이터 에셋 |
| `RuntimeAnimatorController` vs `Animator` | 상태 머신/컨트롤러 에셋 vs 씬에서 실제 실행하는 Component |
| `AnimatorStateInfo` vs `AnimatorClipInfo` | 현재 State 정보 vs 실제 블렌딩 중인 Clip 정보 |
| `AnimationCurve` vs `AnimationClip` | float 곡선 하나 중심 vs 여러 프로퍼티 애니메이션 데이터 |
| `AudioClip` vs `AudioSource` | 오디오 데이터 vs 재생 Component |
| `AudioSource` vs `AudioListener` | 소리를 내는 위치/재생기 vs 듣는 위치 |
| `ParticleSystem` vs `ParticleSystem.Particle` | 전체 시뮬레이션 Component vs 입자 하나의 값 데이터 |

## 추천 학습 순서

### 애니메이션

1. `Animator`
2. `AnimationClip`
3. Animator Controller / 파라미터
4. `AnimatorStateInfo`
5. `RuntimeAnimatorController`
6. 필요할 때 Avatar, Override Controller, ClipInfo 확장

### 오디오

1. `AudioClip`
2. `AudioSource`
3. `AudioListener`
4. `AudioMixerGroup`
5. DSP 시계가 필요하면 `AudioSettings`

### 파티클

1. ParticleSystem Inspector 모듈
2. `Play`, `Stop`, `Emit`
3. 모듈 API
4. 필요할 때 `ParticleSystem.Particle` 직접 조작
