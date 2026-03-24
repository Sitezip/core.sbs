# Simple Component Tutorial

## Overview
Creating a reusable, self-contained component with core.sbs

## Topics Covered
- Component architecture
- Props/state management
- Events and callbacks
- Component lifecycle

## Script Outline

### Introduction (30 seconds)
"Welcome to the final tutorial! Today we're building reusable components in core.sbs. We'll create a modal system that can be used anywhere in your app with just a few lines of code."

### Component Concept (1 minute)
- What makes a good component
- Encapsulation and reusability
- Props vs state
- Event communication

### Building the Modal Component (3 minutes)
- Template structure
- Props: title, content, size
- State: open/closed
- Events: onOpen, onClose, onConfirm
- CSS animations

### Using the Component (2 minutes)
- Import and instantiate
- Pass props and handle events
- Multiple modal instances
- Nested component composition

### Best Practices (1 minute)
- Keep components focused
- Document your props
- Test edge cases
- Component naming conventions

### Wrap Up (30 seconds)
- Recap component architecture
- Link to all 3 tutorial sources
- Thanks for watching

## Project Structure
```
03-component/
├── index.html          # Demo page
├── components/         # Reusable components
│   └── modal.html
├── app.js              # Component logic
└── script.md           # This file
```
