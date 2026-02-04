#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const projectName = args[0] || 'my-core-app';
const template = args.find(arg => arg.startsWith('--template='))?.split('=')[1] || 'default';

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║        🚀 create-core-app             ║
║                                       ║
╚═══════════════════════════════════════╝
`);

console.log(`Creating a new core.js app in ${projectName}/\n`);

// Create project directory
const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Directory "${projectName}" already exists.`);
    process.exit(1);
}

fs.mkdirSync(projectPath, { recursive: true });

// Copy template files
const templatePath = path.join(__dirname, '..', 'templates', template);

if (!fs.existsSync(templatePath)) {
    console.error(`❌ Error: Template "${template}" not found.`);
    process.exit(1);
}

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('📦 Copying template files...');
copyRecursive(templatePath, projectPath);

console.log(`
✅ Success! Created ${projectName} at ${projectPath}

Inside that directory, you can run:

  Open index.html in your browser to see your app

We suggest that you begin by:

  cd ${projectName}
  
Then open index.html in your browser to see the welcome page!

Optional: Install the VS Code extension for 56 code snippets:
  https://github.com/Sitezip/core.sbs/releases

Generate pre-built components:
  npx @core-js/gen form --validation
  npx @core-js/gen table --sortable

Happy coding! 🎉
`);
