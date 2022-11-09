<template>
  <div class="container" style="min-height: 1080px">
    <div class="filter-container" align="center">
      <div style="width: 560px; background-color: #fff">
        <el-form :model="item" style="margin-left: 30px; margin-right: 30px; margin-top: 30px;" label-width="1px" label-position="left">
          <el-form-item label="" align="left">
            <el-input placeholder="" style="color: #F00; ;font-size: 10px; margin-left: 30px; min-width: 200px" v-text="'注意：请上传.tar.gz格式的资源压缩包（内含有images目录和persons.xlsx文件）'" />
            <input id="uploadFileBtnIdInAdd" ref="uploadFileBtnRefInAdd" style="margin-left: 30px;" align="left" type="file" @change="handleUploadInAdd">
          </el-form-item>
          <el-form-item label="">
            <el-button
              v-waves
              class="filter-item"
              style="min-width: 210px;"
              type="primary"
              @click="onBack"
            >
              {{ '返回列表' }}
            </el-button>
            <el-button
              v-waves
              class="filter-item"
              style="min-width: 210px; margin-left: 20px"
              type="primary"
              @click="onCommit"
            >
              {{ '批量导入' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="showResult" style="margin-left: 10px">
      {{ parseInt(this.responseitem.rowcount) === this.total ? '共处理了' + this.responseitem.rowcount + '条记录' : '正在处理第' + (this.total + 1) + '条/共' + this.responseitem.rowcount + '条记录' }}
    </div>
    <br>
    <el-table v-if="showResult" ref="dragTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="80px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="图片名称">
        <template slot-scope="scope">
          <span>{{ scope.row.imagename }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{ scope.row.hotelid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="房间号">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户姓名" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" label="登记时间">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="140px" label="截止时间">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" min-width="180px" label="处理结果">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import waves from '@/directive/waves'
import { MultiAddMemberRequest, FetchMultiAddMemberLogsRequest } from '@/api/face'
import BMF from 'browser-md5-file'

export default {
  name: 'MultiAddMember',
  directives: { waves },
  data() {
    return {
      showResult: false,
      inputFileInAdd: undefined,
      addimginfo: undefined,
      item: {
      },
      responseitem: {
        rowcount: '0',
        taskid: '',
        hotelid: ''
      },
      fileData: undefined,
      md5: '',
      fileName: '',
      list: null,
      listLoading: false,
      intervalId: null,
      total: 0
    }
  },
  watch: {
    '$route': 'reloadD'
  },
  mounted() {
    console.log('mounted')
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  created() {
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  },
  destroyed() {
    this.clear()
  },
  methods: {
    // 定时刷新数据函数
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        console.log('刷新' + new Date())
        this.fetchList()// 加载数据函数
      }, 1000)
    },
    // 停止定时器
    clear() {
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    },
    fetchList() {
      this.responseitem.hotelid = sessionStorage.getItem('hotelid')
      FetchMultiAddMemberLogsRequest(this.responseitem).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.total === parseInt(this.responseitem.rowcount)) { // 获取到全部，销毁定时器
          this.clear()
        }
      })
    },
    async getBrowserFileMd5(file, progressCallBack, md5CallBack) {
      const bmf = new BMF()
      bmf.md5(
        file,
        (err, md5) => {
          md5CallBack(err, md5)
        },
        progress => {
          progressCallBack(progress)
        }
      )
    },
    async handleUploadInAdd() {
      const inputFile = await this.$refs.uploadFileBtnRefInAdd.files[0]
      this.md5 = ''
      this.getBrowserFileMd5(inputFile, progress => {
        console.log('progress number:', progress)
      }, (err, md5) => {
        if (err === null) {
          console.log('md5 string:', md5)
          this.md5 = md5
          this.hFile(inputFile)
        } else {
          console.log('err:', err)
        }
      })
    },
    async hFile(inputFile) {
      var that = this
      this.inputFileInAdd = inputFile
      if (this.inputFileInAdd) {
        const tempInputFile = this.inputFileInAdd
        console.log(tempInputFile.type)
        if (tempInputFile.type !== 'application/x-gzip') {
          alert('无效的资源包')
          return
        }
        this.addimginfo = Object.assign({}, this.addimginfo, {
          name: inputFile.name,
          size: inputFile.size
        })
        this.fileName = inputFile.name
        const reader = new FileReader()
        reader.readAsDataURL(this.inputFileInAdd)
        reader.onloadend = function() {
          console.log('fileData base64 length = ' + reader.result.length)
          this.fileData = reader.result
        }
        reader.onload = function(e) {
          console.log('reader.onload e = ' + e.loaded + '/' + e.total)
          that.fileData = reader.result
        }
      }
    },
    onBack() {
      console.log('onBack')
      this.$router.push('/dashboard/list')
    },
    onCommit() {
      console.log('c hotel id = ', sessionStorage.getItem('hotelid'))
      if (this.fileData === null || this.fileData === undefined || this.fileData === '' || this.md5 === '') {
        this.$message({
          type: 'error',
          message: '请选择文件'
        })
        return
      }
      var commitItem = {
        hotelid: undefined,
        filesrc: undefined,
        token: '',
        md5: '',
        filename: undefined
      }
      commitItem.token = sessionStorage.getItem('token')
      commitItem.hotelid = sessionStorage.getItem('hotelid')
      commitItem.filesrc = this.fileData
      commitItem.md5 = this.md5
      commitItem.filename = this.fileName
      var data = JSON.stringify(commitItem)
      this.responseitem.rowcount = '0'
      this.total = 0
      this.list = null
      MultiAddMemberRequest(data).then(response => {
        this.responseitem = response.data
        this.showResult = true
        this.$notify({
          title: '提交成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        // 开始刷新列表
        this.dataRefreh()
      }).catch(err => {
        console.log('MultiAddMemberRequest err : ' + err)
      })
    },
    reloadD() {
      console.log(this.$route.path)
    }
  }
}

</script>
