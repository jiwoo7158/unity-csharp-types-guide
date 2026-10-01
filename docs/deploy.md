---
layout: default
title: GitHub Pages 배포 방법
eyebrow: Deploy
---
# GitHub Pages 배포 방법

이 프로젝트는 `/docs` 폴더를 GitHub Pages 게시 소스로 사용하는 구성을 기준으로 만들었습니다.

## 1. 저장소에 파일 올리기

압축을 풀면 아래 구조가 나옵니다.

```text
.
├─ README.md
└─ docs/
   ├─ _config.yml
   ├─ _layouts/default.html
   ├─ assets/
   ├─ categories/
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

이 구조 그대로 GitHub 저장소 루트에 올립니다.

## 2. Pages 설정

1. GitHub 저장소 → `Settings`
2. 왼쪽 `Pages`
3. `Build and deployment`의 Source를 `Deploy from a branch`
4. Branch를 `main`
5. Folder를 `/docs`
6. 저장

## 3. 저장소 이름이 URL에 들어가는 경우

프로젝트 사이트가 다음과 같다면:

```text
https://username.github.io/unity-csharp-types-guide/
```

`docs/_config.yml`에서 `baseurl`을 저장소 이름에 맞춥니다.

```yml
baseurl: "/unity-csharp-types-guide"
```

커스텀 도메인을 쓰고 루트에 매핑한다면 환경에 맞게 `baseurl`을 다시 조정하면 됩니다.

## 4. 문서 수정 위치

| 수정 내용 | 파일 |
|---|---|
| 첫 화면 | `docs/index.md` |
| 전체 타입 목록 | `docs/all-types.md` |
| C# 기본 | `docs/categories/csharp-basics.md` |
| 컬렉션 | `docs/categories/collections.md` |
| Unity 값 타입 | `docs/categories/unity-value-types.md` |
| Object/Component | `docs/categories/unity-object-model.md` |
| 렌더링/에셋 | `docs/categories/rendering-assets.md` |
| 물리 | `docs/categories/physics.md` |
| 애니메이션/오디오 | `docs/categories/animation-audio.md` |
| 코루틴/비동기 | `docs/categories/coroutine-async.md` |
| 씬/입력/이벤트 | `docs/categories/runtime-scene-input.md` |
| 비교 문서 | `docs/confusing-types.md` |
| 예제 | `docs/examples.md` |
| 직렬화 | `docs/serialization.md` |
| 디자인 | `docs/assets/css/style.css` |
| 검색/모바일 메뉴 | `docs/assets/js/site.js` |

## 5. 확장 방향

나중에 패키지까지 공부한다면 기본 문서와 섞지 않고 아래처럼 새 카테고리로 분리하는 방식을 권장합니다.

```text
docs/packages/
├─ input-system.md
├─ cinemachine.md
├─ textmeshpro.md
├─ addressables.md
├─ netcode.md
└─ entities.md
```

그러면 “Unity 기본”과 “설치 패키지 API” 경계가 문서 구조에서도 분명해집니다.
