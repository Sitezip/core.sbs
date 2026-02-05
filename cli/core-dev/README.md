# core-dev

Development server for core.js applications with hot reload.

## Features

- ✅ Static file server
- ✅ Hot reload on file changes
- ✅ No build step required
- ✅ WebSocket-based live updates
- ✅ Zero configuration

## Usage

### From npm (once published)

```bash
npx @core-js/dev
```

### Local Testing (before publishing)

From the root of the core.sbs repository:

```bash
node cli/core-dev/bin/core-dev.js
```

Or link it globally for testing:

```bash
cd cli/core-dev
npm install
npm link
cd ../..
core-dev
```

## Commands

**Start server in current directory:**
```bash
core-dev
```

**Start server in specific directory:**
```bash
core-dev ./my-app
```

**Use custom port:**
```bash
core-dev --port=8080
```

**Show help:**
```bash
core-dev -h
core-dev --help
```

## How It Works

1. **Static File Server** - Serves your files over HTTP
2. **File Watcher** - Monitors all files in the directory for changes
3. **WebSocket Connection** - Maintains live connection to browser
4. **Auto Reload** - Refreshes browser when files change

## What Gets Watched

The server watches for changes to:
- HTML files
- JavaScript files
- CSS files
- Component files
- Any other files in the directory

## Hot Reload Script

The server automatically injects a hot reload script into your HTML files:

```javascript
<script>
(function() {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (event) => {
        if (event.data === 'reload') {
            window.location.reload();
        }
    };
})();
</script>
```

This script:
- Connects to the WebSocket server
- Listens for reload messages
- Refreshes the page when files change

## Example Workflow

```bash
# Create a new app
node cli/create-core-app/bin/create-core-app.js my-app
cd my-app

# Start dev server
node ../cli/core-dev/bin/core-dev.js

# Open http://localhost:3000 in browser
# Edit files - browser auto-refreshes!
```

## Dependencies

- `chokidar` - File watcher
- `ws` - WebSocket server

## No Build Step

Unlike other dev servers, `core-dev`:
- ✅ Serves files as-is
- ✅ No compilation
- ✅ No bundling
- ✅ No transpilation

Just pure file serving with hot reload.

## License

MIT
