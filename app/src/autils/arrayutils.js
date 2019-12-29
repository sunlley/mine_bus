import {isArray, isFunction} from "./objectutils";
// import {isObject} from "muse-ui/es5/utils";

export const ArrayTrimNull = function (origin) {
  let _temp = {};
  if (ArrayNotEmpty(origin)) {
    for (let key in origin) {
      let item = origin[key];
      if (item != undefined) {
        _temp[key] = item;
      }
    }
  }
  return _temp;
};

/**
 * @return {boolean}
 */
export const ArrayNotEmpty = function (origin) {
  return !ArrayIsEmpty(origin);
};

/**
 * @return {boolean}
 */
export const ArrayIsEmpty = function (value) {
  return value === null
    || value === undefined
    || value.length === 0;
};

/**
 * 保留相同元素
 * @param origin
 * @param target
 * @param filter
 * @constructor
 */
export const KeepSame = function(origin,target,filter){
  // if (!isObject(origin) || !isObject(target) || !isFunction(filter)){
  //   return {};
  // }
  let tempList = origin.slice(0);
  for (let i = 0; i < tempList.length; i++) {
    let originElement = tempList[i];
    let hasItem = false;
    for (let j = 0; j < target.length; j++) {
      let targetElement = target[j];
      if (filter(originElement,targetElement)){
        hasItem = true;
        break;
      }
    }
    if (!hasItem){
      //如果没有 就剔除
      origin.splice(i, 1);
    }
  }
};

/**
 * 剔除相同元素
 * @param origin
 * @param target
 * @param filter
 * @constructor
 */
export const DropSame =  function(origin,target,filter){
  if (!isObject(origin) || !isObject(target) || !isFunction(filter)){
    return {};
  }
  let tempList = origin.slice(0);
  for (let i = 0; i < tempList.length; i++) {
    let originElement = tempList[i];
    let hasItem = false;
    for (let j = 0; j < target.length; j++) {
      let targetElement = target[j];
      if (filter(originElement,targetElement)){
        hasItem = true;
        break;
      }
    }
    if (hasItem){
      //如果有 就剔除
      origin.splice(i, 1);
    }
  }
};

/**
 * 保留
 * @param origin
 * @param filter
 * @constructor
 */
export const KeepItem = function (origin, filter) {

  let tempList = origin.slice(0);
  for (let i = 0; i < tempList.length; i++) {
    let originElement = tempList[i];
    let hasItem = filter(originElement);
    if (!hasItem){
      //如果有 就剔除
      origin.splice(i, 1);
    }
  }
};

/**
 * 剔除条目
 * @param origin
 * @param filter
 * @constructor
 */
export const DropItem = function (origin, filter) {

  let tempList = origin.slice(0);
  for (let i = 0; i < tempList.length; i++) {
    let originElement = tempList[i];
    let hasItem = filter(originElement);
    if (hasItem){
      //如果有 就剔除
      origin.splice(i, 1);
    }
  }
};

/**
 * 是否包含条目
 * @param origin
 * @param obj
 * @param filter
 * @returns {boolean}
 * @constructor
 */
export const ContainItem = function (origin, obj, filter) {
  if (!isObject(origin) || !isObject(target) || !isFunction(filter)){
    return false;
  }
  let has = false;
  for (let item in origin){
    if (filter(item,obj)){
      has = true;
      break;
    }
  }
  return has;
}

