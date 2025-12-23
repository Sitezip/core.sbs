/**
 * CORE Helper Functions Module
 * Provides DOM utilities, date formatting, and general helper functions
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_hf = (() => {
    let prevSortKey;

    return {
        addClickListeners: () => {
            let links = document.getElementsByTagName('a') || [];
            for (const link of links) {
                core_hf.addClickListener(link);
            }
        },

        addClickListener: (element) => {
            const dataRefs = element.getAttribute('data-core-templates') || element.getAttribute('data-core-data') || element.dataset.coreTemplates || element.dataset.coreData;
            const target = (element.getAttribute('target') || core.ud.defaultClickTarget);
            if (!dataRefs) return;
            
            let dataSources = [];
            const templates = dataRefs.split(',').map(s => String(s).trim()).filter(Boolean);
            for (const template of templates) {
                const source = element.getAttribute('data-' + template + '-core-source') || element.getAttribute('data-core-source') || element.dataset[template + 'CoreSource'] || element.dataset.coreSource;
                if (source) {
                    dataSources.push({ name: template, url: source });
                }
            }
            
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            newElement.addEventListener('click', (event) => {
                event.preventDefault()
                core_ux.insertPocket(target, dataRefs, dataSources);
            });
        },

        ccNumAuth: (ccNum) => {
            ccNum = String(ccNum).replace(/\D/g, "");

            if (!ccNum || isNaN(ccNum)) {
                return { isValid: false, type: "Invalid" };
            }

            let sum = 0;
            let alternate = false;
            for (let i = ccNum.length - 1; i >= 0; i--) {
                let digit = parseInt(ccNum.charAt(i), 10);
                if (alternate) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }
                sum += digit;
                alternate = !alternate;
            }

            const isValid = sum % 10 === 0;

            let type = "Unknown";
            if (/^3[47]/.test(ccNum) && ccNum.length === 15) {
                type = "American Express";
            } else if (/^5[1-5]/.test(ccNum) && ccNum.length === 16) {
                type = "MasterCard";
            } else if (/^4/.test(ccNum) && [13, 16].includes(ccNum.length)) {
                type = "Visa";
            } else if (/^6011/.test(ccNum) && ccNum.length === 16) {
                type = "Discover";
            }

            return { isValid, type };
        },

        copy: (text) => {
            let successful = false;
            let textarea = document.createElement("textarea");
            textarea.id = 'copyarea';
            textarea.value = text;
            textarea.style.top = 0;
            textarea.style.left = 0;
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.border = 'none';
            textarea.style.padding = 0;
            textarea.style.outline = 'none';
            textarea.style.position = 'fixed';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                successful = document.execCommand('copy');
            } catch (err) {
                if (core.useDebugger) console.log('core.js copy unsuccessful');
            }
            document.body.removeChild(textarea);
            return successful;
        },

        date: (dateStr, format, strict = false) => {
            let date = (dateStr || new Date().toLocaleString());
            let output = (format || core.ud.defaultDateFormat);

            if (!strict) {
                output = output.toUpperCase();
            }

            if (+date) {
                date = date * 1000;
            }

            date = new Date(date);

            if (!Date.parse(date)) {
                return dateStr + core.ud.alertInvalidDate;
            }

            switch (output) {
                case 'DATE':
                    output = 'M/D/YY';
                    break;
                case 'TIME':
                    output = 'HH:MM'
                    break;
            }

            const dateObj = {
                'hh': String(output.includes('P') ? ((date.getHours() % 12) || 12) : date.getHours()).padStart(2, '0'),
                'h': String((date.getHours() % 12) || 12),
                'mm': String(date.getMinutes()).padStart(2, '0'),
                'ss': String(date.getSeconds()).padStart(2, '0'),
                'p': String(date.getHours() >= 12 ? 'pm' : 'am'),
                'HH': String(output.includes('P') ? ((date.getHours() % 12) || 12) : date.getHours()).padStart(2, '0'),
                'H': String((date.getHours() % 12) || 12),
                ':MM': ':' + String(date.getMinutes()).padStart(2, '0'),
                ':SS': ':' + String(date.getSeconds()).padStart(2, '0'),
                'DD': String(date.getDate()).padStart(2, '0'),
                'D': String(date.getDate()),
                'MM': String(date.getMonth() + 1).padStart(2, '0'),
                'M': String(date.getMonth() + 1),
                'YYYY': String(date.getFullYear()),
                'YY': String(date.getFullYear()).substr(2),
                'P': String(date.getHours() >= 12 ? 'PM' : 'AM'),
                'TS': +String(Math.floor(date / 1000)),
                'PERF': performance.now(),
                '_note': 'Object keys represent available tokens for date formatting find/replace, with lowercase keys for more accuracy in strict mode'
            }

            if (output.toUpperCase() === 'TS') {
                return dateObj.TS;
            } else if (output.toUpperCase() === 'PERF') {
                return dateObj.PERF;
            } else if (output.toUpperCase() === 'OBJ') {
                return dateObj;
            } else if (strict) {
                for (const [key, value] of Object.entries(dateObj)) {
                    output = output.split(key).join(value);
                }
                return output;
            }

            return output
                .replace('HH', dateObj.HH)
                .replace('H', dateObj.H)
                .replace(':MM', dateObj[':MM'])
                .replace(':SS', dateObj[':SS'])
                .replace('DD', dateObj.DD)
                .replace('D', dateObj.D)
                .replace('MM', dateObj.MM)
                .replace('M', dateObj.M)
                .replace('YYYY', dateObj.YYYY)
                .replace('YY', dateObj.YY)
                .replace('P', dateObj.P)
                .replace('TS', String(dateObj.TS));
        },

        /**
         * Digs through an object looking for a value using a dot delimited string as a reference
         * @param {object} object - The target object to be searched
         * @param {string[]} ref - The string reference that will be used to dig through the object
         * @returns {mixed} The string value that if found or undefined
         */
        digData: (object, ref) => {
            if (typeof ref === 'string') {
                ref = ref.split(ref.includes(',') ? ',' : '.');
            }
            let member = (ref || []).shift();
            if (!isNaN(+member)) {
                member = +member;
            } else if (member === '[n]' && Array.isArray(object)) {
                return object.join(', ');
            }
            if (object && object.hasOwnProperty(member)) {
                if (!ref.length) {
                    return object[member];
                } else {
                    return core_hf.digData(object[member], ref);
                }
            }
        },

        parseJSON: (str) => {
            let obj;
            try {
                obj = JSON.parse(str);
            } catch (e) {
                return undefined;
            }
            return obj;
        },

        getRoute: (which) => {
            const urlObj = new URL(window.location.href);
            return urlObj[which || 'href'];
        },

        setRoute: (base, title, append, info) => {
            base = base || core_hf.getRoute();
            title = title || core.ud.defaultPageTitle;
            const state = { additionalInformation: (info || core.ud.defaultPageStatusUpdate) };
            if (append) {
                base += append;
            }
            window.history.replaceState(state, title, base);
        },

        /**
         * Sorts an array of objects by key
         * @param {array} objects - The array of objects to be sorted
         * @param {string} key - The key that will be used to sort
         * @returns {array} The sorted object
         */
        sortObj: (objects, key, type, sort = 'ASC') => {
            objects = objects || [{}];
            type = type || 'automatic';
            let objType = typeof objects;

            if (objType === 'object' && objects.length && objects[0].hasOwnProperty(key)) {
                if (key === prevSortKey && sort === 'ASC') {
                    objects = objects.reverse();
                    return objects;
                }
                if (type === 'automatic' && +objects[0][key] === objects[0][key]) {
                    type = 'numeric';
                }
            } else {
                console.error('core.js Error: Object does not contain key [' + key + ']')
                return objects;
            }

            switch (type) {
                case "number":
                case "numeric":
                    objects.sort(function (a, b) {
                        return a[key] - b[key];
                    });
                    break;
                case "text":
                case "string":
                default:
                    objects.sort(function (a, b) {
                        let x = a[key].toLowerCase();
                        let y = b[key].toLowerCase();
                        if (x < y) { return -1; }
                        if (x > y) { return 1; }
                        return 0;
                    });
                    break;
            }

            if (sort !== 'ASC') {
                objects = objects.reverse();
            } else {
                prevSortKey = key;
            }

            return objects;
        },

        /**
         * Creates a UUID
         * @returns {string} The UUID
         */
        uuid: (prefix = '', delim = '-') => {
            return `${prefix}xxxxxxxx${delim}xxxx${delim}4xxx${delim}yxxx${delim}xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        /**
         * Hydrates HTML tag content by using the class attribute as directive
         * @param {string} classFilter - A string filter used to identify the filtered elements to hydrate
         * @returns {void}
         */
        hydrateByClass: (classFilter) => {
            let elements;
            if (classFilter) {
                elements = document.querySelectorAll('[class*="' + String(classFilter) + '"]');
            } else {
                elements = document.querySelectorAll('[class^="h-"],[class*=" h-"]');
            }
            for (const element of elements) {
                const hClasses = Array.from(element.classList).filter(function (n) { return n.startsWith('h-') });
                for (const hClass of hClasses) {
                    if (core.ud.hydrationClassIgnoreList.includes(hClass)) continue;
                    let [ref, cache, memberRef] = hClass.split('--').join('-').split('-');
                    let data = (core_cr.getData(cache) || { [(memberRef || 'not')]: (cache || 'found') + '*' });
                    if (cache === 'dataRef' && element.dataset.hDataRef) {
                        data = core_cr.getData(element.dataset.hDataRef) || data;
                    } else if (cache === 'coreRecord' && element.closest(`[class*="core-cloned"]`)?._CORE_Data.coreRecord) {
                        data = element.closest(`[class*="core-cloned"]`)._CORE_Data.coreRecord;
                    }
                    const tag = element.tagName;
                    const value = (typeof data === 'string' ? data : core_hf.digData(data, memberRef));
                    const delClass = !hClass.includes('h--');
                    if (value) {
                        switch (tag) {
                            case 'INPUT':
                            case 'SELECT':
                            case 'TEXTAREA':
                                element.value = String(value);
                                break;
                            default:
                                if (delClass) {
                                    element.innerHTML += String(value);
                                } else {
                                    element.innerHTML = String(value);
                                }
                        }
                        if (delClass) {
                            element.classList.remove(hClass);
                        }
                    }
                }
            }
            if (core.useDebugger && elements.length) console.log('core.js hydrating ' + elements.length + ' elements');
        },

        /**
         * Formats HTML tag content by using the class attribute as directive
         * @param {string} classFilter - A string filter used to identify the filtered elements to format
         * @returns {void}
         */
        formatByClass: (classFilter) => {
            let elements;
            if (classFilter) {
                elements = document.querySelectorAll('[class*="' + String(classFilter) + '"]');
            } else {
                elements = document.querySelectorAll('[class^="f-"],[class*=" f-"]');
            }
            for (const element of elements) {
                const fClasses = Array.from(element.classList).filter(function (n) { return n.startsWith('f-') });
                let value = element.innerHTML;
                let fDefault = (element.dataset.fDefault || core.ud.defaultDelta);
                let fClue = (element.dataset.fClue || null);

                for (const fClass of fClasses) {
                    if (core.ud.formatClassIgnoreList.includes(fClass)) continue;
                    const delClass = !fClass.includes('f--');
                    if (value === 'null' || value === 'undefined' || !value.length) {
                        value = fDefault;
                    }

                    const format = fClass.split('f-').join('').split('-').join('').toLowerCase();
                    element.innerHTML = core_ux.formatValue(value, format, fClue);

                    if (delClass) {
                        element.classList.remove(fClass);
                    }
                }
            }
            if (core.useDebugger && elements.length) console.log('core.js formatting ' + elements.length + ' elements');
        },
    };
})();
