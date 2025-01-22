import { Bench } from 'tinybench';
import BrisketTesting from '../testing.js';
import View from '../lib/viewing/View.js';

const ParentView = View.extend();
const ChildView = View.extend();

BrisketTesting.setup();

let parentView;
let childViewInstance;

function reset() {
  parentView = new ParentView();
  childViewInstance = new ChildView();
}

const bench = new Bench({ name: 'Creating a child view', time: 100 });

bench
  .add('creating child View with View constructor', () => {
    reset();
    parentView.createChildView(ParentView);
  })

  .add('creating child View with View constructor and options', () => {
    reset();
    parentView.createChildView(ParentView)
      .withOptions({
        some: 'data'
      });
  })

  .add('creating child View with instance of a View', () => {
    reset();
    parentView.createChildView(childViewInstance);
  })

  .add('creating child View with an identifier', () => {
    reset();
    parentView.createChildView('identifier', childViewInstance);
  });

await bench.run();

console.log(bench.name);
console.table(bench.table());
