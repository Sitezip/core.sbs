/**
 * CORE User Experience Module
 * Handles UI interactions and user experience features
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_ux = (() => {
    return {
        formatValue: (value, format, clue = '') => {
            return core_sv.format(value, format + (clue ? '.' + core.ud.defaultDelta + '.' + clue : ''));
        },

        insertPocket: (target, dataRefs, dataSources, push = true) => {
            if (push && core.useRouting) {
                core_hf.setRoute(null, null, '#' + escape(JSON.stringify({ t: target, l: dataSources.map(ds => ({ n: ds.name, u: ds.url })) })));
            }
            let targetElem = document.querySelector(target);
            if (!targetElem) {
                if (core.useDebugger) console.log('core.js target not found: ' + target);
                return;
            }
            let pocket = document.createElement('div');
            pocket.className = 'core-pocket';
            pocket.setAttribute('data-core-templates', dataRefs);
            for (const source of dataSources) {
                pocket.setAttribute('data-' + source.name + '-core-source', source.url);
            }
            targetElem.appendChild(pocket);
            core_pk.soc();
        }
    };
})();
