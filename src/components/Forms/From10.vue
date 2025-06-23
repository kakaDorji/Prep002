<template>
  <!-- ORW form -->
  <div> <!-- Wrap everything in a div if needed -->
    <form @submit.prevent="openConfirmationModal">
      <div class="container">
        <div class="form-container">
          <!-- ... (Keep all your form fields: labels, inputs, selects, table) ... -->
          <label>Name of the Outreach Worker:</label>
          <input type="text" v-model="formData.orw" name="orw" readonly />

          <label>Referring from:</label>
          <input type="text" v-model="formData.referred_site" name="referred_site" readonly />

          <label for="date">Date:</label>
          <input type="date" v-model="formData.date" id="dateInput" name="date" readonly />

          <label>Month:</label>
          <select v-model="formData.form_month" name="form_month" required>
            <option value="">--Select Month--</option>
            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
          </select>

          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>CID / SRP / other</th>
                <th>UID</th>
                <th>Referral to PrEP site</th>
                <th>Date of Appointment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><input type="text" v-model="formData.name" name="name" required /></td>
                <td><input type="number" v-model="formData.mobile_no" name="mobile_no" /></td>
                <td><input type="text" v-model="formData.cid_other" name="cid_other" max="8" /></td>
                <td>
                  <input type="text" v-model="formData.participant_uid" name="participant_uid" readonly
                    style="margin-top: 40px" />
                  <button type="button" class="generatebtn" @click="generateUID">Generate UID</button>
                  <span v-if="loading" class="loading-status">Loading...</span>
                </td>
                <td>
                  <select v-model="formData.referral_prep_site" name="referral_prep_site" required>
                    <option value="">--Select Site--</option>
                    <option v-for="site in prepSites" :key="site" :value="site">{{ site }}</option>
                  </select>
                </td>
                <td><input type="date" v-model="formData.referral_date" name="referral_date" required /></td>
              </tr>
            </tbody>
          </table>

          <!-- Review & Submit Button -->
          <button type="submit" class="submit-btn" :disabled="isSubmitting || loading">
            {{ isSubmitting ? 'Processing...' : 'Review & Submit' }}
          </button>
        </div>
      </div>

      <!-- Success and Error Messages -->
      <div class="center-text">
        <h4 class="section-title">Thank you for your time.</h4>
      </div>
      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
      </div>
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
      <!-- Loading Indicator for actual submission -->
      <div v-if="isSubmitting" class="submitting-indicator">Submitting... Please wait.</div>
    </form>

    <!-- Use the Confirmation Modal Component -->
    <ConfirmationModal v-if="showConfirmationModal" :formData="formData" :is-submitting="isSubmitting"
      @confirm="confirmAndSubmit" @cancel="closeConfirmationModal" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// Import the new modal component
import ConfirmationModal from './form10_ConfirmationModal.vue'; // Adjust path if necessary

// --- Refs and Reactive Data ---
const formData = ref({
  orw: '',
  referred_site: '',
  date: '',
  form_month: '',
  name: '',
  mobile_no: '',
  cid_other: '',
  participant_uid: '',
  referral_prep_site: '',
  referral_date: '',
});

const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);
const loading = ref(false); // For UID generation
const showConfirmationModal = ref(false); // State to control modal visibility

// --- Static Data ---
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const prepSites = [
  'CHD/JDWNRH/Thimphu',
  'HISC/Thimphu',
  'Paro Hospital/Paro',
  'Phuntsholing Hospital/Chukha',
  'CRRH/Gelephu/Sarpang',
  'HISC/Gelephu',
  'Kunegarabten HISC',
  'Lobesa HISC',
  'Mongar Regional Hospital',
  'Samtse HISC',
  'Samdrup Jongkhar HISC',
  'Trashigang Regional Hospital'
];

// --- Functions ---

// Initialize date field to today's date
function initializeDate() {
  const today = new Date().toISOString().split('T')[0];
  formData.value.date = today;
}

// Generate unique participant UID (Keep your existing function)
async function generateUID() {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser || !loggedInUser.prep_location) {
    alert('No logged-in user found or prep_location is missing.');
    return;
  }

  loading.value = true;
  errorMessage.value = ''; // Clear previous errors
  try {
    const form10_url =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?output=csv';
    // Use fetch with appropriate error handling for network/CORS issues
    const response = await fetch(form10_url, { cache: 'no-cache' }); // Prevent caching issues
    if (!response.ok) {
      // Provide more specific feedback based on status if possible
      let errorMsg = `HTTP error! Status: ${response.status}`;
      if (response.status === 0) {
        errorMsg = "Network error or CORS issue fetching UID data. Check console and network tab.";
      } else if (response.status === 404) {
        errorMsg = "UID source sheet not found (404). Check the URL.";
      }
      throw new Error(errorMsg);
    }
    const csvText = await response.text();

    if (!csvText || typeof csvText !== 'string') {
      throw new Error('Invalid CSV data received for UID generation.');
    }

    const sheetData = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim())); // Trim whitespace from cells

    if (!Array.isArray(sheetData) || sheetData.length === 0) {
      throw new Error('Could not parse CSV data for UID generation.');
    }

    const locationMap = {
      'CHD/JDWNRH/Thimphu': 'CJTH',
      'HISC/Thimphu': 'HIST',
      'Paro Hospital/Paro': 'PAR',
      'Phuntsholing Hospital/Chukha': 'PHU',
      'CRRH/Gelephu/Sarpang': 'CGS',
      'HISC/Gelephu': 'HISG',
      'Thimphu': 'THI',
      'Kunegarabten HISC': 'KRH',
      'Lobesa HISC': 'LBH',
      'Mongar Regional Hospital': 'MRH',
      'Samtse HISC': 'SAH',
      'Samdrup Jongkhar HISC': 'SJH',
      'Trashigang Regional Hospital': 'TRH'
      // Make sure this mapping is intended/correct
    };

    const prepLocationCode = locationMap[loggedInUser.prep_location];
    if (!prepLocationCode) {
      // Log the problematic location
      console.warn(`No location code mapping found for: ${loggedInUser.prep_location}`);
      alert(`Invalid prep_location code mapping for "${loggedInUser.prep_location}". Cannot generate UID.`);
      loading.value = false;
      return;
    }

    // Filter UIDs more robustly - check column index (assuming UID is column B -> index 1)
    const uidColumnIndex = 1; // Adjust if UID is in a different column
    const existingUids = sheetData
      .slice(1) // Skip header row if present
      .map(row => (row && row.length > uidColumnIndex ? row[uidColumnIndex] : null))
      .filter(uid => uid && typeof uid === 'string' && uid.startsWith(prepLocationCode));

    let highestNum = 0;
    if (existingUids.length > 0) {
      const numericParts = existingUids.map(uid => {
        const numStr = uid.substring(prepLocationCode.length);
        const num = parseInt(numStr, 10);
        return isNaN(num) ? 0 : num; // Handle potential parsing errors (e.g., "CJTHABCD")
      }).filter(num => num !== 0); // Filter out any zeros from parsing errors if needed

      if (numericParts.length > 0) {
        highestNum = Math.max(...numericParts);
      }
    }

    formData.value.participant_uid = prepLocationCode + (highestNum + 1).toString().padStart(4, '0');
  } catch (error) {
    console.error('Error generating UID:', error);
    errorMessage.value = `Error generating UID: ${error.message}. Please check the Google Sheet URL, permissions, and your network connection. If the issue persists, try generating manually or contact support.`;
    formData.value.participant_uid = ''; // Clear potentially wrong UID
  } finally {
    loading.value = false;
  }
}


// --- Modal Control ---
const openConfirmationModal = (event) => {
  const form = event.target;
  if (form.checkValidity()) {
    errorMessage.value = '';
    successMessage.value = '';
    showConfirmationModal.value = true; // Show the imported modal
  } else {
    errorMessage.value = "Please fill in all required fields.";
    form.reportValidity(); // Explicitly ask browser to show validation messages
  }
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false; // Hide the imported modal
};

// --- Form Submission Logic ---
const confirmAndSubmit = async () => {
  // This function is now triggered by the @confirm event from ConfirmationModal
  await submitForm();
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  const url = 'https://script.google.com/macros/s/AKfycbxRCVxQc7f23IADj0pHx3rd_x2AT5rqgY-3TycFX1YLZTabZSauKKzE5NKYQrLL0N4GKw/exec';

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const dataToSubmit = { ...formData.value };
    const formDataSerialized = new URLSearchParams(dataToSubmit).toString();

    const response = await axios.post(url, formDataSerialized, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Basic success check (customize if your script returns specific success/error structure)
    if (response.status === 200 && response.data) {
      // You might want to check response.data for a specific success message or structure
      successMessage.value = typeof response.data === 'string' ? response.data : 'Form submitted successfully!';
      clearForm();
    } else {
      // Handle cases where status is 200 but data indicates an error
      throw new Error(response.data || 'Submission failed with status ' + response.status);
    }

  } catch (error) {
    errorMessage.value = `Submission Error: ${error.message || 'Please try again.'}`;
    console.error('Error submitting form:', error);
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      errorMessage.value += ` (Server Response: ${error.response.status})`;
    } else if (error.request) {
      errorMessage.value += ' (No response from server). Check network.';
    }
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false; // Ensure modal closes regardless of outcome
  }
};

// Clear the form after successful submission
const clearForm = () => {
  const preservedOrw = formData.value.orw;
  const preservedSite = formData.value.referred_site;

  formData.value = {
    orw: preservedOrw,
    referred_site: preservedSite,
    date: '',
    form_month: '',
    name: '',
    mobile_no: '',
    cid_other: '',
    participant_uid: '',
    referral_prep_site: '',
    referral_date: '',
  };
  initializeDate();
};

// Fetch logged-in user information
function getLoggedInUser() {
  try {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Error parsing loggedInUser from localStorage:", e);
    return null; // Return null if parsing fails
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    formData.value.orw = loggedInUser.fullname || 'N/A';
    formData.value.referred_site = loggedInUser.prep_location || 'N/A';
  } else {
    formData.value.orw = 'User Not Found';
    formData.value.referred_site = 'Location Not Found';
    // Optionally show an error message to the user if login info is critical
    // errorMessage.value = "Could not load user information. Some fields may be incorrect.";
  }
  initializeDate();
});
</script>

<style scoped>
/* --- Keep only the Form-specific styles here --- */
/* --- Remove the .modal-overlay, .modal-content, etc. styles --- */

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
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

input:required,
select:required {
  border-left: 3px solid #e74c3c;
}

input:valid,
select:valid {
  border-left: 3px solid #2ecc71;
}

.loading-status {
  margin-left: 10px;
  color: #555;
}

.submit-btn {
  background-color: #3498db;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 6px;
  transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.generatebtn {
  background-color: #2ecc71;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  transition: background-color 0.2s ease;
}

.generatebtn:hover:not(:disabled) {
  background-color: #27ae60;
}

.center-text {
  text-align: center;
}

.success-message {
  color: green;
  text-align: center;
  font-weight: bold;
  background-color: #e9f7ef;
  border: 1px solid #a1e7c0;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}

.error-message {
  color: #c0392b;
  text-align: center;
  font-weight: bold;
  background-color: #fdecea;
  border: 1px solid #f7baba;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
  vertical-align: middle;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
}

td input,
td select {
  margin-bottom: 0;
}

td:nth-child(5) {
  text-align: center;
}

td:nth-child(5) input {
  margin-top: 5px !important;
  margin-bottom: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

td:nth-child(5) .generatebtn {
  display: block;
  margin: 5px auto;
}

.section-title {
  font-size: 1.9rem;
  color: #3498db;
  margin-bottom: 10px;
}

.submitting-indicator {
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
  color: #3498db;
  font-weight: bold;
}

/* Add Font Awesome if you haven't included it globally in index.html */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'); */
</style>