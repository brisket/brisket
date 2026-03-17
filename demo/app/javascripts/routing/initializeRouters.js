import { App } from '../../../../lib/brisket.js';
import ApplicationRouter from './ApplicationRouter.js';
import HomeRouter from '../home/HomeRouter.js';
import SidesRouter from '../sides/SidesRouter.js';

App.useRouters({

  // this Router includes a catch all i.e. 404 page
  CatchAllRouter: ApplicationRouter,

  // list all other routers here
  routers: [
    HomeRouter,
    SidesRouter
  ]

});
