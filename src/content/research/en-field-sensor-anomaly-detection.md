---
contentId: "field-sensor-anomaly-detection"
slug: "field-sensor-anomaly-detection"
locale: "en"
title: "Anomaly Detection in Multi-Zone Agricultural Sensor Data"
summary: "A study of per-zone baselines for detecting persistent shifts while accounting for missing readings and changes caused by equipment operation."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["EWMA","CUSUM","IoT"]
status: "in-progress"
category: "Smart Agriculture"
links: [{"label":"Related project","url":"https://cwchang.me/en/projects/edge-ai-smart-agriculture/"}]
cover: "/media/og/en-research-field-sensor-anomaly-detection.jpg"
coverAlt: "Title card for “Anomaly Detection in Multi-Zone Agricultural Sensor Data”"
---

## Research question

Normal ranges differ across growing zones and sensors. The study uses a reference for each zone and sensor to identify readings that stay outside expected behavior.

## Method

An exponentially weighted moving average (EWMA) smooths recent changes. Two-sided cumulative sums (CUSUM) track sustained upward and downward shifts. Measurement timestamps, source labels, buffered readings, and equipment logs provide context.

## Evaluation scope

Field sequences are used to check time labels and trends. Synthetic scenarios cover known shifts and missing samples. False alarms, detection delay, and parameter stability still require testing across seasons and sites.
