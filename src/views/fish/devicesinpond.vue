<template>
  <div class="app-container">
    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="设备名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="所属鱼塘名称">
        <template slot-scope="scope">
          <span>{{ scope.row.pondname }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="设备编号">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceno }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="群控器编码（4G模块ID）">
        <template slot-scope="scope">
          <span>{{ scope.row.controllerno }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="60px" align="center" label="分机号">
        <template slot-scope="scope">
          <span>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180">
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
            @click="showDeviceDetail(scope.row)"
          >
            编辑/查看设备
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
    <el-dialog :visible.sync="detailVisible" :title="'编辑/查看设备详情'">
      <el-form :model="detailItem" label-width="180px" label-position="left">
        <el-form-item label="设备ID">
          <el-input v-text="detailItem.deviceid" placeholder="设备ID" />
        </el-form-item>
        <el-form-item label="所属鱼塘ID">
          <el-input v-text="detailItem.pondid" placeholder="所属鱼塘ID" />
        </el-form-item>
        <el-form-item label="鱼塘名称">
          <el-input v-text="detailItem.pondname" placeholder="鱼塘名称" />
        </el-form-item>
        <el-form-item label="群控器ID">
          <el-input v-text="detailItem.controllerid" placeholder="群控器ID" />
        </el-form-item>
        <el-form-item label="群控器编码（4G模块ID）">
          <el-input v-text="detailItem.controllerno" placeholder="群控器编码（4G模块ID）" />
        </el-form-item>
        <el-form-item label="端口号（分机号）">
          <el-input v-model="detailItem.port" :readonly="false" placeholder="端口号（分机号1-9之间的数）" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="detailItem.name" :readonly="false" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="detailItem.deviceno" :readonly="false" placeholder="设备编号" />
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="detailItem.model" :readonly="false" placeholder="设备型号" />
        </el-form-item>
        <el-form-item label="设备位置">
          <el-input v-model="detailItem.location" :readonly="false" placeholder="设备位置" />
        </el-form-item>
        <el-form-item label="设备转速">
          <el-input v-model="detailItem.speed" :readonly="false" placeholder="设备转速（0-999之间的数）" />
        </el-form-item>
        <el-form-item label="设备功率">
          <el-input v-model="detailItem.gonglv" :readonly="false" placeholder="设备功率（0-9999之间的数）" />
        </el-form-item>
        <el-form-item label="设备创建时间">
          <el-input v-text="detailItem.createtimeStr" placeholder="设备创建时间" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="detailVisible=false">取消</el-button>
        <el-button type="success" @click="commitAction">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchDevicesInPond, DeleteDeviceById, EditDeviceInfo } from '@/api/fishpond'
import { parseTime } from '@/utils/index'

export default {
  name: 'DevicesInPond',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      detailVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        pondid: ''
      },
      deviceItem: {
        deviceid: '',
        deviceno: '',
        pondid: '',
        pondname: '',
        name: '',
        model: '',
        status: '',
        level: '',
        longitude: '',
        latitude: '',
        x: '',
        y: '',
        location: '',
        devicetype: '',
        controllerid: '',
        controllerno: '',
        customno: '',
        port: '',
        createtime: '',
        speed: '',
        gonglv: ''
      },
      detailItem: {
        deviceid: '',
        deviceno: '',
        pondid: '',
        pondname: '',
        name: '',
        model: '',
        status: '',
        level: '',
        longitude: '',
        latitude: '',
        x: '',
        y: '',
        location: '',
        devicetype: '',
        controllerid: '',
        controllerno: '',
        customno: '',
        port: '',
        createtime: '',
        speed: '',
        gonglv: '',
        createtimeStr: ''
      }
    }
  },
  watch: {
    '$route'(to, from) {
      this.listQuery.pondid = this.$route.query.id
      console.log('this.$route.query.id' + this.$route.query.id)
      this.fetchList()
    }
  },
  created() {
    if (this.$route.query) {
      this.listQuery.pondid = this.$route.query.id
    }
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.token = sessionStorage.getItem('token')
      FetchDevicesInPond(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(item) {
      console.log('删除 !!!!')
      this.$confirm('是否删除该条记录? 注：执行此操作，【设备分组】和【设备列表】中的该设备记录均会删除，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.deviceid,
          token: sessionStorage.getItem('token')
        }
        DeleteDeviceById(data).then(response => {
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
    showDeviceDetail(item) {
      this.detailItem.deviceid = item.deviceid
      this.detailItem.deviceno = item.deviceno
      this.detailItem.pondid = item.pondid
      this.detailItem.pondname = item.pondname
      this.detailItem.name = item.name
      this.detailItem.model = item.model
      this.detailItem.status = item.status
      this.detailItem.level = item.level
      this.detailItem.longitude = item.longitude
      this.detailItem.latitude = item.latitude
      this.detailItem.x = item.x
      this.detailItem.y = item.y
      this.detailItem.location = item.location
      this.detailItem.devicetype = item.devicetype
      this.detailItem.controllerid = item.controllerid
      this.detailItem.controllerno = item.controllerno
      this.detailItem.customno = item.customno
      this.detailItem.port = item.port
      this.detailItem.createtime = item.createtime
      this.detailItem.speed = item.speed
      this.detailItem.gonglv = item.gonglv
      this.detailItem.createtimeStr = parseTime(item.createtime, '{y}/{m}/{d} {h}:{i}:{s}')
      this.detailVisible = true
    },
    commitAction() {
      const params = this.detailItem
      params.token = sessionStorage.getItem('token')
      var data = JSON.stringify(params)
      EditDeviceInfo(data).then(response => {
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
      this.listQuery.page = 1
      this.fetchList()
    }
  }
}
</script>
