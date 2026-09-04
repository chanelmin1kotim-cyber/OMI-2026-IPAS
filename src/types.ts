export type GradeLevel = 'Kelas 4' | 'Kelas 5' | 'Kelas 6';
export type OmiStage = 'Tingkat Kabupaten/Kota' | 'Tingkat Provinsi' | 'Tingkat Nasional';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'HOTS' | 'Olimpiade';
export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export type QuestionTopic =
  | 'makhluk_hidup'
  | 'tubuh_manusia'
  | 'materi_energi'
  | 'bumi_lingkungan'
  | 'keterampilan_sains'
  | 'ipas_terintegrasi';

export type QuestionType =
  | 'pilihan_ganda'
  | 'pilihan_ganda_kompleks'
  | 'benar_salah'
  | 'menjodohkan'
  | 'analisis_tabel'
  | 'analisis_grafik'
  | 'studi_kasus'
  | 'sebab_akibat';

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface DataTable {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  unit?: string;
}

export interface VisualPayload {
  type: 'diagram' | 'food_web' | 'cycle' | 'experiment' | 'graph' | 'table' | 'solar' | 'organ';
  title?: string;
  caption?: string;
  chartData?: ChartDataPoint[];
  tags?: string[];
  svgVariant?: string;
  tableData?: DataTable;
}

export interface QuestionExplanation {
  concept: string;
  stepByStep: string[];
  whyCorrect: string;
  whyOthersWrong?: string;
  islamicIntegration?: string;
  thinkingPath?: string; // HOTS reasoning guide
}

export interface Question {
  id: string;
  grade: GradeLevel;
  stage: OmiStage;
  difficulty: DifficultyLevel;
  cognitiveLevel: CognitiveLevel;
  type: QuestionType;
  topic: QuestionTopic;
  subtopic: string;
  stimulus?: string; // Cerita / pengantar / konteks eksperimen
  visual?: VisualPayload;
  question: string;
  options: QuestionOption[];
  correctAnswer: string | string[]; // 'A' or ['A', 'C'] or { leftId: rightId }
  explanation: QuestionExplanation;
  sourceReference?: string;
  tags?: string[];
  isHots: boolean;
  hasIslamicIntegration?: boolean;
}

export interface StudentAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  markedForReview?: boolean;
}

export interface ExamSession {
  id: string;
  title: string;
  mode: PracticeMode;
  stage?: OmiStage;
  topic?: QuestionTopic | 'all';
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  markedQuestions: Record<string, boolean>;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  isFinished: boolean;
  startedAt: string;
  completedAt?: string;
  score?: number;
  correctCount?: number;
  wrongCount?: number;
  unansweredCount?: number;
  percentage?: number;
  ratingCategory?: 'Excellent' | 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Latihan';
  topicBreakdown?: Record<QuestionTopic, { total: number; correct: number }>;
}

export type PracticeMode =
  | 'latihan_bebas'
  | 'latihan_materi'
  | 'mode_hots'
  | 'mode_olimpiade'
  | 'sim_kabupaten'
  | 'sim_provinsi'
  | 'sim_nasional'
  | 'tryout_harian'
  | 'soal_acak'
  | 'soal_belum_dikerjakan'
  | 'soal_salah'
  | 'soal_favorit'
  | 'adaptif_rekomendasi'
  | 'ai_generator';

export interface Achievement {
  id: string;
  title: string;
  badge: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  grade: GradeLevel;
  school: string;
  city: string;
  streakDays: number;
  lastActiveDate: string;
  totalAnswered: number;
  totalCorrect: number;
  simulationsCompleted: number;
  highestScore: number;
  favoriteQuestionIds: string[];
  wrongQuestionHistory: {
    questionId: string;
    wrongAnswer: string | string[];
    timestamp: string;
  }[];
  topicMastery: Record<QuestionTopic, { totalAttempted: number; correctAttempted: number }>;
  achievements: Achievement[];
}

export interface TeacherAssignment {
  id: string;
  title: string;
  className: string;
  topic: QuestionTopic | 'all';
  questionCount: number;
  difficulty: DifficultyLevel | 'campuran';
  dueDate: string;
  targetStage: OmiStage;
  createdAt: string;
  assignedStudentsCount: number;
  completedCount: number;
  averageScore: number;
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: GradeLevel;
  studentCount: number;
  academicYear: string;
}
