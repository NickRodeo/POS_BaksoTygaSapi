// ====== 1. AMBIL DATA DARI LOCALSTORAGE SAAT HALAMAN DI-REFRESH ======
let keranjangBelanja = JSON.parse(localStorage.getItem("bakso_cart")) || [];

// Panggil fungsi ini sekali saat file JS pertama kali dimuat agar data lama langsung muncul
perbaruiTampilanKeranjang();

// ====== 2. FUNGSI UTAMA UNTUK SAVE DATA KE LOCALSTORAGE ======
function simpanKeLocalStorage() {
  localStorage.setItem("bakso_cart", JSON.stringify(keranjangBelanja));
}

// ====== 3. FUNGSI TAMBAH MENU ======
function tambahKeKeranjang(nama, harga) {
  const itemDitemukan = keranjangBelanja.find((item) => item.nama === nama);

  if (itemDitemukan) {
    itemDitemukan.quantity += 1;
  } else {
    keranjangBelanja.push({
      nama: nama,
      harga: harga,
      quantity: 1,
    });
  }

  simpanKeLocalStorage();
  perbaruiTampilanKeranjang();
}

// ====== 4. FUNGSI KURANGI QUANTITY ======
function kurangiDariKeranjang(nama) {
  const itemDitemukan = keranjangBelanja.find((item) => item.nama === nama);

  if (itemDitemukan) {
    if (itemDitemukan.quantity > 1) {
      itemDitemukan.quantity -= 1;
    } else {
      hapusDariKeranjang(nama);
      return;
    }
  }
  simpanKeLocalStorage();
  perbaruiTampilanKeranjang();
}

// ====== 5. FUNGSI HAPUS TOTAL SATU MENU ======
function hapusDariKeranjang(nama) {
  keranjangBelanja = keranjangBelanja.filter((item) => item.nama !== nama);
  simpanKeLocalStorage();
  perbaruiTampilanKeranjang();
}

// ====== 6. FUNGSI RENDER TAMPILAN (DOM) ======
function perbaruiTampilanKeranjang() {
  const cartSection = document.getElementById("cartSection");
  const cartItemsContainer = document.getElementById("cartItems");

  if (keranjangBelanja.length === 0) {
    cartSection.classList.add("hidden");
    return;
  }

  cartSection.classList.remove("hidden");
  cartItemsContainer.innerHTML = "";

  let kalkulasiTotal = 0;

  keranjangBelanja.forEach((item) => {
    const subtotalItem = item.harga * item.quantity;
    kalkulasiTotal += subtotalItem;

    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");

    itemElement.innerHTML = `
            <div class="item-desc">
                <h4>${item.nama}</h4>
                <p class="item-base-price">${formatRupiah(item.harga)}</p>
            </div>
            <div class="cart-item-right">
                <div class="qty-counter-capsule">
                    <button class="btn-qty" onclick="kurangiDariKeranjang('${
                      item.nama
                    }')">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="btn-qty" onclick="tambahKeKeranjang('${
                      item.nama
                    }', ${item.harga})">+</button>
                </div>
                <div class="item-subtotal">${formatRupiah(subtotalItem)}</div>
                <button class="btn-hapus-item" onclick="hapusDariKeranjang('${
                  item.nama
                }')">&times;</button>
            </div>
        `;
    cartItemsContainer.appendChild(itemElement);
  });

  document.getElementById("subtotalPrice").innerText =
    formatRupiah(kalkulasiTotal);
  document.getElementById("totalPrice").innerText =
    formatRupiah(kalkulasiTotal);
}

function filterMenu() {
  const kataKunci = document
    .getElementById("searchMenuInput")
    .value.toLowerCase();
  const semuaMenuCard = document.querySelectorAll(".menu-grid .menu-card");

  semuaMenuCard.forEach((card) => {
    const judulMenuElement = card.querySelector(".menu-title");
    if (judulMenuElement) {
      const namaMenu = judulMenuElement.innerText.toLowerCase();
      if (namaMenu.includes(kataKunci)) {
        card.classList.remove("hidden-menu");
      } else {
        card.classList.add("hidden-menu");
      }
    }
  });
}

// ====== 7. FUNGSI BATAL SEMUA ======
function batalSemuaPesanan() {
  keranjangBelanja = [];
  localStorage.removeItem("bakso_cart");
  perbaruiTampilanKeranjang();
  document.getElementById("cartSection").classList.add("hidden");
}

// ====== 8. FUNGSI PROSES BAYAR (TEMA & INTERKONEKSI TOAST) ======
function prosesPembayaran() {
  const kirimNotif = (pesan, tipe) => {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${tipe}`;
    toast.innerText = pesan;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  };

  if (keranjangBelanja.length === 0) {
    kirimNotif("Keranjang masih kosong!", "error");
    return;
  }

  const totalBayar = keranjangBelanja.reduce(
    (sum, item) => sum + item.harga * item.quantity,
    0
  );

  const modal = document.getElementById("modalBayar");
  const modalTotal = document.getElementById("modalTotalTagihan");
  const inputTunai = document.getElementById("inputUangTunai");
  const modalKembali = document.getElementById("modalKembalian");

  if (modal && modalTotal && inputTunai && modalKembali) {
    modalTotal.innerText = formatRupiah(totalBayar);
    inputTunai.value = "";
    modalKembali.innerText = "Rp 0";
    modalKembali.className = "text-success";

    modal.setAttribute("data-total", totalBayar);
    modal.classList.remove("hidden");

    setTimeout(() => {
      inputTunai.focus();
    }, 100);
  } else {
    kirimNotif("Elemen komponen HTML modal tidak utuh!", "error");
  }
}

function tutupModalBayar() {
  document.getElementById("modalBayar").classList.add("hidden");
}

function hitungKembalianOtomatis() {
  const modal = document.getElementById("modalBayar");
  const totalBayar = parseFloat(modal.getAttribute("data-total")) || 0;
  const inputTunai =
    parseFloat(document.getElementById("inputUangTunai").value) || 0;
  const targetKembalian = document.getElementById("modalKembalian");

  const kembalian = inputTunai - totalBayar;

  if (kembalian < 0) {
    targetKembalian.innerText =
      "Uang Kurang: " + formatRupiah(Math.abs(kembalian));
    targetKembalian.className = "";
    targetKembalian.style.color = "#b30000"; // Menyesuaikan warna eror merah khas warung
  } else {
    targetKembalian.innerText = formatRupiah(kembalian);
    targetKembalian.style.color = "";
    targetKembalian.className = "text-success";
  }
}

function eksekusiPembayaranKeServer() {
  const modal = document.getElementById("modalBayar");
  const totalBayar = parseFloat(modal.getAttribute("data-total")) || 0;
  const inputTunai =
    parseFloat(document.getElementById("inputUangTunai").value) || 0;

  const kirimNotif = (pesan, tipe) => {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${tipe}`;
    toast.innerText = pesan;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  };

  if (isNaN(inputTunai) || inputTunai < totalBayar) {
    kirimNotif("Pembayaran Gagal! Uang tunai kurang.", "error");
    return;
  }

  const kembalian = inputTunai - totalBayar;

  const payloadTransaksi = {
    subtotal: totalBayar,
    totalBayar: totalBayar,
    tunai: inputTunai,
    kembali: kembalian,
    items: keranjangBelanja.map((item) => ({
      namaMenu: item.nama,
      qty: item.quantity,
      hargaSatuan: item.harga,
      subtotalItem: item.harga * item.quantity,
    })),
  };

  const csrfToken = document
    .querySelector("meta[name='_csrf']")
    ?.getAttribute("content");
  const csrfHeader = document
    .querySelector("meta[name='_csrf_header']")
    ?.getAttribute("content");

  const headers = { "Content-Type": "application/json" };
  if (csrfToken && csrfHeader) {
    headers[csrfHeader] = csrfToken;
  }

  const btnKonfirmasi = document.getElementById("btnKonfirmasiBayar");
  if (btnKonfirmasi) {
    btnKonfirmasi.disabled = true;
    btnKonfirmasi.innerText = "Memproses...";
  }

  fetch("/transaksi/bayar", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payloadTransaksi),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(
            `Server Error (${response.status}): ${
              text || "Gagal merespon server."
            }`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        kirimNotif("Transaksi Berhasil disimpan!", "success");

        keranjangBelanja = [];
        localStorage.removeItem("bakso_cart");
        perbaruiTampilanKeranjang();
        tutupModalBayar();

        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1200);
      } else {
        kirimNotif("Gagal: " + data.message, "error");
        if (btnKonfirmasi) {
          btnKonfirmasi.disabled = false;
          btnKonfirmasi.innerText = "Konfirmasi & Cetak";
        }
      }
    })
    .catch((error) => {
      console.error("Detail Error:", error);
      kirimNotif(error.message, "error");
      if (btnKonfirmasi) {
        btnKonfirmasi.disabled = false;
        btnKonfirmasi.innerText = "Konfirmasi & Cetak";
      }
    });
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}
