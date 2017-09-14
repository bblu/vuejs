<template>
  <section>
    <el-form ref="sysConfForm" :model="sysConfForm"  :rules="rulesSysConfForm"  style="margin:20px;width:50%;min-width:400px;" >
      <el-form-item label="集群名" prop="clusterName">
        <el-input v-model="sysConfForm.clusterName"   ></el-input>
      </el-form-item>
      <el-form-item label="模块启动模式 service|docker" prop="moduleMode">
        <el-input v-model="sysConfForm.moduleMode"  ></el-input>
      </el-form-item>


      <el-form-item label="防盗链域名" prop="authRefers" >
        <el-input v-model="sysConfForm.authRefers" placeholder="示例：159******00"></el-input>
      </el-form-item>
      <el-form-item label="ums安装目录" prop="umsHome"  >
        <el-input v-model="sysConfForm.umsHome"    placeholder="示例：explame@gmail.com"></el-input>
      </el-form-item>

      <el-form-item label="许可服务地址" prop="licenseUrl">
        <el-input  v-model="sysConfForm.licenseUrl" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-row  type="flex" justify="end">
          <el-col :span="20">

          </el-col>
          <el-col :span="4" style="text-align: right">
           <el-button type="primary" @click.prevent="onSubmit('sysConfForm')">保存</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
</section>
</template>

<script>
    import {getSysConfig,updateSysConfig} from  '../../api/api';
    export default {

        data(){
            var checkClusterName = (rule,value,callback) => {
                let pattCheckClusterName = this.sysConfFormClusterName.pattern;
                let rp = new RegExp(pattCheckClusterName);
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error(this.sysConfFormClusterName.remark));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("集群名不能为空！"));
                }

            };
            var checkModuleMode = (rule,value,callback) => {
                let pattCheckModuleMode = this.sysConfFormModuleMode.pattern;
                let rp = new RegExp(pattCheckModuleMode);
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error(this.sysConfFormModuleMode.remark));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("模块启动模式不能为空！"));
                }

            };

            var checkAuthRefers = (rule,value,callback) => {
                let pattCheckAuthRefers = this.sysConfFormAuthRefers.pattern;
                let rp = new RegExp(pattCheckAuthRefers);
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error(this.sysConfFormAuthRefers.remark));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("防盗链域名不能为空！"));
                }

            };
            var checkUmsHome = (rule,value,callback) => {
                let pattCheckUmsHome = this.sysConfFormUmsHome.pattern;
                let rp = new RegExp(pattCheckUmsHome);
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error(this.sysConfFormUmsHome.remark));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("ums安装目录不能为空！"));
                }

            };
            var checkLicenseUrl = (rule,value,callback) => {
                let pattCheckLicenseUrl = this.sysConfFormLicenseUrl.pattern;
                let rp = new RegExp(pattCheckLicenseUrl);
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error(this.sysConfFormLicenseUrl.remark));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("许可服务地址不能为空！"));
                }

            };

            return {
                sysConfArr:[],
                sysConfForm: {
                    clusterName: '',
                    moduleMode: '',
                    authRefers: '',
                    umsHome: '',
                    licenseUrl: ''

                },
                sysConfFormClusterName: {
                    key: '',
                    value: '',
                    alias: '',
                    pattern: '',
                    remark: ''
                },
                sysConfFormModuleMode: {
                    key: '',
                    value: '',
                    alias: '',
                    pattern: '',
                    remark: ''
                },
                sysConfFormAuthRefers: {
                    key: '',
                    value: '',
                    alias: '',
                    pattern: '',
                    remark: ''
                },
                sysConfFormUmsHome: {
                    key: '',
                    value: '',
                    alias: '',
                    pattern: '',
                    remark: ''
                },
                sysConfFormLicenseUrl: {
                    key: '',
                    value: '',
                    alias: '',
                    pattern: '',
                    remark: ''
                },
                sysConfObj:{},
                rulesSysConfForm:{
                    clusterName:[
                        {validator:checkClusterName,required:true,trigger:'blur'}
                    ]
                    ,
                    moduleMode:[
                        {validator:checkModuleMode,required:true,trigger:'blur'}
                    ],
                    authRefers:[
                        {validator:checkAuthRefers,required:true,trigger:'blur'}
                    ],
                    umsHome:[
                        {validator:checkUmsHome,required:true,trigger:'blur'}
                    ],
                    licenseUrl:[
                        {validator:checkLicenseUrl,required:true,trigger:'blur'}
                    ]
                },


            }
        },
        computed:{
//      isShowModifyPasswordDg:function () {
//        return this.$store.state.modifyPasswordDg.isShowModifyPasswordDg
//      }

        },
        methods:{
            /**
             * 获取表单
             * */
            getList() {

                getSysConfig().then(function (response) {
                    let {success,code,message,resultValue} = response.data;
                    this.sysConfArr = resultValue;
                    let [clusterName,
                        moduleMode,
                        authRefers,
                        umsHome,
                        licenseUrl] =  resultValue;
                    this.sysConfFormClusterName = clusterName;
                    this.sysConfFormModuleMode = moduleMode;
                    this.sysConfFormAuthRefers = authRefers;
                    this.sysConfFormUmsHome = umsHome;
                    this.sysConfFormLicenseUrl = licenseUrl;


                    this.sysConfForm.clusterName = clusterName.value;
                    this.sysConfForm.moduleMode =moduleMode.value;
                    this.sysConfForm.authRefers = authRefers.value;
                    this.sysConfForm.umsHome = umsHome.value;
                    this.sysConfForm.licenseUrl = licenseUrl.value;





                }.bind(this)).catch(function(error){

                    this.$message({
                        message: '加载失败',
                        type: 'error'
                    });
                }.bind(this));
            },
            /**
             * 表单更新
             * @param sysConfForm
             */
            onSubmit(sysConfForm){
                var _this = this;
                this.$refs.sysConfForm.validate((valid) => {
                    if (valid) {
                        let paramList = [];
                        this.sysConfFormClusterName.value = this.sysConfForm.clusterName;
                        this.sysConfFormModuleMode.value = this.sysConfForm.moduleMode;
                        this.sysConfFormAuthRefers.value = this.sysConfForm.authRefers;
                        this.sysConfFormUmsHome.value = this.sysConfForm.umsHome;
                        this.sysConfFormLicenseUrl.value = this.sysConfForm.licenseUrl;
                        paramList.push(this.sysConfFormClusterName);

                        paramList.push(this.sysConfFormModuleMode);
                        paramList.push(this.sysConfFormAuthRefers);
                        paramList.push(this.sysConfFormUmsHome);
                        paramList.push(this.sysConfFormLicenseUrl);

                        updateSysConfig(paramList).then(function (response) {
                            let {sucess,code ,message,resultValue}  = response.data;
                            if (code !== 10000) {//没有成功返回
                                this.$notify({
                                    title: '错误',
                                    message: message,
                                    type: 'error'
                                });

                            }else {
                                this.$notify({
                                    title: '提示',
                                    message: message,
                                    type: 'success'
                                });
                                this.getList();//重新加载

                            }

                        }.bind(this)).catch(function(){

                            this.$message({
                                message: '添加失败',
                                type: 'error'
                            });
                        }.bind(this));


                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            }

        },
        mounted(){

          this.getList();
        }

    }
</script>

<style scoped>

</style>