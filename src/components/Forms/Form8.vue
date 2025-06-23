<template>
  <!-- SEROCONVERSION Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed submit action -->
    <div class="container">
      <!-- Container 1: Basic Info & Reason -->
      <div class="form-container">

        <p><strong>Note to interviewer:</strong> This tool is only for clients visiting the clinic beyond their scheduled visits. ... [Rest of note] ...</p>

        <label for="interview_date">Date of the interview:</label> <!-- Changed label -->
        <input type="date" v-model="formData.interview_date" id="interview_date" name="interview_date" readonly />

        <label for="participant_uid">Participant UID:</label>
        <input type="text" v-model="formData.participant_uid" id="participant_uid" name="participant_uid" required
          pattern="[A-Za-z0-9]{5,}" title="Minimum 5 Alphanumeric characters only" />
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
        <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label>KP group:</label>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.kp_group" name="kp_group" value="FSW" required/> FSW</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.kp_group" name="kp_group" value="MSM" /> MSM</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.kp_group" name="kp_group" value="MSW" /> MSW</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.kp_group" name="kp_group" value="TGW" /> TGW</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.kp_group" name="kp_group" value="TGM" /> TGM</label>
        </div>

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

        <label style="margin-top: 1rem;">Instructions:</label>
        <p style="font-style: italic; color: #555;">This form is for documentation of factors... [Rest of instructions] ...</p>

        <h3 class="section-title">A. PrEP initiation date and seroconversion dates</h3>

        <label for="prep_initiation_date">PrEP Initiation Date:</label>
        <input type="date" v-model="formData.prep_initiation_date" id="prep_initiation_date" name="prep_initiation_date" required/>

        <label>Dosing Regimen Prescribed:</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.dosing_regimen" name="dosing_regimen" value="Daily PrEP" required/> Daily PrEP</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.dosing_regimen" name="dosing_regimen" value="ED-PrEP" required/> ED-PrEP</label>
        </div>

        <label for="hiv_test_date">Date of HIV + Test:</label>
        <input type="date" v-model="formData.hiv_test_date" id="hiv_test_date" name="hiv_test_date" required/>

        <label>At the time of HIV + Test result, is the client still on PrEP?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.client_on_prep" name="client_on_prep" value="Yes" required/> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal;"><input type="radio" v-model="formData.client_on_prep" name="client_on_prep" value="No" required/> No</label>
        </div>

        <div v-if="formData.client_on_prep === 'No'">
          <label for="last_prep_taken">If No, when was the last PrEP taken? (Date)</label>
          <input type="date" v-model="formData.last_prep_taken" id="last_prep_taken" name="last_prep_taken" />
        </div>
      </div>

      <!-- Conditional Section B: Daily PrEP -->
      <div v-if="formData.dosing_regimen === 'Daily PrEP'" class="form-container">
        <h3 class="section-title">B. PrEP use assessment for DAILY-PrEP USERS</h3>

        <label>IF SEROCONVERSION AT MONTH 1 VISIT: In the last 1 month, have you taken PrEP daily without missing a dose?</label>
        <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.seroconversion_month1" name="sero_m1" value="Never missed a dose" /> Never missed</label>
          <label><input type="radio" v-model="formData.seroconversion_month1" name="sero_m1" value="Only one day missed" /> Missed 1 day</label>
          <label><input type="radio" v-model="formData.seroconversion_month1" name="sero_m1" value="Two days missed" /> Missed 2 days</label>
          <label><input type="radio" v-model="formData.seroconversion_month1" name="sero_m1" value="Three days missed" /> Missed 3 days</label>
          <label><input type="radio" v-model="formData.seroconversion_month1" name="sero_m1" value="seven days missed" /> Missed 7+ days</label> <!-- Adjusted value -->
        </div>

        <label>IF SEROCONVERSION at other follow-up visit: In the last 3 months, have you taken PrEP daily without missing a dose?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.seroconversion_other_month" name="sero_m_other" value="Never missed a dose" /> Never missed</label>
          <label><input type="radio" v-model="formData.seroconversion_other_month" name="sero_m_other" value="Only one day missed" /> Missed 1 day</label>
          <label><input type="radio" v-model="formData.seroconversion_other_month" name="sero_m_other" value="Two days missed" /> Missed 2 days</label>
          <label><input type="radio" v-model="formData.seroconversion_other_month" name="sero_m_other" value="Three days missed" /> Missed 3 days</label>
          <label><input type="radio" v-model="formData.seroconversion_other_month" name="sero_m_other" value="seven days missed" /> Missed 7+ days</label> <!-- Adjusted value -->
        </div>

        <label>Are you aware of your partner's HIV status?</label>
        <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.daily_partner_hiv_status" name="daily_partner_stat" value="HIV Negative" required/> Partner HIV Negative</label>
          <label><input type="radio" v-model="formData.daily_partner_hiv_status" name="daily_partner_stat" value="HIV Positive" /> Partner HIV Positive</label>
          <label><input type="radio" v-model="formData.daily_partner_hiv_status" name="daily_partner_stat" value="Don't know" /> Don't know status</label>
        </div>

        <label>Did you use Condoms with your partner/s?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.daily_condom_use" name="daily_condom" value="Always" required/> Always</label>
          <label><input type="radio" v-model="formData.daily_condom_use" name="daily_condom" value="Sometimes" /> Sometimes</label>
          <label><input type="radio" v-model="formData.daily_condom_use" name="daily_condom" value="Never" /> Never</label>
        </div>

        <label for="daily_seroconversion_comments">Write additional comments on the circumstances that led to seroconversion:</label>
        <textarea v-model="formData.daily_seroconversion_comments" id="daily_seroconversion_comments" name="seroconversion_comments" rows="4"
          placeholder="Provide any additional comments..."></textarea>
      </div>

      <!-- Conditional Section C: ED-PrEP -->
      <div v-if="formData.dosing_regimen === 'ED-PrEP'" class="form-container">
        <h3 class="section-title">C. PrEP use assessment for ED-PrEP USERS</h3>

        <label>In the past 1 month how many times did you have sex?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.ed_prep_sex_times" name="ed_sex_times" value="Did not have sex" required/> Did not have sex</label>
          <label><input type="radio" v-model="formData.ed_prep_sex_times" name="ed_sex_times" value="1-2 times/week" /> 1-2 times/week</label>
          <label><input type="radio" v-model="formData.ed_prep_sex_times" name="ed_sex_times" value="More than 2 times" /> >2 times/week</label>
          <label><input type="radio" v-model="formData.ed_prep_sex_times" name="ed_sex_times" value="Cannot remember" /> Cannot remember</label>
         </div>

        <label>In the past month, approx. how many times/percentage did you take PrEP before sex?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.ed_prep_before_sex" name="ed_before_sex" value="Always (100%)" required/> Always (100%)</label>
          <label><input type="radio" v-model="formData.ed_prep_before_sex" name="ed_before_sex" value="3 in 4 times (75%)" /> 75% (3/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_before_sex" name="ed_before_sex" value="2 in 4 times (50%)" /> 50% (2/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_before_sex" name="ed_before_sex" value="1 in 4 times (25%)" /> 25% (1/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_before_sex" name="ed_before_sex" value="Never" /> Never (0%)</label>
        </div>

        <label>In the past month approx. how many times/percentage did you take 1st PrEP tablet after sex?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.ed_prep_after_sex" name="ed_first_after" value="Always (100%)" required/> Always (100%)</label>
          <label><input type="radio" v-model="formData.ed_prep_after_sex" name="ed_first_after" value="3 in 4 times (75%)" /> 75% (3/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_after_sex" name="ed_first_after" value="2 in 4 times (50%)" /> 50% (2/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_after_sex" name="ed_first_after" value="1 in 4 times (25%)" /> 25% (1/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_after_sex" name="ed_first_after" value="Never" /> Never (0%)</label>
         </div>

        <label>In the past month approx. how many times/percentage did you take 2nd PrEP tablet after sex?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.ed_prep_2ndafter_sex" name="ed_second_after" value="Always (100%)" required/> Always (100%)</label>
          <label><input type="radio" v-model="formData.ed_prep_2ndafter_sex" name="ed_second_after" value="3 in 4 times (75%)" /> 75% (3/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_2ndafter_sex" name="ed_second_after" value="2 in 4 times (50%)" /> 50% (2/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_2ndafter_sex" name="ed_second_after" value="1 in 4 times (25%)" /> 25% (1/4)</label>
          <label><input type="radio" v-model="formData.ed_prep_2ndafter_sex" name="ed_second_after" value="Never" /> Never (0%)</label>
         </div>

        <label>Are you aware of your partner's HIV status?</label>
        <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.ed_prep_partner_hiv_status" name="ed_partner_stat" value="HIV Negative" required/> Partner HIV Negative</label>
          <label><input type="radio" v-model="formData.ed_prep_partner_hiv_status" name="ed_partner_stat" value="HIV Positive" /> Partner HIV Positive</label>
          <label><input type="radio" v-model="formData.ed_prep_partner_hiv_status" name="ed_partner_stat" value="Don't know" /> Don't know status</label>
        </div>

        <label>Did you use Condoms with your partner/s?</label>
         <div class="radio-group-vertical">
          <label><input type="radio" v-model="formData.ed_prep_condom_use" name="ed_condom" value="Always" required/> Always</label>
          <label><input type="radio" v-model="formData.ed_prep_condom_use" name="ed_condom" value="Sometimes" /> Sometimes</label>
          <label><input type="radio" v-model="formData.ed_prep_condom_use" name="ed_condom" value="Never" /> Never</label>
        </div>

        <label for="ed_prep_seroconversion_comments">Write additional comments on the circumstances that led to seroconversion:</label>
        <textarea v-model="formData.ed_prep_seroconversion_comments" id="ed_prep_seroconversion_comments" name="seroconversion_comments" rows="4"
          placeholder="Provide any additional comments..."></textarea>
      </div>

      <!-- Container for Clinician Info -->
      <div class="form-container">
           <h3 class="section-title">Reporting Clinician Details</h3>
            <label for="reporting_date">Date:</label>
            <input type="date" v-model="formData.reporting_date" id="reporting_date" name="reporting_date" readonly />
            <label for="clinician_name_rep">Name:</label> <!-- Changed ID -->
            <input type="text" v-model="formData.name" id="clinician_name_rep" name="name" readonly />
            <label for="clinician_designation_rep">Designation:</label> <!-- Changed ID -->
            <input type="text" v-model="formData.designation" id="clinician_designation_rep" name="designation" readonly />
            <label for="clinician_bhmc_rep">BHMC Registration:</label> <!-- Changed ID -->
            <input type="text" v-model="formData.bmhc_registration" id="clinician_bhmc_rep" name="bhmc_registration"  readonly/>
       </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Review Data' }} <!-- Changed Text -->
        </button>
      <div style="text-align: center;">
        <label>
          <div style="text-align: center;">
            <h4 class="section-title">Thank you for your time la.</h4>
          </div>
        </label>
      </div>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form8_ConfirmationModal v-if="isReviewModalVisible" 
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
     <div v-if="successMessage && !finalSubmitMessage" class="success-message"> <p>{{ successMessage }}</p> </div>
     <div v-if="errorMessage && !finalSubmitMessage" class="error-message"> <p>{{ errorMessage }}</p> </div>
      <div v-if="isSubmitting && !isReviewModalVisible" class="submitting-indicator">Submitting...</div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
// Import the NEW modal component
import Form8_ConfirmationModal from './Form8_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLZnBIyR4MDV3PBgmS-93raTN43XAa8YhCl2h5qb-QyDXD4A5jDMu7iXQMj33bhuxtUw/exec'; // FORM 8 URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?output=csv";
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  interview_date: '', participant_uid: '', kp_group: '', prep_site: '',
  prep_initiation_date: '', dosing_regimen: '', hiv_test_date: '', client_on_prep: '', last_prep_taken: '',
  // Daily PrEP
  seroconversion_month1: '', seroconversion_other_month: '', daily_partner_hiv_status: '', daily_condom_use: '', daily_seroconversion_comments: '',
  // ED-PrEP
  ed_prep_sex_times: '', ed_prep_before_sex: '', ed_prep_after_sex: '', ed_prep_2ndafter_sex: '', ed_prep_partner_hiv_status: '', ed_prep_condom_use: '', ed_prep_seroconversion_comments: '',
  // Clinician Info
  reporting_date: '', name: '', designation: '', bmhc_registration: '',
  // Added from original script setup - might be duplicates, ensure correct mapping
  location: '' // Added location used in consent text
});

// Feedback & Control State
const statusMessage = ref(''); const statusClass = ref('');
const submitDisabled = ref(true); const isCheckingUid = ref(false); const isSubmitting = ref(false);
const isReviewModalVisible = ref(false); const modalSuccessMessage = ref(''); const modalErrorMessage = ref('');
const finalSubmitMessage = ref(''); const finalSubmitClass = ref('');
const successMessage = ref(''); const errorMessage = ref('');
let csvData = [];

// --- Functions ---
const initializeDate = () => {
    const today = new Date().toISOString().split('T')[0];
    formData.value.interview_date = today;
    formData.value.reporting_date = today;
};
const fetchCsvData = async () => { /* ... same as before ... */
    isCheckingUid.value = true; statusMessage.value = 'Loading validation data...'; statusClass.value = ''; submitDisabled.value = true;
      try {
        const response = await fetch(CSV_DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();
        csvData = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        console.log("CSV Data Loaded for Form 8");
        statusMessage.value = 'Validation data loaded.';
        if(formData.value.participant_uid) validateUidOnInput(formData.value.participant_uid); else submitDisabled.value = true;
      } catch (error) {
        console.error('Error fetching CSV data for Form 8:', error);
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
  modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  isReviewModalVisible.value = true;
};
const cancelReview = () => { isReviewModalVisible.value = false; };

// Submission
const confirmAndSubmit = async () => {
   isSubmitting.value = true; modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
   const url = GOOGLE_SCRIPT_URL;
   try {
     const dataToSend = { ...formData.value };
     // Convert booleans if any (none in this specific form's data structure for submission logic)
     // Object.keys(dataToSend).forEach(key => {
     //   if (typeof dataToSend[key] === 'boolean') dataToSend[key] = dataToSend[key] ? 'Yes' : 'No';
     // });
     // Clear conditional fields if not applicable
     if (dataToSend.client_on_prep === 'Yes') dataToSend.last_prep_taken = '';
     if (dataToSend.dosing_regimen === 'ED-PrEP') {
         dataToSend.seroconversion_month1 = '';
         dataToSend.seroconversion_other_month = '';
         dataToSend.daily_partner_hiv_status = '';
         dataToSend.daily_condom_use = '';
         dataToSend.daily_seroconversion_comments = '';
     } else if (dataToSend.dosing_regimen === 'Daily PrEP') {
         dataToSend.ed_prep_sex_times = '';
         dataToSend.ed_prep_before_sex = '';
         dataToSend.ed_prep_after_sex = '';
         dataToSend.ed_prep_2ndafter_sex = '';
         dataToSend.ed_prep_partner_hiv_status = '';
         dataToSend.ed_prep_condom_use = '';
         dataToSend.ed_prep_seroconversion_comments = '';
     }

     const formDataSerialized = new URLSearchParams(dataToSend).toString();
     console.log("Submitting Form 8 data:", dataToSend); // Log object

     // Use Axios as in original script
     const response = await axios.post(url, formDataSerialized, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
     console.log("Form 8 Response:", response);

     if (response.status === 200 && response.data && (typeof response.data === 'string' && response.data.toLowerCase().includes('success'))) {
       modalSuccessMessage.value = response.data;
       setTimeout(() => {
         isReviewModalVisible.value = false; setFinalMessage(response.data || 'Form 8 submitted!', 'success');
         clearForm(); statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; modalSuccessMessage.value = '';
       }, SUBMIT_SUCCESS_DELAY);
     } else { modalErrorMessage.value = response.data || 'Submission failed.'; }
   } catch (error) {
     console.error('Form 8 Submit Error:', error);
     let detailedError = 'Error submitting Form 8.';
     if (error.response) detailedError += ` (Status: ${error.response.status})`;
     else if (error.request) detailedError += ' (No response)';
     else detailedError += ` (${error.message})`;
     modalErrorMessage.value = detailedError;
   } finally { isSubmitting.value = false; }
};

// Clear Form
const clearForm = () => {
    const clinicianDetails = { name: formData.value.name, designation: formData.value.designation, bmhc_registration: formData.value.bmhc_registration, location: formData.value.location };
    Object.keys(formData.value).forEach(key => {
         if (key in clinicianDetails || key === 'interview_date' || key === 'reporting_date') return; // Keep clinician details and dates
         if (Array.isArray(formData.value[key])) formData.value[key] = [];
         else if (typeof formData.value[key] === 'boolean') formData.value[key] = false;
         else if (typeof formData.value[key] === 'number') formData.value[key] = null;
         else if (key === 'prep_site') formData.value[key] = ''; // Reset select
         else formData.value[key] = '';
    });
    Object.assign(formData.value, clinicianDetails); initializeDate(); // Restore details, re-init dates
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
    // Map loggedInUser fields to formData fields used in the form
    formData.value.name = loggedInUser.fullname || ''; // Matches 'Name' field at the bottom
    formData.value.interviewer_name = loggedInUser.fullname || ''; // Matches interviewer name field
    formData.value.designation = loggedInUser.designation || ''; // Matches both designation fields
    formData.value.bmhc_registration = loggedInUser.bhcno || ''; // Matches BHMC Reg field
    formData.value.bmhc_number = loggedInUser.bhcno || ''; // Matches BMHC Number field (assuming same)
    formData.value.location = loggedInUser.prep_location || '[Interviewer Location]'; // For consent text
  } else {
      console.warn("Form 8: Logged in user details not found.");
       formData.value.name = ''; formData.value.interviewer_name = ''; formData.value.designation = '';
       formData.value.bmhc_registration = ''; formData.value.bmhc_number = ''; formData.value.location = '';
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
.radio-group-vertical, .checkbox-group-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #fdfdfd; }
.radio-group-vertical label, .checkbox-group-vertical label { font-weight: normal; display: inline-flex; align-items: center; margin-bottom: 0; }

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
td input[type="text"], td input[type="date"], td input[type="textarea"] { width: 95%; padding: 0.3rem 0.4rem; margin-bottom: 0; font-size: 0.9rem; }
.success-message { color: green; text-align: center; font-weight: bold; margin-top: 15px; }
.error-message { color: red; text-align: center; font-weight: bold; margin-top: 15px; }
.submitting-indicator { margin-top: 20px; text-align: center; font-size: 1.2rem; color: #3498db; }
.final-message { max-width: 700px; margin: 20px auto; padding: 15px 20px; border-radius: 5px; text-align: center; font-weight: 500; }
.final-message.success-final { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.final-message.error-final { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
.conditional-section { margin-left: 15px; padding-left: 15px; border-left: 2px solid #e0e0e0; margin-top: 10px; padding-top: 10px; }
</style>