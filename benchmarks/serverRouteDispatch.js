import { Bench } from 'tinybench';
import Brisket from '../lib/brisket.js';
import BrisketTesting from '../testing.js';
import ServerDispatcher from '../lib/server/ServerDispatcher.js';

BrisketTesting.setup();

const Layout = Brisket.Layout.extend({

  template: '<!DOCTYPE html>\n<html><head><title>sample</title></head><body></body></html>',

  content: 'body'

});

const Router = Brisket.Router.extend({

  layout: Layout,

  routes: {
    'path': 'handler'
  },

  handler() {
    return new Brisket.View();
  }

});

new Router();

const mockRequest = {
  protocol: 'http',
  path: '/requested/path',
  host: 'example.com',
  headers: {
    'host': 'example.com:8080',
    'referer': 'theReferrer.com',
    'user-agent': 'A wonderful computer'
  },
  query: {
    some: 'param',
    another: {
      param: 'value'
    }
  },
  originalUrl: '/requested/path?some=param&another%5Bparam%5D=value'
};

const bench = new Bench({ name: 'Server route dispatch', time: 100 });

bench
  .add('with simple View', async () => {
    await ServerDispatcher.dispatch('path', mockRequest, {});
  });

await bench.run();

console.log(bench.name);
console.table(bench.table());
