---
layout: default
title: 실전 타입 예제
eyebrow: Examples
---
# 여러 타입을 실제 코드 흐름으로 보기

## 예제 1. 내부 `List<T>` + 외부 `IReadOnlyList<T>`

```csharp
using System.Collections.Generic;
using UnityEngine;

public class EnemyRegistry : MonoBehaviour
{
    private readonly List<Enemy> enemies = new();

    public IReadOnlyList<Enemy> Enemies => enemies;

    public void Register(Enemy enemy)
    {
        if (enemy != null && !enemies.Contains(enemy))
            enemies.Add(enemy);
    }

    public void Unregister(Enemy enemy)
    {
        enemies.Remove(enemy);
    }
}
```

**등장 타입:** `List<Enemy>`, `IReadOnlyList<Enemy>`, `Enemy`, `MonoBehaviour`, `bool` 결과.

핵심은 Registry 내부만 목록을 변경하고, 다른 코드에는 읽기 인터페이스를 제공하는 것입니다.

## 예제 2. Inspector 설정 + Dictionary 런타임 캐시

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

public class ItemDatabase : MonoBehaviour
{
    [Serializable]
    public class Entry
    {
        public string id;
        public ItemData data;
    }

    [SerializeField] private List<Entry> entries = new();
    private Dictionary<string, ItemData> byId;

    private void Awake()
    {
        byId = new Dictionary<string, ItemData>(entries.Count);
        foreach (Entry entry in entries)
            byId[entry.id] = entry.data;
    }

    public bool TryGet(string id, out ItemData data)
        => byId.TryGetValue(id, out data);
}
```

**등장 타입:** 사용자 class, `List<T>`, `Dictionary<TKey,TValue>`, `string`, `bool`, `out` 매개변수.

## 예제 3. Ray → RaycastHit → Collider → GameObject

```csharp
using UnityEngine;

public class Shooter : MonoBehaviour
{
    [SerializeField] private float range = 100f;
    [SerializeField] private LayerMask targetMask;

    public void Fire()
    {
        Ray ray = new Ray(transform.position, transform.forward);

        if (Physics.Raycast(ray, out RaycastHit hit, range, targetMask))
        {
            Collider collider = hit.collider;
            GameObject target = collider.gameObject;
            Vector3 hitPoint = hit.point;

            Debug.Log($"Hit {target.name} at {hitPoint}");
        }
    }
}
```

타입이 “연결”되어 읽히는 좋은 예입니다.

```text
Transform → Vector3 position/forward
       ↓
      Ray
       ↓ Physics.Raycast
  RaycastHit
       ↓
   Collider → GameObject
```

## 예제 4. Rigidbody 물리 이동

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class ImpulseMover : MonoBehaviour
{
    [SerializeField] private float impulse = 5f;
    private Rigidbody body;

    private void Awake()
    {
        body = GetComponent<Rigidbody>();
    }

    public void Jump()
    {
        body.AddForce(Vector3.up * impulse, ForceMode.Impulse);
    }
}
```

**등장 타입:** `Rigidbody`, `Vector3`, `float`, `ForceMode` enum.

## 예제 5. Animator + enum 상태

```csharp
using UnityEngine;

public class CharacterAnimation : MonoBehaviour
{
    public enum LocomotionState
    {
        Idle,
        Move,
        Air
    }

    [SerializeField] private Animator animator;
    public LocomotionState State { get; private set; }

    public void SetSpeed(float speed)
    {
        animator.SetFloat("Speed", speed);
        State = speed > 0.01f ? LocomotionState.Move : LocomotionState.Idle;
    }
}
```

## 예제 6. AudioClip은 데이터, AudioSource는 재생기

```csharp
using UnityEngine;

public class HitSound : MonoBehaviour
{
    [SerializeField] private AudioSource source;
    [SerializeField] private AudioClip clip;

    public void Play()
    {
        source.PlayOneShot(clip);
    }
}
```

## 예제 7. 코루틴 타입 관계

```csharp
using System.Collections;
using UnityEngine;

public class Blinker : MonoBehaviour
{
    private Coroutine routine;

    public void Begin()
    {
        routine = StartCoroutine(Blink());
    }

    private IEnumerator Blink()
    {
        while (true)
        {
            gameObject.SetActive(!gameObject.activeSelf);
            yield return new WaitForSeconds(0.5f);
        }
    }
}
```

`IEnumerator`는 코루틴 본문 반환 타입, `Coroutine`은 실행 핸들, `WaitForSeconds`는 yield instruction입니다.

## 예제 8. Unity 6 `Awaitable`

```csharp
using UnityEngine;

public class AsyncExample : MonoBehaviour
{
    private async Awaitable Start()
    {
        await Awaitable.NextFrameAsync();
        await Awaitable.WaitForSecondsAsync(1f);
        Debug.Log("Ready");
    }
}
```

## 예제 9. ScriptableObject 데이터 참조

```csharp
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Weapon Data")]
public class WeaponData : ScriptableObject
{
    public string displayName;
    public int damage;
    public Sprite icon;
    public AudioClip attackSound;
}
```

하나의 데이터 에셋 안에서도 C# 기본 타입과 UnityEngine.Object 참조 타입이 섞여 사용됩니다.

## 예제 10. struct 이벤트 데이터

```csharp
public readonly struct DamageEvent
{
    public readonly int Amount;
    public readonly Vector3 Point;
    public readonly GameObject Source;

    public DamageEvent(int amount, Vector3 point, GameObject source)
    {
        Amount = amount;
        Point = point;
        Source = source;
    }
}
```

작은 전달용 데이터는 사용자 `struct`로 묶을 수 있습니다. 단, Unity Inspector에 저장할 데이터인지 단순 런타임 전달 데이터인지에 따라 `readonly`와 `[Serializable]` 같은 설계 선택이 달라집니다.
