<template>
  <div class="app-container">
    <!--    <div class="filter-container">-->
    <!--      <el-button-->
    <!--        v-waves-->
    <!--        class="filter-item"-->
    <!--        style="margin-left: 0px;"-->
    <!--        type="primary"-->
    <!--        icon="el-icon-plus"-->
    <!--        @click="handleAdd"-->
    <!--      >-->
    <!--        {{ '登记' }}-->
    <!--      </el-button>-->
    <!--    </div>-->
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
        v-model="listQuery.name"
        placeholder="姓名"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <!--      <el-input-->
      <!--        v-model="listQuery.idcard"-->
      <!--        placeholder="身份证"-->
      <!--        clearable-->
      <!--        prefix-icon="el-icon-search"-->
      <!--        style="margin-left:20px;width: 300px"-->
      <!--        class="filter-item"-->
      <!--        @keyup.enter.native="handleFilter"-->
      <!--        @clear="handleFilter"-->
      <!--      />-->
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
      <el-table-column min-width="80px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="房间号">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="客户照片">
        <template slot-scope="scope">
          <img :src="scope.row.url" style="min-width: 100px; min-height: 100px; max-width: 150px; max-height: 150px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户姓名" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column min-width="150px" align="center" label="客户电话">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.tel }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" min-width="180px" label="身份证号">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.idcard }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" min-width="180px" label="登记时间">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="截止时间">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime | parseTime("{y}/{m}/{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row | stringForStatus() }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="240px">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.status === 1"
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-show="scope.row.status === 1"
            type="success"
            size="small"
            @click="handleChangeRoom(scope.row)"
          >
            换房
          </el-button>
          <el-button
            v-show="scope.row.status === 1"
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            退房
          </el-button>
          <el-button
            v-show="scope.row.status === 2"
            type="success"
            size="small"
            @click="Repeat(scope.row.personid)"
          >
            重新同步
          </el-button>
          <label v-show="scope.row.status === 0">
            暂不能操作
          </label>
          <el-button
            v-show="scope.row.status === 2"
            style="margin-left: 10px"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleForceDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
        <!--        旧逻辑-->
        <!--        <template slot-scope="scope">-->
        <!--                  <label-->
        <!--                    v-show="scope.row.status === 1 || scope.row.status === 4 || scope.row.status === 7 || scope.row.status === 10 || scope.row.status === 14 || scope.row.status === 15"-->
        <!--                  >-->
        <!--                    暂不能操作-->
        <!--                  </label>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 2 || scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 8"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            icon="el-icon-edit"-->
        <!--            @click="handleEdit(scope.row)"-->
        <!--          >-->
        <!--            编辑-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 3"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleRepeatRecognize(scope.row.id)"-->
        <!--          >-->
        <!--            重新识别-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 6"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleRepeatAddFace(scope.row.id)"-->
        <!--          >-->
        <!--            重新同步-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 13"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleRepeatChangeRoom(scope.row.id)"-->
        <!--          >-->
        <!--            重试-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 12"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleRepeatDelete(scope.row.id)"-->
        <!--          >-->
        <!--            重试-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 2 || scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 8"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleChangeRoom(scope.row)"-->
        <!--          >-->
        <!--            换房-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 9 || scope.row.status === 16"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            icon="el-icon-delete"-->
        <!--            @click="handleDeleteOld(scope.row.id)"-->
        <!--          >-->
        <!--            重新删除原房间数据-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 9 || scope.row.status === 16"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleIgnoreOldData(scope.row.id)"-->
        <!--          >-->
        <!--            忽略原房间数据-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 5 || scope.row.status === 8"-->
        <!--            type="danger"-->
        <!--            size="small"-->
        <!--            icon="el-icon-delete"-->
        <!--            @click="handleDelete(scope.row.id)"-->
        <!--          >-->
        <!--            退房-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 13"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleCancelChangeRoom(scope.row.id)"-->
        <!--          >-->
        <!--            取消换房-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            v-show="scope.row.status === 12"-->
        <!--            type="success"-->
        <!--            size="small"-->
        <!--            @click="handleCancelDelete(scope.row.id)"-->
        <!--          >-->
        <!--            取消退房-->
        <!--          </el-button>-->
        <!--                  <el-button-->
        <!--                    v-show="scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 6 || scope.row.status === 11 || scope.row.status === 12"-->
        <!--                    type="danger"-->
        <!--                    size="small"-->
        <!--                    icon="el-icon-delete"-->
        <!--                    @click="handleForceDelete(scope.row.id)"-->
        <!--                  >-->
        <!--                    删除-->
        <!--                  </el-button>-->
        <!--        </template>-->

      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchList"
    />

    <el-dialog :visible.sync="dialogVisibleEdit" :title="'编辑'">
      <el-form :model="edititem" label-width="150px" label-position="left">
        <el-form-item label="客户姓名">
          <el-input v-model="edititem.name" placeholder="客户姓名" />
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input v-model="edititem.tel" placeholder="客户电话" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="edititem.idcard" placeholder="身份证号" />
        </el-form-item>
        <el-form-item label="登记时间">
          <el-date-picker v-model="edititem.starttime" type="datetime" style="margin-left: 0px; min-width: 200px" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="edititem.endtime" type="datetime" style="margin-left: 0px; min-width: 200px" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleChangeRoom" :title="'更换房间'">
      <el-form :model="changeroomitem" label-width="150px" label-position="left">
        <el-form-item label="当前房间号">
          <el-input placeholder="当前房间号" v-text="changeroomitemroomid" />
        </el-form-item>
        <el-form-item label="新房间号">
          <el-select
            v-model="room_item_selected.roomid"
            placeholder="房间列表"
            clearable
            style="margin-left:0px;width: 160px"
            class="filter-item"
          >
            <el-option
              v-for="item in room_options"
              :key="item.id"
              :label="item.roomid"
              :value="item.roomid"
            />
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-left: 10px;"
            @click="handleAddRoom"
          >
            新增房间
          </el-button>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleChangeRoom=false">取消</el-button>
        <el-button type="primary" @click="confirmChangeRoom">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Repeat, DeleteOldDataById, IgnoreOldData, RepeatChangeRoomById, CancelChangeRoom, FetchMemberList, EditMemberRequest, FetchAllRoomList, DeleteMemberById, RepeatAddFaceById, ForceDeleteMemberById, RepeatRecognizeById, RepeatDeleteMemberById, CancelDeleteMemberById } from '@/api/face'

export default {
  name: 'MemberList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      room_item_selected: {
        id: undefined,
        roomid: undefined,
        hotelid: undefined
      },
      room_item: {
        id: undefined,
        roomid: undefined,
        hotelid: undefined
      },
      room_options: [],
      dialogVisibleEdit: false,
      dialogVisibleChangeRoom: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        hotelid: '',
        roomid: '',
        name: '',
        idcard: ''
      },
      edititem: {
        id: undefined,
        roomid: '',
        hotelid: '',
        name: '',
        idcard: '',
        tel: '',
        starttime: undefined,
        endtime: undefined
      },
      changeroomitemroomid: '',
      changeroomitem: {
        id: undefined,
        roomid: '',
        hotelid: '',
        name: '',
        idcard: '',
        tel: '',
        starttime: undefined,
        endtime: undefined
      },
      intervalId: null
    }
  },
  created() {
    this.fetchList()
    console.log('created')
    var hotelid = sessionStorage.getItem('hotelid')
    FetchAllRoomList(hotelid).then(response => {
      this.room_options = response.data.items
    })
    // this.dataRefreh()
  },
  destroyed() {
    // this.clear()
  },
  methods: {

    // 定时刷新数据函数
    // dataRefreh() {
    //   // 计时器正在进行中，退出函数
    //   if (this.intervalId != null) {
    //     return
    //   }
    //   // 计时器为空，操作
    //   this.intervalId = setInterval(() => {
    //     console.log('刷新' + new Date())
    //     this.fetchList()// 加载数据函数
    //   }, 5000)
    // },
    // // 停止定时器
    // clear() {
    //   clearInterval(this.intervalId) // 清除计时器
    //   this.intervalId = null // 设置为null
    // },
    fetchList() {
      this.listQuery.hotelid = sessionStorage.getItem('hotelid')
      this.listLoading = true
      FetchMemberList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push('/dashboard/add')
    },
    handleChangeRoom(item) {
      console.log('更换房间 !!!!')
      this.dialogVisibleChangeRoom = true
      this.changeroomitem = JSON.parse(JSON.stringify(item))
      this.changeroomitemroomid = this.changeroomitem.roomid
      this.changeroomitem.starttime = new Date(item.starttime * 1000)
      this.changeroomitem.endtime = new Date(item.endtime * 1000)
      this.room_item_selected = {
        id: undefined,
        roomid: undefined,
        hotelid: undefined
      }
    },
    handleEdit(item) {
      console.log('编辑 !!!!')
      this.edititem = JSON.parse(JSON.stringify(item))
      this.edititem.starttime = new Date(item.starttime * 1000)
      this.edititem.endtime = new Date(item.endtime * 1000)
      this.dialogVisibleEdit = true
    },
    handleFilter() {
      this.fetchList()
    },
    confirmEdit() {
      if (this.edititem.roomid === null || this.edititem.roomid === undefined || this.edititem.roomid === '') {
        this.$message({
          type: 'error',
          message: '房间号为必填项'
        })
        return
      }
      if (this.edititem.starttime === null || this.edititem.starttime === undefined || this.edititem.starttime === '') {
        this.$message({
          type: 'error',
          message: '入住时间为必填项'
        })
        return
      }
      if (this.edititem.endtime === null || this.edititem.endtime === undefined || this.edititem.endtime === '') {
        this.$message({
          type: 'error',
          message: '退房时间为必填项'
        })
        return
      }
      if (this.edititem.name === null || this.edititem.name === undefined || this.edititem.name === '') {
        this.$message({
          type: 'error',
          message: '姓名为必填项'
        })
        return
      }
      // if (this.edititem.tel === null || this.edititem.tel === undefined) {
      //   this.$message({
      //     type: 'error',
      //     message: '手机号为必填项'
      //   })
      //   return
      // }
      // if (this.edititem.idcard === null || this.edititem.idcard === undefined) {
      //   this.$message({
      //     type: 'error',
      //     message: '身份证号为必填项'
      //   })
      //   return
      // }
      var commitItem = {
        id: undefined,
        roomid: '',
        hotelid: '',
        name: '',
        idcard: '',
        tel: undefined,
        starttime: undefined,
        endtime: undefined,
        token: ''
      }
      commitItem.id = this.edititem.id
      commitItem.hotelid = sessionStorage.getItem('hotelid')
      commitItem.token = sessionStorage.getItem('token')
      commitItem.roomid = this.edititem.roomid
      commitItem.starttime = '' + new Date(this.edititem.starttime).getTime()
      commitItem.endtime = '' + new Date(this.edititem.endtime).getTime()
      commitItem.name = this.edititem.name
      commitItem.tel = this.edititem.tel
      commitItem.idcard = this.edititem.idcard
      var data = JSON.stringify(commitItem)
      EditMemberRequest(data).then(response => {
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
    handleAddRoom() {
      this.dialogVisibleChangeRoom = false
      this.$router.push({ name: 'RoomList', query: { }})
    },
    handleRepeatRecognize(id) {
      console.log('重新识别 !!!!')
      RepeatRecognizeById(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleDeleteOld(id) {
      console.log('删除旧设备信息 !!!!')
      DeleteOldDataById(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleRepeatAddFace(id) {
      console.log('重新同步 !!!!')
      RepeatAddFaceById(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleCancelChangeRoom(id) {
      console.log('取消换房 !!!!')
      CancelChangeRoom(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleIgnoreOldData(id) {
      console.log('忽略旧数据 !!!!')
      IgnoreOldData(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    Repeat(id) {
      console.log('重试 !!!!')
      const para = {
        personid: id,
        t: new Date().getTime()
      }
      Repeat(para).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleDelete(id) {
      console.log('退房 !!!!')
      this.$confirm('是否申请退房', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('退房 !!!!')
        const para = {
          id: id,
          t: new Date().getTime(),
          token: sessionStorage.getItem('token')
        }
        DeleteMemberById(para).then(response => {
          this.fetchList()// 加载数据函数
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
    handleCancelDelete(id) {
      console.log('取消退房 !!!!')
      CancelDeleteMemberById(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleRepeatDelete(id) {
      console.log('重试退房 !!!!')
      RepeatDeleteMemberById(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleRepeatChangeRoom(id) {
      console.log('重试换房 !!!!')
      RepeatChangeRoomById(id).then(response => {
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    },
    handleForceDelete(id) {
      console.log('删除 !!!!')
      this.$confirm('是否强行删除该条记录，该操作将忽略人脸识别设备上是否有该记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('删除 !!!!')
        const para = {
          id: id,
          t: new Date().getTime(),
          token: sessionStorage.getItem('token')
        }
        ForceDeleteMemberById(para).then(response => {
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
    confirmChangeRoom() {
      if (this.room_item_selected.roomid === null || this.room_item_selected.roomid === undefined || this.room_item_selected.roomid === '') {
        this.$message({
          type: 'error',
          message: '房间号为必填项'
        })
        return
      }
      if (this.room_item_selected.roomid === this.changeroomitem.roomid) {
        this.$message({
          type: 'error',
          message: '房间号当前没有变化'
        })
        return
      }
      var commitItem = {
        id: undefined,
        roomid: '',
        hotelid: '',
        name: '',
        idcard: '',
        tel: undefined,
        starttime: undefined,
        endtime: undefined,
        token: ''
      }
      commitItem.id = this.changeroomitem.id
      commitItem.hotelid = sessionStorage.getItem('hotelid')
      commitItem.token = sessionStorage.getItem('token')
      commitItem.roomid = this.room_item_selected.roomid
      commitItem.starttime = '' + new Date(this.changeroomitem.starttime).getTime()
      commitItem.endtime = '' + new Date(this.changeroomitem.endtime).getTime()
      commitItem.name = this.changeroomitem.name
      commitItem.tel = this.changeroomitem.tel
      commitItem.idcard = this.changeroomitem.idcard
      var data = JSON.stringify(commitItem)
      EditMemberRequest(data).then(response => {
        this.dialogVisibleChangeRoom = false
        this.fetchList()// 加载数据函数
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
