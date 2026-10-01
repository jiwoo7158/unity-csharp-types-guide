---
layout: default
title: C# 기본 타입
eyebrow: C# / .NET
---
# C# 기본 타입

Unity 스크립트도 C#이므로 가장 아래층에는 C#/.NET 타입이 있습니다. `int` 같은 키워드는 실제로 `System.Int32`의 별칭입니다.

| 표기 | 실제 .NET 타입 | 종류 | 의미 | Unity에서 자주 쓰는 곳 | Unity 기본 직렬화 |
|---|---|---|---|---|---|
| bool | System.Boolean | 값 | 참/거짓 | `bool isAlive = true;` | O |
| byte | System.Byte | 값 | 0~255 부호 없는 8비트 정수 | 픽셀/바이트 데이터 | O |
| sbyte | System.SByte | 값 | 부호 있는 8비트 정수 | 작은 범위 정수 | O |
| short | System.Int16 | 값 | 부호 있는 16비트 정수 | 메모리 형식/외부 데이터 | O |
| ushort | System.UInt16 | 값 | 부호 없는 16비트 정수 | 메모리 형식/외부 데이터 | O |
| int | System.Int32 | 값 | 가장 일반적인 정수 | 체력, 개수, 인덱스 | O |
| uint | System.UInt32 | 값 | 부호 없는 32비트 정수 | 비트/ID/네이티브 API | O |
| long | System.Int64 | 값 | 큰 정수 | 틱, 큰 카운터, 식별값 | O |
| ulong | System.UInt64 | 값 | 큰 부호 없는 정수 | 비트마스크/식별값 | O |
| float | System.Single | 값 | 32비트 부동소수 | 속도, 시간, 비율 | O |
| double | System.Double | 값 | 64비트 부동소수 | 큰 정밀도가 필요한 계산 | O |
| decimal | System.Decimal | 값 | 10진 정밀 계산 | 금액 등 일반 C# 로직 | 기본 Inspector X |
| char | System.Char | 값 | UTF-16 문자 하나 | 문자 처리 | 제한적/직접 노출 비추천 |
| string | System.String | 참조 | 문자열 | 이름, 설명, 경로 | O |
| object | System.Object | 참조 | 모든 C# 타입의 최상위 기반 | 범용 컨테이너 | 기본 직렬화 X |
| dynamic | System.Object 기반 | 참조/동적 | 컴파일 타임 타입 검사 일부를 런타임으로 | Unity 일반 코드에서 드묾 | X |
| enum | System.Enum 기반 | 값 | 명명된 선택지 | 상태, 모드, 옵션 | 32비트 이하 O |
| T? | System.Nullable<T> | 값 | 값 타입 + null | 선택적 값 | 기본 Inspector X |
| ValueTuple | System.ValueTuple<...> | 값 | 여러 값을 임시 묶음 | 메서드 다중 반환 | 기본 Inspector X |
| Tuple | System.Tuple<...> | 참조 | 여러 값 묶음 | 레거시/일반 .NET 코드 | X |
| DateTime | System.DateTime | 값 | 날짜/시간 | 세이브 메타데이터, 툴 코드 | 기본 Inspector X |
| TimeSpan | System.TimeSpan | 값 | 시간 간격 | 쿨다운/실시간 시스템 계산 | 기본 Inspector X |
| Guid | System.Guid | 값 | 128비트 식별자 | 런타임/툴 고유 ID | 기본 Inspector X |
| Type | System.Type | 참조 | 런타임 타입 정보 | 리플렉션, 팩토리 | X |
| Exception | System.Exception | 참조 | 예외 정보 | try/catch | X |
| CancellationToken | System.Threading.CancellationToken | 값 | 비동기 취소 신호 | Awaitable/Task 취소 | X |


## 숫자 타입 선택 기준

- 일반 정수는 우선 `int`.
- 일반 실수는 Unity API와 맞추기 쉬운 `float`.
- 매우 큰 범위나 정밀도가 실제로 필요할 때 `long`, `double`.
- `decimal`은 금액처럼 10진 정밀도가 중요한 일반 C# 영역에 유용하지만 Unity 수학 API 대부분은 `float` 중심입니다.
- “음수가 필요 없다”는 이유만으로 무조건 `uint`를 쓰는 것은 실익이 적을 수 있습니다. Unity API와 산술 변환에서 `int`가 더 자연스러운 경우가 많습니다.

## string은 참조 타입이지만 불변

`string`은 class 계열의 참조 타입이지만 내용 자체는 immutable입니다. 문자열을 수정하는 것처럼 보여도 실제로는 새 문자열 결과를 만드는 방식입니다.

```csharp
string name = "Player";
name += "_01";
```

## enum은 상태와 선택지를 표현하기 좋다

```csharp
public enum WeaponType
{
    Sword,
    Bow,
    Staff
}

[SerializeField] private WeaponType weaponType;
```

숫자 `0`, `1`, `2`를 직접 의미로 사용하기보다 이름을 부여할 수 있고 Inspector에서도 선택 UI로 보이기 쉬워집니다.

## object와 dynamic은 Unity 입문 단계에서 남용하지 않기

`object`는 모든 C# 객체를 받을 수 있지만, 사용할 때 원래 타입을 다시 확인하거나 캐스팅해야 합니다. `dynamic`은 더 많은 타입 검사를 런타임으로 미루므로 일반적인 Unity 게임 코드에서는 명시적 타입/제네릭이 더 읽기 쉽고 안전한 경우가 많습니다.
