<template>
  <div class="line-container">
    <el-container style="height:600px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-input placeholder="Filter keyword" v-model="filterText" style="margin-bottom:1px;"></el-input>
        <el-tree class="filter-tree" :data="treeData" @node-click="onTreeClick" node-key = "id"
        v-loading.body="treeLoading" element-loading-text="Loading" 
        :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree"></el-tree>
      </el-aside>
      <el-main style="border: 1px solid #eee">
        <el-table :data="tableData" v-loading.body="tableLoading" element-loading-text="Loading" >
          <el-table-column prop="serial" label="serial" width="64"></el-table-column>
          <el-table-column prop="name" label="name" width="160"></el-table-column>
          <el-table-column prop="height" label="height"></el-table-column>
          <el-table-column prop="width" label="width"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import { generateTitle } from '@/utils/i18n'
import { getList, getTower } from '@/api/line'

export default {
  data() {
    return {
      list: null,
      treeLoading: true,
      tableLoading: false,
      filterText: '',
      treeData: null,
      tableData: null,
      currentLine: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    fetchData() {
      this.treeLoading = true
      const page = this
      getList(this.listQuery).then(response => {
        page.list = response.data
        page.treeData = []
        const treeMap = new Map()
        for (const line of page.list) {
          const v = line.voltage
          if (!treeMap[v]) {
            treeMap[v] = []
          }
          treeMap[v].push({
            id: line.id,
            name: line.name })
        }
        for (const key in treeMap) {
          if (key === '_c') {
            continue
          }
          console.log(key + '' + treeMap[key])
          page.treeData.push({
            id: key,
            name: key + 'KV线路',
            children: treeMap[key] })
        }
        page.treeLoading = false
      })
    },
    onTreeClick(data) {
      if (data.children || this.currentLine === data) {
        return
      }
      this.currentLine = data
      this.tableLoading = true
      const page = this
      getTower(data.id).then(response => {
        const towers = response.data
        for (const t of towers) {
          t.name = page.currentLine.name + t.serial + '#杆塔'
        }
        page.tableData = towers
        page.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>
.line-container {

  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.filter-tree{
  background-color: #eee;
}
.line{
  text-align: center;
}
</style>

