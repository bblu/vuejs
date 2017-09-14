<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoles">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="角色名" sortable>
			</el-table-column>		
			<el-table-column prop="created_date" label="创建时间" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="描述" sortable>
			</el-table-column>
		
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
				<el-form-item label="分配资源">
					<el-tree
						:props="tree_props"
						:load="loadNode"
						lazy
						ref="tree"
						node-key="id"
						@check-change="onTreeNodeChecked"
						show-checkbox>
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input type="textarea" v-model="addForm.remark"></el-input>
				</el-form-item>
				<el-form-item label="分配用户">
					<el-button @click.native="chooseUsers">选择用户</el-button>
				</el-form-item>
				<el-form-item label="分配资源">
					<el-tree 
						:data="authority_tree" 
						:props="tree_props"
						node-key="id"
						ref="tree"
						show-checkbox>
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--选择用户界面-->
		<el-dialog title="用户列表" v-model="userListVisible" :close-on-click-modal="false">
					<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-checkbox>只显示已选</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="userListLoading" @selection-change="userSelsChange" style="width: 100%;">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="account" label="账号" sortable>
			</el-table-column>		
			<el-table-column prop="name" label="姓名" sortable>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="changUserPage" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="userListVisible = false">取消</el-button>
				<el-button type="primary" @click.native="chooseUsersSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getRoleListPage, addRole, getUserListPage } from '../../api/api';
	
	let id = 1;

	export default {
		data() {
			return {
				filters: {
					roleName: '',
					userName: ''
				},
				roles: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				users: [],
				userListLoading: false,
				userTotal: 0,
				userPage: 1, 
				userSels: [],
				userListVisible: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					remark: '',
					authority: ''
				},

				tree_props:{
					children: 'children',
					label: 'label'
				},

				authority_tree: [],

				selectedTreeNodes: [],
				topTreeNodes: [{
					label: '管理',
					id: id++,
					type: '1',
					pid: 0
				}, {
					label: '审查',
					id: id++,
					type: '2',
					pid: 0
				}, {
					label: '审计',
					id: id++,
					type: '3',
					pid: 0
				},{
					label: '业务',
					id: id++,
					type: '4',
					pid: 0
				}]

			}
		},

		methods: {
			//性别显示转换
			formatSex(row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},

			onTreeNodeChecked(node, isChecked, isSubNodeChecked){
				if(!isChecked){
					return;	
				}

				if(this.checkingTree){
					return;
				}

				if(!this.selectedType){
					this.selectedType = node.type;
				}


				if(this.selectedType != node.type){
					this.checkingTree = true;//防止重复打开
					console.log(this.selectedType, node.type);
					this.$confirm('您当前选择的资源与已选资源的类型是互斥的，是否取消之前已选资源?', '提示', {
						type: 'warning'
					}).then(function() {
						this.$refs.tree.setChecked(this.getRootIdByType(this.selectedType), false, true);
						this.selectedType = node.type;
						this.checkingTree = false;
					}.bind(this)).catch(function(){
						this.$refs.tree.setChecked(this.getRootIdByType(node.type), false, true);
						this.checkingTree = false;
					}.bind(this));
				}
			},

			handleCurrentChange(val) {
				this.page = val;
				this.getRoles();
			},

			changUserPage(val){
				this.userPage = val;
				this.getUsers();
			},

			//获取角色列表
			getRoles() {
				let para = {
					page: this.page,
					name: this.filters.roleName
				};
				this.listLoading = true;
				//NProgress.start();
				getRoleListPage(para).then((res) => {
					this.total = res.data.total;
					this.roles = res.data.roles;
					this.listLoading = false;
					//NProgress.done();
				});
			},

			getUsers() {
				let para = {
					page: this.userPage,
					name: this.filters.userName
				};
				this.userListLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.userTotal = res.data.total;
					this.users = res.data.users;
					this.userListLoading = false;
					//NProgress.done();
				});
			},

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();饶了
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRoles();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},

			chooseUsers: function(){
				this.userListVisible = true;
				this.getUsers();
			},

			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							this.editForm.authority = this.$refs.tree.getCheckedKeys(true);
							let para = Object.assign({}, this.editForm);
							console.log(para);
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getRoles();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					console.log(valid);
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							this.editForm.authority = this.$refs.tree.getCheckedKeys(true);

							addRole(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getRoles();
							});
						});
					}
				});
			},

			chooseUsersSubmit: function(){
				console.log(this.userSels);
			},

			selsChange: function (sels) {
				this.sels = sels;
			},

			userSelsChange: function (sels) {
				this.userSels = sels;
			},

			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRoles();
					});
				}).catch(() => {

				});
			},

			loadNode(node, resolve){
				if(node.level === 0){
					return resolve(this.topTreeNodes);
				} else if(node.level <= 3){
					setTimeout(function(){
						return resolve([
							{
								label: 'node1',
								id: id++,
								type: node.data.type
							},
							{
								label: 'node2',
								id: id++,
								type: node.data.type
							}
						]);
					}, 1000);
				} else {
					return resolve([]);
				}
			},

			submit(){
				console.log(this.$refs.tree.getCheckedNodes());
			},

			getRootIdByType(type){
				for(var i = 0; i < this.topTreeNodes.length; i++){
					if(this.topTreeNodes[i].type == type){
						return this.topTreeNodes[i].id;
					}
				}
			}
		},
		mounted() {
			this.getRoles();
		}
	}

</script>

<style scoped>

</style>