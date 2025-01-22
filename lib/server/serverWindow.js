import { JSDOM } from 'jsdom';

// jsdom.defaultDocumentFeatures = {
//   MutationEvents: false
// };

const { window } = new JSDOM('<!DOCTYPE html>');

/**
 * [wawjr3d] next 2 lines fix issue here:
 * https://github.com/brisket/brisket/issues/36
 */
window.HTMLFrameElement._init = function() {};
window.HTMLIFrameElement._init = function() {};

export default window;

