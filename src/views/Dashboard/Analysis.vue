<template>
  <div>
    <Chart :option="chartOption" style="height: 400px; width: 800px" />
  </div>
</template>
<script>
import service from "../../api";
import Chart from "../../components/Chart";
export default {
  data() {
    return {
      chartOption: {},
    };
  },
  mounted() {
    this.getChartData();
  },
  methods: {
    getChartData() {
      service.list().then((res) => {
        console.log(res.data, 11111111);
        this.chartOption = {
          title: {
            text: "ECharts 入门示例",
          },
          tooltip: {},
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              data: res.data,
            },
          ],
        };
      });
    },
  },
  components: {
    Chart,
  },
};
</script>
