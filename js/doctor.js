/**
 * Bhardwaj Chasma Ghar - Doctor OPD Consultation Controller
 * Consultant: Dr. Satya Prakash Bhardwaj
 * Headquarters: Itaily Moad, Maudha Road, Mehnajpur, Azamgarh
 */

const DoctorApp = {
  currentPatientId: null,

  init: function() {
    const user = window.BCGAuth ? window.BCGAuth.requireRole(['doctor', 'admin']) : null;
    if (!user) return;

    const docNameEl = document.getElementById('doc-name');
    if (docNameEl) {
      docNameEl.textContent = (user && user.role === 'doctor') ? user.name : "Dr. Satya Prakash Bhardwaj";
    }

    this.renderStats();
    this.populatePatientDropdown();
    this.renderRecentPatients();
    this.renderPatientsList();
    this.renderPrescriptionsList();
    this.initDefaultMedicines();
  },

  showSection: function(sectionName, navEl) {
    const sections = ['dashboard', 'examination', 'patients', 'prescriptions'];
    sections.forEach(s => {
      const el = document.getElementById(`section-${s}`);
      if (el) el.style.display = (s === sectionName) ? 'block' : 'none';
    });

    if (navEl) {
      document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
      navEl.classList.add('active');
    }

    const titleEl = document.getElementById('page-title');
    if (titleEl) {
      if (sectionName === 'dashboard') titleEl.textContent = "OPD Consultation & Clinical Overview";
      else if (sectionName === 'examination') titleEl.textContent = "Eye Refraction & Spectacle Prescription";
      else if (sectionName === 'patients') titleEl.textContent = "Patient Master Database & Clinical History";
      else if (sectionName === 'prescriptions') titleEl.textContent = "Prescriptions Archive & Dispensary Records";
    }
  },

  renderStats: function() {
    const db = window.BCGStore.getDB();
    const patients = db.patients || [];
    const rx = db.prescriptions || [];
    const sentOptical = rx.filter(r => r.opticalStatus === 'Sent to Optical').length;

    const elPatients = document.getElementById('stat-total-patients');
    const elRx = document.getElementById('stat-total-rx');
    const elOptical = document.getElementById('stat-sent-optical');
    const elExams = document.getElementById('stat-today-exams');

    if (elPatients) elPatients.textContent = patients.length;
    if (elRx) elRx.textContent = rx.length;
    if (elOptical) elOptical.textContent = sentOptical;
    if (elExams) elExams.textContent = db.examinations ? db.examinations.length : 0;
  },

  populatePatientDropdown: function() {
    const select = document.getElementById('exam-patient-select');
    if (!select) return;

    const patients = window.BCGStore.getPatients();
    select.innerHTML = '<option value="">-- Choose Existing Patient --</option>' +
      patients.map(p => `<option value="${p.id}">${p.name} (${p.phone}) - ${p.id}</option>`).join('');
  },

  renderRecentPatients: function() {
    const container = document.getElementById('recent-patients-list');
    if (!container) return;

    const patients = window.BCGStore.getPatients().slice(0, 5);
    container.innerHTML = patients.map(p => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:0.86rem;">
        <div>
          <strong>${p.name}</strong><br>
          <small style="color:var(--text-muted);">${p.phone} • ${p.age} Yrs • ${p.address || 'Mehnajpur'}</small>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm btn-outline" onclick="DoctorApp.selectPatientForExam('${p.id}')">Exam</button>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openCustomer360('${p.id}')">360°</button>
        </div>
      </div>
    `).join('');
  },

  searchAndSelectPatient: function() {
    const query = (document.getElementById('quick-patient-search').value || '').trim().toLowerCase();
    if (!query) {
      BCGUI.toast("Please enter a name or phone number", "warning");
      return;
    }

    const patients = window.BCGStore.getPatients();
    const match = patients.find(p => p.phone.includes(query) || p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));

    if (match) {
      this.selectPatientForExam(match.id);
      BCGUI.toast(`Found patient: ${match.name}`, "success");
    } else {
      BCGUI.toast("Patient not found. You can register a new patient.", "warning");
      this.openNewPatientModal();
    }
  },

  selectPatientForExam: function(patientId) {
    this.currentPatientId = patientId;
    const patient = window.BCGStore.getPatientById(patientId);
    if (!patient) return;

    // Switch to examination tab
    this.showSection('examination', document.querySelector('.sidebar-item[href="#examination"]'));

    // Populate active banner
    const banner = document.getElementById('active-patient-banner');
    if (banner) {
      banner.style.display = 'block';
      document.getElementById('act-p-name').textContent = patient.name;
      document.getElementById('act-p-id').textContent = patient.id;
      document.getElementById('act-p-phone').textContent = patient.phone;
      document.getElementById('act-p-age-gender').textContent = `${patient.age} Yrs / ${patient.gender}`;
      document.getElementById('act-p-history').textContent = patient.medicalHistory || "None";
    }

    const dropdown = document.getElementById('exam-patient-select');
    if (dropdown) dropdown.value = patientId;
  },

  initDefaultMedicines: function() {
    const tbody = document.getElementById('meds-table-body');
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td><input type="text" class="form-control med-name" value="Tears Naturale II Lubricating Drops"></td>
        <td><input type="text" class="form-control med-dose" value="1 drop"></td>
        <td><input type="text" class="form-control med-freq" value="Thrice daily (1-1-1)"></td>
        <td><input type="text" class="form-control med-duration" value="20 Days"></td>
        <td><input type="text" class="form-control med-inst" value="Both eyes"></td>
        <td><button type="button" class="btn btn-sm btn-danger" onclick="this.closest('tr').remove()">&times;</button></td>
      </tr>
    `;
  },

  addMedicineRow: function(name = "", dose = "1 drop", freq = "Twice daily", dur = "15 Days", inst = "Both eyes") {
    const tbody = document.getElementById('meds-table-body');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="form-control med-name" placeholder="Medicine / Eye Drop" value="${name}"></td>
      <td><input type="text" class="form-control med-dose" placeholder="Dose" value="${dose}"></td>
      <td><input type="text" class="form-control med-freq" placeholder="Frequency" value="${freq}"></td>
      <td><input type="text" class="form-control med-duration" placeholder="Duration" value="${dur}"></td>
      <td><input type="text" class="form-control med-inst" placeholder="Instructions" value="${inst}"></td>
      <td><button type="button" class="btn btn-sm btn-danger" onclick="this.closest('tr').remove()">&times;</button></td>
    `;
    tbody.appendChild(row);
  },

  openNewPatientModal: function() {
    BCGUI.openModal('modal-new-patient');
  },

  submitNewPatient: function() {
    const name = document.getElementById('np-name').value.trim();
    const phone = document.getElementById('np-phone').value.trim();
    const age = document.getElementById('np-age').value.trim();
    const gender = document.getElementById('np-gender').value;
    const address = document.getElementById('np-address').value.trim();
    const history = document.getElementById('np-history').value.trim();

    if (!name || !phone) {
      BCGUI.toast("Patient name and phone are required", "error");
      return;
    }

    const newPatient = window.BCGStore.addPatient({
      name, phone, age, gender, address: address || "Mehnajpur, Azamgarh", medicalHistory: history
    });

    BCGUI.toast(`Patient ${name} registered successfully!`, "success");
    BCGUI.closeModal('modal-new-patient');

    this.populatePatientDropdown();
    this.renderPatientsList();
    this.selectPatientForExam(newPatient.id);
  },

  // Save Prescription (save only OR Save & Send to Optical)
  savePrescription: function(sendToOptical = false) {
    if (!this.currentPatientId) {
      BCGUI.toast("Please select a patient before issuing prescription", "error");
      return;
    }

    const patient = window.BCGStore.getPatientById(this.currentPatientId);
    if (!patient) {
      BCGUI.toast("Invalid patient selected", "error");
      return;
    }

    const settings = window.BCGStore.getSettings();
    const doctorName = settings.doctorName || "Dr. Satya Prakash Bhardwaj";

    const rightEye = {
      sph: document.getElementById('od-sph').value.trim(),
      cyl: document.getElementById('od-cyl').value.trim(),
      axis: document.getElementById('od-axis').value.trim(),
      add: document.getElementById('od-add').value.trim()
    };

    const leftEye = {
      sph: document.getElementById('os-sph').value.trim(),
      cyl: document.getElementById('os-cyl').value.trim(),
      axis: document.getElementById('os-axis').value.trim(),
      add: document.getElementById('os-add').value.trim()
    };

    const pd = document.getElementById('rx-pd').value.trim() || "62";
    const iop = document.getElementById('exam-iop').value.trim();
    const lensRec = document.getElementById('rx-lens-rec').value.trim();
    const observations = document.getElementById('exam-obs').value.trim();
    const notes = document.getElementById('exam-notes').value.trim();

    // Collect medicines
    const medicines = [];
    document.querySelectorAll('#meds-table-body tr').forEach(row => {
      const name = row.querySelector('.med-name').value.trim();
      const dose = row.querySelector('.med-dose').value.trim();
      const freq = row.querySelector('.med-freq').value.trim();
      const duration = row.querySelector('.med-duration').value.trim();
      const inst = row.querySelector('.med-inst').value.trim();
      if (name) {
        medicines.push({ name, dose, frequency: freq, duration, instructions: inst });
      }
    });

    // 1. Record Examination
    const exam = window.BCGStore.addExamination({
      patientId: this.currentPatientId,
      doctorName: doctorName,
      rightEye,
      leftEye,
      pd,
      eyePressure: iop,
      observations,
      notes,
      recommendations: lensRec
    });

    // 2. Record Prescription
    const result = window.BCGStore.addPrescription({
      patientId: this.currentPatientId,
      examId: exam.id,
      doctorName: doctorName,
      rightEye,
      leftEye,
      pd,
      lensRecommendation: lensRec,
      notes,
      medicines
    }, sendToOptical);

    this.renderStats();
    this.renderPrescriptionsList();

    if (sendToOptical) {
      BCGUI.toast(`Prescription issued & Dispatched to Optical Team! Optical Job: ${result.opticalJobId}`, "success");
      BCGUI.openRxModal(result.prescription.id);
    } else {
      BCGUI.toast(`Prescription saved successfully (#${result.prescription.id})`, "success");
      BCGUI.openRxModal(result.prescription.id);
    }
  },

  clearExamForm: function() {
    document.getElementById('od-sph').value = '';
    document.getElementById('od-cyl').value = '';
    document.getElementById('od-axis').value = '';
    document.getElementById('od-add').value = '';
    document.getElementById('os-sph').value = '';
    document.getElementById('os-cyl').value = '';
    document.getElementById('os-axis').value = '';
    document.getElementById('os-add').value = '';
    document.getElementById('exam-obs').value = '';
    document.getElementById('exam-notes').value = '';
  },

  renderPatientsList: function() {
    const tbody = document.getElementById('patients-table-body');
    if (!tbody) return;

    const patients = window.BCGStore.getPatients();
    tbody.innerHTML = patients.map(p => `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.phone}</td>
        <td>${p.age} Yrs / ${p.gender}</td>
        <td>${p.address || 'Mehnajpur'}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="DoctorApp.selectPatientForExam('${p.id}')">
            <i class="fa-solid fa-stethoscope"></i> Checkup
          </button>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openCustomer360('${p.id}')">
            360° Profile
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderPrescriptionsList: function() {
    const tbody = document.getElementById('prescriptions-table-body');
    if (!tbody) return;

    const rxList = window.BCGStore.getDB().prescriptions || [];
    tbody.innerHTML = rxList.map(rx => {
      const patient = window.BCGStore.getPatientById(rx.patientId) || {};
      return `
        <tr>
          <td><strong>${rx.id}</strong></td>
          <td>${rx.date}</td>
          <td>
            <strong>${patient.name || rx.patientId}</strong><br>
            <small style="color:var(--text-muted);">${patient.phone || ''}</small>
          </td>
          <td>
            OD: ${rx.rightEye?.sph || '0.00'} / ${rx.rightEye?.cyl || '0.00'}<br>
            OS: ${rx.leftEye?.sph || '0.00'} / ${rx.leftEye?.cyl || '0.00'}
          </td>
          <td>${rx.lensRecommendation || 'Anti-Glare'}</td>
          <td>
            <span class="badge ${rx.opticalStatus === 'Sent to Optical' ? 'badge-success' : 'badge-neutral'}">
              ${rx.opticalStatus}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.openRxModal('${rx.id}')">
              <i class="fa-solid fa-print"></i> View Rx
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
};

window.DoctorApp = DoctorApp;

document.addEventListener('DOMContentLoaded', () => {
  DoctorApp.init();
});
