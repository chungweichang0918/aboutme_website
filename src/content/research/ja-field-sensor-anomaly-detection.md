---
contentId: "field-sensor-anomaly-detection"
slug: "field-sensor-anomaly-detection"
locale: "ja"
title: "多区画の農業センサーデータにおける異常検知"
summary: "区画ごとの基準を使って持続的な変化を検出し、欠測や機器操作による変化を考慮する研究。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["EWMA","CUSUM","IoT"]
status: "in-progress"
category: "スマート農業"
links: [{"label":"関連作品","url":"https://cwchang.me/ja/projects/~zh-tw-edge-ai-smart-agriculture/"}]
---

## 研究課題

土壌や環境の条件は区画によって異なるため、正常範囲も一様ではない。区画とセンサーごとに参照基準を設け、観測値が継続的に外れる場合を調べる。

## 手法

指数加重移動平均（EWMA）で直近の変化を平滑化し、両側累積和（CUSUM）で上方と下方への持続的な変化を別々に追跡する。測定時刻、データの出所、通信復旧後の再送、機器の操作記録も判定の参考にする。

## 検証範囲

現場データで時刻表示と推移を、合成データで既知の偏りと欠測を確認している。誤報率、検出遅延、パラメータの安定性には季節や場所をまたいだ評価が必要。
