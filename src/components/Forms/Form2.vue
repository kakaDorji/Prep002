<template>

<!-- Baseline form -->
  <!-- Main Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed to show modal -->
    <div class="container">
      <!-- Container 1: Interviewer Info, Consent -->
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


        <!-- PrEP Site -->
        <label for="prep_site">PrEP Site</label>
        <select v-model="formData.prep_site" id="prep_site" name="prep_site" required>
          <option value="CHD/JDWNRH/Thimphu">CHD/JDWNRH/Thimphu</option>
          <option value="HISC/Thimphu">HISC/Thimphu</option>
          <option value="Paro Hospital/Paro">Paro Hospital/Paro</option>
          <option value="Phuntsholing Hospital/Chukha">Phuntsholing Hospital/Chukha</option>
          <option value="CRRH/Gelephu/Sarpang">CRRH/Gelephu/Sarpang</option>
        </select>
        <!-- Date -->
        <label for="dateInput">Date:</label>
        <input type="date" v-model="formData.date" id="dateInput" name="date" readonly />

        <!-- Consent Text -->
        <p style="margin-top: 1rem; font-style: italic; color: #555; line-height: 1.5;">
          “My name is {{ formData.interviewer_name || '[Interviewer Name]' }}. I am working as {{ formData.designation || '[Designation]' }} and I am associated with the Phased Implementation of PrEP in {{ formData.prep_site || '[Selected Site]' }}.
          <br> As part of the Phased Implementation of PrEP in {{ formData.prep_site || '[Selected Site]' }}, I will be asking you some very personal questions regarding your daily schedule and sexual habits, networks, etc. I would like to inform you that some people may find it difficult to answer. Please be assured that all of your answers and personal details are completely confidential. Your name will not be written on this form and will never be used in connection with any of the information you share with us. You do not have to answer any questions that you do not want to answer, and you may end this interview at any time you want to. However, your honest answers to these questions will help us better understand what people think, say and do about certain kinds of behaviors. We would greatly appreciate your help in responding to this survey. The interview will take about 20-30 minutes to ask the questions. Would you be willing to participate?”
          <br><br>If “NO”, terminate the interview. If “YES, read out the form and get the respondent’s signature on the form to be filled and shared with the supervisor and continue with the interview.
        </p>

        <!-- Interviewer's Name -->
        <label for="interviewer_name">Interviewer’s Name:</label>
        <input type="text" v-model="formData.interviewer_name" id="interviewer_name" name="interviewer_name" readonly />

        <!-- Designation -->
        <label for="designation">Designation:</label>
        <input type="text" v-model="formData.designation" id="designation" name="designation" readonly /><br />

        <!-- Status of the Interview -->
        <label for="interview_status">Status of the Interview:</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.interview_status" id="progress" name="interview_status" value="Progress" required /> Progress
          </label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;">
            <input type="radio" v-model="formData.interview_status" id="terminate" name="interview_status" value="Terminate" required /> Terminate
          </label>
        </div>
      </div>

      <!-- Container 2: Socio-Demographics -->
      <div class="form-container">
        <h3 class="section-title">SECTION 1: SOCIO-DEMOGRAPHIC QUESTIONS</h3>

        <!-- 1.1 Year of Birth and Age -->
        <label for="birth_year">1.1 Year of Birth:</label>
        <input type="number" v-model.number="formData.birth_year" id="birth_year" name="birth_year"
        required min="1900" :max="new Date().getFullYear()" placeholder="Enter 4-digit year" />

        <label for="age">Age (completed years):</label>
        <input type="number" v-model.number="formData.age" id="age" name="age" required min="15"/>

        <!-- 1.2 Permanent Resident in Bhutan -->
        <label>1.2 Do you live in Bhutan permanently?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.permanent_bhutan" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.permanent_bhutan" value="No" required /> No</label>
        </div>

        <!-- 1.3 Current Occupation Status -->
        <label>1.3 Current occupation status?</label>
        <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.occupation" name="occupation" value="None" required /> None</label>
            <label><input type="radio" v-model="formData.occupation" name="occupation" value="Student" required /> Student</label>
            <label><input type="radio" v-model="formData.occupation" name="occupation" value="Fulltime job" required /> Fulltime job (Government / Private / NGO/ CSO)</label>
            <label><input type="radio" v-model="formData.occupation" name="occupation" value="Parttime job" required /> Part-time job</label>
            <label><input type="radio" v-model="formData.occupation" name="occupation" value="Other" required /> Other</label>
            <!-- Input field to specify occupation -->
            <input type="text" v-if="formData.occupation === 'Other'" v-model="formData.occupation_specify" id="occupation_specify" name="occupation_specify" placeholder="Please specify your occupation" />
            <label><input type="radio" v-model="formData.occupation" name="occupation" value="No response" required /> No response</label>
        </div>

        <!-- 1.4 Education Status -->
        <label>1.4 Education status?</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.education" name="education" value="None" required /> None</label>
            <label><input type="radio" v-model="formData.education" name="education" value="Primary School" required /> Primary School (till Class 6)</label>
            <label><input type="radio" v-model="formData.education" name="education" value="Lower Secondary" required /> Lower Secondary (till Class 8)</label>
            <label><input type="radio" v-model="formData.education" name="education" value="Middle Secondary" required /> Middle Secondary School (till Class 10)</label>
            <label><input type="radio" v-model="formData.education" name="education" value="Higher Secondary" required /> Higher Secondary School (till Class 12)</label>
            <label><input type="radio" v-model="formData.education" name="education" value="Vocational School or College" required /> Vocational School/College</label>
            <label><input type="radio" v-model="formData.education" name="education" value="University" required /> University (Bachelor’s Degree and above)</label>
            <label><input type="radio" v-model="formData.education" name="education" value="No response" required /> No response</label>
        </div>

        <!-- 1.5 Marital Status -->
        <label>1.5 What is your current marital status?</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Never married" required /> Never married</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Currently married" required /> Currently married</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Widowed" required /> Widowed</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Divorced" required /> Divorced</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Separated" required /> Separated</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Other" required /> Other</label>
            <!-- Input field to specify marital status -->
            <input type="text" v-if="formData.marital_status === 'Other'" v-model="formData.marital_specify" id="marital_specify" name="marital_specify" placeholder="Please specify your marital status" />
         </div>

        <!-- 1.6 Living with Sex Partner -->
        <label>1.6 Do you currently live with your sex partner?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.living_with_partner" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.living_with_partner" value="No" required /> No</label>
        </div>

        <!-- 1.7 Sex Partner's Gender -->
        <label>1.7 If so, is your sex partner male, female, or TG? (tick all that apply)</label>
         <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.partner_gender" value="Male" /> Male</label>
            <label><input type="checkbox" v-model="formData.partner_gender" value="Female" /> Female</label>
            <label><input type="checkbox" v-model="formData.partner_gender" value="Transgender" /> Transgender</label>
        </div>

        <!-- 1.8 Sexual Orientation -->
        <label>1.8 How do you classify your sexual orientation?</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.sexual_orientation" name="sexual_orientation" value="Gay/homosexual" required /> Gay/homosexual</label>
            <label><input type="radio" v-model="formData.sexual_orientation" name="sexual_orientation" value="Bisexual" required /> Bisexual</label>
            <label><input type="radio" v-model="formData.sexual_orientation" name="sexual_orientation" value="Heterosexual" required /> Heterosexual</label>
            <label><input type="radio" v-model="formData.sexual_orientation" name="sexual_orientation" value="Other" required /> Other</label>
            <!-- Input field to specify sexual orientation -->
            <input type="text" v-if="formData.sexual_orientation === 'Other'" v-model="formData.orientation_specify" id="orientation_specify" name="orientation_specify" placeholder="Please specify your sexual orientation"/>
        </div>
      </div>

      <!-- Container 3: Risk Perception -->
       <div class="form-container">
          <h3 class="section-title">SECTION 2: RISK PERCEPTION</h3>

          <label>2.1 In general, to what extent do you consider yourself at risk of getting HIV?</label>
          <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="Very Low Risk" required /> 1 - Very Low Risk</label>
             <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="Low Risk" required /> 2 - Low Risk</label>
             <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="Medium Risk" required /> 3 - Medium Risk</label>
             <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="High Risk" required /> 4 - High Risk</label>
             <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="Very High Risk" required /> 5 - Very High Risk</label>
          </div>

          <label>2.2 In general, to what extent do you consider yourself at risk of getting STI?</label>
           <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="Very Low Risk" required /> 1 - Very Low Risk</label>
             <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="Low Risk" required /> 2 - Low Risk</label>
             <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="Medium Risk" required /> 3 - Medium Risk</label>
             <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="High Risk" required /> 4 - High Risk</label>
             <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="Very High Risk" required /> 5 - Very High Risk</label>
          </div>

          <label>2.3 In general, how do you manage your risk of getting HIV?</label>
          <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="Ask partner to use condom" required /> I frequently ask my partner/client to use a condom during sex</label>
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="Use condom" required /> I frequently use condoms</label>
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="Choose HIV negative partner" required /> I choose partner based on their HIV negative status</label>
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="Seek partner on HIV treatment" required /> I seek partners who I know are on HIV treatment</label>
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="Be top when unsure" required /> I try to be top if I’m not sure about my partner’s HIV status</label>
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="No strategy" required /> I don’t use any risk reduction strategy</label>
             <label><input type="radio" v-model="formData.hiv_management" name="hiv_management" value="Other" required /> Other</label>
             <input type="text" v-if="formData.hiv_management === 'Other'" v-model="formData.other_hiv_management_specify" name="other_hiv_management_specify" placeholder="Please specify your strategy" />
          </div>

          <label>2.4 Do you know the HIV status of your partner (male, female, TGW)? Will you share with us?</label>
           <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="No" required /> No, I do not know the HIV status of my partner</label>
             <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="Not HIV positive" required /> Yes, my partner is NOT HIV positive</label>
             <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="Positive and on ART" required /> Yes, my partner is HIV positive and on ART</label>
             <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="Positive but not on ART" required /> Yes, my partner is HIV positive BUT NOT on ART</label>
             <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="No response" required /> No response</label>
          </div>
       </div>

      <!-- Container 4: Sexual Behavior -->
       <div class="form-container">
         <h3 class="section-title">SECTION 3: SEXUAL BEHAVIOR</h3>

         <label>3.1 Do you have Steady partners?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.steady_partners" value="Yes" required /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.steady_partners" value="No" required /> No (IF NO Skip all questions on STEADY Partners)</label>
         </div>

         <label>3.2 Do you have Casual partners?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.casual_partners" value="Yes" required /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.casual_partners" value="No" required /> No (IF NO skip all questions on CASUAL PARTNERS)</label>
         </div>

         <label>3.3 Do you have Transactional partners?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.transactional_partners" value="Yes" required /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.transactional_partners" value="No" required /> No (IF NO SKIP ALL questions on TRANSACTIONAL Partners)</label>
         </div>

         <label>3.4 Can you tell the number of various partners you had anal sex with in the last three months?</label>
         <div v-if="formData.steady_partners === 'Yes'" class="partner-count">
           <label for="steady_anal">Steady partners:</label>
           <input type="number" v-model.number="formData.steady_anal_partners" id="steady_anal" min="0" />
         </div>
         <div v-if="formData.casual_partners === 'Yes'" class="partner-count">
           <label for="casual_anal">Casual Partners:</label>
           <input type="number" v-model.number="formData.casual_anal_partners" id="casual_anal" min="0" />
         </div>
         <div v-if="formData.transactional_partners === 'Yes'" class="partner-count">
           <label for="transactional_anal">Transactional partners:</label>
           <input type="number" v-model.number="formData.transactional_anal_partners" id="transactional_anal" min="0" />
         </div>
         <div class="radio-group-vertical" style="margin-top: 10px;">
             <label><input type="radio" v-model="formData.anal_sex" name="anal_sex_status" value="No anal sex" :disabled="formData.steady_anal_partners > 0 || formData.casual_anal_partners > 0 || formData.transactional_anal_partners > 0" required/> I never have anal sex </label>
             <label><input type="radio" v-model="formData.anal_sex" name="anal_sex_status" value="No response" :disabled="formData.steady_anal_partners > 0 || formData.casual_anal_partners > 0 || formData.transactional_anal_partners > 0" required/> No Response </label>
         </div>


         <label>3.5 Can you tell the number of various partners you had vaginal sex with in the last three months?</label>
         <div v-if="formData.steady_partners === 'Yes'" class="partner-count">
           <label for="steady_vaginal">Steady partners:</label>
           <input type="number" v-model.number="formData.steady_vaginal_partners" id="steady_vaginal" min="0" />
         </div>
         <div v-if="formData.casual_partners === 'Yes'" class="partner-count">
           <label for="casual_vaginal">Casual Partners:</label>
           <input type="number" v-model.number="formData.casual_vaginal_partners" id="casual_vaginal" min="0" />
         </div>
         <div v-if="formData.transactional_partners === 'Yes'" class="partner-count">
           <label for="transactional_vaginal">Transactional partners:</label>
           <input type="number" v-model.number="formData.transactional_vaginal_partners" id="transactional_vaginal" min="0" />
         </div>
          <div class="radio-group-vertical" style="margin-top: 10px;">
              <label><input type="radio" v-model="formData.vaginal_sex" name="vaginal_sex_status" value="No vaginal sex" :disabled="formData.steady_vaginal_partners > 0 || formData.casual_vaginal_partners > 0 || formData.transactional_vaginal_partners > 0" required /> I never have vaginal sex</label>
              <label><input type="radio" v-model="formData.vaginal_sex" name="vaginal_sex_status" value="No response" :disabled="formData.steady_vaginal_partners > 0 || formData.casual_vaginal_partners > 0 || formData.transactional_vaginal_partners > 0" required /> No Response</label>
         </div>
      </div>

      <!-- Container 5: Sex with Women Partners -->
       <div class="form-container">
         <h3 class="section-title">SECTION 4: SEX WITH WOMEN PARTNERS</h3>

         <label>4.1 Have you ever had penetrative vaginal or anal sex?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.ever_had_sex" value="Yes" required /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.ever_had_sex" value="No" required /> No (If No, skip Q4.2, Q4.3)</label>
         </div>

         <div v-if="formData.ever_had_sex === 'Yes'" style="margin-top: 20px">
           <label>4.2 Did you have vaginal or anal sex in the last 6 months?</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.sex_last_six_months" value="Yes" required /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.sex_last_six_months" value="No" required /> No</label>
           </div>

           <label>4.3 How often did you use a condom during the last vaginal or anal sex?</label>
           <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.condom_frequency" name="condom_frequency" value="Always" required /> Always (100%)</label>
              <label><input type="radio" v-model="formData.condom_frequency" name="condom_frequency" value="Most of the time" required /> Most of the time (75%)</label>
              <label><input type="radio" v-model="formData.condom_frequency" name="condom_frequency" value="About half the time" required /> About half the time (50%)</label>
              <label><input type="radio" v-model="formData.condom_frequency" name="condom_frequency" value="Sometimes" required /> Sometimes (25%)</label>
              <label><input type="radio" v-model="formData.condom_frequency" name="condom_frequency" value="Rarely" required /> Rarely (below 10%)</label>
              <label><input type="radio" v-model="formData.condom_frequency" name="condom_frequency" value="Never" required /> Never</label>
            </div>
         </div>
      </div>

      <!-- Container 6: Condom and Lubricant Use -->
       <div class="form-container">
         <h3 class="section-title">SECTION 5: CONDOM AND LUBRICANT USE</h3>

         <label>5.1 In the last one week, how often did you use a condom with your steady partner/s?</label>
         <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="Always" required /> Always (100%)</label>
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="Most of the time" required /> Most of the time (75%)</label>
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="About half the time" required /> About half the time (50%)</label>
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="Sometimes" required /> Sometimes (25%)</label>
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="Rarely" required /> Rarely (below 10%)</label>
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="Never" required /> Never</label>
             <label><input type="radio" v-model="formData.steady_condom_use" name="steady_condom_use" value="No sex last week" required /> I did not have sex with my steady partner last week.</label>
         </div>

         <label>5.2 In the last one week, how often did you use a condom with your Casual partner/s?</label>
          <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="Always" required /> Always (100%)</label>
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="Most of the time" required /> Most of the time (75%)</label>
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="About half the time" required /> About half the time (50%)</label>
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="Sometimes" required /> Sometimes (25%)</label>
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="Rarely" required /> Rarely (below 10%)</label>
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="Never" required /> Never</label>
             <label><input type="radio" v-model="formData.casual_condom_use" name="casual_condom_use" value="No sex last week" required /> I did not have sex with a casual partner last week.</label>
          </div>

         <label>5.3 In the last one week, how often did you use a condom with your Transactional partner/s?</label>
           <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="Always" required /> Always (100%)</label>
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="Most of the time" required /> Most of the time (75%)</label>
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="About half the time" required /> About half the time (50%)</label>
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="Sometimes" required /> Sometimes (25%)</label>
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="Rarely" required /> Rarely (below 10%)</label>
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="Never" required /> Never</label>
             <label><input type="radio" v-model="formData.transactional_condom_use" name="transactional_condom_use" value="No sex last week" required /> I did not have sex with a transactional partner last week.</label>
           </div>

         <label>5.4 In the last sex act with your steady partner, did you use a condom?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.steady_last_condom" value="YES" required /> YES</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.steady_last_condom" value="NO" required /> NO</label>
         </div>

         <label>5.5 In the last sex act with your Casual partner, did you use a condom?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.casual_last_condom" value="YES" required /> YES</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.casual_last_condom" value="NO" required /> NO</label>
         </div>

         <label>5.6 In the last sex act with your Transactional partner, did you use a condom?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.transactional_last_condom" value="YES" required /> YES</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.transactional_last_condom" value="NO" required /> NO</label>
         </div>

         <label>5.7 What were your reasons for having condomless sex? (You may select multiple answers)</label>
          <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Sex feels better without condom" /> I do not think sex feels good with a condom</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Partner thinks sex feels better" /> My partner does not think sex feels good with a condom</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Forget to use" /> I forget to use</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="No condoms available" /> I did not have or find any condoms.</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="No time to buy" /> There was no time to buy one</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="No time to put on" /> There was no time to put one on</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Know partner's status" /> I know the HIV status of my partner/Client</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Too expensive" /> I find it expensive</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Embarrassed to buy" /> I am embarrassed to buy or ask for condoms</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Using other methods" /> I use other methods to prevent HIV/STIs</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Do not trust condoms" /> I do not trust condoms</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Trust my partner" /> I trust my partner</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Was drunk" /> I was drunk</label>
            <label><input type="checkbox" v-model="formData.condomless_reasons" value="Other reasons" /> Other reasons, specify</label>
            <!-- Input for specifying 'Other reasons' -->
            <input type="text" v-if="formData.condomless_reasons.includes('Other reasons')" v-model="formData.other_condomless_reasons" placeholder="Please specify other reasons" />
         </div>

         <h3 class="section-title">LUBRICANT USE</h3>

         <label>5.8 Have you ever used gel or water-based lubricant during anal sex?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.lubricant_used" name="lubricant_used" value="Yes" /> Yes</label>
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.lubricant_used" name="lubricant_used" value="No" /> No (If NO Skip 5.9, 5.10)</label>
         </div>

         <div v-if="formData.lubricant_used === 'Yes'">
           <label>5.9 How often did you use gel or water-based lubricants for anal sex during the last 3 months?</label>
           <div class="radio-group-vertical">
                <label><input type="radio" v-model="formData.lubricant_frequency" name="lubricant_frequency" value="Always" /> Always (100%)</label>
                <label><input type="radio" v-model="formData.lubricant_frequency" name="lubricant_frequency" value="Most of the time" /> Most of the time (75%)</label>
                <label><input type="radio" v-model="formData.lubricant_frequency" name="lubricant_frequency" value="About half the time" /> About half the time (50%)</label>
                <label><input type="radio" v-model="formData.lubricant_frequency" name="lubricant_frequency" value="Sometimes" /> Sometimes (25%)</label>
                <label><input type="radio" v-model="formData.lubricant_frequency" name="lubricant_frequency" value="Rarely" /> Rarely (below 10%)</label>
                <label><input type="radio" v-model="formData.lubricant_frequency" name="lubricant_frequency" value="Never" /> Never</label>
           </div>

           <label>5.10 Why do you not always use gel or water-based lubricants for anal sex? (Multiple answers may be possible)</label>
            <div class="checkbox-group-vertical">
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Do not find it necessary" /> Do not find it necessary</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Partner refused" /> My partner refused</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="No lubricant available" /> I did not have gel or water-based lubricants at that time.</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Not easily available" /> Gel or water-based lubricants are not easily available.</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Expensive" /> Gel or water-based lubricants are expensive</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Prefer other lubricants" /> I prefer to use other types of lubricants.</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Prefer other products" /> I prefer to use other products to improve penetration.</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="No response" /> No response.</label>
                <label><input type="checkbox" v-model="formData.lubricant_use_reasons" value="Other reasons" /> Others reason, specify</label>
                <!-- Input for 'Other' lubricant reasons -->
                <input type="text" v-if="formData.lubricant_use_reasons.includes('Other reasons')" v-model="formData.other_lubricant_reasons" placeholder="Please specify other reasons" />
            </div>
         </div>
      </div>

     <!-- Container 7: Program Exposure, STI, HIV Test -->
      <div class="form-container">
         <h3 class="section-title">SECTION 6: PROGRAM EXPOSURE, STI, and HIV TEST</h3>

         <label>6.1 In the past 12 months, have you met outreach workers from HISC/Pride Bhutan?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.outreach_workers" name="outreach_workers" value="Yes" /> Yes</label>
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.outreach_workers" name="outreach_workers" value="No" /> No (If NO skip all the questions from 6.1a till 6.1.g)</label>
         </div>

         <div v-if="formData.outreach_workers === 'Yes'" class="conditional-section">
           <label>6.1.a They spoke to me about HIV prevention</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hiv_prevention" value="Yes" /> Yes</label>
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hiv_prevention" value="No" /> No</label>
            </div>

           <label>6.1.b They took me for HIV testing</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hiv_testing" value="Yes" /> Yes</label>
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hiv_testing" value="No" /> No</label>
            </div>

           <label>6.1.c They spoke to me about STI</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.sti_discussion" value="Yes" /> Yes</label>
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.sti_discussion" value="No" /> No</label>
           </div>

           <label>6.1.d They gave me condoms/lubricants</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.condoms_lubricants" value="Yes" /> Yes</label>
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.condoms_lubricants" value="No" /> No</label>
           </div>

           <label>6.1.e They spoke to me about PrEP</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_discussion" value="Yes" /> Yes</label>
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_discussion" value="No" /> No</label>
           </div>

           <label>6.1.f They asked me about my general wellbeing.</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.general_wellbeing" value="Yes" /> Yes</label>
                <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.general_wellbeing" value="No" /> No</label>
           </div>

           <label>6.1.g I spoke to them about my stigma-related issues</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.stigma_issues" value="Yes" /> Yes</label>
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.stigma_issues" value="No" /> No</label>
           </div>

           <label>6.1.h I shared other issues with them (please specify)</label>
           <input type="text" v-model="formData.other_issues" placeholder="Specify other issues" />
         </div>

        <label>6.2 Have you ever visited Pride Bhutan Office in the last 12 months?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
            <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.visited_pride_office" value="Yes" /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.visited_pride_office" value="No" /> No (If NO skip Q6.2.a till 6.2.d)</label>
         </div>

         <div v-if="formData.visited_pride_office === 'Yes'" class="conditional-section">
           <label>6.2.a What were the reasons for visiting the Pride Bhutan Office?</label>
           <input type="text" v-model="formData.pride_visit_reason" placeholder="Specify reasons" />

           <label>6.2.b For HIV test</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.pride_hiv_test" value="Yes" /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.pride_hiv_test" value="No" /> No</label>
           </div>

           <label>6.2.c For STI test</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.pride_sti_test" value="Yes" /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.pride_sti_test" value="No" /> No</label>
           </div>

           <label>6.2.d For collecting condoms/lubricants</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.pride_condoms_lubricants" value="Yes" /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.pride_condoms_lubricants" value="No" /> No</label>
           </div>

           <label>6.2.e Other reasons (Specify)</label>
           <input type="text" v-model="formData.pride_other_reasons" placeholder="Specify other reasons" />
         </div>

        <label>6.3 Have you ever visited HISC Thimphu in the last 12 months?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.visited_hisc_thimphu" value="Yes" /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.visited_hisc_thimphu" value="No" /> No (If NO skip Q6.3.b till 6.3.f)</label>
         </div>

         <div v-if="formData.visited_hisc_thimphu === 'Yes'" class="conditional-section">
           <label>6.3.b What were the reasons for your visit to HISC Thimphu?</label>
           <input type="text" v-model="formData.hisc_visit_reason" placeholder="Specify reasons" />

           <label>6.3.c For HIV test</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_hiv_test" value="Yes" /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_hiv_test" value="No" /> No</label>
           </div>

           <label>6.3.d For STI test</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_sti_test" value="Yes" /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_sti_test" value="No" /> No</label>
           </div>

            <label>6.3.e For collecting condoms/lubricants</label>
             <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_condoms_lubricants" value="Yes" /> Yes</label>
               <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_condoms_lubricants" value="No" /> No</label>
             </div>


           <label>6.3.f For general check up</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_general_checkup" value="Yes" /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.hisc_general_checkup" value="No" /> No</label>
           </div>

           <label>6.3.g Other reasons (Please specify)</label>
           <input type="text" v-model="formData.hisc_other_reasons" placeholder="Specify other reasons" />
         </div>

        <label>6.4 Have you ever been tested for HIV?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.tested_hiv" name="tested_hiv" value="Yes" /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.tested_hiv" name="tested_hiv" value="No" /> No (If NO skip Q6.5 and 6.6)</label>
         </div>

         <div v-if="formData.tested_hiv === 'Yes'" class="conditional-section">
           <label>6.5 When was the last time you were tested for HIV?</label>
            <div class="radio-group-vertical">
                <label><input type="radio" v-model="formData.last_tested_hiv" name="last_tested_hiv" value="12 months" /> 12 months</label>
                <label><input type="radio" v-model="formData.last_tested_hiv" name="last_tested_hiv" value="6-12 months" /> 6-12 months</label>
                <label><input type="radio" v-model="formData.last_tested_hiv" name="last_tested_hiv" value="Less than 6 months" /> Less than 6 months</label>
                <label><input type="radio" v-model="formData.last_tested_hiv" name="last_tested_hiv" value="Do not remember/do not know" /> Do not remember/do not know</label>
                <label><input type="radio" v-model="formData.last_tested_hiv" name="last_tested_hiv" value="No response" /> No response</label>
            </div>

           <label>6.6 Do you know your HIV status? Will you be willing to share with us?</label>
           <div class="radio-group-vertical">
               <label><input type="radio" v-model="formData.know_hiv_status" name="know_hiv_status" value="Yes, I am HIV Negative" /> Yes, I am HIV Negative</label>
               <label><input type="radio" v-model="formData.know_hiv_status" name="know_hiv_status" value="Yes, I am HIV Positive" /> Yes, I am HIV Positive</label>
               <label><input type="radio" v-model="formData.know_hiv_status" name="know_hiv_status" value="I do not know my status" /> I do not know my status</label>
               <label><input type="radio" v-model="formData.know_hiv_status" name="know_hiv_status" value="I do not want to disclose" /> I do not want to disclose</label>
           </div>
         </div>

        <label>6.7 In the past 6 months, have you ever experienced any of these symptoms of STI? (Tick multiple responses)</label>
         <div class="checkbox-group-vertical">
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="Discharge from vagina/penis/anus" /> Discharge from vagina/penis/anus</label>
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="Pain while peeing" /> Pain while peeing</label>
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="Lumps or bumps around genitals or anus" /> Lumps or bumps around genitals or anus</label>
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="Unusual vaginal bleeding" /> Unusual vaginal bleeding</label>
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="Itchy genitals or anus" /> Itchy genitals or anus</label>
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="Blisters and sores around your genital or anus" /> Blisters and sores around your genital or anus</label>
             <label><input type="checkbox" v-model="formData.sti_symptoms" value="None" /> None</label>
         </div>

        <label>6.8 The last time you had any of these symptoms what did you do?</label>
        <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.action_taken" name="action_taken" value="Sought advice/medicine from hospital" /> Sought advice/medicine from hospital</label>
            <label><input type="radio" v-model="formData.action_taken" name="action_taken" value="Sought advice/medicine from HISC" /> Sought advice/medicine from HISC</label>
            <label><input type="radio" v-model="formData.action_taken" name="action_taken" value="Bought advice/medicine from private pharmacy" /> Bought advice/medicine from private pharmacy</label>
            <label><input type="radio" v-model="formData.action_taken" name="action_taken" value="Told my sexual partner about the STI" /> Told my sexual partner about the STI</label>
            <label><input type="radio" v-model="formData.action_taken" name="action_taken" value="Other (specify)" /> Other (specify)</label>
           <!-- Input for 'Other' action -->
           <input type="text" v-if="formData.action_taken === 'Other (specify)'" v-model="formData.other_action_taken" placeholder="Specify other actions" />
       </div>
      </div>

      <!-- Container 8: Alcohol and Drug Use -->
       <div class="form-container">
         <h3 class="section-title">SECTION 7: ALCOHOL AND DRUG USE</h3>

         <label>7.1 Have you consumed alcohol in the last 12 months?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.alcohol_consumed" name="alcohol_consumed" value="Yes" required /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.alcohol_consumed" name="alcohol_consumed" value="No" /> No (If No, skip 7.2)</label>
         </div>

         <div v-if="formData.alcohol_consumed === 'Yes'" class="conditional-section">
           <label for="days_consumed_alcohol">7.2 How many days did you consume alcohol in the past one week?</label>
           <input type="number" v-model.number="formData.days_consumed_alcohol" id="days_consumed_alcohol" placeholder="Number of days" min="0" />
         </div>

         <label>7.3 The last time you had sex with any of your sexual partners, did you consume alcoholic drinks before or during sex?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.alcohol_before_sex" name="alcohol_before_sex" value="Yes" required /> Yes</label>
           <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.alcohol_before_sex" name="alcohol_before_sex" value="No" /> No (If No, skip 7.4, 7.5)</label>
         </div>

         <div v-if="formData.alcohol_before_sex === 'Yes'" class="conditional-section">
           <label>7.4 Have you taken recreational drugs in the last 12 months?</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.recreational_drugs" name="recreational_drugs" value="Yes" required /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.recreational_drugs" name="recreational_drugs" value="No" /> No</label>
           </div>

           <label>7.5 The last time you had sex with any of your sexual partners, did you take recreational drugs before or during sex?</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.drugs_before_sex" name="drugs_before_sex" value="Yes" required /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.drugs_before_sex" name="drugs_before_sex" value="No" /> No</label>
           </div>
         </div>
      </div>

      <!-- Container 9: Stigma & Violence -->
       <div class="form-container">
         <h3 class="section-title">SECTION 8: STIGMA & VIOLENCE RELATED QUESTIONS</h3>

         <label>8.1 Have you ever been denied health or medical services because you belong to KP groups (FSW, MSM, MSW, and TG person)?</label>
          <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.denied_services" name="denied_services" value="Yes, only once" required /> Yes, only once</label>
             <label><input type="radio" v-model="formData.denied_services" name="denied_services" value="Yes, multiple times" /> Yes, multiple times</label>
             <label><input type="radio" v-model="formData.denied_services" name="denied_services" value="No, never" /> No, never</label>
             <label><input type="radio" v-model="formData.denied_services" name="denied_services" value="No response" /> No response</label>
          </div>

         <label>8.2 Have you ever been exposed to violence or abuse from the police because you belong to a KP group?</label>
          <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.violence_police" name="violence_police" value="Yes, only once" required /> Yes, only once</label>
             <label><input type="radio" v-model="formData.violence_police" name="violence_police" value="Yes, multiple times" /> Yes, multiple times</label>
             <label><input type="radio" v-model="formData.violence_police" name="violence_police" value="No, never" /> No, never</label>
             <label><input type="radio" v-model="formData.violence_police" name="violence_police" value="No response" /> No response</label>
          </div>

         <label>8.3 In the last 12 months, were you forced to have sexual intercourse even if you did not want to?</label>
         <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.forced_intercourse" name="forced_intercourse" value="Yes, only once" required /> Yes, only once</label>
             <label><input type="radio" v-model="formData.forced_intercourse" name="forced_intercourse" value="Yes, multiple times" /> Yes, multiple times</label>
             <label><input type="radio" v-model="formData.forced_intercourse" name="forced_intercourse" value="No, never" /> No, never</label>
             <label><input type="radio" v-model="formData.forced_intercourse" name="forced_intercourse" value="No response" /> No response</label>
          </div>

         <label>8.4 Whom did you inform the last time you were forced to have sex against your will? (Multiple responses possible)</label>
         <div class="checkbox-group-vertical">
             <label><input type="checkbox" v-model="formData.informed_person" value="Did not tell anyone" /> Did not tell anyone</label>
             <label><input type="checkbox" v-model="formData.informed_person" value="Fellow MSM, TG, FSW" /> Fellow MSM, TG, FSW</label>
             <label><input type="checkbox" v-model="formData.informed_person" value="Friend/Relative/Family Member who is not MSM/TG/FSW" /> Friend / Relative / Family Member who is not MSM/TG/FSW</label>
             <label><input type="checkbox" v-model="formData.informed_person" value="NGO/CSO worker" /> NGO/CSO worker</label>
             <label><input type="checkbox" v-model="formData.informed_person" value="Police" /> Police</label>
             <label><input type="checkbox" v-model="formData.informed_person" value="I don’t remember" /> I Don’t remember</label>
             <label><input type="checkbox" v-model="formData.informed_person" value="Others" /> Others</label>
             <input type="text" v-if="formData.informed_person.includes('Others')" v-model="formData.other_informed" placeholder="Specify other persons informed" />
         </div>
      </div>

      <!-- Submit Button outside the last container -->
      <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Review Data' }} <!-- Changed Text -->
      </button>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form2_ConfirmationModal v-if="isReviewModalVisible"
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
   </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
// Import the modal component (assuming reuse)
import Form2_ConfirmationModal from './Form2_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIluNtj1MbiDhBsyOSYDaX_nZfmupCjKz2De1m-IqAZyqQepHH9QLoNvqBsa2v0hsn/exec'; // Replace with your Form 2 Script URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?gid=0&single=true&output=csv"; // Same UID validation source
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  // Initialize all fields from Form 2 template
  participant_uid: '',
  prep_site: 'CHD/JDWNRH/Thimphu', // Default
  date: '',
  interviewer_name: '',
  designation: '',
  interview_status: '',
  birth_year: null, // Use null for numbers
  age: null,
  permanent_bhutan: '',
  occupation: '',
  occupation_specify: '',
  education: '',
  marital_status: '',
  marital_specify: '',
  living_with_partner: '',
  partner_gender: [], // Array for checkboxes
  sexual_orientation: '',
  orientation_specify: '',
  hiv_risk: '',
  sti_risk: '',
  hiv_management: '',
  other_hiv_management_specify: '',
  partner_hiv_status: '',
  steady_partners: '',
  casual_partners: '',
  transactional_partners: '',
  steady_anal_partners: null,
  casual_anal_partners: null,
  transactional_anal_partners: null,
  anal_sex: '',
  steady_vaginal_partners: null,
  casual_vaginal_partners: null,
  transactional_vaginal_partners: null,
  vaginal_sex: '',
  ever_had_sex: '',
  sex_last_six_months: '',
  condom_frequency: '',
  steady_condom_use: '',
  casual_condom_use: '',
  transactional_condom_use: '',
  steady_last_condom: '',
  casual_last_condom: '',
  transactional_last_condom: '',
  condomless_reasons: [], // Array
  other_condomless_reasons: '',
  lubricant_used: '',
  lubricant_frequency: '',
  lubricant_use_reasons: [], // Array
  other_lubricant_reasons: '',
  outreach_workers: '',
  hiv_prevention: '',
  hiv_testing: '',
  sti_discussion: '',
  condoms_lubricants: '',
  prep_discussion: '',
  general_wellbeing: '',
  stigma_issues: '',
  other_issues: '',
  visited_pride_office: '',
  pride_visit_reason: '',
  pride_hiv_test: '',
  pride_sti_test: '',
  pride_condoms_lubricants: '',
  pride_other_reasons: '',
  visited_hisc_thimphu: '',
  hisc_visit_reason: '',
  hisc_hiv_test: '',
  hisc_sti_test: '', // Added this field
  hisc_condoms_lubricants: '', // Added this field
  hisc_general_checkup: '',
  hisc_other_reasons: '',
  tested_hiv: '',
  last_tested_hiv: '',
  know_hiv_status: '',
  sti_symptoms: [], // Array
  action_taken: '',
  other_action_taken: '',
  alcohol_consumed: '',
  days_consumed_alcohol: null,
  alcohol_before_sex: '',
  recreational_drugs: '',
  drugs_before_sex: '',
  denied_services: '',
  violence_police: '',
  forced_intercourse: '',
  informed_person: [], // Array
  other_informed: '',
  bhmc_registration: '' // Added this from original onMounted logic
});

const statusMessage = ref('');
const statusClass = ref('');
// Removed ageMessage as it's not used in the template for Form 2 specific validation messages
const submitDisabled = ref(true); // For UID check
const isCheckingUid = ref(false);
const isSubmitting = ref(false); // For modal button state

// Modal and Final Message State
const isReviewModalVisible = ref(false);
const modalSuccessMessage = ref('');
const modalErrorMessage = ref('');
const finalSubmitMessage = ref('');
const finalSubmitClass = ref('');

// General messages (can be kept or removed based on preference)
const successMessage = ref('');
const errorMessage = ref('');

let csvData = [];

// --- Functions ---

// Initialize Date
function initializeDate() {
  formData.value.date = new Date().toISOString().split('T')[0];
  // Removed signature_date as it's not in Form 2
}

// Fetch CSV Data (Same as Form 1)
async function fetchCsvData() {
  isCheckingUid.value = true;
  statusMessage.value = 'Loading validation data...';
  statusClass.value = '';
  submitDisabled.value = true;

  try {
    const response = await fetch(CSV_DATA_URL);
     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const csvText = await response.text();
    csvData = csvText.split('\n').map(row =>
        row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    );
    console.log("CSV Data Loaded for Form 2");
    statusMessage.value = 'Validation data loaded. Please enter UID.';
     if(formData.value.participant_uid) {
        validateUidOnInput(formData.value.participant_uid);
    } else {
        submitDisabled.value = true;
    }
  } catch (error) {
    console.error('Error fetching CSV data for Form 2:', error);
    statusMessage.value = 'Error loading validation data. Cannot check UID.';
    statusClass.value = 'error';
    csvData = [];
    submitDisabled.value = true;
  } finally {
      isCheckingUid.value = false;
       if (!formData.value.participant_uid && statusMessage.value.includes('Loading')) {
          statusMessage.value = '';
      }
  }
}

// Validate UID (Same as Form 1)
function validateUid(uid) {
  if (!uid || !csvData || csvData.length <= 1) return false;
  const normalizedUid = uid.trim().toLowerCase();
  return csvData.slice(1).some(row => row.length > 1 && row[1]?.toLowerCase() === normalizedUid);
}

// Function called on UID input change (Same logic as Form 1)
function validateUidOnInput(newUid) {
    clearFinalMessage();
    modalErrorMessage.value = '';
    modalSuccessMessage.value = '';

    if (!newUid) {
        statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; return;
    }
    const pattern = new RegExp(`^[A-Za-z0-9]{${UID_MIN_LENGTH},}$`);
    if (!pattern.test(newUid)) {
        statusMessage.value = `Participant UID must be at least ${UID_MIN_LENGTH} alphanumeric characters.`;
        statusClass.value = 'error'; submitDisabled.value = true;
    } else if (isCheckingUid.value) {
        statusMessage.value = 'Checking UID...'; statusClass.value = ''; submitDisabled.value = true;
    } else if (csvData.length <= 1 && !isCheckingUid.value) {
        statusMessage.value = 'Validation data not available. Cannot check UID.'; statusClass.value = 'error'; submitDisabled.value = true;
    }
     else {
        if (validateUid(newUid)) {
            statusMessage.value = 'Participant UID found!'; statusClass.value = 'success'; submitDisabled.value = false;
        } else {
            statusMessage.value = 'Participant UID not found in records.'; statusClass.value = 'error'; submitDisabled.value = true;
        }
    }
}

// Watch UID Input (Same as Form 1)
watch(() => formData.value.participant_uid, (newUid) => {
    validateUidOnInput(newUid);
});

// --- Modal Control ---
const showReviewModal = () => {
  if (submitDisabled.value) {
    modalErrorMessage.value = "Please ensure the Participant UID is valid before reviewing.";
    return;
  }
  modalSuccessMessage.value = '';
  modalErrorMessage.value = '';
  clearFinalMessage();
  isReviewModalVisible.value = true;
};

const cancelReview = () => {
  isReviewModalVisible.value = false;
};

// --- Form Submission ---
const confirmAndSubmit = async () => {
  // Check if interview was terminated
  if (formData.value.interview_status === 'Terminate') {
      modalErrorMessage.value = 'Interview terminated. Form cannot be submitted.';
      isSubmitting.value = false; // Ensure submitting state is reset
      // Optionally close the modal after a delay or keep it open
      // setTimeout(() => { isReviewModalVisible.value = false; }, 2000);
      return; // Stop submission
  }

  isSubmitting.value = true;
  modalSuccessMessage.value = '';
  modalErrorMessage.value = '';
  clearFinalMessage();

  const url = GOOGLE_SCRIPT_URL; // Use the Form 2 URL

  try {
    // Prepare data: Join all array fields into strings (e.g., semicolon-separated)
    const dataToSend = { ...formData.value };
    const arrayKeys = [
        'partner_gender', 'condomless_reasons', 'lubricant_use_reasons',
        'sti_symptoms', 'informed_person'
    ];
    arrayKeys.forEach(key => {
        if (Array.isArray(dataToSend[key])) {
            dataToSend[key] = dataToSend[key].join('; '); // Use semicolon or other delimiter
        }
    });

    const formDataSerialized = new URLSearchParams(dataToSend).toString();
    console.log("Submitting Form 2 data:", dataToSend);

    const response = await axios.post(url, formDataSerialized, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log("Form 2 Submission response:", response);

    // Adjust success check based on your actual script response
    if (response.status === 200 && response.data && (typeof response.data === 'string' && response.data.toLowerCase().includes('success'))) {
      modalSuccessMessage.value = response.data;
      setTimeout(() => {
        isReviewModalVisible.value = false;
        setFinalMessage(response.data || 'Form 2 submitted successfully!', 'success');
        clearForm();
        statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true;
        modalSuccessMessage.value = '';
      }, SUBMIT_SUCCESS_DELAY);
    } else {
      modalErrorMessage.value = response.data || 'Submission failed. Unexpected response from server.';
    }

  } catch (error) {
    console.error('Form 2 Submission error:', error);
    let detailedError = 'An error occurred while submitting Form 2. Please try again.';
     if (error.response) {
        detailedError += ` (Status: ${error.response.status})`;
        console.error("Error data:", error.response.data);
      } else if (error.request) { detailedError += ' (No response from server).';
      } else { detailedError += ` (${error.message})`; }
    modalErrorMessage.value = detailedError;
  } finally {
    isSubmitting.value = false;
  }
};

// Clear Form Data
const clearForm = () => {
     const interviewerDetails = {
        interviewer_name: formData.value.interviewer_name,
        designation: formData.value.designation,
        bhmc_registration: formData.value.bhmc_registration
    };

    // Reset all fields except interviewer details and date
    Object.keys(formData.value).forEach(key => {
         if (key in interviewerDetails || key === 'date') return;

         if (Array.isArray(formData.value[key])) formData.value[key] = [];
         else if (typeof formData.value[key] === 'number') formData.value[key] = null;
         else if (key === 'prep_site') formData.value[key] = 'CHD/JDWNRH/Thimphu'; // Reset default
         else formData.value[key] = '';
    });

     Object.assign(formData.value, interviewerDetails);
     initializeDate(); // Re-initialize date

     // Clear validation/feedback states
     statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true;
     clearFinalMessage();
     // Clear general messages if used
     successMessage.value = ''; errorMessage.value = '';
};

// Get Logged-In User Details
const getLoggedInUser = () => {
  try {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Error parsing loggedInUser", e); return null;
  }
};

// --- Utility Functions for Final Message ---
function setFinalMessage(message, type) {
    finalSubmitMessage.value = message;
    finalSubmitClass.value = type === 'success' ? 'success-final' : 'error-final';
}
function clearFinalMessage() {
    finalSubmitMessage.value = '';
    finalSubmitClass.value = '';
}

// --- Lifecycle Hook ---
onMounted(() => {
  initializeDate();
  fetchCsvData();

  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    formData.value.interviewer_name = loggedInUser.fullname || '';
    formData.value.designation = loggedInUser.designation || '';
    formData.value.bhmc_registration = loggedInUser.bhcno || ''; // Make sure this field exists in formData if needed
  } else {
      console.warn("Form 2: Logged in user details not found.");
       formData.value.interviewer_name = '';
       formData.value.designation = '';
       formData.value.bhmc_registration = '';
  }
   // Removed direct event listener setup for UID
});
</script>

<style>
/* Keep the original styles provided for Form 2 */
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
textarea { /* Added textarea */
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 15px;
  border: 1px solid #ccc; /* Adjusted border */
  border-radius: 5px;
  box-sizing: border-box;
   font-size: 0.95rem;
}
 input:focus, select:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
 input[readonly] {
    background-color: #f8f9fa;
    cursor: not-allowed;
}


input[type="radio"],
input[type="checkbox"] {
  width: auto; /* Override width: 100% */
  margin-right: 8px;
  vertical-align: middle;
}
 label > input[type="radio"], label > input[type="checkbox"] {
    margin-bottom: 0;
 }
/* Helper for vertical radio/checkbox groups */
 .radio-group-vertical, .checkbox-group-vertical {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Space between items */
    margin-bottom: 15px;
     padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    background-color: #fdfdfd;
 }
 .radio-group-vertical label, .checkbox-group-vertical label {
    font-weight: normal;
    display: inline-flex; /* Align items in label */
    align-items: center;
    margin-bottom: 0; /* Remove bottom margin within group */
 }
 .partner-count label {
     display: inline-block; /* Side-by-side label and input */
     width: auto;
     margin-right: 10px;
     margin-bottom: 0; /* Reset margin */
 }
 .partner-count input[type="number"] {
     width: 80px; /* Smaller width for counts */
     display: inline-block;
     margin-bottom: 10px; /* Space below count */
 }


.section-title {
  font-size: 1.5rem;
  color: #3498db;
  margin-top: 25px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}
 .section-title:first-of-type {
    margin-top: 0;
 }

.submit-btn {
  background-color: #3498db;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
   margin-top: 1rem; /* Add margin above the button */
   display: block; /* Make button block level */
   width: auto; /* Adjust width if needed */
   margin-left: auto; /* Align to right if needed */
   margin-right: auto; /* Center button */
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9; /* Darker blue */
}
 .submit-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    opacity: 0.7;
}

#status-message {
  margin-top: -10px;
  margin-bottom: 15px;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  border-width: 1px;
  border-style: solid;
}

#status-message.success {
  background-color: #dff0d8; color: #3c763d; border-color: #d6e9c6;
}

#status-message.error {
  background-color: #f2dede; color: #a94442; border-color: #ebccd1;
}
 .uid-spinner {
    margin-left: 10px;
    color: #3498db;
    font-size: 0.9em;
}

.success-message { /* Original general style */
  color: green;
  text-align: center;
  font-weight: bold;
  margin-top: 15px;
}

.error-message { /* Original general style */
  color: red;
  text-align: center;
  font-weight: bold;
   margin-top: 15px;
}

/* Final Submit Message (outside modal) */
.final-message {
    max-width: 700px;
    margin: 20px auto;
    padding: 15px 20px;
    border-radius: 5px;
    text-align: center;
    font-weight: 500;
}
.final-message.success-final {
    background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc;
}
.final-message.error-final {
    background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7;
}

/* Style for conditional sections for better visual separation (optional) */
.conditional-section {
    margin-left: 15px;
    padding-left: 15px;
    border-left: 2px solid #e0e0e0;
    margin-top: 10px;
    padding-top: 10px;
}

</style>