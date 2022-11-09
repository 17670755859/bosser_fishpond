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
        {{ '新增房间' }}
      </el-button>
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.roomid"
        placeholder="房间号"
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
      <!--<el-table-column min-width="80px" align="center" label="房间主键ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column min-width="100px" align="center" label="房间号">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column min-width="100px" align="center" label="已关联设备数">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.roomid === null || scope.row.roomid === undefined || scope.row.roomid === '' ? '未绑定' : scope.row.roomid }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="状态" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.isvalid === 1 ? '正常启用' : '正常启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280px">
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

    <el-dialog :visible.sync="dialogVisibleAdd" :title="'新增'">
      <el-form :model="additem" label-width="150px" label-position="left">
        <el-form-item label="产品ID">
          <el-input placeholder="产品ID" v-text="additem.hotelid" />
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="additem.roomid" placeholder="房间号" />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="additem.mdescription" placeholder="备注信息" />
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
import { FetchRoomList, AddRoom, DeleteRoomById } from '@/api/face'

export default {
  name: 'RoomList',
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
        hotelid: '',
        roomid: ''
      },
      additem: {
        hotelid: '',
        roomid: '',
        mdescription: '',
        token: ''
      },
      item: {
        id: '',
        hotelid: '',
        roomid: '',
        mdescription: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listQuery.hotelid = sessionStorage.getItem('hotelid')
      this.listLoading = true
      FetchRoomList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.additem.hotelid = sessionStorage.getItem('hotelid')
      this.dialogVisibleAdd = true
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
        DeleteRoomById(data).then(response => {
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
      this.fetchList()
    },
    confirmAdd() {
      console.log('confirmAdd')
      if (this.additem.roomid === '' || this.additem.roomid === null || this.additem.roomid === undefined) {
        this.$message({
          type: 'error',
          message: '房间号为必填项'
        })
        return
      }
      this.additem.hotelid = sessionStorage.getItem('hotelid')
      this.additem.token = sessionStorage.getItem('token')
      AddRoom(this.additem).then(response => {
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
