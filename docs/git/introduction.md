# 導入の流れ

VS Code で作成したプログラムを GitHub にアップロードしてバージョン管理するための手順メモです。GitHub のアカウントは予め作成しておきます。

## GitHub で新しいリポジトリを作成

1. GitHub で新しいリポジトリを作成
2. GitHub のアカウントにログイン
3. 右上のプロフィール画像をクリックし、[Your repositories] を選択
4. [New] ボタンをクリックして新しいリポジトリを作成
5. リポジトリ名を入力し、公開 (Public) または非公開 (Private) を選択
6. [Create repository] をクリックしてリポジトリを作成

## VSCode で Git を設定

1. VSCode を開き、プロジェクトフォルダを開く
2. [View] > [Terminal] を選択して（または [Ctrl/Cmd] + [j]を押して）ターミナルを開く
3. Git がインストールされていない場合は、Git をインストールする
4. ターミナルで以下のコマンドを実行し、Git の初期設定を行う（必要に応じて）

```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Git リポジトリの初期化

```
git init
```

## GitHub リポジトリと接続

```
git remote add origin <リポジトリのURL>
```

## ファイルをステージング & コミット & プッシュ

```
git add .
git commit -m "Initial commit"
git push -u origin master
```

<br>
