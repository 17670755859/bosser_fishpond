<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 0px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >
        {{ '新增' }}
      </el-button>
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
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
      <el-table-column min-width="180px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="账户">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.isvalid | stringForAdmin() }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260px">
        <template slot-scope="scope">
          <el-button
            type="danger"
            v-if="scope.row.isvalid === '1'"
            size="small"
            icon="el-icon-edit"
            @click="handleDisabled(scope.row)"
          >
            禁用
          </el-button>
          <el-button
            type="danger"
            v-if="scope.row.isvalid !== '1'"
            size="small"
            icon="el-icon-edit"
            @click="handleEnabled(scope.row)"
          >
            启用
          </el-button>
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="handleResetPwd(scope.row)"
          >
            重置密码
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

    <el-dialog :visible.sync="dialogVisibleAdd" :title="'新增'">
      <el-form :model="additem" label-width="150px" label-position="left">
        <el-form-item label="姓名">
          <el-input v-model="additem.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="账户">
          <el-input v-model="additem.account" placeholder="账户" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="additem.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="additem.phone" placeholder="联系方式" />
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input readonly="true" v-text="additem.password" placeholder="密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchAdmins, AddAdmin, ResetAdminPwd, DisabledAdmin } from '@/api/fishpond'

export default {
  name: 'Banners',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogVisibleAdd: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      additem: {
        name: '',
        account: '',
        remark: '',
        phone: '',
        password: '123456'
      },
      item: {
        id: '',
        name: '',
        account: '',
        remark: '',
        phone: '',
        roles: '',
        isvalid: '',
        createtime: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listQuery.token = sessionStorage.getItem('token')
      this.listLoading = true
      FetchAdmins(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogVisibleAdd = true
    },
    handleDisabled(item) {
      console.log('禁用 !!!!')
      this.$confirm('是否禁用该管理员？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const data = {
          id: item.id,
          isvalid: 0,
          token: sessionStorage.getItem('token')
        }
        DisabledAdmin(data).then(response => {
          this.$notify({
            title: '已禁用',
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
    handleEnabled(item) {
      console.log('启用 !!!!')
      this.$confirm('是否启用该管理员？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const data = {
          id: item.id,
          isvalid: 1,
          token: sessionStorage.getItem('token')
        }
        DisabledAdmin(data).then(response => {
          this.$notify({
            title: '已启用',
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
    handleResetPwd(item) {
      console.log('重置密码 !!!!')
      this.$confirm('是否重置该管理员的密码为123456？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const data = {
          id: item.id,
          token: sessionStorage.getItem('token')
        }
        ResetAdminPwd(data).then(response => {
          this.$notify({
            title: '已重置',
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
    },
    confirmAdd() {
      console.log('confirmAdd')
      this.additem.token = sessionStorage.getItem('token')
      AddAdmin(this.additem).then(response => {
        this.$notify({
          title: '提交成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        location.reload()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
