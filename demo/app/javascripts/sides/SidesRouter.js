import BaseRouter from '../routing/BaseRouter.js';
import MacAndCheeseView from './MacAndCheeseView.js';
import Side from './Side.js';
import SideView from './SideView.js';

const SidesRouter = BaseRouter.extend({

  routes: {
    'sides/mac-and-cheese': 'eatMacAndCheese',
    'sides/vegetables/:type': 'eatVegetables',
    'sides/:type': 'eatSide',
  },

  eatMacAndCheese(setLayoutData) {
    setLayoutData({
      pageType: 'cheese',
      title: 'Mac and Cheese',
      metatags: {
        description: 'Keep calm and eat Mac and Cheese'
      }
    });

    return new MacAndCheeseView();
  },

  async eatVegetables(type, setLayoutData, request) {
    const side = new Side({ type });

    request.onComplete(function() {
      setLayoutData('pageType', 'vegetable-finished');
    });

    await side.fetch();

    setLayoutData({
      pageType: 'vegetable',
      title: `${side.get('name')} - healthy!`,
    });

    return new SideView({ model: side });
  },

  async eatSide(type, setLayoutData, request) {
    const side = new Side({ type });

    request.onComplete(function() {
      setLayoutData('pageType', 'side-finished');
    });

    await side.fetch();

    setLayoutData({
      pageType: 'side',
      title: side.get('name'),
    });

    return new SideView({ model: side });
  },

});

export default SidesRouter;
