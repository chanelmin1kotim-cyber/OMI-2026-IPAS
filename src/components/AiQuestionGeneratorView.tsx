import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  PlusCircle,
  Save,
  Play,
  Copy,
  Check,
  Trash2,
  Edit3,
  Layers,
  BookOpen,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Atom,
  FlaskConical,
  Award,
  Filter,
} from 'lucide-react';
import {
  DifficultyLevel,
  GradeLevel,
  OmiStage,
  Question,
  QuestionTopic,
} from '../types';
import {
  addCustomQuestions,
  getAiGeneratedQuestions,
  getQuestions,
  TOPIC_LABELS,
} from '../data/questionStore';

interface AiQuestionGeneratorViewProps {
  onStartCustomExam: (questions: Question[], title: string) => void;
  onNavigateHome: () => void;
}

export const AiQuestionGeneratorView: React.FC<AiQuestionGeneratorViewProps> = ({
  onStartCustomExam,
  onNavigateHome,
}) => {
  // Generator form state
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic>('makhluk_hidup');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Kelas 5');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Olimpiade');
  const [selectedStage, setSelectedStage] = useState<OmiStage>('Tingkat Kabupaten/Kota');
  const [stimulusType, setStimulusType] = useState<string>('eksperimen');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [hasIslamicIntegration, setHasIslamicIntegration] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Execution states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStep, setGeneratingStep] = useState<string>('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'saved_history'>('generator');
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  // Saved history
  const [savedHistory, setSavedHistory] = useState<Question[]>([]);
  const [poolTotalCount, setPoolTotalCount] = useState<number>(1020);

  useEffect(() => {
    loadSavedHistory();
  }, []);

  const loadSavedHistory = () => {
    const history = getAiGeneratedQuestions();
    setSavedHistory(history);
    const all = getQuestions();
    setPoolTotalCount(all.length);
  };

  const handleQuickTopicPrompt = (text: string, topicKey: QuestionTopic) => {
    setSelectedTopic(topicKey);
    setCustomPrompt(text);
  };

  const toggleExplanation = (id: string) => {
    setExpandedExplanation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate questions via server API
  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    const steps = [
      'Menghubungkan ke Mesin Cerdas OMI IPAS 2026...',
      'Merancang stimulus berbasis eksperimen & fenomena alam...',
      'Mengonstruksi opsi jawaban berstandar HOTS Taksonomi Bloom...',
      'Memvalidasi analisis ilmiah & integrasi nilai keislaman...',
      'Menyelesaikan paket butir soal kompetisi...',
    ];

    let stepIdx = 0;
    setGeneratingStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setGeneratingStep(steps[stepIdx]);
    }, 1200);

    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          grade: selectedGrade,
          difficulty: selectedDifficulty,
          stage: selectedStage,
          count: questionCount,
          hasIslamicIntegration,
          stimulusType,
          customPrompt,
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        // Expand all explanations by default for ease of review
        const initialExpand: Record<string, boolean> = {};
        data.questions.forEach((q: Question) => {
          initialExpand[q.id] = true;
        });
        setExpandedExplanation(initialExpand);
      } else {
        throw new Error(data.error || 'Tidak ada soal yang dihasilkan oleh AI.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses generator soal AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save generated questions to repository
  const handleSaveToBank = () => {
    if (generatedQuestions.length === 0) return;
    const res = addCustomQuestions(generatedQuestions);
    setSavedSuccess(true);
    loadSavedHistory();
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Start exam session with current questions
  const handleStartExamNow = () => {
    if (generatedQuestions.length === 0) return;
    onStartCustomExam(
      generatedQuestions,
      `Simulasi AI: ${TOPIC_LABELS[selectedTopic]?.label || 'IPAS Terintegrasi'} (${generatedQuestions.length} Soal)`
    );
  };

  // Delete one question from current batch
  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Update question text / details
  const handleUpdateQuestion = (id: string, updated: Partial<Question>) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  // Copy questions formatted as text
  const handleCopyText = () => {
    if (generatedQuestions.length === 0) return;
    const formatted = generatedQuestions
      .map((q, idx) => {
        return `SOAL NO ${idx + 1} (${q.grade} • ${q.stage} • ${q.difficulty})\n` +
          `Topik: ${TOPIC_LABELS[q.topic]?.label || q.topic} - ${q.subtopic}\n` +
          (q.stimulus ? `\n[STIMULUS]\n${q.stimulus}\n` : '') +
          `\nPertanyaan:\n${q.question}\n\n` +
          `Pilihan:\n` +
          q.options.map((opt) => `${opt.id}. ${opt.text}`).join('\n') +
          `\n\nKunci Jawaban: ${q.correctAnswer}\n` +
          `Pembahasan:\n${q.explanation?.whyCorrect || ''}\n` +
          (q.explanation?.concept ? `Konsep Inti: ${q.explanation.concept}\n` : '') +
          (q.explanation?.islamicIntegration
            ? `Integrasi Nilai Islam: ${q.explanation.islamicIntegration}\n`
            : '') +
          `\n--------------------------------------------------\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(formatted);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Export as JSON
  const handleExportJson = () => {
    if (generatedQuestions.length === 0) return;
    const blob = new Blob([JSON.stringify(generatedQuestions, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omi_ipas_soal_ai_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c4a6e] via-sky-800 to-emerald-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 backdrop-blur-xs border border-white/10 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>AI Question Factory • OMI IPAS 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Generator Bank Soal OMI 2026
            </h1>
            <p className="mt-2 text-sm text-sky-100/90 leading-relaxed">
              Kembangkan bank soal olimpiade secara mandiri menggunakan kecerdasan buatan.
              Hasilkan soal HOTS (C4–C6) lengkap dengan stimulus eksperimen, tabel data ilmiah,
              analisis miskonsepsi, dan integrasi nilai keislaman.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap md:flex-col gap-2.5 w-full md:w-auto">
            <div className="flex-1 md:flex-initial rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 text-center sm:text-right">
              <div className="text-xs text-sky-200">Total Bank Soal Aktif</div>
              <div className="text-xl font-black text-white">{poolTotalCount.toLocaleString()} Soal</div>
            </div>
            <div className="flex-1 md:flex-initial rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-2.5 text-center sm:text-right">
              <div className="text-xs text-emerald-200">Soal Buatan AI Tersimpan</div>
              <div className="text-xl font-black text-emerald-300">{savedHistory.length} Soal</div>
            </div>
          </div>
        </div>

        {/* Decorative ambient elements */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Tabs navigation */}
      <div className="mt-6 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'generator'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>Form Generator Soal Baru</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('saved_history');
              loadSavedHistory();
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'saved_history'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Riwayat Soal Buatan AI ({savedHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Generator Form & Live Output */}
      {activeTab === 'generator' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Configuration Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <Filter className="h-4 w-4 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">Parameter Generator Soal</h2>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* Topic selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. Bidang Topik IPAS OMI
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value as QuestionTopic)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                  >
                    {Object.entries(TOPIC_LABELS).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade & Difficulty */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      2. Jenjang Kelas
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                    >
                      <option value="Kelas 4">Kelas 4 MI/SD</option>
                      <option value="Kelas 5">Kelas 5 MI/SD</option>
                      <option value="Kelas 6">Kelas 6 MI/SD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      3. Tingkat Kesulitan
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                    >
                      <option value="Sedang">Sedang (C3-C4)</option>
                      <option value="Sukar">Sukar (C4-C5)</option>
                      <option value="Olimpiade">Olimpiade HOTS (C4-C6)</option>
                    </select>
                  </div>
                </div>

                {/* Stage & Stimulus Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      4. Tahapan OMI
                    </label>
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value as OmiStage)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                    >
                      <option value="Tingkat Madrasah">Tingkat Madrasah</option>
                      <option value="Tingkat Kabupaten/Kota">Kabupaten / Kota</option>
                      <option value="Tingkat Provinsi">Provinsi</option>
                      <option value="Tingkat Nasional">Tingkat Nasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      5. Format Stimulus
                    </label>
                    <select
                      value={stimulusType}
                      onChange={(e) => setStimulusType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                    >
                      <option value="eksperimen">Eksperimen Lab Siswa</option>
                      <option value="tabel_data">Tabel / Grafik Data</option>
                      <option value="kasus_lingkungan">Studi Isu Lingkungan</option>
                      <option value="kehidupan_nyata">Fenomena Keseharian</option>
                    </select>
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    6. Jumlah Butir Soal Dihasilkan
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`rounded-xl py-2 text-xs font-bold transition-all ${
                          questionCount === num
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num} Butir
                      </button>
                    ))}
                  </div>
                </div>

                {/* Islamic Integration Toggle */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Integrasi Nilai Islam</div>
                      <div className="text-[11px] text-emerald-800">
                        Sertakan tadabbur ayat Al-Quran atau nilai keislaman
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasIslamicIntegration}
                    onChange={(e) => setHasIslamicIntegration(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Custom Subtopic / Specific Focus */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    7. Topik Khusus / Arahan Soal (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Contoh: Fokus pada eksperimen fotosintesis Ingenhousz dengan tanaman Hydrilla, atau perubahan wujud kalor..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Quick Topic Prompts */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">
                    💡 Rekomendasi Topik Favorit OMI:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickTopicPrompt(
                          'Eksperimen pengaruh intensitas cahaya terhadap fotosintesis Hydrilla',
                          'makhluk_hidup'
                        )
                      }
                      className="rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors"
                    >
                      Fotosintesis Hydrilla
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickTopicPrompt(
                          'Hukum pemuaian zat gas pada balon dan botol air panas/dingin',
                          'materi_energi'
                        )
                      }
                      className="rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors"
                    >
                      Pemuaian Zat Gas
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickTopicPrompt(
                          'Kemiringan sumbu bumi 23.5 derajat dan waktu shalat serta panjang bayangan',
                          'bumi_lingkungan'
                        )
                      }
                      className="rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors"
                    >
                      Rotasi & Tongkat Istiwa
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickTopicPrompt(
                          'Pengaruh olahraga terhadap frekuensi denyut nadi dan homeostasis pernapasan',
                          'tubuh_manusia'
                        )
                      }
                      className="rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors"
                    >
                      Kapasitas Paru-paru
                    </button>
                  </div>
                </div>

                {/* Generate Action Button */}
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-[#0c4a6e] py-3.5 text-sm font-bold text-white shadow-md shadow-sky-900/20 hover:brightness-110 active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-amber-300" />
                      <span>Sedang Merumuskan Soal...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span>Hasilkan {questionCount} Butir Soal AI Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Output & Question Review (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Generating Loading State */}
            {isGenerating && (
              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md text-sky-600 mb-4 animate-pulse">
                  <Brain className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Kecerdasan Buatan Sedang Menyusun Soal OMI 2026
                </h3>
                <p className="mt-2 text-xs font-semibold text-sky-700 animate-pulse">
                  {generatingStep}
                </p>
                <div className="mt-6 mx-auto max-w-sm w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full animate-indeterminate" style={{ width: '70%' }} />
                </div>
                <div className="mt-4 text-[11px] text-slate-500">
                  Soal dirancang dengan standar Higher Order Thinking Skills (HOTS) Taksonomi Bloom C4-C6.
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3 text-rose-800 text-xs">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Menghasilkan Soal</div>
                  <div className="mt-1 text-rose-700">{errorMsg}</div>
                </div>
              </div>
            )}

            {/* Saved Notification */}
            {savedSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold">
                    Berhasil! {generatedQuestions.length} butir soal telah ditambahkan ke Bank Soal Utama OMI.
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">Tersimpan di Local Storage</span>
              </div>
            )}

            {/* Empty State before generation */}
            {!isGenerating && generatedQuestions.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                  <FlaskConical className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Belum Ada Soal yang Digenerate
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Pilih parameter materi dan stimulus di panel sebelah kiri, kemudian klik tombol{' '}
                  <strong className="text-sky-700">"Hasilkan Butir Soal AI Sekarang"</strong> untuk
                  membuat paket latihan orisinal berstandar olimpiade.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    🔬 Berbasis Eksperimen
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    📊 Analisis Data & Grafik
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    🕌 Integrasi Nilai Islam
                  </span>
                </div>
              </div>
            )}

            {/* Action Bar for Generated Questions */}
            {generatedQuestions.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                    {generatedQuestions.length}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Paket Soal Berhasil Dibuat</div>
                    <div className="text-[11px] text-slate-500">
                      Tinjau, edit, simpan ke bank soal, atau langsung uji coba dalam simulasi CBT.
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Save to repository */}
                  <button
                    onClick={handleSaveToBank}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
                    title="Simpan secara permanen ke bank soal aplikasi"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Simpan ke Bank Soal</span>
                  </button>

                  {/* Test in CBT */}
                  <button
                    onClick={handleStartExamNow}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition-all"
                    title="Mulai simulasi CBT dengan soal-soal ini"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Kerjakan Sekarang</span>
                  </button>

                  {/* Copy formatted text */}
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Salin soal ke clipboard format teks"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>

                  {/* Export JSON */}
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Unduh berkas JSON"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            )}

            {/* Generated Question Cards List */}
            {generatedQuestions.map((q, idx) => {
              const isExpanded = expandedExplanation[q.id] ?? true;
              const isEditing = editingQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Card Header & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[#0c4a6e] px-2.5 py-1 text-xs font-black text-white">
                        Soal #{idx + 1}
                      </span>
                      <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700 border border-sky-100">
                        {TOPIC_LABELS[q.topic]?.label || q.topic}
                      </span>
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                        {q.difficulty} • {q.cognitiveLevel || 'HOTS'}
                      </span>
                      {q.hasIslamicIntegration && (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          🕌 Integrasi Islam
                        </span>
                      )}
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title={isEditing ? 'Selesai Mengedit' : 'Edit Redaksi Soal'}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Hapus soal ini dari paket"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtopic */}
                  {q.subtopic && (
                    <div className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                      <Atom className="h-3.5 w-3.5 text-sky-600" />
                      <span>Submateri: {q.subtopic}</span>
                    </div>
                  )}

                  {/* Stimulus Section */}
                  {q.stimulus && (
                    <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                      <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-1.5">
                        <FlaskConical className="h-3.5 w-3.5 text-sky-600" />
                        <span>Stimulus / Narasi Pengamatan:</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={q.stimulus}
                          onChange={(e) => handleUpdateQuestion(q.id, { stimulus: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800"
                        />
                      ) : (
                        <p className="italic text-slate-800 font-serif">{q.stimulus}</p>
                      )}
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-500 mb-1">Pertanyaan Inti:</div>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={q.question}
                        onChange={(e) => handleUpdateQuestion(q.id, { question: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs sm:text-sm text-slate-900 font-semibold"
                      />
                    ) : (
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>
                    )}
                  </div>

                  {/* Options (A, B, C, D) */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctAnswer === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-3 rounded-xl border p-3 text-xs sm:text-sm transition-all ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50/70 font-semibold text-emerald-950 shadow-xs'
                              : 'border-slate-200 bg-slate-50/50 text-slate-700'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-700'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <div className="flex-1 pt-0.5">
                            {isEditing ? (
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const newOptions = q.options.map((o) =>
                                    o.id === opt.id ? { ...o, text: e.target.value } : o
                                  );
                                  handleUpdateQuestion(q.id, { options: newOptions });
                                }}
                                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                              />
                            ) : (
                              <span>{opt.text}</span>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900 shrink-0">
                              <Check className="h-3 w-3" />
                              <span>Kunci Jawaban</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Explanation Button */}
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
                    >
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span>
                        {isExpanded ? 'Tutup Pembahasan & Analisis' : 'Lihat Pembahasan Lengkap & Nilai Islam'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Expanded Explanation Content */}
                    {isExpanded && q.explanation && (
                      <div className="mt-3 space-y-2.5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">💡 Analisis Mengapa Benar:</span>
                          <p className="mt-0.5 text-slate-700 leading-relaxed">{q.explanation.whyCorrect}</p>
                        </div>
                        {q.explanation.concept && (
                          <div>
                            <span className="font-bold text-sky-800">🔬 Konsep Inti Sains:</span>
                            <p className="mt-0.5 text-slate-700">{q.explanation.concept}</p>
                          </div>
                        )}
                        {q.explanation.misconceptionAlert && (
                          <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-2.5">
                            <span className="font-bold text-amber-900">⚠️ Catatan Pengecoh / Miskonsepsi:</span>
                            <p className="mt-0.5 text-amber-800">{q.explanation.misconceptionAlert}</p>
                          </div>
                        )}
                        {q.explanation.islamicIntegration && (
                          <div className="rounded-lg bg-emerald-50/80 border border-emerald-200 p-2.5">
                            <span className="font-bold text-emerald-900">🕌 Integrasi Nilai Keislaman:</span>
                            <p className="mt-0.5 text-emerald-800 italic">{q.explanation.islamicIntegration}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Saved History */}
      {activeTab === 'saved_history' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Daftar Soal Buatan AI yang Tersimpan ({savedHistory.length} Butir)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Semua soal di bawah ini sudah terintegrasi secara otomatis ke bank soal utama dan
                  bisa diakses dalam mode latihan bebas, simulasi OMI, maupun remedial.
                </p>
              </div>

              {savedHistory.length > 0 && (
                <button
                  onClick={() => onStartCustomExam(savedHistory, `Simulasi Semua Soal Buatan AI (${savedHistory.length} Soal)`)}
                  className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Uji Coba Semua Soal AI ({savedHistory.length})</span>
                </button>
              )}
            </div>

            {savedHistory.length === 0 ? (
              <div className="py-12 text-center">
                <Brain className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Belum Ada Soal AI yang Disimpan</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Kembali ke tab generator untuk mulai membuat butir soal baru dan menyimpannya ke
                  bank soal.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Buka Form Generator</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedHistory.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:border-sky-300 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#0c4a6e] px-2 py-0.5 text-[11px] font-bold text-white">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-800">
                          {TOPIC_LABELS[q.topic]?.label || q.topic}
                        </span>
                        <span className="text-[11px] text-slate-500">• {q.grade}</span>
                        <span className="rounded-sm bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5">
                          {q.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => onStartCustomExam([q], `Latihan Soal AI #${idx + 1}`)}
                        className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Kerjakan</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-800 font-medium line-clamp-2">{q.question}</p>
                    <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                      Kunci: ({q.correctAnswer}) • {q.explanation?.concept || q.subtopic}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
