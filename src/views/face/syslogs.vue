<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.behaviourkeyword"
        placeholder="日志内容"
        clearable
        prefix-icon="el-icon-search"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ '搜索' }}
      </el-button>
    </div>

    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="80px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120px" label="日志编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140px" label="管理员名称">
        <template slot-scope="scope">
          <span>{{ scope.row.adminname }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="250px" align="center" label="具体内容">
        <template slot-scope="scope">
          <span>{{ scope.row.behaviour }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="记录时间">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.updatetime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>-->
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchSyslogsList } from '@/api/face'

export default {
  name: 'SysLogs',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        logid: '',
        adminid: '',
        hotelid: '',
        behaviourkeyword: ''
      }
    }
  },
  watch: {
    '$route': 'reloadD'
  },
  created() {
    this.fetchList()
  },
  methods: {
    reloadD() {
      this.fetchList()
    },
    fetchList() {
      this.listQuery.adminid = sessionStorage.getItem('adminid')
      this.listQuery.hotelid = sessionStorage.getItem('hotelid')
      this.listLoading = true
      FetchSyslogsList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchList()
    }
  }
}
</script>
