#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');

// Source Map Generator (built-in)
class SourceMapGenerator {
    constructor() {
        this.version = 3;
        this.file = '';
        this.sourceRoot = '';
        this.sources = [];
        this.names = [];
        this.mappings = '';
        this.sourcesContent = [];
    }

    generateMap(jsFilePath, sourceFilePath) {
        const jsContent = fs.readFileSync(jsFilePath, 'utf8');
        const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
        
        this.file = path.basename(jsFilePath);
        this.sources = [path.basename(sourceFilePath)];
        this.sourcesContent = [sourceContent];
        
        // Generate basic mappings (line 1:1 -> 1:1 for each line)
        const lines = jsContent.split('\n');
        const mappings = [];
        
        for (let i = 0; i < lines.length; i++) {
            if (i === 0) {
                mappings.push('AAAA');
            } else {
                mappings.push(';AACA');
            }
        }
        
        this.mappings = mappings.join('');
        return this.toJSON();
    }

    toJSON() {
        return {
            version: this.version,
            file: this.file,
            sourceRoot: this.sourceRoot,
            sources: this.sources,
            names: this.names,
            mappings: this.mappings,
            sourcesContent: this.sourcesContent
        };
    }

    addSourceMapComment(jsFilePath, mapFilePath) {
        const jsContent = fs.readFileSync(jsFilePath, 'utf8');
        const mapFileName = path.basename(mapFilePath);
        const sourceMapComment = `\n//# sourceMappingURL=${mapFileName}`;
        
        fs.writeFileSync(jsFilePath, jsContent + sourceMapComment);
    }
}

const args = process.argv.slice(2);
const portFlag = args.find(f => f.startsWith('--port='));
const port = portFlag ? parseInt(portFlag.split('=')[1]) : 3000;
const dir = args[0] || '.';

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║               core-dev                ║
║                                       ║
╚═══════════════════════════════════════╝
`);

if (args.includes('-h') || args.includes('--help')) {
    console.log(`
Usage: core-dev [directory] [options]

Options:
  --port=<port>     Port to run server on (default: 3000)
  --sourcemap       Generate source map for core.js
  -h, --help        Show this help message

Examples:
  core-dev                    # Serve current directory on port 3000
  core-dev ./dist             # Serve ./dist directory
  core-dev --port=8080        # Serve on port 8080
  core-dev --sourcemap        # Generate source map for core.js

Features:
  • Static file server
  • Hot Module Replacement (HMR) for core.js
  • CSS hot reloading without page refresh
  • Intelligent reload based on file type
  • WebSocket-based live updates
  • State preservation during core.js hot reload
  • Source map generation for debugging
  • Toggle hot reload with Ctrl+Shift+H
`);
    process.exit(0);
}

// Handle source map generation
if (args.includes('--sourcemap')) {
    const coreJsPath = path.join(rootDir, 'core.js');
    const sourceJsPath = path.join(rootDir, 'core.src.js');
    
    if (fs.existsSync(coreJsPath) && fs.existsSync(sourceJsPath)) {
        const generator = new SourceMapGenerator();
        const sourceMap = generator.generateMap(coreJsPath, sourceJsPath);
        const mapFilePath = coreJsPath + '.map';
        
        fs.writeFileSync(mapFilePath, JSON.stringify(sourceMap, null, 2));
        generator.addSourceMapComment(coreJsPath, mapFilePath);
        
        console.log('✅ Source map generated for core.js');
        console.log(`   Map file: ${mapFilePath}`);
        console.log(`   Source map comment added to: ${coreJsPath}`);
    } else {
        console.log('❌ Could not find core.js and core.src.js in the current directory');
        console.log('   Make sure both files exist to generate source maps');
    }
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
    '.eot': 'application/vnd.ms-fontobject',
    '.map': 'application/json'
};

// Hot reload script to inject
const hotReloadScript = `
<script>
(function() {
    const ws = new WebSocket('ws://localhost:${port}');
    let isHotReloadEnabled = true;
    
    // Hot Module Replacement for core.js
    const hotReplaceModule = (moduleName, newContent) => {
        try {
            if (moduleName === 'core.js') {
                // Create a sandbox for the new core.js
                const script = document.createElement('script');
                script.textContent = newContent;
                script.id = 'core-js-hot-reload';
                
                // Remove previous hot-reload script
                const oldScript = document.getElementById('core-js-hot-reload');
                if (oldScript) oldScript.remove();
                
                // Preserve current state
                const currentCore = window.core;
                const currentData = {};
                if (currentCore) {
                    // Save current data registry
                    Object.keys(currentCore.cr || {}).forEach(key => {
                        if (typeof currentCore.cr[key] === 'function') {
                            try {
                                currentData[key] = currentCore.cr.getData(key);
                            } catch (e) {
                                console.warn('Could not save data for:', key);
                            }
                        }
                    });
                }
                
                document.head.appendChild(script);
                
                // Restore data if available
                setTimeout(() => {
                    if (window.core && window.core.cr) {
                        Object.keys(currentData).forEach(key => {
                            try {
                                window.core.cr.setData(key, currentData[key]);
                            } catch (e) {
                                console.warn('Could not restore data for:', key);
                            }
                        });
                        console.log('🔥 Hot reloaded core.js with state preservation');
                    }
                }, 100);
            }
        } catch (e) {
            console.error('Hot reload failed:', e);
            // Fallback to full page reload
            window.location.reload();
        }
    };
    
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'reload') {
                if (isHotReloadEnabled && data.file && data.file.endsWith('core.js')) {
                    console.log('🔥 Hot reloading core.js...');
                    fetch(data.file)
                        .then(response => response.text())
                        .then(content => hotReplaceModule('core.js', content))
                        .catch(() => {
                            console.log('🔄 Hot reload failed, reloading page...');
                            window.location.reload();
                        });
                } else {
                    console.log('🔄 File changed, reloading...');
                    window.location.reload();
                }
            } else if (data.type === 'css-change') {
                // Hot reload CSS without page refresh
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                links.forEach(link => {
                    if (link.href.includes(data.file)) {
                        const newUrl = link.href.split('?')[0] + '?t=' + Date.now();
                        link.href = newUrl;
                        console.log('🎨 Hot reloaded CSS:', data.file);
                    }
                });
            }
        } catch (e) {
            console.log('🔄 File changed, reloading...');
            window.location.reload();
        }
    };
    
    ws.onopen = () => {
        console.log('✓ Hot reload connected');
        // Enable/disable hot reload with keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                isHotReloadEnabled = !isHotReloadEnabled;
                console.log(\`Hot reload \${isHotReloadEnabled ? 'enabled' : 'disabled'}\`);
            }
        });
    };
    ws.onerror = () => console.log('✗ Hot reload connection failed');
})();
</script>
`;

// File watcher
const watcher = chokidar.watch(rootDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

// Function to find available port
function findAvailablePort(startPort, maxAttempts = 10) {
    return new Promise((resolve, reject) => {
        const testServer = http.createServer();
        let currentPort = startPort;
        let attempts = 0;

        const tryPort = () => {
            if (attempts >= maxAttempts) {
                reject(new Error(`No available ports found from ${startPort} to ${startPort + maxAttempts - 1}`));
                return;
            }

            testServer.listen(currentPort, () => {
                testServer.close(() => {
                    resolve(currentPort);
                });
            });

            testServer.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    attempts++;
                    currentPort++;
                    testServer.close(() => {
                        tryPort();
                    });
                } else {
                    reject(err);
                }
            });
        };

        tryPort();
    });
}

// Start server with port fallback
async function startServer() {
    let actualPort = port;
    
    try {
        // Try to find available port starting from the specified port
        actualPort = await findAvailablePort(port);
        
        if (actualPort !== port) {
            console.log(`⚠️  Port ${port} is in use, using port ${actualPort} instead`);
        }
        
        // Update hot reload script with actual port
        const hotReloadScriptWithPort = hotReloadScript.replace('${port}', actualPort);
        
        // Create a new server instance with the updated script
        const serverWithHotReload = http.createServer((req, res) => {
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
                        const injected = html.replace('</body>', `${hotReloadScriptWithPort}</body>`);
                        res.end(injected);
                    } else {
                        res.end(content);
                    }
                }
            });
        });
        
        // WebSocket Server for hot reload
        const wssWithPort = new WebSocket.Server({ server: serverWithHotReload });
        
        wssWithPort.on('connection', (ws) => {
            console.log('🔌 Client connected');
            
            ws.on('close', () => {
                console.log('🔌 Client disconnected');
            });
        });
        
        // File watcher (reuse existing logic)
        watcher.on('change', (filePath) => {
            const relativePath = path.relative(rootDir, filePath);
            const ext = path.extname(filePath);
            
            console.log(`📝 Changed: ${relativePath}`);
            
            // Broadcast appropriate message to all connected clients
            wssWithPort.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    let message;
                    
                    if (ext === '.css') {
                        // Hot reload CSS
                        message = JSON.stringify({
                            type: 'css-change',
                            file: relativePath
                        });
                    } else if (relativePath.endsWith('core.js')) {
                        // Hot reload core.js
                        message = JSON.stringify({
                            type: 'reload',
                            file: relativePath,
                            hotReload: true
                        });
                    } else {
                        // Regular reload for other files
                        message = JSON.stringify({
                            type: 'reload',
                            file: relativePath
                        });
                    }
                    
                    client.send(message);
                }
            });
        });
        
        watcher.on('add', (filePath) => {
            const relativePath = path.relative(rootDir, filePath);
            console.log(`➕ Added: ${relativePath}`);
            
            wssWithPort.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('reload');
                }
            });
        });
        
        watcher.on('unlink', (filePath) => {
            const relativePath = path.relative(rootDir, filePath);
            console.log(`➖ Removed: ${relativePath}`);
            
            wssWithPort.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('reload');
                }
            });
        });
        
        serverWithHotReload.listen(actualPort, () => {
            console.log(`
✅ Server running!

  Local:   http://localhost:${actualPort}
  Serving: ${rootDir}

📝 Watching for file changes...
🔄 Hot reload enabled

Press Ctrl+C to stop
`);
        });
        
        // Update graceful shutdown to use the new server
        process.on('SIGINT', () => {
            console.log('\n\n👋 Shutting down...');
            watcher.close();
            serverWithHotReload.close();
            process.exit(0);
        });
        
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
}

// Start server
startServer();
