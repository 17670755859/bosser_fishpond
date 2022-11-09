<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.hotelid"
        placeholder="产品ID"
        clearable
        prefix-icon="el-icon-search"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.roomid"
        placeholder="房间号"
        clearable
        prefix-icon="el-icon-search"
        style="width: 300px; margin-left: 30px"
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
      <el-table-column align="center" min-width="140px" label="客户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.personname === '' ? '未知用户': scope.row.personname }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="250px" align="center" label="房间号">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? '开锁成功' : '开锁失败' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="开门时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
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
import { FetchStatisticsList } from '@/api/face'

export default {
  name: 'AllOpenDoorLog',
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
        roomid: ''
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
      FetchStatisticsList(this.listQuery).then(response => {
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
