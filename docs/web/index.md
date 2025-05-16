# Web 入門

Web 入門用の資料です。

加納研究室のメンバであれば、ユーザアカウントを作成してログインすることで、オンライン学習用のソースコードエディタを利用することができます。

## エディタの利用方法

??? note "基本操作"

    エディタでは、`*.html` / `*.css` / `*.js` ファイルの作成・編集・実行ができます。

    エディタ左上の :material-information-outline: アイコンを押すと、各種シュートカットコマンドを確認できます。

    - :material-file-outline: ：新規作成 (Ctrl + E)
    - :material-content-save: ：保存 (Ctrl + S)
    - :fontawesome-solid-play: ：実行 (Ctrl + R)
    - :fontawesome-solid-robot: ： コード解説 (Ctrl + M)

    エディタ左上の「Settings」を押すと、エディタの設定を変更できます。

??? note "コードの実行"

    `*.html` ファイルを実行すると、エディタ右上の実行ウィンドウに結果が表示されます。

    - :fontawesome-solid-stop: ：実行の停止
    - :fontawesome-solid-rotate-right: ：リロード
    - :fontawesome-solid-rocket: ：デプロイ

    エディタ右下にはコンソールウィンドウがあります。コンソールへの出力や、エラーメッセージ（クライアントサイド）を確認することができます。

    - :fontawesome-solid-ban: ：コンソールの消去

??? pied-piper "AI アシスタント"

    本エディタは、以下の AI アシスタント機能を搭載しています。
    (model: gpt-4o-2024-05-13)

    **コード解説**

    エディタ上でソースコードを選択し、「コード解説」のリクエストを送ると、コンソールに解説が表示されます。一度に送信できるコードは最大2000文字です。コード解説のリクエストは以下のいずれかの方法で送信できます。

    - エディタ左上の「コード解説」ボタンを押下
    - コンソール上部の「コード解説」ボタンを押下
    - エディタ上で右クリックし「コード解説」メニューを選択
    - ショートカットコマンド (Ctrl + M)

    **エラー解説**

    エラー発生時、コンソールのエラーメッセージ右側に表示されるロボットアイコン（エラー解説）を押すと、エラーの概要と解決策が表示されます。

    **解説レベル**

    「コード解説」と「エラー解説」は、解説のレベルを三段階から選択することができます（コンソールウィンドウ右上部分）。

    - Level 1：簡潔な解説を行います（Default）
    - Level 2：標準的な解説を行います
    - Level 3：詳細な解説を行います

    また、「コード解説」「エラー解説」のメッセージの下には、:fontawesome-solid-thumbs-up: （役に立った）アイコンと :fontawesome-solid-thumbs-down: （役に立たなかった）アイコンが表示されます。
    システム改善のため、回答にご協力ください。

    **演習進捗チェック**

    エディタ左側の「演習進捗チェック」欄にある各種演習ボタンを押すと、ソースコードが演習の要件を満たしているかどうかの判定を行い、結果をコンソールに出力します。

    - 演習進捗チェックは適切に命名された JavaScript ファイルに対して行われます。第7回目の演習であれば、「ex07.js」が評価対象となります。
    - 評価は 100点満点で行われ、70点以上を獲得すると、演習ボタン上の :fontawesome-solid-person-running: アイコンが :fontawesome-solid-check: に変化します。
    - AI による評価は完全なものではないため、参考に留めるよう注意してください。

    **節度あるご利用をお願いいたします。**

<br>
<div id="login-signup" style="text-align: center;">
  <p>各種サイトコンテンツはログイン後に利用可能となります。</p>
  <a href="https://docs.kano-lab.com/auth/login" class="md-button md-button--primary">ログイン</a>　
  <a href="https://docs.kano-lab.com/auth/register" class="md-button md-button--primary">新規登録</a>
</div>

<script>
    async function fetchUserInfo() {
        try{
            const response = await fetch('https://docs.kano-lab.com/auth/editor/check.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                }
            })
            if (response.ok) {
                const data = await response.json();
                displayUserInfo(data);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch user info:', response.status, errorText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function displayUserInfo(data) {
        const userInfoDiv = document.getElementById('login-signup');
        if (data.error) {
        } else {
            userInfoDiv.innerHTML = `
              <p><a href="https://docs.kano-lab.com/auth/editor" class="md-button md-button--primary">Kano Code</a></p>
              <p>Logged in as <strong>${data.email}</strong></p>

              <p>
              <a href="https://docs.kano-lab.com/auth/account" class="md-button md-button--secondary">アカウント情報</a>　
  <a href="https://docs.kano-lab.com/auth/logout" class="md-button md-button--secondary">ログアウト</a>
              </p>
            `;
            // login-signup
            document.getElementById('auth-status').innerHTML = 'Logged in as ' + data.email;
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        fetchUserInfo();
    });
</script>
