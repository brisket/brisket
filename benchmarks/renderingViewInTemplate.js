import { Bench } from 'tinybench';
import BrisketTesting from '../testing.js';
import View from '../lib/viewing/View.js';

BrisketTesting.setup();

const ChildView = View.extend();

const ParentView = View.extend({

  template(data) {
    return `<div class='other-el'></div>${data.views['child']}`;
  },

  beforeRender() {
    this.createChildView('child', ChildView);
  }

});

const ParentView2 = View.extend({

  template: '<div class=\'other-el\'></div><div id=\'child\'></div>',

  beforeRender() {
    this.createChildView('child', ChildView)
      .andReplace('#child');
  }

});

const ParentView3 = View.extend({

  template: '<div class=\'other-el\'></div>',

  beforeRender() {
    this.createChildView('child', ChildView)
      .andAppendIt();
  }

});

let parentView;

const bench = new Bench({ name: 'Rendering child views in template', time: 100 });

bench
  .add('child views in template', () => {
    parentView = new ParentView();
    parentView.render().el.outerHTML;
  })

  .add('child views by replacing a node via parent view', () => {
    parentView = new ParentView2();
    parentView.render().el.outerHTML;
  })

  .add('child views by appending them via parent view', () => {
    parentView = new ParentView3();
    parentView.render().el.outerHTML;
  });

await bench.run();

console.log(bench.name);
console.table(bench.table());
