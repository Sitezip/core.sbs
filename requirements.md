# Requirements: Core.js Modernization & Simplification

## Overview
The goal is to modernize the `core.js` library to attract contributors familiar with React, while maintaining its unique identity. This involves simplifying the asynchronous logic using modern JavaScript features and adopting a more developer-friendly HTML attribute syntax.

## 1. JavaScript Simplification (Async/Await)
The current implementation uses a "loading queue" mechanism relying on `setTimeout` loops and global counters (`core_be_count`, `core_pk_count`) to manage asynchronous operations. This should be replaced with modern `async/await` patterns.

### Requirements:
- **Refactor `core.be` (Backend):**
  - `getData` and `getTemplate` should return `Promises`.
  - Remove reliance on global counters for flow control.
  - Use `async/await` to handle `fetch` requests sequentially or concurrently where appropriate.

- **Refactor `core.pk` (Pocket/DOM):**
  - Convert `soc` (Start of Call), `getTemplate`, `getData`, and `eoc` (End of Call) to `async` functions.
  - Replace recursive `setTimeout` polling with `await Promise.all([...])` to wait for data/templates to load.
  - Ensure the lifecycle (`soc` -> `getTemplate` -> `getData` -> `eoc`) executes in a clear, linear, asynchronous flow.

- **Error Handling:**
  - Use `try/catch` blocks within async functions for better error management compared to the current callback/flag approach.

## 2. HTML & Attribute Modernization (React-Familiarity)
To make the library more approachable for React developers, the HTML attribute syntax should be cleaned up. While we cannot use JSX, we can adopt a cleaner, "prop-like" syntax that reduces verbosity.

### Requirements:
- **Attribute Renaming:**
  - Move away from verbose `data-core-*` attributes to cleaner, direct attributes.
  - **Mappings:**
    - `data-core-templates` -> `core-templates`
    - `data-core-source` -> `core-source`
    - `data-core-data` -> `core-data`
    - `data-[name]-core-source` -> `core-source-[name]` (e.g., `core-source-default`)

- **Class Names:**
  - Retain `class="core-pocket"` and `class="core-clone"` as they serve as clear component markers.
  - Consider supporting `className` as an alias for `class` in internal logic if helpful, though strictly `class` is correct for HTML.

- **Example Comparison:**

  *Current:*
  ```html
  <div class="core-pocket" 
       data-core-templates="news" 
       data-core-source="https://api.example.com/news">
  </div>
  ```

  *Proposed:*
  ```html
  <div class="core-pocket" 
       core-templates="news" 
       core-source="https://api.example.com/news">
  </div>
  ```

## 3. Documentation & Code Quality
- **Comments:** Update JSDoc comments to reflect the new async nature of functions.
- **Cleanup:** Remove unused legacy variables related to the old queue system (`core_be_count`, `core_pk_count`, `stackTs`, `templateStart`, etc., if they become redundant).

## 4. Backward Compatibility (Optional but Recommended)
- Consider keeping support for `data-core-*` attributes for a transition period, or provide a clear migration path.
