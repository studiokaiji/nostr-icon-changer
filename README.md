# Nostr Icon Changer

Nostr Icon Changer は、kind: 1 投稿の中に特定のワードを検出した場合に、一定時間プロフィールを変更するジョークプログラムです。

## セットアップ

前提条件: Git および Node.js がインストールされている必要があります。

1. プロジェクトをクローン

```
git clone https://github.com/studiokaiji/nostr-icon-changer
```

2. 依存関係をインストール

```
yarn
```

3. 設定

config.json に設定を記録してください

```
{
  "interval": 300, // デフォルトプロフィールに戻すまでの秒数
  "wordList": ["NG"], // プロフィールを変更するトリガーになるワードリスト
  "defaultKind0Content": {
    "picture": "https://cdn.discordapp.com/attachments/1078693696712736860/1137648826925191258/22e730bbb04ac5be44edc9540d220a7b034b89dc2fac72f9cec42dc046df3ecd.png"
  }, // デフォルトのkind:0 content (存在していないプロパティはリレーから取得したデータから補完されます)
  "notDefaultKind0Content": {
    "picture": "https://cdn.discordapp.com/attachments/1078693696712736860/1137664177406738523/Eu_lixGUUAE7AAV.jpg"
  }, // 変更後のkind:0 content
  "relays": [
    "wss://relay.damus.io",
    "wss://relay.snort.social",
    "wss://nostr.h3z.jp",
    "wss://relay.nostr.wirednet.jp",
    "wss://relay-jp.nostr.wirednet.jp",
    "wss://nostr-relay.nokotaro.com",
    "wss://yabu.me"
  ] // データを取得するためのリレーリスト
}

```

4. 秘密鍵の設定

```
yarn setprivate 'nsec or hex secret key...'
```

5. プログラムの起動

```
yarn start
```
