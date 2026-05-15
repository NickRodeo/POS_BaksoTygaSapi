function tampilkanPreview(input) {
  const previewContainer = document.getElementById("previewContainer");
  const imagePreview = document.getElementById("imagePreview");

  // Cek apakah ada file yang dipilih oleh user
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    // Ketika file selesai dibaca oleh sistem browser
    reader.onload = function (e) {
      imagePreview.src = e.target.result; // Set source img ke file lokal tersebut
      previewContainer.style.display = "block"; // Tampilkan kotak container
    };

    reader.readAsDataURL(input.files[0]); // Proses membaca file gambar
  } else {
    // Jika user membatalkan pilihan file, sembunyikan kembali kotak preview
    imagePreview.src = "";
    previewContainer.style.display = "none";
  }
}
