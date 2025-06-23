<template>
  <!-- Clinical Data Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed to show modal -->
    <div class="container">
      <!-- Container 1: Basic Info & Acute HIV -->
      <div class="form-container">
        <!-- Participant UID and Date -->
        <label for="participant_uid">Participant UID:</label>
        <input
          type="text"
          v-model="formData.participant_uid"
          id="participant_uid"
          name="participant_uid"
          required
          pattern="[A-Za-z0-9]{5,}"
          title="Minimum 5 Alphanumeric characters only"
        />
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
        <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label for="dateInput">Date:</label>
        <input type="date" id="dateInput" v-model="formData.date" name="date" readonly />

        <!-- Type of Visit -->
        <label style="margin-top: 1rem;">TYPE OF VISIT: (Please tick a √ mark to indicate the visit)</label>
        <div class="radio-group-vertical" style="border: none; padding: 0; background: none;">
          <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="Screening Visit MO" required /> SCREENING VISIT MO</label>
          <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="End of M1" required /> END OF M1</label>
          <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="End of M3" required /> END OF M3</label>
          <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="End of M6" required /> END OF M6</label>
          <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="End of M9" required /> END OF M9</label>
          <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="Exit Visit M12" required /> EXIT VISIT M12</label>
        </div>

        <!-- Acute HIV Infection Section -->
        <h4 class="section-title">1. Acute HIV Infection</h4>
        <p>In the past 15 days, have you experienced any of the following? If yes, then indicate start date and whether it is ongoing or resolved.</p>

        <!-- Symptoms Table -->
        <div class="table-responsive">
          <table border="1" cellspacing="0" cellpadding="5" class="symptoms-table">
            <thead>
              <tr>
                <th>Symptoms</th>
                <th>Yes</th>
                <th>No</th>
                <th>If YES, Specify</th>
                <th>Start Date</th>
                <th>Ongoing</th>
                <th>Resolved</th>
                <th>Present on Exam</th>
              </tr>
            </thead>
            <tbody>
              <!-- Fever Row -->
              <tr>
                <td>Fever</td>
                <td><input type="radio" name="fever_status" v-model="formData.fever" value="Yes" /></td>
                <td><input type="radio" name="fever_status" v-model="formData.fever" value="No" /></td>
                <td><input type="text" v-model="formData.fever_specify" :disabled="formData.fever !== 'Yes'" /></td>
                <td><input type="date" v-model="formData.fever_start_date" :disabled="formData.fever !== 'Yes'" /></td>
                <td><input type="checkbox" v-model="formData.fever_ongoing" :disabled="formData.fever !== 'Yes' || formData.fever_resolved" @change="handleCheckboxChange('fever', 'ongoing')"/></td>
                <td><input type="checkbox" v-model="formData.fever_resolved" :disabled="formData.fever !== 'Yes' || formData.fever_ongoing" @change="handleCheckboxChange('fever', 'resolved')"/></td>
                <td><input type="checkbox" v-model="formData.fever_present" :disabled="formData.fever !== 'Yes'" /></td>
              </tr>
              <!-- Tiredness Row -->
               <tr>
                  <td>Tiredness</td>
                  <td><input type="radio" name="tiredness_status" v-model="formData.tiredness" value="Yes" /></td>
                  <td><input type="radio" name="tiredness_status" v-model="formData.tiredness" value="No" /></td>
                  <td><input type="text" v-model="formData.tiredness_specify" :disabled="formData.tiredness !== 'Yes'" /></td>
                  <td><input type="date" v-model="formData.tiredness_start_date" :disabled="formData.tiredness !== 'Yes'" /></td>
                  <td><input type="checkbox" v-model="formData.tiredness_ongoing" :disabled="formData.tiredness !== 'Yes' || formData.tiredness_resolved" @change="handleCheckboxChange('tiredness', 'ongoing')"/></td>
                  <td><input type="checkbox" v-model="formData.tiredness_resolved" :disabled="formData.tiredness !== 'Yes' || formData.tiredness_ongoing" @change="handleCheckboxChange('tiredness', 'resolved')"/></td>
                  <td><input type="checkbox" v-model="formData.tiredness_present" :disabled="formData.tiredness !== 'Yes'" /></td>
                </tr>
              <!-- Lymph Node Enlargement Row -->
               <tr>
                  <td>Lymph Node Enlargement</td>
                  <td><input type="radio" name="lymph_status" v-model="formData.lymph_node" value="Yes" /></td>
                  <td><input type="radio" name="lymph_status" v-model="formData.lymph_node" value="No" /></td>
                  <td><input type="text" v-model="formData.lymph_node_specify" :disabled="formData.lymph_node !== 'Yes'" /></td>
                  <td><input type="date" v-model="formData.lymph_node_start_date" :disabled="formData.lymph_node !== 'Yes'" /></td>
                  <td><input type="checkbox" v-model="formData.lymph_node_ongoing" :disabled="formData.lymph_node !== 'Yes' || formData.lymph_node_resolved" @change="handleCheckboxChange('lymph_node', 'ongoing')"/></td>
                  <td><input type="checkbox" v-model="formData.lymph_node_resolved" :disabled="formData.lymph_node !== 'Yes' || formData.lymph_node_ongoing" @change="handleCheckboxChange('lymph_node', 'resolved')"/></td>
                  <td><input type="checkbox" v-model="formData.lymph_node_present" :disabled="formData.lymph_node !== 'Yes'" /></td>
                </tr>
               <!-- Tonsilitis Row -->
                 <tr>
                    <td>Tonsilitis</td>
                    <td><input type="radio" name="tonsilitis_status" v-model="formData.tonsilitis" value="Yes" /></td>
                    <td><input type="radio" name="tonsilitis_status" v-model="formData.tonsilitis" value="No" /></td>
                    <td><input type="text" v-model="formData.tonsilitis_specify" :disabled="formData.tonsilitis !== 'Yes'" /></td>
                    <td><input type="date" v-model="formData.tonsilitis_start_date" :disabled="formData.tonsilitis !== 'Yes'" /></td>
                    <td><input type="checkbox" v-model="formData.tonsilitis_ongoing" :disabled="formData.tonsilitis !== 'Yes' || formData.tonsilitis_resolved" @change="handleCheckboxChange('tonsilitis', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.tonsilitis_resolved" :disabled="formData.tonsilitis !== 'Yes' || formData.tonsilitis_ongoing" @change="handleCheckboxChange('tonsilitis', 'resolved')"/></td>
                    <td><input type="checkbox" v-model="formData.tonsilitis_present" :disabled="formData.tonsilitis !== 'Yes'" /></td>
                  </tr>
               <!-- Sore Throat Row -->
                <tr>
                    <td>Sore Throat</td>
                    <td><input type="radio" name="sore_throat_status" v-model="formData.sore_throat" value="Yes" /></td>
                    <td><input type="radio" name="sore_throat_status" v-model="formData.sore_throat" value="No" /></td>
                    <td><input type="text" v-model="formData.sore_throat_specify" :disabled="formData.sore_throat !== 'Yes'" /></td>
                    <td><input type="date" v-model="formData.sore_throat_start_date" :disabled="formData.sore_throat !== 'Yes'" /></td>
                    <td><input type="checkbox" v-model="formData.sore_throat_ongoing" :disabled="formData.sore_throat !== 'Yes' || formData.sore_throat_resolved" @change="handleCheckboxChange('sore_throat', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.sore_throat_resolved" :disabled="formData.sore_throat !== 'Yes' || formData.sore_throat_ongoing" @change="handleCheckboxChange('sore_throat', 'resolved')"/></td>
                    <td><input type="checkbox" v-model="formData.sore_throat_present" :disabled="formData.sore_throat !== 'Yes'" /></td>
                  </tr>
                <!-- Joint/Muscle Aches Row -->
                 <tr>
                    <td>Joint and Muscle Aches</td>
                    <td><input type="radio" name="joint_aches_status" v-model="formData.joint_aches" value="Yes" /></td>
                    <td><input type="radio" name="joint_aches_status" v-model="formData.joint_aches" value="No" /></td>
                    <td><input type="text" v-model="formData.joint_aches_specify" :disabled="formData.joint_aches !== 'Yes'" /></td>
                    <td><input type="date" v-model="formData.joint_aches_start_date" :disabled="formData.joint_aches !== 'Yes'" /></td>
                    <td><input type="checkbox" v-model="formData.joint_aches_ongoing" :disabled="formData.joint_aches !== 'Yes' || formData.joint_aches_resolved" @change="handleCheckboxChange('joint_aches', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.joint_aches_resolved" :disabled="formData.joint_aches !== 'Yes' || formData.joint_aches_ongoing" @change="handleCheckboxChange('joint_aches', 'resolved')"/></td>
                    <td><input type="checkbox" v-model="formData.joint_aches_present" :disabled="formData.joint_aches !== 'Yes'" /></td>
                  </tr>
                 <!-- Diarrhoea Row -->
                  <tr>
                    <td>Diarrhoea</td>
                    <td><input type="radio" name="diarrhoea_status" v-model="formData.diarrhoea" value="Yes" /></td>
                    <td><input type="radio" name="diarrhoea_status" v-model="formData.diarrhoea" value="No" /></td>
                    <td><input type="text" v-model="formData.diarrhoea_specify" :disabled="formData.diarrhoea !== 'Yes'" /></td>
                    <td><input type="date" v-model="formData.diarrhoea_start_date" :disabled="formData.diarrhoea !== 'Yes'" /></td>
                    <td><input type="checkbox" v-model="formData.diarrhoea_ongoing" :disabled="formData.diarrhoea !== 'Yes' || formData.diarrhoea_resolved" @change="handleCheckboxChange('diarrhoea', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.diarrhoea_resolved" :disabled="formData.diarrhoea !== 'Yes' || formData.diarrhoea_ongoing" @change="handleCheckboxChange('diarrhoea', 'resolved')"/></td>
                    <td><input type="checkbox" v-model="formData.diarrhoea_present" :disabled="formData.diarrhoea !== 'Yes'" /></td>
                  </tr>
                <!-- Rash Row -->
                  <tr>
                    <td>Rash</td>
                    <td><input type="radio" name="rash_status" v-model="formData.rash" value="Yes" /></td>
                    <td><input type="radio" name="rash_status" v-model="formData.rash" value="No" /></td>
                    <td><input type="text" v-model="formData.rash_specify" :disabled="formData.rash !== 'Yes'" /></td>
                    <td><input type="date" v-model="formData.rash_start_date" :disabled="formData.rash !== 'Yes'" /></td>
                    <td><input type="checkbox" v-model="formData.rash_ongoing" :disabled="formData.rash !== 'Yes' || formData.rash_resolved" @change="handleCheckboxChange('rash', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.rash_resolved" :disabled="formData.rash !== 'Yes' || formData.rash_ongoing" @change="handleCheckboxChange('rash', 'resolved')"/></td>
                    <td><input type="checkbox" v-model="formData.rash_present" :disabled="formData.rash !== 'Yes'" /></td>
                  </tr>
                <!-- Other Symptoms Row -->
                <tr>
                    <td>Others (specify)</td>
                    <td><input type="radio" name="other_symptoms_status" v-model="formData.other_symptoms" value="Yes" /></td>
                    <td><input type="radio" name="other_symptoms_status" v-model="formData.other_symptoms" value="No" /></td>
                    <td><input type="text" v-model="formData.other_symptoms_specify" :disabled="formData.other_symptoms !== 'Yes'" /></td>
                    <td><input type="date" v-model="formData.other_symptoms_start_date" :disabled="formData.other_symptoms !== 'Yes'" /></td>
                    <td><input type="checkbox" v-model="formData.other_symptoms_ongoing" :disabled="formData.other_symptoms !== 'Yes' || formData.other_symptoms_resolved" @change="handleCheckboxChange('other_symptoms', 'ongoing')"/></td>
                    <td><input type="checkbox" v-model="formData.other_symptoms_resolved" :disabled="formData.other_symptoms !== 'Yes' || formData.other_symptoms_ongoing" @change="handleCheckboxChange('other_symptoms', 'resolved')"/></td>
                    <td><input type="checkbox" v-model="formData.other_symptoms_present" :disabled="formData.other_symptoms !== 'Yes'" /></td>
                  </tr>
            </tbody>
          </table>
        </div>

        <label style="margin-top: 1rem;">If yes to any of the items above, is there a report of a possible recent HIV exposure (e.g. condomless sex/injecting drug use) in the past 15 days?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.recent_hiv_exposure" name="recent_hiv_exposure" value="Yes" /> YES</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.recent_hiv_exposure" name="recent_hiv_exposure" value="No" /> NO</label>
        </div>

        <div v-if="formData.recent_hiv_exposure === 'Yes'">
          <label for="describe_exposure">If yes, describe:</label>
          <textarea v-model="formData.describe_exposure" id="describe_exposure" name="describe_exposure" rows="4" cols="50"></textarea>
        </div>
      </div>

      <!-- Container 2: Syndromic STI Management -->
      <div class="form-container">
        <h3 class="section-title">2. Syndromic STI Management</h3>
        <div class="table-responsive">
           <table border="1" cellspacing="0" cellpadding="5" class="symptoms-table">
             <thead>
               <tr>
                 <th>Symptoms</th>
                 <th>Yes</th>
                 <th>No</th>
                 <th>Start Date</th>
                 <th>If YES, Specify</th>
                 <th>Referred/Treatment Provided</th>
               </tr>
             </thead>
              <tbody>
                <!-- Vaginal/urethral Discharge -->
                <tr>
                  <td>Vaginal/urethral Discharge</td>
                  <td><input type="radio" name="vag_discharge_status" v-model="formData.vaginal_discharge" value="Yes" /></td>
                  <td><input type="radio" name="vag_discharge_status" v-model="formData.vaginal_discharge" value="No" /></td>
                  <td><input type="date" v-model="formData.vaginal_discharge_start_date" :disabled="formData.vaginal_discharge !== 'Yes'" /></td>
                  <td><input type="text" v-model="formData.vaginal_discharge_specify" :disabled="formData.vaginal_discharge !== 'Yes'" /></td>
                  <td><input type="text" v-model="formData.vaginal_discharge_treatment" :disabled="formData.vaginal_discharge !== 'Yes'" /></td>
                </tr>
                <!-- Lower Abdominal Pain -->
                 <tr>
                    <td>Lower Abdominal Pain</td>
                    <td><input type="radio" name="abdo_pain_status" v-model="formData.lower_abdominal_pain" value="Yes" /></td>
                    <td><input type="radio" name="abdo_pain_status" v-model="formData.lower_abdominal_pain" value="No" /></td>
                    <td><input type="date" v-model="formData.lower_abdominal_pain_start_date" :disabled="formData.lower_abdominal_pain !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.lower_abdominal_pain_specify" :disabled="formData.lower_abdominal_pain !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.lower_abdominal_pain_treatment" :disabled="formData.lower_abdominal_pain !== 'Yes'" /></td>
                  </tr>
                 <!-- Anorectal Discharge -->
                  <tr>
                    <td>Anorectal discharge</td>
                    <td><input type="radio" name="anorectal_discharge_status" v-model="formData.anorectal_discharge" value="Yes" /></td>
                    <td><input type="radio" name="anorectal_discharge_status" v-model="formData.anorectal_discharge" value="No" /></td>
                    <td><input type="date" v-model="formData.anorectal_discharge_start_date" :disabled="formData.anorectal_discharge !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.anorectal_discharge_specify" :disabled="formData.anorectal_discharge !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.anorectal_discharge_treatment" :disabled="formData.anorectal_discharge !== 'Yes'" /></td>
                  </tr>
                 <!-- Genital/anal sore/blister/warts -->
                   <tr>
                    <td>Genital/anal sore/blister/warts</td>
                    <td><input type="radio" name="genital_sore_status" v-model="formData.genital_sore" value="Yes" /></td>
                    <td><input type="radio" name="genital_sore_status" v-model="formData.genital_sore" value="No" /></td>
                    <td><input type="date" v-model="formData.genital_sore_start_date" :disabled="formData.genital_sore !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.genital_sore_specify" :disabled="formData.genital_sore !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.genital_sore_treatment" :disabled="formData.genital_sore !== 'Yes'" /></td>
                  </tr>
                <!-- Pain/burning with urination -->
                   <tr>
                    <td>Pain/burning with urination</td>
                    <td><input type="radio" name="urination_pain_status" v-model="formData.pain_with_urination" value="Yes" /></td>
                    <td><input type="radio" name="urination_pain_status" v-model="formData.pain_with_urination" value="No" /></td>
                    <td><input type="date" v-model="formData.pain_with_urination_start_date" :disabled="formData.pain_with_urination !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.pain_with_urination_specify" :disabled="formData.pain_with_urination !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.pain_with_urination_treatment" :disabled="formData.pain_with_urination !== 'Yes'" /></td>
                  </tr>
                <!-- Swelling in the groin -->
                   <tr>
                    <td>Swelling in the groin</td>
                    <td><input type="radio" name="groin_swelling_status" v-model="formData.swelling_in_groin" value="Yes" /></td>
                    <td><input type="radio" name="groin_swelling_status" v-model="formData.swelling_in_groin" value="No" /></td>
                    <td><input type="date" v-model="formData.swelling_in_groin_start_date" :disabled="formData.swelling_in_groin !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.swelling_in_groin_specify" :disabled="formData.swelling_in_groin !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.swelling_in_groin_treatment" :disabled="formData.swelling_in_groin !== 'Yes'" /></td>
                  </tr>
                 <!-- Rash -->
                  <tr>
                    <td>Rash</td>
                    <td><input type="radio" name="rash_data_status" v-model="formData.rash_data_resolved" value="Yes" /></td>
                    <td><input type="radio" name="rash_data_status" v-model="formData.rash_data_resolved" value="No" /></td>
                    <td><input type="date" v-model="formData.rash_data_resolved_start_date" :disabled="formData.rash_data_resolved !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.rash_data_resolved_specify" :disabled="formData.rash_data_resolved !== 'Yes'" /></td>
                    <td><input type="text" v-model="formData.rash_data_resolved_treatment" :disabled="formData.rash_data_resolved !== 'Yes'" /></td>
                  </tr>
                 <!-- Other Symptoms -->
                   <tr>
                      <td>Other (Specify)</td>
                      <td><input type="radio" name="oth_symptoms_status" v-model="formData.oth_symptoms" value="Yes" /></td>
                      <td><input type="radio" name="oth_symptoms_status" v-model="formData.oth_symptoms" value="No" /></td>
                      <td><input type="date" v-model="formData.oth_symptoms_start_date" :disabled="formData.oth_symptoms !== 'Yes'" /></td>
                      <td><input type="text" v-model="formData.oth_symptoms_specify" :disabled="formData.oth_symptoms !== 'Yes'" /></td>
                      <td><input type="text" v-model="formData.oth_symptoms_treatment" :disabled="formData.oth_symptoms !== 'Yes'" /></td>
                    </tr>
              </tbody>
           </table>
        </div>
      </div>

       <!-- Container 3: Clinical Findings -->
      <div class="form-container">
        <h3 class="section-title">3. Clinical Findings</h3>
         <div class="table-responsive">
            <table border="1" cellspacing="0" cellpadding="5" class="findings-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>If yes, specify</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Acute HIV</td>
                  <td><input type="text" v-model="formData.acute_hiv_specify" placeholder="Specify if yes" /></td>
                </tr>
                <tr>
                  <td>STI</td>
                  <td><input type="text" v-model="formData.sti_specify" placeholder="Specify if yes" /></td>
                </tr>
                <tr>
                  <td>Others (specify)</td>
                  <td><input type="text" v-model="formData.other_specify" placeholder="Specify if yes" /></td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>

      <!-- Container 4: Disease History & Meds -->
      <div class="form-container">
        <h3 class="section-title">4. Disease History and Medications</h3>

        <label>Do you currently have, or had in the past, any kidney disease, diabetes, hypertension, or thyroid problem?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.disease_history" name="disease_history" value="Yes" /> YES</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.disease_history" name="disease_history" value="No" /> NO</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.disease_history" name="disease_history" value="Not sure/Don’t know" /> Not sure/Don’t know</label>
        </div>

        <div v-if="formData.disease_history === 'Yes'">
          <label for="disease_specify">If yes, please specify the illness, dates, diagnosis, and treatments:<br />(Please note dates of illness/disease, date of diagnosis and conditions as well as any courses of treatment)</label>
          <textarea v-model="formData.disease_specify" id="disease_specify" rows="4" placeholder="Specify details..."></textarea>
        </div>

        <label>Are you currently on any medications, including traditional or alternative medications?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.current_medications" name="current_medications" value="Yes" /> YES</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.current_medications" name="current_medications" value="No" /> NO</label>
        </div>

        <div v-if="formData.current_medications === 'Yes'">
          <label for="medication_specify">If yes, please list the medications (Do not include medications prescribed at this visit):</label>
          <textarea v-model="formData.medication_specify" id="medication_specify" rows="3" placeholder="List current medications"></textarea>
        </div>

        <label>Are you allergic to any medications?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.medication_allergies" name="medication_allergies" value="Yes" /> YES</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.medication_allergies" name="medication_allergies" value="No" /> NO</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.medication_allergies" name="medication_allergies" value="Not sure/Don’t know" /> Not sure/Don’t know</label>
        </div>

        <div v-if="formData.medication_allergies === 'Yes'">
          <label for="allergy_specify">If yes, please indicate the name(s) of the medication(s) you're allergic to:</label>
          <textarea v-model="formData.allergy_specify" id="allergy_specify" rows="3" placeholder="Specify medication allergies"></textarea>
        </div>
      </div>

      <!-- Container 5: Test Results -->
      <div class="form-container">
        <h3 class="section-title">5. Test Results</h3>
        <div class="table-responsive">
           <table border="1" cellspacing="0" cellpadding="5" class="tests-table">
             <thead>
               <tr>
                 <th>Test</th>
                 <th>Date of Sample Drawn<br />(DD/MM/YYYY)</th>
               </tr>
             </thead>
             <tbody>
                <tr><td>HIV Rapid test (3rd generation RDT)</td><td><input type="date" v-model="formData.hiv_rapid_sample_date" /></td></tr>
                <tr><td>HIV 4th generation test</td><td><input type="date" v-model="formData.hiv_4th_sample_date" /></td></tr>
                <tr><td>Hepatitis B* (HBsAg)</td><td><input type="date" v-model="formData.hepatitis_b_sample_date" /></td></tr>
                <tr><td>Hepatitis C (Anti-HCV)</td><td><input type="date" v-model="formData.hepatitis_C_sample_date" /></td></tr>
                <tr><td>Syphilis</td><td><input type="date" v-model="formData.syphilis_sample_date" /></td></tr>
                <tr><td>Kidney function (serum Creatinine)**</td><td><input type="date" v-model="formData.kidney_function_sample_date" /></td></tr>
                <tr><td>Test for N. Gonorrhoea</td><td><input type="date" v-model="formData.gonorrhoea_sample_date" /></td></tr>
             </tbody>
           </table>
        </div>
        <p style="font-size: 0.9em; color: #555; margin-top: 0.5rem;">
          *For those who received HBV, HBsAg is not required.<br />
          **To calculate creatinine clearance (Cockcroft-Gault); recommended range: 0.6 - 1.2 mg/dl.
        </p>
      </div>

       <!-- Container 6: Assessment & Dispensing -->
      <div class="form-container">
        <h3 class="section-title">6. Assessment Notes and Dispensing</h3>
        <label for="assessment_notes"><strong>Assessment Notes:</strong> (Note overall assessment, suitability, side effects, medications prescribed, referrals)</label>
        <textarea v-model="formData.assessment_notes" id="assessment_notes" name="assessment_notes" rows="6"
          placeholder="Enter assessment details..."></textarea>

        <label>PrEP dispensed:</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.prep_dispensed" name="prep_dispensed" value="Yes" required /> YES
          </label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.prep_dispensed" name="prep_dispensed" value="No" required /> NO
          </label>
        </div>

        <div v-if="formData.prep_dispensed === 'Yes'">
          <label for="prep_bottles">If YES, mention the number of bottles:</label>
          <input type="number" v-model.number="formData.prep_bottles" id="prep_bottles" name="prep_bottles" min="1" placeholder="Enter number" />
        </div>

        <label for="clinician_information_date">Date:</label>
        <input type="date" v-model="formData.clinician_information_date" id="clinician_information_date" name="clinician_information_date" required />

        <label for="clinician_name">Clinician Name:</label>
        <input type="text" v-model="formData.clinician_name" id="clinician_name" name="clinician_name" readonly />

        <label for="clinician_designation">Designation:</label>
        <input type="text" v-model="formData.designation" id="clinician_designation" name="designation" readonly />

        <label for="bhmc_registration">BHMC Registration:</label>
        <input type="text" v-model="formData.bhmc_registration" id="bhmc_registration" name="bhmc_registration" readonly />
      </div>

      <!-- Submit Button outside the last container -->
      <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Review Data' }}
      </button>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form3_ConfirmationModal v-if="isReviewModalVisible" 
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
     <div v-if="successMessage && !finalSubmitMessage" class="success-message  mt-2">
       <p>{{ successMessage }}</p>
     </div>
     <div v-if="errorMessage && !finalSubmitMessage" class="error-message">
       <p>{{ errorMessage }}</p>
     </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
// Import the NEW modal component
import Form3_ConfirmationModal from './Form3_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTRBjdyQBUxWvo6HDNNSbhVLAXjkHMK8_gG1uLMce3jfONVrUQ5frhY1RqUmvRfJngIg/exec'; // Replace with Form 3 Script URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?gid=0&single=true&output=csv"; // UID validation source
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  participant_uid: '', date: '', visit_type: '',
  // Acute HIV Symptoms (initialize booleans to false)
  fever: '', fever_specify: '', fever_start_date: '', fever_ongoing: false, fever_resolved: false, fever_present: false,
  tiredness: '', tiredness_specify: '', tiredness_start_date: '', tiredness_ongoing: false, tiredness_resolved: false, tiredness_present: false,
  lymph_node: '', lymph_node_specify: '', lymph_node_start_date: '', lymph_node_ongoing: false, lymph_node_resolved: false, lymph_node_present: false,
  tonsilitis: '', tonsilitis_specify: '', tonsilitis_start_date: '', tonsilitis_ongoing: false, tonsilitis_resolved: false, tonsilitis_present: false,
  sore_throat: '', sore_throat_specify: '', sore_throat_start_date: '', sore_throat_ongoing: false, sore_throat_resolved: false, sore_throat_present: false,
  joint_aches: '', joint_aches_specify: '', joint_aches_start_date: '', joint_aches_ongoing: false, joint_aches_resolved: false, joint_aches_present: false,
  diarrhoea: '', diarrhoea_specify: '', diarrhoea_start_date: '', diarrhoea_ongoing: false, diarrhoea_resolved: false, diarrhoea_present: false,
  rash: '', rash_specify: '', rash_start_date: '', rash_ongoing: false, rash_resolved: false, rash_present: false,
  other_symptoms: '', other_symptoms_specify: '', other_symptoms_start_date: '', other_symptoms_ongoing: false, other_symptoms_resolved: false, other_symptoms_present: false,
  recent_hiv_exposure: '', describe_exposure: '',
  // Syndromic STI
  vaginal_discharge: '', vaginal_discharge_start_date: '', vaginal_discharge_specify: '', vaginal_discharge_treatment: '',
  lower_abdominal_pain: '', lower_abdominal_pain_start_date: '', lower_abdominal_pain_specify: '', lower_abdominal_pain_treatment: '',
  anorectal_discharge: '', anorectal_discharge_start_date: '', anorectal_discharge_specify: '', anorectal_discharge_treatment: '',
  genital_sore: '', genital_sore_start_date: '', genital_sore_specify: '', genital_sore_treatment: '',
  pain_with_urination: '', pain_with_urination_start_date: '', pain_with_urination_specify: '', pain_with_urination_treatment: '',
  swelling_in_groin: '', swelling_in_groin_start_date: '', swelling_in_groin_specify: '', swelling_in_groin_treatment: '',
  rash_data_resolved: '', rash_data_resolved_start_date: '', rash_data_resolved_specify: '', rash_data_resolved_treatment: '',
  oth_symptoms: '', oth_symptoms_start_date: '', oth_symptoms_specify: '', oth_symptoms_treatment: '',
  // Clinical Findings
  acute_hiv_specify: '', sti_specify: '', other_specify: '',
  // Disease History & Meds
  disease_history: '', disease_specify: '', current_medications: '', medication_specify: '', medication_allergies: '', allergy_specify: '',
  // Test Results
  hiv_rapid_sample_date: '', hiv_4th_sample_date: '', hepatitis_b_sample_date: '', hepatitis_C_sample_date: '',
  syphilis_sample_date: '', kidney_function_sample_date: '', gonorrhoea_sample_date: '',
  // Assessment & Dispensing
  assessment_notes: '', prep_dispensed: '', prep_bottles: null, // Use null for number
  clinician_information_date: '', clinician_name: '', designation: '', bhmc_registration: ''
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
        console.log("CSV Data Loaded for Form 3");
        statusMessage.value = 'Validation data loaded. Please enter UID.';
        if(formData.value.participant_uid) validateUidOnInput(formData.value.participant_uid);
        else submitDisabled.value = true;
      } catch (error) {
        console.error('Error fetching CSV data for Form 3:', error);
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
  isSubmitting.value = true;
  modalSuccessMessage.value = '';
  modalErrorMessage.value = '';
  clearFinalMessage();

  const url = GOOGLE_SCRIPT_URL;
  try {
    const dataToSend = { ...formData.value };
    Object.keys(dataToSend).forEach(key => {
      if (typeof dataToSend[key] === 'boolean') dataToSend[key] = dataToSend[key] ? 'Yes' : 'No';
    });
    if (dataToSend.prep_dispensed === 'No') dataToSend.prep_bottles = '';

    const formDataSerialized = new URLSearchParams(dataToSend).toString();

    const response = await axios.post(url, formDataSerialized, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.status === 200 && response.data && response.data.status === 'success') {
      modalSuccessMessage.value = response.data.message || 'Form submitted successfully!';
      setTimeout(() => {
        isReviewModalVisible.value = false;
        setFinalMessage(response.data.message || 'Form submitted successfully!', 'success');
        clearForm(); // Clear form data after successful submission
        statusMessage.value = '';
        statusClass.value = '';
        submitDisabled.value = true;
        modalSuccessMessage.value = '';
      }, SUBMIT_SUCCESS_DELAY);
    } else {
      modalErrorMessage.value = response.data.message || 'Submission failed.';
    }
  } catch (error) {
    console.error('Form Submit Error:', error);
    let detailedError = 'Error submitting the form.';
    if (error.response) detailedError += ` (Status: ${error.response.status})`;
    else if (error.request) detailedError += ' (No response)';
    else detailedError += ` (${error.message})`;
    modalErrorMessage.value = detailedError;
  } finally {
    isSubmitting.value = false;
  }
};

// Ongoing/Resolved Checkbox Handler
const handleCheckboxChange = (symptom, type) => {
    const ongoingKey = `${symptom}_ongoing`; const resolvedKey = `${symptom}_resolved`;
    if (type === 'ongoing' && formData.value[ongoingKey]) formData.value[resolvedKey] = false;
    else if (type === 'resolved' && formData.value[resolvedKey]) formData.value[ongoingKey] = false;
};

// Clear Form
const clearForm = () => {
  const clinicianDetails = {
    clinician_name: formData.value.clinician_name,
    designation: formData.value.designation,
    bhmc_registration: formData.value.bhmc_registration,
  };

  Object.keys(formData.value).forEach(key => {
    if (key in clinicianDetails || key === 'date') return;
    if (Array.isArray(formData.value[key])) formData.value[key] = [];
    else if (typeof formData.value[key] === 'boolean') formData.value[key] = false;
    else if (typeof formData.value[key] === 'number') formData.value[key] = null;
    else formData.value[key] = '';
  });

  Object.assign(formData.value, clinicianDetails);
  initializeDate();
  statusMessage.value = '';
  statusClass.value = '';
  submitDisabled.value = true;
  clearFinalMessage();
  successMessage.value = '';
  errorMessage.value = '';
};

// Logged In User
const getLoggedInUser = () => { /* ... same as before ... */
     try { const user = localStorage.getItem('loggedInUser'); return user ? JSON.parse(user) : null; }
     catch (e) { console.error("Error parsing loggedInUser", e); return null; }
};

// Final Message Utils
function setFinalMessage(message, type) {
  finalSubmitMessage.value = message;
  finalSubmitClass.value = type === 'success' ? 'success-final' : 'error-final';
}
function clearFinalMessage() { finalSubmitMessage.value = ''; finalSubmitClass.value = ''; }

// onMounted
onMounted(() => {
  initializeDate(); fetchCsvData();
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    formData.value.clinician_name = loggedInUser.fullname || '';
    formData.value.designation = loggedInUser.designation || '';
    formData.value.bhmc_registration = loggedInUser.bhcno || '';
  } else {
      console.warn("Form 3: Logged in user details not found.");
       formData.value.clinician_name = ''; formData.value.designation = ''; formData.value.bhmc_registration = '';
  }
});
</script>

<style>
/* Keep the original Form 3 styles */
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
td input[type="text"], td input[type="date"] { width: 95%; padding: 0.3rem 0.4rem; margin-bottom: 0; font-size: 0.9rem; }
.success-message { color: green; text-align: center; font-weight: bold; margin-top: 15px; }
.error-message { color: red; text-align: center; font-weight: bold; margin-top: 15px; }
.submitting-indicator { margin-top: 20px; text-align: center; font-size: 1.2rem; color: #3498db; }
.final-message { max-width: 700px; margin: 20px auto; padding: 15px 20px; border-radius: 5px; text-align: center; font-weight: 500; }
.final-message.success-final { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.final-message.error-final { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
</style>
