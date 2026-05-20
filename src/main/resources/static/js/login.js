// ====== LOGIN.JS (Hanya Fitur Mata / Toggle Password Visibility) ======

// ====== 1. SELEKSI ELEMEN ======
const inputPassword = document.getElementById("password");

// ====== 2. TOGGLE SHOW/HIDE PASSWORD ======
function togglePasswordVisibility() {
  const iconEye = document.getElementById("iconEye");
  const iconEyeOff = document.getElementById("iconEyeOff");
  const toggleBtn = document.getElementById("togglePassword");

  if (!inputPassword) return;

  if (inputPassword.type === "password") {
    inputPassword.type = "text";
    if (iconEye) iconEye.style.display = "none";
    if (iconEyeOff) iconEyeOff.style.display = "block";
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Sembunyikan password");
  } else {
    inputPassword.type = "password";
    if (iconEye) iconEye.style.display = "block";
    if (iconEyeOff) iconEyeOff.style.display = "none";
    if (toggleBtn) toggleBtn.setAttribute("aria-label", "Tampilkan password");
  }
}
