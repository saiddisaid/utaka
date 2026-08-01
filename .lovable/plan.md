## Tujuan

Menambahkan **Main Online** — beberapa pemain di perangkat berbeda bermain UTAKA bersama secara real-time — tanpa menghapus mode **Main Lokal** yang sudah ada.

## Alur pemain

```text
/bermain  →  [ Main Lokal ]  [ Main Online ]
                                  |
                    +-------------+-------------+
                    |                           |
              Buat Room                    Gabung Room
            (dapat kode ABC123          (isi kode / buka
             + link undangan)            link undangan)
                    |                           |
                    +------------ Lobi ---------+
                       (daftar pemain, warna bidak,
                        status online, host mulai)
                                  |
                        Papan bersama real-time
                (dadu, bidak, kartu + narasi, chat, log)
                                  |
                          Selesai → Refleksi bersama
```

## Yang akan dibangun

**Backend (Lovable Cloud)** — dibutuhkan untuk menyimpan room dan menyiarkan pergerakan secara real-time.

Tabel:
- `rooms` — kode room unik, host, status (lobi/bermain/selesai), giliran aktif, nilai dadu terakhir, kartu yang sedang tampil, waktu mulai.
- `room_players` — nama, warna bidak, posisi bidak, jumlah kartu, urutan giliran, `last_seen` (untuk status online/offline), `user_id` opsional bila login.
- `room_events` — log permainan (lempar dadu, naik tangga, turun ular, kartu) agar riwayat tersimpan dan bisa dibaca ulang.
- `room_messages` — chat teks.
- `room_reflections` — refleksi tiap pemain di akhir permainan, tersimpan per room.

Semua tabel memakai Realtime agar perubahan langsung tampil di semua perangkat. Akses ditulis lewat server function yang memvalidasi aturan main (hanya pemain yang sedang giliran boleh melempar dadu), sehingga permainan tidak bisa dicurangi dari browser.

**Login opsional**
- Default: masuk sebagai tamu (isi nama + warna), identitas tamu disimpan di perangkat.
- Tersedia login email/password + Google; bila login, riwayat permainan & refleksi terikat ke akun.

**Halaman & komponen baru**
- `/bermain` diubah jadi pemilihan mode (Lokal / Online).
- `/main/$kode` — lobi + papan online. Tautan undangan mengarah ke sini, tinggal isi nama.
- Panel chat teks di samping papan (mobile: tab).
- Indikator titik hijau/abu status koneksi tiap pemain, host bisa mengeluarkan pemain yang keluar.
- Tombol salin kode & salin link undangan.

**Aturan permainan online**
- Hanya pemain yang sedang giliran melihat tombol lempar dadu; pemain lain melihat "Menunggu <nama>…".
- Animasi dadu, langkah bidak, kartu, dan narasi suara tetap sama dan disinkronkan ke semua pemain (semua melihat kartu yang sama).
- Aturan yang sudah ada tetap berlaku: giliran baru berlanjut setelah narasi kartu selesai dibacakan.
- Bila pemain terputus, gilirannya bisa dilewati oleh host agar permainan tidak macet.
- Refleksi akhir: tiap pemain mengisi di perangkatnya, hasil terkumpul per room.

## Catatan teknis

- Logika papan (`src/lib/board.ts`), kartu, dadu 3D, bidak, SFX, dan narasi TTS dipakai ulang — hanya sumber state yang berpindah dari `useState`/localStorage ke state room di server.
- Mesin permainan dipisah ke modul bersama agar mode lokal dan online memakai aturan yang identik.
- Aksi permainan lewat `createServerFn` (undian dadu dilakukan di server), penyiaran perubahan lewat Supabase Realtime.
- Mode lokal tetap seperti sekarang, termasuk simpan progres di perangkat.

## Urutan pengerjaan

1. Aktifkan Lovable Cloud + buat tabel, kebijakan akses, dan Realtime.
2. Pisahkan mesin permainan jadi modul bersama; mode lokal tetap jalan.
3. Server function: buat room, gabung, mulai, lempar dadu, tutup kartu, akhiri giliran, kirim chat, heartbeat.
4. Halaman lobi + papan online dengan sinkronisasi real-time.
5. Chat, status koneksi, dan riwayat/refleksi per room.
6. Login opsional (email + Google) yang menautkan tamu ke akun.
7. Uji dua pemain berbarengan di browser untuk memastikan giliran, kartu, dan narasi sinkron.
