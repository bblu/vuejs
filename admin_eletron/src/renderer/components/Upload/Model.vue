<template>
  <div style="float: left;">
    <input ref="model-upload-input" class="model-upload-input" type="file" accept=".las, .laz" @change="handleChange">
    <el-button :loading="loading" style="margin-left:0px;" size="mini" type="primary" @click="handleClick">upload</el-button>
    <!--div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover"></div-->
  </div>
</template>

<script>

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    handleUpload: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]
      if (!this.isLas(rawFile)) {
        this.$message.error('Only supports upload .las, .laz suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleClick() {
      this.$refs['model-upload-input'].click()
    },
    handleChange(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.$refs['model-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        // TODO get MD5
        this.handleUpload && this.handleUpload(rawFile)
        // this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const fileRaw = e.target.result
          this.handleUpload && this.handleUpload(fileRaw)
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    isLas(file) {
      return /\.(las|laz)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.model-upload-input{
  display: none;
  z-index: -9999;
}
</style>
