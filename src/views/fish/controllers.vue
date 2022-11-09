<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.controllerno"
        placeholder="群控器编码"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:0px;width: 160px"
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
      <el-table-column min-width="80px" align="center" label="群控器型号">
        <template slot-scope="scope">
          <span>{{ scope.row.controllermodel }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="群控器编码（4G模块ID）">
        <template slot-scope="scope">
          <span>{{ scope.row.controllerno }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="100px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | stringForControllerStatus() }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="创建时间" width="180">
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
            @click="showDevices(scope.row)"
          >
            查看关联的设备
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
import { FetchControllers, DeleteControllerById } from '@/api/fishpond'

export default {
  name: 'Controllers',
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
        controllerno: ''
      },
      controllerItem: {
        id: '',
        controllerno: '',
        controllermodel: '',
        status: '',
        location: '',
        controllersim: '',
        controllercode: '',
        userid: '',
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
      FetchControllers(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    showDevices(item) {
      this.$router.push({ name: 'DevicesInController', query: { id: item.id }})
    },
    handleDelete(item) {
      console.log('删除 !!!!')
      this.$confirm('是否删除该条记录? 注：执行此操作前请先删除群控器下所有设备', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.id,
          token: sessionStorage.getItem('token')
        }
        DeleteControllerById(data).then(response => {
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
