---
contentId: "traditional-chinese-glyph-repair-evaluation"
slug: "traditional-chinese-glyph-repair-evaluation"
locale: "en"
title: "Evaluating Traditional Chinese Glyph Repair in Images"
summary: "A GlyphFix feasibility study of OCR, local glyph replacement, and rescoring as a testable correction pipeline."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["OCR","GlyphFix","Python"]
status: "in-progress"
category: "Text Recognition"
links: [{"label":"Related project","url":"https://cwchang.me/en/projects/glyphfix/"}]
---

## Research question

Generated images can omit strokes, substitute characters, or mix Traditional and Simplified forms. OCR accuracy alone can miss damage to the background and nearby text.

## Evaluation design

Synthetic samples contain known errors and reference text. OCR locates and classifies them. After local replacement, the prototype reassesses recognition and changes outside the mask before keeping a correction.

## Current scope

The downstream pipeline runs on a CPU with synthetic samples and glyph compositing. Diffusion-based inpainting, real generated images, and generalization across fonts still require evaluation.
