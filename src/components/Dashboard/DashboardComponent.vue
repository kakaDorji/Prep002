<template>
  <div class="p-6 bg-gradient-to-r from-indigo-950 via- to-indigo-700">
    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <label
          for="start-date"
          class="block text-lg font-medium text-gray-100 mb-1"
          >Start Date</label
        >
        <input
          type="date"
          id="start-date"
          v-model="startDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="flex-1 min-w-[200px]">
        <label
          for="end-date"
          class="block text-lg font-medium text-gray-100 mb-1"
          >End Date</label
        >
        <input
          type="date"
          id="end-date"
          v-model="endDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="flex-1 min-w-[200px]">
        <label
          for="location"
          class="block text-lg font-medium text-gray-100 mb-1"
          >PrEP Site</label
        >
        <select
          id="location"
          v-model="selectedLocation"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">All Sites</option>
          <option
            v-for="location in locations"
            :key="location"
            :value="location"
          >
            {{ location }}
          </option>
        </select>
      </div>
      <div class="flex items-end">
        <button
          @click="applyFilters"
          class="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-if="dataLoaded">
      <!-- Header Stats -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <header-stat
          v-for="(stat, index) in headerStatsData"
          :key="index"
          :title="stat.title"
          :value="stat.value"
        />
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-5 gap-4 mb-4 text-center">
        <kpi-card
          v-for="(kpi, index) in kpiData"
          :key="index"
          :title="kpi.title"
          :value="kpi.value"
        />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <pie-chart :data="pieChartData" />
        <bar-chart :data="barChartData" />
        <line-chart :data="lineChartData" />
      </div>

      <!-- Donut Charts -->
      <div class="grid grid-cols-5 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(0, 5)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>
      <div class="grid grid-cols-5 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(5, 10)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(10, 12)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(12, 14)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>
      <div class="grid grid-cols-3 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(14, 17)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>
      <div class="grid grid-cols-3 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(17, 20)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>
      <div class="grid grid-cols-3 gap-4 mb-4">
        <donut-chart
          v-for="(data, index) in donutChartsData.slice(20, 23)"
          :key="index"
          :data="data"
          :class="'bg-slate-200'"
        />
      </div>

      <!-- Large Bar Chart -->
      <bar-chart-large :data="largeBarChartData" />
      <bar-chart-horizontal :data="horizontalChartData" />
      <bar-chart-exit :data="exitChartData" />
    </div>

    <div v-else class="text-center py-8">
      <p class="text-xl font-semibold">Loading data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import HeaderStat from "../DashboardGraph/HeaderStats.vue";
import KpiCard from "../DashboardGraph/KpiCards.vue";
import PieChart from "../DashboardGraph/PieChart.vue";
import BarChart from "../DashboardGraph/BarChart.vue";
import LineChart from "../DashboardGraph/LineChart.vue";
import DonutChart from "../DashboardGraph/DonutChart.vue";
import BarChartLarge from "../DashboardGraph/BarChartLarge.vue";
import BarChartHorizontal from "../DashboardGraph/BarChartHorizontal.vue";
import BarChartExit from "../DashboardGraph/BarExitchart.vue";

// Filter state
const startDate = ref("");
const endDate = ref("");
const selectedLocation = ref("");
const locations = ref([]);

// Data state
const allRows = ref([]);
const filteredRows = ref([]);
const dataLoaded = ref(false);

// Fetch data from Google Sheets
const sheetId =
  "2PACX-1vRCUvNvZCVN9Rz_ddJDZ2Qoi-v2Cl1pskalacm8S-_crB4JkPHIOXHCFSGm5GFK6mDLwmjxo4kQ3yeU";
const gid = "0";
const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv&gid=${gid}`;

const fetchSheetData = async () => {
  try {
    const response = await axios.get(url);
    const csvText = response.data;
    allRows.value = parseCsv(csvText);
    filteredRows.value = allRows.value;
    updateLocations();
    applyFilters();
    dataLoaded.value = true;
  } catch (error) {
    console.error("Error fetching data:", error);
    dataLoaded.value = false;
  }
};

const parseCsv = (csvText) => {
  const rows = csvText
    .split("\n")
    .map((row) => row.split(",").map((cell) => cell.trim()));
  if (rows[0].length === 1) {
    return csvText
      .split("\n")
      .map((row) => row.split("\t").map((cell) => cell.trim()));
  }
  return rows;
};

const updateLocations = () => {
  if (allRows.value.length > 0) {
    const locationIndex = allRows.value[0].indexOf("Referral to PrEP site");
    if (locationIndex !== -1) {
      const uniqueLocations = new Set(
        allRows.value.slice(1).map((row) => row[locationIndex])
      );
      locations.value = Array.from(uniqueLocations).sort();
    }
  }
};

const applyFilters = () => {
  if (allRows.value.length === 0) return;

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userRole = loggedInUser?.role;
  const prepLocation = loggedInUser?.prep_location;

  const dateIndex = allRows.value[0].indexOf("Date of Referral");
  const locationIndex = allRows.value[0].indexOf("Referral to PrEP site");

  filteredRows.value = allRows.value.filter((row, index) => {
    if (index === 0) return true;

    const rowDate = new Date(row[dateIndex]);
    const startDateMatch =
      !startDate.value || rowDate >= new Date(startDate.value);
    const endDateMatch = !endDate.value || rowDate <= new Date(endDate.value);
    const locationMatch =
      !selectedLocation.value || row[locationIndex] === selectedLocation.value;

    if (userRole === "admin" || userRole === "L1" || userRole === "L2") {
      return startDateMatch && endDateMatch && locationMatch;
    } else if (userRole === "L3" && prepLocation) {
      return (
        startDateMatch &&
        endDateMatch &&
        locationMatch &&
        row[locationIndex] === prepLocation
      );
    } else {
      return false;
    }
  });
};

const findColumnIndex = (headers, columnName) => {
  return headers.findIndex(
    (header) => header.trim().toLowerCase() === columnName.trim().toLowerCase()
  );
};

// Computed properties for dashboard components
const headerStatsData = computed(() => {
  if (filteredRows.value.length === 0) return [];

  const headers = filteredRows.value[0];
  const interestedPrepIndex = findColumnIndex(headers, "Willing to start PrEP");
  const suitableForPrepIndex = findColumnIndex(headers, "Suitable for PrEP");
  const initiationDateIndex = findColumnIndex(headers, "initiation_month");

  if (
    interestedPrepIndex === -1 ||
    suitableForPrepIndex === -1 ||
    initiationDateIndex === -1
  ) {
    console.error("One or more required columns not found");
    return [];
  }

  const interestedPrepCount = filteredRows.value.slice(1).filter((row) => {
    const value = row[interestedPrepIndex];
    return value && value.toLowerCase() === "yes";
  }).length;

  const suitableForPrepCount = filteredRows.value.slice(1).filter((row) => {
    const value = row[suitableForPrepIndex];
    return value && value.toLowerCase() === "yes";
  }).length;

  const initiatedPrepCount = filteredRows.value.slice(1).filter((row) => {
    const value = row[initiationDateIndex];
    return value && value.trim() !== "";
  }).length;

  return [
    { title: "Interested in PrEP", value: interestedPrepCount },
    { title: "Suitable for PrEP", value: suitableForPrepCount },
    { title: "Initiated PrEP", value: initiatedPrepCount },
  ];
});

const kpiData = computed(() => {
  if (!dataLoaded.value) return [];

  const headers = filteredRows.value[0];

  // Use the correct column names
  const statusM1Index = findColumnIndex(headers, "status_m1");
  const statusM3Index = findColumnIndex(headers, "status_m3");
  const statusM6Index = findColumnIndex(headers, "status_m6");
  const statusM9Index = findColumnIndex(headers, "status_m9");
  const statusM12Index = findColumnIndex(headers, "status_m12");

  // If any column is not found, log an error
  if (
    statusM1Index === -1 ||
    statusM3Index === -1 ||
    statusM6Index === -1 ||
    statusM9Index === -1 ||
    statusM12Index === -1
  ) {
    console.error("One or more status columns not found");
    return [];
  }

  // Count non-empty values in each status column
  const countNonEmpty = (index) => {
    return filteredRows.value.slice(1).reduce((count, row) => {
      return row[index] ? count + 1 : count;
    }, 0);
  };

  // Collect counts for each month status
  const statusCounts = {
    M1: countNonEmpty(statusM1Index),
    M3: countNonEmpty(statusM3Index),
    M6: countNonEmpty(statusM6Index),
    M9: countNonEmpty(statusM9Index),
    M12: countNonEmpty(statusM12Index),
  };

  // Return KPI data for the cards
  return [
    { title: "M1", value: statusCounts.M1 },
    { title: "M3", value: statusCounts.M3 },
    { title: "M6", value: statusCounts.M6 },
    { title: "M9", value: statusCounts.M9 },
    { title: "M12", value: statusCounts.M12 },
  ];
});

const pieChartData = computed(() => {
  if (!dataLoaded.value) return { series: [], chartOptions: { labels: [] } };
  const headers = filteredRows.value[0];
  const prepSiteIndex = findColumnIndex(headers, "Referral to PrEP site");
  if (prepSiteIndex === -1) {
    console.error("Referral to PrEP site column not found");
    return { series: [], chartOptions: { labels: [] } };
  }
  const prepSiteCounts = {};
  filteredRows.value.slice(1).forEach((row) => {
    const site = row[prepSiteIndex];
    prepSiteCounts[site] = (prepSiteCounts[site] || 0) + 1;
  });

  return {
    series: Object.values(prepSiteCounts),
    chartOptions: {
      labels: Object.keys(prepSiteCounts),
      title: { text: "Referred to PrEP Site" },
    },
  };
});

const barChartData = computed(() => {
  if (!dataLoaded.value) return { series: [], chartOptions: { labels: [] } };

  // Get the headers from the filteredRows
  const headers = filteredRows.value[0];

  // Find the index of the 'Age' column
  const ageColumnIndex = findColumnIndex(headers, "Age");
  if (ageColumnIndex === -1) {
    console.error("Age column not found");
    return { series: [], chartOptions: { labels: [] } };
  }

  // Define age group ranges (e.g., 15-20, 20-25, ..., 70+)
  const ageGroups = {
    "15-20": 0,
    "20-25": 0,
    "25-30": 0,
    "30-35": 0,
    "35-40": 0,
    "40-45": 0,
    "45-50": 0,
    "50-55": 0,
    "55-60": 0,
    "60-65": 0,
    "65-70": 0,
    "70+": 0,
  };

  // Iterate over the rows and categorize the age into groups
  filteredRows.value.slice(1).forEach((row) => {
    const age = parseInt(row[ageColumnIndex], 10);

    // Check the age and increment the appropriate age group
    if (age >= 15 && age <= 20) ageGroups["15-20"]++;
    else if (age > 20 && age <= 25) ageGroups["20-25"]++;
    else if (age > 25 && age <= 30) ageGroups["25-30"]++;
    else if (age > 30 && age <= 35) ageGroups["30-35"]++;
    else if (age > 35 && age <= 40) ageGroups["35-40"]++;
    else if (age > 40 && age <= 45) ageGroups["40-45"]++;
    else if (age > 45 && age <= 50) ageGroups["45-50"]++;
    else if (age > 50 && age <= 55) ageGroups["50-55"]++;
    else if (age > 55 && age <= 60) ageGroups["55-60"]++;
    else if (age > 60 && age <= 65) ageGroups["60-65"]++;
    else if (age > 65 && age <= 70) ageGroups["65-70"]++;
    else if (age > 70) ageGroups["70+"]++;
  });

  // Prepare data for bar chart: series = values, labels = age group names
  return {
    series: [
      {
        data: Object.values(ageGroups), // Number of people in each age group
      },
    ],
    chartOptions: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: Object.keys(ageGroups), // Age group names
      },
      title: {
        text: "Distribution by Age Group",
      },
    },
  };
});

const lineChartData = computed(() => {
  if (!dataLoaded.value)
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };

  const headers = filteredRows.value[0];

  // Find the index of the 'Date of Referral' and 'KP group' columns
  const dateIndex = findColumnIndex(headers, "Date of Referral");
  const kpGroupIndex = findColumnIndex(headers, "KP group");

  if (dateIndex === -1 || kpGroupIndex === -1) {
    console.error("Date of Referral or KP group column not found");
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };
  }

  // Create an object to store date-wise KP group counts
  const dateKpGroupCounts = {};

  // Iterate over the rows to populate the date-KP group structure
  filteredRows.value.slice(1).forEach((row) => {
    const date = row[dateIndex];
    const kpGroup = row[kpGroupIndex];

    if (!dateKpGroupCounts[date]) {
      dateKpGroupCounts[date] = {};
    }
    // Increment count for the KP group on this date
    dateKpGroupCounts[date][kpGroup] =
      (dateKpGroupCounts[date][kpGroup] || 0) + 1;
  });

  // Sort dates to ensure chronological order
  const sortedDates = Object.keys(dateKpGroupCounts).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Find all unique KP groups in the data
  const kpGroups = new Set();
  sortedDates.forEach((date) => {
    Object.keys(dateKpGroupCounts[date]).forEach((kpGroup) =>
      kpGroups.add(kpGroup)
    );
  });

  // Prepare series for each KP group
  const series = Array.from(kpGroups).map((kpGroup) => ({
    name: kpGroup, // KP group name as the series name
    data: sortedDates.map((date) => dateKpGroupCounts[date][kpGroup] || 0), // Fill data for each date
  }));

  return {
    series,
    chartOptions: {
      chart: { type: "line" },
      xaxis: { categories: sortedDates }, // Dates as X-axis categories
      title: { text: "Referrals by KP Group over Time" },
      yaxis: {
        title: { text: "Number of Referrals" },
      },
    },
  };
});

const donutChartsData = computed(() => {
  if (!dataLoaded.value) return [];
  const headers = filteredRows.value[0];

  // Columns to display as donut charts
  const columns = [
    "HIV 4th",
    "HIV 4th_m3",
    "HIV 4th_m6",
    "HIV 4th_m9",
    "HIV 4th_m12",
    "HIV 3rd",
    "HIV 3rd_m3",
    "HIV 3rd_m6",
    "HIV 3rd_m9",
    "HIV 3rd_m12",
    "Hepatitis B",
    "Hepatitis B_m12",
    "Hepatitis C",
    "Hepatitis C_m12",
    "Syphilis",
    "Syphilis_m6",
    "Syphilis_m12",
    "Kidney",
    "Kidney_m6",
    "Kidney_m12",
    "Gonorrhoea",
    "Gonorrhoea_m6",
    "Gonorrhoea_m12",
  ];
  //-	Gonorrhea
  return columns.map((column) => {
    const index = findColumnIndex(headers, column);
    if (index === -1) {
      console.error(`${column} column not found`);
      return { series: [], labels: [], title: column };
    }

    // Count 'Positive' and 'Negative' values for the column
    const counts = { Positive: 0, Negative: 0 };
    filteredRows.value.slice(1).forEach((row) => {
      const value = row[index];
      if (value === "Positive" || value === "Negative") {
        counts[value]++;
      }
    });

    // Return the data for each donut chart
    return {
      series: [counts["Positive"], counts["Negative"]],
      labels: ["Positive", "Negative"],
      title: column,
    };
  });
});

const largeBarChartData = computed(() => {
  if (!dataLoaded.value)
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };
  const headers = filteredRows.value[0];
  const kpGroupIndex = findColumnIndex(headers, "KP group");
  if (kpGroupIndex === -1) {
    console.error("KP group column not found");
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };
  }
  const kpiCounts = {};
  filteredRows.value.slice(1).forEach((row) => {
    const kpi = row[kpGroupIndex];
    if (kpi) {
      kpiCounts[kpi] = (kpiCounts[kpi] || 0) + 1;
    }
  });

  return {
    series: [{ data: Object.values(kpiCounts) }],
    chartOptions: {
      chart: { type: "bar" },
      xaxis: { categories: Object.keys(kpiCounts) },
      title: { text: "KP Group Distribution" },
    },
  };
});

//gorup by Referral to PrEP site col and count Unscheduled
const horizontalChartData = computed(() => {
  if (!dataLoaded.value)
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };

  const headers = filteredRows.value[0];
  const referralIndex = findColumnIndex(headers, "Referral to PrEP site");
  const unscheduledIndex = findColumnIndex(headers, "Unscheduled");

  if (referralIndex === -1 || unscheduledIndex === -1) {
    console.error("Required columns not found");
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };
  }

  const kpiCounts = {};

  filteredRows.value.slice(1).forEach((row) => {
    const referral = row[referralIndex];
    const unscheduled = row[unscheduledIndex];

    if (referral && unscheduled) {
      if (!kpiCounts[referral]) {
        kpiCounts[referral] = 0;
      }
      kpiCounts[referral] += 1;
    }
  });

  return {
    series: [{ data: Object.values(kpiCounts) }],
    chartOptions: {
      chart: { type: "bar" },
      xaxis: { categories: Object.keys(kpiCounts) },
      title: { text: "Unscheduled Count by Referral to PrEP Site" },
      colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"], // You can add more colors if needed
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
    },
  };
});
//gorup by Referral to PrEP site col and count Unscheduled
const exitChartData = computed(() => {
  if (!dataLoaded.value)
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };

  const headers = filteredRows.value[0];
  const referralIndex = findColumnIndex(headers, "Referral to PrEP site");
  const unscheduledIndex = findColumnIndex(headers, "Exit");

  if (referralIndex === -1 || unscheduledIndex === -1) {
    console.error("Required columns not found");
    return {
      series: [{ data: [] }],
      chartOptions: { xaxis: { categories: [] } },
    };
  }

  const kpiCounts = {};

  filteredRows.value.slice(1).forEach((row) => {
    const referral = row[referralIndex];
    const unscheduled = row[unscheduledIndex];

    if (referral && unscheduled) {
      if (!kpiCounts[referral]) {
        kpiCounts[referral] = 0;
      }
      kpiCounts[referral] += 1;
    }
  });

  return {
    series: [{ data: Object.values(kpiCounts) }],
    chartOptions: {
      chart: { type: "bar" },
      xaxis: { categories: Object.keys(kpiCounts) },
      title: { text: "Exit Count by Referral to PrEP Site" },
      colors: ["#3357FF", "#FF33A1", "#A133FF"], // You can add more colors if needed
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
    },
  };
});

onMounted(() => {
  fetchSheetData();
});
</script>
