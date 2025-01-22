import Backbone from '../application/Backbone.js';
import RenderableView from '../viewing/RenderableView.js';
import CloseableView from '../viewing/CloseableView.js';
import Events from '../events/Events.js';
import { isServer } from '../environment/Environment.js';

const View = Backbone.View.extend(Object.assign({},
  RenderableView,
  CloseableView,
  Events, {

    toString() {
      const viewAsString = 'Brisket.View: { ' +
                `template: '${this.template}', ` +
                `className: '${this.className}', ` +
                `tagName: '${this.tagName}', ` +
                `uid: '${this.uid}', ` +
                `cid: '${this.cid}' ` +
                '}';

      return viewAsString;
    }
  }

));

if (isServer()) {
  View.prototype.delegateEvents = function() {
    return this;
  };

  View.prototype.undelegateEvents = function() {
    return this;
  };
}

export default View;

