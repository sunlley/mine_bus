// import Config from '../../config/index'

export const strIsEmpty = function (value) {
  if (value == null
    || value == ''
    || value == undefined) {
    return true;
  }
  return false;
};

export const strIsNotEmpty = function (value) {
  return !strIsEmpty(value);
};

export const strToBuffer = function (value) {
  let wordarray = new Uint16Array(value.data);
  for (let i = 0; i < wordarray.length; i++) {
    wordarray[i] = wordarray[i] + 1;
  }
  return wordarray;
};

export const contains = function (origin, target) {
  if (strIsEmpty(origin) || strIsEmpty(target)) {
    return false;
  }
  return new RegExp(target).test(origin);
};

export const toUpperCase = function (value) {
  if (strIsEmpty(value)) {
    return '';
  }
  return String(value).toUpperCase();
};

export const toLowerCase = function (value) {
  return value.toLowerCase();
};

export const toTrimNum = function (num) {
  if (strIsEmpty(num)) {
    return 0;
  }
  return parseFloat(num);
};
export const toFixedNum = function (num, limit) {
  if (strIsEmpty(num)) {
    return 0;
  }
  if (limit >= 0) {
    let temp = parseFloat(num);
    return temp.toFixed(limit);
  }
  return num;
};
export const toFoorNum = function (num, limit) {
  if (strIsEmpty(num)) {
    return 0;
  }
  let temp = String(num);

  if (temp.indexOf(".")) {
    let strings = temp.split(".");
    let end = strings[1];
    if (end && end.length > limit) {
      temp = strings[0] + '.' + end.substr(0, limit);
    }
    return toFixedNum(temp, limit);
  } else {
    return num;
  }
};

export const toPadNum = function (num, limit) {
  num = toFoorNum(num, limit);
  num = String(num);
  let start = num;
  let end = '';
  if (num.indexOf('.')) {
    let strings = num.split(".");
    start = strings[0];
    end = strings[1];
  }
  if (limit > 0 && strIsEmpty(end)) {
    end = "0";
  }
  end = String(end).padEnd(limit, '0');
  end = '.' + end;
  return start + end;
};

export const formatPhone = function (phone) {
  phone = String(phone);
  if (strIsEmpty(phone) || phone.length < 4) {
    return "****";
  }
  let start = phone.substr(0, 3);
  let end = phone.substr(phone.length - 4, 4);
  return start + "****" + end;

};
export const formatAddress = function (address, limit = 12) {
  address = String(address);
  if (strIsEmpty(address)) {
    return "";
  }
  if (address.length <= limit) {
    return address;
  }
  let start = address.substr(0, 4);
  let end = address.substr(address.length - 4, 4);
  return start + "****" + end;

};

//验证是否是资金密码
export const isTradePass = function (value) {
  let regPos = /^\d{6}$/; // 非负整数
  if (regPos.test(String(value))) {
    return true;
  } else {
    return false;
  }
};

/**
 * 格式化时间
 * @param timestamp
 * @returns {string}
 */
export const formatDate = function (timestamp, format) {
  let temp = String(timestamp);
  if (strIsEmpty(temp) ) {
    return "";
  }
  if (strIsEmpty(format)){
    format = 'YY-MM-DD hh:mm:ss'
  }

  if (temp.length !== 13) {
    temp = temp.padEnd(13, "0");
  }
  let date = new Date(parseInt(temp));
  if (contains(format, 'YY')) {
    let Y = date.getFullYear();
    format = format.replace(/YY/, Y);
  }

  if (contains(format, 'MM')) {
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    format = format.replace(/MM/, M);
  }

  if (contains(format, 'DD')) {
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    format = format.replace(/DD/, D);
  }


  if (contains(format, 'hh')) {
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    format = format.replace(/hh/, h);
  }

  if (contains(format, 'mm')) {
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    format = format.replace(/mm/, m);
  }

  if (contains(format, 'ss')) {
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    format = format.replace(/ss/, s);
  }
  return format;
};

export const getUid = function () {
  let user = Depository.getItem("user");
  if (user) {
    user = JSON.parse(user);
    return user['userId']
  }
  return '';
};
export const getSid = function () {
  let user = Depository.getItem("user");
  if (user) {
    user = JSON.parse(user);
    return user['sid']
  }
  return '';
};
/**
 * 小数转位数
 * @param str
 */
export const getIncrementNum = function (str) {
  if (strIsEmpty(str)) {
    return 0;
  }
  if (contains(str, '\\.')) {
    let split = str.split('.');
    return split[1].length;
  }
  return 0;

};
/**
 * 位数转小数
 * @param str
 */
export const getIncrementFloat = function (str) {
  if (str <= 0) {
    return '0';
  }
  let num = '0.'.padEnd(str, '0');
  return `${num}1`;
};

export const token = function (pwd) {
  return sign(pwd + 'S2JT3g4zM1bITkEEP');
};
export const token2 = function (trade) {
  return sign(trade + "(^G2046E1n/$d024Djs)zc_(&");
};
//签名
export const sign = function SHA256(s) {

  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }

  function R(X, n) {
    return (X >>> n);
  }

  function Ch(x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  function Maj(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  function Sigma0256(x) {
    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  }

  function Sigma1256(x) {
    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  }

  function Gamma0256(x) {
    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  }

  function Gamma1256(x) {
    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  }

  function core_sha256(m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  }

  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
//uuid
export const uuid = function () {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};
//id ref
export const idRef = function (t) {
  let e = '';
  for (let n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', o = 0;
       o < t; o++) {
    e += n.charAt(Math.floor(Math.random() * n.length));
  }
  return e;
};

/**
 * S4
 * @return {string}
 */
export const S4 = function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
/**
 * 获取图标链接
 * @param icons
 * @returns {string}
 */
export const iconUrl = function (icons) {
  //https://cdn.htibs.com/trade/v1/markets/okex.png
  //all.png
  //binance.png
  //bitfinex.png
  //coinbase.png
  //huobi.png
  //okex.png
  //upbit.png
  if (icons == null) {
    return 'https://cdn.htibs.com/trade/v2/markets/bitkeep.png';
  }
  if (Array.isArray(icons)) {
    if (icons.length === 1) {
      return 'https://cdn.htibs.com/trade/v2/markets/' + icons[0] + '.png';
    } else if (icons.length > 1) {
      return 'https://cdn.htibs.com/trade/v2/markets/all.png';
    }
  } else {
    return 'https://cdn.htibs.com/trade/v2/markets/' + icons + '.png';
  }
};
/**
 * 二维码链接
 * @param url
 * @returns {string}
 */
export const qrUrl = function (str) {
  // return 'http://dev.bitkeep.com:9532/bkv1/qrcode?str=' + str;
  if (process.env.CHANNEL_PATH) {
    return process.env.CHANNEL_PATH + '/bkv1/qrcode?str=' + str;
  }
  return location.origin + '/bkv1/qrcode?str=' + str;
};

/**
 * 获取网络资源完整路径
 * @param str
 */
export const sourceUrl = function (str) {
  if (strIsEmpty(str)) {
    return '';
  }
  return process.env.IMG_PATH + str;
};

