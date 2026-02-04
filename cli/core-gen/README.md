# core-gen

Generate pre-built components for core.js applications.

## Usage

### From npm (once published)

```bash
npx @core-js/gen form --validation --name=contact
```

### Local Testing (before publishing)

From the root of the core.sbs repository:

```bash
node cli/core-gen/bin/core-gen.js form --validation --name=contact
```

Or link it globally for testing:

```bash
cd cli/core-gen
npm link
cd ../..
core-gen form --validation
```

## Available Components

### Forms

**Basic Form**
```bash
core-gen form --name=contact
```

Generates a simple form with name, email, and message fields.

**Form with Validation**
```bash
core-gen form --validation --name=contact
```

Generates a form with core.js validation, error messages, and success feedback.

### Tables

**Basic Table**
```bash
core-gen table --name=users
```

Generates a data table with edit/delete actions.

**Coming Soon:**
- `--sortable` - Sortable columns
- `--paginated` - Pagination controls
- `--filterable` - Search/filter functionality

### Modals

**Basic Modal**
```bash
core-gen modal --name=confirm
```

Generates a modal dialog with header, body, and footer.

## Options

- `--name=<name>` - Custom component name (default: "my")
- `--validation` - Add validation to forms
- `--sortable` - Make table sortable (coming soon)
- `--paginated` - Add pagination (coming soon)

## What You Get

Each generated component includes:

- ✅ **Pocket definition** - Ready to use
- ✅ **Template with data binding** - Core.js syntax
- ✅ **JavaScript logic** - Event handlers and functions
- ✅ **CSS styling** - Beautiful, responsive styles
- ✅ **Comments** - Guidance for customization

## Examples

### Generate a contact form with validation

```bash
core-gen form --validation --name=contact
```

Creates `contact-form.html` with:
- Name, email, phone, message fields
- Core.js validation using `core.sv.scrub()`
- Error messages for each field
- Success message on submit
- API integration ready

### Generate a users table

```bash
core-gen table --name=users
```

Creates `users-table.html` with:
- Responsive table layout
- Data binding from API
- Edit/delete buttons
- Status badges
- Hover effects

### Generate a confirmation modal

```bash
core-gen modal --name=confirm
```

Creates `confirm-modal.html` with:
- Overlay with backdrop
- Header with close button
- Customizable body content
- Footer with action buttons
- Keyboard shortcuts (Escape to close)

## Integration

After generating a component:

1. **Copy the contents** into your HTML file
2. **Update API endpoints** to match your backend
3. **Customize styling** as needed
4. **Modify data structure** to match your data

## Component Structure

Each component follows this pattern:

```html
<!-- Pocket -->
<div class="core-pocket" data-core-templates="myComponent"></div>

<!-- Template -->
<template name="myComponent">
    <!-- HTML with data binding -->
</template>

<!-- JavaScript -->
<script>
    // Component logic
</script>

<!-- CSS -->
<style>
    /* Component styles */
</style>
```

## No Build Step Required

All generated components are:
- ✅ Pure HTML/CSS/JavaScript
- ✅ No compilation needed
- ✅ Copy and paste ready
- ✅ Framework-agnostic styling

## License

MIT
