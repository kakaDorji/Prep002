<template>
  <!-- eixt Form -->
  <form @submit.prevent="showReviewModal"> <!-- Changed submit action -->

    <div class="container">
      <!-- Container 1: Basic Info -->
      <div class="form-container">
        <label for="participant_uid">Participant UID:</label>
        <input type="text" v-model="formData.participant_uid" id="participant_uid" name="participant_uid" required
          pattern="[A-Za-z0-9]{5,}" title="Minimum 5 Alphanumeric characters only" />
        <div v-if="statusMessage" id="status-message" :class="statusClass">{{ statusMessage }}</div>
         <span v-if="isCheckingUid" class="uid-spinner"><i class="fas fa-spinner fa-spin"></i> Checking...</span>

        <label for="dateInput">Date:</label>
        <input type="date" v-model="formData.date" id="dateInput" name="date" readonly />

        <label for="prep_site">PrEP site:</label>
        <select v-model="formData.prep_site" name="prep_site" id="prep_site" required>
          <option value="" disabled>Select a PrEP site</option>
          <option value="CHD/JDWNRH/Thimphu">CHD/JDWNRH/ Thimphu</option>
          <option value="HISC/Thimphu">HISC/Thimphu</option>
          <option value="Paro Hospital/Paro">Paro Hospital/ Paro</option>
          <option value="Phuntsholing Hospital/Chukha">Phuntsholing hospital/Chukha</option>
          <option value="HISC/Phuntsholing">HISC /Phuntsholing</option>
          <option value="CRRH/Gelephu/Sarpang">CRRH /Gelephu / Sarpang</option>
          <option value="HISC/Gelephu">HISC/ Gelephu</option>
        </select>

        <p style="margin-top: 1rem; font-style: italic; color: #555; line-height: 1.5;">
          My name is {{ formData.interviewer_name || '[Interviewer Name]' }} I am working as
          {{ formData.designation || '[Designation]' }} and I am associated with the Phased Implementation of PrEP in {{ formData.location || '[Location]'}}
          among members of key population.
          <br> <br> As part of the Phased Implementation, I will be asking you some personal questions regarding your
          daily schedule and sexual habits, networks, etc. I would like to inform you that some people may find it
          difficult to answer. Please be assured that all of your answers and personal details are completely
          confidential. Your name will not be written on this form and will never be used in connection with any of the
          information you share with us. You do not have to answer any questions that you do not want to answer, and you
          may end this interview at any time you want to. However, your honest answers to these questions will help us
          better understand what people think, say and do about certain kinds of behaviors. We would greatly appreciate
          your help in responding to this survey. The interview will take about 20 minutes to ask the questions. Would
          you be willing to participate?” If “NO”, terminate the interview. If “YES”, continue with the interview.
        </p> <br>

        <label>TYPE OF VISIT: (Exit Form - Typically M12)</label>
         <div class="radio-group-vertical" style="border: none; padding: 0; background: none;">
            <!-- Only Exit/M12 option shown -->
            <label><input type="radio" v-model="formData.visit_type" name="visit_type" value="End of M12" required/> END OF M12 (Exit)</label>
         </div>


        <label for="interviewer_name">INTERVIEWER’S NAME:</label>
        <input type="text" v-model="formData.interviewer_name" id="interviewer_name" name="interviewer_name" readonly />

        <label for="designation">DESIGNATION:</label>
        <input type="text" v-model="formData.designation" id="designation" name="designation" readonly />

        <label for="bmhc_number">BMHC Number:</label>
        <input type="text" v-model="formData.bmhc_number" id="bmhc_number" name="bmhc_number" readonly />

        <label>STATUS OF THE INTERVIEW:</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.interview_status" name="interview_status" value="PROGRESS" required /> PROGRESS</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.interview_status" name="interview_status" value="TERMINATE" required /> TERMINATE</label>
        </div>
      </div>

      <!-- Container 2: Socio-Demographics -->
      <div class="form-container">
        <h3 class="section-title">SECTION 1: SOCIO-DEMOGRAPHIC QUESTIONS</h3>
        <label>1.1 Current occupation status:</label>
         <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="None" required/> None</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Student" /> Student</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Fulltime" /> Full-time job</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Parttime" /> Part-time job</label>
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="Other" /> Other</label>
            <input type="text" v-if="formData.occupation_status === 'Other'" v-model="formData.occupation_other" placeholder="Specify if other" />
            <label><input type="radio" v-model="formData.occupation_status" name="occupation_status" value="No response" /> No response</label>
         </div>

        <label>1.2 What is your current marital status:</label>
        <div class="radio-group-vertical">
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Never married" required/> Never married</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Currently married" /> Currently married</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Widowed" /> Widowed</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Divorced" /> Divorced</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Separated" /> Separated</label>
            <label><input type="radio" v-model="formData.marital_status" name="marital_status" value="Other" /> Others</label>
            <input type="text" v-if="formData.marital_status === 'Other'" v-model="formData.marital_other" placeholder="Specify if other" />
        </div>

        <label>1.3 Do you currently live with your sex partner:</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.live_with_partner" name="live_partner" value="Yes" required/> Yes</label>
          <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.live_with_partner" name="live_partner" value="No" /> No (Skip 1.4)</label>
        </div>

        <div v-if="formData.live_with_partner === 'Yes'">
          <label>1.4 If so, is your sex partner male, female, or TG? (tick all that apply):</label>
          <div class="checkbox-group-vertical">
              <label><input type="checkbox" v-model="formData.partner_gender" value="Male"> Male</label>
              <label><input type="checkbox" v-model="formData.partner_gender" value="Female"> Female</label>
              <label><input type="checkbox" v-model="formData.partner_gender" value="Transgender"> Transgender</label>
           </div>
        </div>
      </div>

       <!-- Container 3: Risk Perception -->
       <div class="form-container">
          <h3 class="section-title">SECTION 2: RISK PERCEPTION</h3>
          <label>2.1 Risk of getting STI? (Score 1-5):</label>
          <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="1" required/> 1 - very low</label>
              <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="2" required/> 2 - low</label>
              <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="3" required/> 3 - medium</label>
              <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="4" required/> 4 - high</label>
              <label><input type="radio" v-model="formData.sti_risk" name="sti_risk" value="5" required/> 5 - very high</label>
          </div>
          <label>2.2 Risk of getting HIV? (Score 1-5):</label>
          <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="1" required/> 1 - very low</label>
              <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="2" required/> 2 - low</label>
              <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="3" required/> 3 - medium</label>
              <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="4" required/> 4 - high</label>
              <label><input type="radio" v-model="formData.hiv_risk" name="hiv_risk" value="5" required/> 5 - very high</label>
           </div>
          <label>2.3 Partner's HIV status?</label>
          <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_status" value="No" required/> No, I do not know</label>
              <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_status" value="Not positive" required/> Yes, Partner NOT HIV+</label>
              <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_status" value="Positive on ART" required/> Yes, Partner HIV+ & on ART</label>
              <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_status" value="Positive not on ART" required/> Yes, Partner HIV+ & NOT on ART</label>
              <label><input type="radio" v-model="formData.partner_hiv_status" name="partner_status" value="No response" required/> No response</label>
           </div>
       </div>

      <!-- Container 4: Sexual Behavior -->
      <div class="form-container">
        <h3 class="section-title">SECTION 3: SEXUAL BEHAVIOR</h3>
        <p style="font-style: italic; color: #555; margin-bottom: 1rem;">[Confidentiality reminder text...]</p>

         <label>3.1 Anal sex partners (last month)? (0 if none)</label>
          <div class="partner-count-group">
             <label>Steady partners: <input type="number" v-model.number="formData.steady_anal_partners" min="0" required/></label>
             <label>Casual Partners: <input type="number" v-model.number="formData.casual_anal_partners" min="0" required/></label>
             <label>Transactional partners: <input type="number" v-model.number="formData.transactional_anal_partners" min="0" required/></label>
          </div>
          <div class="radio-group-vertical" style="margin-top: 10px;">
             <label><input type="radio" v-model="formData.anal_sex" name="anal_sex_status" value="Never" :disabled="hasAnalPartners" required /> Never have anal sex</label>
             <label><input type="radio" v-model="formData.anal_sex" name="anal_sex_status" value="No response" :disabled="hasAnalPartners" required /> No Response</label>
           </div>

         <label>3.2 Vaginal sex partners (last month)? (0 if none)</label>
          <div class="partner-count-group">
             <label>Steady partners: <input type="number" v-model.number="formData.steady_vaginal_partners" min="0" required/></label>
             <label>Casual Partners: <input type="number" v-model.number="formData.casual_vaginal_partners" min="0" required/></label>
             <label>Transactional partners: <input type="number" v-model.number="formData.transactional_vaginal_partners" min="0" required/></label>
          </div>
          <div class="radio-group-vertical" style="margin-top: 10px;">
             <label><input type="radio" v-model="formData.vaginal_sex" name="vaginal_sex_status" value="Never" :disabled="hasVaginalPartners" required /> Never have vaginal sex</label>
             <label><input type="radio" v-model="formData.vaginal_sex" name="vaginal_sex_status" value="No response" :disabled="hasVaginalPartners" required /> No Response</label>
           </div>

        <label>3.3 Sex days w/ regular partner (last week)?</label>
         <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 1"> Day 1 (Yesterday)</label>
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 2"> Day 2</label>
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 3"> Day 3</label>
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 4"> Day 4</label>
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 5"> Day 5</label>
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 6"> Day 6</label>
            <label><input type="checkbox" v-model="formData.sex_days" value="Day 7"> Day 7</label>
         </div>
          <label style="margin-top: 0.5rem;"><input type="radio" v-model="formData.no_sex_with_regular_partner" name="no_sex_regular" value="No" required/> Did not have sex w/ regular partner(s)</label>

         <label>3.4 Condom use w/ regular clients (last week)?</label>
         <div class="radio-group-vertical">
             <label><input type="radio" v-model="formData.regular_condom_use" name="reg_condom_use" value="Always" required/> Always</label>
             <label><input type="radio" v-model="formData.regular_condom_use" name="reg_condom_use" value="Most" /> Most</label>
             <label><input type="radio" v-model="formData.regular_condom_use" name="reg_condom_use" value="Half" /> Half</label>
             <label><input type="radio" v-model="formData.regular_condom_use" name="reg_condom_use" value="Sometimes" /> Sometimes</label>
             <label><input type="radio" v-model="formData.regular_condom_use" name="reg_condom_use" value="Rarely" /> Rarely</label>
             <label><input type="radio" v-model="formData.regular_condom_use" name="reg_condom_use" value="Never" /> Never</label>
          </div>

         <label>3.5 Condom use last time (regular partner/s)?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.last_sex_condom_use" name="last_sex_condom_reg" value="Yes" required/> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.last_sex_condom_use" name="last_sex_condom_reg" value="No" /> No</label>
          </div>

         <label>3.6 Do you have clients?</label>
          <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.have_clients" name="have_clients" value="Yes" required/> Yes</label>
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.have_clients" name="have_clients" value="No" /> No</label>
          </div>

         <!-- Conditional Client Questions -->
          <div v-if="formData.have_clients === 'Yes'">
             <label>3.7 Clients last week? (0 if none)</label>
             <input type="number" v-model.number="formData.clients_last_week" min="0" required/>
             <label>3.8 Days sex w/ clients (last week)?</label>
              <div class="checkbox-group-vertical">
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 1"> Day 1</label>
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 2"> Day 2</label>
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 3"> Day 3</label>
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 4"> Day 4</label>
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 5"> Day 5</label>
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 6"> Day 6</label>
                 <label><input type="checkbox" v-model="formData.sex_days_clients" value="Day 7"> Day 7</label>
              </div>
              <label style="margin-top: 0.5rem;"><input type="radio" v-model="formData.no_sex_with_clients" name="no_sex_client" value="No" required/> Did not have sex w/ clients</label>
              <label>3.9 Condom use w/ clients (last week)?</label>
              <div class="radio-group-vertical">
                  <label><input type="radio" v-model="formData.clients_condom_use" name="client_condom_use" value="Always" required/> Always</label>
                  <label><input type="radio" v-model="formData.clients_condom_use" name="client_condom_use" value="Most" /> Most</label>
                  <label><input type="radio" v-model="formData.clients_condom_use" name="client_condom_use" value="Half" /> Half</label>
                  <label><input type="radio" v-model="formData.clients_condom_use" name="client_condom_use" value="Sometimes" /> Sometimes</label>
                  <label><input type="radio" v-model="formData.clients_condom_use" name="client_condom_use" value="Rarely" /> Rarely</label>
                  <label><input type="radio" v-model="formData.clients_condom_use" name="client_condom_use" value="Never" /> Never</label>
               </div>
              <label>3.10 Condom use last time (clients)?</label>
               <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
                  <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.last_sex_with_clients_condom_use" name="last_sex_condom_client" value="Yes" required/> Yes</label>
                  <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.last_sex_with_clients_condom_use" name="last_sex_condom_client" value="No" /> No</label>
               </div>
          </div>

         <label>3.11 Reasons for sex without condom? (Select all)</label>
         <div class="checkbox-group-vertical">
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Feels good without condom"> Doesn't feel good</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Forgot"> Forgot</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="No condom"> No condom</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Know HIV status"> Know HIV status</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Taking PrEP"> Taking PrEP</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Expensive"> Expensive</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Embarrassed"> Embarrassed</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Do not trust condoms"> Don't trust</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Partner does not like condoms"> Partner doesn't like</label>
             <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Trust partner"> Trust partner</label>
            <label><input type="checkbox" v-model="formData.sex_without_condom_reason" value="Other"> Other</label>
             <input type="text" v-if="formData.sex_without_condom_reason.includes('Other')" v-model="formData.sex_without_condom_reason_other" placeholder="Specify">
          </div>

         <label>3.12 PrEP changed condom use?</label>
         <div style="display: flex; gap: 20px; margin-bottom: 1rem;">
             <label style="display: inline-flex; align-items: center; font-weight: normal; margin-bottom: 0;"><input type="radio" v-model="formData.prep_change_condom_use" name="prep_change_condom" value="Yes" required/> Yes</label>
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

      <!-- Container 9: Experience, Sharing -->
       <div class="form-container">
           <h3 class="section-title">SECTION 8: Experience, Sharing</h3>
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
           <!-- ORW Meeting questions removed for Exit Form -->
           <label>9.6 Have you received any condoms from HISC?</label> <!-- Renumbered -->
            <div style="display: flex; gap: 20px; margin-bottom: 1rem;"><label><input type="radio" v-model="formData.received_condoms" name="recv_condoms" value="Yes" required /> Yes</label><label><input type="radio" v-model="formData.received_condoms" name="recv_condoms" value="No" required /> No</label></div>
           <label>9.7 Have you received any lubricants from HISC?</label> <!-- Renumbered -->
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

       <!-- Container 12: Experience & Suggestions -->
        <div class="form-container">
          <h3 class="section-title">SECTION 11: EXPERIENCE AND SUGGESTIONS</h3>
          <p>The following statements are about how you experienced PrEP...</p>
          <label>11.1 Taking PrEP makes me feel...</label>
          <div class="radio-group-vertical">
              <label><input type="radio" v-model="formData.protection_feeling" name="prot_feel" value="Strongly disagree" required /> Strongly disagree</label>
              <label><input type="radio" v-model="formData.protection_feeling" name="prot_feel" value="Disagree" /> Disagree</label>
              <label><input type="radio" v-model="formData.protection_feeling" name="prot_feel" value="Neutral/uncertain" /> Neutral</label>
              <label><input type="radio" v-model="formData.protection_feeling" name="prot_feel" value="Agree" /> Agree</label>
              <label><input type="radio" v-model="formData.protection_feeling" name="prot_feel" value="Strongly agree" /> Strongly agree</label>
           </div>
          <label>11.2 When taking PrEP I did not bother...</label>
           <div class="radio-group-vertical">
               <label><input type="radio" v-model="formData.sti_concern" name="sti_concern" value="Strongly disagree" required /> Strongly disagree</label>
               <label><input type="radio" v-model="formData.sti_concern" name="sti_concern" value="Disagree" /> Disagree</label>
               <label><input type="radio" v-model="formData.sti_concern" name="sti_concern" value="Neutral/uncertain" /> Neutral</label>
               <label><input type="radio" v-model="formData.sti_concern" name="sti_concern" value="Agree" /> Agree</label>
               <label><input type="radio" v-model="formData.sti_concern" name="sti_concern" value="Strongly agree" /> Strongly agree</label>
            </div>
          <label>11.3 PrEP package opinion?</label>
           <div class="radio-group-vertical">
               <label><input type="radio" v-model="formData.prep_package_opinion" name="pkg_opinion" value="I think it is necessary" required /> Necessary</label>
               <label><input type="radio" v-model="formData.prep_package_opinion" name="pkg_opinion" value="I think it would be good" /> Good</label>
               <label><input type="radio" v-model="formData.prep_package_opinion" name="pkg_opinion" value="No opinion/Uncertain" /> No opinion</label>
               <label><input type="radio" v-model="formData.prep_package_opinion" name="pkg_opinion" value="I think that won’t be good" /> Not good</label>
               <label><input type="radio" v-model="formData.prep_package_opinion" name="pkg_opinion" value="I think it is unnecessary" /> Unnecessary</label>
            </div>
          <label>11.4 What did you like...?</label>
           <div class="checkbox-group-vertical">
                <label><input type="checkbox" v-model="formData.participation_likes" value="Additional protection against HIV" /> Protection vs HIV</label>
                <label><input type="checkbox" v-model="formData.participation_likes" value="Information on HIV and STI protection" /> Info HIV/STI</label>
                <label><input type="checkbox" v-model="formData.participation_likes" value="Counseling" /> Counseling</label>
                <label><input type="checkbox" v-model="formData.participation_likes" value="Routine tests" /> Routine tests</label>
                <label><input type="checkbox" v-model="formData.participation_likes" value="Routine visit to the doctor" /> Routine doctor visit</label>
                <label><input type="checkbox" v-model="formData.participation_likes" value="Other" /> Other</label>
                <textarea v-if="formData.participation_likes.includes('Other')" v-model="formData.participation_likes_other" rows="3" placeholder="Specify"></textarea>
           </div>
          <label>11.5 Major challenges...?</label>
           <div class="checkbox-group-vertical">
                <label><input type="checkbox" v-model="formData.participation_challenges" value="No challenges faced" /> No challenges</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="My partner did not approve" /> Partner disapprove</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="Collecting PrEP each month was difficult" /> Collecting difficult</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="Remembering to take PrEP was difficult" /> Remembering difficult</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="Storing PrEP was difficult" /> Storing difficult</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="Many people thought I was HIV positive" /> People thought HIV+</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="My friends thought I was promiscuous" /> Friends thought promiscuous</label>
                <label><input type="checkbox" v-model="formData.participation_challenges" value="Other" /> Other</label>
                <textarea v-if="formData.participation_challenges.includes('Other')" v-model="formData.participation_challenges_other" rows="3" placeholder="Specify"></textarea>
            </div>
          <label>11.6 Delivery preference post Phase 1?</label>
           <div class="checkbox-group-vertical">
                <label><input type="checkbox" v-model="formData.delivery_preference" value="By outreach worker" /> Outreach worker</label>
                <label><input type="checkbox" v-model="formData.delivery_preference" value="Through Pride Bhutan" /> Pride Bhutan</label>
                <label><input type="checkbox" v-model="formData.delivery_preference" value="Through RED PURSE" /> RED PURSE</label>
                <label><input type="checkbox" v-model="formData.delivery_preference" value="Through HISC" /> HISC</label>
                <label><input type="checkbox" v-model="formData.delivery_preference" value="Through hospital" /> Hospital</label>
                <label><input type="checkbox" v-model="formData.delivery_preference" value="Availability at Pharmacies" /> Pharmacies</label>
                <label><input type="checkbox" v-model="formData.delivery_preference" value="Other methods" /> Other methods</label>
                <textarea v-if="formData.delivery_preference.includes('Other methods')" v-model="formData.delivery_preference_other" rows="3" placeholder="Specify"></textarea>
            </div>
          <label>11.7 Satisfaction level?</label>
           <div class="radio-group-vertical">
                <label><input type="radio" v-model="formData.satisfaction_level" name="satisfaction" value="Extremely satisfied" required/> Extremely satisfied</label>
                <label><input type="radio" v-model="formData.satisfaction_level" name="satisfaction" value="Satisfied" /> Satisfied</label>
                <label><input type="radio" v-model="formData.satisfaction_level" name="satisfaction" value="Neutral/neither satisfied nor dissatisfied" /> Neutral</label>
                <label><input type="radio" v-model="formData.satisfaction_level" name="satisfaction" value="Dissatisfied" /> Dissatisfied</label>
                <label><input type="radio" v-model="formData.satisfaction_level" name="satisfaction" value="Very dissatisfied" /> Very dissatisfied</label>
                <label><input type="radio" v-model="formData.satisfaction_level" name="satisfaction" value="No response" /> No response</label>
            </div>
       </div>

      <!-- Container 13: Discontinuation Reason -->
      <div class="form-container">
        <h3 class="section-title">SECTION 12: Reason for Discontinuation of PrEP</h3>
        <label>12.1 What are the reasons for discontinuing PrEP? (Check all)</label>
        <div class="checkbox-group-vertical">
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="Tested HIV Positive while on PrEP" /> Tested HIV+</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="Developed kidney problems" /> Kidney problems</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="Not able to take PrEP medication as prescribed" /> Couldn't take as prescribed</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="No longer need or want PrEP" /> No longer need/want</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="No longer suitable to take PrEP" /> No longer suitable</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="Want to take other preventive measures for HIV prevention" /> Want other prevention</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="No longer at high risk as my HIV partner is virally suppressed after taking ART" /> Partner virally suppressed</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="Now getting settled with one partner (monogamous relationship)" /> Monogamous relationship</label>
            <label><input type="checkbox" v-model="formData.discontinuation_reasons" value="Other" /> Other</label>
            <textarea v-if="formData.discontinuation_reasons.includes('Other')" v-model="formData.discontinuation_other" rows="3" placeholder="Specify other reasons"></textarea>
        </div>
      </div>

      <!-- Submit Button outside the last container -->
      <button type="submit" class="submit-btn" :disabled="submitDisabled || isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Review Data' }}
      </button>
    </div> <!-- End .container -->
  </form>

  <!-- Confirmation Modal -->
  <Form6_ConfirmationModal v-if="isReviewModalVisible"
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
     <div v-if="successMessage && !finalSubmitMessage" class="success-message"> <p>{{ successMessage }}</p> </div>
     <div v-if="errorMessage && !finalSubmitMessage" class="error-message"> <p>{{ errorMessage }}</p> </div>
      <div v-if="isSubmitting && !isReviewModalVisible" class="submitting-indicator">Submitting...</div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios'; // Or use fetch if preferred
import Form6_ConfirmationModal from './Form6_ConfirmationModal.vue';

// --- Configuration ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6ugkpSN8qWytGVod4uUlsSN5asjN-ggBFyknbzowVyrthEcl2X4DVfvG-wdnj34Hh/exec'; // FORM 6 URL
const CSV_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX/pub?gid=0&single=true&output=csv";
const UID_MIN_LENGTH = 5;
const SUBMIT_SUCCESS_DELAY = 2500;

// --- State Variables ---
const formData = ref({
  // Basic Info
  participant_uid: '', date: '', prep_site: '', visit_type: 'End of M12', // Default to Exit/M12
  interviewer_name: '', designation: '', bmhc_number: '', interview_status: '', location: '',
  // Sec 1
  occupation_status: '', occupation_other: '', marital_status: '', marital_other: '', live_with_partner: '', partner_gender: [],
  // Sec 2
  sti_risk: '', hiv_risk: '', partner_hiv_status: '',
  // Sec 3
  steady_anal_partners: null, casual_anal_partners: null, transactional_anal_partners: null, anal_sex: '',
  steady_vaginal_partners: null, casual_vaginal_partners: null, transactional_vaginal_partners: null, vaginal_sex: '',
  sex_days: [], no_sex_with_regular_partner: '', regular_condom_use: '', last_sex_condom_use: '', have_clients: '',
  clients_last_week: null, sex_days_clients: [], no_sex_with_clients: '', clients_condom_use: '', last_sex_with_clients_condom_use: '',
  sex_without_condom_reason: [], sex_without_condom_reason_other: '', prep_change_condom_use: '',
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
  // Sec 9
  visited_pride_bhutan: '', hiv_testing_reason: '', sti_testing_reason: '', other_reason_visited: '',
  orw_meeting_one: '', orw_meeting_three: '',
  received_condoms: '', received_lubricants: '',
  // Sec 10
  consumed_alcohol: '', alcohol_days: null, alcohol_before_during_sex: '',
  taken_drugs: '', drugs_before_during_sex: '',
  // Sec 11
  protection_feeling: '', sti_concern: '', prep_package_opinion: '',
  participation_likes: [], participation_likes_other: '',
  participation_challenges: [], participation_challenges_other: '',
  delivery_preference: [], delivery_preference_other: '', satisfaction_level: '',
  // Sec 12
  discontinuation_reasons: [], discontinuation_other: ''
});

// Feedback & Control State
const statusMessage = ref(''); const statusClass = ref('');
const submitDisabled = ref(true); const isCheckingUid = ref(false); const isSubmitting = ref(false);
const isReviewModalVisible = ref(false); const modalSuccessMessage = ref(''); const modalErrorMessage = ref('');
const finalSubmitMessage = ref(''); const finalSubmitClass = ref('');
const successMessage = ref(''); const errorMessage = ref('');
let csvData = [];

// --- Computed Properties ---
const hasAnalPartners = computed(() => (formData.value.steady_anal_partners ?? 0) > 0 || (formData.value.casual_anal_partners ?? 0) > 0 || (formData.value.transactional_anal_partners ?? 0) > 0);
const hasVaginalPartners = computed(() => (formData.value.steady_vaginal_partners ?? 0) > 0 || (formData.value.casual_vaginal_partners ?? 0) > 0 || (formData.value.transactional_vaginal_partners ?? 0) > 0);

// --- Functions ---
const initializeDate = () => { formData.value.date = new Date().toISOString().split('T')[0]; };
const fetchCsvData = async () => {
    isCheckingUid.value = true; statusMessage.value = 'Loading validation data...'; statusClass.value = ''; submitDisabled.value = true;
      try {
        const response = await fetch(CSV_DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvText = await response.text();
        csvData = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        console.log("CSV Data Loaded for Form 6");
        statusMessage.value = 'Validation data loaded.';
        if(formData.value.participant_uid) validateUidOnInput(formData.value.participant_uid); else submitDisabled.value = true;
      } catch (error) {
        console.error('Error fetching CSV data for Form 6:', error);
        statusMessage.value = 'Error loading validation data.'; statusClass.value = 'error'; csvData = []; submitDisabled.value = true;
      } finally { isCheckingUid.value = false; if (!formData.value.participant_uid && statusMessage.value.includes('Loading')) statusMessage.value = ''; }
};
const validateUid = (uid) => {
     if (!uid || !csvData || csvData.length <= 1) return false;
    const normalizedUid = uid.trim().toLowerCase();
    return csvData.slice(1).some(row => row.length > 1 && row[1]?.toLowerCase() === normalizedUid);
};
const validateUidOnInput = (newUid) => {
     clearFinalMessage(); modalErrorMessage.value = ''; modalSuccessMessage.value = '';
    if (!newUid) { statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; return; }
    const pattern = new RegExp(`^[A-Za-z0-9]{${UID_MIN_LENGTH},}$`);
    if (!pattern.test(newUid)) { statusMessage.value = `UID min ${UID_MIN_LENGTH} chars.`; statusClass.value = 'error'; submitDisabled.value = true; }
    else if (isCheckingUid.value) { statusMessage.value = 'Checking UID...'; statusClass.value = ''; submitDisabled.value = true; }
    else if (csvData.length <= 1 && !isCheckingUid.value) { statusMessage.value = 'Validation data unavailable.'; statusClass.value = 'error'; submitDisabled.value = true; }
    else { if (validateUid(newUid)) { statusMessage.value = 'UID found!'; statusClass.value = 'success'; submitDisabled.value = false; }
           else { statusMessage.value = 'UID not found.'; statusClass.value = 'error'; submitDisabled.value = true; }
    }
};
watch(() => formData.value.participant_uid, validateUidOnInput);

// Modal Control
const showReviewModal = () => {
  if (submitDisabled.value) { modalErrorMessage.value = "Invalid UID."; return; }
  if (formData.value.interview_status === 'Terminate') { errorMessage.value = "Interview terminated."; return; }
  modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
  isReviewModalVisible.value = true;
};
const cancelReview = () => { isReviewModalVisible.value = false; };

// Submission
const confirmAndSubmit = async () => {
   if (formData.value.interview_status === 'Terminate') { modalErrorMessage.value = 'Interview terminated.'; return; }
   isSubmitting.value = true; modalSuccessMessage.value = ''; modalErrorMessage.value = ''; clearFinalMessage();
   const url = GOOGLE_SCRIPT_URL;
   try {
     const dataToSend = { ...formData.value };
     Object.keys(dataToSend).forEach(key => { // Format arrays and booleans
       if (Array.isArray(dataToSend[key])) dataToSend[key] = dataToSend[key].join('; ');
       else if (typeof dataToSend[key] === 'boolean') dataToSend[key] = dataToSend[key] ? 'Yes' : 'No';
     });
     const formDataSerialized = new URLSearchParams(dataToSend).toString();
     await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: formDataSerialized, mode: 'no-cors' });
     modalSuccessMessage.value = 'Form submitted successfully (response not readable).';
     setTimeout(() => {
        isReviewModalVisible.value = false; setFinalMessage('Form submitted successfully!', 'success');
        clearForm(); statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; modalSuccessMessage.value = '';
      }, SUBMIT_SUCCESS_DELAY);
   } catch (error) {
     console.error('Form 6 Submit Error:', error);
     modalErrorMessage.value = "Error submitting form. Please check network or contact support.";
   } finally { isSubmitting.value = false; }
};

// Side Effect Checkbox Handler
const handleSideEffectCheck = (effect, type) => {
    const ongoingKey = `${effect}_ongoing`; const resolvedKey = `${effect}_resolved`;
    if (type === 'ongoing' && formData.value[ongoingKey]) formData.value[resolvedKey] = false;
    else if (type === 'resolved' && formData.value[resolvedKey]) formData.value[ongoingKey] = false;
};

// Clear Form
const clearForm = () => {
    const interviewerDetails = { interviewer_name: formData.value.interviewer_name, designation: formData.value.designation, bmhc_number: formData.value.bmhc_number, location: formData.value.location };
    Object.keys(formData.value).forEach(key => {
         if (key in interviewerDetails || key === 'date') return;
         if (Array.isArray(formData.value[key])) formData.value[key] = [];
         else if (typeof formData.value[key] === 'boolean') formData.value[key] = false;
         else if (typeof formData.value[key] === 'number') formData.value[key] = null;
         else if (key === 'prep_site') formData.value[key] = '';
         else if (key === 'visit_type') formData.value[key] = 'End of M12'; // Default exit visit
         else formData.value[key] = '';
    });
    Object.assign(formData.value, interviewerDetails); initializeDate();
    statusMessage.value = ''; statusClass.value = ''; submitDisabled.value = true; clearFinalMessage();
    successMessage.value = ''; errorMessage.value = '';
};

// Logged In User
const getLoggedInUser = () => {
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
    formData.value.bmhc_number = loggedInUser.bhcno || '';
    formData.value.location = loggedInUser.prep_location || '[Interviewer Location]';
  } else {
      console.warn("Form 6: Logged in user details not found.");
       formData.value.interviewer_name = ''; formData.value.designation = ''; formData.value.bmhc_number = ''; formData.value.location = '';
  }
});
</script>

<style>
/* Keep the original styles provided */
.form-container { padding: 2rem; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-bottom: 2rem; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input, select, textarea { width: 100%; padding: 0.5rem; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 0.95rem; }
input:focus, select:focus, textarea:focus { border-color: #3498db; outline: none; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }
input[readonly] { background-color: #f8f9fa; cursor: not-allowed; }
input[type="radio"], input[type="checkbox"] { width: auto; margin-right: 8px; vertical-align: middle; }
label > input[type="radio"], label > input[type="checkbox"] { margin-bottom: 0; }
.radio-group-vertical, .checkbox-group-vertical { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #fdfdfd; }
.radio-group-vertical label, .checkbox-group-vertical label { font-weight: normal; display: inline-flex; align-items: center; margin-bottom: 0; }
.partner-count-group { margin-bottom: 1rem; }
.partner-count-group label { display: inline-block; width: auto; margin-right: 10px; margin-bottom: 5px; }
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
td input[type="text"], td input[type="date"], td input[type="textarea"] { width: 95%; padding: 0.3rem 0.4rem; margin-bottom: 0; font-size: 0.9rem; }
.success-message { color: green; text-align: center; font-weight: bold; margin-top: 15px; }
.error-message { color: red; text-align: center; font-weight: bold; margin-top: 15px; }
.submitting-indicator { margin-top: 20px; text-align: center; font-size: 1.2rem; color: #3498db; }
.final-message { max-width: 700px; margin: 20px auto; padding: 15px 20px; border-radius: 5px; text-align: center; font-weight: 500; }
.final-message.success-final { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.final-message.error-final { background-color: #f8d7da; color: #842029; border: 1px solid #f5c2c7; }
.conditional-section { margin-left: 15px; padding-left: 15px; border-left: 2px solid #e0e0e0; margin-top: 10px; padding-top: 10px; }
</style>