---
contentId: glyphfix
slug: glyphfix
locale: ja
title: "GlyphFix 繁体字グリフ修正"
summary: "画像内の繁体字テキストを修正するプロトタイプ。OCR で誤字を特定し、局所マスクを生成し、文字と背景が改善したかを再評価します。"
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
tags:
  - "Python"
  - "OCR"
  - "画像処理"
cover: "/media/og/ja-projects-glyphfix.jpg"
coverAlt: "「GlyphFix 繁体字グリフ修正」のタイトルカード"
---

## 修正フロー

まず OCR で期待される文字と一致しない領域を見つけ、誤りの種類に応じてマスクを決め、指定した領域を修復します。再評価では、文字の正確さと背景の保持度を同時に確認します。

## 検証の進捗

現在、認識、分類、マスク、グリフ置換、再評価までを CPU 上で一通り動かせています。テスト入力はプログラムで誤字を注入した合成サンプルです。拡散モデルによる生成と局所的な再描画は今後の検証項目です。
