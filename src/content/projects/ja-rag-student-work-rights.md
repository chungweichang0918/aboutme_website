---
contentId: rag-student-work-rights
slug: rag-student-work-rights
locale: ja
title: "学生アルバイトの権利をテーマにした RAG 教材"
summary: "出典付きの繁体字中国語の教材用要約から検索データを作り、取得した段落に基づいて回答し根拠を示す QA モデルを練習します。"
date: "2026-11-12"
category: AI / Machine Learning
status: completed
draft: false
visibility: public
tags:
  - "RAG"
  - "Embeddings"
  - "Jupyter"
---

## データの準備

よくあるテーマを教材向けに書き直した要約として整理しました。各レコードにはタイトル、出典 URL、テスト問題を含め、検索結果から情報の出典をたどれるようにしています。

## 演習の設計

ノートブックでは文書の分割、ベクトル化、検索を扱います。問題集には知識ベースの範囲外の質問も含め、データが不足していることをモデルが説明できるかを観察します。QA パイプラインの教材用の演習です。
