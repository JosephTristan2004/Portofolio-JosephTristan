# Portofolio Joseph Tristan

Source code yang bisa kamu edit sendiri: React + TypeScript/TSX + Tailwind CSS + Vite. Server komunitas menggunakan Node.js dan SQLite. Animasi dan tampilan mengikuti website yang dibuat sebelumnya.

## 1. Menjalankan di laptop

Prasyarat: Node.js **22.13 atau lebih baru**, npm, dan editor seperti VS Code. Skrip pengembangan menggunakan Node.js sehingga tidak membutuhkan Bash.

1. Ekstrak ZIP ini.
2. Buka folder `joseph-tristan-portfolio` di VS Code.
3. Pilih **Terminal → New Terminal**. Pastikan terminal berada di folder yang berisi `package.json`.
4. Jalankan:

```bash
npm install
npm run dev
```

5. Buka **http://127.0.0.1:5173** di browser.

`npm run dev` menjalankan frontend React dan server komunitas sekaligus. Perubahan komponen React tampil otomatis; perubahan pada server memicu restart server. Hentikan keduanya dengan **Ctrl+C**.

Server chat memakai port `3001`. Frontend memakai port `5173`. Jika ada aplikasi lain yang memakai port tersebut, hentikan aplikasi itu atau ubah pengaturan port di `vite.config.ts` dan `scripts/dev.mjs`.

## 2. Peta file untuk kustomisasi

| Yang ingin diubah | File |
| --- | --- |
| Nama, lokasi, judul hero, kontak, CV, foto, dan proyek | `src/lib/profile.ts` |
| Isi bagian About, pendidikan, pengalaman, skill, navigasi, footer | `src/App.tsx` |
| Warna, jarak, font, ukuran, responsivitas, animasi CSS | `src/styles.css` |
| Loading terminal, teks scramble, gerakan foto 3D, coding background | `src/components/motion.tsx` |
| Pertanyaan Bug Hunt dan kartu Memory Match | `src/components/playground.tsx` |
| Tampilan chat dan ruang komunitas | `src/components/community.tsx` |
| Validasi pesan dan daftar ruang komunitas | `src/lib/community.ts` |
| API chat, pembatasan pengiriman, cookie tamu | `server/community.ts` |
| Koneksi database lokal | `server/db.ts` |
| Struktur tabel database | `server/schema.sql` |
| Judul tab browser dan deskripsi mesin pencari | `index.html` |
| Foto, CV PDF, favicon, aset statis lain | `public/` |

Komponen yang bisa dipakai ulang, seperti dialog dan tab, berada di `src/components/ui/`. Kamu dapat mengubah tampilannya di `src/styles.css` atau melalui properti `className`.

## 3. Isi email, WhatsApp, dan media sosial

Buka **`src/lib/profile.ts`**. Ganti `null` pada field kontak dengan nilai milikmu. Contoh format berikut hanya ilustrasi:

```ts
email: "nama@domain.com",
whatsapp: "6281234567890",
linkedin: "https://www.linkedin.com/in/username-kamu/",
github: "https://github.com/username-kamu",
instagram: "https://www.instagram.com/username-kamu/",
cv: "/cv-joseph-tristan.pdf",
```

- WhatsApp memakai kode negara `62`, bukan awalan `08`.
- URL media sosial harus berupa tautan lengkap akunmu.
- Setelah field terisi, tombol menggunakan nilai tersebut.
- Jika sebuah field tetap `null`, tombol menjelaskan bahwa kontak atau CV belum tersedia.

PDF CV tidak tersedia pada lampiran sebelumnya. Karena itu source ini tidak mengarang email, nomor WA, akun sosial, atau isi CV.

## 4. Menambahkan CV agar bisa diunduh

1. Salin PDF CV asli ke folder **`public/`**.
2. Beri nama, misalnya **`cv-joseph-tristan.pdf`**.
3. Pada `src/lib/profile.ts`, ubah:

```ts
cv: "/cv-joseph-tristan.pdf",
```

4. Simpan dan klik **Download CV** di website.

File yang kamu letakkan di `public/` ditujukan untuk pengunjung website. Masukkan hanya dokumen dan aset yang memang ingin kamu tampilkan.

## 5. Mengganti foto tanpa kehilangan efek 3D

Foto saat ini ditampilkan dari gambar referensi yang kamu lampirkan, menggunakan crop CSS. Untuk menggantinya dengan foto asli:

1. Salin foto ke **`public/foto-saya.jpg`**.
2. Ubah bagian berikut di `src/lib/profile.ts`:

```ts
photo: "/foto-saya.jpg",
photoMode: "photo" as "reference" | "photo",
photoPosition: "center 35%",
```

`photoMode: "photo"` menampilkan foto biasa dengan `object-fit: cover`; efek tilt, scan, dan putaran 3D tetap berlaku. Ubah `photoPosition`, misalnya menjadi `"center 20%"`, jika posisi wajah terlalu tinggi atau rendah.

## 6. Mengubah warna, teks, dan animasi

Warna utama ada di `src/styles.css`: cari `--cyan`, `--primary`, `--background`, dan `--ink`. Default cyan adalah `#00d9ed`; beberapa garis dan cahaya memakai nilai warna langsung. Gunakan pencarian editor untuk `#00d9ed` saat mengganti seluruh aksen, termasuk versi transparannya.

Judul hero dan deskripsinya bisa diganti di `src/lib/profile.ts`:

```ts
headline: ["DATA", "MEETS", "QUALITY."],
heroDescription: "Tulis deskripsi singkat tentang dirimu di sini.",
```

Bagian narasi lain dapat diedit langsung di `src/App.tsx`. Daftar `projects` berada di `src/lib/profile.ts`; ubah judul, ringkasan, kontribusi, dan tools tanpa mengubah komponen dialog.

- Durasi loading pembuka: `BootScreen` di `src/components/motion.tsx`.
- Kecepatan putaran foto: `@keyframes portrait-spin` dan `.portrait-spinning` di CSS.
- Gerakan mengikuti kursor: fungsi `move` di komponen `Portrait`.
- Gerakan teks berjalan: `.ticker-track` dan `@keyframes marquee`.
- Animasi masuk saat scroll: komponen `Reveal` dan kelas `.reveal`.
- Animasi menghormati preferensi reduced motion sistem dan kontrol di footer.

Loading tampil sekali per sesi tab. Untuk mencobanya lagi, buka tab/sesi baru atau jalankan ini di Console browser lalu refresh:

```js
sessionStorage.removeItem("jt-booted");
```

## 7. Cara kerja komunitas

React memanggil API `/api/community`. Pada mode pengembangan, Vite meneruskan permintaan ini ke server Node.js. Server menyimpan pesan di **`data/community.sqlite`**, yang dibuat otomatis ketika server pertama kali dijalankan.

- Tiga ruang: lobby, data-and-code, dan showcase.
- Menampilkan 60 pesan terbaru per ruang dan memperbaruinya setiap 5 detik ketika area komunitas terlihat.
- Mendukung teks dan tautan HTTP/HTTPS.
- Nama pengirim adalah nama tamu yang belum diverifikasi.
- Validasi di server, query terparameterisasi, idempotency, serta jeda dan batas pesan per sesi tamu.
- Batas tamu ini sederhana; bukan pengganti login atau moderasi akun.

Pesan yang dibuat melalui salinan kode ini tersimpan di database salinan tersebut. Riwayat chat website sebelumnya tidak dimasukkan ke ZIP.

Jika server hanya dijalankan di laptop, hanya pengunjung yang terhubung ke server laptop itu yang berbagi database yang sama. Untuk chat antar pengunjung di internet, jalankan server ini pada hosting Node.js dengan disk persisten. Folder `dist/` saja hanya memuat frontend dan tidak menjalankan API chat.

## 8. Build dan menjalankan hasilnya

```bash
npm run build
npm start
```

Buka **http://127.0.0.1:3001**. Dalam mode ini server yang sama melayani hasil build frontend dan API komunitas.

Variabel lingkungan opsional untuk server:

| Variabel | Default | Kegunaan |
| --- | --- | --- |
| `PORT` | `3001` | Port server Node.js |
| `HOST` | `127.0.0.1` | Alamat listen; hosting biasanya membutuhkan `0.0.0.0` |
| `DATA_DIR` | `data` | Direktori penyimpanan SQLite |
| `PUBLIC_ORIGIN` | Origin HTTP permintaan | Origin HTTPS yang benar ketika ditempatkan di balik reverse proxy |

Contoh PowerShell, dari folder proyek:

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "3001"
$env:PUBLIC_ORIGIN = "https://domain-kamu.com"
npm start
```

Isi `PUBLIC_ORIGIN` dengan domain yang benar-benar dipakai. Untuk pengembangan lokal biasa, cukup `npm run dev` tanpa mengatur variabel ini.

## 9. Pemeriksaan kode

```bash
npm run typecheck
npm run build
```

Source export diperiksa dengan TypeScript dan build Vite di Linux, serta API SQLite lokal. Skrip dibuat tanpa ketergantungan Bash; belum diuji langsung pada komputer Windows milikmu.

Jika terminal PowerShell membatasi `npm.ps1`, jalankan perintah yang sama menggunakan `npm.cmd`, misalnya `npm.cmd install` dan `npm.cmd run dev`.

ZIP berisi source dan aset, tidak menyertakan `node_modules/`, `dist/`, database pesan, kredensial, atau konfigurasi deployment akun.
