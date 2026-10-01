---
layout: default
title: 코루틴과 비동기 타입
eyebrow: Coroutine / Async
---
# 코루틴 / 비동기 타입

| 타입 | 종류 | 네임스페이스 | 핵심 |
|---|---|---|---|
| IEnumerator | interface | System.Collections | Unity 코루틴 메서드의 대표 반환 타입 |
| Coroutine | class | UnityEngine | StartCoroutine가 반환하는 실행 핸들 |
| YieldInstruction | class | UnityEngine | 여러 yield 대기 객체의 기반 |
| CustomYieldInstruction | abstract class | UnityEngine | keepWaiting으로 커스텀 대기를 만드는 기반 |
| WaitForSeconds | class | UnityEngine | Time.timeScale 영향을 받는 초 단위 대기 |
| WaitForSecondsRealtime | class | UnityEngine | unscaled time 기반 대기 |
| WaitForFixedUpdate | class | UnityEngine | 다음 FixedUpdate 타이밍까지 대기 |
| WaitForEndOfFrame | class | UnityEngine | 프레임 렌더링 말미까지 대기 |
| WaitUntil | class | UnityEngine | 조건이 true가 될 때까지 대기 |
| WaitWhile | class | UnityEngine | 조건이 true인 동안 대기 |
| AsyncOperation | class | UnityEngine | 씬 로드 등 Unity 비동기 작업의 기반 |
| ResourceRequest | class | UnityEngine | Resources.LoadAsync 결과 |
| AssetBundleCreateRequest | class | UnityEngine | AssetBundle 비동기 생성 요청 |
| Awaitable | class | UnityEngine | Unity용 async/await 반환 및 대기 타입 |
| Awaitable<T> | class | UnityEngine | 결과값을 반환하는 Unity Awaitable |
| AwaitableCompletionSource<T> | class | UnityEngine | 사용자 코드에서 Awaitable 완료 제어 |
| Task | class | System.Threading.Tasks | .NET 비동기 작업 타입 |
| Task<T> | class | System.Threading.Tasks | 결과값을 반환하는 .NET Task |
| CancellationToken | struct | System.Threading | 비동기 취소 신호 |


## `IEnumerator`

Unity 코루틴 메서드에서 가장 익숙한 반환 타입입니다.

```csharp
IEnumerator Flash()
{
    renderer.enabled = false;
    yield return new WaitForSeconds(0.1f);
    renderer.enabled = true;
}
```

`IEnumerator` 자체가 “코루틴 전용 타입”은 아닙니다. 원래 열거자의 인터페이스이고, Unity가 이 패턴을 코루틴 실행 모델에 활용합니다.

## `Coroutine`

```csharp
Coroutine running;

void Start()
{
    running = StartCoroutine(Flash());
}

void Stop()
{
    if (running != null)
        StopCoroutine(running);
}
```

`IEnumerator`는 실행 절차를 나타내는 객체이고, `Coroutine`은 Unity가 실행 중인 코루틴을 추적하기 위해 반환하는 핸들입니다.

## `WaitForSeconds`

`Time.timeScale`이 반영되는 scaled time 대기입니다. 실시간 기준이 필요하면 `WaitForSecondsRealtime`을 봅니다.

## `WaitUntil` / `WaitWhile`

```csharp
yield return new WaitUntil(() => isLoaded);
yield return new WaitWhile(() => isBusy);
```

조건 delegate를 프레임마다 확인해 코루틴 재개 시점을 결정합니다.

## `AsyncOperation`

씬 비동기 로딩 같은 Unity 작업에서 진행 상태를 표현합니다.

```csharp
AsyncOperation op = SceneManager.LoadSceneAsync("Battle");
while (!op.isDone)
{
    Debug.Log(op.progress);
    await Awaitable.NextFrameAsync();
}
```

## `Awaitable`

Unity 6에서 중요도가 높아진 Unity 전용 async/await 타입입니다.

```csharp
async Awaitable DelayExample()
{
    await Awaitable.WaitForSecondsAsync(1f);
    Debug.Log("1 second later");
}
```

Unity 공식 문서는 일반적인 Unity 비동기 코드에서 `Task`와 다른 특성을 가진 `Awaitable`을 제공합니다. 특히 Awaitable 인스턴스는 풀링되므로 **같은 인스턴스를 여러 번 await하면 안 되는 점**을 주의해야 합니다.

## `Task`와 `Awaitable`

둘 다 `async/await` 문법에 사용할 수 있지만 실행/continuation 모델과 수명 특성이 다릅니다. Unity API를 직접 다루는 코드에서는 `Awaitable`, 일반 .NET 라이브러리와 연동하는 코드에서는 `Task`를 마주칠 수 있습니다. 무조건 하나로 통일하기보다 호출하는 API의 반환 타입과 스레드 요구 사항을 확인하세요.
