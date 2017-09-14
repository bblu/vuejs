<template>
	<section>
	<el-card style="width: 60%; min-width: 500px; margin-top: 10px;">
		<el-form label-position="top" :model="config" label-width="80px" :rules="editFormRules" ref="editForm">
			<el-form-item label="密码过期时间" prop="pw_expired">
				<el-input v-model="config.pw_expired" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="pw_error_times">
				<el-input v-model="config.pw_error_times" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="在线管理者账号数" prop="online_limit">
				<el-input v-model="config.online_limit" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click.native="onSubmit" :loading="loading">提交</el-button>
			</el-form-item>
		</el-form>
	</el-card>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				config: {
					pw_expired: 0,
					pw_error_times: 0,
					online_limit: 0
				},
				loading: false,
				editFormRules: {
					pw_expired: [
						{ required: true, message: '请输入旧密码', trigger: 'blur' }
					],

					pw_error_times: [
						{ required: true, message: '请输入新密码', trigger: 'blur' }
					],

					online_limit: [
						{ required: true, message: '请再次输入密码', trigger: 'blur' },
						
					]
				}
			}
		},
		methods: {
			onSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
					}
				});
			}
		}
	}

</script>