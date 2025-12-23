/**
 * CORE Backend Module
 * Handles caching, fetch operations, and data requests
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_be = (() => {
    let cacheCreateTs = { data: {}, template: {} };
    let cacheExpire = { data: {}, template: {} };
    let cacheExpireDefault = 86400;
    let fetchLogFIFO = {};
    let activePromises = [];

    const trackPromise = (promise) => {
        const p = promise.catch(() => { });
        activePromises.push(p);
        p.finally(() => {
            activePromises = activePromises.filter(item => item !== p);
        });
        return promise;
    };

    return {
        /**
         * Waits for all active backend requests to complete
         * @async
         * @returns {Promise<void>}
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
            fetchLogFIFO[settings.dataRef] = settings;

            let fetchParams = {
                method: (settings.method || 'GET'),
                cache: (settings.cache || "no-cache"),
                redirect: (settings.redirect || "follow"),
            }

            if ('headers' in settings && settings.headers && Object.entries(settings.headers).length) {
                fetchParams.headers = settings.headers;
            }

            if ('fetchParams' in settings && settings.fetchParams && Object.entries(settings.fetchParams).length) {
                fetchParams = { ...fetchParams, ...settings.fetchParams };
            }

            if ('data' in settings && settings.data && Object.entries(settings.data).length) {
                fetchParams.method = ['GET'].includes(settings.method) ? 'POST' : settings.method.toUpperCase();
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
         * Fetches data from a source and stores it in the registry
         * @async
         * @param {string} dataRef - Unique identifier for the data
         * @param {string} dataSrc - URL or source to fetch data from
         * @param {object} settings - Optional configuration for fetch request
         * @returns {Promise<object|object[]>}
         */
        getData: (dataRef, dataSrc, settings) => {
            settings = core_be.preflight(dataRef, dataSrc, 'data', settings);
            core_be.setCacheTs(dataRef, 'data');
            
            const jsonDataSrc = core.hf.parseJSON(settings.dataSrc);
            if (jsonDataSrc) {
                settings.dataObj = jsonDataSrc;
            }
            if (settings.hasOwnProperty('dataObj') && Array.isArray(settings.dataObj)) {
                core.cr.setData(settings.dataRef, settings.dataObj);
                return Promise.resolve(settings.dataObj);
            }

            const fetchPromise = fetch(settings.dataSrc, core_be.setGetParams(settings))
                .then((response) => {
                    const failResponse = { success: false, error: true, settings: settings };
                    if (response.ok) {
                        return response.json().catch(() => {
                            failResponse.parseError = true;
                            return failResponse;
                        });
                    } else {
                        return failResponse;
                    }
                }).then((dataObject) => {
                    dataObject = (core_be.postflight(settings.dataRef, dataObject, 'data') || dataObject);
                    core.cr.setData(settings.dataRef, dataObject);
                    return dataObject;
                }).catch((error) => {
                    console.error(error);
                    throw error;
                });

            return trackPromise(fetchPromise);
        },

        /**
         * Fetches a template string from a source
         * @async
         * @param {string} dataRef - Unique identifier for the template
         * @param {string} dataSrc - URL or source to fetch the template from
         * @param {object} settings - Optional configuration for fetch request
         * @returns {Promise<string>}
         */
        getTemplate: (dataRef, dataSrc, settings) => {
            settings = core_be.preflight(dataRef, dataSrc, 'template', settings);
            core_be.setCacheTs(dataRef, 'template');

            const fetchPromise = fetch(settings.dataSrc, core_be.setGetParams(settings))
                .then((response) => {
                    return (response.ok ? response.text() : core.ud.alertMissingTemplate);
                }).then((dataString) => {
                    dataString = (core_be.postflight(settings.dataRef, (dataString || core.ud.alertMissingTemplate), 'template') || dataString);
                    core.cr.setTemplate(settings.dataRef, dataString);
                    return dataString;
                }).catch((error) => {
                    console.error(error);
                    throw error;
                });

            return trackPromise(fetchPromise);
        },

        preflight: (dataRef, dataSrc, type, settings = {}) => {
            fetchLogFIFO[dataRef] = { ...settings, ...{ FIFOtype: 'pre', FIFOts: core.hf.date(null, 'ts') } };
            
            let defaultSettings = {
                dataRef: dataRef,
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

            fetchLogFIFO[dataRef] = { ...defaultSettings, ...settings, ...{ FIFOtype: 'final', FIFOts: core.hf.date(null, 'ts') } };

            return fetchLogFIFO[dataRef];
        },

        postflight: (dataRef, dataObj, type) => {
            if (dataRef === 'coreInternalObjects') {
                for (const key in dataObj) {
                    if (key.endsWith('Use')) {
                        delete dataObj[key];
                    }
                }
            } else if (dataRef === 'coreInternalCheck') {
                if (dataObj.hasOwnProperty('success') && dataObj.success) {
                    core.baseUrl = new URL(window.location.href)['origin'];
                }
                core_be.getData('coreInternalObjects', core.baseUrl + '/core.json');
            }
            if (typeof core.ud.postflight === "function") {
                return core.ud.postflight(dataRef, dataObj, type);
            }
            return dataObj;
        },
    };
})();
