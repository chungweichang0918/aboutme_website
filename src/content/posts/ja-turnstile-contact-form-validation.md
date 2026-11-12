---
contentId: "turnstile-contact-form-validation"
slug: "turnstile-contact-form-validation"
locale: "ja"
title: "Cloudflare Pages の問い合わせフォームを検証する"
summary: "このサイトの問い合わせフォームを例に、ブラウザーの認証、サーバー側の検証、メールの到着を確認する。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["Cloudflare Pages","Turnstile","Resend"]
category: "ウェブ運用"
links: [{"label":"Cloudflare の検証ドキュメント","url":"https://developers.cloudflare.com/turnstile/get-started/server-side-validation/"}]
---

## ブラウザーでの認証とサーバー検証

Turnstile が返したトークンをフォームとともに Pages Function に送る。サーバーは Siteverify を呼び出し、応答のホスト名と action を確認してから送信処理に進む。

## 障害の段階を切り分ける

本番のウィジェット設定、トークン検証の結果、メールサービスの応答と受信状況を順に確認する。詳細な診断情報はサーバーに保持し、画面には再試行の案内を表示する。

## 成功時と失敗時を試験する

自動テストでは入力エラー、オリジン検証、レート制限、トークン検証、メール送信の再試行を確認する。本番確認では実際にフォームを送信し、メールの到着を確かめる。
