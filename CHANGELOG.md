# Changelog

All notable changes to core.js will be documented in this file.

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
