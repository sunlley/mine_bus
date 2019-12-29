require('./initial');
let ejs = require('ejs');
let como = require("como");
let express = require('express');
let session = require('express-session');
let compression = require('compression');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let route = require('./routes');
let app = express();

app.use(compression({filter: shouldCompress}));

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // 这里就过滤掉了请求头包含'x-no-compression'
        return false
    }
    return compression.filter(req, res)
}


app.set('env', CONFIG['server']['debug'] ? 'development' : 'production');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('bitkeepCookie'));
app.use(session({
    secret: 'bitkeepCookie',
    cookie: {maxAge: 1000 * 60 * 60}, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
app.use(function (req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    next();
});

app.set('views', __dirname + '/view');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

let router = express.Router();
router.use(express.static(__dirname + '/public'));
router.use(async function (req, res, next) {
    let ts = new Date().getTime();
    console.log('\nRouteIndex %s %s %s', req.method, req.url, JSON.stringify(req.body));
    res.callback = function (errno, msg, data) {
        if (arguments.length === 1 && (typeof errno ==='object')) {
            if (errno && errno.hasOwnProperty('errno')) {
                this.json(errno)
            }else {
                this.json({'errno': 0, 'msg': '', 'data': errno});
            }
        } else {
            if (data == null) {
                this.json({'errno': errno || 0, 'msg': msg || '', 'data': {}});
            } else {
                this.json({'errno': errno || 0, 'msg': msg || '', 'data': data});
            }
        }
        console.log('***** Monitor ******* \n%s: 【%sms】\n*********************', req.url, new Date().getTime() - ts);
    };
    await initHeader(req, next);
});

//初始化请求
async function initHeader(req, callback) {
    let cookies = req.headers['cookie'] || req.headers['Cookie'];
    let data = {};
    if (cookies){
        data = cookies.toMap(';','=');
    }
    let sid = req.headers['sid'];
    let uid = req.headers['uid'];

    if (Object.isNull(uid)){
        uid = data['uid'];
    }
    if (Object.isNull(sid)){
        sid = data['sid'];
    }
    req.DEVICE = data;
    if (sid && uid) {
        let token = await REDIS_STORE.hgetAsync(`MINER:TOKEN:CACHE`,uid);
        console.log('InitHeader Token',token);
        if (token) {
            token = JSON.parse(token);
            if (sid === token.sid && token.expired > new Date().getTime()) {
                req.uid = uid;
                req.sid = sid;
                req.utoken = token.token;
            }
        }
    }
    if (callback) callback();
}

//router拦截
route(router);
router.use(function (req, res) {
    res.status(404).send('404');
});
app.use(router);

process.setMaxListeners(0);

app.listen(CONFIG['server']['port'], function () {
    console.log('Server listening for http on ' + CONFIG['server']['port']);
});
