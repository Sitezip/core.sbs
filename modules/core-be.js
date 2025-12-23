/**
 * CORE Backend Module
 * Handles caching, fetch requests, and data operations
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_be = (() => {
    let cache = {};
    let cacheExpireDefault = 3600;
    let cacheTs = {};
    let fetchParams = {
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    return {
        get cacheExpireDefault() {
            return cacheExpireDefault;
        },
        set cacheExpireDefault(value) {
            cacheExpireDefault = parseInt(value);
        },
        get fetchParams() {
            return fetchParams;
        },
        set fetchParams(value) {
            fetchParams = Object.assign(fetchParams, value);
        },

        checkCacheTs: (key, type = 'data') => {
            if (cacheTs[key] && cacheTs[key] > (Date.now() / 1000) - cacheExpireDefault) {
                return true;
            }
            return false;
        },

        awaitAll: () => {
            return new Promise(resolve => {
                let checkCount = 0;
                let checkInterval = setInterval(() => {
                    let pendingCount = 0;
                    for (const key in cacheTs) {
                        if (cacheTs[key] === 'pending') {
                            pendingCount++;
                        }
                    }
                    if (!pendingCount) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                    if (checkCount++ > core_pk.timeout / 100) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            });
        },

        getData: async (key, url, expire) => {
            if (cacheTs[key] && cacheTs[key] === 'pending') {
                return core_be.awaitAll().then(() => {
                    return cache[key];
                });
            }

            if (core_be.checkCacheTs(key)) {
                return cache[key];
            }

            cacheTs[key] = 'pending';
            return fetch(url, fetchParams)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    cache[key] = data;
                    cacheTs[key] = Date.now() / 1000;
                    return data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    cacheTs[key] = 0;
                    return null;
                });
        },

        getTemplate: async (key, url, expire) => {
            if (cacheTs[key] && cacheTs[key] === 'pending') {
                return core_be.awaitAll().then(() => {
                    return cache[key];
                });
            }

            if (core_be.checkCacheTs(key)) {
                return cache[key];
            }

            cacheTs[key] = 'pending';
            return fetch(url, fetchParams)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    cache[key] = data;
                    cacheTs[key] = Date.now() / 1000;
                    return data;
                })
                .catch(error => {
                    console.error('Error fetching template:', error);
                    cacheTs[key] = 0;
                    return null;
                });
        },

        preflight: (key, data) => {
            if (typeof core.ud.preflight === "function") {
                return core.ud.preflight(key, data);
            }
            return data;
        },

        postflight: (key, data) => {
            if (typeof core.ud.postflight === "function") {
                return core_ud.postflight(key, data);
            }
            return data;
        }
    };
})();
