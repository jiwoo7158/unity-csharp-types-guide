---
layout: default
title: 공식 문서 출처
eyebrow: References
---
# 조사 기준과 공식 문서

이 문서는 **Unity 6.x 공식 Manual / Scripting API**와 **Microsoft C#/.NET 공식 문서**를 우선 출처로 사용했습니다. 개별 타입의 전체 멤버와 버전별 차이는 아래 공식 문서에서 다시 확인하는 것을 권장합니다.

## Unity

- [Unity 6 Scripting API](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/)
- [Unity 현재 Scripting API](https://docs.unity3d.com/ScriptReference/)
- [Script serialization](https://docs.unity3d.com/6000.0/Documentation/Manual/script-serialization.html)
- [Serialization rules](https://docs.unity3d.com/6000.0/Documentation/Manual/script-serialization-rules.html)
- [GameObject](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/GameObject.html)
- [Transform](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Transform.html)
- [MonoBehaviour](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/MonoBehaviour.html)
- [ScriptableObject](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/ScriptableObject.html)
- [Vector3](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Vector3.html)
- [Quaternion](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Quaternion.html)
- [Renderer](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Renderer.html)
- [Material](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Material.html)
- [Rigidbody](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Rigidbody.html)
- [Collider](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Collider.html)
- [Physics](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Physics.html)
- [Rigidbody2D](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Rigidbody2D.html)
- [Physics2D module](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/UnityEngine.Physics2DModule.html)
- [WaitForSeconds](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/WaitForSeconds.html)
- [Awaitable](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Awaitable.html)
- [Awaitable 비동기 프로그래밍](https://docs.unity3d.com/6000.0/Documentation/Manual/async-awaitable-introduction.html)

## Microsoft C# / .NET

- [C# built-in types](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/built-in-types)
- [C# value types](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/value-types)
- [C# reference types](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/reference-types)
- [C# collections](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/collections)
- [System.Collections.Generic](https://learn.microsoft.com/dotnet/api/system.collections.generic)
- [IReadOnlyList&lt;T&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.ireadonlylist-1)
- [List&lt;T&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.list-1)
- [Dictionary&lt;TKey,TValue&gt;](https://learn.microsoft.com/dotnet/api/system.collections.generic.dictionary-2)
- [Delegates](https://learn.microsoft.com/dotnet/csharp/programming-guide/delegates/)
- [async / await](https://learn.microsoft.com/dotnet/csharp/asynchronous-programming/)

## 버전 주의

Unity는 버전이 올라가며 API 이름이 바뀌거나 권장 방식이 변할 수 있습니다. 예를 들어 Unity 6에서는 `Rigidbody.linearVelocity`, `Rigidbody.linearDamping` 같은 명칭을 현재 문서에서 확인할 수 있습니다. 오래된 블로그/영상의 `velocity`, `drag` 중심 설명과 섞일 때는 **현재 사용하는 Unity 버전의 Scripting API**를 우선 확인하세요.

문서 조사 기준일: **2026-10-02**.

## 이번 상세화에서 추가로 확인한 Unity 6 문서

- [PhysicsMaterial](https://docs.unity3d.com/ScriptReference/PhysicsMaterial.html)
- [PhysicsMaterial2D](https://docs.unity3d.com/ScriptReference/PhysicsMaterial2D.html)
- [CharacterController](https://docs.unity3d.com/ScriptReference/CharacterController.html)
- [RectTransform](https://docs.unity3d.com/ScriptReference/RectTransform.html)
- [MeshRenderer](https://docs.unity3d.com/ScriptReference/MeshRenderer.html)
- [SkinnedMeshRenderer](https://docs.unity3d.com/ScriptReference/SkinnedMeshRenderer.html)
- [Rigidbody2D](https://docs.unity3d.com/ScriptReference/Rigidbody2D.html)
- [SceneManager](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.html)
- [Animator](https://docs.unity3d.com/ScriptReference/Animator.html)
- [AudioSource](https://docs.unity3d.com/ScriptReference/AudioSource.html)

상세 설명은 공식 문서의 정의를 그대로 나열하기보다, 타입의 **역할·관계·사용 맥락을 학습하기 쉽게 재구성**했습니다. 정확한 전체 멤버 목록은 각 공식 API 페이지를 기준으로 확인하세요.
