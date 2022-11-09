<template>
  <div class="app-container">
    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="上级渔民">
        <template slot-scope="scope">
          <span>{{ scope.row.bossuserid }}</span>
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
      <!--<el-table-column min-width="100px" align="center" label="地址">
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
      <el-table-column align="center" label="操作" width="140px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            icon="el-icon-view"
            @click="showPondGroups(scope.row)"
          >
            查看鱼塘组
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
import { FetchEmployeesForBossId } from '@/api/fishpond'

export default {
  name: 'EmployeesForBossid',
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
        bossid: ''
      },
      fisherItem: {
        userid: '',
        username: '',
        phonenumber: '',
        email: '',
        signintime: '',
        iconurl: '',
        nickname: '',
        address: '',
        bossuserid: ''
      }
    }
  },
  watch: {
    '$route'(to, from) {
      this.listQuery.bossid = this.$route.query.id
      console.log('this.$route.query.id' + this.$route.query.id)
      this.fetchList()
    }
  },
  created() {
    if (this.$route.query) {
      this.listQuery.bossid = this.$route.query.id
    }
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.token = sessionStorage.getItem('token')
      FetchEmployeesForBossId(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    showPondGroups(item) {
      this.$router.push({ name: 'FishpondGroupsForEmployee', query: { id: item.userid }})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    }
  }
}
</script>
