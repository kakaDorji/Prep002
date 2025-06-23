<!-- src/components/Form3_ConfirmationModal.vue -->
<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="emitCancel">
      <div class="modal-content enhanced-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-form3">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 id="modal-title-form3"><i class="fas fa-notes-medical"></i> Review Form 3 Details</h2>
          <button @click="emitCancel" class="modal-close-btn" aria-label="Close modal" :disabled="isSubmitting">×</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="modal-instruction">Please confirm the following information before submitting Form 3:</p>

          <div v-if="formData" class="modal-details-grid">
            <!-- Section: Basic Info -->
            <h4 class="details-section-title">Basic Information</h4>
            <div class="detail-item highlight">
              <span class="detail-label"><i class="fas fa-fingerprint"></i> Participant UID:</span>
              <span class="detail-value value-strong">{{ formData.participant_uid || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-day"></i> Date:</span>
              <span class="detail-value">{{ formData.date || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-week"></i> Type of Visit:</span>
              <span class="detail-value">{{ formData.visit_type || 'Not Selected' }}</span>
            </div>

            <!-- Section 1: Acute HIV Infection -->
            <h4 class="details-section-title">1. Acute HIV Infection Symptoms (Past 15 Days)</h4>
            <!-- Iterate through symptoms or list them -->
            <template v-for="symptom in acuteSymptoms" :key="symptom.key">
                 <div v-if="formData[symptom.key] === 'Yes'" class="symptom-group">
                    <h5 class="details-subsection-title">{{ symptom.label }}</h5>
                     <div class="detail-item"><span class="detail-label">Specify:</span><span class="detail-value">{{ formData[symptom.key + '_specify'] || 'N/A' }}</span></div>
                     <div class="detail-item"><span class="detail-label">Start Date:</span><span class="detail-value">{{ formData[symptom.key + '_start_date'] || 'N/A' }}</span></div>
                     <div class="detail-item"><span class="detail-label">Ongoing:</span><span class="detail-value">{{ formData[symptom.key + '_ongoing'] ? 'Yes' : 'No' }}</span></div>
                     <div class="detail-item"><span class="detail-label">Resolved:</span><span class="detail-value">{{ formData[symptom.key + '_resolved'] ? 'Yes' : 'No' }}</span></div>
                     <div class="detail-item"><span class="detail-label">Present on Exam:</span><span class="detail-value">{{ formData[symptom.key + '_present'] ? 'Yes' : 'No' }}</span></div>
                 </div>
            </template>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-exclamation-circle"></i> Recent HIV Exposure:</span>
                <span class="detail-value">{{ formData.recent_hiv_exposure || 'N/A' }}</span>
             </div>
              <div v-if="formData.recent_hiv_exposure === 'Yes'" class="detail-item full-width">
                <span class="detail-label">Exposure Description:</span>
                <span class="detail-value pre-wrap">{{ formData.describe_exposure || 'N/A' }}</span>
             </div>

             <!-- Section 2: Syndromic STI Management -->
            <h4 class="details-section-title">2. Syndromic STI Management</h4>
             <template v-for="symptom in stisymptoms" :key="symptom.key">
                 <div v-if="formData[symptom.key] === 'Yes'" class="symptom-group">
                     <h5 class="details-subsection-title">{{ symptom.label }}</h5>
                     <div class="detail-item"><span class="detail-label">Start Date:</span><span class="detail-value">{{ formData[symptom.key + '_start_date'] || 'N/A' }}</span></div>
                     <div class="detail-item"><span class="detail-label">Specify:</span><span class="detail-value">{{ formData[symptom.key + '_specify'] || 'N/A' }}</span></div>
                     <div class="detail-item"><span class="detail-label">Treatment/Referral:</span><span class="detail-value">{{ formData[symptom.key + '_treatment'] || 'N/A' }}</span></div>
                 </div>
             </template>

             <!-- Section 3: Clinical Findings -->
             <h4 class="details-section-title">3. Clinical Findings</h4>
              <div class="detail-item"><span class="detail-label">Acute HIV Specify:</span><span class="detail-value">{{ formData.acute_hiv_specify || 'None' }}</span></div>
              <div class="detail-item"><span class="detail-label">STI Specify:</span><span class="detail-value">{{ formData.sti_specify || 'None' }}</span></div>
              <div class="detail-item"><span class="detail-label">Others Specify:</span><span class="detail-value">{{ formData.other_specify || 'None' }}</span></div>

             <!-- Section 4: Disease History & Meds -->
             <h4 class="details-section-title">4. Disease History & Medications</h4>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-notes-medical"></i> Disease History:</span>
                <span class="detail-value">{{ formData.disease_history || 'N/A' }}</span>
             </div>
             <div v-if="formData.disease_history === 'Yes'" class="detail-item full-width">
                <span class="detail-label">History Details:</span>
                <span class="detail-value pre-wrap">{{ formData.disease_specify || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-pills"></i> Current Medications:</span>
                <span class="detail-value">{{ formData.current_medications || 'N/A' }}</span>
             </div>
              <div v-if="formData.current_medications === 'Yes'" class="detail-item full-width">
                <span class="detail-label">Medication Details:</span>
                <span class="detail-value pre-wrap">{{ formData.medication_specify || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-allergies"></i> Medication Allergies:</span>
                <span class="detail-value">{{ formData.medication_allergies || 'N/A' }}</span>
             </div>
              <div v-if="formData.medication_allergies === 'Yes'" class="detail-item full-width">
                <span class="detail-label">Allergy Details:</span>
                <span class="detail-value pre-wrap">{{ formData.allergy_specify || 'N/A' }}</span>
             </div>

            <!-- Section 5: Test Results -->
            <h4 class="details-section-title">5. Test Results (Sample Dates)</h4>
             <div class="detail-item"><span class="detail-label">HIV Rapid:</span><span class="detail-value">{{ formData.hiv_rapid_sample_date || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">HIV 4th Gen:</span><span class="detail-value">{{ formData.hiv_4th_sample_date || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Hep B (HBsAg):</span><span class="detail-value">{{ formData.hepatitis_b_sample_date || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Hep C (Anti-HCV):</span><span class="detail-value">{{ formData.hepatitis_C_sample_date || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Syphilis:</span><span class="detail-value">{{ formData.syphilis_sample_date || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Kidney (Creatinine):</span><span class="detail-value">{{ formData.kidney_function_sample_date || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Gonorrhoea:</span><span class="detail-value">{{ formData.gonorrhoea_sample_date || 'N/A' }}</span></div>

            <!-- Section 6: Assessment & Dispensing -->
            <h4 class="details-section-title">6. Assessment & Dispensing</h4>
              <div class="detail-item full-width">
                <span class="detail-label"><i class="fas fa-comment-medical"></i> Assessment Notes:</span>
                <span class="detail-value pre-wrap">{{ formData.assessment_notes || 'None' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-box-open"></i> PrEP Dispensed:</span>
                <span class="detail-value">{{ formData.prep_dispensed || 'N/A' }}</span>
             </div>
             <div v-if="formData.prep_dispensed === 'Yes'" class="detail-item">
                <span class="detail-label">Bottles Dispensed:</span>
                <span class="detail-value">{{ formData.prep_bottles ?? 'N/A' }}</span>
             </div>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-calendar-check"></i> Clinician Info Date:</span>
                <span class="detail-value">{{ formData.clinician_information_date || 'N/A' }}</span>
             </div>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-user-md"></i> Clinician Name:</span>
                <span class="detail-value">{{ formData.clinician_name || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-id-badge"></i> Clinician Designation:</span>
                <span class="detail-value">{{ formData.designation || 'N/A' }}</span>
             </div>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-hashtag"></i> BHMC Registration:</span>
                <span class="detail-value">{{ formData.bhmc_registration || 'N/A' }}</span>
             </div>

          </div>
          <div v-else class="loading-placeholder">
            <p><i class="fas fa-spinner fa-spin"></i> Loading data...</p>
          </div>

          <!-- Feedback Messages within Modal -->
          <div v-if="successMessage" class="modal-feedback success-message">
  <p><i class="fas fa-check-circle"></i> {{ successMessage }}</p>
</div>
          <<div v-if="errorMessage" class="modal-feedback error-message">
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

// Props from parent (Form3.vue)
const props = defineProps({
  formData: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
  successMessage: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
});

// Events emitted to parent
const emit = defineEmits(['confirm', 'cancel']);

// Helper arrays for iterating symptoms in the template
const acuteSymptoms = [
    { key: 'fever', label: 'Fever'},
    { key: 'tiredness', label: 'Tiredness'},
    { key: 'lymph_node', label: 'Lymph Node Enlargement'},
    { key: 'tonsilitis', label: 'Tonsilitis'},
    { key: 'sore_throat', label: 'Sore Throat'},
    { key: 'joint_aches', label: 'Joint/Muscle Aches'},
    { key: 'diarrhoea', label: 'Diarrhoea'},
    { key: 'rash', label: 'Rash'},
    { key: 'other_symptoms', label: 'Other Symptoms'},
];

const stisymptoms = [
    { key: 'vaginal_discharge', label: 'Vaginal/Urethral Discharge'},
    { key: 'lower_abdominal_pain', label: 'Lower Abdominal Pain'},
    { key: 'anorectal_discharge', label: 'Anorectal Discharge'},
    { key: 'genital_sore', label: 'Genital/Anal Sore/Blister/Warts'},
    { key: 'pain_with_urination', label: 'Pain/Burning with Urination'},
    { key: 'swelling_in_groin', label: 'Swelling in Groin'},
    { key: 'rash_data_resolved', label: 'Rash (STI Section)'}, // Distinguish from Acute Rash if needed
    { key: 'oth_symptoms', label: 'Other STI Symptoms'},
];


// Helper to display array values cleanly (if any were used)
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
/* (Same as used in Form2_ConfirmationModal.vue, maybe adjust max-width) */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.65); display: flex;
  justify-content: center; align-items: center; z-index: 1050; padding: 15px;
  transition: opacity 0.3s ease;
}
.modal-content.enhanced-modal {
  background-color: #fff; border-radius: 8px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%; max-width: 800px; /* Wider for more details */
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
  transform: scale(0.95); opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-overlay:has(.enhanced-modal) .enhanced-modal { transform: scale(1); opacity: 1; }

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 25px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 8px; border-top-right-radius: 8px;
}
.modal-header h2 { margin: 0; font-size: 1.4rem; color: #343a40; font-weight: 600; }
.modal-header h2 i { margin-right: 10px; color: #3498db; }
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
.details-subsection-title {
    font-size: 1rem; font-weight: 600; color: #555;
    margin-top: 15px; margin-bottom: 10px; padding-left: 0; /* No extra indent */
    border-left: none; grid-column: 1 / -1; /* Span full width */
}
.symptom-group {
    /* Optional: Add slight background or border to group related symptom details */
    /* background-color: #fafafa; */
    /* border: 1px solid #eee; */
    /* border-radius: 4px; */
    padding: 5px 0; /* Add some vertical padding */
    margin-bottom: 10px;
    display: contents; /* Allow items inside to align with the main grid */
}
.symptom-group > h5 { /* Style subsection titles within the grid */
     grid-column: 1 / -1;
}
.symptom-group > .detail-item .detail-label {
     padding-left: 15px; /* Indent details under the symptom */
     font-weight: normal;
     color: #666;
}


.modal-details-grid {
  display: grid; grid-template-columns: auto 1fr; gap: 10px 15px;
}
.detail-item { display: contents; }
.detail-label {
  font-weight: 500; color: #495057; font-size: 0.9rem; display: flex;
  align-items: center; grid-column: 1; white-space: nowrap; padding-right: 10px;
}
.detail-label i { margin-right: 8px; color: #6c757d; width: 16px; text-align: center; flex-shrink: 0;}
.detail-value {
  color: #212529; font-size: 0.95rem; word-break: break-word;
  background-color: #f8f9fa; padding: 5px 8px; border-radius: 4px;
  grid-column: 2; line-height: 1.4;
}
.detail-value.pre-wrap {
    white-space: pre-wrap; /* Preserve whitespace in textareas */
}
.modal-details-grid > h4 { grid-column: 1 / -1; }
.detail-item.full-width .detail-label { grid-column: 1 / -1; margin-bottom: 5px; white-space: normal; }
.detail-item.full-width .detail-value { grid-column: 1 / -1; padding: 8px; font-size: 0.9rem; }
.detail-value.list-value { font-style: italic; color: #555; }
.detail-item.highlight .detail-label { color: #0056b3; }
.detail-item.highlight .detail-value { font-weight: bold; color: #0056b3; background-color: #e7f1ff; }
.value-strong { font-weight: bold; }

.modal-feedback {
    padding: 10px 15px; margin-top: 20px; border-radius: 5px; font-size: 0.95rem;
    display: flex; align-items: center;
}
.modal-feedback i { margin-right: 10px; }
.success-message { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.error-message { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }

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

@media (max-width: 750px) {
  .modal-details-grid { grid-template-columns: 1fr; gap: 5px 0; }
  .detail-label { grid-column: 1; margin-bottom: 2px; font-weight: bold; white-space: normal; padding-right: 0;}
  .detail-value { grid-column: 1; padding-left: 10px; margin-bottom: 8px; }
  .symptom-group > .detail-item .detail-label { padding-left: 5px; } /* Less indent on mobile */
  .detail-item.full-width .detail-label { margin-bottom: 5px; }
  .detail-item.full-width .detail-value { padding-left: 10px; margin-bottom: 8px;}
  .modal-footer { flex-direction: column-reverse; gap: 8px; }
  .modal-confirm-btn, .modal-cancel-btn { width: 100%; }
  .modal-header h2 { font-size: 1.2rem; }
}
</style>