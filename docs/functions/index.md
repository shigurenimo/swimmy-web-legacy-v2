# はじめに

## 開発環境

`/functions/`が開発のルートディレクトリになる。

```bash
$ cd /functions
```

必要なモジュールをインストールする。

```bash
$ yarn
```

開発環境を起動する。

```
$ yarn start
```

## デプロイ

リポジトリのルートディレクトリで実行する。

全ての関数をデプロイする。

```bash
$ yarn firebase --only functions
```

任意の関数をデプロイする。

```bash
$ yarn firebase --only functions:name
```

※ `name`は関数名
