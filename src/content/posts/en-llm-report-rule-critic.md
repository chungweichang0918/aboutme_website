---
contentId: "llm-report-rule-critic"
slug: "llm-report-rule-critic"
locale: "en"
title: "Checking an LLM-written tactics report with rules first"
summary: "Diamond Studio's reports are written by a language model. Before they are shown, code checks evidence citations, RE24 numbers, and whether a tactic fits the game situation. Failing reports go back for up to two rewrites."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["AI Agent", "LLM", "Reflection"]
category: "Applied AI"
links: [{"label": "Related project", "url": "https://cwchang.me/en/projects/baseball-tactics-agent/"}]
---

## Why not rely on the model to check itself

Diamond Studio runs in four stages: plan, execute, synthesize, and review. In the synthesis stage a language model writes the tactics report. Models write fluent prose, but they can also cite evidence that does not exist, copy a number wrong, or suggest a sacrifice bunt with two outs.

Most of these errors can be decided by code. Rule checks are cheap, consistent, and easy to explain, so they run first.

## What the rules check

| Check | Example of a failure |
| --- | --- |
| Sections | A section required by the template is missing |
| Evidence citations | A cited `[E##]` does not exist, or a video observation has no evidence attached |
| RE24 numbers | A run-expectancy value in the report does not match the tool's output, or numbers appear with no successful RE24 calculation |
| Tactics vs. situation | Suggesting a steal of an occupied base, or a sacrifice bunt with two outs |
| Pitch tipping | Mentioning tipping without saying "possible" and without stating how many pitches were analyzed and that the sample is small |
| Speed data | mph or rpm appears although no user-confirmed Statcast data exists for the clip |
| Limitations | The evidence shows a limitation, such as the camera angle, but the limitations section leaves it out |

The number check extracts run-expectancy values from the report and compares them with the tool's results, allowing only a very small tolerance.

## Sending it back, with a limit

When rules find problems, the list goes back to the synthesis stage for a rewrite, at most twice. If the second rewrite still fails, the report is published anyway with a list of failed checks at the top.

I deliberately avoided unlimited retries. It is better to tell the user honestly what is still wrong than to keep rewriting until the report merely looks like it passes.

## Takeaway

Rules cannot judge whether reasoning is sound, such as the link between "slow delivery" and "attempt a steal". But they block everything code can verify, leaving the model to handle what genuinely needs judgment. That split is far more reliable than simply asking the model to "please check your work".
