import ViewsFromServer from '../viewing/ViewsFromServer.js';

const ReattachableView = {

  uid: null,

  isAttached: false,

  isNotAlreadyAttachedToDOM() {
    return !this.isAttached;
  },

  hasValidUid() {
    return typeof this.uid == 'string' && this.uid.length > 0;
  },

  reattach() {
    if (!this.hasValidUid()) {
      return;
    }

    const viewElement = ViewsFromServer.getAndPurge(this.uid);

    if (!viewElement) {
      return;
    }

    this.setElement(viewElement);

    this.isAttached = true;
  },

  establishIdentity() {
    if (!this.hasValidUid()) {
      return;
    }

    this.el.setAttribute(ViewsFromServer.IDENTITY_ATTRIBUTE, this.uid);
  },

  setUid(uid) {
    this.uid = uid;
  }

};

export default ReattachableView;

