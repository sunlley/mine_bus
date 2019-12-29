<template>
    <div>

        <el-card>
            <a-title>我的银行卡
                <div slot="right" class="flex-row flex-justify-end flex-item-center">
                    <el-button type="primary" icon="el-icon-plus" @click="actionAddCard">添加银行卡</el-button>
                </div>
            </a-title>

            <c-bank-card></c-bank-card>
            <el-table
                    v-loading="loading"
                    :data="items"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID">
                </el-table-column>
                <el-table-column
                        prop="bank"
                        label="Bank">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="Card">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="Name">
                </el-table-column>
                <el-table-column
                        prop="country"
                        label="国家码">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="actionShowUnbind(scope.row)">解绑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="actionShowToggle(scope.row)">
                            {{scope.row.is_used==1?'使用':'关闭'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <!--添加-->
        <el-dialog
                width="600px"
                title="添加银行卡"
                :close-on-click-modal="false"
                :visible.sync="showAddDialog">

            <el-dialog
                    width="400px"
                    title="确认信息"
                    :visible.sync="showInfoDialog"
                    append-to-body>

                <a-label label="取款人">{{addCardForm.name}}</a-label>
                <a-label label="银行名称">{{addCardForm.bank}}</a-label>
                <a-label label="银行卡号">{{addCardForm.num}}</a-label>
                <input type="text" style="display: none;">
                <input type="password" style="display: none;">

                <el-form
                        :model="pass"
                        ref="tradepass"
                        label-position="left"
                        label-width="100px">
                    <el-form-item label="交易密码"
                                  prop="tradepass"
                                  :rules="[{ required: true, message: '交易密码不能为空'}]">
                        <el-input v-model="pass.tradepass" type="password"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="showInfoDialog=false">上一步</el-button>
                    <el-button type="primary" @click="actionSaveCard">确认</el-button>
                </span>
            </el-dialog>

            <div>
                <el-form
                        ref="addCardForm"
                        label-position="left"
                        label-width="100px"
                        :model="addCardForm">
                    <el-form-item label="取款人"
                                  prop="name"
                                  :rules="[{ required: true, message: '取款人不能为空'}]">
                        <el-input v-model="addCardForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="银行名称"
                                  prop="bank"
                                  :rules="[{ required: true, message: '银行名称不能为空'}]">
                        <el-input v-model="addCardForm.bank"></el-input>
                    </el-form-item>
                    <el-form-item label="银行卡号"
                                  prop="num"
                                  :rules="[{ required: true, message: '银行卡号不能为空'}]">
                        <el-input v-model="addCardForm.num"></el-input>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="actionAddNext">下一步</el-button>
            </span>

        </el-dialog>

        <!--解绑-->
        <el-dialog
                width="600px"
                title="解绑银行卡"
                :close-on-click-modal="false"
                :visible.sync="showUnbindDialog">

            <el-form
                    :model="pass"
                    ref="tradepass"
                    label-position="left"
                    label-width="100px">
                <el-form-item label="交易密码"
                              prop="tradepass"
                              :rules="[{ required: true, message: '交易密码不能为空'}]">
                    <el-input v-model="pass.tradepass" type="password"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="actionUnbind">确认</el-button>
            </span>

        </el-dialog>

        <!--开关银行卡-->
        <el-dialog
                width="600px"
                title="开关银行卡"
                :close-on-click-modal="false"
                :visible.sync="showToggleDialog">

            <el-form
                    :model="pass"
                    ref="tradepass"
                    label-position="left"
                    label-width="100px">
                <el-form-item label="交易密码"
                              prop="tradepass"
                              :rules="[{ required: true, message: '交易密码不能为空'}]">
                    <el-input v-model="pass.tradepass" type="password"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="actionToggle">确认</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    import {token2} from "../autils/stringutils";
    import ATitle from "../widgets/ATitle/index";
    import CBankCard from "../widgets/CBankCard/index";
    import AInput from "../widgets/AInput/index";
    import ALabel from "../widgets/ALabel/index";

    export default {
        name: "CardManager",
        components: {ALabel, AInput, CBankCard, ATitle},
        data() {
            return {
                loading: false,
                items: [
                    {
                        id: '1',
                        bank: '小心心',
                        num: '32452345',
                        name: '风格化',
                        country: '86',
                        is_used: '1',
                    }
                ],
                addCardForm: {
                    name: '',
                    num: '',
                    bank: ''
                },
                pass: {
                    tradepass: '',
                },
                showUnbindDialog: false,
                showToggleDialog: false,
                showAddDialog: false,
                showInfoDialog: false,
                codeText: "验证码",
                timer: null,
                unbindForm: {},
                toggleForm: {},

            }
        },
        comments: {
            cardRules() {
                return {
                    name: '请输入持卡人姓名',
                    num: '请输入银行卡号',
                    bank: '请输入银行名称',
                    tradepass: '请输入资金密码',
                }
            },
        },
        methods: {
            //获取手机验证码
            actionGetCode() {
                if (this.timer != null) {
                    return;
                }
                let _this = this;
                this.timer = this.$timer(function (time) {
                    if (time == 0) {
                        _this.codeText = '验证码';
                        _this.timer = null;
                    } else {
                        _this.codeText = `${time}s`;
                    }
                }, 1000, 60);

            },
            //解除绑定银行卡
            actionShowUnbind(row) {
                this.unbindForm = JSON.parse(JSON.stringify(row));
                this.showUnbindDialog = true;
                this.pass['tradepass'] = '';
            },
            actionUnbind() {
                let _this = this;
                this.$refs['tradepass'].validate((valid) => {
                    if (valid) {
                        this.$http.unbindCard({id: this.unbindForm['id']}).then(
                            rep => {
                                _this.actionRequestCards();
                                _this.showUnbindDialog = false;
                            },
                            err => {
                            }
                        );
                    }
                });

            },
            //开关银行卡
            actionShowToggle(row){
                this.toggleForm = JSON.parse(JSON.stringify(row));
                this.showToggleDialog = true;
                this.pass['tradepass'] = '';
            },
            actionToggle() {
                let _this = this;
                this.$refs['tradepass'].validate((valid) => {
                    if (valid) {
                        this.$http.toggleCard({id: this.toggleForm['id']}).then(
                            rep => {
                                _this.actionRequestCards();
                                _this.showToggleDialog = false;
                            },
                            err => {
                            }
                        );
                    }
                });
            },
            //添加银行卡
            actionAddCard() {
                this.showAddDialog = true;
                this.addCardForm['name'] = '';
                this.addCardForm['num'] = '';
                this.addCardForm['bank'] = '';
                this.pass['tradepass'] = '';
            },
            actionAddNext() {
                let _this = this;
                this.$refs['addCardForm'].validate((valid) => {
                    if (valid) {
                        //请求接口
                        _this.showInfoDialog = true
                    } else {
                        return false;
                    }
                });

            },
            //保存银行卡信息
            actionSaveCard() {
                let _this = this;
                this.$refs['tradepass'].validate((valid) => {
                    if (valid) {
                        //请求接口
                        _this.addCardForm['tradepass'] = token2(_this.pass.tradepass);
                        _this.$http.saveCard().then(
                            rep => {
                                //添加成功
                                _this.actionRequestCards();
                                _this.showInfoDialog = false;
                                _this.showAddDialog = false;
                            },
                            err => {
                                //添加失败
                            }
                        );
                    } else {
                        return false;
                    }
                });
            },
            //请求银行卡列表
            actionRequestCards() {
                this.loading = true;
                this.$http.getCards().then(
                    rep => {
                        this.loading = false;
                    },
                    err => {
                        this.loading = false;
                    }
                );
            }

        }
    }
</script>

<style scoped lang="less">
    @import "../assets/base";

    .card-manager {
    }

    .card-manager-dialog-button {
        .padding-y(0px);
        .margin-0;
        height: 32px;
        line-height: 30px;
    }

    .card-manager-dialog-timer:extend(.card-manager-dialog-button) {
        width: 80px;
    }

</style>
