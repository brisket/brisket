import Brisket from '../../../../lib/brisket.js';
import PageNotFoundView from '../errors/PageNotFoundView.js';
import DefaultErrorView from '../errors/DefaultErrorView.js';
import Layout from '../layout/Layout.js';

const BaseRouter = Brisket.Router.extend({

  layout: Layout,

  errorViewMapping: {

    404: PageNotFoundView,

    500: DefaultErrorView

  },

  onRouteComplete(layout, request) {
    console.log(`ClientApp rendered ${request.path}`);

    if (request.isFirstRequest) {
      return;
    }

    window.scrollTo(0, 0);
  }

});

export default BaseRouter;
