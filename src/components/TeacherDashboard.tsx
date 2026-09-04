import React, { useState } from 'react';
import {
  Users,
  ClipboardList,
  PlusCircle,
  BookOpen,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit3,
  CheckCircle,
  FileText,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import {
  DifficultyLevel,
  GradeLevel,
  OmiStage,
  Question,
  QuestionTopic,
  TeacherAssignment,
  TeacherClass,
} from '../types';
import {
  TOPIC_LABELS,
  getQuestions,
  saveQuestions,
  getTeacherAssignments,
  saveTeacherAssignments,
  getTeacherClasses,
  saveTeacherClasses,
} from '../data/questionStore';

interface TeacherDashboardProps {
  onOpenAiGenerator?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onOpenAiGenerator }) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'assignments' | 'classes'>('bank');
  const [questions, setQuestions] = useState<Question[]>(getQuestions());
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(getTeacherAssignments());
  const [classes, setClasses] = useState<TeacherClass[]>(getTeacherClasses());

  // Search & Filter for Bank Soal
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Add Question Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    grade: 'Kelas 5',
    stage: 'Tingkat Kabupaten/Kota',
    difficulty: 'HOTS',
    cognitiveLevel: 'C4',
    type: 'pilihan_ganda',
    topic: 'makhluk_hidup',
    subtopic: 'Keseimbangan Ekosistem',
    stimulus: '',
    question: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctAnswer: 'A',
    isHots: true,
    hasIslamicIntegration: true,
    explanation: {
      stepByStep: ['Analisis stimulus awal', 'Evaluasi dampak fenomena'],
      concept: '',
      whyCorrect: '',
      whyOthersWrong: '',
      islamicIntegration: 'Tadabbur keteraturan alam dan kekuasaan Allah SWT.',
    },
  });

  // Add Assignment Modal State
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<TeacherAssignment>>({
    title: '',
    className: classes[0]?.name || 'Kelas 5 Bintang OMI',
    topic: 'makhluk_hidup',
    questionCount: 20,
    difficulty: 'HOTS',
    targetStage: 'Tingkat Kabupaten/Kota',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.stimulus && q.stimulus.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.subtopic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic === 'all' || q.topic === filterTopic;
    const matchesGrade = filterGrade === 'all' || q.grade === filterGrade;
    const matchesDiff = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchesSearch && matchesTopic && matchesGrade && matchesDiff;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const currentDisplayQuestions = filteredQuestions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Handle Export Questions JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Bank_Soal_OMI_IPAS_2026_${questions.length}_soal.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Import JSON
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            const combined = [...parsed, ...questions];
            // Deduplicate by ID
            const uniqueMap = new Map();
            combined.forEach((item) => uniqueMap.set(item.id, item));
            const uniqueQuestions = Array.from(uniqueMap.values());
            setQuestions(uniqueQuestions);
            saveQuestions(uniqueQuestions);
            alert(`Berhasil mengimpor ${parsed.length} soal! Total bank soal sekarang: ${uniqueQuestions.length}`);
          }
        } catch (err) {
          alert('Format JSON tidak valid.');
        }
      };
    }
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    if (confirm('Yakin ingin menghapus soal ini dari bank soal?')) {
      const updated = questions.filter((q) => q.id !== id);
      setQuestions(updated);
      saveQuestions(updated);
    }
  };

  // Save new custom question
  const handleSaveNewQuestion = () => {
    if (!newQuestion.question || !newQuestion.options?.[0]?.text) {
      alert('Mohon lengkapi pertanyaan dan pilihan jawaban.');
      return;
    }

    const created: Question = {
      id: `custom-${Date.now()}`,
      grade: (newQuestion.grade as GradeLevel) || 'Kelas 5',
      stage: (newQuestion.stage as OmiStage) || 'Tingkat Kabupaten/Kota',
      difficulty: (newQuestion.difficulty as DifficultyLevel) || 'HOTS',
      cognitiveLevel: newQuestion.cognitiveLevel || 'C4',
      type: 'pilihan_ganda',
      topic: (newQuestion.topic as QuestionTopic) || 'makhluk_hidup',
      subtopic: newQuestion.subtopic || 'IPAS Terintegrasi',
      stimulus: newQuestion.stimulus || '',
      question: newQuestion.question || '',
      options: newQuestion.options || [],
      correctAnswer: newQuestion.correctAnswer || 'A',
      isHots: Boolean(newQuestion.isHots),
      hasIslamicIntegration: Boolean(newQuestion.hasIslamicIntegration),
      explanation: {
        stepByStep: newQuestion.explanation?.stepByStep || ['Langkah analisis data'],
        concept: newQuestion.explanation?.concept || 'Prinsip Sains',
        whyCorrect: newQuestion.explanation?.whyCorrect || 'Pilihan ini sesuai hukum alam dan data ilmiah.',
        whyOthersWrong: newQuestion.explanation?.whyOthersWrong || 'Pilihan lain tidak memenuhi kaidah sains.',
        islamicIntegration: newQuestion.explanation?.islamicIntegration || '',
      },
    };

    const updated = [created, ...questions];
    setQuestions(updated);
    saveQuestions(updated);
    setShowAddModal(false);
    alert('Soal baru berhasil ditambahkan ke Bank Soal OMI!');
  };

  // Create Assignment
  const handleCreateAssignment = () => {
    if (!newAssignment.title) {
      alert('Judul tugas harus diisi');
      return;
    }
    const created: TeacherAssignment = {
      id: `asg-${Date.now()}`,
      title: newAssignment.title || 'Latihan Mandiri',
      className: newAssignment.className || 'Kelas 5 Bintang OMI',
      topic: (newAssignment.topic as QuestionTopic) || 'makhluk_hidup',
      questionCount: newAssignment.questionCount || 20,
      difficulty: (newAssignment.difficulty as DifficultyLevel) || 'HOTS',
      targetStage: (newAssignment.targetStage as OmiStage) || 'Tingkat Kabupaten/Kota',
      dueDate: newAssignment.dueDate || '',
      createdAt: new Date().toISOString().split('T')[0],
      assignedStudentsCount: 20,
      completedCount: 0,
      averageScore: 0,
    };
    const updated = [created, ...assignments];
    setAssignments(updated);
    saveTeacherAssignments(updated);
    setShowAddAssignmentModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-800 p-6 sm:p-8 text-white shadow-lg">
        <div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Portal Guru & Pembimbing OMI
          </span>
          <h1 className="mt-2 text-xl sm:text-2xl font-black">
            Manajemen Bank Soal & Bimbingan Belajar
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100">
            Kelola {questions.length} bank soal terstruktur, buat tugas siswa, dan pantau perkembangan prestasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenAiGenerator && (
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Generator Soal</span>
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-900 shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            Tambah Soal Baru
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-800/60 border border-white/20 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors"
            title="Download seluruh bank soal dalam format JSON"
          >
            <Download className="h-4 w-4" />
            Ekspor JSON
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-800/60 border border-white/20 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Impor JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'bank'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Bank Soal ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'assignments'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Tugas & Latihan ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'classes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          Kelas & Rombel ({classes.length})
        </button>
      </div>

      {/* Tab: Bank Soal */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Search */}
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari topik, stimulus, kata kunci..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-1.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Filter Topic */}
            <div>
              <select
                value={filterTopic}
                onChange={(e) => {
                  setFilterTopic(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">Semua Materi IPAS</option>
                {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((t) => (
                  <option key={t} value={t}>
                    {TOPIC_LABELS[t].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Grade */}
            <div>
              <select
                value={filterGrade}
                onChange={(e) => {
                  setFilterGrade(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">Semua Jenjang Kelas</option>
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
              </select>
            </div>

            {/* Filter Difficulty */}
            <div>
              <select
                value={filterDifficulty}
                onChange={(e) => {
                  setFilterDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">Semua Tingkat Kesulitan</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="HOTS">HOTS</option>
                <option value="Olimpiade">Olimpiade</option>
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Menampilkan {filteredQuestions.length} butir soal</span>
              <span>Halaman {page} dari {totalPages || 1}</span>
            </div>

            {currentDisplayQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      #{(page - 1) * itemsPerPage + idx + 1}
                    </span>
                    <span className="rounded bg-sky-100 text-sky-800 font-semibold px-2 py-0.5">
                      {q.grade}
                    </span>
                    <span className="rounded bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5">
                      {q.stage}
                    </span>
                    <span className="rounded bg-purple-100 text-purple-800 font-semibold px-2 py-0.5">
                      {q.difficulty} ({q.cognitiveLevel})
                    </span>
                    <span className="text-slate-600 font-medium">
                      {q.subtopic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100"
                      title="Hapus soal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {q.stimulus && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg mb-2">
                    "{q.stimulus.slice(0, 180)}..."
                  </p>
                )}

                <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
                  {q.question}
                </p>

                {/* Options preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded-lg border ${
                        opt.id === q.correctAnswer
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-100 bg-white text-slate-600'
                      }`}
                    >
                      <strong>{opt.id}.</strong> {opt.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="text-xs font-medium text-slate-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
                >
                  Berikutnya
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Daftar Tugas & Penugasan Siswa</h3>
            <button
              onClick={() => setShowAddAssignmentModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <PlusCircle className="h-4 w-4" />
              Buat Tugas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5">
                      {asg.className}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{asg.title}</h4>
                    <p className="text-xs text-slate-500">
                      Tenggat: {asg.dueDate} • {asg.questionCount} Soal • {asg.targetStage}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700">{asg.averageScore}</span>
                    <div className="text-[10px] text-slate-400">Rata-rata Kelas</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Diselesaikan: <strong>{asg.completedCount}</strong> dari {asg.assignedStudentsCount} siswa
                  </span>
                  <span className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[11px] font-semibold border border-emerald-200">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                  {cls.grade.split(' ')[1]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{cls.name}</h4>
                  <p className="text-xs text-slate-500">{cls.academicYear}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Jumlah Siswa:</span>
                <span className="font-bold text-slate-800">{cls.studentCount} Peserta</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Tambah Soal Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Tambah Butir Soal OMI Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Materi IPAS</label>
                  <select
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value as QuestionTopic })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  >
                    {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((t) => (
                      <option key={t} value={t}>
                        {TOPIC_LABELS[t].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submateri</label>
                  <input
                    type="text"
                    value={newQuestion.subtopic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subtopic: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                    placeholder="misal: Adaptasi & Rantai Makanan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenjang</label>
                  <select
                    value={newQuestion.grade}
                    onChange={(e) => setNewQuestion({ ...newQuestion, grade: e.target.value as GradeLevel })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  >
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahap OMI</label>
                  <select
                    value={newQuestion.stage}
                    onChange={(e) => setNewQuestion({ ...newQuestion, stage: e.target.value as OmiStage })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  >
                    <option value="Tingkat Kabupaten/Kota">Kabupaten/Kota</option>
                    <option value="Tingkat Provinsi">Provinsi</option>
                    <option value="Tingkat Nasional">Nasional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  >
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="HOTS">HOTS</option>
                    <option value="Olimpiade">Olimpiade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stimulus / Cerita Fenomena / Data</label>
                <textarea
                  rows={2}
                  value={newQuestion.stimulus}
                  onChange={(e) => setNewQuestion({ ...newQuestion, stimulus: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                  placeholder="Cerita pengamatan atau fenomena alam..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kalimat Pertanyaan</label>
                <textarea
                  rows={2}
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                  placeholder="Tuliskan pertanyaan olimpiade..."
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Pilihan Jawaban</label>
                {newQuestion.options?.map((opt, i) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 w-5">{opt.id}.</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const nextOptions = [...(newQuestion.options || [])];
                        nextOptions[i] = { ...opt, text: e.target.value };
                        setNewQuestion({ ...newQuestion, options: nextOptions });
                      }}
                      className="flex-1 rounded-lg border border-slate-300 p-1.5 text-xs"
                      placeholder={`Pilihan ${opt.id}`}
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === opt.id}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: opt.id })}
                      title="Tandai sebagai kunci jawaban benar"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pembahasan / Alasan Ilmiah</label>
                <textarea
                  rows={2}
                  value={newQuestion.explanation?.whyCorrect}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      explanation: { ...newQuestion.explanation!, whyCorrect: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2"
                  placeholder="Jelaskan alasan jawaban benar..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewQuestion}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700"
                >
                  Simpan Soal ke Bank
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Buat Tugas Baru */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">Buat Tugas Baru untuk Siswa</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Judul Tugas</label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="misal: Latihan Mandiri 25 Soal Materi Ekosistem"
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Kelas</label>
              <select
                value={newAssignment.className}
                onChange={(e) => setNewAssignment({ ...newAssignment, className: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Materi</label>
                <select
                  value={newAssignment.topic}
                  onChange={(e) => setNewAssignment({ ...newAssignment, topic: e.target.value as QuestionTopic })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                >
                  {(Object.keys(TOPIC_LABELS) as QuestionTopic[]).map((t) => (
                    <option key={t} value={t}>
                      {TOPIC_LABELS[t].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah Soal</label>
                <input
                  type="number"
                  value={newAssignment.questionCount}
                  onChange={(e) => setNewAssignment({ ...newAssignment, questionCount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batas Waktu Pengumpulan (Deadline)</label>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddAssignmentModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateAssignment}
                className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700"
              >
                Kirim Tugas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
