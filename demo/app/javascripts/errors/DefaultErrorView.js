import BaseView from '../base/BaseView.js';

const DefaultErrorView = BaseView.extend({
  template: `
    <h1 style="color: #C00;">
      500 - There was an error serving the page
    </h1>
  `
});

export default DefaultErrorView;
