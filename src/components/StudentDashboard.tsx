import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Brain,
  Star,
  ChevronRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { ExamSession, QuestionTopic, UserProfile } from '../types';
import { TOPIC_LABELS, getSavedExams } from '../data/questionStore';
import { AiAssistantModal } from './AiAssistantModal';

interface StudentDashboardProps {
  profile: UserProfile;
  onStartAdaptivePractice: () => void;
  onSelectPracticeMode: () => void;
  onReviewExam: (exam: ExamSession) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  onStartAdaptivePractice,
  onSelectPracticeMode,
  onReviewExam,
}) => {
  const [showAiStudyPlan, setShowAiStudyPlan] = useState(false);
  const savedExams = getSavedExams();

  const totalAnswered = profile.totalAnswered || 0;
  const totalCorrect = profile.totalCorrect || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Identify strongest and weakest topic
  let strongestTopic: QuestionTopic = 'makhluk_hidup';
  let weakestTopic: QuestionTopic = 'materi_energi';
  let maxAcc = -1;
  let minAcc = 101;

  (Object.keys(profile.topicMastery) as QuestionTopic[]).forEach((topic) => {
    const stat = profile.topicMastery[topic];
    if (stat.totalAttempted >= 2) {
      const acc = Math.round((stat.correctAttempted / stat.totalAttempted) * 100);
      if (acc > maxAcc) {
        maxAcc = acc;
        strongestTopic = topic;
      }
      if (acc < minAcc) {
        minAcc = acc;
        weakestTopic = topic;
      }
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Student Profile Card */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10"
        style={{ backgroundColor: '#0c4a6e' }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl font-black shadow-inner backdrop-blur-xs border border-white/20">
              👨‍🎓
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold">{profile.name}</h1>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold backdrop-blur-xs border border-white/25">
                  Kelas {profile.grade}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 mt-1">
                {profile.school} • {profile.city}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAiStudyPlan(true)}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs border border-white/25 hover:bg-white/25 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              Rencana Belajar 7 Hari AI
            </button>
            <button
              onClick={onSelectPracticeMode}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-slate-900 shadow-md hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Mulai Latihan Baru
            </button>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/20">
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-2xl font-black">{totalAnswered}</div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-sky-100">
              Total Soal Dikerjakan
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-2xl font-black">{accuracy}%</div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-sky-100">
              Rata-rata Akurasi
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-2xl font-black">{profile.highestScore}</div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-sky-100">
              Skor Simulasi Terbaik
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-2xl font-black flex items-center gap-1.5">
              <Flame className="h-5 w-5 text-amber-400 fill-amber-400" />
              {profile.streakDays} Hari
            </div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-sky-100">
              Streak Latihan
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Diagnosis: Strongest & Weakest Topic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Materi Terkuat Kamu
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {TOPIC_LABELS[strongestTopic]?.label}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Penguasaanmu pada topik ini sangat baik. Terus pertahankan dengan mencoba soal tingkat Provinsi dan Nasional!
          </p>
        </div>

        {/* Weakest with 1-click Adaptive CTA */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Materi yang Perlu Ditingkatkan
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {TOPIC_LABELS[weakestTopic]?.label}
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem adaptif mendeteksi akurasi masih perlu dilatih. Kerjakan latihan terarah pada topik ini untuk mendongkrak skor OMI-mu!
            </p>
          </div>
          <button
            onClick={onStartAdaptivePractice}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-colors"
          >
            <Brain className="h-4 w-4" />
            Latihan Pemantapan Adaptif
          </button>
        </div>
      </div>

      {/* 6 Core IPAS Topics Mastery Detail */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 mb-4">
          Statistik Penguasaan 6 Materi IPAS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((topicKey) => {
            const info = TOPIC_LABELS[topicKey];
            const stat = profile.topicMastery[topicKey] || { totalAttempted: 0, correctAttempted: 0 };
            const acc = stat.totalAttempted > 0 ? Math.round((stat.correctAttempted / stat.totalAttempted) * 100) : 0;
            return (
              <div key={topicKey} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-800 line-clamp-1">{info.label}</span>
                  <span className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
                    {acc}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 mb-2">
                  <div
                    className={`h-full rounded-full ${
                      acc >= 80 ? 'bg-emerald-500' : acc >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{stat.correctAttempted} benar</span>
                  <span>{stat.totalAttempted} dikerjakan</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges / Prestasi Siswa */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Prestasi & Lencana Juara</h3>
            <p className="text-xs text-slate-500">
              Kumpulkan seluruh lencana pencapaian selama berlatih menuju OMI 2026
            </p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
            {profile.achievements.filter((a) => a.unlocked).length} / {profile.achievements.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {profile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
                ach.unlocked
                  ? 'border-amber-300 bg-amber-50/50 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{ach.badge}</div>
              <h4 className="font-bold text-xs text-slate-900 leading-tight mb-1">{ach.title}</h4>
              <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{ach.description}</p>
              <div className="mt-2 text-[10px] font-bold text-slate-600">
                {ach.unlocked ? (
                  <span className="text-emerald-600">✓ Terbuka</span>
                ) : (
                  <span>
                    {ach.progress}/{ach.maxProgress}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Exam History */}
      {savedExams.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-4">Riwayat Simulasi Ujian</h3>
          <div className="divide-y divide-slate-100">
            {savedExams.slice(0, 5).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{exam.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{new Date(exam.startedAt).toLocaleDateString('id-ID')}</span>
                    <span>•</span>
                    <span>{exam.questions.length} Soal</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">{exam.ratingCategory}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold font-mono text-slate-900">{exam.score}</span>
                  <button
                    onClick={() => onReviewExam(exam)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-slate-50"
                  >
                    Lihat Pembahasan
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Study Plan Modal */}
      <AiAssistantModal
        isOpen={showAiStudyPlan}
        onClose={() => setShowAiStudyPlan(false)}
        weakTopics={[TOPIC_LABELS[weakestTopic]?.label || 'Rantai Makanan']}
        initialAction="study_plan"
      />
    </div>
  );
};
