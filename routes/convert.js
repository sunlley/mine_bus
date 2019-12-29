class Convert {

    constructor(prefix, whiteList = []) {
        this.whiteList = whiteList;
        this.prefix = prefix;
        this.route = this.route.bind(this);
    }

    //计算sql
    diySqlWhere(origin, key, value, prefix = 'and', operator = '=', opposite = null) {
        let result = '';
        if (value) {
            if (typeof value == 'string') {
                if (operator === 'like') {
                    result = ` ${key}  ${operator} BINARY "%${value}%" `
                } else {
                    result = ` ${key} ${operator} '${value}' `
                }
            } else {
                if (operator === 'like') {
                    result = ` ${key}  ${operator} BINARY "%${value}%" `
                } else {
                    result = ` ${key} ${operator} ${value} `
                }
            }
        } else {
            if (opposite != null) {
                if (typeof opposite == 'string') {
                    result = ` ${key} != '${opposite}' `
                } else {
                    result = ` ${key} != ${opposite} `
                }
            }
        }
        if (result === '') {
            return origin;
        }
        if (origin === undefined || origin == null || origin.trim() === '') {
            origin = 'where';
        }
        if (origin.trim() !== 'where') {
            result = ` ${prefix} ${result}`;
        }
        return `${origin} ${result}`;
    }

    //计算sql
    diySqlSet(origin, key = '', value = undefined,) {
        if (String.isEmpty(key) || value === undefined) {
            return origin
        }
        let temp = ' set ';
        if (String.isNotEmpty(origin)) {
            temp = ', ';
        }
        if (typeof value === 'string') {
            temp += `${key}='${value}'`;
        } else {
            temp += `${key}=${value}`;
        }
        return origin + temp;
    }

    //验证用户
    async verifyUser(params) {
        let uid = parseInt(params['uid']);
        let user = await MINE_FIRST('users', {uid});
        if (!user) {
            return this.error(10003);
        }
        return user;
    }

    //验证登陆密码
    async verifyPass(params) {
        let uid = parseInt(params['uid']);
        let password = params['password'];
        let user = await MINE_FIRST('users', {uid, password});
        if (!user) {
            return this.error(10000);
        }
        return user;
    }

    async getUser(params) {
        let username = params['username'];
        let password = params['password'];
        let user = await MINE_FIRST('users', {username, password});
        if (!user) {
            return this.error(10003);
        }
        return user;
    }

    //验证验证码
    async verifyCode(params) {
        if (CONFIG.debug) {
            // return null;
        }
        // let code = params['code'];
        // let uid = params['uid'];
        // let verify = await AngoCenter.post('/user/check', {uid, code});
        // if (verify['errno'] !== 0) {
        //     return this.error(10005)
        // }
        return null;

    }

    //配置分页page
    page(params) {
        let page = 1;
        let size = 100;
        let offset = page * size;
        if (params) {
            page = params['page'];
            if (isNaN(page)) {
                page = 1;
            }
            page -= 1;
            if (page <= 0) {
                page = 0;
            }
            size = params['size'];
            if (isNaN(size) || size < 10 || size > 100) {
                size = 100;
            }
            offset = page * size;
        }
        let sql = ` limit ${size} offset ${offset} `;
        return {page, size, offset, sql}
    }

    error(code = 500, message = '') {
        throw new NetException(code, message);
    }

    route(req, res) {
        let path = req.path;
        let method = '';
        if (String.isNotEmpty(this.prefix)) {
            if (!this.prefix.endsWith('/')) {
                this.prefix += '/';
            }
            path = path.replace(this.prefix, '');
            path = path.split('/');
            method = path[0];
            for (let i = 0; i < path.length; i++) {
                if (i > 0) {
                    let value = path[i];
                    method += (value.charAt(0).toUpperCase() + value.slice(1))
                }
            }
        } else {
            path = path.split('/');
            method = path[path.length - 1];
        }
        let params = {};
        params = Object.assign(params, req.query);
        params = Object.assign(params, req.body);
        params = Object.assign(params, req.DEVICE);
        console.log("开始调用控制器"+method);
        (async () => {
            try {
                if (!this[method]) {
                    this.error(20001);
                    return;
                }
                let checkLogin = true;
                if (this.whiteList) {
                    for (let item of this.whiteList) {
                        if (item === method) {
                            checkLogin = false;
                            break
                        }
                    }
                }
                if (checkLogin) {
                    await this.verifyUser(params,req,res);
                }
                console.log("调用控制器"+method);
                let result = await this[method](params, req, res);
                return res.callback(result);
            } catch (e) {
                if (e instanceof NetException) {
                    return res.callback(e['code'], e['message']);
                } else {
                    console.log(e)
                    return res.callback(-1, 'server error');
                }
            }
        })();
    }
}

module.exports = Convert;
