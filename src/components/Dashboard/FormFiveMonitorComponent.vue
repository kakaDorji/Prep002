<template>
  <div class="bg-gradient-to-r from-indigo-950 via- to-indigo-800 flex flex-col items-center p-6">
    <h1 class="text-5xl font-bold text-gray-100 my-10">Unscheduled Analysis Dashboard</h1>

    <!-- Cards Section -->
    <div class="dashboard-cards flex flex-col sm:flex-row justify-center items-center gap-8">
      <div v-if="loading" class="card flex items-center justify-center h-32 bg-white shadow-md rounded-lg w-64">
        <p>Loading data...</p>
      </div>

      <div v-else class="flex flex-row justify-center gap-8">
        <div class="card bg-white shadow-md rounded-lg p-6 text-center w-100">
          <h3 class="text-xl font-semibold text-gray-700">Total Unscheduled Visits</h3>
          <p class="number text-4xl font-bold text-blue-500 mt-4">{{ totalVisits }}</p>
        </div>
        <div class="card bg-white shadow-md rounded-lg p-6 text-center w-100">
          <h3 class="text-xl font-semibold text-gray-700">Challenges for PrEP Dose</h3>
          <p class="number text-4xl font-bold text-blue-500 mt-4">{{ prepChallenges }}</p>
        </div>
        <div class="card bg-white shadow-md rounded-lg p-6 text-center w-100">
          <h3 class="text-xl font-semibold text-gray-700">Wish to Stop</h3>
          <p class="number text-4xl font-bold text-blue-500 mt-4">{{ wishToStop }}</p>
        </div>
      </div>
    </div>

    <!-- Stacked Bar Chart (Health Conditions) -->
    <div class="w-full max-w-6xl mt-10 bg-gray-100 rounded">
      <apexchart type="bar" height="400" :options="stackedBarChartOptions" :series="stackedBarChartSeries"></apexchart>
    </div>

    <!-- Pie Chart and Horizontal Bar Chart Section -->
    <div class="charts-container flex flex-col sm:flex-row justify-center items-center gap-8 mt-10 w-full max-w-8xl bg-gray-100 rounded mb-8">
      <!-- Pie Chart for Prep Site -->
      <div class="w-full sm:w-1/2 ">
        <apexchart type="pie" height="350" :options="pieChartOptions" :series="pieChartSeries"></apexchart>
      </div>
     <!-- Donut Chart for challenges_taking_PrEP (Yes / No) -->
     <div class="w-full sm:w-1/2 ">
        <apexchart type="donut" height="350" :options="donutPrepChartOptions" :series="donutPrepChartSeries"></apexchart>
      </div>
      <!-- Donut Chart for stop_or_continue (Stop / Continue) -->
      <div class="w-full sm:w-1/2 ">
        <apexchart type="donut" height="350" :options="donutStopChartOptions" :series="donutStopChartSeries"></apexchart>
      </div>

    </div>

    <!-- Donut Charts Section -->


       <!-- Horizontal Bar Chart for Reasons for Visit -->
       <div class="w-full  bg-gray-100 rounded ">
        <apexchart type="bar" height="350" :options="barChartOptions" :series="barChartSeries"></apexchart>
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Papa from 'papaparse';
import VueApexCharts from 'vue3-apexcharts';

// Cards data
const totalVisits = ref(0);
const prepChallenges = ref(0);
const wishToStop = ref(0);
const loading = ref(true);

// Data for Stacked Bar Chart (Conditions)
const stackedBarChartSeries = ref([
  { name: 'Yes', data: [] },      // Counts of "Yes" for each condition
  { name: 'Ongoing', data: [] },  // Counts of "True" for ongoing
  { name: 'Resolved', data: [] }, // Counts of "True" for resolved
]);

const stackedBarChartOptions = ref({
  chart: {
    type: 'bar',
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
    },
  },
  xaxis: {
    categories: ['Nausea', 'Vomiting', 'Abdominal Cramps', 'Fatigue', 'Dizziness', 'Headache', 'Others'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  title: {
    text: 'PrEP Side Effects',
    align: 'center',
  },
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c'],
});

// Data for Pie Chart (Prep Site)
const pieChartSeries = ref([]);
const pieChartOptions = ref({
  chart: {
    type: 'pie',
  },
  labels: [], // Will be populated with site names
  title: {
    text: 'Visits by Prep Site',
    align: 'center',
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    formatter: function(seriesName, opts) {
      // Format legend to show both name and value
      return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex];
    }
  },
  tooltip: {
    y: {
      formatter: function(value) {
        return value + ' visits';
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom'
      }
    }
  }]
});

// Data for Horizontal Bar Chart (Reason for Visit)
const barChartSeries = ref([{ name: 'Reason Count', data: [] }]);
const barChartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    stacked: false,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  xaxis: {
    categories: [],
  },
  title: {
    text: 'Reasons for Visit',
    align: 'center',
  },
});

// Data for Donut Chart (challenges_taking_PrEP)
const donutPrepChartSeries = ref([0, 0]);
const donutPrepChartOptions = ref({
  chart: {
    type: 'donut',
  },
  labels: ['Yes', 'No'],
  title: {
    text: 'Challenges for PrEP (Yes / No)',
    align: 'center',
  },
  colors: ['#1f77b4', '#ff7f0e'],
  legend: {
    position: 'bottom',
    formatter: function(seriesName, opts) {
      return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex];
    }
  }
});

// Data for Donut Chart (stop_or_continue)
const donutStopChartSeries = ref([0, 0]);
const donutStopChartOptions = ref({
  chart: {
    type: 'donut',
  },
  labels: ['Stop', 'Continue'],
  title: {
    text: 'PrEP Stop or Continue',
    align: 'center',
  },
  colors: ['#ff4040', '#2ca02c'],
  legend: {
    position: 'bottom',
    formatter: function(seriesName, opts) {
      return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex];
    }
  }
});

// Google Sheets CSV URL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3bgKqPEF02DOmD28_EMJE3Z3mjGwV_sWIjIjEVoYNMuraLNqEFLvKN3fJFCkMRQTjGY8bg4M2EEet/pub?gid=0&single=true&output=csv';

// Function to fetch and parse CSV data
const fetchAndAnalyzeData = async () => {
  try {
    // Fetch the loggedInUser from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
      console.error('No loggedInUser found in localStorage');
      return;
    }

    const response = await axios.get(CSV_URL);
    Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        let data = result.data;

        // Check the user's role
        const role = loggedInUser.role;

        // If the role is L3, filter the data by prep_location
        if (role === 'L3') {
          data = data.filter(row => row['prep_site'] === loggedInUser.prep_location);
        }

        // Cards
        totalVisits.value = data.length;
        prepChallenges.value = data.filter(row => row['challenges_taking_PrEP']?.toLowerCase() === 'yes').length;
        wishToStop.value = data.filter(row => row['stop_or_continue']?.toLowerCase() === 'stop').length;

        // ----- Stacked Bar Chart (Conditions) -----
        const conditions = [
          { name: 'Nausea', ongoing: 'Nausea_Ongoing', resolved: 'Nausea_Resolved' },
          { name: 'Vomiting', ongoing: 'Vomiting_Ongoing', resolved: 'Vomiting_Resolved' },
          { name: 'Abdominalcramps', ongoing: 'Abdominalcramps_Ongoing', resolved: 'Abdominalcramps_ Resolved' },
          { name: 'Fatigue', ongoing: 'Fatigue_Ongoing', resolved: 'Fatigue_Resolved' },
          { name: 'Dizziness', ongoing: 'Dizziness_Ongoing', resolved: 'Resolved' },
          { name: 'Headache', ongoing: 'Headache_Ongoing', resolved: 'Headache_Resolved' },
          { name: 'Others', ongoing: 'Others_Ongoing', resolved: 'Others_Resolved' },
        ];

        const yesCounts = [];
        const ongoingCounts = [];
        const resolvedCounts = [];

        conditions.forEach((condition) => {
          yesCounts.push(data.filter(row => row[condition.name]?.toLowerCase() === 'yes').length);
          ongoingCounts.push(data.filter(row => row[condition.ongoing]?.toLowerCase() === 'true').length);
          resolvedCounts.push(data.filter(row => row[condition.resolved]?.toLowerCase() === 'true').length);
        });

        stackedBarChartSeries.value = [
          { name: 'Yes', data: yesCounts },
          { name: 'Ongoing', data: ongoingCounts },
          { name: 'Resolved', data: resolvedCounts },
        ];

        // ----- Pie Chart (Prep Site) -----
        const prepSiteCount = {};
        data.forEach(row => {
          const site = row['prep_site'];
          if (site) {
            prepSiteCount[site] = (prepSiteCount[site] || 0) + 1;
          }
        });

        pieChartSeries.value = Object.values(prepSiteCount);
        pieChartOptions.value = {
          ...pieChartOptions.value,
          labels: Object.keys(prepSiteCount)
        };

        // ----- Horizontal Bar Chart (Reason for Visit) -----
        const reasonsCount = {
          "Follow up for existing medical problem": 0,
          "Side effects from PrEP": 0,
          "Wish to discontinue PrEP": 0,
          "STI symptoms/Screening": 0,
          "Change of dose/regimen": 0,
          "Additional doses of PrEP": 0,
          "New medical problem": 0,
          "Other": 0,
        };

        data.forEach(row => {
          const reasons = row['reason_for_this_visit'];
          if (reasons) {
            reasons.split(',').forEach(reason => {
              const trimmedReason = reason.trim();
              if (reasonsCount[trimmedReason] !== undefined) {
                reasonsCount[trimmedReason]++;
              }
            });
          }
        });

        barChartSeries.value = [{
          name: 'Number of Visits',
          data: Object.values(reasonsCount)
        }];

        barChartOptions.value = {
          ...barChartOptions.value,
          xaxis: {
            categories: Object.keys(reasonsCount),
            labels: {
              show: true,
              trim: false,
              minHeight: 100,
              maxHeight: 200
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '12px'
              }
            }
          }
        };

        // ----- Donut Chart for challenges_taking_PrEP -----
        const challengesYesCount = data.filter(row => row['challenges_taking_PrEP']?.toLowerCase() === 'yes').length;
        const challengesNoCount = data.filter(row => row['challenges_taking_PrEP']?.toLowerCase() === 'no').length;
        donutPrepChartSeries.value = [challengesYesCount, challengesNoCount];

        // ----- Donut Chart for stop_or_continue -----
        const stopCount = data.filter(row => row['stop_or_continue']?.toLowerCase() === 'stop').length;
        const continueCount = data.filter(row => row['stop_or_continue']?.toLowerCase() === 'continue').length;
        donutStopChartSeries.value = [stopCount, continueCount];

        // Loading state is now false
        loading.value = false;
      },
    });
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    loading.value = false;
  }
};

onMounted(() => {
  fetchAndAnalyzeData();
});
</script>

<style scoped>
/* Additional styles for the donut charts section */
.donut-charts-container {
  width: 100%;
}

.chart-container {
  margin: 20px 0;
  width: 100%;
}

/* Ensure labels are visible */
:deep(.apexcharts-yaxis-label),
:deep(.apexcharts-xaxis-label) {
  fill: #333;
}

/* Improve tooltip visibility */
:deep(.apexcharts-tooltip) {
  background: #fff;
  border: 1px solid #e3e3e3;
}

/* Ensure proper spacing for horizontal bar chart */
:deep(.apexcharts-bar-series) {
  transform: translate(0, 0);
}
</style>
