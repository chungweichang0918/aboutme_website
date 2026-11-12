---
contentId: sysgauge
slug: sysgauge
locale: ja
title: "SysGauge Android システムモニター"
summary: "メモリ、温度、通信速度、CPU などをまとめて表示する Android のリアルタイムシステムダッシュボード。ドラッグできるフローティングウィンドウも備えています。"
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/SysGauge
tags:
  - "Android"
  - "Java"
  - "Room"
  - "MVVM"
---

## 利用シーン

メイン画面では折れ線グラフと数値カードで端末の状態を表示します。フローティングウィンドウを開けば、ほかのアプリに切り替えても数値を確認し続けられます。

## システム設計

Java と MVVM で画面と状態を構成し、Room でローカルのアカウントデータを保存します。フローティングウィンドウはフォアグラウンドサービスで管理します。端末が CPU データの読み取りを制限している場合はデモデータに切り替え、グラフの動作を示せるようにしています。
