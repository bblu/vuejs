<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.pageviews}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      items: [
        { 'id': '440000197810062718', 'title': 'Lmkjh qpxd eflqaivf twowowy kxx bulsfjwvh xnjfsm jjrqusmvce jndhp ndw etefp ziztt jjoyfnotz emccdhst bcgrmly gfvzckuo.', 'status': 'draft', 'author': 'name', 'display_time': '1979-05-11 23:59:54', 'pageviews': 2812 },
        { 'id': '610000199405297266', 'title': 'Jcpn gvhukj tqbf tqj wbjcuyttex zqrarjmelt mkod ntx xobhpbri bckb dbcfdzttm oviunrfro.', 'status': 'draft', 'author': 'name', 'display_time': '2011-01-24 14:55:27', 'pageviews': 1895 },
        { 'id': '640000201611199910', 'title': 'Oyvh ctgrirdrd rgpk sqazepb wcms kxukavrou gqlnqkhy yrcmhj scxhwzv kmpbdwyl xphnsqmy ouo.', 'status': 'deleted', 'author': 'name', 'display_time': '1996-12-01 18:25:33', 'pageviews': 3472 }]
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.list = this.items
      // getList(this.listQuery).then(response => {
      // this.list = response.data.items
      this.listLoading = false
      // })
    }
  }
}
</script>
