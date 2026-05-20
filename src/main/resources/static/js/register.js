// ====== REGISTER.JS (Hanya Fitur Mata & Validasi Confirm Password) ======

const inputPassword = document.getElementById("password");
const inputConfirmPassword = document.getElementById("confirmPassword");

// ====== 1. TOGGLE SHOW/HIDE PASSWORD ======
// Fungsi generik untuk dipakai di tombol mata password maupun confirm password
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

// ====== 2. INDIKATOR KONFIRMASI PASSWORD ======
// Menampilkan ikon centang/silang secara real-time saat user mengetik
function updateConfirmPasswordMatch() {
  const passwordVal = inputPassword ? inputPassword.value : "";
  const confirmVal = inputConfirmPassword ? inputConfirmPassword.value : "";

  const confirmWrapper = inputConfirmPassword
    ? inputConfirmPassword.closest(".input-wrapper")
    : null;
  if (!confirmWrapper) return;

  let matchIcon = confirmWrapper.querySelector(".match-indicator");

  // Inisialisasi lazy elemen SVG jika belum ada di HTML
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

    // Sisipkan sebelum tombol mata agar posisinya pas
    const toggleBtn = confirmWrapper.querySelector(".btn-toggle-password");
    confirmWrapper.insertBefore(matchIcon, toggleBtn);
  }

  if (!confirmVal) {
    matchIcon.classList.remove("visible", "match-ok", "match-fail");
    matchIcon.innerHTML = "";
    return;
  }

  if (confirmVal === passwordVal) {
    // Cocok: Centang Hijau
    matchIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    matchIcon.classList.add("visible", "match-ok");
    matchIcon.classList.remove("match-fail");
  } else {
    // Tidak Cocok: Silang Merah
    matchIcon.innerHTML =
      '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
    matchIcon.classList.add("visible", "match-fail");
    matchIcon.classList.remove("match-ok");
  }
}

// ====== 3. EVENT LISTENERS ======
// Menjalankan pencocokan password secara real-time saat ada perubahan input
if (inputPassword) {
  inputPassword.addEventListener("input", updateConfirmPasswordMatch);
}

if (inputConfirmPassword) {
  inputConfirmPassword.addEventListener("input", updateConfirmPasswordMatch);
}
