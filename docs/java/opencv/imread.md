# OpenCV での画像の読み込みと表示

このセクションでは Java を使用して OpenCV で画像を読み込み、表示する基本的な方法を学んでいきます。

## OpenCV ライブラリのインポート

通常、以下のような import 文で OpenCV ライブラリをインポートします。

```java
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
```

これにより、画像データを表す `Mat` クラスや画像の読み書きを行う `Imgcodecs` クラスなど、必要な OpenCV の機能にアクセスできるようになります。

## OpenCV による画像の読み込み

Java で OpenCV を使って画像を読み込む場合、`Imgcodecs` クラスの `imread` メソッドを使用します。これは指定されたパスにある画像ファイルを読み込み、`Mat` オブジェクトとして返す機能を持っています。

以下に、読み込みの基本的なコードを示します。

```java
System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
String imageFilePath = "./image.png";
Mat image = Imgcodecs.imread(imageFilePath);
```

`System.loadLibrary(Core.NATIVE_LIBRARY_NAME);` によって、OpenCV のネイティブライブラリが読み込まれます。
これはプログラムの開始時に一度だけ実行すれば OK です。

### 頭部 CT 画像（フリー素材）

以下では私の頭部 CT 画像（KanoHead.png、フリー素材）を使っていくことにします。

![Kano Head](img/KanoHead.png)

## OpenCV による画像の表示

OpenCV 単体でも、[`HighGui`](https://docs.opencv.org/4.x/javadoc/org/opencv/highgui/HighGui.html) クラスを用いることで、簡易的に画像の表示を行うことができます。
本サイトのサンプルコードでは、記述をシンプルにするために基本的には [`HighGui`](https://docs.opencv.org/4.x/javadoc/org/opencv/highgui/HighGui.html) クラスを用いることにしますが、高度な GUI アプリケーションを作成する場合は、Swing などの GUI フレームワークを併用するようにしてください。

[`HighGui`](https://docs.opencv.org/4.x/javadoc/org/opencv/highgui/HighGui.html) クラスを用いた画像の表示は、[`imshow`](<https://docs.opencv.org/4.x/javadoc/org/opencv/highgui/HighGui.html#imshow(java.lang.String,org.opencv.core.Mat)>) メソッドで行い、直後に [`waitKey`](<https://docs.opencv.org/4.x/javadoc/org/opencv/highgui/HighGui.html#waitKey()>) メソッドを置くことで、ウィンドウを表示させることができます。以下は実際のコード例です。

```java
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.highgui.HighGui;
import org.opencv.imgcodecs.Imgcodecs;

public class Main {
    public static void main(String[] args) {
        // ライブラリの読み込み
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

        // 画像の読み込み
        Mat image = Imgcodecs.imread("KanoHead.png");

        // 画像の表示
        HighGui.imshow("HighGui による画像の表示", image);
        HighGui.waitKey();
        System.exit(0);
    }
}
```

以下のようなウィンドウが表示されたら成功です。

![HighGui](img/HighGui.png)

## Swing による画像の表示

実際の Java アプリケーション開発においては、Swing などの GUI フレームワークを使用するのが一般的です。
そのため、画像を表示するためのウィンドウを作成し、そこに画像を描画する必要があります。

以下では、NetBeans の GUI デザイナを使用している想定で話を進めていきます。
いつものように、`JFrame` フォームを作成し、そこに `JLabel` コンポーネントを貼り付けましょう。
`JFrame` の名前は `FrameMain`、`JLabel` の名前は `lblDraw`、サイズは `512 x 512` としています。

![lblDraw](img/lblDraw.png)

### JLabel への画像表示

NetBeans で `JFrame` フォームを作成すると、コンストラクタの中に GUI の描画を行う `initComponents` メソッドが生成されます。この後ろに、OpenCV の簡単なコードを書いてみましょう。

```java
initComponents();   // 最初から含まれているコード

// ライブラリの読み込み
System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

// 画像の読み込み
Mat image = Imgcodecs.imread("KanoHead.png");

// 画像の表示
lblDraw.setIcon(new ImageIcon(HighGui.toBufferedImage(image)));
```

ここで `toBufferedImage` は `Mat` を `BufferedImage` に変換するメソッドで、中身は以下のようになっています。

```java
public static Image toBufferedImage(Mat m) {
    int type = BufferedImage.TYPE_BYTE_GRAY;

    if (m.channels() > 1) {
        type = BufferedImage.TYPE_3BYTE_BGR;
    }

    int bufferSize = m.channels() * m.cols() * m.rows();
    byte[] b = new byte[bufferSize];
    m.get(0, 0, b); // get all the pixels
    BufferedImage image = new BufferedImage(m.cols(), m.rows(), type);

    final byte[] targetPixels = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
    System.arraycopy(b, 0, targetPixels, 0, b.length);

    return image;
}
```

ここまでのコードを記述すると、シンボルが見つからないというエラーが出ているかもしれません。
このエラーを解消するためには、コードエディタの好きな場所で右クリックをし、[Fix Imports]（インポートの修正）を行ってください。

![Fix Imports](img/FixImports.png)

するとコードが解析され、以下のように必要な `import` 文が自動挿入されます。

```java
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import javax.swing.ImageIcon;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.highgui.HighGui;
import org.opencv.imgcodecs.Imgcodecs;
```

エラーが解消されたらコードを実行してみましょう。

![First App](img/FirstApp.png)

ウィンドウが立ち上がり、画像が表示されたら成功です。

このセクションでは、OpenCV を用いて Java で画像を読み込み、表示する方法について学びました。
以降のセクションでは、OpenCV による具体的な画像処理の方法について見ていきます。

<br>
