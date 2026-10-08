/**
 * Bhardwaj Chasma Ghar - Customer & Patient Portal Controller (Phase 1)
 */

const CustomerApp = {
  currentPatient: null,
  activeJob: null,

  init: function() {
    const user = window.BCGAuth.getCurrentUser();
    // Allow customer, or if admin/doctor/staff visits customer view for preview
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    let patientId = user.patientId || "P-1001";
    // If logged in as customer, match their patient record
    if (user.role === 'customer') {
      const patientByPhone = window.BCGStore.getPatients().find(p => p.phone === user.phone || p.id === user.patientId);
      if (patientByPhone) patientId = patientByPhone.id;
    }

    this.loadPatientData(patientId);
  },

  showSection: function(sectionName, navEl) {
    const sections = ['overview', 'prescriptions', 'orders', 'repairs', 'invoices', 'profile'];
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
      if (sectionName === 'overview') titleEl.textContent = "Patient Overview & Chasma Status";
      else if (sectionName === 'prescriptions') titleEl.textContent = "My Eye Prescriptions & Clinical Records";
      else if (sectionName === 'orders') titleEl.textContent = "My Optical Orders & Spectacles";
      else if (sectionName === 'repairs') titleEl.textContent = "Chasma Repair Status & History";
      else if (sectionName === 'invoices') titleEl.textContent = "Tax Invoices & Payment Receipts";
      else if (sectionName === 'profile') titleEl.textContent = "Personal Profile & Contact Settings";
    }
  },

  loadPatientData: function(patientId) {
    const data = window.BCGStore.getCustomer360(patientId);
    if (!data || !data.patient) {
      BCGUI.toast("Could not locate patient profile", "error");
      return;
    }

    this.currentPatient = data.patient;
    this.activeJob = data.activeJob;

    // Header & User Info
    const custNameEl = document.getElementById('cust-name');
    const custPhoneEl = document.getElementById('cust-phone');
    const welcomeEl = document.getElementById('welcome-patient-name');
    if (custNameEl) custNameEl.textContent = data.patient.name;
    if (custPhoneEl) custPhoneEl.textContent = data.patient.phone;
    if (welcomeEl) welcomeEl.textContent = data.patient.name;

    // Checkup date & Due amount
    const checkupEl = document.getElementById('overview-last-checkup');
    const dueEl = document.getElementById('overview-total-due');
    if (checkupEl && data.latestExam) checkupEl.textContent = data.latestExam.date;
    if (dueEl) dueEl.textContent = BCGUI.formatCurrency(data.totalDue);

    // Active Chasma Order Tracker
    this.renderActiveChasma(data.activeJob);

    // Latest Rx
    this.renderLatestRx(data.latestRx);

    // Prescriptions List
    this.renderPrescriptions(data.prescriptions);

    // Orders List
    this.renderOrders(data.opticalJobs);

    // Repairs List
    this.renderRepairs(data.repairs);

    // Invoices List
    this.renderInvoices(data.invoices);

    // Profile form
    this.populateProfileForm(data.patient);
  },

  renderActiveChasma: function(job) {
    const card = document.getElementById('active-chasma-card');
    if (!job) {
      if (card) {
        card.innerHTML = `
          <div style="text-align:center; padding:30px;">
            <i class="fa-solid fa-glasses" style="font-size:3rem; color:var(--text-dim); margin-bottom:12px;"></i>
            <h3>No Active Chasma Job In Production</h3>
            <p style="color:var(--text-muted); font-size:0.88rem;">All your previous eyewear orders are delivered, or you have not placed a recent job.</p>
            <a href="store.html" class="btn btn-primary" style="margin-top:16px;">Browse Eyewear Collection</a>
          </div>
        `;
      }
      return;
    }

    document.getElementById('chasma-job-id').textContent = job.id;
    document.getElementById('chasma-status-pill').textContent = job.status;
    document.getElementById('chasma-frame-name').textContent = job.frameName;
    document.getElementById('chasma-lens-name').textContent = job.lensName;
    document.getElementById('chasma-delivery-date').textContent = job.expectedDelivery || "3-5 Business Days";
    document.getElementById('chasma-total-amount').textContent = BCGUI.formatCurrency(job.total);
    document.getElementById('chasma-advance-amount').textContent = BCGUI.formatCurrency(job.advance);
    document.getElementById('chasma-due-amount').textContent = job.due > 0 ? `Due: ${BCGUI.formatCurrency(job.due)}` : "Fully Paid";

    // Setup action buttons
    const btnRx = document.getElementById('btn-view-job-rx');
    const btnInv = document.getElementById('btn-view-job-inv');
    if (btnRx) btnRx.onclick = () => BCGUI.openRxModal(job.prescriptionId);
    if (btnInv && job.invoiceNumber) btnInv.onclick = () => BCGUI.openInvoiceModal(job.invoiceNumber);

    // Highlight timeline stepper
    const stepsMap = {
      'Prescription Received': 1,
      'Frame Selected': 2,
      'Lens Processing': 3,
      'Fitting': 4,
      'Quality Check': 5,
      'Ready': 6,
      'Delivered': 7
    };

    const currentStepIndex = stepsMap[job.status] || 1;
    const stepEls = document.querySelectorAll('#chasma-stepper .timeline-step');

    stepEls.forEach(stepEl => {
      const stepNum = parseInt(stepEl.dataset.step);
      stepEl.classList.remove('completed', 'current');
      const bubble = stepEl.querySelector('.step-bubble');

      if (stepNum < currentStepIndex) {
        stepEl.classList.add('completed');
        bubble.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (stepNum === currentStepIndex) {
        stepEl.classList.add('current');
        if (job.status === 'Delivered') {
          bubble.innerHTML = '<i class="fa-solid fa-check-double"></i>';
        } else if (job.status === 'Ready') {
          bubble.innerHTML = '<i class="fa-solid fa-bell"></i>';
        } else {
          bubble.innerHTML = '<i class="fa-solid fa-gear fa-spin"></i>';
        }
      } else {
        bubble.textContent = stepNum;
      }
    });
  },

  renderLatestRx: function(rx) {
    const container = document.getElementById('latest-rx-container');
    if (!container) return;

    if (!rx) {
      container.innerHTML = '<p style="color:var(--text-muted);">No prescriptions on file yet.</p>';
      return;
    }

    container.innerHTML = `
      <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <div>
            <strong>Rx #${rx.id}</strong> — Issued on <strong>${rx.date}</strong> by <strong>${rx.doctorName}</strong>
          </div>
          <div>
            <span class="badge badge-teal">Valid Medical Prescription</span>
          </div>
        </div>

        <div style="background:#fff; border:1px solid var(--border-light); border-radius:var(--radius-sm); padding:12px; margin-bottom:12px;">
          <table class="rx-table" style="box-shadow:none; margin-bottom:0;">
            <thead>
              <tr>
                <th>Eye</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
                <th>ADD</th>
                <th>PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="eye-label">Right Eye (OD)</td>
                <td><strong>${rx.rightEye.sph || '0.00'}</strong></td>
                <td><strong>${rx.rightEye.cyl || '0.00'}</strong></td>
                <td><strong>${rx.rightEye.axis || '-'}</strong></td>
                <td><strong>${rx.rightEye.add || '-'}</strong></td>
                <td rowspan="2" style="vertical-align:middle; font-weight:800; background:#f8fafc;">${rx.pd || '62'} mm</td>
              </tr>
              <tr>
                <td class="eye-label">Left Eye (OS)</td>
                <td><strong>${rx.leftEye.sph || '0.00'}</strong></td>
                <td><strong>${rx.leftEye.cyl || '0.00'}</strong></td>
                <td><strong>${rx.leftEye.axis || '-'}</strong></td>
                <td><strong>${rx.leftEye.add || '-'}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:6px;">
          <strong>Doctor's Advice:</strong> ${rx.notes || 'Wear glasses for screen & driving activities.'}
        </p>
      </div>
    `;
  },

  viewLatestRxPad: function() {
    const rxList = window.BCGStore.getDB().prescriptions.filter(r => r.patientId === this.currentPatient.id);
    if (rxList.length > 0) {
      BCGUI.openRxModal(rxList[0].id);
    } else {
      BCGUI.toast("No prescription record found", "info");
    }
  },

  renderPrescriptions: function(prescriptions = []) {
    const container = document.getElementById('customer-rx-list');
    if (!container) return;

    if (prescriptions.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); padding:20px; text-align:center;">No prescriptions issued yet.</p>';
      return;
    }

    container.innerHTML = prescriptions.map(rx => `
      <div style="border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:20px; background:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary);">Prescription #${rx.id}</h4>
            <small style="color:var(--text-muted);">Consultation Date: ${rx.date} | ${rx.doctorName}</small>
          </div>
          <button class="btn btn-sm btn-primary" onclick="BCGUI.openRxModal('${rx.id}')">
            <i class="fa-solid fa-print"></i> View / Download Rx Slip
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px; background:var(--bg-subtle); padding:14px; border-radius:var(--radius-md); font-size:0.88rem;">
          <div>
            <strong>Right Eye (OD):</strong><br>
            SPH: <strong>${rx.rightEye.sph || '0.00'}</strong> | CYL: <strong>${rx.rightEye.cyl || '0.00'}</strong> | AXIS: <strong>${rx.rightEye.axis || '-'}</strong> | ADD: <strong>${rx.rightEye.add || '-'}</strong>
          </div>
          <div>
            <strong>Left Eye (OS):</strong><br>
            SPH: <strong>${rx.leftEye.sph || '0.00'}</strong> | CYL: <strong>${rx.leftEye.cyl || '0.00'}</strong> | AXIS: <strong>${rx.leftEye.axis || '-'}</strong> | ADD: <strong>${rx.leftEye.add || '-'}</strong>
          </div>
        </div>

        ${rx.medicines && rx.medicines.length > 0 ? `
          <div style="margin-top:12px; font-size:0.84rem;">
            <strong>Prescribed Eye Drops:</strong>
            <ul style="padding-left:18px; margin-top:4px; color:var(--text-muted);">
              ${rx.medicines.map(m => `<li><strong>${m.name}</strong> (${m.dose}) — ${m.frequency} for ${m.duration}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('');
  },

  renderOrders: function(jobs = []) {
    const tbody = document.getElementById('customer-orders-tbody');
    if (!tbody) return;

    if (jobs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No optical orders placed.</td></tr>';
      return;
    }

    tbody.innerHTML = jobs.map(job => `
      <tr>
        <td><strong>${job.id}</strong></td>
        <td>${job.createdAt}</td>
        <td>
          <strong>${job.frameName}</strong><br>
          <small style="color:var(--text-muted);">${job.lensName}</small>
        </td>
        <td><strong>${BCGUI.formatCurrency(job.total)}</strong></td>
        <td>${BCGUI.formatCurrency(job.advance)}</td>
        <td><strong style="color:${job.due > 0 ? 'var(--rose)' : 'var(--emerald)'};">${BCGUI.formatCurrency(job.due)}</strong></td>
        <td>
          <span class="badge ${job.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${job.status}</span>
        </td>
        <td>
          ${job.invoiceNumber ? `
            <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${job.invoiceNumber}')">
              <i class="fa-solid fa-receipt"></i> Invoice
            </button>
          ` : '-'}
        </td>
      </tr>
    `).join('');
  },

  renderRepairs: function(repairs = []) {
    const tbody = document.getElementById('customer-repairs-tbody');
    if (!tbody) return;

    if (repairs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">No repair jobs logged.</td></tr>';
      return;
    }

    tbody.innerHTML = repairs.map(rep => `
      <tr>
        <td><strong>${rep.id}</strong></td>
        <td>${rep.receivedDate}</td>
        <td><strong>${rep.frameDescription}</strong></td>
        <td>${rep.problem}</td>
        <td>${BCGUI.formatCurrency(rep.finalCost)}</td>
        <td><strong style="color:${rep.due > 0 ? 'var(--rose)' : 'var(--emerald)'};">${BCGUI.formatCurrency(rep.due)}</strong></td>
        <td>
          <span class="badge ${rep.status === 'Ready' || rep.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${rep.status}</span>
        </td>
      </tr>
    `).join('');
  },

  renderInvoices: function(invoices = []) {
    const tbody = document.getElementById('customer-invoices-tbody');
    if (!tbody) return;

    if (invoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No invoices generated.</td></tr>';
      return;
    }

    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td><strong>${inv.id}</strong></td>
        <td>${inv.date}</td>
        <td>${inv.doctorName} (${inv.prescriptionRef})</td>
        <td><strong>${BCGUI.formatCurrency(inv.grandTotal)}</strong></td>
        <td>${BCGUI.formatCurrency(inv.advancePaid)}</td>
        <td><strong style="color:${inv.dueAmount > 0 ? 'var(--rose)' : 'var(--emerald)'};">${BCGUI.formatCurrency(inv.dueAmount)}</strong></td>
        <td><span class="badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${inv.paymentStatus}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${inv.id}')">
            <i class="fa-solid fa-eye"></i> View Invoice
          </button>
        </td>
      </tr>
    `).join('');
  },

  populateProfileForm: function(patient) {
    document.getElementById('prof-name').value = patient.name || '';
    document.getElementById('prof-phone').value = patient.phone || '';
    document.getElementById('prof-email').value = patient.email || '';
    document.getElementById('prof-dob').value = patient.dob || '';
    document.getElementById('prof-gender').value = patient.gender || 'Male';
    document.getElementById('prof-address').value = patient.address || '';
    document.getElementById('prof-emergency').value = patient.emergencyContact || '';
  },

  updateProfile: function() {
    const db = window.BCGStore.getDB();
    const idx = db.patients.findIndex(p => p.id === this.currentPatient.id);
    if (idx === -1) return;

    db.patients[idx].name = document.getElementById('prof-name').value.trim();
    db.patients[idx].email = document.getElementById('prof-email').value.trim();
    db.patients[idx].dob = document.getElementById('prof-dob').value;
    db.patients[idx].gender = document.getElementById('prof-gender').value;
    db.patients[idx].address = document.getElementById('prof-address').value.trim();
    db.patients[idx].emergencyContact = document.getElementById('prof-emergency').value.trim();

    window.BCGStore.saveDB(db);
    BCGUI.toast("Profile updated successfully!", "success");
    this.loadPatientData(this.currentPatient.id);
  }
};

window.CustomerApp = CustomerApp;

document.addEventListener('DOMContentLoaded', () => {
  CustomerApp.init();
});
