import { useState } from 'react';
import { GraduationCap, MapPin, Users, Award, ChevronDown, ChevronUp, X, Loader2, Sparkles } from 'lucide-react';
import { universities, callGemini } from '../data/marketData';

const studyFields = ['Technology', 'Healthcare', 'Business', 'Engineering', 'Law', 'Sciences', 'Design', 'Architecture'];

export default function Universities({ dark }: { dark: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState('All');
  const [sort, setSort] = useState<'rank' | 'employability'>('rank');
  const [compared, setCompared] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [selectedField, setSelectedField] = useState('Technology');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  const countries = ['All', ...new Set(universities.map(u => u.country))];

  let filtered = universities.filter(u => filterCountry === 'All' || u.country === filterCountry);
  filtered = [...filtered].sort((a, b) => sort === 'rank' ? a.qsRank - b.qsRank : b.employability - a.employability);

  const getAiAnalysis = async () => {
    const ids = [...compared];
    const u1 = universities.find(u => u.id === ids[0])!;
    const u2 = universities.find(u => u.id === ids[1])!;

    setAiLoading(true);
    setAiError(false);
    setAiAnalysis('');

    try {
      const prompt = `Compare ${u1.name} (QS rank #${u1.qsRank}, located in ${u1.city}, graduate employability ${u1.employability}%, local tuition ${u1.tuitionLocal}) with ${u2.name} (QS rank #${u2.qsRank}, located in ${u2.city}, graduate employability ${u2.employability}%, local tuition ${u2.tuitionLocal}). A student wants to study ${selectedField}. Which university is the better choice and why? Cover: value for money, career outcomes, scholarship availability, and location advantage. Be specific. Keep under 200 words.`;
      const response = await callGemini(prompt);
      setAiAnalysis(response);
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>Universities</h1>
        <p className={`${sub} mb-6`}>QS World Rankings 2025 — Real data from official sources</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
            className={`${dark ? 'bg-[#1A1A2E] border-[#2A2A3E] text-white' : 'bg-white border-[#E0E0E0] text-gray-900'} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value as any)}
            className={`${dark ? 'bg-[#1A1A2E] border-[#2A2A3E] text-white' : 'bg-white border-[#E0E0E0] text-gray-900'} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
            <option value="rank">Sort by QS Rank</option>
            <option value="employability">Sort by Employability</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.map(u => (
            <div key={u.id} className={`${card} border rounded-2xl overflow-hidden transition hover:border-[#6C63FF]`}>
              <button onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                className="w-full text-left p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-btn flex items-center justify-center text-white text-lg font-bold shrink-0">
                      {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className={`font-bold ${text} text-lg font-heading`}>{u.name}</div>
                      <div className={`text-sm ${sub} flex items-center gap-2 mt-0.5`}>
                        <MapPin size={14} /> {u.city}, {u.country}
                        <span className="text-[#6C63FF] font-medium">· {u.rankInCountry}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {u.knownFor.map(k => (
                          <span key={k} className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#6C63FF]">{u.qsRankLabel}</div>
                      <div className={`text-xs ${sub}`}>QS Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#00D4AA]">{u.employability}%</div>
                      <div className={`text-xs ${sub}`}>Employability</div>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={compared.has(u.id)}
                        onChange={() => {
                          const next = new Set(compared);
                          if (next.has(u.id)) next.delete(u.id);
                          else if (next.size < 2) next.add(u.id);
                          setCompared(next);
                        }}
                        className="w-4 h-4 rounded" />
                      <span className={`text-xs ${sub}`}>Compare</span>
                    </label>
                    {expanded === u.id ? <ChevronUp size={20} className={sub} /> : <ChevronDown size={20} className={sub} />}
                  </div>
                </div>
              </button>

              {expanded === u.id && (
                <div className={`border-t ${dark ? 'border-[#2A2A3E]' : 'border-[#E0E0E0]'} p-6 animate-fadeIn`}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className={`text-sm font-semibold ${text} mb-2 flex items-center gap-2`}>
                        <GraduationCap size={16} className="text-[#6C63FF]" /> Tuition Fees
                      </h3>
                      <div className={`text-sm ${sub}`}>
                        <p>Local: <span className={text}>{u.tuitionLocal}</span></p>
                        <p>International: <span className={text}>{u.tuitionIntl}</span></p>
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${text} mb-2 flex items-center gap-2`}>
                        <Award size={16} className="text-[#00D4AA]" /> Scholarships
                      </h3>
                      <ul className={`text-sm ${sub} space-y-1`}>
                        {u.scholarships.map(s => (
                          <li key={s} className="flex items-start gap-1">
                            <span className="text-[#00D4AA]">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${text} mb-2 flex items-center gap-2`}>
                        <Users size={16} className="text-[#FF6B35]" /> Key Stats
                      </h3>
                      <div className={`text-sm ${sub}`}>
                        <p>Students: <span className={text}>{u.students?.toLocaleString()}</span></p>
                        <p>Employability: <span className="text-[#00D4AA] font-medium">{u.employability}%</span></p>
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs ${sub} mt-4`}>Source: QS World University Rankings 2025, official university websites</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Compare Button */}
        {compared.size === 2 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slideUp">
            <button onClick={() => setShowCompare(true)}
              className="gradient-btn text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition">
              📊 Compare {compared.size} Universities
            </button>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && compared.size === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className={`${card} border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-fadeIn`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-bold ${text} font-heading`}>University Comparison</h2>
                  <button onClick={() => setShowCompare(false)} className={sub}><X size={20} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className={`px-3 py-2 text-left ${sub} font-medium border-b ${dark ? 'border-[#2A2A3E]' : 'border-[#E0E0E0]'}`}>Metric</th>
                        {[...compared].map(id => {
                          const u = universities.find(uu => uu.id === id)!;
                          return <th key={id} className={`px-3 py-2 text-left ${text} font-medium border-b ${dark ? 'border-[#2A2A3E]' : 'border-[#E0E0E0]'}`}>{u.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'QS Rank', getValue: (u: typeof universities[0]) => u.qsRankLabel },
                        { label: 'Location', getValue: (u: typeof universities[0]) => `${u.city}, ${u.country}` },
                        { label: 'Tuition (Local)', getValue: (u: typeof universities[0]) => u.tuitionLocal },
                        { label: 'Tuition (Intl)', getValue: (u: typeof universities[0]) => u.tuitionIntl },
                        { label: 'Employability', getValue: (u: typeof universities[0]) => `${u.employability}%` },
                        { label: 'Students', getValue: (u: typeof universities[0]) => u.students?.toLocaleString() || 'N/A' },
                        { label: 'Known For', getValue: (u: typeof universities[0]) => u.knownFor.join(', ') },
                        { label: 'Scholarships', getValue: (u: typeof universities[0]) => u.scholarships.join(', ') },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className={`px-3 py-2 ${sub} font-medium border-b ${dark ? 'border-[#2A2A3E]/50' : 'border-[#E0E0E0]/50'}`}>{row.label}</td>
                          {[...compared].map(id => {
                            const u = universities.find(uu => uu.id === id)!;
                            return <td key={id} className={`px-3 py-2 ${text} border-b ${dark ? 'border-[#2A2A3E]/50' : 'border-[#E0E0E0]/50'}`}>{row.getValue(u)}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* AI Comparison */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <label className={`text-xs ${sub} block mb-1`}>Field of Study</label>
                      <select value={selectedField} onChange={e => setSelectedField(e.target.value)}
                        className={`w-full ${dark ? 'bg-[#1A1A2E] border-[#2A2A3E] text-white' : 'bg-white border-[#E0E0E0] text-gray-900'} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                        {studyFields.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <button onClick={getAiAnalysis} disabled={aiLoading}
                      className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 mt-5 disabled:opacity-50">
                      {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      {aiLoading ? 'Analyzing...' : 'Get AI Analysis'}
                    </button>
                  </div>
                  {aiError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-3">
                      Analysis failed. <button onClick={getAiAnalysis} className="underline">Try again</button>
                    </div>
                  )}
                  {aiAnalysis && (
                    <div className={`${dark ? 'bg-[#1A1A2E]' : 'bg-[#F5F5F5]'} rounded-xl p-4 text-sm ${text} whitespace-pre-wrap animate-fadeIn`}>
                      {aiAnalysis}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}