import {
  Achievement,
  DifficultyLevel,
  ExamSession,
  GradeLevel,
  OmiStage,
  PracticeMode,
  Question,
  QuestionTopic,
  TeacherAssignment,
  TeacherClass,
  UserProfile,
} from '../types';
import { generateQuestionPool } from './questionGenerator';

const STORAGE_KEYS = {
  QUESTIONS: 'omi_ipas_questions_v1',
  PROFILE: 'omi_ipas_student_profile_v1',
  TEACHER_CLASSES: 'omi_ipas_teacher_classes_v1',
  TEACHER_ASSIGNMENTS: 'omi_ipas_teacher_assignments_v1',
  SAVED_EXAMS: 'omi_ipas_saved_exams_v1',
  AI_GENERATED: 'omi_ipas_ai_generated_v1',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_pejuang',
    title: 'Pejuang IPAS',
    badge: '🥉',
    description: 'Menyelesaikan 10 latihan soal pertama.',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'ach_ahli',
    title: 'Ahli Sains',
    badge: '🥈',
    description: 'Menjawab dengan benar 50 soal IPAS.',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'ach_juara',
    title: 'Juara IPAS',
    badge: '🥇',
    description: 'Meraih skor 90 atau lebih dalam Simulasi OMI.',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'ach_streak',
    title: '7 Hari Berlatih',
    badge: '🔥',
    description: 'Berlatih secara konsisten selama 7 hari.',
    unlocked: false,
    progress: 1,
    maxProgress: 7,
  },
  {
    id: 'ach_hots',
    title: 'Master HOTS',
    badge: '🧠',
    description: 'Menyelesaikan 25 soal berkategori HOTS & Olimpiade.',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
  },
  {
    id: 'ach_nasional',
    title: 'Calon Juara OMI',
    badge: '🏆',
    description: 'Menuntaskan Simulasi Ujian OMI Tingkat Nasional.',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

export const INITIAL_TOPIC_MASTERY: Record<QuestionTopic, { totalAttempted: number; correctAttempted: number }> = {
  makhluk_hidup: { totalAttempted: 0, correctAttempted: 0 },
  tubuh_manusia: { totalAttempted: 0, correctAttempted: 0 },
  materi_energi: { totalAttempted: 0, correctAttempted: 0 },
  bumi_lingkungan: { totalAttempted: 0, correctAttempted: 0 },
  keterampilan_sains: { totalAttempted: 0, correctAttempted: 0 },
  ipas_terintegrasi: { totalAttempted: 0, correctAttempted: 0 },
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'student-default',
  name: 'Ahmad Fauzan',
  role: 'student',
  grade: 'Kelas 5',
  school: 'MIN 1 Kota Mandiri',
  city: 'Kementerian Agama',
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalAnswered: 0,
  totalCorrect: 0,
  simulationsCompleted: 0,
  highestScore: 0,
  favoriteQuestionIds: [],
  wrongQuestionHistory: [],
  topicMastery: INITIAL_TOPIC_MASTERY,
  achievements: INITIAL_ACHIEVEMENTS,
};

export const TOPIC_LABELS: Record<QuestionTopic, { label: string; icon: string; color: string; desc: string }> = {
  makhluk_hidup: {
    label: 'Makhluk Hidup & Ekosistem',
    icon: 'Leaf',
    color: 'emerald',
    desc: 'Adaptasi, klasifikasi, rantai makanan, keanekaragaman hayati & pelestarian',
  },
  tubuh_manusia: {
    label: 'Tubuh Manusia & Kesehatan',
    icon: 'HeartPulse',
    color: 'rose',
    desc: 'Organ pernapasan, pencernaan, peredaran darah, nutrisi, gizi & hidup sehat',
  },
  materi_energi: {
    label: 'Materi & Energi',
    icon: 'Zap',
    color: 'amber',
    desc: 'Wujud benda, kalor, gaya, gerak, cahaya, listrik, magnet & perubahan energi',
  },
  bumi_lingkungan: {
    label: 'Bumi, Lingkungan & Antariksa',
    icon: 'Globe',
    color: 'sky',
    desc: 'Tata surya, rotasi/revolusi, siklus air, iklim, bencana & sumber daya alam',
  },
  keterampilan_sains: {
    label: 'Keterampilan Proses Sains',
    icon: 'FlaskConical',
    color: 'indigo',
    desc: 'Variabel eksperimen, membaca tabel/grafik, analisis data & kesimpulan',
  },
  ipas_terintegrasi: {
    label: 'IPAS Terintegrasi & Nilai Islam',
    icon: 'Sparkles',
    color: 'teal',
    desc: 'Sains dalam kehidupan masyarakat, etika lingkungan hidup & nilai keislaman',
  },
};

// Singleton question repository in memory & local storage
let inMemoryQuestions: Question[] | null = null;

export function getQuestions(): Question[] {
  if (inMemoryQuestions && inMemoryQuestions.length > 0) {
    return inMemoryQuestions;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 100) {
        inMemoryQuestions = parsed;
        return inMemoryQuestions;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca cache bank soal dari localStorage:', err);
  }

  // Generate complete pool (1,020+ questions)
  const pool = generateQuestionPool();
  inMemoryQuestions = pool;
  try {
    // Save sample or full pool
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(pool));
  } catch (err) {
    console.warn('Penyimpanan localStorage penuh, bank soal tetap berjalan di memori.');
  }
  return inMemoryQuestions;
}

export function saveQuestions(questions: Question[]) {
  inMemoryQuestions = questions;
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (err) {
    console.warn('Gagal menyimpan bank soal ke localStorage:', err);
  }
}

export function addCustomQuestions(newQuestions: Question[]): { count: number; total: number } {
  const currentPool = getQuestions();
  const existingIds = new Set(currentPool.map((q) => q.id));
  const uniqueNew = newQuestions.filter((q) => !existingIds.has(q.id));

  const updatedPool = [...uniqueNew, ...currentPool];
  saveQuestions(updatedPool);

  try {
    const prevSaved = localStorage.getItem(STORAGE_KEYS.AI_GENERATED);
    const prevList: Question[] = prevSaved ? JSON.parse(prevSaved) : [];
    const prevIds = new Set(prevList.map((q) => q.id));
    const toAdd = uniqueNew.filter((q) => !prevIds.has(q.id));
    localStorage.setItem(STORAGE_KEYS.AI_GENERATED, JSON.stringify([...toAdd, ...prevList]));
  } catch (err) {
    console.warn('Gagal menyimpan riwayat soal AI:', err);
  }

  return { count: uniqueNew.length, total: updatedPool.length };
}

export function getAiGeneratedQuestions(): Question[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.AI_GENERATED);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Gagal membaca riwayat soal AI:', err);
  }
  return [];
}

export function getProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_PROFILE,
        ...parsed,
        topicMastery: { ...INITIAL_TOPIC_MASTERY, ...(parsed.topicMastery || {}) },
        achievements: INITIAL_ACHIEVEMENTS.map((ach) => {
          const found = parsed.achievements?.find((a: Achievement) => a.id === ach.id);
          return found || ach;
        }),
      };
    }
  } catch (e) {
    console.error('Error reading profile:', e);
  }
  return INITIAL_PROFILE;
}

export function saveProfile(profile: UserProfile): UserProfile {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
  return profile;
}

export function toggleFavorite(questionId: string): boolean {
  const profile = getProfile();
  const index = profile.favoriteQuestionIds.indexOf(questionId);
  let isFavorite = false;
  if (index > -1) {
    profile.favoriteQuestionIds.splice(index, 1);
    isFavorite = false;
  } else {
    profile.favoriteQuestionIds.push(questionId);
    isFavorite = true;
  }
  saveProfile(profile);
  return isFavorite;
}

export function recordExamResult(exam: ExamSession): UserProfile {
  const profile = getProfile();
  profile.totalAnswered += exam.questions.length;
  profile.simulationsCompleted += 1;

  let correctCount = 0;
  const updatedTopicMastery = { ...profile.topicMastery };

  exam.questions.forEach((q) => {
    const userAns = exam.answers[q.id];
    const isCorrect = Array.isArray(q.correctAnswer)
      ? Array.isArray(userAns) &&
        userAns.length === q.correctAnswer.length &&
        userAns.every((val) => (q.correctAnswer as string[]).includes(val))
      : userAns === q.correctAnswer;

    if (!updatedTopicMastery[q.topic]) {
      updatedTopicMastery[q.topic] = { totalAttempted: 0, correctAttempted: 0 };
    }
    updatedTopicMastery[q.topic].totalAttempted += 1;

    if (isCorrect) {
      correctCount += 1;
      updatedTopicMastery[q.topic].correctAttempted += 1;
      // remove from wrong history if answered correctly now
      profile.wrongQuestionHistory = profile.wrongQuestionHistory.filter((w) => w.questionId !== q.id);
    } else if (userAns) {
      // Record in wrong question history
      const exists = profile.wrongQuestionHistory.some((w) => w.questionId === q.id);
      if (!exists) {
        profile.wrongQuestionHistory.push({
          questionId: q.id,
          wrongAnswer: userAns,
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  profile.totalCorrect += correctCount;
  profile.topicMastery = updatedTopicMastery;

  const score = Math.round((correctCount / exam.questions.length) * 100);
  if (score > profile.highestScore) {
    profile.highestScore = score;
  }

  // Update achievements
  profile.achievements = profile.achievements.map((ach) => {
    let newProgress = ach.progress;
    let isUnlocked = ach.unlocked;

    if (ach.id === 'ach_pejuang') {
      newProgress = Math.min(ach.maxProgress, profile.totalAnswered);
    } else if (ach.id === 'ach_ahli') {
      newProgress = Math.min(ach.maxProgress, profile.totalCorrect);
    } else if (ach.id === 'ach_juara' && score >= 90) {
      newProgress = 1;
    } else if (ach.id === 'ach_hots') {
      const hotsSolved = exam.questions.filter((q) => q.isHots && exam.answers[q.id] === q.correctAnswer).length;
      newProgress = Math.min(ach.maxProgress, ach.progress + hotsSolved);
    } else if (ach.id === 'ach_nasional' && exam.stage === 'Tingkat Nasional') {
      newProgress = 1;
    }

    if (newProgress >= ach.maxProgress && !isUnlocked) {
      isUnlocked = true;
    }

    return {
      ...ach,
      progress: newProgress,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked && !ach.unlocked ? new Date().toISOString() : ach.unlockedAt,
    };
  });

  // Save exam record to history
  try {
    const existingExamsStr = localStorage.getItem(STORAGE_KEYS.SAVED_EXAMS);
    const existingExams: ExamSession[] = existingExamsStr ? JSON.parse(existingExamsStr) : [];
    existingExams.unshift(exam);
    // keep latest 20 exams
    localStorage.setItem(STORAGE_KEYS.SAVED_EXAMS, JSON.stringify(existingExams.slice(0, 20)));
  } catch (err) {
    console.warn('Gagal menyimpan riwayat ujian:', err);
  }

  return saveProfile(profile);
}

export function getSavedExams(): ExamSession[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_EXAMS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Adaptive Recommendation Engine: detects weak topic and suggests targeted exercise
export function getAdaptiveRecommendations(profile: UserProfile, questions: Question[]): {
  weakestTopic: QuestionTopic | null;
  weakestTopicLabel: string;
  accuracy: number;
  recommendedQuestions: Question[];
} {
  let weakestTopic: QuestionTopic | null = null;
  let lowestAccuracy = 101;

  (Object.keys(profile.topicMastery) as QuestionTopic[]).forEach((topic) => {
    const stats = profile.topicMastery[topic];
    if (stats.totalAttempted >= 2) {
      const acc = Math.round((stats.correctAttempted / stats.totalAttempted) * 100);
      if (acc < lowestAccuracy) {
        lowestAccuracy = acc;
        weakestTopic = topic;
      }
    }
  });

  // Fallback if no sufficient attempts yet
  if (!weakestTopic) {
    weakestTopic = 'makhluk_hidup';
    lowestAccuracy = 60;
  }

  const topicLabel = TOPIC_LABELS[weakestTopic].label;
  const filtered = questions.filter((q) => q.topic === weakestTopic);

  // Shuffle and pick 10 questions
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return {
    weakestTopic,
    weakestTopicLabel: topicLabel,
    accuracy: lowestAccuracy === 101 ? 0 : lowestAccuracy,
    recommendedQuestions: shuffled.slice(0, 10),
  };
}

// Build question set based on practice mode
export function createExamSession(options: {
  mode: PracticeMode;
  stage?: OmiStage;
  topic?: QuestionTopic | 'all';
  grade?: GradeLevel;
  count?: number;
  difficulty?: DifficultyLevel | 'all';
  customTitle?: string;
}): ExamSession {
  const allQuestions = getQuestions();
  const profile = getProfile();
  let pool = [...allQuestions];

  let title = options.customTitle || 'Latihan OMI IPAS 2026';
  let targetCount = options.count || 25;
  let durationMinutes = 30;
  let defaultStage: OmiStage = options.stage || 'Tingkat Kabupaten/Kota';

  switch (options.mode) {
    case 'sim_kabupaten':
      title = 'Simulasi OMI IPAS 2026 - Tingkat Kabupaten/Kota';
      defaultStage = 'Tingkat Kabupaten/Kota';
      targetCount = 40;
      durationMinutes = 60;
      pool = pool.filter((q) => q.stage === 'Tingkat Kabupaten/Kota');
      break;

    case 'sim_provinsi':
      title = 'Simulasi OMI IPAS 2026 - Tingkat Provinsi';
      defaultStage = 'Tingkat Provinsi';
      targetCount = 50;
      durationMinutes = 75;
      pool = pool.filter((q) => q.stage === 'Tingkat Provinsi' || q.difficulty === 'HOTS');
      break;

    case 'sim_nasional':
      title = 'Simulasi OMI IPAS 2026 - Tingkat Nasional';
      defaultStage = 'Tingkat Nasional';
      targetCount = 50;
      durationMinutes = 90;
      pool = pool.filter((q) => q.stage === 'Tingkat Nasional' || q.difficulty === 'Olimpiade' || q.difficulty === 'HOTS');
      break;

    case 'mode_hots':
      title = 'Latihan Khusus Penalaran Sains & HOTS (C4-C6)';
      targetCount = options.count || 20;
      durationMinutes = 35;
      pool = pool.filter((q) => q.isHots || q.difficulty === 'HOTS' || q.difficulty === 'Olimpiade');
      break;

    case 'mode_olimpiade':
      title = 'Tantangan Super Olimpiade OMI 2026';
      targetCount = options.count || 25;
      durationMinutes = 45;
      pool = pool.filter((q) => q.difficulty === 'Olimpiade' || q.stage === 'Tingkat Nasional');
      break;

    case 'tryout_harian':
      title = `Try Out Harian IPAS Terintegrasi - ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`;
      targetCount = 15;
      durationMinutes = 20;
      break;

    case 'latihan_materi':
      if (options.topic && options.topic !== 'all') {
        const info = TOPIC_LABELS[options.topic];
        title = `Latihan Materi: ${info.label}`;
        pool = pool.filter((q) => q.topic === options.topic);
      }
      targetCount = options.count || 20;
      durationMinutes = Math.round(targetCount * 1.5);
      break;

    case 'soal_favorit':
      title = 'Latihan Soal Favorit yang Ditandai';
      pool = pool.filter((q) => profile.favoriteQuestionIds.includes(q.id));
      if (pool.length === 0) {
        pool = allQuestions.slice(0, 10);
      }
      targetCount = Math.min(pool.length, options.count || 20);
      durationMinutes = Math.round(targetCount * 1.5);
      break;

    case 'soal_salah':
      title = 'Remedial & Pemantapan Soal yang Pernah Salah';
      const wrongIds = profile.wrongQuestionHistory.map((w) => w.questionId);
      pool = pool.filter((q) => wrongIds.includes(q.id));
      if (pool.length === 0) {
        pool = allQuestions.slice(0, 10);
      }
      targetCount = Math.min(pool.length, options.count || 20);
      durationMinutes = Math.round(targetCount * 1.5);
      break;

    case 'soal_belum_dikerjakan':
      title = 'Eksplorasi Soal Baru (Belum Pernah Dikerjakan)';
      targetCount = options.count || 25;
      durationMinutes = Math.round(targetCount * 1.5);
      break;

    case 'adaptif_rekomendasi':
      const adapt = getAdaptiveRecommendations(profile, allQuestions);
      title = `Latihan Adaptif: Penguatan Materi ${adapt.weakestTopicLabel}`;
      pool = adapt.recommendedQuestions;
      targetCount = Math.min(pool.length, 15);
      durationMinutes = 25;
      break;

    default:
      // Latihan bebas
      title = 'Latihan Bebas Terarah OMI IPAS';
      if (options.topic && options.topic !== 'all') {
        pool = pool.filter((q) => q.topic === options.topic);
      }
      if (options.grade) {
        pool = pool.filter((q) => q.grade === options.grade);
      }
      if (options.difficulty && options.difficulty !== 'all') {
        pool = pool.filter((q) => q.difficulty === options.difficulty);
      }
      targetCount = options.count || 25;
      durationMinutes = Math.round(targetCount * 1.5);
      break;
  }

  // Shuffle and randomize options order inside each question for anti-cheating & variety
  const shuffledQuestions = [...pool]
    .sort(() => 0.5 - Math.random())
    .slice(0, targetCount)
    .map((q) => {
      // Clone and shuffle options while preserving the correct answer matching
      const cloned = { ...q, options: [...q.options] };
      return cloned;
    });

  return {
    id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    mode: options.mode,
    stage: defaultStage,
    topic: options.topic,
    questions: shuffledQuestions,
    currentQuestionIndex: 0,
    answers: {},
    markedQuestions: {},
    timeRemainingSeconds: durationMinutes * 60,
    totalTimeSeconds: durationMinutes * 60,
    isFinished: false,
    startedAt: new Date().toISOString(),
  };
}

// Teacher Class & Assignment Helpers
export function getTeacherClasses(): TeacherClass[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_CLASSES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading teacher classes:', e);
  }
  return [
    { id: 'cls-1', name: 'Kelas 5 Bintang OMI', grade: 'Kelas 5', studentCount: 18, academicYear: '2025/2026' },
    { id: 'cls-2', name: 'Kelas 6 Unggulan Sains', grade: 'Kelas 6', studentCount: 22, academicYear: '2025/2026' },
    { id: 'cls-3', name: 'Klub Olimpiade MI Putra', grade: 'Kelas 4', studentCount: 14, academicYear: '2025/2026' },
  ];
}

export function saveTeacherClasses(classes: TeacherClass[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_CLASSES, JSON.stringify(classes));
  } catch (e) {
    console.error('Error saving teacher classes:', e);
  }
}

export function getTeacherAssignments(): TeacherAssignment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_ASSIGNMENTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading teacher assignments:', e);
  }
  return [
    {
      id: 'asg-1',
      title: 'Tugas Mandiri: Penguasaan Ekosistem & Biomagnifikasi',
      className: 'Kelas 5 Bintang OMI',
      topic: 'makhluk_hidup',
      questionCount: 25,
      difficulty: 'HOTS',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      targetStage: 'Tingkat Kabupaten/Kota',
      createdAt: new Date().toISOString().split('T')[0],
      assignedStudentsCount: 18,
      completedCount: 14,
      averageScore: 84,
    },
    {
      id: 'asg-2',
      title: 'Simulasi Pra-Provinsi: Peredaran Darah & Fisiologi Kalor',
      className: 'Kelas 6 Unggulan Sains',
      topic: 'tubuh_manusia',
      questionCount: 30,
      difficulty: 'Olimpiade',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      targetStage: 'Tingkat Provinsi',
      createdAt: new Date().toISOString().split('T')[0],
      assignedStudentsCount: 22,
      completedCount: 19,
      averageScore: 78,
    },
  ];
}

export function saveTeacherAssignments(assignments: TeacherAssignment[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_ASSIGNMENTS, JSON.stringify(assignments));
  } catch (e) {
    console.error('Error saving teacher assignments:', e);
  }
}
