import React, { useState } from 'react';
import { DecisionAnalysisResult } from '../types';
import { Sparkles, X, Send, Bot, User, CornerDownRight, Loader2 } from 'lucide-react';

interface ConsultationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  decisionData: DecisionAnalysisResult;
}

interface Message {
  sender: 'user' | 'oracle';
  text: string;
}

export const ConsultationDrawer: React.FC<ConsultationDrawerProps> = ({
  isOpen,
  onClose,
  decisionData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'oracle',
      text: `Greetings. I am the SunbeamGaia Decision Oracle. I have mapped your dilemma: "${decisionData.title}". What blind spot, negotiation lever, or fear do you wish to pressure-test?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Stress-test the winning option: what is the worst-case failure mode?',
    'What is the single biggest blind spot I might be ignoring?',
    'How can I negotiate to combine the best parts of both choices?',
    'What should I say when informing the other party?',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: q.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/decision/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemmaTitle: decisionData.title,
          decisionData,
          userQuestion: q.trim(),
        }),
      });

      const rawBody = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error(
          `Oracle request interrupted or timed out (HTTP ${res.status}). Please try again.`
        );
      }

      if (res.ok && data?.success && data?.answer) {
        setMessages((prev) => [
          ...prev,
          { sender: 'oracle', text: data.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'oracle',
            text: data?.error || 'I could not synthesize an answer at this moment. Please try again.',
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'oracle',
          text: `Error connecting to oracle: ${err.message || 'Unknown network error'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gray-900 border-l border-amber-500/30 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Sunbeam Oracle & Devil's Advocate
              </h3>
              <p className="text-[11px] text-gray-400">Pressure-test your choice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 text-xs ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'oracle' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-gray-950 font-medium rounded-tr-none'
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sunbeam Oracle is contemplating...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-gray-800/80 bg-gray-950/40 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-gray-400">
            Suggested Queries:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="text-[11px] text-left px-2 py-1 rounded bg-gray-800/80 hover:bg-gray-750 text-gray-300 border border-gray-700/60 transition flex items-center gap-1"
              >
                <CornerDownRight className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{qp}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-gray-800 bg-gray-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask the Oracle a follow-up..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-850 border border-gray-700 text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
