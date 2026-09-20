# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`core.js` is a single-file, dependency-free, client-side rendering engine — no build step, no
bundler, no transpile. The file you edit is the file the browser runs. Everything else in the repo
(CLI tools, VS Code extension, docs site) exists to support it.

Existing docs, in order of usefulness — read rather than re-derive:

- **[agent.md](agent.md)** — the full API reference written for LLM agents. Use it as the API
  surface; do not duplicate it here.
- **[README.md](README.md)** — subsystem overview and quick start.
- **[core.md](core.md)** — routing / "Pretty Path" specification.

## Commands

There is **no build, no lint, and no test runner** for `core.js` itself. There are no test files in
the repo.

```bash
# Dev server with hot reload (serves cwd). Requires: npm i -g @core.sbs/create-core-app
core-dev                    # http://localhost:3000 (auto-increments if the port is taken)
core-dev --port=8080
core-dev --sourcemap        # also runs tools/sourcemaps.js
core-dev --help

create-core-app my-app      # scaffold a new project
core-gen <component>        # emit a prebuilt component; see cli/core-gen/components/ (~20)
```

The three CLI packages live in `cli/` (`core-dev`, `core-gen`, `create-core-app`) and are published
separately — each has its own `package.json` and `bin/`. `core-dev` needs `npm install` in its own
directory (deps: `chokidar`, `ws`).

The VS Code extension in `vscode-extension/` is released by
`.github/workflows/extension-release.yml`, which fires **only** on pushes to `main` touching
`vscode-extension/**`. Edits to `core.js` never trigger CI.

### Verifying a change

With no test runner, the real verification is loading the library in a browser: serve the repo
root over HTTP, load a page that exercises the lifecycle, and check both the rendered DOM and the
console. `core.useDebugger = true` makes the lifecycle log each stage and print
`core.js completed in Nms` from `eoc()`.

Headless Chrome with `--dump-dom` executes the page's JS and prints the resulting DOM, which is
enough to assert on render output without any test framework.

## Architecture

`core.js` is one IIFE assigned to a global `const core`, returning an object of namespaces. Each
namespace is its own IIFE closing over private state — the only way to reach that state is through
the getters/setters on the returned object.

| Namespace | Role |
|---|---|
| `core.be` | fetch + TTL cache + in-flight promise tracking |
| `core.cr` | registry: data and `<template>` storage |
| `core.pk` | the render lifecycle |
| `core.hf` | helpers: dates, `digData`, routing, class-directive hydration |
| `core.sv` | validation (`scrub`) and formatting (`format`) |
| `core.ux` | `formatValue`, `insertPocket` |
| `core.cb` / `core.ud` | internal callbacks / user-defined hooks |

### The lifecycle

`pk.soc()` → `getTemplate` → `addTemplate` → `getData` → `addData` → `pk.eoc()`.

**All four middle stages sit inside a single `try/catch` in `soc()`.** One throw anywhere silently
skips every later stage — `eoc()` still runs, so the page looks half-rendered with no error unless
`useDebugger` is on. When rendering "just stops," suspect a swallowed throw here first.

### Pockets and clones

- `.core-pocket` — a container. `addTemplate` empties it, sets `display:none`, injects the named
  template, and reveals it only if it contains no `.core-clone`.
- `.core-clone` — a row template. `addData` clones it once per record, resolves `{{rec:…}}` /
  `{{aug:…}}` via `pk.cloner`, and reveals the pocket.
- With `useLocking` (default on), `eoc()` renames `core-pocket` → `core-pocketed` so a pocket
  renders once.

**The non-obvious part:** cloned output *keeps* `class="core-clone"` while `addData` strips its
`data-core-data`. So every later pass rescans the engine's own output as attribute-less clones.
That is why `getData` and `addData` both skip clones with no `dataRef`, and why `addData` tracks a
`rendered` Set and removes **only** the clones it actually rendered from — removing everything it
scanned would delete the rendered rows on each re-render.

### Registry storage tiers

`cr.setData/getData/delData(name, …, storageId)`:

| id | Where | Notes |
|---|---|---|
| 0 | `elem._CORE_Data` expando | in-memory, not in View Source |
| 1 | `elem.dataset` (`data-*`) | **default**; visible in the DOM |
| 2 | `sessionStorage` | `elem` ignored; forced for any name starting `coreInternal` |
| 3 | `localStorage` | `elem` ignored; **not documented in README** |

### baseUrl

`baseUrl` defaults to `https://cdn.jsdelivr.net/gh/Sitezip/core.sbs@<core_version>`, but if
`document.currentScript.src` is same-origin it is rewritten to `window.location.origin`. So a
locally served copy never touches the CDN. The CDN form only resolves if a branch named exactly
`core_version` exists and the repo is reachable.

## Release convention

`core_version` (line 1 of `core.js`) is **coupled to a git branch name** through `baseUrl`. A
release means all of:

1. Bump `core_version` — format `YYYYMMDD` or `YYYYMMDD.N` (e.g. `20260909.0`).
2. Copy the file to `v/<core_version>.core.js` (the archive is byte-identical to `core.js`).
3. Cut a branch named exactly `<core_version>` from `main`. Release branches are just named points
   on `main`, not divergent lines.
4. Add a `CHANGELOG.md` section with a compare link.

A mismatch between `core_version` and the branch name silently breaks the default CDN URL for every
consumer.

`coremoji.js` is a 1:1 emoji-keyed port of `core.js` (same behaviour, emoji property keys, with
`coremoji.html` as its demo). Changes to `core.js` should be mirrored there. **It currently lags:**
`core.js` is at `20260909.0` while `coremoji.js` is at `20260908`.

## Known traps in the public API

These are real and the docs contradict some of them — verify against the source before trusting a
doc example.

- **`core.baseUrl` has a getter but no setter.** `core.baseUrl = '/modules'` is a silent no-op,
  despite appearing in README's "Global Settings" and in an "Example Configuration".
- **Never assign `core.ud` wholesale.** `agent.md` shows `core.ud = { soc, eoc, … }`; that replaces
  the namespace object and destroys every default getter (`defaultDelta`, `alertMissingTemplate`,
  …), so templates start rendering `undefined`. Assign hooks individually:
  `core.ud.soc = () => {…}`.
- **`set defaultDeltaFormat` is declared twice** in `core.ud`; the second one wins and assigns
  `defaultClickTarget`. So `core.ud.defaultDeltaFormat = x` sets the click target, and
  `defaultClickTarget` has no working setter.
- **`core.pk.injector` is never called** — not by the lifecycle, not anywhere in the repo. Plain
  (non-clone) templates therefore do **not** resolve `{{data:…}}`; the placeholder renders
  literally. Inside a clone, `{{data:…}}` renders `Unrecognized type 'data'`, since `cloner` only
  handles `rec`/`#` and `aug`/`!`. Working template-level binding uses the `h-` class directives
  (`hydrateByClass`). To get `{{data:…}}` in a plain template, call `core.pk.injector` yourself from
  the `core.ud.getTemplate(name, templateStr)` hook.
- **`core.be.activePromises` is not exposed.** The branch in `cr.getData` that waits on it is
  unreachable dead code.
- **`core.cr.storageIdDefault` is set-only**; reading it returns `undefined`.

## Conventions

- Match the surrounding style: 4-space indent, `//` comments, JSDoc blocks on public lifecycle
  methods. `core.js` is loaded as a **classic script**, not a module — it declares a global
  `const core` and has no `import`/`export` at top level. The one exception is `md.form()`, which
  uses a dynamic `import(baseUrl + '/module/form.js')`; that is the only module boundary, and it
  depends on `baseUrl` being correct at call time.
- Class-directive prefixes are part of the public contract and must not be renamed:
  `h-` / `h--` (hydrate), `f-` / `f--` (format), `core-pocket`, `core-clone`, `core-cloned-*`.
  A `--` prefix means "re-apply on every pass"; a single `-` means "apply once, then strip the
  class".
- Template/data wiring is driven entirely by attributes — `data-core-templates`, `data-core-data`,
  `data-core-source`, `data-<name>-core-source` — with bare `core-*` variants accepted for
  backward compatibility. Keep both paths when touching attribute lookup.
