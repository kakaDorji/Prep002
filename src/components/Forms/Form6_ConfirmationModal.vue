<!-- src/components/Form6_ConfirmationModal.vue -->
<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="emitCancel">
      <div class="modal-content enhanced-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-form6">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 id="modal-title-form6"><i class="fas fa-sign-out-alt"></i> Review Exit Form Details</h2>
          <button @click="emitCancel" class="modal-close-btn" aria-label="Close modal" :disabled="isSubmitting">×</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="modal-instruction">Please confirm the following Exit Form information before submitting:</p>

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
              <span class="detail-label"><i class="fas fa-hospital-symbol"></i> PrEP Site:</span>
              <span class="detail-value">{{ formData.prep_site || 'N/A' }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-calendar-week"></i> Type of Visit:</span>
              <span class="detail-value">{{ formData.visit_type || 'N/A' }}</span>
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
              <span class="detail-label"><i class="fas fa-hashtag"></i> BMHC Number:</span>
              <span class="detail-value">{{ formData.bmhc_number || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-tasks"></i> Interview Status:</span>
              <span class="detail-value">{{ formData.interview_status || 'Not Selected' }}</span>
            </div>

            <!-- Section 1: Socio-Demographics -->
            <h4 class="details-section-title">SECTION 1: Socio-Demographics</h4>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-briefcase"></i> Occupation:</span>
              <span class="detail-value">
                {{ formData.occupation_status || 'N/A' }}
                <span v-if="formData.occupation_status === 'Other' && formData.occupation_other"> ({{ formData.occupation_other }})</span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-ring"></i> Marital Status:</span>
              <span class="detail-value">
                {{ formData.marital_status || 'N/A' }}
                 <span v-if="formData.marital_status === 'Other' && formData.marital_other"> ({{ formData.marital_other }})</span>
              </span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-home"></i> Live with Partner:</span>
              <span class="detail-value">{{ formData.live_with_partner || 'N/A' }}</span>
            </div>
             <div v-if="formData.live_with_partner === 'Yes'" class="detail-item full-width">
              <span class="detail-label"><i class="fas fa-venus-mars"></i> Partner Gender(s):</span>
              <span class="detail-value list-value">{{ formatArrayValue(formData.partner_gender) }}</span>
            </div>

            <!-- Section 2: Risk Perception -->
            <h4 class="details-section-title">SECTION 2: Risk Perception</h4>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-bacteria"></i> STI Risk:</span>
              <span class="detail-value">{{ formatRisk(formData.sti_risk) }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-shield-virus"></i> HIV Risk:</span>
              <span class="detail-value">{{ formatRisk(formData.hiv_risk) }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label"><i class="fas fa-question-circle"></i> Partner HIV Status:</span>
              <span class="detail-value">{{ formData.partner_hiv_status || 'N/A' }}</span>
            </div>

             <!-- Section 3: Sexual Behavior -->
             <h4 class="details-section-title">SECTION 3: Sexual Behavior (Last Month)</h4>
              <h5 class="details-subsection-title">Anal Sex Partners</h5>
               <div class="detail-item"><span class="detail-label">Steady:</span><span class="detail-value">{{ formData.steady_anal_partners ?? 'N/A' }}</span></div>
               <div class="detail-item"><span class="detail-label">Casual:</span><span class="detail-value">{{ formData.casual_anal_partners ?? 'N/A' }}</span></div>
               <div class="detail-item"><span class="detail-label">Transactional:</span><span class="detail-value">{{ formData.transactional_anal_partners ?? 'N/A' }}</span></div>
               <div class="detail-item" v-if="formData.anal_sex"><span class="detail-label">Anal Sex Status:</span><span class="detail-value">{{ formData.anal_sex }}</span></div>
              <h5 class="details-subsection-title">Vaginal Sex Partners</h5>
                <div class="detail-item"><span class="detail-label">Steady:</span><span class="detail-value">{{ formData.steady_vaginal_partners ?? 'N/A' }}</span></div>
                <div class="detail-item"><span class="detail-label">Casual:</span><span class="detail-value">{{ formData.casual_vaginal_partners ?? 'N/A' }}</span></div>
                <div class="detail-item"><span class="detail-label">Transactional:</span><span class="detail-value">{{ formData.transactional_vaginal_partners ?? 'N/A' }}</span></div>
                <div class="detail-item" v-if="formData.vaginal_sex"><span class="detail-label">Vaginal Sex Status:</span><span class="detail-value">{{ formData.vaginal_sex }}</span></div>
             <div class="detail-item full-width">
                 <span class="detail-label"><i class="fas fa-calendar-alt"></i> Days Sex (Regular - Last Week):</span>
                 <span class="detail-value list-value">{{ formatArrayValue(formData.sex_days) }}</span>
             </div>
             <div class="detail-item" v-if="formData.no_sex_with_regular_partner">
                 <span class="detail-label">No Sex (Regular - Last Week):</span>
                 <span class="detail-value">{{ formData.no_sex_with_regular_partner }}</span>
             </div>
              <div class="detail-item">
                 <span class="detail-label">Condom Use (Regular Clients - Last Week):</span>
                 <span class="detail-value">{{ formData.regular_condom_use || 'N/A' }}</span>
             </div>
             <div class="detail-item">
                 <span class="detail-label"><i class="fas fa-shield-alt"></i> Condom (Last Sex - Regular):</span>
                 <span class="detail-value">{{ formData.last_sex_condom_use || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                 <span class="detail-label"><i class="fas fa-handshake"></i> Have Clients:</span>
                 <span class="detail-value">{{ formData.have_clients || 'N/A' }}</span>
              </div>
              <div v-if="formData.have_clients === 'Yes'">
                   <div class="detail-item"><span class="detail-label">Clients (Last Week):</span><span class="detail-value">{{ formData.clients_last_week ?? 'N/A' }}</span></div>
                   <div class="detail-item full-width"><span class="detail-label">Days Sex (Clients - Last Week):</span><span class="detail-value list-value">{{ formatArrayValue(formData.sex_days_clients) }}</span></div>
                   <div class="detail-item" v-if="formData.no_sex_with_clients"><span class="detail-label">No Sex (Clients - Last Week):</span><span class="detail-value">{{ formData.no_sex_with_clients }}</span></div>
                   <div class="detail-item"><span class="detail-label">Condom Use (Clients - Last Week):</span><span class="detail-value">{{ formData.clients_condom_use || 'N/A' }}</span></div>
                   <div class="detail-item"><span class="detail-label">Condom (Last Sex - Clients):</span><span class="detail-value">{{ formData.last_sex_with_clients_condom_use || 'N/A' }}</span></div>
              </div>
              <div class="detail-item full-width">
                 <span class="detail-label"><i class="fas fa-comment-slash"></i> Reasons Condomless:</span>
                 <span class="detail-value list-value">
                    {{ formatArrayValue(formData.sex_without_condom_reason) }}
                     <span v-if="formData.sex_without_condom_reason.includes('Other') && formData.sex_without_condom_reason_other"> (Other: {{ formData.sex_without_condom_reason_other }})</span>
                 </span>
              </div>
               <div class="detail-item">
                 <span class="detail-label"><i class="fas fa-exchange-alt"></i> PrEP Changed Condom Use:</span>
                 <span class="detail-value">{{ formData.prep_change_condom_use || 'N/A' }}</span>
              </div>

            <!-- Section 4: PrEP Regimen & Side Effects -->
             <h4 class="details-section-title">SECTION 4: PrEP Regimen & Side Effects</h4>
             <!-- ... (Similar display logic as Form 4 Confirmation Modal) ... -->
             <div class="detail-item"><span class="detail-label">Prescribed Regimen:</span><span class="detail-value">{{ formData.dosing_regimen || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Changed Regimen?:</span><span class="detail-value">{{ formData.change_regimen || 'N/A' }}</span></div>
             <div v-if="formData.change_regimen === 'Yes'" class="detail-item full-width"><span class="detail-label">Reason for Change:</span><span class="detail-value pre-wrap">{{ formData.reason_change || 'N/A' }}</span></div>
             <h5 class="details-subsection-title">Side Effects</h5>
              <template v-for="effect in sideEffects" :key="effect.key">
                  <div v-if="formData[effect.key] === 'Yes'" class="symptom-group">
                      <h6 class="details-tertiary-title">{{ effect.label }}</h6>
                      <div class="detail-item"><span class="detail-label">Ongoing:</span><span class="detail-value">{{ formData[effect.key + '_ongoing'] ? 'Yes' : 'No' }}</span></div>
                      <div class="detail-item"><span class="detail-label">Resolved:</span><span class="detail-value">{{ formData[effect.key + '_resolved'] ? 'Yes' : 'No' }}</span></div>
                  </div>
              </template>
             <div v-if="formData.other_symptoms === 'Yes'" class="detail-item full-width"><span class="detail-label">Other Side Effects Specify:</span><span class="detail-value">{{ formData.other_symptoms_specified || 'N/A' }}</span></div>
             <div v-if="formData.no_response === 'Yes'" class="detail-item full-width"><span class="detail-label">Side Effects Response:</span><span class="detail-value">No Response Given</span></div>


            <!-- Section 5/5a: Daily PrEP -->
            <template v-if="formData.dosing_regimen === 'Daily PrEP'">
                 <h4 class="details-section-title">SECTION 5/5a: Daily PrEP Details</h4>
                 <!-- ... Display Daily PrEP fields ... -->
                 <div class="detail-item"><span class="detail-label">Reason:</span><span class="detail-value">{{ formData.prep_reason || 'N/A' }}<span v-if="formData.prep_reason === 'Other'"> ({{ formData.other_reason }})</span></span></div>
                 <h5 class="details-subsection-title">Recall (Last 7 Days)</h5>
                 <div class="detail-item"><span class="detail-label">Day 1:</span><span class="detail-value">{{ formData.day_1_pill || 'N/A' }}</span></div>
                 <!-- ... Other Days ... -->
                 <div class="detail-item"><span class="detail-label">Day 7:</span><span class="detail-value">{{ formData.day_7_pill || 'N/A' }}</span></div>
                 <h5 class="details-subsection-title">Adherence (Last Month)</h5>
                 <div class="detail-item"><span class="detail-label">Pill Time:</span><span class="detail-value">{{ formData.pill_time || 'N/A' }}<span v-if="formData.pill_time === 'Other'"> ({{ formData.pill_time_other }})</span></span></div>
                 <div class="detail-item"><span class="detail-label">Same Time?:</span><span class="detail-value">{{ formData.pill_frequency || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Reminder:</span><span class="detail-value">{{ formData.pill_reminder || 'N/A' }}<span v-if="formData.pill_reminder === 'Other'"> ({{ formData.pill_reminder_other }})</span></span></div>
                 <div class="detail-item full-width"><span class="detail-label">Reasons Missed:</span><span class="detail-value list-value">{{ formatArrayValue(formData.missed_pill_reasons) }}<span v-if="formData.missed_pill_reasons.includes('Other')"> (Other: {{ formData.missed_pill_other_reason }})</span></span></div>
                 <div class="detail-item"><span class="detail-label">Longest Missed Streak:</span><span class="detail-value">{{ formData.longest_no_pill || 'N/A' }}</span></div>
                 <div class="detail-item"><span class="detail-label">Total Missed Days:</span><span class="detail-value">{{ formData.total_no_pill_days || 'N/A' }}</span></div>
            </template>

             <!-- Section 6/6a: Event-Driven PrEP -->
             <template v-if="formData.dosing_regimen === 'Event-Driven PrEP'">
                 <h4 class="details-section-title">SECTION 6/6a: Event-Driven PrEP Details</h4>
                  <!-- ... Display ED PrEP fields ... -->
                  <div class="detail-item"><span class="detail-label">Reason:</span><span class="detail-value">{{ formData.ed_prep_reason || 'N/A' }}<span v-if="formData.ed_prep_reason === 'Other'"> ({{ formData.other_ed_prep_reason }})</span></span></div>
                  <h5 class="details-subsection-title">Recall (Last Month)</h5>
                  <div class="detail-item"><span class="detail-label">Sex Acts:</span><span class="detail-value">{{ formData.sex_last_month || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">PrEP Before (%):</span><span class="detail-value">{{ formData.prep_before_sex || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">PrEP After (%):</span><span class="detail-value">{{ formData.prep_after_sex || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">1st Dose After (%):</span><span class="detail-value">{{ formData.first_prep_after_sex || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">2nd Dose After (%):</span><span class="detail-value">{{ formData.second_prep_after_sex || 'N/A' }}</span></div>
                  <h5 class="details-subsection-title">Recall (Last Week)</h5>
                  <div class="detail-item"><span class="detail-label">Sex Acts:</span><span class="detail-value">{{ formData.sex_last_week || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">PrEP Before (%):</span><span class="detail-value">{{ formData.prep_before_sex_week || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">1st Dose After (%):</span><span class="detail-value">{{ formData.first_prep_after_sex_week || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">2nd Dose After (%):</span><span class="detail-value">{{ formData.second_prep_after_sex_week || 'N/A' }}</span></div>
                  <h5 class="details-subsection-title">Recall (Last Sex Act)</h5>
                  <div class="detail-item"><span class="detail-label">Intake Before:</span><span class="detail-value">{{ formData.prep_before_last_sex || 'N/A' }}<span v-if="formData.prep_before_last_sex === 'Other'"> ({{ formData.prep_before_last_sex_other }})</span></span></div>
                  <div class="detail-item"><span class="detail-label">Intake After:</span><span class="detail-value">{{ formData.prep_after_last_sex || 'N/A' }}<span v-if="formData.prep_after_last_sex === 'Other'"> ({{ formData.prep_after_last_sex_other }})</span></span></div>
             </template>

            <!-- Section 7: Adherence (General) -->
            <h4 class="details-section-title">SECTION 7: PrEP Adherence (General)</h4>
             <div class="detail-item full-width"><span class="detail-label">Remembering Methods:</span><span class="detail-value list-value">{{ formatArrayValue(formData.pill_remember) }}<span v-if="formData.pill_remember.includes('Other')"> (Other: {{ formData.pill_remember_other }})</span></span></div>
             <div class="detail-item full-width"><span class="detail-label">Missed Pills Status:</span><span class="detail-value list-value">{{ formatArrayValue(formData.pill_missed) }}</span></div>
             <div class="detail-item full-width"><span class="detail-label">Reasons Missed:</span><span class="detail-value list-value">{{ formatArrayValue(formData.pill_missed_experiences) }}<span v-if="formData.pill_missed_experiences.includes('Other')"> (Other: {{ formData.pill_missed_experiences_other }})</span></span></div>

            <!-- Section 8: Experience, Sharing, Continuation -->
            <h4 class="details-section-title">SECTION 8: Experience, Sharing, Continuation</h4>
             <div class="detail-item"><span class="detail-label">Ease of Remembering:</span><span class="detail-value">{{ formData.pill_remember_difficulty || 'N/A' }}</span></div>
             <div class="detail-item"><span class="detail-label">Pills Shared:</span><span class="detail-value">{{ formData.pill_sharing || 'N/A' }}</span></div>
             <div class="detail-item full-width"><span class="detail-label">Shared With:</span><span class="detail-value list-value">{{ formatArrayValue(formData.pill_recipient) }}<span v-if="formData.pill_recipient.includes('Other')"> (Other: {{ formData.pill_recipient_other }})</span></span></div>

            <!-- Section 9: Program Exposure -->
             <h4 class="details-section-title">SECTION 9: Program Exposure</h4>
              <div class="detail-item"><span class="detail-label">Visited Pride (3m):</span><span class="detail-value">{{ formData.visited_pride_bhutan || 'N/A' }}</span></div>
              <div v-if="formData.visited_pride_bhutan === 'Yes'">
                  <div class="detail-item"><span class="detail-label">For HIV Test:</span><span class="detail-value">{{ formData.hiv_testing_reason || 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">For STI Test:</span><span class="detail-value">{{ formData.sti_testing_reason || 'N/A' }}</span></div>
                  <div v-if="formData.other_reason_visited" class="detail-item"><span class="detail-label">Other Reason:</span><span class="detail-value">{{ formData.other_reason_visited }}</span></div>
              </div>
              <div class="detail-item"><span class="detail-label">Met ORW (M1):</span><span class="detail-value">{{ formData.orw_meeting_one || 'N/A' }}</span></div>
              <div class="detail-item"><span class="detail-label">Received Condoms (HISC):</span><span class="detail-value">{{ formData.received_condoms || 'N/A' }}</span></div>
              <div class="detail-item"><span class="detail-label">Received Lubricants (HISC):</span><span class="detail-value">{{ formData.received_lubricants || 'N/A' }}</span></div>

            <!-- Section 10: Alcohol & Drug Use -->
             <h4 class="details-section-title">SECTION 10: Alcohol & Drug Use</h4>
              <div class="detail-item"><span class="detail-label">Alcohol Use (3m):</span><span class="detail-value">{{ formData.consumed_alcohol || 'N/A' }}</span></div>
              <div v-if="formData.consumed_alcohol === 'Yes'">
                   <div class="detail-item"><span class="detail-label">Days Consumed (Last Week):</span><span class="detail-value">{{ formData.alcohol_days ?? 'N/A' }}</span></div>
                  <div class="detail-item"><span class="detail-label">Alcohol Before/During Sex:</span><span class="detail-value">{{ formData.alcohol_before_during_sex || 'N/A' }}</span></div>
              </div>
               <div class="detail-item"><span class="detail-label">Recreational Drugs (12m):</span><span class="detail-value">{{ formData.taken_drugs || 'N/A' }}</span></div>
              <div v-if="formData.taken_drugs === 'Yes'">
                   <div class="detail-item"><span class="detail-label">Drugs Before/During Sex:</span><span class="detail-value">{{ formData.drugs_before_during_sex || 'N/A' }}</span></div>
              </div>

              <!-- Section 11: Experience & Suggestions -->
              <h4 class="details-section-title">SECTION 11: Experience & Suggestions</h4>
                <div class="detail-item"><span class="detail-label">Feeling Protected:</span><span class="detail-value">{{ formData.protection_feeling || 'N/A' }}</span></div>
                <div class="detail-item"><span class="detail-label">STI Concern:</span><span class="detail-value">{{ formData.sti_concern || 'N/A' }}</span></div>
                <div class="detail-item"><span class="detail-label">PrEP Package Opinion:</span><span class="detail-value">{{ formData.prep_package_opinion || 'N/A' }}</span></div>
                <div class="detail-item full-width"><span class="detail-label">Likes:</span><span class="detail-value list-value">{{ formatArrayValue(formData.participation_likes) }}<span v-if="formData.participation_likes.includes('Other')"> (Other: {{ formData.participation_likes_other }})</span></span></div>
                <div class="detail-item full-width"><span class="detail-label">Challenges:</span><span class="detail-value list-value">{{ formatArrayValue(formData.participation_challenges) }}<span v-if="formData.participation_challenges.includes('Other')"> (Other: {{ formData.participation_challenges_other }})</span></span></div>
                <div class="detail-item full-width"><span class="detail-label">Delivery Preference:</span><span class="detail-value list-value">{{ formatArrayValue(formData.delivery_preference) }}<span v-if="formData.delivery_preference.includes('Other methods')"> (Other: {{ formData.delivery_preference_other }})</span></span></div>
                <div class="detail-item"><span class="detail-label">Satisfaction:</span><span class="detail-value">{{ formData.satisfaction_level || 'N/A' }}</span></div>

               <!-- Section 12: Reason for Discontinuation -->
              <h4 class="details-section-title">SECTION 12: Reason for Discontinuation</h4>
               <div class="detail-item full-width"><span class="detail-label">Reasons:</span><span class="detail-value list-value">{{ formatArrayValue(formData.discontinuation_reasons) }}<span v-if="formData.discontinuation_reasons.includes('Other')"> (Other: {{ formData.discontinuation_other }})</span></span></div>


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
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  formData: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
  successMessage: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
});
const emit = defineEmits(['confirm', 'cancel']);

const sideEffects = [
    { key: 'nausea', label: 'Nausea' }, { key: 'vomiting', label: 'Vomiting' },
    { key: 'fatigue', label: 'Fatigue' }, { key: 'dizziness', label: 'Dizziness' },
    { key: 'headache', label: 'Headache' }, { key: 'rash', label: 'Rash' },
    { key: 'abdominal_pain', label: 'Abdominal Pain' }, { key: 'weight_loss', label: 'Weight Loss' },
    // 'no_response' and 'other_symptoms' handled separately
];

const formatArrayValue = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'None Selected';
  return arr.filter(item => item).join('; ');
};

// Helper function to format risk value
const formatRisk = (value) => {
    if (!value) return 'N/A';
    // Capitalize first letter and add score if it exists (e.g., "1 - very low" becomes "1 - Very low risk")
    const scoreMatch = value.match(/^(\d)\s*-\s*(.*)/);
    if (scoreMatch) {
        return `${scoreMatch[1]} - ${scoreMatch[2].charAt(0).toUpperCase() + scoreMatch[2].slice(1)} risk`;
    }
    // Handle values without explicit scores if necessary
    return value.charAt(0).toUpperCase() + value.slice(1) + " risk";
};


const emitConfirm = () => emit('confirm');
const emitCancel = () => { if (!props.isSubmitting) emit('cancel'); };
</script>

<style scoped>
/* Paste the ENHANCED MODAL CSS here */
/* (Same as Form4_ConfirmationModal.vue) */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.65); display: flex; justify-content: center; align-items: center; z-index: 1050; padding: 15px; transition: opacity 0.3s ease; }
.modal-content.enhanced-modal { background-color: #fff; border-radius: 8px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); width: 100%; max-width: 850px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; transform: scale(0.95); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; }
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
.details-subsection-title { font-size: 1rem; font-weight: 600; color: #555; margin-top: 15px; margin-bottom: 10px; padding-left: 0; border-left: none; grid-column: 1 / -1; }
.details-tertiary-title { font-size: 0.95rem; font-weight: 600; color: #666; margin-top: 10px; margin-bottom: 5px; grid-column: 1 / -1; font-style: italic; }
.symptom-group { padding: 5px 0; margin-bottom: 8px; display: contents; }
.symptom-group > h6 { grid-column: 1 / -1; margin-bottom: 0;}
.symptom-group > .detail-item .detail-label { padding-left: 15px; font-weight: normal; color: #666; font-size: 0.85rem;}
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

@media (max-width: 800px) {
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