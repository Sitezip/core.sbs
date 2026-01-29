# Phase 2: Syntax Awareness - Complete

## What Was Added

### TextMate Grammar
Created `syntaxes/corejs.tmLanguage.json` that provides syntax highlighting for core.js template directives.

**Supported Patterns:**
- `{{data:ref:field}}` - Data references
- `{{data:ref:field:formatter}}` - Data with formatters
- `{{rec:field}}` - Record references
- `{{rec:field:formatter}}` - Record with formatters
- `{{rec:field:formatter:pattern}}` - Record with format patterns
- `{{rec:field:core_pk_attr:attr}}` - Attribute injection
- `{{rec:field:core_pk_cloner:template}}` - Recursive cloner
- `{{aug:index}}` - Augmented data (index, count, first, last)

### Color Theme
Created `themes/corejs-dark.json` optimized for core.js syntax.

**Color Scheme:**
- **Brackets `{{` `}}`** - Bright green (#10b981), bold
- **Directive types** (`data`, `rec`, `aug`) - Cyan (#06b6d4), bold
- **Data references** - Orange (#f59e0b)
- **Field names** - Yellow (#fbbf24)
- **Formatters** - Purple (#a78bfa), italic
- **Special functions** - Pink (#ec4899), bold
- **Augmented constants** - Light green (#34d399), italic

### Grammar Injection
The grammar injects into:
- HTML files (`text.html.basic`, `text.html.derivative`)
- JavaScript files (`source.js`)

This means directives are highlighted anywhere they appear.

---

## How to Test

### 1. Repackage Extension

```bash
cd /home/jrh89/Work/core.sbs/vscode-extension
vsce package
```

This creates `corejs-snippets-1.1.0.vsix`

### 2. Install Updated Extension

In VSCode:
1. Uninstall old version (if installed)
2. `Ctrl+Shift+P` → "Extensions: Install from VSIX"
3. Select `corejs-snippets-1.1.0.vsix`
4. Reload window

### 3. Test Syntax Highlighting

Open `test-syntax.html` and verify:

**Data Directives:**
- `{{data:users:title}}` 
  - `{{` `}}` should be bright green
  - `data` should be cyan
  - `users` should be orange
  - `title` should be yellow

**Record Directives:**
- `{{rec:name}}`
  - `rec` should be cyan
  - `name` should be yellow

**Formatters:**
- `{{rec:date:date:m/d/Y}}`
  - First `date` (field) should be yellow
  - Second `date` (formatter) should be purple italic
  - `m/d/Y` (pattern) should be light purple

**Special Functions:**
- `{{rec:url:core_pk_attr:href}}`
  - `core_pk_attr` should be pink bold
  - `href` should be standard HTML attribute color

**Augmented Data:**
- `{{aug:index}}`
  - `aug` should be cyan
  - `index` should be light green italic

### 4. Enable Theme (Optional)

1. `Ctrl+Shift+P` → "Preferences: Color Theme"
2. Select "core.js Dark"
3. Directives will have optimized colors

---

## What This Achieves

### Before Phase 2:
```html
{{data:users:name}}  <!-- Just a string, no structure -->
```

### After Phase 2:
```html
{{data:users:name}}  <!-- Each part has semantic meaning and color -->
  ↑    ↑     ↑
  |    |     └─ Field (yellow)
  |    └─────── Data reference (orange)
  └──────────── Directive type (cyan)
```

---

## Impact

**Mistakes surface immediately** - Typos in directive types or formatters are visually obvious

**Cognitive load reduced** - Brain processes color faster than reading text

**Feels like a language** - Directives are no longer "magic strings"

**Professional appearance** - Framework looks mature and well-supported

---

## Technical Details

### Scope Names
The grammar uses semantic scope names that map to TextMate conventions:

- `keyword.control.directive.type.corejs` - Directive types
- `variable.other.dataref.corejs` - Data references
- `variable.other.field.corejs` - Field names
- `entity.name.function.formatter.corejs` - Formatters
- `support.function.special.corejs` - Special functions
- `constant.language.augmented.corejs` - Augmented constants

### Injection Strategy
Uses `injectionSelector` to embed into HTML and JS without creating a separate language mode. This means:
- No need to change file associations
- Works in existing HTML/JS files
- Doesn't interfere with other syntax highlighting

### Pattern Matching
Uses regex to match directive patterns:
- Handles optional formatters
- Supports format patterns (e.g., `m/d/Y`)
- Distinguishes between different directive types
- Captures special functions separately

---

## Known Limitations

**No validation** - Grammar only highlights, doesn't validate correctness. That's Phase 6.

**No IntelliSense** - Autocomplete for field names requires Phase 3.

**Static patterns** - Can't dynamically suggest available templates or data refs.

**No error detection** - Broken references aren't flagged. Phase 6 adds diagnostics.

---

## Next Steps

**Phase 3: Attribute Intelligence**
- Autocomplete for `data-core-*` attributes
- Suggest available template names
- Validate attribute combinations
- Hover documentation

**Phase 4: Navigation**
- Go to template definition
- Find all references
- Template explorer sidebar
- Dependency graph

---

## Files Modified

- `package.json` - Added grammar and theme contributions, bumped to v1.1.0
- `syntaxes/corejs.tmLanguage.json` - New TextMate grammar
- `themes/corejs-dark.json` - New color theme
- `test-syntax.html` - Test file for syntax highlighting

---

## Validation

Run these checks:

```bash
# Validate grammar JSON
node -e "JSON.parse(require('fs').readFileSync('syntaxes/corejs.tmLanguage.json', 'utf8')); console.log('✓ Grammar valid')"

# Validate theme JSON
node -e "JSON.parse(require('fs').readFileSync('themes/corejs-dark.json', 'utf8')); console.log('✓ Theme valid')"

# Validate package.json
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8')); console.log('✓ Package valid')"
```

All should pass before packaging.
