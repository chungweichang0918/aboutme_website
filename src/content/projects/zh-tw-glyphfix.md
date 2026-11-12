---
contentId: glyphfix
slug: glyphfix
locale: zh-tw
title: "GlyphFix 繁體中文字形修正"
summary: "繁體中文圖像文字修正原型。用 OCR 定位錯字、產生局部遮罩，並重新評估文字與背景是否改善。"
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
tags:
  - "Python"
  - "OCR"
  - "影像處理"
---

## 修正流程

先以 OCR 找出與預期文字不符的區域，依錯誤類型決定遮罩，再修補指定區塊。重新評分時同時檢查文字正確性和背景保留程度。

## 驗證進度

目前已在 CPU 上跑通辨識、分類、遮罩、字形替換與重新評分。測試輸入是程式注入錯字的合成樣本。擴散模型生成和局部重繪屬後續驗證項目。
