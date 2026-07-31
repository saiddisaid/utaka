export type Strategy = {
  id: string;
  code: string;
  name: string;
  emoji: string;
  short: string;
  example: string;
  benefit: string;
};

export const strategies: Strategy[] = [
  {
    id: "reappraisal",
    code: "Y1",
    name: "Cognitive Reappraisal",
    emoji: "🌱",
    short:
      "Mengubah cara pandang terhadap situasi yang menyakitkan agar dampak emosinya menjadi lebih ringan.",
    example:
      "Alih-alih berpikir \"aku ditolak karena aku tidak berharga\", kamu berpikir \"pengalaman ini membuatku lebih dewasa dan lebih mengenal diriku\".",
    benefit:
      "Menurunkan reaksi emosional berlebihan dan membantumu tidak larut dalam kesedihan.",
  },
  {
    id: "acceptance",
    code: "Y2",
    name: "Acceptance",
    emoji: "🤍",
    short:
      "Menerima perasaan yang muncul apa adanya, tanpa menghakimi diri sendiri dan tanpa memaksakan keadaan.",
    example:
      "Kamu mengizinkan dirimu sedih beberapa hari, mengakui rasa kecewa itu, lalu tetap menjalani hari seperti biasa.",
    benefit:
      "Mengurangi tekanan emosional dan mempercepat proses pemulihan dibanding menyangkal perasaan.",
  },
  {
    id: "distraction",
    code: "Y3",
    name: "Distraction",
    emoji: "🎈",
    short:
      "Mengalihkan perhatian ke aktivitas positif untuk memutus rantai pikiran yang berputar-putar.",
    example:
      "Menyalurkan energi patah hati ke hobi, olahraga, atau bermain bersama teman-teman.",
    benefit:
      "Memberi jeda pada emosi yang memuncak dan mengembalikan fokus pada tujuan dirimu.",
  },
  {
    id: "social-support",
    code: "Y4",
    name: "Social Support",
    emoji: "🫂",
    short:
      "Membuka diri dan mencari dukungan dari orang yang kamu percaya ketika perasaan terasa berat.",
    example:
      "Bercerita kepada sahabat, kakak, orang tua, atau guru BK tentang apa yang sedang kamu rasakan.",
    benefit:
      "Mengurangi rasa terisolasi dan melindungi dari dampak emosional yang berat.",
  },
  {
    id: "problem-solving",
    code: "Y5",
    name: "Problem-Solving",
    emoji: "🧭",
    short:
      "Mengambil langkah nyata dan membuat batasan sehat untuk menyelesaikan sumber masalah.",
    example:
      "Berhenti stalking media sosialnya, mencari kejelasan status, atau menjaga jarak secukupnya.",
    benefit:
      "Menurunkan stres, memberi rasa kendali, dan meningkatkan kepercayaan diri.",
  },
  {
    id: "mindfulness",
    code: "Y6",
    name: "Mindfulness & Emotional Flexibility",
    emoji: "🌤️",
    short:
      "Menyadari emosi yang muncul tanpa langsung bereaksi, lalu memilih strategi yang paling pas dengan situasi.",
    example:
      "Saat berpapasan dengannya, kamu menarik napas, menyadari rasa gugupmu, dan tetap bersikap wajar.",
    benefit:
      "Menjaga ketenangan, mencegah tindakan impulsif, dan mendukung kesehatan mental jangka panjang.",
  },
];

export const dampakTidakDikelola = [
  {
    emoji: "🌀",
    title: "Overthinking berkepanjangan",
    text: "Pikiran terus berputar pada penolakan sehingga sulit fokus belajar dan beraktivitas.",
  },
  {
    emoji: "📉",
    title: "Harga diri menurun",
    text: "Muncul keyakinan bahwa diri tidak berharga, padahal ditolak bukan ukuran nilai dirimu.",
  },
  {
    emoji: "🚪",
    title: "Menarik diri dari lingkungan",
    text: "Rasa malu dan cemas membuat remaja menjauh dari teman dan kehilangan dukungan sosial.",
  },
  {
    emoji: "💥",
    title: "Perilaku impulsif",
    text: "Marah meledak, menulis hal buruk di media sosial, atau memaksa perasaan dibalas.",
  },
];

export const tipsCintaTakBerbalas = [
  "Akui perasaanmu. Sedih, kecewa, dan malu adalah reaksi yang wajar.",
  "Beri dirimu waktu, tetapi tetapkan batas agar tidak berlarut-larut.",
  "Kurangi pemicu, misalnya berhenti memantau media sosialnya setiap saat.",
  "Ceritakan pada orang yang kamu percaya, termasuk guru BK di sekolah.",
  "Isi hari dengan aktivitas yang membuatmu bertumbuh dan bahagia.",
  "Ingat, penolakan adalah tentang kecocokan, bukan tentang nilai dirimu.",
];
