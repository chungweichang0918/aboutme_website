---
contentId: logicflow
slug: logicflow
locale: en
title: "LogicFlow Digital Logic Circuit Simulator"
summary: "A C++ console tool for building and simulating digital logic circuits, with gate wiring, topological sorting, and circuit file save and load."
date: "2026-11-12"
category: Software Engineering
status: completed
draft: false
visibility: public
featured: true
github: https://github.com/chungweichang0918/LogicFlow
tags:
  - "C++"
  - "Topological sort"
  - "Digital logic"
---

## Workflow

Users create logic gates, connect signals, designate outputs, and then feed input signals to test the circuit. Circuits can be saved as plain-text .cir files to load and edit later.

## Simulation design

Kahn's topological sort determines the order in which gates are evaluated. If a feedback loop prevents the sort from completing, the problem is reported. Six gate types are supported (AND, OR, NOT, NAND, XOR, and XNOR), making it suitable for verifying combinational logic.
