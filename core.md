# core.js
*Create Once, Render Everywhere*

A lightweight, dependency-free JavaScript library for building dynamic, data-driven web interfaces using simple HTML attributes. Now modernized with async/await and cleaner syntax.

```html
<!-- option A: production version via CDN -->
<script src="https://cdn.jsdelivr.net/gh/Sitezip/core.sbs/core.js"></script>
<!-- option B: historical version via CDN (advised) -->
<script src="https://cdn.jsdelivr.net/gh/Sitezip/core.sbs@20251212.0/core.js"></script>
<!-- option C: production -->
<script src="https://core.sbs/core.js"></script>
```

## Quick Start

### 1. Define a Template
Create a `<template>` inside a hidden section (default id `cr-data`).

```html
<section id="cr-data" style="display:none;">
    <template name="users">
        <div class="user-card">
            <h3>{{rec:name}}</h3>
            <p>{{rec:email}}</p>
        </div>
    </template>
</section>
```

### 2. Create a Pocket
Place a "pocket" where you want the content to appear.

```html
<div class="core-pocket" 
     data-core-templates="users" 
     data-core-source-users="https://api.example.com/users">
</div>
```

## Attributes

| Attribute | Description |
| :--- | :--- |
| `data-core-templates` | Comma-separated list of template names to load. |
| `data-core-source` | Default data source URL for the element. |
| `data-core-data` | Reference name for the data object. |
| `data-core-source-[name]` | Specific data source for a named template. |

## Data Referencing

Syntax: `{{type:object-member:format-ref:clue}}`

### Basic Examples
```javascript
{{rec:firstName}}           // Output: John
{{rec:balance:money:$}}     // Output: $1,234.56
{{rec:status:upper}}        // Output: ACTIVE
```

### Deep Cloning (Recursive)
```javascript
{{rec:items:core_pk_cloner:itemTemplate}} 
```

### HTML Attributes
Inject data directly into HTML attributes.
```html
<img {{rec:avatarUrl:core_pk_attr:src}} alt="User Avatar">
```

## Custom Functions (Hooks)

Hook into the lifecycle to customize behavior.

*   `core.ud.soc()` - Start of Call (before anything happens)
*   `core.ud.pk_eol()` - End of Call (after everything is rendered)
*   `core.ud.preflight(dataRef, dataSrc, type)` - Modify fetch settings before request.
*   `core.ud.postflight(dataRef, dataObj, type)` - Process data after fetch.
*   `core.ud.prepaint(dataRef, dataObj, type)` - Before rendering a template/clone.
*   `core.ud.postpaint(dataRef, dataObj, type)` - After rendering.

## Silent Calls (Anchors)

Trigger data fetching or template loading without immediate rendering using anchor tags.

```html
<a href="#" target="core_be_getData" 
   data-core-data="myNewData" 
   data-core-source="https://api.example.com/data">
   Load Data Silently
</a>
```

## Async/Await Architecture

The core engine now uses modern `async/await` patterns for reliable execution order.
1.  **Fetch**: All data and templates are fetched in parallel.
2.  **Render**: Templates are rendered once all dependencies are resolved.
3.  **Hydrate**: Static content is hydrated.
4.  **Format**: Final formatting is applied.

## Modern Routing (Pretty Paths)

`core.js` now supports human-readable, SEO-friendly URLs that map directly to your DOM structure. This allows for SPA-like navigation with back/forward button support and clean sharing of deep-linked states.

### 1. Enable Routing
Routing is opt-in to ensure backward compatibility. Enable it in your initialization hook:

```javascript
core.ud.init = () => {
    core.useRouting = true;
}
```

### 2. The URL Format
The "Pretty Path" format uses underscores to identify DOM targets and segments to identify templates.

*   **Format**: `/_target/template1/template2`
*   **Example**: `/_main/home` maps to `#main` in the DOM and loads the `home` template.
*   **Multiple Targets**: `/_main/home/_sidebar/news` updates both `#main` and `#sidebar`.

### 3. Hash-based vs. Path-based
To prevent 404 errors on static servers (like GitHub Pages or `npx serve`), `core.js` defaults to **Hash-based Pretty Paths**.

*   **Recommended**: `https://example.com/#/_main/docs`
*   **Clean Path**: `https://example.com/_main/docs` (Requires server-side redirect to `index.html`)

### 4. Link Interception
Standard `<a>` tags are automatically intercepted if they contain a Pretty Path. This prevents page reloads and provides instant view swaps.

```html
<!-- SPA-style navigation -->
<a href="#/_main/philosophy">About Us</a>
<a href="#/_main/news">Latest News</a>
```

### 5. Advanced: Custom Data Sources
You can embed custom data source URLs directly in the path using the colon syntax.

*   **Syntax**: `/_target/template:encodedUrl`
*   **Example**: `/_main/profile:https%3A%2F%2Fapi.com%2Fuser%2F123`

### 6. Excluding Elements
If you have a pocket that should not be reflected in the URL (like a logo or a global notification bar), use the `data-core-routing` attribute.

```html
<div class="core-pocket" 
     data-core-templates="logo" 
     data-core-routing="false">
</div>
```

### 7. Backward Compatibility
The routing engine is "dual-stack." It first checks for the legacy JSON hash format (`#{"t":"#main"...}`). If not found, it falls back to the new Pretty Path format. This ensures that old links and CDN deployments never break.
