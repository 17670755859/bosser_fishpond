<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        placeholder="内容关键字"
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
      <el-table-column min-width="80px" align="center" label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.device.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="分机号">
        <template slot-scope="scope">
          <span>{{ scope.row.device.port }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="群控器（4G模块ID）">
        <template slot-scope="scope">
          <span>{{ scope.row.controller.controllerno }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="用户编码">
        <template slot-scope="scope">
          <span>{{ scope.row.phonenumber }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="用电量">
        <template slot-scope="scope">
          <span>{{ scope.row.powerconsumption }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="当前档位">
        <template slot-scope="scope">
          <span>{{ scope.row.currentlevel }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="预警信息">
        <template slot-scope="scope">
          <span>{{ scope.row.warninginfo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发生时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createts | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="故障代码">
        <template slot-scope="scope">
          <span>{{ scope.row.errorcode }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="处理状态">
        <template slot-scope="scope">
          <span v-if="scope.row.handlestatus == '0'" style="color: red">未处理</span>
          <span v-if="scope.row.handlestatus == '1'" style="color: green">已处理</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="140px">
        <template slot-scope="scope">
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
import { FetchWarnings, DeleteWarningById } from '@/api/fishpond'

export default {
  name: 'Warnings',
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
        content: ''
      },
      item: {
        id: '',
        deviceid: '',
        devicestatus: '',
        powerconsumption: '',
        currentlevel: '',
        warninginfo: '',
        handlestatus: '',
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
      FetchWarnings(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(item) {
      console.log('删除 !!!!')
      this.$confirm('是否删除该条记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.id,
          token: sessionStorage.getItem('token')
        }
        DeleteWarningById(data).then(response => {
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
