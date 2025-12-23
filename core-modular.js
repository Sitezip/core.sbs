/**
 * CORE Modular Framework - Main Entry Point
 * Lightweight, modular, and performant JavaScript framework
 * Follows C.O.R.E. project principles: simplicity first, progressive enhancement
 * 
 * This file replaces the monolithic 1500+ line core.js with a modular architecture
 * Each module is focused, testable, and independently maintainable
 */

const core_version = '20251217.1'; // Modular refactored version

const core = (() => {
    // Core configuration and initialization
    const template = document.createElement('template');
    const section = document.getElementById('cr-data') || template.cloneNode(true);
    const urlObj = new URL(window.location.href);
    let baseUrl = 'https://cdn.jsdelivr.net/gh/Sitezip/core.sbs@' + core_version;
    let useDebugger = false;
    let useRouting = false;
    let useLocking = true;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'complete') {
        setTimeout(() => { core.init() });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            core.init();
        });
    }

    return {
        // Core properties
        get section() {
            return section;
        },
        get template() {
            return template;
        },
        get baseUrl() {
            return baseUrl;
        },
        get useDebugger() {
            return useDebugger;
        },
        set useDebugger(value) {
            useDebugger = Boolean(+value);
        },
        set useRouting(value) {
            useRouting = Boolean(+value);
        },
        set useLocking(value) {
            useLocking = Boolean(+value);
        },

        // Initialize all modules
        init: () => {
            if (useDebugger) console.log('core.js modular loaded at ' + core_hf.date());
            
            // Initialize modules in dependency order
            core_cr.init();
            core_hf.addClickListeners();
            
            setTimeout(() => {
                if (typeof core.ud.init === 'function') {
                    core.ud.init();
                }
                core_pk.init();
            });

            core_be.getData('coreInternalCheck', '/module/install.json');
        },

        // Module references - these are the public API
        be: core_be,
        cb: core_cb,
        cr: core_cr,
        hf: core_hf,
        pk: core_pk,
        sv: core_sv,
        ud: core_ud,
        ux: core_ux,

        // Modular functions for dynamic loading
        md: (() => {
            let formSubmitLockout = 0;
            return {
                get formSubmitLockout() {
                    return formSubmitLockout;
                },
                set formSubmitLockout(value) {
                    formSubmitLockout = parseInt(value);
                },
                form: (funcName, args) => {
                    import(baseUrl + '/module/form.js').then(form => {
                        form[funcName](args);
                    }).catch(error => {
                        console.error(`Error loading ${funcName}:`, error);
                    });
                }
            }
        })(),
    };
})();

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = core;
} else {
    window.core = core;
}
