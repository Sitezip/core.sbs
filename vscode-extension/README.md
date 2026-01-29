# core.js Snippets for VS Code

Accelerate your core.js development with intelligent code snippets. This extension provides comprehensive snippet support for the core.js framework (Component Oriented Rendering Engine).

## Features

- **Pocket Snippets**: Quickly create core-pocket elements with data sources
- **Template Snippets**: Generate template structures with data bindings
- **Clone Snippets**: Build repeating elements with record references
- **Directive Snippets**: Insert template directives with proper syntax
- **Lifecycle Hooks**: Implement core.js hooks with correct signatures
- **API Calls**: Use core.js backend and registry methods
- **Helper Functions**: Access utility functions for data manipulation
- **Complete Examples**: Full working examples for common patterns

## Quick Start

Type a snippet prefix and press `Tab` or `Enter` to expand.

### Common Snippets

#### HTML Snippets

- `cpk` - Basic pocket
- `cpkd` - Pocket with data source
- `ctpl` - Basic template
- `ctplc` - Template with clone
- `ccl` - Basic clone
- `cdata` - Data reference `{{data:ref:field}}`
- `crec` - Record reference `{{rec:field}}`

#### JavaScript Snippets

- `cudinit` - Init hook
- `cudsoc` - Start of call hook
- `cudeoc` - End of call hook
- `cbeget` - Get data from API
- `cpkinit` - Initialize pockets
- `ccrset` - Set data in registry

## Snippet Categories

### Pockets
Create pocket elements that act as dynamic insertion points:

| Prefix | Description |
|--------|-------------|
| `cpk` | Basic core-pocket |
| `cpkd` | Pocket with data source |
| `cpkt` | Pocket with template |
| `cpkid` | Pocket with ID |
| `cpknr` | Pocket (no routing) |

### Templates
Generate template structures:

| Prefix | Description |
|--------|-------------|
| `ctpl` | Basic template |
| `ctpld` | Template with data references |
| `ctplc` | Template with clone |
| `ctplf` | Full template structure |

### Clones
Build repeating elements:

| Prefix | Description |
|--------|-------------|
| `ccl` | Basic clone |
| `cclr` | Clone with record references |
| `cclnest` | Nested clone (recursive) |
| `cclaug` | Clone with augmented data |

### Template Directives
Insert data binding directives:

| Prefix | Description |
|--------|-------------|
| `cdata` | Data reference |
| `crec` | Record reference |
| `caug` | Augmented data (index, count) |
| `cattr` | Attribute injection |
| `ccloner` | Recursive cloner |
| `cformat` | Formatted data |
| `cdateformat` | Date formatting |
| `cmoneyformat` | Money formatting |

### Lifecycle Hooks
Implement core.js lifecycle hooks:

| Prefix | Description |
|--------|-------------|
| `cudinit` | Init hook |
| `cudsoc` | Start of call hook |
| `cudeoc` | End of call hook |
| `cudpre` | Preflight hook |
| `cudpost` | Postflight hook |
| `cudprepaint` | Prepaint hook |
| `cudpostpaint` | Postpaint hook |

### API Calls
Use core.js backend and registry:

| Prefix | Description |
|--------|-------------|
| `cbeget` | Get data |
| `cbegetset` | Get data with settings |
| `cbetpl` | Get template |
| `cbepost` | POST data |
| `cbeawait` | Await all backend requests |
| `cpkinit` | Initialize pockets |
| `ccrset` | Set data in registry |
| `ccrget` | Get data from registry |
| `ccrgettpl` | Get template from registry |

### Helper Functions
Access utility functions:

| Prefix | Description |
|--------|-------------|
| `chfdig` | Deep object access |
| `chfdate` | Date formatting |
| `chfhydrate` | Hydrate by class |
| `chfformat` | Format by class |
| `chfparse` | Parse JSON |

### Validation
Validate and scrub data:

| Prefix | Description |
|--------|-------------|
| `csvscrub` | Scrub array |
| `csvformat` | Format value |
| `cvalidate` | Custom validation with multiple rules |

### Configuration
Configure core.js settings:

| Prefix | Description |
|--------|-------------|
| `cinit` | Full initialization setup |
| `crouting` | Enable routing |
| `cdebug` | Enable debugger |
| `ccache` | Set cache expiration |

### Event Handlers
DOM event handling:

| Prefix | Description |
|--------|-------------|
| `cformhandler` | Form submission handler |
| `cclick` | Click event handler |
| `casync` | Async function with await |

### Utilities
Common utilities:

| Prefix | Description |
|--------|-------------|
| `clg` | Console log |
| `cle` | Console error |
| `ctry` | Try-catch block |

### Anchor Tags
Silent data loading:

| Prefix | Description |
|--------|-------------|
| `caget` | Anchor get data |
| `catpl` | Anchor get template |
| `capk` | Anchor reinit pockets |

### Complete Examples
Full working examples:

| Prefix | Description |
|--------|-------------|
| `cexample` | Complete pocket + template |
| `cform` | Form with validation |

## Usage Examples

### Create a Pocket with Data

```html
<!-- Type: cpkd -->
<div class="core-pocket" 
     data-core-templates="users" 
     data-core-source-users="https://api.example.com/users">
</div>
```

### Create a Template with Clone

```html
<!-- Type: ctplc -->
<template name="users">
    <div>
        <h2>{{data:users:title}}</h2>
        <div class="core-clone" data-core-data="users:items">
            <p>{{rec:name}}</p>
        </div>
    </div>
</template>
```

### Initialize core.js

```javascript
// Type: cudinit
core.ud.init = () => {
    core.useRouting = true;
    core.useDebugger = true;
};
```

### Fetch Data

```javascript
// Type: cbeget
core.be.getData('users', '/api/users');
```

## About core.js

core.js is a lightweight, client-side rendering and state management library designed to facilitate the decoupling of data, templates, and DOM logic. It leverages modern asynchronous patterns to provide a seamless "pocket-based" component architecture without the overhead of a virtual DOM.

Learn more at [core.sbs](https://core.sbs)

## Requirements

This extension works with HTML and JavaScript files. No additional dependencies required.

## Extension Settings

This extension contributes snippets for:
- HTML files
- JavaScript files

## Known Issues

None at this time. Please report issues at [GitHub](https://github.com/Sitezip/core.sbs/issues).

## Release Notes

### 1.0.0

Initial release with comprehensive snippet support for core.js framework.

## Contributing

Contributions are welcome! Please visit the [GitHub repository](https://github.com/Sitezip/core.sbs).

## License

MIT

---

**Enjoy building with core.js!**
