<template>
	<section>
		<div class="banner">
			<img src="../../assets/logo-sm.png">
			<h1 class="banner-txt">地图更新工具</h1>
			<a href="#/login" style="float: right; margin: 30px 10px;color: #fff;">退出</a>
		</div>
		<section class="main">
			<!-- <div class="draw_btns">
				<el-button-group>
					<el-button size="small" @click="setName(scope.$index, scope.row)">矩形</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">多边形</el-button>
				</el-button-group>
				<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">保存</el-button>
			</div> -->
			<mapCom :drawType="drawType" :save="save" :reset="reset" :geoJSONs="geoJSONs2Show" :editableGeoJSON="geoJSON2Edit" :saveRange="saveRange"></mapCom>
		</section>
		<aside class="left_pane">
			<!--工具条-->
			<!-- <form id="exportingForm" action="http://172.16.2.113:8080/mapspot/export" method="post">
				<input type="hidden" name="type" v-model="exportingForm.type">
				<input type="hidden" name="polygon" v-model="exportingForm.polygon">
			</form> -->
			<iframe id="download" style="display: none;"></iframe>
			<el-col :span="24" class="toolbar">
				<span style="position: absolute; top: 28px;">更新区域数据</span>
				<el-button type="primary" style="float: right;" :loading="exporting" @click="onExport">导出</el-button>
			</el-col>

			<!--列表-->
			<el-table :data="list.items" highlight-current-row v-loading="listLoading" @selection-change="onSelsChange">
				<el-table-column type="selection" width="60">
				</el-table-column>
				<el-table-column prop="type" label="数据类型" :formatter="formatType" sortable>
				</el-table-column>
				<el-table-column prop="area" label="面积" :formatter="formatArea" sortable>
				</el-table-column>
				<el-table-column prop="reason" label="更新原因" sortable>
				</el-table-column>
				<el-table-column prop="time" label="绘制/提交时间" sortable>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template scope="scope">
						<el-button size="small" v-show="!scope.owner && !geoJSONs2Show[scope.row.id]" @click="onShow(scope.$index, [scope.row])">显示</el-button>
						<el-button size="small" v-show="!scope.owner && geoJSONs2Show[scope.row.id]" @click="onHide(scope.$index, [scope.row])" style="margin: 0;">隐藏</el-button>
						<el-button size="small" v-show="!scope.owner" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" v-show="!scope.owner" size="small" @click="onDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-col :span="24" class="toolbar">
				<el-button  @click="onBatchShow" :disabled="this.sels.length === 0">批量显示</el-button>
				<el-button  @click="onBatchHide" :disabled="this.sels.length === 0">批量隐藏</el-button>
				<el-pagination 
					@current-change="onPageChange" 
					@size-change="handleSizeChange" 
					:page-sizes="[10, 20, 50, 100]" 
					:page-size="list.page.pageSize" 
					:total="list.page.total" 
					layout="sizes, prev, pager, next" 
					style="float:right;"
					>
				</el-pagination>
			</el-col>
		</aside>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm" label-position="top">
				
				<el-form-item label="图像类型" prop="type">
					<el-radio-group v-model="editForm.type">
						<el-radio :disabled="!!editForm.id" label="IMAGE">亚米影像</el-radio>
						<el-radio :disabled="!!editForm.id" label="VECTOR">1:2000矢量</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="更新原因" prop="reason">
					<el-input type="textarea" v-model="editForm.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="onCancel">取消</el-button>
				<el-button type="primary" @click.native="submit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
	
</template>

<script>
	import Vue from 'vue'
	import map from '../components/map.vue'
	import {add, fetchList, del, exportData} from '../../api/api.js'
	import GeometryUtil from '../../common/js/L.GeometryUtil.js'



	let user = {};
	const emptyForm = {
		type: '',
		reason: '',
		geom: ''
	}

	export default {
	  	name: 'Home',
	  	components: {
	    	mapCom: map
	  	},
		data() {
			return {
				list: {
					items: [],
					page: {
						total: 0,
						pageSize: 10
					}
				},
				listLoading: false,
				drawType: 0,
				editForm: Object.assign({}, emptyForm),
				editLoading: false,
				editFormVisible: false,
				editFormRules:{},

				geoJSONs2Show: {},
				geoJSON2Edit: null,

				rules: {
		          reason: [
		            { required: true, message: '请输入原因', trigger: 'blur' }
		          ],

		          type: [
		            { required: true, message: '请选择图像类型', trigger: 'blur' }
		          ]
		        },

		        exportingForm: {
		        	type: '',
		        	polygon: ''
		        },

		        selectedRange: '',

		        exportRange: null,
		        exportType: '',

		        sels: [],
		        updatedId: '',

		        exporting: false
			}
		},
		methods: {
			formatType: function (row, column) {
				return row.type == 'IMAGE' ? '亚米影像' : row.type == 'VECTOR' ? '1:2000矢量' : '未知';
			},

			formatArea: function(row, column) {
				return L.GeometryUtil.readableArea(JSON.parse(row.geom).totalArea || 0, true);
			},

			onBatchShow(){
				this.onShow(0, this.sels);
			},

			onBatchHide(){
				this.onHide(0, this.sels);
			},

			onSelsChange: function (sels) {
				this.sels = sels;
			},

			onPageChange: function(pageNo){
				this.getList(pageNo);
			},

			handleSizeChange: function(size){
				this.list.page.pageSize = size;
				this.getList(1);
			},

			onCancel(){
				this.editFormVisible = false; 
			},

			onShow(index, rows) {
				// row.geom && this.geoJSONs2Show.splice(index, 1, JSON.parse(row.geom));
				var newItems = {};

				if(this.updatedId){
					this.geoJSONs2Show[this.updatedId] = null;
					this.updatedId = '';
				}

				for(var i = 0; i < rows.length; i++){

					var row = rows[i];
					var geojson = JSON.parse(row.geom);
					var type = row.type;
					if(!geojson){
						if(rows.length !== 1){
							continue;
						}

						this.$message({
							message: '数据格式不合法，无法绘制',
							type: 'warning'
						})
						return;
					}

					//this.geoJSONs2Show[row.id] = {geojson, type};
					newItems[row.id] = {geojson, type};
					// Vue.set(this.geoJSONs2Show, index, {geojson, type});

				}

				this.geoJSONs2Show = Object.assign({}, this.geoJSONs2Show, newItems);
			},

			onHide(index, rows) {
				var newItem = {};
				for(var i = 0; i < rows.length; i++){
					var row = rows[i];
					newItem[row.id] = null;
				}
				
				this.geoJSONs2Show = Object.assign({}, this.geoJSONs2Show, newItem);
			},

			onDel(index, row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then((res) => {
					this.requestDel([row.id]).then(() => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.geoJSONs2Show = [];
						this.getList(this.list.page.currentPage || 1);
					}).catch(() => {
						this.$message({
							message: '删除失败',
							type: 'error'
						});
						this.get
					});
				});
				
			},

			onEdit(index, row){
				var geoJSON = JSON.parse(row.geom);
				var type = row.type;
				if(!geoJSON){
					this.$message({
						message: '数据格式不合法，无法绘制',
						type: 'warning'
					})
				}

				//Vue.set(this.geoJSONs2Show, index, null);

				this.isEditing = true;
				this.geoJSON2Edit = {geoJSON, type};
				this.editForm = row;
			},

			onExport(){
				//const data = new FormData();

				// data.append('type', 'VECTOR');
				// data.append('polygon', "{\"type\":\"Polygon\",\"coordinates\":[[[118.1515809151061,24.50203662762317],[118.1491253113481,24.50055184395558],[118.1513905582257,24.49748709818005],[118.154379161249,24.49857213239869],[118.1545124110654,24.50138941422961],[118.1515809151061,24.50203662762317]]]}")
				// exportData({
				//     "type":"VECTOR",//"VECTOR":矢量地图，"IMAGE"：亚米影像
				//     "polygon": "{\"type\":\"Polygon\",\"coordinates\":[[[118.1515809151061,24.50203662762317],[118.1491253113481,24.50055184395558],[118.1513905582257,24.49748709818005],[118.154379161249,24.49857213239869],[118.1545124110654,24.50138941422961],[118.1515809151061,24.50203662762317]]]}"
				// });

				// //exportData(data);
				// this.exportingForm = {
				//     "type":"VECTOR",//"VECTOR":矢量地图，"IMAGE"：亚米影像
				//     "polygon": "{\"type\":\"Polygon\",\"coordinates\":[[[118.1515809151061,24.50203662762317],[118.1491253113481,24.50055184395558],[118.1513905582257,24.49748709818005],[118.154379161249,24.49857213239869],[118.1545124110654,24.50138941422961],[118.1515809151061,24.50203662762317]]]}"
				// };
				// //document.getElementById('exportingForm').submit();
				// Vue.nextTick(function(){
				// 	document.getElementById('exportingForm').submit();
				// });

				// document.getElementById('download').src = "http://172.16.2.113:8080/mapspot/export?" + ['type', 'VECTOR'].join('=') + '&' + ['polygon', encodeURIComponent("\"{\"type\":\"Polygon\",\"coordinates\":[[[118.1515809151061,24.50203662762317],[118.1491253113481,24.50055184395558],[118.1513905582257,24.49748709818005],[118.154379161249,24.49857213239869],[118.1545124110654,24.50138941422961],[118.1515809151061,24.50203662762317]]]}\"")].join('=');
				if(this.exportRange && this.exportType){
					exportData({
						exportRange: this.exportRange,
						exportType: this.exportType,
						token: user.token
					});
					this.exporting = true;

					setTimeout(() => {
						this.exporting = false;
					}, 2000);
				} else {
					this.$message({
						message: '请先框选导出区域',
						type: 'warning'
					})
				}
				
			},

			save: function (geojson) {
				this.editFormVisible = true;
				this.editLoading = false;
				this.editForm.geom = JSON.stringify(geojson);
			},

			saveRange(range, type){
				this.exportRange = range;
				this.exportType = type;
				console.log(range, type);
			},

			reset(){
				this.editForm = Object.assign({}, emptyForm);
			},

			getList: function(page){
				fetchList({
					userId: user.userId,
					page: page,
					pageSize: this.list.page.pageSize
				}).then((list) => {
					this.list = list;
				})
			},

			submit: function(){
		        this.$refs.editForm.validate((valid) => {
          			if(valid) {
						if(this.editForm.id){
							this.requestUpdate();
						} else {
							this.requestAdd('添加').then(() => {
								this.editForm = Object.assign({}, emptyForm);
							}).catch((res) => {
								this.editLoading = false;
								this.$message({
									message: op + '失败',
									type: 'error'
								});
							});
						}
					}
				})
			},

			requestUpdate(){
				var op = '更新';
				var id = this.editForm.id;

				this.requestDel([this.editForm.id]).then((res) => {
							this.requestAdd(op).then(() => {
						this.geoJSON2Edit = null;

						var newItem = {};
						newItem[this.editForm.id] = {geojson: JSON.parse(this.editForm.geom), type: this.editForm.type};
						this.geoJSONs2Show = newItem;

						this.updatedId = id;
						this.editForm = Object.assign({}, emptyForm);
					}).catch((res) => {
							this.editLoading = false;
							this.$message({
								message: op + '失败',
								type: 'error'
							});
						});
				}).catch(() => {
					this.editLoading = false;
					this.$message({
						msg: op + '失败',
						type: 'error'
					});
				});
			},

			requestAdd(op){
				this.editLoading = true;
				return add(Object.assign({}, this.editForm, {
					user: user
				})).then((res) => {
					this.$message({
						message: op + '成功',
						type: 'success'
					});

					this.editLoading = false;
					this.editFormVisible = false;
					this.getList(1);
					window.eventBus.$emit('afterAddingData');
				});
			},

			requestDel(ids){
				this.editLoading = true;
				return del({
				ids: ids.join(',')
				});
			}
		},

		mounted() {
			user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
			} else{
				this.$route.push('/login');
			}

			this.getList(1);
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.banner{
		padding: 5px 10px;
		background-color: $color-primary;
		color: #fff;
		font-size: 16px;
		line-height: 20px;
	}
	.banner-txt{
	    position: absolute;
	    top: 0;
	    left: 70px;
	    font-weight: 500;
	}
	.main{
	    position: absolute;
		right: 40%;
	    left: 0;
	    top: 50px;
	    bottom: 0;
	    margin: 30px;
	    border: 1px solid #ccc;
	}
	.left_pane{
		position: absolute;
		top: 40px;
		bottom: 0;
		left: 60%;
		right: 0;
		margin: 30px 30px 30px 0;
		overflow-y: auto;
	}
	.draw_btns{
	    position: absolute;
	    z-index: 1000;
	    top: 10px;
	    right: 5px;
	}
</style>