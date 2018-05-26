<template>
    <div class="welcome">
        <table-page 
        :rowClick="rowClick" 
        :sortChange="sortChange" 
        :tableData="pageInfo.list" 
        :pageSizes="pageParams.pageSizes" 
        :columns="columns" 
        :pageSize="pageInfo.pageSize" 
        :pageCount="pageInfo.total" 
        @pageSizeChange="pageSizeChange" 
        @currentPageChange="currentPageChange" 
        @selectionChange="selectionChange"></table-page>
    </div>
</template>

<script>
import page from '../common/Page'
import axios from 'axios'
export default {
    data() {
        return {
            columns: [
                {
                    label: "id",
                    value: "id",
                    sortable:true,
                    className: "id",
                    width:"100"
                },
                {
                    label: "名称",
                    value: "appName",
                    className: "appName",
                },
                {
                    label: "秘钥",
                    value: "appSecret",
                    className: "appSecret",
                },
                {
                    label: "创建日期",
                    value: "createTime",
                    formatter:function(row, column, cellValue){
                        return row.createDate;
                    },
                    className: "createTime",
                },
                {
                    label: "当前公众号",
                    fixed: 'right',
                    value: "isCurrent",
                    formatter:function(row, column, cellValue){
                        return cellValue==0 ? '当前' : '非当前';
                    },
                    className: "isCurrent",
                }
            ],
            pageParams: {
                pageSize: 2,
                pageNum: 1,
                pageSizes:[2,5,10,20]
            },
            pageInfo:{
                 list:[]
            }
        }
    },
    components: {
        'tablePage': page,
    },
    computed: {

    },
    created() {
        this.getList(this.pageParams);
    },
    methods: {
        getList(pageParams) {
            this.$axios.post('http://localhost:8081/wxmanage/wechat/wechatList', this.pageParams)
                .then(response => {
                    if(response.data.response_code!=200){
                        this.$message({
                            showClose:true,
                            dangerouslyUseHTMLString: true,
                            center:true,
                            message:'<strong>'+response.data.message+'</strong>',
                            type:'error'
                        })
                        return false;
                    }
                    this.pageInfo = response.data.content;
                })
        },
        selectWechat() {

        },
        sortChange() {

        },
        rowClick() {

        },
        pageSizeChange(size) {
            this.pageParams.pageSize = size;
            this.getList(this.pageParams);
        },
        currentPageChange(currentPage) {
            this.pageParams.pageNum=currentPage;
            this.getList(this.pageParams);
        },
        selectionChange(selections) {
            console.log(selections)
        }
    }
}
</script>