<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ data.chartOptions.title.text }}</h3>
    <apexchart
      type="pie"
      height="300"
      :options="chartOptions"
      :series="data.series"
    ></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartOptions = computed(() => ({
  ...props.data.chartOptions,
  chart: {
    ...props.data.chartOptions.chart,
    toolbar: {
      show: false
    }
  },
  title: {
    show: false
  }
}))
</script>
