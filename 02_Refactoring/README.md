# 02 리팩터링

- [02 리팩터링](#02-리팩터링)
  - [사전학습](#사전학습)
    - [`main()` 메서드를 활용한 테스트의 문제점](#main-메서드를-활용한-테스트의-문제점)
    - [Junit을 활용한 `main()` 메서드 극복](#junit을-활용한-main-메서드-극복)
  - [문자열 계산기](#문자열-계산기)
    - [요구사항](#요구사항)
    - [추가 요구사항](#추가-요구사항)

## 사전학습

### `main()` 메서드를 활용한 테스트의 문제점

1. 프로덕션 코드와 테스트 코드가 혼재
2. 메서드 하나(`main()`)에서 여러 메서드 동시에 테스트
3. 테스트 결과를 매번 수동으로 확인

### Junit을 활용한 `main()` 메서드 극복

1. 한 번에 메서드 하나에만 집중
2. 결과 값을 눈이 아닌 프로그램을 통해 자동화
3. 테스트 코드 중복 제거

## 문자열 계산기

### 요구사항

전달하는 문자를 구분자로 분리한 후 각 숫자의 합을 구해 반환하는 프로그램 작성

* 쉽표(`,`) 또는 콜론(`:`)을 구분자로 가지는 문자열을 전달하는 경우 구분자를 기준으로 분리한 숫자의 합을 반환한다.  
  (`예`: `" " => 0`, `"1,2" => 3`, `"1,2,3" => 6`, `"1,2:3" => 6`)

* 앞의 기본 구분자(쉼표, 콜론) 외에 커스텀 구분자를 지정할 수 있다.
커스텀 구분자는 문자열 앞부분의 `//`와 `\n` 사이에 위치하는 문자를 커스텀 구분자로 사용한다.
예를 들어 `//;\n1;2;3`과 같이 값을 입력할 경우 커스텀 구분자는 세미콜론(`;`)이며,
결과 값은 `6`이 반환되어야한다.

* 문자열 계산기에 음수를 전달하는 경우 `RuntimeException`으로 예외 처리해야 한다.

* `java.lang.String`을 활용한다.

* 폴더 구조는 다음과 같다.
```
src
└ calculator
  └ Calculator.java
  └ StringCalculator.java
test
└ calculator
  └ CalculatorTest.java
  └ StringCalculatorTest.java
```

* `StringCalculator`는 다음과 같다.
```java
public class StringCalculator {
    int add(String text) {
        return 0;
    }
}
```

* 빈 문자열 또는 null 값을 입력할 경우 0을 반환해야한다. (`예`: `" " => 0`, `null => 0`)
```java
if (text == null) {}
if (text.isEmpty()) {}
```

* 숫자 하나를 문자열로 입력할 경우 해당 숫자를 반환한다.(`예`: `"1" => 1`)
```java
int number = Integer.parseInt(text);
```

* 숫자 두 개를 쉽표(`,`) 구분자로 입력할 경우 두 숫자의 합을 반환한다.(`예`: `"1,2" => 3`)
```java
String[] numbers = text.split(",");
```

* 구분자를 쉼표(,) 이외에 콜론(:)을 사용할 수 있다.(`예`: `"1,2:3" => 6`)
```java
String[] tokens = text.split(",|:");
```

* `//`와 `\n` 문자 사이에 커스텀 구분자를 지정할 수 있다.(`예`: `"//;\n1;2;3" => 6`)
```java
if (m.find()) {
    String customDelimeter = m.group(1);
    String[] tokens = m.group(2).split(customDelimeter);
}
```

* 문자열 계산기에 음수를 전달하는 경우 RuntimeException 예외 처리를 한다.
```java
구글에서 "junit5 expected exception"으로 검색하여 해결한다.
```

### 추가 요구사항

* 메서드가 한 가지 책임만 가지도록 구현한다.

* 인덴트(indent, 들여쓰기) 깊이를 1단계로 유지한다.

* else를 사용하지 않는다.