---
contentId: baseball-tactics-agent
slug: baseball-tactics-agent
locale: zh-tw
title: "Diamond Studio 多模態棒球戰術 Agent"
summary: "從棒球短片擷取投打動作訊號，結合使用者填寫的賽況與 RE24 得分期望值，呈現可回看原始影格的分析。"
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/baseball-tactics-agent
links:
  - label: "網站展示版程式庫"
    url: https://github.com/chungweichang0918/baseball-agent
tags:
  - "Python"
  - "YOLO"
  - "Gradio"
  - "RE24"
---

## 影片分析

使用者先選定連續鏡頭與球員，再選擇投球、打擊或完整投打分析。工作台保留原片時間軸、關鍵影格及動作曲線，方便回看指標來自哪一段畫面。

## 戰術模擬與限制

守備板提供可調整的假設情境，依壘況更新 RE24。投打指標來自骨架估計，打擊事件以手腕速度峰值近似。球速只在拍攝角度、軌跡品質和校正條件足夠時顯示。
