/**
 * Bhardwaj Chasma Ghar - Authentication & Role-Based Access Control (RBAC)
 */

const BCG_SESSION_KEY = 'bcg_active_session_v1';

const BCGAuth = {
  // Get active session
  getCurrentUser: function() {
    try {
      const data = localStorage.getItem(BCG_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  // Login handler
  login: function(identifier, password) {
    const db = window.BCGStore.getDB();
    const cleanId = (identifier || '').trim().toLowerCase();
    
    // Find matching user by email or phone
    const user = db.users.find(u => 
      (u.email.toLowerCase() === cleanId || u.phone === cleanId) && 
      u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid email/phone or password." };
    }

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      patientId: user.patientId || null,
      designation: user.designation || null,
      permissions: user.permissions || [],
      avatar: user.avatar || "assets/avatar.png",
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(BCG_SESSION_KEY, JSON.stringify(sessionData));
    window.BCGStore.logAudit(user.name, user.role, "USER_LOGIN", user.id, `User logged in from ${user.role} role`);

    return { success: true, user: sessionData };
  },

  // Fast demo quick-login for pair testing
  quickLogin: function(role) {
    const db = window.BCGStore.getDB();
    let targetEmail = "";
    if (role === 'admin') targetEmail = "admin@bhardwajchasma.com";
    else if (role === 'doctor') targetEmail = "doctor@bhardwajchasma.com";
    else if (role === 'staff') targetEmail = "staff@bhardwajchasma.com";
    else if (role === 'customer') targetEmail = "rahul.sharma@gmail.com";

    const user = db.users.find(u => u.email.toLowerCase() === targetEmail);
    if (!user) return false;

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      patientId: user.patientId || null,
      designation: user.designation || null,
      permissions: user.permissions || [],
      avatar: user.avatar || "assets/avatar.png",
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(BCG_SESSION_KEY, JSON.stringify(sessionData));
    window.BCGStore.logAudit(user.name, user.role, "QUICK_LOGIN", user.id, `Logged in via quick switcher as ${role}`);
    return true;
  },

  logout: function() {
    const current = this.getCurrentUser();
    if (current) {
      window.BCGStore.logAudit(current.name, current.role, "USER_LOGOUT", current.id, "User logged out");
    }
    localStorage.removeItem(BCG_SESSION_KEY);
    window.location.href = "login.html";
  },

  // Check if current user has permission
  hasPermission: function(perm) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'doctor') {
      return ['view_patients', 'add_patients', 'create_exam', 'create_rx', 'view_rx', 'send_to_optical'].includes(perm);
    }
    if (user.role === 'staff') {
      return user.permissions && user.permissions.includes(perm);
    }
    return false;
  },

  // Protect a page according to allowed roles
  requireRole: function(allowedRoles = []) {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      return null;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert("Access Denied: You do not have authorization to view this panel.");
      if (user.role === 'admin') window.location.href = "admin.html";
      else if (user.role === 'doctor') window.location.href = "doctor.html";
      else if (user.role === 'staff') window.location.href = "staff.html";
      else window.location.href = "customer.html";
      return null;
    }
    return user;
  }
};

window.BCGAuth = BCGAuth;
