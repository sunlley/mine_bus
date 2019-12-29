const request = require('request');

class AngoConfig {

    constructor() {
        this.resultParse = (body) => {
            let result = {
                'errno': 0,
                'msg': '',
                'data': {}
            };
            if (body) {
                result = {
                    'msg': body['msg'],
                    'data': body['data']
                };
                if (body.hasOwnProperty('status')) {
                    result['errno'] = parseInt(body['status']);
                } else {
                    result['errno'] = parseInt(body['errno']);
                }
            }
            if (Object.isNull(result['errno'])) {
                result['errno'] = 0;
            }
            return result;
        }
    }
}

class Ango {

    constructor(option = {}) {
        this.host = option['host'];
        option = JSON.stringify(option);
        console.log('Ango Option', option);
        option = JSON.parse(option);
        delete option['host'];
        this.language = 'zh';
        for (let key in option) {
            this[key] = option[key];
        }
        this.headers = Object.assign(
            {'Content-Type': 'application/json', language: this.language,},
            option)
    }

    _matchOptions(url, params = {}, headers = {}) {
        let headersT = Object.assign(this.headers, headers);
        params['appId']=headersT['appId'];
        let obj = {
            headers: headersT,
            url: this.host + url,
            form: params,
            json: true,
            timeout: 10000
        };
        return obj;
    }

    post(url, params = {}) {
        let config = this._matchOptions(url, params);
        config['method'] = 'POST';
        return new Promise(resolve => {
            console.debug(' \n' + `========= Ango Post Request ========`.blue);
            console.debug(`>> PATH   : ${url}`);
            console.debug(`>> PARAMS : ${JSON.stringify(params)}`);
            console.debug(`************************************`);
            request.post(config, (err, httpResponse, body) => {
                console.log(' \n' + `========= Ango Post Result ========`.green);
                console.log(`>> PATH   : ${url}`);
                console.log(`>> PARAMS : ${JSON.stringify(params)}`);
                console.log(`>> HEADER : ${JSON.stringify(config['headers'])}`);
                if (err){
                    console.log(`>> ERROR  : `.red, err);
                } else {
                    // console.log(`>> Body   : `, body);
                }
                console.log(`************************************`);
                if (err) {
                    resolve(null);
                }
                let result = Ango.default.resultParse(body);
                resolve(result);
            })
        });
    }

    get(url, params = {}) {
        let config = this._matchOptions(url, params);
        config['method'] = 'GET';
        return new Promise(resolve => {
            console.debug(' \n' + `========= Ango Get Request ========`.blue);
            console.debug(`>> PATH   : ${url}`);
            console.debug(`>> PARAMS : ${JSON.stringify(params)}`);
            console.debug(`************************************`);
            request.get(config, (err, httpResponse, body) => {
                console.log(' \n' + `========= Ango Post Result ========`.green);
                console.log(`>> PATH   : ${url}`);
                console.log(`>> PARAMS : ${JSON.stringify(params)}`);
                console.log(`>> HEADER : ${JSON.stringify(config['headers'])}`);
                if (err){
                    console.log(`>> ERROR  : `.red, err);
                } else {
                    // console.log(`>> Body   : `, body);
                }
                console.log(`************************************`);
                let result = Ango.default.resultParse(body);
                resolve(result);
            })
        });
    }
}

Ango.default = new AngoConfig();

module.exports = Ango;
