import React from 'react';
import {
  Play,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Layers,
  Flame,
  HelpCircle,
  Zap,
  PlusCircle,
} from 'lucide-react';
import { PracticeMode, QuestionTopic, UserProfile } from '../types';
import { TOPIC_LABELS, getAdaptiveRecommendations, getQuestions } from '../data/questionStore';

interface HomeViewProps {
  profile: UserProfile;
  onOpenSelector: (mode?: PracticeMode) => void;
  onSelectTopic: (topic: QuestionTopic) => void;
  onNavigateView: (view: string) => void;
  onStartAdaptive: () => void;
  onStartQuickCount: (count: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  onOpenSelector,
  onSelectTopic,
  onNavigateView,
  onStartAdaptive,
  onStartQuickCount,
}) => {
  const allQuestions = getQuestions();
  const adaptive = getAdaptiveRecommendations(profile, allQuestions);

  const firstName = profile.name ? profile.name.split(' ')[0] : 'Zaki';
  const accuracyPct =
    profile.totalQuestionsAnswered > 0
      ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsAnswered) * 100)
      : 88;
  const answeredCount = profile.totalQuestionsAnswered > 0 ? profile.totalQuestionsAnswered : 1240;
  const cognitivePoints = profile.points > 0 ? profile.points : 2850;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Greeting Header with User Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Assalamu'alaikum, {firstName}! 👋
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Siap mengasah nalar sains dan menjadi juara OMI IPAS Nasional hari ini?
          </p>
        </div>

        {/* User Badge - Professional Polish */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xs sm:text-sm font-bold text-[#0f172a]">
              {profile.name || 'Ahmad Zaki'}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {profile.school || 'MI Al-Hikmah'} • Kelas {profile.grade}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#0c4a6e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {profile.name
              ? profile.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
              : 'AZ'}
          </div>
        </div>
      </div>

      {/* Stats Grid - 4 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Soal Terjawab */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            Soal Terjawab
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0284c7] my-2">
            {answeredCount.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 self-start px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
            <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
            <span>{profile.streakDays} Day Streak</span>
          </div>
        </div>

        {/* 2. Akurasi Rata-rata */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            Akurasi Rata-rata
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#16a34a] my-2">
            {accuracyPct}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>↑ 4% dari minggu lalu</span>
          </div>
        </div>

        {/* 3. Ranking Madrasah */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ranking Madrasah
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] my-2">#3</div>
          <div className="text-[11px] text-slate-500 font-medium">Top 5% Nasional</div>
        </div>

        {/* 4. Poin Kognitif */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            Poin Kognitif
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0284c7] my-2">
            {cognitivePoints.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 self-start px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
            <span>🥇 {profile.level || 'Ahli Sains'}</span>
          </div>
        </div>
      </div>

      {/* Main Action Grid (2-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Primary Action Buttons & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Menu Utama Latihan</h2>
                <p className="text-xs text-slate-500">
                  Pilih modul persiapan OMI IPAS yang kamu butuhkan hari ini
                </p>
              </div>
            </div>

            {/* 4 Signature Gradient Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Latihan Bebas (btn-blue) */}
              <button
                onClick={() => onOpenSelector('latihan_bebas')}
                className="flex flex-col items-start p-5 rounded-2xl text-white text-left transition-all hover:brightness-105 active:scale-[0.98] shadow-md shadow-sky-600/10 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-3xl">🚀</span>
                  <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    Fleksibel
                  </span>
                </div>
                <span className="font-extrabold text-base sm:text-lg">Latihan Bebas</span>
                <span className="text-xs text-white/80 mt-1">
                  Atur materi & jumlah soal sesuai kebutuhan
                </span>
              </button>

              {/* 2. Simulasi OMI (btn-green) */}
              <button
                onClick={() => onOpenSelector('sim_kabupaten')}
                className="flex flex-col items-start p-5 rounded-2xl text-white text-left transition-all hover:brightness-105 active:scale-[0.98] shadow-md shadow-green-600/10 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-3xl">🏆</span>
                  <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    Tryout Resmi
                  </span>
                </div>
                <span className="font-extrabold text-base sm:text-lg">Simulasi OMI</span>
                <span className="text-xs text-white/80 mt-1">
                  Format CBT standar dengan batas waktu
                </span>
              </button>

              {/* 3. Mode HOTS (btn-orange) */}
              <button
                onClick={() => onOpenSelector('mode_hots')}
                className="flex flex-col items-start p-5 rounded-2xl text-white text-left transition-all hover:brightness-105 active:scale-[0.98] shadow-md shadow-amber-600/10 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-3xl">🧠</span>
                  <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    Analisis C4-C6
                  </span>
                </div>
                <span className="font-extrabold text-base sm:text-lg">Mode HOTS</span>
                <span className="text-xs text-white/80 mt-1">
                  Analisis eksperimen & penalaran mendalam
                </span>
              </button>

              {/* 4. Soal Olimpiade (btn-purple) */}
              <button
                onClick={() => onOpenSelector('sim_nasional')}
                className="flex flex-col items-start p-5 rounded-2xl text-white text-left transition-all hover:brightness-105 active:scale-[0.98] shadow-md shadow-purple-600/10 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-3xl">⚡</span>
                  <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    Provinsi & Nasional
                  </span>
                </div>
                <span className="font-extrabold text-base sm:text-lg">Soal Olimpiade</span>
                <span className="text-xs text-white/80 mt-1">
                  Tingkat lanjut dengan daya saing tinggi
                </span>
              </button>
            </div>

            {/* AI Question Generator Banner Card */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0c4a6e] to-sky-800 p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base">AI Generator Bank Soal OMI</h3>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold">
                      Baru & Otomatis
                    </span>
                  </div>
                  <p className="text-xs text-sky-100/90 mt-0.5 max-w-lg">
                    Buat butir soal baru berstandar HOTS (C4–C6) dengan stimulus eksperimen dan integrasi nilai keislaman, langsung tersimpan ke bank soal!
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateView('ai-generator')}
                className="shrink-0 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#0c4a6e] shadow-sm hover:bg-sky-50 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 text-sky-600" />
                <span>Buka Generator AI</span>
              </button>
            </div>

            {/* Progress Materi Terintegrasi */}
            <div className="pt-6 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f172a]">
                  Progress Penguasaan Materi Terintegrasi
                </h3>
                <button
                  onClick={() => onNavigateView('topics')}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                >
                  Detail Materi →
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Makhluk Hidup */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                    <span>Makhluk Hidup & Adaptasi Ekosistem</span>
                    <span className="font-bold text-[#16a34a]">92%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '92%', backgroundColor: '#16a34a' }}
                    />
                  </div>
                </div>

                {/* Tubuh Manusia */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                    <span>Tubuh Manusia & Fisiologi Kesehatan</span>
                    <span className="font-bold text-[#0284c7]">85%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '85%', backgroundColor: '#0284c7' }}
                    />
                  </div>
                </div>

                {/* Materi & Perubahan Energi */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                    <span>Materi, Gaya & Perubahan Energi</span>
                    <span className="font-bold text-[#f59e0b]">65%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '65%', backgroundColor: '#f59e0b' }}
                    />
                  </div>
                </div>

                {/* Bumi & Lingkungan */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                    <span>Bumi, Tata Surya & Lingkungan Hidup</span>
                    <span className="font-bold text-[#10b981]">78%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '78%', backgroundColor: '#10b981' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): AI Buddy Card & Countdown / Tazkirah */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* AI Asisten Belajar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h2 className="text-sm font-bold text-[#0f172a]">AI Asisten Belajar</h2>
              </div>

              {/* ai-buddy Box */}
              <div
                className="p-4 rounded-2xl border border-dashed border-sky-300 text-xs leading-relaxed space-y-3"
                style={{ backgroundColor: '#eff6ff' }}
              >
                <p className="text-sky-950 font-medium">
                  "{firstName}, statistikmu di materi{' '}
                  <span className="font-bold text-sky-800">
                    {adaptive.weakestTopicLabel || 'Siklus Air'}
                  </span>{' '}
                  bisa ditingkatkan lagi! Mau coba 10 soal tantangan khusus hari ini?"
                </p>
                <button
                  onClick={onStartAdaptive}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-95"
                  style={{ backgroundColor: '#0284c7' }}
                >
                  Mulai Tantangan AI
                </button>
              </div>
            </div>

            {/* Aktivitas Terakhir */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-[11px] uppercase font-bold text-slate-400 mb-2.5 tracking-wider">
                Aktivitas Terakhir
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#16a34a' }} />
                  <span>Simulasi OMI: 90/100 (Selesai)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#0284c7' }} />
                  <span>Latihan Mandiri: Materi Ekosistem</span>
                </div>
              </div>
            </div>
          </div>

          {/* Oceanic Dark Card: Pendaftaran OMI 2026 & Tazkirah */}
          <div
            className="rounded-2xl p-5 text-white shadow-md space-y-3"
            style={{ backgroundColor: '#0c4a6e' }}
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <span className="text-xs font-semibold text-sky-100">Pendaftaran OMI 2026</span>
              </div>
              <span className="text-sm font-extrabold text-amber-300">45 Hari Lagi</span>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-xs leading-relaxed backdrop-blur-xs">
              <div className="font-bold text-amber-200 mb-0.5">Tazkirah Sains 🌿</div>
              <p className="text-sky-100 text-[11px] italic">
                "Dialah yang menurunkan air hujan dari langit, sebagiannya menjadi minuman dan
                sebagiannya menyuburkan tumbuhan..." (QS. An-Nahl: 10)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons: 10, 25, 50, 100 Soal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#0f172a]">
              Latihan Cepat Berdasarkan Jumlah Soal
            </h3>
            <p className="text-xs text-slate-500">
              Pilih jumlah butir soal yang ingin kamu kerjakan dalam satu sesi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { count: 10, time: '15 Menit', label: 'Cepat & Ringan', desc: 'Cocok pemanasan harian' },
            { count: 25, time: '35 Menit', label: 'Standar Latihan', desc: 'Fokus pemahaman konsep' },
            { count: 50, time: '75 Menit', label: 'Format Simulasi', desc: 'Tahapan provinsi & nasional' },
            { count: 100, time: '150 Menit', label: 'Maraton OMI', desc: 'Uji ketahanan daya nalar' },
          ].map((item) => (
            <button
              key={item.count}
              onClick={() => onStartQuickCount(item.count)}
              className="group flex flex-col p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl font-black text-[#0284c7]">{item.count} Soal</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {item.time}
                </span>
              </div>
              <span className="font-bold text-xs text-slate-800">{item.label}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6 Core Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">6 Bidang Materi IPAS Terintegrasi</h2>
            <p className="text-xs text-slate-500">
              Sesuai silabus resmi Olimpiade Madrasah Indonesia Kemenag RI
            </p>
          </div>
          <button
            onClick={() => onNavigateView('topics')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Lihat Semua Panduan <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((topicKey) => {
            const topic = TOPIC_LABELS[topicKey];
            return (
              <div
                key={topicKey}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 border border-sky-200">
                      Materi Inti
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#0f172a]">{topic.label}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {topic.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectTopic(topicKey)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:text-[#0369a1]"
                  >
                    <Play className="h-3.5 w-3.5 fill-[#0284c7]" />
                    Latihan Soal
                  </button>
                  <button
                    onClick={() => onNavigateView('topics')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Rangkuman Materi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
