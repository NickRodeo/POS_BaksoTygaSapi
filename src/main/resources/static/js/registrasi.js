// ====== REGISTER.JS - POS Bakso Tyga Sapi ======
// Mengikuti pola kode login.js yang sudah ada:
// - Vanilla JS tanpa framework
// - Fungsi-fungsi terdefinisi di scope global (untuk onclick inline)
// - Komentar Bahasa Indonesia
// - Helper functions identik: showFieldError(), clearFieldError(), setLoadingState()

// ====== 1. KONSTANTA & SELEKSI ELEMEN ======
const registerForm = document.getElementById("registerForm");
const btnRegister = document.getElementById("btnRegister");
const inputNamaLengkap = document.getElementById("namaLengkap");
const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const inputNoTelp = document.getElementById("noTelp");
const inputPassword = document.getElementById("password");
const inputConfirmPassword = document.getElementById("confirmPassword");
const inputRole = document.getElementById("role");
const inputAgreement = document.getElementById("agreement");
const passwordStrengthEl = document.getElementById("passwordStrength");
const strengthLabelEl = document.getElementById("strengthLabel");

// ====== 2. VALIDASI FORM SISI KLIEN ======
// Menjalankan seluruh validasi sebelum form di-submit ke server
function validateRegisterForm() {
  let isValid = true;

  // Reset semua state error terlebih dahulu
  clearFieldError("groupNamaLengkap", "errorNamaLengkap");
  clearFieldError("groupUsername", "errorUsername");
  clearFieldError("groupEmail", "errorEmail");
  clearFieldError("groupNoTelp", "errorNoTelp");
  clearFieldError("groupPassword", "errorPassword");
  clearFieldError("groupConfirmPassword", "errorConfirmPassword");
  clearFieldError("groupRole", "errorRole");
  clearFieldError("groupAgreement", "errorAgreement");

  const namaVal = inputNamaLengkap ? inputNamaLengkap.value.trim() : "";
  const usernameVal = inputUsername ? inputUsername.value.trim() : "";
  const emailVal = inputEmail ? inputEmail.value.trim() : "";
  const noTelpVal = inputNoTelp ? inputNoTelp.value.trim() : "";
  const passwordVal = inputPassword ? inputPassword.value : "";
  const confirmPasswordVal = inputConfirmPassword ? inputConfirmPassword.value : "";
  const roleVal = inputRole ? inputRole.value : "";
  const agreementVal = inputAgreement ? inputAgreement.checked : false;

  // ---- Validasi Nama Lengkap ----
  if (!namaVal) {
    showFieldError("groupNamaLengkap", "errorNamaLengkap", "Nama lengkap wajib diisi.");
    isValid = false;
  } else if (namaVal.length < 2) {
    showFieldError("groupNamaLengkap", "errorNamaLengkap", "Nama lengkap minimal 2 karakter.");
    isValid = false;
  }

  // ---- Validasi Username ----
  if (!usernameVal) {
    showFieldError("groupUsername", "errorUsername", "Username wajib diisi.");
    isValid = false;
  } else if (usernameVal.length < 4) {
    showFieldError("groupUsername", "errorUsername", "Username minimal 4 karakter.");
    isValid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(usernameVal)) {
    showFieldError("groupUsername", "errorUsername", "Username hanya boleh berisi huruf, angka, dan underscore.");
    isValid = false;
  }

  // ---- Validasi Email ----
  if (!emailVal) {
    showFieldError("groupEmail", "errorEmail", "Email wajib diisi.");
    isValid = false;
  } else if (!isValidEmail(emailVal)) {
    showFieldError("groupEmail", "errorEmail", "Format email tidak valid.");
    isValid = false;
  }

  // ---- Validasi Nomor Telepon ----
  if (!noTelpVal) {
    showFieldError("groupNoTelp", "errorNoTelp", "Nomor telepon wajib diisi.");
    isValid = false;
  } else if (!/^[0-9]+$/.test(noTelpVal)) {
    showFieldError("groupNoTelp", "errorNoTelp", "Nomor telepon hanya boleh berisi angka.");
    isValid = false;
  } else if (noTelpVal.length < 9 || noTelpVal.length > 15) {
    showFieldError("groupNoTelp", "errorNoTelp", "Nomor telepon harus 9–15 digit.");
    isValid = false;
  }

  // ---- Validasi Password ----
  if (!passwordVal) {
    showFieldError("groupPassword", "errorPassword", "Password wajib diisi.");
    isValid = false;
  } else if (passwordVal.length < 8) {
    showFieldError("groupPassword", "errorPassword", "Password minimal 8 karakter.");
    isValid = false;
  } else if (!hasLetterAndNumber(passwordVal)) {
    showFieldError("groupPassword", "errorPassword", "Password harus mengandung huruf dan angka.");
    isValid = false;
  }

  // ---- Validasi Konfirmasi Password ----
  if (!confirmPasswordVal) {
    showFieldError("groupConfirmPassword", "errorConfirmPassword", "Konfirmasi password wajib diisi.");
    isValid = false;
  } else if (passwordVal && confirmPasswordVal !== passwordVal) {
    showFieldError("groupConfirmPassword", "errorConfirmPassword", "Konfirmasi password tidak cocok.");
    isValid = false;
  }

  // ---- Validasi Role ----
  if (!roleVal) {
    showFieldError("groupRole", "errorRole", "Pilih role akun terlebih dahulu.");
    isValid = false;
  }

  // ---- Validasi Checkbox Agreement ----
  if (!agreementVal) {
    showFieldError("groupAgreement", "errorAgreement", "Anda harus menyetujui syarat & ketentuan untuk mendaftar.");
    isValid = false;
  }

  return isValid;
}

// ====== 3. HANDLER SUBMIT FORM ======
function handleRegisterSubmit(event) {
  event.preventDefault();

  if (!validateRegisterForm()) {
    // Fokus ke field pertama yang error agar aksesibel dengan keyboard
    const firstErrorInput = registerForm.querySelector(".input-wrapper input.input-error, .select-wrapper select.input-error");
    if (firstErrorInput) {
      firstErrorInput.focus();
    }
    return;
  }

  // Tampilkan loading state pada tombol submit
  setLoadingState(true);

  // Submit form asli ke backend Spring
  // Timeout minimal 300ms agar user melihat feedback loading state
  setTimeout(function () {
    registerForm.submit();
  }, 300);
}

// ====== 4. TOGGLE SHOW/HIDE PASSWORD (Generic, mendukung beberapa field) ======
// Fungsi dibuat generik agar bisa dipakai untuk field password dan confirm password
function togglePasswordVisibility(inputId, iconEyeId, iconEyeOffId, btnId) {
  const input = document.getElementById(inputId);
  const iconEye = document.getElementById(iconEyeId);
  const iconEyeOff = document.getElementById(iconEyeOffId);
  const toggleBtn = document.getElementById(btnId);

  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    if (iconEye) iconEye.style.display = "none";
    if (iconEyeOff) iconEyeOff.style.display = "block";
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Sembunyikan password");
  } else {
    input.type = "password";
    if (iconEye) iconEye.style.display = "block";
    if (iconEyeOff) iconEyeOff.style.display = "none";
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Tampilkan password");
  }
}

// ====== 5. PASSWORD STRENGTH INDICATOR ======
// Menghitung dan menampilkan indikator kekuatan password secara real-time
function updatePasswordStrength(password) {
  const strengthEl = passwordStrengthEl;

  if (!password) {
    // Sembunyikan indicator jika password kosong
    strengthEl.classList.remove("visible", "strength-1", "strength-2", "strength-3", "strength-4");
    return;
  }

  strengthEl.classList.add("visible");

  // Hitung skor kekuatan (0–4) berdasarkan beberapa kriteria
  let skor = 0;

  if (password.length >= 8) skor++;             // Minimal 8 karakter
  if (/[A-Z]/.test(password)) skor++;            // Ada huruf kapital
  if (/[0-9]/.test(password)) skor++;            // Ada angka
  if (/[^a-zA-Z0-9]/.test(password)) skor++;     // Ada karakter spesial

  // Pastikan skor minimal 1 jika ada isian (agar bar pertama selalu aktif)
  if (skor === 0) skor = 1;

  // Hapus semua class strength lama sebelum menambah yang baru
  strengthEl.classList.remove("strength-1", "strength-2", "strength-3", "strength-4");
  strengthEl.classList.add("strength-" + skor);

  // Update label teks
  const labels = {
    1: "Lemah",
    2: "Cukup",
    3: "Baik",
    4: "Kuat"
  };

  if (strengthLabelEl) {
    strengthLabelEl.textContent = labels[skor] || "Masukkan password";
  }
}

// ====== 6. PASSWORD MATCH INDICATOR ======
// Menampilkan ikon centang/silang di field konfirmasi password saat user mengetik
function updateConfirmPasswordMatch() {
  const passwordVal = inputPassword ? inputPassword.value : "";
  const confirmVal = inputConfirmPassword ? inputConfirmPassword.value : "";

  // Cari atau buat elemen ikon match di dalam input-wrapper confirmPassword
  const confirmWrapper = inputConfirmPassword ? inputConfirmPassword.closest(".input-wrapper") : null;
  if (!confirmWrapper) return;

  let matchIcon = confirmWrapper.querySelector(".match-indicator");

  // Buat elemen ikon jika belum ada (inisialisasi lazy)
  if (!matchIcon) {
    matchIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    matchIcon.setAttribute("class", "match-indicator");
    matchIcon.setAttribute("viewBox", "0 0 24 24");
    matchIcon.setAttribute("fill", "none");
    matchIcon.setAttribute("stroke", "currentColor");
    matchIcon.setAttribute("stroke-width", "2.5");
    matchIcon.setAttribute("stroke-linecap", "round");
    matchIcon.setAttribute("stroke-linejoin", "round");
    matchIcon.setAttribute("aria-hidden", "true");
    // Sisipkan sebelum tombol toggle agar posisi tidak berbenturan
    const toggleBtn = confirmWrapper.querySelector(".btn-toggle-password");
    confirmWrapper.insertBefore(matchIcon, toggleBtn);
  }

  if (!confirmVal) {
    // Sembunyikan ikon jika belum ada input
    matchIcon.classList.remove("visible", "match-ok", "match-fail");
    matchIcon.innerHTML = "";
    return;
  }

  if (confirmVal === passwordVal) {
    // Password cocok: tampilkan centang hijau
    matchIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    matchIcon.classList.add("visible", "match-ok");
    matchIcon.classList.remove("match-fail");
  } else {
    // Password tidak cocok: tampilkan silang merah
    matchIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
    matchIcon.classList.add("visible", "match-fail");
    matchIcon.classList.remove("match-ok");
  }
}

// ====== 7. HELPER FUNCTIONS ======
// (Pola identik dengan login.js agar konsisten di seluruh proyek)

// Validasi format email dengan regex standar
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Cek apakah string mengandung minimal 1 huruf DAN 1 angka
function hasLetterAndNumber(str) {
  return /[a-zA-Z]/.test(str) && /[0-9]/.test(str);
}

// Tampilkan pesan error pada field tertentu
function showFieldError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const errorEl = document.getElementById(errorId);
  // Cari input ATAU select di dalam group
  const field = group ? (group.querySelector("input") || group.querySelector("select")) : null;

  if (errorEl) errorEl.textContent = message;
  if (field) field.classList.add("input-error");
  if (group) group.classList.add("has-error");
}

// Hapus pesan error dari field
function clearFieldError(groupId, errorId) {
  const group = document.getElementById(groupId);
  const errorEl = document.getElementById(errorId);
  const field = group ? (group.querySelector("input") || group.querySelector("select")) : null;

  if (errorEl) errorEl.textContent = "";
  if (field) field.classList.remove("input-error");
  if (group) group.classList.remove("has-error");
}

// Aktifkan / nonaktifkan loading state tombol register
function setLoadingState(isLoading) {
  if (!btnRegister) return;

  if (isLoading) {
    btnRegister.classList.add("loading");
    btnRegister.disabled = true;
    btnRegister.setAttribute("aria-busy", "true");
  } else {
    btnRegister.classList.remove("loading");
    btnRegister.disabled = false;
    btnRegister.removeAttribute("aria-busy");
  }
}

// ====== 8. REAL-TIME VALIDATION: Hapus error saat user mulai mengetik ======
// Memberikan feedback positif segera setelah user mulai memperbaiki field yang error

if (inputNamaLengkap) {
  inputNamaLengkap.addEventListener("input", function () {
    if (this.value.trim()) clearFieldError("groupNamaLengkap", "errorNamaLengkap");
  });
}

if (inputUsername) {
  inputUsername.addEventListener("input", function () {
    if (this.value.trim()) clearFieldError("groupUsername", "errorUsername");
  });
}

if (inputEmail) {
  inputEmail.addEventListener("input", function () {
    if (this.value.trim()) clearFieldError("groupEmail", "errorEmail");
  });
}

if (inputNoTelp) {
  inputNoTelp.addEventListener("input", function () {
    // Hapus karakter non-angka secara otomatis (UX improvement)
    this.value = this.value.replace(/[^0-9]/g, "");
    if (this.value) clearFieldError("groupNoTelp", "errorNoTelp");
  });
}

if (inputPassword) {
  inputPassword.addEventListener("input", function () {
    const passwordVal = this.value;

    // Tampilkan strength indicator real-time
    updatePasswordStrength(passwordVal);

    // Hapus error saat user mengetik
    if (passwordVal) clearFieldError("groupPassword", "errorPassword");

    // Update match indicator juga karena password berubah
    updateConfirmPasswordMatch();
  });
}

if (inputConfirmPassword) {
  inputConfirmPassword.addEventListener("input", function () {
    // Hapus error saat user mengetik
    if (this.value) clearFieldError("groupConfirmPassword", "errorConfirmPassword");

    // Update ikon match/tidak-match
    updateConfirmPasswordMatch();
  });
}

if (inputRole) {
  inputRole.addEventListener("change", function () {
    if (this.value) clearFieldError("groupRole", "errorRole");
    // Update warna teks select: placeholder = abu-abu, pilihan nyata = gelap.
    // CSS option[disabled] tidak reliable di Firefox & Safari, jadi terapkan
    // via inline style langsung pada elemen select.
    updateSelectPlaceholderColor(this);
  });
}

// ====== SELECT PLACEHOLDER COLOR: Cross-browser helper ======
// Firefox dan Safari tidak support CSS styling pada <option> secara reliable.
// Solusi: terapkan warna langsung ke elemen <select> berdasarkan value-nya.
function updateSelectPlaceholderColor(selectEl) {
  if (!selectEl) return;

  if (selectEl.value === "") {
    // Placeholder aktif: gunakan warna --color-text-light dari CSS variable
    var placeholderColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-text-light")
      .trim();
    selectEl.style.color = placeholderColor || "#94a3b8";
  } else {
    // Nilai nyata dipilih: hapus inline style, kembalikan ke CSS variable
    selectEl.style.color = "";
  }
}

// Jalankan sekali saat halaman load untuk state awal
// (handle kasus form repopulate dari server — jika role sudah ada, warna tetap gelap)
(function initSelectPlaceholderColor() {
  if (inputRole) updateSelectPlaceholderColor(inputRole);
})();

if (inputAgreement) {
  inputAgreement.addEventListener("change", function () {
    if (this.checked) clearFieldError("groupAgreement", "errorAgreement");
  });
}

// ====== 9. KEYBOARD NAVIGATION: Tab order alami antar field ======
// Enter di field tertentu memindahkan fokus ke field berikutnya
// (Tidak meng-override perilaku Enter di select dan textarea)

var fieldOrder = [
  inputNamaLengkap,
  inputUsername,
  inputEmail,
  inputNoTelp,
  inputPassword,
  inputConfirmPassword
];

fieldOrder.forEach(function (field, index) {
  if (!field) return;

  field.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      var nextField = fieldOrder[index + 1];
      if (nextField) {
        nextField.focus();
      } else {
        // Field terakhir: fokus ke select role
        if (inputRole) inputRole.focus();
      }
    }
  });
});

// ====== 10. DETEKSI PESAN ERROR DARI SERVER (fallback UI feedback) ======
// Spring mengirim ?error pada URL setelah registrasi gagal
// Kita tangani di sisi JS sebagai fallback jika Thymeleaf tidak me-render alert
(function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("error")) {
    const alertEl = document.querySelector(".alert-error");
    if (!alertEl) {
      const header = document.querySelector(".login-header");
      if (header) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "alert alert-error";
        errorDiv.setAttribute("role", "alert");
        errorDiv.textContent = "Pendaftaran gagal. Username atau email mungkin sudah digunakan.";
        header.insertAdjacentElement("afterend", errorDiv);
      }
    }
  }

  if (urlParams.has("success")) {
    const alertEl = document.querySelector(".alert-success");
    if (!alertEl) {
      const header = document.querySelector(".login-header");
      if (header) {
        const successDiv = document.createElement("div");
        successDiv.className = "alert alert-success";
        successDiv.setAttribute("role", "alert");
        successDiv.textContent = "Akun berhasil dibuat. Silakan login menggunakan akun Anda.";
        header.insertAdjacentElement("afterend", successDiv);
      }
    }
  }
})();