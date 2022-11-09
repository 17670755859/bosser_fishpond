<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="标题关键字"
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
      <el-table-column width="100px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" label="温度">
        <template slot-scope="scope">
          <span>{{ scope.row.temperature }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" label="溶解氧">
        <template slot-scope="scope">
          <span>{{ scope.row.dovalue }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" label="PH值">
        <template slot-scope="scope">
          <span>{{ scope.row.phvalue }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="测量日期" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.measuredate | parseTime("{y}/{m}/{d}")}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="测量时间" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.measuretime | parseTime("{h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="渔民">
        <template slot-scope="scope">
          <span>{{ scope.row.bossname }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createts | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="140px">
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
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchWaterQualityRecords, DeleteWaterQualityRecord } from '@/api/fishpond'

export default {
  name: 'WaterQualityRecord',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: ''
      },
      item: {
        id: '',
        title: '',
        weather: '',
        measuredate: '',
        measuretime: '',
        changewaterquantity: '',
        phvalue: '',
        dovalue: '',
        salinity: '',
        temperature: '',
        bossid: '',
        userid: '',
        createts: ''
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
      FetchWaterQualityRecords(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
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
        DeleteWaterQualityRecord(data).then(response => {
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
      this.listQuery.page = 1
      this.fetchList()
    }
  }
}
</script>
