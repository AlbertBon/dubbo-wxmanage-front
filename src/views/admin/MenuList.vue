<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" v-model="listParams.keyMap.equal_name" class="filter-item" placeholder="菜单名">
      </el-input>
      <el-button class="filter-item" @click="getList" style="margin-left: 10px;" type="primary" icon="el-icon-search">
        搜索
      </el-button>
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
        新增
      </el-button>
    </div>

    <el-table :data="pageInfo.list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.menuId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="菜单名称">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="菜单标题">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="链接地址">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="菜单图标">
        <template slot-scope="scope">
          <span>{{scope.row.icon}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="130px" align="center" label="视图地址">
        <template slot-scope="scope">
          <span>{{scope.row.component}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreateChild(scope.row.menuId)">子菜单</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.menuId)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDel(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :pageSizes="pageSizes"
      :pageSize="listParams.pageSize"
      :pageCount="pageInfo.total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"></pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="menuForm" :rules="rules" :model="menuParams" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item v-show="false" prop="menuId">
          <el-input v-model="menuParams.menuId"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="menuParams.name"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="path">
          <el-input v-model="menuParams.path"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="component">
          <el-input v-model="menuParams.component"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="menuParams.title"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuParams.icon"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="redirect">
          <el-input v-model="menuParams.redirect"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-select v-model="menuParams.hidden" placeholder="请选择">
            <el-option label="是" value="00"></el-option>
            <el-option label="否" value="01"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogTitle=='新增菜单'||dialogTitle=='新增子菜单'" type="primary" @click="createMenu">新增</el-button>
        <el-button v-else type="primary" @click="updateMenu">修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'

  export default {
    components: {
      Pagination
    },
    data() {
      var validateRoleIds = (rule,value,callback)=>{
        if(this.userParams.roleIds.length<=0){
          return callback(new Error('请选择角色'))
        }else {
          return callback()
        }
      }
      return {
        listLoading: true,
        listParams: {
          pageSize: 5,
          pageNum: 1,
          keyMap:{},
          orderBy:''
        },
        pageSizes: [2, 5, 10, 20],
        pageInfo: {
          list: []
        },
        dialogFormVisible: false,
        dialogTitle: '',
        menuParams: {
        },
        rules:{
          username:[{required:true,message:'请输入菜单名',trigger:'blur'}],
          phone:[{pattern:/^1(3|4|5|7|8)\d{9}$/,message:'请输入正确手机号码',trigger:'blur'}],
          roleIds:[{validator:validateRoleIds,trigger:'change'}],
        },
        roleList:[]
      };
    },
    created() {
      console.log('x')
      this.getList();
      this.getRoleList();
    },
    methods: {
      getList() {
        let _this = this;
        this.listLoading = true;
        this.postRequest('/menu/listMenu', this.listParams).then(res => {
          _this.listLoading = false;
          if (res.data.code == '00') {
            this.pageInfo = res.data.data;
          }
        })
      },
      getRoleList(){
        this.getRequest('/role/getAllRole').then(res => {
          if (res.data.code == '00') {
            this.roleList = res.data.data;
          }
        })
      },
      handleSizeChange(size) {
        this.listParams.pageSize = size;
        this.getList();
      },
      handleCurrentChange(currentPage) {
        this.listParams.pageNum = currentPage;
        this.getList();
      },
      handleCreate() {
        if (this.$refs['menuForm']!==undefined) {
          this.$refs['menuForm'].resetFields();
        }
        this.dialogFormVisible = true;
        this.dialogTitle = '新增菜单';
      },
      handleCreateChild(menuId) {
        if (this.$refs['menuForm']!==undefined) {
          this.$refs['menuForm'].resetFields();
        }
        this.menuParams.menuId=menuId;
        this.dialogFormVisible = true;
        this.dialogTitle = '新增子菜单';
      },
      createMenu() {
        this.$refs['menuForm'].validate((valid=> {
          if (valid) {
            this.postRequest('/menu/saveMenu', this.menuParams).then(res => {
              if (res.data.code == '00') {
                this.dialogFormVisible = false;
                this.$message.success('新增成功');
                this.getList();
              }
            })
          }
        }))
      },
      handleUpdate(menuId) {
        if (this.$refs['menuForm']!==undefined) {
          this.$refs['menuForm'].resetFields();
        }
        this.dialogFormVisible = true;
        this.dialogTitle = '修改菜单';
        this.getRequest('/menu/getMenu?key='+menuId).then(res => {
          if (res.data.code == '00') {
            this.menuParams = res.data.data;
          }
        })
      },
      updateMenu(){
        this.$refs['menuForm'].validate((valid=>{
          if(valid){
            this.postRequest('/menu/updateMenu', this.menuParams).then(res => {
              if (res.data.code == '00') {
                this.dialogFormVisible = false;
                this.$message.success('修改成功');
                this.getList();
              }
            })
          }
        }))
      },
      handleDel(menuId) {
        this.$confirm('是否删除该菜单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest('/menu/deleteMenu?key='+menuId).then(res => {
            if (res.data.code == '00') {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
    }
  }

</script>
