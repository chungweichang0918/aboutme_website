---
contentId: sysgauge
slug: sysgauge
locale: en
title: "SysGauge Android System Monitor"
summary: "A real-time Android system dashboard that brings memory, temperature, network speed, CPU, and more into one view, with a draggable floating window."
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
---

## Use case

The main screen shows device status with line charts and value cards. Users can also open a floating window to keep watching the numbers while switching to other apps.

## System design

Java and MVVM organize the screens and state, and Room stores local account data. The floating window is managed by a foreground service. When the device restricts access to CPU data, the app switches to demo data so the chart behavior can still be shown.
