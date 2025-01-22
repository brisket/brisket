import BaseRouter from '../routing/BaseRouter.js';
import HomeView from './HomeView.js';

const HomeRouter = BaseRouter.extend({

  routes: {
    '': 'home'
  },

  home(setLayoutData) {
    const description = 'This is the homepage for your first Brisket site';
    const title = 'Welcome to your first Brisket site!';

    setLayoutData({
      title,
      metatags: {
        description,
        'twitter:title': title,
        'twitter:description': description,
        'og:title': title,
        'og:description': description
      }
    });

    return new HomeView();
  }

});

export default HomeRouter;
