/**
 * CORE User-Defined Module
 * Provides customizable defaults and user configuration
 * Follows C.O.R.E. project principles: lightweight, modular, performant
 */

const core_ud = (() => {
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
        set defaultClickTarget(value) {
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
    };
})();
