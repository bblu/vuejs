<template>
<section class="login-wrap">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">注册</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
     <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button :loading="submiting" style="width:100%;" type="primary" @click.native.prevent="onSubmit">提交</el-button>
    </el-form-item>
    <el-form-item>
      <el-button style="width:100%;" @click.native.prevent="onToLogin">去登陆</el-button>
    </el-form-item>
  </el-form>
</section>
</template>

<script>
  import {register} from '../../api/api.js'

  export default {
    data() {
      return {
        submiting: false,
        ruleForm2: {
          username: '',
          password: '',
          checkPass: ''
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          checkPass: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },

    methods: {
      onSubmit: function (argument) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.submiting = true;
            //NProgress.start();
            var params = { 
              username: this.ruleForm2.username, 
              password: this.ruleForm2.password,
              password2: this.ruleForm2.checkPass

            };

            register(params).then(data => {

              this.submiting = false;
              let { code, token } = data;

              if (!data) {
                this.$message({
                  message: '注册失败，请重试',
                  type: 'error'
                });

              } else {
                setTimeout(() => {
                   this.$message({
                    message: '注册成功，请登录',
                    type: 'success'
                  });
                  this.$router.push({ path: '/login' });
                 }, 3000);
              }

            }).catch(() => {
              this.submiting = false;
              this.$message({
                  message: '请求失败',
                  type: 'error'
                });
            });

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      onToLogin(){
         this.$router.push({ path: '/login' });
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
    box-shadow: 0 0 5px #cac6c6;
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