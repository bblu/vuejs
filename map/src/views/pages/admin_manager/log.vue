<template>
	<el-tabs type="card" style="margin-top: 10px;">
		<el-tab-pane label="在线用户">
			<online-logs></online-logs>
		</el-tab-pane>
		<el-tab-pane label="用户操作">
			<operation-logs></operation-logs>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import onlineLogs from './log_online.vue'
	import operationLogs from './log_operation.vue'

	export default {
		components: {
			'online-logs': onlineLogs,
			'operation-logs': operationLogs
		},
		
		data(){
			return {

			}
		},

		methods: {

		}
	}
</script>