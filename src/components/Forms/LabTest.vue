<template>
  <div class="container">
    <!-- Search Section -->
    <div class="p-6 form-container"> <!-- Added form-container class for consistency -->
      <div class="flex flex-wrap items-center justify-center gap-4 mb-6">
        <div class="flex items-center gap-4">
          <label for="search_uid" class="font-semibold text-gray-700">UID:</label>
          <input v-model="searchUid" type="text" id="search_uid" name="search_uid" placeholder="Enter UID"
            class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="ml-6 flex items-center gap-6">
          <label for="search_type_of_visit" class="font-semibold text-gray-700">Type of Visit:</label>
          <select v-model="searchTypeOfVisit" id="search_type_of_visit" name="search_type_of_visit"
            class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Screening Visit MO">Screening Visit MO</option>
            <option value="End of M1">End of M1</option>
            <option value="End of M3">End of M3</option>
            <option value="End of M6">End of M6</option>
            <option value="End of M9">End of M9</option>
            <option value="End of M12">End of M12</option>
          </select>
        </div>
        <button @click="fetchData" type="button" :disabled="loading"
          class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Searching...' : 'Search' }}
          <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
        </button>
      </div>
      <span v-if="loading && !statusMessage" class="loading-status">Loading...</span>
      <!-- Show loading only when actively searching -->
      <!-- Status Message -->
      <div v-if="statusMessage" :class="['status-message-box', statusClass === 'success' ? 'success' : 'error']">
        {{ statusMessage }}
        <!-- Show sample date only on success -->
        <span v-if="statusClass === 'success' && formData.hiv_rapid_sample_date">
          (Sample Date Found: {{ formData.hiv_rapid_sample_date || 'N/A' }})
        </span>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="showReviewModal"> <!-- Changed submit action -->
      <div class="form-container">
        <h3 class="section-title">5. Test Results</h3>

        <label for="uid">UID:</label>
        <input type="text" v-model="formData.uid" id="uid" name="uid" readonly />

        <label for="type_of_visit">Type of Visit:</label>
        <input type="text" v-model="formData.type_of_visit" id="type_of_visit" name="type_of_visit" readonly />

        <div class="table-responsive">
          <table class="lab-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Date Sample Drawn</th>
                <th>Date Result Received</th>
                <th>Result</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <!-- HIV Rapid Test -->
              <tr>
                <td>HIV Rapid test (3rd Gen RDT)</td>
                <td><input type="date" v-model="formData.hiv_rapid_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.hiv_rapid_result_date" /></td>
                <td>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="hiv_rapid_result" v-model="formData.hiv_rapid_result"
                        value="Negative" /> Neg</label>
                    <label><input type="radio" name="hiv_rapid_result" v-model="formData.hiv_rapid_result"
                        value="Positive" /> Pos</label>
                  </div>
                </td>
                <td><textarea v-model="formData.hiv_rapid_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
              <!-- HIV 4th Generation Test -->
              <tr>
                <td>HIV 4th generation test</td>
                <td><input type="date" v-model="formData.hiv_4th_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.hiv_4th_result_date" /></td>
                <td>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="hiv_4th_result" v-model="formData.hiv_4th_result"
                        value="Negative" /> Neg</label>
                    <label><input type="radio" name="hiv_4th_result" v-model="formData.hiv_4th_result"
                        value="Positive" /> Pos</label>
                  </div>
                </td>
                <td><textarea v-model="formData.hiv_4th_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
              <!-- Hepatitis B -->
              <tr>
                <td>Hepatitis B* (HBsAg)</td>
                <td><input type="date" v-model="formData.hepatitis_b_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.hepatitis_b_result_date" /></td>
                <td>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="hep_b_result" v-model="formData.hepatitis_b_result"
                        value="Negative" /> Neg</label>
                    <label><input type="radio" name="hep_b_result" v-model="formData.hepatitis_b_result"
                        value="Positive" /> Pos</label>
                  </div>
                </td>
                <td><textarea v-model="formData.hepatitis_b_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
              <!-- Hepatitis C -->
              <tr>
                <td>Hepatitis C (Anti-HCV)</td>
                <td><input type="date" v-model="formData.hepatitis_C_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.hepatitis_C_result_date" /></td>
                <td>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="hep_c_result" v-model="formData.hepatitis_C_result"
                        value="Negative" /> Neg</label>
                    <label><input type="radio" name="hep_c_result" v-model="formData.hepatitis_C_result"
                        value="Positive" /> Pos</label>
                  </div>
                </td>
                <td><textarea v-model="formData.hepatitis_C_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
              <!-- Syphilis -->
              <tr>
                <td>Syphilis</td>
                <td><input type="date" v-model="formData.syphilis_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.syphilis_result_date" /></td>
                <td>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="syphilis_result" v-model="formData.syphilis_result"
                        value="Negative" /> Neg</label>
                    <label><input type="radio" name="syphilis_result" v-model="formData.syphilis_result"
                        value="Positive" /> Pos</label>
                  </div>
                </td>
                <td><textarea v-model="formData.syphilis_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
              <!-- Kidney Function -->
              <tr>
                <td>Kidney function (Creatinine)**</td>
                <td><input type="date" v-model="formData.kidney_function_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.kidney_function_result_date" /></td>
                <td><input type="text" v-model="formData.kidney_function_result" placeholder="Result (mg/dl)" /></td>
                <td><textarea v-model="formData.kidney_function_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
              <!-- Gonorrhoea -->
              <tr>
                <td>N. Gonorrhoea</td>
                <td><input type="date" v-model="formData.gonorrhoea_sample_date" readonly /></td>
                <td><input type="date" v-model="formData.gonorrhoea_result_date" /></td>
                <td>
                  <div class="radio-group-inline">
                    <label><input type="radio" name="gonorrhoea_result" v-model="formData.gonorrhoea_result"
                        value="Negative" /> Neg</label>
                    <label><input type="radio" name="gonorrhoea_result" v-model="formData.gonorrhoea_result"
                        value="Positive" /> Pos</label>
                  </div>
                </td>
                <td><textarea v-model="formData.gonorrhoea_notes" rows="1" placeholder="Notes"></textarea></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="font-size: 0.9em; color: #555; margin-top: 0.5rem;">
          * For those who received HBV, HBsAg is not required.<br />
          ** To calculate creatinine clearance (Cockcroft-Gault); recommended range: 0.6 - 1.2 mg/dl.
        </p>
      </div>
      <button type="submit" class="submit-btn" :disabled="isSubmitting || !formData.uid">
        <!-- Disable if no UID loaded -->
        {{ isSubmitting ? 'Submitting...' : 'Review Results' }} <!-- Changed Text -->
      </button>
    </form>
  </div>

  <!-- Confirmation Modal -->
  <Form8_ConfirmationModal v-if="isReviewModalVisible" :formData="formData" :isSubmitting="isSubmitting"
    :successMessage="modalSuccessMessage" :errorMessage="modalErrorMessage" @confirm="confirmAndSubmit"
    @cancel="cancelReview" />

  <!-- Final Messages outside modal -->
  <div v-if="!isReviewModalVisible && finalSubmitMessage" :class="finalSubmitClass" class="final-message">
    <p>{{ finalSubmitMessage }}</p>
  </div>
  <div v-if="!isReviewModalVisible && !finalSubmitMessage" style="text-align: center; margin-top: 20px;">
    <h4 class="section-title" style="margin-bottom: 1rem; font-size: 1.2rem;">Thank you for your time.</h4>
    <div v-if="successMessage && !finalSubmitMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>
    <div v-if="errorMessage && !finalSubmitMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// Import the NEW modal component
import Form8_ConfirmationModal from './LabTestConfrimModal.vue'; // Adjust path if needed

// --- Configuration ---
const SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbyA33wSBvWOEVd39rTDt_AYppcplr3Z61JJqBOVDRL9SS2VqTaScpB4N2jqr7st5HxMmQ/exec'; // FORM 8 Submit URL
const FETCH_SHEET_ID = '2PACX-1vSVqdLVHK4grNIbq-rX0Cz7_c-yFxDnviNyEvr8aCTwu0NIVWSXItCbJuerIi2PDPxLMQ55VYK_kNgH'; // Sheet ID (extracted EID part)
const FETCH_GID = '0';
const FETCH_URL = `https://docs.google.com/spreadsheets/d/e/${FETCH_SHEET_ID}/pub?output=csv&gid=${FETCH_GID}`;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const searchUid = ref('');
const searchTypeOfVisit = ref('Screening Visit MO'); // Default search value
const statusMessage = ref('');
const statusClass = ref('');
const loading = ref(false); // For search loading state
const isSubmitting = ref(false); // For submit loading state

const formData = ref({
  uid: '', type_of_visit: '',
  hiv_rapid_sample_date: '', hiv_rapid_result_date: '', hiv_rapid_result: '', hiv_rapid_notes: '',
  hiv_4th_sample_date: '', hiv_4th_result_date: '', hiv_4th_result: '', hiv_4th_notes: '',
  hepatitis_b_sample_date: '', hepatitis_b_result_date: '', hepatitis_b_result: '', hepatitis_b_notes: '',
  hepatitis_C_sample_date: '', hepatitis_C_result_date: '', hepatitis_C_result: '', hepatitis_C_notes: '',
  syphilis_sample_date: '', syphilis_result_date: '', syphilis_result: '', syphilis_notes: '',
  kidney_function_sample_date: '', kidney_function_result_date: '', kidney_function_result: '', kidney_function_notes: '',
  gonorrhoea_sample_date: '', gonorrhoea_result_date: '', gonorrhoea_result: '', gonorrhoea_notes: ''
});

// Modal and Final Message State
const isReviewModalVisible = ref(false);
const modalSuccessMessage = ref('');
const modalErrorMessage = ref('');
const finalSubmitMessage = ref('');
const finalSubmitClass = ref('');
const successMessage = ref(''); // General messages (optional)
const errorMessage = ref('');   // General messages (optional)

// --- Functions ---

// Fetch data from Google Sheet
const fetchData = async () => {
  if (!searchUid.value || !searchTypeOfVisit.value) {
    statusMessage.value = 'Please enter UID and select Visit Type.';
    statusClass.value = 'error';
    return;
  }
  loading.value = true;
  statusMessage.value = 'Searching...';
  statusClass.value = '';
  clearForm(); // Clear previous results before fetching

  try {
    const response = await axios.get(FETCH_URL);
    const rows = response.data.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))); // Trim quotes

    // Define column indices based on your actual sheet structure
    const colUIDIndex = 0; // A
    const colVisitTypeIndex = 2; // C
    // IMPORTANT: Update these indices based on where the dates are in your SOURCE sheet
    const colHivRapidSample = 100; // CW
    const colHiv4thSample = 103;   // DA
    const colHepBSample = 106;     // DD
    const colHepCSample = 109;     // DG
    const colSyphilisSample = 112; // DJ
    const colKidneySample = 115;   // DM
    const colGonorrheaSample = 118;// DP

    // Find the row matching UID and Visit Type
    const matchedRow = rows.slice(1).find(row => // Start from row 1 (skip header)
      row.length > Math.max(colUIDIndex, colVisitTypeIndex) && // Ensure row has enough columns
      row[colUIDIndex]?.toLowerCase() === searchUid.value.toLowerCase() &&
      row[colVisitTypeIndex] === searchTypeOfVisit.value
    );

    if (matchedRow) {
      statusMessage.value = 'Data found! Please enter results.';
      statusClass.value = 'success';

      // Populate formData with UID, Visit Type, and Sample Dates
      formData.value.uid = matchedRow[colUIDIndex] || '';
      formData.value.type_of_visit = matchedRow[colVisitTypeIndex] || '';
      formData.value.hiv_rapid_sample_date = matchedRow[colHivRapidSample] || '';
      formData.value.hiv_4th_sample_date = matchedRow[colHiv4thSample] || '';
      formData.value.hepatitis_b_sample_date = matchedRow[colHepBSample] || '';
      formData.value.hepatitis_C_sample_date = matchedRow[colHepCSample] || '';
      formData.value.syphilis_sample_date = matchedRow[colSyphilisSample] || '';
      formData.value.kidney_function_sample_date = matchedRow[colKidneySample] || '';
      formData.value.gonorrhoea_sample_date = matchedRow[colGonorrheaSample] || '';

    } else {
      statusMessage.value = `No record found for UID '${searchUid.value}' and Visit Type '${searchTypeOfVisit.value}'.`;
      statusClass.value = 'error';
      clearForm(); // Clear form if no data found
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    statusMessage.value = 'Error fetching data. Check console or network connection.';
    statusClass.value = 'error';
    clearForm();
  } finally {
    loading.value = false;
  }
};

// Modal Control
const showReviewModal = () => {
  if (!formData.value.uid) { // Check if data has been loaded
    errorMessage.value = "Please search and load participant data first.";
    return;
  }
  modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  isReviewModalVisible.value = true;
};
const cancelReview = () => { isReviewModalVisible.value = false; };

// Submission
const confirmAndSubmit = async () => {
  isSubmitting.value = true; modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  const url = SUBMIT_URL; // Use the correct URL for submitting results
  try {
    const dataToSend = { ...formData.value };
    const formDataSerialized = new URLSearchParams(dataToSend).toString();
    console.log("Submitting Lab Results:", dataToSend);

    // Use Axios as per original script
    const response = await axios.post(url, formDataSerialized, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    console.log("Lab Submit Response:", response);

    if (response.status === 200 && response.data && (typeof response.data === 'string' && response.data.toLowerCase().includes('success'))) {
      modalSuccessMessage.value = response.data;
      setTimeout(() => {
        isReviewModalVisible.value = false; setFinalMessage(response.data || 'Lab results submitted!', 'success');
        clearForm(); // Clear the form after successful submission
        searchUid.value = ''; // Optionally clear search fields too
        searchTypeOfVisit.value = 'Screening Visit MO';
        statusMessage.value = ''; statusClass.value = ''; // Clear search status
        modalSuccessMessage.value = '';
      }, SUBMIT_SUCCESS_DELAY);
    } else { modalErrorMessage.value = response.data || 'Submission failed.'; }
  } catch (error) {
    console.error('Lab Submit Error:', error);
    let detailedError = 'Error submitting lab results.';
    if (error.response) detailedError += ` (Status: ${error.response.status})`;
    else if (error.request) detailedError += ' (No response)';
    else detailedError += ` (${error.message})`;
    modalErrorMessage.value = detailedError;
  } finally { isSubmitting.value = false; }
};

// Clear Form Data
const clearForm = () => {
  // Reset only the result fields, keep UID and Visit Type if needed for resubmission review
  Object.keys(formData.value).forEach(key => {
    if (key !== 'uid' && key !== 'type_of_visit') {
      // Reset based on expected type, default to empty string
      if (key.includes('_sample_date')) { // Keep sample dates loaded from search
        // formData.value[key] = ''; // Or keep them? Decide based on workflow
      } else if (key.includes('_result')) {
        formData.value[key] = '';
      } else if (key.includes('_notes')) {
        formData.value[key] = '';
      } else if (key.includes('_result_date')) {
        formData.value[key] = '';
      } else if (key === 'uid' || key === 'type_of_visit') {
        // Keep these if loaded
      } else {
        formData.value[key] = ''; // Default clear
      }
    }
  });
  // Keep UID and Visit type after clearing results if data was found
  // formData.value.uid = ''; // Uncomment to fully clear
  // formData.value.type_of_visit = ''; // Uncomment to fully clear
  clearFinalMessage();
  successMessage.value = ''; errorMessage.value = ''; // Clear general messages
};

// Final Message Utils
function setFinalMessage(message, type) { finalSubmitMessage.value = message; finalSubmitClass.value = type === 'success' ? 'success-final' : 'error-final'; }
function clearFinalMessage() { finalSubmitMessage.value = ''; finalSubmitClass.value = ''; }

</script>

<style scoped>
 /* Changed to scoped */
 .container {
   max-width: 1300px;
   margin: 2rem auto;
   padding: 20px;
 }

 .form-container {
   padding: 2rem;
   background-color: #fff;
   border-radius: 10px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   margin-bottom: 2rem;
 }

 label {
   display: block;
   margin-bottom: 5px;
   font-weight: bold;
   color: #333;
 }

 input,
 select,
 textarea {
   width: 100%;
   padding: 0.6rem 0.75rem;
   margin-bottom: 15px;
   border: 1px solid #ccc;
   border-radius: 5px;
   box-sizing: border-box;
   font-size: 0.95rem;
   transition: border-color 0.2s ease;
 }

 input:focus,
 select:focus,
 textarea:focus {
   border-color: #3498db;
   outline: none;
   box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
 }

 input[readonly] {
   background-color: #f8f9fa;
   cursor: not-allowed;
   color: #666;
 }

 input[type="radio"],
 input[type="checkbox"] {
   width: auto;
   margin-right: 8px;
   vertical-align: middle;
 }

 label>input[type="radio"],
 label>input[type="checkbox"] {
   margin-bottom: 0;
 }

 .radio-group-inline {
   display: flex;
   gap: 15px;
   align-items: center;
   margin-bottom: 10px;
 }

 .radio-group-inline label {
   font-weight: normal;
   margin-bottom: 0;
 }

 .section-title {
   font-size: 1.5rem;
   color: #3498db;
   margin-bottom: 15px;
   padding-bottom: 5px;
   border-bottom: 1px solid #eee;
 }

 .submit-btn {
   background-color: #3498db;
   color: #fff;
   padding: 0.75rem 1.5rem;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   font-size: 1rem;
   transition: background-color 0.2s ease;
   display: block;
   width: auto;
   margin: 1rem auto 0 auto;
 }

 .submit-btn:hover:not(:disabled) {
   background-color: #2980b9;
 }

 .submit-btn:disabled {
   background-color: #bdc3c7;
   cursor: not-allowed;
   opacity: 0.7;
 }

 .table-responsive {
   overflow-x: auto;
   margin-bottom: 1rem;
 }

 table.lab-table {
   border-collapse: collapse;
   width: 100%;
   margin-bottom: 1rem;
   font-size: 0.9rem;
 }

 table.lab-table th,
 table.lab-table td {
   border: 1px solid #ccc;
   padding: 8px 10px;
   text-align: left;
   vertical-align: middle;
 }

 table.lab-table th {
   background-color: #f2f2f2;
   font-weight: bold;
   text-align: center;
 }

 table.lab-table td input[type="radio"] {
   margin-left: 5px;
   margin-right: 5px;
 }

 /* Adjust radio spacing in table */
 table.lab-table td input,
 table.lab-table td textarea {
   margin-bottom: 0;
   width: 95%;
 }

 /* Inputs fill cell */
 table.lab-table td textarea {
   resize: vertical;
   min-height: 40px;
 }

 /* Search section specific styles */
 .search-container {
   /* Replaced p-6 class */
   padding: 1.5rem;
   background-color: #f9f9f9;
   border-radius: 8px;
   margin-bottom: 2rem;
   border: 1px solid #e0e0e0;
 }

 /* Styles for status message box */
 .status-message-box {
   margin-top: 1rem;
   padding: 0.75rem 1rem;
   border-radius: 5px;
   font-weight: 500;
   text-align: center;
 }

 .status-message-box.success {
   background-color: #d1e7dd;
   color: #0f5132;
   border: 1px solid #badbcc;
 }

 .status-message-box.error {
   background-color: #f8d7da;
   color: #842029;
   border: 1px solid #f5c2c7;
 }

 .loading-status {
   font-style: italic;
   color: #555;
   margin-left: 10px;
 }

 .success-message {
   color: green;
   text-align: center;
   font-weight: bold;
   margin-top: 15px;
 }

 .error-message {
   color: red;
   text-align: center;
   font-weight: bold;
   margin-top: 15px;
 }

 .submitting-indicator {
   margin-top: 20px;
   text-align: center;
   font-size: 1.2rem;
   color: #3498db;
 }

 .final-message {
   max-width: 700px;
   margin: 20px auto;
   padding: 15px 20px;
   border-radius: 5px;
   text-align: center;
   font-weight: 500;
 }

 .final-message.success-final {
   background-color: #d1e7dd;
   color: #0f5132;
   border: 1px solid #badbcc;
 }

 .final-message.error-final {
   background-color: #f8d7da;
   color: #842029;
   border: 1px solid #f5c2c7;
 }
</style>