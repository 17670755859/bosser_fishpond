<template>
  <div class="container" style="min-height: 1080px">
    <div class="col-md-6" style="margin:0 auto; position: relative;">
      <div v-if="show_left_view" class="border" style="width: 550px; position: absolute; top:0; left:0px;">
        <vue-web-cam
          ref="webcam"
          :device-id="deviceId"
          style="margin-left: 25px;"
          width="500px"
          height="500px"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @cameras="onCameras"
          @camera-change="onCameraChange"
        />
        <div class="col-md-12" style="width: 550px; height: 160px; display: flex; align-items: center; justify-content: center;">
          <el-button
            v-waves
            class="filter-item"
            style="margin-left: 0px;"
            type="primary"
            @click="onCapture"
          >
            {{ '捕捉照片' }}
          </el-button>
        </div>
      </div>
      <div id="rightviewid" ref="rightviewref" style="left: 550px; min-height: 660px; position: absolute; top:0; right:0;" class="app-container">
        <el-form :model="item" style="margin-left: 10px; margin-right: 10px" label-width="100px" label-position="left">
          <el-form-item label="房间号*：" style="padding-top: 50px;">
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
          <el-form-item label="登记时间*：">
            <el-date-picker v-model="item.starttime" type="datetime" style="margin-left: 0px; min-width: 200px" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
          </el-form-item>
          <el-form-item label="截止时间*：">
            <el-date-picker v-model="item.endtime" type="datetime" style="margin-left: 0px; min-width: 200px" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
          </el-form-item>
          <el-form-item label="姓名*：">
            <el-input v-model="item.name" placeholder="姓名" style="margin-left: 0px; min-width: 200px" />
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="item.tel" placeholder="电话" style="margin-left: 0px; min-width: 200px" />
          </el-form-item>
          <el-form-item label="身份证：">
            <el-input v-model="item.idcard" placeholder="身份证" style="margin-left: 0px; min-width: 200px" />
          </el-form-item>
          <el-form-item label="照片*：">
            <el-input v-if="!show_left_view" placeholder="" style="color: #F00; ;font-size: 10px; margin-left: 0px; min-width: 200px" v-text="'注：点击【选择文件】按钮可从本地选择图片上传'" />
            <el-input v-if="show_left_view" placeholder="" style="color: #F00; ;font-size: 10px; margin-left: 0px; min-width: 200px" v-text="'注：点击左侧【捕捉照片】按钮可抓取当前照片, 点击【选择文件】按钮可从本地选择图片上传'" />
            <input id="uploadFileBtnIdInAdd" ref="uploadFileBtnRefInAdd" style="margin-left: 0px;" type="file" @change="handleUploadInAdd">
          </el-form-item>
          <el-form-item style="text-align: center; background: #ffffff">
            <span v-show="img !== null && img !== undefined">
              <img :src="img" style="margin-right: 100px; min-width: 300px; min-height: 300px; max-width: 400px; max-height: 400px;">
            </span>
          </el-form-item>
          <div style="text-align: center; padding-top: 30px;">
            <el-button
              v-waves
              class="filter-item"
              style="min-width: 180px;"
              type="primary"
              @click="onBack"
            >
              {{ '返回列表' }}
            </el-button>
            <el-button
              v-waves
              class="filter-item"
              style="min-width: 180px; margin-left: 20px"
              type="primary"
              @click="onCommit"
            >
              {{ '提交' }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import { WebCam } from 'vue-web-cam'
import waves from '@/directive/waves'
import { AddMemberRequest, FetchAllRoomList } from '@/api/face'
export default {
  name: 'AddMember',
  components: {
    'vue-web-cam': WebCam
  },
  directives: { waves },
  data() {
    return {
      show_left_view: false,
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
      addimginfo: null,
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
      isCameraStarted: false,
      item: {
        roomid: undefined,
        starttime: undefined,
        endtime: undefined,
        name: undefined,
        tel: '',
        idcard: ''
      }
    }
  },
  computed: {
    device: function() {
      return this.devices.find(n => n.deviceId === this.deviceId)
    }
  },
  watch: {
    camera: function(id) {
      this.deviceId = id
    },
    devices: function() {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices
      if (first) {
        this.camera = first.deviceId
        this.deviceId = first.deviceId
      }
      if (tail === undefined) {
        console.log('no tail')
      }
    },
    '$route': 'reloadD'
  },
  mounted() {
    console.log('mounted')
    var ishttps = document.location.protocol === 'https:'
    console.log('document.location.protocol = ' + document.location.protocol)
    var right_element = document.getElementById('rightviewid')
    // var right_element = this.$refs.rightviewref
    console.log('right_element = ' + right_element)
    if (ishttps) {
      this.show_left_view = true // http不显示摄像功能，调用不了摄像头
      right_element.setAttribute('style', 'left: 550px; min-height: 660px; position: absolute; top:0; right:0;')
    } else {
      this.show_left_view = false
      right_element.setAttribute('style', 'left: 0px; min-height: 660px; position: absolute; top:0; right:0;')
    }
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
    var hotelid = sessionStorage.getItem('hotelid')
    FetchAllRoomList(hotelid).then(response => {
      this.room_options = response.data.items
    })
  },
  beforeMount() {
    console.log('beforeMount')
  },
  beforeDestroy() {
    this.onStop()
    console.log('beforeDestroy')
  },
  methods: {
    async handleUploadInAdd() {
      console.log('上传 in add  !!!!')
      var that = this
      const inputFile = await this.$refs.uploadFileBtnRefInAdd.files[0]
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
        console.log(this.addimginfo)
        const reader = new FileReader()
        reader.readAsDataURL(this.inputFileInAdd)
        reader.onloadend = function() {
          console.log('console ' + reader.result)
          this.img = reader.result
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
          console.log(e)
          that.img = reader.result
        }
      }
    },
    onBack() {
      console.log('onBack')
      this.$router.push('/dashboard/list')
    },
    onCommit() {
      console.log('c hotel id = ', sessionStorage.getItem('hotelid'))
      if (this.img === null || this.img === undefined) {
        this.$message({
          type: 'error',
          message: '请先捕捉照片'
        })
        return
      }
      this.item.roomid = this.room_item_selected.roomid
      if (this.item.roomid === null || this.item.roomid === undefined) {
        this.$message({
          type: 'error',
          message: '房间号为必填项'
        })
        return
      }
      if (this.item.starttime === null || this.item.starttime === undefined) {
        this.$message({
          type: 'error',
          message: '入住时间为必填项'
        })
        return
      }
      if (this.item.endtime === null || this.item.endtime === undefined) {
        this.$message({
          type: 'error',
          message: '退房时间为必填项'
        })
        return
      }
      if (this.item.name === null || this.item.name === undefined) {
        this.$message({
          type: 'error',
          message: '姓名为必填项'
        })
        return
      }
      var commitItem = {
        hotelid: undefined,
        roomid: undefined,
        starttime: undefined,
        endtime: undefined,
        name: undefined,
        tel: '',
        idcard: '',
        imagesrc: undefined,
        token: ''
      }
      commitItem.token = sessionStorage.getItem('token')
      commitItem.hotelid = sessionStorage.getItem('hotelid')
      commitItem.roomid = this.item.roomid
      commitItem.starttime = '' + new Date(this.item.starttime).getTime()
      commitItem.endtime = '' + new Date(this.item.endtime).getTime()
      commitItem.name = this.item.name
      commitItem.tel = this.item.tel
      commitItem.idcard = this.item.idcard
      commitItem.imagesrc = this.img
      var data = JSON.stringify(commitItem)
      AddMemberRequest(data).then(response => {
        this.$notify({
          title: '新增成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        this.$router.push('/dashboard/list')
      }).catch(err => {
        console.log(err)
      })
    },
    reloadD() {
      console.log(this.$route.path)
      if (this.$route.path === '/dashboard/add') {
        this.onStart() // 页面切换的时候重新启动摄像头
      }
      var hotelid = sessionStorage.getItem('hotelid')
      FetchAllRoomList(hotelid).then(response => {
        this.room_options = response.data.items
      })
    },
    onCapture() {
      if (!this.isCameraStarted) {
        this.$message({
          type: 'error',
          message: '请先开始拍摄'
        })
        return
      }
      this.$refs.uploadFileBtnRefInAdd.value = ''
      this.img = this.$refs.webcam.capture()
      console.log(this.img)
    },
    onStarted(stream) {
      if (!this.isCameraStarted) {
        this.isCameraStarted = true
      }
      this.showCamera = true
      console.log('On Started Event', stream)
    },
    onStopped(stream) {
      this.isCameraStarted = false
      this.showCamera = false
      console.log('On Stopped Event', stream)
    },
    onStop() {
      if (this.$refs.webcam !== null && this.$refs.webcam !== undefined) {
        this.$refs.webcam.stop()
      }
    },
    onStart() {
      if (this.isCameraStarted) {
        this.$message({
          type: 'error',
          message: '正在拍摄中,请勿重复操作'
        })
        return
      }
      this.isCameraStarted = true
      this.$refs.webcam.start()
    },
    onError(error) {
      console.log('On Error Event', error)
    },
    onCameras(cameras) {
      this.devices = cameras
      console.log('On Cameras Event', cameras)
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log('On Camera Change Event', deviceId)
    },
    clearD() {
      this.img = null
    },
    handleAddRoom() {
      this.$router.push({ name: 'RoomList', query: { }})
    }
  },
  beforeRouteEnter(to, from, next) {
    next()
    console.log('beforeRouteEnter')
  },
  beforeRouteLeave(to, from, next) {
    this.clearD()
    this.onStop()
    next()
    console.log('beforeRouteLeave')
  }
}

</script>
