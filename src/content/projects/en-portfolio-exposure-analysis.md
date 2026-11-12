---
contentId: portfolio-exposure-analysis
slug: portfolio-exposure-analysis
locale: en
title: "AI Portfolio Health Check"
summary: "Calculates underlying holdings, sector exposure, and overlap from an entered mix of stocks and ETFs, then explains the data in a summary with cited sources."
date: "2026-11-12"
category: AI / Machine Learning
status: in-progress
draft: false
visibility: public
tags:
  - "Python"
  - "RAG"
  - "Ollama"
cover: "/media/og/en-projects-portfolio-exposure-analysis.jpg"
coverAlt: "Title card for “AI Portfolio Health Check”"
---

## Calculation

Python expands ETF allocations into their underlying holdings and calculates exposure, concentration, and overlap between holdings. Every figure can be traced back to the original allocation and constituent data.

## Summary and verification

RAG retrieves related news, and a local model writes a summary with cited sources. The pipeline flags sources or figures that cannot be matched, so readers can go back to the original data.
