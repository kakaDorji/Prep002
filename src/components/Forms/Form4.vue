<template>
  <!-- Folow Up Form -->
  <form @submit.prevent="showReviewModal"> 
    

    <div class="container">
      <!-- Container 1: Basic Info -->
      <div class="form-container">
        <label for="participant_uid">Participant UID:</label>
        <input type="text" v-model="formData.participant_uid" id="participant_uid" name="participant_uid" required
          pattern="[A-Za-z0-9]{5,}" title="Minimum 5 Alphanumeric characters only" />
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
         <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label for="prep_site">PrEP Site</label>
        <select v-model="formData.prep_site" id="prep_site" name="prep_site" required>
          <option value="CHD/JDWNRH/Thimphu">CHD/JDWNRH/Thimphu</option>
          <option value="HISC/Thimphu">HISC/Thimphu</option>
          <option value="Paro Hospital/Paro">Paro Hospital/Paro</option>
          <option value="Phuntsholing Hospital/Chukha">Phuntsholing Hospital/Chukha</option>
          <option value="CRRH/Gelephu/Sarpang">CRRH/Gelephu/Sarpang</option>
        </select>

        <label for="dateInput">Date:</label>
        <input type="date" v-model="formData.date" id="dateInput" name="date" readonly />

        <p style="margin-top: 1rem; font-style: italic; color: #555; line-height: 1.5;">
          “My name is {{ formData.interviewer_name }}. I am working as {{ formData.designation }} and I am associated
          with the Phased Implementation of PrEP in {{ formData.prep_site }}.
          <br> As part of the Phased Implementation of PrEP in {{ formData.prep_site }}, I will be asking you some very
          personal questions regarding your daily schedule and sexual habits, networks, etc. I would like to inform you
          that some people may find it difficult to answer. Please be assured that all of your answers and personal
          details are completely confidential. Your name will not be written on this form and will never be used in
          connection with any of the information you share with us. You do not have to answer any questions that you do
          not want to answer, and you may end this interview at any time you want to. However, your honest answers to
          these questions will help us better understand what people think, say and do about certain kinds of behaviors.
          We would greatly appreciate your help in responding to this survey. The interview will take about 20-30
          minutes to ask the questions. Would you be willing to participate?”
          <br>
          <br>If “NO”, terminate the interview. If “YES, read out the form and get the respondent’s signature on the
          form to be filled and shared with the supervisor and continue with the interview.
        </p>

        <label for="type_of_visit">Type of Visit:</label>
        <select v-model="formData.type_of_visit" id="type_of_visit" name="type_of_visit" required>
          <option value="mst" disabled>Select one</option>
          <option value="Screening Visit MO">Screening Visit MO</option>
          <option value="End of M1">End of M1</option>
          <option value="End of M3">End of M3</option>
          <option value="End of M6">End of M6</option>
          <option value="End of M9">End of M9</option>
          <option value="End of M12">End of M12</option>
        </select>

        <label for="interviewer_name">Interviewer’s Name:</label>
        <input type="text" v-model="formData.interviewer_name" id="interviewer_name" name="interviewer_name" readonly />

        <label for="designation">Designation:</label>
        <input type="text" v-model="formData.designation" id="designation" name="designation" readonly /><br />

        <label for="bhmc_registration">BMHC Number:</label>
        <input type="text" v-model="formData.bhmc_registration" id="bhmc_registration" name="bhmc_registration" readonly /><br />

        <label for="interview_status">Status of the Interview:</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.interview_status" name="interview_status" value="Progress" required /> Progress</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.interview_status" name="interview_status" value="Terminate" required /> Terminate</label>
        </div>
      </div>

      <!-- Container 2: Socio-Demographics -->
      <div class="form-container">
        <h3 class="section-title">SECTION 1: SOCIO-DEMOGRAPHIC QUESTIONSs</h3>
        <label>1.1 What is your Current occupation status?</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="None" required /> None</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Student" /> Student</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Fulltime job" /> Have a full-time job (Govt/Pvt/NGO/CSO)</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Part-time job" /> Have a part-time job</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Other" /> Other</label>
            <input type="text" v-if="formData.occupation_status === 'Other'" v-model="formData.occupation_other" name="occupation_other" placeholder="Specify" />
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="No response" /> No response</label>
         </div>

        <label>1.2 What is your current marital status?</label>
        <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Never married" required /> Never married</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Currently married" /> Currently married</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Widowed" /> Widowed</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Divorced" /> Divorced</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Separated" /> Separated</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Other" /> Other</label>
            <input type="text" v-if="formData.marital_status === 'Other'" v-model="formData.marital_other" name="marital_other" placeholder="Specify" />
        </div>

        <label>1.3 Do you currently live with your sex partner?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.live_with_partner" name="live_with_partner" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.live_with_partner" name="live_with_partner" value="No" /> No</label>
        </div>

        <label>1.4 If YES, is your sex partner male, female, or TG? (tick all that apply)</label>
         <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.partner_gender" value="Male" :disabled="formData.live_with_partner !== 'Yes'" /> Male</label>
            <label><input type="checkbox" v-model="formData.partner_gender" value="Female" :disabled="formData.live_with_partner !== 'Yes'" /> Female</label>
            <label><input type="checkbox" v-model="formData.partner_gender" value="Transgender" :disabled="formData.live_with_partner !== 'Yes'" /> Transgender</label>
         </div>
      </div>

      <!-- Container 3: Risk Perception -->
      <div class="form-container">
        <h3 class="section-title">SECTION 2: RISK PERCEPTION</h3>
        <label>2.1 In general, to what extent do you consider yourself at risk of getting STI? (Score 1-5)</label>
        <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="1" required /> 1 (very low risk)</label>
            <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="2" required /> 2 (low risk)</label>
            <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="3" required /> 3 (medium risk)</label>
            <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="4" required /> 4 (high risk)</label>
            <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="5" required /> 5 (very high risk)</label>
        </div>

        <label>2.2 In general, to what extent do you consider yourself at risk of getting HIV? (Score 1-5)</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="1" required /> 1 (very low risk)</label>
            <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="2" required /> 2 (low risk)</label>
            <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="3" required /> 3 (medium risk)</label>
            <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="4" required /> 4 (high risk)</label>
            <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="5" required /> 5 (very high risk)</label>
         </div>

        <label>2.3 In general, how do you manage your risk of getting HIV?</label>
        <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="Ask partner/client to use a condom" /> I frequently ask my partner/client to use a condom</label>
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="Frequently use condoms" /> I frequently use condoms</label>
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="Choose partner based on HIV negative status" /> I choose partner based on HIV negative status</label>
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="Seek partners on HIV treatment" /> I seek partners who I know are on HIV treatment</label>
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="Try to be top if unsure" /> I try to be top if unsure about partner’s HIV status</label>
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="No risk reduction strategy" /> I don’t use any risk reduction strategy</label>
            <label><input type="checkbox" v-model="formData.hiv_risk_management" value="Other" /> Other</label>
            <input type="text" v-if="formData.hiv_risk_management.includes('Other')" v-model="formData.other_hiv_risk" name="other_hiv_risk" placeholder="Specify" />
        </div>

        <label>2.4 Do you know the HIV status of your partner(s)?</label>
        <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="No, I do not know" required /> No, I do not know</label>
            <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="Partner is NOT HIV positive" required /> Yes, Partner is NOT HIV positive</label>
            <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="Partner is HIV positive and on ART" required /> Yes, Partner is HIV positive and on ART</label>
            <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="Partner is HIV positive but NOT on ART" required /> Yes, Partner is HIV positive BUT NOT on ART</label>
            <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_hiv_status" value="No response" required /> No response</label>
        </div>
      </div>

      <!-- Container 4: Sexual Behavior -->
      <div class="form-container">
        <h3 class="section-title">SECTION 3: SEXUAL BEHAVIOR</h3>
        <p style="font-style: italic; color: #555; margin-bottom: 1rem;">[Confidentiality reminder text...]</p>

        <label>3.1 Number of partners for anal sex (last month)? (Put 0 if none)</label>
         <div class="partner-count-group">
             <label>Steady partners: <input type="number" v-model.number="formData.steady_anal_partners" min="0" /></label>
             <label>Casual Partners: <input type="number" v-model.number="formData.casual_anal_partners" min="0" /></label>
             <label>Transactional partners: <input type="number" v-model.number="formData.transactional_anal_partners" min="0" /></label>
         </div>
          <div class="radio-group-vertical" style="margin-top: 10px;">
            <label><input type="radio" v-model="formData.anal_sex" name="anal_sex_status" value="Never" :disabled="hasAnalPartners" required /> I never have anal sex</label>
            <label><input type="radio" v-model="formData.anal_sex" name="anal_sex_status" value="No response" :disabled="hasAnalPartners" required /> No Response</label>
          </div>

        <label>3.2 Number of partners for vaginal sex (last month)? (Put 0 if none)</label>
         <div class="partner-count-group">
            <label>Steady partners: <input type="number" v-model.number="formData.steady_vaginal_partners" min="0" /></label>
            <label>Casual Partners: <input type="number" v-model.number="formData.casual_vaginal_partners" min="0" /></label>
            <label>Transactional partners: <input type="number" v-model.number="formData.transactional_vaginal_partners" min="0" /></label>
         </div>
         <div class="radio-group-vertical" style="margin-top: 10px;">
            <label><input type="radio" v-model="formData.vaginal_sex" name="vaginal_sex_status" value="Never" :disabled="hasVaginalPartners" required /> I never have vaginal sex</label>
            <label><input type="radio" v-model="formData.vaginal_sex" name="vaginal_sex_status" value="No response" :disabled="hasVaginalPartners" required /> No Response</label>
         </div>

        <label>3.3 Condom use last time (steady partner/s)?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.condom_used_last_time" name="condom_last_steady" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.condom_used_last_time" name="condom_last_steady" value="No" /> No</label>
         </div>

        <label>3.4 Days sex w/ regular partner (last week)?</label>
         <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 1" /> Day 1 (Yesterday)</label>
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 2" /> Day 2</label>
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 3" /> Day 3</label>
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 4" /> Day 4</label>
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 5" /> Day 5</label>
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 6" /> Day 6</label>
            <label><input type="checkbox" v-model="formData.days_sex_regular_partner" value="Day 7" /> Day 7</label>
         </div>
        <label style="margin-top: 0.5rem;"><input type="radio" v-model="formData.sex_regular_partner" name="sex_regular_status" value="No sex" /> I did not have sex with regular partner/s</label>
        <label><input type="radio" v-model="formData.sex_regular_partner" name="sex_regular_status" value="Had sex" /> I had sex with regular partner/s</label>

        <div v-if="formData.sex_regular_partner === 'Had sex'">
          <label>3.5 Condom use w/ regular clients (last week)?</label>
          <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.condom_use_regular_clients" name="condom_use_reg_clients" value="Always" /> Always (100%)</label>
            <label><input type="radio" v-model="formData.condom_use_regular_clients" name="condom_use_reg_clients" value="Most" /> Most of the time (75%)</label>
            <label><input type="radio" v-model="formData.condom_use_regular_clients" name="condom_use_reg_clients" value="Half" /> About half the time (50%)</label>
            <label><input type="radio" v-model="formData.condom_use_regular_clients" name="condom_use_reg_clients" value="Sometimes" /> Sometimes (25%)</label>
            <label><input type="radio" v-model="formData.condom_use_regular_clients" name="condom_use_reg_clients" value="Rarely" /> Rarely (below 10%)</label>
            <label><input type="radio" v-model="formData.condom_use_regular_clients" name="condom_use_reg_clients" value="Never" /> Never</label>
          </div>
        </div>

        <label>3.6 Do you have transactional partner/Clients?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.transactional_partners" name="has_transactional" value="Yes" /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.transactional_partners" name="has_transactional" value="No" /> No (Skip 3.7-3.9)</label>
        </div>

        <div v-if="formData.transactional_partners === 'Yes'">
          <label>3.7 Clients last week? (0 if none)</label>
          <input type="number" v-model.number="formData.num_clients_last_week" min="0" />

          <label>3.8 Days sex w/ clients (last week)?</label>
           <div class="checkbox-group-vertical">
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 1" /> Day 1 (Yesterday)</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 2" /> Day 2</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 3" /> Day 3</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 4" /> Day 4</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 5" /> Day 5</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 6" /> Day 6</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="Day 7" /> Day 7</label>
              <label><input type="checkbox" v-model="formData.days_sex_clients" value="No sex" /> I did not have sex with clients</label>
           </div>

          <label>3.9 Condom use w/ clients (last week)?</label>
          <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.condom_use_clients" name="condom_use_clients" value="Always" /> Always (100%)</label>
              <label><input type="radio" v-model="formData.condom_use_clients" name="condom_use_clients" value="Most" /> Most of the time (75%)</label>
              <label><input type="radio" v-model="formData.condom_use_clients" name="condom_use_clients" value="Half" /> About half the time (50%)</label>
              <label><input type="radio" v-model="formData.condom_use_clients" name="condom_use_clients" value="Sometimes" /> Sometimes (25%)</label>
              <label><input type="radio" v-model="formData.condom_use_clients" name="condom_use_clients" value="Rarely" /> Rarely (below 10%)</label>
              <label><input type="radio" v-model="formData.condom_use_clients" name="condom_use_clients" value="Never" /> Never</label>
           </div>
        </div>

        <label>3.10 Condom use last time (clients)?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.last_sex_clients_condom_use" name="condom_last_client" value="Yes" /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.last_sex_clients_condom_use" name="condom_last_client" value="No" /> No</label>
        </div>

        <label>3.11 Reasons for condomless sex? (Select all)</label>
         <div class="checkbox-group-vertical">
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Doesn't feel good" /> Doesn't feel good</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Forgot to use" /> Forgot to use</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="No condom available" /> No condom available</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Know partner's HIV status" /> Know partner's HIV status</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Taking PrEP" /> Taking PrEP</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Expensive" /> Expensive</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Embarrassed to buy" /> Embarrassed to buy</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Don't trust condoms" /> Don't trust condoms</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Partner doesn't like" /> Partner doesn't like</label>
             <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Trust partner" /> Trust partner</label>
            <label><input type="checkbox" v-model="formData.condomless_sex_reason" value="Other" /> Other</label>
             <input type="text" v-if="formData.condomless_sex_reason.includes('Other')" v-model="formData.condomless_other_reason" placeholder="Specify"/>
         </div>

        <label>3.12 PrEP changed your condom use?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_change_condom_use" name="prep_change_condom" value="Yes" /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_change_condom_use" name="prep_change_condom" value="No" /> No</label>
        </div>
      </div>

      <!-- Container 5: PrEP Regimen & Side Effects -->
      <div class="form-container">
        <h3 class="section-title">SECTION 4: PrEP REGIMEN and SIDE EFFECTS</h3>
        <p style="font-style: italic; color: #555; margin-bottom: 1rem;">[Confidentiality reminder text...]</p>
        <label>4.1 Prescribed dosing regimen (previous visit)?</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.dosing_regimen" name="dosing_regimen" value="Daily PrEP" required/> Daily PrEP</label>
            <label><input type="radio" v-model="formData.dosing_regimen" name="dosing_regimen" value="Event-Driven PrEP" required/> Event-Driven PrEP</label>
         </div>

        <label>4.2 Changed regimen after visit?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.change_regimen" name="change_regimen" value="Yes" /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.change_regimen" name="change_regimen" value="No" /> No</label>
         </div>

        <div v-if="formData.change_regimen === 'Yes'">
          <label for="reason_change">4.3 Reason for changing?</label>
          <textarea v-model="formData.reason_change" id="reason_change" rows="4"></textarea>
        </div>

        <label>4.4 Side effects experienced (last 1 or 3 months)?</label>
        <div class="table-responsive">
           <table border="1" cellspacing="0" cellpadding="5" class="symptoms-table">
              <thead><tr><th>Side effect</th><th>Yes</th><th>No</th><th>Ongoing</th><th>Resolved</th></tr></thead>
              <tbody>
                <tr><td>Nausea</td><td><input type="radio" name="nausea" v-model="formData.nausea" value="Yes"/></td><td><input type="radio" name="nausea" v-model="formData.nausea" value="No"/></td><td><input type="checkbox" v-model="formData.nausea_ongoing" :disabled="formData.nausea!=='Yes'||formData.nausea_resolved" @change="handleSideEffectCheck('nausea', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.nausea_resolved" :disabled="formData.nausea!=='Yes'||formData.nausea_ongoing" @change="handleSideEffectCheck('nausea', 'resolved')"/></td></tr>
                <tr><td>Vomiting</td><td><input type="radio" name="vomiting" v-model="formData.vomiting" value="Yes"/></td><td><input type="radio" name="vomiting" v-model="formData.vomiting" value="No"/></td><td><input type="checkbox" v-model="formData.vomiting_ongoing" :disabled="formData.vomiting!=='Yes'||formData.vomiting_resolved" @change="handleSideEffectCheck('vomiting', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.vomiting_resolved" :disabled="formData.vomiting!=='Yes'||formData.vomiting_ongoing" @change="handleSideEffectCheck('vomiting', 'resolved')"/></td></tr>
                <tr><td>Fatigue</td><td><input type="radio" name="fatigue" v-model="formData.fatigue" value="Yes"/></td><td><input type="radio" name="fatigue" v-model="formData.fatigue" value="No"/></td><td><input type="checkbox" v-model="formData.fatigue_ongoing" :disabled="formData.fatigue!=='Yes'||formData.fatigue_resolved" @change="handleSideEffectCheck('fatigue', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.fatigue_resolved" :disabled="formData.fatigue!=='Yes'||formData.fatigue_ongoing" @change="handleSideEffectCheck('fatigue', 'resolved')"/></td></tr>
                <tr><td>Dizziness</td><td><input type="radio" name="dizziness" v-model="formData.dizziness" value="Yes"/></td><td><input type="radio" name="dizziness" v-model="formData.dizziness" value="No"/></td><td><input type="checkbox" v-model="formData.dizziness_ongoing" :disabled="formData.dizziness!=='Yes'||formData.dizziness_resolved" @change="handleSideEffectCheck('dizziness', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.dizziness_resolved" :disabled="formData.dizziness!=='Yes'||formData.dizziness_ongoing" @change="handleSideEffectCheck('dizziness', 'resolved')"/></td></tr>
                <tr><td>Headache</td><td><input type="radio" name="headache" v-model="formData.headache" value="Yes"/></td><td><input type="radio" name="headache" v-model="formData.headache" value="No"/></td><td><input type="checkbox" v-model="formData.headache_ongoing" :disabled="formData.headache!=='Yes'||formData.headache_resolved" @change="handleSideEffectCheck('headache', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.headache_resolved" :disabled="formData.headache!=='Yes'||formData.headache_ongoing" @change="handleSideEffectCheck('headache', 'resolved')"/></td></tr>
                <tr><td>Rash</td><td><input type="radio" name="rash_se" v-model="formData.rash" value="Yes"/></td><td><input type="radio" name="rash_se" v-model="formData.rash" value="No"/></td><td><input type="checkbox" v-model="formData.rash_ongoing" :disabled="formData.rash!=='Yes'||formData.rash_resolved" @change="handleSideEffectCheck('rash', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.rash_resolved" :disabled="formData.rash!=='Yes'||formData.rash_ongoing" @change="handleSideEffectCheck('rash', 'resolved')"/></td></tr>
                <tr><td>Abdominal pain</td><td><input type="radio" name="abdo_pain" v-model="formData.abdominal_pain" value="Yes"/></td><td><input type="radio" name="abdo_pain" v-model="formData.abdominal_pain" value="No"/></td><td><input type="checkbox" v-model="formData.abdominal_pain_ongoing" :disabled="formData.abdominal_pain!=='Yes'||formData.abdominal_pain_resolved" @change="handleSideEffectCheck('abdominal_pain', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.abdominal_pain_resolved" :disabled="formData.abdominal_pain!=='Yes'||formData.abdominal_pain_ongoing" @change="handleSideEffectCheck('abdominal_pain', 'resolved')"/></td></tr>
                <tr><td>Weight loss</td><td><input type="radio" name="weight_loss_se" v-model="formData.weight_loss" value="Yes"/></td><td><input type="radio" name="weight_loss_se" v-model="formData.weight_loss" value="No"/></td><td><input type="checkbox" v-model="formData.weight_loss_ongoing" :disabled="formData.weight_loss!=='Yes'||formData.weight_loss_resolved" @change="handleSideEffectCheck('weight_loss', 'ongoing')"/></td><td><input type="checkbox" v-model="formData.weight_loss_resolved" :disabled="formData.weight_loss!=='Yes'||formData.weight_loss_ongoing" @change="handleSideEffectCheck('weight_loss', 'resolved')"/></td></tr>
                <tr><td>No response</td><td><input type="radio" name="no_response_se" v-model="formData.no_response" value="Yes"/></td><td><input type="radio" name="no_response_se" v-model="formData.no_response" value="No"/></td><td></td><td></td></tr>
                 <tr><td>Others (specify)</td><td><input type="radio" name="other_symptoms_se" v-model="formData.other_symptoms" value="Yes"/></td><td><input type="radio" name="other_symptoms_se" v-model="formData.other_symptoms" value="No"/></td><td colspan="2"><input type="text" v-model="formData.other_symptoms_specified" :disabled="formData.other_symptoms !== 'Yes'" placeholder="Specify"/></td></tr>
              </tbody>
           </table>
        </div>
      </div>

      <!-- Container 6: Daily PrEP (Conditional) -->
      <div v-if="formData.dosing_regimen === 'Daily PrEP'">
        <div class="form-container" id="daily_prep">
          <div style="text-align: center"><label>(For Daily PrEP Users)</label></div>
          <h3 class="section-title">SECTION 5/5a: Daily PrEP Details</h3>
          <label>5.1 Reason for daily PrEP? (Mark one)</label>
           <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Risk of getting HIV" /> High risk</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Sex without condom" /> Want sex w/o condom</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Partner HIV positive" /> Partner HIV+</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Daily PrEP safer" /> Daily seems safer</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="One pill easier" /> Easier to take daily</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Difficult to plan risk" /> Difficult to plan risk</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Have sex any moment" /> Want sex anytime</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Persuaded by others" /> Persuaded by others</label>
              <label><input type="radio" v-model="formData.prep_reason" name="prep_reason" value="Other" /> Other</label>
              <textarea v-if="formData.prep_reason === 'Other'" v-model="formData.other_reason" rows="3" placeholder="Specify"></textarea>
           </div>

          <h3 class="section-title">PrEP - RECALL (Last 7 Days)</h3>
           <div class="pill-recall-grid">
              <label>Day 1 (Yesterday):</label> <div><label><input type="radio" name="day1" v-model="formData.day_1_pill" value="Yes"/> Y</label><label><input type="radio" name="day1" v-model="formData.day_1_pill" value="No"/> N</label><label><input type="radio" name="day1" v-model="formData.day_1_pill" value="Don't remember"/> DR</label></div>
              <label>Day 2:</label> <div><label><input type="radio" name="day2" v-model="formData.day_2_pill" value="Yes"/> Y</label><label><input type="radio" name="day2" v-model="formData.day_2_pill" value="No"/> N</label><label><input type="radio" name="day2" v-model="formData.day_2_pill" value="Don't remember"/> DR</label></div>
              <label>Day 3:</label> <div><label><input type="radio" name="day3" v-model="formData.day_3_pill" value="Yes"/> Y</label><label><input type="radio" name="day3" v-model="formData.day_3_pill" value="No"/> N</label><label><input type="radio" name="day3" v-model="formData.day_3_pill" value="Don't remember"/> DR</label></div>
              <label>Day 4:</label> <div><label><input type="radio" name="day4" v-model="formData.day_4_pill" value="Yes"/> Y</label><label><input type="radio" name="day4" v-model="formData.day_4_pill" value="No"/> N</label><label><input type="radio" name="day4" v-model="formData.day_4_pill" value="Don't remember"/> DR</label></div>
              <label>Day 5:</label> <div><label><input type="radio" name="day5" v-model="formData.day_5_pill" value="Yes"/> Y</label><label><input type="radio" name="day5" v-model="formData.day_5_pill" value="No"/> N</label><label><input type="radio" name="day5" v-model="formData.day_5_pill" value="Don't remember"/> DR</label></div>
              <label>Day 6:</label> <div><label><input type="radio" name="day6" v-model="formData.day_6_pill" value="Yes"/> Y</label><label><input type="radio" name="day6" v-model="formData.day_6_pill" value="No"/> N</label><label><input type="radio" name="day6" v-model="formData.day_6_pill" value="Don't remember"/> DR</label></div>
              <label>Day 7:</label> <div><label><input type="radio" name="day7" v-model="formData.day_7_pill" value="Yes"/> Y</label><label><input type="radio" name="day7" v-model="formData.day_7_pill" value="No"/> N</label><label><input type="radio" name="day7" v-model="formData.day_7_pill" value="Don't remember"/> DR</label></div>
           </div>

          <h3 class="section-title">PrEP ADHERENCE & FREQUENCY (Last Month)</h3>
          <label>5.a.2 Typical pill time?</label>
           <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.pill_time" name="pill_time" value="Morning"/> Morning</label>
              <label><input type="radio" v-model="formData.pill_time" name="pill_time" value="Afternoon"/> Afternoon</label>
              <label><input type="radio" v-model="formData.pill_time" name="pill_time" value="Evening"/> Evening</label>
              <label><input type="radio" v-model="formData.pill_time" name="pill_time" value="Other"/> Other</label>
              <input type="text" v-if="formData.pill_time === 'Other'" v-model="formData.pill_time_other" placeholder="Specify"/>
           </div>

          <label>5.a.3 Took at same time each day?</label>
           <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.pill_frequency" name="pill_freq" value="Always"/> Always</label>
              <label><input type="radio" v-model="formData.pill_frequency" name="pill_freq" value="Sometimes"/> Sometimes</label>
              <label><input type="radio" v-model="formData.pill_frequency" name="pill_freq" value="Never"/> Never</label>
           </div>

          <label>5.a.4 Reminder method?</label>
          <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.pill_reminder" name="pill_reminder" value="Nothing"/> Nothing</label>
              <label><input type="radio" v-model="formData.pill_reminder" name="pill_reminder" value="Alarm"/> Alarm/Cell phone</label>
              <label><input type="radio" v-model="formData.pill_reminder" name="pill_reminder" value="Partner"/> My partner</label>
              <label><input type="radio" v-model="formData.pill_reminder" name="pill_reminder" value="Sex association"/> Association with sex</label>
              <label><input type="radio" v-model="formData.pill_reminder" name="pill_reminder" value="Other meds"/> Association with other meds</label>
              <label><input type="radio" v-model="formData.pill_reminder" name="pill_reminder" value="Other"/> Other</label>
              <input type="text" v-if="formData.pill_reminder === 'Other'" v-model="formData.pill_reminder_other" placeholder="Specify"/>
           </div>

          <label>5.a.5 Reasons for missing pills? (Check all)</label>
          <div class="checkbox-group-vertical">
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="N/A" /> N/A, took every day</label>
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="No pill" /> Didn't have pill</label>
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="Sick" /> Was sick</label>
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="Side effects" /> Had side effects</label>
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="Tired" /> Tired of taking daily</label>
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="Forgot" /> Forgot/Too busy</label>
              <label><input type="checkbox" v-model="formData.missed_pill_reasons" value="Other" /> Other</label>
              <input type="text" v-if="formData.missed_pill_reasons.includes('Other')" v-model="formData.missed_pill_other_reason" placeholder="Specify"/>
           </div>

          <label for="longest_no_pill">5.a.6 Longest missed streak (days)?</label>
          <input type="number" id="longest_no_pill" v-model.number="formData.longest_no_pill" min="0" placeholder="Days"/>

          <label for="total_no_pill_days">5.a.7 Total missed days?</label>
          <input type="number" id="total_no_pill_days" v-model.number="formData.total_no_pill_days" min="0" placeholder="Days"/>
        </div>
      </div>

      <!-- Container 7: Event-Driven PrEP (Conditional) -->
      <div v-if="formData.dosing_regimen === 'Event-Driven PrEP'">
        <div class="form-container">
           <div style="text-align: center"><label>(For Event-driven PrEP Users)</label></div>
           <h3 class="section-title">SECTION 6/6a: Event-Driven PrEP Details</h3>
           <label>6.1 Reason for ED-PrEP? (Mark one)</label>
            <div class="radio-group-vertical">
               <label><input type="radio" v-model="formData.ed_prep_reason" name="ed_reason" value="Plan sexual events"/> Plan sexual events</label>
               <label><input type="radio" v-model="formData.ed_prep_reason" name="ed_reason" value="Not frequent sex"/> Not frequent sex</label>
               <label><input type="radio" v-model="formData.ed_prep_reason" name="ed_reason" value="Don’t like daily PrEP"/> Don't like daily PrEP</label>
               <label><input type="radio" v-model="formData.ed_prep_reason" name="ed_reason" value="Other"/> Other</label>
               <textarea v-if="formData.ed_prep_reason === 'Other'" v-model="formData.other_ed_prep_reason" rows="3" placeholder="Specify"></textarea>
            </div>

           <h3 class="section-title">ED-PrEP RECALL</h3>
           <p style="font-style: italic; color: #555;">[Recall explanation text...]</p>
           <label>6.a1 Sex acts w/ male partner (last month)?</label>
           <div class="radio-group-vertical">
                <label><input type="radio" v-model="formData.sex_last_month" name="sex_last_m" value="Did not have sex"/> Did not have sex</label>
                <label><input type="radio" v-model="formData.sex_last_month" name="sex_last_m" value="Only once"/> Only once</label>
                <label><input type="radio" v-model="formData.sex_last_month" name="sex_last_m" value="1-2 sex acts per week"/> 1-2/week</label>
                <label><input type="radio" v-model="formData.sex_last_month" name="sex_last_m" value="More than 1-2 sex acts"/> >1-2/week</label>
                <label><input type="radio" v-model="formData.sex_last_month" name="sex_last_m" value="Cannot remember"/> Cannot remember</label>
                <label><input type="radio" v-model="formData.sex_last_month" name="sex_last_m" value="No response"/> No response</label>
           </div>

           <label>6.a2 PrEP before sex (last month %)?</label>
           <div class="radio-group-vertical"> <label><input type="radio" name="prep_before_m" v-model="formData.prep_before_sex" value="0%"/> 0%</label> <label><input type="radio" name="prep_before_m" v-model="formData.prep_before_sex" value="25%"/> 25%</label> <label><input type="radio" name="prep_before_m" v-model="formData.prep_before_sex" value="50%"/> 50%</label> <label><input type="radio" name="prep_before_m" v-model="formData.prep_before_sex" value="75%"/> 75%</label> <label><input type="radio" name="prep_before_m" v-model="formData.prep_before_sex" value="100%"/> 100%</label> </div>
           <label>6.a3 PrEP after sex (last month %)?</label>
           <div class="radio-group-vertical"> <label><input type="radio" name="prep_after_m" v-model="formData.prep_after_sex" value="0%"/> 0%</label> <label><input type="radio" name="prep_after_m" v-model="formData.prep_after_sex" value="25%"/> 25%</label> <label><input type="radio" name="prep_after_m" v-model="formData.prep_after_sex" value="50%"/> 50%</label> <label><input type="radio" name="prep_after_m" v-model="formData.prep_after_sex" value="75%"/> 75%</label> <label><input type="radio" name="prep_after_m" v-model="formData.prep_after_sex" value="100%"/> 100%</label> </div>
           <label>6.a4 1st PrEP after sex (last month %)?</label>
           <div class="radio-group-vertical"> <label><input type="radio" name="first_after_m" v-model="formData.first_prep_after_sex" value="0%"/> 0%</label> <label><input type="radio" name="first_after_m" v-model="formData.first_prep_after_sex" value="25%"/> 25%</label> <label><input type="radio" name="first_after_m" v-model="formData.first_prep_after_sex" value="50%"/> 50%</label> <label><input type="radio" name="first_after_m" v-model="formData.first_prep_after_sex" value="75%"/> 75%</label> <label><input type="radio" name="first_after_m" v-model="formData.first_prep_after_sex" value="100%"/> 100%</label> </div>
           <label>6.a5 2nd PrEP after sex (last month %)?</label>
           <div class="radio-group-vertical"> <label><input type="radio" name="second_after_m" v-model="formData.second_prep_after_sex" value="0%"/> 0%</label> <label><input type="radio" name="second_after_m" v-model="formData.second_prep_after_sex" value="25%"/> 25%</label> <label><input type="radio" name="second_after_m" v-model="formData.second_prep_after_sex" value="50%"/> 50%</label> <label><input type="radio" name="second_after_m" v-model="formData.second_prep_after_sex" value="75%"/> 75%</label> <label><input type="radio" name="second_after_m" v-model="formData.second_prep_after_sex" value="100%"/> 100%</label> </div>

           <h3 class="section-title">ED-PrEP Recall (Last Week)</h3>
            <label>6.a6 Sex acts last week?</label>
            <div class="radio-group-vertical"> <label><input type="radio" name="sex_last_w" v-model="formData.sex_last_week" value="None"/> None</label> <label><input type="radio" name="sex_last_w" v-model="formData.sex_last_week" value="1-2 times"/> 1-2 times</label> <label><input type="radio" name="sex_last_w" v-model="formData.sex_last_week" value="More than twice"/> >2 times</label> <label><input type="radio" name="sex_last_w" v-model="formData.sex_last_week" value="Cannot remember"/> Cannot remember</label> <label><input type="radio" name="sex_last_w" v-model="formData.sex_last_week" value="No response"/> No response</label> </div>
            <label>6.a7 PrEP before sex (last week %)?</label>
            <div class="radio-group-vertical"> <label><input type="radio" name="prep_before_w" v-model="formData.prep_before_sex_week" value="0%"/> 0%</label> <label><input type="radio" name="prep_before_w" v-model="formData.prep_before_sex_week" value="25%"/> 25%</label> <label><input type="radio" name="prep_before_w" v-model="formData.prep_before_sex_week" value="50%"/> 50%</label> <label><input type="radio" name="prep_before_w" v-model="formData.prep_before_sex_week" value="75%"/> 75%</label> <label><input type="radio" name="prep_before_w" v-model="formData.prep_before_sex_week" value="100%"/> 100%</label> </div>
            <label>6.a8 1st PrEP after sex (last week %)?</label>
             <div class="radio-group-vertical"> <label><input type="radio" name="first_after_w" v-model="formData.first_prep_after_sex_week" value="0%"/> 0%</label> <label><input type="radio" name="first_after_w" v-model="formData.first_prep_after_sex_week" value="25%"/> 25%</label> <label><input type="radio" name="first_after_w" v-model="formData.first_prep_after_sex_week" value="50%"/> 50%</label> <label><input type="radio" name="first_after_w" v-model="formData.first_prep_after_sex_week" value="75%"/> 75%</label> <label><input type="radio" name="first_after_w" v-model="formData.first_prep_after_sex_week" value="100%"/> 100%</label> </div>
            <label>6.a9 2nd PrEP after sex (last week %)?</label>
            <div class="radio-group-vertical"> <label><input type="radio" name="second_after_w" v-model="formData.second_prep_after_sex_week" value="0%"/> 0%</label> <label><input type="radio" name="second_after_w" v-model="formData.second_prep_after_sex_week" value="25%"/> 25%</label> <label><input type="radio" name="second_after_w" v-model="formData.second_prep_after_sex_week" value="50%"/> 50%</label> <label><input type="radio" name="second_after_w" v-model="formData.second_prep_after_sex_week" value="75%"/> 75%</label> <label><input type="radio" name="second_after_w" v-model="formData.second_prep_after_sex_week" value="100%"/> 100%</label> </div>

           <h3 class="section-title">ED-PrEP Recall (Last Sex Act)</h3>
           <label>6.a10 PrEP intake prior to last sex?</label>
            <div class="radio-group-vertical">
               <label><input type="radio" v-model="formData.prep_before_last_sex" name="prep_before_last" value="Did not take PrEP"/> Didn't take</label>
               <label><input type="radio" v-model="formData.prep_before_last_sex" name="prep_before_last" value="One tablet before sex"/> 1 tablet before</label>
               <label><input type="radio" v-model="formData.prep_before_last_sex" name="prep_before_last" value="Two tablets before sex"/> 2 tablets before</label>
               <label><input type="radio" v-model="formData.prep_before_last_sex" name="prep_before_last" value="Continuing PrEP"/> Continuing PrEP</label>
               <label><input type="radio" v-model="formData.prep_before_last_sex" name="prep_before_last" value="Cannot remember"/> Cannot remember</label>
               <label><input type="radio" v-model="formData.prep_before_last_sex" name="prep_before_last" value="Other"/> Other</label>
               <textarea v-if="formData.prep_before_last_sex === 'Other'" v-model="formData.prep_before_last_sex_other" rows="3" placeholder="Specify"></textarea>
            </div>
           <label>6.a11 PrEP intake after last sex?</label>
            <div class="radio-group-vertical">
               <label><input type="radio" v-model="formData.prep_after_last_sex" name="prep_after_last" value="Did not take PrEP"/> Didn't take</label>
               <label><input type="radio" v-model="formData.prep_after_last_sex" name="prep_after_last" value="One tablet after sex"/> 1 tablet after</label>
               <label><input type="radio" v-model="formData.prep_after_last_sex" name="prep_after_last" value="Continued PrEP for 2 days"/> Continued PrEP 2 days</label>
               <label><input type="radio" v-model="formData.prep_after_last_sex" name="prep_after_last" value="Still taking PrEP"/> Still taking</label>
               <label><input type="radio" v-model="formData.prep_after_last_sex" name="prep_after_last" value="Cannot remember"/> Cannot remember</label>
               <label><input type="radio" v-model="formData.prep_after_last_sex" name="prep_after_last" value="Other"/> Other</label>
               <textarea v-if="formData.prep_after_last_sex === 'Other'" v-model="formData.prep_after_last_sex_other" rows="3" placeholder="Specify"></textarea>
            </div>
        </div>
      </div>

      <!-- Container 8: Adherence (General) -->
      <div class="form-container">
        <h3 class="section-title">SECTION 7: PrEP ADHERENCE (General)</h3>
        <label>7.1 Reminder methods (last month)? (Check all)</label>
         <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.pill_remember" value="Nothing" /> Nothing</label>
            <label><input type="checkbox" v-model="formData.pill_remember" value="Alarm/Cell phone" /> Alarm/Phone</label>
            <label><input type="checkbox" v-model="formData.pill_remember" value="My partner" /> Partner</label>
            <label><input type="checkbox" v-model="formData.pill_remember" value="Family member" /> Family</label>
            <label><input type="checkbox" v-model="formData.pill_remember" value="Association with having sex" /> Assoc. w/ sex</label>
            <label><input type="checkbox" v-model="formData.pill_remember" value="Association with taking other pills or medications" /> Assoc. w/ other meds</label>
            <label><input type="checkbox" v-model="formData.pill_remember" value="Other" /> Other</label>
            <textarea v-if="formData.pill_remember.includes('Other')" v-model="formData.pill_remember_other" rows="3" placeholder="Specify"></textarea>
         </div>

        <label>7.2 Missed pills status? (Check all)</label>
        <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.pill_missed" value="Did not miss pills" /> Did not miss</label>
            <label><input type="checkbox" v-model="formData.pill_missed" value="Did not have pills with me" /> Did not have pills</label>
         </div>

        <label>7.3 Reasons for missing (last month)? (Check all)</label>
         <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Felt sick/Concerned about getting sick" /> Felt sick</label>
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Side effects from pills" /> Side effects</label>
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Tired of taking pill every day" /> Tired of daily pill</label>
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Gave/sold/traded pills" /> Gave/sold/traded</label>
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Forgot/Too busy" /> Forgot/Busy</label>
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Partner/family did not approve" /> Partner/family disapprove</label>
            <label><input type="checkbox" v-model="formData.pill_missed_experiences" value="Other" /> Other</label>
            <textarea v-if="formData.pill_missed_experiences.includes('Other')" v-model="formData.pill_missed_experiences_other" rows="3" placeholder="Specify"></textarea>
         </div>
      </div>

       <!-- Container 9: Experience, Sharing, Continuation -->
      <div class="form-container">
        <h3 class="section-title">SECTION 8: Experience, Sharing, Continuation</h3>
        <label>8.1 Ease of remembering pills?</label>
         <div class="radio-group-vertical">
             <label><input type="radio" name="pill_remember_difficulty" v-model="formData.pill_remember_difficulty" value="Very easy" required /> Very easy</label>
             <label><input type="radio" name="pill_remember_difficulty" v-model="formData.pill_remember_difficulty" value="Easy" required /> Easy</label>
             <label><input type="radio" name="pill_remember_difficulty" v-model="formData.pill_remember_difficulty" value="Medium" required /> Medium</label>
             <label><input type="radio" name="pill_remember_difficulty" v-model="formData.pill_remember_difficulty" value="Difficult" required /> Difficult</label>
             <label><input type="radio" name="pill_remember_difficulty" v-model="formData.pill_remember_difficulty" value="Very difficult" required /> Very difficult</label>
         </div>

        <p><strong>Sharing of the drugs</strong></p>
        <label>8.2 Pills shared (last month)?</label>
        <div class="radio-group-vertical">
            <label><input type="radio" name="pill_sharing" v-model="formData.pill_sharing" value="All of them" required /> All</label>
            <label><input type="radio" name="pill_sharing" v-model="formData.pill_sharing" value="Most of them" required /> Most</label>
            <label><input type="radio" name="pill_sharing" v-model="formData.pill_sharing" value="Some of them" required /> Some</label>
            <label><input type="radio" name="pill_sharing" v-model="formData.pill_sharing" value="None of them" required /> None</label>
        </div>

        <label>8.3 Shared pills with? (Check all)</label>
        <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.pill_recipient" value="Partner" /> Partner</label>
            <label><input type="checkbox" v-model="formData.pill_recipient" value="Family member" /> Family</label>
            <label><input type="checkbox" v-model="formData.pill_recipient" value="Relative" /> Relative</label>
            <label><input type="checkbox" v-model="formData.pill_recipient" value="Friend" /> Friend</label>
            <label><input type="checkbox" v-model="formData.pill_recipient" value="Other" /> Other</label>
            <textarea v-if="formData.pill_recipient.includes('Other')" v-model="formData.pill_recipient_other" rows="3" placeholder="Specify"></textarea>
         </div>

        <p><strong>Continuation/discontinue PrEP</strong></p>
        <label>8.4 Continue PrEP (next 3 months)?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_continue" name="prep_continue" value="Yes" required /> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_continue" name="prep_continue" value="No" required /> No</label>
        </div>

        <div v-if="formData.prep_continue === 'No'">
           <label>8.5 Reason for discontinuing? (Check all)</label>
           <div class="checkbox-group-vertical">
               <label><input type="checkbox" v-model="formData.prep_discontinue_reason" value="Do not like taking PrEP" /> Don't like</label>
               <label><input type="checkbox" v-model="formData.prep_discontinue_reason" value="Side effects from PrEP" /> Side effects</label>
               <label><input type="checkbox" v-model="formData.prep_discontinue_reason" value="Difficult to remember" /> Difficult to remember</label>
               <label><input type="checkbox" v-model="formData.prep_discontinue_reason" value="Other" /> Other</label>
               <textarea v-if="formData.prep_discontinue_reason.includes('Other')" v-model="formData.prep_discontinue_reason_other" rows="3" placeholder="Specify"></textarea>
           </div>
        </div>
      </div>

      <!-- Container 10: Program Exposure -->
       <div class="form-container">
          <h3 class="section-title">SECTION 9: Program Exposure</h3>
          <label>9.1 Visited Pride Bhutan office (last 3m, non-PrEP reasons)?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.visited_pride_bhutan" name="visit_pride" value="Yes" required /> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.visited_pride_bhutan" name="visit_pride" value="No" required /> No (Skip next)</label>
          </div>
          <div v-if="formData.visited_pride_bhutan === 'Yes'" class="conditional-section">
             <label>9.2 For HIV testing?</label>
              <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" name="pride_hiv" v-model="formData.hiv_testing_reason" value="Yes"/> Y</label><label><input type="radio" name="pride_hiv" v-model="formData.hiv_testing_reason" value="No"/> N</label></div>
             <label>9.3 For STI testing?</label>
             <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" name="pride_sti" v-model="formData.sti_testing_reason" value="Yes"/> Y</label><label><input type="radio" name="pride_sti" v-model="formData.sti_testing_reason" value="No"/> N</label></div>
             <label>9.4 Other Reason:</label>
             <textarea v-model="formData.other_reason_visited" rows="2" placeholder="Specify"></textarea>
          </div>

           <!-- Monthly Visit Conditional Section -->
           <template v-if="isMonthOneVisit">
               <label>9.5 Met ORW in field (last 1 month)?</label>
               <div class="radio-group-vertical">
                   <label><input type="radio" v-model="formData.orw_meeting_one" name="orw_meet_1m" value="None" required /> None</label>
                   <label><input type="radio" v-model="formData.orw_meeting_one" name="orw_meet_1m" value="Once a week" required /> ~1/week</label>
                   <label><input type="radio" v-model="formData.orw_meeting_one" name="orw_meet_1m" value="two weeks" required /> ~1/2 weeks</label>
                   <label><input type="radio" v-model="formData.orw_meeting_one" name="orw_meet_1m" value="Once a month" required /> ~1/month</label>
                   <label><input type="radio" v-model="formData.orw_meeting_one" name="orw_meet_1m" value="Cannot remember" required /> Cannot remember</label>
                   <label><input type="radio" v-model="formData.orw_meeting_one" name="orw_meet_1m" value="No response" required /> No response</label>
               </div>
           </template>

           <!-- Quarterly Visit Conditional Section -->
            <template v-if="!isMonthOneVisit"> <!-- Show for M3, M6, M9, M12 -->
               <label>9.6 Met ORW in field (last 3 months)?</label>
               <div class="radio-group-vertical">
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="None" required /> None</label>
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="Once a week" required /> ~1/week</label>
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="two weeks" required /> ~1/fortnight</label>
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="Once a month" required /> ~1/month</label>
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="1-3 months" required /> ~1 in 1-3 months</label>
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="Cannot remember" required /> Cannot remember</label>
                   <label><input type="radio" v-model="formData.orw_meeting_three" name="orw_meet_3m" value="No response" required /> No response</label>
               </div>
           </template>

          <label>9.7 Received condoms from HISC?</label>
           <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" v-model="formData.received_condoms" name="recv_condoms" value="Yes" required /> Yes</label><label><input type="radio" v-model="formData.received_condoms" name="recv_condoms" value="No" required /> No</label></div>
          <label>9.8 Received lubricants from HISC?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" v-model="formData.received_lubricants" name="recv_lube" value="Yes" required /> Yes</label><label><input type="radio" v-model="formData.received_lubricants" name="recv_lube" value="No" required /> No</label></div>
      </div>

      <!-- Container 11: Alcohol & Drug Use -->
      <div class="form-container">
        <h3 class="section-title">SECTION 10: Alcohol and Drug Use</h3>
        <p style="font-style: italic; color: #555;">[Recreational drug definition...]</p>
        <label>10.1 Consumed alcohol (last 3 months)?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" v-model="formData.consumed_alcohol" name="consume_alc" value="Yes" required /> Yes</label><label><input type="radio" v-model="formData.consumed_alcohol" name="consume_alc" value="No" required /> No (Skip 10.2, 10.3)</label></div>
        <div v-if="formData.consumed_alcohol === 'Yes'" class="conditional-section">
            <label for="alcohol_days">10.2 Days consumed alcohol (last week)?</label>
            <input type="number" id="alcohol_days" v-model.number="formData.alcohol_days" min="0" placeholder="Days" required />
            <label>10.3 Alcohol before/during last sex?</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" name="alc_sex" v-model="formData.alcohol_before_during_sex" value="Yes" required /> Yes</label><label><input type="radio" name="alc_sex" v-model="formData.alcohol_before_during_sex" value="No" required /> No</label></div>
        </div>
        <label>10.4 Taken recreational drugs (last 12 months)?</label>
        <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" v-model="formData.taken_drugs" name="take_drugs" value="Yes" required /> Yes</label><label><input type="radio" v-model="formData.taken_drugs" name="take_drugs" value="No" required /> No (Skip 10.5)</label></div>
        <div v-if="formData.taken_drugs === 'Yes'" class="conditional-section">
            <label>10.5 Drugs before/during last sex?</label>
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" name="drugs_sex" v-model="formData.drugs_before_during_sex" value="Yes" required /> Yes</label><label><input type="radio" name="drugs_sex" v-model="formData.drugs_before_during_sex" value="No" required /> No</label></div>
        </div>
      </div>

      <!-- Submit Button outside the last container -->
      <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Review Data' }}
      </button>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form4_ConfirmationModal v-if="isReviewModalVisible" 
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
import { ref, onMounted, watch, computed } from 'vue'; // Added computed
import axios from 'axios';
// Import the NEW modal component
import Form4_ConfirmationModal from './Form4_ConfirmationModal.vue'; // Adjust path if needed

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhYgC8w3iP7ByzKTMmuatXits30ilyeucQVgQiAL4mCa-o03zQ9p4_azNyzbuf00sj5Q/exec'; // Replace with Form 4 Script URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?gid=0&single=true&output=csv"; // UID validation source
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  participant_uid: '', prep_site: 'CHD/JDWNRH/Thimphu', date: '', type_of_visit: 'mst',
  interviewer_name: '', designation: '', bhmc_registration: '', interview_status: '',
  // Sec 1
  occupation_status: '', occupation_other: '', marital_status: '', marital_other: '',
  live_with_partner: '', partner_gender: [],
  // Sec 2
  sti_risk: '', hiv_risk: '', hiv_risk_management: [], other_hiv_risk: '', partner_hiv_status: '',
  // Sec 3
  steady_anal_partners: null, casual_anal_partners: null, transactional_anal_partners: null, anal_sex: '',
  steady_vaginal_partners: null, casual_vaginal_partners: null, transactional_vaginal_partners: null, vaginal_sex: '',
  condom_used_last_time: '', days_sex_regular_partner: [], sex_regular_partner: '', condom_use_regular_clients: '',
  transactional_partners: '', num_clients_last_week: null, days_sex_clients: [], condom_use_clients: '',
  last_sex_clients_condom_use: '', condomless_sex_reason: [], condomless_other_reason: '', prep_change_condom_use: '',
  // Sec 4
  dosing_regimen: '', change_regimen: '', reason_change: '',
  nausea: '', nausea_ongoing: false, nausea_resolved: false,
  vomiting: '', vomiting_ongoing: false, vomiting_resolved: false,
  fatigue: '', fatigue_ongoing: false, fatigue_resolved: false,
  dizziness: '', dizziness_ongoing: false, dizziness_resolved: false,
  headache: '', headache_ongoing: false, headache_resolved: false,
  rash: '', rash_ongoing: false, rash_resolved: false,
  abdominal_pain: '', abdominal_pain_ongoing: false, abdominal_pain_resolved: false,
  weight_loss: '', weight_loss_ongoing: false, weight_loss_resolved: false,
  no_response: '', other_symptoms: '', other_symptoms_specified: '',
  // Sec 5 (Daily)
  prep_reason: '', other_reason: '', day_1_pill: '', day_2_pill: '', day_3_pill: '', day_4_pill: '', day_5_pill: '', day_6_pill: '', day_7_pill: '',
  pill_time: '', pill_time_other: '', pill_frequency: '', pill_reminder: '', pill_reminder_other: '',
  missed_pill_reasons: [], missed_pill_other_reason: '', longest_no_pill: null, total_no_pill_days: null,
  // Sec 6 (Event-Driven)
  ed_prep_reason: '', other_ed_prep_reason: '', sex_last_month: '', prep_before_sex: '', prep_after_sex: '',
  first_prep_after_sex: '', second_prep_after_sex: '', sex_last_week: '', prep_before_sex_week: '',
  first_prep_after_sex_week: '', second_prep_after_sex_week: '', prep_before_last_sex: '',
  prep_before_last_sex_other: '', prep_after_last_sex: '', prep_after_last_sex_other: '',
  // Sec 7
  pill_remember: [], pill_remember_other: '', pill_missed: [], pill_missed_experiences: [], pill_missed_experiences_other: '',
  // Sec 8
  pill_remember_difficulty: '', pill_sharing: '', pill_recipient: [], pill_recipient_other: '',
  prep_continue: '', prep_discontinue_reason: [], prep_discontinue_reason_other: '',
  // Sec 9
  visited_pride_bhutan: '', hiv_testing_reason: '', sti_testing_reason: '', other_reason_visited: '',
  orw_meeting_one: '', orw_meeting_three: '', received_condoms: '', received_lubricants: '',
  // Sec 10
  consumed_alcohol: '', alcohol_days: null, alcohol_before_during_sex: '',
  taken_drugs: '', drugs_before_during_sex: ''
});

const statusMessage = ref(''); const statusClass = ref('');
const submitDisabled = ref(true); const isCheckingUid = ref(false); const isSubmitting = ref(false);
const isReviewModalVisible = ref(false); const modalSuccessMessage = ref(''); const modalErrorMessage = ref('');
const finalSubmitMessage = ref(''); const finalSubmitClass = ref('');
const successMessage = ref(''); const errorMessage = ref(''); // General messages
let csvData = [];

// --- Computed Properties ---
const hasAnalPartners = computed(() => {
    return (formData.value.steady_anal_partners ?? 0) > 0 ||
           (formData.value.casual_anal_partners ?? 0) > 0 ||
           (formData.value.transactional_anal_partners ?? 0) > 0;
});
const hasVaginalPartners = computed(() => {
    return (formData.value.steady_vaginal_partners ?? 0) > 0 ||
           (formData.value.casual_vaginal_partners ?? 0) > 0 ||
           (formData.value.transactional_vaginal_partners ?? 0) > 0;
});
// Computed property to check if the visit type is 'End of M1'
const isMonthOneVisit = computed(() => formData.value.type_of_visit === 'End of M1');


// --- Functions ---
const initializeDate = () => { formData.value.date = new Date().toISOString().split('T')[0]; };
const fetchCsvData = async () => { /* ... same as before ... */
    isCheckingUid.value = true; statusMessage.value = 'Loading validation data...'; statusClass.value = ''; submitDisabled.value = true;
      try {
        const response = await fetch(CSV_DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();
        csvData = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        console.log("CSV Data Loaded for Form 4");
        statusMessage.value = 'Validation data loaded. Please enter UID.';
        if(formData.value.participant_uid) validateUidOnInput(formData.value.participant_uid);
        else submitDisabled.value = true;
      } catch (error) {
        console.error('Error fetching CSV data for Form 4:', error);
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
  // Check if interview terminated
  if (formData.value.interview_status === 'Terminate') {
      errorMessage.value = "Interview terminated. Cannot submit."; // Show general message
      return; // Prevent opening modal
  }
  modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  isReviewModalVisible.value = true;
};
const cancelReview = () => { isReviewModalVisible.value = false; };

// Submission
const confirmAndSubmit = async () => {
   // Double check termination status
  if (formData.value.interview_status === 'Terminate') {
      modalErrorMessage.value = 'Interview terminated. Form cannot be submitted.';
      return;
  }

  isSubmitting.value = true; modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  const url = GOOGLE_SCRIPT_URL;
  try {
    const dataToSend = { ...formData.value };
    // Format arrays and booleans for submission
    Object.keys(dataToSend).forEach(key => {
      if (Array.isArray(dataToSend[key])) {
        dataToSend[key] = dataToSend[key].join('; '); // Use semicolon or comma
      } else if (typeof dataToSend[key] === 'boolean') {
        dataToSend[key] = dataToSend[key] ? 'Yes' : 'No';
      }
    });

    const formDataSerialized = new URLSearchParams(dataToSend).toString();
    // Use fetch with 'no-cors' as in the original submitForm
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formDataSerialized,
        mode: 'no-cors' // Important for simple GAS endpoints
    });

    // Assume success with no-cors if no error thrown
    modalSuccessMessage.value = 'Form submitted successfully (response not readable due to CORS).';
     setTimeout(() => {
        isReviewModalVisible.value = false; setFinalMessage('Form submitted successfully!', 'success');
        clearForm(); statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; modalSuccessMessage.value = '';
      }, SUBMIT_SUCCESS_DELAY);

  } catch (error) {
    console.error('Form 4 Submit Error:', error);
    let detailedError = 'Error submitting Form 4.';
    // Note: With no-cors, detailed server errors might not be available here
    modalErrorMessage.value = detailedError + " Please check network or contact support.";
  } finally {
    isSubmitting.value = false;
  }
};

// Side Effect Checkbox Handler
const handleSideEffectCheck = (effect, type) => {
    const ongoingKey = `${effect}_ongoing`; const resolvedKey = `${effect}_resolved`;
    if (type === 'ongoing' && formData.value[ongoingKey]) formData.value[resolvedKey] = false;
    else if (type === 'resolved' && formData.value[resolvedKey]) formData.value[ongoingKey] = false;
};

// Clear Form
const clearForm = () => {
    const interviewerDetails = { interviewer_name: formData.value.interviewer_name, designation: formData.value.designation, bhmc_registration: formData.value.bhmc_registration };
    Object.keys(formData.value).forEach(key => {
         if (key in interviewerDetails || key === 'date') return;
         if (Array.isArray(formData.value[key])) formData.value[key] = [];
         else if (typeof formData.value[key] === 'boolean') formData.value[key] = false;
         else if (typeof formData.value[key] === 'number') formData.value[key] = null;
         else if (key === 'prep_site') formData.value[key] = 'CHD/JDWNRH/Thimphu'; // Reset default
         else if (key === 'type_of_visit') formData.value[key] = 'mst'; // Reset default
         else formData.value[key] = '';
    });
    Object.assign(formData.value, interviewerDetails); initializeDate();
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
    formData.value.interviewer_name = loggedInUser.fullname || '';
    formData.value.designation = loggedInUser.designation || '';
    formData.value.bhmc_registration = loggedInUser.bhcno || '';
  } else {
      console.warn("Form 4: Logged in user details not found.");
       formData.value.interviewer_name = ''; formData.value.designation = ''; formData.value.bhmc_registration = '';
  }
});
</script>

<style>
/* Keep the original styles provided */
.form-container { padding: 2rem; background-color: #fff; border-radius: 10px; box-shadow: 4px 4px 4px 8px rgba(0, 0, 0, 0.1); margin-bottom: 2rem; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input, select, textarea { width: 100%; padding: 0.5rem; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 0.95rem; }
input:focus, select:focus, textarea:focus { border-color: #3498db; outline: none; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }
input[readonly] { background-color: #f8f9fa; cursor: not-allowed; }
input[type="radio"], input[type="checkbox"] { width: auto; margin-right: 8px; vertical-align: middle; }
label > input[type="radio"], label > input[type="checkbox"] { margin-bottom: 0; }
.radio-group-vertical, .checkbox-group-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #fdfdfd; }
.radio-group-vertical label, .checkbox-group-vertical label { font-weight: normal; display: inline-flex; align-items: center; margin-bottom: 0; }
.partner-count-group label { display: inline-block; width: auto; margin-right: 10px; margin-bottom: 10px; }
.partner-count-group input[type="number"] { width: 80px; display: inline-block; margin-left: 5px; }
.pill-recall-grid { display: grid; grid-template-columns: auto 1fr; gap: 5px 15px; align-items: center; margin-bottom: 15px;}
.pill-recall-grid label { margin-bottom: 0;}
.pill-recall-grid div { display: flex; gap: 10px; }
.pill-recall-grid div label { font-weight: normal; }

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
.final-message { max-width: 700px; margin: 20px auto; padding: 15px 20px; border-radius: 5px; text-align: center; font-weight: 500; }
.final-message.success-final { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.final-message.error-final { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
.conditional-section { margin-left: 15px; padding-left: 15px; border-left: 2px solid #e0e0e0; margin-top: 10px; padding-top: 10px; }
</style>