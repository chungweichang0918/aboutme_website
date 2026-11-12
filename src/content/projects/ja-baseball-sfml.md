---
contentId: baseball-sfml
slug: baseball-sfml
locale: ja
title: "C++／SFML 野球試合シミュレーション"
summary: "打撃ミニゲームから本格的な試合へと発展させ、打順編集、投打と守備の画面、試合状態、試合結果を追加しました。"
date: "2026-11-12"
category: Software Engineering
status: in-progress
draft: false
visibility: public
tags:
  - "C++"
  - "SFML"
  - "2D ゲーム"
---

## 試合の操作

9 人の打順と先発投手を調整し、イニング数を設定して試合を開始します。打撃は照準の位置とスイングのタイミングが主な操作で、カウント、アウト数、走者の状況が画面に反映されます。

## カメラとフィードバック

投打の場面は近景で表示し、打球がフィールドに入ると俯瞰視点に切り替えて守備と走塁を見せます。スコアボードと効果音でイベントを知らせ、試合後の画面で試合データをまとめます。
