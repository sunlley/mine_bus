/*
 * Route
 */
const app = require('./web');
const Rules = [
    require('./user2'),
    require('./otc2'),
];

class Route {

    constructor(app) {
        this.app = app;
        this.rules = this.rules.bind(this);
        this._matchRules = this._matchRules.bind(this);
    }

    rules() {
        this.app.all(/^((?!\/api).)+$/, app.index);

        this._matchRules();
    }

    _matchRules() {
        for (let item of Rules) {
            if (String.isNotEmpty(item.prefix)) {
                let prefix = item.prefix;
                if (!item.prefix.endsWith('/')) {
                    prefix += '/';
                }
                console.log('Route Init Rule',item.prefix);
                this.app.post(item.prefix + '*', item.route);
                if (CONFIG['debug']) {
                    this.app.get(item.prefix + '*', item.route);
                }
            }
        }
    }

}

module.exports = function (app) {
    new Route(app).rules();
};
