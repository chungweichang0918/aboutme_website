---
contentId: md2odf
slug: md2odf
locale: en
title: "md2odf Markdown to OpenDocument Converter"
summary: "Converts Markdown into editable .odt documents while keeping common structures such as headings, lists, tables, and code."
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
github: https://github.com/chungweichang0918/md2odf
tags:
  - "Python"
  - "Markdown"
  - "ODF"
cover: "/media/og/en-projects-md2odf.jpg"
coverAlt: "Title card for “md2odf Markdown to OpenDocument Converter”"
---

## Conversion pipeline

A Python CLI reads Markdown, parses heading levels, text styles, nested lists, tables, block quotes, and links, and then builds the corresponding ODF document elements.

## Layout design

Code blocks use a monospaced font, and table headers and body text get their own styles. The output opens in any ODF-capable office suite for further editing.
