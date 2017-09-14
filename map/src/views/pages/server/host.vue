<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-button style="margin-left: 0px;margin-top: 10px;margin-bottom: 10px;"
                 @click="handleCreate" type="primary" icon="edit">添加</el-button>

    </div>

    <el-table :data="list"  v-loading="loadingTable" element-loading-text ="进行中..." fit highlight-current-row style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="ip" align="center"  label="主机IP" sortable>

      </el-table-column>

      <el-table-column prop="port"  align="center" label="管理端口" sortable>

      </el-table-column>

      <el-table-column  prop="type"  align="center" label="节点类型" >

      </el-table-column>

      <el-table-column  prop="status" align="center" label="节点状态" >

      </el-table-column>

      <el-table-column  align="center" label="操作" width="260">
        <template scope="scope"><!--
          <el-button  size="small" type="success" @click="handleModifyStatus(scope.row,'published')">停止
          </el-button>
          <el-button  size="small" type="info" @click="handleModifyStatus(scope.row,'draft')">重启
          </el-button>-->
          <el-button  size="small" type="warning" @click="handleModifyStatus(scope.row,'modify')">修改
           </el-button>

          <el-button  size="small" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
            </el-button>

        </template>
      </el-table-column>

    </el-table>
<!--
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
-->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form class="small-space" :model="temp" ref="temp" :rules="rulesTempForm"  label-position="left" label-width="100px" >

        <el-form-item label="主机IP" prop="ip">
          <el-input v-model="temp.ip">
          </el-input>
        </el-form-item>

        <el-form-item label="管理端口" prop="port">
          <el-input v-model="temp.port"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {getHostManaList,deleteHostById,updateHost} from  '../../api/api';
    export default {
//        name: 'table_host',
        data() {

            var checkIp = (rule,value,callback) => {

                let rp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error("IP地址不对！"));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("IP地址不能为空！"));
                }

            };
            var checkPort = (rule,value,callback) => {

                let rp =  /^[0-9]*[1-9][0-9]*$/;
                if(value.length > 0 ){
                    if(!rp.test(value)){
                        callback(new Error("端口格式不对！"));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error("端口不能为空！"));
                }

            };
            return {
                rulesTempForm:{

                    ip:[
                        {validator:checkIp,required:true,trigger:'blur'}
                    ],
                    port:[
                        {validator:checkPort,required:true,trigger:'blur'}
                    ]
                },
                list: null,
                total: null,
                listLoading: true,
                loadingTable:false,
                listQuery: {
                    page: 1,
                    limit: 20,
                    importance: undefined,
                    title: undefined,
                    type: undefined
                },
                temp: {
                    id: undefined,
                    ip:'',
                    port:'',
                    importance: 0,
                    remark: '',
                    timestamp: 0,
                    title: '',
                    type: '',
                    status: 'published'
                },
                importanceOptions: [1, 2, 3],
                calendarTypeOptions:[],
                statusOptions: ['published', 'draft', 'deleted'],
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                dialogPvVisible: false,
                pvData: []
            }
        },
        mounted() {
            this.getList();//获取主机列表
        },

        methods: {
            getList() {

                this.listLoading = true;
                getHostManaList().then(function (response) {
                    this.listLoading = false;
                    this.list = response.data.resultValue;
                }.bind(this)).catch(function(){
                    this.listLoading = false;
                    this.$message({
                        message: '主机列表加载失败',
                        type: 'error'
                    });
                }.bind(this));
            },

            handleModifyStatus(row, status) {

              if(status === 'modify')  {//修改记录
                 this.temp.ip = row.ip;
                 this.temp.port = row.port;
                  this.dialogStatus = 'update';
                  this.dialogFormVisible = true;
              }

              if(status === 'deleted'){
                  this.loadingTable = true;
                    deleteHostById(row.ip).then(function (response) {
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
                            this.getList();//重新加载主机列表

//                            this.dialogFormVisible = false;
                        }
                        this.loadingTable = false;
                    }.bind(this)).catch(function(error){
                        this.loadingTable = false;
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    }.bind(this));
                }


            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;

            },
            handleUpdate(row) {
//                objectMerge(this.temp, row)
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);

            },
            create() {//新增
//                this.temp.id = parseInt(Math.random() * 100) + 1024;
//                this.temp.timestamp = +new Date();
//                this.temp.author = '原创作者';
//                this.list.unshift(this.temp);
//                this.dialogFormVisible = false;
//                this.$notify({
//                    title: '成功',
//                    message: '创建成功',
//                    type: 'success',
//                    duration: 2000
//                });
                this.$refs.temp.validate((valid) => {
                    if (valid) {
                        updateHost(this.temp.ip, this.temp.port).then(function (response) {
                            let {sucess, code, message} = response.data;
                            if (code !== 10000) {//没有成功返回200
                                this.$notify({
                                    title: '错误',
                                    message: message,
                                    type: 'error'
                                });

                            } else {
                                this.$notify({
                                    title: '提示',
                                    message: message,
                                    type: 'success'
                                });
                                this.getList();//重新加载主机列表
                                this.dialogFormVisible = false;
                            }

                        }.bind(this)).catch(function () {

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

            },
            update() {//修改

                this.$refs.temp.validate((valid) => {
                    if (valid) {
                        updateHost(this.temp.ip, this.temp.port).then(function (response) {
                            let {sucess, code, message} = response.data;
                            if (code !== 10000) {//没有成功返回
                                this.$notify({
                                    title: '错误',
                                    message: message,
                                    type: 'error'
                                });

                            } else {

                                this.$notify({
                                    title: '提示',
                                    message: message,
                                    type: 'success'
                                });
                                this.getList();//重新加载主机列表
                                this.dialogFormVisible = false;
                            }

                        }.bind(this)).catch(function () {

                            this.$message({
                                message: '更新失败',
                                type: 'error'
                            });
                        }.bind(this));
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
//                this.temp.timestamp = +this.temp.timestamp;
//                for (const v of this.list) {
//                    if (v.id === this.temp.id) {
//                        objectMerge(v, this.temp);
//                        break;
//                    }
//                }
//                this.dialogFormVisible = false;
//                this.$notify({
//                    title: '成功',
//                    message: '更新成功',
//                    type: 'success',
//                    duration: 2000
//                });
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    ip:'',
                    port:'',
                    importance: 0,
                    remark: '',
                    timestamp: 0,
                    title: '',
                    status: 'published',
                    type: ''
                };
            },
            handleFetchPv(pv) {
//                fetchPv(pv).then(response => {
//                    this.pvData = response.pvData
//                    this.dialogPvVisible = true
//                })
            },
            handleDownload() {
//                require.ensure([], () => {
//                    const { export_json_to_excel } = require('vendor/Export2Excel');
//                    const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
//                    const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
//                    const data = this.formatJson(filterVal, this.list);
//                    export_json_to_excel(tHeader, data, 'table数据');
//                })
            },
            formatJson(filterVal, jsonData) {
//                return jsonData.map(v => filterVal.map(j => {
//                    if (j === 'timestamp') {
//                        return parseTime(v[j])
//                    } else {
//                        return v[j]
//                    }
//                }))
            }
        }
    }
</script>
