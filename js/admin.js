/**
 * Bhardwaj Chasma Ghar - Admin Management Controller (Phase 1)
 */

const AdminApp = {
  init: function() {
    const user = window.BCGAuth.requireRole(['admin']);
    if (!user) return;

    this.renderMetrics();
    this.renderRecentJobs();
    this.renderLowStock();
    this.renderAllJobs();
    this.renderFrames();
    this.renderStaffPermissions();
    this.renderInvoices();
    this.renderAuditLogs();
    this.loadSettings();
  },

  showSection: function(sectionName, navEl) {
    const sections = ['dashboard', 'jobs', 'inventory', 'staff', 'billing', 'audit', 'settings'];
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
      if (sectionName === 'dashboard') titleEl.textContent = "Executive Operations Overview";
      else if (sectionName === 'jobs') titleEl.textContent = "Complete Optical Manufacturing Pipeline";
      else if (sectionName === 'inventory') titleEl.textContent = "Frames & Optical Stock Management";
      else if (sectionName === 'staff') titleEl.textContent = "Optical Staff Permissions Control";
      else if (sectionName === 'billing') titleEl.textContent = "Optical Tax Invoices & Payment Ledger";
      else if (sectionName === 'audit') titleEl.textContent = "System Audit Log & Clinical Traceability";
      else if (sectionName === 'settings') titleEl.textContent = "Bhardwaj Chasma Ghar Business Settings";
    }
  },

  renderMetrics: function() {
    const db = window.BCGStore.getDB();
    const invoices = db.invoices || [];
    const jobs = db.optical_jobs || [];
    const repairs = db.repairs || [];
    const patients = db.patients || [];

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0) +
                         repairs.reduce((sum, rep) => sum + (rep.finalCost || 0), 0);
    const totalDues = invoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0) +
                      repairs.reduce((sum, rep) => sum + (rep.due || 0), 0);

    document.getElementById('adm-stat-revenue').textContent = BCGUI.formatCurrency(totalRevenue);
    document.getElementById('adm-stat-dues').textContent = BCGUI.formatCurrency(totalDues);
    document.getElementById('adm-stat-patients').textContent = patients.length;
    document.getElementById('adm-stat-jobs').textContent = jobs.length;
  },

  renderRecentJobs: function() {
    const tbody = document.getElementById('adm-recent-jobs-tbody');
    if (!tbody) return;

    const jobs = window.BCGStore.getOpticalJobs().slice(0, 5);
    tbody.innerHTML = jobs.map(j => `
      <tr>
        <td><strong>${j.id}</strong></td>
        <td>${j.patientName}</td>
        <td>${j.frameName}</td>
        <td><strong>${BCGUI.formatCurrency(j.total)}</strong></td>
        <td><span class="badge ${j.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${j.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openCustomer360('${j.patientId}')">360°</button>
        </td>
      </tr>
    `).join('');
  },

  renderLowStock: function() {
    const container = document.getElementById('adm-low-stock-list');
    if (!container) return;

    const frames = window.BCGStore.getDB().frames || [];
    const lowStock = frames.filter(f => f.stock <= (f.lowStockLimit || 3));

    if (lowStock.length === 0) {
      container.innerHTML = '<p style="color:var(--emerald); font-size:0.86rem;"><i class="fa-solid fa-circle-check"></i> All frames well stocked!</p>';
      return;
    }

    container.innerHTML = lowStock.map(f => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:#fff1f2; border:1px solid #fecdd3; border-radius:var(--radius-md); font-size:0.84rem;">
        <div>
          <strong>${f.brand} ${f.model}</strong><br>
          <small style="color:var(--text-muted);">${f.sku}</small>
        </div>
        <div style="text-align:right;">
          <strong style="color:var(--rose);">${f.stock} left</strong>
          <button class="btn btn-sm btn-outline" style="margin-left:6px;" onclick="AdminApp.adjustStock('${f.id}', 5)">+5</button>
        </div>
      </div>
    `).join('');
  },

  renderAllJobs: function() {
    const tbody = document.getElementById('adm-all-jobs-tbody');
    if (!tbody) return;

    const jobs = window.BCGStore.getOpticalJobs();
    tbody.innerHTML = jobs.map(j => `
      <tr>
        <td><strong>${j.id}</strong></td>
        <td><strong>${j.patientName}</strong> (${j.patientPhone})</td>
        <td>${j.prescriptionId}</td>
        <td>${j.frameName} + ${j.lensName}</td>
        <td><strong>${BCGUI.formatCurrency(j.total)}</strong></td>
        <td style="color:${j.due > 0 ? 'var(--rose)' : 'inherit'};">${BCGUI.formatCurrency(j.due)}</td>
        <td><span class="badge ${j.status === 'Delivered' ? 'badge-success' : 'badge-warning'}">${j.status}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="BCGUI.openCustomer360('${j.patientId}')">360°</button>
            ${j.invoiceNumber ? `<button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${j.invoiceNumber}')"><i class="fa-solid fa-print"></i></button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  renderFrames: function() {
    const tbody = document.getElementById('adm-frames-tbody');
    if (!tbody) return;

    const frames = window.BCGStore.getDB().frames || [];
    tbody.innerHTML = frames.map(f => `
      <tr>
        <td><strong>${f.sku}</strong></td>
        <td><strong>${f.brand}</strong> - ${f.model}</td>
        <td>${f.color} (${f.size || 'M'})</td>
        <td>${f.frameType}</td>
        <td><strong>${BCGUI.formatCurrency(f.price)}</strong></td>
        <td>
          <strong>${f.stock} Units</strong>
          <button class="btn btn-sm btn-outline" style="padding:2px 6px; margin-left:6px;" onclick="AdminApp.adjustStock('${f.id}', 5)">+5</button>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="AdminApp.deleteFrame('${f.id}')" style="color:var(--rose);">Delete</button>
        </td>
      </tr>
    `).join('');
  },

  adjustStock: function(frameId, qty) {
    window.BCGStore.updateFrameStock(frameId, qty);
    BCGUI.toast(`Stock adjusted for frame!`, "success");
    this.renderFrames();
    this.renderLowStock();
  },

  deleteFrame: function(frameId) {
    if (!confirm("Remove this frame from catalog?")) return;
    const db = window.BCGStore.getDB();
    db.frames = db.frames.filter(f => f.id !== frameId);
    window.BCGStore.saveDB(db);
    this.renderFrames();
    BCGUI.toast("Frame deleted", "info");
  },

  openAddFrameModal: function() {
    document.getElementById('form-add-frame').reset();
    BCGUI.openModal('modal-add-frame');
  },

  submitNewFrame: function() {
    const brand = document.getElementById('mf-brand').value.trim();
    const model = document.getElementById('mf-model').value.trim();
    const frameType = document.getElementById('mf-type').value.trim() || "Full Rim Rectangular";
    const color = document.getElementById('mf-color').value.trim() || "Black";
    const mrp = Number(document.getElementById('mf-mrp').value) || 2990;
    const price = Number(document.getElementById('mf-price').value) || 2490;
    const stock = Number(document.getElementById('mf-stock').value) || 10;

    const sku = (brand.substring(0, 3) + "-" + model.substring(0, 4) + "-" + Math.floor(Math.random() * 900 + 100)).toUpperCase();

    window.BCGStore.addFrame({
      brand, model, frameType, color, mrp, price, stock, sku,
      material: "Acetate/Metal",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80"
    });

    BCGUI.toast("New frame added to inventory!", "success");
    BCGUI.closeModal('modal-add-frame');
    this.renderFrames();
  },

  renderStaffPermissions: function() {
    const container = document.getElementById('adm-staff-permissions-container');
    if (!container) return;

    const db = window.BCGStore.getDB();
    const staffUser = db.users.find(u => u.role === 'staff');
    if (!staffUser) return;

    const allPermissions = [
      { key: "view_patients", label: "View Patient Directory" },
      { key: "add_patients", label: "Register New Patients" },
      { key: "view_prescriptions", label: "Read Doctor Prescriptions" },
      { key: "create_optical_jobs", label: "Create & Process Optical Jobs" },
      { key: "manage_frames", label: "Frame Selection & Inventory Access" },
      { key: "manage_lenses", label: "Lens Package Selection" },
      { key: "create_invoice", label: "Generate Tax Invoices" },
      { key: "receive_payment", label: "Record Advance & Settle Payments" },
      { key: "manage_repairs", label: "Manage Chasma Repairs & Service" }
    ];

    container.innerHTML = `
      <div style="background:var(--bg-subtle); padding:20px; border-radius:var(--radius-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h4 style="font-size:1.05rem; font-weight:800;">${staffUser.name} (${staffUser.email})</h4>
            <p style="font-size:0.84rem; color:var(--text-muted);">${staffUser.designation}</p>
          </div>
          <span class="badge badge-info">Role: Optical Staff</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
          ${allPermissions.map(p => `
            <label style="display:flex; align-items:center; gap:10px; background:#fff; padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-light); cursor:pointer;">
              <input type="checkbox" value="${p.key}" ${staffUser.permissions.includes(p.key) ? 'checked' : ''} onchange="AdminApp.toggleStaffPermission('${p.key}', this.checked)">
              <span style="font-size:0.88rem; font-weight:600;">${p.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleStaffPermission: function(permKey, isChecked) {
    const db = window.BCGStore.getDB();
    const staff = db.users.find(u => u.role === 'staff');
    if (!staff) return;

    if (!staff.permissions) staff.permissions = [];

    if (isChecked) {
      if (!staff.permissions.includes(permKey)) staff.permissions.push(permKey);
    } else {
      staff.permissions = staff.permissions.filter(p => p !== permKey);
    }

    window.BCGStore.saveDB(db);
    BCGUI.toast(`Permission '${permKey}' updated for Staff!`, "success");
  },

  renderInvoices: function() {
    const tbody = document.getElementById('adm-invoices-tbody');
    if (!tbody) return;

    const invoices = window.BCGStore.getDB().invoices || [];
    tbody.innerHTML = invoices.map(i => `
      <tr>
        <td><strong>${i.id}</strong></td>
        <td>${i.date}</td>
        <td><strong>${i.customerName}</strong></td>
        <td>${BCGUI.formatCurrency(i.subtotal)}</td>
        <td><strong>${BCGUI.formatCurrency(i.grandTotal)}</strong></td>
        <td>${BCGUI.formatCurrency(i.advancePaid)}</td>
        <td style="color:${i.dueAmount > 0 ? 'var(--rose)' : 'var(--emerald)'};"><strong>${BCGUI.formatCurrency(i.dueAmount)}</strong></td>
        <td><span class="badge ${i.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${i.paymentStatus}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${i.id}')">View</button>
        </td>
      </tr>
    `).join('');
  },

  renderAuditLogs: function() {
    const tbody = document.getElementById('adm-audit-tbody');
    if (!tbody) return;

    const logs = window.BCGStore.getDB().audit_logs || [];
    tbody.innerHTML = logs.map(l => `
      <tr>
        <td><strong>${l.id}</strong></td>
        <td><small>${l.timestamp}</small></td>
        <td><strong>${l.user}</strong> <span class="badge badge-neutral" style="font-size:0.7rem;">${l.role}</span></td>
        <td><code>${l.action}</code></td>
        <td>${l.targetId}</td>
        <td style="font-size:0.84rem; color:var(--text-muted);">${l.details}</td>
      </tr>
    `).join('');
  },

  loadSettings: function() {
    const s = window.BCGStore.getDB().settings;
    if (!s) return;

    document.getElementById('set-name').value = s.name || '';
    document.getElementById('set-tagline').value = s.tagline || '';
    document.getElementById('set-phone').value = s.phone || '';
    document.getElementById('set-gstin').value = s.gstin || '';
    document.getElementById('set-address').value = s.address || '';
    document.getElementById('set-fitting').value = s.fittingCharge || 150;
    document.getElementById('set-tax').value = s.taxRate || 12;
  },

  saveSettings: function() {
    const name = document.getElementById('set-name').value.trim();
    const tagline = document.getElementById('set-tagline').value.trim();
    const phone = document.getElementById('set-phone').value.trim();
    const gstin = document.getElementById('set-gstin').value.trim();
    const address = document.getElementById('set-address').value.trim();
    const fittingCharge = Number(document.getElementById('set-fitting').value) || 150;
    const taxRate = Number(document.getElementById('set-tax').value) || 12;

    window.BCGStore.updateSettings({
      name, tagline, phone, gstin, address, fittingCharge, taxRate
    });

    BCGUI.toast("Business configuration updated successfully!", "success");
  },

  resetDemoData: function() {
    if (!confirm("Reset database to clean initial Indian Optical demo state?")) return;
    window.BCGStore.resetDB();
    BCGUI.toast("Database reset to factory demo state!", "success");
    setTimeout(() => location.reload(), 500);
  }
};

window.AdminApp = AdminApp;

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
