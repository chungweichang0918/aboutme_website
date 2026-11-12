---
contentId: remote-agriculture-monitor
slug: remote-agriculture-monitor
locale: zh-tw
title: "智慧農業遠端監控系統"
summary: "微處理機課程專題的遠端監控介面，讓使用者查看感測數值、選取歷史區間並比較各項量測的變化。"
date: "2026-11-12"
category: IoT
status: completed
draft: false
visibility: public
tags:
  - "React"
  - "Express"
  - "MySQL"
cover: "/media/og/zh-tw-projects-remote-agriculture-monitor.jpg"
coverAlt: "「智慧農業遠端監控系統」標題卡"
---

## 資料呈現

溫度、濕度、光照及土壤濕度各有獨立的歷史圖表。選定時間區間後，畫面更新該段期間的圖表與摘要。

## 資料服務

React 前端透過 Express 取得資料，後端連接 MySQL。前後端分開維護，查詢及儲存由後端負責。
