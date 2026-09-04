import React, { useState, useEffect } from 'react';
import {
  DifficultyLevel,
  ExamSession,
  GradeLevel,
  OmiStage,
  PracticeMode,
  QuestionTopic,
  UserProfile,
} from './types';
import {
  createExamSession,
  getProfile,
  recordExamResult,
  toggleFavorite,
} from './data/questionStore';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ExamEngine } from './components/ExamEngine';
import { ExamResultView } from './components/ExamResultView';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TopicExploreView } from './components/TopicExploreView';
import { PracticeSelectorModal } from './components/PracticeSelectorModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AiQuestionGeneratorView } from './components/AiQuestionGeneratorView';
import { Sparkles, Trophy } from 'lucide-react';
import { Question } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'topics' | 'dashboard' | 'teacher' | 'exam' | 'result' | 'ai-generator'
  >('home');
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [currentExamSession, setCurrentExamSession] = useState<ExamSession | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [selectorDefaultMode, setSelectorDefaultMode] = useState<PracticeMode>('latihan_bebas');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Sync profile when state changes
  const reloadProfile = () => {
    setProfile(getProfile());
  };

  // Toggle favorite
  const handleToggleFavorite = (questionId: string) => {
    toggleFavorite(questionId);
    reloadProfile();
  };

  const isFavorite = (questionId: string) => {
    return profile.favoriteQuestionIds.includes(questionId);
  };

  // Start new practice or exam session
  const handleStartExam = (options: {
    mode: PracticeMode;
    stage?: OmiStage;
    topic?: QuestionTopic | 'all';
    grade?: GradeLevel;
    count?: number;
    difficulty?: DifficultyLevel | 'all';
    customTitle?: string;
  }) => {
    const newSession = createExamSession(options);
    setCurrentExamSession(newSession);
    setCurrentView('exam');
  };

  // Start custom exam from AI generated questions
  const handleStartCustomExam = (questions: Question[], title: string) => {
    const totalTime = questions.length * 90; // 1.5 min per question
    const session: ExamSession = {
      id: `ai-exam-${Date.now()}`,
      title,
      mode: 'ai_generator',
      stage: 'Tingkat Kabupaten/Kota',
      questions,
      currentQuestionIndex: 0,
      answers: {},
      markedQuestions: {},
      timeRemainingSeconds: totalTime,
      totalTimeSeconds: totalTime,
      isFinished: false,
      startedAt: new Date().toISOString(),
    };
    setCurrentExamSession(session);
    setCurrentView('exam');
  };

  // When exam is finished
  const handleFinishExam = (finishedSession: ExamSession) => {
    const updatedProfile = recordExamResult(finishedSession);
    setProfile(updatedProfile);
    setCurrentExamSession(finishedSession);
    setCurrentView('result');
  };

  // Retest wrong questions
  const handleRetestWrong = () => {
    if (!currentExamSession) return;
    const wrongQuestions = currentExamSession.questions.filter((q) => {
      const userAns = currentExamSession.answers[q.id];
      return Array.isArray(q.correctAnswer)
        ? !Array.isArray(userAns) ||
            userAns.length !== q.correctAnswer.length ||
            !userAns.every((v) => (q.correctAnswer as string[]).includes(v))
        : userAns !== q.correctAnswer;
    });

    if (wrongQuestions.length === 0) {
      alert('Selamat! Anda telah menjawab semua soal dengan benar.');
      return;
    }

    const remedialSession: ExamSession = {
      id: `remedial-${Date.now()}`,
      title: `Remedial ${wrongQuestions.length} Soal Salah - ${currentExamSession.title}`,
      mode: 'soal_salah',
      stage: currentExamSession.stage,
      questions: wrongQuestions,
      currentQuestionIndex: 0,
      answers: {},
      markedQuestions: {},
      timeRemainingSeconds: wrongQuestions.length * 90,
      totalTimeSeconds: wrongQuestions.length * 90,
      isFinished: false,
      startedAt: new Date().toISOString(),
    };

    setCurrentExamSession(remedialSession);
    setCurrentView('exam');
  };

  const handleOpenSelector = (mode: PracticeMode = 'latihan_bebas') => {
    setSelectorDefaultMode(mode);
    setIsSelectorOpen(true);
  };

  const handleToggleRole = () => {
    const nextRole = profile.role === 'student' ? 'teacher' : 'student';
    setProfile((prev) => ({ ...prev, role: nextRole }));
    if (nextRole === 'teacher') {
      setCurrentView('teacher');
    } else {
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900 flex flex-col justify-between">
      {/* Top Header Navigation (hidden during active exam to focus CBT attention) */}
      {currentView !== 'exam' && (
        <Header
          currentView={currentView}
          setCurrentView={(v) => setCurrentView(v as any)}
          profile={profile}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
          onToggleRole={handleToggleRole}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            profile={profile}
            onOpenSelector={handleOpenSelector}
            onSelectTopic={(topic) =>
              handleStartExam({
                mode: 'latihan_materi',
                topic,
                count: 20,
              })
            }
            onNavigateView={(v) => setCurrentView(v as any)}
            onStartAdaptive={() =>
              handleStartExam({
                mode: 'adaptif_rekomendasi',
              })
            }
            onStartQuickCount={(count) =>
              handleStartExam({
                mode: 'latihan_bebas',
                count,
              })
            }
          />
        )}

        {currentView === 'exam' && currentExamSession && (
          <ExamEngine
            session={currentExamSession}
            onFinish={handleFinishExam}
            onExit={() => setCurrentView('home')}
            isFavoriteQuestion={isFavorite}
            onToggleFavoriteQuestion={handleToggleFavorite}
          />
        )}

        {currentView === 'result' && currentExamSession && (
          <ExamResultView
            session={currentExamSession}
            onRestart={() =>
              handleStartExam({
                mode: currentExamSession.mode,
                stage: currentExamSession.stage,
                topic: currentExamSession.topic,
                count: currentExamSession.questions.length,
              })
            }
            onHome={() => setCurrentView('home')}
            onRetestWrong={handleRetestWrong}
            isFavoriteQuestion={isFavorite}
            onToggleFavoriteQuestion={handleToggleFavorite}
          />
        )}

        {currentView === 'topics' && (
          <TopicExploreView
            onStartTopicPractice={(topic) =>
              handleStartExam({
                mode: 'latihan_materi',
                topic,
                count: 20,
              })
            }
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            profile={profile}
            onStartAdaptivePractice={() =>
              handleStartExam({
                mode: 'adaptif_rekomendasi',
              })
            }
            onSelectPracticeMode={() => handleOpenSelector('latihan_bebas')}
            onReviewExam={(exam) => {
              setCurrentExamSession(exam);
              setCurrentView('result');
            }}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard onOpenAiGenerator={() => setCurrentView('ai-generator')} />
        )}

        {currentView === 'ai-generator' && (
          <AiQuestionGeneratorView
            onStartCustomExam={handleStartCustomExam}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer (hidden in exam) */}
      {currentView !== 'exam' && (
        <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-600 text-white font-bold text-xs">
                OMI
              </div>
              <span className="font-semibold text-slate-700">
                OMI IPAS 2026 – Bank Soal Olimpiade Madrasah Indonesia
              </span>
            </div>
            <p className="text-slate-400">
              Integrasi Sains Modern, Daya Nalar Analitis & Nilai Keislaman • Madrasah Mandiri Berprestasi
            </p>
          </div>
        </footer>
      )}

      {/* Floating Kak Sains AI button in non-exam views */}
      {currentView !== 'exam' && (
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-sky-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Tanya Kak Sains AI</span>
        </button>
      )}

      {/* Practice Selector Modal */}
      <PracticeSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onStartExam={handleStartExam}
        defaultMode={selectorDefaultMode}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        weakTopics={['Rantai Makanan & Ekosistem', 'Materi & Kalor']}
        initialAction="hint"
      />
    </div>
  );
}
