<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roomid"
        placeholder="房间号"
        clearable
        prefix-icon="el-icon-search"
        style="width: 160px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.idcard"
        placeholder="身份证"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 300px"
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
      <el-table-column min-width="100px" align="center" label="房间号">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="客户照片">
        <template slot-scope="scope">
          <img :src="scope.row.url" style="min-width: 100px; min-height: 100px; max-width: 150px; max-height: 150px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户姓名" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="客户电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="登记时间">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="截止时间">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
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
import { FetchMemberList, DeleteMemberById } from '@/api/face'

export default {
  name: 'DeleteMember',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogVisibleEdit: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        hotelid: '',
        roomid: '',
        name: '',
        idcard: ''
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
      this.listQuery.hotelid = sessionStorage.getItem('hotelid')
      this.listLoading = true
      FetchMemberList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleEdit(item) {
      console.log('编辑 !!!!')
      this.dialogVisibleEdit = true
    },
    handleFilter() {
      this.fetchList()
    },
    handleDelete(id) {
      console.log('删除 !!!!')
      this.$confirm('是否删除该条记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const para = {
          id: id,
          t: new Date().getTime(),
          token: sessionStorage.getItem('token')
        }
        DeleteMemberById(para).then(response => {
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
    }
  }
}
</script>
