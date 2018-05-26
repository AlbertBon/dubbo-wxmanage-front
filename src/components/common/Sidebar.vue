<template>
    <div class="sidebar">
        <el-menu 
        :default-active="onRoutes" 
        class="el-menu-vertical-demo" 
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b" 
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            {{item.title}}
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" @click="addTab(subItem)">
                            {{subItem.title}}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.index" @click="addTab(item)">
                        <i :class="item.icon"></i>
                        {{item.title}}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import store from '@/vuex/store'
import {mapState,mapMutations} from 'vuex'
export default {
    data() {
        return {
            items: [
                {
                    icon: 'icon iconfont icon-msnui-home-block',
                    index: '1',
                    path:'main',
                    title: '主页'
                },
                {
                    icon: 'icon iconfont icon-liebiao',
                    index:'2',
                    title: '公众号列表',
                    subs: [
                        {
                            index: '2_1',
                            path: 'wechatList',
                            title: '基础表格'
                        },
                        {
                            index:"2_2",
                            path: 'wechatList_page',
                            title: '分页表格'
                        },
                    ]
                }
            ]
        }
    },
    computed: {
        onRoutes() {
            console.log(this.$route);
            return this.$route.path.replace('/', '');
        },
        ...mapState(["tabsJson", "tabsValue", "tabIndex"]),
    },
    methods:{
        ...mapMutations(['addTab'])
    }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
}

.sidebar>ul {
    height: 100%;
}
.sidebar i {
    line-height: 1;
    display: inline-block;
    font-weight: 400;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
}

</style>
