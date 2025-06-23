// ConfirmationModal.vue
<template>
  <div class="modal-overlay">
    <div class="modal-content enhanced-modal">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2><i class="fas fa-clipboard-check"></i> Review Details</h2>
        <button @click="$emit('cancel')" class="modal-close-btn" aria-label="Close modal" :disabled="isSubmitting">×</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <p class="modal-instruction">Please confirm the following information before submitting:</p>

        <!-- Check if formData exists before trying to access its properties -->
        <div v-if="formData" class="modal-details-grid">
          <!-- Section: Context -->
          <h4 class="details-section-title">Submission Context</h4>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-user-nurse"></i> Outreach Worker:</span>
            <span class="detail-value">{{ formData.orw || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Referring Site:</span>
            <span class="detail-value">{{ formData.referred_site || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-calendar-day"></i> Submission Date:</span>
            <span class="detail-value">{{ formData.date || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-calendar-alt"></i> Form Month:</span>
            <span class="detail-value">{{ formData.form_month || 'N/A' }}</span>
          </div>

          <!-- Section: Participant -->
          <h4 class="details-section-title">Participant Details</h4>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-user"></i> Name:</span>
            <span class="detail-value">{{ formData.name || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-mobile-alt"></i> Mobile No.:</span>
            <span class="detail-value">{{ formData.mobile_no || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-id-card"></i> CID / SRP / Other:</span>
            <span class="detail-value">{{ formData.cid_other || 'N/A' }}</span>
          </div>
          <div class="detail-item highlight">
            <span class="detail-label"><i class="fas fa-fingerprint"></i> Generated UID:</span>
            <span class="detail-value value-strong">{{ formData.participant_uid || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-hospital"></i> Referral to PrEP Site:</span>
            <span class="detail-value">{{ formData.referral_prep_site || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label"><i class="fas fa-calendar-check"></i> Appointment Date:</span>
            <span class="detail-value">{{ formData.referral_date || 'N/A' }}</span>
          </div>
        </div>
         <div v-else>
            <p>Loading details...</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button @click="$emit('cancel')" class="cancel-btn modal-cancel-btn" :disabled="isSubmitting">
          <i class="fas fa-times"></i> Cancel
        </button>
        <button @click="$emit('confirm')" class="submit-btn modal-confirm-btn" :disabled="isSubmitting">
          <i class="fas fa-paper-plane"></i> {{ isSubmitting ? 'Submitting...' : 'Confirm & Submit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Define the props this component accepts
const props = defineProps({
  formData: {
    type: Object,
    required: true, // Expecting the form data object
  },
  isSubmitting: {
    type: Boolean,
    default: false, // Submission status flag
  }
});

// Define the events this component emits
const emit = defineEmits(['confirm', 'cancel']);

// No internal logic needed here for basic display and emit
// The visibility (v-if) is controlled by the parent component
</script>

<style scoped>
/* --- Paste all the Modal specific CSS rules here --- */
/* --- From the previous answer, start with .modal-overlay --- */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65); /* Slightly darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 15px; /* Add padding for smaller screens */
}

.modal-content.enhanced-modal {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%; /* Responsive width */
  max-width: 650px; /* Increase max width slightly */
  max-height: 90vh;
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack header, body, footer */
  overflow: hidden; /* Prevent content spill before scroll */
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #f8f9fa; /* Light background */
  border-bottom: 1px solid #dee2e6; /* Subtle separator */
  border-top-left-radius: 8px; /* Match container rounding */
  border-top-right-radius: 8px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #343a40; /* Darker heading */
  font-weight: 600;
}
.modal-header h2 i {
  margin-right: 10px;
  color: #3498db; /* Use theme color */
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: #6c757d;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}
.modal-close-btn:hover {
    color: #343a40;
}
.modal-close-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}


/* Modal Body */
.modal-body {
  padding: 20px 25px;
  overflow-y: auto; /* Enable scrolling for content */
  flex-grow: 1; /* Allow body to take available space */
   background-color: #ffffff; /* White background for body */
}

.modal-instruction {
  margin-bottom: 20px;
  color: #495057;
  font-size: 0.95rem;
  text-align: center;
}

.details-section-title {
  font-size: 1.1rem;
  color: #3498db; /* Theme color */
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
}
.details-section-title:first-of-type {
    margin-top: 0;
}

.modal-details-grid {
  display: grid;
  grid-template-columns: auto 1fr; /* Label column fits content, value takes rest */
  gap: 12px 15px; /* Row gap and Column gap */
}

.detail-item {
    display: contents; /* Allows direct grid placement of children */
}

.detail-label {
  font-weight: 500;
  color: #495057; /* Slightly muted label color */
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  grid-column: 1; /* Explicitly place in first column */
}
.detail-label i {
    margin-right: 8px;
    color: #6c757d; /* Icon color */
    width: 16px; /* Fixed width for alignment */
    text-align: center;
}

.detail-value {
  color: #212529; /* Darker value color */
  font-size: 0.95rem;
  word-break: break-word; /* Prevent long values overflowing */
  background-color: #f8f9fa; /* Very light background for value */
  padding: 5px 8px;
  border-radius: 4px;
  grid-column: 2; /* Explicitly place in second column */
  line-height: 1.4;
}

/* Make Label & Value span columns when needed (like for headers) */
.modal-details-grid > h4 {
    grid-column: 1 / -1; /* Span across all columns */
}

.detail-item.highlight .detail-label {
    color: #0056b3; /* Highlight label color */
}
.detail-item.highlight .detail-value {
    font-weight: bold;
    color: #0056b3; /* Highlight value color */
    background-color: #e7f1ff; /* Lighter blue background */
}
.value-strong {
    font-weight: bold;
}


/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end; /* Align buttons right */
  gap: 10px;
  padding: 15px 25px;
  background-color: #f8f9fa; /* Match header */
  border-top: 1px solid #dee2e6; /* Separator */
  border-bottom-left-radius: 8px; /* Match container rounding */
  border-bottom-right-radius: 8px;
}

/* Adjust modal button styles slightly if needed */
.modal-confirm-btn, .modal-cancel-btn {
  padding: 0.6rem 1.2rem; /* Slightly smaller padding */
  font-size: 0.9rem;
  /* Ensure button base styles are defined if not globally available */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.modal-confirm-btn i, .modal-cancel-btn i {
    margin-right: 6px;
}

/* Reference base button styles if they aren't global */
.submit-btn { background-color: #3498db; color: #fff; }
.submit-btn:hover:not(:disabled) { background-color: #2980b9; }
.submit-btn:disabled { background-color: #bdc3c7; cursor: not-allowed; }

.cancel-btn { background-color: #e74c3c; color: white; }
.cancel-btn:hover:not(:disabled) { background-color: #c0392b; }
.cancel-btn:disabled { background-color: #bdc3c7; cursor: not-allowed; }


/* --- Add basic responsiveness for the grid --- */
@media (max-width: 500px) {
    .modal-details-grid {
         grid-template-columns: 1fr; /* Stack label and value on small screens */
         gap: 5px 0; /* Reduce gap */
    }
     .detail-label {
        grid-column: 1; /* Takes full width */
        margin-bottom: 2px; /* Space below label */
        font-weight: bold; /* Make label bolder when stacked */
     }
    .detail-value {
        grid-column: 1; /* Takes full width */
        padding-left: 24px; /* Indent value slightly */
    }
     .modal-footer {
        flex-direction: column-reverse; /* Stack buttons vertically */
        gap: 8px;
     }
     .modal-confirm-btn, .modal-cancel-btn {
         width: 100%; /* Make buttons full width */
     }
}
</style>