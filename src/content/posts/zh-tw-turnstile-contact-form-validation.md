---
contentId: "turnstile-contact-form-validation"
slug: "turnstile-contact-form-validation"
locale: "zh-tw"
title: "Cloudflare Pages 聯絡表單的驗證與寄信"
summary: "以本網站的聯絡表單為例，說明瀏覽器挑戰、伺服器驗證和郵件送達各自如何確認。"
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["Cloudflare Pages","Turnstile","Resend"]
category: "網站維運"
links: [{"label":"Cloudflare 官方驗證文件","url":"https://developers.cloudflare.com/turnstile/get-started/server-side-validation/"}]
---

## 前端挑戰與伺服器驗證

Turnstile 小工具完成後，前端將權杖隨表單送到 Pages Function。後端呼叫 Siteverify，核對回應的網域與 action，再決定是否進入寄信流程。

## 依階段定位問題

先確認正式站使用對應的 site key，再確認伺服器驗證權杖成功，最後核對寄信服務的回應與收件結果。前端應提供清楚的重試訊息，診斷細節留在伺服器。

## 測試成功與失敗情況

自動化測試涵蓋欄位錯誤、來源驗證、速率限制、權杖驗證與寄信重試。正式環境的驗收再以一次實際表單提交核對郵件是否送達。
