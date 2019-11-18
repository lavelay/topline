<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <div class="text item">
      <div id="main" style="width: 600px;height:400px;"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Fans',
  mounted () {
    this.paintPic()
  },
  methods: {
    paintPic () {
      var myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'pie',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
