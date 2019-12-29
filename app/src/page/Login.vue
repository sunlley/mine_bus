<template>
    <div class="login-wrap">
        <img class="login-logo-large hidden-sm-and-down" src="https://cdn.bitkeep.com/web/v10018/img/about/logo4.png"/>
        <div class="ms-login">
            <div class="ms-title">商户管理系统</div>
            <el-form :model="ruleForm" status-icon
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="padding-right-14 padding-y-28">
                <el-form-item prop="username">
                    <span slot="label" class="login-label">用户名</span>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off" auto-complete="off"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <span slot="label" class="login-label">密码</span>
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" auto-complete="off"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="vcode">
                    <span slot="label" class="login-label">验证码</span>
                    <div class="flex-row">
                        <el-input v-model="ruleForm.vcode" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        <img class="login-vcode" :src="vcodeUrl" @click="actionRequestVCode"/>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="flex-row ">
                        <el-button class="login-btn" @click="resetForm('ruleForm')">重置</el-button>
                        <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {token} from "../autils/stringutils";

    var validateName = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入用户名'));
        } else {
            callback();
        }
    };
    var validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        } else {
            callback();
        }
    };
    var validateCode = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入图形验证码'));
        } else {
            callback();
        }
    };
    export default {
        data: function () {
            return {
                vcodeUrl: '',
                ruleForm: {
                    username: '',
                    password: '',
                    vcode: '',
                },
                rules: {
                    username: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    vcode: [
                        {validator: validateCode, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetForm() {
                this.ruleForm.username = '';
                this.ruleForm.password = '';
                this.ruleForm.vcode = '';
            },
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let result = await this.$http.login({
                            username: this.ruleForm.username,
                            password: token(this.ruleForm.password),
                            vcode: this.ruleForm.vcode
                        });
                        console.info(result)
                        if (result['c'] === 0) {
                            //登陆成功
                            this.$store.commit('UPDATE_SLIDES', result['d'].limits);
                            localStorage.setItem('user', JSON.stringify(result['d']));
                            this.$router.replace(result['d']['home']);
                            return;
                        }

                        this.$error('登陆失败');
                        this.actionRequestVCode();
                    } else {
                        console.log('error submit!!');
                        this.actionRequestVCode();
                        return false;
                    }
                });
            },
            async actionRequestVCode() {
                let result = await this.$http.vcode();
                this.vcodeUrl = result['d']['base'];
            }
        },
        created() {
            localStorage.removeItem('user');
            this.actionRequestVCode();
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/base";

    .login-wrap {
        .flex-row;
        .flex-item-center;
        position: relative;
        width: 100%;
        height: 100%;
        /*background-image: url('https://cdn.htibs.com/u_b_340d3c10-758a-11e9-880c-ef63bbaad6ed.jpeg');*/
        background-image: url('http://attach.bbs.miui.com/forum/201407/09/193946t606tognd6mnqsg0.jpg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        /*background-position: center;*/
    }

    .login-logo-large {
        width: 30%;
        margin-right: 10%;
    }

    .login-label {
        color: white;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        padding-left: 30px;
        padding-right: 30px;
        width: 400px;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.4);
    }

    .login-vcode {
        margin-left: 10px;
        height: 32px;
        width: 80px;
        border-radius: 4px;
        border-style: solid;
        border-width: 0;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        .flex-1;
        text-align: center;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
