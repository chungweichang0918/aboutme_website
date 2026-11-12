---
contentId: portfolio-exposure-analysis
slug: portfolio-exposure-analysis
locale: ja
title: "AI ポートフォリオ診断"
summary: "入力した株式と ETF の配分から、実質的な保有銘柄、業種エクスポージャー、重複を計算し、出典付きの要約でデータを説明します。"
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
tags:
  - "Python"
  - "RAG"
  - "Ollama"
cover: "/media/og/ja-projects-portfolio-exposure-analysis.jpg"
coverAlt: "「AI ポートフォリオ診断」のタイトルカード"
---

## 計算の流れ

Python で ETF の配分を構成銘柄に展開し、エクスポージャー、集中度、保有銘柄の重複を計算します。各数値は元の配分と構成データに照らして確認できます。

## 要約と検証

RAG で関連ニュースを取得し、ローカルモデルが出典付きの要約を生成します。対応づけられない出典や数値にはフラグを付け、読み手が元データを確認できるようにしています。
