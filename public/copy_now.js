const fs = require('fs');
const path = require('path');

// Files to copy
const files = [
    'banner.png',
    'avatar.png', 
    'favicon.png',
    'hero_bg.png',
    'core.svg'
];

console.log('Copying assets...');

files.forEach(file => {
    const src = path.join(__dirname, '..', file);
    const dest = path.join(__dirname, file);
    
    try {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`✅ Copied ${file}`);
        } else {
            console.log(`❌ Source ${file} not found`);
        }
    } catch (err) {
        console.log(`❌ Error copying ${file}:`, err.message);
    }
});

console.log('Done!');
