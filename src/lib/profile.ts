// EDIT DI SINI: nama, kontak, foto, CV, dan daftar proyek.
// Isi null dengan string milikmu. Jangan gunakan data contoh sebagai kontak asli.
export const profile = {
    name: "Joseph Ananda Tristan",
    shortName: "Joseph Tristan",
    location: "Tangerang Selatan, ID",
    year: 2026,
    headline: ["DATA", "MEETS", "QUALITY."],
    heroDescription: "Mahasiswa Sistem Informasi yang menghubungkan data, kode, dan quality assurance untuk membangun pengalaman digital yang lebih baik.",
    photo: "/portrait-reference.png",
    // Ganti ke "photo" ketika menggunakan foto asli milikmu.
    photoMode: "reference" as "reference" | "photo",
    photoPosition: "center 35%",
    email: "josephtristan221@gmail.com" as string | null,
    whatsapp: "6285173294727" as string | null,
    linkedin: "https://www.linkedin.com/in/joseph-tristan-41020128a/" as string | null,
    github: null as string | null,
    instagram: "https://www.instagram.com/josephtristan04._/" as string | null,
    cv: "/cv-joseph-tristan.pdf" as string | null,
};
export const projects = [
    {
        id: "01", category: "Quality Assurance", title: "Quality, before go-live.", name: "Telkomsigma · Application testing", kind: "qa", tags: ["UAT", "Regression testing", "Test scenarios"],
        summary: "Memvalidasi alur aplikasi internal melalui pengujian, pelaporan defect, dan retesting bersama tim pengembang.",
        description: "Pengalaman Quality Assurance di Divisi Corporate Information System, PT Sigma Cipta Caraka (Telkomsigma). Fokus pada pemahaman kebutuhan bisnis, penyusunan skenario positif dan negatif, serta validasi perilaku aplikasi.",
        contributions: ["Menyusun test scenario dan test case berdasarkan kebutuhan bisnis.", "Menjalankan UAT, regression testing, dan retesting pada aplikasi internal.", "Mendokumentasikan defect, evidence pengujian, serta berkoordinasi dengan System Analyst dan developer."],
        tools: "Excel · Google Sheets · Dokumentasi pengujian", scope: "Pengalaman magang · 2026",
    },
    {
        id: "02", category: "Data & Analytics", title: "From rows to reasons.", name: "Roemah Mobil · Data warehouse", kind: "data", tags: ["SQL", "ETL", "Business Intelligence"],
        summary: "Mengolah data penjualan menjadi struktur analitis melalui star schema dan proses ETL.",
        description: "Proyek akademik data warehouse dan business intelligence untuk studi kasus Roemah Mobil. Menghubungkan data transaksi dengan dimensi yang mendukung analisis bisnis.",
        contributions: ["Merancang star schema dengan fact_sale dan tabel dimensi.", "Menyiapkan alur extract, transform, load menggunakan Pentaho Data Integration.", "Mengorganisasi data pelanggan, produk, pesanan, dan unit untuk kebutuhan analisis."],
        tools: "SQL · Pentaho Data Integration · Data modeling", scope: "Proyek akademik",
    },
    {
        id: "03", category: "Web Development", title: "An idea. A working store.", name: "Stepy · E-commerce website", kind: "web", tags: ["PHP", "MySQL", "Role-based access"],
        summary: "Aplikasi toko online dengan katalog produk, keranjang belanja, checkout, dan pengelolaan oleh staf.",
        description: "Proyek pengembangan aplikasi web Stepy, sebuah toko sepatu dengan peran customer dan employee. Alur mencakup registrasi, pengelolaan produk, pemesanan, dan checkout.",
        contributions: ["Membangun alur login dan registrasi berdasarkan peran pengguna.", "Mengembangkan pengelolaan produk, stok, serta pesanan.", "Menghubungkan katalog, pencarian, keranjang, dan checkout dengan database MySQL."],
        tools: "HTML · CSS · JavaScript · PHP · MySQL", scope: "Proyek akademik",
    },
    {
        id: "04", category: "Machine Learning", title: "Patterns behind loyalty.", name: "Customer retention · Research", kind: "ml", tags: ["Python", "LSTM", "CRISP-DM"],
        summary: "Riset prediksi retensi pelanggan e-commerce Generasi Z melalui data perilaku dan pemodelan sekuensial.",
        description: "Topik penelitian: Analisis Retensi Pelanggan E-Commerce untuk Generasi Z Berbasis Big Data Menggunakan Model Long Short-Term Memory (LSTM). Fokus pada hubungan perilaku pengguna dari waktu ke waktu dengan retensi.",
        contributions: ["Merancang alur penelitian berbasis CRISP-DM.", "Menyiapkan rancangan fitur perilaku dan pembentukan sequence untuk LSTM.", "Merencanakan evaluasi menggunakan precision, recall, F1-score, dan confusion matrix."],
        tools: "Python · Machine learning · LSTM · Preprocessing", scope: "Rancangan penelitian · Hasil evaluasi belum dipublikasikan",
    },
] as const;
