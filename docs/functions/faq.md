# よくある問題

## シミュレータが起動できない

Firebaseのアカウントを切り替えた際に発生する。

### 解決策

ディレクトリ`/functions/`で以下を実行する。

```bash
$ yarn reset
```

または、

```bash
$ rm ~/.config/gcloud/application_default_credentials.json
```

### Node.jsのバージョンが一致しない

Node.js `v8.9.4`で動作が確認できてる。

```bash
$ n 8.9.4
$ node -v
v8.9.4
```

モジュールをインストールし直す。

```bash
$ sudo rm -rf node_modules yarn.lock
$ yarn
```
