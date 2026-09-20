# CORE.md — building with core.js

Drop this file into a site repo as the single reference an AI assistant needs to build with
**core.js**. It is self-contained: no links out, nothing to fetch.

Written against **core.js `20260909.0`**. Check `core.hit.version` in the console to confirm the
version a site is actually running.

---

## 1. What core.js is

A single-file, dependency-free, client-side rendering engine. No build step, no bundler, no
transpile, no virtual DOM. One `<script>` tag and it runs.

The model: you mark **pockets** in your HTML, define **templates**, and point them at data. core.js
fetches, caches, clones and hydrates on its own schedule.

## 2. Setup

```html
<script src="/core.js"></script>
```

**Self-host it.** core.js checks `document.currentScript.src`; when the script is same-origin it
rewrites its internal `baseUrl` to `window.location.origin`. A CDN copy leaves `baseUrl` pointing
at the CDN, which matters for `core.md.form()` and the internal object catalogue. A pinned CDN
include looks like `…/gh/Sitezip/core.sbs@20260909.0/core.js` and only resolves if that exact
version branch is published and the repo is publicly reachable.

**`core.init()` is called for you** on `DOMContentLoaded` (or immediately if the document is
already complete). Do not call it yourself — a second call re-runs setup.

**Inline templates must live inside `<section id="cr-data">`.** That element is the registry root.
If it is missing, core.js falls back to a detached node, and any `<template name="…">` you wrote in
the page is never registered.

```html
<section id="cr-data" style="display:none">
  <template name="hello">
    <h1 class="h-greeting-title"></h1>
  </template>
</section>
```

## 3. Minimal working page

```html
<!DOCTYPE html>
<html>
<body>
  <!-- 1. where the render lands -->
  <div id="main">
    <div class="core-pocket" data-core-templates="userList"></div>
  </div>

  <!-- 2. the template, inside the registry root -->
  <section id="cr-data" style="display:none">
    <template name="userList">
      <h2>Users</h2>
      <ul>
        <li class="core-clone" data-core-data="users" data-core-source="/api/users.json">
          {{aug:count}}. {{rec:name:upper}} — {{rec:email}}
        </li>
      </ul>
    </template>
  </section>

  <script src="/core.js"></script>
  <script>
    core.useDebugger = true;   // log each lifecycle stage
  </script>
</body>
</html>
```

`/api/users.json` must return an **array** of records. Each record renders one `<li>`.

## 4. The lifecycle

```
soc()  →  getTemplate → addTemplate → getData → addData  →  eoc()
```

- `getTemplate` fetches any template a pocket names but the registry lacks.
- `addTemplate` empties each pocket, hides it, injects the template.
- `getData` fetches data for each `.core-clone`.
- `addData` clones each `.core-clone` once per record and reveals the pocket.
- `eoc` runs `hydrateByClass()` then `formatByClass()`, then your `core.ud.eoc` hook.

Call `core.pk.soc()` to re-render after changing data. It is async.

**The one debugging fact that matters:** all four middle stages sit inside a *single* `try/catch`.
One thrown error silently skips every later stage — `eoc()` still runs, so you get a
half-rendered page and no visible error. Set `core.useDebugger = true` to surface it.

## 5. HTML contract

| Attribute | On | Meaning |
|---|---|---|
| `data-core-templates="a,b"` | `.core-pocket` | templates to inject, comma-separated |
| `data-core-data="ref"` | `.core-clone` | registry key holding the record array |
| `data-core-source="/url"` | either | where to fetch that ref from |
| `data-<name>-core-source="/url"` | `.core-pocket` | per-template source when a pocket lists several |
| `data-core-routing="false"` | `.core-pocket` | exclude this pocket from URL routing |
| `data-target="#id"` | link/button | where a click's pocket is inserted |
| `data-core="ref"` | link/button | template(s) to load on click |

Bare `core-templates` / `core-data` / `core-source` (no `data-` prefix) are accepted everywhere as
legacy aliases.

Classes: `core-pocket` (container), `core-clone` (row template), `core-pocketed` (a pocket that has
rendered — see locking below), `core-cloned-<ref>` (added to each rendered row).

## 6. Template syntax

Inside a `.core-clone`, `{{…}}` placeholders resolve **per record**:

```
{{rec:member}}                 field from the current record   (alias {{#:…}})
{{rec:a.b.c}}                  dot path into nested objects
{{rec:nickname|firstName}}     fallback chain — first non-empty wins
{{rec:balance:money:$}}        member : format : clue
{{rec:name:upper|nospace}}     piped formats
{{aug:index}}  {{aug:i}}       0-based record index              (alias {{!:…}})
{{aug:count}}  {{aug:c}}       1-based record number
{{aug:value}}  {{aug:v}}       delegates to your core.ud.cloneValue(record, args)
{{aug:string}} {{aug:s}}       delegates to your core.ud.cloneString(record, args)
```

### `{{data:…}}` does not work by default

This is the single biggest trap. `core.pk.injector` — the function that resolves
`{{data:ref:member}}` against the registry — **is never called by the lifecycle**. So:

- In a plain (non-clone) template, `{{data:…}}` renders **literally**, as raw text.
- Inside a clone, `{{data:…}}` renders **`Unrecognized type 'data'`**, because the cloner only
  handles `rec`/`#` and `aug`/`!`.

For template-level (non-repeating) binding, use the `h-` class directives in §7 — that is the path
that actually runs. If you want `{{data:…}}`, wire the injector in yourself:

```js
core.ud.getTemplate = (name, templateStr) => core.pk.injector(templateStr);
```

## 7. Class directives — how non-repeating binding actually works

Both passes run automatically in `eoc()`.

### Hydrate: `h-<registryKey>-<memberPath>`

```html
<span class="h-user-name"></span>              <!-- core.cr.getData('user').name -->
<span class="h-user-billing.address1"></span>  <!-- dot path for nesting -->
<input class="h-user-email">                   <!-- inputs get .value, not .innerHTML -->
```

- Exactly **three** hyphen-separated segments are parsed (`h`, key, member). Nest with **dots**,
  never extra hyphens — `h-user-first-name` silently loses `name`.
- `h-…` appends once then removes the class. `h--…` re-applies on every pass and keeps the class.
- `h--dataRef-<member>` with `data-h-data-ref="some-key"` lets the registry key itself contain
  hyphens.
- `h-coreRecord-<member>` inside a rendered row reads that row's own record.
- A falsy value writes nothing and leaves the class in place.

### Format: `f-<formatName>`

```html
<span class="f-money" data-f-clue="USD">12.5</span>       <!-- $12.50 -->
<span class="f-date" data-f-clue="M/D/YY">1721788872</span>
<span class="f-truncate" data-f-clue="40">long text…</span>
<span class="f-upper f-nospace">john doe</span>            <!-- chained -->
```

Formats the element's own `innerHTML` in place. Hyphens are stripped, so `f-pad-left` → `padleft`
and `f-upper-first` → `upperfirst`. `data-f-default` supplies a value when the content is empty,
`"null"` or `"undefined"`. `f--…` re-applies every pass.

## 8. Format names

Usable in `{{rec:x:FORMAT:clue}}`, `f-FORMAT` classes, and `core.sv.format(value, 'FORMAT.default.clue')`.

`alphaonly` `array` `boolean` `date` `datetime` `decimal` `encrypt` `float` `email` `lower`
`emaillink` `urllink` `imgsrc` `money` `encodeuricomponent` `encodeuri` `nospace` `nohtml`
`linkify` `null` `number` `numonly` `object` `padleft` `padright` `fax` `phone` `core_pk_attr`
`core_pk_cloner` `removehtml` `string` `tinyhash` `truncate` `wrap` `upper` `upperfirst`

Clue usage: `money` takes `USD` or `$`; `date`/`datetime` take a date format string; `truncate`
takes a length; `padleft`/`padright` take `count|padchar`; `wrap` takes `open|close`;
`emaillink`/`urllink`/`imgsrc` take extra HTML attributes; `core_pk_cloner` takes a template name.

**Sanitize untrusted content** with `nohtml` or `removehtml` before it reaches the DOM — core.js
injects via `innerHTML`/`insertAdjacentHTML` and does not escape for you.

## 9. Date formats — `core.hf.date(value, format, strict)`

Tokens: `YYYY` `YY` `MM` `M` `DD` `D` `HH` `H` `:MM` `:SS` `P` `hh` `h` `mm` `ss` `p`

Whole-format shortcuts: `DATE` (→ `M/D/YY`), `TIME` (→ `HH:MM`), `TS` (unix seconds), `PERF`
(`performance.now()`), `OBJ` (the token table itself).

Accepts a date string, a `Date`, or a unix timestamp in seconds. Non-strict mode uppercases the
format first, so lowercase tokens (`hh`, `mm`, `p`) need `strict = true`.

## 10. JavaScript API

```js
// Registry — synchronous, local
core.cr.setData(name, data, elem, storageId);
core.cr.getData(name, elem, storageId);
core.cr.delData(name, elem, storageId);
core.cr.setTemplate(name, htmlString);
core.cr.getTemplate(name);

// Backend — returns a promise, writes through to the registry
await core.be.getData(ref, url, settings);      // settings: {method, headers, data, isFormData, cache, redirect}
await core.be.getTemplate(ref, url, settings);
await core.be.awaitAll();                        // resolve when every in-flight request settles
core.be.cacheExpireDefault = 3600;               // seconds; default 86400
core.be.cacheExpire = { type:'data', name:'users', seconds:300 };

// Render
core.pk.soc();                                   // re-render (async)
core.ux.insertPocket(target, dataRefs, dataSources, autoFill);
core.ux.formatValue(value, formatList, clue);

// Helpers
core.hf.digData(obj, 'a.b.0.c');                 // deep read; 'a.list.[n]' joins an array
core.hf.digDataFallback(obj, 'nick|first');      // first non-empty
core.hf.date(value, format, strict);
core.hf.uuid(prefix, delim);
core.hf.sortObj(arr, key, type, 'ASC'|'DESC'|'TOGGLE');
core.hf.copy(text);
core.hf.ccNumAuth(num);                          // {isValid, type} — Luhn + brand
core.hf.parseJSON(str);                          // undefined instead of throwing
core.hf.setRoute(path); core.hf.getRoute(part); core.hf.parseRoute(url);

// Validation
core.sv.scrub([{ name:'email', value:'A@B.com', scrubs:['req','email'] }]);
core.sv.scrubSimple(name, value, ['alphaonly']);
core.sv.format(value, 'money.0.USD');

// Optional form module — dynamically imports `<baseUrl>/module/form.js` at call time.
// Only works if you also host that file alongside core.js.
core.md.form(funcName, args);
```

`insertPocket` builds a pocket and drops it into `target`, replacing that element's contents. If
`target` is `'silent'` or contains `'core_be_get'`, it fetches without rendering. `autoFill`
defaults to true and triggers `soc()`.

### Scrub rules

`req` `required` `num` `ccnum` `alpha` `alphaspace` `alphanum` `alphanumspace` `nospace`
`max:N` `maxlen:N` `min:N` `minlen:N` `set:N` `setlen:N` `disallow:x` `expect:x` `match:otherName`
`gte:N` `lte:N` `url` `email` `fail` `failclient`

Any other name falls through to `core.sv.format`, so `['lower','truncate:40']` both validates and
transforms. `scrub()` returns `{success, scrubs, errors}`; each scrub object gains `.success`,
`.errors[]` and `.delta` (the original value).

## 11. Storage tiers

Fourth argument to `cr.setData/getData/delData`:

| id | Where | Notes |
|---|---|---|
| 0 | property on the element | in-memory; invisible in View Source — use for sensitive state |
| 1 | `elem.dataset` (`data-*`) | **default**; visible in the DOM |
| 2 | `sessionStorage` | element ignored; forced for any key starting `coreInternal` |
| 3 | `localStorage` | element ignored; persists across sessions |

Tier 0 on a rendered row is how `{{rec:…}}` data stays reachable — each row keeps its own record,
readable via the `h-coreRecord-<member>` directive.

## 12. Hooks and settings

Assign hooks **individually**. Never write `core.ud = { … }` — that replaces the whole namespace
and wipes built-in defaults like `defaultDelta` and `alertMissingTemplate`, after which templates
start rendering `undefined`.

```js
core.ud.init       = () => {};                               // after core boots, before first render
core.ud.soc        = () => {};                               // each render, before fetching
core.ud.eoc        = () => {};                               // each render, after the DOM settles
core.ud.preflight  = (ref, src, type) => ({ headers:{…} });   // merged into request settings
core.ud.postflight = (ref, obj, type) => obj.results;         // reshape a response before storing
core.ud.prepaint   = (ref, obj, type) => {};
core.ud.postpaint  = (ref, obj, type) => {};                  // bind events to fresh DOM here
core.ud.getTemplate = (name, str) => str;                     // transform a template pre-injection
core.ud.formatValue = (value, list, clue) => value;
core.ud.cloneValue  = (record, args) => '';                   // backs {{aug:value}}
core.ud.cloneString = (record, args) => '';                   // backs {{aug:string}}

core.useDebugger = true;    // verbose lifecycle logging
core.useRouting  = true;    // URL ↔ DOM routing
core.ud.defaultDelta = '—'; // what renders when a value is empty
core.ud.defaultDateFormat = 'M/D/YY H:MM P';
core.ud.hydrationClassIgnoreList = 'h-100';   // assigning pushes onto the list
```

`postpaint` is where you attach event listeners — rendered rows are new DOM nodes, so listeners
bound earlier are gone. Prefer delegation on a stable ancestor.

## 13. Routing

With `core.useRouting = true`, URLs map to pocket state:

```
#/_main/home                    → pocket in #main loads template "home"
#/_main/users:%2Fapi%2Fusers    → …with that (encoded) data source
#/_main/home/_side/profile      → two pockets in one URL
```

Plain `<a href="#/_main/news">` links are intercepted automatically — no click handler needed.
`eoc()` rewrites the URL to match the rendered DOM using `replaceState`.

Locking: `core.useLocking` defaults on, so after rendering, `eoc()` renames `core-pocket` →
`core-pocketed`, and that pocket will not re-render on later passes. Turn it off if a pocket must
refresh on every `soc()`.

## 14. Gotchas

- **`core.baseUrl` is read-only.** It has a getter and no setter, so `core.baseUrl = '/x'` is a
  silent no-op. Control it by where you host the script instead.
- **`core.ud.defaultDeltaFormat = x` sets the *click target*,** not the delta format — the setter
  name is declared twice and the second one wins. `defaultClickTarget` has no working setter.
- **`core.cr.storageIdDefault` is write-only**; reading it returns `undefined`.
- **Rendered rows keep `class="core-clone"`** but lose `data-core-data`. That is intentional and
  handled internally — do not "fix" it by re-adding the attribute, and do not rely on
  `.core-clone` as a selector for *rendered* rows. Use `.core-cloned-<ref>`.
- **A `.core-clone` with no `data-core-data` is skipped** (and warned about under `useDebugger`).
- **`core.be.activePromises` is not exposed** — use `await core.be.awaitAll()`.
- **Data sources must return an array** for a clone. A bare object is not iterable, so the cloner
  throws — and because of the single catch in §4, that kills the entire render pass, not just the
  one row. Reshape in `core.ud.postflight` if your API wraps results in an envelope.
- Cache is time-based, default 86400s. A `getData` on a fresh, cached ref is skipped entirely.

## 15. Debugging

```js
core.useDebugger = true;      // stage-by-stage logging + "core.js completed in Nms"
core.hit;                     // {version, ts, uuid, baseUrl, useRouting, useLocking, YYYY}
core.be.fetchLogFIFO;         // last request settings per ref — check the resolved URL here
core.be.cacheCreateTs;        // when each ref was cached
core.cr.getData('yourRef');   // what actually landed in the registry
```

Checklist when nothing renders:

1. Is the pocket still `.core-pocket`, or already `.core-pocketed` (locked)?
2. Does the template name in `data-core-templates` match a `<template name>` inside `#cr-data`?
3. Did the fetch return an **array**? Check `core.cr.getData(ref)`.
4. Any error in the console from the lifecycle's single catch — half-rendered means a swallowed throw.
5. Seeing raw `{{data:…}}` on screen? That is §6 — use `h-` classes instead.
