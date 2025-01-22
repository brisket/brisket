import _ from 'underscore';

const ViewRelationship = function(ChildView, parentView) {
  this.ChildView = ChildView;
  this.parentView = parentView;
};

ViewRelationship.prototype = {
  parentView: null,
  ChildView: null,
  childView: null,
  options: null,
  destination: null,
  placementStrategy: null,
  uid: null,

  instantiateChildView() {
    if (!this.childView) {
      this.childView = new this.ChildView(this.options);
    }
  },

  hasBeenPlaced() {
    return !!this.placementStrategy;
  },

  enterDOM() {
    if (!this.childView.enterDOM) {
      return;
    }

    if (!this.parentView.isInDOM) {
      return;
    }

    return this.childView.enterDOM.apply(this.childView, arguments);
  },

  reattach() {
    if (!this.childView.reattach) {
      return;
    }

    return this.childView.reattach.apply(this.childView, arguments);
  },

  withOptions(options) {
    this.options = options;
    return this;
  },

  andAppendIt() {
    return this.andPlace(null, 'append');
  },

  andPrependIt() {
    return this.andPlace(null, 'prepend');
  },

  andInsertInto(destination) {
    return this.andPlace(destination, 'html');
  },

  andInsertAfter(destination) {
    return this.andPlace(destination, 'after');
  },

  andReplace(destination) {
    return this.andPlace(destination, 'replaceWith');
  },

  andAppendItTo(destination) {
    return this.andPlace(destination, 'append');
  },

  andPrependItTo(destination) {
    return this.andPlace(destination, 'prepend');
  },

  andInsertBefore(destination) {
    return this.andPlace(destination, 'before');
  },

  andPlace(destination, placementStrategy) {
    this.instantiateChildView();

    this.destination = destination;
    this.placementStrategy = placementStrategy;

    setUid(this.parentView.generateChildUid(), this.childView);

    if (this.parentView.hasNotBeenRendered()) {
      this.parentView.addUnrenderedChildView(this);
      return this;
    }

    if (this.parentView.isNotAlreadyAttachedToDOM() || childViewCannotReattach(this)) {
      this.renderChildViewIntoParent();
      return this;
    }

    this.childView.reattach();

    if (this.childView.isAttached) {
      this.childView.render();
      this.enterDOM();
    } else {
      this.renderChildViewIntoParent();
    }

    return this;
  },

  renderChildViewIntoParent() {
    let destinationEl = this.parentView.el;

    if (this.destination) {
      destinationEl = chooseDestination(destinationEl, this.destination);
    }

    if (destinationEl) {
      const childViewEl = this.childView.render().el;

      switch (this.placementStrategy) {
      case 'append':
        destinationEl.appendChild(childViewEl);
        break;
      case 'prepend':
        destinationEl.insertBefore(childViewEl, destinationEl.firstChild);
        break;
      case 'html':
        destinationEl.innerHTML = '';
        destinationEl.appendChild(childViewEl);
        break;
      case 'before':
        destinationEl.parentNode.insertBefore(childViewEl, destinationEl);
        break;
      case 'after':
        destinationEl.parentNode.insertBefore(childViewEl, destinationEl.nextSibling);
        break;
      case 'replaceWith':
        destinationEl.parentNode.replaceChild(childViewEl, destinationEl);
        break;
      default:
        throw new Error(
          'You tried to place a View with an unsupported method. The supported' +
                  'methods are \'append\', \'prepend\', \'html\', \'before\', \'after\', \'replaceWith\''
        );
      }
    }

    this.enterDOM();
  },

  close() {
    if (this.childView && this.childView.close) {
      this.childView.close();
    }

    clearParentChildRelationship(this);
  },

  closeAsChild() {
    if (this.childView && this.childView.closeAsChild) {
      this.childView.closeAsChild();
    }

    clearParentChildRelationship(this);
  }

};

function chooseDestination(destinationEl, destination) {
  if (_.isString(destination)) {
    return destinationEl.querySelector(destination);
  }
  if (destination.length) {
    return destination[0];
  }
  return destination;
}

function clearParentChildRelationship(relationship) {
  relationship.childView = null;
  relationship.parentView = null;
  relationship.ChildView = null;
}

function childViewCannotReattach(viewRelationship) {
  return typeof viewRelationship.childView.reattach !== 'function';
}

function setUid(uid, childView) {
  if (!childView.setUid || childView.hasValidUid()) {
    return;
  }

  childView.setUid(uid);
}

export default ViewRelationship;

