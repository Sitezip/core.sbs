/**
 * CORE Validation Module
 * Handles data scrubbing and formatting
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_sv = (() => {
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
                        value = core_hf.date(value, clue);
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
                    value = String(value).toLowerCase();
                    value = '<a href="mailto:' + value + '" ' + clue + '>' + value + '</a>';
                    break;
                case 'urllink':
                    value = '<a href="' + value + '" target="_blank" ' + clue + '>' + value + '</a>';
                    break;
                case 'imgsrc':
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
                    value = ' ' + clue + '="' + value + '" ';
                    break
                case 'core_pk_cloner':
                    value = core_pk.cloner(value, core_cr.getTemplate(clue) || core.ud.alertMissingTemplate);
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
            let resultObj = { success: true, scrubs: [], errors: {} };
            scrubArr.forEach(function (scrubObj, i) {
                scrubArr[i] = core_sv.scrubEach(scrubObj, scrubArr);
                if (!scrubArr[i].success) {
                    resultObj.success = false;
                    resultObj.errors[scrubArr[i].name] = scrubArr[i].errors;
                }
            });
            resultObj.scrubs = scrubArr;
            return resultObj;
        },

        scrubEach: (scrubObj, scrubArr) => {
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
                        eachResult.success = core_hf.ccNumAuth(scrubObj.value).isValid;
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
                        eachResult.success = core_sv.scrubMatch(scrubArr, scrubObj, clue);
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
                        scrubObj.value = core_sv.format(scrubObj.value, "lower");
                        break;
                    default:
                        scrubObj.value = core_sv.format(scrubObj.value, format + (clue ? "." + core.ud.defaultDelta + "." + clue : ""));
                }

                if (!eachResult.success) {
                    scrubObj.errors.push(eachResult.error);
                    scrubObj.success = false;
                }
            });

            return scrubObj;
        },

        scrubSimple: (name, value, scrubs) => {
            return core_sv.scrubEach({ name: name, value: value, scrubs, scrubs });
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
    };
})();
