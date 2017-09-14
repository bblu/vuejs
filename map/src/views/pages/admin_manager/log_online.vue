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
				<el-form-item>
					<el-button type="primary" v-on:click="onRefresh">刷新</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list.data" highlight-current-row v-loading="list.loading" style="width: 100%;">
			<el-table-column type="index">
			</el-table-column>
			<el-table-column prop="account" label="账号" sortable>
			</el-table-column>		
			<el-table-column prop="name" label="IP" sortable>
			</el-table-column>
			<el-table-column prop="login_date" label="登录时间" sortable>
			</el-table-column>
			<el-table-column prop="birth" label="最近操作时间" sortable>
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

			getList(){
				
			}
		},

		mouted(){
			this.getList();
		}
	}
</script>