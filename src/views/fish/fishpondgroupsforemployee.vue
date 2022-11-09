<template>
  <div class="app-container">
    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="鱼塘组名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="所属渔民">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="100px" align="center" label="鱼塘组编号">
        <template slot-scope="scope">
          <span>{{ scope.row.groupno }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="创建时间" width="180px">
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
            查看组中鱼塘
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
import { FetchPondGroupsForEmployee } from '@/api/fishpond'

export default {
  name: 'FishpondGroupsForEmployee',
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
        employeeid: ''
      },
      fondGroupItem: {
        id: '',
        groupno: '',
        name: '',
        userid: '',
        createts: ''
      }
    }
  },
  watch: {
    '$route'(to, from) {
      this.listQuery.employeeid = this.$route.query.id
      console.log('this.$route.query.id' + this.$route.query.id)
      this.fetchList()
    }
  },
  created() {
    if (this.$route.query) {
      this.listQuery.employeeid = this.$route.query.id
    }
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.token = sessionStorage.getItem('token')
      FetchPondGroupsForEmployee(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    showPonds(item) {
      this.$router.push({ name: 'FishpondsInPondGroup', query: { id: item.id }})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    }
  }
}
</script>
