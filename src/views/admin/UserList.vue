<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" v-model="listParams.keyMap.equal_userId" class="filter-item" placeholder="序号">
      </el-input>
      <el-input style="width: 200px;" v-model="listParams.keyMap.equal_username" class="filter-item" placeholder="用户名">
      </el-input>
      <el-date-picker style="width: 200px;" v-model="listParams.keyMap.greater_gmtCreate" type="datetime"
                      class="filter-item" placeholder="起始时间" value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>  -
      <el-date-picker style="width: 200px;" v-model="listParams.keyMap.less_gmtCreate" type="datetime"
                      class="filter-item" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
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
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="姓名">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
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
      <el-table-column width="150px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="地址">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.userId)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDel(scope.row.userId)">删除</el-button>
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
      <el-form ref="userForm" :rules="rules" :model="userParams" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item v-show="false" prop="userId">
          <el-input v-model="userParams.userId"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userParams.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm"
                      v-if="userParams.password!=undefined&&userParams.password!=''">
          <el-input type="password" v-model="userParams.passwordConfirm"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="userParams.roleIds" multiple filterable placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userParams.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userParams.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogTitle=='新增用户'" type="primary" @click="createUser">新增</el-button>
        <el-button v-else type="primary" @click="updateUser">修改</el-button>
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
      var validatePassword = (rule,value,callback)=>{
        if(!value&&this.dialogTitle=='新增用户'){
          return callback(new Error('请输入密码'))
        }else {
          return callback()
        }
      }
      var confirmPassword = (rule,value,callback)=>{
        if(value!=this.userParams.password){
          return callback(new Error('两次密码不一致'))
        }else {
          return callback()
        }
      }
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
          pageSize: 2,
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
        userParams: {
        },
        rules:{
          username:[{required:true,message:'请输入用户名',trigger:'blur'}],
          password:[{validator:validatePassword,trigger:'blur'}],
          passwordConfirm:[{validator:confirmPassword,trigger:'blur'}],
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
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
        this.postRequest('/user/listUser', this.listParams).then(res => {
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
        if (this.$refs['userForm']!==undefined) {
          this.$refs['userForm'].resetFields();
        }
        this.dialogFormVisible = true;
        this.dialogTitle = '新增用户';
      },
      createUser() {
        this.$refs['userForm'].validate((valid=> {
          if (valid) {
            this.postRequest('/user/saveUser', this.userParams).then(res => {
              if (res.data.code == '00') {
                this.dialogFormVisible = false;
                this.$message.success('新增成功');
                this.getList();
              }
            })
          }
        }))
      },
      handleUpdate(userId) {
        if (this.$refs['userForm']!==undefined) {
          this.$refs['userForm'].resetFields();
        }
        this.dialogFormVisible = true;
        this.dialogTitle = '修改用户';
        this.getRequest('/user/getUser?key='+userId).then(res => {
          if (res.data.code == '00') {
            this.userParams = res.data.data;
          }
        })
      },
      updateUser(){
        this.$refs['userForm'].validate((valid=>{
          if(valid){
            this.postRequest('/user/updateUser', this.userParams).then(res => {
              if (res.data.code == '00') {
                this.dialogFormVisible = false;
                this.$message.success('修改成功');
                this.getList();
              }
            })
          }
        }))
      },
      handleDel(userId) {
        this.$confirm('是否删除该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest('/user/deleteUser?key='+userId).then(res => {
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
