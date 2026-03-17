import express from 'express';

const SIDE_DATA = {
  'green-bean-casserole': {
    name: 'Green Bean Casserole',
    url: 'https://life-in-the-lofthouse.com/wp-content/uploads/2020/11/Green-Bean-Casserole1_new-500x500.jpg',
  },
  'polenta': {
    name: 'Polenta',
    url: 'https://familystylefood.com/wp-content/uploads/2021/09/Parm-Polenta-1-500x375.jpg',
  },
  'greens': {
    name: 'Greens',
    url: 'https://southernbite.com/wp-content/uploads/2011/05/Collard-greens-2.jpg',
  },
  'sweet-potato': {
    name: 'Sweet Potato',
    url: 'https://cdn.media.amplience.net/i/japancentre/recipe-1668-japanese-baked-sweet-potato/Japanese-baked-sweet-potato?$poi$&w=700&h=410&sm=c&fmt=auto',
  },
  'fries': {
    name: 'Fries',
    url: 'https://sausagemaker.com/wp-content/uploads/Homemade-French-Fries_8.jpg',
  },
  'cornbread': {
    name: 'Cornbread',
    url: 'https://www.recipetineats.com/tachyon/2019/11/Corn-bread_1-SQ.jpg?resize=500%2C375',
  },
  'bread': {
    name: 'Bread',
    url: 'https://bakefromscratch.com/wp-content/uploads/2017/06/DinnerRolls420SW-696x557.jpg',
  },
  'baked-beans': {
    name: 'Baked Beans',
    url: 'https://thecozycook.com/wp-content/uploads/2022/04/Baked-Beans-f.jpg',
  },
  'pickles': {
    name: 'Pickles',
    url: 'https://southerneats.b-cdn.net/wp-content/uploads/2020/03/homemade-pickles-800x530.jpg',
  }
};

const exampleApi = express()

  .get('/side/:type', function(request, response) {
    const side = SIDE_DATA[request.params.type];

    if (!side) {
      response.status(404).json({ missing: 'side' });
    }

    response.json(side);
  })

;

export default exampleApi;
