<template>
  <div>
    <quill-editor class="editor"
      ref="myTextEditor"
      v-model="item.introduction"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)">
    </quill-editor>
    <div style="text-align: center; margin-top: 80px;">
      <el-button @click="submitHandler" type="primary" style="min-width: 100px; width: 25%; position: relative; overflow: hidden;">编辑</el-button>
    </div>
  </div>
</template>
<script>
  import { SaveCompanyInfo, FetchCompanyInfo } from '@/api/fishpond'
    export default {
      data () {
        return {
          content: null,
          editorOption: {
            modules: {
              toolbar: [
                ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                ["blockquote", "code-block"], // 引用  代码块
                [{ header: 1 }, { header: 2 }], // 1、2 级标题
                [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                [{ script: "sub" }, { script: "super" }], // 上标/下标
                [{ indent: "-1" }, { indent: "+1" }], // 缩进
                // [{'direction': 'rtl'}],                         // 文本方向
                [{ size: ["small", false, "large", "huge"] }], // 字体大小
                [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                [{ font: [] }], // 字体种类
                [{ align: [] }], // 对齐方式
                ["clean"], // 清除文本格式
                ["link", "image", "video"] // 链接、图片、视频
              ], //工具菜单栏配置
            },
            placeholder: '请在这里添加产品描述', //提示
            readyOnly: false, //是否只读
            theme: 'snow', //主题 snow/bubble
            syntax: true, //语法检测
          },
          item: {
            id: '',
            companyname: '',
            contactname: '',
            contactphonenumber: '',
            aftersalephonenumber: '',
            introduction: '',
            operationguide: ''
          }
        }
      },
      methods: {
        // 失去焦点
        onEditorBlur(editor) {},
        // 获得焦点
        onEditorFocus(editor) {},
        // 开始
        onEditorReady(editor) {},
        // 值发生变化
        onEditorChange(editor) {
          this.item.introduction = editor.html;
          console.log(editor);
        },
        getDatas() {
          var token = sessionStorage.getItem('token')
          var that = this;
         FetchCompanyInfo(token).then(response => {
            that.item = response.data
          }).catch(err => {
            console.log(err)
          })
        },
        submitHandler() {
          this.item.token = sessionStorage.getItem('token')
          var data = JSON.stringify(this.item)
          SaveCompanyInfo(data).then(response => {
            this.$notify({
              title: '操作成功',
              type: 'success',
              message: '操作成功',
              duration: 2000
            })
            location.reload()
          }).catch(err => {
            console.log(err)
          })
        }
      },
      computed: {
        editor() {
          return this.$refs.myTextEditor.quillEditor;
        }
      },
      mounted() {
        // console.log('this is my editor',this.editor);
        this.getDatas()
      }
    }
</script>
<style scoped>
.editor {
  height: 600px;
}
</style>