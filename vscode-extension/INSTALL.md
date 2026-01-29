# Installation Guide

## Option 1: Install from VSIX (Local Development)

### Prerequisites
- Node.js and npm installed
- Visual Studio Code installed

### Steps

1. **Install vsce (VSCode Extension Manager)**
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Navigate to extension directory**
   ```bash
   cd vscode-extension
   ```

3. **Package the extension**
   ```bash
   vsce package
   ```
   This creates a `.vsix` file (e.g., `corejs-snippets-1.0.0.vsix`)

4. **Install in VSCode**
   - Open VSCode
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX"
   - Select the generated `.vsix` file

5. **Reload VSCode**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
   - Type "Developer: Reload Window"

### Verify Installation

1. Open an HTML file
2. Type `cpk` and press Tab
3. You should see the pocket snippet expand

---

## Option 2: Install from Marketplace (Future)

Once published to the VSCode Marketplace:

1. Open VSCode
2. Click Extensions icon (or press `Ctrl+Shift+X`)
3. Search for "core.js Snippets"
4. Click Install

---

## Option 3: Development Mode

For active development and testing:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sitezip/core.sbs.git
   cd core.sbs/vscode-extension
   ```

2. **Open in VSCode**
   ```bash
   code .
   ```

3. **Press F5 to launch Extension Development Host**
   - This opens a new VSCode window with the extension loaded
   - Make changes to snippet files
   - Reload the Extension Development Host to test changes

---

## Publishing to Marketplace

### Prerequisites
- Microsoft account
- Azure DevOps organization
- Personal Access Token (PAT)

### Steps

1. **Create a publisher**
   ```bash
   vsce create-publisher <publisher-name>
   ```

2. **Login**
   ```bash
   vsce login <publisher-name>
   ```

3. **Publish**
   ```bash
   vsce publish
   ```

### Update package.json publisher field
Before publishing, update the `publisher` field in `package.json` to match your publisher name.

---

## Troubleshooting

### Extension not showing snippets
- Verify the extension is installed: Check Extensions panel
- Reload VSCode window
- Check file language mode (bottom right of VSCode)

### Snippets not expanding
- Ensure you're in the correct file type (HTML or JavaScript)
- Check that IntelliSense is enabled in settings
- Try typing the prefix and pressing `Ctrl+Space` to trigger suggestions

### VSIX packaging fails
- Ensure all required files are present
- Check `package.json` for syntax errors
- Verify `.vscodeignore` is not excluding necessary files

---

## Uninstalling

1. Open Extensions panel (`Ctrl+Shift+X`)
2. Find "core.js Snippets"
3. Click the gear icon
4. Select "Uninstall"

---

## Testing Snippets

### HTML Snippets
Create a test file `test.html`:

```html
<!DOCTYPE html>
<html>
<body>
    <!-- Type: cpk -->
    
</body>
</html>
```

Type `cpk` and press Tab to test.

### JavaScript Snippets
Create a test file `test.js`:

```javascript
// Type: cudinit

```

Type `cudinit` and press Tab to test.

---

## Next Steps

After installation:
1. Review the [README.md](README.md) for snippet reference
2. Check [SNIPPETS.md](SNIPPETS.md) for detailed examples
3. Read [ROADMAP.md](ROADMAP.md) for future features
4. Visit [core.sbs](https://core.sbs) for framework documentation
