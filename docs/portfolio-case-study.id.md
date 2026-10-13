# Case Study: SIFARA

## Konteks

UPTD Instalasi Farmasi Daerah membutuhkan pengelolaan persediaan obat yang lebih terstruktur dan mudah ditinjau. Informasi produk, stok, batch, masa kedaluwarsa, dan nilai persediaan perlu tersedia dalam satu alur kerja yang dapat dipahami oleh pengguna operasional maupun administrasi.

SIFARA adalah **Sistem Informasi Farmasi Daerah** yang dikembangkan sebagai aplikasi pengelolaan persediaan untuk konteks tersebut.

## Masalah yang Ditangani

- Data persediaan perlu ditelusuri dari katalog sampai pergerakan stoknya.
- Batch dan tanggal kedaluwarsa perlu terlihat saat mengambil keputusan operasional.
- Nilai persediaan perlu diringkas dengan cara yang mudah ditinjau.
- Antarmuka perlu membantu pengguna menyelesaikan pekerjaan rutin tanpa menambah kerumitan administrasi.

## Pendekatan Produk

SIFARA mengelompokkan alur kerja ke dalam katalog obat, transaksi persediaan, pemantauan batch, dan laporan nilai stok. Tampilan dashboard digunakan sebagai ringkasan awal, sementara halaman operasional menyediakan konteks yang lebih detail sesuai kebutuhan pengguna.

Desain mengutamakan keterbacaan data, status yang konsisten, dan tindakan yang jelas. Data pada screenshot portofolio ini adalah data demo fiktif; tidak ada data pasien, data produksi, atau informasi pihak ketiga yang dipublikasikan.

## Pendekatan Engineering

- Laravel menangani fondasi aplikasi dan aturan bisnis.
- Vue digunakan untuk antarmuka yang responsif terhadap alur kerja pengguna.
- PostgreSQL menyimpan data transaksional dan relasi persediaan.
- Pengembangan memperhatikan validasi input, otorisasi berbasis peran, serta jejak perubahan untuk kebutuhan akuntabilitas.

Diagram [arsitektur konseptual](architecture.id.md) menjelaskan batas komponen pada tingkat portofolio, tanpa membuka konfigurasi atau akses lingkungan.

## Batasan Publikasi

Materi ini dibuat untuk memperlihatkan kualitas produk tanpa source code, konfigurasi, database, kredensial, atau tautan lingkungan aktif. Permintaan demonstrasi dan pembahasan teknis dilakukan secara privat melalui email pengembang yang tercantum di README.
