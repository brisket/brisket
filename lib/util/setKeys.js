import _ from 'underscore';

function setKeys(obj, key, value) {
  let pairs = key;

  if (_.isString(pairs)) {
    pairs = {};
    pairs[key] = value;
  }

  Object.assign(obj, pairs);
}

export default setKeys;
