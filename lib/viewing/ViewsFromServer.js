const IDENTITY_ATTRIBUTE = 'data-view-uid';

let viewElements = {};

const ViewsFromServer = {

  IDENTITY_ATTRIBUTE,

  initialize() {
    const viewsFromServer = document.querySelectorAll(`[${IDENTITY_ATTRIBUTE}]`);
    let viewFromServer;
    let uid;

    for (let i = 0, len = viewsFromServer.length; i < len; i++) {
      viewFromServer = viewsFromServer[i];
      uid = viewFromServer.getAttribute(IDENTITY_ATTRIBUTE);

      viewElements[uid] = viewFromServer;
    }
  },

  getAndPurge(uid) {
    const viewElement = viewElements[uid] || null;

    viewElements[uid] = null;

    return viewElement;
  },

  reset() {
    viewElements = {};
  }

};

export default ViewsFromServer;

