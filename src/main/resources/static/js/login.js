// ====== LOGIN.JS - POS Bakso Tyga Sapi ======
// Mengikuti pola kode index.js yang sudah ada:
// - Vanilla JS tanpa framework
// - Fungsi-fungsi terdefinisi di scope global (untuk onclick inline)
// - Komentar Bahasa Indonesia

// ====== 1. KONSTANTA & SELEKSI ELEMEN ======
const loginForm = document.getElementById("loginForm");
const btnLogin = document.getElementById("btnLogin");
const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("password");
const errorEmail = document.getElementById("errorEmail");
const errorPassword = document.getElementById("errorPassword");
const groupEmail = document.getElementById("groupEmail");
const groupPassword = document.getElementById("groupPassword");
const rememberMeCheckbox = document.getElementById("rememberMe");

// ====== 2. REMEMBER ME: Isi otomatis username dari localStorage ======
// Jika user sebelumnya mencentang "Ingat saya", prefill form email
(function initRememberMe() {
  const savedUsername = localStorage.getItem("pos_remembered_username");
  if (savedUsername && inputUsername) {
    inputUsername.value = savedUsername;
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
  }
})();

// ====== 3. VALIDASI FORM SISI KLIEN ======
function validateForm() {
  let isValid = true;

  // Reset semua state error terlebih dahulu
  clearFieldError("groupEmail", "errorEmail");
  clearFieldError("groupPassword", "errorPassword");

  const usernameVal = inputUsername ? inputUsername.value.trim() : "";
  const passwordVal = inputPassword ? inputPassword.value : "";

  // Validasi Email/Username
  if (!usernameVal) {
    showFieldError("groupEmail", "errorEmail", "Email atau username wajib diisi.");
    isValid = false;
  } else if (usernameVal.includes("@") && !isValidEmail(usernameVal)) {
    // Hanya validasi format email jika user menginput karakter @
    showFieldError("groupEmail", "errorEmail", "Format email tidak valid.");
    isValid = false;
  }

  // Validasi Password
  if (!passwordVal) {
    showFieldError("groupPassword", "errorPassword", "Password wajib diisi.");
    isValid = false;
  } else if (passwordVal.length < 6) {
    showFieldError("groupPassword", "errorPassword", "Password minimal 6 karakter.");
    isValid = false;
  }

  return isValid;
}

// ====== 4. HANDLER SUBMIT FORM ======
function handleLoginSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    // Fokus ke field pertama yang error agar aksesibel
    const firstError = loginForm.querySelector(".input-wrapper input.input-error");
    if (firstError) {
      firstError.focus();
    }
    return;
  }

  // Simpan username ke localStorage jika "Remember Me" dicentang
  const usernameVal = inputUsername ? inputUsername.value.trim() : "";
  if (rememberMeCheckbox && rememberMeCheckbox.checked) {
    localStorage.setItem("pos_remembered_username", usernameVal);
  } else {
    localStorage.removeItem("pos_remembered_username");
  }

  // Tampilkan loading state pada tombol
  setLoadingState(true);

  // Submit form asli ke backend Spring Security
  // Menggunakan timeout minimal agar user melihat feedback loading
  setTimeout(function () {
    loginForm.submit();
  }, 300);
}

// ====== 5. TOGGLE SHOW/HIDE PASSWORD ======
function togglePasswordVisibility() {
  const iconEye = document.getElementById("iconEye");
  const iconEyeOff = document.getElementById("iconEyeOff");

  if (!inputPassword) return;

  if (inputPassword.type === "password") {
    inputPassword.type = "text";
    if (iconEye) iconEye.style.display = "none";
    if (iconEyeOff) iconEyeOff.style.display = "block";
    // Update aria-label untuk screen reader
    const toggleBtn = document.getElementById("togglePassword");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Sembunyikan password");
  } else {
    inputPassword.type = "password";
    if (iconEye) iconEye.style.display = "block";
    if (iconEyeOff) iconEyeOff.style.display = "none";
    const toggleBtn = document.getElementById("togglePassword");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Tampilkan password");
  }
}

// ====== 6. HELPER FUNCTIONS ======

// Validasi format email sederhana (konsisten dengan kebutuhan POS)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Tampilkan pesan error pada field tertentu
function showFieldError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const errorEl = document.getElementById(errorId);
  const input = group ? group.querySelector("input") : null;

  if (errorEl) errorEl.textContent = message;
  if (input) input.classList.add("input-error");
  if (group) group.classList.add("has-error");
}

// Hapus pesan error dari field
function clearFieldError(groupId, errorId) {
  const group = document.getElementById(groupId);
  const errorEl = document.getElementById(errorId);
  const input = group ? group.querySelector("input") : null;

  if (errorEl) errorEl.textContent = "";
  if (input) input.classList.remove("input-error");
  if (group) group.classList.remove("has-error");
}

// Aktifkan / nonaktifkan loading state tombol login
function setLoadingState(isLoading) {
  if (!btnLogin) return;

  if (isLoading) {
    btnLogin.classList.add("loading");
    btnLogin.disabled = true;
    btnLogin.setAttribute("aria-busy", "true");
  } else {
    btnLogin.classList.remove("loading");
    btnLogin.disabled = false;
    btnLogin.removeAttribute("aria-busy");
  }
}

// ====== 7. REAL-TIME VALIDATION: Hapus error saat user mulai mengetik ======
// Memberikan feedback positif saat user sudah mengisi field yang error
if (inputUsername) {
  inputUsername.addEventListener("input", function () {
    if (this.value.trim()) {
      clearFieldError("groupEmail", "errorEmail");
    }
  });
}

if (inputPassword) {
  inputPassword.addEventListener("input", function () {
    if (this.value) {
      clearFieldError("groupPassword", "errorPassword");
    }
  });
}

// ====== 8. KEYBOARD SHORTCUT: Enter di field username pindah ke password ======
if (inputUsername) {
  inputUsername.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputPassword) {
        inputPassword.focus();
      }
    }
  });
}

// ====== 9. DETEKSI PESAN ERROR DARI SERVER (fallback UI feedback) ======
// Spring Security mengirim ?error pada URL setelah login gagal
// Kita tangani juga di sisi JS sebagai fallback jika Thymeleaf tidak me-render alert
(function checkUrlError() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("error")) {
    const alertEl = document.querySelector(".alert-error");
    // Jika Thymeleaf tidak me-render alert (misal mode non-server), tampilkan manual
    if (!alertEl) {
      const card = document.querySelector(".login-card");
      const header = document.querySelector(".login-header");
      if (card && header) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "alert alert-error";
        errorDiv.setAttribute("role", "alert");
        errorDiv.textContent = "Email atau password salah. Silakan coba lagi.";
        header.insertAdjacentElement("afterend", errorDiv);
      }
    }
  }
})();