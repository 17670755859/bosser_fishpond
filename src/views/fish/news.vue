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
        v-model="listQuery.title"
        placeholder="标题关键字"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:0px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-select
        v-model="type_option_selected.type"
        placeholder="类型"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in type_options"
          :key="item.type"
          :label="item.name"
          :value="item.type"
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
      <el-table-column min-width="180px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="100px" align="center" label="链接">
        <template slot-scope="scope">
          <a :href="scope.row.linkurl">{{ scope.row.linkurl }}</a>
        </template>
      </el-table-column> -->
      <el-table-column min-width="100px" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="首页是否显示">
        <template slot-scope="scope">
          <span>{{ scope.row.showindex | stringForNewsShowIndex() }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | stringForNewsType() }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createts | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editHandler(scope.row)"
          >
            编辑
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

    <el-dialog :visible.sync="dialogVisibleAdd" :title="'新增'">
      <el-form :model="additem" label-width="150px" label-position="left">
        <el-form-item label="标题">
          <el-input v-model="additem.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="additem.remark" placeholder="内容" />
        </el-form-item>
        <!-- <el-form-item label="链接">
          <el-input v-model="additem.linkurl" placeholder="链接" />
        </el-form-item> -->
        <el-form-item label="排序">
          <el-input v-model="additem.sequence" placeholder="排序" />
        </el-form-item>
        <el-form-item label="首页是否显示">
          <el-checkbox v-model="additem.showindex" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="add_type_option_selected.type"
            placeholder="类型"
            style="margin-left:0px;width: 160px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
            @clear="handleFilter"
          >
            <el-option
              v-for="item in type_options"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
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
import { FetchNews, AddNews, DeleteNewsById, Editnews } from '@/api/fishpond'

export default {
  name: 'News',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      type_options: [
        {
          type: '1',
          name: '行业网站'
        },
        {
          type: '2',
          name: '行业新闻'
        },
        {
          type: '3',
          name: '行业动态'
        }
      ],
      type_option_selected: {
        type: '',
        name: ''
      },
      add_type_option_selected: {
        type: '',
        name: ''
      },
      dialogVisibleAdd: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        type: ''
      },
      additem: {
        id: '',
        linkurl: '',
        title: '',
        remark: '',
        sequence: '',
        showindex: '',
        type: ''
      },
      item: {
        newsid: '',
        linkurl: '',
        title: '',
        remark: '',
        sequence: '',
        showindex: '',
        type: '',
        createts: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listQuery.token = sessionStorage.getItem('token')
      this.listQuery.type = this.type_option_selected.type
      this.listLoading = true
      FetchNews(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogVisibleAdd = true
    },
    // 编辑
    editHandler(item) {
      this.dialogVisibleAdd = true
      this.additem = item
      this.additem.showindex = this.additem.showindex == 1
      this.add_type_option_selected.type = item.type
      console.log(item)
    },
    // 删除
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
        DeleteNewsById(data).then(response => {
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
    },
    confirmAdd() {
      console.log('confirmAdd')
      this.additem.token = sessionStorage.getItem('token')
      this.additem.type = this.add_type_option_selected.type
      this.additem.showindex = this.additem.showindex ? '1' : '0'
      var data = JSON.stringify(this.additem)
      if(this.additem.id) {
        Editnews(data).then(response => {
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
      } else {
        AddNews(data).then(response => {
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
}
</script>
