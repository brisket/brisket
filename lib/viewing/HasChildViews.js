import ViewRelationship from '../viewing/ViewRelationship.js';
import InstantiatedViewRelationship from '../viewing/InstantiatedViewRelationship.js';

const HasChildViews = {

  hasBeenRendered: false,

  childViews: null,

  unrenderedChildViews: null,

  uidsCreated: 0,

  createChildView(optionalIdentifier, ChildView) {
    if (typeof optionalIdentifier != 'string') {
      ChildView = optionalIdentifier;
    }

    const parentView = this;
    const viewRelationship = makeViewRelationship(ChildView, parentView);

    if (!this.hasChildViews()) {
      this.childViews = [];
    }

    addChildView(parentView, viewRelationship, optionalIdentifier);

    return viewRelationship;
  },

  replaceChildView(identifier, ChildView) {
    this.closeChildView(identifier);

    return this.createChildView(identifier, ChildView);
  },

  closeChildView(identifier) {
    if (!this.hasChildViews()) {
      return;
    }

    const viewRelationship = this.childViews[identifier];

    if (!viewRelationship) {
      return;
    }

    viewRelationship.close();
    this.removeUnrenderedChildView(viewRelationship);
    delete this.childViews[identifier];
  },

  closeChildViews() {
    if (!this.hasChildViews()) {
      return;
    }

    this.foreachChildView(function(viewRelationship) {
      viewRelationship.closeAsChild();
    });

    this.childViews = [];
    this.unrenderedChildViews = [];
  },

  foreachChildView(callback) {
    if (typeof callback !== 'function' || !this.childViews) {
      return;
    }

    const identifiers = Object.keys(this.childViews);

    for (let i = 0, len = identifiers.length; i < len; i++) {
      const identifier = identifiers[i];
      const viewRelationship = this.childViews[identifier];

      callback.call(this, viewRelationship, identifier, i);
    }
  },

  addUnrenderedChildView(viewRelationship) {
    if (!this.unrenderedChildViews) {
      this.unrenderedChildViews = [];
    }

    this.unrenderedChildViews.push(viewRelationship);
  },

  removeUnrenderedChildView(viewRelationship) {
    const unrenderedChildViews = this.unrenderedChildViews;

    if (!viewRelationship || !unrenderedChildViews) {
      return;
    }

    for (let i = 0, len = unrenderedChildViews.length; i < len; i++) {
      if (unrenderedChildViews[i] === viewRelationship) {
        this.unrenderedChildViews.splice(i, 1);
        break;
      }
    }
  },

  childViewCount() {
    if (!this.childViews) {
      return 0;
    }

    return Object.keys(this.childViews).length;
  },

  unrenderedChildViewCount() {
    if (!this.unrenderedChildViews) {
      return 0;
    }

    return this.unrenderedChildViews.length;
  },

  hasChildViews() {
    return this.childViewCount() > 0;
  },

  hasNotBeenRendered() {
    return !this.hasBeenRendered;
  },

  generateChildUid(context) {
    this.uidsCreated = this.uidsCreated + 1;

    const contextId = context ? `${context}|` : '';

    return `${contextId + this.uid}_${this.uidsCreated}`;
  }

};

function thereIsAlreadyAChildViewWith(optionalIdentifier, parentView) {
  return !!parentView.childViews[optionalIdentifier];
}

function addChildView(parentView, viewRelationship, optionalIdentifier) {
  if (typeof optionalIdentifier != 'string') {
    parentView.childViews.push(viewRelationship);
    return;
  }

  if (!isNaN(parseInt(optionalIdentifier, 10))) {
    throw new Error(
      `For parentView ${parentView}, you attempted to create a child view with a ` +
            `number-like identifier '${optionalIdentifier}'. ` +
            'A child view identifier cannot be \'number-like\' due to crazy data structures'
    );
  }

  if (thereIsAlreadyAChildViewWith(optionalIdentifier, parentView)) {
    throw new Error(
      `For parentView ${parentView}, you attempted to create a child view with ` +
            `identifer '${optionalIdentifier}'. A child view exists with identifier '${
              optionalIdentifier}' already`
    );
  }

  parentView.childViews[optionalIdentifier] = viewRelationship;
}

function makeViewRelationship(ChildView, parentView) {
  if (!ChildView) {
    throw new Error(
      `You tried to create the child view '${ChildView}' for the parentView ${parentView}.\n\n` +
            'To createChildView, pass a constructor or an instance of a Brisket.View'
    );
  }

  if (typeof ChildView == 'function') { // cannot be an instantiated view
    return new ViewRelationship(ChildView, parentView);
  }

  return new InstantiatedViewRelationship(ChildView, parentView);
}

export default HasChildViews;

