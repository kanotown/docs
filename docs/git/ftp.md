# FTP で自動アップロード

GitHub の更新を検知して、FTP により自動的にサーバに変更データをデプロイする手順のメモ（[FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) を利用）。

## deploy.yml の作成

リポジトリの `.github/workflows/` 内に `deploy.yml` を作成

## deploy.yml の編集

```
on: push
name: 🚀 Deploy website on push
jobs:
  web-deploy:
    name: 🎉 Deploy
    runs-on: ubuntu-latest
    steps:
      - name: 🚚 Get latest code
        uses: actions/checkout@v4

      - name: 📂 Sync files
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./site/
          server-dir: ./
```

### Secrets の作成

1. [Settings] -> [Secrets and variables] -> [New repository secret]
2. `FTP_SERVER`、`FTP_USERNAME`、`FTP_PASSWORD` の 3 つを設定（SERVER と USERNAME は variable でも OK）

<br>
