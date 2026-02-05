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
Simple form with name, email, and message fields.

**Form with Validation**
```bash
core-gen form --validation --name=contact
```
Form with core.js validation, error messages, and success feedback.

### Tables

**Data Table**
```bash
core-gen table --name=users
```
Data table with edit/delete actions, status badges, and hover effects.

### Modals

**Modal Dialog**
```bash
core-gen modal --name=confirm
```
Modal dialog with header, body, footer, and overlay.

### Cards

**Basic Card**
```bash
core-gen card --name=product
```
Card with header, body, and footer sections.

**Pricing Card**
```bash
core-gen card --pricing --name=pro
```
Pricing card with plan name, price, features list, and CTA button.

### Navigation

**Navigation Bar**
```bash
core-gen navbar --name=main
```
Responsive navbar with mobile toggle and dropdown support.

**Breadcrumb**
```bash
core-gen breadcrumb --name=page
```
Breadcrumb navigation with separators.

**Footer**
```bash
core-gen footer --name=site
```
Multi-column footer with links and copyright.

### Alerts & Notifications

**Alert**
```bash
core-gen alert --name=success
```
Alert message with icon, close button, and variants (info, success, warning, error).

**Toast Notification**
```bash
core-gen toast --name=notification
```
Auto-dismissing toast notifications with animation.

### UI Elements

**Button**
```bash
core-gen button --name=submit
```
Button with multiple variants (primary, secondary, success, danger, outline).

**Badge**
```bash
core-gen badge --name=status
```
Small badge with color variants.

**Avatar**
```bash
core-gen avatar --name=user
```
Circular avatar with size variants.

**Spinner**
```bash
core-gen spinner --name=loading
```
Animated loading spinner.

**Progress Bar**
```bash
core-gen progressbar --name=upload
```
Progress bar with percentage display.

**Skeleton Loader**
```bash
core-gen skeleton --name=content
```
Animated skeleton loader for content placeholders.

### Interactive Components

**Tabs**
```bash
core-gen tabs --name=content
```
Tabbed interface with multiple panels.

**Accordion**
```bash
core-gen accordion --name=faq
```
Collapsible accordion with multiple sections.

**Dropdown**
```bash
core-gen dropdown --name=menu
```
Dropdown menu with dividers and close-on-outside-click.

**Tooltip**
```bash
core-gen tooltip --name=help
```
Hover tooltip with arrow pointer.

### Utility Components

**Search Bar**
```bash
core-gen search --name=site
```
Search input with search button.

**Pagination**
```bash
core-gen pagination --name=results
```
Pagination controls with first/previous/next/last buttons.

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
