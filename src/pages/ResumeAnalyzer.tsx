import { useState, useRef } from 'react';
import { FileText, Loader2, RotateCcw, CheckCircle, AlertTriangle, GraduationCap, Upload, X } from 'lucide-react';
import { callGemini, callGeminiWithFile } from '../data/marketData';

const careers = [
  "Software Engineer", "Data Analyst", "Cybersecurity Analyst", "Registered Nurse",
  "Business Analyst", "UX Designer", "Financial Analyst", "Graphic Designer",
  "AI/ML Engineer", "Mechanical Engineer"
];

interface AnalysisResult {
  score: number;
  skillsFound: string[];
  missingSkills: string[];
  suggestions: string[];
  perfectResumeModel: string;
  keywordsToAdd: string[];
  freshGradUniversities: { name: string; country: string; reason: string }[];
}

const loadingSteps = [
  '📄 Reading your resume...',
  '🔍 Extracting skills...',
  '📊 Comparing with job requirements...',
  '🎯 Finding skill gaps...',
  '💡 Generating suggestions...',
  '✅ Finalizing your analysis...',
];

export default function ResumeAnalyzer({ dark }: { dark: boolean }) {
  const [career, setCareer] = useState('Software Engineer');
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<false | 'generic'>(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  const buildPrompt = () => {
    return `You are a professional resume analyst for the Malaysian job market. The user is targeting ${career}. Resume text: ${resumeText}. Respond in valid JSON only (no markdown, no backticks, no explanation): { "score": number 0-100, "skillsFound": ["string array of skills found"], "missingSkills": ["string array of missing critical skills"], "suggestions": ["8 specific actionable suggestions"], "perfectResumeModel": "brief description of ideal resume for this role", "keywordsToAdd": ["8 important keywords to add"], "freshGradUniversities": [{"name": "uni name", "country": "country", "reason": "why this uni is good for this career"}] }`;
  };

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB.');
      return;
    }
    setFile(f);
  };

  const analyze = async () => {
    if (!resumeText.trim() && !file) return;
    setLoading(true);
    setError(false);
    setResult(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => prev < loadingSteps.length - 1 ? prev + 1 : prev);
    }, 800);

    try {
      let result: string;
      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        result = await callGeminiWithFile(buildPrompt(), base64, file.type);
      } else {
        result = await callGemini(buildPrompt());
      }
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (err: any) {
      setError('generic');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>Resume Analyzer</h1>
        <p className={`${sub} mb-8`}>AI-powered resume review for the Malaysian job market</p>

        {!result && !loading && (
          <div className={`${card} border rounded-2xl p-6 animate-fadeIn`}>
            <div className="mb-4">
              <label className={`text-sm font-medium ${text} block mb-2`}>Target Career</label>
              <select value={career} onChange={e => setCareer(e.target.value)}
                className={`w-full ${dark ? 'bg-[#0D0D0D] border-[#2A2A3E] text-white' : 'bg-white border-[#E0E0E0] text-gray-900'} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                {careers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition mb-4 ${
                dragOver ? 'border-[#6C63FF] bg-[#6C63FF]/5' : dark ? 'border-[#3A3A3A] hover:border-[#6C63FF]' : 'border-[#E5E2DB] hover:border-[#6C63FF]'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} className="text-[#6C63FF]" />
                  <div className="text-left">
                    <div className={`text-sm font-medium ${text}`}>{file.name}</div>
                    <div className={`text-xs ${sub}`}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-1 rounded-full hover:bg-white/10">
                    <X size={16} className={sub} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={32} className={`mx-auto mb-2 ${sub}`} />
                  <p className={`text-sm font-medium ${text}`}>Drop your resume here</p>
                  <p className={`text-xs ${sub} mt-1`}>PDF · PNG · JPG · WEBP</p>
                </div>
              )}
            </div>

            {/* Toggle text input */}
            <div className="text-center mb-3">
              <button onClick={() => setShowTextInput(!showTextInput)}
                className={`text-xs ${sub} hover:text-[#6C63FF] underline`}>
                {showTextInput ? '← Hide text input' : 'Or paste resume text instead ↓'}
              </button>
            </div>

            {showTextInput && (
              <div className="mb-4">
                <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here... (or summarize your experience, skills, education)"
                  rows={8}
                  className={`w-full ${dark ? 'bg-[#0D0D0D] border-[#2A2A3E] text-white' : 'bg-white border-[#E0E0E0] text-gray-900'} border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6C63FF] resize-none`} />
              </div>
            )}

            <button onClick={analyze} disabled={(!resumeText.trim() && !file)}
              className="w-full gradient-btn text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              <FileText size={18} /> Analyze Resume
            </button>
          </div>
        )}

        {loading && (
          <div className={`${card} border rounded-2xl p-8 text-center animate-fadeIn`}>
            <Loader2 size={40} className="text-[#6C63FF] animate-spin mx-auto mb-4" />
            <div className="space-y-2">
              {loadingSteps.map((step, i) => (
                <div key={i} className={`text-sm transition-all duration-500 ${
                  i <= loadingStep ? `${text} opacity-100` : `${sub} opacity-30`
                }`}>{step}</div>
              ))}
            </div>
          </div>
        )}

        {error === 'generic' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center animate-fadeIn">
            <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-400 mb-3">Analysis failed. Please try again.</p>
            <button onClick={analyze} className="gradient-btn text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 mx-auto">
              <RotateCcw size={16} /> Retry Analysis
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-fadeIn">
            <button onClick={() => { setResult(null); setResumeText(''); setFile(null); }}
              className={`text-sm ${sub} hover:text-[#6C63FF]`}>← Analyze another resume</button>

            {/* Score */}
            <div className={`${card} border rounded-2xl p-6 text-center`}>
              <div className="text-5xl font-bold gradient-text mb-2">{result.score}/100</div>
              <div className={`text-sm ${sub}`}>Resume Score for {career}</div>
              <div className="w-full h-2 rounded-full bg-gray-700 mt-3">
                <div className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] transition-all duration-1000"
                  style={{ width: `${result.score}%` }}></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Skills Found */}
              <div className={`${card} border rounded-2xl p-5`}>
                <h3 className={`font-semibold ${text} mb-3 flex items-center gap-2`}>
                  <CheckCircle size={16} className="text-[#00D4AA]" /> Skills Found
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.skillsFound.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className={`${card} border rounded-2xl p-5`}>
                <h3 className={`font-semibold ${text} mb-3 flex items-center gap-2`}>
                  <AlertTriangle size={16} className="text-[#FF6B35]" /> Missing Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map(s => (
                    <a href="/skill-tree" key={s} className="inline-block">
                      <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 cursor-pointer">{s}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className={`${card} border rounded-2xl p-5`}>
              <h3 className={`font-semibold ${text} mb-3`}>💡 Suggestions</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className={`text-sm ${sub} flex items-start gap-2`}>
                    <span className="text-[#6C63FF] font-bold shrink-0">{i + 1}.</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className={`${card} border rounded-2xl p-5`}>
              <h3 className={`font-semibold ${text} mb-3`}>🔑 Keywords to Add</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.keywordsToAdd.map(k => (
                  <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]">{k}</span>
                ))}
              </div>
            </div>

            {/* Universities */}
            {result.freshGradUniversities && result.freshGradUniversities.length > 0 && (
              <div className={`${card} border rounded-2xl p-5`}>
                <h3 className={`font-semibold ${text} mb-3 flex items-center gap-2`}>
                  <GraduationCap size={16} className="text-[#6C63FF]" /> Recommended Universities
                </h3>
                <div className="space-y-2">
                  {result.freshGradUniversities.map((u, i) => (
                    <div key={i} className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-3`}>
                      <div className={`font-medium ${text} text-sm`}>{u.name}</div>
                      <div className={`text-xs ${sub}`}>{u.country} — {u.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfect Resume */}
            <div className={`${card} border rounded-2xl p-5`}>
              <h3 className={`font-semibold ${text} mb-3`}>⭐ Ideal Resume Model</h3>
              <p className={`text-sm ${sub}`}>{result.perfectResumeModel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}