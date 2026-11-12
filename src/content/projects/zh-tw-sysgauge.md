---
contentId: sysgauge
slug: sysgauge
locale: zh-tw
title: "SysGauge Android 系統監測"
summary: "Android 即時系統儀表板，將記憶體、溫度、網路速度與 CPU 等資訊集中呈現，並提供可拖曳的懸浮視窗。"
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/SysGauge
tags:
  - "Android"
  - "Java"
  - "Room"
  - "MVVM"
cover: "/media/og/zh-tw-projects-sysgauge.jpg"
coverAlt: "「SysGauge Android 系統監測」標題卡"
---

## 使用情境

主畫面以折線圖與數值卡呈現裝置狀態。使用者也可以開啟懸浮視窗，切換到其他應用時繼續查看數值。

## 系統設計

以 Java 和 MVVM 組織畫面與狀態，使用 Room 儲存本機帳號資料。懸浮視窗由前景服務管理。裝置限制 CPU 資料讀取時會切換到示範資料，方便展示圖表行為。
