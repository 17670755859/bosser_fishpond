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
        v-model="listQuery.hotelid"
        placeholder="产品ID"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.mac"
        placeholder="MAC地址"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.sn"
        placeholder="SN"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="在线状态"
        clearable
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in status_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      <!--<el-table-column min-width="80px" align="center" label="设备ID">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceid }}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column min-width="100px" align="center" label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.devicename }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="房间号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid === null || scope.row.roomid === undefined || scope.row.roomid === '' ? '未绑定' : scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="display: inline-block">
            <img style="vertical-align: middle" src="@/assets/images/offline.png" alt="离线"><p style="display: inline-block">离线</p>
          </span>

          <span v-if="scope.row.status !== 0" style="display: inline-block">
            <img style="vertical-align: middle" src="@/assets/images/online.png" alt="在线"><p style="display: inline-block">在线</p>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime| parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.ip === null || scope.row.ip === undefined || scope.row.ip === '' ? '未知' : scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" label="MAC地址">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SN" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.sn }}</span>
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
        <!-- <el-form-item label="设备名称">
          <el-input v-model="additem.devicename" placeholder="设备名称" />
        </el-form-item>-->
        <el-form-item label="MAC地址">
          <el-input v-model="additem.mac" placeholder="MAC地址" />
        </el-form-item>
        <el-form-item label="SN号">
          <el-input v-model="additem.sn" placeholder="SN号" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleEdit" :title="'编辑'">
      <el-form :model="edititem" label-width="150px" label-position="left">
        <el-form-item label="设备ID(不可更改)">
          <el-input v-model="edititem.deviceid" :readonly="true" placeholder="设备ID" />
        </el-form-item>
        <!--<el-form-item label="设备名称">
          <el-input v-model="edititem.devicename" placeholder="设备名称" />
        </el-form-item>-->
        <el-form-item label="MAC地址">
          <el-input v-model="edititem.mac" placeholder="MAC地址" />
        </el-form-item>
        <el-form-item label="SN号">
          <el-input v-model="edititem.sn" placeholder="SN号" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleBind" :title="'绑定房间号'">
      <el-form :model="binditem" label-width="150px" label-position="left">
        <!--<el-form-item label="设备名称">
          <el-input :readonly="true" placeholder="设备名称" v-text="binditem.devicename" />
        </el-form-item>-->
        <el-form-item label="MAC地址">
          <el-input :readonly="true" placeholder="MAC地址" v-text="binditem.mac" />
        </el-form-item>
        <el-form-item label="SN号">
          <el-input :readonly="true" placeholder="SN号" v-text="binditem.sn" />
        </el-form-item>
        <el-form-item label="要绑定的房间号">
          <el-input v-model="binditem.roomid" placeholder="房间号" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleBind=false">取消</el-button>
        <el-button type="primary" @click="confirmBind">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchDeviceList, AddDevice, EditDevice, DeleteDevice, UnbindDevice, BindDevice } from '@/api/face'

export default {
  name: 'AllDeviceList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      status_options: [{
        value: 0,
        label: '离线设备'
      },
      {
        value: 1,
        label: '在线设备'
      }],
      dialogVisibleEdit: false,
      dialogVisibleAdd: false,
      dialogVisibleBind: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        hotelid: '',
        roomid: '',
        mac: '',
        sn: ''
      },
      edititem: {
        deviceid: undefined,
        hotelid: '',
        devicename: '',
        sn: '',
        mac: '',
        token: ''
      },
      additem: {
        hotelid: '',
        devicename: '',
        sn: '',
        mac: '',
        token: ''
      },
      binditem: {
        deviceid: undefined,
        roomid: '',
        hotelid: '',
        devicename: '',
        sn: '',
        mac: ''
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
      console.log(this.$route.path)
      this.fetchList()
    },
    fetchList() {
      // this.listQuery.hotelid = '' // 表示所有
      this.listLoading = true
      FetchDeviceList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
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
        const token = sessionStorage.getItem('token')
        DeleteDevice(item.deviceid, token).then(response => {
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
    handleEdit(item) {
      console.log('编辑 !!!!')
      this.edititem = JSON.parse(JSON.stringify(item))
      this.dialogVisibleEdit = true
    },
    handleUnbindOrBind(item) {
      if (item.roomid === undefined || item.roomid === '' || item.roomid === null) {
        console.log('绑定')
        this.binditem = JSON.parse(JSON.stringify(item))
        this.dialogVisibleBind = true
      } else {
        console.log('解绑')
        this.$confirm('是否解绑该设备', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          console.log('删除 !!!!')
          const token = sessionStorage.getItem('token')
          UnbindDevice(item.deviceid, token).then(response => {
            this.$notify({
              title: '已解绑',
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
    handleFilter() {
      this.fetchList()
    },
    confirmAdd() {
      console.log('confirmAdd')
      // if (this.additem.devicename === '' || this.additem.devicename === null || this.additem.devicename === undefined) {
      //   this.$message({
      //     type: 'error',
      //     message: '设备名为必填项'
      //   })
      //   return
      // }
      if (this.additem.mac === '' || this.additem.mac === null || this.additem.mac === undefined) {
        this.$message({
          type: 'error',
          message: 'MAC地址为必填项'
        })
        return
      }
      if (this.additem.sn === '' || this.additem.sn === null || this.additem.sn === undefined) {
        this.$message({
          type: 'error',
          message: 'SN号为必填项'
        })
        return
      }
      this.additem.hotelid = sessionStorage.getItem('hotelid')
      this.additem.token = sessionStorage.getItem('token')
      AddDevice(this.additem).then(response => {
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
    confirmBind() {
      console.log('confirmBind')
      if (this.binditem.roomid === '' || this.binditem.roomid === null || this.binditem.roomid === undefined) {
        this.$message({
          type: 'error',
          message: '房间为必填项'
        })
        return
      }
      const hotelid = sessionStorage.getItem('hotelid')
      BindDevice(this.binditem.deviceid, this.binditem.roomid, hotelid).then(response => {
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
      // if (this.edititem.devicename === '' || this.edititem.devicename === null || this.edititem.devicename === undefined) {
      //   this.$message({
      //     type: 'error',
      //     message: '设备名为必填项'
      //   })
      //   return
      // }
      if (this.edititem.mac === '' || this.edititem.mac === null || this.edititem.mac === undefined) {
        this.$message({
          type: 'error',
          message: 'MAC地址为必填项'
        })
        return
      }
      if (this.edititem.sn === '' || this.edititem.sn === null || this.edititem.sn === undefined) {
        this.$message({
          type: 'error',
          message: 'SN号为必填项'
        })
        return
      }
      this.edititem.hotelid = sessionStorage.getItem('hotelid')
      this.edititem.token = sessionStorage.getItem('token')
      EditDevice(this.edititem).then(response => {
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
