# Welcome to Your core.js App!

Your app is ready to go. Open `index.html` in your browser to see it in action.

## What's Included

- **index.html** - Main application file with welcome page
- **styles.css** - Starter styles
- **README.md** - This file

## Getting Started

1. Open `index.html` in your browser
2. See the welcome page with live demos
3. Start editing `index.html` to build your app

## Quick Tips

### Adding a New Template

```html
<template name="myTemplate">
    <div>
        <h2>{{data:myTemplate:title}}</h2>
        <p>{{data:myTemplate:description}}</p>
    </div>
</template>
```

### Creating a Pocket

```html
<div class="core-pocket" 
     data-core-templates="myTemplate"
     data-core-source-myTemplate="/api/data">
</div>
```

### Fetching Data

```javascript
await core.be.getData('myData', '/api/endpoint');
```

## Generate Components

Use the component generator to quickly add pre-built components:

```bash
npx @core-js/gen form --validation --name=contact
npx @core-js/gen table --name=users
npx @core-js/gen modal --name=confirm
```

Components are generated into the `components/` folder.

### Loading Components

Components are automatically loaded using `core-components.js`:

```html
<script src="core-components.js"></script>
<script>
    // Load a single component
    loadComponent('contact-form');
    
    // Load multiple components
    loadComponents(['users-table', 'confirm-modal']);
</script>
```

The component loader will:
- Inject templates into your `#cr-data` section
- Add styles to the page
- Execute component scripts
- Initialize core.js pockets automatically

**No build step required!** Just generate and load.

## Resources

- [Documentation](https://github.com/Sitezip/core.sbs)
- [VS Code Extension](https://github.com/Sitezip/core.sbs/releases)
- [GitHub Repository](https://github.com/Sitezip/core.sbs)

## Next Steps

1. Install the VS Code extension for 56 code snippets
2. Read the full documentation
3. Explore the interactive demos on the welcome page
4. Start building!

---

Built with ❤️ using core.js
