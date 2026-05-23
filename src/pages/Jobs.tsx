import { useState, useEffect } from 'react';
import { MapPin, Briefcase, TrendingUp, X, Building2, Bookmark, CheckCircle } from 'lucide-react';
import { seedJobs } from '../data/marketData';

// Job type inferred from seedJobs

export default function Jobs({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [filterMode, setFilterMode] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currency, setCurrency] = useState<'RM' | 'USD'>('RM');

  // Application form state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    resume: null as File | null,
    q1: '',
    q2: '',
    q3: '',
    declaration: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';
  const input = dark ? 'bg-[#1C1C1C] border-[#3A3A3A] text-white' : 'bg-white border-[#E5E2DB] text-[#1C1C1C]';

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_jobs');
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
    // Check URL params for tab
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'saved') {
      setActiveTab('saved');
    }
  }, []);

  const toggleSave = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(savedJobs);
    if (next.has(jobId)) {
      next.delete(jobId);
    } else {
      next.add(jobId);
    }
    setSavedJobs(next);
    localStorage.setItem('saved_jobs', JSON.stringify([...next]));
  };

  const industries = ['All', ...new Set(seedJobs.map(j => j.industry))];
  const modes = ['All', 'Hybrid', 'Remote', 'On-site'];
  const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

  let filtered = seedJobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterIndustry !== 'All' && j.industry !== filterIndustry) return false;
    if (filterMode !== 'All' && j.workMode !== filterMode) return false;
    if (filterType !== 'All' && j.jobType !== filterType) return false;
    if (activeTab === 'saved' && !savedJobs.has(j.id)) return false;
    return true;
  });

  const job = selected ? seedJobs.find(j => j.id === selected) : null;

  const formatSalary = (amount: number) => {
    if (currency === 'USD') {
      return `~USD ${Math.round(amount / 4.5).toLocaleString()}`;
    }
    return `RM ${amount.toLocaleString()}`;
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) errors.fullName = true;
    if (!formData.address.trim()) errors.address = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitApplication = () => {
    if (!validateForm() || !formData.declaration) return;
    setSubmitted(true);
    setApplying(false);
  };

  const resetApplication = () => {
    setApplying(false);
    setSubmitted(false);
    setFormData({
      fullName: '', address: '', phone: '', email: '', resume: null,
      q1: '', q2: '', q3: '', declaration: false
    });
    setFormErrors({});
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>Find Your Next Role</h1>
        <p className={`${sub} mb-6`}>Browse {seedJobs.length} positions from top Malaysian companies</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'all' ? 'gradient-btn text-white' : `${card} border ${text}`}`}>
            All Jobs
          </button>
          <button onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'saved' ? 'gradient-btn text-white' : `${card} border ${text}`}`}>
            Saved Jobs ({savedJobs.size})
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" placeholder="Search jobs or companies..."
            value={search} onChange={e => setSearch(e.target.value)}
            className={`${input} border rounded-xl px-4 py-2.5 text-sm w-full md:w-72 outline-none focus:border-[#6C63FF]`} />
          <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
            className={`${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={filterMode} onChange={e => setFilterMode(e.target.value)}
            className={`${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
            {modes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className={`${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className={`${card} border rounded-xl flex overflow-hidden`}>
            <button onClick={() => setCurrency('RM')} className={`px-3 py-2 text-sm ${currency === 'RM' ? 'gradient-btn text-white' : text}`}>RM</button>
            <button onClick={() => setCurrency('USD')} className={`px-3 py-2 text-sm ${currency === 'USD' ? 'gradient-btn text-white' : text}`}>USD</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {seedJobs.length === 0 ? (
              // Skeleton loading state
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${card} border rounded-2xl p-5`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-200'} animate-pulse`}></div>
                    <div className="flex-1 space-y-2">
                      <div className={`h-4 rounded ${dark ? 'bg-white/5' : 'bg-gray-200'} animate-pulse w-3/4`}></div>
                      <div className={`h-3 rounded ${dark ? 'bg-white/5' : 'bg-gray-200'} animate-pulse w-1/2`}></div>
                      <div className={`h-3 rounded ${dark ? 'bg-white/5' : 'bg-gray-200'} animate-pulse w-2/3`}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
            <>
            {filtered.length === 0 && (
              <div className={`${card} border rounded-2xl p-8 text-center`}>
                <p className={`${sub} text-sm`}>
                  {activeTab === 'saved' 
                    ? "No saved jobs yet. Click the bookmark icon on any job to save it."
                    : "No jobs match your filters. Try adjusting your search."}
                </p>
              </div>
            )}
            {filtered.map(j => (
              <button key={j.id} onClick={() => { setSelected(j.id); setApplying(false); setSubmitted(false); }}
                className={`w-full text-left ${card} border rounded-2xl p-5 transition hover:border-[#6C63FF] ${selected === j.id ? 'border-[#6C63FF] ring-1 ring-[#6C63FF]/30' : ''} relative`}>
                <button onClick={(e) => toggleSave(j.id, e)}
                  className={`absolute top-4 right-4 p-1.5 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                  <Bookmark size={18} className={savedJobs.has(j.id) ? 'text-[#6C63FF] fill-[#6C63FF]' : sub} />
                </button>
                <div className="flex items-start gap-3 pr-8">
                  <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {j.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold ${text} text-sm`}>{j.title}</div>
                    <div className={`text-xs ${sub} mt-0.5`}>{j.company}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-xs ${sub} flex items-center gap-1`}><MapPin size={12} />{j.location}</span>
                      <span className={`text-xs ${sub} flex items-center gap-1`}><Briefcase size={12} />{j.workMode}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-[#00D4AA]">{formatSalary(j.salaryMin)}-{formatSalary(j.salaryMax)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        j.demandLevel === 'Very High' ? 'bg-green-500/20 text-green-400' :
                        j.demandLevel === 'High' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{j.demandLevel}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            </>
            )}
          </div>

          {/* Job Detail / Application Form */}
          <div className="lg:col-span-3">
            {job && submitted ? (
              <div className={`${card} border rounded-2xl p-8 text-center animate-fadeIn`}>
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h2 className={`text-xl font-bold ${text} font-heading mb-2`}>Application Submitted Successfully!</h2>
                <p className={`${sub} mb-4`}>
                  Your application for <span className={text}>{job.title}</span> at <span className={text}>{job.company}</span> is now under review.
                </p>
                <p className={`text-sm ${sub} mb-6`}>
                  The employer will contact you within 1 week if you are shortlisted.
                </p>
                <button onClick={() => { setSelected(null); resetApplication(); }}
                  className="gradient-btn text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition">
                  Browse More Jobs
                </button>
              </div>
            ) : job && applying ? (
              <div className={`${card} border rounded-2xl p-6 animate-fadeIn max-h-[calc(100vh-150px)] overflow-y-auto`}>
                <button onClick={() => setApplying(false)} className={`text-sm ${sub} hover:text-[#6C63FF] mb-4`}>← Back to job details</button>
                
                {/* Job Summary */}
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 mb-6`}>
                  <div className={`font-semibold ${text}`}>{job.title}</div>
                  <div className={`text-sm ${sub}`}>{job.company} · {job.location} · {job.workMode}</div>
                  <div className="text-sm text-[#00D4AA] mt-1">{formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}/month</div>
                </div>

                {/* Personal Details */}
                <h3 className={`font-semibold ${text} mb-3`}>Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  <div>
                    <input type="text" placeholder="Full Name *" value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] ${formErrors.fullName ? 'border-red-500' : ''}`} />
                    {formErrors.fullName && <p className="text-xs text-red-400 mt-1">Required</p>}
                  </div>
                  <div>
                    <input type="tel" placeholder="Phone Number *" value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] ${formErrors.phone ? 'border-red-500' : ''}`} />
                    {formErrors.phone && <p className="text-xs text-red-400 mt-1">Required</p>}
                  </div>
                  <div>
                    <input type="email" placeholder="Email Address *" value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] ${formErrors.email ? 'border-red-500' : ''}`} />
                    {formErrors.email && <p className="text-xs text-red-400 mt-1">Valid email required</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Address *" value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] ${formErrors.address ? 'border-red-500' : ''}`} />
                    {formErrors.address && <p className="text-xs text-red-400 mt-1">Required</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className={`text-sm ${sub} block mb-2`}>Upload Resume/CV (optional)</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg"
                    onChange={e => setFormData({...formData, resume: e.target.files?.[0] || null})}
                    className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                  {formData.resume && <p className={`text-xs ${sub} mt-1`}>Selected: {formData.resume.name}</p>}
                </div>

                {/* Employer Questions */}
                <h3 className={`font-semibold ${text} mb-3`}>Employer Questions</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`text-sm ${sub} block mb-1`}>1. Why are you interested in this role?</label>
                    <textarea rows={3} value={formData.q1}
                      onChange={e => setFormData({...formData, q1: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] resize-none`} />
                  </div>
                  <div>
                    <label className={`text-sm ${sub} block mb-1`}>2. What relevant experience do you have?</label>
                    <textarea rows={3} value={formData.q2}
                      onChange={e => setFormData({...formData, q2: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] resize-none`} />
                  </div>
                  <div>
                    <label className={`text-sm ${sub} block mb-1`}>3. What is your expected monthly salary in RM?</label>
                    <input type="text" value={formData.q3}
                      onChange={e => setFormData({...formData, q3: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF]`} />
                  </div>
                </div>

                {/* Declaration */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.declaration}
                      onChange={e => setFormData({...formData, declaration: e.target.checked})}
                      className="mt-1 w-4 h-4 rounded border-gray-300" />
                    <span className={`text-sm ${sub}`}>I confirm all information provided is accurate and complete.</span>
                  </label>
                </div>

                <button onClick={submitApplication} disabled={!formData.declaration}
                  className="w-full gradient-btn text-white py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition disabled:opacity-50">
                  Submit Application
                </button>
              </div>
            ) : job ? (
              <div className={`${card} border rounded-2xl p-6 lg:sticky lg:top-24 animate-fadeIn`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-xl font-bold ${text} font-heading`}>{job.title}</h2>
                    <div className={`flex items-center gap-2 mt-1 ${sub}`}>
                      <Building2 size={14} />
                      <span className="text-sm">{job.company}</span>
                      <span className="text-sm">·</span>
                      <MapPin size={14} />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => toggleSave(job.id, e)}
                      className={`p-2 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                      <Bookmark size={18} className={savedJobs.has(job.id) ? 'text-[#6C63FF] fill-[#6C63FF]' : sub} />
                    </button>
                    <button onClick={() => setSelected(null)} className={`p-1 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} lg:hidden`}>
                      <X size={18} className={sub} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${dark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{job.jobType}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${dark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{job.workMode}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${dark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{job.experienceLevel}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${dark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{job.industry}</span>
                </div>

                <div className={`text-lg font-bold text-[#00D4AA] mb-4`}>
                  {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)} /month
                </div>

                <p className={`text-sm ${sub} mb-6`}>{job.description}</p>

                <div className="mb-6">
                  <h3 className={`text-sm font-semibold ${text} mb-2`}>Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(s => (
                      <span key={s} className="text-xs px-3 py-1 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Job Insights */}
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 mb-6`}>
                  <h3 className={`text-sm font-semibold ${text} mb-3 flex items-center gap-2`}>
                    <TrendingUp size={16} className="text-[#6C63FF]" /> Job Insights (Real Data)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <InsightCard label="Demand Level" value={job.demandLevel}
                      color={job.demandLevel === 'Very High' ? '#00D4AA' : '#6C63FF'} dark={dark} />
                    <InsightCard label="AI Disruption Risk" value={`${job.aiRisk}%`}
                      color={job.aiRisk < 30 ? '#00D4AA' : job.aiRisk < 50 ? '#FFB800' : '#FF6B35'} dark={dark} />
                    <InsightCard label="Career Stability" value={`${job.stabilityScore}/10`}
                      color="#6C63FF" dark={dark} />
                    <InsightCard label="Work-Life Balance" value={`${job.wlb}/10`}
                      color="#00D4AA" dark={dark} />
                  </div>
                  <p className={`text-xs ${sub} mt-2`}>Sources: DOSM 2025, WEF 2025, Oxford/McKinsey</p>
                </div>

                  <div className="mt-4 pt-4 border-t border-gray-700/30 space-y-1">
                    <a href="/trends" className="text-xs text-[#6C63FF] hover:underline block">→ View full market trends for this role</a>
                    <a href="/career-exploration" className="text-xs text-[#00D4AA] hover:underline block">→ Explore career profile and salary progression</a>
                  </div>

                <button onClick={() => setApplying(true)}
                  className="w-full gradient-btn text-white py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition">
                  Apply Now
                </button>
              </div>
            ) : (
              <div className={`${card} border rounded-2xl p-12 text-center hidden lg:block`}>
                <Briefcase size={48} className={`${sub} mx-auto mb-4 opacity-30`} />
                <p className={`${sub} text-sm`}>Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ label, value, color, dark }: { label: string; value: string; color: string; dark: boolean }) {
  return (
    <div className={`${dark ? 'bg-[#1A1A2E]' : 'bg-white'} rounded-lg p-3`}>
      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      <div className="text-sm font-bold mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}
