import _ from 'underscore';
import HasChildViews from '../viewing/HasChildViews.js';
import ReattachableView from '../viewing/ReattachableView.js';
import StringTemplateAdapter from '../templating/StringTemplateAdapter.js';
import TemplateAdapter from '../templating/TemplateAdapter.js';
import noop from '../util/noop.js';

const VIEW_PLACEHOLDER_PREFIX = 'b_-_t';

const RenderableView = Object.assign({},
  HasChildViews,
  ReattachableView, {

    beforeRender: noop,

    afterRender: noop,

    onDOM: noop,

    modelForView: noop,

    logic: noop,

    partials: null,

    templateAdapter: StringTemplateAdapter,

    rawRenderedHTML: null,

    isInDOM: false,

    viewPlaceholders: null,

    enterDOM() {
      if (this.isInDOM) {
        return;
      }

      this.onDOM();
      this.isInDOM = true;

      this.trigger('on-dom');

      this.foreachChildView(function(viewRelationship) {
        viewRelationship.enterDOM();
      });
    },

    generateViewPlaceholders() {
      const unplacedCount = this.childViewCount() - this.unrenderedChildViewCount();

      // [wawjr3d] Do this before return so data.views is always an object
      this.viewPlaceholders = new Array(unplacedCount);

      this.foreachChildView(function(viewRelationship, identifier, i) {
        if (viewRelationship.hasBeenPlaced()) {
          return;
        }

        const placeholderId = VIEW_PLACEHOLDER_PREFIX + i;

        this.viewPlaceholders[identifier] = viewPlaceholder(placeholderId);
        viewRelationship.andReplace(`#${placeholderId}`);
      });
    },

    templateData() {
      const modelForView = this.modelForView() || modelToJSON(this.model) || {};

      const templateData = _.extend(modelForView, this.logic());

      templateData.views = this.viewPlaceholders;

      return templateData;
    },

    renderTemplate() {
      if (!this.template) {
        return;
      }

      if (!this.templateAdapter) {
        throw new Error(
          `You must specify a templateAdapter for a View. ${this} is missing a templateAdapter`
        );
      }

      if (!Object.prototype.isPrototypeOf.call(TemplateAdapter, this.templateAdapter)) {
        throw new Error(
          `${this} templateAdapter must extend from Brisket.Templating.TemplateAdapter.`
        );
      }

      const template = _.isFunction(this.template) ? this.template.bind(this) : this.template;

      this.rawRenderedHTML = this.templateAdapter.templateToHTML(
        template,
        this.templateData(),
        this.partials
      );

      this.el.innerHTML = this.rawRenderedHTML;
    },

    renderUnrenderedChildViews() {
      if (!this.unrenderedChildViews) {
        return;
      }

      for (let i = 0, len = this.unrenderedChildViews.length; i < len; i++) {
        const viewRelationship = this.unrenderedChildViews[i];

        viewRelationship.renderChildViewIntoParent();
      }

      this.unrenderedChildViews.length = 0;
    },

    reattachUnrenderedChildViews() {
      if (!this.unrenderedChildViews) {
        return;
      }

      for (let i = 0, len = this.unrenderedChildViews.length; i < len; i++) {
        const viewRelationship = this.unrenderedChildViews[i];

        viewRelationship.reattach();
        viewRelationship.childView.render();
      }

      this.unrenderedChildViews.length = 0;
    },

    render() {
      const isReanimatingFromServer = this.isAttached && !this.hasBeenRendered;

      if (this.hasBeenRendered) {
        this.closeChildViews();
        this.hasBeenRendered = false;
        this.el.innerHTML = '';
      }

      this.establishIdentity();

      this.beforeRender();
      this.generateViewPlaceholders();

      if (isReanimatingFromServer) {
        this.reattachUnrenderedChildViews();
      }

      if (!isReanimatingFromServer) {
        this.renderTemplate();
        this.renderUnrenderedChildViews();
      }

      this.hasBeenRendered = true;

      this.afterRender();

      if (!isReanimatingFromServer && this.isInDOM) {
        this.isInDOM = false;
        this.enterDOM();
      }

      return this;
    }

  }
);

function modelToJSON(model) {
  if (!model) {
    return null;
  }

  return model.toJSON();
}

function viewPlaceholder(placeholderId) {
  return `<div id='${placeholderId}'></div>`;
}

export default RenderableView;

