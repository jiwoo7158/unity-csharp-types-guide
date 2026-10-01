# Unity C# Types Guide

Unity/C#에서 자주 만나는 타입을 학습용으로 정리한 GitHub Pages 정적 문서입니다.

- 기준: Unity 6.x 기본 Scripting API + C#/.NET 기본 라이브러리
- 우선 범위: 별도 Unity 패키지 없이 접하는 타입
- 구성: 빠른 치트시트 → 타입 시스템 → 카테고리별 문서 → 비교 → 실전 예제 → 직렬화 → 배포
- 게시 방식: 저장소 `main` 브랜치의 `/docs` 폴더를 GitHub Pages 소스로 선택

## 폴더 구조

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

## 주의

이 문서는 “모든 Unity API 클래스 사전”이 아니라, 변수/필드/매개변수/반환값으로 자주 접하는 **타입을 이해하는 학습 문서**입니다. 각 API의 모든 멤버는 Unity 공식 Scripting API를 참고하세요.
