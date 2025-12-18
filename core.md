# C.O.R.E
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
*   `core.ud.eoc()` - End of Call (after everything is rendered)
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
