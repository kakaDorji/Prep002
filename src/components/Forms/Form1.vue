<template>
  <!-- Suitabilityy Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed to show modal -->
    <div class="container">
      <div class="form-container">
        <!-- All your existing form fields remain exactly the same -->
        <label for="date">Date:</label>
        <input type="date" v-model="formData.date" id="dateInput" name="date" required />

        <label for="participant_uid">Participant UID:</label>
        <input type="text" v-model="formData.participant_uid" id="participant_uid" name="participant_uid" required
          pattern="[A-Za-z0-9]{5,}" title="Minimum 5 Alphanumeric characters" />
        <!-- Status Message for UID Validation -->
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
        <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label for="type_of_visit">Type of Visit:</label>
        <select v-model="formData.type_of_visit" id="type_of_visit" name="type_of_visit" required>
          <option value="mst" disabled>Select one</option>
          <option value="Screening Visit MO">Screening Visit MO</option>
          <option value="End of M1">End of M1</option>
          <option value="End of M3">End of M3</option>
          <option value="End of M6">End of M6</option>
          <option value="End of M9">End of M9</option>
          <option value="End of M12">End of M12</option>
        </select>

        <label>KP:</label>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; margin-bottom: 15px;">
          <label style="display: inline-flex; align-items: center; margin-bottom: 0;">
            <input type="radio" v-model="formData.kpo_group" value="FSW" name="kpo_group" /> FSW
          </label>
          <label style="display: inline-flex; align-items: center; margin-bottom: 0;">
            <input type="radio" v-model="formData.kpo_group" value="MSM" name="kpo_group" /> MSM
          </label>
          <label style="display: inline-flex; align-items: center; margin-bottom: 0;">
            <input type="radio" v-model="formData.kpo_group" value="TGW" name="kpo_group" /> TGW
          </label>
          <label style="display: inline-flex; align-items: center; margin-bottom: 0;">
            <input type="radio" v-model="formData.kpo_group" value="TGM" name="kpo_group" /> TGM
          </label>
          <label style="display: inline-flex; align-items: center; margin-bottom: 0;">
            <input type="radio" v-model="formData.kpo_group" value="Male" name="kpo_group" /> Male
          </label>
          <label style="display: inline-flex; align-items: center; margin-bottom: 0;">
            <input type="radio" v-model="formData.kpo_group" value="Female" name="kpo_group" /> Female
          </label>
        </div>

        <label for="prep_site">PrEP Site</label>
        <select v-model="formData.prep_site" id="prep_site" name="prep_site" required>
          <option value="CHD/JDWNRH/Thimphu">CHD/JDWNRH/Thimphu</option>
          <option value="HISC/Thimphu">HISC/Thimphu</option>
          <option value="Paro Hospital/Paro">Paro Hospital/Paro</option>
          <option value="Phuntsholing Hospital/Chukha">Phuntsholing Hospital/Chukha</option>
          <option value="CRRH/Gelephu/Sarpang">CRRH/Gelephu/Sarpang</option>
        </select>

        <!-- Demographic Assessment -->
        <h3 class="section-title">A. Demographic Assessment</h3>
        <label for="age">Age (15 years and older):</label>
        <input type="number" v-model.number="formData.age" id="age" name="age" min="15" @blur="checkAge" required />
        <div v-if="ageMessage" id="message"
          style="color: #a94442; margin-top: -10px; margin-bottom: 15px; font-size: 0.9em;">{{ ageMessage }}</div>

        <label for="weight">Weight(Kg):</label>
        <input type="number" step="0.1" v-model.number="formData.weight" id="weight" name="weight" />

        <label for="resident">Resident of:</label>
        <select v-model="formData.resident" id="resident" name="resident" style="margin-top: 10px">
          <option value="" disabled>Select Dzongkhag</option>
          <option value="Thimphu">Thimphu</option>
          <option value="Paro">Paro</option>
          <option value="Sarpang">Sarpang</option>
          <option value="Chukha">Chukha</option>
          <option value="Bumthang">Bumthang</option>
          <option value="Dagana">Dagana</option>
          <option value="Gasa">Gasa</option>
          <option value="Haa">Haa</option>
          <option value="Lhuentse">Lhuentse</option>
          <option value="Mongar">Mongar</option>
          <option value="Pemagatshel">Pemagatshel</option>
          <option value="Punakha">Punakha</option>
          <option value="Samdrup Jongkhar">Samdrup Jongkhar</option>
          <option value="Samste">Samste</option>
          <option value="Trashigang">Trashigang</option>
          <option value="Trashiyangtse">Trashiyangtse</option>
          <option value="Trongsa">Trongsa</option>
          <option value="Tsirang">Tsirang</option>
          <option value="Wangdue Phodrang">Wangdue Phodrang</option>
          <option value="Zhemgang">Zhemgang</option>
        </select>

        <!-- Behavioral Risk Assessment -->
        <h3 class="section-title">B. Behavioral Risk Assessment</h3>
        <div class="checkbox-group"
          style="padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #fdfdfd;">
          <label><input type="checkbox" v-model="formData.behavioral_risk" value="Condomless_Sex_gt1" /> In the past 6
            months, did you have condomless sex with > 1 client/partner?</label>
          <label><input type="checkbox" v-model="formData.behavioral_risk" value="STI_Symptoms_Diagnosis" /> In the past
            6 months, did you get diagnosed with/experience symptoms of STIs?</label>
          <label><input type="checkbox" v-model="formData.behavioral_risk" value="Unaware_Partner_HIV_Status" /> Are you
            aware of your sexual/injecting partner’s HIV status?</label>
          <label><input type="checkbox" v-model="formData.behavioral_risk" value="Sex_Under_Influence" /> Do you
            recurrently have sex under the influence of alcohol/recreational drugs?</label>
          <label><input type="checkbox" v-model="formData.behavioral_risk" value="PEP_Last_6_Months" /> Have you taken
            post exposure prophylaxis (PEP) in the last 6 months?</label>
          <label><input type="checkbox" v-model="formData.behavioral_risk" value="Anticipate_Condomless_Sex" /> Do you
            anticipate condomless sex in the next 3 months?</label>
        </div>
        <p><strong>(Please note the potential PrEP user must fulfill at least one behavioral risk criteria to be
            suitable for PrEP)</strong></p>

        <!-- HIV Status Assessment -->
        <h3 class="section-title">C. HIV Status Assessment</h3>
        <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
          <label style="font-weight: 600; margin-bottom: 10px;">HIV Test (Rapid):</label>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 10px 15px;">
            <span style="margin-right: 5px;">Date:</span>
            <input type="date" v-model="formData.rapid_test_date" name="rapid_test_date"
              style="width: auto; max-width: 160px; padding: 0.4rem 0.6rem;" />
            <span style="margin-left: 15px; margin-right: 5px;">Result:</span>
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input
                type="radio" v-model="formData.rapid_test_result" name="rapid_test_result" value="positive" />
              Positive</label>
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input
                type="radio" v-model="formData.rapid_test_result" name="rapid_test_result" value="negative" />
              Negative</label>
          </div>
        </div>
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
          <label style="font-weight: 600; margin-bottom: 10px;">HIV 4th Generation HIV test:</label>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 10px 15px;">
            <span style="margin-right: 5px;">Date:</span>
            <input type="date" v-model="formData.generation_test_date" name="generation_test_date"
              style="width: auto; max-width: 160px; padding: 0.4rem 0.6rem;" />
            <span style="margin-left: 15px; margin-right: 5px;">Result:</span>
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input
                type="radio" v-model="formData.generation_test_result" name="generation_test_result" value="positive" />
              Positive</label>
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input
                type="radio" v-model="formData.generation_test_result" name="generation_test_result" value="negative" />
              Negative</label>
          </div>
        </div>

        <div style="margin-bottom: 15px; display: flex; gap: 15px; align-items: center;">
          <label style="margin-bottom: 0; font-weight: 600;">Willing to start PrEP:</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.start_prep" name="start_prep" value="Yes" required /> Yes
          </label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.start_prep" name="start_prep" value="No" /> No
          </label>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 15px; align-items: center;">
          <label style="margin-bottom: 0; font-weight: 600;">Willing to return for at least one follow-up visit:</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input
              type="radio" v-model="formData.follow_up" name="follow_up" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input
              type="radio" v-model="formData.follow_up" name="follow_up" value="No" required /> No</label>
        </div>

        <!-- Clinical/Medical Assessment -->
        <h3 class="section-title">D. Clinical/Medical Assessment</h3>
        <div class="checkbox-group"
          style="padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #fdfdfd;">
          <label><input type="checkbox" v-model="formData.medicalInfo" value="No_HIV_Exposure_Last_72h" /> No HIV risk
            exposure in the last 72 hours</label>
          <label><input type="checkbox" v-model="formData.medicalInfo" value="No_Acute_HIV_Symptoms" /> No
            signs/symptoms of acute HIV (AHI)</label>
          <label><input type="checkbox" v-model="formData.medicalInfo" value="No_Allergy_Contraindications_TDF_3TC" />
            No allergy or contraindications to Tenofovir + Lamivudine (TDF + 3TC)</label>
          <label><input type="checkbox" v-model="formData.medicalInfo" value="Medically_Suitable" /> Medically suitable
            to start PrEP</label>
        </div>

        <!-- PrEP Initiation -->
        <h3 class="section-title">E. PrEP Initiation</h3>
        <div style="margin-bottom: 15px; display: flex; gap: 15px; align-items: center;">
          <label style="margin-bottom: 0; font-weight: 600;">Suitable for PrEP:</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.suitable_for_prep" name="suitable_for_prep" value="Yes" required />
            Yes
          </label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.suitable_for_prep" name="suitable_for_prep" value="No" /> No
          </label>
        </div>

        <div v-if="formData.type_of_visit === 'Screening Visit MO'" id="prep-initiation-section">
          <label for="prep_initiation_date">Date of initiation of PrEP:</label>
          <input type="date" v-model="formData.prep_initiation_date" id="prep_initiation_date"
            name="prep_initiation_date" />
        </div>

        <!-- Prescriber Signature -->
        <h3 class="section-title">Prescriber’s Details</h3>
        <label>Date:</label>
        <input type="date" v-model="formData.signature_date" name="signature_date" readonly />
        <label>Name:</label>
        <input type="text" v-model="formData.prescriber_name" name="prescriber_name" readonly />
        <label>Designation:</label>
        <input type="text" v-model="formData.prescriber_designation" name="prescriber_designation" readonly />
        <label>BMHC NO:</label>
        <input type="text" v-model="formData.bmhc_no" name="bmhc_no" readonly />

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
          Review Data <!-- Changed Text -->
        </button>
      </div>
    </div>
  </form>

  <!-- Use the Confirmation Modal -->
  <Form1_ConfirmationModal v-if="isReviewModalVisible" :formData="formData" :isSubmitting="isSubmitting"
    :successMessage="modalSuccessMessage" :errorMessage="modalErrorMessage" @confirm="confirmAndSubmit"
    @cancel="cancelReview" />

  <!-- Final Messages outside modal -->
  <div v-if="!isReviewModalVisible && finalSubmitMessage" :class="finalSubmitClass" class="final-message">
    <p>{{ finalSubmitMessage }}</p>
  </div>
  <div v-if="!isReviewModalVisible && !finalSubmitMessage" style="text-align: center; margin-top: 20px;">
    <h4 class="section-title" style="margin-bottom: 1rem; font-size: 1.2rem;">Thank you for your time.</h4>
    <!-- Keep original success/error message display if needed for other purposes -->
    <div v-if="successMessage && !finalSubmitMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>
    <div v-if="errorMessage && !finalSubmitMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
// Import the modal component
import Form1_ConfirmationModal from './Form1_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIZ4yvln-49s0GgXemjmRGHGJ_kiV007OAAEwu44VTrllNA_ovtPTQBDsQCuHxDIsR7w/exec'; // Replace with your actual URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?gid=0&single=true&output=csv";
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500; // Milliseconds to show success message in modal

// --- State Variables ---
const formData = ref({
  date: '',
  participant_uid: '',
  type_of_visit: 'mst', // Default value
  kpo_group: '',
  prep_site: 'CHD/JDWNRH/Thimphu', // Default value
  age: null,
  weight: null,
  resident: '',
  behavioral_risk: [],
  rapid_test_date: '',
  rapid_test_result: '',
  generation_test_date: '',
  generation_test_result: '',
  start_prep: '',
  follow_up: '',
  medicalInfo: [],
  suitable_for_prep: '',
  prep_initiation_date: '',
  signature_date: '',
  prescriber_name: '',
  prescriber_designation: '',
  bmhc_no: ''
});

const statusMessage = ref(''); // For UID validation feedback
const statusClass = ref('');   // CSS class for UID feedback
const ageMessage = ref('');    // For age validation feedback
const isCheckingUid = ref(false); // Indicate if CSV lookup is in progress
const submitDisabled = ref(true); // Controls if "Review Data" button is enabled
const isSubmitting = ref(false);  // Controls submission loading state (for modal buttons)

// Modal Specific State
const isReviewModalVisible = ref(false);
const modalSuccessMessage = ref('');
const modalErrorMessage = ref('');

// Final Message State (shown after modal closes)
const finalSubmitMessage = ref('');
const finalSubmitClass = ref('');

// General feedback messages (can be removed if only modal/final messages are used)
const successMessage = ref('');
const errorMessage = ref('');

let csvData = []; // To store fetched CSV data

// --- Functions ---

// Initialize today's date
function initializeDate() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  formData.value.date = today;
  formData.value.signature_date = today;
}

// Fetch CSV data
async function fetchCsvData() {
  isCheckingUid.value = true;
  statusMessage.value = 'Loading validation data...';
  statusClass.value = '';
  submitDisabled.value = true; // Disable while loading

  try {
    // Using fetch as in original code
    const response = await fetch(CSV_DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    csvData = csvText.split('\n').map(row =>
      row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')) // Trim whitespace and quotes
    );
    console.log("CSV Data Loaded");
    statusMessage.value = 'Validation data loaded. Please enter UID.';
    if (formData.value.participant_uid) {
      validateUidOnInput(formData.value.participant_uid);
    } else {
      submitDisabled.value = true;
    }
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    statusMessage.value = 'Error loading validation data. Cannot check UID.';
    statusClass.value = 'error';
    csvData = [];
    submitDisabled.value = true;
  } finally {
    isCheckingUid.value = false;
    if (!formData.value.participant_uid && statusMessage.value.includes('Loading')) {
      statusMessage.value = '';
    }
  }
}

// Validate UID against fetched CSV data
function validateUid(uid) {
  if (!uid || !csvData || csvData.length <= 1) return false;
  const normalizedUid = uid.trim().toLowerCase();
  // Assuming UID is in the second column (index 1)
  return csvData.slice(1).some(row => row.length > 1 && row[1]?.toLowerCase() === normalizedUid);
}

// Function called on UID input change
function validateUidOnInput(newUid) {
  clearFinalMessage(); // Clear final message when UID changes
  modalErrorMessage.value = '';
  modalSuccessMessage.value = '';

  if (!newUid) {
    statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; return;
  }
  const pattern = new RegExp(`^[A-Za-z0-9]{${UID_MIN_LENGTH},}$`);
  if (!pattern.test(newUid)) {
    statusMessage.value = `Participant UID must be at least ${UID_MIN_LENGTH} alphanumeric characters.`;
    statusClass.value = 'error'; submitDisabled.value = true;
  } else if (isCheckingUid.value) {
    statusMessage.value = 'Checking UID...'; statusClass.value = ''; submitDisabled.value = true;
  } else if (csvData.length <= 1 && !isCheckingUid.value) { // Check if fetch failed or is complete but empty
    statusMessage.value = 'Validation data not available. Cannot check UID.'; statusClass.value = 'error'; submitDisabled.value = true;
  }
  else {
    if (validateUid(newUid)) {
      statusMessage.value = 'Participant UID found!'; statusClass.value = 'success'; submitDisabled.value = false;
    } else {
      statusMessage.value = 'Participant UID not found in records.'; statusClass.value = 'error'; submitDisabled.value = true;
    }
  }
}

// Watch for changes in the participant_uid field
watch(() => formData.value.participant_uid, (newUid) => {
  validateUidOnInput(newUid);
});


// Age validation
function checkAge() {
  if (formData.value.age !== null && formData.value.age < 15) {
    ageMessage.value = 'This age is not suitable for PrEP initiation.';
  } else {
    ageMessage.value = '';
  }
}

// --- Modal Control ---
const showReviewModal = () => {
  if (submitDisabled.value) {
    modalErrorMessage.value = "Please ensure the Participant UID is valid before reviewing.";
    // Display error message more prominently if needed
    return;
  }
  modalSuccessMessage.value = '';
  modalErrorMessage.value = '';
  clearFinalMessage();
  isReviewModalVisible.value = true;
};

const cancelReview = () => {
  isReviewModalVisible.value = false;
};

// --- Form Submission ---
const confirmAndSubmit = async () => {
  isSubmitting.value = true; // Set loading state for modal buttons
  modalSuccessMessage.value = '';
  modalErrorMessage.value = '';
  clearFinalMessage();

  try {
    // Prepare data: Ensure arrays are converted to semicolon-separated strings
    const dataToSend = { ...formData.value };
    Object.keys(dataToSend).forEach(key => {
      if (Array.isArray(dataToSend[key])) {
        dataToSend[key] = dataToSend[key].join('; '); // Example: using semicolon
      }
    });

    const formDataSerialized = new URLSearchParams(dataToSend).toString();

    const response = await axios.post(GOOGLE_SCRIPT_URL, formDataSerialized, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log("Submission response:", response);

    // Adjust success check based on your actual script response
    if (response.status === 200 && response.data && response.data.status === 'success') {
      modalSuccessMessage.value = response.data.message || 'Form submitted successfully!';
      setTimeout(() => {
        isReviewModalVisible.value = false; // Close modal
        setFinalMessage(response.data.message || 'Form submitted successfully!', 'success'); // Set final message
        clearForm(); // Reset the form fields
        // Reset UID validation state
        statusMessage.value = '';
        statusClass.value = '';
        submitDisabled.value = true;
        modalSuccessMessage.value = ''; // Clear modal message
      }, SUBMIT_SUCCESS_DELAY);
    } else {
      modalErrorMessage.value = response.data.message || 'Submission failed. Unexpected response from server.';
    }
  } catch (error) {
    console.error('Submission error:', error);
    let detailedError = 'An error occurred while submitting the form. Please try again.';
    if (error.response) {
      detailedError += ` (Status: ${error.response.status})`;
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      detailedError += ' (No response from server).';
    } else {
      detailedError += ` (${error.message})`;
    }
    modalErrorMessage.value = detailedError; // Show error in modal
  } finally {
    isSubmitting.value = false; // Reset loading state
  }
};

// Clear form data
const clearForm = () => {
  const prescriberDetails = {
    prescriber_name: formData.value.prescriber_name,
    prescriber_designation: formData.value.prescriber_designation,
    bmhc_no: formData.value.bmhc_no,
  };

  // Reset all fields except prescriber details and date fields
  Object.keys(formData.value).forEach(key => {
    if (key in prescriberDetails || key === 'date' || key === 'signature_date') return;

    if (Array.isArray(formData.value[key])) formData.value[key] = [];
    else if (typeof formData.value[key] === 'number') formData.value[key] = null;
    else if (key === 'type_of_visit') formData.value[key] = 'mst';
    else if (key === 'prep_site') formData.value[key] = 'CHD/JDWNRH/Thimphu';
    else if (key === 'resident') formData.value[key] = '';
    else formData.value[key] = '';
  });

  Object.assign(formData.value, prescriberDetails);
  initializeDate(); // Re-initialize dates

  ageMessage.value = ''; // Clear validation messages
  statusMessage.value = '';
  statusClass.value = '';
  submitDisabled.value = true; // Ensure submit is disabled after clear
  clearFinalMessage();
  // Clear general messages if they are being used
  successMessage.value = '';
  errorMessage.value = '';
};
// Get logged-in user details
const getLoggedInUser = () => {
  try {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Error parsing loggedInUser", e);
    return null;
  }
};

// --- Utility Functions for Final Message ---
function setFinalMessage(message, type) {
  finalSubmitMessage.value = message;
  finalSubmitClass.value = type === 'success' ? 'success-final' : 'error-final';
}
function clearFinalMessage() {
  finalSubmitMessage.value = '';
  finalSubmitClass.value = '';
}


// --- Lifecycle Hook ---
onMounted(() => {
  initializeDate(); // Set the current date on form load
  fetchCsvData();   // Fetch validation data

  // Populate prescriber details
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    formData.value.prescriber_name = loggedInUser.fullname || '';
    formData.value.prescriber_designation = loggedInUser.designation || '';
    formData.value.bmhc_no = loggedInUser.bhcno || '';
  } else {
    console.warn("Logged in user details not found in localStorage.");
    // Optionally clear fields if no user found
    formData.value.prescriber_name = '';
    formData.value.prescriber_designation = '';
    formData.value.bmhc_no = '';
  }

  // Removed the direct event listener for UID input - using watch now.
});

</script>

<style>
/* Keep the original styles provided by the user */
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
}

input,
select,
textarea {
  /* Added textarea for completeness */
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  /* Slightly softer border */
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 0.95rem;
}

input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

input[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
}


input[type="radio"],
input[type="checkbox"] {
  width: auto;
  /* Override width: 100% */
  margin-right: 8px;
  vertical-align: middle;
  /* Align better */
}

/* Ensure labels containing radios/checkboxes don't have extra bottom margin */
label>input[type="radio"],
label>input[type="checkbox"] {
  margin-bottom: 0;
}


.section-title {
  font-size: 1.5rem;
  color: #3498db;
  margin-top: 25px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.section-title:first-of-type {
  margin-top: 0;
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
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
  /* Darker blue on hover */
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}


#status-message {
  margin-top: -10px;
  /* Position closer to input */
  margin-bottom: 15px;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  border-width: 1px;
  border-style: solid;
}

#status-message.success {
  background-color: #dff0d8;
  color: #3c763d;
  border-color: #d6e9c6;
}

#status-message.error {
  background-color: #f2dede;
  color: #a94442;
  border-color: #ebccd1;
}

.uid-spinner {
  margin-left: 10px;
  color: #3498db;
  font-size: 0.9em;
}

.submitting-indicator {
  /* Style for potential use */
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
  color: #3498db;
}

.success-message {
  /* Original general message style */
  color: green;
  text-align: center;
  font-weight: bold;
  margin-top: 15px;
}

.error-message {
  /* Original general message style */
  color: red;
  text-align: center;
  font-weight: bold;
  margin-top: 15px;
}

/* Final Submit Message (outside modal) */
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