<template>
	<section>
		<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.account" placeholder="应用名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="onSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->

		<!--列表-->
		<el-table :data="list.data" highlight-current-row v-loading="list.loading" style="width: 100%; margin-top: 10px;">
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="id" label="模块ID123" sortable>
			</el-table-column>
			<el-table-column prop="ip" label="模块IP" sortable>
			</el-table-column>		
			<el-table-column prop="moduleName" label="模块名" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" :formatter="formatStatus" sortable>
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button v-show="scope.row.status.toLowerCase() == 'started'" size="small" @click="onStop(scope.row.id)">停止</el-button>
					<el-button v-show="scope.row.status.toLowerCase() == 'stopped'" size="small" @click="onStart(scope.row.id)">启动</el-button>
					<el-button size="small" @click="onReStart(scope.row.id)">重启</el-button>
					<el-button size="small" @click="onSet(scope.row.id, scope.row.config)">配置</el-button>
					<el-button size="small" @click="onShowLogs(scope.row.id)">日志</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--配置界面-->
		<el-dialog title="编辑" v-model="configVisible" :close-on-click-modal="false">
			<el-form :model="basicConfigForm" label-width="80px" :rules="config.basic.rules" ref="basicConfigForm" v-show="config.basic.visible">
				<el-form-item v-for="item in config.basic.items" :label="item.alias" :prop="item.key">
					<el-input v-model="basicConfigForm[item.key]" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div style="text-align: right;">
				<el-button type="text" @click="onToggleMoreConfig">更多</el-button>
			</div>

			<el-form :model="extendConfigForm" label-width="80px" :rules="config.extend.rules" ref="extendConfigForm" v-show="config.extend.visible">
				<el-form-item v-for="item in config.extend.items" :label="item.alias" :prop="item.key">
					<el-input v-model="extendConfigForm[item.key]" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="configVisible = false">取消</el-button>
				<el-button type="primary" @click.native="onSave" :loading="submiting">提交</el-button>
			</div>
		</el-dialog>

		<!--日志-->
		<el-dialog title="日志" v-model="logPaneVisible" :close-on-click-modal="false">
			<div style="border: 1px solid #ccc; padding: 5px; max-height: 500px; overflow-y: scroll;">
				{{log}}
			</div>
		</el-dialog>

	</section>
	
</template>
<script>
import { getServerModules, updateModuleConfig, startModules, restartModules,  stopModules, getModuleLog} from '../../api/api';
	var updateModuleStatus = function(action, msg){
		this.$confirm('确认启动此模块吗？', '提示', {}).then(() => {
			this.list.loading = true;

			startModules(id).then(function(res){
				if(res.data.success){
					this.list.loading = false;
					this.$message({
						message: '启动模块成功',
						type: 'success'
					});
					this.getList();
				} else {
					this.$message({
						message: '启动模块失败',
						type: 'error'
					});
				}
			}.bind(this)).catch(function(){
				this.list.loading = false;
				this.$message({
					message: '启动模块失败',
					type: 'error'
				});
			}.bind(this));
		});
	}

	export default {
		data(){
			return {
				sels: [],
				filters: {

				},
				list: {
					data: [],
					total: 0,
					loading: false
				},

				config: {
					basic: {
						visible: true,
						rules:{},
						items:[]
					},

					extend: {
						visible: false,
						rules:{},
						items:[]
					}
				},
				configVisible : false,
				basicConfigForm: {},
				extendConfigForm: {},

				submiting: false,

				logPaneVisible: false,
				log: ''
			}
		},

		methods: {

			formatStatus: function (row, column) {
				return row.status.toLowerCase() == 'started' ? '运行中' : '已停止';
			},

			onStart: function(id){
				this.$confirm('确认启动此模块吗？', '提示', {}).then(() => {
					this.list.loading = true;

					startModules(id).then(function(res){
						if(res.data.success){
							this.list.loading = false;
							this.$message({
								message: '启动模块成功',
								type: 'success'
							});
							this.getList();
						} else {
							this.$message({
								message: '启动模块失败',
								type: 'error'
							});
						}
					}.bind(this)).catch(function(){
						this.list.loading = false;
						this.$message({
							message: '启动模块失败',
							type: 'error'
						});
					}.bind(this));
				});
			},

			onStop: function(id){
				this.$confirm('确认停止此模块吗？', '提示', {}).then(() => {
					this.list.loading = true;
					stopModules(id).then(function(res){
						this.list.loading = false;
						if(res.data.success){
							this.$message({
								message: '停止模块成功',
								type: 'success'
							});
							this.getList();
						} else {
							this.$message({
								message: '停止模块失败',
								type: 'error'
							});
						}
					}.bind(this)).catch(function(){
						this.list.loading = false;
						this.$message({
							message: '停止模块失败',
							type: 'error'
						});
					}.bind(this));;
				});
			},

			onReStart: function(id){
				this.$confirm('确认重启此模块吗？', '提示', {}).then(() => {
					this.list.loading = true;
					restartModules(id).then(function(res){
						this.list.loading = false;
						if(res.data.success){
							this.$message({
								message: '重启模块成功',
								type: 'success'
							});
							this.getList();
						} else {
							this.$message({
								message: '重启模块失败',
								type: 'error'
							});
						}
					}.bind(this)).catch(function(){
						this.list.loading = false;
						this.$message({
							message: '重启模块失败',
							type: 'error'
						});
					}.bind(this));;
				});
			},

			onSet: function(id, config){
				this.configVisible = true;
				this.config.basic.items = config.basic;
				this.config.basic.visible = true;
				this.config.extend.items = config.extend;
				this.config.extend.visible = false;
				this.config.id = id;

				config.basic.forEach(function(item){
					this.basicConfigForm[item.key] = item.value;
					this.config.basic.rules[item.key] = [{
						validator: function(rule, value, callback){
							this.validator(value, item.pattern, callback);
						}.bind(this),
						trigger: 'blur'
					}]
				}.bind(this));

				config.extend.forEach(function(item) {
					this.extendConfigForm[item.key] = item.value;
					this.config.extend.rules[item.key] = [{
						validator: function(rule, value, callback){
							this.validator(value, item.pattern, callback);
						}.bind(this),
						trigger: 'blur'
					}]
				}.bind(this));
			},

			onShowLogs: function(id){
				this.list.loading = true;
				getModuleLog(id).then( res => {
					this.list.loading = false;
					if(res.data.success){
						this.logPaneVisible = true;
						this.log = res.data.resultValue.log;
					} else {
						this.$message({
							message: '加载日志失败',
							type: 'error'
						});
					}
				}).catch(() => {
					this.list.loading = false;
					this.$message({
						message: '加载日志失败',
						type: 'error'
					});
				});
			},

			onSave: function(){
				let submit = (params) => {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.submiting = true;
						//NProgress.start();
						console.log(params);
						updateModuleConfig(this.config.id, params).then((res) => {
							this.submiting = false;
							if(res.data.success) {
								this.$message({
									message: '提交成功',
									type: 'success'
								});

								this.configVisible = false;
								this.getList();
							} else {

							}
						});
					}).catch(function(){
						this.submiting = false;
						this.$message({
							message: '提交失败',
							type: 'error'
						});
					});
				};

				var that = this;
				this.$refs.basicConfigForm.validate((valid) => {
					if (valid) {
						if(that.config.extend.visible){
							that.$refs.extendConfigForm.validate((valid) => {
								if(valid) {
									var params = { basic: [], extend: []};
									for(var k in that.basicConfigForm) {
										params.basic.push({
											key: k,
											value: that.basicConfigForm[k]
										});
									}
									for(var k in that.extendConfigForm) {
										params.extend.push({
											key: k,
											value: that.extendConfigForm[k]
										});
									}
									submit(params);
								}
							});
						} else {
							var params = { basic: []};
							for(var k in that.basicConfigForm) {
								params.basic.push({
									key: k,
									value: that.basicConfigForm[k]
								});
							}
							submit(params);
						}
					}
				});
				console.log(this.basicConfigForm);
				console.log(this.extendConfigForm);
			},

			onToggleMoreConfig: function(){
				this.config.extend.visible = !this.config.extend.visible;
			},

			getList(){
				this.list.loading = true;
				getServerModules().then(function (list) {
					this.list.loading = false;
					this.list.data = list.data.resultValue;
				}.bind(this)).catch(function(list){
					this.list.loading = false;
					this.$message({
							message: '模块列表加载失败',
							type: 'error'
						});
				}.bind(this));
			},

			validator: function(value, pattern, callback){
				if(/^\s*$/.test(value)){
					callback(new Error('配置不能为空'));
				} else if(!(new RegExp(pattern)).test(value)){
					callback(new Error('格式不正确'));
				} else {
					callback();
				}
			}
		},

		mounted(){
			this.getList();
		}
	}
</script>