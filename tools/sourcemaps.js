#!/usr/bin/env node

/**
 * Source Map Generator for core.js
 * Generates source maps for better debugging experience
 */

const fs = require('fs');
const path = require('path');

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

    /**
     * Generates a source map for the given JavaScript file
     * @param {string} jsFilePath - Path to the JavaScript file
     * @param {string} sourceFilePath - Path to the original source file
     */
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
                // First line: position 0,0 maps to 0,0
                mappings.push('AAAA');
            } else {
                // Subsequent lines: position at start of line maps to same line in source
                mappings.push(';AACA');
            }
        }
        
        this.mappings = mappings.join('');
        
        return this.toJSON();
    }

    /**
     * Converts the source map to JSON format
     */
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

    /**
     * Adds source map comment to the JavaScript file
     * @param {string} jsFilePath - Path to the JavaScript file
     * @param {string} mapFilePath - Path to the source map file
     */
    addSourceMapComment(jsFilePath, mapFilePath) {
        const jsContent = fs.readFileSync(jsFilePath, 'utf8');
        const mapFileName = path.basename(mapFilePath);
        const sourceMapComment = `\n//# sourceMappingURL=${mapFileName}`;
        
        fs.writeFileSync(jsFilePath, jsContent + sourceMapComment);
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log(`
Usage: node sourcemaps.js <js-file> <source-file> [options]

Options:
  --inline     Inline the source map in the JS file
  --output     Output directory for the source map file

Examples:
  node sourcemaps.js core.js core.src.js
  node sourcemaps.js core.js core.src.js --inline
  node sourcemaps.js core.js core.src.js --output ./dist
        `);
        process.exit(1);
    }

    const jsFile = args[0];
    const sourceFile = args[1];
    const isInline = args.includes('--inline');
    const outputDir = args.includes('--output') ? args[args.indexOf('--output') + 1] : './';

    if (!fs.existsSync(jsFile) || !fs.existsSync(sourceFile)) {
        console.error('❌ Error: One or both files do not exist.');
        process.exit(1);
    }

    const generator = new SourceMapGenerator();
    const sourceMap = generator.generateMap(jsFile, sourceFile);
    
    if (isInline) {
        // Inline source map as base64
        const base64Map = Buffer.from(JSON.stringify(sourceMap)).toString('base64');
        const sourceMapComment = `\n//# sourceMappingURL=data:application/json;base64,${base64Map}`;
        
        const jsContent = fs.readFileSync(jsFile, 'utf8');
        fs.writeFileSync(jsFile, jsContent + sourceMapComment);
        console.log('✅ Source map inlined in', jsFile);
    } else {
        // Write separate source map file
        const mapFileName = jsFile.replace('.js', '.js.map');
        const mapFilePath = path.join(outputDir, path.basename(mapFileName));
        
        fs.writeFileSync(mapFilePath, JSON.stringify(sourceMap, null, 2));
        generator.addSourceMapComment(jsFile, mapFilePath);
        
        console.log('✅ Source map generated:', mapFilePath);
        console.log('✅ Source map comment added to:', jsFile);
    }
}

module.exports = SourceMapGenerator;
