public class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    int subtract(int a, int b) {
        return a - b;
    }

    int multiply(int a, int b) {
        return a * b;
    }

    int divide(int a, int b) {
        return a / b;
    }

    public static void main(String[] args) {
        Calculator cal = new Calculator();
        System.out.println(cal.add(1, 2));
        System.out.println(cal.subtract(1, 2));
        System.out.println(cal.multiply(1, 2));
        System.out.println(cal.divide(1, 2));
    }
}