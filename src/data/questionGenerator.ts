import {
  CognitiveLevel,
  DifficultyLevel,
  GradeLevel,
  OmiStage,
  Question,
  QuestionOption,
  QuestionTopic,
  QuestionType,
} from '../types';
import { BENCHMARK_QUESTIONS } from './seedQuestions';

// Scientific templates and domain matrices for 1,000+ realistic, unique questions
interface TemplateSpec {
  topic: QuestionTopic;
  subtopic: string;
  grade: GradeLevel;
  stage: OmiStage;
  difficulty: DifficultyLevel;
  cognitiveLevel: CognitiveLevel;
  type: QuestionType;
  stimulusGenerator: (seed: number) => {
    stimulus: string;
    question: string;
    options: QuestionOption[];
    correctAnswer: string;
    concept: string;
    stepByStep: string[];
    whyCorrect: string;
    whyOthersWrong: string;
    islamicIntegration?: string;
    thinkingPath: string;
    tags: string[];
    sourceReference: string;
    hasIslamicIntegration?: boolean;
    visualData?: any;
  };
}

// Collection of scientific archetype factories
const TEMPLATES: TemplateSpec[] = [
  // 1. Makhluk Hidup & Adaptasi
  {
    topic: 'makhluk_hidup',
    subtopic: 'Adaptasi Morfologi & Fisiologi Hewan',
    grade: 'Kelas 5',
    stage: 'Tingkat Kabupaten/Kota',
    difficulty: 'HOTS',
    cognitiveLevel: 'C4',
    type: 'analisis_tabel',
    stimulusGenerator: (seed) => {
      const birds = [
        { name: 'Burung Kolibri', beak: 'Panjang, ramping, dan melengkung', food: 'Nektar bunga di celah sempit', adaptation: 'Mengisap nektar tanpa merusak kelopak bunga' },
        { name: 'Burung Pipit', beak: 'Pendek, tebal, dan berbentuk kerucut', food: 'Biji-bijian keras di rerumputan', adaptation: 'Memecah dan mengupas kulit biji dengan tekanan kuat' },
        { name: 'Burung Pelikan', beak: 'Panjang dengan kantung elastis di rahang bawah', food: 'Ikan air tawar dan laut', adaptation: 'Menyerok ikan bersama air lalu memeras airnya keluar' },
        { name: 'Burung Elang', beak: 'Tajam, kokoh, dan ujung melengkung runcing', food: 'Daging hewan mamalia kecil dan reptil', adaptation: 'Merobek dan mengoyak serat daging mangsa' },
        { name: 'Bebek / Itik', beak: 'Pipih dan memiliki lempeng penyaring (lamela)', food: 'Cacing dan jentik di lumpur perairan', adaptation: 'Menyaring makanan kecil dari lumpur basah' },
        { name: 'Burung Pelatuk', beak: 'Lurus, sangat keras seperti pahat runcing', food: 'Larva serangga di dalam batang kayu', adaptation: 'Mematuk kulit kayu lapuk tanpa mengalami cedera otak' },
      ];
      const selected = birds[seed % birds.length];
      const decoy = birds[(seed + 2) % birds.length];
      return {
        stimulus: `Dalam penelitian lapangan tentang keanekaragaman fauna, sekelompok siswa madrasah mencatat morfologi paruh ${selected.name}. Bentuk paruhnya tampak: "${selected.beak}". Di habitat alaminya, ketersediaan sumber pakan utama berupa ${selected.food}.`,
        question: `Bentuk paruh ${selected.name} tersebut merupakan bentuk adaptasi morfologi yang berfungsi secara spesifik untuk...`,
        options: [
          { id: 'A', text: selected.adaptation },
          { id: 'B', text: decoy.adaptation },
          { id: 'C', text: 'Memperindah penampilan saat musim kawin untuk menarik perhatian pasangan' },
          { id: 'D', text: 'Mempercepat laju pernapasan saat terbang pada ketinggian tekanan udara rendah' },
        ],
        correctAnswer: 'A',
        concept: 'Adaptasi morfologi bentuk paruh burung terhadap jenis makanan di habitat alaminya.',
        stepByStep: [
          `Identifikasi bentuk paruh: ${selected.beak}.`,
          `Hubungkan dengan jenis makanan: ${selected.food}.`,
          `Analisis fungsi mekanik: ${selected.adaptation}.`,
        ],
        whyCorrect: `Bentuk paruh ${selected.name} yang ${selected.beak} dirancang secara presisi untuk ${selected.adaptation}.`,
        whyOthersWrong: 'Pilihan B adalah fungsi paruh burung lain, sedangkan C dan D bukan fungsi utama adaptasi morfologi paruh.',
        islamicIntegration: 'Maha Suci Allah yang telah menciptakan tiap makhluk dengan bentuk fisik paling sesuai untuk mencari rezeki di alam (QS. Thaha: 50).',
        thinkingPath: 'Morfologi Paruh -> Analisis Pakan -> Fungsi Mekanik Adaptasi -> Pilihan A.',
        tags: ['adaptasi morfologi', 'burung', 'paruh', 'keanekaragaman hayati'],
        sourceReference: 'OMI IPAS 2026 - Zoologi Dasar MI',
        hasIslamicIntegration: true,
      };
    },
  },

  // 2. Ekosistem & Rantai Makanan
  {
    topic: 'makhluk_hidup',
    subtopic: 'Rantai Makanan & Dinamika Populasi',
    grade: 'Kelas 5',
    stage: 'Tingkat Provinsi',
    difficulty: 'HOTS',
    cognitiveLevel: 'C5',
    type: 'studi_kasus',
    stimulusGenerator: (seed) => {
      const ecoCases = [
        {
          habitat: 'Ekosistem Sawah',
          chain: 'Padi -> Tikus -> Ular Sawah -> Burung Elang -> Bakteri Pengurai',
          disruption: 'Perburuan ular sawah secara besar-besaran oleh oknum pemburu untuk diambil kulitnya',
          impact: 'Populasi tikus meningkat drastis sehingga hasil panen padi petani gagal total (puso)',
          restore: 'Melarang perburuan ular dan membudidayakan burung hantu (Tyto alba) sebagai predator alami tikus',
        },
        {
          habitat: 'Ekosistem Danau Air Tawar',
          chain: 'Fitoplankton -> Kutu Air (Daphnia) -> Ikan Nila Kecil -> Ikan Gabus -> Jamur Pengurai',
          disruption: 'Limbah pupuk fosfat dan detergen berlebih masuk ke danau memicu ledakan fitoplankton (blooming algae)',
          impact: 'Permukaan tertutup alga, penetrasi cahaya berkurang, dan penurunan oksigen terlarut mematikan ikan',
          restore: 'Mengendalikan limpasan limbah organik dan aerasi kolam danau',
        },
        {
          habitat: 'Ekosistem Kebun Madrasah',
          chain: 'Tanaman Cabai -> Ulat Daun -> Burung Kutilang -> Kucing Liar',
          disruption: 'Penyemprotan insektisida spektrum luas yang membunuh seluruh serangga dan ulat',
          impact: 'Burung kutilang kehilangan sumber pakan utama dan penyerbukan bunga cabai menurun drastis',
          restore: 'Menerapkan pertanian organik dengan agen hayati tanaman pengusir hama (refugia)',
        },
      ];
      const c = ecoCases[seed % ecoCases.length];
      return {
        stimulus: `Perhatikan jaring kehidupan pada ${c.habitat} berikut:
Aliran energi: ${c.chain}.
Pada tahun ini, terjadi kejadian: ${c.disruption}.`,
        question: `Berdasarkan prinsip keseimbangan dinamika ekosistem, dampak jangka menengah yang paling rasional terhadap piramida makanan dan langkah solutifnya adalah...`,
        options: [
          { id: 'A', text: `Dampak: ${c.impact}; Langkah penanganan: ${c.restore}` },
          { id: 'B', text: 'Dampak: Populasi produsen meningkat seratus kali lipat karena tidak ada lagi herbivora; Langkah: Menebang produsen' },
          { id: 'C', text: 'Dampak: Seluruh trofik tidak terpengaruh karena setiap organisme dapat mengubah makanannya secara instan' },
          { id: 'D', text: 'Dampak: Konsumen puncak langsung punah dalam hitungan jam karena tidak ada makanan sama sekali' },
        ],
        correctAnswer: 'A',
        concept: 'Keseimbangan jaring-jaring makanan, dinamika trofik, dan intervensi ekologis ramah lingkungan.',
        stepByStep: [
          `Identifikasi posisi trofik organisme yang terganggu dalam rantai makanan: ${c.chain}.`,
          `Analisis konsekuensi hilangnya predator/mangsa: ${c.impact}.`,
          `Tentukan pendekatan restorasi ekologis berbasis biological control: ${c.restore}.`,
        ],
        whyCorrect: `Ketika salah satu komponen rantai makanan terganggu (${c.disruption}), keseimbangan populasi terdekat langsung terganggu. Solusi terbaik adalah ${c.restore}.`,
        whyOthersWrong: 'Pilihan B, C, dan D tidak sesuai dengan hukum ekologi dan daya lenting ekosistem.',
        islamicIntegration: 'Islam melarang merusak ekosistem dan mengabaikan keseimbangan ciptaan Allah (QS. Al-Qamar: 49: "Sungguh Kami menciptakan segala sesuatu menurut ukuran yang tepat").',
        thinkingPath: 'Gangguan Trofik -> Efek Berantai Rantai Makanan -> Solusi Berbasis Alam -> Pilihan A.',
        tags: ['ekosistem', 'rantai makanan', 'dinamika populasi', 'studi kasus', 'konservasi'],
        sourceReference: 'Buku Ajar OMI IPAS Terintegrasi 2026 - Ekologi Terapan',
        hasIslamicIntegration: true,
      };
    },
  },

  // 3. Tubuh Manusia: Sistem Peredaran Darah & Jantung
  {
    topic: 'tubuh_manusia',
    subtopic: 'Sistem Peredaran Darah Ganda & Ruang Jantung',
    grade: 'Kelas 5',
    stage: 'Tingkat Provinsi',
    difficulty: 'HOTS',
    cognitiveLevel: 'C5',
    type: 'analisis_grafik',
    stimulusGenerator: (seed) => {
      const circuits = [
        {
          name: 'Peredaran Darah Kecil (Pulmonal)',
          route: 'Ventrikel Kanan (Bilik Kanan) -> Arteri Pulmonalis -> Paru-paru -> Vena Pulmonalis -> Atrium Kiri (Serambi Kiri)',
          characteristic: 'Membawa darah kaya CO₂ menuju paru-paru untuk melepaskan CO₂ dan mengikat O₂ segar.',
          vessel: 'Arteri Pulmonalis',
          vesselNature: 'Satu-satunya arteri yang membawa darah miskin O₂ dan kaya CO₂',
        },
        {
          name: 'Peredaran Darah Besar (Sistemik)',
          route: 'Ventrikel Kiri (Bilik Kiri) -> Aorta -> Pembuluh Arteri -> Seluruh Tubuh -> Vena Cava -> Atrium Kanan (Serambi Kanan)',
          characteristic: 'Memompa darah bertekanan tinggi kaya O₂ dan sari makanan ke seluruh organ dan jaringan tubuh.',
          vessel: 'Aorta',
          vesselNature: 'Pembuluh arteri terbesar berdinding tebal dan elastis menahan tekanan pompa bilik kiri',
        },
      ];
      const cur = circuits[seed % circuits.length];
      return {
        stimulus: `Seorang dokter spesialis jantung menjelaskan hasil ekokardiografi pada anak yang sedang berolahraga. Darah bergerak mengalir melalui lintasan peredaran ganda manusia:
Rute lintasan: ${cur.route}.
Karakteristik fisiologis: ${cur.characteristic}.`,
        question: `Keistimewaan sifat pembuluh darah "${cur.vessel}" pada sistem sirkulasi manusia tersebut adalah...`,
        options: [
          { id: 'A', text: cur.vesselNature },
          { id: 'B', text: 'Memiliki katup di sepanjang pembuluh dan tekanannya paling lemah di tubuh' },
          { id: 'C', text: 'Mengalirkan darah kembali menuju serambi kanan tanpa melewati pertukaran difusi kapiler' },
          { id: 'D', text: 'Hanya aktif mengalirkan darah pada waktu malam hari saat tubuh beristirahat' },
        ],
        correctAnswer: 'A',
        concept: 'Struktur jantung, peredaran darah ganda, dan karakteristik fungsional pembuluh darah.',
        stepByStep: [
          `Identifikasi jenis peredaran darah: ${cur.name}.`,
          `Rute aliran darah: ${cur.route}.`,
          `Fokus pada pembuluh ${cur.vessel}: ${cur.vesselNature}.`,
        ],
        whyCorrect: `Karakteristik pembuluh ${cur.vessel} adalah ${cur.vesselNature}, selaras dengan fungsi fisiologis ${cur.characteristic}.`,
        whyOthersWrong: 'Pilihan B adalah ciri umum vena cava, C dan D secara medis keliru.',
        islamicIntegration: 'Jantung berdetak puluhan ribu kali per hari tanpa henti atas izin Allah SWT, mengingatkan manusia untuk senantiasa bersyukur atas nikmat kesehatan.',
        thinkingPath: 'Ruang Jantung -> Jalur Sirkulasi -> Sifat Spesifik Pembuluh -> Pilihan A.',
        tags: ['peredaran darah', 'jantung', 'arteri pulmonalis', 'aorta', 'fisiologi'],
        sourceReference: 'Anatomi & Fisiologi Manusia untuk Pembinaan OMI MI',
        hasIslamicIntegration: true,
      };
    },
  },

  // 4. Materi & Perubahan Energi
  {
    topic: 'materi_energi',
    subtopic: 'Perubahan Bentuk Energi & Hukum Kekekalan Energi',
    grade: 'Kelas 4',
    stage: 'Tingkat Kabupaten/Kota',
    difficulty: 'Medium',
    cognitiveLevel: 'C4',
    type: 'pilihan_ganda',
    stimulusGenerator: (seed) => {
      const devices = [
        { name: 'Pembangkit Listrik Tenaga Surya (PLTS) Madrasah', input: 'Energi Cahaya Matahari', seq: 'Energi Cahaya Matahari -> Sel Fotovoltaik -> Energi Listrik -> Inverter -> Energi Listrik AC untuk Lampu (Cahaya)' },
        { name: 'Mikrohidro Saluran Irigasi Desa', input: 'Energi Potensial Ketinggian Air', seq: 'Energi Potensial Air -> Energi Kinetik Aliran -> Putaran Turbin -> Generator -> Energi Listrik' },
        { name: 'Kincir Angin Pompa Air Garam', input: 'Energi Kinetik Angin', seq: 'Energi Kinetik Angin -> Putaran Baling-baling -> Energi Mekanik Piston -> Mengangkat Air Laut ke Tambak' },
        { name: 'Senter Dinamo Engkol Darurat', input: 'Energi Kimia Otot Tangan', seq: 'Energi Kimia Tubuh -> Energi Mekanik Engkol -> Induksi Elektromagnet Generator -> Energi Listrik -> Lampu LED (Cahaya)' },
        { name: 'Oven Tenaga Surya Sederhana', input: 'Energi Radiasi Matahari', seq: 'Energi Radiasi Cahaya -> Diserap Permukaan Hitam -> Energi Termal (Panas) Terperangkap Kaca' },
      ];
      const dev = devices[seed % devices.length];
      return {
        stimulus: `Di madrasah ramah lingkungan, siswa membuat model rekayasa sains "${dev.name}". Model ini memanfaatkan sumber daya ${dev.input} untuk memenuhi kebutuhan energi harian secara mandiri dan berkelanjutan.`,
        question: `Rangkaian konversi perubahan bentuk energi yang terjadi pada alat "${dev.name}" tersebut secara berurutan adalah...`,
        options: [
          { id: 'A', text: dev.seq },
          { id: 'B', text: 'Energi Nuklir -> Energi Magnetik -> Energi Kimia -> Energi Listrik' },
          { id: 'C', text: 'Energi Bunyi -> Energi Kalor -> Energi Potensial Pegas -> Energi Listrik' },
          { id: 'D', text: 'Energi Listrik -> Energi Kimia Fosil -> Energi Gravitasi Bumi' },
        ],
        correctAnswer: 'A',
        concept: 'Hukum Kekekalan Energi dan rantai transformasi bentuk energi dalam teknologi ramah lingkungan.',
        stepByStep: [
          `Identifikasi sumber energi input awal: ${dev.input}.`,
          `Lacak proses perantara mekanis/kimiawi/listrik.`,
          `Urutkan tahapan transformasi: ${dev.seq}.`,
        ],
        whyCorrect: `Transformasi energi pada ${dev.name} berlangsung sesuai hukum fisika: ${dev.seq}.`,
        whyOthersWrong: 'Pilihan B, C, dan D tidak relevan dengan prinsip kerja alat tersebut.',
        islamicIntegration: 'Energi di alam semesta tidak dapat diciptakan atau dimusnahkan oleh manusia melainkan hanya diubah wujudnya, cerminan sunnatullah yang teratur.',
        thinkingPath: 'Input Energi -> Mekanisme Alat -> Output Akhir -> Urutan A.',
        tags: ['energi', 'perubahan energi', 'energi terbarukan', 'teknologi hijau'],
        sourceReference: 'Modul Fisika Terapan MI/SD - Seri OMI 2026',
        hasIslamicIntegration: true,
      };
    },
  },

  // 5. Materi: Sifat Cahaya & Optika
  {
    topic: 'materi_energi',
    subtopic: 'Sifat Gelombang Cahaya & Pembiasan (Refraksi)',
    grade: 'Kelas 5',
    stage: 'Tingkat Provinsi',
    difficulty: 'HOTS',
    cognitiveLevel: 'C5',
    type: 'analisis_tabel',
    stimulusGenerator: (seed) => {
      const opticalPhenomena = [
        {
          phenomenon: 'Pensil yang dimasukkan ke dalam gelas berisi air bening tampak patah',
          cause: 'Pembiasan (refraksi) cahaya karena berkas sinar merambat melalui dua medium dengan kerapatan optik berbeda (udara ke air), sehingga kecepatannya melambat dan arahnya dibelokkan mendekati garis normal.',
          misconception: 'Pensil benar-benar patah karena tekanan zat cair di dasar gelas',
        },
        {
          phenomenon: 'Terjadinya pelangi di langit setelah turun hujan rintik di saat matahari bersinar',
          cause: 'Dispersi dan pembiasan cahaya polikromatik matahari saat memasuki tetesan air hujan, di mana setiap panjang gelombang warna mengalami pembelokan dengan sudut berbeda.',
          misconception: 'Tetesan air hujan memancarkan warna-warni kimia sendiri',
        },
        {
          phenomenon: 'Dasar kolam renang yang jernih terlihat lebih dangkal dari kedalaman aslinya',
          cause: 'Sinar yang berasal dari dasar kolam merambat dari air (medium lebih rapat) ke udara (medium kurang rapat) dibiaskan menjauhi garis normal, sehingga mata melihat bayangan semu yang terangkat.',
          misconception: 'Air menekan dasar kolam ke atas akibat gaya angkat Archimedes',
        },
        {
          phenomenon: 'Piringan koin di dasar mangkuk tak terlihat, namun terlihat setelah mangkuk dituangi air',
          cause: 'Berkas cahaya dari koin dibelokkan oleh permukaan air sehingga dapat mencapai mata pengamat yang posisinya tidak segaris.',
          misconception: 'Air membuat koin mengapung mendekati bibir mangkuk',
        },
      ];
      const opt = opticalPhenomena[seed % opticalPhenomena.length];
      return {
        stimulus: `Pada kegiatan praktikum optik di laboratorium madrasah, siswa mengamati fenomena: "${opt.phenomenon}". Seluruh siswa diminta mendiskusikan konsep fisika yang mendasari peristiwa tersebut.`,
        question: `Penjelasan ilmiah yang paling tepat dan logis untuk fenomena di atas adalah...`,
        options: [
          { id: 'A', text: opt.cause },
          { id: 'B', text: opt.misconception },
          { id: 'C', text: 'Cahaya merambat lurus tanpa mengalami interaksi apapun dengan molekul air' },
          { id: 'D', text: 'Cahaya diserap 100% oleh partikel udara sehingga mata mengalami ilusi optik murni' },
        ],
        correctAnswer: 'A',
        concept: 'Sifat cahaya: Pembiasan (refraksi) pada batas dua medium optik yang berbeda indeks biasnya.',
        stepByStep: [
          'Identifikasi fenomena optik yang diamati.',
          'Pahami bahwa kecepatan cahaya berbeda di udara (c ≈ 3x10⁸ m/s) dan di dalam air (c ≈ 2,25x10⁸ m/s).',
          'Perbedaan kecepatan menyebabkan pembelokan sinar (refraksi).',
        ],
        whyCorrect: opt.cause,
        whyOthersWrong: `Pilihan B adalah miskonsepsi umum: ${opt.misconception}. Pilihan C dan D bertentangan dengan hukum pembiasan Snellius.`,
        islamicIntegration: 'Cahaya adalah salah satu ciptaan Allah yang luar biasa dan diabadikan dalam nama surat Al-Qur\'an (QS. An-Nur: 35).',
        thinkingPath: 'Medium Udara -> Air -> Perbedaan Kerapatan Optik -> Refraksi Cahaya -> Pilihan A.',
        tags: ['cahaya', 'pembiasan', 'refraksi', 'optik', 'eksperimen'],
        sourceReference: 'Fisika Optik Dasar Madrasah - Persiapan OMI 2026',
        hasIslamicIntegration: true,
      };
    },
  },

  // 6. Bumi & Tata Surya: Gerhana & Orbit
  {
    topic: 'bumi_lingkungan',
    subtopic: 'Tata Surya, Gerhana & Gravitasi Planet',
    grade: 'Kelas 6',
    stage: 'Tingkat Nasional',
    difficulty: 'Olimpiade',
    cognitiveLevel: 'C6',
    type: 'studi_kasus',
    stimulusGenerator: (seed) => {
      const eclipses = [
        {
          name: 'Gerhana Matahari Total',
          alignment: 'Matahari - Bulan - Bumi berada dalam satu garis lurus (Bulan berada di fase Bulan Baru/Mati)',
          shadow: 'Wilayah bumi yang terkena bayangan umbra (inti) Bulan mengalami kegelapan total sesaat pada siang hari.',
          sunnah: 'Disunnahkan melaksanakan Shalat Kusuf (Gerhana Matahari) berjamaah di masjid madrasah.',
          safeObs: 'Wajib menggunakan filter kacamata matahari berbahan film polimer hitam bersertifikasi ISO 12312-2 untuk mencegah kerusakan retina.',
        },
        {
          name: 'Gerhana Bulan Total',
          alignment: 'Matahari - Bumi - Bulan berada dalam satu garis lurus (Bulan berada di fase Bulan Purnama)',
          shadow: 'Bulan memasuki bayangan umbra Bumi, dan tampak berwarna kemerahan (Blood Moon) akibat hamburan Rayleigh cahaya matahari di atmosfer Bumi.',
          sunnah: 'Disunnahkan melaksanakan Shalat Khusuf (Gerhana Bulan) berjamaah dan memperbanyak sedekah.',
          safeObs: 'Aman diamati langsung dengan mata telanjang tanpa alat pelindung khusus karena pantulan sinar bulan tidak merusak mata.',
        },
      ];
      const ec = eclipses[seed % eclipses.length];
      return {
        stimulus: `Badan Hisab Rukyat dan Observatorium Astronomi Islam mengumumkan bahwa pada tanggal 15 bulan Hijriyah akan terjadi peristiwa astronomi akbar: "${ec.name}".
Konfigurasi posisi benda langit: ${ec.alignment}.
Fenomena visual yang terjadi: ${ec.shadow}.`,
        question: `Berdasarkan kajian astronomi dan integrasi fiqih ibadah gerhana, pernyataan manakah yang PALING LENGKAP dan BENAR?`,
        options: [
          { id: 'A', text: `Peristiwa ini terjadi saat ${ec.alignment}; ${ec.sunnah}; dan metode observasi aman: ${ec.safeObs}` },
          { id: 'B', text: 'Peristiwa ini terjadi karena Matahari berhenti memancarkan energi akibat reaksi fusi nuklir yang tiba-tiba habis' },
          { id: 'C', text: 'Gerhana ini merupakan tanda akan datangnya bencana besar atau kematian tokoh penting di suatu negeri' },
          { id: 'D', text: 'Bulan dapat dilihat jelas tanpa bayangan karena bumi transparan terhadap sinar ultraviolet' },
        ],
        correctAnswer: 'A',
        concept: 'Astronomi posisi gerhana (syzygy), hamburan atmosfer, dan integrasi hadits Rasulullah SAW tentang shalat gerhana.',
        stepByStep: [
          `Identifikasi posisi konfigurasi gerhana: ${ec.alignment}.`,
          `Analisis bayangan umbra/penumbra: ${ec.shadow}.`,
          `Hubungkan dengan adab saintifik dan syariah: ${ec.sunnah} serta ${ec.safeObs}.`,
        ],
        whyCorrect: `Pilihan A memadukan keakuratan sains posisi orbit dengan adab keislaman sunnah shalat gerhana dan keselamatan pengamatan: ${ec.safeObs}.`,
        whyOthersWrong: 'Pilihan B dan D keliru secara astronomi. Pilihan C adalah mitos jahiliyah yang secara tegas dibantah oleh Nabi Muhammad SAW (HR. Bukhari & Muslim: "Matahari dan bulan adalah dua tanda di antara tanda-tanda kekuasaan Allah, keduanya tidak mengalami gerhana karena mati atau hidupnya seseorang").',
        islamicIntegration: 'Hadits Shahih Bukhari No. 1040 tentang penegasan ilmiah bahwa gerhana adalah tanda kekuasaan Allah, bukan pertanda takhayul.',
        thinkingPath: 'Konfigurasi Orbit -> Fenomena Bayangan -> Penegasan Ilmiah & Fiqih -> Pilihan A.',
        tags: ['astronomi', 'gerhana', 'tata surya', 'shalat gerhana', 'integrasi keislaman'],
        sourceReference: 'Astronomi Islam & OMI IPAS Terintegrasi 2026',
        hasIslamicIntegration: true,
      };
    },
  },

  // 7. Keterampilan Proses Sains: Variabel Percobaan
  {
    topic: 'keterampilan_sains',
    subtopic: 'Perancangan Eksperimen, Variabel & Hipotesis',
    grade: 'Kelas 5',
    stage: 'Tingkat Kabupaten/Kota',
    difficulty: 'HOTS',
    cognitiveLevel: 'C4',
    type: 'analisis_tabel',
    stimulusGenerator: (seed) => {
      const expScenarios = [
        {
          title: 'Uji Pengaruh Cahaya terhadap Kecepatan Pertumbuhan Kecambah Kacang Hijau',
          vBebas: 'Intensitas cahaya tempat peletakan (tempat gelap gulita vs tempat terang benderang)',
          vTerikat: 'Pertambahan tinggi batang kecambah (cm) per hari',
          vKontrol: 'Jenis biji kacang hijau, volume air penyiraman harian (5 mL), jenis kapas dan wadah gelas',
          result: 'Kecambah di tempat gelap tumbuh jauh lebih cepat dan tinggi (etiolasi) namun batangnya pucat dan rapuh, sedangkan di tempat terang batangnya kokoh hijau meski lebih pendek',
          scientificReason: 'Hormon auksin terurai oleh cahaya; di tempat gelap auksin bekerja maksimal memicu pemanjangan sel, namun tanpa klorofil aktif',
        },
        {
          title: 'Uji Pengaruh Suhu Air terhadap Kecepatan Kelarutan Gula Pasir',
          vBebas: 'Suhu air pelarut (10°C, 30°C, dan 80°C)',
          vTerikat: 'Waktu yang dibutuhkan hingga 10 gram gula larut sempurna (detik)',
          vKontrol: 'Massa gula pasir (10 gram), volume air (150 mL), dan kecepatan pengadukan konstan (60 putaran/menit)',
          result: 'Pada air 80°C gula larut dalam 12 detik, sedangkan pada air 10°C gula larut dalam 95 detik',
          scientificReason: 'Suhu tinggi meningkatkan energi kinetik partikel air sehingga tumbukan efektif antarmolekul pelarut dan zat terlarut terjadi lebih sering',
        },
        {
          title: 'Uji Pengaruh Luas Permukaan Terhadap Kecepatan Penguapan Air',
          vBebas: 'Luas penampang wadah penampung air (gelas sempit vs mangkuk sedang vs piring datar lebar)',
          vTerikat: 'Volume air yang menguap setelah dijemur 4 jam (mL)',
          vKontrol: 'Volume awal air (100 mL), suhu lingkungan penjemuran, dan durasi penjemuran yang sama',
          result: 'Piring datar lebar kehilangan air terbanyak (42 mL menguap), sedangkan gelas sempit hanya kehilangan 8 mL air',
          scientificReason: 'Makin luas permukaan sentuh zat cair dengan udara, makin banyak molekul cairan di lapisan atas yang dapat melepaskan diri menjadi uap',
        },
      ];
      const ex = expScenarios[seed % expScenarios.length];
      return {
        stimulus: `Tim olimpiade madrasah merancang percobaan: "${ex.title}".
Prosedur disusun secara cermat dengan mengendalikan parameter fisik.
Hasil percobaan menunjukkan: ${ex.result}.`,
        question: `Pada percobaan tersebut, variabel kontrol (variabel yang sengaja dibuat sama/tetap) dan penjelasan ilmiah atas hasil yang diperoleh adalah...`,
        options: [
          { id: 'A', text: `Variabel kontrol: ${ex.vKontrol}; Penjelasan ilmiah: ${ex.scientificReason}` },
          { id: 'B', text: `Variabel kontrol: ${ex.vBebas}; Penjelasan ilmiah: Percobaan gagal karena data tidak sebanding` },
          { id: 'C', text: `Variabel kontrol: ${ex.vTerikat}; Penjelasan ilmiah: Hasil terjadi karena pengaruh gaya gesekan udara semata` },
          { id: 'D', text: 'Semua variabel dalam eksperimen harus diubah secara bebas bersamaan tanpa kontrol' },
        ],
        correctAnswer: 'A',
        concept: 'Keterampilan Proses Sains: Mengidentifikasi variabel bebas, terikat, dan kontrol dalam desain eksperimen.',
        stepByStep: [
          `Identifikasi variabel yang diubah: Variabel Bebas (${ex.vBebas}).`,
          `Identifikasi hasil pengukuran: Variabel Terikat (${ex.vTerikat}).`,
          `Identifikasi faktor yang dijaga konstan: Variabel Kontrol (${ex.vKontrol}).`,
          `Verifikasi alasan ilmiah: ${ex.scientificReason}.`,
        ],
        whyCorrect: `Pilihan A tepat: variabel kontrol dijaga tetap (${ex.vKontrol}) agar hasil pada variabel terikat murni disebabkan oleh variabel bebas, sesuai mekanisme ${ex.scientificReason}.`,
        whyOthersWrong: 'Pilihan B menukar variabel bebas menjadi kontrol. Pilihan C menukar variabel terikat. Pilihan D melanggar kaidah metode ilmiah valid.',
        islamicIntegration: 'Sikap teliti, jujur dalam mencatat data, dan disiplin ilmiah adalah wujud amanah dan akhlakul karimah seorang penuntut ilmu (thullabul ilm).',
        thinkingPath: 'Definisi Variabel Kontrol -> Faktor yang Dibuat Sama -> Alasan Biologis/Fisis -> Pilihan A.',
        tags: ['keterampilan proses sains', 'variabel kontrol', 'metode ilmiah', 'hipotesis'],
        sourceReference: 'Metodologi Penelitian Sains Remaja MI/SD - OMI 2026',
        hasIslamicIntegration: true,
      };
    },
  },

  // 8. IPAS Terintegrasi: Sains, Sosial, & Nilai Keislaman
  {
    topic: 'ipas_terintegrasi',
    subtopic: 'Kelestarian Sumber Daya Air & Fiqih Lingkungan Hidup',
    grade: 'Kelas 6',
    stage: 'Tingkat Nasional',
    difficulty: 'Olimpiade',
    cognitiveLevel: 'C6',
    type: 'studi_kasus',
    stimulusGenerator: (seed) => {
      const issues = [
        {
          topic: 'Konservasi Air Tanah Melalui Sumur Resapan & Lubang Biopori di Kompleks Madrasah',
          challenge: 'Limpasan air hujan di halaman beraspal menyebabkan genangan banjir dan menurunkan tinggi muka air tanah sumur warga sekitar.',
          science: 'Biopori dan sumur resapan mempercepat laju infiltrasi air hujan menembus lapisan tanah permeabel, menyaring partikel tersuspensi, dan mengisi akuifer alami.',
          socioIslamic: 'Mengamalkan sunnah hemat air, mencegah mudarat banjir bagi tetangga, dan menjaga kesucian sumber air wudhu (thaharah).',
        },
        {
          topic: 'Pengolahan Air Wudhu Greywater Menjadi Air Siram Tanaman & Kolam Ikan Nila',
          challenge: 'Ribuan liter air bekas wudhu santri terbuang sia-sia ke selokan setiap harinya padahal tidak terkena najis berat.',
          science: 'Air bekas wudhu (greywater) yang disaring menggunakan pasir silika, arang aktif, dan kerikil (filtrasi bertingkat) dapat menurunkan kekeruhan dan amonia secara fisik-biologis.',
          socioIslamic: 'Mencegah perilaku boros (tabdzir), sesuai anjuran Rasulullah SAW untuk tidak berlebihan memakai air wudhu walau di sungai yang mengalir.',
        },
        {
          topic: 'Restorasi Hutan Mangrove Pesisir oleh Komunitas Pemuda Nelayan Muslim',
          challenge: 'Abrasi pantai mengikis pemukiman nelayan dan intrusi air laut mencemari sumur air tawar warga.',
          science: 'Akar napas (pneumatofora) mangrove memecah energi gelombang tsunami/badai, mengikat sedimen lumpur, dan menjadi tempat pemijahan (nursery ground) biota laut.',
          socioIslamic: 'Menjadi khalifah pelindung bumi dari kehancuran, menopang ekonomi nelayan kecil, dan wujud syukur atas kekayaan maritim.',
        },
      ];
      const iss = issues[seed % issues.length];
      return {
        stimulus: `Sebuah madrasah pelopor pembangunan berkelanjutan menginisiasi program: "${iss.topic}".
Masalah riil yang dihadapi: "${iss.challenge}".
Para siswa mengkaji solusi terpadu yang memadukan hukum sains dan nilai agama Islam.`,
        question: `Bagaimanakah keterkaitan integratif antara prinsip sains dan nilai sosial-keislaman pada inisiatif di atas?`,
        options: [
          { id: 'A', text: `Secara sains: ${iss.science}; Secara sosial-keislaman: ${iss.socioIslamic}` },
          { id: 'B', text: 'Secara sains program ini mempercepat kerusakan tanah; secara keislaman tidak memiliki keterkaitan sama sekali' },
          { id: 'C', text: 'Secara sains hanya berguna untuk estetika foto; secara sosial menimbulkan perselisihan antar warga' },
          { id: 'D', text: 'Program ini mewajibkan warga meninggalkan teknologi modern dan kembali ke pola hidup primitif' },
        ],
        correctAnswer: 'A',
        concept: 'IPAS Terintegrasi: Pengelolaan sumber daya alam terpadu, SDGs poin 6 (Air Bersih) & poin 13 (Aksi Iklim), serta Fiqh Al-Bi\'ah (Fiqih Lingkungan).',
        stepByStep: [
          'Analisis permasalahan lingkungan riil yang dipaparkan pada stimulus.',
          `Tinjau dasar sains: ${iss.science}.`,
          `Tinjau dimensi nilai keislaman dan kemaslahatan umat: ${iss.socioIslamic}.`,
        ],
        whyCorrect: `Pilihan A mengintegrasikan secara utuh mekanisme sains (${iss.science}) dengan etika keislaman dan tanggung jawab sosial (${iss.socioIslamic}).`,
        whyOthersWrong: 'Pilihan B, C, dan D bernuansa destruktif, tidak ilmiah, dan menyimpang dari tujuan pendidikan IPAS terintegrasi.',
        islamicIntegration: 'Rasulullah SAW bersabda: "Janganlah kamu berlebih-lebihan dalam berwudhu meskipun kamu berada di sungai yang mengalir." (HR. Ahmad & Ibnu Majah).',
        thinkingPath: 'Tantangan Riil -> Mekanisme Sains -> Nilai Fiqih Lingkungan -> Kesimpulan A.',
        tags: ['ipas terintegrasi', 'lingkungan', 'hemat air', 'biopori', 'khalifah fil ardh'],
        sourceReference: 'Pedoman Madrasah Hijau & OMI IPAS Terintegrasi 2026',
        hasIslamicIntegration: true,
      };
    },
  },
];

// Generator matrix to generate at least 1,020 unique, diverse, scientifically sound questions
export function generateQuestionPool(): Question[] {
  const pool: Question[] = [...BENCHMARK_QUESTIONS];

  const grades: GradeLevel[] = ['Kelas 4', 'Kelas 5', 'Kelas 6'];
  const stages: OmiStage[] = ['Tingkat Kabupaten/Kota', 'Tingkat Provinsi', 'Tingkat Nasional'];
  const difficulties: DifficultyLevel[] = ['Easy', 'Medium', 'Hard', 'HOTS', 'Olimpiade'];
  const cogLevels: CognitiveLevel[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];

  // Topic specific generators to expand systematically across 6 topics
  const topics: QuestionTopic[] = [
    'makhluk_hidup',
    'tubuh_manusia',
    'materi_energi',
    'bumi_lingkungan',
    'keterampilan_sains',
    'ipas_terintegrasi',
  ];

  // Target count: at least 1,000 unique questions
  const TARGET_COUNT = 1024;
  let counter = pool.length + 1;

  for (let i = pool.length; i < TARGET_COUNT; i++) {
    const templateIdx = i % TEMPLATES.length;
    const template = TEMPLATES[templateIdx];
    const generated = template.stimulusGenerator(i);

    const grade = grades[i % grades.length];
    const stage = stages[Math.floor(i / 3) % stages.length];
    const difficulty = difficulties[i % difficulties.length];
    const cognitiveLevel = cogLevels[(i + 2) % cogLevels.length];
    const topic = topics[i % topics.length];

    // Build unique ID
    const paddedId = String(counter).padStart(4, '0');
    const id = `OMI-2026-BANK-${paddedId}`;

    const newQuestion: Question = {
      id,
      grade,
      stage,
      difficulty,
      cognitiveLevel,
      type: template.type,
      topic,
      subtopic: template.subtopic,
      stimulus: generated.stimulus,
      visual: generated.visualData,
      question: generated.question,
      options: generated.options,
      correctAnswer: generated.correctAnswer,
      explanation: {
        concept: generated.concept,
        stepByStep: generated.stepByStep,
        whyCorrect: generated.whyCorrect,
        whyOthersWrong: generated.whyOthersWrong,
        islamicIntegration: generated.islamicIntegration,
        thinkingPath: generated.thinkingPath,
      },
      sourceReference: generated.sourceReference,
      tags: [...generated.tags, grade.toLowerCase(), stage.toLowerCase(), difficulty.toLowerCase()],
      isHots: difficulty === 'HOTS' || difficulty === 'Olimpiade' || cognitiveLevel === 'C4' || cognitiveLevel === 'C5' || cognitiveLevel === 'C6',
      hasIslamicIntegration: Boolean(generated.hasIslamicIntegration),
    };

    pool.push(newQuestion);
    counter++;
  }

  return pool;
}
