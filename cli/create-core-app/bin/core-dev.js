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
}

// Configuration
const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    watchDirs: ['.', 'components'],
    excludePatterns: ['node_modules', '.git', '*.log'],
    openBrowser: process.env.OPEN_BROWSER !== 'false'
};

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Get MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// Serve file with optional source map
function serveFile(res, filePath) {
    try {
        const content = fs.readFileSync(filePath);
        const mimeType = getMimeType(filePath);
        
        // Generate source map for JS files
        if (mimeType === 'text/javascript') {
            const sourceMapGenerator = new SourceMapGenerator();
            const sourceMap = sourceMapGenerator.generateMap(filePath, filePath);
            
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Length', content.length);
            
            // Add source map comment
            const contentWithMap = content + `\n//# sourceMappingURL=${path.basename(filePath)}.map`;
            res.end(contentWithMap);
            
            // Write source map file
            const mapPath = filePath + '.map';
            fs.writeFileSync(mapPath, JSON.stringify(sourceMap, null, 2));
        } else {
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Length', content.length);
            res.end(content);
        }
    } catch (error) {
        console.error(`Error serving ${filePath}:`, error.message);
        res.statusCode = 404;
        res.end('Not Found');
    }
}

// Create HTTP server
const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url);
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
    }
    
    // Handle 404 for missing files
    if (!fs.existsSync(filePath)) {
        // Try to find index.html in directory
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        
        if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
    }
    
    serveFile(res, filePath);
});

// WebSocket server for hot reload
const wss = new WebSocket.Server({ port: 3001 });

// File watcher
const watcher = chokidar.watch(config.watchDirs, {
    ignored: config.excludePatterns,
    persistent: true
});

watcher.on('change', (filePath) => {
    console.log(`📝 File changed: ${path.relative(process.cwd(), filePath)}`);
    
    // Notify all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'reload', file: filePath }));
        }
    });
});

watcher.on('add', (filePath) => {
    console.log(`➕ File added: ${path.relative(process.cwd(), filePath)}`);
    
    // Notify all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'reload', file: filePath }));
        }
    });
});

watcher.on('unlink', (filePath) => {
    console.log(`➖ File removed: ${path.relative(process.cwd(), filePath)}`);
    
    // Notify all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'reload', file: filePath }));
        }
    });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('🔌 Client connected for hot reload');
    
    ws.on('close', () => {
        console.log('🔌 Client disconnected');
    });
});

// Start server
server.listen(config.port, config.host, () => {
    console.log(`🚀 Development server running at http://${config.host}:${config.port}`);
    console.log(`📁 Watching: ${config.watchDirs.join(', ')}`);
    console.log(`🔌 Hot reload enabled on port 3001`);
    
    // Open browser if requested
    if (config.openBrowser) {
        const { spawn } = require('child_process');
        const url = `http://${config.host}:${config.port}`;
        
        switch (process.platform) {
            case 'darwin': // macOS
                spawn('open', [url]);
                break;
            case 'win32': // Windows
                spawn('start', [url], { shell: true });
                break;
            default: // Linux
                spawn('xdg-open', [url]);
                break;
        }
    }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down development server...');
    server.close();
    wss.close();
    watcher.close();
    process.exit(0);
});

// Handle errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${config.port} is already in use. Try a different port or close the other process.`);
    } else {
        console.error('❌ Server error:', error);
    }
    process.exit(1);
});

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║               core-dev                 ║
║                                       ║
╚═══════════════════════════════════════╝

Development server with hot reload for core.js applications.

Starting server...
`);
