import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Bookmark, Settings, Award, X } from 'lucide-react';

export default function Profile({ dark }: { dark: boolean }) {
  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';
  const input = dark ? 'bg-[#1C1C1C] border-[#3A3A3A] text-white' : 'bg-white border-[#E5E2DB] text-[#1C1C1C]';

  const [name, setName] = useState(() => localStorage.getItem('profile_name') || '');
  const [role, setRole] = useState(() => localStorage.getItem('profile_role') || '');
  const [location, setLocation] = useState(() => localStorage.getItem('profile_location') || '');
  const [bio, setBio] = useState(() => localStorage.getItem('profile_bio') || '');
  const [skills, setSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('profile_skills');
    return saved ? JSON.parse(saved) : [];
  });
  const [skillInput, setSkillInput] = useState('');
  const [targetCareer, setTargetCareer] = useState(() => localStorage.getItem('profile_target_career') || '');
  const [experienceLevel, setExperienceLevel] = useState(() => localStorage.getItem('profile_experience_level') || '');
  const [savedToast, setSavedToast] = useState(false);

  const personalityResult = localStorage.getItem('personality_result');

  const careers = ['Software Engineer', 'Data Analyst', 'Cybersecurity Analyst', 'Registered Nurse', 'Business Analyst', 'UX Designer', 'Financial Analyst', 'AI/ML Engineer', 'Graphic Designer', 'Mechanical Engineer'];
  const expLevels = ['Fresh Graduate', 'Junior (1-3yr)', 'Mid (3-5yr)', 'Senior (5-8yr)', 'Lead (8yr+)'];

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));

  const saveProfile = () => {
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_role', role);
    localStorage.setItem('profile_location', location);
    localStorage.setItem('profile_bio', bio);
    localStorage.setItem('profile_skills', JSON.stringify(skills));
    localStorage.setItem('profile_target_career', targetCareer);
    localStorage.setItem('profile_experience_level', experienceLevel);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-6`}>My Profile</h1>

        {savedToast && (
          <div className="fixed top-20 right-4 z-50 bg-green-500/15 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm animate-fadeIn">
            Profile saved!
          </div>
        )}

        {/* Avatar + Quick Info */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center text-white text-xl font-bold">
              {name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </div>
            <div>
              <div className={`text-lg font-bold ${text}`}>{name || 'Your Name'}</div>
              <div className={`text-sm ${sub}`}>{role || 'Your Role'} {location ? `· ${location}` : ''}</div>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>Personal Info</h2>
          <div className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF]`} />
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Current Role / Job Title"
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF]`} />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (e.g. Kuala Lumpur)"
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF]`} />
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio / summary" rows={3}
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] resize-none`} />
          </div>
        </div>

        {/* Skills */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>Skills</h2>
          <div className="flex gap-2 mb-3">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter..." maxLength={40}
              className={`flex-1 ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF]`} />
            <button onClick={addSkill} className="gradient-btn text-white px-4 py-2 rounded-xl text-sm">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-400"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Career Targets */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>Career Targets</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className={`text-xs ${sub} block mb-1`}>Target Career</label>
              <select value={targetCareer} onChange={e => setTargetCareer(e.target.value)}
                className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                <option value="">Select...</option>
                {careers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={`text-xs ${sub} block mb-1`}>Experience Level</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}
                className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                <option value="">Select...</option>
                {expLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button onClick={saveProfile} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Save size={16} /> Save Profile
          </button>
        </div>

        {/* Personality Badge */}
        {personalityResult && (
          <div className={`${card} border rounded-2xl p-6 mb-6`}>
            <h2 className={`text-lg font-bold ${text} font-heading mb-3 flex items-center gap-2`}>
              <Award size={20} className="text-[#6C63FF]" /> Personality Type
            </h2>
            <div className="px-4 py-3 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
              <span className="text-sm font-bold text-[#6C63FF]">{personalityResult}</span>
            </div>
          </div>
        )}

        {/* Commendations placeholder */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-3`}>🏆 Commendations</h2>
          <p className={`text-sm ${sub}`}>No commendations yet.</p>
        </div>

        {/* Quick links */}
        <div className="flex gap-3">
          <Link to="/jobs?tab=saved" className={`flex items-center gap-2 ${card} border rounded-xl px-4 py-2.5 text-sm ${text} hover:border-[#6C63FF] transition`}>
            <Bookmark size={16} /> My Saved Jobs
          </Link>
          <Link to="/settings" className={`flex items-center gap-2 ${card} border rounded-xl px-4 py-2.5 text-sm ${text} hover:border-[#6C63FF] transition`}>
            <Settings size={16} /> Settings
          </Link>
        </div>
      </div>
    </div>
  );
}