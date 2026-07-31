export type CardType = "tangga" | "ular" | "funfact";

export type EduCard = {
  id: string;
  type: CardType;
  code: string;
  title: string;
  body: string;
  extra: string;
  emoji: string;
};

export const tanggaCards: EduCard[] = [
  {
    id: "T1",
    type: "tangga",
    code: "Y1",
    title: "Cognitive Reappraisal",
    body: "Kamu menyadari bahwa penolakan cinta ini membuat kamu berkembang menjadi lebih dewasa dan open minded.",
    extra: "Selamat! Bidak kamu berhak memanjat naik lewat tangga ini ke petak yang lebih tinggi.",
    emoji: "🌱",
  },
  {
    id: "T2",
    type: "tangga",
    code: "Y2",
    title: "Acceptance",
    body: "Kamu mengizinkan dirimu untuk galau dan bersedih dengan ikhlas tanpa harus membenci keadaan atau dirimu sendiri.",
    extra: "Selamat! Bidak kamu berhak memanjat naik lewat tangga ini ke petak yang lebih tinggi.",
    emoji: "🤍",
  },
  {
    id: "T3",
    type: "tangga",
    code: "Y3",
    title: "Distraction",
    body: "Kamu memilih menyalurkan energi patah hatimu untuk bersenang-senang dengan teman-temanmu.",
    extra: "Selamat! Bidak kamu berhak memanjat naik lewat tangga ini ke petak yang lebih tinggi.",
    emoji: "🎈",
  },
  {
    id: "T4",
    type: "tangga",
    code: "Y4",
    title: "Social Support",
    body: "Kamu memutuskan untuk bersikap terbuka dan menceritakan beban hatimu kepada bestie kamu atau orang yang kamu percayai.",
    extra: "Selamat! Bidak kamu berhak memanjat naik lewat tangga ini ke petak yang lebih tinggi.",
    emoji: "🫂",
  },
  {
    id: "T5",
    type: "tangga",
    code: "Y5",
    title: "Problem-Solving",
    body: "Kamu membuat batasan yang sehat dengan tidak stalking media sosialnya demi menjaga ketenangan hati dan perasaanmu.",
    extra: "Selamat! Bidak kamu berhak memanjat naik lewat tangga ini ke petak yang lebih tinggi.",
    emoji: "🧭",
  },
  {
    id: "T6",
    type: "tangga",
    code: "Y6",
    title: "Mindfulness & Emotional Flexibility",
    body: "Saat berpapasan dengannya, kamu bersikap normal selayaknya teman biasa dan dapat mengendalikan diri.",
    extra: "Selamat! Bidak kamu berhak memanjat naik lewat tangga ini ke petak yang lebih tinggi.",
    emoji: "🌤️",
  },
];

export const ularCards: EduCard[] = [
  {
    id: "U1",
    type: "ular",
    code: "Y1",
    title: "Gagal Cognitive Reappraisal",
    body: "Kamu terus berpikir negatif bahwa dirimu adalah orang yang paling malang di dunia, tidak berharga, dan tidak memiliki masa depan setelah ditolak.",
    extra: "Harapanmu runtuh. Bidak kamu harus turun melewati ular ini ke petak yang lebih rendah.",
    emoji: "🌧️",
  },
  {
    id: "U2",
    type: "ular",
    code: "Y2",
    title: "Gagal Acceptance",
    body: "Kamu denial karena dia tidak menyukaimu, lalu terus mengganggu dan memaksa agar perasaan sepihakmu dibalas.",
    extra: "Hubungan sosialmu terganggu. Bidak kamu harus turun melewati ular ini ke petak yang lebih rendah.",
    emoji: "🚧",
  },
  {
    id: "U3",
    type: "ular",
    code: "Y3",
    title: "Gagal Distraction",
    body: "Kamu memilih mengurung diri di kamar selama berhari-hari, melewatkan hobi, enggan belajar, dan tidak mau beraktivitas apa pun.",
    extra: "Aktivitas sehari-harimu terhambat. Bidak kamu harus turun melewati ular ini ke petak yang lebih rendah.",
    emoji: "🛏️",
  },
  {
    id: "U4",
    type: "ular",
    code: "Y4",
    title: "Gagal Social Support",
    body: "Karena merasa malu, cemas, dan tidak percaya diri setelah ditolak, kamu menarik diri dari lingkaran pertemanan sekolah.",
    extra: "Kamu merasa terisolasi sendirian. Bidak kamu harus turun melewati ular ini ke petak yang lebih rendah.",
    emoji: "🕳️",
  },
  {
    id: "U5",
    type: "ular",
    code: "Y5",
    title: "Gagal Problem-Solving",
    body: "Kamu membiarkan hubungan pertemanan dengannya menjadi sangat canggung, penuh sindiran, dan tegang tanpa ada kejelasan status.",
    extra: "Konflik interpersonal membuatmu stres. Bidak kamu harus turun melewati ular ini ke petak yang lebih rendah.",
    emoji: "⚡",
  },
  {
    id: "U6",
    type: "ular",
    code: "Y6",
    title: "Gagal Mindfulness & Flexibility",
    body: "Kamu meledak dalam amarah yang tidak terkendali dan menuliskan kalimat impulsif yang buruk di media sosial karena terbakar rasa cemburu.",
    extra: "Kamu terjebak dalam emosi negatif. Bidak kamu harus turun melewati ular ini ke petak yang lebih rendah.",
    emoji: "🔥",
  },
];

const ff = (
  n: number,
  code: string,
  title: string,
  body: string,
  extra: string,
): EduCard => ({
  id: `F${n}`,
  type: "funfact",
  code,
  title,
  body,
  extra,
  emoji: "💡",
});

export const funFactCards: EduCard[] = [
  ff(1, "Y1", "Cognitive Reappraisal", "Remaja yang tidak terus terjebak dalam rasa kecewa dan mencoba mengambil pelajaran dari pengalaman cinta bertepuk sebelah tangan biasanya lebih mudah merasa bahagia.", "Ditolak bukan berarti cerita kamu selesai, bisa jadi ini malah momen upgrade versi diri kamu."),
  ff(2, "Y1", "Cognitive Reappraisal", "Mengubah sudut pandang terhadap situasi yang bikin stres bisa membantu menurunkan respons emosional berlebihan di area otak yang mengatur emosi.", "Kalau kamu mulai lihat cinta bertepuk sebelah tangan sebagai proses belajar, hati dan pikiran biasanya ikut jadi lebih adem."),
  ff(3, "Y1", "Cognitive Reappraisal", "Penelitian menunjukkan bahwa remaja yang belajar mengubah cara berpikir saat mengalami penolakan biasanya tidak mudah larut dalam kesedihan.", "Cara berpikir itu berpengaruh besar. Kadang yang perlu diubah bukan kejadiannya, tapi cara kita melihatnya."),
  ff(4, "Y1", "Cognitive Reappraisal", "Penolakan romantis sering bikin seseorang mulai meragukan dirinya sendiri dan merasa kurang berharga.", "Ditolak itu bukan bukti kamu kurang baik, kadang cuma berarti jalannya memang beda."),
  ff(5, "Y2", "Acceptance", "Menerima emosi negatif secara terbuka tanpa menghakimi diri sendiri (acceptance) terbukti membantu menurunkan rasa sedih dan kecewa.", "Sedih karena cinta nggak berbalas itu normal. Nggak harus pura-pura kuat terus!"),
  ff(6, "Y2", "Acceptance", "Denial dalam hubungan interpersonal justru bisa bikin tekanan emosional terasa lebih berat.", "Menerima kenyataan memang nggak instan, tapi seringkali itu langkah pertama buat move on."),
  ff(7, "Y2", "Acceptance", "Remaja yang belajar menerima perasaannya cenderung lebih cepat merasa tenang saat menghadapi masalah.", "Kamu tidak bisa memaksa hati orang lain, tetapi kamu tetap punya kendali atas responmu."),
  ff(8, "Y2", "Acceptance", "Remaja yang mempraktikkan penerimaan diri pasca-ditolak terbukti memiliki kestabilan emosi dan ketahanan psikologis (resilience) yang jauh lebih tinggi.", "Bersikap baiklah pada dirimu sendiri saat terluka. Menerima kegagalan adalah tanda bahwa kamu sedang bertumbuh."),
  ff(9, "Y3", "Distraction", "Mengalihkan perhatian (distraction) ke hal-hal positif sangat berguna untuk memutus rantai emosi negatif di masa-masa awal setelah kamu mengalami penolakan asmara.", "Terkadang kembali pada hobi atau kegiatan bermanfaat akan merangsang pikiranmu untuk keluar dari rasa sakit hati."),
  ff(10, "Y3", "Distraction", "Melakukan aktivitas fisik atau menyalurkan energi ke hobi yang menyenangkan terbukti mempercepat proses pemulihan emosi dari rasa penolakan.", "Jangan malas bergerak! Aktivitas positif bersama teman adalah obat penawar patah hati yang paling alami."),
  ff(11, "Y3", "Distraction", "Pengalihan perhatian yang adaptif membantu mengembalikan fokus remaja pada tujuan dan perkembangan dirinya.", "Energi kamu terlalu berharga kalau habis cuma buat mikirin yang nggak bisa dipaksa!"),
  ff(12, "Y3", "Distraction", "Menyalurkan emosi negatif ke dalam permainan kelompok atau aktivitas interaktif terbukti melatih empati dan keterampilan emosional remaja.", "Ubah rasa sakit hatimu menjadi bahan pembelajaran berharga melalui pengalaman nyata bersama teman-temanmu!"),
  ff(13, "Y4", "Social Support", "Dukungan dari teman dan keluarga bisa membantu melindungi remaja dari dampak emosional yang berat.", "Nggak semua hal harus dipikul sendiri! Cerita itu bukan bikin lemah."),
  ff(14, "Y4", "Social Support", "Menjalin komunikasi yang baik dan terbuka dengan lingkungan sekitar terbukti mengurangi perasaan terisolasi akibat penolakan interpersonal.", "Kadang yang paling menenangkan bukan solusi, tapi didengar."),
  ff(15, "Y4", "Social Support", "Layanan bimbingan kelompok atau bantuan dari guru BK dirancang untuk memberikan solusi yang dinamis, menarik, dan mudah dimengerti bagi permasalahan remaja.", "Ruang BK bukan ruang hukuman, kadang itu tempat untuk recharge pikiran."),
  ff(16, "Y4", "Social Support", "Dukungan emosional yang kuat berkaitan dengan ketangguhan dan kemampuan sosial yang lebih baik.", "Ingat, kamu tidak sendirian. Dukungan dari orang tua, keluarga, dan lingkungan sekitar akan selalu menguatkanmu!"),
  ff(17, "Y5", "Problem-Solving", "Mengambil langkah nyata untuk menghadapi masalah dapat membantu mengurangi stres dan membuat perasaan lebih tenang.", "Berani mencari kejelasan status hubungan akan menyelamatkan dirimu dari membuang-buang waktu dalam ketidakpastian!"),
  ff(18, "Y5", "Problem-Solving", "Menetapkan batasan yang sehat (setting boundaries) dengan tidak larut dalam ketegangan hubungan terbukti mempercepat pemulihan emosional remaja.", "Menjaga jarak bukan berarti menyerah, kadang itu bentuk menjaga diri."),
  ff(19, "Y5", "Problem-Solving", "Kemampuan memecahkan masalah interpersonal secara mandiri dan reflektif dapat meningkatkan kepercayaan diri remaja dalam menghadapi situasi buruk.", "Hadapi masalah asmaramu dengan kepala dingin dan tindakan nyata, karena hal itu melatih kesiapan fase perkembangan selanjutnya."),
  ff(20, "Y5", "Problem-Solving", "Pembelajaran berbasis pengalaman mampu meningkatkan kemampuan perencanaan dan pemecahan masalah kelompok pada siswa.", "Dari setiap pengalaman, selalu ada skill baru yang ikut tumbuh."),
  ff(21, "Y6", "Mindfulness & Emotional Flexibility", "Belajar mengenali perasaan sendiri dapat membantu remaja tidak langsung bereaksi saat emosi muncul.", "Emosi boleh datang, tapi kamu tetap yang pegang kendali."),
  ff(22, "Y6", "Mindfulness & Emotional Flexibility", "Keluwesan emosional adalah kemampuan beradaptasi dan menyesuaikan strategi regulasi emosi secara luwes sesuai dengan konteks situasi yang dihadapi.", "Kadang waktunya menerima, kadang waktunya mengalihkan, dua-duanya sama penting."),
  ff(23, "Y6", "Mindfulness & Emotional Flexibility", "Memiliki kemampuan regulasi emosi yang fleksibel sangat penting untuk meningkatkan kesehatan mental, performa diri, dan kualitas hidup remaja yang maksimal.", "Tetap tenang dan berpikir jernih di tengah badai patah hati adalah kunci utama untuk mencapai potensi terbaik dirimu!"),
  ff(24, "Y6", "Mindfulness & Emotional Flexibility", "Permainan edukatif dapat meningkatkan pemahaman regulasi emosi lebih efektif dibanding metode pasif.", "Belajar emosi itu nggak harus serius terus, kadang justru lebih masuk lewat bermain."),
];

export const allCards: EduCard[] = [...tanggaCards, ...ularCards, ...funFactCards];

export const cardTypeLabel: Record<CardType, string> = {
  tangga: "Kartu Tangga",
  ular: "Kartu Ular",
  funfact: "Kartu Fun Fact",
};
