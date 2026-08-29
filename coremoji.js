/*!
 * coremoji.js — an emoji port of core.js @20260329
 * ---------------------------------------------------------------------------
 * WHY IT LOOKS LIKE THIS
 * JavaScript identifiers must be Unicode ID_Start/ID_Continue letters. Emoji
 * are category So, so `let 🚀 = 1` is a SyntaxError. Emoji ARE legal as
 * property keys, so every name in this port is an emoji KEY, and the only
 * identifiers left are these letter-free scope handles:
 *
 *   $        the module itself (globalThis["🧩"], a.k.a. `core`)
 *   _        module-private state (the closure `let`s of the original)
 *   $1..$5   function parameters, positionally
 *   $$ $$$   loop / iteration / callback bindings
 *   _$       tertiary binding
 *   $_       catch binding
 *   __ ___   per-call scratch objects standing in for function-local vars
 *
 * NAMESPACES              PRIVATE STATE / METHOD KEYS (selected)
 *   🧩 core                 🏷️ version   📑 section   📄 template  🌐 baseUrl
 *   📡 be    🔁 cb          🐛 debugger  🧭 routing   🔒 locking   #️⃣ lastHash
 *   🗄️ cr    🔧 hf          🚨 errors    ⏱️ cacheTs   ⌛ expiry    📜 fetch log
 *   👝 pk    🧱 md          🤞 promises  🚀 init      🎬 soc       🏁 eoc
 *   🛡️ sv    🙋 ud          📥 get       ✍️ set       📖 read      🗑️ delete
 *   🎨 ux    🎯 hit         🛫 preflight 🛬 postflight 🎨 paint    💉 inject
 *                          ⛏️ dig       💧 hydrate   💄 format    👯 clone
 *                          🧽 scrub     🔣 regex     🕳️ delta     👆 click
 *
 * WHAT STAYED IN LATIN, AND WHY
 * Emoji can only go where core.js owns the name. These are contracts with the
 * outside world and are byte-for-byte identical to core.js:
 *   1. Web platform APIs — fetch/DOM/Storage/URL, and fetch's own
 *      method/cache/redirect/headers/body keys.
 *   2. DOM contracts — data-core-*, .core-pocket/.core-clone/.core-cloned-*,
 *      #cr-data, and storage keys (coreInternalHit, coreRecord, ...).
 *   3. Template vocabulary — {{data:...}} / {{rec:...}} syntax, h-/f- class
 *      prefixes, format names ('money', 'upper', ...), date tokens ('YYYY').
 *   4. Cross-module shapes — the `settings` object (core.ud.preflight sees it),
 *      scrub objects ({name, value, scrubs} — /module/form.js builds these),
 *      core.hit's keys (templates read them), and ccNumAuth's result.
 *   5. globalThis.core stays as an alias so /module/form.js keeps working.
 *
 * Behaviour is a faithful port, bugs included: the duplicate defaultDeltaFormat
 * setter and the never-exposed activePromises lookup are preserved on purpose.
 */

globalThis["🏷️"] = '20260329';  // core_version
globalThis["📡🔢"] = 0;          // core_be_count
globalThis["🗄️🔢"] = 0;          // core_cr_count
globalThis["👝🔢"] = 0;          // core_pk_count

const $ = globalThis["🧩"] = globalThis["core"] = (() => {
    const _ = {};
    _["📄"] = document.createElement('template');                                   // template
    _["📑"] = document.getElementById('cr-data') || _["📄"].cloneNode(true);         // section
    _["🔗"] = new URL(window.location.href);                                        // urlObj
    _["🌐"] = 'https://cdn.jsdelivr.net/gh/Sitezip/core.sbs@' + globalThis["🏷️"];   // baseUrl, CDN default
    if (document.currentScript && document.currentScript.src.startsWith(window.location.origin)) {
        _["🌐"] = window.location.origin; //Auto-detect if running locally to avoid 404 check on CDN
    }
    _["🐛"] = true;  // useDebugger — user setting, ENABLED FOR DEBUGGING
    _["🧭"] = true;  // useRouting  — user setting, ENABLED FOR PROPER SPA FUNCTIONALITY
    _["🔒"] = true;  // useLocking  — true = pockets lock after complete, false = pockets refresh every soc call

    if (document.readyState === 'complete') {
        setTimeout(() => { $["🚀"]() });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            $["🚀"]();
        });
    }

    window.addEventListener('hashchange', () => {
        if (_["🧭"]) {
            console.log('coremoji.js: Hash change detected, reinitializing pockets');
            console.log('coremoji.js: Current hash:', window.location.hash);
            // Force complete reinitialization
            $["👝"]["🚀"]();
        }
    });

    // For hash-based routing, we need to handle back/forward differently
    // Monitor for hash changes that might come from browser navigation
    _["#️⃣"] = window.location.hash;  // lastHandledHash

    window.addEventListener('popstate', ($1) => {
        if (_["🧭"]) {
            console.log('coremoji.js: Popstate detected, current hash:', window.location.hash);
            console.log('coremoji.js: Event state:', $1.state);
            // Force complete reinitialization on popstate
            setTimeout(() => {
                console.log('coremoji.js: Force reinitializing pockets after popstate');
                $["👝"]["🚀"]();
                _["#️⃣"] = window.location.hash;
            }, 10);
        }
    });

    // Additional monitoring for hash changes from browser navigation
    setInterval(() => {
        if (_["🧭"] && window.location.hash !== _["#️⃣"]) {
            console.log('coremoji.js: Hash change detected via monitoring, from', _["#️⃣"], 'to', window.location.hash);
            $["👝"]["🚀"]();
            _["#️⃣"] = window.location.hash;
        }
    }, 50);

    // Enhanced error handling with suggestions (coreErrorHandler)
    _["🚨"] = {
        // getErrorSuggestion(error, context)
        "💡": ($1, $2) => {
            const __ = {};
            __["📚"] = {
                'Failed to fetch': {
                    "💬": 'Network request failed',
                    "🩹": [
                        'Check if the server is running',
                        'Verify the URL is correct',
                        'Check CORS settings',
                        'Ensure network connectivity'
                    ]
                },
                'template not found': {
                    "💬": 'Template file missing',
                    "🩹": [
                        'Verify template file exists',
                        'Check file path in data-core-templates attribute',
                        'Ensure file extension is correct (.html)',
                        'Check file permissions'
                    ]
                },
                'JSON parse': {
                    "💬": 'Invalid JSON format',
                    "🩹": [
                        'Validate JSON syntax',
                        'Check for trailing commas',
                        'Ensure proper quote usage',
                        'Use JSON linter for validation'
                    ]
                },
                'null': {
                    "💬": 'Null reference error',
                    "🩹": [
                        'Check if element exists in DOM',
                        'Verify data is loaded before accessing',
                        'Add null checks',
                        'Use optional chaining (?.)'
                    ]
                },
                'undefined': {
                    "💬": 'Undefined reference error',
                    "🩹": [
                        'Check variable declarations',
                        'Verify function parameters',
                        'Check object property names',
                        'Ensure proper initialization'
                    ]
                }
            };

            __["🔤"] = $1.toString().toLowerCase();
            for (const [$$, $$$] of Object.entries(__["📚"])) {
                if (__["🔤"].includes($$)) {
                    return $$$;
                }
            }

            return {
                "💬": 'Unknown error occurred',
                "🩹": [
                    'Check browser console for details',
                    'Verify coremoji.js version compatibility',
                    'Check documentation for proper usage',
                    'Report issue if problem persists'
                ]
            };
        },

        // logEnhancedError(error, context)
        "📝": ($1, $2 = 'general') => {
            if (!_["🐛"]) return;

            const __ = {};
            __["💡"] = _["🚨"]["💡"]($1, $2);

            console.group(`🚨 coremoji.js Error [${$2}]`);
            console.error('Error:', $1);
            console.warn('💡 Suggestion:', __["💡"]["💬"]);
            console.info('🔧 Possible solutions:');
            __["💡"]["🩹"].forEach(($$, $$$) => {
                console.info(`  ${$$$ + 1}. ${$$}`);
            });
            console.groupEnd();
        }
    };

    return {
        get "📑"() {   // section
            return _["📑"];
        },
        get "📄"() {   // template
            return _["📄"];
        },
        get "🌐"() {   // baseUrl
            return _["🌐"];
        },
        get "🐛"() {   // useDebugger
            return _["🐛"];
        },
        set "🐛"($1) {
            _["🐛"] = Boolean(+$1);
        },
        set "🧭"($1) { // useRouting
            _["🧭"] = Boolean(+$1);
        },
        // init
        "🚀": () => {
            if (_["🐛"]) console.log('coremoji.js loaded at ' + $["🔧"]["📅"]());

            //set hit data for use in templates and user scripts, also available via 🧩["🎯"] and 🧩["🗄️"]["📖"]('coreInternalHit')
            $["🎯"] = {
                baseUrl: _["🌐"],
                useDebugger: _["🐛"],
                useLocking: _["🔒"],
                useRouting: _["🧭"],
                version: globalThis["🏷️"],
                ts: $["🔧"]["📅"](null, 'ts'),
                uuid: $["🔧"]["🆔🎲"](),
                YYYY: +$["🔧"]["📅"](null, 'YYYY')
            };
            $["🗄️"]["✍️"]('coreInternalHit', $["🎯"]);

            $["🗄️"]["🚀"]();
            $["🔧"]["👂"]();

            // Defer non-critical initialization to reduce DOMContentLoaded time
            if (typeof $["🙋"]["🚀"] === 'function') {
                $["🙋"]["🚀"]();
            }

            // Start pocket initialization asynchronously with fallback
            const __ = {};
            __["👝⏭️"] = () => {   // deferPockets
                $["👝"]["🚀"]();
            };

            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(__["👝⏭️"]);
            } else {
                // Fallback for older browsers
                setTimeout(__["👝⏭️"], 100);
            }

            if (_["🌐"] === _["🔗"].origin) {
                $["📡"]["📥"]('coreInternalCheck', '/module/install.json'); //check for local install
            } else {
                $["📡"]["📥"]('coreInternalObjects', _["🌐"] + '/core.json');
            }
        },
        //backend functions (be)
        "📡": (() => {
            _["📡"] = {};
            _["📡"]["⏱️"] = { data: {}, template: {} };  // cacheCreateTs
            _["📡"]["⌛"] = { data: {}, template: {} };  // cacheExpire — user setting
            _["📡"]["⌛🔻"] = 86400;                      // cacheExpireDefault — user setting, in seconds
            _["📡"]["📜"] = {};                           // fetchLogFIFO
            _["📡"]["🤞"] = [];                           // activePromises

            // trackPromise
            _["📡"]["🤞➕"] = ($1) => {
                const __ = {};
                __["🤞"] = $1.catch(() => { }); // Prevent unhandled rejection in tracking
                _["📡"]["🤞"].push(__["🤞"]);
                __["🤞"].finally(() => {
                    _["📡"]["🤞"] = _["📡"]["🤞"].filter($$ => $$ !== __["🤞"]);
                });
                return $1;
            };

            return {
                /**
                 * ⏳ awaitAll — waits for all active backend requests to complete.
                 * This ensures that the application state is fully synchronized before proceeding.
                 *
                 * @async
                 * @returns {Promise<void>} Resolves when all tracked promises have settled.
                 */
                "⏳": async () => {
                    while (_["📡"]["🤞"].length) {
                        await Promise.all(_["📡"]["🤞"]);
                    }
                },
                get "⏱️"() {   // cacheCreateTs
                    return _["📡"]["⏱️"];
                },
                set "⌛"($1) { // cacheExpire
                    //type is either data or template
                    //format: {type:'data',name:'quote',seconds:5}
                    if ($["🔧"]["⛏️"]($1, 'type') && $["🔧"]["⛏️"]($1, 'name') && $["🔧"]["⛏️"]($1, 'seconds')) {
                        _["📡"]["⌛"][$1.type][$1.name] = (+$1.seconds || 0);
                    }
                },
                get "⌛"() {
                    return _["📡"]["⌛"];
                },
                set "⌛🔻"($1) { // cacheExpireDefault
                    _["📡"]["⌛🔻"] = (+$1 || 0);
                },
                get "📜"() {   // fetchLogFIFO
                    return _["📡"]["📜"];
                },
                // setCacheTs(dataRef, type)
                "⏱️✍️": ($1, $2) => {
                    _["📡"]["⏱️"][$2][$1] = $["🔧"]["📅"](null, 'ts');
                },
                // checkCacheTs(dataRef, type)
                "⏱️❓": ($1, $2) => {
                    const __ = {};
                    __["⌛"] = _["📡"]["⌛"][$2][$1] || _["📡"]["⌛🔻"];   // cacheLife
                    return (_["📡"]["⏱️"][$2][$1] || $["🔧"]["📅"](null, 'ts')) + __["⌛"] > $["🔧"]["📅"](null, 'ts');
                },
                // setGetParams(settings)
                "⚙️": ($1) => {
                    const __ = {};
                    //log settings
                    _["📡"]["📜"][$1.dataRef] = $1;

                    __["🎛️"] = {                                    // fetchParams
                        method: ($1.method || 'GET'),               // *GET, POST, PUT, PATCH, DELETE, etc.
                        //mode: "no-cors",                          // *cors, no-cors, same-origin
                        cache: ($1.cache || "no-cache"),            // *default, no-cache, reload, force-cache, only-if-cached
                        //credentials: "same-origin",               // *same-origin, include, omit
                        redirect: ($1.redirect || "follow"),        // manual, *follow, error
                        //referrerPolicy: "no-referrer",            // *no-referrer-when-downgrade, no-referrer, origin, ...
                    }

                    //checking for an key/value object of header pairs
                    if ('headers' in $1 && $1.headers && Object.entries($1.headers).length) {
                        __["🎛️"].headers = $1.headers;
                    }

                    if ('fetchParams' in $1 && $1.fetchParams && Object.entries($1.fetchParams).length) {
                        __["🎛️"] = { ...__["🎛️"], ...$1.fetchParams };
                    }

                    //checking for data in user-defined settings; an object of name/value pairs to be posted
                    if ('data' in $1 && $1.data && Object.entries($1.data).length) {
                        __["🎛️"].method = ['GET'].includes($1.method) ? 'POST' : $1.method.toUpperCase();
                        //checking for a body post or a form post
                        if ('isFormData' in $1 && $1.isFormData) {
                            __["📮"] = new FormData();
                            Object.entries($1.data).forEach(function ($$) {
                                __["📮"].append($$[0], String($$[1]));
                            })
                            __["🎛️"].body = __["📮"];
                        } else {
                            __["🎛️"].body = JSON.stringify($1.data);
                        }
                    }

                    return __["🎛️"];
                },
                /**
                 * 📥 getData — fetches data from a source and stores it in the registry.
                 *
                 * @async
                 * @param {string} $1 dataRef - The unique identifier for the data.
                 * @param {string} $2 dataSrc - The URL or source to fetch data from.
                 * @param {object} $3 settings - Optional configuration for the fetch request.
                 * @returns {Promise<object|object[]>} The fetched data object or array.
                 */
                "📥": ($1, $2, $3) => {
                    const __ = {};
                    $3 = $["📡"]["🛫"]($1, $2, 'data', $3);
                    $["📡"]["⏱️✍️"]($1, 'data');
                    //check if a predefined/custom object (dataObj) has been passed to settings via preflight or data-core-source
                    __["🧾"] = $["🔧"]["🧾"]($3.dataSrc);
                    if (__["🧾"]) {
                        $3.dataObj = __["🧾"];
                    }
                    if ($3.hasOwnProperty('dataObj') && Array.isArray($3.dataObj)) {
                        $["🗄️"]["✍️"]($3.dataRef, $3.dataObj);
                        return Promise.resolve($3.dataObj);
                    }

                    __["🤞"] = fetch($3.dataSrc, $["📡"]["⚙️"]($3))
                        .then(($$) => {
                            const ___ = {};
                            ___["💥"] = { success: false, error: true, settings: $3 };   // failResponse
                            if ($$.ok) {
                                return $$.json().catch(() => {
                                    // If JSON parsing fails, return failResponse object
                                    ___["💥"].parseError = true;
                                    return ___["💥"];
                                });
                            } else {
                                return ___["💥"];
                            }
                        }).then(($$) => {
                            $$ = ($["📡"]["🛬"]($3.dataRef, $$, 'data') || $$);
                            $["🗄️"]["✍️"]($3.dataRef, $$);
                            return $$;
                        }).catch(($_) => {
                            console.error($_);
                            throw $_;
                        });

                    return _["📡"]["🤞➕"](__["🤞"]);
                },
                /**
                 * 📄📥 getTemplate — fetches a template string from a source.
                 *
                 * @async
                 * @param {string} $1 dataRef - The unique identifier for the template.
                 * @param {string} $2 dataSrc - The URL or source to fetch the template from.
                 * @param {object} $3 settings - Optional configuration for the fetch request.
                 * @returns {Promise<string>} The fetched template string.
                 */
                "📄📥": ($1, $2, $3) => {
                    const __ = {};
                    $3 = $["📡"]["🛫"]($1, $2, 'template', $3);
                    $["📡"]["⏱️✍️"]($1, 'template');

                    __["🤞"] = fetch($3.dataSrc, $["📡"]["⚙️"]($3))
                        .then(($$) => {
                            return ($$.ok ? $$.text() : $["🙋"]["❗📄"]);
                        }).then(($$) => {
                            $$ = ($["📡"]["🛬"]($3.dataRef, ($$ || $["🙋"]["❗📄"]), 'template') || $$);
                            $["🗄️"]["📄✍️"]($3.dataRef, $$);
                            return $$;
                        }).catch(($_) => {
                            console.error($_);
                            throw $_;
                        });

                    return _["📡"]["🤞➕"](__["🤞"]);
                },
                // preflight(dataRef, dataSrc, type, settings)
                "🛫": ($1, $2, $3, $4 = {}) => {
                    const __ = {};
                    //log the request settings, pre
                    _["📡"]["📜"][$1] = { ...$4, ...{ FIFOtype: 'pre', FIFOts: $["🔧"]["📅"](null, 'ts') } };
                    //settings: method, cache, redirect, headers, data, isFormData,...dataRef, dataSrc, type
                    __["🎛️"] = {                    // defaultSettings
                        dataRef: $1, //TODO add a default here when undefined
                        dataSrc: $2 || $1,
                        type: $3,
                        method: 'GET',
                        cache: 'no-cache',
                        redirect: 'follow',
                        headers: null,
                        data: null,
                        isFormData: false,
                    }

                    if (typeof $["🙋"]["🛫"] === "function") {
                        $4 = { ...__["🎛️"], ...$4, ...$["🙋"]["🛫"](__["🎛️"].dataRef, __["🎛️"].dataSrc, __["🎛️"].type) };
                    }

                    //log the request settings, final
                    __["🏁"] = { ...__["🎛️"], ...$4, ...{ FIFOtype: 'final', FIFOts: $["🔧"]["📅"](null, 'ts') } };
                    _["📡"]["📜"][$1] = __["🏁"];

                    return __["🏁"];
                },
                // postflight(dataRef, dataObj, type)
                "🛬": ($1, $2, $3) => {
                    //remove text hints from internal objects
                    if ($1 === 'coreInternalObjects') {
                        for (const $$ in $2) {
                            if ($$.endsWith('Use')) {
                                delete $2[$$];
                            }
                        }
                    } else if ($1 === 'coreInternalCheck') {
                        if ($2.hasOwnProperty('success') && $2.success) {
                            _["🌐"] = _["🔗"]['origin'];
                        }
                        //get core internal objects making them available as needed
                        $["📡"]["📥"]('coreInternalObjects', _["🌐"] + '/core.json');
                    }
                    if (typeof $["🙋"]["🛬"] === "function") {
                        return $["🙋"]["🛬"]($1, $2, $3);
                    }
                    return $2;
                },
            }
        })(),
        //callback functions (cb)
        "🔁": (() => {
            return {
                // prepaint(dataRef, dataObj, type)
                "🎨⏮️": ($1, $2, $3) => {
                    if (typeof $["🙋"]["🎨⏮️"] === "function") {
                        $["🙋"]["🎨⏮️"]($1, $2, $3);
                    }
                },
                // postpaint(dataRef, dataObj, type)
                "🎨⏭️": ($1, $2, $3) => {
                    // Universal backwards compatibility: handle all edge cases gracefully
                    if (typeof $["🙋"]["🎨⏭️"] === "function") {
                        try {
                            // Call user postpaint with whatever parameters it receives
                            // Let the user's function handle null/undefined values as needed
                            $["🙋"]["🎨⏭️"]($1, $2, $3);
                        } catch ($_) {
                            // Only log actual errors, not null reference issues
                            if (_["🐛"] && $_.message && !$_.message.includes('null') && !$_.message.includes('undefined')) {
                                console.warn(`Error in postpaint for ${$1}:`, $_);
                            }
                        }
                    }
                },
            }
        })(),
        //create functions (cr)
        "🗄️": (() => {
            _["🗄️"] = {};
            _["🗄️"]["🆔"] = 1;   // storageIdDefault
            return {
                set "🆔"($1) {
                    _["🗄️"]["🆔"] = (+$1 || 0);
                },
                // init
                "🚀": () => {
                    const __ = {};
                    __["✅"] = [];   // preloaded
                    __["📄s"] = _["📑"].querySelectorAll('template[name]') || [];
                    for (const $$ of __["📄s"]) {
                        const ___ = {};
                        ___["🏷️"] = $$.getAttribute('name');
                        // Get template content directly without data injection during init
                        ___["📃"] = String(unescape($$.textContent || $$.innerHTML)).trim();
                        $["🗄️"]["📄✍️"](___["🏷️"], ___["📃"]);
                        __["✅"].push(___["🏷️"]);
                    }
                    //setup keyword templates
                    if (!__["✅"].includes('EMPTY')) {
                        $["🗄️"]["📄✍️"]('EMPTY', $["🙋"]["📭📄"]);
                    }
                    if (!__["✅"].includes('LOADING')) {
                        $["🗄️"]["📄✍️"]('LOADING', $["🙋"]["⏳📄"]);
                    }
                },
                // delData(name, elem, storageId)
                "🗑️": ($1, $2, $3) => {
                    $2 = ($2 || _["📑"]);
                    $3 = (($3 === null || $3 === undefined) ? _["🗄️"]["🆔"] : +$3);

                    if ($3 === 0 && $2["🧩📦"] && $2["🧩📦"].hasOwnProperty($1)) {
                        //DOM (Option A)
                        delete $2["🧩📦"][$1];
                    } else if ($3 === 1 && $2.dataset.hasOwnProperty($1)) {
                        //STATIC (Option B)
                        delete $2.dataset[$1];
                    } else if ($3 === 2 && sessionStorage.getItem($1)) {
                        //SESSION (Option C), elem is ignored
                        sessionStorage.removeItem($1)
                    } else if ($3 === 3 && localStorage.getItem($1)) {
                        //LOCAL (Option D), elem is ignored
                        localStorage.removeItem($1)
                    }
                },
                // setData(name, data, elem, storageId)
                "✍️": ($1, $2, $3, $4) => {
                    $3 = ($3 || _["📑"]);
                    $4 = (($4 === null || $4 === undefined) ? _["🗄️"]["🆔"] : +$4);

                    //check for internal requests
                    if ($1.startsWith('coreInternal')) {
                        $4 = 2;
                    }

                    //delete previous data by name
                    $["🗄️"]["🗑️"]($1, $3);

                    if ($4 === 0) {
                        //DOM (Option A)
                        $3["🧩📦"] = { [$1]: $2 };
                    } else if ($4 === 1) {
                        //STATIC (Option B)
                        $3.dataset[$1] = JSON.stringify($2);
                    } else if ($4 === 2) {
                        //SESSION (Option C), elem is ignored
                        sessionStorage.setItem($1, JSON.stringify($2));
                    } else if ($4 === 3) {
                        //LOCAL (Option D), elem is ignored
                        localStorage.setItem($1, JSON.stringify($2));
                    }

                    return $["🗄️"]["📖"]($1, $3);
                },
                // getData(name, elem, storageId)
                "📖": ($1, $2, $3) => {
                    $2 = ($2 || _["📑"]);
                    $3 = (($3 === null || $3 === undefined) ? _["🗄️"]["🆔"] : +$3);

                    //check for internal requests
                    if ($1.startsWith('coreInternal')) {
                        $3 = 2;
                    }

                    //check for expired cache
                    if (!$["📡"]["⏱️❓"]($1, 'data')) {
                        if (_["🐛"]) console.log("coremoji.js cache '" + $1 + "' has expired");
                        if ($["📡"]["📜"].hasOwnProperty($1)) {
                            //if pk is not already processsing trigger refresh
                            //Trigger refresh
                            setTimeout(() => {
                                $["👝"]["🎬"]();
                            })
                            const __ = {};
                            __["🎛️"] = $["📡"]["📜"][$1];   // settings
                            if ($["📡"]["📜"][$1].type === 'data') {
                                $["📡"]["📥"](__["🎛️"].dataRef, __["🎛️"].dataSrc, __["🎛️"]);
                                if (_["🐛"]) console.log("coremoji.js data '" + $1 + "' requested");
                            } else {
                                $["📡"]["📄📥"](__["🎛️"].dataRef, __["🎛️"].dataSrc, __["🎛️"]);
                                if (_["🐛"]) console.log("coremoji.js template '" + $1 + "' requested");
                            }
                        }
                    }

                    //return data, (even if expired, refresh will occure immediately after)
                    if ($3 === 0 && $2["🧩📦"] && $2["🧩📦"].hasOwnProperty($1)) {
                        //DOM (Option A)
                        return $2["🧩📦"][$1];
                    } else if ($3 === 1 && $2.dataset.hasOwnProperty($1)) {
                        //STATIC (Option B)
                        return $["🔧"]["🧾"]($2.dataset[$1]);
                    } else if ($3 === 2 && sessionStorage.getItem($1)) {
                        //SESSION (Option C), elem is ignored
                        return $["🔧"]["🧾"](sessionStorage.getItem($1));
                    } else if ($3 === 3 && localStorage.getItem($1)) {
                        //LOCAL (Option D), elem is ignored
                        return $["🔧"]["🧾"](localStorage.getItem($1));
                    }

                    // If data is not available but there are active promises, wait for them
                    if ($["📡"] && $["📡"]["🤞"] && $["📡"]["🤞"].length > 0) {
                        return new Promise(($$) => {
                            const ___ = {};
                            ___["🔁"] = () => {   // checkData
                                const _$ = {};
                                // Check sessionStorage directly to avoid recursion
                                if ($3 === 2 && sessionStorage.getItem($1)) {
                                    _$["📦"] = $["🔧"]["🧾"](sessionStorage.getItem($1));
                                } else if ($3 === 0 && $2["🧩📦"] && $2["🧩📦"].hasOwnProperty($1)) {
                                    _$["📦"] = $2["🧩📦"][$1];
                                } else if ($3 === 1 && $2.dataset.hasOwnProperty($1)) {
                                    _$["📦"] = $["🔧"]["🧾"]($2.dataset[$1]);
                                }

                                if (_$["📦"] !== undefined) {
                                    $$(_$["📦"]);
                                } else if ($["📡"] && $["📡"]["🤞"] && $["📡"]["🤞"].length > 0) {
                                    // If still active promises, wait a bit longer to reduce frequency
                                    setTimeout(___["🔁"], 50);
                                } else {
                                    // No more active promises, resolve with undefined
                                    $$(undefined);
                                }
                            };
                            // Initial check after a short delay to allow immediate resolution for available data
                            setTimeout(___["🔁"], 5);
                        });
                    }

                    return undefined;
                },
                // getTemplate(name)
                "📄📖": ($1) => {
                    const __ = {};
                    __["📄"] = _["📑"].querySelector('[name=' + $1 + ']');
                    if (__["📄"]) {
                        return String(unescape(__["📄"].innerHTML)).trim();
                    }
                },
                // delTemplate(name)
                "📄🗑️": ($1) => {
                    const __ = {};
                    __["📄"] = _["📑"].querySelector('[name=' + $1 + ']');
                    if (__["📄"]) {
                        return __["📄"].parentNode.removeChild(__["📄"]);
                    }
                },
                // setTemplate(name, value)
                "📄✍️": ($1, $2) => {
                    const __ = {};
                    //delete previous template by name
                    $["🗄️"]["📄🗑️"]($1);
                    //create new template
                    __["📄"] = _["📄"].cloneNode(true);
                    __["📄"].innerHTML = $2;
                    __["📄"].setAttribute('name', $1);
                    _["📑"].appendChild(__["📄"]);
                    return __["📄"];
                }
            }
        })(),
        //helper functions (hf)
        "🔧": (() => {
            _["🔧"] = {};
            _["🔧"]["↕️🔑"] = undefined;   // prevSortKey
            return {
                // addClickListeners
                "👂": () => {
                    // Event delegation: do not break normal links; only intercept core-managed elements.
                    document.addEventListener('click', ($1) => {
                        const __ = {};
                        // First check if this is a normal anchor link without any core attributes
                        __["🔗"] = $1.target.closest('a');   // clickedLink
                        __["🎯"] = null;                     // element

                        if (__["🔗"]) {
                            __["🏠"] = __["🔗"].getAttribute('href');
                            // Check if this is a core routing link that should be intercepted
                            __["🛣️"] = __["🏠"] && __["🏠"].includes('/_');   // isCorePath
                            __["🏷️"] = __["🔗"].hasAttribute('data-core') ||   // hasCoreAttrs
                                __["🔗"].hasAttribute('data-core-templates') ||
                                __["🔗"].hasAttribute('data-core-data') ||
                                __["🔗"].hasAttribute('core-templates') ||
                                __["🔗"].hasAttribute('core-data');

                            if (__["🛣️"] || __["🏷️"]) {
                                __["🎯"] = __["🔗"];
                            } else {
                                __["🎯❓"] = __["🔗"].hasAttribute('data-target') || __["🔗"].hasAttribute('target');
                                __["#️⃣"] = !__["🏠"] || __["🏠"] === '#';
                                __["📜"] = __["🏠"] && __["🏠"].startsWith('javascript:');

                                // Allow normal navigation for regular links that aren't core routes
                                if (!__["🎯❓"] && !__["#️⃣"] && !__["📜"]) {
                                    return; // Let normal anchor links navigate normally
                                }
                            }
                        }

                        if (!__["🎯"]) {
                            __["🎯"] = $1.target.closest(
                                'button[data-core], button[data-core-templates], button[data-core-data], button[core-templates], button[core-data],\
                                 [role="button"][data-core], [role="button"][data-core-templates], [role="button"][data-core-data], [role="button"][core-templates], [role="button"][core-data]'
                            );
                        }

                        if (!__["🎯"]) {
                            return;
                        }

                        // Do not treat core-pocket containers as click targets.
                        if (__["🎯"].classList && __["🎯"].classList.contains('core-pocket')) {
                            return;
                        }

                        // Intercept the click for all core-managed elements
                        $1.preventDefault();
                        $["🔧"]["👆"](__["🎯"], $1);
                    });
                },
                // addClickListener(element)
                "👂1️⃣": ($1) => {
                    // Backwards-compatible public API (no-op if element isn't core-managed)
                    const __ = {};
                    __["🎭"] = { preventDefault: () => { } };   // fakeEvent
                    $["🔧"]["👆"]($1, __["🎭"]);
                },
                // handleClick(element, event)
                "👆": ($1, $2) => {
                    const __ = {};
                    __["🏠"] = $1.getAttribute('href');

                    // Handle "Pretty Path" links (catch /_, #/_, /#/_ etc)
                    if (__["🏠"] && __["🏠"].includes('/_')) {
                        __["🗺️"] = $["🔧"]["🧭🔍"](__["🏠"]);   // directive
                        if (__["🗺️"] && __["🗺️"].length) {
                            // Update browser history for proper back/forward functionality
                            if (_["🧭"]) {
                                $["🔧"]["🧭✍️"](__["🏠"]);
                            }
                            for (const $$ of __["🗺️"]) {
                                const ___ = {};
                                ___["📛"] = [];   // nameList
                                ___["🎣"] = [];   // dataSources
                                for (const $$$ of $$.l) {
                                    ___["📛"].push($$$.n);
                                    if ($$$.u) ___["🎣"].push({ name: $$$.n, url: $$$.u });
                                }
                                $["🎨"]["👝➕"]($$.t, ___["📛"].join(','), ___["🎣"]);
                            }
                            return;
                        }
                    }

                    // Support both old and new syntax
                    __["🔖"] = $1.getAttribute('data-core') ||   // dataRefs
                        $1.getAttribute('data-core-templates') ||
                        $1.getAttribute('core-templates') ||
                        $1.getAttribute('data-core-data') ||
                        $1.getAttribute('core-data') ||
                        $1.dataset.core ||
                        $1.dataset.coreTemplates ||
                        $1.dataset.coreData;

                    __["🎯"] = $1.getAttribute('data-target') ||   // target
                        $1.getAttribute('target') ||
                        $["🙋"]["👆🎯"];

                    if (!__["🔖"]) {
                        // Check if this is a routing link that should be processed
                        __["🏠2"] = $1.getAttribute('href');   // elementHref
                        if (__["🏠2"] && __["🏠2"].includes('/_')) {
                            __["🗺️"] = $["🔧"]["🧭🔍"](__["🏠2"]);
                            if (__["🗺️"] && __["🗺️"].length) {
                                // Update browser history for proper back/forward functionality
                                if (_["🧭"]) {
                                    $["🔧"]["🧭✍️"](__["🏠2"]);
                                }
                                for (const $$ of __["🗺️"]) {
                                    const ___ = {};
                                    ___["📛"] = [];
                                    ___["🎣"] = [];
                                    for (const $$$ of $$.l) {
                                        ___["📛"].push($$$.n);
                                        if ($$$.u) ___["🎣"].push({ name: $$$.n, url: $$$.u });
                                    }
                                    $["🎨"]["👝➕"]($$.t, ___["📛"].join(','), ___["🎣"]);
                                }
                                return;
                            }
                        }
                        return;
                    }

                    __["🎣"] = [];   // dataSources
                    __["📄s"] = __["🔖"].split(',').map($$ => String($$).trim()).filter(Boolean);
                    for (const $$ of __["📄s"]) {
                        const ___ = {};
                        ___["🎣"] = $1.getAttribute('data-' + $$ + '-core-source') ||   // source
                            $1.getAttribute($$ + '-source') ||
                            $1.getAttribute('data-core-source') ||
                            $1.getAttribute('core-source') ||
                            $1.dataset[$$ + 'CoreSource'] ||
                            $1.dataset.coreSource;
                        if (___["🎣"]) {
                            __["🎣"].push({ name: $$, url: ___["🎣"] });
                        }
                    }

                    // Trigger the Pocket loader
                    $["🎨"]["👝➕"](__["🎯"], __["🔖"], __["🎣"]);
                },
                // ccNumAuth(ccNum)
                "💳": ($1) => {
                    const __ = {};
                    // Remove spaces and non-digit characters
                    $1 = String($1).replace(/\D/g, "");

                    // Check if the number is empty or not a number
                    if (!$1 || isNaN($1)) {
                        return { isValid: false, type: "Invalid" };
                    }

                    // Luhn algorithm for validation
                    __["➕"] = 0;        // sum
                    __["🔄"] = false;    // alternate
                    for (let $$ = $1.length - 1; $$ >= 0; $$--) {
                        __["🔟"] = parseInt($1.charAt($$), 10);   // digit
                        if (__["🔄"]) {
                            __["🔟"] *= 2;
                            if (__["🔟"] > 9) {
                                __["🔟"] -= 9;
                            }
                        }
                        __["➕"] += __["🔟"];
                        __["🔄"] = !__["🔄"];
                    }

                    __["✅"] = __["➕"] % 10 === 0;   // isValid

                    // Check card type based on prefix and length
                    __["🈁"] = "Unknown";   // type
                    if (/^3[47]/.test($1) && $1.length === 15) {
                        __["🈁"] = "American Express";
                    } else if (/^5[1-5]/.test($1) && $1.length === 16) {
                        __["🈁"] = "MasterCard";
                    } else if (/^4/.test($1) && [13, 16].includes($1.length)) {
                        __["🈁"] = "Visa";
                    } else if (/^6011/.test($1) && $1.length === 16) {
                        __["🈁"] = "Discover";
                    }

                    return { isValid: __["✅"], type: __["🈁"] };
                },
                // copy(text)
                "📋": ($1) => {
                    const __ = {};
                    __["✅"] = false;   // successful
                    __["📝"] = document.createElement("textarea");
                    __["📝"].id = 'copyarea';
                    __["📝"].value = $1;
                    __["📝"].style.top = 0;
                    __["📝"].style.left = 0;
                    __["📝"].style.width = '2em';
                    __["📝"].style.height = '2em';
                    __["📝"].style.border = 'none';
                    __["📝"].style.padding = 0;
                    __["📝"].style.outline = 'none';
                    __["📝"].style.position = 'fixed';
                    __["📝"].style.boxShadow = 'none';
                    __["📝"].style.background = 'transparent';
                    document.body.appendChild(__["📝"]);
                    __["📝"].select();
                    try {
                        __["✅"] = document.execCommand('copy');
                    } catch ($_) {
                        if (_["🐛"]) console.log('coremoji.js copy unsuccessful');
                    }
                    document.body.removeChild(__["📝"]);
                    return __["✅"];
                },
                // date(dateStr, format, strict)
                "📅": ($1, $2, $3 = false) => {
                    const __ = {};
                    __["📅"] = ($1 || new Date().toLocaleString());   // date
                    __["📤"] = ($2 || $["🙋"]["📅💄"]);               // output

                    if (!$3) {
                        __["📤"] = __["📤"].toUpperCase();
                    }

                    // Check Unix timestamp (numeric)
                    if (+__["📅"]) {
                        __["📅"] = __["📅"] * 1000;
                    }

                    __["📅"] = new Date(__["📅"]);

                    //checks for valid date object
                    if (!Date.parse(__["📅"])) {
                        return $1 + $["🙋"]["❗📅"];
                    }

                    switch (__["📤"]) {
                        case 'DATE':
                            __["📤"] = 'M/D/YY';
                            break;
                        case 'TIME':
                            __["📤"] = 'HH:MM'
                            break;
                    }

                    __["🗓️"] = {   // dateObj — keys are the public date-format tokens, they stay literal
                        'hh': String(__["📤"].includes('P') ? ((__["📅"].getHours() % 12) || 12) : __["📅"].getHours()).padStart(2, '0'),
                        'h': String((__["📅"].getHours() % 12) || 12),
                        'mm': String(__["📅"].getMinutes()).padStart(2, '0'),
                        'ss': String(__["📅"].getSeconds()).padStart(2, '0'),
                        'p': String(__["📅"].getHours() >= 12 ? 'pm' : 'am'),
                        'HH': String(__["📤"].includes('P') ? ((__["📅"].getHours() % 12) || 12) : __["📅"].getHours()).padStart(2, '0'),
                        'H': String((__["📅"].getHours() % 12) || 12),
                        ':MM': ':' + String(__["📅"].getMinutes()).padStart(2, '0'),
                        ':SS': ':' + String(__["📅"].getSeconds()).padStart(2, '0'),
                        'DD': String(__["📅"].getDate()).padStart(2, '0'),
                        'D': String(__["📅"].getDate()),
                        'MM': String(__["📅"].getMonth() + 1).padStart(2, '0'),
                        'M': String(__["📅"].getMonth() + 1),
                        'YYYY': String(__["📅"].getFullYear()),
                        'YY': String(__["📅"].getFullYear()).substr(2),
                        'P': String(__["📅"].getHours() >= 12 ? 'PM' : 'AM'),
                        'TS': +String(Math.floor(__["📅"] / 1000)),
                        'PERF': performance.now(),
                        '_note': 'Object keys represent available tokens for date formatting find/replace, with lowercase keys for more accuracy in strict mode'
                    }

                    if (__["📤"].toUpperCase() === 'TS') {
                        return __["🗓️"].TS;
                    } else if (__["📤"].toUpperCase() === 'PERF') {
                        return __["🗓️"].PERF;
                    } else if (__["📤"].toUpperCase() === 'OBJ') {
                        return __["🗓️"];
                    } else if ($3) {
                        for (const [$$, $$$] of Object.entries(__["🗓️"])) {
                            __["📤"] = __["📤"].split($$).join($$$);
                        }
                        return __["📤"];
                    }

                    // Replace tokens with date values in the output string
                    return __["📤"]
                        .replace('HH', __["🗓️"].HH)
                        .replace('H', __["🗓️"].H)
                        .replace(':MM', __["🗓️"][':MM']) //above Month
                        .replace(':SS', __["🗓️"][':SS'])
                        .replace('DD', __["🗓️"].DD)
                        .replace('D', __["🗓️"].D)
                        .replace('MM', __["🗓️"].MM)
                        .replace('M', __["🗓️"].M)
                        .replace('YYYY', __["🗓️"].YYYY)
                        .replace('YY', __["🗓️"].YY)
                        .replace('P', __["🗓️"].P)
                        .replace('TS', String(__["🗓️"].TS));
                },
                /**
                 * ⛏️ digData — digs through an object looking for a value using a dot delimited string as a reference
                 * Examples:
                 * addresses.billing.street RETURNS the street value of billing of the parent addresses
                 * news.categories.0 RETURNS the 0 index of the array categories of the parent news
                 * *OPTIONALLY news.categories.[n] will return the joined array, all indexes as a string
                 *
                 * @param {object} $1 object - The target object to be searched.
                 * @param {string[]} $2 ref - The string reference that will be used to dig through the object.
                 * @returns {mixed} The string value that if found or undefined.
                 */
                "⛏️": ($1, $2) => {
                    const __ = {};
                    if (typeof $2 === 'string') {
                        $2 = $2.split($2.includes(',') ? ',' : '.');
                    }
                    __["👤"] = ($2 || []).shift();   // member
                    if (!isNaN(+__["👤"])) {
                        __["👤"] = +__["👤"]; //try an index
                    } else if (__["👤"] === '[n]' && Array.isArray($1)) {
                        return $1.join(', ');
                    }
                    if ($1 && $1.hasOwnProperty(__["👤"])) {
                        if (!$2.length) {
                            return $1[__["👤"]];
                        } else {
                            return $["🔧"]["⛏️"]($1[__["👤"]], $2);
                        }
                    }
                },
                /**
                 * ⛏️🪜 digDataFallback — resolves a pipe delimited list of digData references against
                 * an object, returning the first result that isn't empty (undefined/null/'').
                 * Single-member strings (no '|') behave identically to digData().
                 * Examples:
                 * preferredName|firstName RETURNS preferredName's value, or firstName's if preferredName is empty
                 *
                 * @param {object} $1 object - The target object to be searched.
                 * @param {string} $2 memberStr - Pipe delimited list of digData path references.
                 * @returns {mixed} The first non-empty resolved value, or undefined if all are empty.
                 */
                "⛏️🪜": ($1, $2) => {
                    const __ = {};
                    for (const $$ of String($2).split('|')) {
                        __["💎"] = $["🔧"]["⛏️"]($1, $$);   // value
                        if (__["💎"] !== undefined && __["💎"] !== null && __["💎"] !== '') break;
                    }
                    return __["💎"];
                },
                // parseJSON(str)
                "🧾": ($1) => {
                    const __ = {};
                    try {
                        __["📦"] = JSON.parse($1);
                    } catch ($_) {
                        return undefined;
                    }
                    return __["📦"];
                },
                // getRoute(which)
                "🧭📖": ($1) => { //TODO
                    const __ = {};
                    __["🔗"] = new URL(window.location.href);
                    return __["🔗"][$1 || 'href'];
                },
                // setRoute(base, title, append, info, replace)
                "🧭✍️": ($1, $2, $3, $4, $5 = false) => {
                    const __ = {};
                    $1 = $1 || $["🔧"]["🧭📖"]();
                    $2 = $2 || $["🙋"]["📰"];
                    __["🏛️"] = {   // state
                        additionalInformation: ($4 || $["🙋"]["📰🔔"]),
                        timestamp: Date.now(),
                        route: $1 + ($3 || '')
                    };
                    if ($3) {
                        $1 += $3;
                    }

                    // Handle different input formats for base
                    if ($1.startsWith('#')) {
                        // Already a hash (e.g., "#/_main/home")
                        __["#️⃣"] = $1;   // hashUrl
                    } else if ($1.includes('/_')) {
                        // Contains a "Pretty Path" trigger (could be a full URL or a path)
                        __["#️⃣"] = '#' + $1.substring($1.indexOf('/_'));
                    } else if ($1.startsWith('/')) {
                        // Simple path (e.g., "/home")
                        __["#️⃣"] = '#/' + $1.substring(1);
                    } else {
                        // Fallback for other formats
                        try {
                            __["🔗"] = new URL($1, window.location.origin);
                            __["#️⃣"] = '#/' + __["🔗"].pathname.replace(/^\//, '') + __["🔗"].search + __["🔗"].hash;
                        } catch ($_) {
                            __["#️⃣"] = '#/' + $1;
                        }
                    }

                    // Avoid redundant history updates if the hash is already what we want
                    if (window.location.hash === __["#️⃣"] && !$5) {
                        return;
                    }

                    if ($5) {
                        window.history.replaceState(__["🏛️"], $2, __["#️⃣"]);
                    } else {
                        window.history.pushState(__["🏛️"], $2, __["#️⃣"]);
                    }

                    _["#️⃣"] = __["#️⃣"];        // Update tracking
                    window.lastHash = __["#️⃣"]; // Keep for compatibility
                },
                // parseRoute(urlStr)
                "🧭🔍": ($1) => {
                    const __ = {};
                    __["🔗"] = new URL($1 || window.location.href, window.location.origin);
                    __["#️⃣"] = __["🔗"].hash.replace('#', '');

                    // 1. Check for legacy JSON format in hash first
                    if (__["#️⃣"].includes(escape('"t"')) && __["#️⃣"].includes(escape('"l"'))) {
                        try {
                            __["📦"] = $["🔧"]["🧾"](unescape(__["#️⃣"]));   // result
                            return __["📦"];
                        } catch ($_) {
                            if (_["🐛"]) console.warn('coremoji.js: Failed to parse legacy route hash');
                        }
                    }

                    // 2. Parse new "Pretty Path" format
                    __["🛣️"] = __["🔗"].pathname;   // routeStr
                    if (!__["🛣️"].includes('/_') && __["🔗"].hash.includes('/_')) {
                        __["🛣️"] = __["🔗"].hash.replace('#', '');
                    }
                    console.log('🧩["🔧"]["🧭🔍"](): Route string to parse:', __["🛣️"]);

                    if (!__["🛣️"].includes('/_')) {
                        console.log('🧩["🔧"]["🧭🔍"](): No /_ found in route, returning empty array');
                        return [];
                    }

                    __["✂️"] = __["🛣️"].split('/').filter(Boolean);   // segments
                    __["🗺️"] = [];                                    // directive
                    __["🎯"] = null;                                  // currentTarget
                    __["📋"] = [];                                    // currentItems

                    for (const $$ of __["✂️"]) {
                        if ($$.startsWith('_')) {
                            if (__["🎯"]) {
                                __["🗺️"].push({ t: '#' + __["🎯"], l: __["📋"] });
                            }
                            __["🎯"] = $$.substring(1);
                            __["📋"] = [];
                        } else if (__["🎯"]) {
                            const ___ = {};
                            ___["✂️"] = $$.split(':');                  // parts
                            ___["📛"] = ___["✂️"][0];                   // name
                            ___["🎣"] = ___["✂️"].slice(1).join(':');   // source
                            ___["📦"] = { n: ___["📛"] };               // item
                            if (___["🎣"]) ___["📦"].u = decodeURIComponent(___["🎣"]);
                            __["📋"].push(___["📦"]);
                        }
                    }
                    if (__["🎯"]) {
                        __["🗺️"].push({ t: '#' + __["🎯"], l: __["📋"] });
                    }
                    console.log('🧩["🔧"]["🧭🔍"](): Final directive:', __["🗺️"]);
                    return __["🗺️"];
                },
                // buildRoute(directive)
                "🧭🏗️": ($1) => {
                    const __ = {};
                    __["🛣️"] = '';   // route
                    for (const $$ of ($1 || [])) {
                        const ___ = {};
                        ___["🎯"] = $$.t.replace('#', '');   // target
                        __["🛣️"] += `/_${___["🎯"]}`;
                        for (const $$$ of $$.l) {
                            __["🛣️"] += `/${$$$.n}`;
                            if ($$$.u) {
                                __["🛣️"] += `:${encodeURIComponent($$$.u)}`;
                            }
                        }
                    }
                    return __["🛣️"];
                },
                /**
                 * ↕️ sortObj — sorts an array of objects by key.
                 *
                 * @param {array} $1 objects - The array of objects to be sorted.
                 * @param {string} $2 key - The key that will be used to sort.
                 * @returns {array} The sorted object.
                 */
                "↕️": ($1, $2, $3, $4 = 'ASC') => {
                    const __ = {};
                    $1 = $1 || [{}];
                    $3 = $3 || 'automatic';
                    __["🈁"] = typeof $1;   // objType
                    $4 = $4.toUpperCase();

                    if (__["🈁"] === 'object' && $1.length && $1[0].hasOwnProperty($2)) {
                        //check if previous sort on same key
                        if (_["🔧"]["↕️🔑"] && $2 === _["🔧"]["↕️🔑"] && $4 === 'TOGGLE') {
                            $1 = $1.reverse();
                            return $1;
                        }
                        //check for dynamic sort type
                        if ($3 === 'automatic' && +$1[0][$2] === $1[0][$2]) {
                            $3 = 'numeric';
                        }
                    } else {
                        console.error('coremoji.js Error: Object does not contain key [' + $2 + ']')
                        return $1;
                    }

                    switch ($3) {
                        case "number":
                        case "numeric":
                            $1.sort(function ($$, $$$) {
                                return $$[$2] - $$$[$2];
                            });
                            break;
                        case "text":
                        case "string":
                        default:
                            $1.sort(function ($$, $$$) {
                                const ___ = {};
                                ___["🅰️"] = $$[$2].toLowerCase();
                                ___["🅱️"] = $$$[$2].toLowerCase();
                                if (___["🅰️"] < ___["🅱️"]) { return -1; }
                                if (___["🅰️"] > ___["🅱️"]) { return 1; }
                                return 0;
                            });
                            break;
                    }

                    if (!['ASC', 'TOGGLE'].includes($4)) { //DESC
                        $1 = $1.reverse();
                    } else {
                        _["🔧"]["↕️🔑"] = $2;
                    }

                    return $1;
                },
                /**
                 * 🆔🎲 uuid — creates a UUID
                 *
                 * @returns {string} The UUID
                 */
                "🆔🎲": ($1 = '', $2 = '-') => {
                    return `${$1}xxxxxxxx${$2}xxxx${$2}4xxx${$2}yxxx${$2}xxxxxxxxxxxx`.replace(/[xy]/g, function ($$) {
                        const __ = {};
                        __["🎲"] = Math.random() * 16 | 0;
                        __["💎"] = $$ === 'x' ? __["🎲"] : (__["🎲"] & 0x3 | 0x8);
                        return __["💎"].toString(16);
                    });
                },
                /**
                 * 💧 hydrateByClass — hydrates HTML tag content by using the class attribute as directive
                 * Basic Syntax: <span class="h-user-name">Bobby</span> Result -> <span class>John</span>
                 * Default Examples: h-userId, h-user-name, h-user-billing.address1, element will be hydrated (appended) and the class removed
                 * Options: h--countdown; element will be newly hydrated each call to the function
                 * Alternate Example: use dataRef and data-h-data-ref for caches that contain hyphens (-), etc.
                 * Alternate Option: <p class="h--dataRef-quote" data-h-data-ref="quote-book"></p> //dataRef = quote-book
                 * @param {string} $1 classFilter - A string filter used to identify the filtered elements to hydrate.
                 *
                 * @returns {void}
                 */
                "💧": ($1) => {
                    const __ = {};
                    if ($1) {
                        __["🧱s"] = document.querySelectorAll('[class*="' + String($1) + '"]');
                    } else {
                        __["🧱s"] = document.querySelectorAll('[class^="h-"],[class*=" h-"]');
                    }
                    for (const $$ of __["🧱s"]) {
                        const ___ = {};
                        ___["🏷️s"] = Array.from($$.classList).filter(function (_$) { return _$.startsWith('h-') });
                        for (const $$$ of ___["🏷️s"]) {
                            const _$ = {};
                            if ($["🙋"]["💧🚫"].includes($$$)) continue;
                            _$["✂️"] = $$$.split('--').join('-').split('-');   // [ref, cache, memberRef]
                            _$["🗄️"] = _$["✂️"][1];                            // cache
                            _$["👤"] = _$["✂️"][2];                            // memberRef
                            _$["📦"] = ($["🗄️"]["📖"](_$["🗄️"]) || { [(_$["👤"] || 'not')]: (_$["🗄️"] || 'found') + '*' });
                            if (_$["🗄️"] === 'dataRef' && $$.dataset.hDataRef) {
                                _$["📦"] = $["🗄️"]["📖"]($$.dataset.hDataRef) || _$["📦"];
                            } else if (_$["🗄️"] === 'coreRecord' && $$.closest(`[class*="core-cloned"]`)?.["🧩📦"].coreRecord) {
                                _$["📦"] = $$.closest(`[class*="core-cloned"]`)["🧩📦"].coreRecord;
                            }
                            _$["🏷️"] = $$.tagName;   // tag
                            _$["💎"] = (typeof _$["📦"] === 'string' ? _$["📦"] : $["🔧"]["⛏️"](_$["📦"], _$["👤"]));
                            _$["🗑️"] = !$$$.includes('h--');   // delClass
                            if (_$["💎"]) {
                                switch (_$["🏷️"]) {
                                    case 'INPUT':
                                    case 'SELECT':
                                    case 'TEXTAREA':
                                        $$.value = String(_$["💎"]);
                                        break;
                                    default:
                                        if (_$["🗑️"]) {
                                            $$.innerHTML += String(_$["💎"]);
                                        } else {
                                            $$.innerHTML = String(_$["💎"]);
                                        }
                                }
                                if (_$["🗑️"]) {
                                    $$.classList.remove($$$);
                                }
                            }
                        }
                    }
                    if (_["🐛"] && __["🧱s"].length) console.log('coremoji.js hydrating ' + __["🧱s"].length + ' elements');
                },
                /**
                 * 💄 formatByClass — formats HTML tag content by using the class attribute as directive
                 * Basic Syntax: <span class="f-upper">john</span> Result -> <span class>JOHN</span>
                 * Default Examples: f-money, f-upper, f-date-time, this will be formatted once and the class removed
                 * Options: f--money, this will continue to be formatted each call to the function
                 * Advanced Syntax: <div class="f-money" data-f-default="0" data-f-clue="USD">
                 * @param {string} $1 classFilter - A string filter used to identify the filtered elements to format.
                 *
                 * @returns {void}
                 */
                "💄": ($1) => {
                    const __ = {};
                    if ($1) {
                        __["🧱s"] = document.querySelectorAll('[class*="' + String($1) + '"]');
                    } else {
                        __["🧱s"] = document.querySelectorAll('[class^="f-"],[class*=" f-"]');
                    }
                    for (const $$ of __["🧱s"]) {
                        const ___ = {};
                        ___["🏷️s"] = Array.from($$.classList).filter(function (_$) { return _$.startsWith('f-') });
                        ___["💎"] = $$.innerHTML;   // value
                        //check for possible arguments
                        ___["🕳️"] = ($$.dataset.fDefault || $["🙋"]["🕳️"]);   // fDefault
                        ___["🔍"] = ($$.dataset.fClue || null);                // fClue

                        //begin formatting
                        for (const $$$ of ___["🏷️s"]) {
                            const _$ = {};
                            if ($["🙋"]["💄🚫"].includes($$$)) continue;
                            _$["🗑️"] = !$$$.includes('f--');   // delClass
                            //take care of nulls/empties
                            if (___["💎"] === 'null' || ___["💎"] === 'undefined' || !___["💎"].length) {
                                ___["💎"] = ___["🕳️"];
                            }

                            //change class to format; f-money -> money, f--left-pad -> leftpad
                            _$["💄"] = $$$.split('f-').join('').split('-').join('').toLowerCase();   // format
                            $$.innerHTML = $["🎨"]["💄"](___["💎"], _$["💄"], ___["🔍"]);

                            if (_$["🗑️"]) {
                                $$.classList.remove($$$);
                            }
                        }
                    }
                    if (_["🐛"] && __["🧱s"].length) console.log('coremoji.js formatting ' + __["🧱s"].length + ' elements');
                },
            }
        })(),
        //pocket functions (pk)
        "👝": (() => {
            _["👝"] = {};
            _["👝"]["⏲️"] = 2000;        // timeout
            _["👝"]["🗺️"] = [];          // directive
            _["👝"]["⏱️"] = undefined;   // stackTs
            return {
                get "⏲️"() {
                    return _["👝"]["⏲️"];
                },
                set "⏲️"($1) {
                    _["👝"]["⏲️"] = (+$1 || 2000);
                },
                // init
                "🚀": () => {
                    const __ = {};
                    console.log('🧩["👝"]["🚀"]() called');
                    //check to use routing info for pocket setup
                    if (_["🧭"]) {
                        console.log('🧩["👝"]["🚀"](): useRouting is true, parsing route');
                        console.log('🧩["👝"]["🚀"](): Current window.location.href:', window.location.href);
                        console.log('🧩["👝"]["🚀"](): Current window.location.hash:', window.location.hash);
                        __["🗺️"] = $["🔧"]["🧭🔍"]();   // local directive, shadows the pocket-scope one
                        console.log('🧩["👝"]["🚀"](): Parsed directive:', __["🗺️"]);
                        if (__["🗺️"] && __["🗺️"].length) {
                            console.log('🧩["👝"]["🚀"](): Processing', __["🗺️"].length, 'directive(s)');
                            for (const $$ of __["🗺️"]) {
                                const ___ = {};
                                console.log('🧩["👝"]["🚀"](): Processing settings:', $$);
                                ___["📛"] = [];   // nameList
                                ___["🎣"] = [];   // dataSources
                                for (const $$$ of $$.l) {
                                    ___["📛"].push($$$.n);
                                    if ($$$.hasOwnProperty('u')) {
                                        ___["🎣"].push({ name: $$$.n, url: $$$.u });
                                    }
                                }
                                ___["🎯"] = $$.t;                  // target
                                ___["🔖"] = ___["📛"].join(',');   // dataRefs
                                console.log('🧩["👝"]["🚀"](): Inserting pocket - target:', ___["🎯"], 'dataRefs:', ___["🔖"], 'dataSources:', ___["🎣"]);
                                $["🎨"]["👝➕"](___["🎯"], ___["🔖"], ___["🎣"], false);
                            }
                        } else {
                            console.log('🧩["👝"]["🚀"](): No directive found, calling 🧩["👝"]["🎬"]()');
                        }
                    }
                    $["👝"]["🎬"]();
                },
                /**
                 * 🏁 eoc — End of Call
                 * The final running function of the DOM manipulation, cleanup
                 * Will call user-defined function: 🧩["🙋"]["🏁"], if available
                 *
                 * @returns {void}
                 */
                "🏁": () => {
                    const __ = {};
                    $["🔧"]["💧"]();
                    setTimeout(() => { //setTimeout added in attempt to fix formatting bug 20240821
                        $["🔧"]["💄"]();
                        if (typeof $["🙋"]["🏁"] === "function") {
                            $["🙋"]["🏁"]();
                        }
                    })

                    //build the route directive from the DOM
                    __["👝s"] = document.getElementsByClassName('core-pocket');
                    for (const $$ of __["👝s"]) {
                        const ___ = {};
                        //get the parent
                        ___["👪"] = $$.parentNode;                          // parent
                        ___["🆔"] = ___["👪"] ? ___["👪"].id : null;        // targetId

                        // Skip pockets without a target ID or explicitly excluded from routing
                        if (!___["🆔"] || $$.dataset.coreRouting === 'false') continue;

                        ___["🎯"] = '#' + ___["🆔"];   // target
                        //get the items
                        ___["📋"] = [];                // lists
                        ___["📄str"] = $$.getAttribute('data-core-templates') || $$.dataset.coreTemplates || '';
                        ___["📄s"] = ___["📄str"].split(',').map(_$ => String(_$).trim()).filter(Boolean);
                        for (const $$$ of ___["📄s"]) {
                            const _$ = {};
                            if (!$$$) continue;
                            _$["📦"] = { n: $$$ };   // list
                            _$["🎣"] = $$.getAttribute('data-' + $$$ + '-core-source') || $$.dataset[$$$ + 'CoreSource'];
                            if (_$["🎣"]) {
                                _$["📦"].u = _$["🎣"];
                            }
                            ___["📋"].push(_$["📦"]);
                        }
                        _["👝"]["🗺️"].push({ t: ___["🎯"], l: ___["📋"] })
                        if (_["🔒"]) {
                            $$.classList.remove('core-pocket');
                            $$.classList.add('core-pocketed');
                        }

                    }
                    //update the URL
                    if (_["🧭"]) {
                        __["🛣️"] = $["🔧"]["🧭🏗️"](_["👝"]["🗺️"]);   // newPath
                        __["🔍"] = $["🔧"]["🧭📖"]('search');          // search

                        if (__["🛣️"]) {
                            // Use replaceState for URL sync in EOC to avoid redundant history entries
                            $["🔧"]["🧭✍️"](__["🛣️"] + __["🔍"], null, null, null, true);
                        }
                    }
                    if (_["🐛"]) console.log('coremoji.js completed in ' + ($["🔧"]["📅"](null, 'perf') - _["👝"]["⏱️"]).toFixed(1) + 'ms');
                    //reset functional variables
                    _["👝"]["⏱️"] = 0;
                    _["👝"]["🗺️"] = [];
                },
                /**
                 * 🎬 soc — Start of Call (SOC).
                 * Initiates the core lifecycle:
                 * 1. Waits for pending backend requests.
                 * 2. Calls user-defined `soc` hook.
                 * 3. Fetches templates.
                 * 4. Renders templates.
                 * 5. Fetches data.
                 * 6. Renders data (clones).
                 * 7. Calls `eoc` (End of Call).
                 *
                 * @async
                 * @returns {Promise<void>}
                 */
                "🎬": async () => {
                    //don't continue until all preloaded backend data is loaded
                    await $["📡"]["⏳"]();

                    //call user-defined start of function if declared
                    if (typeof $["🙋"]["🎬"] === "function") {
                        $["🙋"]["🎬"]();
                    }

                    _["👝"]["⏱️"] = $["🔧"]["📅"](null, 'perf');

                    try {
                        await $["👝"]["📄📥"]();
                        $["👝"]["📄➕"]();
                        await $["👝"]["📥"]();
                        $["👝"]["➕"]();
                    } catch ($_) {
                        _["🚨"]["📝"]($_, 'soc lifecycle');
                    }

                    $["👝"]["🏁"]();
                },
                /**
                 * 📄📥 getTemplate — scans the DOM for `data-core-templates` attributes and fetches missing templates.
                 *
                 * @async
                 * @returns {Promise<void>} Resolves when all required templates are fetched.
                 */
                "📄📥": async () => {
                    const __ = {};
                    __["🤞"] = [];   // promises
                    __["👝s"] = document.getElementsByClassName('core-pocket');

                    for (const $$ of __["👝s"]) {
                        const ___ = {};
                        ___["📄str"] = $$.getAttribute('data-core-templates') || $$.getAttribute('core-templates') || $$.dataset.coreTemplates || '';
                        ___["📄s"] = ___["📄str"].split(',').map(_$ => String(_$).trim()).filter(Boolean);
                        for (const $$$ of ___["📄s"]) {
                            const _$ = {};
                            if (!$$$) continue;

                            _$["📄"] = $["🗄️"]["📄📖"]($$$);   // hasTemplate
                            if (!_$["📄"] && $$$ !== 'EMPTY') {
                                $$.insertAdjacentHTML('beforeend', $["🗄️"]["📄📖"]('LOADING'));
                                _$["🎣"] = $$.getAttribute('data-' + $$$ + '-core-source') || $$.getAttribute($$$ + '-source') || $$.dataset[$$$ + 'CoreSource'];
                                __["🤞"].push($["📡"]["📄📥"]($$$, _$["🎣"]));
                            }
                        }
                    }

                    if (__["🤞"].length) {
                        await Promise.all(__["🤞"]);
                    }
                },
                /**
                 * 📄➕ addTemplate — injects fetched templates into their respective pockets.
                 * Prepares the DOM for data cloning.
                 *
                 * @returns {void}
                 */
                "📄➕": () => {
                    const __ = {};
                    //find the pocket elements
                    __["👝s"] = document.getElementsByClassName('core-pocket');
                    for (const $$ of __["👝s"]) {
                        const ___ = {};
                        //empty the pocket
                        while ($$.firstElementChild) {
                            $$.firstElementChild.remove();
                        }
                        //hide the pocket, shown when filled
                        $$.style.display = 'none';
                        ___["📄str"] = $$.getAttribute('data-core-templates') || $$.getAttribute('core-templates') || $$.dataset.coreTemplates || '';
                        ___["📄s"] = ___["📄str"].split(',').map(_$ => String(_$).trim()).filter(Boolean);
                        for (const $$$ of ___["📄s"]) {
                            const _$ = {};
                            if (!$$$) continue;
                            //fill the pockets w/items
                            $["🔁"]["🎨⏮️"]($$$, null, 'template');
                            // Get template content directly without data injection
                            _$["📄"] = _["📑"].querySelector('[name=' + $$$ + ']') || $$$;   // templateEl
                            _$["📃"] = String(unescape(_$["📄"].textContent || _$["📄"].innerHTML)).trim();
                            if (_$["📃"] === undefined) return;
                            if (typeof $["🙋"]["📄📥"] === 'function') {
                                _$["✨"] = $["🙋"]["📄📥"]($$$, _$["📃"]) || _$["📃"];   // processedContent
                                $$.insertAdjacentHTML('beforeend', _$["✨"]);
                                $["🔁"]["🎨⏭️"]($$$, _$["✨"], 'template');
                            } else {
                                $$.insertAdjacentHTML('beforeend', _$["📃"]);
                                $["🔁"]["🎨⏭️"]($$$, _$["📃"], 'template');
                            }
                        }
                        //show the pocket, filled
                        if (!$$.getElementsByClassName('core-clone').length) {
                            $$.style.display = '';
                        }
                    }
                },
                /**
                 * 📥 getData — scans the DOM for `data-core-data` attributes (on clones) and fetches missing data.
                 *
                 * @async
                 * @returns {Promise<void>} Resolves when all required data is fetched.
                 */
                "📥": async () => {
                    const __ = {};
                    __["🤞"] = [];   // promises
                    __["👯s"] = document.getElementsByClassName('core-clone');

                    for (const $$ of __["👯s"]) {
                        const ___ = {};
                        ___["🔖"] = $$.getAttribute('data-core-data') || $$.getAttribute('core-data') || $$.dataset.coreData;
                        ___["🎣"] = $$.getAttribute('data-core-source') || $$.getAttribute('core-source') || $$.dataset.coreSource;

                        if ($["📡"]["⏱️❓"](___["🔖"], 'data') && $["🗄️"]["📖"](___["🔖"])) {
                            continue;
                        }

                        __["🤞"].push($["📡"]["📥"](___["🔖"], ___["🎣"]));
                    }

                    if (__["🤞"].length) {
                        await Promise.all(__["🤞"]);
                    }
                },
                /**
                 * ➕ addData — clones the template elements for each data record.
                 * Populates the clones with data and injects them into the DOM.
                 *
                 * @returns {void}
                 */
                "➕": () => {
                    const __ = {};
                    //find the clone elements
                    // Use Array.from to create a static list since we modify the DOM
                    __["👯s"] = Array.from(document.getElementsByClassName('core-clone'));
                    for (const $$ of __["👯s"]) {
                        const ___ = {};
                        ___["🔖"] = $$.getAttribute('data-core-data') || $$.getAttribute('core-data') || $$.dataset.coreData;
                        ___["📇s"] = $["🗄️"]["📖"](___["🔖"]) || [];   // records
                        ___["👯"] = $$.cloneNode(true);                 // cloned
                        ___["🏷️"] = "core-cloned-" + ___["🔖"].split('-').map(_$ => $["🛡️"]["🧽✨"]('temp', _$, ['alphaonly']).value).join('-');
                        ___["👯"].classList.add(___["🏷️"]);
                        ___["👯"].removeAttribute('data-core-source');
                        ___["👯"].removeAttribute('core-source');
                        ___["👯"].removeAttribute('data-core-data');
                        ___["👯"].removeAttribute('core-data');
                        ___["👯"].removeAttribute('id');
                        $["🔁"]["🎨⏮️"](___["🔖"], ___["📇s"], 'data');
                        $$.insertAdjacentHTML('beforebegin', $["👝"]["👯"](___["📇s"], ___["👯"].outerHTML));
                        //add the record data to the cloned element using storageId=0
                        ___["🔢"] = 0;   // recordIndex
                        for (const $$$ of $$.parentNode.getElementsByClassName(___["🏷️"])) {
                            $["🗄️"]["✍️"]('coreRecord', ___["📇s"][___["🔢"]++], $$$, 0);
                        }
                        $["🔁"]["🎨⏭️"](___["🔖"], ___["📇s"], 'data');
                    }
                    //remove the clone templates
                    for (const $$ of __["👯s"]) {
                        //show the pocket, previously hidden
                        ($$.closest('.core-pocket') || $$.closest('.core-pocketed')).style.display = '';
                        $$.remove();
                    }

                },
                /**
                 * 💉 injector — hydrates HTML by using the classic pocket find/replace
                 * Basic Syntax: {{data:user:customer.name:upper}} Result -> JOHN
                 * The ref segment accepts a pipe delimited fallback chain, e.g.
                 * {{data:user:nickname|customer.name:upper}} uses nickname, or customer.name if nickname is empty
                 */
                "💉": ($1) => {
                    const __ = {};
                    __["📃"] = $1;   // newString
                    //replace the placeholders {{rec:name}}
                    __["🔳s"] = __["📃"].match($["🛡️"]["🔣"]["🥨"]) || [];   // placeholders
                    for (const $$ of __["🔳s"]) {
                        const ___ = {};
                        ___["✂️"] = $$.split(':');      // [type, dataSrc, ref, format, clue]
                        ___["🈁"] = ___["✂️"][0];       // type
                        ___["🎣"] = ___["✂️"][1];       // dataSrc
                        ___["👤"] = ___["✂️"][2];       // ref
                        ___["💄"] = ___["✂️"][3];       // format
                        ___["🔍"] = ___["✂️"][4];       // clue
                        if (___["🈁"] !== 'data' && ___["🈁"] !== '@') continue;
                        ___["📦"] = $["🗄️"]["📖"](___["🎣"]);
                        ___["💎"] = $["🔧"]["⛏️🪜"](___["📦"], ___["👤"]);
                        //format if a format/value are present
                        if (___["💄"] && ___["💎"] != undefined) {
                            ___["💎"] = $["🎨"]["💄"](___["💎"], ___["💄"], ___["🔍"]);
                        }
                        __["📃"] = __["📃"].replaceAll('{{' + $$ + '}}', ((___["💎"] != null && ___["💎"] != undefined) ? ___["💎"] : $["🙋"]["🕳️"]));
                    }
                    return __["📃"];
                },
                /**
                 * 👯 cloner — clones cloneStr once per record, resolving {{rec:member}} / {{aug:...}} placeholders per record.
                 * The member segment accepts a pipe delimited fallback chain, e.g.
                 * {{rec:nickname|firstName:upperfirst}} shows nickname, or firstName if nickname is empty
                 */
                "👯": ($1 = [], $2) => {
                    const __ = {};
                    __["📜"] = '';   // newCloneStr
                    __["🔢"] = 0;    // count
                    __["🔳s"] = ($2.match($["🛡️"]["🔣"]["🥨"]) || []).sort();
                    for (const $$ of $1) {
                        const ___ = {};
                        ___["📃"] = $2;   // newString
                        //replace the placeholders {{rec:name}}
                        for (const $$$ of __["🔳s"]) {
                            const _$ = {};
                            _$["✂️"] = $$$.split(':');   // [type, member, format, clue]
                            _$["🈁"] = _$["✂️"][0];      // type
                            _$["👤"] = _$["✂️"][1];      // member
                            _$["💄"] = _$["✂️"][2];      // format
                            _$["🔍"] = _$["✂️"][3];      // clue
                            switch (_$["🈁"]) {
                                case 'aug': case '!':
                                    if (['i', 'index'].includes(_$["👤"])) _$["💎"] = __["🔢"];
                                    else if (['c', 'count'].includes(_$["👤"])) _$["💎"] = __["🔢"] + 1;
                                    else if (['v', 'val', 'value'].includes(_$["👤"]) && typeof $["🙋"]["👯💎"] === 'function') {
                                        _$["🎁"] = { str1: _$["💄"], str2: _$["🔍"], index: __["🔢"], placeholder: $$$ };
                                        _$["💎"] = $["🙋"]["👯💎"]($$, _$["🎁"]);
                                    } else if (['s', 'str', 'string'].includes(_$["👤"]) && typeof $["🙋"]["👯🔤"] === 'function') {
                                        _$["🎁"] = { str1: _$["💄"], str2: _$["🔍"], index: __["🔢"], placeholder: $$$, cloneStr: $2, cloningStr: ___["📃"] };
                                        ___["📃"] = $["🙋"]["👯🔤"]($$, _$["🎁"]) || ___["📃"];
                                    }
                                    break;
                                case 'rec': case '#':
                                    _$["💎"] = $["🔧"]["⛏️🪜"]($$, _$["👤"]);
                                    break;
                                default:
                                    _$["💎"] = $["🙋"]["❗🏷️"] + " '" + _$["🈁"] + "'";
                            }
                            //format if a format/value are present
                            if (_$["💄"] && _$["💎"] != undefined) _$["💎"] = $["🎨"]["💄"](_$["💎"], _$["💄"], _$["🔍"]);
                            ___["📃"] = ___["📃"].replaceAll('{{' + $$$ + '}}', ((_$["💎"] != null && _$["💎"] != undefined) ? _$["💎"] : $["🙋"]["🕳️"])); //(value || value == 0 || value == false)
                        }
                        __["🔢"]++;
                        __["📜"] = __["📜"] + ' ' + ___["📃"];
                    }
                    return __["📜"];
                },
            }
        })(),
        //modular functions (md)
        "🧱": (() => {
            _["🧱"] = {};
            _["🧱"]["📝🔒"] = 0;   // formSubmitLockout
            return {
                get "📝🔒"() {
                    return _["🧱"]["📝🔒"];
                },
                set "📝🔒"($1) {
                    _["🧱"]["📝🔒"] = parseInt($1);
                },
                // form(funcName, args)
                "📝": ($1, $2) => {
                    import(_["🌐"] + '/module/form.js').then($$ => {
                        $$[$1]($2);
                    }).catch($_ => {
                        _["🚨"]["📝"]($_, `module loading - ${$1}`);
                    });
                }
            }
        })(),
        //validation functions (sv)
        "🛡️": (() => {
            _["🛡️"] = {};
            _["🛡️"]["🔣"] = {};   // regex
            _["🛡️"]["🔣"]["📧"] = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  // email
            _["🛡️"]["🔣"]["☎️"] = /(\d{3})(\d{3})(\d{4})/;      // phoneUS
            _["🛡️"]["🔣"]["🕸️"] = /<[^>]+>/g                    // html
            _["🛡️"]["🔣"]["🔢"] = /[^0-9]/g;                     // numbers
            _["🛡️"]["🔣"]["🔢🔸"] = /[^0-9.]/g;                  // floats
            _["🛡️"]["🔣"]["🔤"] = /[^A-Za-z]/g;                  // alpha
            _["🛡️"]["🔣"]["🔤➕"] = /[^A-Za-z\s]/g;              // alphasp
            _["🛡️"]["🔣"]["🔠"] = /[^A-Za-z0-9]/g;               // alphanum
            _["🛡️"]["🔣"]["🔠➕"] = /[^\w\s]/gi;                 // alphanumsp
            _["🛡️"]["🔣"]["🥨"] = /[^{\{]+(?=}\})/g;             // dblcurly
            _["🛡️"]["🔣"]["🔗"] = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g   // urlref
            _["🛡️"]["🔣"]["🌐"] = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;  // url
            return {
                get "🔣"() {
                    return _["🛡️"]["🔣"];
                },
                // format(value, formatStr, valueDefault)
                "💄": ($1, $2, $3 = '') => {
                    const __ = {};
                    __["✂️"] = String($2 || [$["🙋"]["🕳️💄"], $["🙋"]["🕳️"]].join('.')).split('.');
                    __["💄"] = __["✂️"][0];    // format
                    __["🕳️"] = __["✂️"][1];    // vDefault
                    __["🔍"] = __["✂️"][2];    // clue
                    __["✂️2"] = String(__["🔍"] || '4|0').split('|');
                    __["🔢"] = __["✂️2"][0];   // clueCount
                    __["🧻"] = __["✂️2"][1];   // cluePad
                    __["✂️3"] = String(__["🔍"] || '""|""').split('|');
                    __["🎁◀️"] = __["✂️3"][0];  // wrapOpen
                    __["🎁▶️"] = __["✂️3"][1];  // wrapClose
                    if ($1 != 0 && $1 != false) {
                        $1 = $1 || __["🕳️"] || $3;
                    }
                    switch (__["💄"].toLowerCase()) {
                        case 'alphaonly':
                            $1 = $1.replace(_["🛡️"]["🔣"]["🔤"], '');
                            break;
                        case 'array':
                            $1 = Object.values($1);
                            break;
                        case 'boolean':
                            $1 = ($1 && $1 !== "0" && String($1).toLowerCase() !== "false" ? true : false);
                            break;
                        case 'date':
                        case 'datetime':
                            if ($1 && __["🔍"] != 'ignoreempty') {
                                $1 = $["🔧"]["📅"]($1, __["🔍"]);
                            }
                            break;
                        case 'decimal':
                            $1 = (+$1).toFixed(2) + (__["🔍"] || '');
                            break
                        case 'encrypt':
                            $1 = String($1).split('').sort().reverse().join('');
                            break;
                        case 'float':
                            $1 = String($1).replace(_["🛡️"]["🔣"]["🔢🔸"], '');
                            break;
                        case 'email':
                        case 'lower':
                            $1 = String($1).toLowerCase();
                            break;
                        case 'emaillink':
                            //value: email to link; clue: string of attributes to append to element
                            $1 = String($1).toLowerCase();
                            $1 = '<a href="mailto:' + $1 + '" ' + __["🔍"] + '>' + $1 + '</a>';
                            break;
                        case 'urllink':
                            //value: url to link; clue: string of attributes to append to element
                            $1 = '<a href="' + $1 + '" target="_blank" ' + __["🔍"] + '>' + $1 + '</a>';
                            break;
                        case 'imgsrc':
                            //value: url of the image source; clue: string of attributes to append to element
                            $1 = '<img src="' + $1 + '" ' + __["🔍"] + '>';
                            break;
                        case 'money':
                            if (__["🔍"] === 'USD') {
                                __["🔍"] = '$';
                            }
                            $1 = (__["🔍"] === '$' ? __["🔍"] : '') + (+$1).toFixed(2);
                            break;
                        case 'encodeuricomponent':
                            $1 = encodeURIComponent($1);
                            break;
                        case 'encodeuri':
                            $1 = encodeURI($1);
                            break;
                        case 'nospace':
                            $1 = String($1).split(' ').join('');
                            break;
                        case "nohtml":
                            $1 = $1.replace(_["🛡️"]["🔣"]["🕸️"], '');
                            break
                        case 'linkify':
                            $1 = $1.replace(_["🛡️"]["🔣"]["🔗"], $$ => {
                                const ___ = {};
                                // Skip if already in an HTML tag or already a link
                                if ($$.includes('<a href=') || $$.includes('</a>')) {
                                    return $$;
                                }
                                ___["🔐"] = $$.includes('https:') ? 's' : ''   // secure
                                ___["🌐"] = $$.replace(/https?:\/\//, '')      // url
                                return `<a href="http${___["🔐"]}://${___["🌐"]}" target="_blank">${___["🌐"]}</a>`
                            });
                            break;
                        case 'null':
                            $1 = null;
                            break;
                        case 'number':
                            if ($1 !== null && $1 !== undefined && String($1).length) {
                                $1 = parseFloat(String($1).replace(_["🛡️"]["🔣"]["🔢🔸"], "")) || null;
                            } else {
                                $1 = null;
                            }
                            break;
                        case 'numonly':
                            $1 = String($1).replace(_["🛡️"]["🔣"]["🔢"], '');
                            break;
                        case 'object':
                            __["📦"] = {};                    // result
                            __["🔑s"] = Object.keys($1);      // keys
                            __["💎s"] = Object.values($1);    // vals
                            __["🔑s"].forEach(($$, $$$) => __["📦"][$$] = __["💎s"][$$$]);
                            $1 = __["📦"];
                            break;
                        case 'padleft':
                            $1 = String($1).padStart(+__["🔢"], __["🧻"]);
                            break;
                        case 'padright':
                            $1 = String($1).padEnd(+__["🔢"], __["🧻"]);
                            break;
                        case 'fax':
                        case 'phone':
                            __["☎️"] = String($1 || "").replace(_["🛡️"]["🔣"]["🔢"], "");   // check
                            if ($1 && __["☎️"].length === 10) {
                                $1 = __["☎️"].replace(_["🛡️"]["🔣"]["☎️"], "($1) $2-$3");
                            }
                            break;
                        case 'core_pk_attr':
                            __["🏷️"] = __["🔍"] === 'className' ? 'class' : __["🔍"];   // attrName
                            $1 = ' ' + __["🏷️"] + '="' + $1 + '" ';
                            break
                        case 'core_pk_cloner':
                            $1 = $["👝"]["👯"]($1, $["🗄️"]["📄📖"](__["🔍"]) || $["🙋"]["❗📄"]);
                            break;
                        case 'removehtml':
                            __["🧱"] = document.createElement('DIV');   // tempElem
                            __["🧱"].innerHTML = String($1);
                            $1 = __["🧱"].textContent || __["🧱"].innerText || $["🙋"]["🕳️"];
                            break;
                        case 'string':
                            $1 = String($1);
                            break;
                        case 'tinyhash':
                            $1 = String($1).split("").map($$ => $$.charCodeAt(0)).reduce(($$, $$$) => $$ + (($$ << 7) + ($$ << 3)) ^ $$$).toString(16);
                            break;
                        case 'truncate':
                            $1 = String($1).length < +__["🔍"] ? String($1) : String($1).substring(0, +__["🔍"]) + $["🙋"]["❗✂️"];
                            break;
                        case 'wrap':
                            if ($1) {
                                $1 = __["🎁◀️"] + String($1) + __["🎁▶️"];
                            }
                            break;
                        case 'upper':
                            $1 = String($1).toUpperCase();
                            break;
                        case 'upperfirst':
                            $1 = String($1).charAt(0).toUpperCase() + String($1).slice(1);
                            break;
                    }
                    return $1 || $["🙋"]["🕳️"];
                },
                // scrub(scrubArr) — scrub objects keep their Latin keys, /module/form.js builds them
                "🧽": ($1) => {
                    const __ = {};
                    //[{name:"name",value:"John",scrubs:["req","lower"]}]
                    __["📦"] = { success: true, scrubs: [], errors: {} };   // resultObj
                    $1.forEach(function ($$, $$$) {
                        $1[$$$] = $["🛡️"]["🧽1️⃣"]($$, $1);
                        if (!$1[$$$].success) {
                            __["📦"].success = false;
                            __["📦"].errors[$1[$$$].name] = $1[$$$].errors;
                        }
                    });
                    __["📦"].scrubs = $1;
                    return __["📦"];
                },
                // scrubEach(scrubObj, scrubArr)
                "🧽1️⃣": ($1, $2) => {
                    //scrubObj sample: {name:"name",value:"John",scrubs:["req","lower","max:15"]}
                    //scrubArr sample: [{name:"name",value:"John",scrubs:["req","lower","max:15"]},...]
                    $1.delta = $1.value;
                    $1.errors = [];
                    $1.success = true;

                    $1.scrubs.forEach(function ($$) {
                        const ___ = {};
                        ___["✂️"] = String($$).split(":").map(_$ => String(_$).trim()).filter(Boolean);
                        ___["💄"] = ___["✂️"][0];   // format
                        ___["🔍"] = ___["✂️"][1];   // clue
                        ___["📦"] = { success: true, error: null };   // eachResult
                        switch (___["💄"]) {
                            case "fail":
                            case "failclient":
                                ___["📦"].success = false;
                                ___["📦"].error = "Intentional frontend failure (" + ___["💄"] + ").";
                                break;
                            case "num":
                                ___["📦"].success = !isNaN(+$1.value);
                                ___["📦"].error = "Only numbers are allowed.";
                                break;
                            case "ccnum":
                                ___["📦"].success = $["🔧"]["💳"]($1.value).isValid;
                                ___["📦"].error = "A valid credit card number is required.";
                                break;
                            case "alpha":
                                ___["📦"].success = ($1.value === $1.value.replace(_["🛡️"]["🔣"]["🔤"]));
                                ___["📦"].error = "Only letters are allowed.";
                                break;
                            case "alphaspace":
                                ___["📦"].success = ($1.value === $1.value.replace(_["🛡️"]["🔣"]["🔤➕"]));
                                ___["📦"].error = "Only letters/space are allowed.";
                                break;
                            case "alphanum":
                                ___["📦"].success = ($1.value === $1.value.replace(_["🛡️"]["🔣"]["🔠"]));
                                ___["📦"].error = "Only letters/numbers are allowed.";
                                break;
                            case "alphanumspace":
                                ___["📦"].success = ($1.value === $1.value.replace(_["🛡️"]["🔣"]["🔠➕"]));
                                ___["📦"].error = "Only letters/numbers/space are allowed.";
                                break;
                            case "nospace":
                                ___["📦"].success = ($1.value === $1.value.split(" ").join(""));
                                ___["📦"].error = "Value cannot contain spaces.";
                                break;
                            case "req":
                            case "required":
                                ___["📦"].success = (String($1.value).length ? true : false);
                                if (___["🔍"]) {
                                    ___["📦"].success = (String($1.value) === String(___["🔍"]));
                                }
                                ___["📦"].error = "Value " + (___["🔍"] ? "(" + ___["🔍"] + ") " : "") + "is required.";
                                break;
                            case "max":
                            case "maxlen":
                                ___["📦"].success = !(String($1.value).length > +___["🔍"]);
                                ___["📦"].error = "Max length is " + ___["🔍"] + ".";
                                break;
                            case "min":
                            case "minlen":
                                ___["📦"].success = String($1.value).length >= +___["🔍"];
                                ___["📦"].error = "Minimum length is " + ___["🔍"] + ".";
                                break;
                            case "set":
                            case "setlen":
                                ___["📦"].success = String($1.value).length === +___["🔍"];
                                ___["📦"].error = "Required value length is " + ___["🔍"] + ".";
                                break;
                            case "disallow":
                                ___["📦"].success = !$1.value.includes(___["🔍"]);
                                ___["📦"].error = "Value must not contain " + ___["🔍"] + ".";
                                break;
                            case "expect":
                                ___["📦"].success = $1.value.includes(___["🔍"]);
                                ___["📦"].error = "Value must contain " + ___["🔍"] + ".";
                                break;
                            case "match":
                                ___["📦"].success = $["🛡️"]["🧽🟰"]($2, $1, ___["🔍"]);
                                ___["📦"].error = "Values must match (" + ___["🔍"] + ").";
                                break;
                            case "gte":
                                ___["📦"].success = +$1.value >= +___["🔍"];
                                ___["📦"].error = "Required value, a number, must be " + ___["🔍"] + " or more.";
                                break;
                            case "lte":
                                ___["📦"].success = +$1.value <= +___["🔍"];
                                ___["📦"].error = "Required value, a number, must be " + ___["🔍"] + " or less.";
                                break;
                            case "url":
                                ___["📦"].success = (String($1.value).length ? _["🛡️"]["🔣"]["🌐"].test($1.value) : true);
                                ___["📦"].error = "Only valid URLs are allowed.";
                                break;
                            case "email":
                                ___["📦"].success = (String($1.value).length ? _["🛡️"]["🔣"]["📧"].test($1.value) : true);
                                ___["📦"].error = "Only valid emails are allowed.";
                                $1.value = $["🛡️"]["💄"]($1.value, "lower");
                                break;
                            default:
                                $1.value = $["🛡️"]["💄"]($1.value, ___["💄"] + (___["🔍"] ? "." + $["🙋"]["🕳️"] + "." + ___["🔍"] : ""));
                        }

                        if (!___["📦"].success) {
                            $1.errors.push(___["📦"].error);
                            $1.success = false;
                        }
                    });

                    return $1;
                },
                // scrubSimple(name, value, scrubs)
                "🧽✨": ($1, $2, $3) => {
                    return $["🛡️"]["🧽1️⃣"]({ name: $1, value: $2, scrubs: $3 });
                },
                // scrubMatch(scrubArr, scrubMatch, valueMatch)
                "🧽🟰": ($1, $2, $3) => {
                    const __ = {};
                    __["🟰"] = false;   // match
                    $1.forEach(function ($$) {
                        if ($2.value === $$.value && $$.name === $3) {
                            __["🟰"] = true;
                        }
                    });
                    return __["🟰"];
                },
            }
        })(),
        /**
         * 🙋 user-defined functions
         * 🧩["🙋"]["🚀"]()    called at init of load          (core.ud.init)
         * 🧩["🙋"]["🎬"]()    called at start of process      (core.ud.soc)
         * 🧩["🙋"]["🛫"]()    called prior to all backend requests   (core.ud.preflight)
         * 🧩["🙋"]["🛬"]()    called post all backend requests       (core.ud.postflight)
         * 🧩["🙋"]["🎨⏮️"]()  called prior to each template insert   (core.ud.prepaint)
         * 🧩["🙋"]["🎨⏭️"]()  called post each data-driven cloning   (core.ud.postpaint)
         * 🧩["🙋"]["🏁"]()    called at end of process        (core.ud.eoc)
         *
         * 🧩["🙋"]["💄"]()    called after 🧩["🎨"]["💄"]()   (core.ud.formatValue)
         * */
        "🙋": (() => {
            _["🙋"] = {};
            _["🙋"]["🕳️"] = '';                                                 // defaultDelta
            _["🙋"]["🕳️💄"] = 'none';                                           // defaultDeltaFormat
            _["🙋"]["👆🎯"] = 'main';                                            // defaultClickTarget
            _["🙋"]["📅💄"] = 'M/D/YY H:MM P';                                   // defaultDateFormat
            _["🙋"]["⏳📄"] = '<marquee width="50%">loading...</marquee>';        // defaultLoadingTemplate
            _["🙋"]["📭📄"] = '';                                                // defaultEmptyTemplate
            _["🙋"]["📰"] = 'coremoji.js';                                       // defaultPageTitle
            _["🙋"]["📰🔔"] = 'Updated bookmark location';                       // defaultPageStatusUpdate
            _["🙋"]["❗📄"] = 'Not Found';                                        // alertMissingTemplate
            _["🙋"]["❗🏷️"] = 'Unrecognized type';                                // alertMissingTypeReference
            _["🙋"]["❗📭"] = 'Not Found';                                        // alertEmptyTemplate
            _["🙋"]["❗📅"] = '*';                                                // alertInvalidDate
            _["🙋"]["❗✂️"] = '...';                                              // alertTruncated
            _["🙋"]["💧🚫"] = ['h-100'];                                          // hydrationClassIgnoreList
            _["🙋"]["💄🚫"] = [];                                                 // formatClassIgnoreList
            return {
                get "🕳️"() {
                    return _["🙋"]["🕳️"];
                },
                set "🕳️"($1) {
                    _["🙋"]["🕳️"] = String($1);
                },
                get "🕳️💄"() {
                    return _["🙋"]["🕳️💄"];
                },
                set "🕳️💄"($1) {
                    _["🙋"]["🕳️💄"] = String($1);
                },
                get "👆🎯"() {
                    return _["🙋"]["👆🎯"];
                },
                // NOTE: faithful port of a core.js bug — this second "🕳️💄" setter
                // (`set defaultDeltaFormat`) overrides the one above and writes
                // defaultClickTarget instead. Preserved so behaviour matches.
                set "🕳️💄"($1) {
                    _["🙋"]["👆🎯"] = String($1);
                },
                get "📅💄"() {
                    return _["🙋"]["📅💄"];
                },
                set "📅💄"($1) {
                    _["🙋"]["📅💄"] = String($1);
                },
                get "⏳📄"() {
                    return _["🙋"]["⏳📄"];
                },
                set "⏳📄"($1) {
                    _["🙋"]["⏳📄"] = String($1);
                },
                get "📭📄"() {
                    return _["🙋"]["📭📄"];
                },
                set "📭📄"($1) {
                    _["🙋"]["📭📄"] = String($1);
                },
                get "📰"() {
                    return _["🙋"]["📰"];
                },
                set "📰"($1) {
                    _["🙋"]["📰"] = String($1);
                },
                get "📰🔔"() {
                    return _["🙋"]["📰🔔"];
                },
                set "📰🔔"($1) {
                    _["🙋"]["📰🔔"] = String($1);
                },
                get "❗📄"() {
                    return _["🙋"]["❗📄"];
                },
                set "❗📄"($1) {
                    _["🙋"]["❗📄"] = String($1);
                },
                get "❗🏷️"() {
                    return _["🙋"]["❗🏷️"];
                },
                set "❗🏷️"($1) {
                    _["🙋"]["❗🏷️"] = String($1);
                },
                get "❗📭"() {
                    return _["🙋"]["❗📭"];
                },
                set "❗📭"($1) {
                    _["🙋"]["❗📭"] = String($1);
                },
                get "❗📅"() {
                    return _["🙋"]["❗📅"];
                },
                set "❗📅"($1) {
                    _["🙋"]["❗📅"] = String($1);
                },
                get "❗✂️"() {
                    return _["🙋"]["❗✂️"];
                },
                set "❗✂️"($1) {
                    _["🙋"]["❗✂️"] = String($1);
                },
                get "💧🚫"() {
                    return _["🙋"]["💧🚫"];
                },
                set "💧🚫"($1) {
                    _["🙋"]["💧🚫"].push($1);
                },
                get "💄🚫"() {
                    return _["🙋"]["💄🚫"];
                },
                set "💄🚫"($1) {
                    _["🙋"]["💄🚫"].push($1);
                },
            }
        })(),
        //user experience (ux)
        "🎨": (() => {
            return {
                /**
                 * 💄 formatValue — applies formatting to a string.
                 *
                 * @param {any} $1 value - Usually a string, but some formats may require another type
                 * @param {any} $2 formatList - An array of formats, a single format, or a pipe delimited list of formats, i.e., format*clue|format OR ['money*$','lower']
                 * @param {string} $3 clue - A clue used as an argument in the formatting a string.
                 * @returns {string} The new value after formatting.
                 */
                "💄": ($1, $2, $3) => {
                    $2 = $2 || [];
                    //check for pipe delimited string
                    if (typeof $2 === 'string') $2 = $2.split('|');
                    for (const $$ of $2) {
                        const __ = {};
                        //checking for format*clue format
                        __["✂️"] = $$.split('*');
                        __["💄"] = __["✂️"][0];   // formatName
                        __["🔍"] = __["✂️"][1];   // clueOverride
                        __["🔎"] = (__["🔍"] || $3);   // clueFinal
                        //set the value
                        $1 = $["🛡️"]["💄"]($1, [__["💄"], $["🙋"]["🕳️"], __["🔎"]].join('.'), __["🔎"])
                        if (typeof $["🙋"]["💄"] === 'function') {
                            $1 = $["🙋"]["💄"]($1, $2, $3);
                        }
                    }
                    return $1;
                },
                // insertPocket(target, dataRefs, dataSources, autoFill)
                "👝➕": ($1, $2, $3 = [], $4 = true) => {
                    const __ = {};
                    if (!$2) return;
                    __["🤫"] = $1.includes('core_be_get') || $1 === 'silent';   // isSilent
                    __["📊"] = $1.includes('Data');                            // isData

                    __["👝"] = document.createElement('div');   // pocket
                    __["👝"].classList.add('core-pocket', 'core-pocket-transition');
                    __["👝"].setAttribute('data-core-templates', $2);

                    if ($3.length) {
                        for (const $$ of $3) {
                            __["👝"].setAttribute('data-' + $$.name + '-core-source', $$.url);
                            if (__["🤫"]) {
                                if (__["📊"]) $["📡"]["📥"]($$.name, $$.url);
                                else $["📡"]["📄📥"]($$.name, $$.url);
                            }
                        }
                    }

                    if (__["🤫"]) return;

                    try {
                        __["📑"] = (document.querySelector($1) || document.getElementById($1.replace('#', '')));   // section
                    } catch ($_) {
                        if (_["🐛"]) console.warn(`coremoji.js: Invalid target selector "${$1}"`);
                        return;
                    }

                    if (__["📑"]) {
                        __["📑"].innerHTML = '';
                        __["📑"].appendChild(__["👝"]);
                        if ($4) $["👝"]["🎬"]();
                    }
                }
            }
        })(),
    }
})();
