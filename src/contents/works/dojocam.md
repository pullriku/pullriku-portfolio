---
title: "Raspberry Pi を用いた水槽監視システム"
---

水槽にカメラを接続した Raspberry Pi を設置し、生き物の様子を監視するシステムを構築しました。
定期的な写真撮影を行い、リアルタイムのライブストリームも可能にしています。

フロントエンドは Astro、React、TailwindCSS を使用し、バックエンドは Rust言語の Axum フレームワークで構築しました。WebSocket を利用して、ユーザーが接続しているかを逐一確認し、接続されている場合のみライブストリームを配信する仕組みを実装しています。

[https://blog/pullriku.net/posts/dojocam/](https://blog/pullriku.net/posts/dojocam/)

- [GitHub リポジトリ](https://github.com/pullriku/dojocam)
