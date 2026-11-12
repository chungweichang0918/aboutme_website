---
contentId: rain-mansion
slug: rain-mansion
locale: en
title: "Not So Simple: Rainy Night Manor"
summary: "An interactive mystery game that combines a fixed storyline with AI-driven interviews, in which players gather evidence, cross-check testimony, and build a chain of evidence to solve the case."
date: "2026-11-12"
category: AI / Machine Learning
status: completed
draft: false
visibility: public
tags:
  - "AISuite"
  - "Groq"
  - "Gradio"
cover: "/media/covers/rain-mansion.webp"
coverAlt: "The Rainy Night Manor investigation workspace, with the character list on the left, the interview in the middle, and the evidence panel on the right."
---

## Deduction flow

Players interview characters, collect physical evidence, link testimony and evidence into contradictions, and submit their conclusion to close the case. The program manages clues, progress, and the rules for closing a case, while a language model handles the interviews and feedback.

![Linking testimony to evidence](/media/projects/rain-mansion-evidence-links.webp)

*Linking a contradiction: pick a statement, the evidence and the inference, preview them, then add the link.*

## Resuming play

Progress can be kept in the browser, and save files can be exported and loaded to continue later. Without a model API key, players can still continue with an offline script.
