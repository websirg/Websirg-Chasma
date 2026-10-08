/**
 * Bhardwaj Chasma Ghar - Core Shared UI & Customer 360 Controller (Phase 1)
 */

const BCGUI = {
  // Toast notifications
  toast: function(message, type = 'info') {
    let container = document.getElementById('bcg-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bcg-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      min-width: 280px;
      max-width: 400px;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #ffffff;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.15);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: auto;
    `;

    if (type === 'success') {
      toast.style.background = '#059669'; // Emerald
      toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    } else if (type === 'error' || type === 'danger') {
      toast.style.background = '#e11d48'; // Rose
      toast.innerHTML = `<span>✕</span> <span>${message}</span>`;
    } else if (type === 'warning') {
      toast.style.background = '#d97706'; // Amber
      toast.innerHTML = `<span>⚠</span> <span>${message}</span>`;
    } else {
      toast.style.background = '#0284c7'; // Blue
      toast.innerHTML = `<span>ℹ</span> <span>${message}</span>`;
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  },

  // Modal helpers
  openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  // Currency Formatter (INR ₹)
  formatCurrency: function(num) {
    return '₹' + Number(num || 0).toLocaleString('en-IN');
  },

  // Setup Global Header User Widget & Logout
  setupHeaderWidget: function() {
    const user = window.BCGAuth.getCurrentUser();
    const userArea = document.getElementById('auth-user-area');
    if (!userArea) return;

    if (user) {
      let roleBadge = '';
      if (user.role === 'admin') roleBadge = '<span class="badge badge-purple">Admin</span>';
      else if (user.role === 'doctor') roleBadge = '<span class="badge badge-teal">Doctor</span>';
      else if (user.role === 'staff') roleBadge = '<span class="badge badge-info">Staff</span>';
      else roleBadge = '<span class="badge badge-success">Patient</span>';

      let panelLink = 'customer.html';
      if (user.role === 'admin') panelLink = 'admin.html';
      else if (user.role === 'doctor') panelLink = 'doctor.html';
      else if (user.role === 'staff') panelLink = 'staff.html';

      userArea.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="${panelLink}" class="btn btn-sm btn-outline">
            <strong>${user.name}</strong> ${roleBadge}
          </a>
          <button onclick="BCGAuth.logout()" class="btn btn-sm btn-danger" title="Logout">
            Logout
          </button>
        </div>
      `;
    } else {
      userArea.innerHTML = `
        <a href="login.html" class="btn btn-sm btn-outline">Login</a>
        <a href="store.html" class="btn btn-sm btn-primary">Optical Store</a>
      `;
    }
  },

  // Open Reusable Customer 360 View
  openCustomer360: function(patientId) {
    const data = window.BCGStore.getCustomer360(patientId);
    if (!data || !data.patient) {
      this.toast("Customer records not found", "error");
      return;
    }

    const { patient, exams, prescriptions, opticalJobs, repairs, invoices, totalSpent, totalDue } = data;

    let container = document.getElementById('modal-customer-360');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-customer-360';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="modal-box" style="max-width: 880px;">
        <div class="modal-header" style="background: linear-gradient(135deg, #f0f9ff, #f8fafc);">
          <div>
            <span class="badge badge-teal">Customer 360° Profile</span>
            <h2 class="modal-title" style="margin-top: 4px;">${patient.name} <span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;">(${patient.id})</span></h2>
          </div>
          <button class="modal-close" onclick="BCGUI.closeModal('modal-customer-360')">&times;</button>
        </div>

        <div class="modal-body" style="padding: 24px;">
          <!-- Customer Demographics Bar -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; background:var(--bg-subtle); padding:16px; border-radius:var(--radius-md); margin-bottom: 20px;">
            <div><small style="color:var(--text-muted);">Mobile</small><p><strong>${patient.phone}</strong></p></div>
            <div><small style="color:var(--text-muted);">Age / Gender</small><p><strong>${patient.age} Yrs / ${patient.gender}</strong></p></div>
            <div><small style="color:var(--text-muted);">Occupation</small><p><strong>${patient.occupation || 'N/A'}</strong></p></div>
            <div><small style="color:var(--text-muted);">Total Spend</small><p style="color:var(--emerald); font-weight:800;">${this.formatCurrency(totalSpent)}</p></div>
            <div><small style="color:var(--text-muted);">Current Due</small><p style="color:${totalDue > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-weight:800;">${this.formatCurrency(totalDue)}</p></div>
          </div>

          <div style="margin-bottom: 18px; font-size: 0.86rem; color: var(--text-muted);">
            <strong>Address:</strong> ${patient.address || 'Kanpur, UP'} &nbsp;|&nbsp; 
            <strong>Emergency Contact:</strong> ${patient.emergencyContact || 'None'} &nbsp;|&nbsp;
            <strong>Medical Notes:</strong> <span style="color:var(--text-main);">${patient.medicalHistory || 'None'}</span>
          </div>

          <!-- Section Tabs Navigation -->
          <div style="display:flex; gap:10px; border-bottom:1px solid var(--border-light); margin-bottom:16px; padding-bottom:8px;">
            <button class="btn btn-sm btn-outline active" onclick="BCGUI.switch360Tab('c360-jobs', this)">Optical Jobs (${opticalJobs.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-rx', this)">Prescriptions (${prescriptions.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-repairs', this)">Repairs (${repairs.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-invoices', this)">Invoices (${invoices.length})</button>
          </div>

          <!-- Tab 1: Optical Jobs -->
          <div id="c360-jobs" class="c360-tab-pane">
            ${opticalJobs.length === 0 ? '<p style="color:var(--text-muted);">No optical jobs recorded yet.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Frame & Lens</th>
                      <th>Total</th>
                      <th>Advance</th>
                      <th>Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${opticalJobs.map(job => `
                      <tr>
                        <td><strong>${job.id}</strong><br><small style="color:var(--text-muted);">${job.createdAt}</small></td>
                        <td>
                          <strong>${job.frameName}</strong><br>
                          <small style="color:var(--text-muted);">${job.lensName}</small>
                        </td>
                        <td><strong>${this.formatCurrency(job.total)}</strong></td>
                        <td>${this.formatCurrency(job.advance)}</td>
                        <td style="color:${job.due > 0 ? 'var(--rose)' : 'inherit'}; font-weight:700;">${this.formatCurrency(job.due)}</td>
                        <td><span class="badge ${job.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${job.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Tab 2: Prescriptions -->
          <div id="c360-rx" class="c360-tab-pane" style="display:none;">
            ${prescriptions.length === 0 ? '<p style="color:var(--text-muted);">No prescriptions on record.</p>' : `
              <div style="display:flex; flex-direction:column; gap:14px;">
                ${prescriptions.map(rx => `
                  <div style="border:1px solid var(--border-light); border-radius:var(--radius-md); padding:16px; background:#ffffff;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                      <div>
                        <strong>Prescription #${rx.id}</strong> — <small style="color:var(--text-muted);">${rx.date} by ${rx.doctorName}</small>
                      </div>
                      <button class="btn btn-sm btn-outline" onclick="BCGUI.openRxModal('${rx.id}')">View Rx Slip</button>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem; background:var(--bg-subtle); padding:10px; border-radius:var(--radius-sm);">
                      <div><strong>Right Eye (OD):</strong> SPH: ${rx.rightEye.sph || '0.00'} | CYL: ${rx.rightEye.cyl || '0.00'} | AXIS: ${rx.rightEye.axis || '-'} | ADD: ${rx.rightEye.add || '-'}</div>
                      <div><strong>Left Eye (OS):</strong> SPH: ${rx.leftEye.sph || '0.00'} | CYL: ${rx.leftEye.cyl || '0.00'} | AXIS: ${rx.leftEye.axis || '-'} | ADD: ${rx.leftEye.add || '-'}</div>
                    </div>
                    ${rx.medicines && rx.medicines.length > 0 ? `
                      <div style="margin-top:10px; font-size:0.82rem;">
                        <strong>Prescribed Medicines:</strong>
                        <ul style="padding-left:18px; margin-top:4px; color:var(--text-muted);">
                          ${rx.medicines.map(m => `<li><strong>${m.name}</strong> (${m.dose}) - ${m.frequency} for ${m.duration}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Tab 3: Repairs -->
          <div id="c360-repairs" class="c360-tab-pane" style="display:none;">
            ${repairs.length === 0 ? '<p style="color:var(--text-muted);">No repair jobs registered.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Repair ID</th>
                      <th>Frame</th>
                      <th>Problem</th>
                      <th>Cost</th>
                      <th>Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${repairs.map(rep => `
                      <tr>
                        <td><strong>${rep.id}</strong></td>
                        <td>${rep.frameDescription}</td>
                        <td>${rep.problem}</td>
                        <td>${this.formatCurrency(rep.finalCost)}</td>
                        <td style="color:${rep.due > 0 ? 'var(--rose)' : 'inherit'};">${this.formatCurrency(rep.due)}</td>
                        <td><span class="badge ${rep.status === 'Ready' || rep.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${rep.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Tab 4: Invoices -->
          <div id="c360-invoices" class="c360-tab-pane" style="display:none;">
            ${invoices.length === 0 ? '<p style="color:var(--text-muted);">No invoices generated.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Advance</th>
                      <th>Balance Due</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoices.map(inv => `
                      <tr>
                        <td><strong>${inv.id}</strong></td>
                        <td>${inv.date}</td>
                        <td><strong>${this.formatCurrency(inv.grandTotal)}</strong></td>
                        <td>${this.formatCurrency(inv.advancePaid)}</td>
                        <td style="color:${inv.dueAmount > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-weight:700;">${this.formatCurrency(inv.dueAmount)}</td>
                        <td>
                          <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${inv.id}')">View Invoice</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" onclick="BCGUI.closeModal('modal-customer-360')">Close Profile</button>
        </div>
      </div>
    `;

    this.openModal('modal-customer-360');
  },

  switch360Tab: function(tabId, btn) {
    document.querySelectorAll('.c360-tab-pane').forEach(el => el.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  // Official Printable Prescription Pad Modal
  openRxModal: function(rxId) {
    const db = window.BCGStore.getDB();
    const rx = db.prescriptions.find(r => r.id === rxId);
    if (!rx) {
      this.toast("Prescription not found", "error");
      return;
    }
    const patient = db.patients.find(p => p.id === rx.patientId) || {};
    const settings = db.settings;

    let container = document.getElementById('modal-rx-view');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-rx-view';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="modal-box" style="max-width: 760px;">
        <div class="modal-header no-print">
          <h3 class="modal-title">Official Medical Prescription (${rx.id})</h3>
          <button class="modal-close" onclick="BCGUI.closeModal('modal-rx-view')">&times;</button>
        </div>

        <div class="modal-body">
          <div class="rx-pad">
            <div class="rx-pad-header">
              <div class="rx-pad-doctor">
                <h2>${rx.doctorName || 'Dr. Alok Bhardwaj'}</h2>
                <p>MBBS, MS (Ophthalmology) • Reg. UP-MC-45920</p>
                <p>Senior Eye Specialist & Refractive Surgeon</p>
              </div>
              <div class="rx-pad-clinic">
                <h3>${settings.name}</h3>
                <p>${settings.tagline}</p>
                <p>${settings.address}</p>
                <p>Tel: ${settings.phone}</p>
              </div>
            </div>

            <div class="rx-patient-bar">
              <div><strong>Patient:</strong> ${patient.name || 'Rahul Sharma'} (${patient.id || rx.patientId})</div>
              <div><strong>Age/Gender:</strong> ${patient.age || '29'} Yrs / ${patient.gender || 'Male'}</div>
              <div><strong>Date:</strong> ${rx.date}</div>
              <div><strong>Rx ID:</strong> ${rx.id}</div>
            </div>

            <div class="rx-symbol">℞</div>

            <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:8px; color:var(--text-main);">Spectacle Refraction (Chasma Number):</h4>
            <table class="rx-table" style="margin-bottom: 20px;">
              <thead>
                <tr>
                  <th>Eye</th>
                  <th>SPH (Spherical)</th>
                  <th>CYL (Cylindrical)</th>
                  <th>AXIS (1°-180°)</th>
                  <th>ADD (Near)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="eye-label">Right Eye (OD)</td>
                  <td><strong>${rx.rightEye.sph || '0.00'}</strong></td>
                  <td><strong>${rx.rightEye.cyl || '0.00'}</strong></td>
                  <td><strong>${rx.rightEye.axis || '-'}</strong></td>
                  <td><strong>${rx.rightEye.add || '-'}</strong></td>
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

            <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:0.88rem; background:var(--bg-subtle); padding:10px 14px; border-radius:var(--radius-sm);">
              <div><strong>Pupillary Distance (PD):</strong> ${rx.pd || '62'} mm</div>
              <div><strong>Recommended Lens:</strong> ${rx.lensRecommendation || 'Anti-Glare / Blue-Cut Digital Lens'}</div>
            </div>

            ${rx.medicines && rx.medicines.length > 0 ? `
              <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:8px; color:var(--text-main);">Prescribed Eye Drops & Medicines:</h4>
              <div class="table-responsive" style="margin-bottom:20px;">
                <table class="data-table" style="font-size:0.85rem;">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dose</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rx.medicines.map(m => `
                      <tr>
                        <td><strong>${m.name}</strong></td>
                        <td>${m.dose}</td>
                        <td><span class="badge badge-info">${m.frequency}</span></td>
                        <td>${m.duration}</td>
                        <td>${m.instructions}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            ${rx.notes ? `
              <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:30px;">
                <strong>Doctor's Clinical Notes:</strong> ${rx.notes}
              </div>
            ` : ''}

            <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed var(--border-medium); padding-top:24px; margin-top:20px;">
              <div style="font-size:0.75rem; color:var(--text-muted); max-width:320px;">
                * This prescription is valid for 6 months. For optical fabrication, verified at Bhardwaj Chasma Ghar precision dispensary.
              </div>
              <div style="text-align:center;">
                <div style="font-family:'Brush Script MT', cursive; font-size:1.8rem; color:var(--primary); line-height:1;">Dr. Alok Bhardwaj</div>
                <div style="border-top:1px solid #0f172a; width:160px; margin-top:4px;"></div>
                <small style="font-size:0.75rem; font-weight:700;">Doctor's Signature & Seal</small>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer no-print">
          <button class="btn btn-outline" onclick="BCGUI.closeModal('modal-rx-view')">Close</button>
          <button class="btn btn-primary" onclick="window.print()">Print / Download PDF</button>
        </div>
      </div>
    `;

    this.openModal('modal-rx-view');
  },

  // Official Printable GST Tax Invoice Sheet Modal
  openInvoiceModal: function(invoiceId) {
    const db = window.BCGStore.getDB();
    const inv = db.invoices.find(i => i.id === invoiceId);
    if (!inv) {
      this.toast("Invoice not found", "error");
      return;
    }
    const settings = db.settings;

    let container = document.getElementById('modal-invoice-view');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-invoice-view';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="modal-box" style="max-width: 820px;">
        <div class="modal-header no-print">
          <h3 class="modal-title">GST Tax Invoice (${inv.id})</h3>
          <button class="modal-close" onclick="BCGUI.closeModal('modal-invoice-view')">&times;</button>
        </div>

        <div class="modal-body">
          <div class="invoice-sheet">
            <div class="invoice-header">
              <div>
                <h2 style="font-size:1.5rem; font-weight:800; color:var(--primary);">${settings.name}</h2>
                <p style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">${settings.tagline}</p>
                <p style="font-size:0.8rem; color:var(--text-muted); max-width:320px;">${settings.address}</p>
                <p style="font-size:0.8rem;"><strong>GSTIN:</strong> ${settings.gstin}</p>
                <p style="font-size:0.8rem;"><strong>Contact:</strong> ${settings.phone}</p>
              </div>
              <div style="text-align:right;">
                <span class="badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}" style="font-size:0.85rem; padding:6px 14px;">
                  ${inv.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'PARTIAL ADVANCE'}
                </span>
                <h3 style="font-size:1.2rem; font-weight:800; margin-top:8px;">INVOICE</h3>
                <p style="font-size:0.88rem;"><strong>Invoice #:</strong> ${inv.id}</p>
                <p style="font-size:0.85rem;"><strong>Optical Job #:</strong> ${inv.jobId || 'N/A'}</p>
                <p style="font-size:0.85rem;"><strong>Date:</strong> ${inv.date}</p>
                <p style="font-size:0.85rem;"><strong>Delivery Due:</strong> ${inv.expectedDelivery || 'Ready in 3 days'}</p>
              </div>
            </div>

            <div class="invoice-meta-grid">
              <div>
                <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Billed To (Customer):</h4>
                <p style="font-size:1rem; font-weight:700;">${inv.customerName}</p>
                <p style="font-size:0.85rem;">Phone: <strong>${inv.customerPhone}</strong></p>
                <p style="font-size:0.85rem;">Address: ${inv.customerAddress || 'Kanpur'}</p>
              </div>
              <div>
                <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Clinical Reference:</h4>
                <p style="font-size:0.85rem;">Ref. Doctor: <strong>${inv.doctorName || 'Dr. Alok Bhardwaj'}</strong></p>
                <p style="font-size:0.85rem;">Prescription #: <strong>${inv.prescriptionRef || 'RX-Direct'}</strong></p>
                <p style="font-size:0.85rem;">Dispensed By: <strong>${inv.staffName || 'Manoj Sharma'}</strong></p>
              </div>
            </div>

            <table class="data-table" style="margin-bottom:20px;">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Rate</th>
                  <th style="text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${inv.items.map((it, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${it.name}</strong></td>
                    <td style="text-align:center;">${it.qty}</td>
                    <td style="text-align:right;">${this.formatCurrency(it.rate)}</td>
                    <td style="text-align:right;"><strong>${this.formatCurrency(it.amount)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="bill-summary-box">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${this.formatCurrency(inv.subtotal)}</span>
              </div>
              ${inv.discount > 0 ? `
                <div class="summary-row" style="color:var(--emerald);">
                  <span>Discount:</span>
                  <span>-${this.formatCurrency(inv.discount)}</span>
                </div>
              ` : ''}
              <div class="summary-row" style="font-weight:700;">
                <span>Total Amount:</span>
                <span>${this.formatCurrency(inv.grandTotal)}</span>
              </div>
              <div class="summary-row" style="color:var(--primary); font-weight:700;">
                <span>Advance Paid (${inv.paymentMethod || 'Cash/UPI'}):</span>
                <span>${this.formatCurrency(inv.advancePaid)}</span>
              </div>
              <div class="summary-row total-due">
                <span>Remaining Balance Due:</span>
                <span>${this.formatCurrency(inv.dueAmount)}</span>
              </div>
            </div>

            <div style="margin-top:36px; padding-top:16px; border-top:1px solid var(--border-light); display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted);">
              <div>
                <p>• Goods once sold will be adjusted or exchanged as per company optical policy.</p>
                <p>• 1-Year coating warranty against peel-off on premium anti-reflective lenses.</p>
                <p>• Please bring this invoice at the time of delivery.</p>
              </div>
              <div style="text-align:center;">
                <div style="height:36px;"></div>
                <p><strong>For Bhardwaj Chasma Ghar</strong></p>
                <p style="font-size:0.7rem;">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer no-print">
          <button class="btn btn-outline" onclick="BCGUI.closeModal('modal-invoice-view')">Close</button>
          <button class="btn btn-primary" onclick="window.print()">Print Official Invoice</button>
        </div>
      </div>
    `;

    this.openModal('modal-invoice-view');
  }
};

window.BCGUI = BCGUI;

document.addEventListener('DOMContentLoaded', () => {
  BCGUI.setupHeaderWidget();
});
