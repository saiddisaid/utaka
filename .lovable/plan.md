## Kondisi saat ini

Narasi suara sudah aktif: setiap kartu yang muncul saat bermain dibacakan otomatis, dan tombol "Lanjut Bermain" terkunci sampai pembacaan selesai. Suaranya memakai model TTS OpenAI (`voice: alloy`) dengan instruksi berbahasa Indonesia — jadi teksnya memang dibaca dalam Bahasa Indonesia, tetapi logat/aksennya sering terdengar kebarat-baratan dan kurang natural.

## Yang akan diperbaiki

1. **Ganti mesin suara ke Gemini TTS (`google/gemini-2.5-flash-tts`)** di `src/routes/api/tts.ts`. Model ini jauh lebih natural untuk Bahasa Indonesia. Pengarahan gaya ditulis di depan teks, misalnya: "Bacakan dengan ramah dan hangat dalam Bahasa Indonesia baku, tempo sedang: …". Format body mengikuti skema Google (`contents` + `generationConfig.speechConfig`), tetap streaming SSE agar suara mulai terdengar cepat.
2. **Fallback otomatis**: jika Gemini gagal (error/kuota), server langsung mencoba ulang ke `openai/gpt-4o-mini-tts` seperti sekarang, sehingga narasi tidak pernah hilang total.
3. **Tombol "Dengarkan lagi 🔊"** di popup kartu, supaya pemain bisa mengulang pembacaan tanpa harus menutup kartu.
4. **Narasi di halaman Kartu (`/kartu`)**: saat kartu dibuka dari galeri, ada tombol untuk membacakannya (tidak otomatis, dan tidak mengunci tombol tutup).
5. **Pilihan suara narator** di panel permainan: 2–3 opsi suara Indonesia (mis. hangat / ceria / tenang) yang tersimpan bersama progres permainan.

## Detail teknis

- `src/routes/api/tts.ts`: terima `{ text, voice? }`, susun body Gemini, teruskan `response.body` apa adanya sebagai `text/event-stream`; tangani status non-OK dengan mencoba model cadangan lalu meneruskan pesan error aslinya.
- `src/lib/narrate.ts`: tidak berubah secara struktur (delta PCM base64 sama), hanya menerima parameter `voice` opsional.
- `src/components/CardPopup.tsx`: tambah state untuk replay, tetap mempertahankan penguncian tombol lanjut sampai pembacaan pertama selesai.
- Suara diverifikasi lewat uji browser otomatis: memastikan permintaan `/api/tts` berstatus 200, ada event audio, dan tombol lanjut terbuka setelah narasi selesai.
