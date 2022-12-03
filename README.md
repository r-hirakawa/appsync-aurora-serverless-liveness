# Aurora Serverless の起動状態を調べる LivenessProbe を AppSync (GraphQL API) で実装してみた

本リポジトリは **NEC ソリューションイノベータ Advent Calendar 2022** の掲載記事のソースコードとなります。

- [NEC ソリューションイノベータ Advent Calendar 2022](https://qiita.com/advent-calendar/2022/nec_solution_innovators)

- [Aurora Serverless の起動状態を調べる LivenessProbe を AppSync (GraphQL API) で実装してみた](https://qiita.com/r-hirakawa/items/904182639d240c6898d5)

## 動かし方

### CDK で AWS にデプロイする

本プロジェクトは CDK を利用して AWS 環境にアプリケーションをデプロイします。

デプロイは以下の手順で実施します。

1. Web サイトのビルド

   ```
   cd <プロジェクトルートディレクトリ>/lib/web
   yarn
   yarn build
   ```

2. デプロイ

   ```
   cd <プロジェクトルートディレクトリ>
   export AWS_PROFILE=<AWSプロファイル名>
   yarn
   cdk deploy
   ```

デプロイしたアプリケーションを動作させるにあたっては、Web サイトに以下の環境設定が必要になります。

[lib/web/.env](lib/web/.env)

- REACT_APP_AWS_APPSYNC_ENDPOINT: AppSync のエンドポイントの URL
- REACT_APP_AWS_APPSYNC_API_KEY: AppSync にアクセスするための API キー

※ 本設定は、一旦 CDK で AWS 上にリソースを作成してから、そのリソースの設定内容をコピーして持ってくる必要があります。

---

以上。
