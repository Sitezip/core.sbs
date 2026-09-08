# Changelog

All notable changes to core.js will be documented in this file.

## [20260908] - 2026-09-08

### Fixed
- **Malformed clones no longer abort the data pass**: a `.core-clone` with no
  `data-core-data` / `core-data` attribute produced an undefined `dataRef`, which threw a
  `TypeError` inside `core.cr.getData()`. Because `core.pk.soc()` wraps the lifecycle in a
  single try/catch, the throw was swallowed and `core.pk.addData()` never ran — one malformed
  element silently dropped **every** clone on the page. `core.pk.getData()` and
  `core.pk.addData()` now skip unreferenced clones (warning when `useDebugger` is on).
- **Registry tolerates a missing name**: `core.cr.getData()`, `setData()` and `delData()`
  return `undefined` for a missing or non-string name instead of throwing on `name.startsWith`.
- **Clones outside a pocket**: `core.pk.addData()` no longer throws on `null.style` when a
  clone has no `.core-pocket` / `.core-pocketed` ancestor.

### Added
- `coremoji.js` — an emoji port of core.js, addressing the full API through emoji property
  keys (`globalThis["🧩"]`), with `coremoji.html` as its documentation and demo page

### Changed
- Default CDN `baseUrl` now resolves to `core.sbs@20260908`

[20260908]: https://github.com/Sitezip/core.sbs/compare/20260329...20260908

## [20260329] - 2026-03-29

### Added
- **AI Agent Support**: New `agent.md` documentation for LLM/agent integration
- **Published Packages**: Core.js now available as npm package and VS Code extension
- **Enhanced Documentation**: Comprehensive AI agent guide with API reference and examples

### Changed
- Updated installation instructions to reflect published packages
- Improved developer onboarding experience

### Documentation
- Added `agent.md` for AI agent integration
- Updated README with proper npm and VS Code extension installation steps

[20260329]: https://github.com/Sitezip/core.sbs/compare/20260204.1...20260329

## [20260204.1] - 2026-02-04

### Added
- Enhanced error handling system with contextual suggestions
- Hot Module Replacement (HMR) for core.js with state preservation
- CSS hot reloading without page refresh
- Source map generator and support for better debugging
- Intelligent file type detection for optimal reload behavior
- Fixed dev server default path to serve project root
- Support for both CDN and local core.js usage patterns

### Enhanced
- Development server with HMR capabilities
- Error messages with actionable solutions for common issues
- CLI tool distribution-ready configuration
- Hot reload toggle with Ctrl+Shift+H keyboard shortcut

### Fixed
- Dev server serving wrong directory by default
- Path resolution for global CLI installation
- State preservation during core.js hot reload

### Developer Experience
- Better debugging with source map support
- Faster development cycles with intelligent hot reload
- Improved error context and suggestions
- Smarter file watching based on file types

## [20260125.1] - 2026-01-25

### Fixed
- Playground rendering issues
- Template initialization edge cases

## [20260125] - 2026-01-25

### Added
- CLI Tools ecosystem
  - `create-core-app`: Project scaffolding with interactive setup
  - `core-gen`: Component generator with 23+ templates
  - `core-dev`: Development server with hot reload
- VS Code extension with 82 snippets
- Comprehensive component library (cards, forms, modals, navigation, etc.)
- Full documentation site with interactive examples
- Modern routing with "Pretty Paths"
- Enhanced validation system

### Changed
- Improved async lifecycle handling
- Better error messages and debugging
- Optimized template rendering performance

### Fixed
- Template caching issues
- Clone element memory leaks
- Route parsing edge cases

## [20251212] - 2025-12-12

### Added
- Initial public release
- Core framework with Pockets, Clones, and Registry
- Backend API integration (`core.be`)
- Template system (`core.cr`)
- Helper functions (`core.hf`)
- Pocket management (`core.pk`)
- Validation (`core.sv`)
- User hooks (`core.ud`)
- UX utilities (`core.ux`)

### Features
- Zero build step required
- Client-side rendering
- State management
- Data binding with `{{}}` syntax
- Async/await architecture
- Form validation
- API integration
- CDN delivery

[20260204.1]: https://github.com/Sitezip/core.sbs/compare/20260125.1...20260204.1
[20260125.1]: https://github.com/Sitezip/core.sbs/compare/20260125...20260125.1
[20260125]: https://github.com/Sitezip/core.sbs/compare/20251212...20260125
[20251212]: https://github.com/Sitezip/core.sbs/releases/tag/20251212
