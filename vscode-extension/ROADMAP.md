# core.js VSCode Extension Roadmap

This document outlines the evolution of editor tooling for core.js, from snippets to a complete platform experience.

## Phase 1: Snippets ✅ (Current)

**Status**: Complete

The foundation layer that removes hesitation and reduces mental overhead.

### Delivered
- HTML snippets for pockets, templates, and clones
- JavaScript snippets for lifecycle hooks and API calls
- Template directive snippets with tab stops
- Complete example snippets
- Published as lightweight VSCode extension

### Impact
- Reduces syntax errors
- Accelerates development
- Provides discoverable patterns
- Low effort, high impact

---

## Phase 2: Syntax Awareness

**Status**: Planned

Turn custom binding syntax from strings into structured tokens.

### Goals
- Create TextMate grammar for `{{type:source:reference:format}}` syntax
- Add syntax highlighting for token prefixes (`data:`, `rec:`, `aug:`)
- Highlight formatters (`:date`, `:money`, `:upper`, etc.)
- Register grammar for HTML and template files
- Provide visual distinction between different directive types

### Technical Approach
- Define TextMate grammar in `syntaxes/corejs.tmLanguage.json`
- Register grammar in `package.json` contributions
- Create color themes optimized for core.js syntax
- Add bracket matching for `{{` and `}}`

### Impact
- Mistakes surface immediately instead of at runtime
- Template directives feel like first-class language features
- Reduces cognitive load when reading complex templates

---

## Phase 3: Attribute Intelligence

**Status**: Planned

Make custom `data-*` attributes feel like part of the HTML language.

### Goals
- Autocomplete for `data-core-*` attributes
- Suggest valid attribute values based on context
- Hover documentation for attributes
- Validate attribute combinations
- Detect template names in workspace for suggestions

### Technical Approach
- Implement `CompletionItemProvider` for HTML
- Detect `data-core-` namespace
- Parse workspace for template definitions
- Attach hover documentation from framework docs
- Provide IntelliSense for attribute values

### Features
- `data-core-templates` → suggests available templates
- `data-core-source-*` → validates URL patterns
- `data-core-routing` → suggests `true`/`false`
- `data-core-data` → suggests `dataRef:arrayField` format

### Impact
- Custom attributes become part of the language
- Reduces typos in attribute names
- Faster development with autocomplete
- Self-documenting code

---

## Phase 4: Navigation & Project Structure

**Status**: Planned

Enable intent-driven navigation instead of grep-based searching.

### Goals
- Parse project files for templates and pockets
- Build in-memory index on workspace load
- Expose index through TreeView sidebar
- Jump to definition for template references
- Find all references for data sources
- Outline view for template structure

### Technical Approach
- Implement workspace scanner for templates and pockets
- Create `TreeDataProvider` for sidebar
- Register `DefinitionProvider` for go-to-definition
- Register `ReferenceProvider` for find-references
- Cache index and update on file changes

### Features
- **Template Explorer**: Sidebar showing all templates
- **Pocket Navigator**: View all pockets and their data sources
- **Go to Template**: Click template name to jump to definition
- **Find References**: See all pockets using a template
- **Dependency Graph**: Visualize template relationships

### Impact
- Understand system structure at a glance
- Navigate large projects efficiently
- Discover unused templates
- Trace data flow through components

---

## Phase 5: Live Feedback & Preview

**Status**: Planned

Collapse the feedback loop with instant visual updates.

### Goals
- Embed WebView panel inside VSCode
- Execute template rendering with mock data
- Re-render on file change
- Sync cursor selection to preview output
- Hot reload without browser refresh

### Technical Approach
- Create WebView panel provider
- Inject core.js runtime into WebView
- Watch file changes for templates and data
- Implement cursor-to-preview synchronization
- Provide mock data editor

### Features
- **Live Preview Panel**: See rendered output instantly
- **Mock Data Editor**: Test templates with sample data
- **Hot Reload**: Changes appear without refresh
- **Cursor Sync**: Click in editor, highlight in preview
- **Responsive Preview**: Test different viewport sizes

### Impact
- Development becomes exploratory
- Faster iteration cycles
- Immediate visual feedback
- Reduce browser context switching

---

## Phase 6: Validation & Diagnostics

**Status**: Planned

Shift failures left with keystroke-time validation.

### Goals
- Validate template directive syntax
- Check for broken data references
- Warn about missing templates
- Detect invalid format specifiers
- Validate pocket/template relationships

### Technical Approach
- Implement `DiagnosticCollection`
- Parse template directives for syntax errors
- Cross-reference templates and pockets
- Validate format strings against known formatters
- Provide quick fixes for common issues

### Features
- **Syntax Validation**: Red squiggles for invalid directives
- **Reference Checking**: Warn about missing templates
- **Format Validation**: Check format specifiers
- **Quick Fixes**: Auto-correct common mistakes
- **Convention Enforcement**: Ensure naming patterns

### Impact
- Catch errors before runtime
- Increase confidence in code
- Reduce debugging time
- Enforce best practices automatically

---

## Phase 7: Commands & Code Actions

**Status**: Planned

Replace memory with capability through command palette.

### Goals
- Generate pocket + template boilerplate
- Create new templates with proper structure
- Add lifecycle hooks with correct signatures
- Refactor template names across files
- Extract inline templates to separate files

### Technical Approach
- Register commands in `package.json`
- Implement `CodeActionProvider` for quick fixes
- Create input prompts for user configuration
- Generate code at cursor or create new files
- Implement multi-file refactoring

### Features
- **Create Pocket**: Generate pocket with template
- **New Template**: Scaffold template structure
- **Add Hook**: Insert lifecycle hook
- **Rename Template**: Refactor across all files
- **Extract Template**: Move inline template to registry
- **Generate Mock Data**: Create sample JSON for testing

### Impact
- Reduce cognitive load
- Ensure correct patterns
- Speed up common tasks
- Lower onboarding barrier

---

## Phase 8: Advanced Features

**Status**: Future

Advanced tooling for mature projects.

### Potential Features
- **Performance Profiling**: Identify slow templates
- **Bundle Analysis**: Optimize template loading
- **Type Inference**: Infer data shapes from usage
- **Testing Integration**: Generate tests for templates
- **Documentation Generator**: Auto-generate docs from code
- **Migration Tools**: Upgrade between core.js versions
- **Debugging Integration**: Step through rendering lifecycle
- **AI Assistance**: Context-aware code suggestions

---

## Success Metrics

### Developer Experience
- Time to create first pocket: < 30 seconds
- Syntax errors caught: > 90% before runtime
- Navigation speed: < 2 seconds to any template
- Onboarding time: < 1 hour to productivity

### Adoption
- Extension installs
- Active users
- Snippet usage frequency
- Community contributions

### Quality
- Reduced bug reports for syntax errors
- Faster issue resolution
- Increased code consistency
- Higher developer satisfaction

---

## Philosophy

**Tooling is not a feature. It's the foundation of usability.**

Each phase builds on the previous, creating a cohesive development experience. We start with snippets (low effort, high impact) and progressively add intelligence until the editor becomes an active partner in development.

The goal is not to build every feature at once, but to ship value incrementally while maintaining a clear vision of where we're going.

**Frameworks don't succeed because they're clever. They succeed because they're usable.**

Editor tooling is where usability becomes real.
