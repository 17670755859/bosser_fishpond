<template>
  <div class="app-container">
    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="鱼塘名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="所属渔民">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="鱼塘编号">
        <template slot-scope="scope">
          <span>{{ scope.row.pondno }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="面积">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="420px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="editDetail(scope.row)"
          >
            编辑/查看
          </el-button>
          <el-button
            type="success"
            size="small"
            icon="el-icon-view"
            @click="showDevices(scope.row)"
          >
            查看设备
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            从组中移除
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
    <el-dialog :visible.sync="detailVisible" :title="'编辑/查看鱼塘'">
      <el-form :model="detailItem" label-width="150px" label-position="left">
        <el-form-item label="鱼塘ID">
          <el-input v-text="detailItem.id" placeholder="鱼塘ID" />
        </el-form-item>
        <!--<el-form-item label="所属渔民ID">
          <el-input v-text="detailItem.userid" placeholder="所属渔民ID" />
        </el-form-item>-->
        <el-form-item label="所属渔民">
          <el-input v-text="detailItem.username" placeholder="所属渔民" />
        </el-form-item>
        <el-form-item label="鱼塘名称">
          <el-input v-model="detailItem.name" :readonly="false" placeholder="鱼塘名称" />
        </el-form-item>
        <el-form-item label="鱼塘编号">
          <el-input v-model="detailItem.pondno" :readonly="false" placeholder="鱼塘编号" />
        </el-form-item>
        <el-form-item label="鱼塘面积">
          <el-input v-model="detailItem.area" :readonly="false" placeholder="鱼塘面积" />
        </el-form-item>
        <el-form-item label="鱼塘位置">
          <el-input v-model="detailItem.location" :readonly="false" placeholder="鱼塘位置" />
        </el-form-item>
        <el-form-item label="鱼塘创建时间">
          <el-input v-text="detailItem.createtimeStr" placeholder="鱼塘创建时间" />
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
import { FetchPondsInGroup, DeleteFishpondFromGroupById, EditPondInfo } from '@/api/fishpond'
import { parseTime } from '@/utils/index'

export default {
  name: 'FishPondsInPondGroup',
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
        pondgroupid: ''
      },
      fondItem: {
        id: '',
        pondno: '',
        name: '',
        area: '',
        location: '',
        userid: '',
        username: '',
        longitude: '',
        latitude: '',
        groupid: '',
        createtime: ''
      },
      detailItem: {
        id: '',
        pondno: '',
        name: '',
        area: '',
        location: '',
        userid: '',
        username: '',
        longitude: '',
        latitude: '',
        groupid: '',
        createtime: '',
        createtimeStr: ''
      }
    }
  },
  watch: {
    '$route'(to, from) {
      this.listQuery.pondgroupid = this.$route.query.id
      console.log('this.$route.query.id' + this.$route.query.id)
      this.fetchList()
    }
  },
  created() {
    if (this.$route.query) {
      this.listQuery.pondgroupid = this.$route.query.id
    }
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.token = sessionStorage.getItem('token')
      FetchPondsInGroup(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    editDetail(item) {
      this.detailItem.id = item.id
      this.detailItem.pondno = item.pondno
      this.detailItem.name = item.name
      this.detailItem.area = item.area
      this.detailItem.location = item.location
      this.detailItem.userid = item.userid
      this.detailItem.username = item.username
      this.detailItem.longitude = item.longitude
      this.detailItem.groupid = item.groupid
      this.detailItem.createtime = item.createtime
      this.detailItem.createtimeStr = parseTime(item.createtime, '{y}/{m}/{d} {h}:{i}:{s}')
      this.detailVisible = true
    },
    showDevices(item) {
      this.$router.push({ name: 'DevicesInPond', query: { id: item.id }})
    },
    handleDelete(item) {
      console.log('删除 !!!!')
      this.$confirm('是否将鱼塘从该分组中移除？注：执行此操作不会删除【鱼塘列表】下的该记录，请知晓', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.id,
          groupid: this.listQuery.groupid,
          token: sessionStorage.getItem('token')
        }
        DeleteFishpondFromGroupById(data).then(response => {
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
    commitAction() {
      const params = this.detailItem
      params.token = sessionStorage.getItem('token')
      var data = JSON.stringify(params)
      EditPondInfo(data).then(response => {
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
