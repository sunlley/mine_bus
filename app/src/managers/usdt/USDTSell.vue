<template>
    <div>
        <el-card>
            <a-title>USDT购买管理
                <div slot="right">
                    <el-button type="info" icon="el-icon-refresh" @click="actionClear">清除</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="actionSearch">搜索</el-button>
                </div>
            </a-title>
            <el-row :gutter="24">
                <el-col :span="8">
                    <a-label
                            class="padding-left-14"
                            label="开始日期">
                        <el-date-picker start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        v-model="searchDate"
                                        :editable="false"
                                        :default-time="['00:00:00', '23:59:59']"
                                        style="flex: 1"
                                        type="daterange"></el-date-picker>
                    </a-label>
                </el-col>
                <el-col :span="8">
                    <a-input class="padding-left-14" label="订单编号" v-model="orderId"
                             @onEnterClick="actionSearch"></a-input>
                </el-col>
                <el-col :span="8">
                    <a-label class="padding-left-14 flex-1"
                             label="状态">
                        <el-select v-model="status" placeholder="请选择状态" class="flex-1">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="等待付款确认" value="pending"></el-option>
                            <el-option label="已确认付款" value="success"></el-option>
                            <el-option label="付款失败" value="failed"></el-option>
                        </el-select>
                    </a-label>
                </el-col>
            </el-row>
        </el-card>
        <div class="space-y-10"></div>
        <el-card>
            <a-title>
                USDT购买列表
            </a-title>
            <el-table
                    :data="items"
                    style="width: 100%">
                <el-table-column
                        fixed
                        label="下单时间">
                    <div slot-scope="scope">
                        {{actionFormatData(scope.row.createdAt)}}
                    </div>
                </el-table-column>
                <el-table-column
                        width="150"
                        prop="orderId"
                        label="订单编号">
                </el-table-column>
                <el-table-column
                        label="汇款金额">
                    <template slot-scope="scope">
                        {{actionFormatPrice(scope.row.amount)}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="收款人">
                    <template slot-scope="scope">
                        {{scope.row.bankInfo.name}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="银行卡号">
                    <template slot-scope="scope">
                        {{scope.row.bankInfo.card}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态">
                    <div slot-scope="scope">
                        <span>{{actionFormatStatus(scope.row.notifyStatus)}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="操作"
                                 width="300">
                    <template slot-scope="scope">
                        <el-button
                                :disabled="scope.row.notifyStatus != 'pending'"
                                size="mini"
                                type="primary"
                                @click="actionPassed(scope.row)">确认付款
                        </el-button>
                        <el-button
                                :disabled="scope.row.notifyStatus != 'pending'"
                                size="mini"
                                type="danger"
                                @click="actionCancel(scope.row)">强制取消
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column type="expand"
                                 label="更多"
                                 width="100">
                    <template slot-scope="props">
                        <a-label label="订单编号">{{props.row.orderId}}</a-label>
                        <a-label label="用户提现数量">{{props.row.exAmount}}</a-label>
                        <a-label label="银行名称">{{props.row.bankInfo.bank}}</a-label>
                        <a-label label="收款人">{{props.row.bankInfo.name}}</a-label>
                        <a-label label="银行卡号">{{props.row.bankInfo.card}}</a-label>
                        <a-label label="创建时间">{{actionFormatData(props.row.createdAt)}}</a-label>
                        <a-label label="更新时间">{{actionFormatData(props.row.updatedAt)}}</a-label>
                    </template>
                </el-table-column>

            </el-table>
            <div class="flex-row flex-justify-center padding-y-28">
                <el-pagination
                        :current-page.sync="page"
                        :page-size="size"
                        @current-change="actionOnPageChanged"
                        background
                        layout="prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>

        <!--解绑-->
        <el-dialog
                width="600px"
                title="密码确认"
                :close-on-click-modal="false"
                :visible.sync="showPassDialog">

            <el-form
                    :model="pass"
                    ref="password"
                    label-position="left"
                    label-width="100px">
                <el-form-item label="交易密码"
                              prop="password"
                              :rules="[{ required: true, message: '交易密码不能为空'}]">
                    <el-input v-model="pass.password" type="password"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="actionConfirm">确认</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    import {formatDate, token, strIsNotEmpty, toTrimNum} from "../../autils/stringutils";
    import ATitle from "../../widgets/ATitle/index";
    import ALabel from "../../widgets/ALabel/index";
    import AInput from "../../widgets/AInput/index";

    export default {
        name: "USDTSell",
        components: {AInput, ALabel, ATitle},
        data() {
            return {
                loading: false,
                type: '',
                page:1,
                total:0,
                size:30,
                items: [],
                pass: {
                    password: ''
                },
                showPassDialog: false,
                form: {},
                orderId: '',
                searchDate: '',
                status: '',
            }
        },
        methods: {
            actionFormatPrice(price){
                return toTrimNum(price)
            },
            actionFormatData(ts) {
                return formatDate(ts)
            },
            actionFormatStatus(status) {
                if (status === 'pending') {
                    return '平台审核通过,等待付款确认'
                }
                if (status === 'success') {
                    return '已确认付款'
                }
                return '强制取消收款'
            },
            actionOnPageChanged(page) {
                this.page = page;
                this.actionRequestList();
            },
            actionClear(){
                this.orderId = '';
                this.searchDate = '';
                this.status = '';
                this.actionSearch();
            },
            actionSearch() {
                this.page = 1;
                this.actionRequestList();
            },
            actionRequestList() {
                let search = {};
                if (strIsNotEmpty(this.orderId)){
                    search['orderId']=this.orderId;
                }
                if (strIsNotEmpty(this.status)){
                    search['status']=this.status;
                }
                if (strIsNotEmpty(this.searchDate) && this.searchDate.length===2){
                    try {
                        search['start_time'] = this.searchDate[0].getTime();
                        search['end_time'] = this.searchDate[1].getTime();
                    } catch (e) {
                    }
                }
                this.$http.otcexWithdrawalList({
                    page:this.page,
                    size:this.size,
                    search:search
                }).then(
                    rep => {
                        this.total = rep.data.total;
                        this.items = rep.data.items;
                    }
                );
            },
            actionPassed(row) {
                this.form = JSON.parse(JSON.stringify(row));
                this.type = 0;
                this.pass['password'] = '';
                this.showPassDialog = true;
            },
            actionCancel(row) {
                this.form = JSON.parse(JSON.stringify(row));
                this.type = 1;
                this.pass['password'] = '';
                this.showPassDialog = true;
            },
            actionConfirm() {
                let _this = this;
                this.$refs['password'].validate((valid) => {
                    if (valid) {
                        if (_this.type === 0) {
                            _this.$http.otcexWithdrawalPaid({
                                id: _this.form['id'],
                                password: token(_this.pass['password'])
                            }).then(
                                rep => {
                                    _this.showPassDialog = false;
                                    if (rep.errno == 100){
                                      _this.$failed('密码错误');
                                        return
                                    }
                                    _this.page = 1;
                                    _this.actionRequestList();

                                },
                                err => {
                                }
                            );
                        } else {
                            _this.$http.otcexWithdrawalCancel({
                                id: _this.form['id'],
                                password: token(_this.pass['password'])
                            }).then(
                                rep => {
                                    _this.showPassDialog = false;
                                    if (rep.errno == 100){
                                        _this.$failed('密码错误');
                                        return
                                    }
                                    _this.page = 1;
                                    _this.actionRequestList();
                                },
                                err => {
                                }
                            );
                        }
                    }
                });
            }
        },
        mounted() {
            this.page = 1;
            this.actionRequestList();
            this.$http.vcode().then();
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/base";

</style>
