# 色空間の変換

画像処理では、画像のピクセル表現をある色空間から別の色空間に変換することがよく行われます。
典型的な変換には、RGB からグレースケール、HSV または YCrCb への変換があります。OpenCV ではデフォルトの色空間が BGR である点に注意が必要です。

## グレースケール変換

以下のコードは、カラー（BGR）画像をグレースケール画像に変換する例です。

```java
// 元のカラー画像を読み込む
Mat color = Imgcodecs.imread("input.png");

// グレースケール画像を格納する変数を作成
Mat gray = new Mat();

// BGR からグレースケールへの変換
Imgproc.cvtColor(color, gray, Imgproc.COLOR_BGR2GRAY);

// 画像を保存
Imgcodecs.imwrite("grayscale.png", gray);
```

`Improc.cvtColor` メソッドによって、さまざまな色空間の変換を実行することができます。

また、はじめから特定の色空間で画像を読み込ませたい場合は、`imread` の第 2 引数に色空間のフラグを指定します。例えば、グレースケール画像として読み込ませる場合は、以下のように書きます。

```java
Mat image = Imgcodecs.imread("KanoHead.png", Imgcodecs.IMREAD_GRAYSCALE);
```

当研究室では主に CT データを扱うため、基本的にはこの書き方を行うことになります。

## 色空間のリスト

[Color Space Conversions](https://docs.opencv.org/4.8.0/d8/d01/group__imgproc__color__conversions.html#ga4e0972be5de079fed4e3a10e24ef5ef0) では、OpenCV で変換可能な色空間のリストを確認できます。
さらに [Color conversions](https://docs.opencv.org/4.8.0/de/d25/imgproc_color_conversions.html) では、代表的な色変換の理論を確認することができます。必要に応じて参照するようにしてください。

<br>
