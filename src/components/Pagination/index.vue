<template>
  <div class="pagination-container">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageCount">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name:'pagination',
    data(){
      return {
        currentPage:1,
      }
    },
    props:{
      pageCount:Number,  //表格数据总数
      pageSizes:Array,    //决定每页显示的条数[10,15,20,25]
      description:String, //分页脚底左侧的数据说明
      pageSize:Number,     //页面大小
    },
    watch:{
      pageSize:"changeSize"
    },
    methods:{
      changeSize:function(){
        this._data.curPageSize = this.pageSize;
      },
      handleSizeChange:function(size){
        this.$emit("handleSizeChange",size);
      },
      handleCurrentChange:function(currentPage){
        this.$emit("handleCurrentChange",currentPage);
      }
    },
    computed:{
    }
  }

</script>

<style>

</style>
