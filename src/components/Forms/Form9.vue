<template>
  <!-- DRUG DISTRIBUTION Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed submit action -->
    <div class="container">
      <!-- Container 1: Basic Info & Setup -->
      <div class="form-container">


        <label for="person-dispensing">Name of the person dispensing PrEP:</label>
        <input type="text" v-model="formData.person_dispensing" id="person-dispensing" name="person_dispensing" readonly>

        <label for="orw-follow-up">Name of the Outreach Worker following up with Client:</label>
        <input type="text" v-model="formData.orw_followup" id="orw-follow-up" name="orw_followup" required>

        <label for="client-receiving">Name of the client receiving PrEP:</label>
        <input type="text" v-model="formData.client_receiving" id="client-receiving" name="client_receiving" readonly>

        <label for="participant_uid">Participant UID:</label>
        <input type="text" v-model="formData.participant_uid" id="participant_uid" name="participant_uid" required
          pattern="[A-Za-z0-9]{5,}" title="Minimum 5 Alphanumeric characters only" />
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
        <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label>Medic taking for:</label>
         <div class="radio-group-vertical" style="border: none; padding: 0; background: none;">
            <label><input type="radio" v-model="formData.medication" name="medication_month" value="M1" required @change="updateSignatures" /> Month 1 - As prescribed</label>
            <label><input type="radio" v-model="formData.medication" name="medication_month" value="M3" required @change="updateSignatures" /> Month 3 - As prescribed</label>
            <label><input type="radio" v-model="formData.medication" name="medication_month" value="M6" required @change="updateSignatures" /> Month 6 - As prescribed</label>
            <label><input type="radio" v-model="formData.medication" name="medication_month" value="M9" required @change="updateSignatures" /> Month 9 - As prescribed</label>
            <label><input type="radio" v-model="formData.medication" name="medication_month" value="M12" required @change="updateSignatures" /> Month 12 - As prescribed</label>
        </div>
      </div>

      <!-- Container 2: Dispensing Table -->
      <div class="form-container">
          <h3 class="section-title">Drug Dispensing Log</h3>
           <div class="table-responsive">
                <table border="1">
                  <thead>
                    <tr>
                      <th>Schedule</th>
                      <th>Date</th>
                      <th># bottle/s dispensed (lot/batch#)</th>
                      <th>Next Due Date</th>
                      <th>Dispenser Signature</th>
                      <th>Recipient Signature</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Month 1 -->
                    <tr v-if="formData.medication === 'M1'">
                      <td>Month 1</td>
                      <td><input type="date" v-model="formData.date_month1" required></td>
                      <td><input type="text" v-model="formData.bottles_month1" placeholder="e.g., 1 (AB123)" required></td>
                      <td><input type="date" v-model="formData.due_date_month1" required></td>
                      <td><input type="text" v-model="formData.dispensing_sign_month1" readonly></td>
                      <td><input type="text" v-model="formData.recipient_sign_month1" readonly></td>
                      <td><input type="text" v-model="formData.remarks_month1"></td>
                    </tr>
                    <!-- Month 3 -->
                     <tr v-if="formData.medication === 'M3'">
                      <td>Month 3</td>
                      <td><input type="date" v-model="formData.date_month3" required></td>
                      <td><input type="text" v-model="formData.bottles_month3" placeholder="e.g., 1 (CD456)" required></td>
                      <td><input type="date" v-model="formData.due_date_month3" required></td>
                      <td><input type="text" v-model="formData.dispensing_sign_month3" readonly></td>
                      <td><input type="text" v-model="formData.recipient_sign_month3" readonly></td>
                      <td><input type="text" v-model="formData.remarks_month3"></td>
                    </tr>
                    <!-- Month 6 -->
                    <tr v-if="formData.medication === 'M6'">
                      <td>Month 6</td>
                      <td><input type="date" v-model="formData.date_month6" required></td>
                      <td><input type="text" v-model="formData.bottles_month6" placeholder="e.g., 1 (EF789)" required></td>
                      <td><input type="date" v-model="formData.due_date_month6" required></td>
                      <td><input type="text" v-model="formData.dispensing_sign_month6" readonly></td>
                      <td><input type="text" v-model="formData.recipient_sign_month6" readonly></td>
                      <td><input type="text" v-model="formData.remarks_month6"></td>
                    </tr>
                    <!-- Month 9 -->
                    <tr v-if="formData.medication === 'M9'">
                      <td>Month 9</td>
                      <td><input type="date" v-model="formData.date_month9" required></td>
                      <td><input type="text" v-model="formData.bottles_month9" placeholder="e.g., 1 (GH012)" required></td>
                      <td><input type="date" v-model="formData.due_date_month9" required></td>
                      <td><input type="text" v-model="formData.dispensing_sign_month9" readonly></td>
                      <td><input type="text" v-model="formData.recipient_sign_month9" readonly></td>
                      <td><input type="text" v-model="formData.remarks_month9"></td>
                    </tr>
                    <!-- Month 12 -->
                     <tr v-if="formData.medication === 'M12'">
                      <td>Month 12</td>
                      <td><input type="date" v-model="formData.date_month12" required></td>
                      <td><input type="text" v-model="formData.bottles_month12" placeholder="e.g., 1 (IJ345)" required></td>
                      <td><input type="date" v-model="formData.due_date_month12" required></td>
                      <td><input type="text" v-model="formData.dispensing_sign_month12" readonly></td>
                      <td><input type="text" v-model="formData.recipient_sign_month12" readonly></td>
                      <td><input type="text" v-model="formData.remarks_month12"></td>
                    </tr>
                     <!-- Placeholder if no month selected -->
                      <tr v-if="!formData.medication">
                          <td colspan="7" style="text-align: center; font-style: italic; color: grey;">Select a Medication Month above to enter details</td>
                      </tr>
                  </tbody>
                </table>
            </div>
            <p><strong>Note:</strong> This sheet is to be maintained for each client every time they collect/receive the medicine...</p>

    <h3>Instructions:</h3>
    <ul>
      <li><strong>Name of the person dispensing PrEP:</strong> Enter the name of the individual providing the medication.</li>
      <li><strong>Name of the outreach worker:</strong> Enter the name of the outreach worker responsible for reminding the client about medication collection.</li>
      <li><strong>Name of the client receiving PrEP:</strong> Enter the registered client's name.</li>
      <li><strong>UIC:</strong> Enter the client's Unique Identifier Code (UIC).</li>
      <li><strong>Date:</strong> Enter the date the medication is given to the client.</li>
      <li><strong># Of bottle/s dispensed:</strong> Indicate how many bottles were dispensed and include the lot/batch number.</li>
      <li><strong>Next Due Date:</strong> Enter the date when the client is due for their next medication.</li>
      <li><strong>Signature of the person dispensing PrEP:</strong> The dispensing person should sign here.</li>
      <li><strong>Signature of the recipient:</strong> The client receiving the medication should sign here.</li>
      <li><strong>Remarks:</strong> Note any alternate arrangements if the client is unable to collect the PrEP on the due date.</li>
    </ul>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting || !formData.medication"> <!-- Disable if no month selected -->
          {{ isSubmitting ? 'Submitting...' : 'Review Data' }} <!-- Changed Text -->
        </button>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form9_ConfirmationModal v-if="isReviewModalVisible"
    :formData="formData"
    :isSubmitting="isSubmitting"
    :successMessage="modalSuccessMessage"
    :errorMessage="modalErrorMessage"
    @confirm="confirmAndSubmit"
    @cancel="cancelReview"
  />

   <!-- Final Messages outside modal -->
   <div v-if="!isReviewModalVisible && finalSubmitMessage" :class="finalSubmitClass" class="final-message">
     <p>{{ finalSubmitMessage }}</p>
   </div>
  <div v-if="!isReviewModalVisible && !finalSubmitMessage" style="text-align: center; margin-top: 20px;">
    <h4 class="section-title" style="margin-bottom: 1rem; font-size: 1.2rem;">Thank you for your time.</h4>
     <div v-if="successMessage && !finalSubmitMessage" class="success-message"> <p>{{ successMessage }}</p> </div>
     <div v-if="errorMessage && !finalSubmitMessage" class="error-message"> <p>{{ errorMessage }}</p> </div>
      <div v-if="isSubmitting && !isReviewModalVisible" class="submitting-indicator">Submitting...</div>
  </div>

</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import Form9_ConfirmationModal from './Form9_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby11ulXb3gN6YVpqQLokpsZPUz9kAO3nm-T0QPX1bX53BVluBen1KAT2s4ECrRDts2E/exec'; // FORM 9 URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?output=csv";
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  participant_uid: '',
  person_dispensing: '', orw_followup: '', client_receiving: '', medication: '', prep_site: '', date: '', // Added prep_site and date
  // Month 1
  date_month1: '', bottles_month1: '', due_date_month1: '', recipient_sign_month1: '', dispensing_sign_month1: '', remarks_month1: '',
  // Month 3
  date_month3: '', bottles_month3: '', due_date_month3: '', recipient_sign_month3: '', dispensing_sign_month3: '', remarks_month3: '',
  // Month 6
  date_month6: '', bottles_month6: '', due_date_month6: '', recipient_sign_month6: '', dispensing_sign_month6: '', remarks_month6: '',
  // Month 9
  date_month9: '', bottles_month9: '', due_date_month9: '', recipient_sign_month9: '', dispensing_sign_month9: '', remarks_month9: '',
  // Month 12
  date_month12: '', bottles_month12: '', due_date_month12: '', recipient_sign_month12: '', dispensing_sign_month12: '', remarks_month12: ''
});


// Feedback & Control State
const statusMessage = ref(''); const statusClass = ref('');
const submitDisabled = ref(true); const isCheckingUid = ref(false); const isSubmitting = ref(false);
const isReviewModalVisible = ref(false); const modalSuccessMessage = ref(''); const modalErrorMessage = ref('');
const finalSubmitMessage = ref(''); const finalSubmitClass = ref('');
const successMessage = ref(''); const errorMessage = ref('');
let csvData = [];

// --- Computed Property to get current month suffix ---
const currentMonthSuffix = computed(() => {
    if (!formData.value.medication) return null; // No month selected
    // Return 'month1', 'month3', 'month6', 'month9', 'month12'
    return `month${formData.value.medication.substring(1)}`;
});

// --- Functions ---
const initializeDate = () => {
    // Set the main date field if needed, but table dates are user-entered
    formData.value.date = new Date().toISOString().split('T')[0];
};

// Automatically update signatures when UID or Dispenser changes
const updateSignatures = () => {
    const monthSuffix = currentMonthSuffix.value;
    if (!monthSuffix) return; // Exit if no month selected

    const uid = formData.value.participant_uid;
    const dispenser = formData.value.person_dispensing;

    formData.value[`recipient_sign_${monthSuffix}`] = uid;
    formData.value[`dispensing_sign_${monthSuffix}`] = dispenser;
    formData.value.client_receiving = uid; // Also update the client name field

    // Optional: Set the date for the selected month row to today's date automatically
     if (!formData.value[`date_${monthSuffix}`]) { // Only set if not already set
       formData.value[`date_${monthSuffix}`] = new Date().toISOString().split('T')[0];
     }
};

// Watchers to trigger signature updates
watch(() => formData.value.participant_uid, updateSignatures);
watch(() => formData.value.person_dispensing, updateSignatures);
watch(() => formData.value.medication, updateSignatures); // Update when month changes


const fetchCsvData = async () => { /* ... same as before ... */
    isCheckingUid.value = true; statusMessage.value = 'Loading validation data...'; statusClass.value = ''; submitDisabled.value = true;
      try {
        const response = await fetch(CSV_DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();
        csvData = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        console.log("CSV Data Loaded for Form 9");
        statusMessage.value = 'Validation data loaded.';
        if(formData.value.participant_uid) validateUidOnInput(formData.value.participant_uid); else submitDisabled.value = true;
      } catch (error) {
        console.error('Error fetching CSV data for Form 9:', error);
        statusMessage.value = 'Error loading validation data.'; statusClass.value = 'error'; csvData = []; submitDisabled.value = true;
      } finally { isCheckingUid.value = false; if (!formData.value.participant_uid && statusMessage.value.includes('Loading')) statusMessage.value = ''; }
};
const validateUid = (uid) => { /* ... same as before ... */
    if (!uid || !csvData || csvData.length <= 1) return false;
    const normalizedUid = uid.trim().toLowerCase();
    return csvData.slice(1).some(row => row.length > 1 && row[1]?.toLowerCase() === normalizedUid);
};
const validateUidOnInput = (newUid) => { /* ... same as before ... */
     clearFinalMessage(); modalErrorMessage.value = ''; modalSuccessMessage.value = '';
    if (!newUid) { statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; return; }
    const pattern = new RegExp(`^[A-Za-z0-9]{${UID_MIN_LENGTH},}$`);
    if (!pattern.test(newUid)) { statusMessage.value = `UID min ${UID_MIN_LENGTH} chars.`; statusClass.value = 'error'; submitDisabled.value = true; }
    else if (isCheckingUid.value) { statusMessage.value = 'Checking UID...'; statusClass.value = ''; submitDisabled.value = true; }
    else if (csvData.length <= 1 && !isCheckingUid.value) { statusMessage.value = 'Validation data unavailable.'; statusClass.value = 'error'; submitDisabled.value = true; }
    else { if (validateUid(newUid)) { statusMessage.value = 'UID found!'; statusClass.value = 'success'; submitDisabled.value = false; }
           else { statusMessage.value = 'UID not found.'; statusClass.value = 'error'; submitDisabled.value = true; }
    }
};
watch(() => formData.value.participant_uid, validateUidOnInput);

// Modal Control
const showReviewModal = () => {
  if (submitDisabled.value) { modalErrorMessage.value = "Invalid UID."; return; }
  if (!formData.value.medication) { errorMessage.value = "Please select the Medication Month."; return; } // Ensure month is selected
  modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  isReviewModalVisible.value = true;
};
const cancelReview = () => { isReviewModalVisible.value = false; };

// Inside Form9.vue <script setup>

const confirmAndSubmit = async () => {
   if (!formData.value.medication) {
     modalErrorMessage.value = 'Please select a medication month.';
     return;
   }
   isSubmitting.value = true;
   modalSuccessMessage.value = ''; // Clear previous messages
   modalErrorMessage.value = '';
   clearFinalMessage(); // Clear final message from previous attempts
   const url = GOOGLE_SCRIPT_URL;

   try {
     // Prepare only the necessary data (as before)
     const monthSuffix = currentMonthSuffix.value; // Ensure this uses 'monthX' format from previous fix
     const dataToSend = {
         participant_uid: formData.value.participant_uid,
         person_dispensing: formData.value.person_dispensing,
         orw_followup: formData.value.orw_followup,
         client_receiving: formData.value.client_receiving, // Should be UID
         medication: formData.value.medication,
         prep_site: formData.value.prep_site, // Make sure this has a value if needed
         date: formData.value[`date_${monthSuffix}`],
         bottles_dispensed: formData.value[`bottles_${monthSuffix}`],
         next_due_date: formData.value[`due_date_${monthSuffix}`],
         dispensing_signature: formData.value[`dispensing_sign_${monthSuffix}`],
         recipient_signature: formData.value[`recipient_sign_${monthSuffix}`],
         remarks: formData.value[`remarks_${monthSuffix}`]
     };

     const formDataSerialized = new URLSearchParams(dataToSend).toString();
     console.log("Submitting Form 9 data:", dataToSend);

     const response = await axios.post(url, formDataSerialized, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
     console.log("Form 9 Response:", response.data); // Log the actual data received

     // --- *** CORRECTED SUCCESS/ERROR HANDLING *** ---
     if (response.status === 200 && response.data && response.data.status === 'success') {
       // SUCCESS CASE: Check the 'status' property of the response object
       modalSuccessMessage.value = response.data.message || 'Form 9 submitted successfully!'; // Use the message from response

       setTimeout(() => {
         isReviewModalVisible.value = false; // Close modal
         // Set the final message displayed *outside* the modal
         setFinalMessage(modalSuccessMessage.value, 'success');
         clearForm(); // Call clearForm HERE
         // Reset modal-specific messages after using them
         modalSuccessMessage.value = '';
         modalErrorMessage.value = '';
          // Reset UID status and disable submit until new UID check
         statusMessage.value = '';
         statusClass.value = '';
         submitDisabled.value = true;
       }, SUBMIT_SUCCESS_DELAY);

     } else {
       // ERROR CASE: Either status != 200, no data, or data.status is not 'success'
       let errorMsg = 'Submission failed.';
       if (response.data && response.data.message) {
           // Use specific error message from script if available
           errorMsg = response.data.message;
       } else if (typeof response.data === 'string' && response.data) {
           // Handle plain string error response
           errorMsg = response.data;
       } else if (response.status !== 200) {
           errorMsg = `Submission failed with status: ${response.status}`;
       }
        // Check if it might be a success object misinterpreted as error
        else if (response.data && response.data.status === 'success') {
             console.warn("Success response treated as error, check logic.");
             errorMsg = response.data.message || "Unexpected success format.";
             // Still treat as error visually in modal if logic ended here
        }

       modalErrorMessage.value = errorMsg;
        // Optionally set final message on error too, if desired
       // setFinalMessage(errorMsg, 'error');
     }
     // --- *** END CORRECTION *** ---

   } catch (error) {
     console.error('Form 9 Submit Error:', error);
     let detailedError = 'Error submitting Form 9.';
     // Try to get more specific error from response if available
      if (error.response && error.response.data && error.response.data.message) {
           detailedError = error.response.data.message; // Prefer server error message
      } else if (error.response && error.response.data && typeof error.response.data === 'string') {
           detailedError = error.response.data;
      } else if (error.response) {
          detailedError += ` (Status: ${error.response.status})`;
      } else if (error.request) {
          detailedError += ' (No response received)';
      } else {
          detailedError += ` (${error.message})`;
      }
     modalErrorMessage.value = detailedError;
      // Optionally set final message on catch error too
      // setFinalMessage(detailedError, 'error');

   } finally {
     isSubmitting.value = false; // Ensure this runs regardless of success/error
   }
};

// Clear Form
const clearForm = () => {
    const dispenserDetails = { person_dispensing: formData.value.person_dispensing, designation: formData.value.designation, bmhc_number: formData.value.bmhc_number };
    // Reset most fields, keep dispenser details
    Object.keys(formData.value).forEach(key => {
         if (key in dispenserDetails || key === 'date') return; // Keep these
         if (Array.isArray(formData.value[key])) formData.value[key] = [];
         else if (typeof formData.value[key] === 'boolean') formData.value[key] = false;
         else if (typeof formData.value[key] === 'number') formData.value[key] = null;
         else if (key === 'prep_site') formData.value[key] = '';
         else formData.value[key] = ''; // Clear strings and dates related to months etc.
    });
    Object.assign(formData.value, dispenserDetails); initializeDate();
    statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; clearFinalMessage();
    successMessage.value = ''; errorMessage.value = '';
};

// Logged In User
const getLoggedInUser = () => {
     try { const user = localStorage.getItem('loggedInUser'); return user ? JSON.parse(user) : null; }
     catch (e) { console.error("Error parsing loggedInUser", e); return null; }
};

// Final Message Utils
function setFinalMessage(message, type) { finalSubmitMessage.value = message; finalSubmitClass.value = type === 'success' ? 'success-final' : 'error-final'; }
function clearFinalMessage() { finalSubmitMessage.value = ''; finalSubmitClass.value = ''; }

// onMounted
onMounted(() => {
  initializeDate(); fetchCsvData();
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    formData.value.person_dispensing = loggedInUser.fullname || '';
    // Assuming 'name' should also be pre-filled if it's the same person
    // formData.value.name = loggedInUser.fullname || '';
    formData.value.designation = loggedInUser.designation || '';
    formData.value.bmhc_number = loggedInUser.bhcno || '';
    // Auto-fill dispenser signature based on who is logged in for the *currently selected* month
    updateSignatures();
  } else {
      console.warn("Form 9: Logged in user details not found.");
       formData.value.person_dispensing = ''; formData.value.designation = ''; formData.value.bmhc_number = '';
       // Clear corresponding signatures if no user
       const monthSuffix = currentMonthSuffix.value;
       if (monthSuffix) formData.value[`dispensing_sign_${monthSuffix}`] = '';
  }
});
</script>

<style>
/* Keep the original styles */
.form-container { padding: 2rem; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-bottom: 2rem; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input, select, textarea { width: 100%; padding: 0.5rem; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 0.95rem; }
input:focus, select:focus, textarea:focus { border-color: #3498db; outline: none; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }
input[readonly] { background-color: #f8f9fa; cursor: not-allowed; }
input[type="radio"], input[type="checkbox"] { width: auto; margin-right: 8px; vertical-align: middle; }
label > input[type="radio"], label > input[type="checkbox"] { margin-bottom: 0; }
.radio-group-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
.radio-group-vertical label { font-weight: normal; display: inline-flex; align-items: center; margin-bottom: 0; }
.section-title { font-size: 1.5rem; color: #3498db; margin-top: 25px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #eee; }
.section-title:first-of-type { margin-top: 0; }
.submit-btn { background-color: #3498db; color: #fff; padding: 0.75rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.2s ease; margin-top: 1rem; display: block; width: auto; margin-left: auto; margin-right: auto; }
.submit-btn:hover:not(:disabled) { background-color: #2980b9; }
.submit-btn:disabled { background-color: #bdc3c7; cursor: not-allowed; opacity: 0.7; }
#status-message { margin-top: -10px; margin-bottom: 15px; padding: 8px 10px; border-radius: 4px; font-size: 0.9em; border-width: 1px; border-style: solid; }
#status-message.success { background-color: #dff0d8; color: #3c763d; border-color: #d6e9c6; }
#status-message.error { background-color: #f2dede; color: #a94442; border-color: #ebccd1; }
.uid-spinner { margin-left: 10px; color: #3498db; font-size: 0.9em; }
.table-responsive { overflow-x: auto; margin-bottom: 1rem; }
table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; font-size: 0.9rem; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: middle; }
th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
td input[type="radio"], td input[type="checkbox"] { display: block; margin: 0 auto; }
.yes-no-radio { display: flex; justify-content: center; gap: 15px; }
.yes-no-radio label { margin-bottom: 0; font-weight: normal; }
td input[type="text"], td input[type="date"] { width: 95%; padding: 0.3rem 0.4rem; margin-bottom: 0; font-size: 0.9rem; }
ul { padding-left: 20px; margin-top: 0.5rem; margin-bottom: 1rem; font-size: 0.9em; color: #444;}
ul li { margin-bottom: 5px; }
.success-message { color: green; text-align: center; font-weight: bold; margin-top: 15px; }
.error-message { color: red; text-align: center; font-weight: bold; margin-top: 15px; }
.submitting-indicator { margin-top: 20px; text-align: center; font-size: 1.2rem; color: #3498db; }
.final-message { max-width: 700px; margin: 20px auto; padding: 15px 20px; border-radius: 5px; text-align: center; font-weight: 500; }
.final-message.success-final { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.final-message.error-final { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
</style>