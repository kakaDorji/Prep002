<template>
    <div class="bg-white p-4 rounded-lg shadow">
      <h4 class="text-sm font-semibold text-gray-600">{{ title }}</h4>
      <p class="text-2xl font-bold text-green-600">{{ value }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  })
  </script>