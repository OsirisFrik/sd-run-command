# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StreamDeck plugin (`dev.frik.run-command`) that runs command-line commands in CMD or PowerShell when a Stream Deck button is pressed. Built on the official Elgato StreamDeck Node.js SDK.

## Commands

```bash
npm run build    # Bundle with Rollup (minified, production)
npm run watch    # Watch mode with sourcemaps + auto-restart plugin via `streamdeck restart`
```

The Elgato CLI (`streamdeck` command) is used for dev workflows. Install globally if needed: `npm install -g @elgato/cli`.

## Architecture

**Entry point:** [src/plugin.ts](src/plugin.ts) — initializes the StreamDeck connection and registers actions.

**Actions** live in [src/actions/](src/actions/). Each action:

- Extends `SingletonAction<TSettings>` from `@elgato/streamdeck`
- Responds to events via decorated methods: `onWillAppear`, `onKeyDown`, etc.
- Reads/writes settings with `action.getSettings()` / `action.setSettings()`
- Is registered in `plugin.ts` via `streamDeck.actions.registerAction(new MyAction())`

**Build output:** [dev.frik.run-command.sdPlugin/bin/plugin.js](dev.frik.run-command.sdPlugin/bin/plugin.js) — compiled single-file bundle (excluded from git).

**Plugin manifest:** [dev.frik.run-command.sdPlugin/manifest.json](dev.frik.run-command.sdPlugin/manifest.json) — defines plugin ID, SDK version (3), supported OS, Node.js version (20), and action UUIDs.

**Property Inspector UI:** [dev.frik.run-command.sdPlugin/ui/](dev.frik.run-command.sdPlugin/ui/) — HTML files for per-action settings panels shown in the StreamDeck app.

## Communication Flow

1. StreamDeck app spawns `node bin/plugin.js`
2. Plugin connects to StreamDeck via WebSocket (handled by `@elgato/streamdeck` internally)
3. Button events flow: StreamDeck app → WebSocket → SDK → action event handlers
4. Plugin sends back title/image updates and reads/writes per-instance settings via the SDK

## Debugging

VS Code launch config (`.vscode/launch.json`) attaches Node.js debugger to the running plugin process. Use `npm run watch` to keep the plugin running with sourcemaps.
