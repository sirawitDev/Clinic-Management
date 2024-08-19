<template>
  <div>
    <div class="flex gap-4">
      <div>
        <select v-model="selectedInterval" @change="updateChart" class="select select-bordered">
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div>
        <VueDatePicker v-if="selectedInterval === 'day'" v-model="month" month-picker class=" select-bordered" />
      </div>
    </div>

    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const selectedInterval = ref('month')

const month = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear()
})

const generateRandomData = (length, min, max) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

const series = ref([
  {
    name: 'รายได้',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
])

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  },
  yaxis: {
    title: {
      text: '$ (thousands)',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter(val) {
        return '฿ ' + val + ' บาท'
      },
    },
  },
  colors: ['#008FFB'],
})

const updateChart = () => {
  if (selectedInterval.value === 'day') {
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: Array.from({ length: 30 }, (_, i) => `${month.value.month + 1}/${i + 1}`),
      },
      colors: ['#00E396'],
    }
    series.value[0].data = generateRandomData(30, 10, 100)
  } else if (selectedInterval.value === 'month') {
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      colors: ['#008FFB'], 
    }
    series.value[0].data = [76, 85, 101, 98, 87, 105, 91, 114, 94]
  } else if (selectedInterval.value === 'year') {
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: ['2022', '2023', '2024'],
      },
      colors: ['#FEB019'], // color for year
    }
    series.value[0].data = [760, 850, 1010]
  }
}

watch([selectedInterval, month], updateChart)

updateChart()
</script>