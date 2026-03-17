const noop = Function.prototype;

noop.thatWillBeCalledWith = function() {
  return noop;
};

export default noop;

