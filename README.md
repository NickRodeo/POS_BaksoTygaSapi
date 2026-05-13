# POS Bakso Mantap

Aplikasi kasir sederhana berbasis web menggunakan Java dan Spring Boot.

## Cara Menjalankan

Buka terminal di folder project lalu jalankan:

```bash
./mvnw spring-boot:run
```

Tunggu sampai logo `SPRING` muncul di terminal.  
Kalau sudah muncul, berarti server berhasil dijalankan dan web bisa diakses di:

```txt
http://localhost:8080
```

---

# Struktur Folder

## HTML

Folder:

```txt
src/main/resources/templates
```

Digunakan untuk menyimpan file HTML.

Contoh:

```txt
index.html
menu.html
transaksi.html
```

---

## CSS

Folder:

```txt
src/main/resources/static/css
```

Digunakan untuk menyimpan file CSS.

Disarankan nama CSS mengikuti nama halaman HTML.

Contoh:

| HTML       | CSS       |
| ---------- | --------- |
| index.html | index.css |
| menu.html  | menu.css  |

Cara memanggil CSS:

```html
<link rel="stylesheet" th:href="@{/css/namacss.css}" />
```

Letakkan di dalam tag `<head>`.

---

## JavaScript

Folder:

```txt
src/main/resources/static/js
```

Digunakan untuk menyimpan file JavaScript.

Disarankan nama JS mengikuti nama halaman HTML.

Contoh:

| HTML       | JS       |
| ---------- | -------- |
| index.html | index.js |
| menu.html  | menu.js  |

Cara memanggil JavaScript:

```html
<script th:src="@{/js/namajs.js}"></script>
```

Letakkan sebelum `</body>`.

---

## Backend / Controller

Folder:

```txt
src/main/java/com/example/demo
```

Digunakan untuk menyimpan controller dan logic backend.

Kalau pernah belajar MVC, bagian ini dipakai untuk mengatur alur aplikasi.

---

## Model

Folder:

```txt
src/main/java/com/example/demo/model
```

Digunakan untuk menyimpan object/model seperti:

```txt
Menu
Transaksi
User
Kategori
```

Model nantinya dipakai di controller untuk proses backend.

---

# Teknologi

- Java
- Spring Boot
- Thymeleaf
- HTML CSS JavaScript
- Maven

---

# Catatan

- Pisahkan CSS dan JS berdasarkan halaman supaya lebih rapi
- Usahakan nama file konsisten
- Jangan campur semua logic dalam satu controller
- Biasakan pakai struktur MVC
