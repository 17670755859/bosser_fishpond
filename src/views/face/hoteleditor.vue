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
        {{ '新增管理员' }}
      </el-button>
    </div>

    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
     <!-- <el-table-column min-width="80px" align="center" label="账户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column min-width="100px" align="center" label="所属产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="账户">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.isvalid === 1 ? '正常':'已禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="handleEditPwd(scope.row)"
          >
            重置密码
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleEnable(scope.row)"
          >
            {{ scope.row.isvalid === 1 ? '禁用':'启用' }}
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
        <el-form-item label="产品ID">
          <el-input :readonly="true" placeholder="产品ID" v-text="additem.hotelid" />
        </el-form-item>
        <el-form-item label="原始密码">
          <el-input :readonly="true" placeholder="密码" v-text="123456" />
        </el-form-item>
        <el-form-item label="账户">
          <el-input v-model="additem.username" placeholder="账户" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="additem.name" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="additem.phone" placeholder="联系方式" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleEdit" :title="'编辑'">
      <el-form :model="edititem" label-width="150px" label-position="left">
        <el-form-item label="产品ID">
          <el-input :readonly="true" placeholder="产品ID" v-text="edititem.hotelid" />
        </el-form-item>
        <el-form-item label="账户">
          <el-input v-model="edititem.username" placeholder="账户" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="edititem.name" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="edititem.phone" placeholder="联系方式" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleEditPwd" :title="'重置密码'">
      <el-form :model="editpwditem" label-width="150px" label-position="left">
        <el-form-item label="产品ID">
          <el-input :readonly="true" placeholder="产品ID" v-text="editpwditem.hotelid" />
        </el-form-item>
        <el-form-item label="账户">
          <el-input placeholder="账户" v-text="editpwditem.username" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input placeholder="联系人" v-text="editpwditem.name" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input placeholder="联系方式" v-text="editpwditem.phone" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="editpwditem.password" placeholder="新密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEditPwd=false">取消</el-button>
        <el-button type="primary" @click="confirmEditPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchEditorList, AddEditor, EditEditor, DisableEditor, EnableEditor, EditEditorPwd } from '@/api/face'

export default {
  name: 'EditorList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleEditPwd: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        hotelid: ''
      },
      edititem: {
        id: '',
        hotelid: '',
        username: '',
        name: '',
        phone: ''
      },
      editpwditem: {
        id: '',
        hotelid: '',
        username: '',
        name: '',
        phone: '',
        password: ''
      },
      additem: {
        hotelid: '',
        username: '',
        name: '',
        phone: ''
      }
    }
  },
  watch: {
    '$route': 'reloadD'
  },
  created() {
    this.listQuery.hotelid = this.$route.query.id
    this.fetchList()
  },
  methods: {
    reloadD() {
      console.log(this.$route.path)
      if (this.$route.path === '/dashboard/editorlist') {
        this.listQuery.hotelid = this.$route.query.id
      }
    },
    fetchList() {
      if (this.listQuery.hotelid === '' || this.listQuery.hotelid === null || this.listQuery.hotelid === undefined) {
        this.$message({
          type: 'error',
          message: '无效的产品ID'
        })
        return
      }
      this.listLoading = true
      FetchEditorList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.additem.hotelid = this.listQuery.hotelid
      this.dialogVisibleAdd = true
    },
    handleEdit(item) {
      console.log('编辑 !!!!')
      this.edititem = JSON.parse(JSON.stringify(item))
      this.edititem.id = item.id
      this.dialogVisibleEdit = true
    },
    handleEditPwd(item) {
      console.log('修改密码 !!!!')
      this.editpwditem = JSON.parse(JSON.stringify(item))
      this.editpwditem.id = item.id
      this.editpwditem.password = ''
      this.dialogVisibleEditPwd = true
    },
    confirmEditPwd() {
      console.log('confirmEditPwd')
      if (this.editpwditem.password === '' || this.editpwditem.password === null || this.editpwditem.password === undefined) {
        this.$message({
          type: 'error',
          message: '密码为必填项'
        })
        return
      }
      EditEditorPwd(this.editpwditem).then(response => {
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
    },
    handleFilter() {
      this.fetchList()
    },
    confirmAdd() {
      console.log('confirmAdd')
      if (this.additem.username === '' || this.additem.username === null || this.additem.username === undefined) {
        this.$message({
          type: 'error',
          message: '账户为必填项'
        })
        return
      }
      if (this.additem.name === '' || this.additem.name === null || this.additem.name === undefined) {
        this.$message({
          type: 'error',
          message: '联系人为必填项'
        })
        return
      }
      if (this.additem.phone === '' || this.additem.phone === null || this.additem.phone === undefined) {
        this.$message({
          type: 'error',
          message: '联系方式为必填项'
        })
        return
      }
      AddEditor(this.additem).then(response => {
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
    },
    handleEnable(item) {
      if (item.isvalid === 1) {
        this.$confirm('是否禁用该账户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          console.log('删除 !!!!')
          DisableEditor(item.id).then(response => {
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
      } else {
        this.$confirm('是否启用该账户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          console.log('删除 !!!!')
          EnableEditor(item.id).then(response => {
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
      }
    },
    confirmEdit() {
      if (this.edititem.username === '' || this.edititem.username === null || this.edititem.username === undefined) {
        this.$message({
          type: 'error',
          message: '账户为必填项'
        })
        return
      }
      if (this.edititem.name === '' || this.edititem.name === null || this.edititem.name === undefined) {
        this.$message({
          type: 'error',
          message: '联系人为必填项'
        })
        return
      }
      if (this.edititem.phone === '' || this.edititem.phone === null || this.edititem.phone === undefined) {
        this.$message({
          type: 'error',
          message: '联系方式为必填项'
        })
        return
      }
      EditEditor(this.edititem).then(response => {
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
