import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Baby,
  AlertTriangle,
  FileQuestion,
  Calendar,
  X,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { Question } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  studentAnswer?: string | string[];
  weakTopics?: string[];
  initialAction?: 'hint' | 'explain' | 'explain_kids' | 'diagnose_wrong' | 'similar_question' | 'study_plan';
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  question,
  studentAnswer,
  weakTopics,
  initialAction = 'hint',
}) => {
  const [selectedAction, setSelectedAction] = useState<string>(initialAction);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (action: string) => {
    setSelectedAction(action);
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          question: question || {
            question: 'Prinsip Umum IPAS Terintegrasi & Pembinaan OMI 2026',
            topic: 'makhluk_hidup',
            subtopic: 'Keseimbangan Alam & Karakteristik Sains',
          },
          studentAnswer: studentAnswer || '',
          topic: question?.topic || 'makhluk_hidup',
          weakTopics: weakTopics || [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.answer);
      } else {
        setResponse('Mohon maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali sesaat lagi.');
      }
    } catch (err) {
      console.error(err);
      setResponse('Gagal terhubung dengan server AI. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-sky-100 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Kak Sains AI – Pembimbing OMI</h3>
              <p className="text-xs text-sky-100">Pendamping Cerdas Belajar IPAS Terintegrasi MI/SD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Pills */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-3 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            {question && (
              <>
                <button
                  onClick={() => handleAsk('hint')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedAction === 'hint'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  Petunjuk Tanpa Bocoran
                </button>

                <button
                  onClick={() => handleAsk('explain_kids')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedAction === 'explain_kids'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Baby className="h-3.5 w-3.5" />
                  Bahasa Anak Kelas 5
                </button>

                <button
                  onClick={() => handleAsk('explain')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedAction === 'explain'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Penjelasan Mendalam
                </button>

                {studentAnswer && (
                  <button
                    onClick={() => handleAsk('diagnose_wrong')}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedAction === 'diagnose_wrong'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Mengapa Jawaban Saya Salah?
                  </button>
                )}

                <button
                  onClick={() => handleAsk('similar_question')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedAction === 'similar_question'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileQuestion className="h-3.5 w-3.5" />
                  Buatkan Soal Serupa
                </button>
              </>
            )}

            <button
              onClick={() => handleAsk('study_plan')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedAction === 'study_plan'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Rencana Belajar 7 Hari
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800 text-sm leading-relaxed space-y-4">
          {question && (
            <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-xs text-sky-900">
              <span className="font-bold">Pertanyaan yang ditanyakan:</span>{' '}
              <span className="line-clamp-2">{question.question}</span>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
                <Sparkles className="absolute h-5 w-5 text-amber-500 animate-pulse" />
              </div>
              <p className="font-semibold text-slate-700">Kak Sains AI sedang meracik penjelasan terbaik...</p>
              <p className="text-xs text-slate-500 mt-1">Menghubungkan konsep sains dengan daya nalar kritis</p>
            </div>
          )}

          {!loading && response && (
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line rounded-xl bg-slate-50 p-4 border border-slate-100">
              {response}
            </div>
          )}

          {!loading && !response && (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
              <Lightbulb className="h-10 w-10 text-amber-400 mb-2 stroke-[1.5]" />
              <p className="font-medium">Pilih salah satu tombol bantuan di atas untuk memulai konsultasi.</p>
              <p className="text-xs text-slate-400 mt-1">
                Kak Sains AI dirancang khusus membimbing peserta OMI berpikir mandiri tanpa membocorkan jawaban langsung.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
          <div className="text-[11px] text-slate-400">
            Ditenagai oleh Gemini AI • Berbasis Nilai Sains & Keislaman OMI 2026
          </div>
          <div className="flex items-center gap-2">
            {response && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Tersalin' : 'Salin Penjelasan'}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
