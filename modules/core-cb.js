/**
 * CORE Callbacks Module
 * Handles pre/post paint hooks for lifecycle events
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_cb = (() => {
    return {
        prepaint: (dataRef, dataObj, type) => {
            if (typeof core_ud.prepaint === "function") {
                core_ud.prepaint(dataRef, dataObj, type);
            }
        },

        postpaint: (dataRef, dataObj, type) => {
            if (typeof core_ud.postpaint === "function") {
                core_ud.postpaint(dataRef, dataObj, type);
            }
        }
    };
})();
