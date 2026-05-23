import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { seedJobs, jobDemandMalaysia, emergingRoles } from '../data/marketData';

const tools = [
  { label: 'Career Explorer', desc: 'Browse careers with real salary, demand and AI risk data.', to: '/career-exploration', icon: '📊' },
  { label: 'Skill Tree', desc: 'Track your progression from beginner to expert.', to: '/skill-tree', icon: '🌳' },
  { label: 'Job Listings', desc: 'Real positions from Grab, Petronas, Maybank and more.', to: '/jobs', icon: '💼' },
  { label: 'Market Trends', desc: 'What employers want, which fields are growing.', to: '/trends', icon: '📈' },
  { label: 'University Pathways', desc: 'QS-ranked institutions with tuition and scholarship data.', to: '/universities', icon: '🎓' },
  { label: 'Resume Analyzer', desc: 'Get your resume reviewed against real job requirements.', to: '/resume-analyzer', icon: '📝' },
  { label: 'Career Coach', desc: 'Ask questions about careers, salaries and strategy.', to: '/career-coach', icon: '🧭' },
  { label: 'AI Impact Analysis', desc: 'Which jobs are safe from automation, and which are not.', to: '/ai-trends', icon: '🤖' },
];

const topDemand = jobDemandMalaysia.slice(0, 5).map(d => ({
  name: d.role.length > 16 ? d.role.slice(0, 16) + '…' : d.role,
  postings: d.postings,
}));

export default function Home({ dark }: { dark: boolean }) {
  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  return (
    <div className={`${bg} min-h-screen pt-14`}>

      {/* ── Section 1: What SigmaJob does ── */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className={`text-3xl md:text-4xl font-bold ${text} leading-tight mb-4`}>
          Plan your education and career<br />using real job market data.
        </h1>
        <p className={`text-base ${sub} max-w-xl mx-auto mb-8 leading-relaxed`}>
          Explore careers. Compare university pathways. Build skills. Track demand. Get guidance.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/career-exploration" className="btn-primary px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition">
            Explore Careers
          </Link>
          <Link to="/skill-tree" className={`${card} border px-6 py-2.5 rounded-lg font-medium text-sm ${text} hover:border-[#1F4D3A] transition`}>
            Open Skill Tree
          </Link>
        </div>
      </section>

      {/* ── Section 2: Career Tools ── */}
      <section className={`${dark ? 'bg-[#232323]' : 'bg-white'} border-y ${dark ? 'border-[#3A3A3A]' : 'border-[#E5E2DB]'}`}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className={`text-lg font-bold ${text} mb-1`}>Career Tools</h2>
          <p className={`text-sm ${sub} mb-6`}>Everything you need to make informed decisions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tools.map(t => (
              <Link key={t.to} to={t.to} className={`${card} border rounded-xl p-4 hover:border-[#1F4D3A] transition group`}>
                <div className="text-xl mb-2">{t.icon}</div>
                <div className={`text-sm font-semibold ${text} group-hover:text-[#1F4D3A] transition`}>{t.label}</div>
                <div className={`text-xs ${sub} mt-1 leading-relaxed`}>{t.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Labour Market Snapshot ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className={`text-lg font-bold ${text} mb-1`}>Labour Market Snapshot</h2>
        <p className={`text-sm ${sub} mb-6`}>Malaysia, 2025. Source: DOSM, WEF Future of Jobs Report.</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Key stats */}
          <div className={`${card} border rounded-xl p-5`}>
            <div className={`text-xs font-medium ${sub} uppercase tracking-wide mb-3`}>Key Figures</div>
            <div className="space-y-3">
              {[
                { label: 'National median salary', value: 'RM 3,167/mo (DOSM Q4 2025)' },
                { label: 'National mean salary', value: 'RM 3,652/mo' },
                { label: 'Minimum wage (2025)', value: 'RM 1,700/mo' },
                { label: 'Total labour demand', value: '9.21 million' },
                { label: 'New jobs created (Q4)', value: '32,100' },
                { label: 'Salary increment forecast', value: '5.0%' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className={`text-sm ${sub}`}>{s.label}</span>
                  <span className={`text-sm font-semibold ${text}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className={`text-xs ${sub} mt-3`}>Source: DOSM Salaries & Wages Survey 2024</div>
          </div>

          {/* Top demand chart */}
          <div className={`${card} border rounded-xl p-5`}>
            <div className={`text-xs font-medium ${sub} uppercase tracking-wide mb-3`}>Highest Demand Roles — Malaysia</div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDemand} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} fontSize={11} stroke={dark ? '#666' : '#999'} axisLine={false} tickLine={false} tick={{ fill: dark ? '#ccc' : '#333' }} />
                  <Tooltip contentStyle={{ background: dark ? '#2A2A2A' : '#fff', border: `1px solid ${dark ? '#3A3A3A' : '#E5E2DB'}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${Number(v).toLocaleString()} postings`, 'Demand']} />
                  <Bar dataKey="postings" fill="#1F4D3A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Link to="/trends" className="text-xs text-[#1F4D3A] hover:underline mt-2 inline-block">View full trends →</Link>
          </div>

          {/* Emerging roles */}
          <div className={`${card} border rounded-xl p-5`}>
            <div className={`text-xs font-medium ${sub} uppercase tracking-wide mb-3`}>Emerging Roles</div>
            <div className="space-y-2.5">
              {emergingRoles.slice(0, 6).map(r => (
                <div key={r.role} className="flex items-center justify-between">
                  <span className={`text-sm ${text}`}>{r.role}</span>
                  <span className="text-xs font-semibold text-[#1F4D3A]">+{r.growth}%</span>
                </div>
              ))}
            </div>
            <div className={`text-xs ${sub} mt-3`}>YoY growth. Source: WEF 2025, LinkedIn.</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">Sources: DOSM Employee Wages Statistics Q4 2025 · WEF Future of Jobs 2025 · Robert Walters Malaysia Salary Survey 2025</p>
      </section>

      {/* ── Section 4: Latest Jobs ── */}
      <section className={`${dark ? 'bg-[#232323]' : 'bg-white'} border-y ${dark ? 'border-[#3A3A3A]' : 'border-[#E5E2DB]'}`}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-bold ${text}`}>Latest Openings</h2>
              <p className={`text-sm ${sub}`}>From top Malaysian employers</p>
            </div>
            <Link to="/jobs" className="text-sm text-[#1F4D3A] font-medium hover:underline">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {seedJobs.slice(0, 4).map(j => (
              <Link key={j.id} to="/jobs" className={`${card} border rounded-xl p-4 hover:border-[#1F4D3A] transition`}>
                <div className={`text-sm font-semibold ${text} mb-1`}>{j.title}</div>
                <div className={`text-xs ${sub}`}>{j.company} · {j.location}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-[#1F4D3A]">RM {j.salaryMin.toLocaleString()}–{j.salaryMax.toLocaleString()}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${dark ? 'bg-white/5' : 'bg-gray-100'} ${sub}`}>{j.workMode}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Quick paths ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className={`text-lg font-bold ${text} mb-6`}>Where do you want to start?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/career-exploration" className={`${card} border rounded-xl p-6 hover:border-[#1F4D3A] transition`}>
            <div className={`text-sm font-semibold ${text} mb-1`}>I want to explore careers</div>
            <div className={`text-xs ${sub}`}>Compare occupations by salary, demand, AI risk, and work-life balance.</div>
          </Link>
          <Link to="/universities" className={`${card} border rounded-xl p-6 hover:border-[#1F4D3A] transition`}>
            <div className={`text-sm font-semibold ${text} mb-1`}>I want to choose a university</div>
            <div className={`text-xs ${sub}`}>Browse QS-ranked institutions with tuition, scholarships, and outcomes.</div>
          </Link>
          <Link to="/skill-tree" className={`${card} border rounded-xl p-6 hover:border-[#1F4D3A] transition`}>
            <div className={`text-sm font-semibold ${text} mb-1`}>I want to build skills</div>
            <div className={`text-xs ${sub}`}>Track your progression from foundation to senior level.</div>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={`${card} border-t py-8`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className={`text-sm font-semibold ${text}`}>Σ SigmaJob</div>
          <div className={`text-xs ${sub} text-center sm:text-right`}>
            Data: DOSM 2025 · WEF Future of Jobs 2025 · Robert Walters 2025 · QS Rankings 2025
          </div>
        </div>
      </footer>
    </div>
  );
}