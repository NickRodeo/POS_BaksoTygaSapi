// ====== 1. AMBIL DATA DARI LOCALSTORAGE SAAT HALAMAN DI-REFRESH ======
// Jika sebelumnya ada data yang tersimpan, pakai data itu. Jika tidak, pakai array kosong [].
let keranjangBelanja = JSON.parse(localStorage.getItem("bakso_cart")) || [];

// Panggil fungsi ini sekali saat file JS pertama kali dimuat agar data lama langsung muncul
perbaruiTampilanKeranjang();

// ====== 2. FUNGSI UTAMA UNTUK SAVE DATA KE LOCALSTORAGE ======
function simpanKeLocalStorage() {
  // Karena localStorage hanya bisa menyimpan teks (string), kita ubah array menjadi JSON string
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

  simpanKeLocalStorage(); // <-- Save setiap kali data bertambah
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
  simpanKeLocalStorage(); // <-- Save setiap kali data berkurang
  perbaruiTampilanKeranjang();
}

// ====== 5. FUNGSI HAPUS TOTAL SATU MENU ======
function hapusDariKeranjang(nama) {
  keranjangBelanja = keranjangBelanja.filter((item) => item.nama !== nama);
  simpanKeLocalStorage(); // <-- Save setiap kali data dihapus
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
  localStorage.removeItem("bakso_cart"); // <-- Hapus total dari storage browser
  perbaruiTampilanKeranjang();

  // Fallback manual jika fungsi penutup tidak ke-trigger
  document.getElementById("cartSection").classList.add("hidden");
}

// ====== 8. FUNGSI PROSES BAYAR ======
function prosesPembayaran() {
  alert(
    "Transaksi diproses! Total tagihan: " +
      document.getElementById("totalPrice").innerText
  );
  batalSemuaPesanan();
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}
