<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="查询条件" >
      </el-input>
      <el-button class="filter-item" type="primary"  icon="el-icon-search" >搜索</el-button>
    </div>

    <el-table :data="pageInfo.list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="姓名">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="登录名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="手机">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="地址">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :pageSizes="pageSizes"
      :pageSize="pageInfo.pageSize"
      :pageCount="pageInfo.total"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"></pagination>

    <!--<div class="pagination-container">-->
      <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
      <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
  export default {
    components:{
      Pagination
    },
    data() {
      return {
        listLoading: true,
        listParams: {
          pageSize: 2,
          pageNum: 1
        },
        pageSizes: [2, 5, 10, 20],
        pageInfo:{
          list:[]
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        let _this = this;
        this.listLoading = true;
        this.postRequest('/user/list', this.listParams).then(res => {
          _this.listLoading = false;
          if(res.data.code=='00'){
            this.pageInfo = res.data.data;
          }
        })
      },
      handleSizeChange(size) {
        this.pageParams.pageSize = size;
        this.getList(this.pageParams);
      },
      handleCurrentChange(currentPage) {
        this.pageParams.pageNum=currentPage;
        this.getList(this.pageParams);
      }
    }
  }

</script>
