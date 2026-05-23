import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RotateCcw, Mic, StopCircle } from 'lucide-react';
import { callGemini } from '../data/marketData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InterviewConfig {
  role: string;
  type: string;
  level: string;
  active: boolean;
  questionCount: number;
  score?: number;
  strengths?: string[];
  improvements?: string[];
  finished: boolean;
}

const SYSTEM_PROMPT = `You are SigmaJob's AI Career Coach. You specialize in the Malaysian job market.
Use real Malaysian salary data: Software Engineers earn RM 3,000–RM 18,000/month depending on seniority; national MEDIAN salary is RM 3,167/month (DOSM Q4 2025); national MEAN salary is RM 3,652/month; KL median salary is RM 4,391/month. Malaysia cybersecurity talent deficit: 70,000+ unfilled roles (NACSA 2024). Nurse shortage: 20,000 nationally (MOH 2024). AI/ML Specialists: +41% YoY growth, RM 9,000–18,000/month.
Reference real Malaysian companies (Grab, Petronas, Maybank, AirAsia, TechCorp, CIMB, Axiata, Maxis).
Cite WEF Future of Jobs 2025 data when relevant: 170M new jobs by 2030, 92M displaced, 59% of workers need reskilling.
Be helpful, specific, and data-driven. Under 200 words per response.`;

const INTERVIEW_SYSTEM_PROMPT = `You are an expert interviewer conducting a {interviewType} interview for a {role} position. The candidate has {level} experience. RULES:
1. Ask ONE question at a time only.
2. After each candidate answer: give 2–3 sentence feedback (what was good, what to improve).
3. Then ask the next question.
4. Stop after exactly 5 questions.
5. After the 5th answer, give: Overall Score /10, Top 3 Strengths, Top 2 Areas to Improve.
Start with a brief greeting and your FIRST question only.`;

const suggestions = [
  "What's the best career path for a fresh grad in Malaysia?",
  "How much do software engineers earn in KL?",
  "Is cybersecurity a good career for 2025?",
  "What skills should I learn to be AI-proof?",
  "Compare data analyst vs business analyst salary",
  "What are the top hiring companies in Penang?",
];

const interviewRoles = ['Software Engineer', 'Data Scientist', 'Cybersecurity Analyst', 'Registered Nurse', 'Business Analyst', 'UX Designer', 'Financial Analyst', 'AI/ML Engineer'];
const interviewTypes = ['Technical', 'Behavioral', 'HR Screening', 'Case Study'];
const interviewLevels = ['Fresh Graduate', '1–3 Years', '3–5 Years', '5+ Years'];

export default function CareerCoach({ dark }: { dark: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Career Coach powered by real Malaysian market data. I can help you with career decisions, salary benchmarks, skill recommendations, and job market insights. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [mode, setMode] = useState<'career' | 'interview'>('career');
  const [interview, setInterview] = useState<InterviewConfig>({
    role: 'Software Engineer', type: 'Technical', level: 'Fresh Graduate',
    active: false, questionCount: 0, finished: false,
  });
  const chatRef = useRef<HTMLDivElement>(null);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (msg?: string) => {
    const content = msg || input.trim();
    if (!content || loading) return;
    setInput('');
    setError(false);

    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      let systemPrompt = SYSTEM_PROMPT;
      if (mode === 'interview') {
        systemPrompt = INTERVIEW_SYSTEM_PROMPT
          .replace('{interviewType}', interview.type)
          .replace('{role}', interview.role)
          .replace('{level}', interview.level);
      }

      const history = newMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      const prompt = `${systemPrompt}\n\nConversation:\n${history}\n\nassistant:`;
      const response = await callGemini(prompt);
      setMessages([...newMessages, { role: 'assistant', content: response }]);

      // Track interview questions
      if (mode === 'interview' && interview.active) {
        const newCount = interview.questionCount + 1;
        if (newCount >= 5) {
          setInterview(prev => ({ ...prev, questionCount: 5, finished: true }));
        } else {
          setInterview(prev => ({ ...prev, questionCount: newCount }));
        }
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      setMessages(newMessages);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = () => {
    const greeting: Message = {
      role: 'assistant',
      content: `🎤 Starting ${interview.type} interview for **${interview.role}** (${interview.level}).\n\nI'll ask you 5 questions one at a time. After each answer I'll give feedback, then ask the next question. Ready? Let's begin!`
    };
    setMessages([greeting]);
    setInterview(prev => ({ ...prev, active: true, questionCount: 0, finished: false }));
  };

  const endInterview = () => {
    setInterview(prev => ({ ...prev, active: false, finished: true }));
    setMessages(prev => [...prev, { role: 'assistant', content: '🛑 Interview ended early. You can start a new one anytime.' }]);
  };

  const switchToCareer = () => {
    setMode('career');
    setInterview({ role: 'Software Engineer', type: 'Technical', level: 'Fresh Graduate', active: false, questionCount: 0, finished: false });
    setMessages([{ role: 'assistant', content: "Hi! I'm your AI Career Coach powered by real Malaysian market data. I can help you with career decisions, salary benchmarks, skill recommendations, and job market insights. What would you like to know?" }]);
  };

  const retry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(messages.filter((_, i) => i < messages.length));
      sendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16 flex flex-col`}>
      <div className="max-w-3xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => { setMode('career'); switchToCareer(); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${mode === 'career' ? 'bg-[#6C63FF] text-white' : `${card} border ${text}`}`}>
            💬 Career Advice
          </button>
          <button onClick={() => { setMode('interview'); setMessages([{ role: 'assistant', content: 'Set up your mock interview below.' }]); setInterview(prev => ({ ...prev, active: false, finished: false })); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${mode === 'interview' ? 'bg-[#6C63FF] text-white' : `${card} border ${text}`}`}>
            🎤 Interview Prep
          </button>
        </div>

        {mode === 'interview' && !interview.active && !interview.finished && (
          <div className={`${card} border rounded-2xl p-6 mb-4 animate-fadeIn`}>
            <h3 className={`text-sm font-bold ${text} mb-4`}>🎤 Mock Interview Setup</h3>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className={`text-xs ${sub} block mb-1`}>Job Role</label>
                <select value={interview.role} onChange={e => setInterview({ ...interview, role: e.target.value })}
                  className={`w-full ${dark ? 'bg-[#0D0D0D]' : 'bg-white'} border ${dark ? 'border-[#2A2A3E] text-white' : 'border-[#E0E0E0] text-gray-900'} rounded-xl px-3 py-2 text-sm outline-none`}>
                  {interviewRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={`text-xs ${sub} block mb-1`}>Interview Type</label>
                <select value={interview.type} onChange={e => setInterview({ ...interview, type: e.target.value })}
                  className={`w-full ${dark ? 'bg-[#0D0D0D]' : 'bg-white'} border ${dark ? 'border-[#2A2A3E] text-white' : 'border-[#E0E0E0] text-gray-900'} rounded-xl px-3 py-2 text-sm outline-none`}>
                  {interviewTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={`text-xs ${sub} block mb-1`}>Experience Level</label>
                <select value={interview.level} onChange={e => setInterview({ ...interview, level: e.target.value })}
                  className={`w-full ${dark ? 'bg-[#0D0D0D]' : 'bg-white'} border ${dark ? 'border-[#2A2A3E] text-white' : 'border-[#E0E0E0] text-gray-900'} rounded-xl px-3 py-2 text-sm outline-none`}>
                  {interviewLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={startInterview}
              className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
              <Mic size={16} /> Start Mock Interview
            </button>
          </div>
        )}

        {/* Chat Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${text} font-heading`}>AI Career Coach</h1>
            <p className={`text-xs ${sub}`}>Powered by Gemini · Real Malaysian market data</p>
          </div>
          {mode === 'interview' && interview.active && (
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-xs ${sub}`}>Question {interview.questionCount}/5</span>
              <button onClick={endInterview} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30">
                <StopCircle size={14} /> End
              </button>
            </div>
          )}
        </div>

        {/* Chat */}
        <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[calc(100vh-300px)]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''} animate-fadeIn`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'user'
                  ? 'gradient-btn text-white rounded-br-md'
                  : `${card} border ${text} rounded-bl-md`
              }`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className={`w-8 h-8 rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-200'} flex items-center justify-center shrink-0`}>
                  <User size={16} className={sub} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className={`${card} border rounded-2xl px-4 py-3 rounded-bl-md`}>
                <Loader2 size={16} className="text-[#6C63FF] animate-spin" />
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={retry} className="flex items-center gap-1 text-red-300 hover:text-white">
                <RotateCcw size={14} /> Retry
              </button>
            </div>
          )}
        </div>

        {/* Interview result card */}
        {mode === 'interview' && interview.finished && (
          <div className={`${card} border rounded-2xl p-4 mb-4 animate-fadeIn`}>
            <p className={`text-sm font-bold ${text} mb-2`}>✅ Interview Complete</p>
            <div className="flex gap-2">
              <button onClick={startInterview} className="gradient-btn text-white px-4 py-2 rounded-lg text-xs font-medium">
                🔄 Start New Interview
              </button>
              <button onClick={switchToCareer} className={`px-4 py-2 rounded-lg text-xs font-medium border ${card} ${text}`}>
                💬 Switch to Career Advice
              </button>
            </div>
          </div>
        )}

        {/* Suggestions (only in career mode, no messages yet) */}
        {mode === 'career' && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className={`text-xs px-3 py-2 rounded-xl ${card} border hover:border-[#6C63FF] ${text} transition`}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={`${card} border rounded-2xl p-2 flex gap-2`}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={mode === 'interview' ? "Type your answer..." : "Ask about careers, salaries, skills..."}
            className={`flex-1 bg-transparent px-4 py-2.5 text-sm ${text} outline-none`} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="gradient-btn text-white p-2.5 rounded-xl disabled:opacity-50 transition">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}