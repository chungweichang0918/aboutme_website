---
contentId: remote-agriculture-monitor
slug: remote-agriculture-monitor
locale: en
title: "Smart Agriculture Remote Monitoring System"
summary: "A remote monitoring interface built for a microprocessor course project, letting users view sensor values, pick a historical range, and compare how each measurement changes."
date: "2026-11-12"
category: IoT
status: completed
draft: false
visibility: public
tags:
  - "React"
  - "Express"
  - "MySQL"
---

## Data display

Temperature, humidity, light, and soil moisture each have their own history chart. After a time range is selected, the charts and summary update for that period.

## Data service

The React front end fetches data through Express, and the back end connects to MySQL. The front end and back end are maintained separately, with querying and storage handled by the back end.
