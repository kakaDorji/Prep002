import './assets/main.css'
import VueApexCharts from "vue3-apexcharts";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";

const app = createApp(App)

app.use(Toast);

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.mount('#app')
