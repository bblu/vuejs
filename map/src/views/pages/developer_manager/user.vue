<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.account" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="onSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list.data" highlight-current-row v-loading="list.loading" style="width: 100%;" @selection-change="onSelChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="account" label="账号" sortable>
			</el-table-column>
			<el-table-column prop="type" label="账号类型" sortable>
			</el-table-column>		
			<el-table-column prop="name" label="姓名" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="登录时间" sortable>
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button v-show="!scope.row.locked" size="small" @click="onToApp(scope.$index, scope.row)">应用管理</el-button>
					<el-button v-show="!scope.row.locked" size="small" @click="onLock(scope.$index, scope.row)">锁定</el-button>
					<el-button v-show="scope.row.locked" size="small" @click="onUnlock(scope.$index, scope.row)">解锁</el-button>
					<el-button size="small" @click="onDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="onBatchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="onPageChange" :page-size="20" :total="list.total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
	
</template>
<script>
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
				}
			}
		},

		methods: {
			onPageChange(){

			},

			onSearch(){

			},

			onRefresh(){

			},

			onBatchRemove(){

			},

			onLock(){

			},

			onUnlock(){

			},

			onDel(){

			},

			getList(){
				
			},

			onSelChange(){
				this.sels = sels;
			}
		},

		mouted(){
			this.getList();
		}
	}
</script>