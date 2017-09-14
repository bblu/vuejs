<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.account" placeholder="应用名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="onSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list.data" highlight-current-row v-loading="list.loading" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="name" label="key名称" sortable>
			</el-table-column>
			<el-table-column prop="key" label="key" sortable>
			</el-table-column>		
			<el-table-column prop="server" label="绑定服务" sortable>
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button v-show="!scope.row.locked" size="small" @click="onLock(scope.$index, scope.row)">锁定</el-button>
					<el-button v-show="scope.row.locked" size="small" @click="onUnlock(scope.$index, scope.row)">解锁</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="onBatchLock" :disabled="this.sels.length===0">批量锁定</el-button>
			<el-button type="danger" @click="onBatchUnlock" :disabled="this.sels.length===0">批量解锁</el-button>
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

			onBatchUnlock(){
			},

			onBatchLock(){

			},

			onDel(){

			},

			getList(){
				
			}
		},

		mouted(){
			this.getList();
		}
	}
</script>