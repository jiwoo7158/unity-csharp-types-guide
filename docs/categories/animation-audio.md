---
layout: default
title: 애니메이션 / 오디오 / 파티클
eyebrow: UnityEngine
---
# 애니메이션 / 오디오 / 파티클 타입

| 타입 | 종류 | 기반/네임스페이스 | 핵심 |
|---|---|---|---|
| Animator | class | Behaviour | Mecanim Animator Controller 재생/파라미터 제어 |
| RuntimeAnimatorController | class | Object | Animator가 사용하는 컨트롤러 기반 에셋 |
| AnimatorOverrideController | class | RuntimeAnimatorController | 클립을 다른 클립으로 오버라이드 |
| AnimatorStateInfo | struct | - | 현재 Animator State 정보 |
| AnimatorClipInfo | struct | - | 재생 중 AnimationClip 정보 |
| AnimatorTransitionInfo | struct | - | 전이 정보 |
| Avatar | class | Object | 휴머노이드/애니메이션 아바타 |
| AvatarMask | class | Object | 애니메이션 적용 부위 마스크 |
| AnimationClip | class | Motion | 애니메이션 클립 에셋 |
| AnimationCurve | class | - | 시간에 따른 값 곡선 |
| HumanBodyBones | enum | - | Humanoid 본 열거형 |
| AudioClip | class | Object | 오디오 데이터 에셋 |
| AudioSource | class | Behaviour | 오디오 재생 컴포넌트 |
| AudioListener | class | Behaviour | 오디오 수신 지점 |
| AudioMixerGroup | class | Object | 오디오 믹서 그룹 참조 |
| AudioSettings | static class | - | 전역 오디오 설정/정보 |
| ParticleSystem | class | Component | 파티클 시뮬레이션 |
| ParticleSystem.Particle | struct | - | 파티클 하나의 데이터 |


## `Animator`

Animator Controller 기반 상태 머신을 재생하고 파라미터를 제어하는 Component입니다.

```csharp
Animator animator = GetComponent<Animator>();
animator.SetBool("Grounded", true);
animator.SetTrigger("Attack");
```

## `RuntimeAnimatorController`

Animator가 참조하는 컨트롤러 에셋의 기반 타입입니다. `Animator.runtimeAnimatorController`를 통해 보게 됩니다.

## `AnimationClip`

실제 애니메이션 키프레임 데이터를 담는 에셋입니다. “상태 머신을 관리하는 Controller”와 “움직임 데이터인 Clip”을 구분하세요.

## `AnimatorStateInfo`

현재 상태의 이름 해시, normalizedTime 등 상태 실행 정보를 값으로 받아볼 때 사용합니다.

## `AudioClip`

소리 데이터 자체입니다. 재생 장치가 아니라 **에셋**입니다.

## `AudioSource`

AudioClip을 재생하는 Component입니다.

```csharp
AudioSource source = GetComponent<AudioSource>();
source.clip = hitSound;
source.Play();
```

`AudioClip`과 `AudioSource`의 관계는 대략 “재생할 데이터”와 “재생하는 컴포넌트”의 관계입니다.

## `ParticleSystem`

파티클 시뮬레이션 Component입니다. 내부 모듈 접근 시 `ParticleSystem.MainModule`, `EmissionModule` 같은 작은 struct 핸들을 자주 만나게 됩니다.
