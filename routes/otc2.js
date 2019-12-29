const Convert = require('./convert.js');
const AngoOTC = new Ango(CONFIG['hosts']['otc']);

class OTC extends Convert{

    constructor() {
        super('/api/otc');
    }

    async config(params){
        let result = await AngoOTC.post("/OTC/config",{userId:params['uid']});
        // let result = await AngoOTC.post("/OTC/config",{userId:10000});
        return result;
    }

    async settings(params){
        //($userId,
        // $buyPrice, 收购价格
        // $sellPrice, 出售价格
        // $coin, $exCoin,
        // $depositMinAmount, 收购最小金额
        // $depositMaxAmount,
        // $withdrawalMinAmount, 出售最小金额
        // $withdrawalMaxAmount,
        // $exchangeLimit, 每天最大兑换金额
        // $notifyPhone, 通知手机号
        // $notifyMail, 通知邮件
        // $cardInfo) 银行信息

        await this.verifyPass(params);
        params['userId']=params['uid'];
        // params['userId']=10000;
        params['merchantId']=params['1'];
        let result = await AngoOTC.post('/OTC/settings',params);
        return result;
    }

    //充值订单列表
    async recharges(params){
        params['userId']=params['uid'];
        let result = await AngoOTC.post('/OTC/deposit',params);
        return result;
    }
    async rechargeDetail(params){
        let orderId = params['orderId'];
        let result = await MINE_FIRST('tbl_otc_recharge',{orderId});
        if (!result){
            return {};
        }
        let kyc = await MINE_FIRST('kycs',{uid:result['uid']});
        result = Object.assign(result,kyc);
        return result;
    }

    //充值订单确认付款
    async rechargePayed(params){
        let user = await this.verifyPass(params);
        params['type']='in';
        params['status']='success';
        let result = await AngoOTC.post('/OTC/status',params);
        return result;
    }
    async rechargeCancel(params){
        let user = await this.verifyPass(params);
        params['type']='in';
        params['status']='failed';
        let result = await AngoOTC.post('/OTC/status',params);
        return result;
    }


    async withdrawals(params){
        params['userId']=params['uid'];
        let result = await AngoOTC.post('/OTC/withdrawal',params);
        return result;
    }
    async withdrawalDetail(params){
        let orderId  = params['orderId'];
        let result = await MINE_FIRST('tbl_otc_withdrawal',{orderId});
        return result;
    }
    async withdrawalPayed(params){
        let user = await this.verifyPass(params);
        params['type']='out';
        params['status']='success';
        let result = await AngoOTC.post('/OTC/status',params);
        return result;
    }
    async withdrawalCancel(params){
        let user = await this.verifyPass(params);
        params['type']='out';
        params['status']='failed';
        let result = await AngoOTC.post('/OTC/status',params);
        return result;
    }



}

module.exports = new OTC();
