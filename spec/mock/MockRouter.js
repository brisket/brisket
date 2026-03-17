import _ from 'underscore';
import View from '../../lib/viewing/View.js';
import Layout from '../../lib/viewing/Layout.js';

const PageNotFoundView = View.extend({
  name: 'page_not_found'
});

const ErrorView = View.extend({
  name: 'unhandled_error'
});

const ExampleLayout = Layout.extend({
  template: '<div></div>',
  content: 'div',
});

const MockRouter = {

  create(options) {
    return _.extend({
      layout: ExampleLayout,
      errorViewMapping: {
        404: PageNotFoundView,
        500: ErrorView
      },
      onRouteStart: jasmine.createSpy(),
      onRouteComplete: jasmine.createSpy(),
      close: jasmine.createSpy()
    }, options);
  }

};

export default MockRouter;
