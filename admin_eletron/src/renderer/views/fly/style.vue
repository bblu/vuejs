<template>
  <div class="line-container">
    <el-container style="height:100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-input placeholder="Filter keyword" v-model="filterText" style="margin-bottom:1px;"></el-input>
        <el-tree class="filter-tree" :data="treeData" @node-click="onTreeClick" node-key = "id"
        v-loading.body="treeLoading" element-loading-text="Loading" 
        :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree"></el-tree>
      </el-aside>
      <el-main class="point-container" style="border: 1px solid #eee">
        <cloud-view>cloud-view</cloud-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CloudView from '@/components/Cloudview'
import { getStyle, getTower } from '@/api/tower'

export default {
  components: {
    CloudView
  },
  data() {
    return {
      list: null,
      treeLoading: true,
      tableLoading: false,
      filterText: '',
      treeData: null,
      tableData: null,
      currentLine: null,
      currentTower: null,
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
      getStyle().then(response => {
        page.list = response.data
        page.treeData = []
        const treeMap = new Map()
        for (const item of page.list) {
          const v = item.voltage
          if (!treeMap[v]) {
            treeMap[v] = []
          }
          treeMap[v].push({
            id: item.id,
            name: item.name })
          if (page.currentLine == null) {
            page.currentLine = treeMap[v][0]
            page.selectStyle(item.id)
          }
        }
        for (const key in treeMap) {
          if (key === '_c') {
            continue
          }
          console.log(key + '' + treeMap[key])
          page.treeData.push({
            id: key,
            name: key + 'KV塔类型',
            children: treeMap[key] })
        }
        page.treeLoading = false
      })
    },
    onTreeClick(row) {
      if (row.children || this.currentLine === row) {
        return
      }
      this.currentLine = row
      this.selectStyle(row.id)
    },
    onTableClick(row, event, column) {
      this.currentTower = row
      console.log('select tower ' + row.id)
    },
    selectStyle(id) {
      this.tableLoading = true
      const page = this
      getStyle(id).then(response => {
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
  height: calc(100vh - 50px);
}
.point-container {
  padding: 0px;
}
.filter-tree{
  background-color: #eee;
}
.line{
  text-align: center;
}
</style>

