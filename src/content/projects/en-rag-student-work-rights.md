---
contentId: rag-student-work-rights
slug: rag-student-work-rights
locale: en
title: "RAG Tutorial on Student Part-Time Work Rights"
summary: "Builds a retrieval dataset from cited, instructional Traditional Chinese summaries to practice making a Q&A model answer from retrieved passages and show its sources."
date: "2026-11-12"
category: AI / Machine Learning
status: completed
draft: false
visibility: public
tags:
  - "RAG"
  - "Embeddings"
  - "Jupyter"
---

## Data preparation

Common topics are organized as summaries rewritten for teaching. Each record includes a title, a source URL, and test questions, so retrieved results can be traced back to where the information came from.

## Exercise design

The notebook covers document chunking, embedding, and retrieval. The question set includes questions outside the knowledge base to see whether the model can say when the data is insufficient. This is a teaching exercise for a Q&A pipeline.
