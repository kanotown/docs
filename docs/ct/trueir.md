True IR の実装メモ（テキストコードの Java 移植版）です。

`CalcTrueIR` クラスにコード一式を記述する想定です。
コードブロックを紹介した後、最後にクラス全体のコードを掲載します。

## フィールド変数の宣言

```java
    public static int g_px = 512;		// 投影の幅
    public static int g_pa = 800;		// 投影数
    public static int g_nx = 512;		// 画像の幅
    public static int g_ny = 512;		// 画像の高さ

    public static double g_pl;      // 画素長 (cm/pixel)
    public static double g_beta2;   // TVの重み係数
    public static double g_wt;  		// 重み (0:なし，1:あり)
    public static int g_nit;    		// 繰り返し回数
    public static int g_p2;         // 投影の全角度 [2]π or [1]π
    public static int g_ns;         // Cijの検出器分配数

    public static double[] g_prj;   // 投影データ領域
    public static double[] g_img;   // 原画像データ領域
    public static int[] g_cx;       // 検出確率の中央のx座標
    public static double[] g_cc;    // 検出確率Cijの値
```

## 各種パラメータの取得

本ページのサンプルではマジックナンバーを使用します。
システムとしては、GUI から値を取得する形になっていることが好ましいです。

```java
    /**
     * 各種パラメータの取得 （サンプルコードでは以下の数値を使用）
     */
    public static void getParameters() {
        g_pl = 0.02;
        g_beta2 = 0.02;
        g_wt = 1;
        g_nit = 50;
        g_p2 = 2;
        g_ns = 3;
    }
```

## メインの処理

メインの処理は `main` メソッド内に記述されています。
引数に配列 `prj` と `img` を受け取り、投影データ `prj` の再構成結果を `img` に格納する形としています。これまで研究室で作成した投影データの計算結果 `dataProjectionSinogram` は、0 ～ 65535 の数値範囲になっていますが、True IR のコードは 0 ～ 1 を想定しているような形になっているようであったので、`prj` の数値を `65535.0` で除しています。

```java
    /**
     * メインの処理
     *
     * @param prj 投影データ
     * @param img 再構成データ
     */
    public static void main(float[] prj, float[] img) {
        // プログラムで使用する変数の入力
        getParameters();

        // メモリを動的に確保
        g_prj = new double[g_px * g_pa];
        g_img = new double[g_nx * g_ny];
        g_cx = new int[g_pa * g_nx * g_ny];
        g_cc = new double[g_pa * g_nx * g_ny * g_ns];

        // 検出確率の計算
        detection_probability(g_cx, g_cc, g_px, g_pa, g_p2, g_nx, g_ny, g_ns);

        // 投影データとオリジナルデータの入力
        for (int i = 0; i < g_px * g_pa; i++) {
            g_prj[i] = prj[i] / 65535.0;
        }
        for (int i = 0; i < g_nx * g_ny; i++) {
            g_img[i] = img[i];
        }

        // 逐次近似再構成
        reconTrueIR();

        // 結果の格納
        for (int i = 0; i < g_nx * g_ny; i++) {
            img[i] = (float) g_img[i];
        }

    }
```

## 画像領域の初期化

```java
    /**
     * 画像領域の初期化
     *
     * @param img 画像領域
     * @param size 画像領域のデータ数（画素数）
     * @param val 初期化する値
     */
    public static void init(double[] img, int size, double val) {
        int i;
        for (i = 0; i < size; i++) {
            img[i] = val;
        }
    }
```

## RMSE の計算と出力

```java
    /**
     * RMSE をコンソールに出力
     *
     * @param im1 評価用画像データ
     * @param im0 原画像データ
     * @param size 画像のサイズ（幅×高さ pixel）
     */
    public static void outputRMSE(double[] im1, double[] im0, int size) {
        int i;
        double rmse, sum = 0, sum2 = 0;

        for (i = 0; i < size; i++) {
            sum += (im1[i] - im0[i]) * (im1[i] - im0[i]);
            sum2 += im0[i] * im0[i];
        }

        rmse = 100.0 * Math.sqrt(sum) / Math.sqrt(sum2);

        System.out.println(rmse);
    }

    /**
     * RMSE の計算結果を返す
     *
     * @param im1 評価用画像データ
     * @param im0 原画像データ
     * @param size 画像のサイズ（幅×高さ pixel）
     * @return
     */
    public static double calc_rmse(double[] im1, double[] im0, int size) {
        int i;
        double sum = 0, sum2 = 0;

        for (i = 0; i < size; i++) {
            sum += (im1[i] - im0[i]) * (im1[i] - im0[i]);
            sum2 += im0[i] * im0[i];
        }

        return 100.0 * Math.sqrt(sum) / Math.sqrt(sum2);
    }
```

## 内積計算

```java
    /**
     * ベクトルの内積を計算 : x・y
     *
     * @param x 1つ目のベクトル
     * @param y 2つ目のベクトル
     * @param n ベクトルの要素数
     * @return ベクトルの内積
     */
    public static double inner_product(double[] x, double[] y, int n) {
        int i;
        double inpr = 0;

        for (i = 0; i < n; i++) {
            inpr += x[i] * y[i];
        }
        return inpr;
    }
```

## ガウス型の low-pass フィルタ

```java
    /**
     * ガウス型のlow-passフィルタ
     *
     * @param prw 処理後の投影データ
     * @param prj 処理前の投影データ
     * @param px 投影の幅
     * @param pa 投影数
     */
    public static void lowpass_filter(double[] prw, double[] prj, int px, int pa) {
        int i, j, k, n;
        int c = 4;
        double[] h = new double[c];
        double fwhm = 1;
        double s = fwhm / (2 * Math.sqrt(2 * Math.log(2.0)));

        // ガウシアンフィルタ
        for (n = 0; n < c; n++) {
            h[n] = 1 / (Math.sqrt(2 * Math.PI) * s) * Math.exp(-n * n / (2 * s * s));
        }

        // 重畳積分によるフィルタリング
        for (i = 0; i < pa; i++) {
            for (j = 0; j < px; j++) {
                prw[i * px + j] = 0;
                for (k = 0; k < px; k++) {
                    // 重畳積分
                    if (Math.abs(j - k) < c) {
                        prw[i * px + j] += prj[i * px + k] * h[Math.abs(j - k)];
                    }
                }
            }
        }
    }
```

## 検出確率マトリクスの作成

```java
    /**
     * 検出確率のマトリクスを作成する関数
     *
     * @param cx 検出確率の検出位置xの値
     * @param cc 検出確率の値
     * @param px 投影の動径方向の数
     * @param pa 投影の角度方向の数
     * @param p2 投影データの全角度（[2]πか[1]π）
     * @param nx 画像のx方向の数
     * @param ny 画像のy方向の数
     * @param ns 1画素から入る検出器の幅
     */
    public static void detection_probability( /*int *cx, double *cc, int px, int pa, int p2, int nx, int ny, int ns*/int[] cx, double[] cc, int px, int pa, int p2, int nx, int ny, int ns) {
        int i, j, k, ix;
        double x, y, xx, th, a, b, x05, d, si, co;
        double[] cca = new double[3];

        for (i = 0; i < pa * nx * ny; i++) {
            cx[i] = 0;
        }
        for (i = 0; i < pa * nx * ny * ns; i++) {
            cc[i] = 0;
        }

        for (k = 0; k < pa; k++) {
            th = p2 * Math.PI * k / pa;
            si = Math.sin(th);
            co = Math.cos(th);
            if (Math.abs(si) > Math.abs(co)) {
                a = Math.abs(si);
                b = Math.abs(co);
            } else {
                a = Math.abs(co);
                b = Math.abs(si);
            }
            for (i = 0; i < ny; i++) {
                y = ny / 2 - i;
                for (j = 0; j < nx; j++) {
                    x = j - nx / 2;
                    xx = x * co + y * si;

                    cca[0] = cca[1] = cca[2] = 0.0;

                    ix = (int) (Math.floor(xx + 0.5));
                    if (ix + px / 2 < 1 || ix + px / 2 > px - 2) {
                        continue;
                    }

                    x05 = ix - 0.5;
                    if ((d = x05 - (xx - (a - b) / 2)) > 0.0) {
                        cca[0] = b / (2 * a) + d / a;
                    } else if ((d = x05 - (xx - (a + b) / 2)) > 0.0) {
                        cca[0] = d * d / (2 * a * b);
                    }
                    x05 = ix + 0.5;
                    if ((d = xx + (a - b) / 2 - x05) > 0.0) {
                        cca[2] = b / (2 * a) + d / a;
                    } else if ((d = xx + (a + b) / 2 - x05) > 0.0) {
                        cca[2] = d * d / (2 * a * b);
                    }
                    cca[1] = 1.0 - cca[0] - cca[2];

                    cx[k * nx * ny + i * nx + j] = ix + px / 2 - ns / 2;
                    cc[(k * nx * ny + i * nx + j) * ns + 0] = cca[0];
                    cc[(k * nx * ny + i * nx + j) * ns + 1] = cca[1];
                    cc[(k * nx * ny + i * nx + j) * ns + 2] = cca[2];
                }
            }
        }
    }
```

## 投影データの作成

```java
    /**
     * 検出確率を使って投影データを作成する関数
     *
     * @param prj 作成する投影データ
     * @param px 投影の幅
     * @param pa 投影数
     * @param img もとになる画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     * @param ns Cijの検出器分配数
     * @param pl 画素長
     */
    public static void projectionC( /*double *prj, int px, int pa, double *img, int nx, int ny, int ns, double pl*/double[] prj, int px, int pa, double[] img, int nx, int ny, int ns, double pl) {
        int i, j, k;

        for (i = 0; i < px * pa; i++) {
            prj[i] = 0;
        }

        for (k = 0; k < pa; k++) {
            for (i = 0; i < nx * ny; i++) {
                for (j = 0; j < ns; j++) {
                    int jj = g_cx[k * nx * ny + i] + j;
                    if (jj < 0 || jj > px - 1) {
                        continue;
                    }
                    prj[k * px + jj] += (g_cc[(k * nx * ny + i) * ns + j] * img[i] * pl);
                }
            }
        }
    }
```

## 逆投影計算

```java
    /**
     * 検出確率を使って投影データから逆投影する関数
     *
     * @param img 作成する画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     * @param prj もとになる投影データ
     * @param px 投影の幅
     * @param pa 投影数
     * @param ns Cijの検出器分配数
     * @param pl 画素長
     */
    public static void backprojectionC(double[] img, int nx, int ny, double[] prj, int px, int pa, int ns, double pl) {
        int i, j, k;

        for (i = 0; i < nx * ny; i++) {
            img[i] = 0;
        }

        for (k = 0; k < pa; k++) {
            for (i = 0; i < nx * ny; i++) {
                for (j = 0; j < ns; j++) {
                    int jj = g_cx[k * nx * ny + i] + j;
                    if (jj < 0 || jj > px - 1) {
                        continue;
                    }
                    img[i] += (g_cc[(k * nx * ny + i) * ns + j] * prj[k * px + jj] / pl);
                }
            }
        }

        for (i = 0; i < nx * ny; i++) {
            img[i] *= Math.PI / pa;
        }
    }
```

## 評価関数の勾配

```java
    /**
     * 評価関数の勾配（正則化項のみ）
     *
     * @param gr 評価関数の勾配データ
     * @param img もとになる画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     * @param beta2 TVの重み係数
     */
    public static void nablaU(double[] gr, double[] img, int nx, int ny, double beta2) {
        int i;
        double[] im2 = new double[nx * ny];;

        for (i = 0; i < nx * ny; i++) {
            gr[i] = 0;
            im2[i] = 0;
        }

        // ∇TV(m) の計算
        if (beta2 != 0.0) {
            nablaTV(im2, img, nx, ny);

            for (i = 0; i < nx * ny; i++) {
                gr[i] += beta2 * im2[i];
            }
        }
    }
```

## ∇TV（Total Variation の勾配）の計算

```java
    /**
     * ∇TV（Total Variationの勾配）の計算
     *
     * @param ntv ∇TVの計算結果
     * @param img もとになる画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     */
    public static void nablaTV(double[] ntv, double[] img, int nx, int ny) {
        int i, j, k;
        double tv1, tv2, ep = 0.0001;

        int[] x = new int[3];
        int[] y = new int[3];
        double[] fil = new double[9];

        // TVの計算
        for (i = 0; i < ny; i++) {
            y[0] = (i + ny - 1) % ny;
            y[1] = i;
            y[2] = (i + 1) % ny;
            for (j = 0; j < nx; j++) {
                x[0] = (j + nx - 1) % nx;
                x[1] = j;
                x[2] = (j + 1) % nx;
                for (k = 0; k < 9; k++) {
                    fil[k] = img[y[k / 3] * nx + x[k % 3]];
                }

                tv1 = (fil[4] - fil[3]) / Math.sqrt((fil[4] - fil[3]) * (fil[4] - fil[3]) + (fil[6] - fil[3]) * (fil[6] - fil[3]) + ep * ep)
                        + (fil[4] - fil[1]) / Math.sqrt((fil[2] - fil[1]) * (fil[2] - fil[1]) + (fil[4] - fil[1]) * (fil[4] - fil[1]) + ep * ep)
                        - (fil[5] + fil[7] - 2 * fil[4]) / Math.sqrt((fil[5] - fil[4]) * (fil[5] - fil[4]) + (fil[7] - fil[4]) * (fil[7] - fil[4]) + ep * ep);
                tv2 = (fil[4] - fil[1]) / Math.sqrt((fil[4] - fil[1]) * (fil[4] - fil[1]) + (fil[0] - fil[1]) * (fil[0] - fil[1]) + ep * ep)
                        + (fil[4] - fil[5]) / Math.sqrt((fil[8] - fil[5]) * (fil[8] - fil[5]) + (fil[4] - fil[5]) * (fil[4] - fil[5]) + ep * ep)
                        - (fil[7] + fil[3] - 2 * fil[4]) / Math.sqrt((fil[7] - fil[4]) * (fil[7] - fil[4]) + (fil[3] - fil[4]) * (fil[3] - fil[4]) + ep * ep);

                ntv[i * nx + j] = (tv1 + tv2) / 2;
            }
        }
    }
```

## 逐次近似投影再構成 (最急降下法)

```java

    /**
     * 逐次近似投影再構成 (最急降下法)
     */
    public static void reconTrueIR() {
        int i, k;
        double alpha = 0;

        //メモリを動的に確保
        double[] pr0 = new double[g_px * g_pa];    // 投影データ領域（計算用0）
        double[] pr1 = new double[g_px * g_pa];    // 投影データ領域（計算用1）
        double[] prw = new double[g_px * g_pa];    // 重み付け最小二乗法用のデータ領域
        double[] im1 = new double[g_nx * g_ny];    // 仮定画像のデータ領域
        double[] dux = new double[g_nx * g_ny];    // 正則化項のデータ領域
        double[] gk0 = new double[g_nx * g_ny];    // 計算用のデータ領域(0)
        double[] gk1 = new double[g_nx * g_ny];    // 計算用のデータ領域(1)

        //重み付け用の投影作成（フィルタリングによる平滑化）
        if (g_wt <= 0.0) {
            init(prw, g_px * g_pa, 0.0);
        } else {
            lowpass_filter(prw, g_prj, g_px, g_pa);
        }

        //初期画像 x0
        init(im1, g_nx * g_ny, 0.0);

        //RMSEの出力
        outputRMSE(im1, g_img, g_nx * g_ny);

        //逐次近似の繰り返し
        for (k = 0; k < g_nit; k++) {
            if (k == 0) {
                // 1回目はそのまま勾配を求める
                // g0 = AT (A x0 - y) D
                // 投影 A x0
                projectionC(pr0, g_px, g_pa, im1, g_nx, g_ny, g_ns, g_pl);
                // 重み付け (A x0 - y) D
                for (i = 0; i < g_px * g_pa; i++) {
                    pr0[i] = (pr0[i] - g_prj[i]) * Math.exp(-prw[i]);
                }
                // 逆投影 AT (A x0 - y) D
                backprojectionC(gk0, g_nx, g_ny, pr0, g_px, g_pa, g_ns, g_pl);
            } else {
                // 2回目以降は前のデータを使って勾配を更新
                // gk+1 = gk - αk (AT A gk D)
                for (i = 0; i < g_nx * g_ny; i++) {
                    gk0[i] -= alpha * gk1[i];
                }
            }

            // αk = (gk)T gk / (gk)T (AT A gk D) -----------------------
            // 投影 A gk
            projectionC(pr1, g_px, g_pa, gk0, g_nx, g_ny, g_ns, g_pl);

            // 重み付け A gk D
            for (i = 0; i < g_px * g_pa; i++) {
                pr0[i] = pr1[i] * Math.exp(-prw[i]);
            }

            // 逆投影 AT A gk D
            backprojectionC(gk1, g_nx, g_ny, pr0, g_px, g_pa, g_ns, g_pl);

            // 内積の比からαkを算出
            alpha = inner_product(gk0, gk0, g_nx * g_ny) / inner_product(gk0, gk1, g_nx * g_ny);

            // 正則化項 βdU(x)/dx
            nablaU(dux, im1, g_nx, g_ny, g_beta2);

            // xk+1 = xk - αk(gk + βdU(x)/dx)
            for (i = 0; i < g_nx * g_ny; i++) {
                im1[i] -= alpha * (gk0[i] + dux[i]);
            }

            // 実部の負値は0にする拘束条件
            for (i = 0; i < g_nx * g_ny; i++) {
                if (im1[i] < 0.0) {
                    im1[i] = 0;
                }
            }

            // 結果画像の出力
            if (k < 10 || k % 10 == 9 || true) {
                for (int l = 0; l < g_nx * g_ny; l++) {
                    g_img[l] = im1[l];
                }
                System.out.println("k = " + k);
            }
        }
    }
```

## CalcTrueIR クラス全体

```java
package calc;

public class CalcTrueIR {

    // フィールド変数の宣言と初期値設定
    public static int g_px = 512;		// 投影の幅
    public static int g_pa = 800;		// 投影数
    public static int g_nx = 512;		// 画像の幅
    public static int g_ny = 512;		// 画像の高さ

    public static double g_pl;          	// 画素長 (cm/pixel)
    public static double g_beta2;       	// TVの重み係数
    public static double g_wt;  		// 重み (0:なし，1:あり)
    public static int g_nit;    		// 繰り返し回数
    public static int g_p2;                     // 投影の全角度 [2]π or [1]π
    public static int g_ns;                     // Cijの検出器分配数

    public static double[] g_prj;               // 投影データ領域
    public static double[] g_img;               // 原画像データ領域
    public static int[] g_cx;                   // 検出確率の中央のx座標
    public static double[] g_cc;                // 検出確率Cijの値

    /**
     * 各種パラメータの取得 （サンプルコードでは以下の数値を使用）
     */
    public static void getParameters() {
        g_pl = 0.02;
        g_beta2 = 0.02;
        g_wt = 1;
        g_nit = 50;
        g_p2 = 2;
        g_ns = 3;
    }

    /**
     * メインの処理
     *
     * @param prj 投影データ
     * @param img 再構成データ
     */
    public static void main(float[] prj, float[] img) {
        // プログラムで使用する変数の入力
        getParameters();

        // メモリを動的に確保
        g_prj = new double[g_px * g_pa];
        g_img = new double[g_nx * g_ny];
        g_cx = new int[g_pa * g_nx * g_ny];
        g_cc = new double[g_pa * g_nx * g_ny * g_ns];

        // 検出確率の計算
        detection_probability(g_cx, g_cc, g_px, g_pa, g_p2, g_nx, g_ny, g_ns);

        // 投影データとオリジナルデータの入力
        for (int i = 0; i < g_px * g_pa; i++) {
            g_prj[i] = prj[i] / 65535.0;
        }
        for (int i = 0; i < g_nx * g_ny; i++) {
            g_img[i] = img[i];
        }

        // 逐次近似再構成
        reconTrueIR();

        // 結果の格納
        for (int i = 0; i < g_nx * g_ny; i++) {
            img[i] = (float) g_img[i];
        }

    }

    /**
     * 画像領域の初期化
     *
     * @param img 画像領域
     * @param size 画像領域のデータ数（画素数）
     * @param val 初期化する値
     */
    public static void init(double[] img, int size, double val) {
        int i;
        for (i = 0; i < size; i++) {
            img[i] = val;
        }
    }

    /**
     * RMSE をコンソールに出力
     *
     * @param im1 評価用画像データ
     * @param im0 原画像データ
     * @param size 画像のサイズ（幅×高さ pixel）
     */
    public static void outputRMSE(double[] im1, double[] im0, int size) {
        int i;
        double rmse, sum = 0, sum2 = 0;

        for (i = 0; i < size; i++) {
            sum += (im1[i] - im0[i]) * (im1[i] - im0[i]);
            sum2 += im0[i] * im0[i];
        }

        rmse = 100.0 * Math.sqrt(sum) / Math.sqrt(sum2);

        System.out.println(rmse);
    }

    /**
     * RMSE の計算結果を返す
     *
     * @param im1 評価用画像データ
     * @param im0 原画像データ
     * @param size 画像のサイズ（幅×高さ pixel）
     * @return
     */
    public static double calc_rmse(double[] im1, double[] im0, int size) {
        int i;
        double sum = 0, sum2 = 0;

        for (i = 0; i < size; i++) {
            sum += (im1[i] - im0[i]) * (im1[i] - im0[i]);
            sum2 += im0[i] * im0[i];
        }

        return 100.0 * Math.sqrt(sum) / Math.sqrt(sum2);
    }

    /**
     * ベクトルの内積を計算 : x・y
     *
     * @param x 1つ目のベクトル
     * @param y 2つ目のベクトル
     * @param n ベクトルの要素数
     * @return ベクトルの内積
     */
    public static double inner_product(double[] x, double[] y, int n) {
        int i;
        double inpr = 0;

        for (i = 0; i < n; i++) {
            inpr += x[i] * y[i];
        }
        return inpr;
    }

    /**
     * ガウス型のlow-passフィルタ
     *
     * @param prw 処理後の投影データ
     * @param prj 処理前の投影データ
     * @param px 投影の幅
     * @param pa 投影数
     */
    public static void lowpass_filter(double[] prw, double[] prj, int px, int pa) {
        int i, j, k, n;
        int c = 4;
        double[] h = new double[c];
        double fwhm = 1;
        double s = fwhm / (2 * Math.sqrt(2 * Math.log(2.0)));

        // ガウシアンフィルタ
        for (n = 0; n < c; n++) {
            h[n] = 1 / (Math.sqrt(2 * Math.PI) * s) * Math.exp(-n * n / (2 * s * s));
        }

        // 重畳積分によるフィルタリング
        for (i = 0; i < pa; i++) {
            for (j = 0; j < px; j++) {
                prw[i * px + j] = 0;
                for (k = 0; k < px; k++) {
                    // 重畳積分
                    if (Math.abs(j - k) < c) {
                        prw[i * px + j] += prj[i * px + k] * h[Math.abs(j - k)];
                    }
                }
            }
        }
    }

    /**
     * 検出確率のマトリクスを作成する関数
     *
     * @param cx 検出確率の検出位置xの値
     * @param cc 検出確率の値
     * @param px 投影の動径方向の数
     * @param pa 投影の角度方向の数
     * @param p2 投影データの全角度（[2]πか[1]π）
     * @param nx 画像のx方向の数
     * @param ny 画像のy方向の数
     * @param ns 1画素から入る検出器の幅
     */
    public static void detection_probability( /*int *cx, double *cc, int px, int pa, int p2, int nx, int ny, int ns*/int[] cx, double[] cc, int px, int pa, int p2, int nx, int ny, int ns) {
        int i, j, k, ix;
        double x, y, xx, th, a, b, x05, d, si, co;
        double[] cca = new double[3];

        for (i = 0; i < pa * nx * ny; i++) {
            cx[i] = 0;
        }
        for (i = 0; i < pa * nx * ny * ns; i++) {
            cc[i] = 0;
        }

        for (k = 0; k < pa; k++) {
            th = p2 * Math.PI * k / pa;
            si = Math.sin(th);
            co = Math.cos(th);
            if (Math.abs(si) > Math.abs(co)) {
                a = Math.abs(si);
                b = Math.abs(co);
            } else {
                a = Math.abs(co);
                b = Math.abs(si);
            }
            for (i = 0; i < ny; i++) {
                y = ny / 2 - i;
                for (j = 0; j < nx; j++) {
                    x = j - nx / 2;
                    xx = x * co + y * si;

                    cca[0] = cca[1] = cca[2] = 0.0;

                    ix = (int) (Math.floor(xx + 0.5));
                    if (ix + px / 2 < 1 || ix + px / 2 > px - 2) {
                        continue;
                    }

                    x05 = ix - 0.5;
                    if ((d = x05 - (xx - (a - b) / 2)) > 0.0) {
                        cca[0] = b / (2 * a) + d / a;
                    } else if ((d = x05 - (xx - (a + b) / 2)) > 0.0) {
                        cca[0] = d * d / (2 * a * b);
                    }
                    x05 = ix + 0.5;
                    if ((d = xx + (a - b) / 2 - x05) > 0.0) {
                        cca[2] = b / (2 * a) + d / a;
                    } else if ((d = xx + (a + b) / 2 - x05) > 0.0) {
                        cca[2] = d * d / (2 * a * b);
                    }
                    cca[1] = 1.0 - cca[0] - cca[2];

                    cx[k * nx * ny + i * nx + j] = ix + px / 2 - ns / 2;
                    cc[(k * nx * ny + i * nx + j) * ns + 0] = cca[0];
                    cc[(k * nx * ny + i * nx + j) * ns + 1] = cca[1];
                    cc[(k * nx * ny + i * nx + j) * ns + 2] = cca[2];
                }
            }
        }
    }

    /**
     * 検出確率を使って投影データを作成する関数
     *
     * @param prj 作成する投影データ
     * @param px 投影の幅
     * @param pa 投影数
     * @param img もとになる画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     * @param ns Cijの検出器分配数
     * @param pl 画素長
     */
    public static void projectionC( /*double *prj, int px, int pa, double *img, int nx, int ny, int ns, double pl*/double[] prj, int px, int pa, double[] img, int nx, int ny, int ns, double pl) {
        int i, j, k;

        for (i = 0; i < px * pa; i++) {
            prj[i] = 0;
        }

        for (k = 0; k < pa; k++) {
            for (i = 0; i < nx * ny; i++) {
                for (j = 0; j < ns; j++) {
                    int jj = g_cx[k * nx * ny + i] + j;
                    if (jj < 0 || jj > px - 1) {
                        continue;
                    }
                    prj[k * px + jj] += (g_cc[(k * nx * ny + i) * ns + j] * img[i] * pl);
                }
            }
        }
    }

    /**
     * 検出確率を使って投影データから逆投影する関数
     *
     * @param img 作成する画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     * @param prj もとになる投影データ
     * @param px 投影の幅
     * @param pa 投影数
     * @param ns Cijの検出器分配数
     * @param pl 画素長
     */
    public static void backprojectionC(double[] img, int nx, int ny, double[] prj, int px, int pa, int ns, double pl) {
        int i, j, k;

        for (i = 0; i < nx * ny; i++) {
            img[i] = 0;
        }

        for (k = 0; k < pa; k++) {
            for (i = 0; i < nx * ny; i++) {
                for (j = 0; j < ns; j++) {
                    int jj = g_cx[k * nx * ny + i] + j;
                    if (jj < 0 || jj > px - 1) {
                        continue;
                    }
                    img[i] += (g_cc[(k * nx * ny + i) * ns + j] * prj[k * px + jj] / pl);
                }
            }
        }

        for (i = 0; i < nx * ny; i++) {
            img[i] *= Math.PI / pa;
        }
    }

    /**
     * 評価関数の勾配（正則化項のみ）
     *
     * @param gr 評価関数の勾配データ
     * @param img もとになる画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     * @param beta2 TVの重み係数
     */
    public static void nablaU(double[] gr, double[] img, int nx, int ny, double beta2) {
        int i;
        double[] im2 = new double[nx * ny];;

        for (i = 0; i < nx * ny; i++) {
            gr[i] = 0;
            im2[i] = 0;
        }

        // ∇TV(m) の計算
        if (beta2 != 0.0) {
            nablaTV(im2, img, nx, ny);

            for (i = 0; i < nx * ny; i++) {
                gr[i] += beta2 * im2[i];
            }
        }
    }

    /**
     * ∇TV（Total Variationの勾配）の計算
     *
     * @param ntv ∇TVの計算結果
     * @param img もとになる画像データ
     * @param nx 画像の幅
     * @param ny 画像の高さ
     */
    public static void nablaTV(double[] ntv, double[] img, int nx, int ny) {
        int i, j, k;
        double tv1, tv2, ep = 0.0001;

        int[] x = new int[3];
        int[] y = new int[3];
        double[] fil = new double[9];

        // TVの計算
        for (i = 0; i < ny; i++) {
            y[0] = (i + ny - 1) % ny;
            y[1] = i;
            y[2] = (i + 1) % ny;
            for (j = 0; j < nx; j++) {
                x[0] = (j + nx - 1) % nx;
                x[1] = j;
                x[2] = (j + 1) % nx;
                for (k = 0; k < 9; k++) {
                    fil[k] = img[y[k / 3] * nx + x[k % 3]];
                }

                tv1 = (fil[4] - fil[3]) / Math.sqrt((fil[4] - fil[3]) * (fil[4] - fil[3]) + (fil[6] - fil[3]) * (fil[6] - fil[3]) + ep * ep)
                        + (fil[4] - fil[1]) / Math.sqrt((fil[2] - fil[1]) * (fil[2] - fil[1]) + (fil[4] - fil[1]) * (fil[4] - fil[1]) + ep * ep)
                        - (fil[5] + fil[7] - 2 * fil[4]) / Math.sqrt((fil[5] - fil[4]) * (fil[5] - fil[4]) + (fil[7] - fil[4]) * (fil[7] - fil[4]) + ep * ep);
                tv2 = (fil[4] - fil[1]) / Math.sqrt((fil[4] - fil[1]) * (fil[4] - fil[1]) + (fil[0] - fil[1]) * (fil[0] - fil[1]) + ep * ep)
                        + (fil[4] - fil[5]) / Math.sqrt((fil[8] - fil[5]) * (fil[8] - fil[5]) + (fil[4] - fil[5]) * (fil[4] - fil[5]) + ep * ep)
                        - (fil[7] + fil[3] - 2 * fil[4]) / Math.sqrt((fil[7] - fil[4]) * (fil[7] - fil[4]) + (fil[3] - fil[4]) * (fil[3] - fil[4]) + ep * ep);

                ntv[i * nx + j] = (tv1 + tv2) / 2;
            }
        }
    }

    /**
     * 逐次近似投影再構成 (最急降下法)
     */
    public static void reconTrueIR() {
        int i, k;
        double alpha = 0;

        //メモリを動的に確保
        double[] pr0 = new double[g_px * g_pa];    // 投影データ領域（計算用0）
        double[] pr1 = new double[g_px * g_pa];    // 投影データ領域（計算用1）
        double[] prw = new double[g_px * g_pa];    // 重み付け最小二乗法用のデータ領域
        double[] im1 = new double[g_nx * g_ny];    // 仮定画像のデータ領域
        double[] dux = new double[g_nx * g_ny];    // 正則化項のデータ領域
        double[] gk0 = new double[g_nx * g_ny];    // 計算用のデータ領域(0)
        double[] gk1 = new double[g_nx * g_ny];    // 計算用のデータ領域(1)

        //重み付け用の投影作成（フィルタリングによる平滑化）
        if (g_wt <= 0.0) {
            init(prw, g_px * g_pa, 0.0);
        } else {
            lowpass_filter(prw, g_prj, g_px, g_pa);
        }

        //初期画像 x0
        init(im1, g_nx * g_ny, 0.0);

        //RMSEの出力
        outputRMSE(im1, g_img, g_nx * g_ny);

        //逐次近似の繰り返し
        for (k = 0; k < g_nit; k++) {
            if (k == 0) {
                // 1回目はそのまま勾配を求める
                // g0 = AT (A x0 - y) D
                // 投影 A x0
                projectionC(pr0, g_px, g_pa, im1, g_nx, g_ny, g_ns, g_pl);
                // 重み付け (A x0 - y) D
                for (i = 0; i < g_px * g_pa; i++) {
                    pr0[i] = (pr0[i] - g_prj[i]) * Math.exp(-prw[i]);
                }
                // 逆投影 AT (A x0 - y) D
                backprojectionC(gk0, g_nx, g_ny, pr0, g_px, g_pa, g_ns, g_pl);
            } else {
                // 2回目以降は前のデータを使って勾配を更新
                // gk+1 = gk - αk (AT A gk D)
                for (i = 0; i < g_nx * g_ny; i++) {
                    gk0[i] -= alpha * gk1[i];
                }
            }

            // αk = (gk)T gk / (gk)T (AT A gk D) -----------------------
            // 投影 A gk
            projectionC(pr1, g_px, g_pa, gk0, g_nx, g_ny, g_ns, g_pl);

            // 重み付け A gk D
            for (i = 0; i < g_px * g_pa; i++) {
                pr0[i] = pr1[i] * Math.exp(-prw[i]);
            }

            // 逆投影 AT A gk D
            backprojectionC(gk1, g_nx, g_ny, pr0, g_px, g_pa, g_ns, g_pl);

            // 内積の比からαkを算出
            alpha = inner_product(gk0, gk0, g_nx * g_ny) / inner_product(gk0, gk1, g_nx * g_ny);

            // 正則化項 βdU(x)/dx
            nablaU(dux, im1, g_nx, g_ny, g_beta2);

            // xk+1 = xk - αk(gk + βdU(x)/dx)
            for (i = 0; i < g_nx * g_ny; i++) {
                im1[i] -= alpha * (gk0[i] + dux[i]);
            }

            // 実部の負値は0にする拘束条件
            for (i = 0; i < g_nx * g_ny; i++) {
                if (im1[i] < 0.0) {
                    im1[i] = 0;
                }
            }

            // 結果画像の出力
            if (k < 10 || k % 10 == 9 || true) {
                for (int l = 0; l < g_nx * g_ny; l++) {
                    g_img[l] = im1[l];
                }
                System.out.println("k = " + k);
            }
        }
    }

}
```

### 使い方

以下のように `CalcTrueIR.main` を呼び出すことで使用できます。

```java
CalcTrueIR.main(dataProjectionSinogram, dataReconstruction);
```

<br>
