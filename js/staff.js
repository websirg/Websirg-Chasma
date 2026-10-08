/**
 * Bhardwaj Chasma Ghar - Optical Staff & Sales & Billing Module
 * Operations: Manoj Sharma (Senior Optometrist & Dispensing Specialist)
 * Headquarters: Itaily Moad, Maudha Road, Mehnajpur, Azamgarh
 */

const StaffApp = {
  currentEditingJobId: null,
  currentEditingOrderId: null,

  init: function() {
    const user = window.BCGAuth ? window.BCGAuth.requireRole(['staff', 'admin']) : null;
    if (!user) return;

    const staffNameEl = document.getElementById('staff-name');
    if (staffNameEl && user) staffNameEl.textContent = user.name;

    this.renderStats();
    this.renderOrdersList();
    this.renderJobsList();
    this.renderInvoicesList();
    this.renderDuesList();
    this.renderRepairsList();
    this.renderInventoryList();
    this.populateFrameDropdown();
    this.populateLensDropdown();

    // Check hash for initial section
    const hash = window.location.hash.replace('#', '');
    if (hash && ['orders', 'jobs', 'invoices', 'dues', 'repairs', 'inventory'].includes(hash)) {
      const navItem = document.querySelector(`.sidebar-item[href="#${hash}"]`);
      this.showSection(hash, navItem);
    }
  },

  showSection: function(sectionName, navEl) {
    const sections = ['orders', 'jobs', 'invoices', 'dues', 'repairs', 'inventory'];
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
      if (sectionName === 'orders') titleEl.textContent = "Customer Store Orders & Sales Billing";
      else if (sectionName === 'jobs') titleEl.textContent = "Optical Dispensing & Chasma Production Jobs";
      else if (sectionName === 'invoices') titleEl.textContent = "GST Tax Invoices & Payment Receipts";
      else if (sectionName === 'dues') titleEl.textContent = "Outstanding Balance & Due Payment Collections";
      else if (sectionName === 'repairs') titleEl.textContent = "Chasma Repair & Service Counter";
      else if (sectionName === 'inventory') titleEl.textContent = "Frame Stock & Inventory Management";
    }
  },

  renderStats: function() {
    const db = window.BCGStore.getDB();
    const orders = db.orders || [];
    const jobs = db.optical_jobs || [];
    const invoices = db.invoices || [];

    const pendingOrders = orders.filter(o => o.status === 'Pending Verification').length;
    const pendingJobs = jobs.filter(j => !j.invoiceNumber).length;
    const inProductionJobs = jobs.filter(j => ['Frame Selected', 'Lens Processing', 'Fitting', 'Quality Check'].includes(j.status)).length;
    const readyCount = jobs.filter(j => j.status === 'Ready').length + orders.filter(o => o.deliveryStatus === 'In Production / Packing').length;
    
    const totalDues = invoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0) +
                      (db.repairs || []).reduce((sum, r) => sum + (r.due || 0), 0);

    const elNewOrders = document.getElementById('stat-new-orders');
    const elPendingBilling = document.getElementById('stat-pending-billing');
    const elProduction = document.getElementById('stat-production-jobs');
    const elReady = document.getElementById('stat-ready-jobs');
    const elDues = document.getElementById('stat-pending-dues');

    if (elNewOrders) elNewOrders.textContent = pendingOrders;
    if (elPendingBilling) elPendingBilling.textContent = pendingOrders + pendingJobs;
    if (elProduction) elProduction.textContent = inProductionJobs;
    if (elReady) elReady.textContent = readyCount;
    if (elDues) elDues.textContent = BCGUI.formatCurrency(totalDues);
  },

  // ==========================================================================
  // MODULE 1: CUSTOMER STORE ORDERS (Journey A & Journey B)
  // ==========================================================================
  renderOrdersList: function(filterText = '') {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    let orders = window.BCGStore.getOrders();
    const cleanFilter = (filterText || '').toLowerCase().trim();

    if (cleanFilter) {
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(cleanFilter) ||
        o.customerName.toLowerCase().includes(cleanFilter) ||
        o.customerPhone.includes(cleanFilter) ||
        o.status.toLowerCase().includes(cleanFilter)
      );
    }

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-muted);">No customer orders found.</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(ord => {
      const isPending = ord.status === 'Pending Verification' || !ord.invoiceNumber;
      return `
        <tr>
          <td>
            <strong>${ord.id}</strong><br>
            <small style="color:var(--text-muted);">${ord.createdAt}</small>
          </td>
          <td>
            <strong>${ord.customerName}</strong><br>
            <small style="color:var(--text-muted);">${ord.customerPhone}</small>
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
            <strong style="color:var(--primary);">${BCGUI.formatCurrency(ord.totalAmount)}</strong>
          </td>
          <td>
            <span class="badge ${isPending ? 'badge-warning' : 'badge-success'}">
              ${ord.status}
            </span><br>
            <small style="color:var(--text-muted); font-size:0.75rem;">${ord.deliveryStatus || 'Placed'}</small>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-primary" onclick="StaffApp.openOrderEditor('${ord.id}')" title="Verify & Bill">
                <i class="fa-solid fa-file-invoice-dollar"></i> ${isPending ? 'Verify & Bill' : 'Manage Order'}
              </button>
              ${ord.invoiceNumber ? `
                <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${ord.invoiceNumber}')" title="Print Invoice">
                  <i class="fa-solid fa-print"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterOrders: function() {
    const query = document.getElementById('order-search-input') ? document.getElementById('order-search-input').value : '';
    this.renderOrdersList(query);
  },

  openOrderEditor: function(orderId) {
    this.currentEditingOrderId = orderId;
    const order = window.BCGStore.getOrderById(orderId);
    if (!order) return;

    document.getElementById('eord-id-title').textContent = `${order.id} (${order.orderType})`;
    document.getElementById('eord-customer-info').innerHTML = `
      <strong>${order.customerName}</strong> (${order.customerPhone})<br>
      Address: ${order.shippingAddress}<br>
      ${order.customerEmail ? `Email: ${order.customerEmail} | ` : ''} Delivery: <strong>${order.deliveryStatus || 'Pending'}</strong>
    `;

    // Render items table
    const itemsTbody = document.getElementById('eord-items-tbody');
    itemsTbody.innerHTML = order.items.map(it => `
      <tr>
        <td>
          <strong>${it.brand} ${it.model}</strong><br>
          <small style="color:var(--text-muted);">SKU: ${it.sku || 'N/A'}</small>
          ${it.lensName ? `<br><span style="color:var(--primary); font-size:0.8rem;">+ Lens: ${it.lensName}</span>` : ''}
          ${it.prescriptionDetails ? `<br><span style="color:#b45309; font-size:0.8rem;">Rx: ${it.prescriptionDetails}</span>` : ''}
        </td>
        <td style="text-align:center;">${it.qty || 1}</td>
        <td style="text-align:right;">${BCGUI.formatCurrency(it.price)}</td>
        <td style="text-align:right;"><strong>${BCGUI.formatCurrency(it.price * (it.qty || 1))}</strong></td>
      </tr>
    `).join('');

    document.getElementById('eord-subtotal').value = order.subtotal;
    document.getElementById('eord-discount').value = order.discount || 0;
    document.getElementById('eord-total').value = order.totalAmount;
    document.getElementById('eord-advance').value = order.invoiceNumber ? (order.totalAmount) : (order.totalAmount);
    document.getElementById('eord-due').value = 0;
    document.getElementById('eord-payment-method').value = order.paymentMethod || "UPI (Google Pay / PhonePe)";
    document.getElementById('eord-delivery-status').value = order.deliveryStatus || "In Production / Packing";
    document.getElementById('eord-notes').value = order.staffNotes || "";

    const btnGenerate = document.getElementById('btn-eord-generate-invoice');
    if (order.invoiceNumber) {
      btnGenerate.innerHTML = `<i class="fa-solid fa-print"></i> View / Print Invoice (${order.invoiceNumber})`;
      btnGenerate.className = "btn btn-outline";
      btnGenerate.onclick = () => BCGUI.openInvoiceModal(order.invoiceNumber);
    } else {
      btnGenerate.innerHTML = `<i class="fa-solid fa-file-invoice"></i> Verify & Generate Official GST Invoice`;
      btnGenerate.className = "btn btn-primary";
      btnGenerate.onclick = () => StaffApp.generateOrderInvoice();
    }

    this.recalculateOrderBill();
    BCGUI.openModal('modal-order-editor');
  },

  recalculateOrderBill: function() {
    const subtotal = Number(document.getElementById('eord-subtotal').value) || 0;
    const discount = Number(document.getElementById('eord-discount').value) || 0;
    const advance = Number(document.getElementById('eord-advance').value) || 0;

    const total = Math.max(0, subtotal - discount);
    const due = Math.max(0, total - advance);

    document.getElementById('eord-total').value = total;
    document.getElementById('eord-due').value = due;
  },

  generateOrderInvoice: function() {
    if (!this.currentEditingOrderId) return;
    const discount = Number(document.getElementById('eord-discount').value) || 0;
    const advance = Number(document.getElementById('eord-advance').value) || 0;
    const paymentMethod = document.getElementById('eord-payment-method').value;
    const deliveryStatus = document.getElementById('eord-delivery-status').value;
    const notes = document.getElementById('eord-notes').value.trim();

    const result = window.BCGStore.staffVerifyAndGenerateOrderInvoice(
      this.currentEditingOrderId,
      {
        discount: discount,
        advance: advance,
        paymentMethod: paymentMethod,
        staffNotes: notes,
        expectedDelivery: "Ready in 2 days"
      },
      "Manoj Sharma"
    );

    if (result && result.invoice) {
      window.BCGStore.updateOrderStatus(this.currentEditingOrderId, "Confirmed / Billed", deliveryStatus, notes, "Manoj Sharma");
      BCGUI.toast(`Official Invoice ${result.invoice.id} Generated Successfully!`, "success");
      BCGUI.closeModal('modal-order-editor');
      this.renderOrdersList();
      this.renderInvoicesList();
      this.renderDuesList();
      this.renderStats();
      // Show the freshly generated invoice
      BCGUI.openInvoiceModal(result.invoice.id);
    }
  },

  updateOrderDeliveryOnly: function() {
    if (!this.currentEditingOrderId) return;
    const deliveryStatus = document.getElementById('eord-delivery-status').value;
    const notes = document.getElementById('eord-notes').value.trim();

    window.BCGStore.updateOrderStatus(this.currentEditingOrderId, "Confirmed / Billed", deliveryStatus, notes, "Manoj Sharma");
    BCGUI.toast("Order status updated successfully", "success");
    BCGUI.closeModal('modal-order-editor');
    this.renderOrdersList();
  },

  // ==========================================================================
  // MODULE 2: OPTICAL JOBS (Prescription Chasma Production)
  // ==========================================================================
  renderJobsList: function(filterText = '') {
    const tbody = document.getElementById('jobs-table-body');
    if (!tbody) return;

    let jobs = window.BCGStore.getOpticalJobs();
    const cleanFilter = (filterText || '').toLowerCase().trim();

    if (cleanFilter) {
      jobs = jobs.filter(j => 
        j.id.toLowerCase().includes(cleanFilter) ||
        j.patientName.toLowerCase().includes(cleanFilter) ||
        j.patientPhone.includes(cleanFilter) ||
        j.status.toLowerCase().includes(cleanFilter)
      );
    }

    if (jobs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">No optical jobs currently in queue.</td></tr>';
      return;
    }

    tbody.innerHTML = jobs.map(job => {
      let statusBadgeClass = 'badge-neutral';
      if (job.status === 'Prescription Received') statusBadgeClass = 'badge-info';
      else if (['Frame Selected', 'Lens Processing', 'Fitting', 'Quality Check'].includes(job.status)) statusBadgeClass = 'badge-warning';
      else if (job.status === 'Ready') statusBadgeClass = 'badge-teal';
      else if (job.status === 'Delivered') statusBadgeClass = 'badge-success';

      const isInvoiceGenerated = !!job.invoiceNumber;

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
            <small style="color:${job.due > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-weight:700;">
              Due: ${BCGUI.formatCurrency(job.due)}
            </small>
          </td>
          <td>
            <span class="badge ${statusBadgeClass}">${job.status}</span><br>
            <small style="color:var(--text-muted); font-size:0.75rem;">
              ${isInvoiceGenerated ? `<i class="fa-solid fa-check" style="color:var(--emerald);"></i> Billed` : 'Pending Bill'}
            </small>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-primary" onclick="StaffApp.openJobEditor('${job.id}')" title="Edit Frame/Lens/Bill">
                <i class="fa-solid fa-sliders"></i> Edit & Bill
              </button>
              ${isInvoiceGenerated ? `
                <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${job.invoiceNumber}')" title="Print Invoice">
                  <i class="fa-solid fa-print"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterJobs: function() {
    const query = document.getElementById('job-search-input') ? document.getElementById('job-search-input').value : '';
    this.renderJobsList(query);
  },

  populateFrameDropdown: function() {
    const select = document.getElementById('edit-frame-select');
    if (!select) return;

    const frames = window.BCGStore.getDB().frames || [];
    select.innerHTML = '<option value="">-- Choose Frame from Stock --</option>' +
      frames.map(f => `
        <option value="${f.id}" data-name="${f.brand} ${f.model}" data-price="${f.price}" data-stock="${f.stock}">
          ${f.brand} ${f.model} (${f.color}) — ₹${f.price} [Stock: ${f.stock}]
        </option>
      `).join('');
  },

  populateLensDropdown: function() {
    const select = document.getElementById('edit-lens-select');
    if (!select) return;

    const lenses = window.BCGStore.getDB().lenses || [];
    select.innerHTML = '<option value="">-- Choose Lens Package --</option>' +
      lenses.map(l => `
        <option value="${l.id}" data-name="${l.brand} - ${l.name}" data-price="${l.price}">
          ${l.brand} ${l.name} (${l.type}) — ₹${l.price}
        </option>
      `).join('');
  },

  openJobEditor: function(jobId) {
    this.currentEditingJobId = jobId;
    const job = window.BCGStore.getOpticalJobById(jobId);
    if (!job) return;

    document.getElementById('edit-job-id-title').textContent = job.id;
    document.getElementById('edit-patient-summary').innerHTML = `
      <strong>${job.patientName}</strong> (${job.patientPhone}) | Ref: Doctor <strong>${job.doctorName || 'Dr. Satya Prakash Bhardwaj'}</strong>
    `;

    // Refraction details
    const rx = job.rxDetails || { right: {}, left: {} };
    document.getElementById('edit-job-rx-details').innerHTML = `
      <div><strong>Right Eye (OD):</strong> SPH: ${rx.right?.sph || '0.00'} | CYL: ${rx.right?.cyl || '0.00'} | AXIS: ${rx.right?.axis || '-'} | ADD: ${rx.right?.add || '-'}</div>
      <div><strong>Left Eye (OS):</strong> SPH: ${rx.left?.sph || '0.00'} | CYL: ${rx.left?.cyl || '0.00'} | AXIS: ${rx.left?.axis || '-'} | ADD: ${rx.left?.add || '-'}</div>
      <div style="grid-column:1/-1;"><strong>PD:</strong> ${rx.pd || '62'} mm | <strong>Prescription Ref:</strong> ${job.prescriptionId}</div>
    `;

    // Frame & Lens selects
    const frameSelect = document.getElementById('edit-frame-select');
    if (frameSelect) frameSelect.value = job.frameId || "";
    document.getElementById('edit-frame-price').value = job.framePrice || 0;

    const lensSelect = document.getElementById('edit-lens-select');
    if (lensSelect) lensSelect.value = job.lensId || "";
    document.getElementById('edit-lens-price').value = job.lensPrice || 0;

    document.getElementById('edit-fitting-charge').value = job.fittingCharge || 150;
    document.getElementById('edit-discount').value = job.discount || 0;
    document.getElementById('edit-advance').value = job.advance || 0;
    document.getElementById('edit-due').value = job.due || 0;
    document.getElementById('edit-payment-method').value = job.paymentMethod || "UPI (Google Pay / PhonePe)";
    document.getElementById('edit-job-status').value = job.status || "Prescription Received";
    document.getElementById('edit-expected-delivery').value = job.expectedDelivery || "";
    document.getElementById('edit-status-note').value = "";

    // Prescribed Medicines Billing (Loaded from Doctor's Rx)
    const db = window.BCGStore.getDB();
    const docRx = (db.prescriptions || []).find(r => r.id === job.prescriptionId) || {};
    const medsTbody = document.getElementById('edit-job-medicines-tbody');
    if (medsTbody) {
      let medsList = job.billedMedicines;
      if (!medsList || medsList.length === 0) {
        medsList = (docRx.medicines || []).map(m => ({
          name: m.name,
          dose: `${m.dose || ''} ${m.frequency || ''}`,
          price: m.name.toLowerCase().includes('drop') ? 180 : 250
        }));
      }

      if (medsList.length === 0) {
        medsTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:10px;">No medicines prescribed on this Rx. Click "+ Add Item" to bill eye drops.</td></tr>';
      } else {
        medsTbody.innerHTML = medsList.map(m => `
          <tr>
            <td><input type="text" class="form-control bill-med-name" value="${m.name}"></td>
            <td><input type="text" class="form-control bill-med-dose" value="${m.dose || ''}"></td>
            <td><input type="number" class="form-control bill-med-price" value="${m.price || 0}" oninput="StaffApp.recalculateJobBill()"></td>
            <td><button type="button" class="btn btn-sm btn-danger" onclick="this.closest('tr').remove(); StaffApp.recalculateJobBill();">&times;</button></td>
          </tr>
        `).join('');
      }
    }

    this.recalculateJobBill();

    // Timeline Rendering
    const timelineContainer = document.getElementById('edit-job-timeline-list');
    const timeline = job.timeline || [];
    timelineContainer.innerHTML = timeline.map(item => `
      <div style="padding:6px 10px; background:var(--bg-subtle); border-radius:4px; border-left:3px solid var(--primary);">
        <strong>${item.status}</strong> — <small style="color:var(--text-muted);">${item.time} by ${item.user}</small>
        ${item.note ? `<p style="margin:2px 0 0; color:var(--text-main); font-size:0.78rem;">${item.note}</p>` : ''}
      </div>
    `).join('');

    BCGUI.openModal('modal-job-editor');
  },

  addInvoiceMedicineRow: function(name = "", dose = "", price = 180) {
    const tbody = document.getElementById('edit-job-medicines-tbody');
    if (!tbody) return;
    if (tbody.querySelector('td[colspan]')) tbody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="form-control bill-med-name" placeholder="Medicine / Eye Drop Name" value="${name}"></td>
      <td><input type="text" class="form-control bill-med-dose" placeholder="Dose & Frequency" value="${dose}"></td>
      <td><input type="number" class="form-control bill-med-price" placeholder="Price (₹)" value="${price}" oninput="StaffApp.recalculateJobBill()"></td>
      <td><button type="button" class="btn btn-sm btn-danger" onclick="this.closest('tr').remove(); StaffApp.recalculateJobBill();">&times;</button></td>
    `;
    tbody.appendChild(tr);
    this.recalculateJobBill();
  },

  onFrameSelected: function(frameId) {
    const select = document.getElementById('edit-frame-select');
    const opt = select.options[select.selectedIndex];
    if (opt && opt.value) {
      document.getElementById('edit-frame-price').value = opt.getAttribute('data-price') || 0;
    }
    this.recalculateJobBill();
  },

  onLensSelected: function(lensId) {
    const select = document.getElementById('edit-lens-select');
    const opt = select.options[select.selectedIndex];
    if (opt && opt.value) {
      document.getElementById('edit-lens-price').value = opt.getAttribute('data-price') || 0;
    }
    this.recalculateJobBill();
  },

  recalculateJobBill: function() {
    const framePrice = Number(document.getElementById('edit-frame-price').value) || 0;
    const lensPrice = Number(document.getElementById('edit-lens-price').value) || 0;
    const fitting = Number(document.getElementById('edit-fitting-charge').value) || 0;
    const discount = Number(document.getElementById('edit-discount').value) || 0;
    const advance = Number(document.getElementById('edit-advance').value) || 0;

    let medsTotal = 0;
    document.querySelectorAll('#edit-job-medicines-tbody .bill-med-price').forEach(inp => {
      medsTotal += Number(inp.value) || 0;
    });

    const subtotal = framePrice + lensPrice + medsTotal + fitting;
    const total = Math.max(0, subtotal - discount);
    const due = Math.max(0, total - advance);

    document.getElementById('edit-total').value = total;
    document.getElementById('edit-due').value = due;
  },

  saveJobModifications: function(generateInvoice = false) {
    if (!this.currentEditingJobId) return;

    const frameSelect = document.getElementById('edit-frame-select');
    const lensSelect = document.getElementById('edit-lens-select');

    const frameOpt = frameSelect.options[frameSelect.selectedIndex];
    const lensOpt = lensSelect.options[lensSelect.selectedIndex];

    const frameName = frameOpt ? (frameOpt.getAttribute('data-name') || frameOpt.text) : "";
    const lensName = lensOpt ? (lensOpt.getAttribute('data-name') || lensOpt.text) : "";

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

    const billedMedicines = [];
    document.querySelectorAll('#edit-job-medicines-tbody tr').forEach(tr => {
      const nameInp = tr.querySelector('.bill-med-name');
      const doseInp = tr.querySelector('.bill-med-dose');
      const priceInp = tr.querySelector('.bill-med-price');
      if (nameInp && priceInp) {
        const mName = nameInp.value.trim();
        const mDose = doseInp ? doseInp.value.trim() : '';
        const mPrice = Number(priceInp.value) || 0;
        if (mName && mPrice > 0) {
          billedMedicines.push({ name: mName, dose: mDose, price: mPrice, qty: 1 });
        }
      }
    });

    const updatePayload = {
      frameId: frameSelect.value,
      frameName: frameName,
      framePrice: framePrice,
      lensId: lensSelect.value,
      lensName: lensName,
      lensPrice: lensPrice,
      billedMedicines: billedMedicines,
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

    window.BCGStore.updateOpticalJob(this.currentEditingJobId, updatePayload, "Manoj Sharma");

    // Generate/sync invoice
    const inv = window.BCGStore.staffGenerateJobInvoice(this.currentEditingJobId, {
      discount: discount,
      advance: advance,
      paymentMethod: paymentMethod,
      expectedDelivery: expectedDelivery
    }, "Manoj Sharma");

    BCGUI.toast(`Optical Job ${this.currentEditingJobId} & Tax Invoice Updated!`, "success");
    BCGUI.closeModal('modal-job-editor');
    this.renderJobsList();
    this.renderInvoicesList();
    this.renderDuesList();
    this.renderStats();

    if (generateInvoice && inv) {
      BCGUI.openInvoiceModal(inv.id);
    }
  },

  // ==========================================================================
  // MODULE 3: INVOICES & BILLING LIST
  // ==========================================================================
  renderInvoicesList: function() {
    const tbody = document.getElementById('invoices-table-body');
    if (!tbody) return;

    const invoices = window.BCGStore.getDB().invoices || [];
    if (invoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">No invoices generated.</td></tr>';
      return;
    }

    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td><strong>${inv.id}</strong></td>
        <td>${inv.date}</td>
        <td>
          <strong>${inv.customerName}</strong><br>
          <small style="color:var(--text-muted);">${inv.customerPhone}</small>
        </td>
        <td>${inv.jobId || inv.orderId || 'Direct Retail'}</td>
        <td><strong>${BCGUI.formatCurrency(inv.grandTotal)}</strong></td>
        <td>
          <span class="badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">
            ${inv.paymentStatus}
          </span>
          ${inv.dueAmount > 0 ? `<br><small style="color:var(--rose);">Due: ${BCGUI.formatCurrency(inv.dueAmount)}</small>` : ''}
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${inv.id}')">
            <i class="fa-solid fa-print"></i> View / Print
          </button>
        </td>
      </tr>
    `).join('');
  },

  // ==========================================================================
  // MODULE 4: DUE PAYMENTS & COLLECTION
  // ==========================================================================
  renderDuesList: function() {
    const tbody = document.getElementById('dues-table-body');
    if (!tbody) return;

    const db = window.BCGStore.getDB();
    const invoices = (db.invoices || []).filter(i => (i.dueAmount || 0) > 0);
    const repairs = (db.repairs || []).filter(r => (r.due || 0) > 0);

    const totalDueSum = invoices.reduce((s, i) => s + (i.dueAmount || 0), 0) +
                        repairs.reduce((s, r) => s + (r.due || 0), 0);

    const dueSumEl = document.getElementById('total-due-collected-sum');
    if (dueSumEl) dueSumEl.textContent = BCGUI.formatCurrency(totalDueSum);

    if (invoices.length === 0 && repairs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">🎉 No pending dues! All accounts settled.</td></tr>';
      return;
    }

    let rowsHtml = '';

    invoices.forEach(inv => {
      rowsHtml += `
        <tr>
          <td><strong>${inv.id}</strong><br><small style="color:var(--text-muted);">${inv.date}</small></td>
          <td><strong>${inv.customerName}</strong><br><small style="color:var(--text-muted);">${inv.customerPhone}</small></td>
          <td><span class="badge badge-info">${inv.jobId ? 'Optical Job' : 'Store Order'}</span></td>
          <td>Total: ${BCGUI.formatCurrency(inv.grandTotal)}<br><small style="color:var(--emerald);">Adv: ${BCGUI.formatCurrency(inv.advancePaid)}</small></td>
          <td><strong style="color:var(--rose); font-size:1.05rem;">${BCGUI.formatCurrency(inv.dueAmount)}</strong></td>
          <td>
            <button class="btn btn-sm btn-success" onclick="StaffApp.settleInvoiceDue('${inv.id}')">
              <i class="fa-solid fa-hand-holding-dollar"></i> Collect Balance
            </button>
          </td>
        </tr>
      `;
    });

    repairs.forEach(rep => {
      rowsHtml += `
        <tr>
          <td><strong>${rep.id}</strong></td>
          <td><strong>${rep.customerName}</strong><br><small style="color:var(--text-muted);">${rep.customerPhone}</small></td>
          <td><span class="badge badge-amber">Repair Service</span></td>
          <td>Cost: ${BCGUI.formatCurrency(rep.finalCost)}</td>
          <td><strong style="color:var(--rose); font-size:1.05rem;">${BCGUI.formatCurrency(rep.due)}</strong></td>
          <td>
            <button class="btn btn-sm btn-success" onclick="StaffApp.settleRepairDue('${rep.id}')">
              <i class="fa-solid fa-hand-holding-dollar"></i> Collect Balance
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  },

  settleInvoiceDue: function(invoiceId) {
    const db = window.BCGStore.getDB();
    const inv = db.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    if (!confirm(`Confirm collection of ${BCGUI.formatCurrency(inv.dueAmount)} from ${inv.customerName}?`)) return;

    inv.advancePaid = inv.grandTotal;
    inv.dueAmount = 0;
    inv.paymentStatus = "Paid";

    if (inv.jobId) {
      const job = db.optical_jobs.find(j => j.id === inv.jobId);
      if (job) {
        job.advance = job.total;
        job.due = 0;
      }
    }
    if (inv.orderId) {
      const ord = (db.orders || []).find(o => o.id === inv.orderId);
      if (ord) {
        ord.paymentStatus = "Paid";
      }
    }

    window.BCGStore.saveDB(db);
    window.BCGStore.logAudit("Manoj Sharma", "staff", "PAYMENT_SETTLED", invoiceId, `Collected full due for invoice ${invoiceId}`);
    BCGUI.toast(`Payment settled for ${inv.customerName}! Invoice marked Paid.`, "success");
    this.renderDuesList();
    this.renderInvoicesList();
    this.renderStats();
  },

  settleRepairDue: function(repairId) {
    const db = window.BCGStore.getDB();
    const rep = db.repairs.find(r => r.id === repairId);
    if (!rep) return;

    if (!confirm(`Confirm collection of ${BCGUI.formatCurrency(rep.due)} for repair ticket ${repairId}?`)) return;

    rep.advance = rep.finalCost;
    rep.due = 0;
    window.BCGStore.saveDB(db);
    window.BCGStore.logAudit("Manoj Sharma", "staff", "REPAIR_PAYMENT_SETTLED", repairId, `Collected full due for repair ${repairId}`);
    BCGUI.toast(`Repair payment settled for ${rep.customerName}!`, "success");
    this.renderDuesList();
    this.renderRepairsList();
    this.renderStats();
  },

  // ==========================================================================
  // MODULE 5: FRAME REPAIRS
  // ==========================================================================
  renderRepairsList: function() {
    const tbody = document.getElementById('repairs-table-body');
    if (!tbody) return;

    const repairs = window.BCGStore.getRepairs();
    if (repairs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-muted);">No repair tickets.</td></tr>';
      return;
    }

    tbody.innerHTML = repairs.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>
          <strong>${r.customerName}</strong><br>
          <small style="color:var(--text-muted);">${r.customerPhone}</small>
        </td>
        <td>
          <strong>${r.frameDescription}</strong><br>
          <small style="color:var(--text-muted);">${r.problem}</small>
        </td>
        <td>
          Est: ${BCGUI.formatCurrency(r.estimatedCost)} | Final: <strong>${BCGUI.formatCurrency(r.finalCost)}</strong><br>
          <small style="color:${r.due > 0 ? 'var(--rose)' : 'var(--emerald)'};">Due: ${BCGUI.formatCurrency(r.due)}</small>
        </td>
        <td>
          <span class="badge ${r.status === 'Ready' ? 'badge-success' : (r.status === 'Delivered' ? 'badge-neutral' : 'badge-warning')}">
            ${r.status}
          </span>
        </td>
        <td>${r.expectedDelivery || 'Next Day'}</td>
        <td>
          <select class="form-control" style="font-size:0.8rem; padding:4px 8px;" onchange="StaffApp.advanceRepairStatus('${r.id}', this.value)">
            <option value="">Update Status...</option>
            <option value="Inspection">Inspection</option>
            <option value="Estimate">Estimate</option>
            <option value="Customer Approval">Customer Approval</option>
            <option value="Repairing">Repairing</option>
            <option value="Quality Check">Quality Check</option>
            <option value="Ready">Ready for Pickup</option>
            <option value="Delivered">Delivered</option>
          </select>
        </td>
      </tr>
    `).join('');
  },

  advanceRepairStatus: function(repairId, newStatus) {
    if (!newStatus) return;
    const note = prompt(`Enter progression note for repair ${repairId} (Optional):`, `Progressed to ${newStatus}`);
    window.BCGStore.updateRepairStatus(repairId, newStatus, note, "Manoj Sharma");
    BCGUI.toast(`Repair ${repairId} updated to ${newStatus}`, "success");
    this.renderRepairsList();
    this.renderDuesList();
    this.renderStats();
  },

  openNewRepairModal: function() {
    BCGUI.openModal('modal-new-repair');
  },

  submitNewRepair: function() {
    const customerName = document.getElementById('rep-cust-name').value.trim();
    const customerPhone = document.getElementById('rep-cust-phone').value.trim();
    const frameDesc = document.getElementById('rep-frame-desc').value.trim();
    const problem = document.getElementById('rep-problem').value.trim();
    const cost = Number(document.getElementById('rep-cost').value) || 0;
    const advance = Number(document.getElementById('rep-advance').value) || 0;
    const expected = document.getElementById('rep-expected').value || "Next Day";

    const repair = window.BCGStore.addRepair({
      customerName,
      customerPhone,
      frameDescription: frameDesc,
      problem,
      estimatedCost: cost,
      finalCost: cost,
      advance: advance,
      expectedDelivery: expected
    }, "Manoj Sharma");

    BCGUI.toast(`Repair ticket ${repair.id} created!`, "success");
    BCGUI.closeModal('modal-new-repair');
    document.getElementById('form-new-repair').reset();
    this.renderRepairsList();
    this.renderDuesList();
    this.renderStats();
  },

  // ==========================================================================
  // MODULE 6: FRAME INVENTORY
  // ==========================================================================
  renderInventoryList: function() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    const frames = window.BCGStore.getDB().frames || [];
    tbody.innerHTML = frames.map(f => `
      <tr>
        <td>
          <img src="${f.image}" style="width:48px; height:40px; object-fit:cover; border-radius:4px;">
        </td>
        <td>
          <strong>${f.brand} ${f.model}</strong><br>
          <small style="color:var(--text-muted);">${f.sku}</small>
        </td>
        <td>${f.category}</td>
        <td>${BCGUI.formatCurrency(f.price)} <s style="font-size:0.75rem; color:var(--text-muted);">${BCGUI.formatCurrency(f.mrp)}</s></td>
        <td>
          <strong style="color:${f.stock <= 3 ? 'var(--rose)' : 'inherit'};">${f.stock} Units</strong>
          ${f.stock <= 3 ? '<span class="badge badge-danger" style="margin-left:4px;">Low Stock</span>' : ''}
        </td>
        <td>
          <div style="display:inline-flex; align-items:center; gap:4px;">
            <button class="btn btn-sm btn-outline" onclick="StaffApp.adjustStock('${f.id}', -1)">-1</button>
            <button class="btn btn-sm btn-outline" onclick="StaffApp.adjustStock('${f.id}', 1)">+1</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  adjustStock: function(frameId, change) {
    window.BCGStore.updateFrameStock(frameId, change);
    BCGUI.toast(`Stock updated for frame`, "info");
    this.renderInventoryList();
    this.populateFrameDropdown();
  }
};

window.StaffApp = StaffApp;

document.addEventListener('DOMContentLoaded', () => {
  StaffApp.init();
});
