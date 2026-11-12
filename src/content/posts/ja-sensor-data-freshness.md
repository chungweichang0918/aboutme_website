---
contentId: "sensor-data-freshness"
slug: "sensor-data-freshness"
locale: "ja"
title: "センサーダッシュボードでデータの鮮度を表示する理由"
summary: "測定時刻と受信時刻を分けると、通信復旧後に届く過去の値を現在の状態と混同せずに済む。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["MQTT","IoT","Telemetry"]
category: "IoT"
links: [{"label":"関連作品","url":"https://cwchang.me/ja/projects/edge-ai-smart-agriculture/"}]
---

## 二種類の時刻を保存する

ノードで測定時刻を記録し、サーバーでは受信時刻を別に記録する。ゲートウェイが再接続すると、数分前に測定した値が現在の時刻に届くことがある。

## 測定時刻と出所を画面に示す

最新値の鮮度は測定時刻から判断する。遅れて届いた値は履歴に補い、出所の表示で現場データとシミュレーションを区別できるようにする。

## 切断と復旧を試験する

正常時の測定系列を記録してから、ゲートウェイを切断し、データが蓄積した後で再接続する。遅延データが元の時刻に戻り、新しい測定が届くまで最新値の期限切れ表示が続くことを確認する。
