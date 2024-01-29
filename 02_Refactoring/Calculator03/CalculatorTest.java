public class CalculatorTest {
    public static void main(String[] args) {
        Calculator cal = new Calculator();
        add(cal);
        subtract(cal);
        mutiply(cal);
        divide(cal);
    }

    private static void divide(Calculator cal) {
        System.out.println(cal.divide(1, 2));
    }

    private static void mutiply(Calculator cal) {
        System.out.println(cal.multiply(1, 2));
    }

    private static void subtract(Calculator cal) {
        System.out.println(cal.subtract(1, 2));
    }

    private static void add(Calculator cal) {
        System.out.println(cal.add(1, 2));
    }
}