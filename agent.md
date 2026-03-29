# Core.js AI Agent Guide

This guide helps AI agents understand and effectively work with core.js, a lightweight client-side rendering and state management library.

## Quick Reference for AI Agents

### Core Architecture
- **Pockets**: Dynamic DOM containers (`class="core-pocket"`)
- **Clones**: Template structures for data records (`class="core-clone"`)
- **Registry**: Centralized data storage (`core.cr`)
- **Lifecycle**: Async flow (`soc` → `getTemplate` → `getData` → `eoc`)

### Essential API Methods

#### Data Management (`core.cr`)
```javascript
// Store data (storageId: 0=DOM, 1=attributes, 2=sessionStorage)
core.cr.setData('users', userData, element, 0);

// Retrieve data
const users = core.cr.getData('users', element, 0);

// Template management
core.cr.setTemplate('userCard', htmlString);
const template = core.cr.getTemplate('userCard');
```

#### Backend Operations (`core.be`)
```javascript
// Fetch JSON data
core.be.getData('apiData', '/api/endpoint', {
    method: 'GET',
    headers: {'Authorization': 'Bearer token'}
});

// Fetch HTML template
core.be.getTemplate('myTemplate', '/templates/template.html');

// Wait for all requests to complete
await core.be.awaitAll();
```

#### Pocket Lifecycle (`core.pk`)
```javascript
// Manual pocket refresh
core.pk.soc(); // Start of cycle

// Insert pocket programmatically
core.ux.insertPocket('targetId', 'templateName', [
    {name: 'templateName', url: '/api/data'}
]);
```

#### Helper Functions (`core.hf`)
```javascript
// Deep object access
const value = core.hf.digData(obj, 'user.profile.name');

// Date formatting
const formatted = core.hf.date(new Date(), 'MM/DD/YYYY');

// Copy to clipboard
core.hf.copy('text to copy');

// Credit card validation
const cardInfo = core.hf.ccNumAuth('4111111111111111');
```

### Template Syntax

#### Data Binding
```html
<!-- Registry data -->
{{data:users:name}}

<!-- Current record (in clones) -->
{{rec:title}}

<!-- Augmented metadata -->
{{aug:index}}     // Record index
{{aug:count}}     // Total records
```

#### Common Patterns
```html
<!-- Pocket definition -->
<div class="core-pocket" 
     data-core-templates="userList" 
     data-userList-core-source="/api/users">
</div>

<!-- Template with clones -->
<template name="userList">
    <h2>Users</h2>
    <div class="core-clone" data-core-data="userList">
        <div class="user-card">
            <h3>{{rec:name}}</h3>
            <p>{{rec:email}}</p>
            <small>User #{{aug:index}}</small>
        </div>
    </div>
</template>
```

### Configuration & Hooks

#### User-Defined Hooks (`core.ud`)
```javascript
core.ud = {
    // Before rendering starts
    soc: () => {
        console.log('Starting render cycle');
    },
    
    // After rendering completes
    eoc: () => {
        console.log('Render complete');
        // Add event listeners, analytics, etc.
    },
    
    // Intercept backend requests
    preflight: (dataRef, dataSrc, type) => {
        if (type === 'data') {
            return {headers: {'Auth-Token': 'xxx'}};
        }
    },
    
    // Process backend responses
    postflight: (dataRef, dataObj, type) => {
        if (dataRef === 'users') {
            return dataObj.map(user => ({
                ...user,
                fullName: `${user.first} ${user.last}`
            }));
        }
    },
    
    // Before template injection
    prepaint: (dataRef, dataObj, type) => {
        // Pre-processing logic
    },
    
    // After template injection
    postpaint: (dataRef, dataObj, type) => {
        // Post-processing, event binding, etc.
    }
};
```

#### Global Settings
```javascript
core.useDebugger = true;     // Enable verbose logging
core.useRouting = true;      // Enable SPA routing
core.be.cacheExpireDefault = 3600; // Cache TTL in seconds
```

### Routing (Pretty Paths)

#### URL Structure
```
/#/_target/template/dataSource
```

#### Examples
```html
<!-- Navigation links -->
<a href="#/_main/home">Home</a>
<a href="#/_main/users">Users</a>
<a href="#/_sidebar/profile">Profile</a>

<!-- Programmatically set route -->
core.hf.setRoute('#/_main/dashboard');
```

### Debugging Tips

#### Enable Debug Mode
```javascript
core.useDebugger = true;
```

#### Monitor Network Requests
```javascript
console.log(core.be.fetchLogFIFO);
```

#### Check Cache Status
```javascript
console.log(core.be.cacheCreateTs);
console.log(core.be.cacheExpire);
```

### Common AI Agent Tasks

#### 1. Adding a New Component
```javascript
// 1. Create template
core.cr.setTemplate('myComponent', `
    <div class="my-component">
        <h2>{{data:myComponent:title}}</h2>
        <div class="core-clone" data-core-data="myComponent:items">
            <span>{{rec:name}}</span>
        </div>
    </div>
`);

// 2. Add pocket to DOM
const pocket = document.createElement('div');
pocket.className = 'core-pocket';
pocket.setAttribute('data-core-templates', 'myComponent');
pocket.setAttribute('data-myComponent-core-source', '/api/my-data');
document.body.appendChild(pocket);

// 3. Trigger render
core.pk.soc();
```

#### 2. Updating Data Dynamically
```javascript
// Fetch new data
await core.be.getData('users', '/api/users/updated');

// Force pocket refresh
core.pk.soc();
```

#### 3. Form Handling
```javascript
core.ud.postpaint = (dataRef, dataObj, type) => {
    if (dataRef === 'userForm') {
        // Add form validation
        const form = document.querySelector('#userForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            core.be.getData('submitResult', '/api/submit', {
                method: 'POST',
                data: Object.fromEntries(formData)
            });
        });
    }
};
```

### Performance Optimization

#### Caching Strategy
```javascript
// Set cache expiration for specific data
core.be.cacheExpire = {
    type: 'data',
    name: 'users',
    seconds: 300 // 5 minutes
};
```

#### Batch Operations
```javascript
// Wait for all requests before proceeding
await core.be.awaitAll();
// Then perform DOM operations
```

### Error Handling

#### Enhanced Error Messages
Core.js provides built-in error suggestions. Enable with:
```javascript
core.useDebugger = true;
```

#### Common Issues & Solutions
- **Template not found**: Check template name spelling and ensure template is loaded
- **Data undefined**: Verify data source URL and JSON structure
- **Pocket not rendering**: Ensure pocket has correct attributes and template exists

### Security Considerations

#### Data Sanitization
```javascript
core.ud.postflight = (dataRef, dataObj, type) => {
    if (type === 'data') {
        // Sanitize user content
        return core.sv.scrub([dataObj], [{field: 'content', nohtml: true}]);
    }
};
```

#### Storage Security
- Use storage ID `0` for sensitive data (DOM-only)
- Use storage ID `1` for non-sensitive persistent data
- Use storage ID `2` for session data

### Module Integration

#### Loading External Modules
```javascript
// Core.js supports dynamic imports
const module = await import(core.baseUrl + '/modules/custom.js');
```

This guide provides AI agents with the essential knowledge to work effectively with core.js applications.
