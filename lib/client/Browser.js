const Browser = {

  location() {
    return window.location;
  },

  hasPushState() {
    return !!(window.history && window.history.pushState);
  }

};

export default Browser;

