---
contentId: sentinel-soc
slug: sentinel-soc
locale: ja
title: "SENTINEL SOC セキュリティインシデント分析シミュレーター"
summary: "ブラウザー上で動くセキュリティインシデント調査の練習プラットフォーム。ログの絞り込み、タイムラインの再構成、証拠の選択、リスク評価を行います。"
date: "2026-11-12"
category: Cybersecurity
status: completed
draft: false
visibility: public
github: https://github.com/chungweichang0918/sentinel-soc-simulator
demo: https://chungweichang0918.github.io/sentinel-soc-simulator/
tags:
  - "JavaScript"
  - "SOC"
  - "インシデントタイムライン"
cover: "/media/covers/sentinel-soc.webp"
coverAlt: "SENTINEL SOC の調査ワークスペース。事案一覧、イベントのグラフ、調査パネルを表示。"
---

## 調査の流れ

模擬アラートを起点に、送信元、イベント種別、リスクでログを絞り込みます。イベントの項目を確認して重要な証拠に印を付け、リスクと対応の判断を提出します。提出後はスコアと事例の解説を確認できます。

## 実装

画面、サンプル事例、データを 1 つの HTML ファイルにまとめており、オフラインで操作できます。読み込んだログはブラウザー内で処理し、事例の対応オプションは教育用のシミュレーションです。
