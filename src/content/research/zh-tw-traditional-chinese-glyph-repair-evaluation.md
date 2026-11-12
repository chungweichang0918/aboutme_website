---
contentId: "traditional-chinese-glyph-repair-evaluation"
slug: "traditional-chinese-glyph-repair-evaluation"
locale: "zh-tw"
title: "繁體中文圖像文字修正的可行性驗證"
summary: "以 GlyphFix 原型檢查 OCR、局部字形替換與重評分是否能形成可測試的修正流程。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["OCR","GlyphFix","Python"]
status: "in-progress"
category: "影像文字辨識"
links: [{"label":"相關作品","url":"https://cwchang.me/zh-tw/projects/glyphfix/"}]
---

## 研究問題

生成圖像中的中文字可能有缺筆、錯字或簡繁混用。若只比較 OCR 讀到的字，可能忽略替換後對背景與周邊文字造成的影響。

## 驗證設計

先在合成圖像中置入已知的字形錯誤，保留參考文字，再以 OCR 定位與分類。局部替換後重新評估文字辨識與遮罩外的背景變化，據此決定是否保留結果。

## 目前範圍

已在 CPU 上驗證後段流程，使用程式合成樣本與字形貼入。擴散模型重繪、真實生成影像與不同字體的泛化仍待測試。
