# VSCode Snippet Extension Specification - core.js

## Overview
A VSCode extension that provides intelligent code snippets and autocomplete functionality for the core.js framework (Component Oriented Rendering Engine). Users can type short trigger keywords that expand into full code templates for pockets, templates, clones, and common core.js patterns.

## Purpose
- Accelerate core.js development by reducing boilerplate HTML/JS writing
- Provide consistent pocket-based architecture patterns
- Improve developer productivity with quick template insertion
- Reduce syntax errors in core.js template directives

## Core Features

### 1. Snippet Triggers
- Short, memorable keyword triggers (e.g., "cpk", "ctpl", "ccl")
- Tab completion to expand snippets
- IntelliSense integration for snippet discovery

### 2. Template Expansion
- Full code templates with proper formatting
- Cursor positioning after expansion (using tab stops)
- Variable placeholders for customization
- Multi-cursor support for simultaneous editing

### 3. Language Support
Initial support for:
- HTML (.html)
- JavaScript (.js)

## Example Snippets

### Core.js Pockets
- `cpk` → Basic core-pocket
- `cpkd` → Pocket with data source
- `cpkt` → Pocket with template
- `cpkf` → Full pocket (template + data)

### Core.js Templates
- `ctpl` → Basic template element
- `ctpld` → Template with data references
- `ctplc` → Template with clone

### Core.js Clones
- `ccl` → Basic core-clone
- `ccld` → Clone with data source
- `cclr` → Clone with record references

### Template Directives
- `cdata` → {{data:ref}} directive
- `crec` → {{rec:field}} directive
- `caug` → {{aug:index}} directive
- `cattr` → {{rec:field:core_pk_attr:attr}} directive
- `ccloner` → {{rec:field:core_pk_cloner:template}} directive

### Core.js Hooks
- `cudsoc` → core.ud.soc() hook
- `cudeoc` → core.ud.eoc() hook
- `cudpre` → core.ud.preflight() hook
- `cudpost` → core.ud.postflight() hook
- `cudprepaint` → core.ud.prepaint() hook
- `cudpostpaint` → core.ud.postpaint() hook

### Core.js API Calls
- `cbeget` → core.be.getData() call
- `cbetpl` → core.be.getTemplate() call
- `cpkinit` → core.pk.init() call
- `ccrset` → core.cr.setData() call
- `ccrget` → core.cr.getData() call

## Technical Requirements

### Extension Configuration
- Extension name: `code-snippets-pro` (or custom name)
- Publisher: TBD
- Category: Snippets
- Activation: On language detection

### File Structure
```
vscode-extension/
├── package.json          # Extension manifest
├── snippets/
│   ├── html.json         # HTML snippets (pockets, templates, clones)
│   └── javascript.json   # JS snippets (hooks, API calls)
├── README.md            # User documentation
├── CHANGELOG.md         # Version history
└── .vscodeignore        # Files to exclude from package
```

## User Experience

### Installation
- Install from VSCode Marketplace
- Or install from VSIX file locally

### Usage
1. Open a supported file type
2. Type a trigger keyword (e.g., "cpk")
3. Press Tab or Enter to expand
4. Use Tab to navigate between placeholders
5. Customize the generated code

### Customization
- Users can override snippets in their settings
- Support for workspace-specific snippets

## Future Enhancements
- CSS snippets for core.js utility classes
- JSON snippets for core.json configuration
- Custom snippet configuration UI
- Snippet sharing/import functionality
- Context-aware snippet recommendations based on pocket hierarchy
- Auto-detection of template names for data-core-templates attribute

## Success Metrics
- Reduced time writing boilerplate code
- Consistent code patterns across team
- High user satisfaction and adoption
- Minimal learning curve for new users
