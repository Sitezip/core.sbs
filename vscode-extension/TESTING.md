# Testing Guide for core.js Snippets Extension

## Installation

### Step 1: Install the Extension

**Option A: Install from VSIX (Recommended for Testing)**

1. Open VSCode
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: `Extensions: Install from VSIX`
4. Navigate to: `/home/jrh89/Work/core.sbs/vscode-extension/corejs-snippets-1.0.0.vsix`
5. Click "Install"
6. Reload VSCode when prompted

**Option B: Development Mode (For Active Development)**

1. Open the extension folder in VSCode:
   ```bash
   cd /home/jrh89/Work/core.sbs/vscode-extension
   code .
   ```
2. Press `F5` to launch Extension Development Host
3. A new VSCode window will open with the extension loaded

---

## Testing Checklist

### HTML Snippets Test

1. **Create a new HTML file** (or open `test.html`)

2. **Test Basic Pocket (`cpk`)**
   - Type: `cpk`
   - Press: `Tab`
   - Expected: `<div class="core-pocket" data-core-templates="templateName"></div>`
   - Verify: Cursor is on `templateName` (highlighted)
   - Press: `Tab` again
   - Verify: Cursor moves to end

3. **Test Pocket with Data (`cpkd`)**
   - Type: `cpkd`
   - Press: `Tab`
   - Expected: Multi-line pocket with data source
   - Verify: First tab stop is `templateName` (appears twice)
   - Type: `users`
   - Press: `Tab`
   - Verify: Both instances changed to `users`
   - Verify: Cursor moves to URL field

4. **Test Template (`ctpl`)**
   - Type: `ctpl`
   - Press: `Tab`
   - Expected: `<template name="...">` structure
   - Verify: Tab stops work correctly

5. **Test Template with Clone (`ctplc`)**
   - Type: `ctplc`
   - Press: `Tab`
   - Expected: Full template with clone element
   - Verify: Multiple tab stops for templateName, title, items, field

6. **Test Data Directive (`cdata`)**
   - Type: `cdata`
   - Press: `Tab`
   - Expected: `{{data:dataRef:field}}`
   - Verify: Tab stops on dataRef and field

7. **Test Record Directive (`crec`)**
   - Type: `crec`
   - Press: `Tab`
   - Expected: `{{rec:fieldName}}`
   - Verify: Tab stop on fieldName

8. **Test Augmented Data (`caug`)**
   - Type: `caug`
   - Press: `Tab`
   - Expected: `{{aug:...}}` with dropdown choices
   - Verify: Dropdown shows: index, count, first, last

9. **Test Complete Example (`cexample`)**
   - Type: `cexample`
   - Press: `Tab`
   - Expected: Full pocket + template structure
   - Verify: Multiple linked tab stops work

### JavaScript Snippets Test

1. **Create a new JavaScript file** (or open `test.js`)

2. **Test Init Hook (`cudinit`)**
   - Type: `cudinit`
   - Press: `Tab`
   - Expected: `core.ud.init = () => { ... };`
   - Verify: Cursor inside function body

3. **Test Get Data (`cbeget`)**
   - Type: `cbeget`
   - Press: `Tab`
   - Expected: `core.be.getData('dataRef', '/api/endpoint');`
   - Verify: Tab stops on dataRef and endpoint

4. **Test Full Init (`cinit`)**
   - Type: `cinit`
   - Press: `Tab`
   - Expected: Complete init setup with soc/eoc hooks
   - Verify: Multiple tab stops for true/false values

5. **Test Form Handler (`cformhandler`)**
   - Type: `cformhandler`
   - Press: `Tab`
   - Expected: Complete form submission handler
   - Verify: Linked tab stops (formId, field names match)

6. **Test Console Log (`clg`)**
   - Type: `clg`
   - Press: `Tab`
   - Expected: `console.log('message', variable);`
   - Verify: Tab stops on message and variable

7. **Test Validation (`cvalidate`)**
   - Type: `cvalidate`
   - Press: `Tab`
   - Expected: Multi-field validation with scrub
   - Verify: Tab stops work through all fields

8. **Test Format with Choices (`csvformat`)**
   - Type: `csvformat`
   - Press: `Tab`
   - Expected: Format function with dropdown
   - Verify: Dropdown shows: date, money, upper, lower, title, nohtml

### Edge Cases to Test

1. **IntelliSense Trigger**
   - Type partial prefix: `cp`
   - Press: `Ctrl+Space`
   - Verify: Snippet suggestions appear

2. **Multiple Snippets in Same File**
   - Insert several snippets
   - Verify: No conflicts or issues

3. **Snippet in Wrong File Type**
   - Try HTML snippet in JS file
   - Verify: Should not appear in suggestions

4. **Undo After Snippet**
   - Insert snippet
   - Press: `Ctrl+Z`
   - Verify: Entire snippet is removed

---

## Common Issues

### Snippets Not Appearing

**Problem**: Typing prefix doesn't show snippet

**Solutions**:
1. Check file language mode (bottom right of VSCode)
2. Ensure IntelliSense is enabled: Settings → `editor.quickSuggestions`
3. Try `Ctrl+Space` to manually trigger suggestions
4. Reload VSCode window: `Ctrl+Shift+P` → "Developer: Reload Window"

### Tab Stops Not Working

**Problem**: Tab doesn't jump between placeholders

**Solutions**:
1. Ensure you're pressing Tab immediately after snippet expands
2. Check if another extension is intercepting Tab key
3. Try `Ctrl+Shift+P` → "Insert Snippet" to manually insert

### Extension Not Loading

**Problem**: Extension doesn't appear in Extensions panel

**Solutions**:
1. Check Extensions panel: `Ctrl+Shift+X`
2. Search for "core.js"
3. Verify installation: Should show "Installed"
4. Check for errors: `Ctrl+Shift+P` → "Developer: Show Running Extensions"

---

## Success Criteria

Extension is working correctly if:

- ✅ All snippet prefixes trigger expansion
- ✅ Tab stops navigate correctly through placeholders
- ✅ Linked placeholders update together (e.g., templateName)
- ✅ Choice dropdowns appear for format options
- ✅ Snippets only appear in correct file types
- ✅ IntelliSense shows snippet descriptions
- ✅ Undo removes entire snippet

---

## Quick Test Script

Run through these 5 snippets to verify basic functionality:

1. **HTML**: `cpk` → Should expand to pocket
2. **HTML**: `ctplc` → Should expand to template with clone
3. **HTML**: `cdata` → Should expand to data directive
4. **JS**: `cudinit` → Should expand to init hook
5. **JS**: `cbeget` → Should expand to getData call

If all 5 work, the extension is functional.

---

## Reporting Issues

If you find issues:

1. Note the snippet prefix that failed
2. Note the file type you were in
3. Check VSCode Developer Console: `Help → Toggle Developer Tools`
4. Look for errors in Console tab
5. Report with error message and steps to reproduce
