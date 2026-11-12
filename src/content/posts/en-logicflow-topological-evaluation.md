---
contentId: "logicflow-topological-evaluation"
slug: "logicflow-topological-evaluation"
locale: "en"
title: "How LogicFlow Orders Logic Gate Evaluation"
summary: "Modeling a combinational circuit as a directed graph gives an evaluation order and exposes feedback loops."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["C++","Kahn","LogicFlow"]
category: "Algorithms"
links: [{"label":"Related project","url":"https://cwchang.me/en/projects/logicflow/"}]
---

## Turn wires into dependencies

If A feeds B, B must wait for A. Represent the gates as vertices and the wires as directed edges to make each dependency explicit.

## Start with gates that have no prerequisites

Kahn’s algorithm queues vertices with zero in-degree. Each time a vertex is processed, reduce the in-degree of its successors and enqueue any that reach zero.

## Check the result with a half adder

A and B feed both XOR and AND. When both inputs are 1, the sum should be 0 and the carry 1. If the queue empties before all vertices are processed, report a feedback cycle so the user can inspect the wiring.
