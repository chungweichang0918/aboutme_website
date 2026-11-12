---
contentId: edge-ai-smart-agriculture
slug: edge-ai-smart-agriculture
locale: en
title: "Multi-Zone Edge AI Agriculture System"
summary: "A solo project integrating ESP32-S3, Raspberry Pi, FastAPI, Vue, and local AI so that managers can check per-zone sensor data, track anomalies, and approve equipment operations."
date: "2026-11-12"
category: IoT
status: in-progress
draft: false
visibility: public
featured: true
tags:
  - "ESP32-S3"
  - "Raspberry Pi"
  - "MQTT"
  - "FastAPI"
  - "Vue"
  - "RAG"
cover: "/media/covers/edge-ai-smart-agriculture.webp"
coverAlt: "Interface layout of the sensor node circuit board, marking the power, sensor, and communication connectors."
---

## Background

Multi-zone farm monitoring raises three practical problems. When a sensor stops updating, users need to know when the number on screen was actually measured. Normal trends can differ between zones, so a single set of thresholds rarely explains every change. Equipment such as water pumps affects the field directly, so start conditions, authorization, and shutdown all need explicit design.

I brought sensing, data interpretation, and equipment operation into a single management workflow. Managers can check the data first and then decide whether to accept the system's suggestions.

## My contribution

I designed, built, and integrated the system on my own, covering ESP32-S3 sensing and control, the Raspberry Pi gateway, the FastAPI backend, the Vue management workspace, and local AI explanations.

Data resent after a disconnection keeps its original measurement time, so managers can tell whether a value on screen is still valid. The pump-stop condition for irrigation is evaluated on site by the ESP32. I validated these flows with per-zone sensor readings and irrigation operation logs.

## From field nodes to the management workspace

| Component | Role |
| --- | --- |
| ESP32-S3 sensor nodes | Collect air, light, and soil measurements. Zones with control capability can drive equipment such as water pumps. |
| Raspberry Pi gateway | Collects node data over MQTT. Buffers data while offline and resends it after reconnecting, keeping the original measurement time. |
| FastAPI and statistical analysis | Serves data queries and control authorization. EWMA and CUSUM help observe statistical drift against per-zone, per-sensor baselines. |
| Vue management workspace | Shows per-zone readings, data sources, measurement times, staleness, and historical trends, and lets authorized users review equipment operations. |
| Local AI on a Mac | Provides cited explanations through RAG, plus an image recognition workflow. Equipment commands go through a separate authorization flow. |

![Six-layer system architecture diagram](/media/projects/edge-ai-system-architecture.webp)

*Six-layer architecture: sensing, transport, edge computing, services, application, and LLM-assisted decision support.*

## Data interpretation and equipment control

The management interface labels each value's data source and measurement time. When data is stale, the screen keeps a staleness notice so that field data, historical readings, and simulated data can each be checked on their own terms.

Equipment operations are first approved by an authorized person and then executed by the field node. The pump-stop condition is evaluated on the ESP32, which can stop the pump locally once the configured condition is met. AI explanations are used to organize information and explain the reasoning behind it.

![Concept diagram of a control cabinet shared by zones A and B, showing the shared power board, per-zone control boards, and each zone's equipment](/media/edge-ai-agriculture-control-cabinet.png)

*Concept diagram of a control cabinet shared by zones A and B, showing the layout of the shared power board, per-zone control boards, and each zone's equipment.*

## Scope of validation

The demonstration materials record per-zone sensing and two irrigation flows. For zone A, an on-site serial log shows the node stopping the pump once the condition was met. For zone B, there is an operation log covering the full sequence from suggestion and manual approval to pump start and stop. These records confirm the specified flows; long-term stability, cross-season performance, and agricultural benefit still need separate validation.

Field logs, synthetic scenarios, and held-out image tests are evaluated separately, and each type of result has its own data source and scope.
