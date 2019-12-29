import Axios from 'axios';
import {ArrayTrimNull} from "../autils/arrayutils";

switch (process.env.NODE_ENV) {
  case 'development':
    Axios.defaults.baseURL = '/api';
    break
  case 'production':
    Axios.defaults.baseURL = '/';
    break
}
Axios.defaults.headers['Content-Type'] = 'application/json';
Axios.defaults.timeout = 15000;

let result = function(origin){
  let result = {c:0,m:'',d:{}};
  if (origin){
    if (typeof origin == 'string'){
      result['d']=origin;
    } else {
      if (origin['errno']){
        result['c']=parseInt(origin['errno'])
      }
      if (origin['msg']){
        result['m']=origin['msg']
      }
      if (origin['data']){
        result['d']=origin['data']
      }
    }

  }
  return result;
};

let request2 = function (path, params, isPost) {
  if (params === undefined) {
    params = {}
  }
  let headers = {
    'Content-Type':'application/json',
    'source': 'h5',
  };
  return new Promise(resolve => {
    if (isPost) {

      return Axios.post(path, params, {
        headers: headers
      }).then(
          res => {
            resolve(result(res.data));
          },
          err => {
            resolve({c:-1,m:'net errno'});
          });
    } else {
      return Axios.get(path, {
        params: params,
        headers: headers
      }).then(
          res => {
            resolve(result(res.data));
          },
          err => {
            resolve({c:-1,m:'net errno'});
          });
    }
  });
};
let post2 = function (path, params) {
  return request2(path, params, true);
};

//请求标识列队
let linkedQueue = {};
function isRequesting(path, params) {
  if (linkedQueue.hasOwnProperty(path)) {
    let pathObject = linkedQueue[path];
    let pathParams = pathObject['params'];
    let doingNum = pathObject.isDoing;
    // noinspection EqualityComparisonWithCoercionJS
    if (pathParams == undefined
      && params == undefined
      && doingNum == 1) {
      return true;
    }
    // noinspection EqualityComparisonWithCoercionJS
    if (pathParams == undefined
      || params == undefined) {
      linkedQueue[path] = {params: params, isDoing: 1};
      return false;
    }
    let isDoing = true;
    doingNum = 1;
    for (let key in params) {
      if (pathParams.hasOwnProperty(key)
        && params[key] === pathParams[key]) {
      } else {
        isDoing = false;
        doingNum = 0;
        break
      }
    }
    linkedQueue[path] = {params: params, isDoing: doingNum};
    return isDoing;

  } else {
    linkedQueue[path] = {params: params, isDoing: 1};
    return false;
  }
}
function removeRequesting(path) {
  linkedQueue[path] = {params: null, isDoing: 0};
}

let success = function (path, params, res) {
  //移除请求标识
  removeRequesting(path);
  return Promise.resolve(res.data)
};
let netError = function (path, params, error) {
  //移除请求标识
  removeRequesting(path);
  //网络错误
  if (process.env.LOGGER) {
    console.debug(
      " ------------------------------------------------------\n|",
      "网络错误：\n|",
      "--------------------\n|",
      "path => " + path + "\n|",
      "attr => ", params, "\n|",
      "resp => ", error, "\n",
      "------------------------------------------------------\n");
  }
  return Promise.reject('Net Error ' + error)
};

let request = function (path, params, isPost) {
  if (isRequesting(path, params)) {
    return Promise.reject("");
  }
  // noinspection EqualityComparisonWithCoercionJS
  if (params == undefined) {
    params = {};
  }
  let headers = {};
  let user = localStorage.getItem('user');
  if (user){
    user =JSON.parse(user);
    headers['sid']=user['sid'];
    headers['uid']=user['uid'];
    headers['abc']=user['abc'];
  }
  if (isPost) {
    return Axios.post(`${path}`, params, {
      method: 'post',
      headers: headers
    }).then(
      response => {
        return success(path, params, response);
      },
      error => {
        return netError(path, params, error);
      }
    );
  } else {
    return Axios.get(`${path}`, {
      params: params,
      headers:headers
    }).then(
      response => {
        return success(path, params, response);
      },
      error => {
        return netError(path, params, error);
      }
    );
  }
};
let post = function (path, params) {
  return request(path, params, true);
};
let get = function (path, params) {
  return request(path, params, false);
};

export default {
  post: (path, params) => post(path, params),
  get: (path, params) => get(path, params),

  otcexRechargeList:(params)=>post(`/api/otc/recharges`,params),
  otcexRechargeDetail:(params)=>post(`/api/otc/rechargeDetail`,params),
  otcexRechargePaid:(params)=>post(`/api/otc/rechargePayed`,params),
  otcexRechargeCancel:(params)=>post(`/api/otc/rechargeCancel`,params),
  otcexWithdrawalList:(params)=>post(`/api/otc/withdrawals`,params),
  otcexWithdrawalPaid:(params)=>post(`/api/otc/withdrawalPayed`,params),
  otcexWithdrawalDetail:(params)=>post(`/api/otc/withdrawalDetail`,params),
  otcexWithdrawalCancel:(params)=>post(`/api/otc/withdrawalCancel`,params),

  otcexSetting:(params)=>post2(`/api/otc/settings`,params),
  otcexConfig:(params)=>post2(`/api/otc/config`,params),

  login:(params)=>post2(`/api/user/login`,params),
  vcode:(params)=>post2(`/api/user/vcode`,params),
}



