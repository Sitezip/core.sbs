# Contributing to C.O.R.E.

First off, thanks for taking the time to contribute! We want to make C.O.R.E. the go-to library for developers who want the power of data-binding without the build steps of modern frameworks.

## Philosophy
C.O.R.E. follows a "Create Once, Render Everywhere" philosophy.
- **No Build Step:** The library should work directly in the browser.
- **Async First:** We use modern `async/await` patterns.
- **HTML Centric:** Configuration happens in the HTML via attributes.

## Getting Started

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/Sitezip/core.sbs.git
    ```
2.  **Open the demo:**
    Open `core.html` in your browser to see the library in action.

## Development Workflow

### Core Logic
The main logic resides in `core.js`. It is divided into modules:
- `core.be` (Backend): Handles fetching data and templates.
- `core.pk` (Pocket): Handles the lifecycle and DOM manipulation.
- `core.cr` (Create): Manages data storage and template registry.
- `core.ux` (User Experience): Helper functions for UI.

### Making Changes
1.  Make your changes in `core.js`.
2.  Ensure you maintain backward compatibility for `data-core-*` attributes.
3.  Use `async/await` for any asynchronous operations.
4.  Update JSDoc comments for any modified functions.

## Pull Request Process

1.  Update the `README.md` (or `core.md`) with details of changes to the interface.
2.  Increase the version number in the `core.js` file (if applicable) and the README.
3.  You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct
Be nice. We are all here to build cool stuff.
