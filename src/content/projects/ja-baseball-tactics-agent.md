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
flagship: 2
contribution: "個人制作。設計と実装を本人が担当"
highlights: [{"value": "68.4%", "label": "スイング検出のバランス正解率（従来 52.1%）"}, {"value": "約 30 秒", "label": "1 回の分析時間（従来 30 分以上）"}, {"value": "193", "label": "自動テストすべて合格"}]
---

## 動画分析

まず連続したカットと選手を選び、投球、打撃、または投打全体の分析を選択します。作業画面には元動画のタイムライン、キーフレーム、動作曲線が残るため、各指標がどの場面から得られたかを確認できます。

![投手の動作曲線](/media/projects/baseball-tactics-agent-motion-curves.webp)

*投手の動作曲線。上から全身の動作量、投球側の手首の速度、踏み出し脚の膝の高さと足首の速度。縦線は検出したセット、始動、リリース、フォロースルーの時点です。*

## 戦術シミュレーションと制約

守備ボードでは仮定の状況を調整でき、走者状況に応じて RE24 を更新します。投打の指標は骨格推定に基づき、打撃イベントは手首速度のピークで近似しています。球速は撮影角度、軌跡の品質、キャリブレーション条件が十分な場合にのみ表示します。

## 検証結果

スイング検出は MLB-YouTube データセットの人手ラベルで評価しました。2017 年ワールドシリーズ第 5 戦でしきい値を調整し、調整に使っていない第 7 戦（71 クリップ）で検証しています。投手のリリース時刻からスイングの時間窓を決める方式にしたことで、バランス正解率は従来ルールの 52.1% から 68.4% に向上しました。

カメラが動いているかどうかは、モデルにサムネイルを見せるのではなく OpenCV で背景の特徴点の移動量を測って判断するようにし、1 回の分析時間を 30 分以上から約 30 秒に短縮しました。審査ルール、RE24 の計算、エンドツーエンドの流れを含む 193 件の自動テストがあります。
