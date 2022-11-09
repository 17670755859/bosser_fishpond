<template>
  <div class="app-container">
    <el-form :model="item" style="margin-left: 10px; margin-right: 10px" label-width="180px" label-position="right">
      <el-form-item label="管理员：">
        <el-input :readonly="true" placeholder="管理员" style="margin-left: 0px; min-width: 200px" v-text="item.adminname" />
      </el-form-item>
      <el-form-item label="产品ID：">
        <el-input :readonly="true" placeholder="产品ID" style="margin-left: 0px; min-width: 200px" v-text="item.hotelid" />
      </el-form-item>
      <el-form-item label="原密码：">
        <el-input v-model="item.oldpwd" placeholder="原密码" style="margin-left: 0px; min-width: 200px" />
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="item.newpwd" placeholder="新密码" style="margin-left: 0px; min-width: 200px" />
      </el-form-item>
      <el-form-item label="再次输入新密码：">
        <el-input v-model="item.newpwd2" placeholder="新密码" style="margin-left: 0px; min-width: 200px" />
      </el-form-item>
      <div style="text-align: center; padding-top: 30px;">
        <el-button
          v-waves
          class="filter-item"
          style="min-width: 200px; width: 50%;"
          type="primary"
          @click="onCommit"
        >
          {{ '确定修改' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import waves from '@/directive/waves'
import { EditPwd } from '@/api/face'
export default {
  name: 'EditPwd',
  directives: { waves },
  data() {
    return {
      token: undefined,
      item: {
        adminname: undefined,
        hotelid: undefined,
        oldpwd: undefined,
        newpwd: undefined,
        newpwd2: undefined
      }
    }
  },
  watch: {
    '$route': 'reloadD'
  },
  created() {
    this.item.adminname = sessionStorage.getItem('adminname')
    this.item.hotelid = sessionStorage.getItem('hotelid')
    this.token = sessionStorage.getItem('token')
  },
  methods: {
    reloadD() {
      this.item.adminname = sessionStorage.getItem('adminname')
      this.item.hotelid = sessionStorage.getItem('hotelid')
    },
    onCommit() {
      console.log('onCommit')
      if (this.item.newpwd === null || this.item.newpwd === undefined) {
        this.$message({
          type: 'error',
          message: '密码不为空'
        })
        return
      }
      if (this.item.newpwd !== this.item.newpwd2) {
        this.$message({
          type: 'error',
          message: '新密码2次输入的不一致'
        })
        return
      }
      EditPwd(this.item.adminname, this.item.oldpwd, this.item.newpwd, this.token).then(response => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        this.item.oldpwd = ''
        this.item.newpwd = ''
        this.item.newpwd2 = ''
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
