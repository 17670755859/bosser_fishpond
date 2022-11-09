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

    <el-table ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="60px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="180px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column> -->
      <el-table-column min-width="100px" align="center" label="链接">
        <template slot-scope="scope">
          <a :href="scope.row.videourl">{{ scope.row.videourl }}</a>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="顺序">
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.previewurl" style="min-width: 50px; min-height: 50px; max-width: 150px; max-height: 150px;">
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
            icon="el-icon-delete"
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
        <el-form-item label="显示排序">
          <el-input v-model="additem.sequence" placeholder="显示排序" />
        </el-form-item>

        <el-form-item label="上传PDF">
          <input id="uploadFileBtnId" ref="uploadFileBtnRef2" style="margin-left: 0px;" type="file" @change="handleUploadFile">
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
import { GethelPfile, AddhelpFile, RemovehelpFile, UpdatehelpFile, UploadMedia } from '@/api/fishpond'

export default {
  name: 'Banners',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogVisibleAdd: false,
      list: null,
      img: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: ''
      },
      additem: {
        id: '',
        linkurl: '',
        sequence: '',
        title: ''
      },
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async handleUploadFile() {
      let that = this;
      const inputFile = await this.$refs.uploadFileBtnRef2.files[0]
      if (inputFile === null || inputFile === undefined) { // 点击的取消
        this.additem.linkurl = null
        return
      }
      this.inputFileInAdd = inputFile

      const fileSizeLt = this.inputFileInAdd.size/1024/1024 > 100 ;
      if(fileSizeLt){
        this.$message({
          type: 'error',
          message: '上传视频请小于100MB大小'
        })
        return;
      }
      if (this.inputFileInAdd) {
        const tempInputFile = this.inputFileInAdd
        console.log(tempInputFile.type)
        if (tempInputFile.type !== 'application/pdf') {
          alert('不是有效的PDF文件！')
          return
        }
        this.addimginfo = Object.assign({}, this.addimginfo, {
          name: inputFile.name,
          size: inputFile.size
        })
        const reader = new FileReader()
        reader.readAsDataURL(this.inputFileInAdd)
        reader.onloadend = async function() {
          let res = await that.UploadFiles(reader.result, 2)
          that.additem.linkurl = res
        }
      }
    },
    // 上传视频
    UploadFiles(base64Url, type) {
      return new Promise(resove => {
        UploadMedia(
          {
            mediatype: type,
            content: base64Url
          }
        ).then(response => {
          resove(response.data.mediaurl)
        })
      })
    },
    fetchList() {
      this.listQuery.token = 'admin'
      this.listLoading = true
      GethelPfile(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 新增
    handleAdd() {
      this.dialogVisibleAdd = true
      this.additem = {
        linkurl: '',
        sequence: '',
        title: ''
      }
    },
    // 编辑
    editHandler(e) {
      this.additem = e
      this.dialogVisibleAdd = true
    },
    handleDelete(item) {
      this.$confirm('是否删除该条记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const data = {
          id: item.id,
          token: sessionStorage.getItem('token')
        }
        RemovehelpFile(data).then(response => {
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
      this.additem.token = 'admin'
      if (this.additem.linkurl === '' || this.additem.linkurl === null || this.additem.linkurl === undefined) {
        this.$message({
          type: 'error',
          message: '视频必传'
        })
        return
      }
      var data = JSON.stringify(this.additem)
      if(this.additem.id) {
        UpdatehelpFile(data).then(response => {
          this.$notify({
            title: '修改成功',
            type: 'success',
            message: '操作成功',
            duration: 2000
          })
          location.reload()
        }).catch(err => {
          console.log(err)
        })
      } else {
        AddhelpFile(data).then(response => {
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
