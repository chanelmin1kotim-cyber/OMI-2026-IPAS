import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Flag,
  Star,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  X,
  CheckCircle,
} from 'lucide-react';
import { ExamSession, Question } from '../types';
import { QuestionVisual } from './QuestionVisual';
import { AiAssistantModal } from './AiAssistantModal';
import { toggleFavorite } from '../data/questionStore';

interface ExamEngineProps {
  session: ExamSession;
  onFinish: (session: ExamSession) => void;
  onExit: () => void;
  isFavoriteQuestion: (questionId: string) => boolean;
  onToggleFavoriteQuestion: (questionId: string) => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  session,
  onFinish,
  onExit,
  isFavoriteQuestion,
  onToggleFavoriteQuestion,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(session.answers || {});
  const [marked, setMarked] = useState<Record<string, boolean>>(session.markedQuestions || {});
  const [timeLeft, setTimeLeft] = useState<number>(session.timeRemainingSeconds);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const questions = session.questions;
  const currentQuestion: Question | undefined = questions[currentIdx];

  // Finalize exam logic
  const handleCompleteExam = useCallback(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (!userAns) {
        unansweredCount++;
      } else if (
        Array.isArray(q.correctAnswer)
          ? Array.isArray(userAns) &&
            userAns.length === q.correctAnswer.length &&
            userAns.every((val) => (q.correctAnswer as string[]).includes(val))
          : userAns === q.correctAnswer
      ) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const score = percentage;

    let ratingCategory: 'Excellent' | 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Latihan' = 'Perlu Latihan';
    if (score >= 90) ratingCategory = 'Excellent';
    else if (score >= 80) ratingCategory = 'Sangat Baik';
    else if (score >= 70) ratingCategory = 'Baik';
    else if (score >= 60) ratingCategory = 'Cukup';

    const completedSession: ExamSession = {
      ...session,
      answers,
      markedQuestions: marked,
      isFinished: true,
      completedAt: new Date().toISOString(),
      score,
      correctCount,
      wrongCount,
      unansweredCount,
      percentage,
      ratingCategory,
      timeRemainingSeconds: timeLeft,
    };

    onFinish(completedSession);
  }, [answers, marked, onFinish, questions, session, timeLeft]);

  // Countdown timer with auto-submit
  useEffect(() => {
    if (timeLeft <= 0) {
      handleCompleteExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCompleteExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleCompleteExam]);

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSelectOption = (optId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optId,
    }));
  };

  const toggleMarkCurrent = () => {
    if (!currentQuestion) return;
    setMarked((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  if (!currentQuestion) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center">
        <p className="text-slate-600">Tidak ada soal yang dimuat.</p>
        <button onClick={onExit} className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-sm text-white">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const isCurrentFavorite = isFavoriteQuestion(currentQuestion.id);
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              title="Keluar dari Ujian"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-800 line-clamp-1 sm:text-base">
                {session.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Soal {currentIdx + 1} dari {questions.length}</span>
                <span>•</span>
                <span className="text-sky-600 font-semibold">{currentQuestion.grade}</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">{currentQuestion.difficulty}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold shadow-xs ${
                timeLeft < 300
                  ? 'border-rose-300 bg-rose-50 text-rose-600 animate-pulse'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Selesai Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Selesai Ujian</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Question View & Palette */}
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Question Box (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              {/* Question Header & Action icons */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                    No. {currentIdx + 1}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {currentQuestion.subtopic}
                  </span>
                  {currentQuestion.isHots && (
                    <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800 border border-purple-200">
                      🧠 HOTS ({currentQuestion.cognitiveLevel})
                    </span>
                  )}
                  {currentQuestion.hasIslamicIntegration && (
                    <span className="rounded-lg bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-800 border border-teal-200">
                      Nilai Keislaman
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Bookmark / Favorite */}
                  <button
                    onClick={() => onToggleFavoriteQuestion(currentQuestion.id)}
                    className={`rounded-lg p-2 transition-colors ${
                      isCurrentFavorite
                        ? 'bg-amber-100 text-amber-600'
                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                    title={isCurrentFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                  >
                    <Star className={`h-4 w-4 ${isCurrentFavorite ? 'fill-amber-500' : ''}`} />
                  </button>

                  {/* Flag / Ragu-ragu */}
                  <button
                    onClick={toggleMarkCurrent}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      marked[currentQuestion.id]
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Tandai jika masih ragu-ragu"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>{marked[currentQuestion.id] ? 'Ditandai' : 'Ragu-ragu'}</span>
                  </button>

                  {/* Kak Sains AI Clue */}
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 px-2.5 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors"
                    title="Minta petunjuk bernalar tanpa bocoran jawaban"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Petunjuk AI</span>
                  </button>
                </div>
              </div>

              {/* Stimulus text */}
              {currentQuestion.stimulus && (
                <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/40 p-4 text-xs sm:text-sm leading-relaxed text-slate-800 font-normal">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                    Stimulus / Informasi Ilmiah:
                  </div>
                  {currentQuestion.stimulus}
                </div>
              )}

              {/* Visual Table/Graph/Diagram */}
              {currentQuestion.visual && <QuestionVisual visual={currentQuestion.visual} />}

              {/* Question Text */}
              <div className="mt-4 text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                {currentQuestion.question}
              </div>

              {/* Options */}
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentAnswer === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option.id)}
                      className={`group flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/80 font-medium text-sky-950 shadow-xs ring-1 ring-sky-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'border border-slate-300 bg-slate-100 text-slate-600 group-hover:border-slate-400'
                        }`}
                      >
                        {option.id}
                      </div>
                      <span className="mt-0.5 leading-relaxed">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    currentIdx === 0
                      ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="text-xs text-slate-400 font-mono">
                  {currentIdx + 1} / {questions.length}
                </div>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition-all"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Selesai & Kumpulkan</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 mb-3">Navigasi Nomor Soal</h3>

              {/* Status summary */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-4">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-1.5">
                  <div className="font-bold text-emerald-700">{answeredCount}</div>
                  <div className="text-slate-500">Dijawab</div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-1.5">
                  <div className="font-bold text-amber-700">{markedCount}</div>
                  <div className="text-slate-500">Ragu-ragu</div>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-1.5">
                  <div className="font-bold text-slate-700">{unansweredCount}</div>
                  <div className="text-slate-500">Belum</div>
                </div>
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  const isAnswered = Boolean(answers[q.id]);
                  const isMarked = Boolean(marked[q.id]);

                  let btnStyle = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';
                  if (isMarked) {
                    btnStyle = 'border-amber-400 bg-amber-500 text-white font-bold';
                  } else if (isAnswered) {
                    btnStyle = 'border-emerald-500 bg-emerald-600 text-white font-bold';
                  }

                  if (isCurrent) {
                    btnStyle += ' ring-2 ring-sky-500 ring-offset-2';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`relative flex h-8 items-center justify-center rounded-lg border text-xs transition-all ${btnStyle}`}
                    >
                      {idx + 1}
                      {isMarked && !isAnswered && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-emerald-600" />
                  <span>Sudah dijawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-amber-500" />
                  <span>Ragu-ragu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-slate-300 bg-slate-50" />
                  <span>Belum dijawab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finish Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900">Selesaikan Ujian?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Anda telah menjawab <strong className="text-slate-900">{answeredCount}</strong> dari{' '}
              <strong className="text-slate-900">{questions.length}</strong> soal.
            </p>
            {unansweredCount > 0 && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                ⚠️ Masih ada <strong>{unansweredCount} soal</strong> yang belum Anda jawab. Yakin ingin mengakhiri sekarang?
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleCompleteExam();
                }}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                Ya, Kumpulkan Jawaban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Batalkan Latihan?</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5">
              Progres latihan sesi ini akan hilang jika Anda keluar sebelum menyelesaikan ujian.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tetap Lanjut Ujian
              </button>
              <button
                onClick={onExit}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kak Sains AI Modal for Hints */}
      <AiAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        question={currentQuestion}
        studentAnswer={currentAnswer}
        initialAction="hint"
      />
    </div>
  );
};
