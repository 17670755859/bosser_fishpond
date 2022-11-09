<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >
        {{ '新增' }}
      </el-button>
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.cnameoralias"
        placeholder="中文名"
        clearable
        prefix-icon="el-icon-search"
        style="width: 460px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.drugid"
        placeholder="药品编号"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.enname"
        placeholder="英文名"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.cas"
        placeholder="CAS"
        clearable
        prefix-icon="el-icon-search"
        style="margin-left:20px;width: 160px"
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
      <el-table-column min-width="100px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="中文名称">
        <template slot-scope="scope">
          <span>{{ scope.row.drugname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="类别">
        <template slot-scope="scope">
          <span>{{ scope.row.drugcategory.drugcategoryname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="药品编号" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.drugid }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" label="英文名称">
        <template slot-scope="scope">
          <span>{{ scope.row.drugenglishname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="180px" label="CAS">
        <template slot-scope="scope">
          <span>{{ scope.row.cas }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >
            查看
          </el-button>
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.drugid)"
          >
            {{ "删除" }}
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getListByCatID"
    />

    <el-dialog :visible.sync="dialogVisibleAdd" :title="'新增'">
      <el-form :model="additem" label-width="150px" label-position="left">
        <el-form-item label="药品编号">
          <el-input v-model="additem.drugid" style="margin-left:0px;width: 200px" placeholder="药品编号(输入后自动检测)" @keyup.native="onkeyup($event)" @keyup.enter.native="onenter" />
          <span style="color: #F00; ;margin-left: 10px; font-size: 12px">{{ tips }}</span>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="additem.drugname" placeholder="名称" />
        </el-form-item>
        <el-form-item label="药品类别">
          <el-select
            v-model="drug_category_item_selected.drugcategoryid"
            placeholder="药品种类"
            clearable
            style="margin-left:0px;width: 160px"
            class="filter-item"
          >
            <el-option
              v-for="item in drug_category_options"
              :key="item.drugcategoryid"
              :label="item.drugcategoryname"
              :value="item.drugcategoryid"
            />
          </el-select>
          <el-button
            v-waves
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddCat"
          >
            {{ '新增药品种类' }}
          </el-button>
        </el-form-item>
        <el-form-item label="中文别名">
          <el-input v-model="additem.drugchinesename" placeholder="中文别名" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="additem.drugenglishname" placeholder="英文名称" />
        </el-form-item>
        <el-form-item label="CAS">
          <el-input v-model="additem.cas" placeholder="CAS" />
        </el-form-item>
        <el-form-item label="化学结构式图片:">
          <input id="uploadFileBtnIdInAdd" ref="uploadFileBtnRefInAdd" type="file" @change="handleUploadInAdd">
          <img ref="uploadImageRefInAdd" style="max-width: 500px; max-height: 500px" :src="addchemicalformulimgsrc" class="img">
        </el-form-item>
        <el-form-item label="图片地址(上传时生成)">
          <el-input id="text_pictureurladd" v-model="additem.chemicalformulaurl" readonly="true" :autosize="{minRows: 2,maxRows: 3}" type="textarea" placeholder="化学结构式图片Url" />
        </el-form-item>
        <el-form-item label="分子式">
          <el-input v-model="additem.molecularformula" placeholder="分子式(下标请使用<sub></sub>)" />
        </el-form-item>
        <el-form-item label="分子量">
          <el-input v-model="additem.molecularweight" placeholder="分子量" />
        </el-form-item>
        <el-form-item label="性状描述">
          <el-input v-model="additem.characterdescription" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="性状描述" />
        </el-form-item>
        <el-form-item label="药理作用">
          <el-input v-model="additem.pharmacologicalaction" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="药理作用" />
        </el-form-item>
        <el-form-item label="用法用量">
          <el-input v-model="additem.usage" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="用法用量" />
        </el-form-item>
        <el-form-item label="不良反应">
          <el-input v-model="additem.adversereactions" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="不良反应" />
        </el-form-item>
        <el-form-item label="原料药厂家">
          <el-input v-model="additem.rawmaterialmanufacturer" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="原料药厂家" />
        </el-form-item>
        <el-form-item label="原料药厂家地址">
          <el-input v-model="additem.rawmaterialmanufactureraddr" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="原料药厂家地址" />
        </el-form-item>
        <el-form-item label="制剂厂家">
          <el-input v-model="additem.pharmaceuticalmanufacturer" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="制剂厂家" />
        </el-form-item>
        <el-form-item label="制剂厂家地址">
          <el-input v-model="additem.pharmaceuticalmanufactureraddr" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="制剂厂家地址" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleEdit" :title="'编辑'">
      <el-form :model="edititem" label-width="150px" label-position="left">
        <el-form-item label="药品编号(不可编辑)">
          <el-input v-model="edititem.drugid" readonly="true" style="margin-left:0px;width: 200px" placeholder="药品编号(输入后自动检测)" @keyup.native="onkeyup($event)" @keyup.enter.native="onenter" />
          <span style="color: #F00; ;margin-left: 10px; font-size: 12px">{{ tips }}</span>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="edititem.drugname" placeholder="名称" />
        </el-form-item>
        <el-form-item label="药品类别">
          <el-select
            v-model="drug_category_item_selected.drugcategoryid"
            placeholder="药品种类"
            clearable
            style="margin-left:0px;width: 160px"
            class="filter-item"
          >
            <el-option
              v-for="item in drug_category_options"
              :key="item.drugcategoryid"
              :label="item.drugcategoryname"
              :value="item.drugcategoryid"
            />
          </el-select>
          <el-button
            v-waves
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddCat"
          >
            {{ '新增药品种类' }}
          </el-button>
        </el-form-item>
        <el-form-item label="中文别名">
          <el-input v-model="edititem.drugchinesename" placeholder="中文别名" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="edititem.drugenglishname" placeholder="英文名称" />
        </el-form-item>
        <el-form-item label="CAS">
          <el-input v-model="edititem.cas" placeholder="CAS" />
        </el-form-item>
        <el-form-item label="化学结构式图片">
          <input id="uploadFileBtnIdInEdit" ref="uploadFileBtnRefInEdit" type="file" @change="handleUploadInEdit">
          <img ref="uploadImageRefInEdit" style="max-width: 500px; max-height: 500px" :src="editchemicalformulimgsrc" class="img">
        </el-form-item>
        <el-form-item label="化学结构式图片地址(上传文件后自动生成)">
          <el-input id="text_pictureurlaedit" v-model="edititem.chemicalformulaurl" readonly="true" :autosize="{minRows: 2,maxRows: 3}" type="textarea" class="article-textarea" placeholder="化学结构式图片地址" />
        </el-form-item>
        <el-form-item label="分子式">
          <el-input v-model="edititem.molecularformula" placeholder="分子式(下标请使用<sub></sub>)" />
        </el-form-item>
        <el-form-item label="分子量">
          <el-input v-model="edititem.molecularweight" placeholder="分子量" />
        </el-form-item>
        <el-form-item label="性状描述">
          <el-input v-model="edititem.characterdescription" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="性状描述" />
        </el-form-item>
        <el-form-item label="药理作用">
          <el-input v-model="edititem.pharmacologicalaction" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="药理作用" />
        </el-form-item>
        <el-form-item label="用法用量">
          <el-input v-model="edititem.usage" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="用法用量" />
        </el-form-item>
        <el-form-item label="不良反应">
          <el-input v-model="edititem.adversereactions" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="不良反应" />
        </el-form-item>
        <el-form-item label="原料药厂家">
          <el-input v-model="edititem.rawmaterialmanufacturer" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="原料药厂家" />
        </el-form-item>
        <el-form-item label="原料药厂家地址">
          <el-input v-model="edititem.rawmaterialmanufactureraddr" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="原料药厂家地址" />
        </el-form-item>
        <el-form-item label="制剂厂家">
          <el-input v-model="edititem.pharmaceuticalmanufacturer" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="制剂厂家" />
        </el-form-item>
        <el-form-item label="制剂厂家地址">
          <el-input v-model="edititem.pharmaceuticalmanufactureraddr" type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="制剂厂家地址" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchDrugs, fetchDrugCategoryList, fetchDrugsForAll, uploadImage, addOrUpdateDrugbaseInfo, deleteDrugBaseInfo } from '@/api/drug'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sortable from 'sortablejs'

export default {
  name: 'DrugCodes',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tips: '',
      dialogVisibleAdd: false,
      checkStrictlyAdd: false,
      dialogVisibleEdit: false,
      checkStrictlyEdit: false,
      addchemicalformulimgsrc: null,
      addchemicalformulimginfo: null,
      editchemicalformulimgsrc: null,
      editchemicalformulimginfo: null,
      inputFileInAdd: null,
      inputFileInEdit: null,
      item: {
        drugid: undefined,
        drugname: undefined,
        drugchinesename: undefined,
        drugenglishname: undefined,
        cas: undefined,
        molecularformula: undefined,
        molecularweight: undefined,
        characterdescription: undefined,
        pharmacologicalaction: undefined,
        usage: undefined,
        adversereactions: undefined,
        rawmaterialmanufacturer: undefined,
        rawmaterialmanufactureraddr: undefined,
        pharmaceuticalmanufacturer: undefined,
        pharmaceuticalmanufactureraddr: undefined,
        chemicalformulaurl: '',
        drugcategory: {
          drugcategoryid: undefined,
          drugcategoryname: undefined
        }
      },
      additem: {
        drugid: undefined,
        drugname: undefined,
        drugchinesename: undefined,
        drugenglishname: undefined,
        cas: undefined,
        molecularformula: undefined,
        molecularweight: undefined,
        characterdescription: undefined,
        pharmacologicalaction: undefined,
        usage: undefined,
        adversereactions: undefined,
        rawmaterialmanufacturer: undefined,
        rawmaterialmanufactureraddr: undefined,
        pharmaceuticalmanufacturer: undefined,
        pharmaceuticalmanufactureraddr: undefined,
        chemicalformulaurl: '',
        drugcategory: {
          drugcategoryid: undefined,
          drugcategoryname: undefined
        }
      },
      edititem: {
        drugid: undefined,
        drugname: undefined,
        drugchinesename: undefined,
        drugenglishname: undefined,
        cas: undefined,
        molecularformula: undefined,
        molecularweight: undefined,
        characterdescription: undefined,
        pharmacologicalaction: undefined,
        usage: undefined,
        adversereactions: undefined,
        rawmaterialmanufacturer: undefined,
        rawmaterialmanufactureraddr: undefined,
        pharmaceuticalmanufacturer: undefined,
        pharmaceuticalmanufactureraddr: undefined,
        chemicalformulaurl: '',
        drugcategoryid: undefined, // drugcategoryid仅请求时候传参用
        drugcategory: {
          drugcategoryid: undefined,
          drugcategoryname: undefined
        }
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        drugcategoryid: '',
        drugid: '',
        cnameoralias: '',
        enname: '',
        cas: ''
      },
      sortable: null,
      newList: [],
      drug_category_options: [],
      drug_category_item_selected: {
        drugcategoryid: undefined,
        drugcategoryname: undefined
      }
    }
  },
  created() {
    this.getListByCatID()
    fetchDrugCategoryList().then(response => {
      this.drug_category_options = response.data.items
    })
  },
  methods: {
    getListByCatID() {
      this.listLoading = true
      fetchDrugs(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    handleDelete(id) {
      console.log('删除 !!!!')
      this.$confirm('是否删除该条记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除 !!!!')
        deleteDrugBaseInfo(id).then(response => {
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
      this.getListByCatID()
    },
    handleAdd() {
      console.log('新增 !!!!')
      this.inputFileInAdd = null
      this.dialogVisibleAdd = true
      this.tips = ''
      this.additem = {
        drugid: undefined,
        drugname: undefined,
        drugchinesename: undefined,
        drugenglishname: undefined,
        cas: undefined,
        molecularformula: undefined,
        molecularweight: undefined,
        characterdescription: undefined,
        pharmacologicalaction: undefined,
        usage: undefined,
        adversereactions: undefined,
        rawmaterialmanufacturer: undefined,
        rawmaterialmanufactureraddr: undefined,
        pharmaceuticalmanufacturer: undefined,
        pharmaceuticalmanufactureraddr: undefined,
        chemicalformulaurl: '',
        drugcategory: {
          drugcategoryid: undefined,
          drugcategoryname: undefined
        }
      }
      this.drug_category_item_selected = {
        drugcategoryid: undefined,
        drugcategoryname: undefined
      }
    },
    handleAddCat() {
      this.$router.push({ name: 'DrugCat', query: { }})
      // this.$router.push({ name: 'AnimalCat', query: { }})
      // this.$router.push({ name: 'TargetCat', query: { }})
    },
    confirmAdd() {
      console.log('新增提交 !!!!')
      this.additem.drugcategoryid = this.drug_category_item_selected.drugcategoryid
      this.additem.chemicalformulaurl = document.getElementById('text_pictureurladd').value
      addOrUpdateDrugbaseInfo(this.additem).then(response => {
        this.$notify({
          title: '操作成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        location.reload()
        // this.$router.push('/app/news/list')
      }).catch(err => {
        console.log(err)
      })
    },
    confirmEdit() {
      console.log('编辑提交 !!!!')
      this.edititem.drugcategoryid = this.drug_category_item_selected.drugcategoryid
      this.edititem.chemicalformulaurl = document.getElementById('text_pictureurlaedit').value
      addOrUpdateDrugbaseInfo(this.edititem).then(response => {
        this.$notify({
          title: '更新成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        location.reload()
      }).catch(err => {
        console.log(err)
      })
    },
    handleView(item) {
      console.log('查看 !!!!')
      this.$router.push({ name: 'BaseDetail', query: { id: item.drugid, name: item.drugname }})
    },
    handleEdit(item) {
      this.tips = ''
      this.inputFileInEdit = null
      this.dialogVisibleEdit = true
      this.checkStrictlyEdit = true
      this.edititem = item
      this.drug_category_item_selected = item.drugcategory
    },
    async handleUploadInEdit() {
      console.log('上传 edit !!!!')
      var that = this
      const inputFile = await this.$refs.uploadFileBtnRefInEdit.files[0]
      console.log('上传图片:' + inputFile)
      this.inputFileInEdit = inputFile
      if (this.inputFileInEdit) {
        const tempInputFile = this.inputFileInEdit
        if (tempInputFile.type !== 'image/jpeg' && tempInputFile.type !== 'image/png' && tempInputFile.type !== 'image/gif') {
          alert('不是有效的图片文件！')
          return
        }
        this.editchemicalformulimginfo = Object.assign({}, this.editchemicalformulimginfo, {
          name: inputFile.name,
          size: inputFile.size,
          lastModifiedDate: inputFile.lastModifiedDate.toLocaleString()
        })
        console.log(this.editchemicalformulimginfo)
        const reader = new FileReader()
        const res = reader.readAsDataURL(this.inputFileInEdit)
        console.log('我想想要获取流')
        console.log(res)
        reader.onloadend = function() {
          var strBase64 = reader.result.substring(0)
          console.log('console ' + strBase64)
          uploadImage(strBase64).then(response => {
            console.log(response)
            // const obj = JSON.parse(JSON.stringify(response))
            console.log('image url： ' + response.data)
            document.getElementById('text_pictureurlaedit').value = response.data
            // this.edititem.chemicalformulaurl = '' + response.data //此代码错误
          }).catch(err => {
            console.log('mmmm ' + err)
          })
        }
        reader.onload = function(e) {
          console.log(e)
          that.editchemicalformulimgsrc = reader.result
        }
      }
    },
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
        this.addchemicalformulimginfo = Object.assign({}, this.addchemicalformulimginfo, {
          name: inputFile.name,
          size: inputFile.size,
          lastModifiedDate: inputFile.lastModifiedDate.toLocaleString()
        })
        console.log(this.addchemicalformulimginfo)
        const reader = new FileReader()
        const res = reader.readAsDataURL(this.inputFileInAdd)
        console.log('我想想要获取流')
        console.log(res)
        reader.onloadend = function() {
          var strBase64 = reader.result.substring(0)
          console.log('console ' + strBase64)
          uploadImage(strBase64).then(response => {
            console.log(response)
            // const obj = JSON.parse(JSON.stringify(response))
            console.log('image url： ' + response.data)
            document.getElementById('text_pictureurladd').value = response.data
            // this.additem.chemicalformulaurl = '' + response.data //此代码错误
          }).catch(err => {
            console.log('mmmm ' + err)
          })
        }
        reader.onload = function(e) {
          console.log(e)
          that.addchemicalformulimgsrc = reader.result
        }
      }
    },
    /**
     * des:搜索的回车事件
     */
    onenter() {
      console.log('发送请求!!!')
      this.queryWithDrugId(this.additem.drugid)
    },

    /**
     * des:用户在输入状态下不发送请求，等停止输入后发送请求
     */
    onkeyup(event) {
      if (event.keyCode !== 13) {
        this.lastTimeStamp = event.timeStamp
        setTimeout(() => {
          if (this.lastTimeStamp === event.timeStamp) {
            console.log('发送请求')
            this.queryWithDrugId(this.additem.drugid)
          }
        }, 300)
      }
    },
    queryWithDrugId(drugid) {
      if (drugid.length === 0) {
        this.tips = ''
        this.additem = {
          drugid: drugid,
          drugname: undefined,
          drugchinesename: undefined,
          drugenglishname: undefined,
          cas: undefined,
          molecularformula: undefined,
          molecularweight: undefined,
          characterdescription: undefined,
          pharmacologicalaction: undefined,
          usage: undefined,
          adversereactions: undefined,
          rawmaterialmanufacturer: undefined,
          rawmaterialmanufactureraddr: undefined,
          pharmaceuticalmanufacturer: undefined,
          pharmaceuticalmanufactureraddr: undefined,
          chemicalformulaurl: '',
          drugcategory: {
            drugcategoryid: undefined,
            drugcategoryname: undefined
          }
        }
        this.drug_category_item_selected = {
          drugcategoryid: undefined,
          drugcategoryname: undefined
        }
        return
      }
      const para = { drugid: drugid }
      fetchDrugsForAll(para).then(response => {
        if (response.data.items.length > 0) {
          const mitem = response.data.items[0]
          this.additem = mitem
          this.drug_category_item_selected = mitem.drugcategory
          if (mitem.showinbaseinfolist === 1) {
            this.tips = '该编号已在列表中，点击提交更新数据'
          } else if (mitem.showinresidueinfolist) {
            this.tips = '该编号已在"兽药残留信息列表"中，提交将添加到本列表'
          } else if (mitem.showintoxicinfolist) {
            this.tips = '该编号已在"毒性效应列表"中，提交将添加到本列表'
          } else {
            this.tips = ''
          }
        } else {
          this.tips = ''
          this.additem = {
            drugid: drugid,
            drugname: undefined,
            drugchinesename: undefined,
            drugenglishname: undefined,
            cas: undefined,
            molecularformula: undefined,
            molecularweight: undefined,
            characterdescription: undefined,
            pharmacologicalaction: undefined,
            usage: undefined,
            adversereactions: undefined,
            rawmaterialmanufacturer: undefined,
            rawmaterialmanufactureraddr: undefined,
            pharmaceuticalmanufacturer: undefined,
            pharmaceuticalmanufactureraddr: undefined,
            chemicalformulaurl: '',
            drugcategory: {
              drugcategoryid: undefined,
              drugcategoryname: undefined
            }
          }
          this.drug_category_item_selected = {
            drugcategoryid: undefined,
            drugcategoryname: undefined
          }
        }
      })
    }
  }
}
</script>

