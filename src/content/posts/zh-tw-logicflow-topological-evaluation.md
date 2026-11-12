---
contentId: "logicflow-topological-evaluation"
slug: "logicflow-topological-evaluation"
locale: "zh-tw"
title: "LogicFlow 如何決定邏輯閘的運算順序"
summary: "把組合邏輯電路視為有向圖，便能用拓樸排序安排求值，並辨識無法排序的回授。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["C++","Kahn","LogicFlow"]
category: "演算法"
links: [{"label":"相關作品","url":"https://cwchang.me/zh-tw/projects/logicflow/"}]
cover: "/media/og/zh-tw-blog-logicflow-topological-evaluation.jpg"
coverAlt: "「LogicFlow 如何決定邏輯閘的運算順序」標題卡"
---

## 把連線轉成依賴

當 A 的輸出接到 B 的輸入，B 必須等 A 求值後才能執行。將邏輯閘視為節點、連線視為有向邊，就能以圖描述這些依賴。

## 從沒有前置依賴的元件開始

Kahn 演算法先將入度為零的元件放進佇列。取出元件後，扣除所有相鄰元件的一項依賴。當某個元件的入度變成零，就可加入佇列。

## 用半加器檢查結果

半加器讓 A、B 同時餵給 XOR 與 AND。A 和 B 都是 1 時，和應為 0，進位應為 1。若佇列清空後還有未處理的元件，應回報回授環，讓使用者回頭檢查連線。
