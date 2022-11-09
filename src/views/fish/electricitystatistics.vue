<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.phonenumber"
        placeholder="用户编码"
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
        @keyup.enter.native="handleFilter"
        @change="handleFilter"
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
        style="margin-left: 20px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ '搜索' }}
      </el-button>
    </div>
    <div class="filter-container" v-if="type_option_selected.type === '4'">
      <el-date-picker v-model="listQuery.starttime" type="datetime" style="margin-left: 0px; width: 240px;" format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" />
      <el-date-picker v-model="listQuery.endtime" type="datetime" style="margin-left: 20px;  width: 240px;" format="yyyy-MM-dd HH:mm:ss" placeholder="截止时间" />
      <el-select
        v-model="type_by_option_selected.type"
        placeholder="查询条件"
        style="margin-top: 8px; margin-left:20px;width: 160px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in type_by_options"
          :key="item.type"
          :label="item.name"
          :value="item.type"
        />
      </el-select>
    </div>
    <div class="labels" style="padding-left: 8%">
      <el-row>
        <!-- <el-col :span="6">渔民编码：无</el-col> -->
        <el-col :span="6">渔民所在地：{{location}}</el-col>
        <el-col :span="14">增氧机数量（该时间段运行中的增氧机）：{{devicecount}}</el-col>
      </el-row>
    </div>
    <div  class="filter-container" id="container" style="height: 600px"></div>
    <div style="padding-left: 8%">
      <el-row>
        <el-col>当日总耗电量：{{totalconsumption}}</el-col>
        <el-col>每小时平均耗电量：{{averageconsumption}}</el-col>
        <el-col>当日最高耗电时间：{{highestperiod}}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { FetchElectricityStatisticsByToday, FetchElectricityStatisticsByWeek, FetchElectricityStatisticsByThisMonth, FetchElectricityStatisticsBySpace } from '@/api/fishpond'
import * as echarts from '@/api/echarts'

export default {
  name: 'ElectricityStatistics',
  components: { },
  directives: { waves },
  data() {
    return {
      type_options: [
        {
          type: '1',
          name: '当日'
        },
        {
          type: '2',
          name: '本周'
        },
        {
          type: '3',
          name: '本月'
        }
        /*,
        {
          type: '4',
          name: '历史'
        }*/
      ],
      type_option_selected: {
        type: '1',
        name: '本日'
      },
      type_by_options: [
        {
          type: '1',
          name: '按周'
        },
        {
          type: '2',
          name: '按月'
        }
      ],
      type_by_option_selected: {
        type: '1',
        name: '按周'
      },
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        phonenumber: '',
        category: '',
        starttime: '',
        endtime: ''
      },
      dayX: [],
      dayY: [],
      weakX: [],
      weakY: [],
      monthX: [],
      monthY: [],
      spaceX: [],
      spaceY: [],

      location: null, // 渔民所在地
      devicecount: null, // 增氧机数量（该时间段运行中的增氧机）
      totalconsumption: null, // 本日/本周/本月总耗电量
      averageconsumption: null, // 每小时平均耗电量
      highestperiod: null, // 本日/本周/本月最高耗电时间
    }
  },
  created() {
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listQuery.token = sessionStorage.getItem('token')
      this.listQuery.category = this.type_option_selected.type
      if (this.type_option_selected.type === '1') {
        if (this.listQuery.phonenumber === '' || this.listQuery.phonenumber === undefined) {
          this.showDayDefaultCharts()
        } else {
          FetchElectricityStatisticsByToday(this.listQuery).then(response => {
            this.dayY = response.data.datay
            this.dayX = response.data.categoriesx
            this.location = response.data.location
            this.devicecount =  response.data.devicecount
            this.totalconsumption = response.data.totalconsumption
            this.averageconsumption = response.data.averageconsumption
            this.highestperiod = response.data.highestperiod
            this.showDayCharts()
          })
        }
      } else if (this.type_option_selected.type === '2') {
        if (this.listQuery.phonenumber === '' || this.listQuery.phonenumber === undefined) {
          this.showWeekDefaultCharts()
        } else {
          FetchElectricityStatisticsByWeek(this.listQuery).then(response => {
            this.weekX = response.data.categoriesx // ['0', '1', '2', '3', '4', '5'] // response.data.datay
            this.weekY = response.data.datay // [0, 0, 0, 0, 0, 5] // ['0', '0', '0', '0', '0', '5'] // response.data.categoriesx
            console.log(this.weekY)
            console.log(this.weekX)
            this.showWeekCharts()
          })
        }
      } else if (this.type_option_selected.type === '3') {
        if (this.listQuery.phonenumber === '' || this.listQuery.phonenumber === undefined) {
          this.showMonthDefaultCharts()
        } else {
          FetchElectricityStatisticsByThisMonth(this.listQuery).then(response => {
            this.monthY = response.data.datay
            this.monthX = response.data.categoriesx
            this.showMonthCharts()
          })
        }
      } else {
        //
      }
    },
    handleFilter() {
      console.log('handleFilter')
      this.listQuery.page = 1
      this.fetchList()
    },
    showWeekCharts() {
      var dom = document.getElementById('container')
      var myChart = echarts.init(dom)
      // var app = {}

      var option = {
        xAxis: {
          type: 'category',
          // data: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          data: this.weekX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          // data: [0, 0, 0, 0, 0, 0, 0],
          data: this.weekY,
          type: 'bar'
        }]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    },
    showWeekDefaultCharts() {
      var dom = document.getElementById('container')
      var myChart = echarts.init(dom)
      // var app = {}

      var option = {
        xAxis: {
          type: 'category',
          data: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [0, 0, 0, 0, 0, 0, 0],
          type: 'bar'
        }]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    },
    showDayCharts() {
      var dom = document.getElementById('container')
      var myChart = echarts.init(dom)
      // var app = {}

      var option = {
        xAxis: {
          type: 'category',
          data: this.dayX
          // data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          // data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          data: this.dayY,
          type: 'bar'
        }]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    },
    showDayDefaultCharts() {
      var dom = document.getElementById('container')
      var myChart = echarts.init(dom)
      // var app = {}

      var option = {
        xAxis: {
          type: 'category',
          data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'bar'
        }]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    },
    showMonthCharts() {
      var dom = document.getElementById('container')
      var myChart = echarts.init(dom)
      // var app = {}

      var option = {
        xAxis: {
          type: 'category',
          // data: ['01日', '02日', '03日', '04日', '05日', '06日', '07日', '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日']
          data: this.monthX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          // data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          data: this.monthY,
          type: 'bar'
        }]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    },
    showMonthDefaultCharts() {
      var dom = document.getElementById('container')
      var myChart = echarts.init(dom)
      // var app = {}

      var option = {
        xAxis: {
          type: 'category',
          data: ['01日', '02日', '03日', '04日', '05日', '06日', '07日', '08日', '09日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'bar'
        }]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option)
      }
    }
  }
}

</script>
