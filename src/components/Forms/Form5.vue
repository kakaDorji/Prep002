<template>
  <!-- Unschedule Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed submit action -->
    <div class="container">
      <!-- Container 1: Basic Info & Reason -->
      <div class="form-container">
        <p><strong>Note to interviewer:</strong> This tool is only for clients visiting the clinic beyond their scheduled visits. This is an open-ended questionnaire. Please use it as a guide/probe to find out the reason for the visit.</p>

        <label for="participant_uid">Participant UID:</label>
        <input type="text" v-model="formData.participant_uid" id="participant_uid" name="participant_uid" required
          pattern="[A-Za-z0-9]{5,}" title="Minimum 5 Alphanumeric characters only" />
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
        <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label for="prep_site">PrEP site:</label>
        <select name="prep_site" id="prep_site" v-model="formData.prep_site" required>
          <option value="" disabled>Select a PrEP site</option>
          <option value="CHD/JDWNRH/Thimphu">CHD/JDWNRH/ Thimphu</option>
          <option value="HISC/Thimphu">HISC/Thimphu</option>
          <option value="Paro Hospital/Paro">Paro Hospital/ Paro</option>
          <option value="Phuntsholing Hospital/Chukha">Phuntsholing hospital/Chukha</option>
          <option value="HISC/Phuntsholing">HISC /Phuntsholing</option>
          <option value="CRRH/Gelephu/Sarpang">CRRH /Gelephu / Sarpang</option>
          <option value="HISC/Gelephu">HISC/ Gelephu</option>
        </select>

        <label for="dateInput">DATE:</label>
        <input type="date" id="dateInput" name="date" v-model="formData.date" readonly/> <!-- Made readonly as it's initialized -->

        <label>1. What is the reason for this visit? (Tick one or more answers)</label>
         <div class="checkbox-group-vertical">
             <label><input type="checkbox" v-model="formData.reason_visit" value="Side effects from PrEP" /> Side effects from PrEP</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="Wish to discontinue PrEP" /> Wish to discontinue PrEP</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="STI symptoms/Screening" /> STI symptoms/Screening</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="Change of dose/regimen" /> Change of dose/regimen</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="Additional doses of PrEP" /> Additional doses of PrEP</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="New medical problem" /> New medical problem</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="Follow up for existing medical problem" /> Follow up for existing medical problem</label>
             <label><input type="checkbox" v-model="formData.reason_visit" value="Other" /> Other</label>
              <!-- Textarea for "Other" reason -->
             <div v-if="Array.isArray(formData.reason_visit) && formData.reason_visit.includes('Other')" style="margin-top: 0px;">
                 <textarea v-model="formData.other_reason_visit" rows="3" placeholder="Describe other reasons..."></textarea>
             </div>
         </div>

        <label style="margin-top: 1rem;">2. If answered “Side effects from PrEP above”: Please describe the side effects you have experienced. Probe for common side effects e.g., nausea, vomiting, abdominal cramps, fatigue, dizziness, headache.</label>
        <div class="table-responsive">
            <table border="1" cellspacing="0" cellpadding="5" class="symptoms-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Side effects</th>
                  <th style="width: 150px">Yes/No</th> <!-- Adjusted width -->
                  <th>Ongoing</th>
                  <th>Resolved</th>
                </tr>
              </thead>
              <tbody>
                 <tr>
                    <td>1</td> <td>Nausea</td>
                    <td><div class="yes-no-radio"><label><input type="radio" name="nausea" v-model="formData.nausea" value="Yes"/> Y</label><label><input type="radio" name="nausea" v-model="formData.nausea" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.nausea_ongoing" :disabled="formData.nausea!=='Yes'||formData.nausea_resolved" @change="handleSideEffectCheck('nausea', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.nausea_resolved" :disabled="formData.nausea!=='Yes'||formData.nausea_ongoing" @change="handleSideEffectCheck('nausea', 'resolved')"/></td>
                </tr>
                <tr>
                    <td>2</td> <td>Vomiting</td>
                    <td><div class="yes-no-radio"><label><input type="radio" name="vomiting" v-model="formData.vomiting" value="Yes"/> Y</label><label><input type="radio" name="vomiting" v-model="formData.vomiting" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.vomiting_ongoing" :disabled="formData.vomiting!=='Yes'||formData.vomiting_resolved" @change="handleSideEffectCheck('vomiting', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.vomiting_resolved" :disabled="formData.vomiting!=='Yes'||formData.vomiting_ongoing" @change="handleSideEffectCheck('vomiting', 'resolved')"/></td>
                </tr>
                <tr>
                    <td>3</td> <td>Abdominal cramps</td>
                     <td><div class="yes-no-radio"><label><input type="radio" name="cramps" v-model="formData.abdominal_cramps" value="Yes"/> Y</label><label><input type="radio" name="cramps" v-model="formData.abdominal_cramps" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.abdominal_cramps_ongoing" :disabled="formData.abdominal_cramps!=='Yes'||formData.abdominal_cramps_resolved" @change="handleSideEffectCheck('abdominal_cramps', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.abdominal_cramps_resolved" :disabled="formData.abdominal_cramps!=='Yes'||formData.abdominal_cramps_ongoing" @change="handleSideEffectCheck('abdominal_cramps', 'resolved')"/></td>
                </tr>
                <tr>
                    <td>4</td> <td>Fatigue</td>
                    <td><div class="yes-no-radio"><label><input type="radio" name="fatigue" v-model="formData.fatigue" value="Yes"/> Y</label><label><input type="radio" name="fatigue" v-model="formData.fatigue" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.fatigue_ongoing" :disabled="formData.fatigue!=='Yes'||formData.fatigue_resolved" @change="handleSideEffectCheck('fatigue', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.fatigue_resolved" :disabled="formData.fatigue!=='Yes'||formData.fatigue_ongoing" @change="handleSideEffectCheck('fatigue', 'resolved')"/></td>
                </tr>
                 <tr>
                    <td>5</td> <td>Dizziness</td>
                     <td><div class="yes-no-radio"><label><input type="radio" name="dizziness" v-model="formData.dizziness" value="Yes"/> Y</label><label><input type="radio" name="dizziness" v-model="formData.dizziness" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.dizziness_ongoing" :disabled="formData.dizziness!=='Yes'||formData.dizziness_resolved" @change="handleSideEffectCheck('dizziness', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.dizziness_resolved" :disabled="formData.dizziness!=='Yes'||formData.dizziness_ongoing" @change="handleSideEffectCheck('dizziness', 'resolved')"/></td>
                </tr>
                 <tr>
                    <td>6</td> <td>Headache</td>
                    <td><div class="yes-no-radio"><label><input type="radio" name="headache" v-model="formData.headache" value="Yes"/> Y</label><label><input type="radio" name="headache" v-model="formData.headache" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.headache_ongoing" :disabled="formData.headache!=='Yes'||formData.headache_resolved" @change="handleSideEffectCheck('headache', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.headache_resolved" :disabled="formData.headache!=='Yes'||formData.headache_ongoing" @change="handleSideEffectCheck('headache', 'resolved')"/></td>
                </tr>
                <tr>
                    <td>7</td> <td>Others (please describe below)</td>
                    <td><div class="yes-no-radio"><label><input type="radio" name="others" v-model="formData.others" value="Yes"/> Y</label><label><input type="radio" name="others" v-model="formData.others" value="No"/> N</label></div></td>
                    <td><input type="checkbox" v-model="formData.others_ongoing" :disabled="formData.others!=='Yes'||formData.others_resolved" @change="handleSideEffectCheck('others', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.others_resolved" :disabled="formData.others!=='Yes'||formData.others_ongoing" @change="handleSideEffectCheck('others', 'resolved')"/></td>
                </tr>
              </tbody>
            </table>
        </div>
        <textarea v-if="formData.others === 'Yes'" v-model="formData.others_description" rows="3"
          placeholder="Please describe other side effects..."></textarea>

        <label style="margin-top: 1rem;">3. Have you had any challenges taking your PrEP as per prescribed doses?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.challenges_prep" name="challenges_prep" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.challenges_prep" name="challenges_prep" value="No" required @click="formData.challenges_details = ''" /> No</label>
        </div>
        <textarea v-if="formData.challenges_prep === 'Yes'" v-model="formData.challenges_details" rows="3"
          placeholder="If yes, describe the challenges..."></textarea>

        <label>4. If answered “Additional doses of PrEP above”: Please provide more information (e.g., Loss/theft, travel?)</label>
        <textarea v-model="formData.additional_doses_details" rows="3" placeholder="Provide details..."></textarea>

        <label>5. Do you wish to stop taking PrEP or continue?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_continue" name="prep_continue" value="Stop" required /> Stop</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_continue" name="prep_continue" value="Continue" required /> Continue</label>
        </div>

        <div v-if="formData.prep_continue === 'Stop'">
          <label>• If stopping, provide reasons:</label>
          <textarea v-model="formData.stopping_reasons" rows="3" placeholder="Provide reasons"></textarea>
          <label>• Preferred Prevention method after stopping:</label>
          <textarea v-model="formData.stopping_Preventionmethod" rows="3" placeholder="Specify method"></textarea>
        </div>

        <label>6. Other notes, tests performed, referrals made, etc.</label>
        <textarea v-model="formData.other_notes" rows="4" placeholder="Write any other relevant notes..."></textarea>

        <!-- Signature Section (Readonly) -->
        <h3 class="section-title" style="margin-top: 2rem;">Interviewer Details</h3>
        <label for="interviewer_name">Name:</label>
        <input type="text" v-model="formData.interviewer_name" id="interviewer_name" name="interviewer_name" readonly />

        <label for="designation">Designation:</label>
        <input type="text" v-model="formData.designation" id="designation" name="designation" readonly />

        <label for="bmhc_number">BMHC Number:</label>
        <input type="text" v-model="formData.bmhc_number" id="bmhc_number" name="bmhc_number" readonly />
      </div>

      <!-- Submit Button -->
       <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Review Data' }} <!-- Changed Text -->
      </button>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form5_ConfirmationModal v-if="isReviewModalVisible" 
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
     <!-- Original general message display (optional) -->
     <div v-if="successMessage && !finalSubmitMessage" class="success-message">
       <p>{{ successMessage }}</p>
     </div>
     <div v-if="errorMessage && !finalSubmitMessage" class="error-message">
       <p>{{ errorMessage }}</p>
     </div>
      <!-- Original loading indicator -->
      <div v-if="isSubmitting && !isReviewModalVisible" class="submitting-indicator">Submitting...</div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
// Import the NEW modal component
import Form5_ConfirmationModal from './Form5_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz83xkV9azv7v6QwkMWOOLcVeAoG8ux2HtQwpuJHBOHsQ9Ec5JX-oGn8OFE7eLFFq5I/exec'; // Replace with Form 5 Script URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?gid=0&single=true&output=csv"; // UID validation source
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  participant_uid: '', prep_site: '', date: '',
  reason_visit: [], other_reason_visit: '',
  nausea: '', nausea_ongoing: false, nausea_resolved: false,
  vomiting: '', vomiting_ongoing: false, vomiting_resolved: false,
  abdominal_cramps: '', abdominal_cramps_ongoing: false, abdominal_cramps_resolved: false,
  fatigue: '', fatigue_ongoing: false, fatigue_resolved: false,
  dizziness: '', dizziness_ongoing: false, dizziness_resolved: false,
  headache: '', headache_ongoing: false, headache_resolved: false,
  others: '', others_ongoing: false, others_resolved: false, others_description: '',
  challenges_prep: '', challenges_details: '',
  additional_doses_details: '',
  prep_continue: '', stopping_reasons: '', stopping_Preventionmethod: '',
  other_notes: '',
  // date: '', // Date is already defined above
  interviewer_name: '', designation: '', bmhc_number: ''
});

const statusMessage = ref(''); const statusClass = ref('');
const submitDisabled = ref(true); const isCheckingUid = ref(false); const isSubmitting = ref(false);
const isReviewModalVisible = ref(false); const modalSuccessMessage = ref(''); const modalErrorMessage = ref('');
const finalSubmitMessage = ref(''); const finalSubmitClass = ref('');
const successMessage = ref(''); const errorMessage = ref(''); // General messages
let csvData = [];

// --- Functions ---
const initializeDate = () => { formData.value.date = new Date().toISOString().split('T')[0]; };
const fetchCsvData = async () => { /* ... same as before ... */
    isCheckingUid.value = true; statusMessage.value = 'Loading validation data...'; statusClass.value = ''; submitDisabled.value = true;
      try {
        const response = await fetch(CSV_DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();
        csvData = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        console.log("CSV Data Loaded for Form 5");
        statusMessage.value = 'Validation data loaded. Please enter UID.';
        if(formData.value.participant_uid) validateUidOnInput(formData.value.participant_uid);
        else submitDisabled.value = true;
      } catch (error) {
        console.error('Error fetching CSV data for Form 5:', error);
        statusMessage.value = 'Error loading validation data. Cannot check UID.'; statusClass.value = 'error';
        csvData = []; submitDisabled.value = true;
      } finally {
          isCheckingUid.value = false;
          if (!formData.value.participant_uid && statusMessage.value.includes('Loading')) statusMessage.value = '';
      }
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
    if (!pattern.test(newUid)) {
        statusMessage.value = `UID must be at least ${UID_MIN_LENGTH} alphanumeric chars.`; statusClass.value = 'error'; submitDisabled.value = true;
    } else if (isCheckingUid.value) {
        statusMessage.value = 'Checking UID...'; statusClass.value = ''; submitDisabled.value = true;
    } else if (csvData.length <= 1 && !isCheckingUid.value) {
        statusMessage.value = 'Validation data not available.'; statusClass.value = 'error'; submitDisabled.value = true;
    } else {
        if (validateUid(newUid)) { statusMessage.value = 'Participant UID found!'; statusClass.value = 'success'; submitDisabled.value = false; }
        else { statusMessage.value = 'Participant UID not found.'; statusClass.value = 'error'; submitDisabled.value = true; }
    }
};
watch(() => formData.value.participant_uid, validateUidOnInput);

// Modal Control
const showReviewModal = () => {
  if (submitDisabled.value) { modalErrorMessage.value = "Invalid UID."; return; }
  modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  isReviewModalVisible.value = true;
};
const cancelReview = () => { isReviewModalVisible.value = false; };

// Submission
const confirmAndSubmit = async () => {
  isSubmitting.value = true; modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  const url = GOOGLE_SCRIPT_URL; // Use the Form 5 URL

  try {
    const dataToSend = { ...formData.value };
    // Format arrays and booleans
     if (Array.isArray(dataToSend.reason_visit)) {
         dataToSend.reason_visit = dataToSend.reason_visit.join('; ');
     }
    Object.keys(dataToSend).forEach(key => {
        if (typeof dataToSend[key] === 'boolean') dataToSend[key] = dataToSend[key] ? 'Yes' : 'No';
    });

    const formDataSerialized = new URLSearchParams(dataToSend).toString();
    console.log("Submitting Form 5 data:", dataToSend); // Log object

    // Use Axios as in the original script
    const response = await axios.post(url, formDataSerialized, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log("Form 5 Response:", response);

    if (response.status === 200 && response.data && (typeof response.data === 'string' && response.data.toLowerCase().includes('success'))) {
      modalSuccessMessage.value = response.data;
      setTimeout(() => {
        isReviewModalVisible.value = false; setFinalMessage(response.data || 'Form 5 submitted!', 'success');
        clearForm(); statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; modalSuccessMessage.value = '';
      }, SUBMIT_SUCCESS_DELAY);
    } else { modalErrorMessage.value = response.data || 'Submission failed.'; }
  } catch (error) {
    console.error('Form 5 Submit Error:', error);
    let detailedError = 'Error submitting Form 5.';
    if (error.response) detailedError += ` (Status: ${error.response.status})`;
    else if (error.request) detailedError += ' (No response)';
    else detailedError += ` (${error.message})`;
    modalErrorMessage.value = detailedError;
  } finally { isSubmitting.value = false; }
};

// Side Effect Checkbox Handler
const handleSideEffectCheck = (effect, type) => {
    const ongoingKey = `${effect}_ongoing`; const resolvedKey = `${effect}_resolved`;
    if (type === 'ongoing' && formData.value[ongoingKey]) formData.value[resolvedKey] = false;
    else if (type === 'resolved' && formData.value[resolvedKey]) formData.value[ongoingKey] = false;
};


// Clear Form
const clearForm = () => {
    const interviewerDetails = { interviewer_name: formData.value.interviewer_name, designation: formData.value.designation, bmhc_number: formData.value.bmhc_number };
    Object.keys(formData.value).forEach(key => {
         if (key in interviewerDetails || key === 'date') return; // Keep interviewer details and date
         if (Array.isArray(formData.value[key])) formData.value[key] = [];
         else if (typeof formData.value[key] === 'boolean') formData.value[key] = false;
         else if (typeof formData.value[key] === 'number') formData.value[key] = null;
         else if (key === 'prep_site') formData.value[key] = ''; // Reset prep site
         else formData.value[key] = '';
    });
    Object.assign(formData.value, interviewerDetails); initializeDate(); // Restore details, re-init date
    statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; clearFinalMessage();
    successMessage.value = ''; errorMessage.value = '';
};

// Logged In User
const getLoggedInUser = () => { /* ... same as before ... */
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
    formData.value.interviewer_name = loggedInUser.fullname || '';
    formData.value.designation = loggedInUser.designation || '';
    formData.value.bmhc_number = loggedInUser.bhcno || ''; // Use bmhc_number
  } else {
      console.warn("Form 5: Logged in user details not found.");
       formData.value.interviewer_name = ''; formData.value.designation = ''; formData.value.bmhc_number = '';
  }
});
</script>

<style>
/* Keep the original styles provided */
.form-container { padding: 2rem; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-bottom: 2rem; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input, select, textarea { width: 100%; padding: 0.5rem; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 0.95rem; }
input:focus, select:focus, textarea:focus { border-color: #3498db; outline: none; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }
input[readonly] { background-color: #f8f9fa; cursor: not-allowed; }
input[type="radio"], input[type="checkbox"] { width: auto; margin-right: 8px; vertical-align: middle; }
label > input[type="radio"], label > input[type="checkbox"] { margin-bottom: 0; }
.checkbox-group-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #fdfdfd; }
.checkbox-group-vertical label { font-weight: normal; display: inline-flex; align-items: center; margin-bottom: 0; }
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
/* Specific style for yes/no radios in table */
.yes-no-radio { display: flex; justify-content: center; gap: 15px; }
.yes-no-radio label { margin-bottom: 0; font-weight: normal; }
td input[type="text"], td input[type="date"] { width: 95%; padding: 0.3rem 0.4rem; margin-bottom: 0; font-size: 0.9rem; }
.success-message { color: green; text-align: center; font-weight: bold; margin-top: 15px; }
.error-message { color: red; text-align: center; font-weight: bold; margin-top: 15px; }
.submitting-indicator { margin-top: 20px; text-align: center; font-size: 1.2rem; color: #3498db; }
.final-message { max-width: 700px; margin: 20px auto; padding: 15px 20px; border-radius: 5px; text-align: center; font-weight: 500; }
.final-message.success-final { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.final-message.error-final { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
.conditional-section { margin-left: 15px; padding-left: 15px; border-left: 2px solid #e0e0e0; margin-top: 10px; padding-top: 10px; }
</style>