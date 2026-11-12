---
contentId: baseball-3d
slug: baseball-3d
locale: en
title: "3D Baseball Game Prototype"
summary: "A 3D baseball prototype built with Godot .NET featuring playable pitching, batting, and fielding, plus pre-game setup and match history."
date: "2026-11-12"
category: Software Engineering
status: in-progress
draft: false
visibility: public
tags:
  - "Godot"
  - "C#"
  - "3D game"
cover: "/media/og/en-projects-baseball-3d.jpg"
coverAlt: "Title card for “3D Baseball Game Prototype”"
---

## Game flow

Before a game, players choose the home and away teams, the number of innings, and which side they control, and can adjust pitching and batting settings. During play they pick a pitch type and target, and after contact they switch between fielders and make throws.

## Camera and state

After contact, the camera follows the ball and the fielders. Finished games are saved locally and can be reviewed from the match history.
