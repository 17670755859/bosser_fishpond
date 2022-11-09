<template>
  <div class="app-container">
    <!--    <div class="filter-container">-->
    <!--      <el-button-->
    <!--        v-waves-->
    <!--        class="filter-item"-->
    <!--        style="margin-left: 0px;"-->
    <!--        type="primary"-->
    <!--        icon="el-icon-plus"-->
    <!--        @click="handleAdd"-->
    <!--      >-->
    <!--        {{ '登记' }}-->
    <!--      </el-button>-->
    <!--    </div>-->
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
        v-model="listQuery.roomid"
        placeholder="房间号"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
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
      <el-table-column min-width="100px" align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
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
     <!-- <el-table-column min-width="150px" align="center" label="客户电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.idcard }}</span>
        </template>
      </el-table-column>-->
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
      <el-table-column align="center" min-width="100px" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row | stringForStatus() }}</span>
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

    <el-dialog :visible.sync="dialogVisibleEdit" :title="'编辑'">
      <el-form :model="edititem" label-width="150px" label-position="left">
        <el-form-item label="房间号">
          <el-input v-model="edititem.roomid" placeholder="房间号" />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="edititem.name" placeholder="客户姓名" />
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input v-model="edititem.tel" placeholder="客户电话" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="edititem.idcard" placeholder="身份证号" />
        </el-form-item>
        <el-form-item label="登记时间">
          <el-date-picker v-model="edititem.starttime" type="datetime" style="margin-left: 0px; min-width: 200px" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="edititem.endtime" type="datetime" style="margin-left: 0px; min-width: 200px" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
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
import { FetchMemberList, EditMemberRequest } from '@/api/face'

export default {
  name: 'AllMemberList',
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
      },
      edititem: {
        id: undefined,
        roomid: '',
        hotelid: '',
        name: '',
        idcard: '',
        tel: undefined,
        starttime: undefined,
        endtime: undefined
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      // this.listQuery.hotelid = '' // 表示所有
      this.listLoading = true
      FetchMemberList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push('/dashboard/add')
    },
    handleEdit(item) {
      console.log('编辑 !!!!')
      this.edititem = JSON.parse(JSON.stringify(item))
      this.edititem.starttime = new Date(item.starttime * 1000)
      this.edititem.endtime = new Date(item.endtime * 1000)
      this.dialogVisibleEdit = true
    },
    handleFilter() {
      this.fetchList()
    },
    confirmEdit() {
      if (this.edititem.roomid === null || this.edititem.roomid === undefined) {
        this.$message({
          type: 'error',
          message: '房间号为必填项'
        })
        return
      }
      if (this.edititem.starttime === null || this.edititem.starttime === undefined) {
        this.$message({
          type: 'error',
          message: '入住时间为必填项'
        })
        return
      }
      if (this.edititem.endtime === null || this.edititem.endtime === undefined) {
        this.$message({
          type: 'error',
          message: '退房时间为必填项'
        })
        return
      }
      if (this.edititem.name === null || this.edititem.name === undefined) {
        this.$message({
          type: 'error',
          message: '姓名为必填项'
        })
        return
      }
      if (this.edititem.tel === null || this.edititem.tel === undefined) {
        this.$message({
          type: 'error',
          message: '手机号为必填项'
        })
        return
      }
      if (this.edititem.idcard === null || this.edititem.idcard === undefined) {
        this.$message({
          type: 'error',
          message: '身份证号为必填项'
        })
        return
      }
      var commitItem = {
        id: undefined,
        roomid: '',
        hotelid: '',
        name: '',
        idcard: '',
        tel: undefined,
        starttime: undefined,
        endtime: undefined
      }
      commitItem.id = this.edititem.id
      commitItem.hotelid = sessionStorage.getItem('hotelid')
      commitItem.roomid = this.edititem.roomid
      commitItem.starttime = '' + new Date(this.edititem.starttime).getTime()
      commitItem.endtime = '' + new Date(this.edititem.endtime).getTime()
      commitItem.name = this.edititem.name
      commitItem.tel = this.edititem.tel
      commitItem.idcard = this.edititem.idcard
      var data = JSON.stringify(commitItem)
      EditMemberRequest(data).then(response => {
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

<style scoped>

</style>
