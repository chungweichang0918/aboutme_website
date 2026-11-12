---
contentId: "mqtt-command-signing"
slug: "mqtt-command-signing"
locale: "en"
title: "Signing MQTT device commands and blocking replays"
summary: "The irrigation node only executes commands with a valid HMAC signature, inside a 30-second window, that it has not seen before. Its replies are signed too, so the server knows they came from the node."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["MQTT", "HMAC", "ESP32"]
category: "Security"
links: [{"label": "Related project", "url": "https://cwchang.me/en/projects/edge-ai-smart-agriculture/"}]
---

## Why sign commands

The irrigation node receives commands such as "pump on" and "fan off" over MQTT. If publishing to the right topic were enough to control equipment, anyone with broker access could start the pump remotely. Even with an encrypted connection, the node still needs to know that a command really came from the authorized system, and that it was sent just now.

## Command format

Every command contains:

- `command_id`: a random 32-character hexadecimal ID
- `timestamp` and `expires_at`: when it was sent and when it expires
- `action`: ON, OFF, or RESET_FAULT on the safety topic
- `signature`: the signature

The signature is an HMAC-SHA256, computed with a shared key over the topic, ID, timestamp, expiry, and action. Including the topic stops a "fan on" command from being reused on the pump topic.

## Checks on receipt, in order

1. The message is at most 700 bytes and is valid JSON.
2. The node's clock has been synchronized; otherwise everything is rejected.
3. The timing is sensible: the timestamp is no more than 10 seconds in the future, the validity window is at most 30 seconds, and the command has not expired.
4. The ID format is correct and the action is on the allowed list.
5. The signature is recomputed and compared using a constant-time comparison, so response timing reveals nothing about the signature.
6. The ID has not been used before.

Only then is the command executed, and even then it still has to pass the firmware's safety interlocks.

## Remembering used commands

Replay protection relies on a 64-slot cache of recent command IDs and their expiry times, stored in the ESP32's non-volatile memory so it survives a reboot.

If the cache is full and nothing in it has expired, the node **rejects new commands** instead of evicting an old entry. Evicting would be more convenient, but it would give an attacker a chance to resend a command that is still within its validity window.

## Signed replies

After handling a command, the node reports whether it was accepted, the current state, and the reason, such as "applied" or "rejected by safety interlock". The reply carries a signature too, so the server can confirm the result came from the node and not from someone forging an "off" confirmation.

## Limits

The shared key must be flashed securely onto every node, and a leaked key means replacing all of them. The time checks depend on network time, so while the clock is unsynchronized the node rejects all commands rather than guess.
