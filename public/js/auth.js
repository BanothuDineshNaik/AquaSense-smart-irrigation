/* ========================================================
   AquaSense — Authentication & Farmer Profile
   Credentials stored in localStorage
   ======================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'aquasense_users';
  const SESSION_KEY = 'aquasense_current_user';

  /* ---------- Helpers ---------- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }

  function setCurrentUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearCurrentUser() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function getAvatarColor(name) {
    const colors = ['#16a34a','#0ea5e9','#8b5cf6','#ec4899','#f59e0b','#ef4444','#14b8a6','#6366f1'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  /* ========================================================
     BUILD UI ELEMENTS
     ======================================================== */

  // --- Auth Modal ---
  function createAuthModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal-overlay';
    modal.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal-close" id="auth-modal-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>

        <div class="auth-modal-header">
          <div class="auth-modal-logo">
            <i class="fas fa-leaf"></i>
            <span>Aqua<strong>Sense</strong></span>
          </div>
          <p class="auth-modal-subtitle" id="auth-subtitle">Sign in to your farmer account</p>
        </div>

        <!-- Tab Switcher -->
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login" id="tab-login">Sign In</button>
          <button class="auth-tab" data-tab="signup" id="tab-signup">Create Account</button>
          <div class="auth-tab-indicator" id="auth-tab-indicator"></div>
        </div>

        <!-- Login Form -->
        <form class="auth-form" id="login-form">
          <div class="auth-field">
            <label for="login-email"><i class="fas fa-envelope"></i> Email</label>
            <input type="email" id="login-email" placeholder="farmer@example.com" required autocomplete="email" />
          </div>
          <div class="auth-field">
            <label for="login-password"><i class="fas fa-lock"></i> Password</label>
            <div class="auth-password-wrap">
              <input type="password" id="login-password" placeholder="Enter your password" required autocomplete="current-password" />
              <button type="button" class="auth-toggle-pw" data-target="login-password"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div class="auth-error hidden" id="login-error"></div>
          <button type="submit" class="btn btn-primary btn-block auth-submit">
            <i class="fas fa-sign-in-alt"></i> Sign In
          </button>
        </form>

        <!-- Signup Form -->
        <form class="auth-form hidden" id="signup-form">
          <div class="auth-field">
            <label for="signup-name"><i class="fas fa-user"></i> Full Name</label>
            <input type="text" id="signup-name" placeholder="e.g. Rajesh Kumar" required />
          </div>
          <div class="auth-field">
            <label for="signup-phone"><i class="fas fa-phone"></i> Phone Number</label>
            <input type="tel" id="signup-phone" placeholder="e.g. 9876543210" />
          </div>
          <div class="auth-field">
            <label for="signup-village"><i class="fas fa-map-marker-alt"></i> Village / Location</label>
            <input type="text" id="signup-village" placeholder="e.g. Anantapur, AP" />
          </div>
          <div class="auth-field">
            <label for="signup-email"><i class="fas fa-envelope"></i> Email</label>
            <input type="email" id="signup-email" placeholder="farmer@example.com" required autocomplete="email" />
          </div>
          <div class="auth-field">
            <label for="signup-password"><i class="fas fa-lock"></i> Password</label>
            <div class="auth-password-wrap">
              <input type="password" id="signup-password" placeholder="Create a password (min 4 chars)" required minlength="4" />
              <button type="button" class="auth-toggle-pw" data-target="signup-password"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div class="auth-error hidden" id="signup-error"></div>
          <button type="submit" class="btn btn-primary btn-block auth-submit">
            <i class="fas fa-user-plus"></i> Create Account
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // --- Profile Button (top-right in navbar) ---
  function createProfileBtn() {
    const wrap = document.createElement('div');
    wrap.className = 'profile-nav-wrap';
    wrap.id = 'profile-nav-wrap';
    wrap.innerHTML = `
      <button class="profile-login-btn" id="profile-login-btn">
        <i class="fas fa-user-circle"></i>
        <span>Login</span>
      </button>
    `;
    return wrap;
  }

  function createProfileAvatar(user) {
    const wrap = document.createElement('div');
    wrap.className = 'profile-nav-wrap';
    wrap.id = 'profile-nav-wrap';
    const color = getAvatarColor(user.name);
    const initials = getInitials(user.name);
    wrap.innerHTML = `
      <button class="profile-avatar-btn" id="profile-avatar-btn" aria-label="Profile menu">
        <div class="profile-avatar" style="background:${color}">${initials}</div>
        <span class="profile-name-short">${user.name.split(' ')[0]}</span>
        <i class="fas fa-chevron-down profile-chevron"></i>
      </button>
      <div class="profile-dropdown hidden" id="profile-dropdown">
        <div class="profile-dropdown-header">
          <div class="profile-avatar-lg" style="background:${color}">${initials}</div>
          <div class="profile-dropdown-info">
            <strong>${user.name}</strong>
            <span>${user.email}</span>
          </div>
        </div>
        <div class="profile-dropdown-divider"></div>
        <ul class="profile-dropdown-menu">
          ${user.phone ? `<li><i class="fas fa-phone"></i> ${user.phone}</li>` : ''}
          ${user.village ? `<li><i class="fas fa-map-marker-alt"></i> ${user.village}</li>` : ''}
          <li class="profile-dropdown-action" id="profile-edit-btn"><i class="fas fa-pen"></i> Edit Profile</li>
          <li class="profile-dropdown-action profile-logout" id="profile-logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</li>
        </ul>
      </div>
    `;
    return wrap;
  }

  /* ========================================================
     EDIT PROFILE MODAL
     ======================================================== */
  function createEditModal(user) {
    let existing = document.getElementById('edit-profile-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'edit-profile-modal';
    modal.className = 'auth-modal-overlay';
    modal.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal-close" id="edit-modal-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <div class="auth-modal-header">
          <div class="auth-modal-logo">
            <i class="fas fa-user-edit"></i>
            <span>Edit <strong>Profile</strong></span>
          </div>
        </div>
        <form class="auth-form" id="edit-profile-form">
          <div class="auth-field">
            <label for="edit-name"><i class="fas fa-user"></i> Full Name</label>
            <input type="text" id="edit-name" value="${user.name}" required />
          </div>
          <div class="auth-field">
            <label for="edit-phone"><i class="fas fa-phone"></i> Phone Number</label>
            <input type="tel" id="edit-phone" value="${user.phone || ''}" />
          </div>
          <div class="auth-field">
            <label for="edit-village"><i class="fas fa-map-marker-alt"></i> Village / Location</label>
            <input type="text" id="edit-village" value="${user.village || ''}" />
          </div>
          <div class="auth-error hidden" id="edit-error"></div>
          <button type="submit" class="btn btn-primary btn-block auth-submit">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => modal.classList.add('active'));

    // Close
    modal.querySelector('#edit-modal-close').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 350);
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 350);
      }
    });

    // Save
    modal.querySelector('#edit-profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-name').value.trim();
      const phone = document.getElementById('edit-phone').value.trim();
      const village = document.getElementById('edit-village').value.trim();

      if (!name) {
        showAuthError('edit-error', 'Name is required.');
        return;
      }

      // Update stored user
      const users = getUsers();
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) {
        users[idx].name = name;
        users[idx].phone = phone;
        users[idx].village = village;
        saveUsers(users);
        setCurrentUser(users[idx]);
      }

      modal.classList.remove('active');
      setTimeout(() => { modal.remove(); renderProfileUI(); }, 350);
    });
  }

  /* ========================================================
     RENDER PROFILE UI
     ======================================================== */
  function renderProfileUI() {
    const navInner = document.querySelector('.navbar-inner');
    if (!navInner) return;

    // Remove existing profile wrap
    const existing = document.getElementById('profile-nav-wrap');
    if (existing) existing.remove();

    const user = getCurrentUser();
    if (user) {
      const avatar = createProfileAvatar(user);
      navInner.appendChild(avatar);
      bindAvatarEvents();
    } else {
      const loginBtn = createProfileBtn();
      navInner.appendChild(loginBtn);
      bindLoginBtnEvents();
    }
  }

  /* ========================================================
     EVENT BINDINGS
     ======================================================== */
  function bindLoginBtnEvents() {
    const btn = document.getElementById('profile-login-btn');
    if (btn) btn.addEventListener('click', () => openAuthModal());
  }

  function bindAvatarEvents() {
    const avatarBtn = document.getElementById('profile-avatar-btn');
    const dropdown = document.getElementById('profile-dropdown');
    if (!avatarBtn || !dropdown) return;

    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
      avatarBtn.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
      avatarBtn.classList.remove('open');
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Logout
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        clearCurrentUser();
        renderProfileUI();
      });
    }

    // Edit profile
    const editBtn = document.getElementById('profile-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        dropdown.classList.add('hidden');
        const user = getCurrentUser();
        if (user) createEditModal(user);
      });
    }
  }

  /* ========================================================
     AUTH MODAL LOGIC
     ======================================================== */
  let authModal = null;

  function openAuthModal(tab = 'login') {
    if (!authModal) {
      authModal = createAuthModal();
      bindAuthModalEvents();
    }
    switchTab(tab);
    requestAnimationFrame(() => authModal.classList.add('active'));
  }

  function closeAuthModal() {
    if (authModal) authModal.classList.remove('active');
  }

  function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const subtitle = document.getElementById('auth-subtitle');
    const indicator = document.getElementById('auth-tab-indicator');

    if (tab === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      subtitle.textContent = 'Sign in to your farmer account';
      indicator.style.transform = 'translateX(0)';
    } else {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      tabLogin.classList.remove('active');
      tabSignup.classList.add('active');
      subtitle.textContent = 'Create your farmer account';
      indicator.style.transform = 'translateX(100%)';
    }
    // Clear errors
    document.querySelectorAll('.auth-error').forEach(el => { el.classList.add('hidden'); el.textContent = ''; });
  }

  function showAuthError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  }

  function bindAuthModalEvents() {
    // Close
    document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });

    // Tabs
    document.getElementById('tab-login').addEventListener('click', () => switchTab('login'));
    document.getElementById('tab-signup').addEventListener('click', () => switchTab('signup'));

    // Toggle password visibility
    document.querySelectorAll('.auth-toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const inp = document.getElementById(btn.dataset.target);
        const icon = btn.querySelector('i');
        if (inp.type === 'password') {
          inp.type = 'text';
          icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
          inp.type = 'password';
          icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
      });
    });

    // Login submit
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;

      if (!email || !password) { showAuthError('login-error', 'Please fill all fields.'); return; }

      const users = getUsers();
      const user = users.find(u => u.email === email);

      if (!user) { showAuthError('login-error', 'No account found with this email. Please sign up.'); return; }
      if (user.password !== password) { showAuthError('login-error', 'Incorrect password. Please try again.'); return; }

      setCurrentUser(user);
      closeAuthModal();
      renderProfileUI();
    });

    // Signup submit
    document.getElementById('signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const phone = document.getElementById('signup-phone').value.trim();
      const village = document.getElementById('signup-village').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const password = document.getElementById('signup-password').value;

      if (!name || !email || !password) { showAuthError('signup-error', 'Name, email and password are required.'); return; }
      if (password.length < 4) { showAuthError('signup-error', 'Password must be at least 4 characters.'); return; }

      const users = getUsers();
      if (users.find(u => u.email === email)) { showAuthError('signup-error', 'An account with this email already exists. Please sign in.'); return; }

      const newUser = { name, phone, village, email, password, createdAt: new Date().toISOString() };
      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);
      closeAuthModal();
      renderProfileUI();
    });
  }

  /* ========================================================
     INIT
     ======================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderProfileUI();
  });

  // Expose for external use if needed
  window.AquaSenseAuth = { getCurrentUser, openAuthModal };

})();
