/**
 * Bhardwaj Chasma Ghar - Optical Staff & Workshop Controller (Phase 1)
 */

const StaffApp = {
  currentEditingJobId: null,

  init: function() {
    const user = window.BCGAuth.requireRole(['staff', 'admin']);
    if (!user) return;

    if (user) {
      const staffNameEl = document.getElementById('staff-name');
      if (staffNameEl) staffNameEl.textContent = user.name;
    }

    this.renderStats();
    this.renderJobsList();
    this.renderRepairsList();
    this.renderInventoryList();
    this.renderInvoicesList();
    this.populateFrameDropdown();
    this.populateLensDropdown();
  },

  showSection: function(sectionName, navEl) {
    const sections = ['jobs', 'repairs', 'inventory', 'invoices'];
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
      if (sectionName === 'jobs') titleEl.textContent = "Optical Dispensing & Chasma Production Orders";
      else if (sectionName === 'repairs') titleEl.textContent = "Chasma Repair & Service Counter";
      else if (sectionName === 'inventory') titleEl.textContent = "Optical Frame Catalog & Stock Tracking";
      else if (sectionName === 'invoices') titleEl.textContent = "Customer Tax Invoices & Payments";
    }
  },

  renderStats: function() {
    const db = window.BCGStore.getDB();
    const jobs = db.optical_jobs || [];

    const newJobs = jobs.filter(j => j.status === 'Prescription Received').length;
    const labJobs = jobs.filter(j => ['Frame Selected', 'Lens Processing', 'Fitting', 'Quality Check'].includes(j.status)).length;
    const readyJobs = jobs.filter(j => j.status === 'Ready').length;
    const totalDues = jobs.reduce((sum, j) => sum + (j.due || 0), 0);

    const elNew = document.getElementById('stat-new-jobs');
    const elLab = document.getElementById('stat-lab-jobs');
    const elReady = document.getElementById('stat-ready-jobs');
    const elDues = document.getElementById('stat-pending-dues');

    if (elNew) elNew.textContent = newJobs;
    if (elLab) elLab.textContent = labJobs;
    if (elReady) elReady.textContent = readyJobs;
    if (elDues) elDues.textContent = BCGUI.formatCurrency(totalDues);
  },

  renderJobsList: function() {
    const tbody = document.getElementById('jobs-table-body');
    if (!tbody) return;

    const jobs = window.BCGStore.getOpticalJobs();
    if (jobs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">No optical jobs currently in queue.</td></tr>';
      return;
    }

    tbody.innerHTML = jobs.map(job => {
      let statusBadgeClass = 'badge-neutral';
      if (job.status === 'Prescription Received') statusBadgeClass = 'badge-info';
      else if (['Frame Selected', 'Lens Processing', 'Fitting'].includes(job.status)) statusBadgeClass = 'badge-warning';
      else if (job.status === 'Ready') statusBadgeClass = 'badge-teal';
      else if (job.status === 'Delivered') statusBadgeClass = 'badge-success';

      return `
        <tr>
          <td>
            <strong>${job.id}</strong><br>
            <small style="color:var(--text-muted);">${job.createdAt}</small>
          </td>
          <td>
            <strong>${job.patientName}</strong><br>
            <small style="color:var(--text-muted);">${job.patientPhone}</small>
          </td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.openRxModal('${job.prescriptionId}')" title="View Doctor Rx">
              <i class="fa-solid fa-file-prescription"></i> ${job.prescriptionId}
            </button>
          </td>
          <td>
            <strong>${job.frameName}</strong><br>
            <small style="color:var(--text-muted);">${job.lensName}</small>
          </td>
          <td>
            <strong>${BCGUI.formatCurrency(job.total)}</strong><br>
            <span style="font-size:0.75rem; color:${job.due > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-weight:700;">
              ${job.due > 0 ? `Due: ${BCGUI.formatCurrency(job.due)}` : 'Fully Paid'}
            </span>
          </td>
          <td>
            <span class="badge ${statusBadgeClass}">${job.status}</span>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-primary" onclick="StaffApp.openJobEditor('${job.id}')" title="Manage Frame, Lens & Status">
                <i class="fa-solid fa-pen-to-square"></i> Process
              </button>
              ${job.invoiceNumber ? `
                <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${job.invoiceNumber}')" title="Print Invoice">
                  <i class="fa-solid fa-print"></i>
                </button>
              ` : ''}
              <button class="btn btn-sm btn-outline" onclick="BCGUI.openCustomer360('${job.patientId}')" title="Customer 360">
                <i class="fa-solid fa-circle-user"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterJobs: function() {
    const q = (document.getElementById('job-search-input').value || '').toLowerCase();
    const rows = document.querySelectorAll('#jobs-table-body tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(q) ? '' : 'none';
    });
  },

  populateFrameDropdown: function() {
    const select = document.getElementById('edit-frame-select');
    if (!select) return;

    const frames = window.BCGStore.getDB().frames || [];
    select.innerHTML = '<option value="">-- Choose Frame from Stock --</option>' +
      frames.map(f => `<option value="${f.id}" data-price="${f.price}" data-name="${f.brand} ${f.model}">${f.brand} - ${f.model} (${f.color}) — ₹${f.price} (Stock: ${f.stock})</option>`).join('');
  },

  populateLensDropdown: function() {
    const select = document.getElementById('edit-lens-select');
    if (!select) return;

    const lenses = window.BCGStore.getDB().lenses || [];
    select.innerHTML = '<option value="">-- Choose Lens Package --</option>' +
      lenses.map(l => `<option value="${l.id}" data-price="${l.price}" data-name="${l.brand} ${l.name}">${l.name} (${l.type}) — ₹${l.price}</option>`).join('');
  },

  openJobEditor: function(jobId) {
    const job = window.BCGStore.getOpticalJobById(jobId);
    if (!job) {
      BCGUI.toast("Job not found", "error");
      return;
    }

    this.currentEditingJobId = jobId;

    // Header & Meta
    document.getElementById('edit-job-title').textContent = `Optical Job #${job.id}`;
    document.getElementById('edit-job-badge').textContent = job.status;
    document.getElementById('edit-job-patient').textContent = job.patientName;
    document.getElementById('edit-job-phone').textContent = job.patientPhone;
    document.getElementById('edit-job-rx-ref').textContent = job.prescriptionId;
    document.getElementById('edit-job-doctor').textContent = job.doctorName || "Dr. Alok Bhardwaj";

    // Rx Table Display (Read-Only)
    const rxBody = document.getElementById('edit-job-rx-table-body');
    const rx = job.rxDetails || { right: {}, left: {}, pd: "62" };
    rxBody.innerHTML = `
      <tr>
        <td class="eye-label">Right Eye (OD)</td>
        <td><strong>${rx.right.sph || '0.00'}</strong></td>
        <td><strong>${rx.right.cyl || '0.00'}</strong></td>
        <td><strong>${rx.right.axis || '-'}</strong></td>
        <td><strong>${rx.right.add || '-'}</strong></td>
        <td rowspan="2" style="vertical-align:middle; font-weight:800; background:#f8fafc;">${rx.pd || '62'}</td>
      </tr>
      <tr>
        <td class="eye-label">Left Eye (OS)</td>
        <td><strong>${rx.left.sph || '0.00'}</strong></td>
        <td><strong>${rx.left.cyl || '0.00'}</strong></td>
        <td><strong>${rx.left.axis || '-'}</strong></td>
        <td><strong>${rx.left.add || '-'}</strong></td>
      </tr>
    `;

    // Populate Fields
    document.getElementById('edit-frame-select').value = job.frameId || "";
    document.getElementById('edit-frame-price').value = job.framePrice || 0;
    document.getElementById('edit-lens-select').value = job.lensId || "";
    document.getElementById('edit-lens-price').value = job.lensPrice || 0;
    document.getElementById('edit-fitting-charge').value = job.fittingCharge || 150;
    document.getElementById('edit-discount').value = job.discount || 0;
    document.getElementById('edit-total').value = job.total || 0;
    document.getElementById('edit-advance').value = job.advance || 0;
    document.getElementById('edit-due').value = job.due || 0;
    document.getElementById('edit-payment-method').value = job.paymentMethod || "UPI (Google Pay / PhonePe)";
    document.getElementById('edit-job-status').value = job.status || "Prescription Received";
    document.getElementById('edit-expected-delivery').value = job.expectedDelivery || "";
    document.getElementById('edit-status-note').value = "";

    // Timeline Rendering
    const timelineContainer = document.getElementById('edit-job-timeline-list');
    const timeline = job.timeline || [];
    timelineContainer.innerHTML = timeline.map(t => `
      <div style="background:#f8fafc; padding:6px 10px; border-radius:4px; border-left:3px solid var(--primary);">
        <strong>${t.status}</strong> — <small style="color:var(--text-muted);">${t.time} by ${t.user}</small>
        <div style="color:var(--text-main); font-size:0.8rem;">${t.note || ''}</div>
      </div>
    `).reverse().join('');

    BCGUI.openModal('modal-job-editor');
  },

  onFrameSelected: function(frameId) {
    const select = document.getElementById('edit-frame-select');
    const opt = select.options[select.selectedIndex];
    if (opt && opt.dataset.price) {
      document.getElementById('edit-frame-price').value = opt.dataset.price;
    }
    this.recalculateJobBill();
  },

  onLensSelected: function(lensId) {
    const select = document.getElementById('edit-lens-select');
    const opt = select.options[select.selectedIndex];
    if (opt && opt.dataset.price) {
      document.getElementById('edit-lens-price').value = opt.dataset.price;
    }
    this.recalculateJobBill();
  },

  recalculateJobBill: function() {
    const framePrice = Number(document.getElementById('edit-frame-price').value) || 0;
    const lensPrice = Number(document.getElementById('edit-lens-price').value) || 0;
    const fitting = Number(document.getElementById('edit-fitting-charge').value) || 0;
    const discount = Number(document.getElementById('edit-discount').value) || 0;
    const advance = Number(document.getElementById('edit-advance').value) || 0;

    const subtotal = framePrice + lensPrice + fitting;
    const total = Math.max(0, subtotal - discount);
    const due = Math.max(0, total - advance);

    document.getElementById('edit-total').value = total;
    document.getElementById('edit-due').value = due;
  },

  saveJobModifications: function() {
    if (!this.currentEditingJobId) return;

    const frameSelect = document.getElementById('edit-frame-select');
    const frameOpt = frameSelect.options[frameSelect.selectedIndex];
    const frameName = frameOpt && frameOpt.value ? frameOpt.dataset.name : "Custom Frame";

    const lensSelect = document.getElementById('edit-lens-select');
    const lensOpt = lensSelect.options[lensSelect.selectedIndex];
    const lensName = lensOpt && lensOpt.value ? lensOpt.dataset.name : "Custom Lens Package";

    const framePrice = Number(document.getElementById('edit-frame-price').value) || 0;
    const lensPrice = Number(document.getElementById('edit-lens-price').value) || 0;
    const fittingCharge = Number(document.getElementById('edit-fitting-charge').value) || 0;
    const discount = Number(document.getElementById('edit-discount').value) || 0;
    const total = Number(document.getElementById('edit-total').value) || 0;
    const advance = Number(document.getElementById('edit-advance').value) || 0;
    const due = Number(document.getElementById('edit-due').value) || 0;
    const paymentMethod = document.getElementById('edit-payment-method').value;
    const status = document.getElementById('edit-job-status').value;
    const statusNote = document.getElementById('edit-status-note').value.trim();
    const expectedDelivery = document.getElementById('edit-expected-delivery').value;

    const updatePayload = {
      frameId: frameSelect.value,
      frameName: frameName,
      framePrice: framePrice,
      lensId: lensSelect.value,
      lensName: lensName,
      lensPrice: lensPrice,
      fittingCharge: fittingCharge,
      discount: discount,
      total: total,
      advance: advance,
      due: due,
      paymentMethod: paymentMethod,
      status: status,
      statusNote: statusNote,
      expectedDelivery: expectedDelivery
    };

    const user = window.BCGAuth.getCurrentUser();
    const updatedJob = window.BCGStore.updateOpticalJob(this.currentEditingJobId, updatePayload, user ? user.name : "Manoj Sharma");

    BCGUI.toast(`Optical Job #${this.currentEditingJobId} updated successfully!`, "success");
    BCGUI.closeModal('modal-job-editor');

    this.renderStats();
    this.renderJobsList();
    this.renderInvoicesList();
  },

  viewSelectedPatient360: function() {
    const job = window.BCGStore.getOpticalJobById(this.currentEditingJobId);
    if (job) BCGUI.openCustomer360(job.patientId);
  },

  // REPAIR MANAGEMENT
  renderRepairsList: function() {
    const tbody = document.getElementById('repairs-table-body');
    if (!tbody) return;

    const repairs = window.BCGStore.getRepairs();
    if (repairs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No repair jobs logged.</td></tr>';
      return;
    }

    tbody.innerHTML = repairs.map(rep => {
      let badge = 'badge-warning';
      if (rep.status === 'Ready' || rep.status === 'Delivered') badge = 'badge-success';

      return `
        <tr>
          <td><strong>${rep.id}</strong></td>
          <td><strong>${rep.customerName}</strong><br><small style="color:var(--text-muted);">${rep.customerPhone}</small></td>
          <td>${rep.frameDescription}</td>
          <td><span style="font-size:0.84rem;">${rep.problem}</span></td>
          <td>
            <strong>${BCGUI.formatCurrency(rep.finalCost)}</strong><br>
            <small style="color:var(--text-muted);">Adv: ${BCGUI.formatCurrency(rep.advance)}</small>
          </td>
          <td>
            <span style="font-weight:700; color:${rep.due > 0 ? 'var(--rose)' : 'var(--emerald)'};">
              ${BCGUI.formatCurrency(rep.due)}
            </span>
          </td>
          <td>
            <select class="form-control" style="padding:4px 8px; font-size:0.8rem; width:130px;" onchange="StaffApp.onRepairStatusChange('${rep.id}', this.value)">
              ${['Received', 'Inspection', 'Estimate', 'Customer Approval', 'Repairing', 'Ready', 'Delivered'].map(s => 
                `<option value="${s}" ${rep.status === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.openCustomer360('${rep.customerPhone}')" title="Customer 360">
              <i class="fa-solid fa-user"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  onRepairStatusChange: function(repairId, newStatus) {
    const user = window.BCGAuth.getCurrentUser();
    window.BCGStore.updateRepairStatus(repairId, newStatus, `Staff updated repair status to ${newStatus}`, user ? user.name : "Staff");
    BCGUI.toast(`Repair ticket #${repairId} marked as ${newStatus}`, "success");
    this.renderRepairsList();
  },

  openNewRepairModal: function() {
    document.getElementById('form-new-repair').reset();
    BCGUI.openModal('modal-new-repair');
  },

  submitNewRepair: function() {
    const name = document.getElementById('rep-name').value.trim();
    const phone = document.getElementById('rep-phone').value.trim();
    const frame = document.getElementById('rep-frame').value.trim();
    const problem = document.getElementById('rep-problem').value.trim();
    const cost = Number(document.getElementById('rep-cost').value) || 0;
    const advance = Number(document.getElementById('rep-advance').value) || 0;

    const user = window.BCGAuth.getCurrentUser();
    const newRepair = window.BCGStore.addRepair({
      customerName: name,
      customerPhone: phone,
      frameDescription: frame,
      problem: problem,
      estimatedCost: cost,
      finalCost: cost,
      advance: advance
    }, user ? user.name : "Manoj Sharma");

    BCGUI.toast(`Repair ticket #${newRepair.id} registered successfully!`, "success");
    BCGUI.closeModal('modal-new-repair');
    this.renderRepairsList();
  },

  // INVENTORY LIST
  renderInventoryList: function() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    const frames = window.BCGStore.getDB().frames || [];
    tbody.innerHTML = frames.map(f => `
      <tr>
        <td><strong>${f.brand}</strong><br><small style="color:var(--text-muted);">${f.sku}</small></td>
        <td><strong>${f.model}</strong><br><small style="color:var(--text-muted);">${f.color}</small></td>
        <td>${f.frameType}<br><small style="color:var(--text-muted);">${f.material}</small></td>
        <td><strong>${BCGUI.formatCurrency(f.price)}</strong> <s style="color:var(--text-muted); font-size:0.75rem;">${BCGUI.formatCurrency(f.mrp)}</s></td>
        <td><strong style="color:${f.stock <= (f.lowStockLimit || 2) ? 'var(--rose)' : 'inherit'};">${f.stock} Units</strong></td>
        <td>
          <span class="badge ${f.stock <= 2 ? 'badge-danger' : 'badge-success'}">
            ${f.stock <= 2 ? 'Low Stock' : 'In Stock'}
          </span>
        </td>
      </tr>
    `).join('');
  },

  // INVOICES LIST
  renderInvoicesList: function() {
    const tbody = document.getElementById('invoices-table-body');
    if (!tbody) return;

    const invoices = window.BCGStore.getDB().invoices || [];
    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td><strong>${inv.id}</strong></td>
        <td>${inv.date}</td>
        <td><strong>${inv.customerName}</strong><br><small style="color:var(--text-muted);">${inv.customerPhone}</small></td>
        <td>${inv.jobId || 'N/A'}</td>
        <td><strong>${BCGUI.formatCurrency(inv.grandTotal)}</strong></td>
        <td>${BCGUI.formatCurrency(inv.advancePaid)}</td>
        <td><strong style="color:${inv.dueAmount > 0 ? 'var(--rose)' : 'var(--emerald)'};">${BCGUI.formatCurrency(inv.dueAmount)}</strong></td>
        <td><span class="badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${inv.paymentStatus}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${inv.id}')">
            <i class="fa-solid fa-eye"></i> View / Print
          </button>
        </td>
      </tr>
    `).join('');
  }
};

window.StaffApp = StaffApp;

document.addEventListener('DOMContentLoaded', () => {
  StaffApp.init();
});
