const core_version = '20251229.0';
const core = (() => {
    const template = document.createElement('template');
    const section = document.getElementById('cr-data') || template.cloneNode(true);
    const urlObj = new URL(window.location.href);
    let baseUrl = 'https://cdn.jsdelivr.net/gh/Sitezip/core.sbs@' + core_version;
    let useDebugger = false; //user setting
    let useRouting = false; //user setting
    let useLocking = true;  //true = pockets lock after complete, false = pockets will refresh every soc call
    if (document.readyState === 'complete') {
        setTimeout(() => { core.init() });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            core.init();
        });
    }
    return {
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
        init: () => {
            if (useDebugger) console.log('core.js loaded at ' + core.hf.date());
            core.cr.init();
            core.hf.addClickListeners();
            
            // Defer non-critical initialization to reduce DOMContentLoaded time
            if (typeof core.ud.init === 'function') {
                core.ud.init();
            }
            
            // Start pocket initialization asynchronously with fallback
            const deferPockets = () => {
                core.pk.init();
            };
            
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(deferPockets);
            } else {
                // Fallback for older browsers
                setTimeout(deferPockets, 100);
            }
            
            core.be.getData('coreInternalCheck', '/module/install.json'); //check for local install
        },
        //backend functions
        be: (() => {
            let cacheCreateTs = { data: {}, template: {} };
            let cacheExpire = { data: {}, template: {} }; //user setting
            let cacheExpireDefault = 86400; //user setting, in seconds
            let fetchLogFIFO = {};
            let activePromises = [];

            const trackPromise = (promise) => {
                const p = promise.catch(() => { }); // Prevent unhandled rejection in tracking
                activePromises.push(p);
                p.finally(() => {
                    activePromises = activePromises.filter(item => item !== p);
                });
                return promise;
            };

            return {
                /**
                 * Waits for all active backend requests to complete.
                 * This ensures that the application state is fully synchronized before proceeding.
                 * 
                 * @async
                 * @returns {Promise<void>} Resolves when all tracked promises have settled.
                 */
                awaitAll: async () => {
                    while (activePromises.length) {
                        await Promise.all(activePromises);
                    }
                },
                get cacheCreateTs() {
                    return cacheCreateTs;
                },
                set cacheExpire(obj) {
                    //type is either data or template
                    //format: {type:'data',name:'quote',seconds:5}
                    if (core.hf.digData(obj, 'type') && core.hf.digData(obj, 'name') && core.hf.digData(obj, 'seconds')) {
                        cacheExpire[obj.type][obj.name] = (+obj.seconds || 0);
                    }
                },
                get cacheExpire() {
                    return cacheExpire;
                },
                set cacheExpireDefault(value) {
                    cacheExpireDefault = (+value || 0);
                },
                get fetchLogFIFO() {
                    return fetchLogFIFO;
                },
                setCacheTs: (dataRef, type) => {
                    cacheCreateTs[type][dataRef] = core.hf.date(null, 'ts');
                },
                checkCacheTs: (dataRef, type) => {
                    const cacheLife = cacheExpire[type][dataRef] || cacheExpireDefault;
                    return (cacheCreateTs[type][dataRef] || core.hf.date(null, 'ts')) + cacheLife > core.hf.date(null, 'ts');
                },
                setGetParams: (settings) => {
                    //log settings
                    fetchLogFIFO[settings.dataRef] = settings;

                    let fetchParams = {
                        method: (settings.method || 'GET'),        // *GET, POST, PUT, PATCH, DELETE, etc.
                        //mode: "no-cors",                         // *cors, no-cors, same-origin
                        cache: (settings.cache || "no-cache"),     // *default, no-cache, reload, force-cache, only-if-cached
                        //credentials: "same-origin",              // *same-origin, include, omit
                        redirect: (settings.redirect || "follow"), // manual, *follow, error
                        //referrerPolicy: "no-referrer",           // *no-referrer-when-downgrade, no-referrer, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    }

                    //checking for an key/value object of header pairs
                    if ('headers' in settings && settings.headers && Object.entries(settings.headers).length) {
                        fetchParams.headers = settings.headers;
                    }

                    if ('fetchParams' in settings && settings.fetchParams && Object.entries(settings.fetchParams).length) {
                        fetchParams = { ...fetchParams, ...settings.fetchParams };
                    }

                    //checking for data in user-defined settings; an object of name/value pairs to be posted
                    if ('data' in settings && settings.data && Object.entries(settings.data).length) {
                        fetchParams.method = ['GET'].includes(settings.method) ? 'POST' : settings.method.toUpperCase();
                        //checking for a body post or a form post
                        if ('isFormData' in settings && settings.isFormData) {
                            const formData = new FormData();
                            Object.entries(settings.data).forEach(function (pair) {
                                formData.append(pair[0], String(pair[1]));
                            })
                            fetchParams.body = formData;
                        } else {
                            fetchParams.body = JSON.stringify(settings.data);
                        }
                    }

                    return fetchParams;
                },
                /**
                 * Fetches data from a source and stores it in the registry.
                 * 
                 * @async
                 * @param {string} dataRef - The unique identifier for the data.
                 * @param {string} dataSrc - The URL or source to fetch data from.
                 * @param {object} settings - Optional configuration for the fetch request (method, headers, etc.).
                 * @returns {Promise<object|object[]>} The fetched data object or array.
                 */
                getData: (dataRef, dataSrc, settings) => {
                    settings = core.be.preflight(dataRef, dataSrc, 'data', settings);
                    core.be.setCacheTs(dataRef, 'data');
                    //check if a predefined/custom object (dataObj) has been passed to settings via preflight or data-core-source
                    const jsonDataSrc = core.hf.parseJSON(settings.dataSrc);
                    if (jsonDataSrc) {
                        settings.dataObj = jsonDataSrc;
                    }
                    if (settings.hasOwnProperty('dataObj') && Array.isArray(settings.dataObj)) {
                        core.cr.setData(settings.dataRef, settings.dataObj);
                        return Promise.resolve(settings.dataObj);
                    }

                    const fetchPromise = fetch(settings.dataSrc, core.be.setGetParams(settings))
                        .then((response) => {
                            const failResponse = { success: false, error: true, settings: settings };
                            if (response.ok) {
                                return response.json().catch(() => {
                                    // If JSON parsing fails, return failResponse object
                                    failResponse.parseError = true;
                                    return failResponse;
                                });
                            } else {
                                return failResponse;
                            }
                        }).then((dataObject) => {
                            dataObject = (core.be.postflight(settings.dataRef, dataObject, 'data') || dataObject);
                            core.cr.setData(settings.dataRef, dataObject);
                            return dataObject;
                        }).catch((error) => {
                            console.error(error);
                            throw error;
                        });

                    return trackPromise(fetchPromise);
                },
                /**
                 * Fetches a template string from a source.
                 * 
                 * @async
                 * @param {string} dataRef - The unique identifier for the template.
                 * @param {string} dataSrc - The URL or source to fetch the template from.
                 * @param {object} settings - Optional configuration for the fetch request.
                 * @returns {Promise<string>} The fetched template string.
                 */
                getTemplate: (dataRef, dataSrc, settings) => {
                    settings = core.be.preflight(dataRef, dataSrc, 'template', settings);
                    core.be.setCacheTs(dataRef, 'template');

                    const fetchPromise = fetch(settings.dataSrc, core.be.setGetParams(settings))
                        .then((response) => {
                            return (response.ok ? response.text() : core.ud.alertMissingTemplate);
                        }).then((dataString) => {
                            dataString = (core.be.postflight(settings.dataRef, (dataString || core.ud.alertMissingTemplate), 'template') || dataString);
                            core.cr.setTemplate(settings.dataRef, dataString);
                            return dataString;
                        }).catch((error) => {
                            console.error(error);
                            throw error;
                        });

                    return trackPromise(fetchPromise);
                },
                preflight: (dataRef, dataSrc, type, settings = {}) => {
                    //log the request settings, pre
                    fetchLogFIFO[dataRef] = { ...settings, ...{ FIFOtype: 'pre', FIFOts: core.hf.date(null, 'ts') } };
                    //settings: method, cache, redirect, headers, data, isFormData,...dataRef, dataSrc, type
                    let defaultSettings = {
                        dataRef: dataRef, //TODO add a default here when undefined
                        dataSrc: dataSrc || dataRef,
                        type: type,
                        method: 'GET',
                        cache: 'no-cache',
                        redirect: 'follow',
                        headers: null,
                        data: null,
                        isFormData: false,
                    }

                    if (typeof core.ud.preflight === "function") {
                        settings = { ...defaultSettings, ...settings, ...core.ud.preflight(defaultSettings.dataRef, defaultSettings.dataSrc, defaultSettings.type) };
                    }

                    //log the request settings, final
                    fetchLogFIFO[dataRef] = { ...defaultSettings, ...settings, ...{ FIFOtype: 'final', FIFOts: core.hf.date(null, 'ts') } };

                    return fetchLogFIFO[dataRef];
                },
                postflight: (dataRef, dataObj, type) => {
                    //remove text hints from internal objects
                    if (dataRef === 'coreInternalObjects') {
                        for (const key in dataObj) {
                            if (key.endsWith('Use')) {
                                delete dataObj[key];
                            }
                        }
                    } else if (dataRef === 'coreInternalCheck') {
                        if (dataObj.hasOwnProperty('success') && dataObj.success) {
                            baseUrl = urlObj['origin'];
                        }
                        //get core internal objects making them available as needed
                        core.be.getData('coreInternalObjects', baseUrl + '/core.json');
                    }
                    if (typeof core.ud.postflight === "function") {
                        return core.ud.postflight(dataRef, dataObj, type);
                    }
                    return dataObj;
                },
            }
        })(),
        //callback functions
        cb: (() => {
            return {
                prepaint: (dataRef, dataObj, type) => {
                    if (typeof core.ud.prepaint === "function") {
                        core.ud.prepaint(dataRef, dataObj, type);
                    }
                },
                postpaint: (dataRef, dataObj, type) => {
                    // Universal backwards compatibility: handle all edge cases gracefully
                    if (typeof core.ud.postpaint === "function") {
                        try {
                            // Call user postpaint with whatever parameters it receives
                            // Let the user's function handle null/undefined values as needed
                            core.ud.postpaint(dataRef, dataObj, type);
                        } catch (e) {
                            // Only log actual errors, not null reference issues
                            if (useDebugger && e.message && !e.message.includes('null') && !e.message.includes('undefined')) {
                                console.warn(`Error in postpaint for ${dataRef}:`, e);
                            }
                        }
                    }
                },
            }
        })(),
        //create functions
        cr: (() => {
            let storageIdDefault = 1;
            return {
                set storageIdDefault(value) {
                    storageIdDefault = (+value || 0);
                },
                init: () => {
                    let preloaded = [];
                    let templates = section.querySelectorAll('template[name]') || [];
                    for (const template of templates) {
                        const templateName = template.getAttribute('name');
                        // Get template content directly without data injection during init
                        const templateContent = String(unescape(template.textContent || template.innerHTML)).trim();
                        core.cr.setTemplate(templateName, templateContent);
                        preloaded.push(templateName);
                    }
                    //setup keyword templates
                    if (!preloaded.includes('EMPTY')) {
                        core.cr.setTemplate('EMPTY', core.ud.defaultEmptyTemplate);
                    }
                    if (!preloaded.includes('LOADING')) {
                        core.cr.setTemplate('LOADING', core.ud.defaultLoadingTemplate);
                    }
                },
                delData: (name, elem, storageId) => {
                    elem = (elem || section);
                    storageId = ((storageId === null || storageId === undefined) ? storageIdDefault : +storageId);

                    if (storageId === 0 && elem._CORE_Data && elem._CORE_Data.hasOwnProperty(name)) {
                        //DOM (Option A)
                        delete elem._CORE_Data[name];
                    } else if (storageId === 1 && elem.dataset.hasOwnProperty(name)) {
                        //STATIC (Option B)
                        delete elem.dataset[name];
                    } else if (storageId === 2 && sessionStorage.getItem(name)) {
                        //SESSION (Option C), elem is ignored
                        sessionStorage.removeItem(name)
                    }
                },
                setData: (name, data, elem, storageId) => {
                    elem = (elem || section);
                    storageId = ((storageId === null || storageId === undefined) ? storageIdDefault : +storageId);

                    //check for internal requests
                    if (name.startsWith('coreInternal')) {
                        storageId = 2;
                    }

                    //delete previous data by name
                    core.cr.delData(name, elem);

                    if (storageId === 0) {
                        //DOM (Option A)
                        elem._CORE_Data = { [name]: data };
                    } else if (storageId === 1) {
                        //STATIC (Option B)
                        elem.dataset[name] = JSON.stringify(data);
                    } else if (storageId === 2) {
                        //SESSION (Option C), elem is ignored
                        sessionStorage.setItem(name, JSON.stringify(data));
                    }

                    return core.cr.getData(name, elem);
                },
                getData: (name, elem, storageId) => {
                    elem = (elem || section);
                    storageId = ((storageId === null || storageId === undefined) ? storageIdDefault : +storageId);

                    //check for internal requests
                    if (name.startsWith('coreInternal')) {
                        storageId = 2;
                    }

                    //check for expired cache
                    if (!core.be.checkCacheTs(name, 'data')) {
                        if (useDebugger) console.log("core.js cache '" + name + "' has expired");
                        if (core.be.fetchLogFIFO.hasOwnProperty(name)) {
                            //if pk is not already processsing trigger refresh
                            //if pk is not already processsing trigger refresh
                            //Trigger refresh
                            setTimeout(() => {
                                core.pk.soc();
                            })
                            let settings = core.be.fetchLogFIFO[name];
                            if (core.be.fetchLogFIFO[name].type === 'data') {
                                core.be.getData(settings.dataRef, settings.dataSrc, settings);
                                if (useDebugger) console.log("core.js data '" + name + "' requested");
                            } else {
                                core.be.getTemplate(settings.dataRef, settings.dataSrc, settings);
                                if (useDebugger) console.log("core.js template '" + name + "' requested");
                            }
                        }
                    }

                    //return data, (even if expired, refresh will occure immediately after)
                    if (storageId === 0 && elem._CORE_Data && elem._CORE_Data.hasOwnProperty(name)) {
                        //DOM (Option A)
                        return elem._CORE_Data[name];
                    } else if (storageId === 1 && elem.dataset.hasOwnProperty(name)) {
                        //STATIC (Option B)
                        return core.hf.parseJSON(elem.dataset[name]);
                    } else if (storageId === 2 && sessionStorage.getItem(name)) {
                        //SESSION (Option C), elem is ignored
                        return core.hf.parseJSON(sessionStorage.getItem(name));
                    }
                    
                    // If data is not available but there are active promises, wait for them
                    if (core.be && core.be.activePromises && core.be.activePromises.length > 0) {
                        return new Promise((resolve) => {
                            const checkData = () => {
                                let data;
                                // Check sessionStorage directly to avoid recursion
                                if (storageId === 2 && sessionStorage.getItem(name)) {
                                    data = core.hf.parseJSON(sessionStorage.getItem(name));
                                } else if (storageId === 0 && elem._CORE_Data && elem._CORE_Data.hasOwnProperty(name)) {
                                    data = elem._CORE_Data[name];
                                } else if (storageId === 1 && elem.dataset.hasOwnProperty(name)) {
                                    data = core.hf.parseJSON(elem.dataset[name]);
                                }
                                
                                if (data !== undefined) {
                                    resolve(data);
                                } else if (core.be && core.be.activePromises && core.be.activePromises.length > 0) {
                                    // If still active promises, wait a bit longer to reduce frequency
                                    setTimeout(checkData, 50);
                                } else {
                                    // No more active promises, resolve with undefined
                                    resolve(undefined);
                                }
                            };
                            // Initial check after a short delay to allow immediate resolution for available data
                            setTimeout(checkData, 5);
                        });
                    }
                    
                    return undefined;
                },
                delTemplate: (name) => {
                    let template = section.querySelector('[name=' + name + ']');
                    if (template) {
                        return template.parentNode.removeChild(template);
                    }
                },
                setTemplate: (name, value) => {
                    //delete previous template by name
                    core.cr.delTemplate(name);
                    //create new template
                    let newTemplate = template.cloneNode(true);
                    newTemplate.setAttribute("name", name);
                    newTemplate.textContent = escape(value);
                    //append new template
                    section.appendChild(newTemplate);
                },
                getTemplate: (name) => {
                    let newTemplate = (section.querySelector('[name=' + name + ']') || template);
                    newTemplate = String(unescape(newTemplate.textContent || newTemplate.innerHTML)).trim();
                    if (newTemplate === undefined) return;
                    if (typeof core.ud.getTemplate === 'function') {
                        newTemplate = core.ud.getTemplate(name, newTemplate) || newTemplate;
                    }
                    //replace data values in the template
                    return core.pk.injector(newTemplate);
                },
            }
        })(),
        //helper functions
        hf: (() => {
            let prevSortKey;
            return {
                addClickListeners: () => {
                    // Look for any element with core data attributes (not just anchors)
                    const selectors = [
                        '[data-core]',
                        '[data-core-templates]',
                        '[data-core-data]',
                        '[core-templates]',
                        '[core-data]'
                    ];
                    
                    for (const selector of selectors) {
                        const elements = document.querySelectorAll(selector) || [];
                        for (const element of elements) {
                            core.hf.addClickListener(element);
                        }
                    }
                },
                addClickListener: (element) => {
                    // Support both old and new syntax
                    const dataRefs = element.getAttribute('data-core') || 
                                   element.getAttribute('data-core-templates') || 
                                   element.getAttribute('core-templates') || 
                                   element.getAttribute('data-core-data') || 
                                   element.getAttribute('core-data') || 
                                   element.dataset.core || 
                                   element.dataset.coreTemplates || 
                                   element.dataset.coreData;
                    
                    const target = element.getAttribute('data-target') || 
                                 element.getAttribute('target') || 
                                 core.ud.defaultClickTarget;
                    
                    if (!dataRefs) return;

                    let dataSources = [];
                    const templates = dataRefs.split(',').map(s => String(s).trim()).filter(Boolean);
                    for (const template of templates) {
                        const source = element.getAttribute('data-' + template + '-core-source') || 
                                     element.getAttribute(template + '-source') ||
                                     element.getAttribute('data-core-source') || 
                                     element.getAttribute('core-source') ||
                                     element.dataset[template + 'CoreSource'] || 
                                     element.dataset.coreSource;
                        if (source) {
                            dataSources.push({ name: template, url: source });
                        }
                    }

                    const newElement = element.cloneNode(true);
                    element.parentNode.replaceChild(newElement, element);

                    newElement.addEventListener('click', (event) => {
                        event.preventDefault();
                        core.ux.insertPocket(target, dataRefs, dataSources);
                    });
                },
                ccNumAuth: (ccNum) => {
                    // Remove spaces and non-digit characters
                    ccNum = String(ccNum).replace(/\D/g, "");

                    // Check if the number is empty or not a number
                    if (!ccNum || isNaN(ccNum)) {
                        return { isValid: false, type: "Invalid" };
                    }

                    // Luhn algorithm for validation
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

                    // Check card type based on prefix and length
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
                        if (useDebugger) console.log('core.js copy unsuccessful');
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

                    // Check Unix timestamp (numeric)
                    if (+date) {
                        date = date * 1000;
                    }

                    date = new Date(date);

                    //checks for valid date object
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

                    // Replace tokens with date values in the output string
                    return output
                        .replace('HH', dateObj.HH)
                        .replace('H', dateObj.H)
                        .replace(':MM', dateObj[':MM']) //above Month
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
                 * Examples:
                 * addresses.billing.street RETURNS the street value of billing of the parent addresses
                 * news.categories.0 RETURNS the 0 index of the array categories of the parent news
                 * *OPTIONALLY news.categories.[n] will return the joined array, all indexes as a string
                 *
                 * @param {object} object - The target object to be searched.
                 * @param {string[]} ref - The string reference that will be used to dig through the object.
                 * @returns {mixed} The string value that if found or undefined.
                 */
                digData: (object, ref) => {
                    if (typeof ref === 'string') {
                        ref = ref.split(ref.includes(',') ? ',' : '.');
                    }
                    let member = (ref || []).shift();
                    if (!isNaN(+member)) {
                        member = +member; //try an index
                    } else if (member === '[n]' && Array.isArray(object)) {
                        return object.join(', ');
                    }
                    if (object && object.hasOwnProperty(member)) {
                        if (!ref.length) {
                            return object[member];
                        } else {
                            return core.hf.digData(object[member], ref);
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
                getRoute: (which) => { //TODO
                    const urlObj = new URL(window.location.href);
                    return urlObj[which || 'href'];
                },
                setRoute: (base, title, append, info) => {
                    base = base || core.hf.getRoute();
                    title = title || core.ud.defaultPageTitle;
                    const state = { additionalInformation: (info || core.ud.defaultPageStatusUpdate) };
                    if (append) {
                        base += append;
                    }
                    window.history.replaceState(state, title, base);
                },
                /**
                 * Sorts an array of objects by key.
                 *
                 * @param {array} objects - The array of objects to be sorted.
                 * @param {string} key - The key that will be used to sort.
                 * @returns {array} The sorted object.
                 */
                sortObj: (objects, key, type, sort = 'ASC') => {
                    objects = objects || [{}];
                    type = type || 'automatic';
                    let objType = typeof objects;

                    if (objType === 'object' && objects.length && objects[0].hasOwnProperty(key)) {
                        //check if previous sort on same key
                        if (key === prevSortKey && sort === 'ASC') {
                            objects = objects.reverse();
                            return objects;
                        }
                        //check for dynamic sort type
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

                    if (sort !== 'ASC') { //DESC
                        objects = objects.reverse();
                    } else {
                        prevSortKey = key;
                    }

                    return objects;
                },
                /**
                 * Creates a UUID
                 *
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
                 * Basic Syntax: <span class="h-user-name">Bobby</span> Result -> <span class>John</span>
                 * Default Examples: h-userId, h-user-name, h-user-billing.address1, element will be hydrated (appended) and the class removed
                 * Options: h--countdown; element will be newly hydrated each call to the function
                 * Alternate Example: use dataRef and data-h-data-ref for caches that contain hyphens (-), etc.
                 * Alternate Option: <p class="h--dataRef-quote" data-h-data-ref="quote-book"></p> //dataRef = quote-book
                 * @param {string} classFilter - A string filter used to identify the filtered elements to hydrate.
                 *
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
                            let data = (core.cr.getData(cache) || { [(memberRef || 'not')]: (cache || 'found') + '*' });
                            if (cache === 'dataRef' && element.dataset.hDataRef) {
                                data = core.cr.getData(element.dataset.hDataRef) || data;
                            } else if (cache === 'coreRecord' && element.closest(`[class*="core-cloned"]`)?._CORE_Data.coreRecord) {
                                data = element.closest(`[class*="core-cloned"]`)._CORE_Data.coreRecord;
                            }
                            const tag = element.tagName;
                            const value = (typeof data === 'string' ? data : core.hf.digData(data, memberRef));
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
                    if (useDebugger && elements.length) console.log('core.js hydrating ' + elements.length + ' elements');
                },
                /**
                 * Formats HTML tag content by using the class attribute as directive
                 * Basic Syntax: <span class="f-upper">john</span> Result -> <span class>JOHN</span>
                 * Default Examples: f-money, f-upper, f-date-time, this will be formatted once and the class removed
                 * Options: f--money, this will continue to be formatted each call to the function
                 * Advanced Syntax: <div class="f-money" data-f-default="0" data-f-clue="USD">
                 * @param {string} classFilter - A string filter used to identify the filtered elements to format.
                 *
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
                        //check for possible arguments
                        let fDefault = (element.dataset.fDefault || core.ud.defaultDelta);
                        let fClue = (element.dataset.fClue || null);

                        //begin formatting
                        for (const fClass of fClasses) {
                            if (core.ud.formatClassIgnoreList.includes(fClass)) continue;
                            const delClass = !fClass.includes('f--');
                            //take care of nulls/empties
                            if (value === 'null' || value === 'undefined' || !value.length) {
                                value = fDefault;
                            }

                            //change class to format; f-money -> money, f--left-pad -> leftpad
                            const format = fClass.split('f-').join('').split('-').join('').toLowerCase();
                            element.innerHTML = core.ux.formatValue(value, format, fClue);

                            if (delClass) {
                                element.classList.remove(fClass);
                            }
                        }
                    }
                    if (useDebugger && elements.length) console.log('core.js formatting ' + elements.length + ' elements');
                },
            }
        })(),
        //pocket functions
        pk: (() => {
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
                    //check to use routing info for pocket setup
                    const hash = core.hf.getRoute('hash');
                    if (useRouting && hash && hash.includes(escape('"t"')) && hash.includes(escape('"l"')) && hash.includes(escape('"n"'))) {
                        //build the UX according to the incoming hash directive
                        const directive = core.hf.parseJSON(unescape(core.hf.getRoute('hash').split('#').join('')));
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
                            const dataRefs = nameList.join(','); //string
                            core.ux.insertPocket(target, dataRefs, dataSources, false);
                        }
                    }
                    core.pk.soc();
                },
                /**
                 * End of Call
                 * The final running function of the DOM manipulation, cleanup
                 * Will call user-defined function: core.ud.eoc, if available
                 *
                 * @returns {void}
                 */
                pk_eol: () => {
                    core.hf.hydrateByClass();
                    setTimeout(() => { //setTimeout added in attempt to fix formatting bug 20240821
                        core.hf.formatByClass();
                        if (typeof core.ud.pk_eol === "function") {
                            core.ud.pk_eol();
                        }
                    })

                    //build the route directive from the DOM
                    let pockets = document.getElementsByClassName('core-pocket');
                    for (const pocket of pockets) {
                        //get the parent
                        const parent = pocket.parentNode;
                        const target = '#' + parent.id;
                        //get the items
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
                        if (useLocking) {
                            pocket.classList.remove('core-pocket');
                            pocket.classList.add('core-pocketed');
                        }

                    }
                    //update the URL
                    if (useRouting) core.hf.setRoute(core.hf.getRoute('origin') + core.hf.getRoute('pathname') + core.hf.getRoute('search'), null, '#' + escape(JSON.stringify(directive)))
                    if (useDebugger) console.log('core.js completed in ' + (core.hf.date(null, 'perf') - stackTs).toFixed(1) + 'ms');
                    //reset functional variables
                    stackTs = 0;
                    directive = [];
                },
                /**
                 * Start of Call
                 * The initial function of the DOM manipulation
                 * Will call user-defined function: core.ud.soc, if available
                 *
                 * @returns {void}
                 */
                /**
                 * Start of Call (SOC).
                 * Initiates the core lifecycle:
                 * 1. Waits for pending backend requests.
                 * 2. Calls user-defined `soc` hook.
                 * 3. Fetches templates.
                 * 4. Renders templates.
                 * 5. Fetches data.
                 * 6. Renders data (clones).
                 * 7. Calls `pk_eol` (End of Call).
                 * 
                 * @async
                 * @returns {Promise<void>}
                 */
                soc: async () => {
                    //don't continue until all preloaded backend data is loaded
                    await core.be.awaitAll();

                    //call user-defined start of function if declared
                    if (typeof core.ud.soc === "function") {
                        core.ud.soc();
                    }

                    stackTs = core.hf.date(null, 'perf');

                    try {
                        await core.pk.getTemplate();
                        core.pk.addTemplate();
                        await core.pk.getData();
                        core.pk.addData();
                    } catch (e) {
                        console.error("core.js error in soc lifecycle", e);
                    }

                    core.pk.pk_eol();
                },
                /**
                 * Scans the DOM for `data-core-templates` attributes and fetches missing templates.
                 * 
                 * @async
                 * @returns {Promise<void>} Resolves when all required templates are fetched.
                 */
                getTemplate: async () => {
                    const promises = [];
                    let pockets = document.getElementsByClassName('core-pocket');

                    for (const pocket of pockets) {
                        const templatesStr = pocket.getAttribute('data-core-templates') || pocket.getAttribute('core-templates') || pocket.dataset.coreTemplates || '';
                        const templates = templatesStr.split(',').map(s => String(s).trim()).filter(Boolean);
                        for (const template of templates) {
                            if (!template) continue;

                            let hasTemplate = core.cr.getTemplate(template);
                            if (!hasTemplate && template !== 'EMPTY') {
                                pocket.insertAdjacentHTML('beforeend', core.cr.getTemplate('LOADING'));
                                const dataSrc = pocket.getAttribute('data-' + template + '-core-source') || pocket.getAttribute(template + '-source') || pocket.dataset[template + 'CoreSource'];
                                promises.push(core.be.getTemplate(template, dataSrc));
                            }
                        }
                    }

                    if (promises.length) {
                        await Promise.all(promises);
                    }
                },
                /**
                 * Injects fetched templates into their respective pockets.
                 * Prepares the DOM for data cloning.
                 * 
                 * @returns {void}
                 */
                addTemplate: () => {
                    //find the pocket elements
                    let pockets = document.getElementsByClassName('core-pocket');
                    for (const pocket of pockets) {
                        //empty the pocket
                        while (pocket.firstElementChild) {
                            pocket.firstElementChild.remove();
                        }
                        //hide the pocket, shown when filled
                        pocket.style.display = 'none';
                        const templatesStr = pocket.getAttribute('data-core-templates') || pocket.getAttribute('core-templates') || pocket.dataset.coreTemplates || '';
                        const templates = templatesStr.split(',').map(s => String(s).trim()).filter(Boolean);
                        for (const template of templates) {
                            if (!template) continue;
                            //fill the pockets w/items
                            core.cb.prepaint(template, null, 'template');
                            pocket.insertAdjacentHTML('beforeend', core.cr.getTemplate(template));
                            core.cb.postpaint(template, null, 'template');
                        }
                        //show the pocket, filled
                        if (!pocket.getElementsByClassName('core-clone').length) {
                            pocket.style.display = '';
                        }
                    }
                },
                /**
                 * Scans the DOM for `data-core-data` attributes (on clones) and fetches missing data.
                 * 
                 * @async
                 * @returns {Promise<void>} Resolves when all required data is fetched.
                 */
                getData: async () => {
                    const promises = [];
                    let clones = document.getElementsByClassName('core-clone');

                    for (const clone of clones) {
                        const dataRef = clone.getAttribute('core-data') || clone.getAttribute('data-core-data') || clone.dataset.coreData;
                        const dataSrc = clone.getAttribute('core-source') || clone.getAttribute('data-core-source') || clone.dataset.coreSource;

                        if (core.be.checkCacheTs(dataRef, 'data') && core.cr.getData(dataRef)) {
                            continue;
                        }

                        promises.push(core.be.getData(dataRef, dataSrc));
                    }

                    if (promises.length) {
                        await Promise.all(promises);
                    }
                },
                /**
                 * Clones the template elements for each data record.
                 * Populates the clones with data and injects them into the DOM.
                 * 
                 * @returns {void}
                 */
                addData: () => {
                    //find the clone elements
                    // Use Array.from to create a static list since we modify the DOM
                    let clones = Array.from(document.getElementsByClassName('core-clone'));
                    for (const clone of clones) {
                        const dataRef = clone.getAttribute('data-core-data') || clone.dataset.coreData;
                        const records = core.cr.getData(dataRef) || [];
                        const cloned = clone.cloneNode(true);
                        const clonedClass = "core-cloned-" + dataRef.split('-').map(s => core.sv.scrubSimple('temp', s, ['alphaonly']).value).join('-');
                        cloned.classList.add(clonedClass);
                        cloned.removeAttribute('core-source');
                        cloned.removeAttribute('data-core-source');
                        cloned.removeAttribute('core-data');
                        cloned.removeAttribute('data-core-data');
                        cloned.removeAttribute('id');
                        core.cb.prepaint(dataRef, records, 'data');
                        clone.insertAdjacentHTML('beforebegin', core.pk.cloner(records, cloned.outerHTML));
                        //add the record data to the cloned element using storageId=0
                        let recordIndex = 0;
                        for (const newClone of clone.parentNode.getElementsByClassName(clonedClass)) {
                            core.cr.setData('coreRecord', records[recordIndex++], newClone, 0);
                        }
                        core.cb.postpaint(dataRef, records, 'data');
                    }
                    //remove the clone templates
                    for (const clone of clones) {
                        //show the pocket, previously hidden
                        (clone.closest('.core-pocket') || clone.closest('.core-pocketed')).style.display = '';
                        clone.remove();
                    }
                    let links = document.getElementsByTagName('a');
                    for (const link of links) {
                        core.hf.addClickListener(link);
                    }
                },
                /**
                 * Hydrates HTML by using the classic pocket find/replace
                 * Basic Syntax: {{data:user:customer.name:upper}} Result -> JOHN
                 */
                injector: (templateStr) => {
                    let newString = templateStr;
                    //replace the placeholders {{rec:name}}
                    let placeholders = newString.match(core.sv.regex.dblcurly) || [];
                    for (const placeholder of placeholders) {
                        let [type, dataSrc, ref, format, clue] = placeholder.split(':');
                        if (type !== 'data' && type !== '@') continue;
                        let object = core.cr.getData(dataSrc);
                        let value = core.hf.digData(object, ref);
                        //format if a format/value are present
                        if (format && value != undefined) {
                            value = core.ux.formatValue(value, format, clue);
                        }
                        newString = newString.replaceAll('{{' + placeholder + '}}', ((value != null && value != undefined) ? value : core.ud.defaultDelta));
                    }
                    return newString;
                },
                cloner: (records = [], cloneStr) => {
                    let newCloneStr = '';
                    let count = 0;
                    let placeholders = (cloneStr.match(core.sv.regex.dblcurly) || []).sort();
                    for (const record of records) {
                        let newString = cloneStr;
                        //replace the placeholders {{rec:name}}
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
                                    value = core.hf.digData(record, member);
                                    break;
                                default:
                                    value = core.ud.alertMissingTypeReference + " '" + type + "'";
                            }
                            //format if a format/value are present
                            if (format && value != undefined) value = core.ux.formatValue(value, format, clue);
                            newString = newString.replaceAll('{{' + placeholder + '}}', ((value != null && value != undefined) ? value : core.ud.defaultDelta)); //(value || value == 0  || value == false)
                        }
                        count++;
                        newCloneStr = newCloneStr + ' ' + newString;
                    }
                    return newCloneStr;
                },
            }
        })(),
        //modular functions
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
        //validation functions
        sv: (() => {
            let regex = {};
            regex.email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            regex.phoneUS = /(\d{3})(\d{3})(\d{4})/;
            regex.html = /<[^>]+>/g
            regex.numbers = /[^0-9]/g;
            regex.floats = /[^0-9.]/g;
            regex.alpha = /[^A-Za-z]/g;
            regex.alphasp = /[^A-Za-z\s]/g;
            regex.alphanum = /[^A-Za-z0-9]/g;
            regex.alphanumsp = /[^\w\s]/gi;
            regex.dblcurly = /[^{\{]+(?=}\})/g;
            regex.urlref = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
            regex.url = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            return {
                get regex() {
                    return regex;
                },
                format: (value, formatStr, valueDefault = '') => {
                    let [format, vDefault, clue] = String(formatStr || [core.ud.defaultDeltaFormat, core.ud.defaultDelta].join('.')).split('.');
                    let [clueCount, cluePad] = String(clue || '4|0').split('|');
                    let [wrapOpen, wrapClose] = String(clue || '""|""').split('|');
                    if (value != 0 && value != false) {
                        value = value || vDefault || valueDefault;
                    }
                    switch (format.toLowerCase()) {
                        case 'alphaonly':
                            value = value.replace(regex.alpha, '');
                            break;
                        case 'array':
                            value = Object.values(value);
                            break;
                        case 'boolean':
                            value = (value && value !== "0" && String(value).toLowerCase() !== "false" ? true : false);
                            break;
                        case 'date':
                        case 'datetime':
                            if (value && clue != 'ignoreempty') {
                                value = core.hf.date(value, clue);
                            }
                            break;
                        case 'decimal':
                            value = (+value).toFixed(2) + (clue || '');
                            break
                        case 'encrypt':
                            value = String(value).split('').sort().reverse().join('');
                            break;
                        case 'float':
                            value = String(value).replace(regex.floats, '');
                            break;
                        case 'email':
                        case 'lower':
                            value = String(value).toLowerCase();
                            break;
                        case 'emaillink':
                            //value: email to link; clue: string of attributes to append to element
                            value = String(value).toLowerCase();
                            value = '<a href="mailto:' + value + '" ' + clue + '>' + value + '</a>';
                            break;
                        case 'urllink':
                            //value: url to link; clue: string of attributes to append to element
                            value = '<a href="' + value + '" target="_blank" ' + clue + '>' + value + '</a>';
                            break;
                        case 'imgsrc':
                            //value: url of the image source; clue: string of attributes to append to element
                            value = '<img src="' + value + '" ' + clue + '>';
                            break;
                        case 'money':
                            if (clue === 'USD') {
                                clue = '$';
                            }
                            value = (clue === '$' ? clue : '') + (+value).toFixed(2);
                            break;
                        case 'encodeuricomponent':
                            value = encodeURIComponent(value);
                            break;
                        case 'encodeuri':
                            value = encodeURI(value);
                            break;
                        case 'nospace':
                            value = String(value).split(' ').join('');
                            break;
                        case "nohtml":
                            value = value.replace(regex.html, '');
                            break
                        case 'linkify':
                            value = value.replace(regex.urlref, match => {
                                let secure = match.includes('https:') ? 's' : ''
                                let url = match.replace(/https?:\/\//, '')
                                return `<a href="http${secure}://${url}" target="_blank">${url}</a>`
                            });
                            break;
                        case 'null':
                            value = null;
                            break;
                        case 'number':
                            if (value !== null && value !== undefined && String(value).length) {
                                value = parseFloat(String(value).replace(regex.floats, "")) || null;
                            } else {
                                value = null;
                            }
                            break;
                        case 'numonly':
                            value = String(value).replace(regex.numbers, '');
                            break;
                        case 'object':
                            let result = {};
                            let keys = Object.keys(value);
                            let vals = Object.values(value);
                            keys.forEach((key, i) => result[key] = vals[i]);
                            value = result;
                            break;
                        case 'padleft':
                            value = String(value).padStart(+clueCount, cluePad);
                            break;
                        case 'padright':
                            value = String(value).padEnd(+clueCount, cluePad);
                            break;
                        case 'fax':
                        case 'phone':
                            let check = String(value || "").replace(regex.numbers, "");
                            if (value && check.length === 10) {
                                value = check.replace(regex.phoneUS, "($1) $2-$3");
                            }
                            break;
                        case 'core_pk_attr':
                            let attrName = clue === 'className' ? 'class' : clue;
                            value = ' ' + attrName + '="' + value + '" ';
                            break
                        case 'core_pk_cloner':
                            value = core.pk.cloner(value, core.cr.getTemplate(clue) || core.ud.alertMissingTemplate);
                            break;
                        case 'removehtml':
                            let tempElem = document.createElement('DIV');
                            tempElem.innerHTML = String(value);
                            value = tempElem.textContent || tempElem.innerText || core.ud.defaultDelta;
                            break;
                        case 'string':
                            value = String(value);
                            break;
                        case 'tinyhash':
                            value = String(value).split("").map(v => v.charCodeAt(0)).reduce((a, v) => a + ((a << 7) + (a << 3)) ^ v).toString(16);
                            break;
                        case 'truncate':
                            value = String(value).length < +clue ? String(value) : String(value).substring(0, +clue) + core.ud.alertTruncated;
                            break;
                        case 'wrap':
                            if (value) {
                                value = wrapOpen + String(value) + wrapClose;
                            }
                            break;
                        case 'upper':
                            value = String(value).toUpperCase();
                            break;
                        case 'upperfirst':
                            value = String(value).charAt(0).toUpperCase() + String(value).slice(1);
                            break;
                    }
                    return value || core.ud.defaultDelta;
                },
                scrub: (scrubArr) => {
                    //[{name:"name",value:"John",scrubs:["req","lower"]}]
                    let resultObj = { success: true, scrubs: [], errors: {} };
                    scrubArr.forEach(function (scrubObj, i) {
                        scrubArr[i] = core.sv.scrubEach(scrubObj, scrubArr);
                        if (!scrubArr[i].success) {
                            resultObj.success = false;
                            resultObj.errors[scrubArr[i].name] = scrubArr[i].errors;
                        }
                    });
                    resultObj.scrubs = scrubArr;
                    return resultObj;
                },
                scrubEach: (scrubObj, scrubArr) => {
                    //scrubObj sample: {name:"name",value:"John",scrubs:["req","lower","max:15"]}
                    //scrubArr sample: [{name:"name",value:"John",scrubs:["req","lower","max:15"]},...]
                    scrubObj.delta = scrubObj.value;
                    scrubObj.errors = [];
                    scrubObj.success = true;

                    scrubObj.scrubs.forEach(function (scrubs) {
                        let [format, clue, other] = String(scrubs).split(":").map(s => String(s).trim()).filter(Boolean);
                        let eachResult = { success: true, error: null };
                        switch (format) {
                            case "fail":
                            case "failclient":
                                eachResult.success = false;
                                eachResult.error = "Intentional frontend failure (" + format + ").";
                                break;
                            case "num":
                                eachResult.success = !isNaN(+scrubObj.value);
                                eachResult.error = "Only numbers are allowed.";
                                break;
                            case "ccnum":
                                eachResult.success = core.hf.ccNumAuth(scrubObj.value).isValid;
                                eachResult.error = "A valid credit card number is required.";
                                break;
                            case "alpha":
                                eachResult.success = (scrubObj.value === scrubObj.value.replace(regex.alpha));
                                eachResult.error = "Only letters are allowed.";
                                break;
                            case "alphaspace":
                                eachResult.success = (scrubObj.value === scrubObj.value.replace(regex.alphasp));
                                eachResult.error = "Only letters/space are allowed.";
                                break;
                            case "alphanum":
                                eachResult.success = (scrubObj.value === scrubObj.value.replace(regex.alphanum));
                                eachResult.error = "Only letters/numbers are allowed.";
                                break;
                            case "alphanumspace":
                                eachResult.success = (scrubObj.value === scrubObj.value.replace(regex.alphanumsp));
                                eachResult.error = "Only letters/numbers/space are allowed.";
                                break;
                            case "nospace":
                                eachResult.success = (scrubObj.value === scrubObj.value.split(" ").join(""));
                                eachResult.error = "Value cannot contain spaces.";
                                break;
                            case "req":
                            case "required":
                                eachResult.success = (String(scrubObj.value).length ? true : false);
                                if (clue) {
                                    eachResult.success = (String(scrubObj.value) === String(clue));
                                }
                                eachResult.error = "Value " + (clue ? "(" + clue + ") " : "") + "is required.";
                                break;
                            case "max":
                            case "maxlen":
                                eachResult.success = !(String(scrubObj.value).length > +clue);
                                eachResult.error = "Max length is " + clue + ".";
                                break;
                            case "min":
                            case "minlen":
                                eachResult.success = String(scrubObj.value).length >= +clue;
                                eachResult.error = "Minimum length is " + clue + ".";
                                break;
                            case "set":
                            case "setlen":
                                eachResult.success = String(scrubObj.value).length === +clue;
                                eachResult.error = "Required value length is " + clue + ".";
                                break;
                            case "disallow":
                                eachResult.success = !scrubObj.value.includes(clue);
                                eachResult.error = "Value must not contain " + clue + ".";
                                break;
                            case "expect":
                                eachResult.success = scrubObj.value.includes(clue);
                                eachResult.error = "Value must contain " + clue + ".";
                                break;
                            case "match":
                                eachResult.success = core.sv.scrubMatch(scrubArr, scrubObj, clue);
                                eachResult.error = "Values must match (" + clue + ").";
                                break;
                            case "gte":
                                eachResult.success = +scrubObj.value >= +clue;
                                eachResult.error = "Required value, a number, must be " + clue + " or more.";
                                break;
                            case "lte":
                                eachResult.success = +scrubObj.value <= +clue;
                                eachResult.error = "Required value, a number, must be " + clue + " or less.";
                                break;
                            case "url":
                                eachResult.success = (String(scrubObj.value).length ? regex.url.test(scrubObj.value) : true);
                                eachResult.error = "Only valid URLs are allowed.";
                                break;
                            case "email":
                                eachResult.success = (String(scrubObj.value).length ? regex.email.test(scrubObj.value) : true);
                                eachResult.error = "Only valid emails are allowed.";
                                scrubObj.value = core.sv.format(scrubObj.value, "lower");
                                break;
                            default:
                                scrubObj.value = core.sv.format(scrubObj.value, format + (clue ? "." + core.ud.defaultDelta + "." + clue : ""));
                        }

                        if (!eachResult.success) {
                            scrubObj.errors.push(eachResult.error);
                            scrubObj.success = false;
                        }
                    });

                    return scrubObj;
                },
                scrubSimple: (name, value, scrubs) => {
                    return core.sv.scrubEach({ name: name, value: value, scrubs: scrubs });
                },
                scrubMatch: (scrubArr, scrubMatch, valueMatch) => {
                    let match = false;
                    scrubArr.forEach(function (scrubObj) {
                        if (scrubMatch.value === scrubObj.value && scrubObj.name === valueMatch) {
                            match = true;
                        }
                    });
                    return match;
                },
            }
        })(),
        /**
         * user-defined functions
         * core.ud.init() called at init of load
         * core.ud.soc() called at start of process
         * core.ud.preflight() called prior to all backend requests
         * core.ud.postflight() called post all backend requests
         * core.ud.prepaint() called prior to each template insert
         * core.ud.postpaint() called post each template insert (and cloning)
         * core.ud.pk_eol() called at end of process
         *
         * core.ud.formatValue() called after core.ux.formatValue()
        * */
        ud: (() => {
            let defaultDelta = '';
            let defaultDeltaFormat = 'none';
            let defaultClickTarget = 'main';
            let defaultDateFormat = 'M/D/YY H:MM P';
            let defaultLoadingTemplate = '<marquee width="50%">loading...</marquee>';
            let defaultEmptyTemplate = '';
            let defaultPageTitle = 'core.js';
            let defaultPageStatusUpdate = 'Updated bookmark location';
            let alertMissingTemplate = 'Not Found';
            let alertMissingTypeReference = 'Unrecognized type';
            let alertEmptyTemplate = 'Not Found';
            let alertInvalidDate = '*';
            let alertTruncated = '...';
            let hydrationClassIgnoreList = ['h-100'];
            let formatClassIgnoreList = [];
            return {
                get defaultDelta() {
                    return defaultDelta;
                },
                set defaultDelta(value) {
                    defaultDelta = String(value);
                },
                get defaultDeltaFormat() {
                    return defaultDeltaFormat;
                },
                set defaultDeltaFormat(value) {
                    defaultDeltaFormat = String(value);
                },
                get defaultClickTarget() {
                    return defaultClickTarget;
                },
                set defaultDeltaFormat(value) {
                    defaultClickTarget = String(value);
                },
                get defaultDateFormat() {
                    return defaultDateFormat;
                },
                set defaultDateFormat(value) {
                    defaultDateFormat = String(value);
                },
                get defaultLoadingTemplate() {
                    return defaultLoadingTemplate;
                },
                set defaultLoadingTemplate(value) {
                    defaultLoadingTemplate = String(value);
                },
                get defaultEmptyTemplate() {
                    return defaultEmptyTemplate;
                },
                set defaultEmptyTemplate(value) {
                    defaultEmptyTemplate = String(value);
                },
                get defaultPageTitle() {
                    return defaultPageTitle;
                },
                set defaultPageTitle(value) {
                    defaultPageTitle = String(value);
                },
                get defaultPageStatusUpdate() {
                    return defaultPageStatusUpdate;
                },
                set defaultPageStatusUpdate(value) {
                    defaultPageStatusUpdate = String(value);
                },
                get alertMissingTemplate() {
                    return alertMissingTemplate;
                },
                set alertMissingTemplate(value) {
                    alertMissingTemplate = String(value);
                },
                get alertMissingTypeReference() {
                    return alertMissingTypeReference;
                },
                set alertMissingTypeReference(value) {
                    alertMissingTypeReference = String(value);
                },
                get alertEmptyTemplate() {
                    return alertEmptyTemplate;
                },
                set alertEmptyTemplate(value) {
                    alertEmptyTemplate = String(value);
                },
                get alertInvalidDate() {
                    return alertInvalidDate;
                },
                set alertInvalidDate(value) {
                    alertInvalidDate = String(value);
                },
                get alertTruncated() {
                    return alertTruncated;
                },
                set alertTruncated(value) {
                    alertTruncated = String(value);
                },
                get hydrationClassIgnoreList() {
                    return hydrationClassIgnoreList;
                },
                set hydrationClassIgnoreList(value) {
                    hydrationClassIgnoreList.push(value);
                },
                get formatClassIgnoreList() {
                    return formatClassIgnoreList;
                },
                set formatClassIgnoreList(value) {
                    formatClassIgnoreList.push(value);
                },
            }
        })(),
        //user experience
        ux: (() => {
            return {
                /**
                 * Applies formatting to a string.
                 *
                 * @param {any} value - Usually a string, but some formats may require another type
                 * @param {any} formatList - An array of formats, a single format, or a pipe delimited list of formats, i.e., format*clue|format OR ['money*$','lower']
                 * @param {string} clue - A clue used as an argument in the formatting a string.
                 * @returns {string} The new value after formatting.
                 */
                formatValue: (value, formatList, clue) => {
                    formatList = formatList || [];
                    //check for pipe delimited string
                    if (typeof formatList === 'string') formatList = formatList.split('|');
                    for (const formatItem of formatList) {
                        //checking for format*clue format
                        let [formatName, clueOverride] = formatItem.split('*');
                        let clueFinal = (clueOverride || clue);
                        //set the value
                        value = core.sv.format(value, [formatName, core.ud.defaultDelta, clueFinal].join('.'), clueFinal)
                        if (typeof core.ud.formatValue === 'function') {
                            value = core.ud.formatValue(value, formatList, clue);
                        }
                    }
                    return value;
                },
                insertPocket: (target, dataRefs, dataSources = [], autoFill = true) => {
                    if (!dataRefs) return;
                    let isSilent = target.includes('core_be_get') || target === 'silent';
                    let isData = target.includes('Data');

                    const pocket = document.createElement('div');
                    pocket.classList.add('core-pocket', 'core-pocket-transition');
                    pocket.setAttribute('data-core-templates', dataRefs);

                    if (dataSources.length) {
                        for (const source of dataSources) {
                            pocket.setAttribute('data-' + source.name + '-core-source', source.url);
                            if (isSilent) {
                                if (isData) core.be.getData(source.name, source.url);
                                else core.be.getTemplate(source.name, source.url);
                            }
                        }
                    }

                    if (isSilent) return;

                    let section = (document.querySelector(target) || document.getElementById(target.replace('#', '')));

                    if (section) {
                        section.innerHTML = '';
                        section.appendChild(pocket);
                        if (autoFill) core.pk.soc();
                    }
                }
            }
        })(),
    }
})()