<!-- DonutChart.vue -->
<template>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ data.title }}</h3>
      <apexchart
        type="donut"
        height="200"
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
    labels: props.data.labels,
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    colors: ['#36A2EB', '#FF6384'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: false
    }
  }))
  </script>