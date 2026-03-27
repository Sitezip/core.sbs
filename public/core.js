const core_version = '20260204.1';
let core_be_count = 0;
let core_cr_count = 0;
let core_pk_count = 0;
const core = (() => {
    const template = document.createElement('template');
    const section = document.getElementById('cr-data') || template.cloneNode(true);
    const urlObj = new URL(window.location.href);
    let baseUrl = 'https://cdn.jsdelivr.net/gh/Sitezip/core.sbs@' + core_version; //Auto-detect if running locally to avoid 404 check on CDN
    if (document.currentScript && document.currentScript.src.startsWith(window.location.origin)) {
        baseUrl = window.location.origin;
    }
    let useDebugger = true; //user setting - ENABLED FOR DEBUGGING
    let useRouting = true; //user setting - ENABLED FOR PROPER SPA FUNCTIONALITY
    let useLocking = true;  //true = pockets lock after complete, false = pockets will refresh every soc call
    if (document.readyState === 'complete') {
        setTimeout(() => { core.init() });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            core.init();
        });
    }

    window.addEventListener('hashchange', () => {
        if (useRouting) {
            console.log('core.js: Hash change detected, reinitializing pockets');
            console.log('core.js: Current hash:', window.location.hash);
            // Force complete reinitialization
            core.pk.init();
        }
    });

    // For hash-based routing, we need to handle back/forward differently
    // Monitor for hash changes that might come from browser navigation
    let lastHandledHash = window.location.hash;

    window.addEventListener('popstate', (event) => {
        if (useRouting) {
            console.log('core.js: Popstate detected, current hash:', window.location.hash);
            console.log('core.js: Event state:', event.state);
            // Force complete reinitialization on popstate
            setTimeout(() => {
                console.log('core.js: Force reinitializing pockets after popstate');
                core.pk.init();
                lastHandledHash = window.location.hash;
            }, 10);
        }
    });

    // Additional monitoring for hash changes from browser navigation
    setInterval(() => {
        if (useRouting && window.location.hash !== lastHandledHash) {
            console.log('core.js: Hash change detected via monitoring, from', lastHandledHash, 'to', window.location.hash);
            core.pk.init();
            lastHandledHash = window.location.hash;
        }
    }, 50);

    // Enhanced error handling with suggestions
    const coreErrorHandler = {
        getErrorSuggestion: (error, context) => {
            const suggestions = {
                'Failed to fetch': {
                    message: 'Network request failed',
                    suggestions: [
                        'Check if the server is running',
                        'Verify the URL is correct',
                        'Check CORS settings',
                        'Ensure network connectivity'
                    ]
                },
                'template not found': {
                    message: 'Template file missing',
                    suggestions: [
                        'Verify template file exists',
                        'Check file path in data-core-templates attribute',
                        'Ensure file extension is correct (.html)',
                        'Check file permissions'
                    ]
                },
                'JSON parse': {
                    message: 'Invalid JSON format',
                    suggestions: [
                        'Validate JSON syntax',
                        'Check for trailing commas',
                        'Ensure proper quote usage',
                        'Use JSON linter for validation'
                    ]
                },
                'null': {
                    message: 'Null reference error',
                    suggestions: [
                        'Check if element exists in DOM',
                        'Verify data is loaded before accessing',
                        'Add null checks',
                        'Use optional chaining (?.)'
                    ]
                },
                'undefined': {
                    message: 'Undefined reference error',
                    suggestions: [
                        'Check variable declarations',
                        'Verify function parameters',
                        'Check object property names',
                        'Ensure proper initialization'
                    ]
                }
            };

            const errorStr = error.toString().toLowerCase();
            for (const [key, suggestion] of Object.entries(suggestions)) {
                if (errorStr.includes(key)) {
                    return suggestion;
                }
            }

            return {
                message: 'Unknown error occurred',
                suggestions: [
                    'Check browser console for details',
                    'Verify core.js version compatibility',
                    'Check documentation for proper usage',
                    'Report issue if problem persists'
                ]
            };
        },

        logEnhancedError: (error, context = 'general') => {
            if (!useDebugger) return;

            const suggestion = coreErrorHandler.getErrorSuggestion(error, context);
            
            console.group(`🚨 core.js Error [${context}]`);
            console.error('Error:', error);
            console.warn('💡 Suggestion:', suggestion.message);
            console.info('🔧 Possible solutions:');
            suggestion.suggestions.forEach((sol, i) => {
                console.info(`  ${i + 1}. ${sol}`);
            });
            console.groupEnd();
        }
    };

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
            
            //set hit data for use in templates and user scripts, also making it available via core.hit and core.cr.getData('hit')
            core.hit = {
                baseUrl: baseUrl,
                useDebugger: useDebugger,
                useLocking: useLocking,
                useRouting: useRouting,
                version: core_version,
                ts: core.hf.date(null, 'ts'),
                uuid: core.hf.uuid(),
                YYYY: +core.hf.date(null, 'YYYY')
            };
            core.cr.setData('hit', core.hit);

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

            if (baseUrl === urlObj.origin) {
                core.be.getData('coreInternalCheck', '/module/install.json'); //check for local install
            } else {
                core.be.getData('coreInternalObjects', baseUrl + '/core.json');
            }
        },
        //backend functions
        be: {
            cacheCreateTs: { data: {}, template: {} },
            cacheTTL: { data: 300000, template: 300000 },
            fetchLogFIFO: {},
            getData: async (dataRef, dataSrc, settings = {}) => {
                try {
                    const cacheKey = dataRef;
                    const now = Date.now();
                    
                    // Check cache first
                    if (core.be.cacheCreateTs.data[cacheKey] && 
                        (now - core.be.cacheCreateTs.data[cacheKey]) < core.be.cacheTTL.data) {
                        if (useDebugger) console.log("core.js serving data from cache '" + dataRef + "'");
                        return core.cr.getData(dataRef);
                    }

                    // Log the fetch request
                    core.be.fetchLogFIFO[dataRef] = { type: 'data', dataRef, dataSrc, settings };

                    // Merge default settings with user settings
                    const fetchSettings = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        ...settings
                    };

                    // Apply user preflight hook
                    if (typeof core.ud.preflight === "function") {
                        const modifiedSettings = core.ud.preflight(dataRef, dataSrc, fetchSettings);
                        if (modifiedSettings) {
                            Object.assign(fetchSettings, modifiedSettings);
                        }
                    }

                    if (useDebugger) console.log("core.js fetching data '" + dataRef + "' from " + dataSrc);
                    
                    const response = await fetch(dataSrc, fetchSettings);
                    const failResponse = { success: false, error: true, settings: fetchSettings };
                    if (response.ok) {
                        return response.json().catch(() => {
                            // If JSON parsing fails, return failResponse object
                            failResponse.parseError = true;
                            return failResponse;
                        }).then(data => {
                            // Cache the successful response
                            core.be.cacheCreateTs.data[cacheKey] = now;
                            return core.cr.setData(dataRef, data, null, settings.storageId).then(() => {
                                if (typeof core.ud.postflight === "function") {
                                    return core.ud.postflight(dataRef, dataSrc, data, 'data', settings);
                                }
                                return data;
                            });
                        });
                    } else {
                        coreErrorHandler.logEnhancedError(`HTTP ${response.status}: ${response.statusText}`, 'backend.getData');
                        return failResponse;
                    }
                } catch (error) {
                    coreErrorHandler.logEnhancedError(error, 'backend.getData');
                    return { success: false, error: error.message, settings };
                }
            },
            getTemplate: async (dataRef, dataSrc, settings = {}) => {
                try {
                    const cacheKey = dataRef;
                    const now = Date.now();
                    
                    // Check cache first
                    if (core.be.cacheCreateTs.template[cacheKey] && 
                        (now - core.be.cacheCreateTs.template[cacheKey]) < core.be.cacheTTL.template) {
                        if (useDebugger) console.log("core.js serving template from cache '" + dataRef + "'");
                        return core.cr.getTemplate(dataRef);
                    }

                    // Log the fetch request
                    core.be.fetchLogFIFO[dataRef] = { type: 'template', dataRef, dataSrc, settings };

                    // Merge default settings with user settings
                    const fetchSettings = {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                        },
                        ...settings
                    };

                    // Apply user preflight hook
                    if (typeof core.ud.preflight === "function") {
                        const modifiedSettings = core.ud.preflight(dataRef, dataSrc, fetchSettings);
                        if (modifiedSettings) {
                            Object.assign(fetchSettings, modifiedSettings);
                        }
                    }

                    if (useDebugger) console.log("core.js fetching template '" + dataRef + "' from " + dataSrc);
                    
                    const response = await fetch(dataSrc, fetchSettings);
                    if (response.ok) {
                        const text = await response.text();
                        core.be.cacheCreateTs.template[cacheKey] = now;
                        return core.cr.setTemplate(dataRef, text).then(() => {
                            if (typeof core.ud.postflight === "function") {
                                return core.ud.postflight(dataRef, dataSrc, text, 'template', settings);
                            }
                            return text;
                        });
                    } else {
                        coreErrorHandler.logEnhancedError(`HTTP ${response.status}: ${response.statusText}`, 'backend.getTemplate');
                        return null;
                    }
                } catch (error) {
                    coreErrorHandler.logEnhancedError(error, 'backend.getTemplate');
                    return null;
                }
            },
            checkCacheTs: (name, type) => {
                const cacheTs = core.be.cacheCreateTs[type];
                const now = Date.now();
                const ttl = core.be.cacheTTL[type];
                return cacheTs[name] && (now - cacheTs[name]) < ttl;
            },
            awaitAll: async () => {
                const promises = [];
                for (const name in core.be.fetchLogFIFO) {
                    const settings = core.be.fetchLogFIFO[name];
                    if (settings.type === 'data') {
                        promises.push(core.be.getData(settings.dataRef, settings.dataSrc, settings));
                    } else {
                        promises.push(core.be.getTemplate(settings.dataRef, settings.dataSrc, settings));
                    }
                }
                return Promise.all(promises);
            },
            clearCache: (type = 'both') => {
                if (type === 'data' || type === 'both') {
                    core.be.cacheCreateTs.data = {};
                }
                if (type === 'template' || type === 'both') {
                    core.be.cacheCreateTs.template = {};
                }
                if (useDebugger) console.log('core.js cache cleared: ' + type);
            }
        },
        //clone registry
        cr: {
            data: {},
            template: {},
            init: () => {
                //load templates from cr-data section
                const templates = core.section.querySelectorAll('template');
                if (templates.length) {
                    if (useDebugger) console.log('core.js loading ' + templates.length + ' templates from DOM');
                    templates.forEach(template => {
                        core.cr.setTemplate(template.getAttribute('name'), template.innerHTML);
                    });
                }
            },
            setTemplate: (name, templateContent) => {
                core.template.innerHTML = templateContent;
                const clone = core.template.content.cloneNode(true);
                core.template.innerHTML = '';
                core.cr.template[name] = { 
                    clone: clone, 
                    content: templateContent,
                    ts: Date.now()
                };
                return Promise.resolve(core.cr.template[name]);
            },
            getTemplate: (name) => {
                if (core.cr.template[name]) {
                    return Promise.resolve(core.cr.template[name].clone.cloneNode(true));
                }
                return Promise.reject(new Error('Template "' + name + '" not found'));
            },
            setData: (name, data, elem, storageId) => {
                const dataObj = {
                    data: data,
                    elem: elem,
                    storageId: storageId,
                    ts: Date.now()
                };
                core.cr.data[name] = dataObj;
                
                // Store in DOM if storageId is provided
                if (elem && storageId !== undefined) {
                    if (storageId === 0) {
                        // Memory only - already stored in core.cr.data
                    } else if (storageId === 1) {
                        // DOM persistent
                        elem.setAttribute('data-core-data-' + name, JSON.stringify(data));
                    } else if (storageId === 2) {
                        // Session persistent
                        sessionStorage.setItem('core-data-' + name, JSON.stringify(data));
                    }
                }
                
                return Promise.resolve(dataObj);
            },
            getData: (name) => {
                if (core.cr.data[name]) {
                    return Promise.resolve(core.cr.data[name].data);
                }
                return Promise.reject(new Error('Data "' + name + '" not found'));
            },
            remove: (name) => {
                delete core.cr.data[name];
                delete core.cr.template[name];
                return Promise.resolve();
            },
            clear: () => {
                core.cr.data = {};
                core.cr.template = {};
                return Promise.resolve();
            }
        },
        //helper functions
        hf: {
            date: (date = null, format = null) => {
                const d = date ? new Date(date) : new Date();
                if (format === 'ts') {
                    return d.getTime();
                } else if (format === 'YYYY') {
                    return d.getFullYear();
                } else if (format === null) {
                    return d.toLocaleString();
                }
                return d;
            },
            uuid: () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            addClickListeners: () => {
                // Add click listeners for hash-based routing
                document.addEventListener('click', (e) => {
                    const target = e.target.closest('a');
                    if (target && target.href && target.href.includes('#')) {
                        const hash = target.href.split('#')[1];
                        if (hash && useRouting) {
                            e.preventDefault();
                            window.location.hash = '#' + hash;
                        }
                    }
                });
            },
            parseJSON: (str) => {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    console.error('core.js: Invalid JSON string', e);
                    return null;
                }
            },
            copyToClipboard: (text) => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                let successful = false;
                try {
                    successful = document.execCommand('copy');
                } catch (err) {
                    if (useDebugger) console.log('core.js copy unsuccessful');
                }
                document.body.removeChild(textarea);
                return successful;
            },
            formatData: (data, formatter) => {
                if (!formatter) return data;
                
                // Handle custom formatters
                if (typeof core.ud.formatters === 'object' && core.ud.formatters[formatter]) {
                    return core.ud.formatters[formatter](data);
                }
                
                // Built-in formatters
                switch (formatter) {
                    case 'uppercase':
                        return String(data).toUpperCase();
                    case 'lowercase':
                        return String(data).toLowerCase();
                    case 'capitalize':
                        return String(data).charAt(0).toUpperCase() + String(data).slice(1);
                    case 'currency':
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data);
                    case 'number':
                        return new Intl.NumberFormat().format(data);
                    case 'date':
                        return new Intl.DateTimeFormat().format(new Date(data));
                    case 'datetime':
                        return new Intl.DateTimeFormat({ 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }).format(new Date(data));
                    case 'json':
                        return JSON.stringify(data, null, 2);
                    case 'checked':
                        return data ? 'checked' : '';
                    case 'selected':
                        return data ? 'selected' : '';
                    case 'disabled':
                        return data ? 'disabled' : '';
                    case 'hidden':
                        return data ? 'hidden' : '';
                    case 'strikethrough':
                        return data ? 'text-decoration: line-through' : '';
                    default:
                        return data;
                }
            },
            sortObjects: (objects, key, direction = 'asc') => {
                return [...objects].sort((a, b) => {
                    const aVal = a[key];
                    const bVal = b[key];
                    
                    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                    return 0;
                });
            },
            filterObjects: (objects, filters) => {
                return objects.filter(obj => {
                    return Object.entries(filters).every(([key, value]) => {
                        if (Array.isArray(value)) {
                            return value.includes(obj[key]);
                        }
                        return obj[key] === value;
                    });
                });
            }
        },
        //pocket functions
        pk: {
            init: () => {
                core_pk_count = 0;
                const pockets = document.querySelectorAll('.core-pocket, [data-core-templates]');
                
                if (useDebugger && pockets.length) console.log('core.js initializing ' + pockets.length + ' pockets');
                
                pockets.forEach((pocket, index) => {
                    setTimeout(() => {
                        core_pk_count++;
                        core.pk.render(pocket);
                    }, index * 50); // Stagger pocket rendering
                });
            },
            render: (pocket) => {
                const templates = pocket.getAttribute('data-core-templates');
                const dataSource = pocket.getAttribute('data-core-source');
                const routing = pocket.getAttribute('data-core-routing');
                
                if (routing !== null) {
                    pocket.setAttribute('data-core-routing', 'false');
                }
                
                if (templates) {
                    const templateNames = templates.split(',').map(t => t.trim());
                    const renderPromises = templateNames.map(templateName => {
                        return core.cr.getTemplate(templateName).then(templateClone => {
                            if (templateClone) {
                                // Clear pocket content
                                pocket.innerHTML = '';
                                // Append template
                                pocket.appendChild(templateClone);
                                return true;
                            }
                            return false;
                        }).catch(error => {
                            coreErrorHandler.logEnhancedError(error, 'pocket.render');
                            return false;
                        });
                    });
                    
                    Promise.all(renderPromises).then(() => {
                        core.hf.hydrate(pocket);
                        core.hf.format(pocket);
                        
                        // Handle data source if specified
                        if (dataSource) {
                            core.pk.loadDataSource(pocket, dataSource);
                        }
                        
                        // Lock pocket if locking is enabled
                        if (useLocking) {
                            pocket.classList.add('core-locked');
                        }
                    });
                }
            },
            loadDataSource: (pocket, dataSource) => {
                // Handle different data source formats
                if (dataSource.startsWith('http') || dataSource.startsWith('/')) {
                    // External data source
                    core.be.getData('pocket-data', dataSource).then(data => {
                        if (data && !data.error) {
                            core.hf.hydrate(pocket, data);
                        }
                    });
                } else {
                    // Local data reference
                    core.cr.getData(dataSource).then(data => {
                        core.hf.hydrate(pocket, data);
                    }).catch(() => {
                        // Try to parse as JSON
                        const parsed = core.hf.parseJSON(dataSource);
                        if (parsed) {
                            core.hf.hydrate(pocket, parsed);
                        }
                    });
                }
            },
            refresh: (pocket) => {
                if (pocket && !pocket.classList.contains('core-locked')) {
                    core.pk.render(pocket);
                }
            },
            refreshAll: () => {
                const pockets = document.querySelectorAll('.core-pocket:not(.core-locked), [data-core-templates]:not(.core-locked)');
                pockets.forEach(pocket => core.pk.refresh(pocket));
            }
        },
        //user defined functions
        ud: {}
    };
})();

// Auto-initialize when DOM is ready
(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            core.init();
        });
    } else {
        core.init();
    }
})();

// Add hydration and formatting methods to helper functions
core.hf.hydrate = (container, data = null) => {
    const elements = container.querySelectorAll('[data-core-data]');
    
    if (useDebugger && elements.length) console.log('core.js hydrating ' + elements.length + ' elements');
    
    elements.forEach(element => {
        const dataRef = element.getAttribute('data-core-data');
        const dataPath = dataRef.split(':');
        
        try {
            let value;
            if (data && dataPath[0] === 'data') {
                // Use provided data
                value = data;
                for (let i = 1; i < dataPath.length; i++) {
                    value = value[dataPath[i]];
                    if (value === undefined) break;
                }
            } else {
                // Use registry data
                if (dataPath.length > 1) {
                    const registryName = dataPath[0];
                    const path = dataPath.slice(1);
                    value = core.cr.getData(registryName);
                    for (const key of path) {
                        value = value[key];
                        if (value === undefined) break;
                    }
                } else {
                    value = core.cr.getData(dataRef);
                }
            }
            
            if (value !== undefined) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = value;
                } else if (element.tagName === 'IMG') {
                    element.src = value;
                } else if (element.tagName === 'A') {
                    element.href = value;
                } else {
                    element.textContent = value;
                }
            }
        } catch (error) {
            coreErrorHandler.logEnhancedError(error, 'hydrate');
        }
    });
};

core.hf.format = (container) => {
    const elements = container.querySelectorAll('[data-core-format]');
    
    if (useDebugger && elements.length) console.log('core.js formatting ' + elements.length + ' elements');
    
    elements.forEach(element => {
        const formatter = element.getAttribute('data-core-format');
        const text = element.textContent;
        
        try {
            const formatted = core.hf.formatData(text, formatter);
            element.textContent = formatted;
        } catch (error) {
            coreErrorHandler.logEnhancedError(error, 'format');
        }
    });
};

// Add clone handling
document.addEventListener('DOMContentLoaded', () => {
    const clones = document.querySelectorAll('.core-clone');
    clones.forEach(clone => {
        const dataRef = clone.getAttribute('data-core-data');
        if (dataRef) {
            core.cr.getData(dataRef).then(data => {
                if (Array.isArray(data)) {
                    const template = clone.querySelector('template') || clone.firstElementChild;
                    if (template) {
                        clone.innerHTML = '';
                        data.forEach((item, index) => {
                            const templateClone = template.cloneNode(true);
                            templateClone.classList.add('core-cloned');
                            templateClone.setAttribute('data-clone-index', index);
                            clone.appendChild(templateClone);
                            core.hf.hydrate(templateClone, { rec: item });
                            core.hf.format(templateClone);
                        });
                    }
                }
            }).catch(error => {
                coreErrorHandler.logEnhancedError(error, 'clone.init');
            });
        }
    });
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = core;
} else if (typeof window !== 'undefined') {
    window.core = core;
}
