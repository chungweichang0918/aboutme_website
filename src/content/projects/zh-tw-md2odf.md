---
contentId: md2odf
slug: md2odf
locale: zh-tw
title: "md2odf Markdown 開放文件轉換器"
summary: "將 Markdown 轉換成可繼續編輯的 .odt 文件，保留標題、清單、表格與程式碼等常見結構。"
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
cover: "/media/og/zh-tw-projects-md2odf.jpg"
coverAlt: "「md2odf Markdown 開放文件轉換器」標題卡"
---

## 轉換流程

Python CLI 讀取 Markdown，解析標題層級、文字樣式、巢狀清單、表格、引用和連結，再建立對應的 ODF 文件元素。

## 排版設計

程式碼區塊使用等寬字，表頭和內文使用對應樣式。轉換後可用支援 ODF 的文書工具開啟並接著編輯。
