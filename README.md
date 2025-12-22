# ⚡ C.O.R.E.js
> **Create Once, Render Everywhere.** The ultra-lightweight, zero-dependency engine for the modern web.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Size](https://img.shields.io/badge/size-minimal-brightgreen.svg)]()
[![Status](https://img.shields.io/badge/status-production--ready-orange.svg)]()

C.O.R.E.js is the elite alternative for developers who are tired of the React/Vue overhead. No build steps, no complex state management, no massive node_modules. Just high-performance, attribute-driven dynamic rendering directly in the browser.

---

## 🚀 Why C.O.R.E.?

- **Zero Build Step**: No Webpack, no Vite, no Transpilers. Just drop the script and go.
- **Ultra Lightweight**: A fraction of the size of common frameworks.
- **Pure JavaScript**: Built on modern native APIs for maximum speed.
- **Attribute-Driven**: Logic lives where it belongs—in your HTML.
- **Smart Caching**: Built-in intelligent data and template caching.
- **Recursive Power**: High-performance cloning with deep-nesting support.

---

## 📦 Installation

Grab the power of C.O.R.E. directly from our CDN:

```html
<!-- The Latest Production Power -->
<script src="https://cdn.jsdelivr.net/gh/Sitezip/core.sbs/core.js"></script>
```

---

## 🔥 The "Prop-Like" Syntax

C.O.R.E. 2.0 introduces a cleaner, "prop-like" syntax that React developers love. It's clean, intuitive, and deadly efficient.

```html
<!-- Defined Pockets -->
<div class="core-pocket" 
     core-templates="user-profile" 
     core-source-user-profile="/api/user/123">
</div>

<!-- Dynamic Clones -->
<ul class="core-clone" 
    core-data="products" 
    core-source="https://api.example.com/products">
    <li>{{rec:title}} - {{rec:price:money:$}}</li>
</ul>
```

---

## ⚡ Quick Start in 60 Seconds

### 1. Define Your Data Template
Templates are standard HTML `<template>` tags inside a hidden section.

```html
<section id="cr-data" style="display:none;">
    <template name="hero">
        <div class="hero-card">
            <h1>Welcome, {{rec:name}}!</h1>
            <p>Status: <span class="f-upper">{{rec:status}}</span></p>
        </div>
    </template>
</section>
```

### 2. Launch the Engine
C.O.R.E. automatically detects pockets and clones, fetches the data, and renders the result.

```html
<div class="core-pocket" core-templates="hero" core-source-hero="/api/me"></div>
```

---

## 🛠️ Data Binding & Formatting

C.O.R.E. provides a rich set of built-in formatters and data tokens:

| Token | Description | Example |
| :--- | :--- | :--- |
| `{{rec:field}}` | Record Field | `{{rec:firstName}}` |
| `{{data:ref:field}}` | Global Data Ref | `{{data:settings:theme}}` |
| `{{aug:index}}` | Loop Index | `{{aug:index}}` |
| `{{rec:price:money:$}}` | Currency Format | `$1,234.56` |
| `{{rec:name:upper}}` | Uppercase | `JOHN DOE` |

---

## 🔗 Lifecycle Hooks (The Pro Way)

Hook into the lifecycle to build advanced application logic:

- `core.ud.soc()` - **Start of Call**: Before the engine fires up.
- `core.ud.preflight()` - **Network Control**: Intercept and modify requests.
- `core.ud.postpaint()` - **Dom Ready**: Run logic after elements are rendered.
- `core.ud.eoc()` - **End of Call**: Final cleanup and state sync.

---

## 🌐 Modern API Support

C.O.R.E. 2.0 is powered by **Async/Await**, ensuring a deterministic rendering flow without the old-school callback hell.

---

## 🛡️ Contributing

We are building the future of lightweight web engines. Join us!

1. Fork it.
2. Build something epic.
3. Submit a PR.

*C.O.R.E.js: Stop building apps, start rendering experiences.*
