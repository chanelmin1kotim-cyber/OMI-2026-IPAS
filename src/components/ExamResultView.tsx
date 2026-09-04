import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Sparkles,
  BookOpen,
  ChevronRight,
  Filter,
  Check,
  X,
  Share2,
  Home,
  Star,
} from 'lucide-react';
import { ExamSession, Question, QuestionTopic } from '../types';
import { TOPIC_LABELS } from '../data/questionStore';
import { QuestionVisual } from './QuestionVisual';
import { AiAssistantModal } from './AiAssistantModal';

interface ExamResultViewProps {
  session: ExamSession;
  onRestart: () => void;
  onHome: () => void;
  onRetestWrong: () => void;
  isFavoriteQuestion: (questionId: string) => boolean;
  onToggleFavoriteQuestion: (questionId: string) => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  session,
  onRestart,
  onHome,
  onRetestWrong,
  isFavoriteQuestion,
  onToggleFavoriteQuestion,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct' | 'marked'>('all');
  const [selectedQuestionForAi, setSelectedQuestionForAi] = useState<Question | null>(null);
  const [aiAction, setAiAction] = useState<'explain' | 'diagnose_wrong' | 'similar_question' | 'explain_kids'>('diagnose_wrong');
  const [showAiModal, setShowAiModal] = useState(false);

  const score = session.score || 0;
  const correctCount = session.correctCount || 0;
  const wrongCount = session.wrongCount || 0;
  const unansweredCount = session.unansweredCount || 0;
  const questions = session.questions;

  // Trigger celebration confetti on high score
  useEffect(() => {
    if (score >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // silent fallback
      }
    }
  }, [score]);

  // Topic mastery calculation
  const topicStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q) => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;
    const ans = session.answers[q.id];
    if (
      Array.isArray(q.correctAnswer)
        ? Array.isArray(ans) &&
          ans.length === q.correctAnswer.length &&
          ans.every((v) => (q.correctAnswer as string[]).includes(v))
        : ans === q.correctAnswer
    ) {
      topicStats[q.topic].correct += 1;
    }
  });

  // Filtered review questions
  const filteredQuestions = questions.filter((q) => {
    const userAns = session.answers[q.id];
    const isCorrect = Array.isArray(q.correctAnswer)
      ? Array.isArray(userAns) &&
        userAns.length === q.correctAnswer.length &&
        userAns.every((v) => (q.correctAnswer as string[]).includes(v))
      : userAns === q.correctAnswer;

    if (filterMode === 'wrong') return !isCorrect;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'marked') return Boolean(session.markedQuestions[q.id]);
    return true;
  });

  const handleOpenAiForQuestion = (
    q: Question,
    action: 'explain' | 'diagnose_wrong' | 'similar_question' | 'explain_kids'
  ) => {
    setSelectedQuestionForAi(q);
    setAiAction(action);
    setShowAiModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Scorecard Hero */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-400/30">
            <Trophy className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Hasil {session.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Diselesaikan pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </p>

          {/* Big Score Display */}
          <div className="my-6 inline-flex flex-col items-center justify-center rounded-3xl bg-slate-50 border border-slate-200/80 px-8 py-5">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 font-mono">
              {score}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                Kategori: {session.ratingCategory}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
              <div className="text-xl font-black text-[#16a34a]">{correctCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
                Jawaban Benar
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
              <div className="text-xl font-black text-rose-600">{wrongCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
                Jawaban Salah
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
              <div className="text-xl font-black text-slate-700">{unansweredCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
                Tidak Dijawab
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
              <div className="text-xl font-black text-[#0284c7]">{score}%</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
                Akurasi
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
            >
              <RotateCcw className="h-4 w-4" />
              Latihan Ulang
            </button>

            {wrongCount > 0 && (
              <button
                onClick={onRetestWrong}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <XCircle className="h-4 w-4" />
                Remedial {wrongCount} Soal Salah
              </button>
            )}

            <button
              onClick={onHome}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              <Home className="h-4 w-4 text-slate-500" />
              Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Topic Breakdown Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-4">
            Analisis Penguasaan Materi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(topicStats).map(([topicKey, stat]) => {
              const info = TOPIC_LABELS[topicKey as QuestionTopic] || {
                label: topicKey,
                color: 'sky',
              };
              const percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={topicKey} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{info.label}</span>
                    <span className="font-semibold text-slate-600">
                      {stat.correct}/{stat.total} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        percentage >= 80
                          ? 'bg-emerald-500'
                          : percentage >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Solutions Filter Tabs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Pembahasan Lengkap Soal
              </h3>
              <p className="text-xs text-slate-500">
                Pelajari konsep ilmiah di balik jawaban yang benar dan hindari miskonsepsi
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setFilterMode('all')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                onClick={() => setFilterMode('wrong')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  filterMode === 'wrong' ? 'bg-rose-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Salah ({wrongCount})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  filterMode === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Benar ({correctCount})
              </button>
            </div>
          </div>

          {/* Solutions List */}
          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => {
              const userAns = session.answers[q.id];
              const isCorrect = Array.isArray(q.correctAnswer)
                ? Array.isArray(userAns) &&
                  userAns.length === q.correctAnswer.length &&
                  userAns.every((v) => (q.correctAnswer as string[]).includes(v))
                : userAns === q.correctAnswer;

              const isFav = isFavoriteQuestion(q.id);

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-bold text-white">
                        No. {questions.indexOf(q) + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {q.subtopic}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                          <Check className="h-3 w-3" /> Benar
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-200">
                          <X className="h-3 w-3" /> Salah
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleFavoriteQuestion(q.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title="Simpan ke favorit"
                      >
                        <Star className={`h-4 w-4 ${isFav ? 'fill-amber-500' : ''}`} />
                      </button>

                      {/* AI Ask Buttons */}
                      <button
                        onClick={() => handleOpenAiForQuestion(q, 'explain_kids')}
                        className="flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                      >
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        Tanya Kak Sains
                      </button>
                    </div>
                  </div>

                  {/* Stimulus & Question */}
                  {q.stimulus && (
                    <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700 border border-slate-200/70">
                      <strong>Stimulus:</strong> {q.stimulus}
                    </div>
                  )}

                  {q.visual && <QuestionVisual visual={q.visual} />}

                  <div className="mt-3 text-sm font-semibold text-slate-900 leading-snug">
                    {q.question}
                  </div>

                  {/* Options with indicator */}
                  <div className="mt-4 space-y-2">
                    {q.options.map((opt) => {
                      const isUserSelected = userAns === opt.id;
                      const isTargetCorrect = q.correctAnswer === opt.id;

                      let optStyle = 'border-slate-200 bg-white text-slate-700';
                      if (isTargetCorrect) {
                        optStyle = 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-950 ring-1 ring-emerald-500';
                      } else if (isUserSelected && !isTargetCorrect) {
                        optStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-3 rounded-xl border p-2.5 text-xs ${optStyle}`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              isTargetCorrect
                                ? 'bg-emerald-600 text-white'
                                : isUserSelected
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="flex-1 mt-0.5">{opt.text}</span>
                          {isTargetCorrect && (
                            <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">
                              Kunci Benar
                            </span>
                          )}
                          {isUserSelected && !isTargetCorrect && (
                            <span className="rounded bg-rose-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-900">
                              Jawabanmu
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Explanation Box */}
                  <div className="mt-4 rounded-xl border border-sky-100 bg-white p-4 space-y-2 text-xs leading-relaxed text-slate-700">
                    <div className="font-bold text-sky-900 flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-sky-600" />
                      Pembahasan & Jalur Berpikir HOTS:
                    </div>

                    <p className="text-slate-800">
                      <strong>Konsep:</strong> {q.explanation.concept}
                    </p>

                    <div className="space-y-1 pl-1">
                      {q.explanation.stepByStep.map((step, sIdx) => (
                        <div key={sIdx} className="text-slate-600">
                          • {step}
                        </div>
                      ))}
                    </div>

                    <p className="pt-1 text-emerald-800 font-medium border-t border-slate-100">
                      <strong>Mengapa {q.correctAnswer} Benar:</strong> {q.explanation.whyCorrect}
                    </p>

                    {q.explanation.whyOthersWrong && (
                      <p className="text-slate-500">
                        <strong>Mengapa Pilihan Lain Keliru:</strong> {q.explanation.whyOthersWrong}
                      </p>
                    )}

                    {q.explanation.islamicIntegration && (
                      <div className="mt-2 rounded-lg bg-teal-50 border border-teal-200 p-2.5 text-teal-900">
                        <strong className="text-teal-800">Tadabbur Nilai Keislaman:</strong>{' '}
                        {q.explanation.islamicIntegration}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Assistant Modal for questions */}
      {selectedQuestionForAi && (
        <AiAssistantModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          question={selectedQuestionForAi}
          studentAnswer={session.answers[selectedQuestionForAi.id]}
          initialAction={aiAction}
        />
      )}
    </div>
  );
};
