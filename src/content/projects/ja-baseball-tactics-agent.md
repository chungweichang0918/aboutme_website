---
contentId: baseball-tactics-agent
slug: baseball-tactics-agent
locale: ja
title: "Diamond Studio マルチモーダル野球戦術エージェント"
summary: "野球の短い動画から投打の動作シグナルを抽出し、ユーザーが入力した試合状況と RE24 得点期待値を組み合わせ、元のフレームまで遡れる分析を表示します。"
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/baseball-tactics-agent
links:
  - label: "展示版リポジトリ"
    url: https://github.com/chungweichang0918/baseball-agent
tags:
  - "Python"
  - "YOLO"
  - "Gradio"
  - "RE24"
cover: "/media/covers/baseball-tactics-agent.webp"
coverAlt: "Diamond Studio のワークフロー図。入力、偵察、計画、実行、執筆、審査、出力の 7 段階。"
---

## 動画分析

まず連続したカットと選手を選び、投球、打撃、または投打全体の分析を選択します。作業画面には元動画のタイムライン、キーフレーム、動作曲線が残るため、各指標がどの場面から得られたかを確認できます。

## 戦術シミュレーションと制約

守備ボードでは仮定の状況を調整でき、走者状況に応じて RE24 を更新します。投打の指標は骨格推定に基づき、打撃イベントは手首速度のピークで近似しています。球速は撮影角度、軌跡の品質、キャリブレーション条件が十分な場合にのみ表示します。
