<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="item" class="demo-form-inline">
          <el-form-item label="查询指定用户设备数量">
            <el-input v-model="item.phonenumber" placeholder="输入用户编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item label-width="80px" label="时间">
            <el-radio-group v-model="item.statsperiod" @change="changeTheme" size="small">
              <el-radio-button label="0">今天</el-radio-button>
              <el-radio-button label="1">昨天</el-radio-button>
              <el-radio-button label="2">最近7天</el-radio-button>
              <el-radio-button label="3">最近三十天</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div style="height: 30px"></div>
    <el-card>
      <div class="box-card">
        <div class="box-item">
          <div class="title">设备总数（台）</div>
          <div class="num">{{totalcount}}</div>
        </div>
        <div class="box-item">
          <div class="title">当前运行中设备数量（台）</div>
          <div class="num">{{runningcount}}</div>
        </div>
        <div class="box-item">
          <div class="title">增氧机数量（台）</div>
          <div class="num">{{totalcount}}</div>
        </div>
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="14">   
        <div id="dataMapecharts"></div>
      </el-col>
      <el-col :span="10">
        <el-table
          :data="map1"
          size="medium"
          border
          style="width: 70%; margin-top: 20%">
          <el-table-column
            prop="name"
            label="省份"
            width="180">
          </el-table-column>
          <el-table-column
            prop="value"
            label="数量"
            width="180">
          </el-table-column>
          <el-table-column
            prop="rate"
            label="占比%">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- <el-form>
      <el-form-item label-width="80px" label="设备">
        <el-radio-group v-model="labelPosition" @change="changeTheme" size="small">
          <el-radio-button label="1">氧旺一号</el-radio-button>
          <el-radio-button label="2">氧旺二号</el-radio-button>
          <el-radio-button label="7">氧旺三号</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="80px" label="数量">
        <el-input type="text" v-text="'0'"></el-input>
      </el-form-item>
      <el-form-item label-width="80px" label="添加日期">
        <el-input type="text" v-text="'2022-7-28'"></el-input>
      </el-form-item>
    </el-form> -->
  </div>
</template>
<script>
import * as echarts from '@/api/echarts'
import china from "../../utils/china.json";
import { GetDevicestats } from '@/api/fishpond'
export default {
  name: 'nums',
  data() {
    return {
      labelPosition: 1,
      map1: [],
      item: {
        phonenumber: '', // 手机号
        statsperiod: '0', // 0:today, 1:yesterday, 2:last 7 days, 3:last 30 days
      },
      totalcount: 0,
      runningcount: 0,
    }
  },
  mounted() {
    this.mYecharts()
  },
  methods: {
    getDatas() {
      var data = JSON.stringify(this.item)
      GetDevicestats(data).then(response => {
        this.totalcount = response.data.totalcount
        this.runningcount = response.data.runningcount
        this.map1 = response.data.deviceprovince.map((v, i) => {
          return {
            id: i+1,
            name: v.location,
            selected: false,
            value: v.count,
            rate: v.percent*100
          }
        })
        this.mYecharts()
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      if(!this.item.phonenumber) {
        this.$message.error('请输入用户编码！');
        return;
      }
      this.getDatas()
    },
    changeTheme(e) {
      this.item.statsperiod = e
      if(this.item.phonenumber) {
        this.getDatas()
      }
    },
    mYecharts() {
      echarts.registerMap("china", china, {});
      //加载中国地图
      var customSettings = [];
      var that = this;
      this.map1.forEach(function (item, index) {
        let iScolor;
        if (item.value > 0 && item.value < 30) {
          iScolor = "#EEEEEE";
        } else if(item.value >30 && item.value < 100){
          iScolor = "#CEE1F7";
        } else {
          iScolor = "#3887E0";
        }
        customSettings.push({
          name: item.name,
          itemStyle: {
            areaColor: iScolor,
          },
        });
      });
      var mapDiv = document.getElementById('dataMapecharts');
      var myChart = echarts.init(mapDiv);
      // 绘制图表
      var chinaMap = {
        zoom: 5,
        tooltip: {
          show: true,
          textStyle: {
            color: "#ffffff",
          },
          borderWidth: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          formatter: function (item) {
            let resData = item.data;
            if (resData) {
              return "省份:" + resData.name + "<br/>" + "数量:" + resData.value;
            }
          },
        },
        selectedMode: "single",
        geo: {
          map: "china",
          regions: customSettings,
          label: {
            show: true,
            normal: {
              show: true,
              textStyle: {
                color: "#000",
                fontSize: 12,
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                color: "#000",
                fontSize: 12,
              },
            },
          },
          left: "0%",
          top: "8%",
        },
        series: [
          {
            type: "map",
            geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
            data: that.map1,
          },
        ],
      };

      myChart.on("click", function (param) {
        console.log(param)
        if (param.data.id !== "0") {
          that.gettotalSuccess(param.data.id);
        }
      });
      myChart.setOption(chinaMap);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  }
}
</script>
<style scoped>
.box-card {
  display: flex;
  align-items: center;
}
.box-item {
  flex: 1;
  text-align: center;
  padding: 20px 0;
}
.box-item .title {
  font-size: 22px;
}
.box-item .num {
  font-size: 18px;
  margin-top: 20px;
}
.box-item:nth-child(2) {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
#dataMapecharts {
  width: 100%;
  height: 800px;
}
</style>