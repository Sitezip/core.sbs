# Changelog

All notable changes to core.js will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Interactive playground for trying core.js live in browser
- Playground links in navigation and footer

## [20260125.1] - 2026-01-25

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

## [20251212.0] - 2025-12-12

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

[Unreleased]: https://github.com/Sitezip/core.sbs/compare/20260125.1...HEAD
[20260125.1]: https://github.com/Sitezip/core.sbs/compare/20251212.0...20260125.1
[20251212.0]: https://github.com/Sitezip/core.sbs/releases/tag/20251212.0
