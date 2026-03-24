# Login Form Tutorial

## Overview
Building a secure, accessible login form with core.sbs

## Topics Covered
- Form structure and validation
- Input handling with core.sbs data binding
- Security best practices
- Accessibility features

## Script Outline

### Introduction (30 seconds)
"Welcome! Today we're building a complete login form using core.sbs. We'll cover validation, security, and accessibility—all in under 10 minutes."

### Setup (1 minute)
- Create new project folder
- Link to core.sbs
- Create basic HTML structure

### Building the Form (3 minutes)
- Email input with validation
- Password input with toggle
- Submit button with loading state
- Error message display

### Adding Validation (2 minutes)
- Client-side validation
- Real-time feedback
- Password strength indicator

### Security & Accessibility (2 minutes)
- Proper input types
- ARIA labels
- CSRF protection basics
- Secure password handling

### Wrap Up (1 minute)
- Recap key points
- Link to full source code
- Preview next tutorial

---

## Detailed Code Narration

Use this section while recording to explain concepts as you type.

### Intro (what to say)
"Welcome! Today we're building a complete login form using core.sbs. Unlike other frameworks that require build steps and complex tooling, core.sbs works directly in your HTML with simple attributes. Let's see how it works."

### HTML Setup Explanation
**While typing the input field:**
"Notice this `data-core-bind="value: email"` attribute. This is what we call a 'pocket'—it creates a two-way connection between this input and our JavaScript state. When the user types, the `email` state updates automatically. When the state changes, the input updates too."

**While adding the error class binding:**
"We can also bind multiple things. Here we're binding both the value AND the class—when `emailError` is truthy, it adds the 'error' class automatically. No manual DOM manipulation needed."

**While adding data-core-on:**
"For events, we use `data-core-on`. This wires up the blur event to call our `validateEmail` method. It's declarative—you just say what event triggers what method."

### JavaScript Setup Explanation
**While creating the app:**
"We start with `core_pk_create`. The first argument is our app name—think of it like a namespace. The second argument is our configuration object."

**While typing the state:**
"This `state` object is reactive. Every property here becomes trackable. When email changes, anything bound to email updates instantly."

**While typing methods:**
"Methods go in the `methods` object. They have access to `this` which proxies to our state. So `this.email` gets/sets the state value automatically."

**While typing validateEmail:**
"Notice we're not querying the DOM for the input value—we just read `this.email`. The pocket already synced it for us. We validate, then set `this.emailError` if needed. The UI updates automatically because `emailError` is reactive state."

**While typing handleSubmit:**
"For the submit handler, we get the event object as a parameter. We call `e.preventDefault()` to stop actual submission while we validate. Then we simulate an API call—notice `this.isLoading = true` immediately shows the loading spinner because it's bound to the button's disabled state and the loading animation visibility."

**While mounting:**
"Finally, `core_pk_mount` connects our app to the DOM. We pass the app name and the root element. Everything inside this element can now use our pockets and methods."

### Key Concepts to Emphasize
- **Pockets**: Two-way data binding via `data-core-bind`
- **Events**: Declarative event handling via `data-core-on`
- **Reactivity**: State changes automatically update the UI
- **No DOM queries**: Access state directly via `this.propertyName`
- **Templates**: Use `{{expression}}` for text interpolation

### Transitions Between Sections
"Now let's add validation..."
"Next, we'll wire up the password strength indicator..."
"Finally, let's handle the form submission..."
