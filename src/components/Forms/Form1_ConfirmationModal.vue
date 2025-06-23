<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="emitCancel"> <!-- Close on overlay click -->
      <div class="modal-content enhanced-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 id="modal-title"><i class="fas fa-clipboard-list"></i> Review Form 1 Details</h2>
          <button @click="emitCancel" class="modal-close-btn" aria-label="Close modal" :disabled="isSubmitting">×</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="modal-instruction">Please confirm the following information before submitting:</p>

          <div v-if="formData" class="modal-details-grid">
            <!-- Section: Basic Info -->
            <h4 class="details-section-title">Basic Information</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-day"></i> Date:</span>
              <span class="detail-value">{{ formData.date || 'N/A' }}</span>
            </div>
            <div class="detail-item highlight">
              <span class="detail-label"><i class="fas fa-fingerprint"></i> Participant UID:</span>
              <span class="detail-value value-strong">{{ formData.participant_uid || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-week"></i> Type of Visit:</span>
              <span class="detail-value">{{ formData.type_of_visit || 'Not Selected' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-hospital-symbol"></i> PrEP Site:</span>
              <span class="detail-value">{{ formData.prep_site || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-users"></i> KP Group:</span>
              <span class="detail-value">{{ formData.kpo_group || 'Not Selected' }}</span>
            </div>


            <!-- Section: Demographic -->
            <h4 class="details-section-title">A. Demographic Assessment</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-birthday-cake"></i> Age:</span>
              <span class="detail-value">{{ formData.age || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-weight"></i> Weight (Kg):</span>
              <span class="detail-value">{{ formData.weight || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Resident of:</span>
              <span class="detail-value">{{ formData.resident || 'Not Selected' }}</span>
            </div>


            <!-- Section: Behavioral Risk -->
            <h4 class="details-section-title">B. Behavioral Risk Assessment</h4>
            <div class="detail-item full-width">
              <span class="detail-label"><i class="fas fa-shield-virus"></i> Risks Selected:</span>
              <span class="detail-value list-value">{{ formatArrayValue(formData.behavioral_risk) }}</span>
            </div>


            <!-- Section: HIV Status -->
            <h4 class="details-section-title">C. HIV Status Assessment</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-vial"></i> Rapid Test Date:</span>
              <span class="detail-value">{{ formData.rapid_test_date || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-poll-h"></i> Rapid Test Result:</span>
              <span class="detail-value">{{ formData.rapid_test_result || 'Not Selected' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-alt"></i> 4th Gen Test Date:</span>
              <span class="detail-value">{{ formData.generation_test_date || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-poll"></i> 4th Gen Test Result:</span>
              <span class="detail-value">{{ formData.generation_test_result || 'Not Selected' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-pills"></i> Willing to start PrEP:</span>
              <span class="detail-value">{{ formData.start_prep || 'Not Selected' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-undo-alt"></i> Willing to follow-up:</span>
              <span class="detail-value">{{ formData.follow_up || 'Not Selected' }}</span>
            </div>


            <!-- Section: Clinical/Medical -->
            <h4 class="details-section-title">D. Clinical/Medical Assessment</h4>
            <div class="detail-item full-width">
              <span class="detail-label"><i class="fas fa-notes-medical"></i> Medical Info Checked:</span>
              <span class="detail-value list-value">{{ formatArrayValue(formData.medicalInfo) }}</span>
            </div>


            <!-- Section: PrEP Initiation -->
            <h4 class="details-section-title">E. PrEP Initiation</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-check-circle"></i> Suitable for PrEP:</span>
              <span class="detail-value">{{ formData.suitable_for_prep || 'Not Selected' }}</span>
            </div>
            <div class="detail-item" v-if="formData.type_of_visit === 'Screening Visit MO'"> <!-- Show field only on screening -->
               <span class="detail-label"><i class="fas fa-calendar-plus"></i> PrEP Initiation Date:</span>
               <span class="detail-value">{{ formData.prep_initiation_date || 'N/A' }}</span>
            </div>


            <!-- Section: Prescriber -->
            <h4 class="details-section-title">Prescriber Details</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-signature"></i> Prescriber Name:</span>
              <span class="detail-value">{{ formData.prescriber_name || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-user-md"></i> Designation:</span>
              <span class="detail-value">{{ formData.prescriber_designation || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-hashtag"></i> BMHC No:</span>
              <span class="detail-value">{{ formData.bmhc_no || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-check"></i> Signature Date:</span>
              <span class="detail-value">{{ formData.signature_date || 'N/A' }}</span>
            </div>
          </div>
          <div v-else class="loading-placeholder">
            <p><i class="fas fa-spinner fa-spin"></i> Loading data...</p>
          </div>

            <!-- Feedback Messages within Modal -->
            <div v-if="successMessage" class="modal-feedback success-message">
  <p><i class="fas fa-check-circle"></i> {{ successMessage }}</p>
</div>
<div v-if="errorMessage" class="modal-feedback error-message">
  <p><i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}</p>
</div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button @click="emitCancel" class="modal-cancel-btn" :disabled="isSubmitting">
            <i class="fas fa-times"></i> Edit Data
          </button>
          <button @click="emitConfirm" class="submit-btn modal-confirm-btn" :disabled="isSubmitting">
            <i class="fas fa-paper-plane"></i> {{ isSubmitting ? 'Submitting...' : 'Confirm & Submit' }}
             <i v-if="isSubmitting" class="fas fa-spinner fa-spin submit-spinner"></i>
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Props from parent (e.g., Form1.vue)
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  successMessage: { // To display feedback inside the modal
    type: String,
    default: '',
  },
  errorMessage: { // To display feedback inside the modal
    type: String,
    default: '',
  },
});

// Events emitted to parent
const emit = defineEmits(['confirm', 'cancel']);

// Helper to display array values cleanly
const formatArrayValue = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return 'None Selected';
  }
  // Filter out potential empty strings or null values if needed
  // return arr.filter(item => item).join('; ');
  return arr.join('; '); // Using semicolon as separator
};

// Methods to emit events
const emitConfirm = () => {
  emit('confirm');
};

const emitCancel = () => {
  // Only allow cancelling if not currently submitting
  if (!props.isSubmitting) {
    emit('cancel');
  }
};
</script>

<style scoped>
/* --- ENHANCED MODAL CSS --- */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.65); display: flex;
  justify-content: center; align-items: center; z-index: 1050; padding: 15px;
  transition: opacity 0.3s ease; /* Fade transition */
}
/* Add transitions for modal appearance */
.modal-content.enhanced-modal {
  background-color: #fff; border-radius: 8px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%; max-width: 700px; /* Adjust max width as needed */
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
  transform: scale(0.95); /* Start slightly smaller */
  opacity: 0; /* Start hidden */
  transition: transform 0.3s ease, opacity 0.3s ease; /* Scale and fade transition */
}
/* Apply active styles when modal is shown (controlled by v-if in parent) */
.modal-overlay:has(.enhanced-modal) .enhanced-modal { /* Requires :has support or use a class added by parent */
     transform: scale(1);
     opacity: 1;
}
/* Fallback if :has isn't supported (less smooth): */
/* .modal-overlay .enhanced-modal {
      transform: scale(1);
      opacity: 1;
   }
*/


.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 25px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 8px; border-top-right-radius: 8px;
}
.modal-header h2 { margin: 0; font-size: 1.4rem; color: #343a40; font-weight: 600; }
.modal-header h2 i { margin-right: 10px; color: #3498db; } /* Icon color */
.modal-close-btn {
  background: none; border: none; font-size: 1.8rem; font-weight: bold;
  color: #6c757d; cursor: pointer; padding: 0 5px; line-height: 1;
}
.modal-close-btn:hover:not(:disabled) { color: #343a40; }
.modal-close-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-body {
  padding: 20px 25px; overflow-y: auto; flex-grow: 1; background-color: #ffffff;
}
.modal-instruction { margin-bottom: 20px; color: #495057; font-size: 0.95rem; text-align: center; }
.details-section-title {
  font-size: 1.1rem; color: #3498db; margin-top: 20px; margin-bottom: 15px;
  padding-bottom: 5px; border-bottom: 2px solid #e9ecef; font-weight: 600;
}
.details-section-title:first-of-type { margin-top: 0; }
.modal-details-grid {
  display: grid;
  grid-template-columns: auto 1fr; /* Label auto-width, Value takes rest */
  gap: 12px 15px; /* Row gap, Column gap */
}
.detail-item { display: contents; } /* Allows label/value to participate in grid */
.detail-label {
  font-weight: 500; color: #495057; font-size: 0.9rem; display: flex;
  align-items: center; grid-column: 1; white-space: nowrap; /* Keep label on one line */
  padding-right: 10px; /* Space between label and value column */
}
.detail-label i { margin-right: 8px; color: #6c757d; width: 16px; text-align: center; flex-shrink: 0;}
.detail-value {
  color: #212529; font-size: 0.95rem; word-break: break-word;
  background-color: #f8f9fa; padding: 5px 8px; border-radius: 4px;
  grid-column: 2; line-height: 1.4;
}
/* Make section titles span both columns */
.modal-details-grid > h4 { grid-column: 1 / -1; }
/* Handling for items that should span full width (like array lists) */
.detail-item.full-width .detail-label {
    grid-column: 1 / -1; margin-bottom: 5px; white-space: normal; /* Allow label wrap */
}
.detail-item.full-width .detail-value {
    grid-column: 1 / -1; padding: 8px; font-size: 0.9rem;
}
.detail-value.list-value { font-style: italic; color: #555; }
/* Highlight specific important fields */
.detail-item.highlight .detail-label { color: #0056b3; }
.detail-item.highlight .detail-value { font-weight: bold; color: #0056b3; background-color: #e7f1ff; }
.value-strong { font-weight: bold; }

/* Feedback Messages Styling */
.modal-feedback {
    padding: 10px 15px; margin-top: 20px; border-radius: 5px; font-size: 0.95rem;
    display: flex; align-items: center;
}
.modal-feedback i { margin-right: 10px; }
.success-message {
    background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc;
}
.error-message {
    background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7;
}

.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px; padding: 15px 25px;
  background-color: #f8f9fa; border-top: 1px solid #dee2e6;
  border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;
}
.modal-confirm-btn, .modal-cancel-btn {
  padding: 0.6rem 1.2rem; font-size: 0.9rem; border: none; border-radius: 5px;
  cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.modal-confirm-btn:hover:not(:disabled), .modal-cancel-btn:hover:not(:disabled) {
     box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.modal-confirm-btn i, .modal-cancel-btn i { margin-right: 6px; }
/* Specific button colors */
.modal-confirm-btn { background-color: #3498db; color: #fff; } /* Confirm button */
.modal-confirm-btn:hover:not(:disabled) { background-color: #2980b9; }
.modal-cancel-btn { background-color: #e74c3c; color: white; } /* Cancel button */
.modal-cancel-btn:hover:not(:disabled) { background-color: #c0392b; }
/* Disabled state */
.modal-confirm-btn:disabled, .modal-cancel-btn:disabled {
    background-color: #bdc3c7; cursor: not-allowed; opacity: 0.7; box-shadow: none;
}
/* Spinner inside submit button */
.submit-spinner { margin-left: 8px; }

.loading-placeholder { text-align: center; padding: 40px 20px; color: #666; font-size: 1.1rem;}
.loading-placeholder i { margin-right: 8px; font-size: 1.3rem; }

/* Responsive adjustments */
@media (max-width: 650px) { /* Adjust breakpoint as needed */
  .modal-details-grid {
      grid-template-columns: 1fr; /* Stack label and value */
      gap: 5px 0; /* Reduced row gap, no column gap */
  }
  .detail-label {
      grid-column: 1; margin-bottom: 2px; font-weight: bold;
      white-space: normal; /* Allow label wrap */ padding-right: 0;
  }
  .detail-value {
      grid-column: 1; padding-left: 10px; /* Indent value slightly */
      margin-bottom: 8px; /* Space below value */
  }
  .detail-item.full-width .detail-label { margin-bottom: 5px; }
  .detail-item.full-width .detail-value { padding-left: 10px; margin-bottom: 8px;}

  .modal-footer { flex-direction: column-reverse; gap: 8px; }
  .modal-confirm-btn, .modal-cancel-btn { width: 100%; }
  .modal-header h2 { font-size: 1.2rem; }
}
</style>
