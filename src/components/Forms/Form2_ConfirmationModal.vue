<!-- src/components/Form2_ConfirmationModal.vue -->
<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="emitCancel">
      <div class="modal-content enhanced-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-form2">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 id="modal-title-form2"><i class="fas fa-file-alt"></i> Review Form 2 Details</h2>
          <button @click="emitCancel" class="modal-close-btn" aria-label="Close modal" :disabled="isSubmitting">×</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="modal-instruction">Please confirm the following information before submitting Form 2:</p>

          <div v-if="formData" class="modal-details-grid">
            <!-- Section: Interview Setup -->
            <h4 class="details-section-title">Interview Setup</h4>
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
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-user-tie"></i> Interviewer:</span>
              <span class="detail-value">{{ formData.interviewer_name || 'N/A' }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-id-badge"></i> Designation:</span>
              <span class="detail-value">{{ formData.designation || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-tasks"></i> Interview Status:</span>
              <span class="detail-value">{{ formData.interview_status || 'Not Selected' }}</span>
            </div>

            <!-- Section 1: Socio-Demographics -->
            <h4 class="details-section-title">SECTION 1: Socio-Demographics</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-alt"></i> Year of Birth:</span>
              <span class="detail-value">{{ formData.birth_year || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-birthday-cake"></i> Age:</span>
              <span class="detail-value">{{ formData.age || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-map-pin"></i> Permanent Resident:</span>
              <span class="detail-value">{{ formData.permanent_bhutan || 'Not Selected' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-briefcase"></i> Occupation:</span>
              <span class="detail-value">
                {{ formData.occupation || 'Not Selected' }}
                <span v-if="formData.occupation === 'Other' && formData.occupation_specify"> ({{ formData.occupation_specify }})</span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-user-graduate"></i> Education:</span>
              <span class="detail-value">{{ formData.education || 'Not Selected' }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-ring"></i> Marital Status:</span>
              <span class="detail-value">
                {{ formData.marital_status || 'Not Selected' }}
                 <span v-if="formData.marital_status === 'Other' && formData.marital_specify"> ({{ formData.marital_specify }})</span>
              </span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-home"></i> Living with Partner:</span>
              <span class="detail-value">{{ formData.living_with_partner || 'Not Selected' }}</span>
            </div>
             <div class="detail-item full-width">
              <span class="detail-label"><i class="fas fa-venus-mars"></i> Partner Gender(s):</span>
              <span class="detail-value list-value">{{ formatArrayValue(formData.partner_gender) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-heart"></i> Sexual Orientation:</span>
              <span class="detail-value">
                {{ formData.sexual_orientation || 'Not Selected' }}
                <span v-if="formData.sexual_orientation === 'Other' && formData.orientation_specify"> ({{ formData.orientation_specify }})</span>
              </span>
            </div>

            <!-- Section 2: Risk Perception -->
            <h4 class="details-section-title">SECTION 2: Risk Perception</h4>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-shield-virus"></i> HIV Risk Perception:</span>
              <span class="detail-value">{{ formData.hiv_risk || 'Not Selected' }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-bacteria"></i> STI Risk Perception:</span>
              <span class="detail-value">{{ formData.sti_risk || 'Not Selected' }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-user-shield"></i> HIV Management:</span>
               <span class="detail-value">
                {{ formData.hiv_management || 'Not Selected' }}
                <span v-if="formData.hiv_management === 'Other' && formData.other_hiv_management_specify"> ({{ formData.other_hiv_management_specify }})</span>
               </span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-question-circle"></i> Partner HIV Status:</span>
              <span class="detail-value">{{ formData.partner_hiv_status || 'Not Selected' }}</span>
            </div>

            <!-- Section 3: Sexual Behavior -->
             <h4 class="details-section-title">SECTION 3: Sexual Behavior</h4>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-user-friends"></i> Steady Partners:</span>
                <span class="detail-value">{{ formData.steady_partners || 'Not Selected' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-random"></i> Casual Partners:</span>
                <span class="detail-value">{{ formData.casual_partners || 'Not Selected' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-handshake"></i> Transactional Partners:</span>
                <span class="detail-value">{{ formData.transactional_partners || 'Not Selected' }}</span>
             </div>
             <!-- Anal Sex Partners -->
             <h5 class="details-subsection-title">Anal Sex Partners (last 3 months)</h5>
             <div v-if="formData.steady_partners === 'Yes'" class="detail-item">
                <span class="detail-label">Steady:</span><span class="detail-value">{{ formData.steady_anal_partners ?? 'N/A' }}</span>
             </div>
             <div v-if="formData.casual_partners === 'Yes'" class="detail-item">
                <span class="detail-label">Casual:</span><span class="detail-value">{{ formData.casual_anal_partners ?? 'N/A' }}</span>
             </div>
              <div v-if="formData.transactional_partners === 'Yes'" class="detail-item">
                <span class="detail-label">Transactional:</span><span class="detail-value">{{ formData.transactional_anal_partners ?? 'N/A' }}</span>
             </div>
              <div class="detail-item full-width" v-if="formData.anal_sex">
                <span class="detail-label">Anal Sex Status:</span><span class="detail-value">{{ formData.anal_sex }}</span>
             </div>
             <!-- Vaginal Sex Partners -->
             <h5 class="details-subsection-title">Vaginal Sex Partners (last 3 months)</h5>
              <div v-if="formData.steady_partners === 'Yes'" class="detail-item">
                <span class="detail-label">Steady:</span><span class="detail-value">{{ formData.steady_vaginal_partners ?? 'N/A' }}</span>
             </div>
             <div v-if="formData.casual_partners === 'Yes'" class="detail-item">
                <span class="detail-label">Casual:</span><span class="detail-value">{{ formData.casual_vaginal_partners ?? 'N/A' }}</span>
             </div>
              <div v-if="formData.transactional_partners === 'Yes'" class="detail-item">
                <span class="detail-label">Transactional:</span><span class="detail-value">{{ formData.transactional_vaginal_partners ?? 'N/A' }}</span>
             </div>
              <div class="detail-item full-width" v-if="formData.vaginal_sex">
                <span class="detail-label">Vaginal Sex Status:</span><span class="detail-value">{{ formData.vaginal_sex }}</span>
             </div>

            <!-- Section 4: Sex with Women Partners -->
            <h4 class="details-section-title">SECTION 4: Sex with Women Partners</h4>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-venus"></i> Ever had penetrative sex:</span>
                <span class="detail-value">{{ formData.ever_had_sex || 'Not Selected' }}</span>
             </div>
             <div v-if="formData.ever_had_sex === 'Yes'">
                 <div class="detail-item">
                    <span class="detail-label">Sex in last 6 months:</span>
                    <span class="detail-value">{{ formData.sex_last_six_months || 'N/A' }}</span>
                 </div>
                 <div class="detail-item">
                    <span class="detail-label">Condom Frequency (last sex):</span>
                    <span class="detail-value">{{ formData.condom_frequency || 'N/A' }}</span>
                 </div>
             </div>

            <!-- Section 5: Condom and Lubricant Use -->
             <h4 class="details-section-title">SECTION 5: Condom & Lubricant Use</h4>
             <h5 class="details-subsection-title">Condom Use (last week)</h5>
              <div class="detail-item">
                <span class="detail-label">Steady Partner:</span><span class="detail-value">{{ formData.steady_condom_use || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label">Casual Partner:</span><span class="detail-value">{{ formData.casual_condom_use || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label">Transactional Partner:</span><span class="detail-value">{{ formData.transactional_condom_use || 'N/A' }}</span>
             </div>
             <h5 class="details-subsection-title">Condom Use (last sex act)</h5>
              <div class="detail-item">
                <span class="detail-label">Steady Partner:</span><span class="detail-value">{{ formData.steady_last_condom || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label">Casual Partner:</span><span class="detail-value">{{ formData.casual_last_condom || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label">Transactional Partner:</span><span class="detail-value">{{ formData.transactional_last_condom || 'N/A' }}</span>
             </div>
             <div class="detail-item full-width">
                <span class="detail-label"><i class="fas fa-comment-slash"></i> Reasons for Condomless Sex:</span>
                <span class="detail-value list-value">
                    {{ formatArrayValue(formData.condomless_reasons) }}
                    <span v-if="formData.condomless_reasons.includes('Other reasons') && formData.other_condomless_reasons"> (Other: {{ formData.other_condomless_reasons }})</span>
                </span>
             </div>
             <h5 class="details-subsection-title">Lubricant Use (Anal Sex)</h5>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-tint"></i> Ever Used Lubricant:</span>
                <span class="detail-value">{{ formData.lubricant_used || 'N/A' }}</span>
             </div>
             <div v-if="formData.lubricant_used === 'Yes'">
                  <div class="detail-item">
                    <span class="detail-label">Frequency (last 3 months):</span>
                    <span class="detail-value">{{ formData.lubricant_frequency || 'N/A' }}</span>
                 </div>
                 <div class="detail-item full-width">
                    <span class="detail-label">Reasons for Not Always Using:</span>
                     <span class="detail-value list-value">
                        {{ formatArrayValue(formData.lubricant_use_reasons) }}
                        <span v-if="formData.lubricant_use_reasons.includes('Other reasons') && formData.other_lubricant_reasons"> (Other: {{ formData.other_lubricant_reasons }})</span>
                    </span>
                 </div>
             </div>

            <!-- Section 6: Program Exposure, STI, HIV Test -->
             <h4 class="details-section-title">SECTION 6: Program Exposure, STI, HIV Test</h4>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-hands-helping"></i> Met Outreach Worker (12m):</span>
                <span class="detail-value">{{ formData.outreach_workers || 'N/A' }}</span>
             </div>
              <div v-if="formData.outreach_workers === 'Yes'">
                 <!-- Display sub-questions 6.1.a to 6.1.h -->
                 <div class="detail-item"><span class="detail-label">HIV Prevention Talk:</span><span class="detail-value">{{ formData.hiv_prevention || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Took for HIV Testing:</span><span class="detail-value">{{ formData.hiv_testing || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">STI Talk:</span><span class="detail-value">{{ formData.sti_discussion || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Gave Condoms/Lube:</span><span class="detail-value">{{ formData.condoms_lubricants || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">PrEP Talk:</span><span class="detail-value">{{ formData.prep_discussion || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Asked Wellbeing:</span><span class="detail-value">{{ formData.general_wellbeing || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Spoke Stigma Issues:</span><span class="detail-value">{{ formData.stigma_issues || 'N/A' }}</span></div>
                 <div v-if="formData.other_issues" class="detail-item"><span class="detail-label">Shared Other Issues:</span><span class="detail-value">{{ formData.other_issues }}</span></div>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-building"></i> Visited Pride Office (12m):</span>
                <span class="detail-value">{{ formData.visited_pride_office || 'N/A' }}</span>
             </div>
             <div v-if="formData.visited_pride_office === 'Yes'">
                 <!-- Display sub-questions 6.2.a to 6.2.e -->
                 <div v-if="formData.pride_visit_reason" class="detail-item"><span class="detail-label">Reason:</span><span class="detail-value">{{ formData.pride_visit_reason }}</span></div>
                 <div class="detail-item"><span class="detail-label">For HIV Test:</span><span class="detail-value">{{ formData.pride_hiv_test || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">For STI Test:</span><span class="detail-value">{{ formData.pride_sti_test || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">For Condoms/Lube:</span><span class="detail-value">{{ formData.pride_condoms_lubricants || 'N/A' }}</span></div>
                 <div v-if="formData.pride_other_reasons" class="detail-item"><span class="detail-label">Other Reason:</span><span class="detail-value">{{ formData.pride_other_reasons }}</span></div>
             </div>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-clinic-medical"></i> Visited HISC Thimphu (12m):</span>
                <span class="detail-value">{{ formData.visited_hisc_thimphu || 'N/A' }}</span>
             </div>
              <div v-if="formData.visited_hisc_thimphu === 'Yes'">
                 <!-- Display sub-questions 6.3.b to 6.3.g -->
                  <div v-if="formData.hisc_visit_reason" class="detail-item"><span class="detail-label">Reason:</span><span class="detail-value">{{ formData.hisc_visit_reason }}</span></div>
                 <div class="detail-item"><span class="detail-label">For HIV Test:</span><span class="detail-value">{{ formData.hisc_hiv_test || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">For STI Test:</span><span class="detail-value">{{ formData.hisc_sti_test || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">For Condoms/Lube:</span><span class="detail-value">{{ formData.hisc_condoms_lubricants || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">For General Checkup:</span><span class="detail-value">{{ formData.hisc_general_checkup || 'N/A' }}</span></div>
                 <div v-if="formData.hisc_other_reasons" class="detail-item"><span class="detail-label">Other Reason:</span><span class="detail-value">{{ formData.hisc_other_reasons }}</span></div>
             </div>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-vials"></i> Ever Tested for HIV:</span>
                <span class="detail-value">{{ formData.tested_hiv || 'N/A' }}</span>
             </div>
              <div v-if="formData.tested_hiv === 'Yes'">
                 <!-- Display sub-questions 6.5 and 6.6 -->
                 <div class="detail-item"><span class="detail-label">Last HIV Test Time:</span><span class="detail-value">{{ formData.last_tested_hiv || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Know/Share HIV Status:</span><span class="detail-value">{{ formData.know_hiv_status || 'N/A' }}</span></div>
             </div>
             <div class="detail-item full-width">
                <span class="detail-label"><i class="fas fa-head-side-cough"></i> STI Symptoms (last 6m):</span>
                <span class="detail-value list-value">{{ formatArrayValue(formData.sti_symptoms) }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-prescription-bottle-alt"></i> Action Taken for Symptoms:</span>
                <span class="detail-value">
                    {{ formData.action_taken || 'N/A' }}
                    <span v-if="formData.action_taken === 'Other (specify)' && formData.other_action_taken"> ({{ formData.other_action_taken }})</span>
                </span>
             </div>

            <!-- Section 7: Alcohol and Drug Use -->
             <h4 class="details-section-title">SECTION 7: Alcohol & Drug Use</h4>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-wine-glass-alt"></i> Alcohol Use (12m):</span>
                <span class="detail-value">{{ formData.alcohol_consumed || 'N/A' }}</span>
             </div>
             <div v-if="formData.alcohol_consumed === 'Yes'">
                <div class="detail-item"><span class="detail-label">Days Consumed (last week):</span><span class="detail-value">{{ formData.days_consumed_alcohol ?? 'N/A' }}</span></div>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-cocktail"></i> Alcohol Before/During Sex:</span>
                <span class="detail-value">{{ formData.alcohol_before_sex || 'N/A' }}</span>
             </div>
              <div v-if="formData.alcohol_before_sex === 'Yes'">
                  <div class="detail-item"><span class="detail-label"><i class="fas fa-cannabis"></i> Recreational Drugs (12m):</span><span class="detail-value">{{ formData.recreational_drugs || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label"><i class="fas fa-joint"></i> Drugs Before/During Sex:</span><span class="detail-value">{{ formData.drugs_before_sex || 'N/A' }}</span></div>
             </div>

            <!-- Section 8: Stigma & Violence -->
            <h4 class="details-section-title">SECTION 8: Stigma & Violence</h4>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-user-slash"></i> Denied Medical Services:</span>
                <span class="detail-value">{{ formData.denied_services || 'N/A' }}</span>
             </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-user-shield"></i> Police Violence/Abuse:</span>
                <span class="detail-value">{{ formData.violence_police || 'N/A' }}</span>
             </div>
             <div class="detail-item">
                <span class="detail-label"><i class="fas fa-exclamation-triangle"></i> Forced Intercourse (12m):</span>
                <span class="detail-value">{{ formData.forced_intercourse || 'N/A' }}</span>
             </div>
              <div class="detail-item full-width">
                <span class="detail-label"><i class="fas fa-bullhorn"></i> Informed Whom (Forced Sex):</span>
                 <span class="detail-value list-value">
                    {{ formatArrayValue(formData.informed_person) }}
                    <span v-if="formData.informed_person.includes('Others') && formData.other_informed"> (Other: {{ formData.other_informed }})</span>
                </span>
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

// Props from parent (Form2.vue)
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  successMessage: {
    type: String,
    default: '',
  },
  errorMessage: {
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
  return arr.filter(item => item).join('; '); // Filter out empty values and join with semicolon
};

// Methods to emit events
const emitConfirm = () => {
  emit('confirm');
};

const emitCancel = () => {
  if (!props.isSubmitting) {
    emit('cancel');
  }
};
</script>

<style scoped>
/* --- Paste the ENHANCED MODAL CSS here --- */
/* (Same as used in Form1_ConfirmationModal.vue) */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.65); display: flex;
  justify-content: center; align-items: center; z-index: 1050; padding: 15px;
  transition: opacity 0.3s ease;
}
.modal-content.enhanced-modal {
  background-color: #fff; border-radius: 8px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%; max-width: 750px; /* Slightly wider for more fields */
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
  transform: scale(0.95); opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
/* Active state */
.modal-overlay:has(.enhanced-modal) .enhanced-modal {
     transform: scale(1);
     opacity: 1;
}
/* Fallback */
/* .modal-overlay .enhanced-modal { transform: scale(1); opacity: 1; } */

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
/* Subsection titles (optional) */
.details-subsection-title {
    font-size: 1rem;
    font-weight: 600;
    color: #555;
    margin-top: 15px;
    margin-bottom: 10px;
    padding-left: 10px; /* Indent slightly */
    border-left: 3px solid #bdc3c7;
}

.modal-details-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 15px; /* Slightly smaller gap */
}
.detail-item { display: contents; }
.detail-label {
  font-weight: 500; color: #495057; font-size: 0.9rem; display: flex;
  align-items: center; grid-column: 1; white-space: nowrap;
  padding-right: 10px;
}
.detail-label i { margin-right: 8px; color: #6c757d; width: 16px; text-align: center; flex-shrink: 0;}
.detail-value {
  color: #212529; font-size: 0.95rem; word-break: break-word;
  background-color: #f8f9fa; padding: 5px 8px; border-radius: 4px;
  grid-column: 2; line-height: 1.4;
}
/* Section titles span both columns */
.modal-details-grid > h4 { grid-column: 1 / -1; }
/* Subsection titles span both columns */
.modal-details-grid > h5 { grid-column: 1 / -1; }

/* Full width items */
.detail-item.full-width .detail-label {
    grid-column: 1 / -1; margin-bottom: 5px; white-space: normal;
}
.detail-item.full-width .detail-value {
    grid-column: 1 / -1; padding: 8px; font-size: 0.9rem;
}
.detail-value.list-value { font-style: italic; color: #555; }
/* Highlight specific fields */
.detail-item.highlight .detail-label { color: #0056b3; }
.detail-item.highlight .detail-value { font-weight: bold; color: #0056b3; background-color: #e7f1ff; }
.value-strong { font-weight: bold; }

/* Feedback Messages */
.modal-feedback {
    padding: 10px 15px; margin-top: 20px; border-radius: 5px; font-size: 0.95rem;
    display: flex; align-items: center;
}
.modal-feedback i { margin-right: 10px; }
.success-message { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.error-message { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }

/* Footer */
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
.modal-confirm-btn { background-color: #3498db; color: #fff; }
.modal-confirm-btn:hover:not(:disabled) { background-color: #2980b9; }
.modal-cancel-btn { background-color: #e74c3c; color: white; }
.modal-cancel-btn:hover:not(:disabled) { background-color: #c0392b; }
.modal-confirm-btn:disabled, .modal-cancel-btn:disabled {
    background-color: #bdc3c7; cursor: not-allowed; opacity: 0.7; box-shadow: none;
}
.submit-spinner { margin-left: 8px; }

.loading-placeholder { text-align: center; padding: 40px 20px; color: #666; font-size: 1.1rem;}
.loading-placeholder i { margin-right: 8px; font-size: 1.3rem; }

/* Responsive */
@media (max-width: 700px) {
  .modal-details-grid { grid-template-columns: 1fr; gap: 5px 0; }
  .detail-label { grid-column: 1; margin-bottom: 2px; font-weight: bold; white-space: normal; padding-right: 0;}
  .detail-value { grid-column: 1; padding-left: 10px; margin-bottom: 8px; }
  .detail-item.full-width .detail-label { margin-bottom: 5px; }
  .detail-item.full-width .detail-value { padding-left: 10px; margin-bottom: 8px;}
  .modal-footer { flex-direction: column-reverse; gap: 8px; }
  .modal-confirm-btn, .modal-cancel-btn { width: 100%; }
  .modal-header h2 { font-size: 1.2rem; }
}
</style>