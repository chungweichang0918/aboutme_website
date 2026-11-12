---
contentId: portfolio-exposure-analysis
slug: portfolio-exposure-analysis
locale: zh-tw
title: "AI 投資組合體檢"
summary: "從輸入的股票與 ETF 配置計算底層持股、產業曝險與重疊，再以附來源的文字摘要說明資料。"
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
tags:
  - "Python"
  - "RAG"
  - "Ollama"
cover: "/media/og/zh-tw-projects-portfolio-exposure-analysis.jpg"
coverAlt: "「AI 投資組合體檢」標題卡"
---

## 計算流程

用 Python 將 ETF 配置換算成底層持股，並計算曝險、集中度和持股重疊。數值可回到原始配置與成分資料核對。

## 摘要與驗證

以 RAG 取得相關新聞，再由本機模型產生附來源的摘要。流程會標記無法對應的來源或數字，讓讀者回查原始資料。
