---
contentId: "pump-fail-safe-interlock"
slug: "pump-fail-safe-interlock"
locale: "en"
title: "Fail-safe pump control: when anything goes wrong, switch off"
summary: "The ESP32 irrigation node's firmware treats \"off\" as an action that is always allowed. Stale data, stalled tasks, or long run times all stop the equipment, and faults need a manual reset."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["ESP32", "FreeRTOS", "Safety design"]
category: "IoT"
links: [{"label": "Related project", "url": "https://cwchang.me/en/projects/edge-ai-smart-agriculture/"}]
---

## First decide where equipment stops when things fail

For equipment that acts on the field, the most important design question is not how it turns on but what state it ends up in when something breaks. My irrigation node uses "off" as the safe state. A pump that stops early only delays watering; a pump that fails to stop can flood the field or run dry and burn out.

So the firmware follows one rule: **turning on passes several checks, turning off is always allowed.**

## Nothing blocks "off"

Relays have a debounce rule that blocks switching again within 30 seconds, to avoid rapid cycling. That rule only applies to turning back on. Off commands and safety shutdowns write the physical pin directly, skip the debounce, and do not wait for a successful sensor reading.

## What triggers an automatic shutdown

A separate safety task on the ESP32 checks every 100 milliseconds:

- **Stale soil data**: the Modbus soil sensor is read every 15 seconds. After 45 seconds (three cycles) without valid data, a fault is latched and all outputs turn off.
- **Stalled tasks**: the control and network tasks on the two cores must report that they are alive. After 35 seconds without a report, everything stops.
- **Running too long**: the pump may run for at most 5 minutes in a row, the fan 10 minutes, and the grow light 1 hour. This check lives in the safety task and does not depend on the next sensor read succeeding.

Two optional protections are off by default: stopping the pump if no flow is detected after it starts, and sending a heartbeat signal to an external hardware watchdog.

## Faults need a manual reset

A fault is latched and the system becomes disarmed, rejecting every on command. Recovery requires a reset command, and before resetting the firmware checks again that all tasks are alive and the soil data is fresh. After a successful reset the outputs stay off until a new command arrives.

Startup works the same way: the system holds everything off for at least 3 seconds and only allows outputs after its checks pass.

## Validation

An on-site serial log from zone A shows the node stopping the pump by itself once the configured condition was met. That confirms the stop decision is made locally, without relying on the network or the server. Long-term stability and the full range of failure scenarios still need longer testing.
