import BaseView from '../base/BaseView.js';

const IMG = 'https://www.forkinthekitchen.com/wp-content/uploads/2018/12/210925.white_.wine_.mac_.updated-5851.jpg';

const EatMacAndCheeseView = BaseView.extend({

  template: `<img src="${IMG}" alt="Eat Mac and Cheese">`

});

export default EatMacAndCheeseView;
