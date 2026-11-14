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
cover: "/media/covers/baseball-tactics-agent.webp"
coverAlt: "Diamond Studio 的工作流程圖：從輸入、偵察、規劃、執行、撰寫、審查到輸出共七個步驟。"
flagship: 2
contribution: "個人作品；系統設計與實作由本人完成"
highlights: [{"value": "68.4%", "label": "揮棒偵測平衡準確率（原規則 52.1%）"}, {"value": "約 30 秒", "label": "單次分析時間（原本 30 分鐘以上）"}, {"value": "193", "label": "自動化測試全數通過"}]
---

## 影片分析

使用者先選定連續鏡頭與球員，再選擇投球、打擊或完整投打分析。工作台保留原片時間軸、關鍵影格及動作曲線，方便回看指標來自哪一段畫面。

![投手動作曲線圖](/media/projects/baseball-tactics-agent-motion-curves.webp)

*投手動作曲線：由上而下為身體動作量、投球手手腕速度、前導腳膝蓋高度與腳踝速度，直線標出系統偵測到的預備、啟動、出手和收尾時間點。*

## 戰術模擬與限制

守備板提供可調整的假設情境，依壘況更新 RE24。投打指標來自骨架估計，打擊事件以手腕速度峰值近似。球速只在拍攝角度、軌跡品質和校正條件足夠時顯示。

## 驗證結果

揮棒偵測以 MLB-YouTube 資料集的人工標註評估：在 2017 年世界大賽第 5 戰校準門檻，再於沒有參與調參的第 7 戰（71 段片段）驗證。改用投手出手時間定出揮棒時窗後，平衡準確率由原規則的 52.1% 提升到 68.4%。

鏡頭是否移動改由 OpenCV 量測背景特徵點的位移判斷，不交給模型看縮圖，單次分析時間從半小時以上降到約 30 秒。專案有 193 項自動化測試，涵蓋審查規則、RE24 計算與端到端流程。
