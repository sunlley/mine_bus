<template>
    <div>
        <el-card v-loading="loading">
            <a-title>控制面板 ({{coin}}/{{exCoin}})</a-title>
            <!--<el-tabs v-model="activeName" type="card" @tab-click="handleClick">-->
            <!--<el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>-->
            <!--<el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>-->
            <!--<el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>-->
            <!--<el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>-->
            <!--</el-tabs>-->
            <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="银行名称" v-model="cardInfo.bank"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="银行卡号" type="tel" v-model="cardInfo.card"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="银行户名" type="text" v-model="cardInfo.name"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="承兑商名称" type="text" v-model="cardInfo.merchant"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="通知邮箱" type="text" v-model="notifyMail"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="通知手机" type="number" v-model="notifyPhone"></a-input>
                </el-col>
                <el-col :span="24">
                    <div class="line-x"></div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="兑换上限" type="number" v-model="exchangeLimit"></a-input>
                </el-col>
                <el-col :span="24">
                    <div class="line-x"></div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="收购价格" type="number" v-model="buyPrice"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="最小收购数" type="number" v-model="depositMinAmount"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="最大收购数" type="number" v-model="depositMaxAmount"></a-input>
                </el-col>
                <el-col :span="24">
                    <div class="line-x"></div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="出售价格" type="number" v-model="sellPrice"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="最小出售数" type="number" v-model="withdrawalMinAmount"></a-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="最大出售数" type="number" v-model="withdrawalMaxAmount"></a-input>
                </el-col>
                <el-col :span="24">
                    <div class="line-x"></div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <a-input label="交易密码" type="password" v-model="password"></a-input>
                </el-col>
                <el-col :span="24">
                    <div class="flex-row flex-justify-end flex-item-end padding-top-7">
                        <el-button type="primary" @click="actionConfirm">确定</el-button>
                    </div>
                </el-col>

            </el-row>
        </el-card>

    </div>
</template>

<script>
    import ATitle from "../../widgets/ATitle/index";
    import AInput from "../../widgets/AInput/index";
    import {strIsEmpty, token, token2} from "../../autils/stringutils";

    export default {
        name: "USDTBoard",
        components: {AInput, ATitle},
        data() {
            return {
                loading: false,
                activeName: '',
                exCoin:'USDT',
                coin:'BTC',

                cardInfo:{
                    bank: '',//银行名称
                    card: '',//银行帐号
                    name: '',//银行账户名称
                    merchant: '',//商户名称
                },
                notifyMail: '',//通知邮箱
                notifyPhone: 0,//通知手机号
                exchangeLimit: 0,//每日最大兑换
                buyPrice: 0,//购买价格
                depositMinAmount: 0,//购买最小值
                depositMaxAmount: 0,//购买最大值
                sellPrice: 0,//出售价格
                withdrawalMinAmount: 0,//出售最小值
                withdrawalMaxAmount: 0,//出售最大值
                password:'',
            }
        },
        computed:{
            errRule(){
              return{
                  "cardInfo.bank":'请输入银行名称',
                  "cardInfo.card":'请输入银行卡号',
                  "cardInfo.name":'请输入银行账户',
                  "cardInfo.merchant":'请输入承兑商名称',
                  "notifyMail":'请输入通知邮箱',
                  "notifyPhone":'请输入通知手机号码',
                  "exchangeLimit":'请输入每日兑换上限',
                  "buyPrice":'请输入购买价格',
                  "depositMinAmount":'请输入购买最小数量',
                  "depositMaxAmount":'请输入购买最大数量',
                  "sellPrice":'请输入出售价格',
                  "withdrawalMinAmount":'请输入出售最小数量',
                  "withdrawalMaxAmount":'请输入出售最大数量',
                  "password":'请输入交易密码',

              }
            }
        },
        methods: {
            async actionRequest() {
                let result = await this.$http.otcexConfig();
                result = result['d'];
                if (result){
                    let cardInfo = result['cardInfo'];
                    if (cardInfo && Array.isArray(cardInfo) && cardInfo.length>0){
                        cardInfo = cardInfo[0];
                        this.cardInfo = cardInfo;
                    }
                    delete result['cardInfo'];
                    for (let key in result){
                        this[key] = result[key];
                    }
                }

            },
            async actionConfirm() {
                for (let key in this.errRule){
                    let value =this.errRule[key];
                    console.info(value)
                    if (key.indexOf('.')>=0){
                        let obj = key.split('.');
                        let key1 = obj[0];
                        let key2 = obj[1];
                        if (strIsEmpty(this[key1][key2])){
                            this.$failed(value);
                            return;
                        }
                    } else {
                        if (typeof value =='number'){
                            if (this[key]<=0){
                                this.$failed(value);
                                return
                            }
                        } else {
                            if (strIsEmpty(this[key])){
                                this.$failed(value);
                                return
                            }
                        }
                    }

                }

                let result = await this.$http.otcexSetting({
                    notifyMail:this.notifyMail,
                    notifyPhone:this.notifyPhone,
                    exchangeLimit:this.exchangeLimit,
                    buyPrice:this.buyPrice,
                    depositMinAmount:this.depositMinAmount,
                    depositMaxAmount:this.depositMaxAmount,
                    sellPrice:this.sellPrice,
                    withdrawalMinAmount:this.withdrawalMinAmount,
                    withdrawalMaxAmount:this.withdrawalMaxAmount,
                    cardInfo:[this.cardInfo],
                    password: token(this.password),
                    coin:this.coin,
                    exCoin:this.exCoin
                });
                this.password='';
                if (result['c']===0){
                    this.$success('设置成功');
                    return;
                }
                this.$failed('设置失败');
            }
        },
        mounted() {
            this.actionRequest();
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/base";

    .line-x {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        height: 1px;
        background-color: #eee;
    }

</style>
