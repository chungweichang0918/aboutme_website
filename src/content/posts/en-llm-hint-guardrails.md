---
contentId: "llm-hint-guardrails"
slug: "llm-hint-guardrails"
locale: "en"
title: "Letting an AI give hints without giving away the answer"
summary: "The mystery game's AI assistant only sees what the player has already found, and every reply is checked by rules before it is shown. This blocks common leaks but is not full semantic protection."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["LLM", "Groq", "Prompt design"]
category: "Applied AI"
links: [{"label": "Related project", "url": "https://cwchang.me/en/projects/rain-mansion/"}]
---

## Code owns the rules, the model owns the conversation

*Rainy Night Manor* connects to Groq's language models through AISuite. The split is strict: the fixed case facts, clue thresholds, contradictions, and win conditions live in code. The model handles natural-language interviews and post-game feedback.

However creative the model gets, it cannot change who the culprit is or unlock evidence for the player.

## The hint problem

A stuck player can press "I'm stuck, give me a hint". A useful hint has to talk about the case, but saying too much gives away the answer. I handle this with two gates.

**Gate one: give the model only what it should see.** The prompt contains only evidence the player has found, testimony they have heard, and their draft reasoning. The full solution and unfound evidence are never in the prompt, so the model cannot reveal them.

**Gate two: check the reply before showing it.** Each reply goes through rules:

- At most 900 characters.
- Rejected if it contains words such as "culprit", "the real killer", or "correct answer".
- Rejected if it directly names a character as the answer or contains option codes from the accusation form.
- Every evidence ID it mentions must already be in the player's possession.

If a reply fails, the interface falls back to a pre-written rule-based hint and labels it as not coming from the AI.

## Graduated hints

"Be more specific" steps from a general direction to a summary of clues, then to a concrete next action. After the player makes new progress, hints reset to the most general level. Asking the same question at the same progress does not call the model again.

## What this does not stop

Keyword and code checks only catch obvious leaks. A paraphrased hint at the answer may slip through. The project report says so plainly: this reduces risk but is not complete semantic leak prevention. The real safeguard is gate one, because the model never has the answer in the first place.
