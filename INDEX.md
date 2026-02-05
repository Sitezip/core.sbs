# core.js Framework Index

**Quick reference for all core.js features, tools, and resources.**

---

## 📚 Documentation

- **[README.md](README.md)** - Framework overview and architecture
- **[core.md](core.md)** - Detailed feature documentation
- **[docs.html](https://core.sbs/docs.html)** - Interactive documentation website
- **[core.json](core.json)** - Data structure schemas

---

## 🚀 Getting Started

### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/Sitezip/core.sbs/core.js"></script>
```

### Create New Project
```bash
npx @core-js/create-core-app my-app
```

---

## 🛠️ CLI Tools

### 1. create-core-app
**Location:** `cli/create-core-app/`  
**Purpose:** Scaffold new core.js projects

```bash
npx @core-js/create-core-app my-app
```

**Features:**
- Interactive setup prompts
- Auto-starts dev server
- Beautiful welcome page
- Component loader included

**[Full Documentation](cli/create-core-app/README.md)**

---

### 2. core-gen
**Location:** `cli/core-gen/`  
**Purpose:** Generate pre-built components

```bash
npx @core-js/gen <component> [options]
```

**Available Components (23):**

**Forms:**
- `form` - Basic form
- `form --validation` - Form with validation

**Tables:**
- `table` - Data table with actions

**Modals:**
- `modal` - Modal dialog

**Cards:**
- `card` - Basic card
- `card --pricing` - Pricing card

**Navigation:**
- `navbar` - Navigation bar
- `breadcrumb` - Breadcrumb navigation
- `footer` - Footer with links

**Alerts & Notifications:**
- `alert` - Alert messages (4 variants)
- `toast` - Toast notifications

**UI Elements:**
- `button` - Button (multiple variants)
- `badge` - Badge component
- `avatar` - Avatar with sizes
- `spinner` - Loading spinner
- `progressbar` - Progress bar
- `skeleton` - Skeleton loader

**Interactive:**
- `tabs` - Tabbed interface
- `accordion` - Collapsible accordion
- `dropdown` - Dropdown menu
- `tooltip` - Hover tooltip

**Utility:**
- `search` - Search bar
- `pagination` - Pagination controls

**[Full Documentation](cli/core-gen/README.md)**

---

### 3. core-dev
**Location:** `cli/core-dev/`  
**Purpose:** Development server with hot reload

```bash
npx @core-js/dev
```

**Features:**
- Static file server
- Hot reload on file changes
- WebSocket-based updates
- Zero configuration

**[Full Documentation](cli/core-dev/README.md)**

---

## 🎨 VS Code Extension

**Location:** `vscode-extension/`  
**Snippets:** 82 total (56 original + 26 new)

### Installation
Download from [GitHub Releases](https://github.com/Sitezip/core.sbs/releases)

### Snippet Categories

**HTML Snippets (42):**
- Pockets (5 variants)
- Templates (5 variants)
- Clones (5 variants)
- Directives (8 types)
- Components (15 types)
- Complete examples (4)

**JavaScript Snippets (40):**
- Lifecycle hooks (6)
- Backend API calls (5)
- Registry operations (3)
- Helper functions (8)
- Validation (3)
- Event handlers (4)
- Component loading (3)
- Storage operations (4)
- Utilities (4)

**[Full Documentation](vscode-extension/README.md)**

---

## 📖 Core Framework Features

### Pockets
Container elements that render templates with data.

```html
<div class="core-pocket" 
     data-core-templates="users" 
     data-core-source-users="/api/users">
</div>
```

### Templates
Reusable HTML templates with data binding.

```html
<template name="users">
    <h2>{{data:users:title}}</h2>
    <div class="core-clone" data-core-data="users:items">
        <p>{{rec:name}}</p>
    </div>
</template>
```

### Clones
Repeat elements for array data.

```html
<div class="core-clone" data-core-data="users:items">
    <div>{{rec:name}} - {{rec:email}}</div>
</div>
```

### Data Directives
- `{{data:ref:field}}` - Data reference
- `{{rec:field}}` - Record reference
- `{{aug:index}}` - Augmented data (index, count, first, last)

### Formatters
- `date:m/d/Y` - Date formatting
- `money:$` - Currency formatting
- `upper` - Uppercase
- `lower` - Lowercase
- `title` - Title case
- `nohtml` - Strip HTML

### Special Functions
- `core_pk_attr:src` - Inject into attribute
- `core_pk_cloner:template` - Recursive cloning

---

## 🔧 Core Modules

### core.be (Backend)
Fetch data and templates from APIs.

```javascript
core.be.getData('users', '/api/users');
core.be.getTemplate('userCard', '/templates/card.html');
await core.be.awaitAll();
```

### core.cr (Registry)
Store and retrieve data/templates.

```javascript
core.cr.setData('users', userData);
const users = core.cr.getData('users');
```

### core.pk (Pockets)
Initialize and manage pockets.

```javascript
core.pk.init();
```

### core.sv (Scrubber/Validator)
Validate and format data.

```javascript
const result = core.sv.scrub([
    { name: 'email', value: email, req: true, email: true },
    { name: 'age', value: age, req: true, min: 18 }
]);
```

### core.hf (Helper Functions)
Utility functions.

```javascript
core.hf.digData(obj, 'path.to.property');
core.hf.date(dateString, 'm/d/Y');
```

### core.ud (User Defined)
Lifecycle hooks.

```javascript
core.ud.init = () => {
    core.useRouting = true;
};

core.ud.soc = () => {
    // Start of call
};

core.ud.eoc = () => {
    // End of call
};
```

---

## 🎯 Common Patterns

### Form with Validation
```javascript
const result = core.sv.scrub([
    { name: 'email', value: email, req: true, email: true }
]);

if (result.success) {
    await core.be.getData('response', '/api/submit', {
        method: 'POST',
        data: result.data
    });
}
```

### Load Component
```javascript
await loadComponent('contact-form');
```

### Show Toast
```javascript
showMyToast('Success!', 'success');
```

### Toggle Modal
```javascript
document.getElementById('myModal').classList.toggle('active');
```

---

## 📁 Project Structure

```
core.sbs/
├── core.js                 # Main framework file
├── core.css               # Base styles
├── core.md                # Documentation
├── README.md              # Overview
├── INDEX.md               # This file
├── docs.html              # Documentation site
├── cli/
│   ├── create-core-app/   # Project scaffolding
│   ├── core-gen/          # Component generator
│   └── core-dev/          # Dev server
├── vscode-extension/      # VS Code extension
└── module/                # Additional modules
```

---

## 🔗 Links

- **Website:** https://core.sbs
- **GitHub:** https://github.com/Sitezip/core.sbs
- **CDN:** https://cdn.jsdelivr.net/gh/Sitezip/core.sbs/core.js
- **Issues:** https://github.com/Sitezip/core.sbs/issues

---

## 🆘 Quick Help

### I want to...

**...create a new project**
```bash
npx @core-js/create-core-app my-app
```

**...generate a component**
```bash
npx @core-js/gen card --name=product
```

**...start dev server**
```bash
npx @core-js/dev
```

**...fetch data from API**
```javascript
core.be.getData('users', '/api/users');
await core.be.awaitAll();
```

**...validate form data**
```javascript
const result = core.sv.scrub([
    { name: 'email', value: email, req: true, email: true }
]);
```

**...enable routing**
```javascript
core.ud.init = () => {
    core.useRouting = true;
};
```

---

## 📊 Stats

- **Framework Size:** ~100KB (unminified)
- **Dependencies:** Zero
- **CLI Tools:** 3
- **Components:** 23
- **VS Code Snippets:** 82
- **Modules:** 6

---

*Last Updated: 2024*
