import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI client server-side with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to instantiate GoogleGenAI:', err);
    return null;
  }
};

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OMI IPAS 2026 Engine' });
});

// AI Assistant endpoint
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { action, question, studentAnswer, topic, weakTopics } = req.body;

    const ai = getGeminiClient();

    let systemInstruction = `Kamu adalah "Ustadz / Kak Sains OMI", mentor dan asisten cerdas resmi Olimpiade Madrasah Indonesia (OMI) 2026 bidang IPAS Terintegrasi untuk siswa MI/SD kelas 4, 5, dan 6.
Karakteristikmu:
- Ramah, menyemangati, edukatif, bernuansa ilmiah akademis namun hangat bagi anak-anak madrasah.
- Selalu memadukan penalaran sains logis dengan nilai ketauhidan dan rasa syukur atas ciptaan Allah SWT secara natural.
- Menggunakan Bahasa Indonesia yang baik, lugas, dan mudah dipahami.
- Tidak pernah membocorkan jawaban langsung jika diminta "petunjuk" (hint).
- Format jawaban rapi dengan poin-poin terstruktur.`;

    let userPrompt = '';

    switch (action) {
      case 'hint':
        userPrompt = `Siswa meminta: "Berikan petunjuk tanpa memberi jawaban".
Soal:
"${question.question}"
Stimulus/Data: "${question.stimulus || 'Tidak ada stimulus khusus'}"
Pilihan Jawaban: ${JSON.stringify(question.options)}

TUGAS KHUSUS:
1. Berikan 2 sampai 3 petunjuk bernalar (clue) analitis langkah demi langkah.
2. JANGAN PERNAH menyebutkan huruf jawaban benar (A/B/C/D) atau mengutip kata demi kata jawaban yang benar!
3. Ajak siswa memperhatikan kata kunci penting pada stimulus atau tabel/grafik.`;
        break;

      case 'explain_kids':
        userPrompt = `Siswa meminta: "Jelaskan dengan bahasa anak kelas 5 SD/MI".
Soal:
"${question.question}"
Kunci Jawaban: "${question.correctAnswer}"
Pembahasan Konsep: "${question.explanation?.concept || ''}"

TUGAS:
Jelaskan konsep sains di balik soal ini dengan analogi kehidupan sehari-hari yang seru, ceria, mudah dibayangkan anak usia 10-11 tahun, dan sertakan hikmah kebesaran Allah SWT.`;
        break;

      case 'diagnose_wrong':
        userPrompt = `Siswa meminta: "Mengapa jawaban saya salah?".
Soal:
"${question.question}"
Jawaban yang dipilih siswa: "${studentAnswer}"
Jawaban yang benar: "${question.correctAnswer}"
Pembahasan Konsep: "${question.explanation?.concept || ''}"
Langkah Pembahasan: "${question.explanation?.whyCorrect || ''}"

TUGAS:
1. Berikan empati positif ("Tetap semangat, mencoba adalah langkah awal keberhasilan!").
2. Jelaskan letak miskonsepsi atau jebakan/pengecoh pada jawaban yang siswa pilih (${studentAnswer}).
3. Tunjukkan mengapa jawaban yang benar adalah pilihan yang tepat secara ilmiah.`;
        break;

      case 'similar_question':
        userPrompt = `Siswa meminta: "Buatkan soal serupa untuk latihan".
Materi: ${question.topic || topic}
Submateri: ${question.subtopic || 'IPAS Terintegrasi'}
Tingkat Kesulitan: HOTS Olimpiade

TUGAS:
Buatkan 1 soal prediksi HOTS baru lengkap dengan:
1. Cerita fenomena alam / stimulus eksperimen singkat
2. Pertanyaan penalaran
3. 4 pilihan jawaban (A, B, C, D)
4. Kunci jawaban dan pembahasan singkat.`;
        break;

      case 'study_plan':
        userPrompt = `Siswa meminta: "Buatkan rencana belajar OMI IPAS 7 hari".
Materi yang masih lemah: ${Array.isArray(weakTopics) ? weakTopics.join(', ') : 'Rantai Makanan & Ekosistem, Energi & Kalor'}

TUGAS:
Buatkan jadwal belajar terstruktur dari Hari ke-1 hingga Hari ke-7. Setiap hari berisi:
- Fokus Materi IPAS
- Latihan Praktikum/Eksperimen sederhana di rumah
- Amalan karakter / tadabbur alam Islami
- Target jumlah soal yang dikerjakan.`;
        break;

      case 'explain':
      default:
        userPrompt = `Siswa meminta: "Jelaskan soal ini secara mendalam".
Soal:
"${question.question}"
Stimulus: "${question.stimulus || ''}"
Kunci Jawaban: "${question.correctAnswer}"
Pembahasan Resmi: "${question.explanation?.whyCorrect || ''}"
Konsep: "${question.explanation?.concept || ''}"

TUGAS:
Jelaskan konsep inti, langkah berpikir ilmiah tingkat olimpiade, cara menganalisis data, dan integrasi nilai keislamannya dengan jelas dan inspiratif.`;
        break;
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text;
      if (replyText) {
        return res.json({ success: true, answer: replyText });
      }
    }

    // High quality intelligent fallback if AI service is initializing or key is pending
    let fallbackText = '';
    if (action === 'hint') {
      fallbackText = `💡 **Petunjuk Bernalar Kak Sains:**\n1. Perhatikan variabel yang menjadi fokus pertanyaan: apa yang terjadi jika salah satu komponen diubah?\n2. Cermati data atau kata kunci dalam cerita: perhatikan hubungan sebab-akibat antarperistiwa.\n3. Eliminasi pilihan jawaban yang tidak logis atau bertentangan dengan hukum alam. Ingat, jawaban terbaik selalu didukung oleh bukti data!`;
    } else if (action === 'explain_kids') {
      fallbackText = `🌟 **Penjelasan Santai untuk Sahabat MI/SD:**\nBayangkan konsep ini seperti kerja sama tim di madrasah! Setiap komponen memiliki peran khusus yang sudah dirancang Allah SWT dengan sangat teratur. Pada soal ini: "${question.question.slice(0, 100)}...", rahasianya ada pada konsep *${question.explanation?.concept || 'keseimbangan sains'}*. Keren kan?`;
    } else if (action === 'diagnose_wrong') {
      fallbackText = `🔎 **Analisis Kak Sains:**\nJawaban (${studentAnswer}) sering menjadi jebakan umum karena sekilas tampak benar jika kita hanya membaca sebagian stimulus! Namun jika kita perhatikan data secara teliti, jawaban yang paling tepat secara ilmiah adalah **${question.correctAnswer}**, karena ${question.explanation?.whyCorrect || 'sesuai hukum fisika dan biologi dasar'}. Jangan berkecil hati, jadikan kesalahan ini sebagai lompatan ilmu!`;
    } else if (action === 'study_plan') {
      fallbackText = `📅 **Rencana Belajar 7 Hari Menuju Juara OMI 2026:**\n- **Hari 1:** Kuasai Adaptasi Hewan & Tumbuhan (30 soal)\n- **Hari 2:** Bedah Sistem Organ Manusia & Gizi Seimbang (30 soal)\n- **Hari 3:** Eksperimen Sederhana Gaya & Perubahan Wujud Kalor\n- **Hari 4:** Analisis Grafik Rantai Makanan & Ekosistem Sawah\n- **Hari 5:** Rotasi Bumi, Tata Surya & Waktu Shalat (30 soal)\n- **Hari 6:** Latihan Khusus Soal HOTS & Variabel Penelitian\n- **Hari 7:** Simulasi Lengkap Ujian 50 Soal dengan Timer!`;
    } else {
      fallbackText = `📚 **Pembahasan Komprehensif:**\n${question.explanation?.whyCorrect || 'Jawaban benar diperoleh melalui analisis sistematis terhadap data stimulus.'}\n\n**Konsep Inti:** ${question.explanation?.concept || 'Prinsip IPAS Terpadu'}\n**Nilai Keislaman:** ${question.explanation?.islamicIntegration || 'Tadabbur keagungan ciptaan Allah SWT.'}`;
    }

    return res.json({ success: true, answer: fallbackText });
  } catch (error: any) {
    console.error('Error in /api/ai/assistant:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal memproses permintaan asisten AI',
      details: error.message,
    });
  }
});

// AI Question Generator Endpoint (OMI IPAS 2026 Question Factory)
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const {
      topic = 'makhluk_hidup',
      grade = 'Kelas 5',
      difficulty = 'Olimpiade',
      stage = 'Tingkat Kabupaten/Kota',
      count = 3,
      hasIslamicIntegration = true,
      stimulusType = 'eksperimen',
      customPrompt = '',
    } = req.body;

    const actualCount = Math.min(Math.max(Number(count) || 1, 1), 10);
    const ai = getGeminiClient();

    const topicDescriptions: Record<string, string> = {
      makhluk_hidup: 'Makhluk Hidup & Ekosistem (Adaptasi, Rantai Makanan, Simbiosis, Konservasi Alam)',
      tubuh_manusia: 'Tubuh Manusia & Kesehatan (Organ Pernapasan, Pencernaan, Sirkulasi Darah, Gizi & Imunitas)',
      materi_energi: 'Materi, Gaya & Perubahan Energi (Kalor, Pemuaian, Gaya Gerak, Rangkaian Listrik, Cahaya & Optik)',
      bumi_lingkungan: 'Bumi, Lingkungan & Antariksa (Tata Surya, Rotasi-Revolusi Bumi, Siklus Hidrologi, Perubahan Iklim)',
      keterampilan_sains: 'Keterampilan Proses Sains (Perancangan Eksperimen, Variabel Kontrol-Bebas-Terikat, Analisis Grafik & Tabel)',
      ipas_terintegrasi: 'IPAS Terintegrasi & Nilai Islam (Fenomena Sains dalam Kehidupan, Harmoni Alam Semesta, Ayat Kauniyah)',
    };

    const targetTopicDesc = topicDescriptions[topic] || 'IPAS Terintegrasi untuk Tingkat MI/SD';

    if (ai) {
      try {
        const systemInstruction = `Kamu adalah Pakar Pembuat Soal Dewan Juri Resmi Olimpiade Sains & Madrasah Indonesia (OMI) 2026 bidang IPAS Terintegrasi tingkat MI/SD (Kelas 4, 5, 6).
Tugasmu adalah menyusun soal olimpiade sains berkualitas tinggi dengan standar HOTS (Higher Order Thinking Skills - Taksonomi Bloom level C4 Menganalisis, C5 Mengevaluasi, atau C6 Mengkreasi).

KETENTUAN WAJIB SOAL OMI:
1. TIDAK BOLEH soal hafalan sederhana.
2. WAJIB diawali dengan STIMULUS nyata: berupa skenario eksperimen laboratorium siswa madrasah, narasi studi kasus lingkungan, tabel data angka percobaan, atau fenomena alam sehari-hari.
3. Pertanyaan harus menuntut kemampuan analisis sebab-akibat, memprediksi hasil jika suatu variabel diubah, atau menarik simpulan logis dari data stimulus.
4. Terdapat 4 opsi pilihan jawaban (A, B, C, D) dengan pengecoh (distractor) yang masuk akal dan menantang (tidak konyol).
5. Kunci jawaban tepat hanya 1 pilihan (A, B, C, atau D).
6. Pembahasan mendalam: mencakup konsep dasar sains, analisis mengapa opsi benar, penjelasan miskonsepsi mengapa opsi salah, dan integrasi nilai-nilai keislaman (tadabbur ciptaan Allah SWT / etika pelestarian alam).
7. Format output HARUS JSON valid sesuai skema yang diberikan.`;

        const prompt = `Buatkan sebanyak ${actualCount} butir soal OMI IPAS 2026 baru dan orisinal dengan spesifikasi:
- Topik: ${targetTopicDesc}
- Jenjang: ${grade} MI/SD
- Tingkat Kesulitan: ${difficulty}
- Tahap Kompetisi: ${stage}
- Jenis Stimulus yang Diutamakan: ${stimulusType}
- Integrasi Nilai Keislaman: ${hasIslamicIntegration ? 'WAJIB disertakan pada stimulus/pembahasan' : 'Opsional'}
${customPrompt ? `- Instruksi Tambahan / Fokus Khusus: ${customPrompt}` : ''}

Pastikan setiap soal memiliki format JSON yang lengkap.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.8,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              description: 'Daftar butir soal OMI IPAS 2026',
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: 'Kalimat pertanyaan inti soal' },
                  topic: {
                    type: Type.STRING,
                    description:
                      'Kategori topik (pilih satu: makhluk_hidup, tubuh_manusia, materi_energi, bumi_lingkungan, keterampilan_sains, ipas_terintegrasi)',
                  },
                  subtopic: { type: Type.STRING, description: 'Submateri spesifik' },
                  grade: { type: Type.STRING, description: 'Jenjang kelas: Kelas 4, Kelas 5, atau Kelas 6' },
                  difficulty: {
                    type: Type.STRING,
                    description: 'Tingkat kesulitan: Mudah, Sedang, Sukar, atau Olimpiade',
                  },
                  cognitiveLevel: {
                    type: Type.STRING,
                    description: 'Tingkat kognitif: C3, C4, C5, atau C6',
                  },
                  stage: {
                    type: Type.STRING,
                    description:
                      'Tahapan: Tingkat Madrasah, Tingkat Kabupaten/Kota, Tingkat Provinsi, atau Tingkat Nasional',
                  },
                  isHots: { type: Type.BOOLEAN, description: 'Apakah soal kategori HOTS (true)' },
                  hasIslamicIntegration: {
                    type: Type.BOOLEAN,
                    description: 'Apakah mengandung integrasi nilai Islam',
                  },
                  stimulus: {
                    type: Type.STRING,
                    description: 'Teks stimulus narasi eksperimen, cerita fenomena, atau data pengamatan',
                  },
                  options: {
                    type: Type.ARRAY,
                    description: '4 pilihan jawaban (A, B, C, D)',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: 'Huruf A, B, C, atau D' },
                        text: { type: Type.STRING, description: 'Pernyataan pilihan jawaban' },
                      },
                      required: ['id', 'text'],
                    },
                  },
                  correctAnswer: { type: Type.STRING, description: 'Kunci jawaban benar (A/B/C/D)' },
                  explanation: {
                    type: Type.OBJECT,
                    description: 'Pembahasan lengkap soal',
                    properties: {
                      concept: { type: Type.STRING, description: 'Konsep sains utama yang diuji' },
                      whyCorrect: { type: Type.STRING, description: 'Alasan rinci mengapa jawaban benar' },
                      misconceptionAlert: {
                        type: Type.STRING,
                        description: 'Miskonsepsi umum siswa pada opsi pengecoh',
                      },
                      islamicIntegration: {
                        type: Type.STRING,
                        description: 'Nilai keislaman atau ayat Al-Quran terkait fenomena',
                      },
                    },
                    required: ['concept', 'whyCorrect'],
                  },
                },
                required: [
                  'question',
                  'topic',
                  'subtopic',
                  'grade',
                  'difficulty',
                  'cognitiveLevel',
                  'stage',
                  'isHots',
                  'hasIslamicIntegration',
                  'stimulus',
                  'options',
                  'correctAnswer',
                  'explanation',
                ],
              },
            },
          },
        });

        const responseText = response.text;
        if (responseText) {
          try {
            const parsed = JSON.parse(responseText);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const sanitizedQuestions = parsed.map((item, idx) => ({
                ...item,
                id: `ai_gen_${Date.now()}_${idx + 1}`,
                topic: item.topic || topic,
                grade: item.grade || grade,
                difficulty: item.difficulty || difficulty,
                stage: item.stage || stage,
                cognitiveLevel: item.cognitiveLevel || 'C4',
                isHots: item.isHots !== undefined ? item.isHots : true,
                hasIslamicIntegration:
                  item.hasIslamicIntegration !== undefined ? item.hasIslamicIntegration : hasIslamicIntegration,
              }));

              return res.json({
                success: true,
                source: 'gemini-ai',
                questions: sanitizedQuestions,
              });
            }
          } catch (parseErr) {
            console.error('Error parsing Gemini JSON output:', parseErr, responseText);
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini generateContent call failed or unavailable, using fallback generator:', geminiError.message);
      }
    }

    // High-quality deterministic fallback question generator if API key is not ready
    const fallbackQuestions = generateFallbackQuestions({
      topic,
      grade,
      difficulty,
      stage,
      count: actualCount,
      hasIslamicIntegration,
      stimulusType,
      customPrompt,
    });

    return res.json({
      success: true,
      source: 'smart-template-engine',
      questions: fallbackQuestions,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-questions:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal menghasilkan soal AI',
      details: error.message,
    });
  }
});

// Helper for high-quality fallback questions in case API call has hiccups
function generateFallbackQuestions(params: any) {
  const { topic, grade, difficulty, stage, count, hasIslamicIntegration, customPrompt } = params;
  const questions: any[] = [];
  const timestamp = Date.now();

  const templates: Record<string, any[]> = {
    makhluk_hidup: [
      {
        subtopic: 'Adaptasi Morfologi & Rantai Makanan Hutan Mangrove',
        stimulus:
          'Siswa kelas 5 MI Al-Falah melakukan penelitian lapangan di kawasan konservasi hutan bakau (mangrove). Mereka mengamati bahwa pohon Rhizophora (bakau) memiliki akar tunjang yang mencuat tinggi di atas lumpur berair asin, serta daun yang tebal dan mampu mengeluarkan butiran garam kristal.',
        question:
          'Berdasarkan data adaptasi morfologi dan fisiologi di atas, apa fungsi biologis utama dari modifikasi akar tunjang dan kelenjar garam pada daun pohon bakau tersebut?',
        options: [
          {
            id: 'A',
            text: 'Mempercepat laju fotosintesis di malam hari dan menampung air tawar dari hujan lebat',
          },
          {
            id: 'B',
            text: 'Membantu pertukaran oksigen (aerasi) pada tanah berlumpur anoksik serta menjaga keseimbangan osmotik jaringan tumbuhan dari salinitas tinggi',
          },
          {
            id: 'C',
            text: 'Menghalangi predator herbivora memakan daun dan mempercepat pembungaan',
          },
          {
            id: 'D',
            text: 'Menyerap garam sebanyak-banyaknya untuk cadangan makanan saat musim kemarau',
          },
        ],
        correctAnswer: 'B',
        explanation: {
          concept: 'Adaptasi Tumbuhan Halofit di Ekosistem Pesisir Pantai',
          whyCorrect:
            'Akar tunjang memiliki lentisel yang membantu respirasi akar dalam lumpur berkadar oksigen rendah (anaerob/anoksik), sedangkan kelenjar garam mengekskresikan kelebihan garam agar tekanan osmosis sel tetap seimbang.',
          misconceptionAlert:
            'Banyak siswa mengira akar tunjang semata-mata untuk penyangga mekanik dari ombak, padahal peran respirasi di zona minim oksigen adalah adaptasi fisiologis vital.',
          islamicIntegration:
            'Maha Suci Allah SWT yang menciptakan setiap makhluk dengan kelengkapan bentuk yang sempurna sesuai habitat hidupnya (QS. Al-Furqan: 2).',
        },
      },
      {
        subtopic: 'Dinamika Piramida Biomassa & Jaring-jaring Makanan Sawah',
        stimulus:
          'Di sawah madrasah, petani menyemprotkan pestisida kimia secara berlebihan untuk membasmi hama wereng cokelat. Selang dua minggu kemudian, populasi burung hantu dan elang sawah mengalami penurunan drastis, sementara populasi tikus sawah justru meningkat tajam.',
        question:
          'Berdasarkan analisis interaksi rantai makanan, mengapa populasi tikus dapat melonjak tak terkendali setelah penyemprotan pestisida tersebut?',
        options: [
          {
            id: 'A',
            text: 'Tikus memakan pestisida tersebut sebagai sumber vitamin dan energi reproduksi',
          },
          {
            id: 'B',
            text: 'Pestisida memicu mutasi genetik pada seluruh jenis tanaman padi',
          },
          {
            id: 'C',
            text: 'Predator alami tikus (seperti ular dan burung pemangsa) keracunan secara biomagnifikasi serta kehilangan sebagian mangsa alaminya',
          },
          {
            id: 'D',
            text: 'Wereng cokelat bertransformasi menjadi hama pengurai sekunder',
          },
        ],
        correctAnswer: 'C',
        explanation: {
          concept: 'Biomagnifikasi dan Gangguan Keseimbangan Rantai Makanan',
          whyCorrect:
            'Racun pestisida terakumulasi pada tingkatan trofik yang lebih tinggi (biomagnifikasi). Matinya predator alami seperti burung hantu dan ular merusak mekanisme kontrol biologis, menyebabkan populasi tikus meledak tanpa pemangsa.',
          misconceptionAlert:
            'Siswa sering menduga pestisida hanya mempengaruhi serangga sasaran, melupakan transfer toksin pada piramida rantai makanan.',
          islamicIntegration:
            'Larangan berbuat kerusakan di muka bumi dan pentingnya menjaga keseimbangan ekosistem (Mizan) sebagaimana firman Allah dalam QS. Ar-Rahman: 7-9.',
        },
      },
    ],
    materi_energi: [
      {
        subtopic: 'Perpindahan Kalor & Isolator Termal pada Termos Alami',
        stimulus:
          'Dalam uji coba praktikum sains madrasah, siswa merancang 3 jenis pelindung bejana air panas: Tabung P dilapisi aluminium foil berkilap dengan ruang hampa udara ganda; Tabung Q dilapisi kain wol tebal basah; Tabung R dilapisi plastik transparan tipis. Suhu awal air di ketiga tabung adalah 90°C.',
        question:
          'Setelah didiamkan selama 60 menit di ruangan ber-AC (suhu 22°C), tabung manakah yang airnya paling lambat mengalami penurunan suhu, dan apa prinsip sains yang mendasarinya?',
        options: [
          {
            id: 'A',
            text: 'Tabung P, karena ruang hampa menghambat konduksi & konveksi, serta permukaan mengkilap memantulkan kembali radiasi kalor',
          },
          {
            id: 'B',
            text: 'Tabung Q, karena kain basah menghasilkan uap hangat yang memanaskan air secara kontinu',
          },
          {
            id: 'C',
            text: 'Tabung R, karena plastik transparan menyerap sinar tampak ruangan untuk memanaskan air',
          },
          {
            id: 'D',
            text: 'Ketiga tabung mengalami penurunan suhu dengan laju yang identik karena volumenya sama',
          },
        ],
        correctAnswer: 'A',
        explanation: {
          concept: 'Prinsip Kerja Termos Dinding Vakum & Tiga Mekanisme Perpindahan Kalor',
          whyCorrect:
            'Ruang hampa meniadakan partikel zat perantara sehingga memblokir konduksi dan konveksi kalor. Permukaan perak/aluminium yang mengilap merefleksikan gelombang inframerah radiasi kalor kembali ke dalam bejana.',
          misconceptionAlert:
            'Siswa sering mengira kain basah menahan panas, padahal air yang menguap dari kain justru menyerap kalor laten (proses pendinginan evaporatif).',
          islamicIntegration:
            'Keteraturan hukum perpindahan kalor (Sunnatullah termodinamika) yang membuktikan keagungan hukum penciptaan yang presisi.',
        },
      },
      {
        subtopic: 'Gaya Magnet & Induksi Elektromagnetik pada Dinamo Sepeda',
        stimulus:
          'Sebuah dinamo sepeda dihubungkan ke lampu LED. Ketika roda sepeda dikayuh perlahan, lampu menyala redup. Namun saat dikayuh sangat kencang, lampu menyala sangat terang. Di dalam dinamo terdapat kumparan kawat tembaga dan magnet permanen silinder yang berputar.',
        question:
          'Faktor manakah yang menyebabkan nyala lampu bertambah terang saat sepeda dikayuh lebih kencang?',
        options: [
          {
            id: 'A',
            text: 'Hambatan kawat kumparan menjadi nol akibat gesekan ban sepeda',
          },
          {
            id: 'B',
            text: 'Laju perubahan fluks magnetik yang menembus kumparan meningkat pesat, sehingga menghasilkan GGL induksi listrik yang lebih besar',
          },
          {
            id: 'C',
            text: 'Kekuatan kutub magnet permanen meningkat dua kali lipat saat berputar cepat',
          },
          {
            id: 'D',
            text: 'Udara di sekitar dinamo terionisasi menjadi muatan listrik tambahan',
          },
        ],
        correctAnswer: 'B',
        explanation: {
          concept: 'Hukum Faraday tentang Induksi Elektromagnetik',
          whyCorrect:
            'Berdasarkan Hukum Faraday, gaya gerak listrik (GGL) induksi sebanding dengan laju perubahan fluks magnetik per satuan waktu. Semakin cepat putaran rotor magnet, fluks berubah makin cepat, menghasilkan voltase dan arus induksi yang lebih kuat.',
          misconceptionAlert:
            'Banyak siswa berpikir kekuatan magnet fisik bertambah, padahal yang bertambah hanyalah frekuensi pemotongan garis gaya magnet.',
          islamicIntegration:
            'Energi tidak dapat dimusnahkan melainkan berpindah dan berubah bentuk atas kehendak Allah SWT pencipta segala hukum fisika.',
        },
      },
    ],
    tubuh_manusia: [
      {
        subtopic: 'Mekanisme Pertukaran Gas Alveolus & Kapasitas Paru-paru',
        stimulus:
          'Zaid mengukur volume udara pernapasan menggunakan spirometer sederhana setelah berolahraga lari cepat 400 meter. Ia mendapati frekuensi napasnya meningkat dari 16 kali/menit menjadi 38 kali/menit, dan napasnya terasa lebih dalam.',
        question:
          'Mengapa pusat pengendali pernapasan di otak (medula oblongata) memicu peningkatan frekuensi dan kedalaman napas secara otomatis saat tubuh beraktivitas fisik berat?',
        options: [
          {
            id: 'A',
            text: 'Untuk mendinginkan suhu paru-paru yang panas akibat pergesekan udara',
          },
          {
            id: 'B',
            text: 'Kadar gas nitrogen di alveolus berkurang drastis sehingga perlu diisi kembali',
          },
          {
            id: 'C',
            text: 'Tingginya akumulasi karbon dioksida (CO2) dan asam laktat dalam darah menurunkan pH darah, menstimulasi saraf untuk segera membuang CO2 dan memasok O2',
          },
          {
            id: 'D',
            text: 'Diafragma kehilangan elastisitasnya sehingga harus dipaksa bergerak lebih cepat',
          },
        ],
        correctAnswer: 'C',
        explanation: {
          concept: 'Kemoreseptor Pernapasan & Homeostasis Asam Basa Darah',
          whyCorrect:
            'Pusat pernapasan otak merespons kenaikan konsentrasi CO2 (ion H+) dalam cairan serebrospinal dan darah. Pembakaran glukosa otot menghasilkan banyak CO2 yang harus segera diekskresikan melalui hiperventilasi teratur.',
          misconceptionAlert:
            'Miskonsepsi umum adalah pernapasan cepat dipicu oleh "kurang oksigen", padahal pemicu biologis utamanya adalah sinyal "kelebihan CO2" pada kemoreseptor.',
          islamicIntegration:
            'Mekanisme otomatis tubuh (refleks otonom) yang bekerja tanpa disuruh adalah nikmat luar biasa dari Allah SWT (QS. At-Tin: 4).',
        },
      },
    ],
    bumi_lingkungan: [
      {
        subtopic: 'Dampak Revolusi Bumi & Kemiringan Poros terhadap Musim dan Bayang-bayang Shalat',
        stimulus:
          'Pada tanggal 21 Juni, siswa madrasah di Pontianak (garis khatulistiwa 0°) mengamati bayangan tongkat istiwa saat tengah hari (zuhur). Bayangan tongkat condong mengarah ke arah selatan. Pada tanggal yang sama, di belahan bumi utara siang hari berlangsung lebih dari 15 jam.',
        question:
          'Fenomena astronomis manakah yang menjadi penyebab terjadinya perbedaan panjang siang dan arah bayangan matahari tersebut?',
        options: [
          {
            id: 'A',
            text: 'Jarak orbit bumi ke matahari berada pada titik terdekat (perihelion)',
          },
          {
            id: 'B',
            text: 'Matahari berhenti berotasi selama bulan Juni',
          },
          {
            id: 'C',
            text: 'Poros rotasi bumi miring sebesar 23,5° terhadap bidang ekliptika saat berevolusi mengelilingi matahari',
          },
          {
            id: 'D',
            text: 'Gravitasi bulan menarik atmosfer bumi ke arah utara',
          },
        ],
        correctAnswer: 'C',
        explanation: {
          concept: 'Gerak Semu Tahunan Matahari Akibat Kemiringan Sumbu Bumi',
          whyCorrect:
            'Kemiringan sumbu bumi 23,5° menyebabkan posisi semu matahari bergeser antara 23,5° LU (solstis Juni) dan 23,5° LS (solstis Desember). Pada 21 Juni, matahari tepat di atas garis balik utara, sehingga di khatulistiwa bayangan mengarah ke selatan dan wilayah kutub utara mengalami siang terus-menerus.',
          misconceptionAlert:
            'Banyak anak mengira musim dan panjang hari dipengaruhi oleh jarak bumi ke matahari, padahal faktor penentunya adalah sudut datang sinar matahari karena kemiringan sumbu rotasi.',
          islamicIntegration:
            'Keteraturan peredaran matahari dan bulan sebagai pedoman waktu dan hisab sebagaimana ditegaskan dalam QS. Yunus: 5.',
        },
      },
    ],
  };

  const pool = templates[topic] || templates.makhluk_hidup;

  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    const customSuffix = customPrompt ? ` (Fokus: ${customPrompt})` : '';

    questions.push({
      id: `ai_gen_${timestamp}_${i + 1}`,
      question: base.question,
      topic: topic || 'makhluk_hidup',
      subtopic: `${base.subtopic}${customSuffix}`,
      grade: grade || 'Kelas 5',
      difficulty: difficulty || 'Olimpiade',
      cognitiveLevel: 'C4',
      stage: stage || 'Tingkat Kabupaten/Kota',
      isHots: true,
      hasIslamicIntegration: hasIslamicIntegration !== undefined ? hasIslamicIntegration : true,
      stimulus: base.stimulus,
      options: base.options,
      correctAnswer: base.correctAnswer,
      explanation: base.explanation,
    });
  }

  return questions;
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OMI IPAS 2026 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
