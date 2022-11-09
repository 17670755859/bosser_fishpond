<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.groupname"
        placeholder="鱼塘组名称"
        clearable
        prefix-icon="el-icon-search"
        style="width: 160px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
    <!--  <el-input
        v-model="listQuery.groupno"
        placeholder="鱼塘组编号"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />-->
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
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
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
import { FetchPondGroups, DeleteFishpondGroupById } from '@/api/fishpond'

export default {
  name: 'FishpondsInPondGroup',
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
        groupno: '',
        groupname: ''
      },
      fondGroupItem: {
        id: '',
        groupno: '',
        name: '',
        userid: '',
        username: '',
        createts: ''
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
      FetchPondGroups(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    showPonds(item) {
      this.$router.push({ name: 'FishpondsInPondGroup', query: { id: item.id }})
    },
    handleDelete(item) {
      console.log('删除 !!!!')
      this.$confirm('是否删除该条记录? 注：执行此操作，会同时删除所有员工对该分组的权限，但不会删除分组下的鱼塘，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.id,
          token: sessionStorage.getItem('token')
        }
        DeleteFishpondGroupById(data).then(response => {
          this.$notify({
            title: '已删除',
            type: 'success',
            message: '操作成功',
            duration: 2000
          })
          location.reload()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    }
  }
}
</script>
