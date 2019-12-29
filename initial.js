global.CONFIG = require(__dirname + '/conf/config.json');
global.EXCEPTIONS = require(__dirname + '/conf/exceptions.js');
require('colors');
const promise_mysql = require('promise-mysql');
const Ango = require('./libs/ango');
global.Ango = Ango;

if (!Object.hasOwnProperty('isNull')) {
    Object['isNull']=function (obj) {
        return obj===undefined || obj==null || obj==='' || obj==='null';
    }
}
if (!Array.hasOwnProperty('isEmpty')){
    Array.prototype.isEmpty = function(){
        return this.length<=0;
    };
    Array['isEmpty']=function (obj) {
        return !Array.isArray(obj) || obj.length<=0;
    }
}
if (!String.hasOwnProperty('toArray')){
    String.prototype.toArray=function (target) {
        if (Object.isNull(target)){
            return [this];
        }
        return this.split(target);
    };
    String['toArray']=function (str,target) {
        if (!Object.isNull(str)){
            return str.toArray(target);
        }
        return str;
    }
}
if (!String.hasOwnProperty('toMap')){
    String.prototype.toMap=function (target1,target2) {
        let result = {};
        if (!Object.isNull(this)){
            let arr = this.toArray(target1);
            if (!arr.isEmpty()){
                for (let item of arr){
                    if (item.indexOf(target2)){
                        let keyvalue = item.toArray(target2);
                        if (keyvalue.length>1){
                            result[keyvalue[0].trim()] = keyvalue[1];
                        }
                    }
                }
            }
        }
        return result;
    };
    String['toMap']=function (str, target1, target2) {
        return str.toMap(target1,target2);
    }
}
if (!String['isEmpty']) {
    String['isEmpty'] = function (value) {
        if (value === undefined
            || value == null
            || value === ''
        ) {
            return true;
        }
        return false;
    };
    String['isNotEmpty'] = function (value) {
        return !String.isEmpty(value);
    };
}
if (!String['random']) {
    String['random'] = function (length) {
            let e = '';
            for (let n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', o = 0;
                 o < length; o++) {
                e += n.charAt(Math.floor(Math.random() * n.length));
            }
            return e;
    };
}
if (!String.hasOwnProperty('contains')) {
    String['contains'] = function (str, target) {
        if (String.isEmpty(str) || String.isEmpty(target)) {
            return false;
        }
        return str.indexOf(target) >= 0;
    }
    String.prototype.contains = function (target) {
        if (String.isEmpty(target)) {
            return false;
        }
        return this.indexOf(target) >= 0;
    }
}
if (!String['formatDate']) {
    String['formatDate'] =function (timestamp, format) {
        let temp = String(timestamp);
        if (String.isEmpty(temp) ) {
            return "";
        }
        if (String.isEmpty(format)){
            format = 'YY-MM-DD hh:mm:ss'
        }

        if (temp.length !== 13) {
            temp = temp.padEnd(13, "0");
        }
        let date = new Date(parseInt(temp));
        if (String.contains(format, 'YY')) {
            let Y = date.getFullYear();
            format = format.replace(/YY/, Y);
        }

        if (String.contains(format, 'MM')) {
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            format = format.replace(/MM/, M);
        }

        if (String.contains(format, 'DD')) {
            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            format = format.replace(/DD/, D);
        }


        if (String.contains(format, 'hh')) {
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
            format = format.replace(/hh/, h);
        }

        if (String.contains(format, 'mm')) {
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
            format = format.replace(/mm/, m);
        }

        if (String.contains(format, 'ss')) {
            let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            format = format.replace(/ss/, s);
        }
        return format;
    };
}


class NetException extends Error{

    constructor(code,message='') {
        let exception = EXCEPTIONS[code];
        console.log('NetException:'.red,code,exception);
        if (exception){
            if (String.isEmpty(message)){
                message = exception['msg'];
            }
        } else {
            code = 500;
        }
        super(message);
        this.code = code;
        this.message = message;
    }
}
global.NetException = NetException;

function createMysql(name, config) {
    let dbname = name.toLocaleUpperCase();
    let mysql = require('mysql');
    console.log(`Create Mysql Client: ${dbname} , ${dbname}ASYNC`);

    function mysqlHandleError(err) {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                global[dbname+'_DB'] = mysql.createConnection(config);
                global[dbname+'_DB'].connect(mysqlHandleError);
                global[dbname+'_DB'].on('error', mysqlHandleError);
            } else {
                console.error(err.stack || err);
            }
        }
    }

    global[dbname + '_TRANS'] = async function(sqls) {
        /**线程池 */
        const pool = await promise_mysql.createPool(config);
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            for (let sql of sqls) {
                console.info(dbname + '_TRANS  => ',sql)
                await conn.query(sql.sql,sql.params);
            }
            await conn.commit();
            return true;
        } catch (err) {
            console.log(err);
            await conn.rollback();
            return false;
        } finally {
            conn.release();
        }
    };

    global[dbname+'_DB'] = mysql.createConnection(config);
    global[dbname+'_DB'].connect(mysqlHandleError);
    global[dbname+'_DB'].on('error', mysqlHandleError);

    global[dbname] = function (sql,params) {
        console.log(sql);
        return new Promise((resolve, reject) => {
            if (params){
                global[dbname+'_DB'].query(sql, params,(err, reply) => {
                    if (err){
                        return resolve(null);
                    }
                    return resolve(JSON.parse(JSON.stringify(reply)));
                });
            } else {
                global[dbname+'_DB'].query(sql, (err, reply) => {
                    if (err){
                        return resolve(null);
                    }
                    return resolve(JSON.parse(JSON.stringify(reply)));
                });
            }
        });
    };
    global[dbname + '_FIRST'] = function (table, where,colume) {
        return new Promise(resolve => {
            let columes='*';
            if (!Object.isNull(colume) && !Array.isEmpty(colume)){
                columes = colume.join(',');
            }
            let wheres = '';
            if (!Object.isNull(where)){
                for (let key in where){
                    if (!Object.isNull(wheres)){
                        wheres+=' AND ';
                    }
                    let value = where[key];
                    if (typeof value == 'string'){
                        wheres+=`${key}='${value}'`
                    } else {
                        wheres+=`${key}=${value}`
                    }
                }
                wheres = ` WHERE ${wheres}`;
            }
            let sql = `SELECT ${columes} FROM ${table} ${wheres}`;
            console.log(`FIRST => ${sql}`)
            global[dbname+'_DB'].query(sql, (err, reply) => {
                if (err){
                    return resolve(null);
                }
                if (!Array.isEmpty(reply)){
                    reply = reply[0];
                    return resolve(JSON.parse(JSON.stringify(reply)));
                }
                resolve(null);
            });
        })
    };

    global[dbname + '_SEARCH'] = function (table, where,colume) {
        return new Promise((resolve,reject)=>{
            let columes='*';
            if (!Object.isNull(colume) && !Array.isEmpty(colume)){
                columes = colume.join(',');
            }
            let wheres = '';
            if (!Object.isNull(where)){
                for (let key in where){
                    if (!Object.isNull(wheres)){
                        wheres+=' AND ';
                    }
                    let value = where[key];
                    if (typeof value == 'string'){
                        wheres+=`${key}='${value}'`
                    } else {
                        wheres+=`${key}=${value}`
                    }
                }
                wheres = ` WHERE ${wheres}`;
            }
            let sql = `SELECT ${columes} FROM ${table} ${wheres}`;

            global[dbname+'_DB'].query(sql, (err, reply) => {
                if (err){
                    return resolve(null);
                }
                if (!Array.isEmpty(reply)){
                    return resolve(JSON.parse(JSON.stringify(reply)));
                }
                resolve(null);
            });
        });
    };
    global[dbname + '_INSERT'] = function (table, data) {
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO ${table} `;
            let keys = '';
            let values = '';
            for (let key in data){
                //设置key
                if (!Object.isNull(keys)){
                    keys+=',';
                }
                keys += key;
                //设置value
                let value = data[key];
                if (!Object.isNull(values)){
                    values +=",";
                }
                if (typeof value == 'string'){
                    values+= `'${value}'`;
                } else {
                    values+=`${value}`;
                }
            }
            sql += `(${keys}) VALUES(${values})`;
            global[dbname+'_DB'].query(sql, (err, reply) => {
                console.log(sql);
                if (err){
                    return resolve(null);
                }
                return resolve(JSON.parse(JSON.stringify(reply)));
            });
        });
    };
    global[dbname + '_UPDATE'] = function (table, data,where) {
        return new Promise((resolve, reject)=>{
            let sql = `UPDATE ${table} SET `;
            let sets = '';
            let wheres = '';
            for (let key in data){
                if (!Object.isNull(sets)){
                    sets+=',';
                }
                let value = data[key];
                if (typeof value == 'string'){
                    sets+=`${key}='${value}'`
                } else {
                    sets+=`${key}=${value}`
                }
            }
            for (let key in where){
                if (!Object.isNull(wheres)){
                    wheres+=' AND ';
                }
                let value = where[key];
                if (typeof value == 'string'){
                    wheres+=` ${key}='${value}' `
                } else {
                    wheres+=` ${key}=${value} `
                }
            }
            sql+=`${sets} WHERE ${wheres}`;
            global[dbname+'_DB'].query(sql, (err, reply) => {
                if (err){
                    return resolve(null);
                }
                return resolve(JSON.parse(JSON.stringify(reply)));
            });
        });
    };
    global[dbname + '_COUNT'] = function (table, where) {
        return new Promise((resolve, reject)=>{
            let sql = `SELECT count(*) as total from ${table} ${Object.isNull(where)?'':'where '+where}`;
            console.log(sql);
            global[dbname+'_DB'].query(sql, (err, reply) => {
                if (err){
                    return resolve(0);
                }
                let total = JSON.parse(JSON.stringify(reply));
                if (total){
                    total=total[0]['total']
                } else {
                    total=0;
                }
                return resolve(total);
            });
        });
    };

}

function createRedis(name,config) {
    const bluebird = require('bluebird');
    const redis = require("redis");
    function retryStrategy(options){
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
    global[`REDIS_${name.toLocaleUpperCase()}`] = redis.createClient(config);
    config['retry_strategy']=retryStrategy;
    console.log(`Create Redis Client: ${name.toLocaleUpperCase()}`);
    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);
}

//初始化mysql
let mysqls = CONFIG['mysql'];
if (mysqls) {
    for (let key in mysqls) {
        let value = mysqls[key];
        if (value) {
            createMysql(key, value);
        }
    }
}

//初始化redis
let redises = CONFIG['redis'];
if (redises) {
    for (let key in redises){
        let value = redises[key];
        if (value){
            createRedis(key,value);
        }
    }
}
