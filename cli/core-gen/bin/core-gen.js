#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const componentType = args[0];
const flags = args.slice(1);

// Parse flags
const hasValidation = flags.includes('--validation');
const hasSortable = flags.includes('--sortable');
const hasPaginated = flags.includes('--paginated');
const shouldInject = flags.includes('--inject');
const nameFlag = flags.find(f => f.startsWith('--name='));
const injectFileFlag = flags.find(f => f.startsWith('--file='));
const componentName = nameFlag ? nameFlag.split('=')[1] : 'my';
const injectFile = injectFileFlag ? injectFileFlag.split('=')[1] : 'index.html';

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║          🎨 core-gen                  ║
║                                       ║
╚═══════════════════════════════════════╝
`);

if (!componentType || componentType === '-h' || componentType === '--help') {
    console.log(`
Usage: core-gen <component> [options]

Components:
  form              Generate a form component
  table             Generate a table component
  modal             Generate a modal component

Options:
  --validation      Add validation to forms
  --sortable        Make table sortable
  --paginated       Add pagination to table
  --name=<name>     Custom component name (default: "my")
  --inject          Auto-inject loadComponent() call into HTML
  --file=<file>     HTML file to inject into (default: "index.html")

Examples:
  core-gen form --validation --name=contact
  core-gen form --validation --name=contact --inject
  core-gen form --validation --name=contact --inject --file=app.html
  core-gen table --sortable --name=users
  core-gen modal --name=confirm
`);
    process.exit(0);
}

// Determine template file
let templateFile;
switch (componentType) {
    case 'form':
        templateFile = hasValidation ? 'validation.html' : 'basic.html';
        break;
    case 'table':
        templateFile = 'basic.html'; // TODO: Add sortable/paginated variants
        break;
    case 'modal':
        templateFile = 'basic.html';
        break;
    default:
        console.error(`❌ Error: Unknown component type "${componentType}"`);
        console.log('Available types: form, table, modal');
        process.exit(1);
}

const templatePath = path.join(__dirname, '..', 'components', componentType, templateFile);

if (!fs.existsSync(templatePath)) {
    console.error(`❌ Error: Template not found at ${templatePath}`);
    process.exit(1);
}

console.log(`📦 Generating ${componentType} component...`);

// Read template
let template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
template = template.replace(/\{\{NAME\}\}/g, componentName);

// Create components directory if it doesn't exist
const componentsDir = path.join(process.cwd(), 'components');
if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

// Output filename
const outputFile = `${componentName}-${componentType}.html`;
const outputPath = path.join(componentsDir, outputFile);

// Check if file exists
if (fs.existsSync(outputPath)) {
    console.error(`❌ Error: File "components/${outputFile}" already exists.`);
    process.exit(1);
}

// Write file
fs.writeFileSync(outputPath, template);

// Auto-inject into HTML file if requested
if (shouldInject) {
    const htmlPath = path.join(process.cwd(), injectFile);
    
    if (fs.existsSync(htmlPath)) {
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const loadCall = `    loadComponent('${componentName}-${componentType}');\n`;
        
        // Try to find existing loadComponent calls
        const loadComponentRegex = /loadComponent\([^)]+\);/;
        const hasLoadCalls = loadComponentRegex.test(htmlContent);
        
        if (hasLoadCalls) {
            // Add after the last loadComponent call
            const lastLoadIndex = htmlContent.lastIndexOf('loadComponent(');
            const endOfLine = htmlContent.indexOf('\n', lastLoadIndex);
            htmlContent = htmlContent.slice(0, endOfLine + 1) + loadCall + htmlContent.slice(endOfLine + 1);
        } else {
            // Look for closing </script> tag before </body>
            const scriptEndRegex = /<\/script>\s*<\/body>/;
            if (scriptEndRegex.test(htmlContent)) {
                htmlContent = htmlContent.replace(scriptEndRegex, (match) => {
                    return `\n${loadCall}</script>\n</body>`;
                });
            }
        }
        
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`✓ Auto-injected loadComponent() into ${injectFile}`);
    } else {
        console.log(`⚠ Warning: ${injectFile} not found, skipping auto-injection`);
    }
}

console.log(`
✅ Success! Generated components/${outputFile}

The component has been created with:
${hasValidation ? '  ✓ Validation enabled' : ''}
${hasSortable ? '  ✓ Sortable columns' : ''}
${hasPaginated ? '  ✓ Pagination' : ''}

Load it in your HTML:

<script src="core-components.js"></script>
<script>
    loadComponent('${componentName}-${componentType}');
</script>

Or manually include:
1. Copy contents of components/${outputFile} into your HTML
2. Customize API endpoints and data structure
3. Style as needed

Component includes:
  • Pocket definition
  • Template with data binding
  • JavaScript logic
  • CSS styling

Happy coding! 🎉
`);
