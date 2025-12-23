/**
 * CORE User Experience Module
 * Handles UI interactions and user experience functions
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_ux = (() => {
    return {
        /**
         * Applies formatting to a string
         * @param {any} value - Usually a string, but some formats may require another type
         * @param {any} formatList - An array of formats, a single format, or a pipe delimited list of formats
         * @param {string} clue - A clue used as an argument in the formatting a string
         * @returns {string} The new value after formatting
         */
        formatValue: (value, formatList, clue) => {
            formatList = formatList || [];
            if (typeof formatList === 'string') formatList = formatList.split('|');
            for (const formatItem of formatList) {
                let [formatName, clueOverride] = formatItem.split('*');
                let clueFinal = (clueOverride || clue);
                value = core_sv.format(value, [formatName, core.ud.defaultDelta, clueFinal].join('.'), clueFinal)
                if (typeof core.ud.formatValue === 'function') {
                    value = core.ud.formatValue(value, formatList, clue);
                }
            }
            return value;
        },

        insertPocket: (target, dataRefs, dataSources = [], autoFill = true) => {
            if (!dataRefs) return;
            let isSilent = target.includes('core_be_get');
            let isData = target.includes('Data');
            
            const pocket = document.createElement('div');
            pocket.classList.add('core-pocket');
            pocket.setAttribute('data-core-templates', dataRefs);
            let ignoreTemplates = [];
            if (dataSources.length) {
                for (const source of dataSources) {
                    pocket.setAttribute('data-' + source.name + '-core-source', source.url);
                    if (isSilent) {
                        ignoreTemplates.push(source.name);
                        if (isData) {
                            core_be.getData(source.name, source.url);
                        } else {
                            core_be.getTemplate(source.name, source.url);
                        }
                    }
                }
            }
            if (isSilent) {
                const templates = dataRefs.split(',').map(s => String(s).trim()).filter(Boolean);
                for (const template of templates) {
                    if (!templates.includes(template)) {
                        if (isData) {
                            core_be.getData(template);
                        } else {
                            core_be.getTemplate(template);
                        }
                    }
                }
                return;
            }
            
            let section;
            if (target.includes('#')) {
                section = document.getElementById(target.replace('#', ''));
            } else if (target.includes('.')) {
                section = document.getElementsByClassName(target.replace('.', ''))[0];
            } else {
                section = document.getElementsByTagName(target)[0];
            }
            if (section) {
                while (section.firstElementChild) {
                    section.firstElementChild.remove();
                }
                section.append(pocket);
            }
            if (autoFill) core_pk.soc();
        }
    };
})();
