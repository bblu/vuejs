<template>
	<section>
		<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
			<el-form-item label="旧密码" prop="oldPw">
				<el-input v-model="editForm.oldpw" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="newPw">
				<el-input v-model="editForm.oldpw" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="重复新密码" prop="repeat">
				<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click.native="onSubmit" :loading="editLoading">提交</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				editForm: {
					account: '',
					name: '',
					sex: -1,
					phone: '',
					birth: '',
					email: ''
				},
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			onSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						console.log('submit!');
					}
				});
			}
		}
	}

</script>