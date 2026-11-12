---
contentId: "field-sensor-anomaly-detection"
slug: "field-sensor-anomaly-detection"
locale: "zh-tw"
title: "多區域農業感測資料的異常偵測"
summary: "探討如何利用各區的感測基線辨識持續偏移，並區分讀值異常、資料中斷與設備操作造成的變化。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["EWMA","CUSUM","IoT"]
status: "in-progress"
category: "智慧農業"
links: [{"label":"相關作品","url":"https://cwchang.me/zh-tw/projects/edge-ai-smart-agriculture/"}]
---

## 研究問題

不同區域的土壤與環境條件會形成不同的正常範圍。研究以各區、各感測器為單位建立參考，觀察量測是否長時間偏離預期。

## 方法

以指數加權移動平均（EWMA）平滑近期變化，並用雙向累積和（CUSUM）分別觀察持續偏高與偏低。分析同時保留量測時間與資料來源，並將斷訊補送與現場操作紀錄納入判讀。

## 驗證範圍

目前以現場序列檢查時間標記與趨勢，以合成情境檢查指定偏移與缺值。後續仍需以跨季及跨場域資料評估誤報率、偵測延遲與參數穩定性。
