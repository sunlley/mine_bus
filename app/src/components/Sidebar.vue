<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu"
                 :default-active="onRoutes"
                 :collapse="collapse"
                 background-color="#324157"
                 text-color="#bfcbd9"
                 active-text-color="#20a0ff"
                 unique-opened router>
            <template v-for="item in slides">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collapse: true,
                items: [
                    // {
                    //     icon: 'el-icon-lx-home',
                    //     index: 'home',
                    //     title: '首页'
                    // },
                    // {
                    //     icon: 'el-icon-lx-calendar',
                    //     index: 'cardmanager',
                    //     title: '银行卡管理'
                    // },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'withdrawals',
                        title: '提现管理'
                    }
                    ,{
                        icon: 'el-icon-lx-calendar',
                        index: 'recharges',
                        title: '充值管理'
                    }
                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            },
            slides(){
                return this.$store.state.slides;
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            this.$bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            this.$bus.$emit('collapse',false)
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
