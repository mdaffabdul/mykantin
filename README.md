# MyKantin 🍽️ - Aplikasi Kantin Kampus

**MyKantin** adalah aplikasi mobile berbasis **React Native** dan **Expo** yang dirancang untuk mempermudah pemesanan makanan dan minuman di kantin kampus. Aplikasi ini memiliki fitur lengkap mulai dari autentikasi akun, kustomisasi pesanan, manajemen keranjang, hingga riwayat transaksi dan poin loyalitas mahasiswa.

---

## 🌟 Fitur Utama

1. **Autentikasi Akun (Login)**
   * Autentikasi menggunakan integrasi API eksternal (`FakeStoreAPI`).
   * Tombol *pre-fill* cepat dengan Akun Demo untuk kemudahan uji coba.
2. **Menu Makanan & Minuman**
   * Grid daftar menu interaktif yang menampilkan gambar hidangan, nama, kategori, rating, dan harga.
3. **Kustomisasi Pesanan (Detail Customize Sheet)**
   * Lembar detail makanan menggunakan modal interaktif.
   * Kustomisasi **Tingkat Kepedasan** (Biasa, Sedang, Pedas).
   * Kustomisasi **Topping Tambahan** (Keju cheddar cair, Telur setengah matang, Alpukat iris, Bawang putih goreng) yang secara otomatis menambahkan biaya pesanan.
   * Kolom **Catatan/Alergi** khusus untuk penjual.
4. **Keranjang Belanja (Cart Management)**
   * Penyesuaian kuantitas item (+/-) secara langsung di keranjang.
   * Penghapusan item dari keranjang.
   * Menampilkan saldo mahasiswa saat ini untuk memastikan saldo mencukupi sebelum memesan.
5. **Checkout & Pembayaran Mandiri**
   * Proses kalkulasi total pembayaran secara real-time.
   * Validasi saldo: Pesanan ditolak jika saldo tidak cukup.
   * Hadiah poin loyalitas otomatis berdasarkan total belanja setelah pesanan sukses.
6. **Riwayat Pesanan (Order History)**
   * Riwayat transaksi terperinci mencakup kode order unik, tanggal & waktu pemesanan, daftar item beserta detail topping/catatan, total pembayaran, dan status pesanan.
7. **Profil Mahasiswa (Profile)**
   * Menampilkan avatar inisial, nama lengkap mahasiswa, email, tipe keanggotaan (Premium/Reguler).
   * Menampilkan saldo uang elektronik saat ini dan total poin loyalitas terkumpul.

---

## 🛠️ Tech Stack & Konfigurasi

* **Framework Utama**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 54)
* **Navigasi**: [Expo Router](https://docs.expo.dev/router/introduction) (Tab dan Stack Navigation berbasis berkas)
* **Bahasa Pemrograman**: **JavaScript / JSX**
* **Manajemen State**: React Context API (`AppContext.jsx` untuk menyimpan data user, keranjang, dan riwayat pesanan secara global)
* **Ikon**: `@expo/vector-icons` (menggunakan pustaka `Ionicons` untuk antarmuka yang bersih dan modern)
* **Keamanan/Sistem Styling**: Menggunakan Vanilla React Native `StyleSheet` yang responsif.

---

## 📂 Struktur Folder Proyek

```text
mykantin/
├── app/                  # Folder navigasi & layar (Expo Router)
│   ├── (tabs)/           # Halaman utama dengan navigasi tab
│   │   ├── index.jsx     # Layar utama (Daftar Menu)
│   │   ├── cart.jsx      # Layar Keranjang Belanja
│   │   ├── history.jsx   # Layar Riwayat Transaksi
│   │   └── profile.jsx   # Layar Profil Mahasiswa
│   ├── _layout.jsx       # Root layout untuk pembungkus Context & Navigation
│   └── login.jsx         # Layar Login Akun
├── components/           # Komponen modular reusable
│   ├── molecules/
│   │   └── CartItemRow.jsx # Baris item di dalam keranjang belanja
│   └── organism/
│       ├── DetailSheet.jsx # Modal kustomisasi detail menu
│       └── navigationFooter.jsx # Bottom navigation bar custom
├── constants/            # Data statis & tema warna
│   ├── menu.js           # Daftar menu makanan & minuman
│   └── theme.js          # Palet warna aplikasi
├── context/
│   └── AppContext.jsx    # Global State Provider (user, cart, checkout, history)
├── hooks/                # Custom hooks (theme & color scheme)
└── package.json          # Konfigurasi dependensi npm
```

---

## 🚀 Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

### 2. Instal Dependensi
Buka terminal/command prompt di direktori root proyek ini, kemudian jalankan perintah:
```bash
npm install
```

### 3. Jalankan Server Expo
Setelah instalasi selesai, jalankan perintah untuk memulai server pengembangan Expo Metro:
```bash
npx expo start
```

### 4. Buka Aplikasi
Setelah server menyala, Anda dapat membuka aplikasi melalui beberapa cara yang tercantum di terminal:
* Pindai kode QR menggunakan aplikasi **Expo Go** di Android atau iOS.
* Tekan tombol `a` untuk membuka Emulator Android.
* Tekan tombol `i` untuk membuka Simulator iOS.
* Tekan tombol `w` untuk menjalankannya di Web Browser.

---

## 🔑 Akun Demo Pengujian

Untuk mempermudah pengujian, gunakan akun demo siap pakai berikut di halaman Login:

* **Tipe Member**: Mahasiswa Premium
* **Username**: `mor_2314`
* **Password**: `83r5^_`
* **Saldo Awal**: Rp 500.000
* **Poin Awal**: 350 Poin
