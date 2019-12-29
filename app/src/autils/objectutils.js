export const isString = function(a) {
  return typeof a === 'string';
}

export const isFunction=function(a) {
  return typeof a === 'function';
}

export const isArray=function(a) {
  return Array.isArray(a);
}
export const isObject=function(a) {
  return typeof a === 'object';
}
