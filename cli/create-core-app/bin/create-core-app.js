#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const projectName = args[0] || 'my-core-app';
const template = args.find(arg => arg.startsWith('--template='))?.split('=')[1] || 'default';

// Embedded templates for standalone installation
const templates = {
    default: {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>core.sbs - Smoke Test</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="logo">core.sbs</div>
        <h1>It works!</h1>
        <p>A lightweight, progressive JavaScript framework</p>
        
        <div class="counter-box">
            <div class="counter" id="counter">0</div>
            <div class="counter-label">Live Counter</div>
        </div>
        
        <div class="buttons">
            <button class="btn" onclick="increment()">+</button>
            <button class="btn btn-secondary" onclick="decrement()">-</button>
            <button class="btn btn-secondary" onclick="reset()">Reset</button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/gh/Sitezip/core.sbs/core.js"></script>
    <script>
        let count = 0;
        const counterEl = document.getElementById('counter');
        
        function updateDisplay() {
            counterEl.textContent = count;
        }
        
        function increment() {
            count++;
            updateDisplay();
        }
        
        function decrement() {
            count--;
            updateDisplay();
        }
        
        function reset() {
            count = 0;
            updateDisplay();
        }
    </script>
</body>
</html>`,
        'styles.css': `/* core.sbs Smoke Test Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.container {
    text-align: center;
    padding: 2rem;
}

.logo {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #10b981, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #10b981;
}

p {
    font-size: 1.1rem;
    opacity: 0.7;
    margin-bottom: 3rem;
}

.counter-box {
    background: rgba(16, 185, 129, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem 4rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.counter {
    font-size: 5rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
    color: #10b981;
    text-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
}

.counter-label {
    font-size: 0.9rem;
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 60px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
    background: rgba(6, 182, 212, 0.2);
    color: #06b6d4;
    border: 1px solid rgba(6, 182, 212, 0.3);
}

.btn-secondary:hover {
    background: rgba(6, 182, 212, 0.3);
    box-shadow: 0 10px 30px rgba(6, 182, 212, 0.2);
}

@media (max-width: 480px) {
    .logo { font-size: 2rem; }
    h1 { font-size: 1.5rem; }
    .counter { font-size: 3rem; }
    .counter-box { padding: 1.5rem 2rem; }
    .buttons { flex-direction: column; }
    .btn { width: 100%; }
}`,
        'core-components.js': `/**
 * core-components.js
 * Component loader for core.js applications
 * No build step required - just include this script
 */

(function() {
    'use strict';
    
    // Component cache
    const componentCache = {};
    
    /**
     * Load a component from the components/ folder
     * @param {string} componentName - Name of the component file (without .html extension)
     * @returns {Promise<void>}
     */
    window.loadComponent = async function(componentName) {
        // Check cache first
        if (componentCache[componentName]) {
            console.log(\`✓ Component "\${componentName}" already loaded\`);
            return;
        }
        
        try {
            const response = await fetch(\`components/\${componentName}.html\`);
            
            if (!response.ok) {
                throw new Error(\`Failed to load component: \${response.statusText}\`);
            }
            
            const html = await response.text();
            
            // Create a temporary container to parse the HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Extract and inject templates into cr-data section
            const templates = temp.querySelectorAll('template');
            const crData = document.getElementById('cr-data');
            
            if (crData && templates.length > 0) {
                templates.forEach(template => {
                    crData.appendChild(template.cloneNode(true));
                });
            }
            
            // Extract and inject styles
            const styles = temp.querySelectorAll('style');
            styles.forEach(style => {
                document.head.appendChild(style.cloneNode(true));
            });
            
            // Extract and inject scripts
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
            });
            
            // Mark as loaded
            componentCache[componentName] = true;
            console.log(\`✓ Component "\${componentName}" loaded successfully\`);
            
        } catch (error) {
            console.error(\`❌ Failed to load component "\${componentName}":\`, error);
        }
    };
    
    // Auto-load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 core-components.js loaded');
        });
    } else {
        console.log('🚀 core-components.js loaded');
    }
})();`,
        'README.md': `# Your Core.js App

Welcome to your new core.js application!

## Getting Started

1. **Open index.html in your browser**
   - No build step required!
   - Just double-click the file or serve it with a web server

2. **Start development (optional)**
   \`\`\`bash
   # If you installed the CLI tools:
   core-dev
   
   # Or open directly in browser
   \`\`\`

## What's Included

- ✅ **Core.js Framework** - Modern client-side rendering
- ✅ **Hot Reload Ready** - Use core-dev for live updates
- ✅ **Component System** - Modular architecture
- ✅ **Responsive Design** - Mobile-friendly styles

## Learn More

- [Core.js Documentation](https://github.com/Sitezip/core.sbs)
- [VS Code Extension](https://github.com/Sitezip/core.sbs/releases)
- [Component Generator](https://github.com/Sitezip/core.sbs/tree/main/cli/core-gen)

## Next Steps

1. Edit \`index.html\` to build your app
2. Create components in the \`components/\` folder
3. Use \`core-gen\` to generate pre-built components:
   \`\`\`bash
   core-gen form --validation
   core-gen table --sortable
   \`\`\`

Happy coding! 🚀`
    }
};

// Create readline interface for prompts
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify question
function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.toLowerCase().trim());
        });
    });
}

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║            create-core-app            ║
║                                       ║
╚═══════════════════════════════════════╝
`);

async function main() {
    console.log(`Creating a new core.js app in ${projectName}/\n`);

    // Ask user preferences
    console.log('📋 Let\'s configure your project:\n');
    
    const installDevServer = await ask('Install dev server with hot reload? (Y/n): ');
    const wantsDevServer = installDevServer === '' || installDevServer === 'y' || installDevServer === 'yes';
    
    const installComponentGen = await ask('Install component generator? (Y/n): ');
    const wantsComponentGen = installComponentGen === '' || installComponentGen === 'y' || installComponentGen === 'yes';
    
    const enableRoutingAnswer = await ask('Enable routing? (Y/n): ');
    const wantsRouting = enableRoutingAnswer === '' || enableRoutingAnswer === 'y' || enableRoutingAnswer === 'yes';
    
    rl.close();
    
    console.log('');

    // Create project directory
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.error(`❌ Error: Directory "${projectName}" already exists.`);
        process.exit(1);
    }

    fs.mkdirSync(projectPath, { recursive: true });

    // Copy template files from embedded templates
    const templateData = templates[template];

    if (!templateData) {
        console.error(`❌ Error: Template "${template}" not found.`);
        process.exit(1);
    }

    console.log('📦 Creating template files...');
    
    // Write each template file
    Object.entries(templateData).forEach(([filename, content]) => {
        const filePath = path.join(projectPath, filename);
        fs.writeFileSync(filePath, content);
        console.log(`   ✓ Created ${filename}`);
    });

    // Update routing in index.html based on user choice
    const indexPath = path.join(projectPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        if (!wantsRouting) {
            indexContent = indexContent.replace('core.useRouting = true;', 'core.useRouting = false;');
        }
        fs.writeFileSync(indexPath, indexContent);
    }

    console.log(`
✅ Success! Created ${projectName} at ${projectPath}

Optional: Install the VS Code extension for 56 code snippets:
  https://github.com/Sitezip/core.sbs/releases
`);

    if (wantsComponentGen) {
        console.log(`
📦 Component generator available!

Generate pre-built components:
  core-gen form --validation --name=contact
  core-gen table --name=users
  core-gen modal --name=confirm
`);
    }

    if (!wantsDevServer) {
        console.log(`
To start the dev server:
  cd ${projectName}
  core-dev

Happy coding! 🎉
`);
    } else {
        console.log(`
🚀 Starting dev server...

`);
        
        // Start dev server
        const coreDevPath = path.join(process.env.USERPROFILE || process.env.HOME, '.core-sbs', 'core-dev.js');
        console.log('Dev server path:', coreDevPath);
        
        const devServer = spawn('node', [coreDevPath], {
            cwd: projectPath,
            stdio: 'inherit',
            shell: true
        });
        
        devServer.on('error', (err) => {
            console.error(`❌ Failed to start dev server: ${err.message}`);
            console.log(`
Make sure core-dev is installed:
  npm install -g @core.sbs/create-core-app

Or start it manually:
  cd ${projectName}
  core-dev
`);
        });
        
        // Handle Ctrl+C
        process.on('SIGINT', () => {
            devServer.kill();
            process.exit(0);
        });
    }
}

// Run main function
main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
