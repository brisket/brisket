import { Bench } from 'tinybench';
import BrisketTesting from '../testing.js';
import View from '../lib/viewing/View.js';

const EmptyView = View.extend();

const ViewWithMarkup = View.extend({
  template: '<div id=\'div-0\'><span></span></div>'
});

const ViewWithALotOfMarkup = View.extend({

  template: function() {
    let markup = '';
    let i = 100;

    while (i > 0) {
      markup += `<div id='div-${i}'><span></span></div>`;

      i--;
    }

    return markup;
  }()

});

BrisketTesting.setup();

const bench = new Bench({ name: 'Rendering views', time: 100 });

bench
  .add('empty View', () => {
    (new EmptyView()).render();
  })

  .add('View with markup', () => {
    (new ViewWithMarkup()).render();
  })

  .add('View with a lot of markup', () => {
    (new ViewWithALotOfMarkup()).render();
  });

await bench.run();

console.log(bench.name);
console.table(bench.table());
