#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

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
║               core-gen                ║
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
  card              Generate a card component
  alert             Generate an alert component
  navbar            Generate a navigation bar
  badge             Generate a badge component
  button            Generate a button component
  breadcrumb        Generate a breadcrumb component
  tabs              Generate a tabs component
  accordion         Generate an accordion component
  pagination        Generate a pagination component
  spinner           Generate a loading spinner
  avatar            Generate an avatar component
  progressbar       Generate a progress bar
  dropdown          Generate a dropdown menu
  toast             Generate a toast notification

Options:
  --validation      Add form validation (form only)
  --sortable         Add sorting (table only)
  --paginated        Add pagination (table only)
  --inject           Inject into HTML file
  --name=<name>      Component name
  --file=<file>      Target HTML file (with --inject)

Examples:
  core-gen form --validation --name=contact
  core-gen table --sortable --paginated --name=users
  core-gen modal --name=confirm --inject --file=index.html
`);
    process.exit(0);
}

// Component templates
const templates = {
    form: {
        html: `<!-- Form Component -->
<div class="form-container" id="${componentName}-form">
    <form class="core-form" id="${componentName}-form-element">
        <div class="form-group">
            <label for="${componentName}-name">Name</label>
            <input type="text" id="${componentName}-name" name="name" required>
        </div>
        <div class="form-group">
            <label for="${componentName}-email">Email</label>
            <input type="email" id="${componentName}-email" name="email" required>
        </div>
        <div class="form-group">
            <label for="${componentName}-message">Message</label>
            <textarea id="${componentName}-message" name="message" rows="4"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>`,
        css: `/* Form Component Styles */
.form-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.core-form .form-group {
    margin-bottom: 1.5rem;
}

.core-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.core-form input,
.core-form textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.core-form input:focus,
.core-form textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
}`,
        js: hasValidation ? `// Form validation
document.getElementById('${componentName}-form-element').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('${componentName}-name').value;
    const email = document.getElementById('${componentName}-email').value;
    const message = document.getElementById('${componentName}-message').value;
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }
    
    console.log('Form submitted:', { name, email, message });
    alert('Form submitted successfully!');
});` : ''
    },
    
    table: {
        html: `<!-- Table Component -->
<div class="table-container" id="${componentName}-table">
    <table class="data-table" id="${componentName}-table-element">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Admin</td>
                <td>Active</td>
            </tr>
            <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>User</td>
                <td>Active</td>
            </tr>
            <tr>
                <td>Bob Johnson</td>
                <td>bob@example.com</td>
                <td>User</td>
                <td>Inactive</td>
            </tr>
        </tbody>
    </table>
</div>`,
        css: `/* Table Component Styles */
.table-container {
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.data-table th,
.data-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.data-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
}

.data-table tbody tr:hover {
    background: #f8f9fa;
}

.data-table td:nth-child(4) {
    font-weight: 500;
}

.data-table td:nth-child(4):contains('Active') {
    color: #28a745;
}

.data-table td:nth-child(4):contains('Inactive') {
    color: #dc3545;
}`,
        js: hasSortable ? `// Table sorting
document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('${componentName}-table-element');
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => sortTable(index));
    });
    
    function sortTable(columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent;
            const bValue = b.cells[columnIndex].textContent;
            return aValue.localeCompare(bValue);
        });
        
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }
});` : ''
    },
    
    modal: {
        html: `<!-- Modal Component -->
<div class="modal-overlay" id="${componentName}-modal-overlay">
    <div class="modal-container" id="${componentName}-modal">
        <div class="modal-header">
            <h3 class="modal-title">Modal Title</h3>
            <button class="modal-close" id="${componentName}-modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>This is the modal content. You can put anything here.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" id="${componentName}-modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="${componentName}-modal-confirm">Confirm</button>
        </div>
    </div>
</div>`,
        css: `/* Modal Component Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal-container {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal-overlay.active .modal-container {
    transform: scale(1);
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 2rem;
    height: 2rem;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}`,
        js: `// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('${componentName}-modal-overlay');
    const closeBtn = document.getElementById('${componentName}-modal-close');
    const cancelBtn = document.getElementById('${componentName}-modal-cancel');
    
    function openModal() {
        overlay.classList.add('active');
    }
    
    function closeModal() {
        overlay.classList.remove('active');
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Make openModal globally accessible
    window.openModal = openModal;
});`
    }
};

// Generate component
const template = templates[componentType];

if (!template) {
    console.error(`❌ Error: Component "${componentType}" not found.`);
    console.log('Run "core-gen --help" to see available components.');
    process.exit(1);
}

console.log(`🎨 Generating ${componentType} component...`);

// Create output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'components');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write HTML file
const htmlPath = path.join(outputDir, `${componentName}.html`);
fs.writeFileSync(htmlPath, template.html, 'utf8');
console.log(`✓ Created ${htmlPath}`);

// Write CSS file
const cssPath = path.join(outputDir, `${componentName}.css`);
fs.writeFileSync(cssPath, template.css, 'utf8');
console.log(`✓ Created ${cssPath}`);

// Write JS file if present
if (template.js) {
    const jsPath = path.join(outputDir, `${componentName}.js`);
    fs.writeFileSync(jsPath, template.js, 'utf8');
    console.log(`✓ Created ${jsPath}`);
}

// Inject into HTML file if requested
if (shouldInject) {
    const targetFile = path.join(process.cwd(), injectFile);
    
    if (!fs.existsSync(targetFile)) {
        console.error(`❌ Error: Target file "${injectFile}" not found.`);
        process.exit(1);
    }
    
    let content = fs.readFileSync(targetFile, 'utf8');
    
    // Add CSS link
    const cssLink = `    <link rel="stylesheet" href="components/${componentName}.css">`;
    content = content.replace('</head>', cssLink + '\n</head>');
    
    // Add JS script
    const jsScript = `    <script src="components/${componentName}.js"></script>`;
    content = content.replace('</body>', jsScript + '\n</body>');
    
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`✓ Injected component into ${targetFile}`);
}

console.log(`
✅ Success! Component generated in components/ folder.

Usage:
- Link CSS: <link rel="stylesheet" href="components/${componentName}.css">
- Include HTML: Copy from components/${componentName}.html
- Add JS: <script src="components/${componentName}.js"></script>
`);
