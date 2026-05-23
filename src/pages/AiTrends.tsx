import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { allAiDisruption, aiProofSkills, aiAmplifyingSkills, callGemini } from '../data/marketData';

export default function AiTrends({ dark }: { dark: boolean }) {
  const [selectedOcc, setSelectedOcc] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  const chartData = allAiDisruption.sort((a, b) => b.risk - a.risk).map(d => ({
    name: d.occupation.length > 20 ? d.occupation.slice(0, 20) + '…' : d.occupation,
    fullName: d.occupation,
    risk: d.risk,
    category: d.category,
  }));

  const getColor = (risk: number) => {
    if (risk >= 60) return '#EF4444';
    if (risk >= 30) return '#F59E0B';
    return '#10B981';
  };

  const analyzeOccupation = async () => {
    if (!selectedOcc) return;
    setLoading(true);
    setError(false);
    try {
      const prompt = `Analyze the AI disruption risk for "${selectedOcc}" in the Malaysian job market. 
      Use real data: the occupation has approximately ${allAiDisruption.find(d => d.occupation.includes(selectedOcc))?.risk || 'unknown'}% automation risk.
      Cover: 1) Which tasks AI will automate 2) Which tasks remain human 3) How to future-proof 
      4) Timeline (2025-2030). Keep under 200 words. Reference WEF Future of Jobs 2025 data.`;
      const result = await callGemini(prompt);
      setAnalysis(result);
    } catch (err: any) {
      setError('generic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>AI Trend Analyzer</h1>
        <p className={`${sub} mb-6`}>Understand how AI will impact every occupation</p>

        {/* WEF Stat Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-green-500/10 p-6 mb-8 border border-[#2A2A3E]">
          <p className={`text-lg font-semibold ${text} text-center`}>
            WEF Future of Jobs 2025: <span className="text-red-400">92 million</span> roles will be displaced by 2030.
            <span className="text-green-400"> 170 million</span> new roles will be created.
            Net gain: <span className="gradient-text font-bold">+78 million jobs</span>.
          </p>
        </div>

        {/* Main Chart */}
        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-1`}>AI Disruption Risk by Occupation</h2>
          <p className={`text-xs ${sub} mb-4`}>Source: Oxford Frey-Osborne / WEF 2025 / McKinsey 2024 / Goldman Sachs 2024</p>
          
          <div className="flex gap-4 mb-4">
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-sm bg-red-500"></span> High (&gt;60%)</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-sm bg-yellow-500"></span> Medium (30-60%)</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-sm bg-green-500"></span> Low (&lt;30%)</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] h-[700px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" domain={[0, 100]} stroke={dark ? '#666' : '#999'} fontSize={11} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={160} stroke={dark ? '#666' : '#999'} fontSize={10} />
                  <Tooltip
                    contentStyle={{ background: dark ? '#1A1A2E' : '#fff', border: '1px solid #2A2A3E', borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any) => [`${value}% risk`, 'AI Disruption']}
                  />
                  <Bar dataKey="risk" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getColor(entry.risk)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Analysis Tool */}
        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>🤖 AI Deep Analysis</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select value={selectedOcc} onChange={e => setSelectedOcc(e.target.value)}
              className={`${dark ? 'bg-[#0D0D0D] border-[#2A2A3E] text-white' : 'bg-white border-[#E0E0E0] text-gray-900'} border rounded-xl px-4 py-2.5 text-sm flex-1 outline-none`}>
              <option value="">Select an occupation...</option>
              {allAiDisruption.map(d => (
                <option key={d.occupation} value={d.occupation}>{d.occupation} ({d.risk}%)</option>
              ))}
            </select>
            <button onClick={analyzeOccupation} disabled={!selectedOcc || loading}
              className="gradient-btn text-white px-6 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 flex items-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : 'Analyze with AI'}
            </button>
          </div>
          {error === 'generic' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
              Failed to analyze. <button onClick={analyzeOccupation} className="underline">Retry</button>
            </div>
          )}
          {analysis && (
            <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 text-sm ${text} whitespace-pre-wrap animate-fadeIn`}>
              {analysis}
            </div>
          )}
        </div>

        {/* AI-Proof & Amplifying Skills */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`text-lg font-bold ${text} font-heading mb-4 flex items-center gap-2`}>
              <Shield size={20} className="text-green-400" /> AI-Proof Skills
            </h2>
            <p className={`text-xs ${sub} mb-3`}>Skills AI cannot replicate</p>
            <div className="flex flex-wrap gap-2">
              {aiProofSkills.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{s}</span>
              ))}
            </div>
          </div>
          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`text-lg font-bold ${text} font-heading mb-4 flex items-center gap-2`}>
              <AlertTriangle size={20} className="text-[#6C63FF]" /> AI-Amplifying Skills
            </h2>
            <p className={`text-xs ${sub} mb-3`}>MORE valuable when combined with AI</p>
            <div className="flex flex-wrap gap-2">
              {aiAmplifyingSkills.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={`${card} border rounded-2xl p-4 text-center`}>
          <p className={`text-xs ${sub}`}>
            Sources: Oxford Frey-Osborne Automation Study | WEF Future of Jobs 2025 | McKinsey AI Task Research 2024 | Goldman Sachs AI Report 2024
          </p>
        </div>
      </div>
    </div>
  );
}