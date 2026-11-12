---
contentId: "re24-break-even"
slug: "re24-break-even"
locale: "en"
title: "Using RE24 to find the success rate a stolen base needs"
summary: "RE24 gives the average runs still to come for each base-out state. Comparing the gain from success with the loss from failure tells you how often a steal must succeed to be worth trying."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["RE24", "Baseball analytics", "Python"]
category: "Data Analysis"
links: [{"label": "Related project", "url": "https://cwchang.me/en/projects/baseball-tactics-agent/"}]
cover: "/media/og/en-blog-re24-break-even.jpg"
coverAlt: "Title card for “Using RE24 to find the success rate a stolen base needs”"
---

## What RE24 is

Baseball has 8 base states (empty, runner on first, first and third, and so on) and 3 out counts, for 24 situations in total. RE24 is a table of the average runs scored from each situation until the end of the half-inning.

Diamond Studio uses Tom Tango's MLB 2010–2015 values, stored in `re24.json` and checked line by line against the source table. The same JSON holds each tactic's preconditions (a steal of second needs a runner on first and second base empty), so the planning and review stages share one set of rules.

## The value of a tactic

The change in run expectancy from a tactic is:

```
ΔRE = runs scored on the play + RE(state after) − RE(state before)
```

With a runner on first and nobody out, RE is 0.859:

- Steal succeeds → runner on second, nobody out, RE 1.100, ΔRE = **+0.241**
- Steal fails → bases empty, one out, RE 0.254, ΔRE = **−0.605**

Failure costs far more than success gains.

## The break-even success rate

With success rate p, the expected ΔRE is `p × 0.241 + (1 − p) × (−0.605)`. Setting that to zero gives the break-even point:

```
break-even rate = |ΔRE_fail| ÷ (ΔRE_success + |ΔRE_fail|)
                = 0.605 ÷ 0.846 ≈ 71.5%
```

In this situation, a steal is only worth it if the estimated success rate is above about 72%. The code computes this only when success gains and failure loses, and users can enter their own estimated success rate to see the expected change directly.

## What the data and the video each answer

RE24 only answers "what success rate do we need". The video analysis tries to answer "roughly what rate do we have", for example from the pitcher's delivery tempo. The report puts the two side by side, each with its own evidence IDs.

## Limits

- These are MLB averages. The CPBL has a different scoring environment, so the values differ.
- MLB's pitch timer and pickoff limits from 2023 changed the stolen-base environment.
- RE24 measures average runs. Late in a close game where one run is all you need, the probability of scoring at least one run is the better table.
