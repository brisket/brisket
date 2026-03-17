import View from '../viewing/View.js';
import noop from '../util/noop.js';

const FIND_HTML_TAG_ATTRIBUTES = /<html ([^>]*)>/i;
const FIND_DOCTYPE = /^\s*<!doctype[^>]*>/i;
const FIND_HTML_TAG = /^\s*<html/i;

const Layout = View.extend({

  uid: '0',

  tagName: 'html',

  content: null,

  fetchData: noop,

  isSameTypeAs(LayoutType) {
    return this.constructor === LayoutType;
  },

  reattach() {
    this.setElement(document.documentElement);
    this.isAttached = true;
  },

  asHtml() {
    let html = this.el.outerHTML;
    const htmlTagAttributes = parseHtmlTagAttributesFromRawRenderedHTML(this.rawRenderedHTML);

    if (htmlTagAttributes) {
      html = html.replace(FIND_HTML_TAG, `<html ${htmlTagAttributes}`);
    }

    const doctype = parseDoctypeFromRawRenderedHTML(this.rawRenderedHTML);

    if (doctype) {
      html = `${doctype}\n${html}`;
    }

    return html;
  },

  setContent(view) {
    this.replaceChildView('content', view)
      .andInsertInto(this.content);
  },

  setContentToAttachedView(view) {
    this.createChildView('content', view);
  },

  clearContent() {
    this.closeChildView('content');
  }

});

function parseHtmlTagAttributesFromRawRenderedHTML(rawRenderedHTML) {
  const matches = FIND_HTML_TAG_ATTRIBUTES.exec(rawRenderedHTML);

  return matches ? matches[1] : null;
}

function parseDoctypeFromRawRenderedHTML(rawRenderedHTML) {
  return FIND_DOCTYPE.exec(rawRenderedHTML);
}

export default Layout;

