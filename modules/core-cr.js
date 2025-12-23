/**
 * CORE Create Module
 * Handles data and template storage and management
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_cr = (() => {
    let data = {};
    let templates = {};

    return {
        /**
         * Sets data in the data store
         * @param {string} key - The key to store the data under
         * @param {any} value - The data to store
         * @param {object} element - Optional DOM element to attach data to
         * @param {number} index - Optional index for array data
         */
        setData: (key, value, element = null, index = null) => {
            if (element) {
                if (!element._CORE_Data) {
                    element._CORE_Data = {};
                }
                element._CORE_Data[key] = value;
            } else {
                data[key] = value;
            }
        },

        /**
         * Gets data from the data store
         * @param {string} key - The key to retrieve
         * @param {object} element - Optional DOM element to get data from
         * @returns {any} The stored data
         */
        getData: (key, element = null) => {
            if (element && element._CORE_Data) {
                return element._CORE_Data[key];
            }
            return data[key];
        },

        /**
         * Deletes data from the data store
         * @param {string} key - The key to delete
         * @param {object} element - Optional DOM element to delete data from
         */
        delData: (key, element = null) => {
            if (element && element._CORE_Data) {
                delete element._CORE_Data[key];
            } else {
                delete data[key];
            }
        },

        /**
         * Sets a template in the template store
         * @param {string} key - The key to store the template under
         * @param {string} value - The template HTML
         */
        setTemplate: (key, value) => {
            templates[key] = value;
        },

        /**
         * Gets a template from the template store
         * @param {string} key - The key to retrieve
         * @returns {string} The stored template
         */
        getTemplate: (key) => {
            return templates[key];
        },

        /**
         * Deletes a template from the template store
         * @param {string} key - The key to delete
         */
        delTemplate: (key) => {
            delete templates[key];
        },

        /**
         * Initialize the module with default templates
         */
        init: () => {
            templates['LOADING'] = core_ud.defaultLoadingTemplate;
            templates['EMPTY'] = core_ud.defaultEmptyTemplate;
            templates['ERROR'] = '<div class="error">Error loading content</div>';
        }
    };
})();
