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
      <el-table-column min-width="180px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="100px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column> -->
      <el-table-column min-width="100px" align="center" label="路由">
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
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createts | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-delete"
            @click="handleModify(scope.row)"
          >
            修改
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
        <!-- <el-form-item label="备注">
          <el-input v-model="additem.remark" placeholder="备注" />
        </el-form-item> -->
        <el-form-item label="路由">
          <el-input v-model="additem.linkurl" placeholder="路由地址" />
        </el-form-item>
        <el-form-item label="显示排序">
          <el-input v-model="additem.sequence" placeholder="显示排序" />
        </el-form-item>
        <el-form-item label="图片选择">
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
import { Addbreedingconfig, Delbreedingconfig, Getbreedingconfig, Updatebreedingconfig } from '@/api/fishpond'

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
        title: '',
      },
      checked: false,
      additem: {
        id: '',
        linkurl: '',
        img: '',
        remark: '',
        sequence: '',
        isvalid: "1",
        title: '',
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
      console.log('上传图片:' + inputFile)
      this.inputFileInAdd = inputFile
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
        reader.readAsDataURL(this.inputFileInAdd)
        reader.onloadend = function() {
          this.additem.img = reader.result
          // var strBase64 = reader.result.substring(0)
          // console.log('console ' + strBase64)
          // uploadImage(strBase64).then(response => {
          //   console.log(response)
          //   // const obj = JSON.parse(JSON.stringify(response))
          //   console.log('image url： ' + response.data)
          //   document.getElementById('text_pictureurladd').value = response.data
          //   // this.additem.chemicalformulaurl = '' + response.data //此代码错误
          // }).catch(err => {
          //   console.log('mmmm ' + err)
          // })
        }
        reader.onload = function(e) {
          that.additem.img = reader.result
        }
      }
    },
    fetchList() {
      this.listQuery.token = 'admin'
      this.listLoading = true
      Getbreedingconfig(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogVisibleAdd = true
    },
    // 删除
    handleDelete(item) {
      this.$confirm('是否删除该条记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const data = {
          id: item.id,
          username: 'admin',
          token: 'admin'
        }
        Delbreedingconfig(data).then(response => {
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
    // 修改
    handleModify(e) {
      this.additem = {
        id: e.id,
        linkurl: e.linkurl,
        img: e.imgurl,
        remark: e.remark,
        sequence: e.sequence,
        isvalid: "1",
        title: e.title,
      }
      this.dialogVisibleAdd = true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    },
    confirmAdd() {
      this.additem.token = 'admin';
      if (this.additem.img === '' || this.additem.img === null || this.additem.img === undefined) {
        this.$message({
          type: 'error',
          message: '图片为必选项'
        })
        return
      }
      var data = JSON.stringify(this.additem)
      if(this.additem.id) {
        Updatebreedingconfig(data).then(response => {
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
        Addbreedingconfig(data).then(response => {
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
