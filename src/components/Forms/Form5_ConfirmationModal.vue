<!-- src/components/Form5_ConfirmationModal.vue -->
<template>
    <teleport to="body">
      <div class="modal-overlay" @click.self="emitCancel">
        <div class="modal-content enhanced-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-form5">
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 id="modal-title-form5"><i class="fas fa-calendar-alt"></i> Review Unscheduled Visit Details</h2>
            <button @click="emitCancel" class="modal-close-btn" aria-label="Close modal" :disabled="isSubmitting">×</button>
          </div>
  
          <!-- Modal Body -->
          <div class="modal-body">
            <p class="modal-instruction">Please confirm the following information before submitting:</p>
  
            <div v-if="formData" class="modal-details-grid">
              <!-- Section: Basic Info -->
              <h4 class="details-section-title">Visit Information</h4>
              <div class="detail-item highlight">
                <span class="detail-label"><i class="fas fa-fingerprint"></i> Participant UID:</span>
                <span class="detail-value value-strong">{{ formData.participant_uid || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-hospital-symbol"></i> PrEP Site:</span>
                <span class="detail-value">{{ formData.prep_site || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-calendar-day"></i> Date:</span>
                <span class="detail-value">{{ formData.date || 'N/A' }}</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label"><i class="fas fa-question-circle"></i> Reason for Visit:</span>
                <span class="detail-value list-value">
                  {{ formatArrayValue(formData.reason_visit) }}
                  <span v-if="formData.reason_visit.includes('Other') && formData.other_reason_visit"> (Other: {{ formData.other_reason_visit }})</span>
                </span>
              </div>
  
              <!-- Section 2: Side Effects -->
              <h4 class="details-section-title">Side Effects Reported</h4>
              <!-- Iterate through side effects -->
              <template v-for="effect in sideEffects" :key="effect.key">
                   <div v-if="formData[effect.key] === 'Yes'" class="symptom-group">
                      <h5 class="details-subsection-title">{{ effect.label }}</h5>
                      <div class="detail-item"><span class="detail-label">Ongoing:</span><span class="detail-value">{{ formData[effect.key + '_ongoing'] ? 'Yes' : 'No' }}</span></div>
                      <div class="detail-item"><span class="detail-label">Resolved:</span><span class="detail-value">{{ formData[effect.key + '_resolved'] ? 'Yes' : 'No' }}</span></div>
                   </div>
              </template>
               <div v-if="formData.others === 'Yes'" class="detail-item full-width">
                   <span class="detail-label">Other Side Effects Description:</span>
                   <span class="detail-value pre-wrap">{{ formData.others_description || 'N/A' }}</span>
               </div>
               <div v-if="!hasSideEffectsReported" class="detail-item full-width">
                    <span class="detail-label">Side Effects:</span>
                    <span class="detail-value">None Reported</span>
               </div>
  
  
              <!-- Section 3: Challenges -->
              <h4 class="details-section-title">Challenges & Dosing</h4>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-exclamation-triangle"></i> Challenges Taking PrEP:</span>
                <span class="detail-value">{{ formData.challenges_prep || 'N/A' }}</span>
              </div>
              <div v-if="formData.challenges_prep === 'Yes'" class="detail-item full-width">
                <span class="detail-label">Challenge Details:</span>
                <span class="detail-value pre-wrap">{{ formData.challenges_details || 'N/A' }}</span>
              </div>
               <div class="detail-item full-width">
                <span class="detail-label"><i class="fas fa-pills"></i> Additional Doses Details:</span>
                <span class="detail-value pre-wrap">{{ formData.additional_doses_details || 'None' }}</span>
              </div>
  
              <!-- Section 4: Continuation & Notes -->
               <h4 class="details-section-title">Continuation & Notes</h4>
               <div class="detail-item">
                <span class="detail-label"><i class="fas fa-arrow-right"></i> Wish to Stop/Continue:</span>
                <span class="detail-value">{{ formData.prep_continue || 'N/A' }}</span>
              </div>
               <div v-if="formData.prep_continue === 'Stop'" class="detail-item full-width">
                  <span class="detail-label">Stopping Reasons:</span>
                  <span class="detail-value pre-wrap">{{ formData.stopping_reasons || 'N/A' }}</span>
               </div>
               <div v-if="formData.prep_continue === 'Stop'" class="detail-item full-width">
                  <span class="detail-label">Preferred Prevention Method:</span>
                  <span class="detail-value pre-wrap">{{ formData.stopping_Preventionmethod || 'N/A' }}</span>
               </div>
                <div class="detail-item full-width">
                  <span class="detail-label"><i class="fas fa-sticky-note"></i> Other Notes:</span>
                  <span class="detail-value pre-wrap">{{ formData.other_notes || 'None' }}</span>
               </div>
  
              <!-- Section: Interviewer Details -->
              <h4 class="details-section-title">Interviewer Information</h4>
               <div class="detail-item">
                <span class="detail-label"><i class="fas fa-user-tie"></i> Interviewer Name:</span>
                <span class="detail-value">{{ formData.interviewer_name || 'N/A' }}</span>
              </div>
               <div class="detail-item">
                <span class="detail-label"><i class="fas fa-id-badge"></i> Designation:</span>
                <span class="detail-value">{{ formData.designation || 'N/A' }}</span>
              </div>
               <div class="detail-item">
                <span class="detail-label"><i class="fas fa-hashtag"></i> BMHC Number:</span>
                <span class="detail-value">{{ formData.bmhc_number || 'N/A' }}</span>
              </div>
  
            </div>
            <div v-else class="loading-placeholder">
              <p><i class="fas fa-spinner fa-spin"></i> Loading data...</p>
            </div>
  
            <!-- Feedback Messages -->
            <div v-if="successMessage" class="modal-feedback success-message"><p><i class="fas fa-check-circle"></i> {{ successMessage }}</p></div>
            <div v-if="errorMessage" class="modal-feedback error-message"><p><i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}</p></div>
          </div>
  
          <!-- Modal Footer -->
          <div class="modal-footer">
            <button @click="emitCancel" class="modal-cancel-btn" :disabled="isSubmitting"><i class="fas fa-times"></i> Edit Data</button>
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
  import { defineProps, defineEmits, computed } from 'vue';
  
  // Props from parent (Form5.vue)
  const props = defineProps({
    formData: { type: Object, required: true },
    isSubmitting: { type: Boolean, default: false },
    successMessage: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
  });
  
  // Events emitted to parent
  const emit = defineEmits(['confirm', 'cancel']);
  
  // Helper arrays for iterating side effects in the template
  const sideEffects = [
      { key: 'nausea', label: 'Nausea'},
      { key: 'vomiting', label: 'Vomiting'},
      { key: 'abdominal_cramps', label: 'Abdominal Cramps'},
      { key: 'fatigue', label: 'Fatigue'},
      { key: 'dizziness', label: 'Dizziness'},
      { key: 'headache', label: 'Headache'},
      // 'others' handled separately below
  ];
  
  // Computed property to check if any side effect 'Yes' radio is selected
  const hasSideEffectsReported = computed(() => {
      return sideEffects.some(effect => props.formData[effect.key] === 'Yes') || props.formData.others === 'Yes';
  });
  
  // Helper to display array values cleanly
  const formatArrayValue = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return 'None Selected';
    return arr.filter(item => item).join('; ');
  };
  
  // Methods to emit events
  const emitConfirm = () => emit('confirm');
  const emitCancel = () => { if (!props.isSubmitting) emit('cancel'); };
  
  </script>
  
  <style scoped>
  /* --- Paste the ENHANCED MODAL CSS here --- */
  /* (Same as Form2/Form3, adjust max-width if desired) */
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.65); display: flex; justify-content: center; align-items: center; z-index: 1050; padding: 15px; transition: opacity 0.3s ease; }
  .modal-content.enhanced-modal { background-color: #fff; border-radius: 8px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); width: 100%; max-width: 750px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; transform: scale(0.95); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; }
  .modal-overlay:has(.enhanced-modal) .enhanced-modal { transform: scale(1); opacity: 1; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; border-top-left-radius: 8px; border-top-right-radius: 8px; }
  .modal-header h2 { margin: 0; font-size: 1.4rem; color: #343a40; font-weight: 600; }
  .modal-header h2 i { margin-right: 10px; color: #3498db; }
  .modal-close-btn { background: none; border: none; font-size: 1.8rem; font-weight: bold; color: #6c757d; cursor: pointer; padding: 0 5px; line-height: 1; }
  .modal-close-btn:hover:not(:disabled) { color: #343a40; }
  .modal-close-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .modal-body { padding: 20px 25px; overflow-y: auto; flex-grow: 1; background-color: #ffffff; }
  .modal-instruction { margin-bottom: 20px; color: #495057; font-size: 0.95rem; text-align: center; }
  .details-section-title { font-size: 1.1rem; color: #3498db; margin-top: 20px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #e9ecef; font-weight: 600; }
  .details-section-title:first-of-type { margin-top: 0; }
  .details-subsection-title { font-size: 1rem; font-weight: 600; color: #555; margin-top: 10px; margin-bottom: 8px; padding-left: 0; border-left: none; grid-column: 1 / -1; font-style: italic; }
  .symptom-group { padding: 5px 0; margin-bottom: 8px; display: contents; }
  .symptom-group > h5 { grid-column: 1 / -1; margin-bottom: 2px; }
  .symptom-group > .detail-item .detail-label { padding-left: 15px; font-weight: normal; color: #666; font-size: 0.85rem; }
  .symptom-group > .detail-item .detail-value { background-color: #fdfdfd; font-size: 0.9rem; padding: 3px 6px;}
  
  .modal-details-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; }
  .detail-item { display: contents; }
  .detail-label { font-weight: 500; color: #495057; font-size: 0.9rem; display: flex; align-items: center; grid-column: 1; white-space: nowrap; padding-right: 10px; }
  .detail-label i { margin-right: 8px; color: #6c757d; width: 16px; text-align: center; flex-shrink: 0;}
  .detail-value { color: #212529; font-size: 0.95rem; word-break: break-word; background-color: #f8f9fa; padding: 5px 8px; border-radius: 4px; grid-column: 2; line-height: 1.4; }
  .detail-value.pre-wrap { white-space: pre-wrap; }
  .modal-details-grid > h4, .modal-details-grid > h5 { grid-column: 1 / -1; }
  .detail-item.full-width .detail-label { grid-column: 1 / -1; margin-bottom: 5px; white-space: normal; }
  .detail-item.full-width .detail-value { grid-column: 1 / -1; padding: 8px; font-size: 0.9rem; }
  .detail-value.list-value { font-style: italic; color: #555; }
  .detail-item.highlight .detail-label { color: #0056b3; }
  .detail-item.highlight .detail-value { font-weight: bold; color: #0056b3; background-color: #e7f1ff; }
  .value-strong { font-weight: bold; }
  .modal-feedback { padding: 10px 15px; margin-top: 20px; border-radius: 5px; font-size: 0.95rem; display: flex; align-items: center; }
  .modal-feedback i { margin-right: 10px; }
  .success-message { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
  .error-message { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 15px 25px; background-color: #f8f9fa; border-top: 1px solid #dee2e6; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
  .modal-confirm-btn, .modal-cancel-btn { padding: 0.6rem 1.2rem; font-size: 0.9rem; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .modal-confirm-btn:hover:not(:disabled), .modal-cancel-btn:hover:not(:disabled) { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
  .modal-confirm-btn i, .modal-cancel-btn i { margin-right: 6px; }
  .modal-confirm-btn { background-color: #3498db; color: #fff; }
  .modal-confirm-btn:hover:not(:disabled) { background-color: #2980b9; }
  .modal-cancel-btn { background-color: #e74c3c; color: white; }
  .modal-cancel-btn:hover:not(:disabled) { background-color: #c0392b; }
  .modal-confirm-btn:disabled, .modal-cancel-btn:disabled { background-color: #bdc3c7; cursor: not-allowed; opacity: 0.7; box-shadow: none; }
  .submit-spinner { margin-left: 8px; }
  .loading-placeholder { text-align: center; padding: 40px 20px; color: #666; font-size: 1.1rem;}
  .loading-placeholder i { margin-right: 8px; font-size: 1.3rem; }
  
  @media (max-width: 750px) { /* Adjust breakpoint */
    .modal-details-grid { grid-template-columns: 1fr; gap: 5px 0; }
    .detail-label { grid-column: 1; margin-bottom: 2px; font-weight: bold; white-space: normal; padding-right: 0;}
    .detail-value { grid-column: 1; padding-left: 10px; margin-bottom: 8px; }
    .symptom-group > .detail-item .detail-label { padding-left: 5px; }
    .detail-item.full-width .detail-label { margin-bottom: 5px; }
    .detail-item.full-width .detail-value { padding-left: 10px; margin-bottom: 8px;}
    .modal-footer { flex-direction: column-reverse; gap: 8px; }
    .modal-confirm-btn, .modal-cancel-btn { width: 100%; }
    .modal-header h2 { font-size: 1.2rem; }
  }
  </style>