/**
 * Bhardwaj Chasma Ghar - Core Shared UI, Cart & Customer 360 Controller
 * Complete Eye Care & Optical Solutions
 * Business: Itaily Moad, Maudha Road, Mehnajpur, Azamgarh
 * Consultant: Dr. Satya Prakash Bhardwaj
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
        z-index: 99999;
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
      max-width: 420px;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
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
      toast.innerHTML = `<span style="font-size:1.1rem;">✓</span> <span>${message}</span>`;
    } else if (type === 'error' || type === 'danger') {
      toast.style.background = '#e11d48'; // Rose
      toast.innerHTML = `<span style="font-size:1.1rem;">✕</span> <span>${message}</span>`;
    } else if (type === 'warning') {
      toast.style.background = '#d97706'; // Amber
      toast.innerHTML = `<span style="font-size:1.1rem;">⚠</span> <span>${message}</span>`;
    } else {
      toast.style.background = '#0284c7'; // Blue
      toast.innerHTML = `<span style="font-size:1.1rem;">ℹ</span> <span>${message}</span>`;
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
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Currency Formatter (INR ₹)
  formatCurrency: function(num) {
    return '₹' + Number(num || 0).toLocaleString('en-IN');
  },

  // Setup Global Header User Widget & Cart Button
  setupHeaderWidget: function() {
    const user = window.BCGAuth ? window.BCGAuth.getCurrentUser() : null;
    const userArea = document.getElementById('auth-user-area');
    if (!userArea) return;

    const cartCount = window.BCGCart ? window.BCGCart.getCount() : 0;
    const cartButtonHtml = `
      <button class="btn btn-sm btn-outline cart-btn-toggle" onclick="BCGUI.openCartDrawer()" title="View Cart" style="display:inline-flex; align-items:center; gap:6px; position:relative;">
        <i class="fa-solid fa-cart-shopping"></i> Cart
        <span class="badge badge-primary cart-count-badge" style="${cartCount > 0 ? 'display:inline-flex;' : 'display:none;'} border-radius:10px; padding:2px 7px; font-size:0.75rem;">${cartCount}</span>
      </button>
    `;

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
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          ${cartButtonHtml}
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
        <div style="display:flex; align-items:center; gap:10px;">
          ${cartButtonHtml}
          <a href="login.html" class="btn btn-sm btn-outline">Login</a>
          <a href="store.html" class="btn btn-sm btn-primary">Optical Store</a>
        </div>
      `;
    }
  },

  // ==========================================================================
  // REAL SHOPPING CART & CHECKOUT MODALS
  // ==========================================================================
  openCartDrawer: function() {
    let container = document.getElementById('modal-cart-drawer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-cart-drawer';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    const items = window.BCGCart ? window.BCGCart.getItems() : [];
    const subtotal = window.BCGCart ? window.BCGCart.getSubtotal() : 0;

    container.innerHTML = `
      <div class="modal-box" style="max-width: 600px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-cart-shopping" style="color:var(--primary);"></i>
            <h3 class="modal-title">Shopping Cart (${items.length} item${items.length === 1 ? '' : 's'})</h3>
          </div>
          <button class="modal-close" onclick="BCGUI.closeModal('modal-cart-drawer')">&times;</button>
        </div>

        <div class="modal-body" style="max-height:60vh; overflow-y:auto; padding:20px;">
          ${items.length === 0 ? `
            <div style="text-align:center; padding:40px 10px; color:var(--text-muted);">
              <i class="fa-solid fa-basket-shopping" style="font-size:3rem; margin-bottom:12px; color:var(--border-medium);"></i>
              <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">Your Cart is Empty</h4>
              <p style="font-size:0.86rem; margin-bottom:18px;">Browse our curated frames, computer glasses and lenses.</p>
              <a href="store.html" class="btn btn-primary" onclick="BCGUI.closeModal('modal-cart-drawer')">Shop Optical Store</a>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:14px;">
              ${items.map(it => `
                <div style="display:grid; grid-template-columns: 70px 1fr auto; gap:14px; align-items:center; padding:12px; border:1px solid var(--border-light); border-radius:var(--radius-md); background:var(--bg-surface);">
                  <img src="${it.image}" alt="${it.brand}" style="width:70px; height:60px; object-fit:cover; border-radius:var(--radius-sm);">
                  <div>
                    <h4 style="font-size:0.92rem; font-weight:800; margin-bottom:2px;">${it.brand} ${it.model}</h4>
                    <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:4px;">
                      SKU: ${it.sku || 'N/A'} ${it.lensName ? `<br><strong style="color:var(--primary);">Lens: ${it.lensName}</strong>` : ''}
                      ${it.hasPrescription ? `<br><span class="badge badge-info" style="font-size:0.7rem;">Rx Details Attached</span>` : ''}
                    </p>
                    <div style="font-weight:800; color:var(--primary); font-size:0.95rem;">
                      ${this.formatCurrency(it.price)} <s style="font-size:0.75rem; color:var(--text-muted);">${this.formatCurrency(it.mrp)}</s>
                    </div>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                    <div style="display:inline-flex; align-items:center; border:1px solid var(--border-medium); border-radius:var(--radius-sm); overflow:hidden;">
                      <button type="button" style="padding:4px 8px; border:none; background:var(--bg-subtle); cursor:pointer;" onclick="BCGCart.updateQty('${it.cartItemId}', ${it.qty - 1}); BCGUI.openCartDrawer();">-</button>
                      <span style="padding:4px 10px; font-size:0.85rem; font-weight:700;">${it.qty}</span>
                      <button type="button" style="padding:4px 8px; border:none; background:var(--bg-subtle); cursor:pointer;" onclick="BCGCart.updateQty('${it.cartItemId}', ${it.qty + 1}); BCGUI.openCartDrawer();">+</button>
                    </div>
                    <button type="button" style="background:none; border:none; color:var(--rose); font-size:0.8rem; cursor:pointer;" onclick="BCGCart.removeItem('${it.cartItemId}'); BCGUI.openCartDrawer();">
                      <i class="fa-solid fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        ${items.length > 0 ? `
          <div class="modal-footer" style="flex-direction:column; gap:12px; background:var(--bg-subtle); border-top:1px solid var(--border-light); padding:16px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; font-size:1.05rem;">
              <span style="font-weight:700;">Cart Subtotal:</span>
              <strong style="color:var(--primary); font-size:1.3rem;">${this.formatCurrency(subtotal)}</strong>
            </div>
            <p style="font-size:0.78rem; color:var(--text-muted); text-align:center; margin:0;">
              * Fitting, verification & tax invoice will be generated by our Optical Staff upon order review.
            </p>
            <div style="display:flex; gap:10px; width:100%;">
              <button class="btn btn-outline" style="flex:1;" onclick="BCGUI.closeModal('modal-cart-drawer')">Continue Shopping</button>
              <button class="btn btn-primary" style="flex:1;" onclick="BCGUI.closeModal('modal-cart-drawer'); BCGUI.openCheckoutModal();">
                Proceed to Checkout &rarr;
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.openModal('modal-cart-drawer');
  },

  openCheckoutModal: function() {
    const items = window.BCGCart ? window.BCGCart.getItems() : [];
    if (items.length === 0) {
      this.toast("Your cart is empty!", "warning");
      return;
    }

    const user = window.BCGAuth ? window.BCGAuth.getCurrentUser() : null;
    const subtotal = window.BCGCart.getSubtotal();
    const discount = items.some(it => it.mrp > it.price) ? Math.round(subtotal * 0.05) : 0; // Promotional counter discount
    const grandTotal = Math.max(0, subtotal - discount);

    let container = document.getElementById('modal-checkout');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-checkout';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="modal-box" style="max-width: 680px;">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-shield-check" style="color:var(--emerald);"></i> Customer Checkout & Order Request</h3>
          <button class="modal-close" onclick="BCGUI.closeModal('modal-checkout')">&times;</button>
        </div>

        <form id="form-customer-checkout" onsubmit="event.preventDefault(); BCGUI.handleOrderSubmission();">
          <div class="modal-body" style="padding:20px; max-height:70vh; overflow-y:auto;">
            
            <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:var(--radius-md); padding:12px 16px; margin-bottom:18px; font-size:0.85rem; color:#0369a1;">
              <strong><i class="fa-solid fa-circle-info"></i> Important Optical Policy:</strong>
              Your order is placed as an <em>Order Request</em>. Our certified optical staff will verify frame availability, lens parameters, and generate the final official GST Tax Invoice.
            </div>

            <!-- Customer Details -->
            <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:12px; color:var(--text-main);">1. Customer & Delivery Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" id="chk-name" class="form-control" required value="${user ? user.name : 'Rahul Sharma'}" placeholder="Enter customer name">
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Number *</label>
                <input type="tel" id="chk-phone" class="form-control" required value="${user ? user.phone : '9876543210'}" placeholder="10-digit mobile number">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Email (Optional)</label>
                <input type="email" id="chk-email" class="form-control" value="${user ? user.email : ''}" placeholder="care@customer.com">
              </div>
              <div class="form-group">
                <label class="form-label">Delivery Type</label>
                <select id="chk-delivery-type" class="form-control">
                  <option value="Store Pickup">Store Pickup (Itaily Moad, Mehnajpur Showroom)</option>
                  <option value="Home Delivery">Regional Home Delivery (Azamgarh / Nearby)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Delivery / Residence Address *</label>
              <textarea id="chk-address" class="form-control" rows="2" required placeholder="House / Village / Ward, Mehnajpur, Azamgarh - 276204">Itaily Moad, Mehnajpur, Azamgarh - 276204</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Special Notes / Frame Fit Request</label>
              <input type="text" id="chk-notes" class="form-control" placeholder="e.g. Please verify nose bridge width, or keep ready for evening pickup">
            </div>

            <!-- Order Review Table -->
            <h4 style="font-size:0.95rem; font-weight:800; margin:18px 0 10px; color:var(--text-main);">2. Order Review (${items.length} item${items.length === 1 ? '' : 's'})</h4>
            <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); margin-bottom:16px;">
              <table style="width:100%; font-size:0.86rem; border-collapse:collapse;">
                <tbody>
                  ${items.map(it => `
                    <tr style="border-bottom:1px solid var(--border-light);">
                      <td style="padding:6px 0;"><strong>${it.brand} ${it.model}</strong> (${it.qty}x)${it.lensName ? `<br><small style="color:var(--text-muted);">+ ${it.lensName}</small>` : ''}</td>
                      <td style="text-align:right; font-weight:700; padding:6px 0;">${this.formatCurrency(it.price * it.qty)}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td style="padding:8px 0 2px; color:var(--text-muted);">Subtotal:</td>
                    <td style="text-align:right; padding:8px 0 2px;">${this.formatCurrency(subtotal)}</td>
                  </tr>
                  ${discount > 0 ? `
                    <tr>
                      <td style="padding:2px 0; color:var(--emerald);">Promotional Discount:</td>
                      <td style="text-align:right; padding:2px 0; color:var(--emerald);">- ${this.formatCurrency(discount)}</td>
                    </tr>
                  ` : ''}
                  <tr style="font-size:1.05rem; font-weight:800; border-top:1px solid var(--border-medium);">
                    <td style="padding:8px 0 0;">Estimated Total:</td>
                    <td style="text-align:right; padding:8px 0 0; color:var(--primary);">${this.formatCurrency(grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div class="modal-footer" style="justify-content:space-between;">
            <button type="button" class="btn btn-outline" onclick="BCGUI.closeModal('modal-checkout')">Back to Cart</button>
            <button type="submit" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-check"></i> Place Order Request
            </button>
          </div>
        </form>
      </div>
    `;

    this.openModal('modal-checkout');
  },

  handleOrderSubmission: function() {
    const name = document.getElementById('chk-name').value.trim();
    const phone = document.getElementById('chk-phone').value.trim();
    const email = document.getElementById('chk-email').value.trim();
    const address = document.getElementById('chk-address').value.trim();
    const notes = document.getElementById('chk-notes').value.trim();
    const user = window.BCGAuth ? window.BCGAuth.getCurrentUser() : null;

    const items = window.BCGCart.getItems();
    const hasRx = items.some(it => it.hasPrescription || it.lensId);

    const subtotal = window.BCGCart.getSubtotal();
    const discount = items.some(it => it.mrp > it.price) ? Math.round(subtotal * 0.05) : 0;

    const newOrder = window.BCGStore.createCustomerOrder({
      customerId: user ? user.id : 'GUEST',
      patientId: user ? user.patientId : null,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      shippingAddress: address,
      orderType: hasRx ? 'PrescriptionUpload' : 'Normal',
      items: items,
      discount: discount,
      notes: notes
    });

    // Clear cart after placing order
    window.BCGCart.clear();
    this.closeModal('modal-checkout');

    // Show Confirmation Screen
    this.openOrderConfirmationModal(newOrder);
  },

  openOrderConfirmationModal: function(order) {
    let container = document.getElementById('modal-order-confirm');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-order-confirm';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="modal-box" style="max-width: 580px; text-align:center;">
        <div class="modal-body" style="padding:36px 24px;">
          <div style="width:68px; height:68px; background:var(--emerald-light); color:var(--emerald); border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:16px;">
            <i class="fa-solid fa-check"></i>
          </div>
          
          <h2 style="font-size:1.6rem; font-weight:800; color:var(--text-main); margin-bottom:6px;">
            Order Received Successfully!
          </h2>
          <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:20px;">
            Order Reference: <strong style="color:var(--primary); font-size:1.1rem;">${order.id}</strong>
          </p>

          <div style="background:var(--bg-subtle); padding:16px; border-radius:var(--radius-md); text-align:left; font-size:0.86rem; margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span>Customer:</span>
              <strong>${order.customerName} (${order.customerPhone})</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span>Total Items:</span>
              <strong>${order.items.length} Product(s)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span>Order Amount:</span>
              <strong style="color:var(--primary); font-size:1rem;">${this.formatCurrency(order.totalAmount)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span>Order Status:</span>
              <span class="badge badge-warning">${order.status}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Invoice Status:</span>
              <span class="badge badge-neutral">Pending Staff Billing</span>
            </div>
          </div>

          <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:var(--radius-md); padding:14px; font-size:0.88rem; color:#92400e; margin-bottom:24px; text-align:left;">
            <strong><i class="fa-solid fa-handshake"></i> What Happens Next?</strong><br>
            Our optical staff at <strong>Bhardwaj Chasma Ghar (Mehnajpur)</strong> will inspect the frame stock and verify your prescription details. <strong>Staff will generate the final GST Tax Invoice</strong> and update your delivery timeline.
          </div>

          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-outline" onclick="BCGUI.closeModal('modal-order-confirm'); window.location.href='store.html';">
              Continue Shopping
            </button>
            <a href="customer.html#orders" class="btn btn-primary" onclick="BCGUI.closeModal('modal-order-confirm')">
              <i class="fa-solid fa-user"></i> View My Orders
            </a>
          </div>
        </div>
      </div>
    `;

    this.openModal('modal-order-confirm');
  },

  // ==========================================================================
  // CUSTOMER 360° LIFETIME PROFILE
  // ==========================================================================
  openCustomer360: function(patientId) {
    const data = window.BCGStore.getCustomer360(patientId);
    if (!data || !data.patient) {
      this.toast("Customer records not found", "error");
      return;
    }

    const { patient, exams, prescriptions, opticalJobs, orders, repairs, invoices, totalSpent, totalDue } = data;
    const settings = window.BCGStore.getSettings();

    let container = document.getElementById('modal-customer-360');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-customer-360';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="modal-box" style="max-width: 920px;">
        <div class="modal-header" style="background: linear-gradient(135deg, #f0f9ff, #f8fafc);">
          <div>
            <span class="badge badge-teal">Customer 360° Unified Profile</span>
            <h2 class="modal-title" style="margin-top: 4px;">${patient.name} <span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;">(${patient.id})</span></h2>
          </div>
          <button class="modal-close" onclick="BCGUI.closeModal('modal-customer-360')">&times;</button>
        </div>

        <div class="modal-body" style="padding: 24px; max-height:75vh; overflow-y:auto;">
          <!-- Customer Demographics Bar -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; background:var(--bg-subtle); padding:16px; border-radius:var(--radius-md); margin-bottom: 20px;">
            <div><small style="color:var(--text-muted);">Mobile</small><p><strong>${patient.phone}</strong></p></div>
            <div><small style="color:var(--text-muted);">Age / Gender</small><p><strong>${patient.age} Yrs / ${patient.gender}</strong></p></div>
            <div><small style="color:var(--text-muted);">Occupation</small><p><strong>${patient.occupation || 'N/A'}</strong></p></div>
            <div><small style="color:var(--text-muted);">Total Spend</small><p style="color:var(--emerald); font-weight:800;">${this.formatCurrency(totalSpent)}</p></div>
            <div><small style="color:var(--text-muted);">Current Due</small><p style="color:${totalDue > 0 ? 'var(--rose)' : 'var(--emerald)'}; font-weight:800;">${this.formatCurrency(totalDue)}</p></div>
          </div>

          <div style="margin-bottom: 18px; font-size: 0.86rem; color: var(--text-muted);">
            <strong>Address:</strong> ${patient.address || settings.address} &nbsp;|&nbsp; 
            <strong>Emergency Contact:</strong> ${patient.emergencyContact || 'None'} &nbsp;|&nbsp;
            <strong>Medical Notes:</strong> <span style="color:var(--text-main);">${patient.medicalHistory || 'None'}</span>
          </div>

          <!-- Section Tabs Navigation -->
          <div style="display:flex; gap:10px; border-bottom:1px solid var(--border-light); margin-bottom:16px; padding-bottom:8px; overflow-x:auto;">
            <button class="btn btn-sm btn-outline active" onclick="BCGUI.switch360Tab('c360-orders', this)">Orders (${orders.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-jobs', this)">Optical Jobs (${opticalJobs.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-rx', this)">Prescriptions (${prescriptions.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-repairs', this)">Repairs (${repairs.length})</button>
            <button class="btn btn-sm btn-outline" onclick="BCGUI.switch360Tab('c360-invoices', this)">Invoices (${invoices.length})</button>
          </div>

          <!-- Tab 1: Orders -->
          <div id="c360-orders" class="c360-tab-pane">
            ${orders.length === 0 ? '<p style="color:var(--text-muted);">No store orders placed yet.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Type</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orders.map(ord => `
                      <tr>
                        <td><strong>${ord.id}</strong><br><small style="color:var(--text-muted);">${ord.createdAt}</small></td>
                        <td><span class="badge ${ord.orderType === 'Normal' ? 'badge-info' : 'badge-purple'}">${ord.orderType}</span></td>
                        <td>${ord.items.map(it => `${it.brand} ${it.model} (${it.qty}x)`).join(', ')}</td>
                        <td><strong>${this.formatCurrency(ord.totalAmount)}</strong></td>
                        <td><span class="badge ${ord.status === 'Confirmed / Billed' ? 'badge-success' : 'badge-warning'}">${ord.status}</span></td>
                        <td>
                          ${ord.invoiceNumber ? `
                            <button class="btn btn-sm btn-outline" onclick="BCGUI.openInvoiceModal('${ord.invoiceNumber}')">
                              <i class="fa-solid fa-file-invoice"></i> View
                            </button>
                          ` : `<span style="color:var(--text-muted); font-size:0.78rem;">Pending Staff</span>`}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Tab 2: Optical Jobs -->
          <div id="c360-jobs" class="c360-tab-pane" style="display:none;">
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

          <!-- Tab 3: Prescriptions -->
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
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Tab 4: Repairs -->
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
                        <td><span class="badge ${rep.status === 'Ready' ? 'badge-success' : 'badge-warning'}">${rep.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Tab 5: Invoices -->
          <div id="c360-invoices" class="c360-tab-pane" style="display:none;">
            ${invoices.length === 0 ? '<p style="color:var(--text-muted);">No invoices generated.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Date</th>
                      <th>Items Count</th>
                      <th>Grand Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoices.map(inv => `
                      <tr>
                        <td><strong>${inv.id}</strong></td>
                        <td>${inv.date}</td>
                        <td>${inv.items.length}</td>
                        <td><strong>${this.formatCurrency(inv.grandTotal)}</strong></td>
                        <td><span class="badge ${inv.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${inv.paymentStatus}</span></td>
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

  // ==========================================================================
  // OFFICIAL PRINTABLE PRESCRIPTION PAD MODAL (Dr. Satya Prakash Bhardwaj)
  // ==========================================================================
  openRxModal: function(rxId) {
    const db = window.BCGStore.getDB();
    const rx = db.prescriptions.find(r => r.id === rxId);
    if (!rx) {
      this.toast("Prescription not found", "error");
      return;
    }
    const patient = db.patients.find(p => p.id === rx.patientId) || {};
    const settings = window.BCGStore.getSettings();

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
                <h2>${rx.doctorName || settings.doctorName}</h2>
                <p style="font-weight:700; color:var(--primary); font-size:0.9rem;">Consultant Eye Specialist & Vision Care</p>
                <p style="color:var(--text-muted); font-size:0.8rem;">Clinical Refraction & Comprehensive Vision Testing</p>
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

            <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:8px; color:var(--text-main);">Spectacle Refraction Findings:</h4>
            <table class="data-table rx-refraction-table">
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
                * This prescription is valid for 6 months. Certified precision optical dispensing at Bhardwaj Chasma Ghar, Mehnajpur.
              </div>
              <div style="text-align:center;">
                <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.6rem; color:var(--primary); line-height:1;">${rx.doctorName || settings.doctorName}</div>
                <div style="border-top:1px solid #0f172a; width:170px; margin-top:4px;"></div>
                <small style="font-size:0.75rem; font-weight:700;">Doctor's Signature & Stamp</small>
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

  // ==========================================================================
  // OFFICIAL GST TAX INVOICE MODAL (Staff-Generated)
  // ==========================================================================
  openInvoiceModal: function(invoiceId) {
    const db = window.BCGStore.getDB();
    const inv = db.invoices.find(i => i.id === invoiceId);
    if (!inv) {
      this.toast("Invoice not found or not yet generated by Staff", "error");
      return;
    }
    const settings = window.BCGStore.getSettings();

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
                  ${inv.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'PARTIAL / PENDING'}
                </span>
                <h3 style="font-size:1.2rem; font-weight:800; margin-top:8px;">TAX INVOICE</h3>
                <p style="font-size:0.88rem;"><strong>Invoice #:</strong> ${inv.id}</p>
                <p style="font-size:0.85rem;"><strong>Reference:</strong> ${inv.jobId || inv.orderId || 'Direct Retail'}</p>
                <p style="font-size:0.85rem;"><strong>Date:</strong> ${inv.date}</p>
                <p style="font-size:0.85rem;"><strong>Delivery Due:</strong> ${inv.expectedDelivery || 'Ready in 3 days'}</p>
              </div>
            </div>

            <div class="invoice-meta-grid">
              <div>
                <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Billed To (Customer):</h4>
                <p style="font-size:1rem; font-weight:700;">${inv.customerName}</p>
                <p style="font-size:0.85rem;">Phone: <strong>${inv.customerPhone}</strong></p>
                <p style="font-size:0.85rem;">Address: ${inv.customerAddress || settings.address}</p>
              </div>
              <div>
                <h4 style="font-size:0.85rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Clinical & Staff Reference:</h4>
                <p style="font-size:0.85rem;">Ref. Doctor: <strong>${inv.doctorName || settings.doctorName}</strong></p>
                <p style="font-size:0.85rem;">Prescription #: <strong>${inv.prescriptionRef || 'Retail Counter'}</strong></p>
                <p style="font-size:0.85rem;">Dispensed / Billed By: <strong>${inv.staffName || 'Manoj Sharma'}</strong></p>
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
                <p style="font-size:0.7rem;">Authorized Staff Signatory</p>
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
