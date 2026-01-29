# Snippet Typing Exercises

Practice typing these snippets to get muscle memory. Each exercise builds a real feature.

---

## Exercise 1: User Profile Card (5 minutes)

**Goal**: Build a user profile display with avatar and posts

### Step 1: Create the pocket
Type: `cpkd` + Tab

Fill in:
- Template name: `profile`
- Data source: `/api/user/123`

### Step 2: Create the template
Type: `ctplc` + Tab

Fill in:
- Template name: `profile`
- Title field: `name`
- Items field: `posts`
- Clone field: `title`

### Step 3: Add more record fields
Inside the clone, type: `crec` + Tab
- Field: `excerpt`

Type: `crec` + Tab again
- Field: `publishedAt`

### Step 4: Add formatting
Change `publishedAt` to: `cdateformat` + Tab
- Date field: `publishedAt`
- Format: `F j, Y`

### Expected Result:
```html
<div class="core-pocket" 
     data-core-templates="profile" 
     data-core-source-profile="/api/user/123">
</div>

<template name="profile">
    <div>
        <h2>{{data:profile:name}}</h2>
        <div class="core-clone" data-core-data="profile:posts">
            <p>{{rec:title}}</p>
            <p>{{rec:excerpt}}</p>
            <time>{{rec:publishedAt:date:F j, Y}}</time>
        </div>
    </div>
</template>
```

---

## Exercise 2: Product Grid (5 minutes)

**Goal**: Build an e-commerce product listing

### Step 1: Pocket
Type: `cpkt` + Tab
- Template: `products`
- Source: `https://api.store.com/products`

### Step 2: Template with augmented data
Type: `ctplf` + Tab
- Template: `products`
- Container class: `product-grid`
- Title: `title`
- Items: `items`
- Item class: `product-card`
- Name field: `name`
- Description field: `price`

### Step 3: Add index numbers
Before the name, type: `caug` + Tab
- Select: `index`

### Step 4: Add money formatting
Change price to: `cmoneyformat` + Tab
- Price field: `price`
- Symbol: `$`

### Step 5: Add image attribute
Type: `cattr` + Tab
- Field: `imageUrl`
- Attribute: `src`

Wrap it: `<img {{rec:imageUrl:core_pk_attr:src}} alt="Product">`

### Expected Result:
```html
<div class="core-pocket" 
     data-core-templates="products"
     data-core-source-products="https://api.store.com/products">
</div>

<template name="products">
    <div class="product-grid">
        <header>
            <h1>{{data:products:title}}</h1>
        </header>
        <main>
            <div class="core-clone" data-core-data="products:items">
                <div class="product-card">
                    <span>{{aug:index}}</span>
                    <img {{rec:imageUrl:core_pk_attr:src}} alt="Product">
                    <h3>{{rec:name}}</h3>
                    <p>{{rec:price:money:$}}</p>
                </div>
            </div>
        </main>
    </div>
</template>
```

---

## Exercise 3: Comment Thread (Recursive) (7 minutes)

**Goal**: Build nested comments with replies

### Step 1: Pocket
Type: `cpkd` + Tab
- Template: `comments`
- Source: `/api/post/456/comments`

### Step 2: Template
Type: `ctpl` + Tab
- Template: `comments`

### Step 3: Clone with nesting
Type: `cclnest` + Tab
- Data ref: `comments`
- Items: `items`
- Name field: `author`
- Children field: `replies`
- Child template: `comments`

### Step 4: Add more fields
Add between author and cloner:
- Type: `crec` + Tab → `text`
- Type: `cdateformat` + Tab → `createdAt`, `m/d/Y g:i A`

### Expected Result:
```html
<div class="core-pocket" 
     data-core-templates="comments" 
     data-core-source-comments="/api/post/456/comments">
</div>

<template name="comments">
    <div class="core-clone" data-core-data="comments:items">
        <div>
            <h4>{{rec:author}}</h4>
            <p>{{rec:text}}</p>
            <time>{{rec:createdAt:date:m/d/Y g:i A}}</time>
            {{rec:replies:core_pk_cloner:comments}}
        </div>
    </div>
</template>
```

---

## Exercise 4: Form with Validation (10 minutes)

**Goal**: Build a contact form with validation

### Step 1: Form structure
Type: `cform` + Tab
- Form ID: `contactForm`
- Username field: `name`
- Email field: `email`
- Submit text: `Send Message`

### Step 2: Add more fields
Add after email input:
```html
<textarea name="message" required rows="5"></textarea>
```

### Step 3: Update validation
In the scrub array, add:
```javascript
{ name: 'message', value: formData.get('message'), req: true, min: 10 }
```

### Step 4: Add success handler
Replace `// Handle success` with:
Type: `ccrset` + Tab
- Data ref: `formResponse`
- Data object: `response`

Then add:
```javascript
alert('Message sent!');
e.target.reset();
```

### Expected Result:
Full working contact form with validation and submission.

---

## Exercise 5: Dashboard Init (5 minutes)

**Goal**: Set up core.js initialization

### Step 1: Full init
Type: `cinit` + Tab
- Routing: `true`
- Debugger: `false`

### Step 2: Add preflight hook
After eoc, type: `cudpre` + Tab

Add inside:
```javascript
if (type === 'data') {
    return { headers: { 'Authorization': 'Bearer token123' } };
}
```

### Step 3: Add postflight
Type: `cudpost` + Tab

Add inside:
```javascript
if (type === 'data' && dataObj.success) {
    return dataObj.data;
}
return dataObj;
```

### Expected Result:
Complete initialization with auth headers and data transformation.

---

## Exercise 6: Data Fetching (3 minutes)

**Goal**: Load data dynamically

### Step 1: Simple GET
Type: `cbeget` + Tab
- Data ref: `users`
- Endpoint: `/api/users`

### Step 2: POST with data
Type: `cbepost` + Tab
- Data ref: `newUser`
- Endpoint: `/api/users`
- Key: `name`
- Value: `'John Doe'`

Add more fields:
```javascript
email: 'john@example.com',
role: 'admin'
```

### Step 3: Await and reinit
Type: `cbeawait` + Tab

Then type: `cpkinit` + Tab

### Expected Result:
```javascript
core.be.getData('users', '/api/users');

core.be.getData('newUser', '/api/users', {
    method: 'POST',
    data: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'
    }
});

await core.be.awaitAll();
core.pk.init();
```

---

## Exercise 7: Click Handler (4 minutes)

**Goal**: Add interactivity

### Step 1: Click handler
Type: `cclick` + Tab
- Element ID: `loadMoreBtn`

### Step 2: Add data fetching
Inside handler, type: `cbeget` + Tab
- Data ref: `moreItems`
- Endpoint: `/api/items?page=2`

### Step 3: Reinit pockets
Type: `cpkinit` + Tab

### Step 4: Add try-catch
Wrap everything in: `ctry` + Tab

### Expected Result:
```javascript
document.getElementById('loadMoreBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        core.be.getData('moreItems', '/api/items?page=2');
        core.pk.init();
    } catch (error) {
        console.error('Error message:', error);
    }
});
```

---

## Exercise 8: Helper Functions (3 minutes)

**Goal**: Use core.js utilities

### Step 1: Dig data
Type: `chfdig` + Tab
- Object: `response`
- Path: `data.user.profile.name`

### Step 2: Date formatting
Type: `chfdate` + Tab
- Date: `timestamp`
- Format: `Y-m-d H:i:s`

### Step 3: Parse JSON
Type: `chfparse` + Tab
- Data var: `userData`
- JSON string: `jsonString`

### Expected Result:
```javascript
core.hf.digData(response, 'data.user.profile.name')
core.hf.date(timestamp, 'Y-m-d H:i:s')
const userData = core.hf.parseJSON(jsonString);
```

---

## Exercise 9: Complete Feature (15 minutes)

**Goal**: Build a news feed with filtering

### Requirements:
- Pocket for news items
- Template with clone
- Date formatting
- Click handler for "Load More"
- Form for filtering by category
- Validation on filter form
- Init hooks for auth

### Your Turn:
Build this using only snippets. No manual typing of core.js code.

**Snippets you'll need:**
- `cpkd`, `ctplc`, `cdateformat`, `cclick`, `cform`, `cvalidate`, `cinit`, `cudpre`

---

## Speed Test (1 minute each)

Type these as fast as you can:

1. `cpk` → pocket
2. `ctpl` → template
3. `ccl` → clone
4. `cdata` → data directive
5. `crec` → record directive
6. `cudinit` → init hook
7. `cbeget` → get data
8. `clg` → console log

**Goal**: < 5 seconds per snippet

---

## Muscle Memory Drills

Repeat 10 times each:

### Drill 1: Pocket + Template
1. `cpkd` + Tab → fill template name
2. `ctpl` + Tab → same template name
3. Delete both
4. Repeat

### Drill 2: Clone + Directives
1. `ccl` + Tab → fill data ref
2. `crec` + Tab → fill field
3. `crec` + Tab → another field
4. Delete
5. Repeat

### Drill 3: Hooks
1. `cudinit` + Tab
2. `cudsoc` + Tab
3. `cudeoc` + Tab
4. Delete all
5. Repeat

---

## Challenge: Build Without Looking

Close this file and build:
- A blog post list
- With comments (nested)
- With a "Load More" button
- With date formatting
- With validation on comment form

Use only snippets. No manual typing.

---

## Pro Tips

**Tab navigation**: After snippet expands, Tab jumps between placeholders

**Linked placeholders**: Type once, updates everywhere (e.g., template names)

**Choice dropdowns**: Some snippets show options (formatters, aug values)

**Undo**: Ctrl+Z removes entire snippet

**IntelliSense**: Ctrl+Space shows available snippets

---

## What You Should Feel

After these exercises:
- Typing `cpk` should be automatic
- You shouldn't think about syntax
- Tab stops should feel natural
- You should be faster than manual typing

If not, repeat the drills.

---

## Next Level

Once comfortable:
1. Build real features using only snippets
2. Time yourself - should be 3x faster than manual
3. Teach someone else using snippets
4. Contribute new snippet ideas

The goal isn't to memorize prefixes. The goal is to stop thinking about syntax and focus on logic.
