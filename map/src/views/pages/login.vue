<template>
<section class="login-wrap">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button style="width:100%;"  @click.native.prevent="onSubmit" :loading="logining">登录</el-button>
    </el-form-item>
    <el-form-item>
      <el-button style="width:100%;" type="primary" @click.native.prevent="onRegister">去注册</el-button>
    </el-form-item>
  </el-form>
</section>
</template>

<script>
  import {login} from '../../api/api.js';

  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      onRegister(argument) {
        this.$router.push({ path: '/register' });
      },

      onSubmit(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            login(loginParams).then(data => {
              this.logining = false;
              //NProgress.done();
              if (!data) {
                this.$message({
                  message: '登录失败，请重试',
                  type: 'error'
                });
              } else {
                window.__token = data.token;
                sessionStorage.setItem('user', JSON.stringify(data));
                this.$router.push({ path: '/' });
              }
            }).catch(() => {
              this.logining = false;
              this.$message({
                  message: '登录失败，请重试',
                  type: 'error'
                });
            });
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import '~scss_vars';
  .login-wrap{
    position: fixed;
    width: 100%;
    height: 100%;
    //background: $color-primary;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      font-size: 24px;
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>