---
contentId: remote-agriculture-monitor
slug: remote-agriculture-monitor
locale: ja
title: "スマート農業リモート監視システム"
summary: "マイクロプロセッサの授業課題として制作したリモート監視画面。センサーの値を確認し、履歴の期間を選んで各計測値の変化を比較できます。"
date: "2026-11-12"
category: IoT
status: completed
draft: false
visibility: public
tags:
  - "React"
  - "Express"
  - "MySQL"
cover: "/media/og/ja-projects-remote-agriculture-monitor.jpg"
coverAlt: "「スマート農業リモート監視システム」のタイトルカード"
---

## データの表示

温度、湿度、照度、土壌水分にはそれぞれ専用の履歴グラフがあります。期間を選択すると、その期間のグラフと概要が更新されます。

## データサービス

React のフロントエンドは Express を通じてデータを取得し、バックエンドは MySQL に接続します。フロントエンドとバックエンドは分けて管理し、照会と保存はバックエンドが担当します。
