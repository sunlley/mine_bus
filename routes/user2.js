const Convert = require('./convert.js');
const AngoCode = new Ango(CONFIG['hosts']['vcode']);
const uuidv4 = require('uuid/v4');
const md5 = require('md5-node');

class User extends Convert{

    constructor() {
        super('/api/user', ['vcode','login']);
    }

    async vcode(params,req){
        let result = await AngoCode.post('/captcha/code');
        req['session']['vcode']= result['data']['code'];
        return {base:result['data']['base']}
    }

    async login(params,req,res){
        let username = params['username'];
        let password = params['password'];
        let vcode = params['vcode'];
        if (!username || !password){
            this.error(10002);
        }
        if (vcode !== req['session']['vcode']){
            this.error(10005);
        }
        let user = await this.getUser(params);
        //获取权限配置
        let groups = CONFIG['groups'];
        let limits = [];
        let home ='';
        for (let key in groups){
            let group = groups[key];
            let users = group['users'];
            if (users.includes(username)){
                limits = group['limits'];
                home = group['home'];
                break;
            }
        }
        //生成TOKEN
        let token = md5(uuidv4());
        let now = new Date();
        let expired = now.setDate(now.getDate() + 3);
        let saveToken = {
            token: token,
            sid: token,
            expired: expired
        };
        await REDIS_STORE.hsetAsync('MINER:TOKEN:CACHE', user['uid'], JSON.stringify(saveToken));
        delete user['password'];
        user['sid']=token;
        user['home']=home;
        user['limits']=limits;
        res.cookie('uid',user['uid']);
        res.cookie('sid',token);
        return user;
    }

    async logout(params,req,res){
        await this.verifyUser(params);
        await REDIS_STORE.hdelAsync('IG:WEB:USER:LOGIN:TOKEN', params['uid']);
        res.cookie('uid','');
        res.cookie('sid','');
        res.cookie('token','');
    }


}

module.exports = new User();
