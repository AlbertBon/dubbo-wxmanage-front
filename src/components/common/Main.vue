<template>
    <div id="main">
        <el-tabs v-model="tabsJson" type="card" closable @tab-remove="removeTab">
            <el-tab-pane v-for="(item,index) in tabsJson" :key="item.name" :label="item.title" :name="item.name">
                <router-view :name="item.name"></router-view>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default{

        data () {
            return {
                
            }
        },
        computed:{
            
        }
    }
</script>