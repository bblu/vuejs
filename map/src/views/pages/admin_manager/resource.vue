<template>
<section>
<!-- 	<el-card style="width: 60%; min-width: 300px; min-height: 200px; margin:10px 0;"> -->
	<el-tree style="margin-top: 10px; width: 60%; min-width:400px;"
		v-loading="deleteLoading" 
		:props="tree_props"
		:render-content="renderContent"
		:load="loadNode"
		lazy
		node-key="id"
		ref="tree">
	</el-tree>
<!-- 	</el-card>
 -->			
		
	</el-form>

	<!--新增界面-->
	<el-dialog title="新增资源" v-model="addFormVisible" :close-on-click-modal="false">
		<el-form :model="form" label-width="80px" :rules="formRules" ref="addForm">
			<el-form-item label="名称" prop="name">
				<el-input v-model="form.alias"></el-input>
			</el-form-item>
			<el-form-item label="类别">
				<el-select
				  v-model="form.resourceType"
				>
					<el-option
						v-for="item in options"
					  	:label="item.label"
					  	:value="item.value"
					></el-option>	
				</el-select>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="addFormVisible = false">取消</el-button>
			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		</div>
	</el-dialog>
</section>
</template>

<script>
	import treeNode from '../../components/treeNode.vue'
	import {getResource} from '../../api/api'

	let id = 1;
	let options = [
		{
			value: 1,
			label: '管理'
		},
		{
			value: 2,
			label: '审计'
		},
		{
			value: 3,
			label: '审核'
		},
		{
			value: 4,
			label: '业务'
		}

	];

	export default {
		data() {
			return {
				form: {
					type: '',
					name: ''
				},
				addFormVisible: false,
				editFormVisible: false,
				formRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				// authority_tree:[{ id:0, label: '资源', children: []}],

				tree_props: {
					children: 'children',
					label: 'alias'
				},

				options: [],

				addLoading: false,
				deleteLoading: false
			}
		},
		methods: {
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if(valid){
						this.addLoading = true;
						setTimeout(function(){
							console.log(this.form);
							this.addLoading = false;
							this.nodeStore.append({id: id++, label: this.form.name}, this.nodeData);
							this.addFormVisible = false;
						}.bind(this), 500);
					}
				});
			},

			onAddNode(store, data){
				console.log(data);
				this.addFormVisible = true;
				this.form = {
					pid: data.id,
					alias: '',
					resourceType: ''
				};
				this.nodeStore = store;
				this.nodeData = data;

				if(data.id == ""){
					this.options = options;
				} else {
					this.options = [options[data.resourceType - 1]]
				}

				//store.append({id: id++, label: 'test', children: []}, data);
			},

			onDeleteNode(store, data){
				var that = this;
				this.$confirm('确认删除吗？', '提示', {}).then(function() {
					that.deleteLoading = true;
					setTimeout(function(){
						store.remove(data);
						that.deleteLoading = false;
						that.$message({
							message: '删除成功',
							type: 'success'
						});
					}, 500);
				});
			},

			loadNode(node, resolve){
				var data = node.data;

				if(node.level === 0){
					resolve([{
						alias: '资源',
						id: '',
						resourceType: 0
					}]);
					return;
				} 

				return getResource({
					resourceType: data.resourceType, 
					parentId: data.id,
				}).then((res) => {
					if(res.data.success){
						resolve(res.data.resultValue);
					} else {
						resolve([]);
					}
				}).catch(() => {
					resolve([]);
				});

				
			},

			// renderContent(h, {node, data, store}){
			// 	return h('span', {

			// 	}, [node.label]);
			// }

			renderContent(h, {node, data, store}){
				return h(treeNode, {
					'props': {
						'label': node.label,
						'appendNode': function (e) {
							this.onAddNode(store, data);
						}.bind(this),

						'deleteNode': function(e){
							this.onDeleteNode(store, data)
						}.bind(this)
					}
				});
			}
		}
	}

</script>