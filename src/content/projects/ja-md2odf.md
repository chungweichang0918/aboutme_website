---
contentId: md2odf
slug: md2odf
locale: ja
title: "md2odf Markdown→OpenDocument 変換ツール"
summary: "Markdown を編集可能な .odt 文書に変換し、見出し、リスト、表、コードなどの一般的な構造を保持します。"
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
github: https://github.com/chungweichang0918/md2odf
tags:
  - "Python"
  - "Markdown"
  - "ODF"
---

## 変換の流れ

Python の CLI が Markdown を読み込み、見出しレベル、文字スタイル、入れ子のリスト、表、引用、リンクを解析して、対応する ODF の文書要素を生成します。

## レイアウト設計

コードブロックには等幅フォントを使い、表の見出しと本文にはそれぞれのスタイルを適用します。変換後は ODF 対応のオフィスソフトで開いて編集を続けられます。
