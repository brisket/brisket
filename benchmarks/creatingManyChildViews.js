import { Bench } from 'tinybench';
import BrisketTesting from '../testing.js';
import View from '../lib/viewing/View.js';

const ParentView = View.extend();
const ChildView = View.extend();

BrisketTesting.setup();

const parentView = new ParentView();

const bench = new Bench({ name: 'Creating many child views', time: 100 });

bench
  .add('with simple View', () => {
    let i = 100;

    while (i > 0) {
      parentView.createChildView(ChildView);

      i--;
    }
  });

await bench.run();

console.log(bench.name);
console.table(bench.table());