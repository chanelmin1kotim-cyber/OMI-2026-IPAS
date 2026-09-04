import React, { useState } from 'react';
import {
  BookOpen,
  Leaf,
  HeartPulse,
  Zap,
  Globe,
  FlaskConical,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
} from 'lucide-react';
import { QuestionTopic } from '../types';
import { TOPIC_LABELS } from '../data/questionStore';

interface TopicExploreViewProps {
  onStartTopicPractice: (topic: QuestionTopic) => void;
}

export const TopicExploreView: React.FC<TopicExploreViewProps> = ({ onStartTopicPractice }) => {
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic>('makhluk_hidup');

  const topicGuides: Record<
    QuestionTopic,
    {
      summary: string;
      subtopics: string[];
      keyConcept: string;
      labExperiment: string;
      islamicInsight: string;
    }
  > = {
    makhluk_hidup: {
      summary:
        'Mempelajari keanekaragaman hayati, adaptasi morfologi & fisiologi, rantai dan jaring-jaring makanan, dinamika populasi, hingga bioakumulasi bahan pencemar.',
      subtopics: [
        'Bentuk paruh, kaki burung, dan adaptasi xerofit/hidrofit',
        'Piramida energi & hukum efisiensi energi 10%',
        'Simbiosis mutualisme, komensalisme, parasitisme',
        'Konservasi in-situ (Taman Nasional) dan ex-situ (Kebun Binatang)',
      ],
      keyConcept:
        'Setiap organisme menduduki relung ekologis (niche) tertentu yang menjaga kestabilan biosfer.',
      labExperiment:
        'Pengamatan jentik nyamuk dan pengaruh pencemaran detergen terhadap kelangsungan hidup organisme air.',
      islamicInsight:
        'QS. Al-Mulk: 3 — Tidak ada yang sia-sia dan tidak seimbang dalam segala ciptaan Allah SWT yang Maha Teratur.',
    },
    tubuh_manusia: {
      summary:
        'Sistem pernapasan, pencernaan, peredaran darah besar & kecil, metabolisme energi, gizi seimbang, dan prinsip hidup sehat menurut sains dan sunnah.',
      subtopics: [
        'Mekanisme pernapasan dada vs pernapasan perut',
        'Alveolus dan difusi oksigen-karbondioksida',
        'Fungsi bilik kiri jantung memompa darah bertekanan tinggi',
        'Enzim pencernaan (Ptialin, Pepsin, Tripsin, Lipase)',
      ],
      keyConcept:
        'Homeostasis: kemampuan fisiologis tubuh mempertahankan kondisi stabil dalam berbagai aktivitas fisik.',
      labExperiment:
        'Uji kandungan glukosa dan protein pada sampel makanan dengan larutan indikator Lugol & Biuret.',
      islamicInsight:
        'Prinsip "Halalan Thayyiban" (Halal lagi baik & bergizi seimbang) sebagai perintah menjaga amanah tubuh.',
    },
    materi_energi: {
      summary:
        'Perubahan wujud zat, azas Black dan perpindahan kalor (konduksi, konveksi, radiasi), gaya dan gerak, hukum Archimedes, listrik, magnet, dan pemantulan cahaya.',
      subtopics: [
        'Hukum Pemantulan Cahaya & Pembiasan pada Lensa Cembung/Cekung',
        'Gaya gesek, gaya gravitasi, dan resultan gaya',
        'Rangkaian seri vs paralel dan hukum Ohm sederhana',
        'Energi terbarukan (PLTS, PLTB, mikrohidro)',
      ],
      keyConcept:
        'Hukum Kekekalan Energi: Energi tidak dapat diciptakan atau dimusnahkan, hanya dapat berubah bentuk.',
      labExperiment:
        'Pengujian daya hantar listrik larutan elektrolit dan non-elektrolit dengan elektroda karbon.',
      islamicInsight:
        'QS. An-Nur: 35 — Perumpamaan cahaya Allah yang menerangi langit dan bumi, sains menyingkap rahasia foton.',
    },
    bumi_lingkungan: {
      summary:
        'Struktur lapisan bumi, siklus hidrologi, rotasi & revolusi bumi terhadap penanggalan Hijriyah dan waktu shalat, gerhana, atmosfer, serta mitigasi bencana.',
      subtopics: [
        'Penentuan awal bulan Hijriyah (Rukyatul Hilal & Imkanur Rukyat)',
        'Siklus air: evaporasi, transpirasi, kondensasi, presipitasi, infiltrasi',
        'Efek rumah kaca alami vs pemanasan global berlebih',
        'Mitigasi gempa bumi tektonik dan tsunami',
      ],
      keyConcept:
        'Kemiringan sumbu bumi 23,5 derajat menghasilkan pergantian musim di belahan bumi utara dan selatan.',
      labExperiment:
        'Simulasi efek rumah kaca menggunakan dua toples kaca berisi termometer di bawah sinar matahari.',
      islamicInsight:
        'QS. Yasin: 38-40 — Matahari dan bulan beredar pada garis edar (falak) yang telah ditetapkan Allah dengan presisi.',
    },
    keterampilan_sains: {
      summary:
        'Metode ilmiah, identifikasi variabel (bebas, terikat, kontrol), perumusan hipotesis, pembuatan tabel dan grafik, serta penarikan kesimpulan logis.',
      subtopics: [
        'Membedakan variabel bebas (dimanipulasi) vs variabel terikat (diukur)',
        'Menentukan variabel kontrol agar pengujian bersifat adil (fair test)',
        'Membaca dan menginterpolasi data grafik garis dan batang',
        'Mengevaluasi kelemahan dalam prosedur percobaan ilmiah',
      ],
      keyConcept:
        'Sains berbasis bukti empiris (evidence-based) dan verifikasi data kuantitatif berulang.',
      labExperiment:
        'Mengukur laju pertumbuhan kecambah kacang hijau pada intensitas cahaya yang divariasikan.',
      islamicInsight:
        'QS. Al-Hujurat: 6 — Tabayyun (verifikasi kebenaran fakta) sebagai fondasi sikap ilmiah seorang ilmuwan muslim.',
    },
    ipas_terintegrasi: {
      summary:
        'Penerapan sains dalam tradisi masyarakat madrasah, etika pelestarian alam, kearifan lokal, teknologi tepat guna, dan integrasi nilai tauhid.',
      subtopics: [
        'Sains di balik arah kiblat dan penentuan waktu shalat fardhu',
        'Pengelolaan air wudhu berkelanjutan (water recycling)',
        'Kearifan lokal subak di Bali dan lumbung pangan tradisi',
        'Etika ihsan terhadap hewan dan tanaman',
      ],
      keyConcept:
        'Sains terintegrasi memadukan akal rasional dan keimanan untuk kemaslahatan umat manusia (Rahmatan lil ‘Alamin).',
      labExperiment:
        'Rancang bangun filter air sederhana menggunakan pasir silika, arang aktif, dan kerikil untuk air wudhu.',
      islamicInsight:
        'QS. Al-Qashash: 77 — Tuntutan berbuat baik dan tidak membuat kerusakan di muka bumi.',
    },
  };

  const currentGuide = topicGuides[selectedTopic];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Bank Materi & Panduan Riset OMI IPAS 2026
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Eksplorasi ringkasan konsep esensial, variabel eksperimen, dan integrasi sains keislaman
        </p>
      </div>

      {/* Topic Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((topicKey) => {
          const info = TOPIC_LABELS[topicKey];
          const isSelected = selectedTopic === topicKey;
          return (
            <button
              key={topicKey}
              onClick={() => setSelectedTopic(topicKey)}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs ring-1 ring-sky-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold line-clamp-1">{info.label.split('&')[0]}</span>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">Pelajari Materi</span>
            </button>
          );
        })}
      </div>

      {/* Active Topic Content Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="rounded-full bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1">
              Materi Terarah OMI 2026
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
              {TOPIC_LABELS[selectedTopic].label}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
              {currentGuide.summary}
            </p>
          </div>

          <button
            onClick={() => onStartTopicPractice(selectedTopic)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-sky-500/20 hover:brightness-105 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Play className="h-4 w-4 fill-white" />
            Latihan Soal Topik Ini
          </button>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subtopik Penting */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-sky-600" />
              Subtopik Kerap Keluar di Olimpiade:
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentGuide.subtopics.map((sub, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <span>{sub}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Konsep Kunci */}
          <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-200">
            <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-amber-600" />
              Konsep Kunci HOTS:
            </h3>
            <p className="text-xs leading-relaxed text-amber-950 font-medium">
              "{currentGuide.keyConcept}"
            </p>
          </div>

          {/* Praktikum Sains */}
          <div className="rounded-2xl bg-emerald-50/50 p-5 border border-emerald-200">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2 mb-3">
              <FlaskConical className="h-4 w-4 text-emerald-600" />
              Eksperimen & Uji Laboratorium:
            </h3>
            <p className="text-xs leading-relaxed text-emerald-950">
              {currentGuide.labExperiment}
            </p>
          </div>

          {/* Integrasi Nilai Islam */}
          <div className="rounded-2xl bg-teal-50/50 p-5 border border-teal-200">
            <h3 className="font-bold text-sm text-teal-900 flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Tadabbur Sains & Nilai Keislaman:
            </h3>
            <p className="text-xs leading-relaxed text-teal-950 italic">
              {currentGuide.islamicInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
