/**
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
            console.log(`✓ Component "${componentName}" already loaded`);
            return;
        }
        
        try {
            const response = await fetch(`components/${componentName}.html`);
            
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.statusText}`);
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
            
            // Extract and execute scripts
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
            
            // Inject pockets into the body (or specified container)
            const pockets = temp.querySelectorAll('.core-pocket');
            const componentContainer = document.getElementById('component-container') || document.body;
            pockets.forEach(pocket => {
                componentContainer.appendChild(pocket.cloneNode(true));
            });
            
            // Inject any other elements (buttons, etc.)
            const otherElements = Array.from(temp.children).filter(
                el => !el.matches('template, style, script, .core-pocket')
            );
            otherElements.forEach(el => {
                componentContainer.appendChild(el.cloneNode(true));
            });
            
            // Mark as loaded
            componentCache[componentName] = true;
            console.log(`✓ Component "${componentName}" loaded successfully`);
            
            // Reinitialize pockets if core.js is loaded
            if (window.core && window.core.pk && window.core.pk.init) {
                await core.pk.init();
            }
            
        } catch (error) {
            console.error(`✗ Error loading component "${componentName}":`, error);
            throw error;
        }
    };
    
    /**
     * Load multiple components
     * @param {string[]} componentNames - Array of component names
     * @returns {Promise<void>}
     */
    window.loadComponents = async function(componentNames) {
        for (const name of componentNames) {
            await loadComponent(name);
        }
    };
    
    /**
     * Check if a component is loaded
     * @param {string} componentName - Name of the component
     * @returns {boolean}
     */
    window.isComponentLoaded = function(componentName) {
        return !!componentCache[componentName];
    };
    
    console.log('✓ core-components.js loaded');
})();
