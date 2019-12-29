<template>
    <div>
        <el-card>
            <a-title>USDT出售管理
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
                            <el-option label="等待收款确认" value="pending"></el-option>
                            <el-option label="已确认收款" value="success"></el-option>
                            <el-option label="收款失败" value="failed"></el-option>
                        </el-select>
                    </a-label>
                </el-col>
            </el-row>
        </el-card>
        <div class="space-y-10"></div>
        <el-card>
            <a-title>
                USDT出售列表
            </a-title>
            <el-table
                    :v-loading="loading"
                    :data="items"
                    style="width: 100%">
                <el-table-column
                        label="下单时间">
                    <div slot-scope="scope">
                        {{actionFormatData(scope.row.createdAt)}}
                    </div>
                </el-table-column>
                <el-table-column
                        prop="orderId"
                        label="订单编号">
                </el-table-column>
                <el-table-column
                        prop="amount"
                        label="汇款金额">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <div slot-scope="scope">
                        <span>{{actionFormatStatus(scope.row.notifyStatus)}}</span>
                    </div>
                </el-table-column>

                <el-table-column label="操作"
                                 width="280">
                    <template slot-scope="scope">
                        <el-button
                                :disabled="scope.row.notifyStatus != 'pending'"
                                size="mini"
                                type="primary"
                                @click="actionPassed(scope.row)">确认收款
                        </el-button>
                        <el-button
                                :disabled="scope.row.notifyStatus != 'pending'"
                                size="mini"
                                type="danger"
                                @click="actionCancel(scope.row)">强制取消
                        </el-button>
                        <el-button
                                size="mini"
                                type="success"
                                @click="actionDetail(scope.row)">详情
                        </el-button>
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

        <!--订单详情-->
        <el-dialog
                width="600px"
                title="订单详情"
                :close-on-click-modal="false"
                :visible.sync="showDetailDialog">

           <div class="padding-left-35">
               <a-label label="订单编号">{{detail.orderId}}</a-label>
               <a-label label="充值数量">{{detail.amount}}</a-label>
               <a-label label="用户姓名">{{detail.name}}</a-label>

               <a-label label="收款人">{{detail.bs_name}}</a-label>
               <a-label label="收款银行">{{detail.bs_bank}}</a-label>
               <a-label label="收款卡号">{{detail.bs_card}}</a-label>
               <a-label label="创建时间">{{actionFormatData((new Date(detail.create_time)).getTime())}}</a-label>
           </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="showDetailDialog=false">确认</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    import {formatDate, token, strIsNotEmpty} from "../../autils/stringutils";
    import ATitle from "../../widgets/ATitle/index";
    import ALabel from "../../widgets/ALabel/index";
    import AInput from "../../widgets/AInput/index";

    export default {
        name: "USDTBuy",
        components: {AInput, ALabel, ATitle},
        data() {
            return {
                loading: false,
                type: '',
                page: 1,
                total: 0,
                size: 30,
                items: [],
                pass: {
                    password: ''
                },
                showPassDialog: false,
                showDetailDialog: false,
                form: {},
                orderId: '',
                searchDate: '',
                status: '',
                detail:{},
            }
        },
        watch: {
            searchDate() {
                // console.info(this.searchDate[0].getTime())
            }
        },
        methods: {
            actionFormatData(ts) {
                return formatDate(ts)
            },
            actionFormatStatus(status) {
                if (status === 'pending') {
                    return '等待收款确认'
                }
                if (status === 'success') {
                    return '已确认收款'
                }
                return '收款失败'
            },
            actionOnPageChanged(page) {
                this.page = page;
                this.actionRequestList();
            },
            actionClear() {
                this.orderId = '';
                this.searchDate = '';
                this.status = '';
                this.actionSearch();
            },
            actionSearch() {
                this.page = 1;
                this.actionRequestList();
            },
            async actionRequestList() {
                this.loading = true;
                let search = {};
                if (strIsNotEmpty(this.orderId)) {
                    search['orderId'] = this.orderId;
                }
                if (strIsNotEmpty(this.status)) {
                    search['status'] = this.status;
                }
                if (strIsNotEmpty(this.searchDate) && this.searchDate.length === 2) {
                    try {
                        search['start_time'] = this.searchDate[0].getTime();
                        search['end_time'] = this.searchDate[1].getTime();
                    } catch (e) {
                    }
                }
                let result = await this.$http.otcexRechargeList({
                    page: this.page,
                    size: this.size,
                    search: search
                });
                this.loading = false;
                this.total = result.data.total;
                this.items = result.data.items;
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
                this.$refs['password'].validate(async (valid) => {
                    if (valid) {
                        if (_this.type === 0) {
                            let result = await _this.$http.otcexRechargePaid({
                                id: _this.form['id'],
                                password: token(_this.pass['password'])
                            });
                            _this.showPassDialog = false;
                            if (result.errno === 100) {
                                _this.$failed('密码错误');
                                return
                            }
                            _this.page = 1;
                            _this.actionRequestList();
                        } else {
                            let result = await _this.$http.otcexRechargeCancel({
                                id: _this.form['id'],
                                password: token(_this.pass['password'])
                            });
                            _this.showPassDialog = false;
                            if (result.errno === 100) {
                                _this.$failed('密码错误');
                                return
                            }
                            _this.page = 1;
                            _this.actionRequestList();
                        }
                    }
                });
            },
            //详情
            async actionDetail(row){
                this.detail = {};
                this.showDetailDialog = true;
                let detail = await this.$http.otcexRechargeDetail({orderId:row['orderId']});
                // this.detail= Object.assign(row,detail['data']);
                this.detail= detail['data'];
                console.info(this.detail)
            }
        },
        mounted() {
            this.actionRequestList();
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/base";

</style>
