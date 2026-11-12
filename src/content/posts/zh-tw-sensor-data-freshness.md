---
contentId: "sensor-data-freshness"
slug: "sensor-data-freshness"
locale: "zh-tw"
title: "感測值有數字，為什麼仍需要過期提示？"
summary: "用量測時間與接收時間區分現場讀值和斷線補送，避免把舊資料當成設備現在的狀態。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["MQTT","IoT","Telemetry"]
category: "物聯網"
links: [{"label":"相關作品","url":"https://cwchang.me/zh-tw/projects/edge-ai-smart-agriculture/"}]
cover: "/media/og/zh-tw-blog-sensor-data-freshness.jpg"
coverAlt: "「感測值有數字，為什麼仍需要過期提示？」標題卡"
---

## 分開保存兩種時間

節點量測時記下量測時間，伺服器收到時另記接收時間。閘道斷網後補送資料時，接收時間可能是現在，量測時間仍是數分鐘前。

## 介面顯示量測時間與來源

即時卡片依量測時間判斷資料是否過期。補送資料可回填歷史圖表，來源標記也能讓管理者區分現場讀值與模擬資料。

## 測試斷線和恢復

先記錄一段正常的量測序列，再讓閘道斷線、暫存並恢復連線。檢查補送的點是否落回原本的時間位置，以及介面是否維持正確的過期狀態，直到新量測抵達。
