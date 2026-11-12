---
contentId: baseball-tactics-agent
slug: baseball-tactics-agent
locale: en
title: "Diamond Studio: Multimodal Baseball Tactics Agent"
summary: "Extracts pitching and batting motion signals from short baseball clips and combines them with user-entered game situations and RE24 run expectancy, with analysis that links back to the original frames."
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/baseball-tactics-agent
links:
  - label: "Showcase repository"
    url: https://github.com/chungweichang0918/baseball-agent
tags:
  - "Python"
  - "YOLO"
  - "Gradio"
  - "RE24"
cover: "/media/covers/baseball-tactics-agent.webp"
coverAlt: "Diamond Studio workflow diagram with seven steps: input, scouting, planning, execution, writing, review, and output."
---

## Video analysis

Users first select a continuous shot and a player, then choose pitching, batting, or a full pitch-and-swing analysis. The workspace keeps the original timeline, key frames, and motion curves, so it is easy to trace each metric back to the footage it came from.

## Tactical simulation and limits

A fielding board provides adjustable what-if scenarios and updates RE24 based on the base state. Pitching and batting metrics come from pose estimation, and batting events are approximated from peak wrist speed. Pitch speed is shown only when the camera angle, trajectory quality, and calibration are sufficient.
