import React, { useState } from 'react';
import {
  X,
  Play,
  Award,
  BookOpen,
  Brain,
  Timer,
  Layers,
  Sparkles,
  RefreshCw,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { DifficultyLevel, GradeLevel, OmiStage, PracticeMode, QuestionTopic } from '../types';
import { TOPIC_LABELS } from '../data/questionStore';

interface PracticeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (options: {
    mode: PracticeMode;
    stage?: OmiStage;
    topic?: QuestionTopic | 'all';
    grade?: GradeLevel;
    count?: number;
    difficulty?: DifficultyLevel | 'all';
    customTitle?: string;
  }) => void;
  defaultMode?: PracticeMode;
}

export const PracticeSelectorModal: React.FC<PracticeSelectorModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
  defaultMode = 'latihan_bebas',
}) => {
  const [mode, setMode] = useState<PracticeMode>(defaultMode);
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Kelas 5');
  const [selectedStage, setSelectedStage] = useState<OmiStage>('Tingkat Kabupaten/Kota');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');

  if (!isOpen) return null;

  const handleStart = () => {
    onStartExam({
      mode,
      stage: selectedStage,
      topic: selectedTopic,
      grade: selectedGrade,
      count: questionCount,
      difficulty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-slate-100 px-6 py-4 text-white"
          style={{ backgroundColor: '#0c4a6e' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/20">
              <Play className="h-5 w-5 text-emerald-300 fill-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Mulai Latihan & Simulasi OMI 2026</h3>
              <p className="text-xs text-sky-100">Pilih mode latihan sesuai target persiapan kompetisimu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pilih Mode Pengerjaan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('latihan_bebas')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mode === 'latihan_bebas'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Play className="h-4 w-4 text-sky-600" />
                  <span className="font-bold text-xs sm:text-sm">Latihan Bebas</span>
                </div>
                <span className="text-[11px] text-slate-500">Atur materi & jumlah sesukamu</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('sim_kabupaten')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mode === 'sim_kabupaten'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold text-xs sm:text-sm">Sim. Kabupaten</span>
                </div>
                <span className="text-[11px] text-slate-500">40 soal • Waktu 60 menit</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('sim_provinsi')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mode === 'sim_provinsi'
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-xs sm:text-sm">Sim. Provinsi</span>
                </div>
                <span className="text-[11px] text-slate-500">50 soal • Waktu 75 menit</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('sim_nasional')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mode === 'sim_nasional'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="font-bold text-xs sm:text-sm">Sim. Nasional</span>
                </div>
                <span className="text-[11px] text-slate-500">50 soal • HOTS & Olimpiade</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('mode_hots')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mode === 'mode_hots'
                    ? 'border-purple-500 bg-purple-50/70 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="font-bold text-xs sm:text-sm">Mode HOTS</span>
                </div>
                <span className="text-[11px] text-slate-500">Penalaran & analisis data</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('tryout_harian')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  mode === 'tryout_harian'
                    ? 'border-teal-500 bg-teal-50/70 text-teal-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="h-4 w-4 text-teal-600" />
                  <span className="font-bold text-xs sm:text-sm">Try Out Harian</span>
                </div>
                <span className="text-[11px] text-slate-500">15 soal cepat penambah streak</span>
              </button>
            </div>
          </div>

          {/* Conditional Options for Latihan Bebas */}
          {mode === 'latihan_bebas' && (
            <div className="space-y-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
              {/* Topik */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fokus Bidang Materi IPAS
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value as QuestionTopic | 'all')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm focus:border-sky-500 focus:outline-none"
                >
                  <option value="all">🌐 Seluruh Materi IPAS Terintegrasi</option>
                  {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((t) => (
                    <option key={t} value={t}>
                      {TOPIC_LABELS[t].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jumlah Soal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Jumlah Soal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`rounded-lg py-2 text-xs font-bold border transition-all ${
                        questionCount === num
                          ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num} Soal
                    </button>
                  ))}
                </div>
              </div>

              {/* Jenjang Kelas & Kesulitan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenjang Siswa
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Kelas 4">Kelas 4 MI/SD</option>
                    <option value="Kelas 5">Kelas 5 MI/SD</option>
                    <option value="Kelas 6">Kelas 6 MI/SD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | 'all')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="all">Campuran (Semua Level)</option>
                    <option value="Easy">Easy (Mudah)</option>
                    <option value="Medium">Medium (Sedang)</option>
                    <option value="Hard">Hard (Sulit)</option>
                    <option value="HOTS">HOTS (Penalaran)</option>
                    <option value="Olimpiade">Olimpiade (Tantangan)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Filters: Soal Belum Pernah, Soal Salah, Favorit */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMode('soal_belum_dikerjakan')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                mode === 'soal_belum_dikerjakan'
                  ? 'border-sky-500 bg-sky-50 text-sky-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Soal yang Belum Pernah Dikerjakan
            </button>
            <button
              type="button"
              onClick={() => setMode('soal_salah')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                mode === 'soal_salah'
                  ? 'border-rose-500 bg-rose-50 text-rose-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Soal yang Pernah Salah (Remedial)
            </button>
            <button
              type="button"
              onClick={() => setMode('soal_favorit')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
                mode === 'soal_favorit'
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Soal Favorit Saya
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
          >
            <Play className="h-4 w-4 fill-white" />
            Mulai Ujian Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
