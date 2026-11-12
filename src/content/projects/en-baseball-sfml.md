---
contentId: baseball-sfml
slug: baseball-sfml
locale: en
title: "C++ / SFML Baseball Game Simulation"
summary: "Grown from a batting mini-game into a full game, adding lineup editing, pitching, batting and fielding views, game state, and post-game results."
date: "2026-11-12"
category: Software Engineering
status: in-progress
draft: false
visibility: public
tags:
  - "C++"
  - "SFML"
  - "2D game"
---

## Gameplay

Players set a nine-player batting order and a starting pitcher, then choose the number of innings and start the game. Batting centers on cursor placement and swing timing, while the screen keeps the count, outs, and base runners up to date.

## Camera and feedback

Pitching and batting use a close-up view. Once the ball is in play, the view switches to an overhead field to show fielders chasing the ball and runners advancing. The scoreboard and sound effects give feedback on events, and a post-game screen summarizes the game stats.
