---
contentId: "save-file-event-replay"
slug: "save-file-event-replay"
locale: "en"
title: "Why the save file never stores \"case solved\""
summary: "The mystery game's save file keeps only whitelisted player actions and replays them through the game rules on load. It never trusts clue, unlock, or victory flags written in the file."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["Python", "Gradio", "Save files"]
category: "Software Engineering"
links: [{"label": "Related project", "url": "https://cwchang.me/en/projects/rain-mansion/"}]
---

## The problem: players can edit save files

*Rainy Night Manor* lets players download a save file and continue on another computer. The file is JSON, so anyone can open and edit it. If it stored `finished: true` or "all eight clues found", changing one field would skip the whole investigation.

So the save file records what the player did, not what the result was.

## Only whitelisted events are saved

A save contains seven kinds of events: interviews, location searches, presenting evidence, linking testimony to evidence, submitting the final accusation, hint requests, and post-game feedback. Each event keeps a fixed set of fields. A search stores only the location; presenting evidence stores only the character and the evidence ID. The rest of the game state, such as found clues and unlocked testimony, is never written to the file.

## Replaying the rules on load

On load, the program starts a fresh game and passes each event, in order, to the same functions used during normal play. A search event calls `search()`; presenting evidence calls `present()`. Whether a clue was found, whether testimony unlocked, and whether the case can be closed are all recalculated by the rules.

Each replayed step must actually change the state. If an event could not have happened at that point, such as presenting evidence before finding it, the whole file is rejected. Flags claimed by the file are never used.

## Guarding the file itself

- At most 3 MB, 2,000 events, and 16,000 characters per string.
- The case ID, format version, and game version must match.
- Characters, locations, and options must be on the allowed lists.
- Scripted dialogue is not read from the file. It is regenerated when `present()` replays, so forged "official" lines cannot slip into the record.

If any check fails, loading stops and **the current progress is kept**. A corrupted file never overwrites an investigation in progress.

## Trade-offs

Saves get longer, and loading replays the rules once. This game has few events, so replay is fast. In return, saves can be shared freely but cannot be used to cheat. The same idea fits any system whose state can be derived from actions: an action log is easier to verify than a stored result.
