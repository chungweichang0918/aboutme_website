---
contentId: sentinel-soc
slug: sentinel-soc
locale: en
title: "SENTINEL SOC Incident Analysis Simulator"
summary: "An in-browser practice platform for security incident investigation, where users filter logs, reconstruct timelines, select evidence, and assess risk."
date: "2026-11-12"
category: Cybersecurity
status: completed
draft: false
visibility: public
github: https://github.com/chungweichang0918/sentinel-soc-simulator
demo: https://chungweichang0918.github.io/sentinel-soc-simulator/
tags:
  - "JavaScript"
  - "SOC"
  - "Incident timeline"
---

## Investigation flow

Starting from a simulated alert, users filter logs by source, event type, or risk. They can inspect event fields, mark key evidence, and submit their risk and response assessment. After submitting, they see a score and a case walkthrough.

## Implementation

The interface, sample cases, and data are packaged in a single HTML file that works offline. Imported logs are processed in the browser, and the response options in the cases are for teaching simulation only.
