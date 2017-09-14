<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="onSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list.data" highlight-current-row v-loading="list.loading" style="width: 100%;">
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="account" label="账号" sortable>
			</el-table-column>		
			<el-table-column prop="ip" label="IP" sortable>
			</el-table-column>
			<el-table-column prop="date" label="操作时间" sortable>
			</el-table-column>
			<el-table-column prop="action" label="操作" sortable>
			</el-table-column>
			<el-table-column prop="detail" label="操作内容" sortable>
			</el-table-column>
			<el-table-column prop="type" label="操作结果类型" sortable>
			</el-table-column>
			<el-table-column prop="result" label="操作结果" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="onPageChange" :page-size="20" :total="list.total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
	
</template>
<script>
	export default {
		data(){
			return {
				filters: {

				},
				list: {
					total: 0,
					data: [],
					loading : false
				}
			}
		},

		methods: {
			onPageChange(){

			},
			onSearch(){

			},
			getList(){
				
			}
		},

		mouted(){
			this.getList();
		}
	}
</script>