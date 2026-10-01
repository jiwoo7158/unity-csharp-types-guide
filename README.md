# Unity C# Types Guide

Unity/C# 코드를 읽다가 자주 만나는 타입을 **“무엇인지 / 왜 쓰는지 / 무엇과 다른지 / Unity에서 어떻게 보이는지”** 중심으로 정리한 학습용 GitHub Pages 문서입니다.

단순한 타입 목록이 아니라, 각 카테고리 문서에서 핵심 타입을 실제 코드 예제와 함께 자세히 설명합니다.

## 기준

- Unity 6.x 기본 Scripting API 중심
- C#/.NET 기본 타입과 컬렉션 포함
- 별도 Unity 패키지가 없어도 접하는 타입을 우선 정리
- Input System, Cinemachine, Addressables, DOTS 등 별도 패키지는 핵심 범위에서 제외
- Unity Inspector/직렬화 가능 여부를 C# 타입 사용 가능 여부와 분리해서 설명

## 문서 구성

```text
.
├─ README.md
└─ docs/
   ├─ _config.yml
   ├─ _layouts/default.html
   ├─ assets/
   │  ├─ css/style.css
   │  └─ js/site.js
   ├─ categories/
   │  ├─ csharp-basics.md
   │  ├─ collections.md
   │  ├─ unity-value-types.md
   │  ├─ unity-object-model.md
   │  ├─ rendering-assets.md
   │  ├─ physics.md
   │  ├─ animation-audio.md
   │  ├─ coroutine-async.md
   │  └─ runtime-scene-input.md
   ├─ index.md
   ├─ all-types.md
   ├─ cheatsheet.md
   ├─ type-system.md
   ├─ serialization.md
   ├─ confusing-types.md
   ├─ examples.md
   ├─ sources.md
   └─ deploy.md
```

## 읽는 방법

- **전체 타입 인덱스**: 타입 이름을 빠르게 찾는 1줄 색인
- **카테고리 문서**: 타입별 상세 설명, 사용 상황, 코드 예제, 주의점
- **헷갈리는 타입**: 비슷한 타입들의 역할 차이 비교
- **직렬화**: C#에서 사용할 수 있는 타입과 Unity가 Inspector에 저장할 수 있는 타입의 차이
- **실전 예제**: 여러 타입이 실제 Unity 코드에서 함께 연결되는 흐름

## GitHub Pages

현재 설정은 아래 주소를 기준으로 합니다.

```yaml
url: "https://jiwoo7158.github.io"
baseurl: "/unity-csharp-types-guide"
```

GitHub Pages에서 `main` 브랜치의 `/docs` 폴더를 게시 소스로 선택하면 됩니다.

## 문서 성격

이 프로젝트는 Unity Scripting API 전체를 그대로 복제하는 API 레퍼런스가 아닙니다. 공식 문서의 모든 멤버를 나열하기보다, 코드를 읽을 때 **타입의 역할과 관계를 빠르게 이해할 수 있는 학습용 설명서**를 목표로 합니다.

각 API의 모든 프로퍼티/메서드와 버전별 차이는 문서 안에 연결된 Unity/Microsoft 공식 문서를 함께 확인하세요.
