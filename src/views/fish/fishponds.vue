<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.pondname"
        placeholder="鱼塘名称"
        clearable
        prefix-icon="el-icon-search"
        style="width: 160px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.pondno"
        placeholder="鱼塘编号"
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
      <el-table-column align="center" min-width="140px" label="面积">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="340px">
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
import { FetchPonds, DeleteFishpondById, EditPondInfo } from '@/api/fishpond'
import { parseTime } from '@/utils/index'

export default {
  name: 'FishPonds',
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
        pondno: '',
        pondname: ''
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
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.token = sessionStorage.getItem('token')
      FetchPonds(this.listQuery).then(response => {
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
      this.$confirm('是否删除该条记录？注：执行此操作将同时删除【鱼塘分组】下的该鱼塘记录，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.id,
          token: sessionStorage.getItem('token')
        }
        DeleteFishpondById(data).then(response => {
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
