## 1. はじめての Java

Java プログラムは、Java バーチャルマシン（JVM）上で動作するため、異なるオペレーティングシステム上でも変更なしに実行することができます。これによって、様々なデバイスや OS で動作するアプリケーションを同一のソースコードで開発することが可能になります。

また、Java はオブジェクト指向プログラミング（OOP）を強く推奨する言語です。カプセル化、継承、そして多態性といった OOP の主要な原則をサポートしています。

### 最初の Java プログラム

初めての Java プログラムとして、"Hello, world!" を出力するシンプルなプログラムを見てみましょう。

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

上記のコードは、基本的な Java のクラス構成を示しています。`public class HelloWorld` でクラスを定義し、`public static void main(String[] args)` でアプリケーションのエントリーポイントを指定しています。`System.out.println` は、コンソールにテキストを出力するためのメソッドです。

Java を学ぶ初学者にとって重要なのは、この言語が安全で信頼性の高いソフトウェアを開発するための機能を豊富に備えているということです。これらの特徴は、大規模な企業向けアプリケーションから Android モバイルアプリまで、幅広い分野で Java を選択する理由となっています。

## 2. 変数、データ型、演算子

Java のプログラミングを理解するためには、まずその基本的な構文に慣れることが必要です。この章では、Java を使ったプログラミングの基盤となる、変数の宣言、データ型の理解、そして演算子の使い方について学びます。

### 2.1 変数

変数とは、データを格納するためのコンテナのようなものです。Java では、変数を使用する前にその型を宣言する必要があります。変数名は英字で始まる必要があり、その後に数字やアンダースコア（\_）、ドル記号（$）を続けることができます。

```java title="コード例"
int number;       // 整数型の変数 number を宣言
String text;      // 文字列型の変数 text を宣言
boolean isActive; // ブーリアン型（真偽値）の変数 isActive を宣言

int age = 20;     // 整数型で年齢を表す変数 age を宣言し、20で初期化
String name = "Alice"; // 文字列型で名前を表す変数 name を宣言し、"Alice" で初期化
```

### 2.2 データ型

Java には様々なデータ型がありますが、最も基本的なものはプリミティブ型と参照型の二つに分類されます。プリミティブ型には、整数型の `int`、実数型の `double`、文字型の `char`、真偽値型の `boolean` などがあります。参照型には、クラス、インターフェース、配列などがあり、その中でも最もよく使用されるのが `String` クラスです。

```java title="コード例"
int x = 10;
int y = 4;
int sum = x + y;         // xとyの合計
int difference = x - y;  // xとyの差
int product = x * y;     // xとyの積
double quotient = (double)x / y;  // xをyで割った商（キャストして小数点以下を保持）
int remainder = x % y;   // xをyで割った余り

boolean isEqual = (x == y);         // xとyが等しいかどうかの真偽値
boolean isNotEqual = (x != y);      // xとyが等しくないかどうかの真偽値
boolean isGreaterThan = (x > y);    // xがyより大きいかどうかの真偽値
boolean isLessThan = (x < y);       // xがyより小さいかどうかの真偽値
boolean isGreaterOrEqual = (x >= y); // xがy以上かどうかの真偽値
boolean isLessOrEqual = (x <= y);   // xがy以下かどうかの真偽値
```

2 章では、変数の宣言、データ型の概要、そして演算子の基本について学びました。これらの知識を基に、次の章では制御構文について学んでいきます。

## 3. 条件分岐、ループ

制御構文はプログラムの流れを制御するための重要な概念です。この章では、Java における基本的な制御構文である条件分岐とループに焦点を当てます。具体的な例を通して、これらの構文の使い方と活用方法を学びましょう。

### 3.1 条件分岐（if 文）

条件分岐は、特定の条件に基づいて異なるコードブロックを実行するために使用されます。Java では `if` 文が最も基本的な条件分岐の構文です。

```java
int score = 85;
if (score >= 90) {
    System.out.println("Excellent!");
} else if (score >= 70) {
    System.out.println("Good");
} else {
    System.out.println("Try harder");
}
```

上記の例では、`score` 変数の値に基づいて異なるメッセージを出力しています。

### 3.2 switch 文

switch 文は、一つの変数に対して多くの条件分岐がある場合に便利です。

```java
int month = 4;
switch (month) {
    case 1:
        System.out.println("January");
        break;
    case 2:
        System.out.println("February");
        break;
    // ...
    case 12:
        System.out.println("December");
        break;
    default:
        System.out.println("Invalid month");
}
```

各 `case` は特定の値に対応しており、一致する `case` が見つかると、そこから下のコードが実行されます。`break` 文は、それ以降の `case` が不要な場合に次の処理に進むために使用します。

### 3.3 ループ構文（for 文）

繰り返し実行を行う際にはループ構文が使用されます。`for` 文は、特定の回数だけ繰り返しを行いたい場合に便利です。

```java
for (int i = 1; i <= 10; i++) {
    System.out.println("Count is: " + i);
}
```

この `for` 文は 1 から 10 までの数字を出力します。

### 3.4 while 文と do-while 文

`while` 文は、特定の条件が true である間、コードブロックを繰り返し実行します。

```java
int i = 1;
while (i <= 10) {
    System.out.println("Count is: " + i);
    i++;
}
```

`do-while` 文は、少なくとも一度はコードブロックを実行した後に条件を評価します。

```java
int j = 1;
do {
    System.out.println("Count is: " + j);
    j++;
} while (j <= 10);
```

この両方の構文は、繰り返しの数が事前には定まっていない場合に特に有用です。各ループには、ループを抜けるための`break` 文や次の繰り返しにスキップする `continue` 文を使用することもできます。

以上で、Java における基本的な制御構文を学ぶことができました。より実践的な経験を積むためには、これらの構文を使った簡単なプログラムを自ら作成して実行してみましょう。

## 4. メソッド

メソッドは、プログラム内で繰り返し使われる処理をまとめたものです。一度定義することで、必要な時に呼び出して使うことができます。メソッドをうまく使うと、コードの再利用性が高まり、可読性や保守性も向上します。

### 4.1 メソッドの定義

メソッドを定義するには、戻り値の型、メソッド名、引数リストを指定します。以下は簡単なメソッドの例です。

```java
int sum(int a, int b) {
    return a + b;
}
```

このメソッドは 2 つの整数を受け取り、それらを足し合わせた結果を返します。

### 4.2 メソッドの呼び出し

定義したメソッドはメソッド名と引数を指定して呼び出すことができます。例えば、上記の `sum` メソッドは次のように呼び出せます。

```java
int result = sum(3, 4);
System.out.println(result); // 出力: 7
```

### 4.3 引数

メソッドに渡す値を引数と呼びます。引数は 0 個以上指定することができます。引数を持たない例も以下に示します。

```java
void printHello() {
    System.out.println("Hello, World!");
}
```

このメソッドは `printHello()` として呼び出すことが可能です。

### 4.4 戻り値

メソッドが処理の結果を呼び出し元に返すには、戻り値を使用します。戻り値がない場合は、戻り値の型として void を使用します。

### 4.5 メソッドオーバーロード

同じ名前のメソッドを複数定義することを、メソッドオーバーロードといいます。引数の数や型、またはその両方が異なる必要があります。

```java
int sum(int a, int b) {
    return a + b;
}

int sum(int a, int b, int c) {
    return a + b + c;
}
```

これにより、異なるパラメータをもつ同名のメソッドを呼び出すことができます。

### 4.6 実践的なコード例

以下は実際にメソッドを使用して簡単な計算を行うプログラムの例です。このコードを試してみて、メソッドの動作を理解しましょう。

```java
public class Calculator {

    // 1. メソッドの定義
    public static int add(int a, int b) {
        return a + b;
    }

    public static int subtract(int a, int b) {
        return a - b;
    }

    public static int multiply(int a, int b) {
        return a * b;
    }

    public static double divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("除数は0ではいけません");
        }
        return (double) a / b;
    }

    // 2. メインメソッドでメソッド呼び出し
    public static void main(String[] args) {
        int sum = add(10, 5);
        int difference = subtract(10, 5);
        int product = multiply(10, 5);
        double quotient = divide(10, 5);

        System.out.println("和: " + sum);
        System.out.println("差: " + difference);
        System.out.println("積: " + product);
        System.out.println("商: " + quotient);
    }
}
```

このコード例では、足し算、引き算、掛け算、割り算のメソッドを定義し、それらを `main` メソッドから呼び出しています。引数や戻り値、例外処理を含むメソッドの使い方についても実践的に学べます。

この資料を通じて、メソッドの基本的な概念、その定義と使用方法を把握し、Java プログラミングでのメソッドの有効な使い方を学んでください。

## 5. クラスとオブジェクト

オブジェクト指向プログラミング(OOP)は、現実世界のコンセプトを模倣して、より直感的で再利用可能なコードを作成するプログラミングパラダイムです。この章では Java におけるクラスとオブジェクトの基本について学びます。

### 5.1 クラスの定義

クラスはオブジェクトの設計図またはテンプレートであり、データ（属性）と振る舞い（メソッド）をカプセル化します。

```java
public class Car {
    // Fields, attributes, or properties
    String color;
    String brand;

    // Constructor
    public Car(String color, String brand) {
        this.color = color;
        this.brand = brand;
    }

    // Methods
    public void displayDetails() {
        System.out.println("Car Color: " + color + ", Brand: " + brand);
    }
}
```

### 5.2 オブジェクトの作成と使用

クラスに基づいて作成された実体がオブジェクトです。`new` キーワードを使ってオブジェクトをインスタンス化します。

```java
public class TestCar {
    public static void main(String[] args) {
        // Creating an object of the Car class
        Car myCar = new Car("Red", "Toyota");

        // Using the object's method to display details
        myCar.displayDetails();
    }
}
```

このコードを実行すると、`myCar` オブジェクトの詳細がコンソールに表示されます。

### 5.3 メンバ変数とメソッド

メンバ変数はクラス内に格納されるデータで、メソッドはクラスが行う操作です。

#### 5.3.1 メンバ変数

```java
public class Student {
    String name;
    int age;
    double gpa;

    // Studentクラスのコンストラクタとメソッドは省略
}
```

#### 5.3.2 メソッド

```java
public class Student {

    // メンバ変数定義は省略

    // メソッド: 学生の詳細を表示する
    public void displayDetails() {
        System.out.println("Name: " + name + ", Age: " + age + ", GPA: " + gpa);
    }
}
```

### 5.4 カプセル化

カプセル化は、オブジェクトのデータを隠蔽し、外部からの直接的なアクセスを制限する手法です。

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // ゲッター
    public String getName() {
        return name;
    }

    // セッター
    public void setName(String name) {
        this.name = name;
    }

    // 年齢関連のゲッターとセッターは省略
}
```

### 5.5 this キーワード

`this` キーワードは現在のオブジェクトへの参照を意味します。クラス内でメンバ変数とローカル変数を区別するために使用します。

```java
public class Rectangle {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    // メソッドと他のコンテンツは省略
}
```

### 5.6 オブジェクトの相互作用

オブジェクトはメソッドを通じて相互作用します。

```java
public class Library {
    String address;
    ArrayList<Book> books;

    // Libraryクラスのコンストラクタとメソッドは省略

    // オブジェクト間の相互作用の例 - Bookオブジェクトを追加するメソッド
    public void addBook(Book book) {
        books.add(book);
    }
}
```

この章では、オブジェクト指向の基本的な構造と主要な概念を学びました。実際にコードを書き、実行してみることをおすすめします。

<br>
