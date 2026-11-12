---
contentId: logicflow
slug: logicflow
locale: ja
title: "LogicFlow デジタル論理回路シミュレーター"
summary: "C++ のコンソール上でデジタル論理回路を組み立ててシミュレートするツール。ゲートの配線、トポロジカルソート、回路ファイルの保存と読み込みに対応しています。"
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/LogicFlow
tags:
  - "C++"
  - "トポロジカルソート"
  - "デジタル論理"
---

## 操作の流れ

論理ゲートを作成して信号を接続し、出力を指定したうえで入力信号を与えて回路をテストします。回路はテキスト形式の .cir ファイルとして保存でき、後から読み込んで編集できます。

## シミュレーションの設計

Kahn のトポロジカルソートで論理ゲートの評価順序を決めます。フィードバックループによりソートが完了できない場合は問題として報告します。AND、OR、NOT、NAND、XOR、XNOR の 6 種類のゲートに対応しており、組み合わせ論理の検証に適しています。
