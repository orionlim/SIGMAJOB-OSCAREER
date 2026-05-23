import { useState } from 'react';
import { Code, Database, Shield, Heart, Briefcase, Palette, DollarSign, PenTool, Wrench, Users, Leaf, Scale } from 'lucide-react';
import { occupationProfiles } from '../data/marketData';

const fields = [
  { id: 'tech', name: 'Information Technology', icon: Code, color: '#6C63FF', careers: ['Software Engineer', 'Data Analyst', 'Cybersecurity Analyst'], avgSalary: 'RM 8,500', growth: '+38%', demand: 'Very High' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: '#FF6B35', careers: ['Registered Nurse', 'Medical Doctor', 'Physiotherapist'], avgSalary: 'RM 6,500', growth: '+24%', demand: 'Very High' },
  { id: 'finance', name: 'Finance & Insurance', icon: DollarSign, color: '#00D4AA', careers: ['Financial Analyst', 'Accountant', 'Fund Manager'], avgSalary: 'RM 7,800', growth: '+22%', demand: 'High' },
  { id: 'engineering', name: 'Engineering', icon: Wrench, color: '#FFB800', careers: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer'], avgSalary: 'RM 7,200', growth: '+30%', demand: 'High' },
  { id: 'business', name: 'Business & Consulting', icon: Briefcase, color: '#6C63FF', careers: ['Business Analyst', 'Management Consultant', 'Project Manager'], avgSalary: 'RM 6,500', growth: '+22%', demand: 'High' },
  { id: 'design', name: 'Design & Creative', icon: Palette, color: '#FF69B4', careers: ['UX Designer', 'Graphic Designer', 'Creative Director'], avgSalary: 'RM 5,800', growth: '+18%', demand: 'Medium' },
  { id: 'data', name: 'Data Science & AI', icon: Database, color: '#00D4AA', careers: ['Data Scientist', 'AI/ML Engineer', 'Data Engineer'], avgSalary: 'RM 9,000', growth: '+41%', demand: 'Very High' },
  { id: 'legal', name: 'Legal Services', icon: Scale, color: '#6C63FF', careers: ['Lawyer', 'Legal Researcher', 'Compliance Officer'], avgSalary: 'RM 6,200', growth: '+15%', demand: 'Medium' },
  { id: 'hr', name: 'Human Resources', icon: Users, color: '#FF6B35', careers: ['HR Executive', 'HR Manager', 'Recruiter'], avgSalary: 'RM 4,800', growth: '+17%', demand: 'Medium' },
  { id: 'marketing', name: 'Sales & Marketing', icon: PenTool, color: '#FFB800', careers: ['Digital Marketing', 'Sales Executive', 'Content Writer'], avgSalary: 'RM 5,400', growth: '+20%', demand: 'High' },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, color: '#00D4AA', careers: ['Security Analyst', 'Pen Tester', 'CISO'], avgSalary: 'RM 12,000', growth: '+35%', demand: 'Very High' },
  { id: 'green', name: 'Green Economy', icon: Leaf, color: '#10B981', careers: ['Sustainability Analyst', 'Renewable Energy Engineer', 'ESG Officer'], avgSalary: 'RM 8,000', growth: '+27%', demand: 'High' },
];

export default function Fields({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  const field = selected ? fields.find(f => f.id === selected) : null;

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>Field Explorer</h1>
        <p className={`${sub} mb-8`}>Discover 12 career fields and their occupations</p>

        {field ? (
          <div className="animate-fadeIn">
            <button onClick={() => setSelected(null)} className={`text-sm ${sub} mb-4 hover:text-[#6C63FF]`}>← Back to fields</button>
            <div className={`${card} border rounded-2xl p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${field.color}20` }}>
                  <field.icon size={24} style={{ color: field.color }} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${text} font-heading`}>{field.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#00D4AA]">Avg: {field.avgSalary}/mo</span>
                    <span className="text-xs text-[#6C63FF]">Growth: {field.growth}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      field.demand === 'Very High' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>{field.demand}</span>
                  </div>
                </div>
              </div>

              <h3 className={`text-sm font-semibold ${text} mb-3`}>Careers in this field</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {field.careers.map(c => {
                  const profile = occupationProfiles.find(p => p.title === c);
                  return (
                    <div key={c} className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4`}>
                      <div className={`font-medium ${text} text-sm mb-1`}>{c}</div>
                      {profile ? (
                        <>
                          <div className="text-xs text-[#00D4AA]">RM {profile.freshGradMin.toLocaleString()} – {profile.senior.toLocaleString()}/mo</div>
                          <div className={`text-xs ${sub} mt-1`}>AI Risk: {profile.aiRisk}% · WLB: {profile.wlb}/10</div>
                        </>
                      ) : (
                        <div className={`text-xs ${sub}`}>View in Career Exploration</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fields.map(f => (
              <button key={f.id} onClick={() => setSelected(f.id)}
                className={`text-left ${card} border rounded-2xl p-5 hover:border-[#6C63FF] transition glow-hover`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}20` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <div className={`font-semibold ${text} text-sm mb-1`}>{f.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#00D4AA]">{f.avgSalary}/mo</span>
                  <span className="text-xs text-[#6C63FF]">{f.growth}</span>
                </div>
                <div className={`text-xs ${sub}`}>{f.careers.length} careers</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
