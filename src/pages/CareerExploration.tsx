import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { careerRanking, occupationProfiles } from '../data/marketData';

export default function CareerExploration({ dark }: { dark: boolean }) {
  const [tab, setTab] = useState<'ranking' | 'profiles' | 'progression'>('ranking');
  const [selectedProfile, setSelectedProfile] = useState(occupationProfiles[0].id);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  const profile = occupationProfiles.find(p => p.id === selectedProfile)!;

  const tabs = [
    { id: 'ranking' as const, label: '🏆 Career Rankings' },
    { id: 'profiles' as const, label: '📋 Occupation Profiles' },
    { id: 'progression' as const, label: '🌳 Career Progression' },
  ];

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>Career Exploration</h1>
        <p className={`${sub} mb-6`}>Data-driven career insights from WEF, DOSM, and industry reports</p>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                tab === t.id ? 'gradient-btn text-white' : `${card} border ${text}`
              }`}>{t.label}</button>
          ))}
        </div>

        {tab === 'ranking' && (
          <div className="animate-fadeIn">
            <div className={`${card} border rounded-2xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'}`}>
                      <th className={`px-4 py-3 text-left ${sub} font-medium`}>Rank</th>
                      <th className={`px-4 py-3 text-left ${sub} font-medium`}>Career</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium`}>Overall</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden md:table-cell`}>Demand</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden md:table-cell`}>Growth</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden lg:table-cell`}>Stability</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium`}>AI Risk</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden lg:table-cell`}>WLB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careerRanking.map(c => (
                      <tr key={c.rank} className={`border-t ${dark ? 'border-[#2A2A3E]' : 'border-[#E0E0E0]'} hover:bg-[#6C63FF]/5 transition`}>
                        <td className={`px-4 py-3 ${text}`}>
                          {c.rank <= 3 ? ['🥇', '🥈', '🥉'][c.rank - 1] : `#${c.rank}`}
                        </td>
                        <td className={`px-4 py-3 font-medium ${text}`}>{c.career}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-lg gradient-btn text-white text-xs font-bold">{c.overall}</span>
                        </td>
                        <td className={`px-4 py-3 text-center hidden md:table-cell ${text}`}>{c.demand}</td>
                        <td className={`px-4 py-3 text-center hidden md:table-cell ${text}`}>{c.growth}</td>
                        <td className={`px-4 py-3 text-center hidden lg:table-cell ${text}`}>{c.stability}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold ${c.aiRisk < 30 ? 'text-green-400' : c.aiRisk < 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {c.aiRisk}%
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-center hidden lg:table-cell ${text}`}>{c.wlb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 border-t ${dark ? 'border-[#2A2A3E]' : 'border-[#E0E0E0]'}`}>
                <p className={`text-xs ${sub}`}>Source: Composite score from WEF 2025, DOSM, LinkedIn, Glassdoor, PayScale</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'profiles' && (
          <div className="animate-fadeIn">
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
              {occupationProfiles.map(p => (
                <button key={p.id} onClick={() => setSelectedProfile(p.id)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition ${
                    selectedProfile === p.id ? 'gradient-btn text-white' : `${card} border ${text}`
                  }`}>{p.title}</button>
              ))}
            </div>

            <div className={`${card} border rounded-2xl p-6`}>
              <h2 className={`text-xl font-bold ${text} font-heading mb-2`}>{profile.title}</h2>
              <p className={`text-sm ${sub} mb-6`}>{profile.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <MetricCard label="Fresh Grad Min" value={`RM ${profile.freshGradMin.toLocaleString()}`} color="#6C63FF" dark={dark} />
                <MetricCard label="Average Salary" value={`RM ${profile.average.toLocaleString()}`} color="#00D4AA" dark={dark} />
                <MetricCard label="Median Salary" value={`RM ${profile.median.toLocaleString()}`} color="#FFB800" dark={dark} />
                <MetricCard label="Senior Salary" value={`RM ${profile.senior.toLocaleString()}`} color="#FF6B35" dark={dark} />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
                  <div className={`text-xs ${sub} mb-1`}>Demand Level</div>
                  <div className={`text-sm font-bold ${text}`}>{profile.demandLevel}</div>
                  <div className={`text-xs ${sub}`}>{profile.demandPostings.toLocaleString()} postings</div>
                </div>
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
                  <div className={`text-xs ${sub} mb-1`}>AI Disruption Risk</div>
                  <div className={`text-sm font-bold ${profile.aiRisk < 30 ? 'text-green-400' : profile.aiRisk < 50 ? 'text-yellow-400' : 'text-red-400'}`}>{profile.aiRisk}%</div>
                  <div className="w-full h-1.5 rounded-full bg-gray-700 mt-1">
                    <div className={`h-full rounded-full ${profile.aiRisk < 30 ? 'bg-green-400' : profile.aiRisk < 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${profile.aiRisk}%` }}></div>
                  </div>
                </div>
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
                  <div className={`text-xs ${sub} mb-1`}>Work-Life Balance</div>
                  <div className={`text-sm font-bold text-[#6C63FF]`}>{profile.wlb}/10</div>
                  <div className={`text-xs ${sub}`}>{profile.workHours}h/week avg</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
                  <div className={`text-xs ${sub} mb-1`}>Career Stability</div>
                  <div className={`text-sm font-bold text-[#00D4AA]`}>{profile.stabilityScore}/10</div>
                </div>
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
                  <div className={`text-xs ${sub} mb-1`}>Remote Work</div>
                  <div className={`text-sm font-bold ${text}`}>{profile.remotePossibility}</div>
                </div>
              </div>

              <p className={`text-xs text-gray-500 mt-2`}>Source: Robert Walters Malaysia 2025 · DOSM Q4 2025 · PayScale MY</p>
              <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex gap-2 mt-5 flex-wrap">
                <a href="/jobs" className="text-xs px-3 py-2 rounded-lg bg-[#6C63FF] text-white hover:opacity-90">Find Jobs in This Role →</a>
                <a href="/career-coach" className="text-xs px-3 py-2 rounded-lg border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10">Ask AI Coach →</a>
                <a href="/skill-tree" className="text-xs px-3 py-2 rounded-lg border border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA]/10">View Skill Tree →</a>
              </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'progression' && (
          <div className="animate-fadeIn">
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
              {occupationProfiles.map(p => (
                <button key={p.id} onClick={() => setSelectedProfile(p.id)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition ${
                    selectedProfile === p.id ? 'gradient-btn text-white' : `${card} border ${text}`
                  }`}>{p.title}</button>
              ))}
            </div>

            <div className={`${card} border rounded-2xl p-6`}>
              <h2 className={`text-xl font-bold ${text} font-heading mb-6`}>{profile.title} — Career Progression</h2>
              
              {/* Progression Tree */}
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[700px]">
                  <div className="flex items-center gap-2">
                    {profile.progression.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`${
                          i === 0 ? 'bg-[#6C63FF]/20 border-[#6C63FF]' :
                          i < profile.progression.length - 1 ? 'bg-[#00D4AA]/20 border-[#00D4AA]' :
                          'bg-[#FF6B35]/20 border-[#FF6B35]'
                        } border-2 rounded-xl p-4 min-w-[140px] text-center`}>
                          <div className={`text-xs ${sub} mb-1`}>{step.level}</div>
                          <div className={`text-sm font-bold ${text}`}>{step.title}</div>
                          <div className="text-xs text-[#00D4AA] mt-1">{step.salaryRange}</div>
                          <div className={`text-xs ${sub} mt-0.5`}>{step.years}</div>
                        </div>
                        {i < profile.progression.length - 1 && (
                          <ChevronRight size={20} className={sub} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Branches */}
                  {profile.branches && profile.branches.length > 0 && (
                    <div className="mt-6 ml-auto max-w-md">
                      <div className={`text-xs ${sub} mb-2`}>Senior Branches:</div>
                      <div className="space-y-2">
                        {profile.branches.map((b, i) => (
                          <div key={i} className={`flex items-center gap-3 ${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-3`}>
                            <div className="w-2 h-2 rounded-full bg-[#FF6B35]"></div>
                            <div>
                              <span className={`text-sm font-medium ${text}`}>{b.path}</span>
                              <span className="text-xs text-[#00D4AA] ml-2">{b.salary}/mo</span>
                            </div>
                          </div>
                        ))}
                      </div>
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

function MetricCard({ label, value, color, dark }: { label: string; value: string; color: string; dark: boolean }) {
  return (
    <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      <div className="text-lg font-bold mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}
