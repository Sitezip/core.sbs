/**
 * CORE Pocket Module
 * Handles template processing and lifecycle management
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_pk = (() => {
    let timeout = 2000;
    let directive = [];
    let stackTs;

    return {
        get timeout() {
            return timeout;
        },
        set timeout(value) {
            timeout = (+value || 2000);
        },

        init: () => {
            const hash = core_hf.getRoute('hash');
            if (core.useRouting && hash && hash.includes(escape('"t"')) && hash.includes(escape('"l"')) && hash.includes(escape('"n"'))) {
                const directive = core_hf.parseJSON(unescape(core_hf.getRoute('hash').split('#').join('')));
                for (const settings of directive) {
                    let nameList = [];
                    let dataSources = [];
                    for (const item of settings.l) {
                        nameList.push(item.n);
                        if (item.hasOwnProperty('u')) {
                            dataSources.push({ name: item.n, url: item.u });
                        }
                    }
                    const target = settings.t;
                    const dataRefs = nameList.join(',');
                    core_ux.insertPocket(target, dataRefs, dataSources, false);
                }
            }
            core_pk.soc();
        },

        /**
         * End of Call - final DOM manipulation cleanup
         * @returns {void}
         */
        eoc: () => {
            core_hf.hydrateByClass();
            setTimeout(() => {
                core_hf.formatByClass();
                if (typeof core.ud.eoc === "function") {
                    core.ud.eoc();
                }
            })

            let pockets = document.getElementsByClassName('core-pocket');
            for (const pocket of pockets) {
                const parent = pocket.parentNode;
                const target = '#' + parent.id;
                const lists = [];
                const templatesStr = pocket.getAttribute('data-core-templates') || pocket.dataset.coreTemplates || '';
                const templates = templatesStr.split(',').map(s => String(s).trim()).filter(Boolean);
                for (const template of templates) {
                    if (!template) continue;
                    let list = { n: template };
                    const source = pocket.getAttribute('data-' + template + '-core-source') || pocket.dataset[template + 'CoreSource'];
                    if (source) {
                        list.u = source;
                    }
                    lists.push(list);
                }
                directive.push({ t: target, l: lists })
                if (core.useLocking) {
                    pocket.classList.remove('core-pocket');
                    pocket.classList.add('core-pocketed');
                }
            }

            if (core.useRouting) core_hf.setRoute(core_hf.getRoute('origin') + core_hf.getRoute('pathname') + core_hf.getRoute('search'), null, '#' + escape(JSON.stringify(directive)))
            if (core.useDebugger) console.log('core.js completed in ' + (core_hf.date(null, 'perf') - stackTs).toFixed(1) + 'ms');
            stackTs = 0;
            directive = [];
        },

        /**
         * Start of Call - initiates core lifecycle
         * @async
         * @returns {Promise<void>}
         */
        soc: async () => {
            await core_be.awaitAll();

            if (typeof core.ud.soc === "function") {
                core.ud.soc();
            }

            stackTs = core_hf.date(null, 'perf');

            try {
                await core_pk.getTemplate();
                core_pk.addTemplate();
                await core_pk.getData();
                core_pk.addData();
            } catch (e) {
                console.error("core.js error in soc lifecycle", e);
            }

            core_pk.eoc();
        },

        /**
         * Scans DOM for data-core-templates and fetches missing templates
         * @async
         * @returns {Promise<void>}
         */
        getTemplate: async () => {
            const promises = [];
            let pockets = document.getElementsByClassName('core-pocket');

            for (const pocket of pockets) {
                const templatesStr = pocket.getAttribute('data-core-templates') || pocket.dataset.coreTemplates || '';
                const templates = templatesStr.split(',').map(s => String(s).trim()).filter(Boolean);
                for (const template of templates) {
                    if (!template) continue;

                    let hasTemplate = core_cr.getTemplate(template);
                    if (!hasTemplate && template !== 'EMPTY') {
                        pocket.insertAdjacentHTML('beforeend', core_cr.getTemplate('LOADING'));
                        const dataSrc = pocket.getAttribute('data-' + template + '-core-source') || pocket.dataset[template + 'CoreSource'];
                        promises.push(core_be.getTemplate(template, dataSrc));
                    }
                }
            }

            if (promises.length) {
                await Promise.all(promises);
            }
        },

        /**
         * Injects fetched templates into their respective pockets
         * @returns {void}
         */
        addTemplate: () => {
            let pockets = document.getElementsByClassName('core-pocket');
            for (const pocket of pockets) {
                while (pocket.firstElementChild) {
                    pocket.firstElementChild.remove();
                }
                pocket.style.display = 'none';
                
                const templatesStr = pocket.getAttribute('data-core-templates') || pocket.dataset.coreTemplates || '';
                const templates = templatesStr.split(',').map(s => String(s).trim()).filter(Boolean);
                for (const template of templates) {
                    if (!template) continue;
                    core_cb.prepaint(template, null, 'template');
                    pocket.insertAdjacentHTML('beforeend', core_cr.getTemplate(template));
                    core_cb.postpaint(template, null, 'template');
                }
                if (!pocket.getElementsByClassName('core-clone').length) {
                    pocket.style.display = '';
                }
            }
        },

        /**
         * Scans DOM for data-core-data attributes and fetches missing data
         * @async
         * @returns {Promise<void>}
         */
        getData: async () => {
            const promises = [];
            let clones = document.getElementsByClassName('core-clone');

            for (const clone of clones) {
                const dataRef = clone.getAttribute('data-core-data') || clone.dataset.coreData;
                const dataSrc = clone.getAttribute('data-core-source') || clone.dataset.coreSource;

                if (core_be.checkCacheTs(dataRef, 'data') && core_cr.getData(dataRef)) {
                    continue;
                }

                promises.push(core_be.getData(dataRef, dataSrc));
            }

            if (promises.length) {
                await Promise.all(promises);
            }
        },

        /**
         * Clones template elements for each data record
         * @returns {void}
         */
        addData: () => {
            let clones = Array.from(document.getElementsByClassName('core-clone'));
            for (const clone of clones) {
                const dataRef = clone.getAttribute('data-core-data') || clone.dataset.coreData;
                const records = core_cr.getData(dataRef) || [];
                const cloned = clone.cloneNode(true);
                const clonedClass = "core-cloned-" + dataRef.split('-').map(s => core_sv.scrubSimple('temp', s, ['alphaonly']).value).join('-');
                cloned.classList.remove("core-clone");
                cloned.classList.add(clonedClass);
                cloned.removeAttribute('data-core-source');
                cloned.removeAttribute('data-core-data');
                cloned.removeAttribute('id');
                core_cb.prepaint(dataRef, records, 'data');
                clone.insertAdjacentHTML('beforebegin', core_pk.cloner(records, cloned.outerHTML));
                
                let recordIndex = 0;
                for (const newClone of clone.parentNode.getElementsByClassName(clonedClass)) {
                    core_cr.setData('coreRecord', records[recordIndex++], newClone, 0);
                }
                core_cb.postpaint(dataRef, records, 'data');
            }
            
            for (const clone of clones) {
                (clone.closest('.core-pocket') || clone.closest('.core-pocketed')).style.display = '';
                clone.remove();
            }
            
            let links = document.getElementsByTagName('a');
            for (const link of links) {
                core_hf.addClickListener(link);
            }
        },

        /**
         * Hydrates HTML using classic pocket find/replace
         * @param {string} templateStr - Template string to process
         * @returns {string} Processed template string
         */
        injector: (templateStr) => {
            let newString = templateStr;
            let placeholders = newString.match(core_sv.regex.dblcurly) || [];
            for (const placeholder of placeholders) {
                let [type, dataSrc, ref, format, clue] = placeholder.split(':');
                if (type !== 'data' && type !== '@') continue;
                let object = core_cr.getData(dataSrc);
                let value = core_hf.digData(object, ref);
                if (format && value != undefined) {
                    value = core_ux.formatValue(value, format, clue);
                }
                newString = newString.replaceAll('{{' + placeholder + '}}', ((value != null && value != undefined) ? value : core.ud.defaultDelta));
            }
            return newString;
        },

        /**
         * Creates clones for each data record
         * @param {array} records - Data records to clone
         * @param {string} cloneStr - Clone template string
         * @returns {string} Generated HTML string
         */
        cloner: (records = [], cloneStr) => {
            let newCloneStr = '';
            let count = 0;
            let placeholders = (cloneStr.match(core_sv.regex.dblcurly) || []).sort();
            for (const record of records) {
                let newString = cloneStr;
                for (const placeholder of placeholders) {
                    let [type, member, format, clue] = placeholder.split(':');
                    let value;
                    switch (type) {
                        case 'aug': case '!':
                            if (['i', 'index'].includes(member)) value = count;
                            else if (['c', 'count'].includes(member)) value = count + 1;
                            else if (['v', 'val', 'value'].includes(member) && typeof core.ud.cloneValue === 'function') {
                                let args = { str1: format, str2: clue, index: count, placeholder: placeholder };
                                value = core.ud.cloneValue(record, args);
                            } else if (['s', 'str', 'string'].includes(member) && typeof core.ud.cloneString === 'function') {
                                let args = { str1: format, str2: clue, index: count, placeholder: placeholder, cloneStr: cloneStr, cloningStr: newString };
                                newString = core.ud.cloneString(record, args) || newString;
                            }
                            break;
                        case 'rec': case '#':
                            value = core_hf.digData(record, member);
                            break;
                        default:
                            value = core.ud.alertMissingTypeReference + " '" + type + "'";
                    }
                    if (format && value != undefined) value = core_ux.formatValue(value, format, clue);
                    newString = newString.replaceAll('{{' + placeholder + '}}', ((value != null && value != undefined) ? value : core.ud.defaultDelta));
                }
                count++;
                newCloneStr = newCloneStr + ' ' + newString;
            }
            return newCloneStr;
        },
    };
})();
