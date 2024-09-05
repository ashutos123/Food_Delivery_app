module.exports = (fn) => (arg1, arg2, callback) =>
    Promise.resolve(fn(arg1, arg2, callback)).catch(callback);
  