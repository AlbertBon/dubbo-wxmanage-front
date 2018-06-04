<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">
      <h3 class="title">vue-element-admin</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <i class="fa fa-user" aria-hidden="true"></i>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="fa fa-key" aria-hidden="true"></i>
        </span>
        <el-input name="password" :type="pwdType" v-model="loginForm.password"
                  autoComplete="on"
                  placeholder="密码"></el-input>
        <span class="show-pwd" @click="showPwd">
          <i class="fa fa-eye-slash" aria-hidden="true" v-if="pwdType == 'password'"></i>
          <i class="fa fa-eye" aria-hidden="true" v-if="pwdType == ''"></i>
        </span>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item prop="code">
            <div class="grid-content bg-purple">
              <el-input name="code" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.code" placeholder="验证码"/>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple login-code-container" @click="refreshCode">
            <img :src="codeImg" class="login-code">
          </div>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <!--<div class="tips">-->
        <!--<span style="margin-right:20px;">username: admin</span>-->
        <!--<span> password: admin</span>-->
      <!--</div>-->
    </el-form>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import MenuUtils from '@/utils/MenuUtils'

  var routers =[]
  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'bon',
          password: '123123',
          code: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          code:[{required:true,trigger:'blur',message:'验证码不能为空'}]
        },
        loading: false,
        pwdType: 'password',
        codeImg: process.env.BASE_API + '/login/getImageCode?random=' + Math.random()
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      refreshCode(){
        this.codeImg = process.env.BASE_API + '/login/getImageCode?random=' + Math.random();
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            let _this = this;
            this.loading = true;
            console.log(_this.$store.getters.token);
            this.postRequest('/login/loginIn', this.loginForm).then(resp => {
              _this.loading = false;
              const data = resp.data;
              if(data.code=='00'){
                _this.$store.commit('SET_TOKEN', data.data.token);
                _this.$store.commit('SET_NAME', data.data.name);
                _this.handleMenuRouter(2)
                console.log(_this.$store.getters.token);
                _this.$router.push({path: '/'});
              }
            }).catch(()=>{
              this.loading = false
            })
            // this.loading = true
            // this.$store.dispatch('Login', this.loginForm).then(() => {
            //   this.loading = false
            // this.$router.push({path: '/'})
            // }).catch(() => {
            //   this.loading = false
            // })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleMenuRouter(userId){
        this.getRequest('/menu/getMenuRouter?userId='+userId).then(res=>{
          if(res.data.code=='00'){
            MenuUtils(routers,res.data.data)
            this.$store.state.app.menuRouterMap = this.$store.state.app.menuRouterMap.concat(routers)
            console.log(this.$store.state.app.menuRouterMap)
            this.$router.addRoutes(routers)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  &:-webkit-autofill {
     -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
     -webkit-text-fill-color: #fff !important;
   }
  }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  span {
  &:first-of-type {
     margin-right: 16px;
   }
  }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  &_login {
     font-size: 20px;
   }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .login-code-container{
    text-align: center;
  .login-code{
    margin-top: 3px;
  }
  }

  }
</style>

