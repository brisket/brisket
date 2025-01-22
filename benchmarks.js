import fs from 'fs';
import path from 'path';

const BENCHMARKS_DIR_PATH = path.join(import.meta.dirname, 'benchmarks');

fs.readdirSync(BENCHMARKS_DIR_PATH).forEach(async file => {
  await import(`./benchmarks/${file}`);
});
