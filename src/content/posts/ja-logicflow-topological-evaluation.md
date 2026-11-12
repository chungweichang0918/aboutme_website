---
contentId: "logicflow-topological-evaluation"
slug: "logicflow-topological-evaluation"
locale: "ja"
title: "LogicFlow が論理ゲートの評価順序を決める仕組み"
summary: "組み合わせ回路を有向グラフにすると、トポロジカルソートで評価順を決め、フィードバックの循環を検出できる。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["C++","Kahn","LogicFlow"]
category: "アルゴリズム"
links: [{"label":"関連作品","url":"https://cwchang.me/ja/projects/~zh-tw-logicflow/"}]
---

## 配線を依存関係に変換する

A の出力が B に接続される場合、B は A の評価を待つ。論理ゲートを頂点、配線を有向辺として表し、依存関係を明示する。

## 前提のないゲートから処理する

Kahn のアルゴリズムでは、入次数がゼロの頂点をキューに入れる。頂点を処理するたびに後続頂点の入次数を減らし、ゼロになった頂点をキューに追加する。

## 半加算器で確かめる

A と B を XOR と AND の両方に入力する。両方が1なら和は0、桁上がりは1になる。全頂点を処理する前にキューが空になった場合は、配線に循環があることを知らせる。
