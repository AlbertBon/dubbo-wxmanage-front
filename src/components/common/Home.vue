<template>
    <div id="Home">
        <v-header></v-header>
        <v-sidebar></v-sidebar>
        <div class="content">
            <!--<router-view name="wechatList"></router-view>-->

            <el-tabs v-model="tabsValue" type="card" closable @tab-remove="removeTab">
                <el-tab-pane v-for="(item,index) in tabsJson" :key="item.name" :label="item.title" :name="item.name">
                    <router-view :name="item.content"></router-view>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import vHeader from './Header.vue'
import vSidebar from './Sidebar.vue'
import store from '@/vuex/store'
import { mapState, mapMutations } from 'vuex'
// import vMain from './Main.vue'
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapState(["tabsJson", "tabsValue", "tabIndex"]),

        tabsValue: {
            // getter
            get: function() {
                return this.$store.state.tabsValue;
            },
            // setter
            set: function(newValue) {
                this.$store.state.tabsValue = newValue;
            }
        }
    },
    components: {
        vHeader, vSidebar
    },
    methods: {
        ...mapMutations(['removeTab']),

    },
    created() {
        console.log('加载home')
    },
    store
}
</script>

<style>

</style>

