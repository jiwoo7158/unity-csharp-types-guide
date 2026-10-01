---
layout: default
title: Home
eyebrow: Study Notes
---
# Unity C# Types Guide

## Unity에서 보이는 “변수 타입”을 종류별로 이해하는 문서

`int`, `float`처럼 바로 이해되는 기본 타입부터 `IReadOnlyList<T>`, `Dictionary<TKey, TValue>`, `Vector3`, `Quaternion`, `GameObject`, `Rigidbody`, `RaycastHit`, `Coroutine`, `Awaitable`까지 Unity 코드를 읽다가 자주 마주치는 타입을 한 곳에 정리했습니다.

이 문서는 API 멤버를 전부 외우는 사전보다는 **“이 타입은 어떤 종류이고, 왜 쓰며, 무엇과 헷갈리는가?”**를 파악하는 데 초점을 둡니다.

<div class="kpi">
<span><b>Unity 6.x</b> 기준</span><span><b>C#/.NET</b> 기본 포함</span><span><b>별도 패키지</b> 핵심 범위에서 제외</span><span><b>직렬화 여부</b> 별도 정리</span>
</div>

## 바로 보기

<div class="card-grid">
<a class="doc-card" href="{{ '/cheatsheet/' | relative_url }}"><strong>빠른 치트시트</strong><span>하고 싶은 일에서 바로 떠올릴 타입을 찾습니다.</span></a>
<a class="doc-card" href="{{ '/all-types/' | relative_url }}"><strong>전체 타입 인덱스</strong><span>C#/.NET과 Unity 타입을 카테고리별로 훑습니다.</span></a>
<a class="doc-card" href="{{ '/confusing-types/' | relative_url }}"><strong>헷갈리는 타입</strong><span>List와 IReadOnlyList, GameObject와 Component 같은 조합을 비교합니다.</span></a>
<a class="doc-card" href="{{ '/examples/' | relative_url }}"><strong>실전 예제</strong><span>실제 Unity 코드에서 여러 타입이 함께 쓰이는 흐름을 봅니다.</span></a>
<a class="doc-card" href="{{ '/serialization/' | relative_url }}"><strong>Inspector / 직렬화</strong><span>선언할 수 있는 타입과 Unity가 저장할 수 있는 타입을 구분합니다.</span></a>
<a class="doc-card" href="{{ '/type-system/' | relative_url }}"><strong>타입 시스템 이해</strong><span>값/참조 타입, class/struct/interface, generic부터 잡습니다.</span></a>
</div>

## 추천 학습 순서

1. **타입 시스템** — 값 타입과 참조 타입, `class`, `struct`, `interface`, generic의 의미를 먼저 봅니다.
2. **기본 타입과 컬렉션** — `int`, `string`, 배열, `List<T>`, `IEnumerable<T>`, `IReadOnlyList<T>`를 익힙니다.
3. **Unity 값 타입** — `Vector3`, `Quaternion`, `Color`, `Bounds`, `Ray`처럼 자주 전달되는 데이터 타입을 봅니다.
4. **Unity 오브젝트 계층** — `Object → Component → Behaviour → MonoBehaviour`, `GameObject`, `Transform` 관계를 잡습니다.
5. **분야별 타입** — 렌더링, 물리, 애니메이션, 오디오, 씬, 비동기를 필요에 따라 봅니다.
6. **직렬화** — “코드에서 쓸 수 있음”과 “Inspector/Scene에 저장됨”이 같은 말이 아니라는 점을 정리합니다.

## 이 사이트에서 타입을 보는 기준

| 기준 | 무엇을 보는가 |
|---|---|
| 종류 | 값 타입(struct/enum)인지 참조 타입(class/interface)인지 |
| 네임스페이스 | `System`, `System.Collections.Generic`, `UnityEngine` 등 어디에 속하는지 |
| 역할 | 숫자, 컨테이너, 좌표, 컴포넌트 참조, 충돌 결과 등 무엇을 표현하는지 |
| 생성/획득 | `new`로 만드는지, `GetComponent`로 얻는지, Unity가 콜백으로 주는지 |
| 수정 가능성 | 컬렉션 내용을 바꿀 수 있는지, 읽기 전용 인터페이스인지 |
| 직렬화 | Inspector/Scene/Prefab에 기본적으로 저장 가능한지 |
| 헷갈리는 대상 | 비슷한 이름이나 역할을 가진 타입과 차이가 무엇인지 |

> **기준 버전:** Unity 6.x 공식 Scripting API 및 Unity Manual, Microsoft C#/.NET 문서를 기준으로 작성했습니다. Unity 버전과 프로젝트 설정에 따라 API 세부 사항은 달라질 수 있습니다.

## 핵심 범위에서 제외한 것

이 문서는 먼저 Unity 기본 기능을 익히는 데 집중하기 위해 **Input System, Cinemachine, TextMeshPro, Netcode, Entities/DOTS, Addressables, AI Navigation 등 별도 패키지 중심 API**는 핵심 목록에서 제외했습니다. 이후 별도 확장 문서로 추가하기 좋은 영역입니다.
