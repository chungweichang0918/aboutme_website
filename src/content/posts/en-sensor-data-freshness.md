---
contentId: "sensor-data-freshness"
slug: "sensor-data-freshness"
locale: "en"
title: "Why Sensor Dashboards Need a Freshness Indicator"
summary: "Keep measurement and arrival times distinct so that data uploaded after an outage cannot masquerade as the current device state."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["MQTT","IoT","Telemetry"]
category: "IoT"
links: [{"label":"Related project","url":"https://cwchang.me/en/projects/edge-ai-smart-agriculture/"}]
---

## Store both timestamps

Record the measurement timestamp on the node and the arrival time at the server. When the gateway reconnects, a reading can arrive now even though it was measured minutes ago.

## Show the measurement time and source

Use the measurement timestamp to mark a reading as stale. Backfill charts with delayed readings and retain source labels so operators can identify live and simulated values.

## Test an outage and recovery

Record a normal sequence, disconnect the gateway, and reconnect after readings have buffered. Verify that delayed points return to their original positions and that the current value stays stale until a fresh sample arrives.
