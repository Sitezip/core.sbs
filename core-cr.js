/**
 * CORE Create Module
 * Handles data and template storage and management
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_cr = (() => {
    let storageIdDefault = 1;

    return {
        set storageIdDefault(value) {
            storageIdDefault = (+value || 0);
        },

        init: () => {
            let preloaded = [];
            let templates = core.section.querySelectorAll('template[name]') || [];
            for (const template of templates) {
                const templateName = template.getAttribute('name');
                core_cr.setTemplate(templateName, core_cr.getTemplate(templateName));
                preloaded.push(templateName);
            }
            
            if (!preloaded.includes('EMPTY')) {
                core_cr.setTemplate('EMPTY', core.ud.defaultEmptyTemplate);
            }
            if (!preloaded.includes('LOADING')) {
                core_cr.setTemplate('LOADING', core.ud.defaultLoadingTemplate);
            }
        },

        delData: (name, elem, storageId) => {
            elem = (elem || core.section);
            storageId = ((storageId === null || storageId === undefined) ? storageIdDefault : +storageId);

            if (storageId === 0 && elem._CORE_Data && elem._CORE_Data.hasOwnProperty(name)) {
                delete elem._CORE_Data[name];
            } else if (storageId === 1 && elem.dataset.hasOwnProperty(name)) {
                delete elem.dataset[name];
            } else if (storageId === 2 && sessionStorage.getItem(name)) {
                sessionStorage.removeItem(name)
            }
        },

        setData: (name, data, elem, storageId) => {
            elem = (elem || core.section);
            storageId = ((storageId === null || storageId === undefined) ? storageIdDefault : +storageId);

            if (name.startsWith('coreInternal')) {
                storageId = 2;
            }

            core_cr.delData(name, elem);

            if (storageId === 0) {
                elem._CORE_Data = { [name]: data };
            } else if (storageId === 1) {
                elem.dataset[name] = JSON.stringify(data);
            } else if (storageId === 2) {
                sessionStorage.setItem(name, JSON.stringify(data));
            }

            return core_cr.getData(name, elem);
        },

        getData: (name, elem, storageId) => {
            elem = (elem || core.section);
            storageId = ((storageId === null || storageId === undefined) ? storageIdDefault : +storageId);

            if (name.startsWith('coreInternal')) {
                storageId = 2;
            }

            if (!core_be.checkCacheTs(name, 'data')) {
                if (core.useDebugger) console.log("core.js cache '" + name + "' has expired");
                if (core_be.fetchLogFIFO.hasOwnProperty(name)) {
                    setTimeout(() => {
                        core_pk.soc();
                    })
                    let settings = core_be.fetchLogFIFO[name];
                    if (core_be.fetchLogFIFO[name].type === 'data') {
                        core_be.getData(settings.dataRef, settings.dataSrc, settings);
                        if (core.useDebugger) console.log("core.js data '" + name + "' requested");
                    } else {
                        core_be.getTemplate(settings.dataRef, settings.dataSrc, settings);
                        if (core.useDebugger) console.log("core.js template '" + name + "' requested");
                    }
                }
            }

            if (storageId === 0 && elem._CORE_Data && elem._CORE_Data.hasOwnProperty(name)) {
                return elem._CORE_Data[name];
            } else if (storageId === 1 && elem.dataset.hasOwnProperty(name)) {
                return core.hf.parseJSON(elem.dataset[name]);
            } else if (storageId === 2 && sessionStorage.getItem(name)) {
                return core.hf.parseJSON(sessionStorage.getItem(name));
            }
        },

        delTemplate: (name) => {
            let template = core.section.querySelector('[name=' + name + ']');
            if (template) {
                return template.parentNode.removeChild(template);
            }
        },

        setTemplate: (name, value) => {
            core_cr.delTemplate(name);
            let newTemplate = core.template.cloneNode(true);
            newTemplate.setAttribute("name", name);
            newTemplate.textContent = escape(value);
            core.section.appendChild(newTemplate);
        },

        getTemplate: (name) => {
            let newTemplate = (core.section.querySelector('[name=' + name + ']') || core.template);
            newTemplate = String(unescape(newTemplate.textContent || newTemplate.innerHTML)).trim();
            if (newTemplate === undefined) return;
            if (typeof core.ud.getTemplate === 'function') {
                newTemplate = core.ud.getTemplate(name, newTemplate) || newTemplate;
            }
            return core_pk.injector(newTemplate);
        },
    };
})();
