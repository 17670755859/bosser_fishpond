<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.deskeyword"
        placeholder="日志描述"
        clearable
        prefix-icon="el-icon-search"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.hotelid"
        placeholder="产品ID"
        clearable
        prefix-icon="el-icon-search"
        style="width: 200px; margin-left: 30px"
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
      <el-table-column align="center" min-width="140px" label="日志编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" label="产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="250px" align="center" label="具体内容">
        <template slot-scope="scope">
          <span>{{ scope.row.descriptions }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="发生时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
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
import { FetchClientsLogsList } from '@/api/face'

export default {
  name: 'AllClientsLogs',
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
        hotelid: '',
        deskeyword: ''
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
      this.listLoading = true
      FetchClientsLogsList(this.listQuery).then(response => {
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
