/**
 * CORE Modular Framework
 * Main coordinator that imports and orchestrates all modules
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

// Import all modules
// Note: In a real project, these would be loaded as separate script files
// For now, they're available globally as core_be, core_cr, etc.

const core = (() => {
    // Core version and configuration
    const core_version = '20251217.1';
    
    // Global settings
    let useDebugger = false;
    let useRouting = false;
    let useLocking = true;
    let defaultClickTarget = 'main';

    // Initialize framework
    const init = () => {
        // Initialize modules
        core_cr.init();
        core_hf.addClickListeners();
        core_pk.init();
        
        // Run user-defined init if available
        if (typeof core_ud.init === "function") {
            core_ud.init();
        }
        
        if (useDebugger) {
            console.log(`CORE Framework v${core_version} initialized`);
        }
    };

    // Public API
    return {
        // Version
        get version() {
            return core_version;
        },
        
        // Configuration
        get useDebugger() {
            return useDebugger;
        },
        set useDebugger(value) {
            useDebugger = Boolean(value);
        },
        get useRouting() {
            return useRouting;
        },
        set useRouting(value) {
            useRouting = Boolean(value);
        },
        get useLocking() {
            return useLocking;
        },
        set useLocking(value) {
            useLocking = Boolean(value);
        },
        get defaultClickTarget() {
            return defaultClickTarget;
        },
        set defaultClickTarget(value) {
            defaultClickTarget = String(value);
        },
        
        // Module access
        be: core_be,
        cr: core_cr,
        hf: core_hf,
        pk: core_pk,
        sv: core_sv,
        ux: core_ux,
        ud: core_ud,
        cb: core_cb,
        
        // Core methods
        init: init,
        
        // Convenience methods
        soc: core_pk.soc,
        eoc: core_pk.eoc,
        
        // Data methods
        setData: core_cr.setData,
        getData: core_cr.getData,
        delData: core_cr.delData,
        
        // Template methods
        setTemplate: core_cr.setTemplate,
        getTemplate: core_cr.getTemplate,
        delTemplate: core_cr.delTemplate,
        
        // Utility methods
        date: core_hf.date,
        uuid: core_hf.uuid,
        format: core_sv.format,
        scrub: core_sv.scrub
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', core.init);
} else {
    core.init();
}
