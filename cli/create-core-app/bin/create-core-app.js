#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const projectName = args[0] || 'my-core-app';
const template = args.find(arg => arg.startsWith('--template='))?.split('=')[1] || 'default';

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
║        🚀 create-core-app             ║
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
  npx @core-js/gen form --validation --name=contact
  npx @core-js/gen table --name=users
  npx @core-js/gen modal --name=confirm
`);
    }

    if (!wantsDevServer) {
        console.log(`
To start the dev server:
  cd ${projectName}
  npx @core-js/dev

Happy coding! 🎉
`);
    } else {
        console.log(`
🚀 Starting dev server...

`);
        
        // Find the core-dev script
        // Try node_modules first (when installed via npm), then fallback to local dev path
        let coreDevPath = path.join(__dirname, '..', 'node_modules', '@core-js', 'dev', 'bin', 'core-dev.js');
        if (!fs.existsSync(coreDevPath)) {
            // Fallback for local development
            coreDevPath = path.join(__dirname, '..', '..', 'core-dev', 'bin', 'core-dev.js');
        }
        
        // Start the dev server
        const devServer = spawn('node', [coreDevPath], {
            cwd: projectPath,
            stdio: 'inherit',
            shell: true
        });
        
        devServer.on('error', (err) => {
            console.error(`❌ Failed to start dev server: ${err.message}`);
            console.log(`
You can start it manually:
  cd ${projectName}
  npx @core-js/dev
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
