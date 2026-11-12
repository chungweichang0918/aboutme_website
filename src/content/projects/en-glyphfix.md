---
contentId: glyphfix
slug: glyphfix
locale: en
title: "GlyphFix: Traditional Chinese Glyph Repair"
summary: "A prototype for correcting Traditional Chinese text in images. It uses OCR to locate wrong characters, builds local masks, and re-scores whether the text and background have improved."
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
tags:
  - "Python"
  - "OCR"
  - "Image processing"
cover: "/media/og/en-projects-glyphfix.jpg"
coverAlt: "Title card for “GlyphFix: Traditional Chinese Glyph Repair”"
---

## Repair pipeline

OCR first finds regions that do not match the expected text. A mask is chosen according to the error type, and the selected region is then repaired. Re-scoring checks both text accuracy and how well the background is preserved.

## Validation status

Recognition, classification, masking, glyph replacement, and re-scoring currently run end to end on CPU. The test inputs are synthetic samples with programmatically injected errors. Diffusion-model generation and local inpainting are planned for later validation.
