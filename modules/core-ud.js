/**
 * CORE User-Defined Module
 * Handles user-defined defaults and configuration
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_ud = (() => {
    // User-defined defaults
    let defaultDelta = '';
    let defaultDeltaFormat = 'string';
    let defaultPageTitle = 'CORE Framework';
    let defaultPageStatusUpdate = 'Page updated';
    let defaultLoadingTemplate = '<div class="loading">Loading...</div>';
    let defaultEmptyTemplate = '<div class="empty">No data available</div>';
    let alertEmptyTemplate = 'Not Found';
    let alertInvalidDate = '*';
    let alertTruncated = '...';
    let hydrationClassIgnoreList = ['h-100'];
    let formatClassIgnoreList = [];

    // User-defined callbacks
    let init = null;
    let soc = null;
    let eoc = null;
    let prepaint = null;
    let postpaint = null;
    let preflight = null;
    let postflight = null;
    let cloneValue = null;
    let cloneString = null;

    return {
        // Default values
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

        // Ignore lists
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

        // Callbacks
        get init() {
            return init;
        },
        set init(value) {
            init = value;
        },
        get soc() {
            return soc;
        },
        set soc(value) {
            soc = value;
        },
        get eoc() {
            return eoc;
        },
        set eoc(value) {
            eoc = value;
        },
        get prepaint() {
            return prepaint;
        },
        set prepaint(value) {
            prepaint = value;
        },
        get postpaint() {
            return postpaint;
        },
        set postpaint(value) {
            postpaint = value;
        },
        get preflight() {
            return preflight;
        },
        set preflight(value) {
            preflight = value;
        },
        get postflight() {
            return postflight;
        },
        set postflight(value) {
            postflight = value;
        },
        get cloneValue() {
            return cloneValue;
        },
        set cloneValue(value) {
            cloneValue = value;
        },
        get cloneString() {
            return cloneString;
        },
        set cloneString(value) {
            cloneString = value;
        }
    };
})();
