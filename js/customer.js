/**
 * Bhardwaj Chasma Ghar - Customer & Patient Portal Controller
 * Headquarters: Itaily Moad, Maudha Road, Mehnajpur, Azamgarh
 * Consultant: Dr. Satya Prakash Bhardwaj
 */

const CustomerApp = {
  currentPatient: null,
  activeJob: null,

  init: function() {
    const user = window.BCGAuth ? window.BCGAuth.getCurrentUser() : null;
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    let patientId = user.patientId || "P-1001";
    // Match patient by phone or patientId
    const patients = window.BCGStore.getPatients();
    const patientByPhone = patients.find(p => p.phone === user.phone || p.id === user.patientId);
    if (patientByPhone) patientId = patientByPhone.id;

    this.loadPatientData(patientId);

    // Check hash for initial section
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'chasma', 'orders', 'prescriptions', 'eyerecords', 'repairs', 'invoices', 'profile'].includes(hash)) {
      const navItem = document.querySelector(`.sidebar-item[href="#${hash}"]`);
      this.showSection(hash, navItem);
    }
  },

  showSection: function(sectionName, navEl) {
    const sections = ['overview', 'chasma', 'orders', 'prescriptions', 'eyerecords', 'repairs', 'invoices', 'profile'];
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
      if (sectionName === 'overview') titleEl.textContent = "Customer Dashboard & Vision Overview";
      else if (sectionName === 'chasma') titleEl.textContent = "My Chasma — Live Workshop Production Tracker";
      else if (sectionName === 'orders') titleEl.textContent = "My Optical Store Orders & Purchase Requests";
      else if (sectionName === 'prescriptions') titleEl.textContent = "Doctor Prescriptions & Official Medical Slips";
      else if (sectionName === 'eyerecords') titleEl.textContent = "Clinical Eye Examinations & Refraction History";
      else if (sectionName === 'repairs') titleEl.textContent = "Chasma Repair Status & Progress";
      else if (sectionName === 'invoices') titleEl.textContent = "Staff-Generated GST Invoices & Receipts";
      else if (sectionName === 'profile') titleEl.textContent = "My Personal Profile & Delivery Address";
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

    // Dashboard Tiles
    this.renderDashboardTiles(data);

    // Active Chasma Tracker (My Chasma Section)
    this.renderActiveChasma(data.activeJob);

    // Store Orders List
    this.renderOrders(data.orders);

    // Prescriptions List
    this.renderPrescriptions(data.prescriptions);

    // Eye Examination Records
    this.renderEyeRecords(data.exams);

    // Repairs List
    this.renderRepairs(data.repairs);

    // Invoices List
    this.renderInvoices(data.invoices);

    // Profile form
    this.populateProfileForm(data.patient);
  },

  renderDashboardTiles: function(data) {
    // 1. Latest Rx Tile
    const rxTile = document.getElementById('dash-rx-tile');
    if (rxTile) {
      if (data.latestRx) {
        rxTile.innerHTML = `
          <strong>${data.latestRx.date}</strong> by ${data.latestRx.doctorName || 'Dr. Satya Prakash Bhardwaj'}<br>
          <small style="color:var(--text-muted);">OD: ${data.latestRx.rightEye?.sph || '0.00'} | OS: ${data.latestRx.leftEye?.sph || '0.00'}</small>
        `;
      } else {
        rxTile.innerHTML = '<span style="color:var(--text-muted);">No prescriptions on record.</span>';
      }
    }

    // 2. Current Chasma Stage Tile
    const chasmaTile = document.getElementById('dash-chasma-tile');
    if (chasmaTile) {
      if (data.activeJob) {
        chasmaTile.innerHTML = `
          <strong>${data.activeJob.id}</strong> — <span class="badge badge-warning">${data.activeJob.status}</span><br>
          <small style="color:var(--text-muted);">${data.activeJob.frameName || 'Pending Frame'}</small>
        `;
      } else {
        chasmaTile.innerHTML = '<span style="color:var(--text-muted);">No active chasma job in lab.</span>';
      }
    }

    // 3. Current Store Order Tile
    const orderTile = document.getElementById('dash-order-tile');
    if (orderTile) {
      if (data.activeOrder) {
        orderTile.innerHTML = `
          <strong>${data.activeOrder.id}</strong> — <span class="badge ${data.activeOrder.status === 'Confirmed / Billed' ? 'badge-success' : 'badge-warning'}">${data.activeOrder.status}</span><br>
          <small style="color:var(--text-muted);">${BCGUI.formatCurrency(data.activeOrder.totalAmount)}</small>
        `;
      } else {
        orderTile.innerHTML = '<span style="color:var(--text-muted);">No active store orders.</span>';
      }
    }

    // 4. Pending Due Tile
    const dueTile = document.getElementById('dash-due-tile');
    if (dueTile) {
      dueTile.innerHTML = `
        <strong style="color:${data.totalDue > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-size:1.25rem;">${BCGUI.formatCurrency(data.totalDue)}</strong><br>
        <small style="color:var(--text-muted);">${data.totalDue > 0 ? 'Payable upon collection' : 'Zero balance'}</small>
      `;
    }

    // 5. Active Repair Tile
    const repTile = document.getElementById('dash-repair-tile');
    if (repTile) {
      if (data.activeRepair) {
        repTile.innerHTML = `
          <strong>${data.activeRepair.id}</strong> — <span class="badge badge-info">${data.activeRepair.status}</span><br>
          <small style="color:var(--text-muted);">${data.activeRepair.frameDescription}</small>
        `;
      } else {
        repTile.innerHTML = '<span style="color:var(--text-muted);">No active repair tickets.</span>';
      }
    }
  },

  renderActiveChasma: function(job) {
    const card = document.getElementById('active-chasma-card');
    if (!card) return;

    if (!job) {
      card.innerHTML = `
        <div style="text-align:center; padding:36px 16px; color:var(--text-muted);">
          <i class="fa-solid fa-glasses" style="font-size:2.8rem; margin-bottom:12px; color:var(--border-medium);"></i>
          <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">No Active Chasma Job in Production</h4>
          <p style="font-size:0.86rem; margin-bottom:16px;">When you get an eye examination or order prescription glasses, your live lens fabrication pipeline will appear here.</p>
          <div style="display:flex; gap:10px; justify-content:center;">
            <a href="store.html" class="btn btn-sm btn-primary">Browse Frames</a>
            <a href="doctor.html" class="btn btn-sm btn-outline">Consult Doctor</a>
          </div>
        </div>
      `;
      return;
    }

    const stages = [
      { name: "Prescription Received", icon: "fa-file-prescription" },
      { name: "Frame Selected", icon: "fa-glasses" },
      { name: "Lens Processing", icon: "fa-gear" },
      { name: "Fitting", icon: "fa-screwdriver-wrench" },
      { name: "Quality Check", icon: "fa-clipboard-check" },
      { name: "Ready", icon: "fa-bell" },
      { name: "Delivered", icon: "fa-circle-check" }
    ];

    const currentIdx = stages.findIndex(s => s.name === job.status);
    const activeIndex = currentIdx === -1 ? 0 : currentIdx;

    card.innerHTML = `
      <div style="border-bottom:1px solid var(--border-light); padding-bottom:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <span class="badge badge-teal"><i class="fa-solid fa-industry"></i> Real-Time Optical Pipeline</span>
          <h3 style="font-size:1.3rem; font-weight:800; color:var(--text-main); margin-top:4px;">
            Job Reference: ${job.id}
          </h3>
          <p style="font-size:0.84rem; color:var(--text-muted);">
            Ordered on ${job.createdAt} • Target Delivery: <strong>${job.expectedDelivery || 'Ready in 3 days'}</strong>
          </p>
        </div>

        <div style="display:flex; gap:10px; align-items:center;">
          ${job.invoiceNumber ? `
            <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${job.invoiceNumber}')">
              <i class="fa-solid fa-file-invoice"></i> View Tax Invoice
            </button>
          ` : `
            <span class="badge badge-neutral" title="Invoice generated once workshop approves frame/lens">
              Invoice Pending Staff Verification
            </span>
          `}
          <span class="badge badge-primary" style="font-size:0.85rem; padding:6px 12px;">
            Current: ${job.status}
          </span>
        </div>
      </div>

      <!-- Specs & Payment Summary -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; background:var(--bg-subtle); padding:16px; border-radius:var(--radius-md); margin-bottom:24px; font-size:0.86rem;">
        <div>
          <small style="color:var(--text-muted); text-transform:uppercase;">Selected Frame</small>
          <p><strong>${job.frameName || 'Pending Selection'}</strong></p>
        </div>
        <div>
          <small style="color:var(--text-muted); text-transform:uppercase;">Selected Lens</small>
          <p><strong>${job.lensName || 'Pending Selection'}</strong></p>
        </div>
        <div>
          <small style="color:var(--text-muted); text-transform:uppercase;">Advance Paid</small>
          <p style="color:var(--emerald); font-weight:800;">${BCGUI.formatCurrency(job.advance)}</p>
        </div>
        <div>
          <small style="color:var(--text-muted); text-transform:uppercase;">Balance Due</small>
          <p style="color:${job.due > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-weight:800;">${BCGUI.formatCurrency(job.due)}</p>
        </div>
      </div>

      <!-- 7-Stage Pipeline Stepper -->
      <h4 style="font-size:0.9rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:14px;">
        Fabrication Pipeline Progress:
      </h4>
      <div class="pipeline-stepper" style="display:grid; grid-template-columns: repeat(7, 1fr); gap:6px; margin-bottom:28px;">
        ${stages.map((st, i) => {
          let stepClass = 'step-upcoming';
          if (i < activeIndex) stepClass = 'step-completed';
          else if (i === activeIndex) stepClass = 'step-current';

          return `
            <div style="text-align:center;">
              <div style="width:36px; height:36px; margin:0 auto 6px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.9rem;
                ${i < activeIndex ? 'background:var(--emerald); color:#fff;' : (i === activeIndex ? 'background:var(--primary); color:#fff; box-shadow:0 0 0 3px var(--primary-light);' : 'background:var(--bg-subtle); color:var(--text-dim);')}">
                <i class="fa-solid ${i < activeIndex ? 'fa-check' : st.icon}"></i>
              </div>
              <p style="font-size:0.7rem; font-weight:${i === activeIndex ? '800' : '600'}; color:${i === activeIndex ? 'var(--primary)' : (i < activeIndex ? 'var(--emerald)' : 'var(--text-muted)')}; line-height:1.2;">
                ${st.name}
              </p>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Detailed Workshop Audit Timeline -->
      <div style="border-top:1px solid var(--border-light); padding-top:16px;">
        <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px;">
          Workshop Audit Trail & Progress Notes:
        </h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(job.timeline || []).map(t => `
            <div style="padding:8px 12px; background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-sm); font-size:0.82rem; border-left:3px solid var(--primary);">
              <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                <strong>${t.status}</strong>
                <span style="color:var(--text-muted); font-size:0.76rem;">${t.time} • by ${t.user}</span>
              </div>
              ${t.note ? `<p style="color:var(--text-muted); margin:0;">${t.note}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // CUSTOMER STORE ORDERS (Journey A Normal & Journey B Rx Upload)
  // ==========================================================================
  renderOrders: function(orders = []) {
    const tbody = document.getElementById('customer-orders-tbody');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-muted);">No store orders placed yet.</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(ord => {
      const isInvoiceAvailable = !!ord.invoiceNumber;
      return `
        <tr>
          <td>
            <strong>${ord.id}</strong><br>
            <small style="color:var(--text-muted);">${ord.createdAt}</small>
          </td>
          <td>
            <span class="badge ${ord.orderType === 'Normal' ? 'badge-info' : 'badge-purple'}">
              ${ord.orderType === 'Normal' ? 'Ready Chasma' : 'Prescription Upload'}
            </span>
          </td>
          <td>
            ${ord.items.map(it => `<div><strong>${it.brand} ${it.model}</strong> (${it.qty}x)</div>`).join('')}
          </td>
          <td>
            <strong style="color:var(--primary); font-size:1.05rem;">${BCGUI.formatCurrency(ord.totalAmount)}</strong>
          </td>
          <td>
            <span class="badge ${ord.status === 'Confirmed / Billed' ? 'badge-success' : 'badge-warning'}">
              ${ord.status}
            </span><br>
            <small style="color:var(--text-muted); font-size:0.75rem;">${ord.deliveryStatus || 'Placed'}</small>
          </td>
          <td>
            ${isInvoiceAvailable ? `
              <span class="badge badge-success" style="font-size:0.76rem;"><i class="fa-solid fa-check"></i> ${ord.invoiceNumber}</span>
            ` : `
              <span class="badge badge-neutral" style="font-size:0.76rem;" title="Staff generates final invoice">
                Awaiting Staff Billing
              </span>
            `}
          </td>
          <td>
            ${isInvoiceAvailable ? `
              <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${ord.invoiceNumber}')">
                <i class="fa-solid fa-receipt"></i> View Tax Invoice
              </button>
            ` : `
              <button class="btn btn-sm btn-outline" disabled style="opacity:0.6; cursor:not-allowed;" title="Invoice available after staff verification">
                <i class="fa-solid fa-clock"></i> Invoice Pending
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  },

  // ==========================================================================
  // PRESCRIPTIONS
  // ==========================================================================
  renderPrescriptions: function(prescriptions = []) {
    const container = document.getElementById('customer-prescriptions-list');
    if (!container) return;

    if (prescriptions.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">No prescriptions on record.</div>';
      return;
    }

    container.innerHTML = prescriptions.map(rx => `
      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
          <div>
            <span class="badge badge-teal">Clinical Refraction</span>
            <h3 style="font-size:1.15rem; font-weight:800; margin-top:4px;">
              Prescription #${rx.id}
            </h3>
            <p style="font-size:0.82rem; color:var(--text-muted);">
              Issued on <strong>${rx.date}</strong> by <strong>${rx.doctorName || 'Dr. Satya Prakash Bhardwaj'}</strong>
            </p>
          </div>
          <button class="btn btn-sm btn-primary" onclick="BCGUI.openRxModal('${rx.id}')">
            <i class="fa-solid fa-print"></i> View & Print Doctor Rx Slip
          </button>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); font-size:0.85rem; margin-bottom:12px;">
          <div><strong>Right Eye (OD):</strong> SPH: ${rx.rightEye?.sph || '0.00'} | CYL: ${rx.rightEye?.cyl || '0.00'} | AXIS: ${rx.rightEye?.axis || '-'} | ADD: ${rx.rightEye?.add || '-'}</div>
          <div><strong>Left Eye (OS):</strong> SPH: ${rx.leftEye?.sph || '0.00'} | CYL: ${rx.leftEye?.cyl || '0.00'} | AXIS: ${rx.leftEye?.axis || '-'} | ADD: ${rx.leftEye?.add || '-'}</div>
          <div style="grid-column:1/-1;"><strong>PD:</strong> ${rx.pd || '62'} mm | <strong>Recommended Lens:</strong> ${rx.lensRecommendation || 'Anti-Glare Blue Cut'}</div>
        </div>

        ${rx.medicines && rx.medicines.length > 0 ? `
          <div style="font-size:0.82rem; color:var(--text-muted);">
            <strong>Prescribed Eye Drops:</strong>
            ${rx.medicines.map(m => `<span class="badge badge-neutral" style="margin:2px 4px;">${m.name} (${m.frequency})</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  },

  // ==========================================================================
  // CLINICAL EYE RECORDS
  // ==========================================================================
  renderEyeRecords: function(exams = []) {
    const tbody = document.getElementById('customer-eyerecords-tbody');
    if (!tbody) return;

    if (exams.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">No clinical eye examination records.</td></tr>';
      return;
    }

    tbody.innerHTML = exams.map(ex => `
      <tr>
        <td><strong>${ex.id}</strong></td>
        <td>${ex.date}</td>
        <td>${ex.doctorName || 'Dr. Satya Prakash Bhardwaj'}</td>
        <td>
          OD: ${ex.rightEye?.sph || '0.00'} / ${ex.rightEye?.cyl || '0.00'} x ${ex.rightEye?.axis || '-'}<br>
          OS: ${ex.leftEye?.sph || '0.00'} / ${ex.leftEye?.cyl || '0.00'} x ${ex.leftEye?.axis || '-'}
        </td>
        <td>${ex.eyePressure || '14 mmHg'}</td>
        <td>${ex.observations || 'Normal eye health'}</td>
      </tr>
    `).join('');
  },

  // ==========================================================================
  // REPAIRS
  // ==========================================================================
  renderRepairs: function(repairs = []) {
    const tbody = document.getElementById('customer-repairs-tbody');
    if (!tbody) return;

    if (repairs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">No chasma repairs registered.</td></tr>';
      return;
    }

    tbody.innerHTML = repairs.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td><strong>${r.frameDescription}</strong></td>
        <td>${r.problem}</td>
        <td>Cost: ${BCGUI.formatCurrency(r.finalCost)} | Due: <strong style="color:${r.due > 0 ? 'var(--rose)' : 'var(--emerald)'};">${BCGUI.formatCurrency(r.due)}</strong></td>
        <td>
          <span class="badge ${r.status === 'Ready' ? 'badge-success' : 'badge-warning'}">
            ${r.status}
          </span>
        </td>
        <td>${r.expectedDelivery || 'Next Day'}</td>
      </tr>
    `).join('');
  },

  // ==========================================================================
  // INVOICES
  // ==========================================================================
  renderInvoices: function(invoices = []) {
    const tbody = document.getElementById('customer-invoices-tbody');
    if (!tbody) return;

    if (invoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">No invoices generated by staff yet.</td></tr>';
      return;
    }

    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td><strong>${inv.id}</strong></td>
        <td>${inv.date}</td>
        <td>${inv.jobId || inv.orderId || 'Direct Retail'}</td>
        <td>${inv.items.map(it => it.name).join(', ')}</td>
        <td><strong>${BCGUI.formatCurrency(inv.grandTotal)}</strong></td>
        <td>
          <span class="badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">
            ${inv.paymentStatus}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${inv.id}')">
            <i class="fa-solid fa-receipt"></i> View Invoice
          </button>
        </td>
      </tr>
    `).join('');
  },

  populateProfileForm: function(patient) {
    const nameInp = document.getElementById('prof-name');
    const phoneInp = document.getElementById('prof-phone');
    const emailInp = document.getElementById('prof-email');
    const addressInp = document.getElementById('prof-address');

    if (nameInp) nameInp.value = patient.name || "";
    if (phoneInp) phoneInp.value = patient.phone || "";
    if (emailInp) emailInp.value = patient.email || "";
    if (addressInp) addressInp.value = patient.address || "Itaily Moad, Mehnajpur, Azamgarh";
  },

  saveProfile: function() {
    const db = window.BCGStore.getDB();
    const patient = db.patients.find(p => p.id === this.currentPatient.id);
    if (!patient) return;

    patient.name = document.getElementById('prof-name').value.trim();
    patient.email = document.getElementById('prof-email').value.trim();
    patient.address = document.getElementById('prof-address').value.trim();

    window.BCGStore.saveDB(db);
    BCGUI.toast("Profile updated successfully", "success");
    this.loadPatientData(patient.id);
  }
};

window.CustomerApp = CustomerApp;

document.addEventListener('DOMContentLoaded', () => {
  CustomerApp.init();
});
