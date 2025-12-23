# CORE Framework

**Build reactive web apps without the complexity.**

CORE is a lightweight JavaScript framework that makes building dynamic, data-driven applications simple. No build tools, no complex setup - just vanilla JavaScript and HTML.

## Why CORE?

Tired of bloated frameworks that require webpack, node_modules, and a week of setup? CORE is different:

- **Zero Dependencies** - Just drop it in and go
- **No Build Step** - Works directly in the browser
- **Tiny Footprint** - Under 50KB total
- **Progressive Enhancement** - Enhances existing HTML, doesn't replace it
- **Fast Learning Curve** - Get productive in minutes, not weeks

## What CORE Does

CORE solves the common problems of web development:

### 1. **Data Binding Made Simple**
```html
<div class="core-pocket">
  <h3 class="h-user-name"></h3>
  <p class="h-user-email"></p>
  <span class="f-money h-user-balance"></span>
</div>
```

Just set your data and CORE handles the rest:
```javascript
core.cr.setData('user', {
  name: 'Sarah Johnson',
  email: 'sarah@example.com', 
  balance: 1250.50
});
```

### 2. **Template Processing**
Use HTML templates with simple data references:
```html
<template name="product-card">
  <div class="product">
    <h4>{{data:product:name}}</h4>
    <p class="f-money">{{data: Elems:
  </div  <div class  <div classAs
 .
```

’S’’’’’’’’minos
```javascript
 .setData('或少  <div class="product"> <h north
```javascriptordi
```javascript.
```javascript
0
```

### 而起少
```;少
’S’’’ uploads少起’ which
```

### 3. **Smart Caching**
CORE automatically caches API responses and templates:
```javascript
// Cached for 1 hour by default
core.be.getData('users', '/api/users');

// Custom cache duration
core.be.cacheExpireDefault = 3600; // 1 hour
```

### 4. **Real-time Updates**
Use persistent hydration classes for live updates:
```html
<span class="h--stock-price"></span> <!-- Updates automatically -->
<span class="h-stock-price"></span> <!-- One-time only -->
```

## Quick Start

### 1. Add CORE to Your Project
```html
```

### 2. Include the modules
```html
<!-- Load individual modules -->
<script src="modules/core-be.js"></script>
<script src="modules/core-cr.js"></script>
<script src="modules/core-hf.js"></script>
<script src="modules/core-pk.js"></script>
<script src="modules/core-sv.js"></script>
<script src="modules/core-ux.js"></script>
<script src="modules/core-ud.js"></script>
<script src="modules/core-cb.js"></script>
<script src="modules/core-modular.js"></script>
```

### 3. Create your first template
```html
<div class="core-pocket" data-core-templates="user-list">
  <div class="core-clone" data-core-data="users" data-core-source="/api/users">
    <div class="user-card">
      <h3 class="h-users-name"></h3>
      <p class="f-email:emaillink"></p>
    </div>
  </div>
</div>
```

### 4. Initialize CORE
```javascript
core.useDebugger = true;  // Enable debug mode
core.init();              // Start the framework
core.cr.setData('user', {
  name: 'John Doe',
  email: 'john@example.com',
  balance: 1250.50
});

// Or fetch from API
core.be.getData('user', '/api/current-user');

// Trigger rendering
core.pk.soc();
```

## Core Concepts

### Pockets
Pockets are containers that get populated with data:
```html
<div class="core-pocket" data-core-templates="template-name"></div>
```

### Hydration Classes
Bind data to DOM elements:
- `h-dataRef-field` - One-time binding
- `h--dataRef-field` - Persistent binding (for real-time updates)

### Formatting Classes
Format data automatically:
- `f-money` - Currency formatting
- `f-upper` - Uppercase text
- `f-date` - Date formatting

### Data References
CORE uses a simple data reference system:
- `h-user-name` → Gets `core.cr.getData('user').name`
- `h-product-price` → Gets `core.cr.getData('product').price`

## Real-World Examples

### E-commerce Product List
```html
<div class="core-pocket" data-core-templates="product-card"
     data-products-core-source="/api/products"></div>

<template name="product-card">
  <div class="product">
    <h3 class="h-product-name"></h3>
    <p class="f-money h-product-price"></p>
    <span class="h-product-stock"></span> left in stock
  </div>
</template>
```

### User Dashboard
```html
<div class="core-pocket" data-core-templates="dashboard-stats">
  <div class="stat">
    <h4>Total Sales</h4>
    <span class="f-money h-total-sales"></span>
  </div>
  <div class="stat">
    <h4>New Users</h4>
    <span class="h-new-users"></span>
  </div>
</div>
```

### Form with Validation
```html
<form>
  <input type="email" class="h-user-email" placeholder="Email">
  <input type="text" class="h-user-name" placeholder="Name">
  <button type="submit">Save</button>
</form>

<script>
idesv.scrub([
  { name: 'email', value: email, scrubs: ['email', 'required'] },
  { name: 'name', value: name, scrubs: ['required', 'min:2'] }
]);
</script>
```

## Performance

CORE is built for speed:

- **Smart Caching** - Automatic API response caching
- **Lazy Loading** - Only loads what you need
- **Efficient DOM Operations** - Batched updates
- **Minimal Overhead** - No virtual DOM, just direct manipulation
- **Progressive Enhancement** - Works without JavaScript

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Why Developers Love CORE

> "Finally, a framework that doesn't require a week of setup. I was productive in minutes."

> "The learning curve is gentle but the power is real. Perfect for our MVPs."

> "No build step, no node_modules, just pure JavaScript. Refreshing."

> "Our team went from React fatigue to CORE productivity overnight."

## Get Started Now

1. **Download CORE** - Grab the modules from this repo
2. **Add to your HTML** - Include the script tags
3. **Write your templates** - Use the simple template syntax
4. **Set your data** - Call `core.cr.setData()`
5. **Watch it work** - That's it!

## Need Help?

- Check out the examples in the repo
- Read the API documentation
- Join our community discussions

---

**CORE Framework** - Simpler. Faster. Better.

Built with ❤️ for developers who value simplicity and productivity.
