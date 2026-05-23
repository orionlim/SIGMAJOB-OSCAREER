import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Lock, RotateCcw } from 'lucide-react';

const skillTrees: Record<string, { title: string; levels: { name: string; skills: string[]; salary: string }[] }> = {
  'software-engineer': {
    title: 'Software Engineer',
    levels: [
      { name: 'Foundation', skills: ['HTML/CSS', 'JavaScript', 'Git', 'Basic Algorithms'], salary: 'RM 3,000–4,500/mo' },
      { name: 'Junior', skills: ['React/Vue', 'TypeScript', 'REST APIs', 'SQL'], salary: 'RM 4,500–6,000/mo' },
      { name: 'Mid-Level', skills: ['System Design', 'Testing', 'CI/CD', 'Cloud Basics'], salary: 'RM 6,000–8,500/mo' },
      { name: 'Senior', skills: ['Architecture', 'Mentoring', 'Performance', 'Security'], salary: 'RM 8,500–12,000/mo' },
      { name: 'Lead / Principal', skills: ['Tech Strategy', 'Team Leadership', 'Cross-Team', 'Innovation'], salary: 'RM 12,000–18,000/mo' },
    ]
  },
  'data-analyst': {
    title: 'Data Analyst',
    levels: [
      { name: 'Foundation', skills: ['Excel', 'Basic Statistics', 'SQL Basics', 'Data Literacy'], salary: 'RM 3,000–4,000/mo' },
      { name: 'Junior', skills: ['Python/R', 'SQL Advanced', 'Power BI', 'Data Cleaning'], salary: 'RM 4,000–6,000/mo' },
      { name: 'Mid-Level', skills: ['Statistical Modelling', 'Tableau', 'ETL', 'A/B Testing'], salary: 'RM 6,000–8,000/mo' },
      { name: 'Senior', skills: ['ML Basics', 'Stakeholder Mgmt', 'Data Strategy', 'Mentoring'], salary: 'RM 8,000–11,000/mo' },
      { name: 'Lead / Head', skills: ['Data Architecture', 'Team Leadership', 'Business Strategy', 'Advanced ML'], salary: 'RM 11,000–18,000/mo' },
    ]
  },
  'cybersecurity': {
    title: 'Cybersecurity Analyst',
    levels: [
      { name: 'Foundation', skills: ['Networking', 'Linux', 'Security Concepts', 'CompTIA Security+'], salary: 'RM 4,500–6,500/mo' },
      { name: 'Junior', skills: ['SIEM Tools', 'Vulnerability Scanning', 'Incident Response', 'Firewall Mgmt'], salary: 'RM 6,500–9,000/mo' },
      { name: 'Mid-Level', skills: ['Pen Testing', 'Forensics', 'Cloud Security', 'OSCP'], salary: 'RM 9,000–12,000/mo' },
      { name: 'Senior', skills: ['Architecture', 'Threat Hunting', 'GRC', 'CISSP'], salary: 'RM 12,000–18,000/mo' },
      { name: 'Lead / CISO', skills: ['Security Strategy', 'Board Reporting', 'Risk Management', 'Team Building'], salary: 'RM 18,000–35,000/mo' },
    ]
  },
  'ux-designer': {
    title: 'UX Designer',
    levels: [
      { name: 'Foundation', skills: ['Design Principles', 'Figma Basics', 'Wireframing', 'Color Theory'], salary: 'RM 2,500–3,500/mo' },
      { name: 'Junior', skills: ['User Research', 'Prototyping', 'Usability Testing', 'IA'], salary: 'RM 3,500–5,000/mo' },
      { name: 'Mid-Level', skills: ['Design Systems', 'Interaction Design', 'A/B Testing', 'Accessibility'], salary: 'RM 5,000–7,000/mo' },
      { name: 'Senior', skills: ['Strategic Design', 'Stakeholder Mgmt', 'Mentoring', 'Design Ops'], salary: 'RM 7,000–11,000/mo' },
      { name: 'Director', skills: ['Design Vision', 'Cross-Functional Lead', 'Business Impact', 'Innovation'], salary: 'RM 11,000–18,000/mo' },
    ]
  },
  'financial-analyst': {
    title: 'Financial Analyst',
    levels: [
      { name: 'Foundation', skills: ['Accounting Basics', 'Excel', 'Financial Statements', 'Economics'], salary: 'RM 2,800–4,000/mo' },
      { name: 'Junior', skills: ['Financial Modelling', 'Valuation', 'Bloomberg', 'Industry Analysis'], salary: 'RM 4,000–6,000/mo' },
      { name: 'Mid-Level', skills: ['Advanced Modelling', 'M&A', 'Equity Research', 'Risk Analysis'], salary: 'RM 6,000–10,000/mo' },
      { name: 'Senior', skills: ['Portfolio Mgmt', 'CFA Level 3', 'Client Relations', 'Strategy'], salary: 'RM 10,000–15,000/mo' },
      { name: 'Director / VP', skills: ['Fund Strategy', 'Team Leadership', 'Regulatory', 'Board Advisory'], salary: 'RM 15,000–30,000/mo' },
    ]
  },
};

export default function SkillTree({ dark }: { dark: boolean }) {
  const [selectedTree, setSelectedTree] = useState('software-engineer');
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());

  // Forest-themed background for skill tree page specifically
  const treeBg = dark ? 'bg-[#0F1A14]' : 'bg-[#F0F5F2]';
  const card = dark ? 'bg-[#1A2920] border-[#2A3F30]' : 'bg-white border-[#D4DED6]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  useEffect(() => {
    const saved = localStorage.getItem(`skill_progress_${selectedTree}`);
    setCompletedSkills(saved ? new Set(JSON.parse(saved)) : new Set());
  }, [selectedTree]);

  const tree = skillTrees[selectedTree];

  const toggleSkill = (skill: string) => {
    const next = new Set(completedSkills);
    if (next.has(skill)) next.delete(skill); else next.add(skill);
    setCompletedSkills(next);
    localStorage.setItem(`skill_progress_${selectedTree}`, JSON.stringify([...next]));
  };

  const resetProgress = () => {
    if (confirm('Reset all progress for this skill tree?')) {
      setCompletedSkills(new Set());
      localStorage.removeItem(`skill_progress_${selectedTree}`);
    }
  };

  const totalSkills = tree.levels.reduce((s, l) => s + l.skills.length, 0);
  const completed = tree.levels.reduce((s, l) => s + l.skills.filter(sk => completedSkills.has(sk)).length, 0);
  const progress = totalSkills ? Math.round((completed / totalSkills) * 100) : 0;

  // Node colors by tier
  const tierColor = (i: number) =>
    i === 0 ? { bg: 'bg-[#1F4D3A]/15 border-[#1F4D3A]', text: 'text-[#1F4D3A]' } :
    i <= 2 ? { bg: 'bg-[#D4A017]/10 border-[#D4A017]', text: 'text-[#D4A017]' } :
             { bg: 'bg-[#8B6914]/10 border-[#8B6914]', text: 'text-[#8B6914]' };

  return (
    <div className={`${treeBg} min-h-screen pt-14`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className={`text-2xl font-bold ${text} mb-1`}>Skill Tree</h1>
        <p className={`text-sm ${sub} mb-6`}>Track your progression from foundation to expert.</p>

        {/* Career selector */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {Object.entries(skillTrees).map(([key, val]) => (
            <button key={key} onClick={() => setSelectedTree(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedTree === key
                  ? 'bg-[#1F4D3A] text-white'
                  : `${card} border ${text} hover:border-[#1F4D3A]`
              }`}>{val.title}</button>
          ))}
        </div>

        {/* Progress */}
        <div className={`${card} border rounded-xl p-5 mb-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${text}`}>{tree.title}</span>
            <span className="text-sm font-bold text-[#1F4D3A]">{progress}%  ·  {completed}/{totalSkills}</span>
          </div>
          <div className={`w-full h-2.5 rounded-full ${dark ? 'bg-white/5' : 'bg-[#E5E2DB]'}`}>
            <div className="h-full rounded-full bg-[#1F4D3A] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <button onClick={resetProgress} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
              <RotateCcw size={12} /> Reset
            </button>
            <div className="flex items-center gap-3">
              <Link to="/jobs" className="text-xs text-[#1F4D3A] hover:underline">{tree.title} Jobs →</Link>
              <Link to="/classes" className="text-xs text-[#D4A017] hover:underline">Find Classes →</Link>
            </div>
          </div>
        </div>

        {/* Skill levels — constellation-inspired vertical path */}
        <div className="relative">
          {/* Vertical connection line */}
          <div className={`absolute left-6 top-0 bottom-0 w-px ${dark ? 'bg-[#D4A017]/20' : 'bg-[#D4A017]/30'}`} />

          <div className="space-y-6">
            {tree.levels.map((level, li) => {
              const levelDone = level.skills.filter(s => completedSkills.has(s)).length;
              const prevDone = li > 0 ? tree.levels[li-1].skills.filter(s => completedSkills.has(s)).length : level.skills.length;
              const prevTotal = li > 0 ? tree.levels[li-1].skills.length : 1;
              const isLocked = li > 0 && prevDone < prevTotal * 0.5;
              const tc = tierColor(li);

              return (
                <div key={li} className={`relative pl-14 ${isLocked ? 'opacity-40' : ''}`}>
                  {/* Node circle on the connection line */}
                  <div className={`absolute left-3.5 top-5 w-5 h-5 rounded-full border-2 ${
                    levelDone === level.skills.length
                      ? 'bg-[#1F4D3A] border-[#1F4D3A]'
                      : levelDone > 0
                        ? 'bg-[#D4A017] border-[#D4A017]'
                        : `${dark ? 'bg-[#2A2A2A]' : 'bg-white'} border-[#D4A017]/40`
                  } skill-node-glow transition-all`} />

                  <div className={`${card} border rounded-xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${tc.bg} ${tc.text}`}>
                          Tier {li + 1}
                        </span>
                        <span className={`font-semibold ${text}`}>
                          {level.name}
                          {isLocked && <Lock size={13} className="inline ml-1 text-gray-500" />}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#D4A017] font-medium">{level.salary}</div>
                        <div className={`text-xs ${sub}`}>{levelDone}/{level.skills.length}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {level.skills.map(skill => {
                        const done = completedSkills.has(skill);
                        return (
                          <button key={skill} onClick={() => !isLocked && toggleSkill(skill)} disabled={isLocked}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                              done
                                ? 'bg-[#1F4D3A]/10 text-[#1F4D3A] border border-[#1F4D3A]/25'
                                : `${dark ? 'bg-white/5' : 'bg-[#F8F7F4]'} ${text} border border-transparent hover:border-[#D4A017]/40`
                            }`}>
                            {done ? <CheckCircle size={14} className="text-[#1F4D3A]" /> : <Circle size={14} className="text-[#D4A017]/50" />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700/30 flex flex-col gap-2">
                      <a href="/classes" className="text-xs text-[#6C63FF] hover:underline">→ Find classes for this skill in the Marketplace</a>
                      <a href="/jobs" className="text-xs text-[#00D4AA] hover:underline">→ Browse jobs requiring this skill</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
