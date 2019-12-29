import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import Login from '../page/Login'
import Content from '../components/Home'
import USDTBuy from '../managers/usdt/USDTBuy'
import USDTSell from '../managers/usdt/USDTSell'
import USDTBoard from "../managers/usdt/USDTBoard";

const CurrentRouter = [
    {
        path: '/',
        redirect: '/login',
        meta: {title: '登陆'}
    },
    {
        path: '/ubuy',
        component: USDTBuy,
        meta: {title: '购买管理'}
    },
    {
        path: '/usell',
        component: USDTSell,
        meta: {title: '卖出管理'}
    },
    {
        path: '/uboard',
        component: USDTBoard,
        meta: {title: '控制面板'}
    },

];
let RouterList = [];
RouterList = RouterList.concat(CurrentRouter);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            // component: resolve => require(['../components/Home.vue'], resolve),
            component: Content,
            meta: {title: '自述文件'},
            children: RouterList
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
