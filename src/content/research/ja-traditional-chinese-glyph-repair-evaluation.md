---
contentId: "traditional-chinese-glyph-repair-evaluation"
slug: "traditional-chinese-glyph-repair-evaluation"
locale: "ja"
title: "画像内の繁体字修正に関する実現可能性評価"
summary: "GlyphFix の試作を用い、OCR、字形の局所置換、再評価を組み合わせた修正工程を検証する。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["OCR","GlyphFix","Python"]
status: "in-progress"
category: "画像文字認識"
links: [{"label":"関連作品","url":"https://cwchang.me/ja/projects/glyphfix/"}]
---

## 研究課題

生成画像内の漢字には、画の欠落、誤字、繁体字と簡体字の混在が起こる。OCR の精度だけでは、周囲の文字や背景の劣化を見落とす可能性がある。

## 検証設計

既知の誤りと正解文字列を持つ合成画像を用意し、OCR で位置と種類を調べる。局所置換後は認識結果とマスク外の変化を再評価し、修正を採用するか判断する。

## 現在の範囲

合成画像と字形の合成を用い、後段の工程を CPU 上で確認済み。拡散モデルによる補完、実際の生成画像、異なるフォントでの汎化は今後の評価対象。
