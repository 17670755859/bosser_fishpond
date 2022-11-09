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
        placeholder="标题"
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
      <el-table-column min-width="180px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="链接">
        <template slot-scope="scope">
          <a :href="scope.row.linkurl">{{ scope.row.linkurl }}</a>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="顺序">
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgurl" style="min-width: 50px; min-height: 50px; max-width: 150px; max-height: 150px;">
        </template>
      </el-table-column>
       <el-table-column min-width="80px" align="center" label="尺寸">
        <template slot-scope="scope">
          <span>750*1334</span>
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
        <el-form-item label="备注">
          <el-input v-model="additem.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="additem.linkurl" placeholder="链接" />
        </el-form-item>
        <el-form-item label="显示排序">
          <el-input v-model="additem.sequence" placeholder="显示排序" />
        </el-form-item>
        <el-form-item label="图片选择">
          <div>合适尺寸（500*300）</div>
          <input id="uploadFileBtnId" ref="uploadFileBtnRef" style="margin-left: 0px;" type="file" @change="handleUpload">
        </el-form-item>
        <el-form-item style="text-align: center; background: #ffffff">
          <span v-show="additem.img !== '' && additem.img !== null && additem.img !== undefined">
            <img :src="additem.img" style="margin-right: 100px; min-width: 300px; min-height: 300px; max-width: 400px; max-height: 400px;">
          </span>
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
import { FetchBanners, AddBanner, DeleteBannerById, UpdateBanner, UploadMedia } from '@/api/fishpond'

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
        img: '',
        remark: '',
        sequence: '',
        linkurl: '',
        title: '',
        width: '',
        height: ''
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async handleUpload() {
      var that = this
      const inputFile = await this.$refs.uploadFileBtnRef.files[0]
      if (inputFile === null || inputFile === undefined) { // 点击的取消
        this.additem.img = null
        return
      }
      this.inputFileInAdd = inputFile

      const fileSizeLt = this.inputFileInAdd.size/1024/1024 > 2 ;
      if(fileSizeLt){
        this.$message({
          type: 'error',
          message: '上传图片请小于2MB大小'
        })
        return;
      }
      if (this.inputFileInAdd) {
        const tempInputFile = this.inputFileInAdd
        if (tempInputFile.type !== 'image/jpeg' && tempInputFile.type !== 'image/png' && tempInputFile.type !== 'image/gif') {
          alert('不是有效的图片文件！')
          return
        }
        this.addimginfo = Object.assign({}, this.addimginfo, {
          name: inputFile.name,
          size: inputFile.size
        })
        const reader = new FileReader()
        var img = new Image()
        reader.readAsDataURL(this.inputFileInAdd)
        reader.onloadend = async function() {
          img.src = reader.result
          img.onload = function(result) {
            that.additem.width = this.width
            that.additem.height = this.height
          }
          if(!that.additem.id) { // 添加
            that.additem.img = reader.result
          } else { // 编辑
            that.additem.img = await that.fetchImg(reader.result)
          }
        }
      }
    },
    // 上传图片
    async fetchImg(base64) {
      return new Promise(resolve => {
        UploadMedia({
          content: base64,
          mediatype: 0
        }).then(response => {
          resolve(response.data)
        })
      })
    },
    fetchList() {
      this.listQuery.token = sessionStorage.getItem('token')
      this.listLoading = true
      FetchBanners(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 新增
    handleAdd() {
      this.dialogVisibleAdd = true
      this.additem = {
        id: '',
        linkurl: '',
        img: '',
        remark: '',
        sequence: '',
        title: '',
        width: '',
        height: ''
      }
    },
    // 编辑
    editHandler(e) {
      this.additem = Object.assign(e, { img: e.imgurl })
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
        DeleteBannerById(data).then(response => {
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
      this.additem.token = sessionStorage.getItem('token')
      if (this.additem.img === '' || this.additem.img === null || this.additem.img === undefined) {
        this.$message({
          type: 'error',
          message: '图片为必选项'
        })
        return
      }
      if(this.additem.id) { // 修改
        let data = Object.assign(this.additem, { imageurl: this.additem.img })
        let query = JSON.stringify(data)
        UpdateBanner(query).then(response => {
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
        let data = JSON.stringify(this.additem)
        AddBanner(data).then(response => {
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
