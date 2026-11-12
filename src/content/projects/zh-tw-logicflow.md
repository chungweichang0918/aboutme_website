---
contentId: logicflow
slug: logicflow
locale: zh-tw
title: "LogicFlow 數位邏輯電路模擬器"
summary: "用 C++ 在主控台組合並模擬數位邏輯電路，支援邏輯閘連線、拓樸排序與電路檔案存取。"
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/LogicFlow
tags:
  - "C++"
  - "拓樸排序"
  - "數位邏輯"
---

## 操作流程

使用者建立邏輯閘、連接訊號、指定輸出，再輸入訊號測試電路。電路可以存成 .cir 純文字檔，供下次載入並修改。

## 模擬設計

用 Kahn 拓樸排序安排邏輯閘的求值順序。遇到回授環而無法完成排序時會回報問題。支援 AND、OR、NOT、NAND、XOR、XNOR 六種邏輯閘，適合驗證組合邏輯。
