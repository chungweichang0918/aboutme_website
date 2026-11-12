---
contentId: baseball-3d
slug: baseball-3d
locale: ja
title: "3D 野球ゲームのプロトタイプ"
summary: "Godot .NET で制作した 3D 野球のプロトタイプ。投球・打撃・守備を操作でき、試合前の設定と試合履歴も備えています。"
date: "2026-11-12"
category: Software Engineering
status: in-progress
draft: false
visibility: public
tags:
  - "Godot"
  - "C#"
  - "3D ゲーム"
---

## 試合の流れ

試合前にホーム・ビジターのチーム、イニング数、操作する側を選び、投打の設定を調整できます。試合中は球種とコースを選び、打球後は守備選手を切り替えて送球します。

## 画面と状態

打球後はカメラがボールと守備選手を追います。終了した試合はローカルに保存され、履歴から結果を振り返れます。
