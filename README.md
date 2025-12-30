# core.sbs (Component Oriented Rendering Engine)

core.sbs is a lightweight, client-side rendering and state management library designed to facilitate the decoupling of data, templates, and DOM logic. It leverages modern asynchronous patterns to provide a seamless "pocket-based" component architecture without the overhead of a virtual DOM.

## Technical Overview

The engine operates on a lifecycle-driven approach, identifying specific "pockets" in the DOM and populating them with hydrated templates. It provides a robust suite of utility functions for data validation, formatting, and backend synchronization.

### Key Architectural Pillars

1.  **Pockets (`core-pocket`):** Container elements defined in HTML that act as dynamic insertion points for components.
2.  **Clones (`core-clone`):** Template structures that are duplicated and populated for each record in a dataset.
3.  **Registry (`core.cr`):** A centralized storage mechanism for retrieved data and templates, supporting multiple persistence levels (Local DOM, Data Attributes, or Session Storage).
4.  **Async Lifecycle:** A linear, promise-based flow (`soc` -> `getTemplate` -> `getData` -> `eoc`) that ensures data integrity and UI consistency.

---

## Subsystem Documentation

### 1. Backend (`core.be`)
Handles all external I/O using the Fetch API. It includes a built-in promise tracking mechanism to prevent race conditions during initialization.
*   `getData(dataRef, dataSrc, settings)`: Retrieves JSON data and commits it to the registry.
*   `getTemplate(dataRef, dataSrc, settings)`: Retrieves HTML string templates.
*   `awaitAll()`: Global synchronization method that resolves only when all active backend requests are settled.
*   **Caching:** Implements a time-to-live (TTL) based cache for both data and templates.

### 2. Registry (`core.cr`)
Manages the internal state of the application.
*   **Storage Tiers:**
    *   `0`: Memory-only (stored as properties on DOM elements).
    *   `1`: DOM-persistent (stored in `data-*` attributes).
    *   `2`: Session-persistent (stored in `sessionStorage`).
*   `setData(name, data, elem, storageId)`: Serializes and stores data.
*   `getTemplate(name)`: Retrieves and hydrates a template string using the internal `injector`.

### 3. Pocket Lifecycle (`core.pk`)
The core engine responsible for DOM manipulation.
*   `soc()` (Start of Call): The entry point for rendering. It awaits all pending backend requests before scanning the DOM for new pockets.
*   `getTemplate()`: Batches requests for missing templates required by active pockets.
*   `addTemplate()`: Injects static templates into identified pockets.
*   `getData()`: Batches requests for data required by `core-clone` elements.
*   `addData()`: Performs the actual cloning and hydration of record-specific DOM elements.
*   `eoc()` (End of Call): Performs final DOM clean-up, runs hydration/formatting passes, and updates routing state.

#### Template Directives
*   **Double Curly Syntax:** `{{type:source:reference:format}}`
    *   `data`: Global registry lookup.
    *   `rec`: Current record lookup (used within clones).
    *   `aug`: Augmented metadata (e.g., `{{aug:index}}`, `{{aug:count}}`).

### 4. Validation & Scrubbing (`core.sv`)
A comprehensive validation engine for data sanitization.
*   `scrub(scrubArr)`: Validates an array of input objects against a set of rules (`req`, `email`, `url`, `min`, `max`, etc.).
*   `format(value, formatStr)`: A powerful transformation utility for dates, currency (USD), case conversion, and HTML sanitization.

### 5. Helper Functions (`core.hf`)
Utility methods for common operations:
*   `digData(object, path)`: Deep-seek values in nested JSON objects using dot notation.
*   `date(dateStr, format)`: Robust date formatting supporting Unix timestamps and custom tokens.
*   `hydrateByClass()` / `formatByClass()`: Mass-hydration of static DOM elements based on CSS class directives (e.g., `h-user-name`, `f-money`).

---

## Configuration & Hooks (`core.ud`)

Developers can extend the engine's behavior by defining hooks in the `core.ud` (User Defined) namespace:

| Hook | Description |
| :--- | :--- |
| `soc()` | Executed before the rendering lifecycle begins. |
| `eoc()` | Executed after the rendering lifecycle and DOM updates are complete. |
| `preflight()` | Intercepts backend requests before they are dispatched. |
| `postflight()` | processes backend responses before they are committed to the registry. |
| `prepaint()` | Executed before a specific template or data block is injected. |
| `postpaint()` | Executed after injection and cloner execution. |

### Global Settings
*   `core.useDebugger`: Enables verbose console logging.
*   `core.useRouting`: Enables URL hash-based state persistence.
*   `core.baseUrl`: Defines the root path for dynamic module imports.

---

## Usage Example

### Defined Pocket
```html
<div class="core-pocket" 
     data-core-templates="userprofile" 
     data-userprofile-core-source="/api/user/123">
</div>
```

### Template definition
```html
<template name="userprofile">
    <div class="profile-card">
        <h1>{{data:userprofile:name}}</h1>
        <div class="core-clone" data-core-data="userprofile:posts">
            <p>{{rec:title}}</p>
        </div>
    </div>
</template>
```

### Initialization
```javascript
core.init();
```

## Security Considerations

*   **Sanitization:** core.sbs provides `nohtml` and `removehtml` scrubbers. It is highly recommended to apply these to user-generated content before injection.
*   **Data Exposure:** Storage ID `1` (Static) exposes data in the DOM. Use Storage ID `0` (DOM) for sensitive state data that should not be visible in "View Source".
