import noop from '../util/noop.js';
import { isServer, isClient } from '../environment/Environment.js';

const CloseableView = {

  onClose: noop,

  close() {
    this.trigger('close');

    const onCloseError = ifOnCloseError(this);

    this.unbind();
    this.remove();

    this.isInDOM = false;

    if (onCloseError) {
      throw onCloseError;
    }
  },

  closeAsChild() {
    this.trigger('close');

    const onCloseError = ifOnCloseError(this);

    this.unbind();

    if (isServer()) {
      this.remove();
    }

    if (isClient()) {
      this.stopListening();
      this.$el.off();
      this.$el.removeData();
    }

    this.isInDOM = false;

    if (onCloseError) {
      throw onCloseError;
    }
  }

};

function ifOnCloseError(view) {
  try {
    view.onClose();

    if (typeof view.hasChildViews === 'function' && view.hasChildViews()) {
      view.closeChildViews();
    }
  } catch (e) {
    console.error(
      'Error: There is an error in an onClose callback.\n' +
            `View with broken onClose is: ${view}`
    );

    return e;
  }

  return null;
}

export default CloseableView;

