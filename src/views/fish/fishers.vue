<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="姓名"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:0px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.phonenumber"
        placeholder="手机号"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
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
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.iconurl" style="min-width: 50px; min-height: 50px; max-width: 80px; max-height: 80px;">
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phonenumber }}</span>
        </template>
      </el-table-column>
     <!-- <el-table-column min-width="100px" align="center" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>-->
      <el-table-column min-width="160px" align="center" label="上次登录时间">
        <template slot-scope="scope">
          <span>{{ scope.row.signintime  | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createts | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            icon="el-icon-view"
            @click="showPonds(scope.row)"
          >
            查看鱼塘
          </el-button>
          <el-button
            type="success"
            size="small"
            icon="el-icon-view"
            @click="showEmployees(scope.row)"
          >
            查看员工
          </el-button>
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
import { FetchFishers } from '@/api/fishpond'

export default {
  name: 'Fishers',
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
        username: '',
        phonenumber: ''
      },
      fisherItem: {
        userid: '',
        username: '',
        phonenumber: '',
        email: '',
        signintime: '',
        iconurl: '',
        nickname: '',
        address: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.token = sessionStorage.getItem('token')
      FetchFishers(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    showPonds(item) {
      this.$router.push({ name: 'FishpondsForUserid', query: { id: item.id }})
    },
    showEmployees(item) {
      this.$router.push({ name: 'EmployeesForBossid', query: { id: item.id }})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    }
  }
}
</script>
