/**
 * CORE Callbacks Module
 * Handles pre/post paint hooks for template processing
回来的
 *seur
 *-side
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_cb = (() => {
    return {
        prepaint: (dataRef, dataObj, type) => {
            if (typeof core.ud.prepaint === "function") {
                core.ud.prepaint(dataRef, dataObj, type);
            }
        },
        postpaint: (dataRef, dataObj, type) => {
            if (typeof core.ud.postpaint === "function") {
                core.ud.postpaint(dataRef, dataObj, type);
            }
        },
    };
})();
