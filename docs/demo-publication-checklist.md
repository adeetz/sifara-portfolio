# Checklist Publikasi Portofolio

Jalankan checklist ini setiap kali materi portofolio diperbarui.

## Konten

- [ ] Screenshot menggunakan data demo fiktif dan mode terang.
- [ ] Screenshot tidak memuat data pasien, data operasional, kredensial, token, cookie, atau alamat jaringan.
- [ ] Jangan sertakan source code, dump basis data, konfigurasi, file lingkungan, maupun kredensial.
- [ ] Jangan sertakan tautan demo aktif atau instruksi akses server.
- [ ] Semua klaim fitur dapat dibuktikan dari aplikasi atau dokumentasi internal.

## Pemeriksaan Teknis

- [ ] Jalankan `npm test`.
- [ ] Jalankan `npm run test:public-safety`.
- [ ] Jalankan `git diff --check`.
- [ ] Tinjau `git ls-files` sebelum push.

## Persetujuan

- [ ] Pemilik materi menyetujui isi, screenshot, dan batas publikasi.
- [ ] Repository publik dibuat atau diperbarui hanya setelah seluruh pemeriksaan selesai.
