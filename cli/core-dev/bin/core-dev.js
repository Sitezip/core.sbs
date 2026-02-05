#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');

const args = process.argv.slice(2);
const portFlag = args.find(f => f.startsWith('--port='));
const port = portFlag ? parseInt(portFlag.split('=')[1]) : 3000;
const dir = args[0] || '.';

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║          🚀 core-dev                  ║
║                                       ║
╚═══════════════════════════════════════╝
`);

if (args.includes('-h') || args.includes('--help')) {
    console.log(`
Usage: core-dev [directory] [options]

Options:
  --port=<port>     Port to run server on (default: 3000)
  -h, --help        Show this help message

Examples:
  core-dev                    # Serve current directory on port 3000
  core-dev ./dist             # Serve ./dist directory
  core-dev --port=8080        # Serve on port 8080

Features:
  • Static file server
  • Hot reload on file changes
  • No build step required
  • WebSocket-based live updates
`);
    process.exit(0);
}

const rootDir = path.resolve(dir);

if (!fs.existsSync(rootDir)) {
    console.error(`❌ Error: Directory "${rootDir}" does not exist.`);
    process.exit(1);
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Hot reload script to inject
const hotReloadScript = `
<script>
(function() {
    const ws = new WebSocket('ws://localhost:${port}');
    ws.onmessage = (event) => {
        if (event.data === 'reload') {
            console.log('🔄 File changed, reloading...');
            window.location.reload();
        }
    };
    ws.onopen = () => console.log('✓ Hot reload connected');
    ws.onerror = () => console.log('✗ Hot reload connection failed');
})();
</script>
`;

// HTTP Server
const server = http.createServer((req, res) => {
    let filePath = path.join(rootDir, req.url === '/' ? 'index.html' : req.url);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            
            // Inject hot reload script into HTML files
            if (ext === '.html') {
                const html = content.toString();
                const injected = html.replace('</body>', `${hotReloadScript}</body>`);
                res.end(injected);
            } else {
                res.end(content);
            }
        }
    });
});

// WebSocket Server for hot reload
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('🔌 Client connected');
    
    ws.on('close', () => {
        console.log('🔌 Client disconnected');
    });
});

// File watcher
const watcher = chokidar.watch(rootDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

watcher.on('change', (filePath) => {
    const relativePath = path.relative(rootDir, filePath);
    console.log(`📝 Changed: ${relativePath}`);
    
    // Broadcast reload to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
});

watcher.on('add', (filePath) => {
    const relativePath = path.relative(rootDir, filePath);
    console.log(`➕ Added: ${relativePath}`);
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
});

watcher.on('unlink', (filePath) => {
    const relativePath = path.relative(rootDir, filePath);
    console.log(`➖ Removed: ${relativePath}`);
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
});

// Start server
server.listen(port, () => {
    console.log(`
✅ Server running!

  Local:   http://localhost:${port}
  Serving: ${rootDir}

📝 Watching for file changes...
🔄 Hot reload enabled

Press Ctrl+C to stop
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...');
    watcher.close();
    server.close();
    process.exit(0);
});
