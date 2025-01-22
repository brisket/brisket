import { Bench } from 'tinybench';
import isApplicationLink from '../lib/controlling/isApplicationLink.js';

const bench = new Bench({ name: 'Checking if a link is application link', time: 100 });

bench
  .add('hash link', () => {
    isApplicationLink('#top');
  })

  .add('fully qualified link', () => {
    isApplicationLink('http://www.somewhere.com');
  })

  .add('absolute link', () => {
    isApplicationLink('/absolute/path');
  })

  .add('mailto link', function() {
    isApplicationLink('mailto:someone@example.com');
  })

  .add('javascript code link', () => {
    isApplicationLink('javascript:{}');
  })

  .add('application link', () => {
    isApplicationLink('application/link');
  });

await bench.run();

console.log(bench.name);
console.table(bench.table());