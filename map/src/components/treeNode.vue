<template>
	<span>
		<span>
			<span>{{label}}</span>	
		</span>
		
		<span :style="{float: 'right', 'margin-right': '20px'}">
			<el-button type="primary" size="mini" @click.stop="appendNode">新增</el-button>
			<el-button type="danger" size="mini" @click.stop="deleteNode">删除</el-button>
		</span>

	</span>
</template>

<script>
	export default {
		props:['label', 'appendNode', 'deleteNode'],
		data() {
			return {
				
			}
		},
		methods: {
		}
	}

</script>