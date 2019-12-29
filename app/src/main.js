import './autils/storage'
import {Timer} from './autils/timer'
import Bus from './autils/eventbus'
import store from './astore'
import Http from './anets'
import EChart from 'echarts'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import 'element-ui/lib/theme-chalk/display.css';

// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './autils/directives';
import "babel-polyfill";
let app;
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(EChart);
Vue.prototype.$bus=Bus;
Vue.prototype.$http=Http;
Vue.prototype.$deposit=Depository;
Vue.prototype.$timer = function (callback, time, limit, delay) {
    return new Timer(callback, time, limit, delay);
};
Vue.prototype.$error=function(msg){
    this.$message({
        type: 'error',
        message: msg
    });
}
Vue.prototype.$tips=function(msg){
    this.$message({
        type:'success',
        message: msg
    });
}
Vue.prototype.$success=function(msg,title){
    if (title == null || title == ''){
        title = '成功'
    }
    app.$notify({
        type:'success',
        message: msg,
        title:title
    });
};
Vue.prototype.$failed=function(msg,title){
    if (title == null || title == ''){
        title = '成功'
    }
    app.$notify({
        type:'error',
        message: msg,
        title:title
    });
};

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('user');

    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});


app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
