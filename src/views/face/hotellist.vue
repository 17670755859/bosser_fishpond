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
        {{ '新增产品' }}
      </el-button>
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.hotelid"
        placeholder="产品ID"
        clearable
        prefix-icon="el-icon-search"
        style="width: 160px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.hotelname"
        placeholder="产品名称"
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
      <el-table-column min-width="80px" align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.hoteladdr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280px">
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
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >
            查看管理员
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
        <el-form-item label="产品名称">
          <el-input v-model="additem.hotelname" placeholder="产品名称" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="additem.hoteladdr" placeholder="地址" />
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
        <el-form-item label="产品名称">
          <el-input v-model="edititem.hotelname" placeholder="产品名称" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="edititem.hoteladdr" placeholder="地址" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchHotelList, AddHotel, EditHotel } from '@/api/face'

export default {
  name: 'HotelList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        hotelid: '',
        hotelname: ''
      },
      edititem: {
        hotelid: '',
        hotelname: '',
        hoteladdr: ''
      },
      additem: {
        hotelname: '',
        hoteladdr: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      FetchHotelList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleView(item) {
      this.$router.push({ name: 'EditorList', query: { id: item.hotelid }})
    },
    handleAdd() {
      this.dialogVisibleAdd = true
    },
    handleEdit(item) {
      console.log('编辑 !!!!')
      this.edititem = JSON.parse(JSON.stringify(item))
      this.dialogVisibleEdit = true
    },
    handleFilter() {
      this.fetchList()
    },
    confirmAdd() {
      console.log('confirmAdd')
      if (this.additem.hotelname === '' || this.additem.hotelname === null || this.additem.hotelname === undefined) {
        this.$message({
          type: 'error',
          message: '产品名称为必填项'
        })
        return
      }
      if (this.additem.hoteladdr === '' || this.additem.hoteladdr === null || this.additem.hoteladdr === undefined) {
        this.$message({
          type: 'error',
          message: '地址为必填项'
        })
        return
      }
      AddHotel(this.additem).then(response => {
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
    confirmEdit() {
      if (this.edititem.hotelname === '' || this.edititem.hotelname === null || this.edititem.hotelname === undefined) {
        this.$message({
          type: 'error',
          message: '产品名称为必填项'
        })
        return
      }
      if (this.edititem.hoteladdr === '' || this.edititem.hoteladdr === null || this.edititem.hoteladdr === undefined) {
        this.$message({
          type: 'error',
          message: '地址为必填项'
        })
        return
      }
      EditHotel(this.edititem).then(response => {
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
