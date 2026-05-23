import { useState } from 'react';
import { Star, Clock, Monitor, Users, CheckCircle, ArrowLeft } from 'lucide-react';

const seedClasses = [
  { id: 'c1', title: 'Python for Data Analysis', tutor: 'Dr. Ahmad Faris', category: 'Data Science', delivery: 'Online', platform: 'Zoom', duration: 12, price: 299, rating: 4.8, reviews: 156, description: 'Learn Python, Pandas, NumPy for data analysis. Aligned with Malaysian data analyst roles paying RM 3,000-8,000/mo.', topics: ['Python', 'Pandas', 'NumPy', 'Data Viz'] },
  { id: 'c2', title: 'Cybersecurity Fundamentals', tutor: 'Sarah Chen, CISSP', category: 'Cybersecurity', delivery: 'Hybrid', platform: 'KL Campus', duration: 20, price: 599, rating: 4.9, reviews: 89, description: 'Cover NIST framework, pen testing, incident response. Malaysia has 70,000+ unfilled cybersecurity roles.', topics: ['Network Security', 'Pen Testing', 'SIEM', 'Compliance'] },
  { id: 'c3', title: 'UX Design Bootcamp', tutor: 'Mei Ling Wong', category: 'Design', delivery: 'Online', platform: 'Google Meet', duration: 16, price: 449, rating: 4.7, reviews: 112, description: 'From user research to high-fidelity prototypes. UX Designers in MY earn RM 2,500-11,000/mo.', topics: ['Figma', 'User Research', 'Prototyping', 'Design Systems'] },
  { id: 'c4', title: 'SQL & Power BI Masterclass', tutor: 'Raj Patel', category: 'Data Science', delivery: 'Online', platform: 'Zoom', duration: 8, price: 199, rating: 4.6, reviews: 234, description: 'Essential BI skills for analyst roles. Power BI is required in 65% of Malaysian data analyst job postings.', topics: ['SQL', 'Power BI', 'DAX', 'Data Modeling'] },
  { id: 'c5', title: 'AI & Machine Learning with TensorFlow', tutor: 'Dr. Lee Wei', category: 'AI/ML', delivery: 'Online', platform: 'Zoom', duration: 24, price: 799, rating: 4.9, reviews: 67, description: 'Build ML models with Python & TensorFlow. AI/ML specialists earn RM 9,000-18,000/mo in Malaysia.', topics: ['TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision'] },
  { id: 'c6', title: 'Financial Modelling in Excel', tutor: 'Jason Lim, CFA', category: 'Finance', delivery: 'Hybrid', platform: 'PJ Campus', duration: 10, price: 349, rating: 4.7, reviews: 98, description: 'Build professional financial models. Financial analysts in MY earn RM 2,800-20,000/mo.', topics: ['Excel', 'DCF', 'Valuation', 'Financial Statements'] },
  { id: 'c7', title: 'Cloud Computing with AWS', tutor: 'Amir Hassan', category: 'Cloud', delivery: 'Online', platform: 'Zoom', duration: 14, price: 499, rating: 4.8, reviews: 145, description: 'AWS Solutions Architect prep. Cloud engineers face 3x more job postings than available talent in MY.', topics: ['AWS', 'EC2', 'S3', 'Lambda', 'VPC'] },
  { id: 'c8', title: 'Digital Marketing Strategy', tutor: 'Priya Devi', category: 'Marketing', delivery: 'Online', platform: 'Google Meet', duration: 6, price: 149, rating: 4.5, reviews: 189, description: 'SEO, SEM, social media, analytics. Digital marketing roles earn RM 4,000-7,000/mo in KL.', topics: ['SEO', 'Google Ads', 'Social Media', 'Analytics'] },
];

const categories = ['All', 'Data Science', 'Cybersecurity', 'Design', 'AI/ML', 'Finance', 'Cloud', 'Marketing'];

export default function Classes({ dark }: { dark: boolean }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', age: '', gender: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';
  const input = dark ? 'bg-[#1C1C1C] border-[#3A3A3A] text-white' : 'bg-white border-[#E5E2DB] text-[#1C1C1C]';

  const filtered = filter === 'All' ? seedClasses : seedClasses.filter(c => c.category === filter);
  const cls = selected ? seedClasses.find(c => c.id === selected) : null;

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) errors.fullName = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = true;
    if (!formData.age || parseInt(formData.age) < 15 || parseInt(formData.age) > 99) errors.age = true;
    if (!formData.gender) errors.gender = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitBooking = () => {
    if (!validateForm()) return;
    setBooked(true);
    setBooking(false);
  };

  const resetAll = () => {
    setSelected(null);
    setBooking(false);
    setBooked(false);
    setFormData({ fullName: '', phone: '', email: '', age: '', gender: '' });
    setFormErrors({});
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-2`}>Classes & Courses</h1>
        <p className={`${sub} mb-6`}>Upskill with industry-aligned courses from expert tutors</p>

        {/* Recommendation Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#6C63FF]/10 to-[#00D4AA]/10 p-5 mb-6 border border-[#6C63FF]/20">
          <p className={`text-sm ${text}`}>💡 <strong>Not sure what to learn?</strong> Use our <a href="/resume-analyzer" className="text-[#6C63FF] underline">Resume Analyzer</a> to discover your skill gaps, then find matching classes here.</p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {categories.map(c => (
            <button key={c} onClick={() => { setFilter(c); setSelected(null); resetAll(); }}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition ${
                filter === c ? 'gradient-btn text-white' : `${card} border ${text}`
              }`}>{c}</button>
          ))}
        </div>

        {/* Booked Confirmation */}
        {cls && booked ? (
          <div className={`${card} border rounded-2xl p-8 text-center max-w-lg mx-auto animate-fadeIn`}>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className={`text-xl font-bold gradient-text mb-2`}>Booking Confirmed!</h2>
            <p className={`${sub} mb-4`}>
              Thank you for enrolling in <span className={text}>{cls.title}</span> with <span className={text}>{cls.tutor}</span>.
            </p>
            <p className={`text-sm ${sub} mb-6`}>
              Your instructor will contact you within 3 working business days to confirm your session details and send joining instructions.
            </p>
            <button onClick={resetAll}
              className="gradient-btn text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition">
              Browse More Classes
            </button>
          </div>
        ) : cls && booking ? (
          /* Booking Form */
          <div className="animate-fadeIn max-w-lg mx-auto">
            <button onClick={() => setBooking(false)} className={`text-sm ${sub} mb-4 hover:text-[#6C63FF] flex items-center gap-1`}>
              <ArrowLeft size={14} /> Back to class details
            </button>
            
            <div className={`${card} border rounded-2xl p-6`}>
              {/* Summary */}
              <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 mb-6`}>
                <div className={`font-semibold ${text}`}>{cls.title}</div>
                <div className={`text-sm ${sub}`}>{cls.tutor}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-[#00D4AA] font-bold">RM {cls.price}</span>
                  <span className={`text-xs ${sub}`}>{cls.duration} hours · {cls.delivery}</span>
                </div>
              </div>

              <h3 className={`font-semibold ${text} mb-4`}>Booking Details</h3>
              <div className="space-y-3">
                <div>
                  <input placeholder="Full Name *" value={formData.fullName}
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="number" placeholder="Age *" min="15" max="99" value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] ${formErrors.age ? 'border-red-500' : ''}`} />
                    {formErrors.age && <p className="text-xs text-red-400 mt-1">15-99</p>}
                  </div>
                  <div>
                    <select value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none ${formErrors.gender ? 'border-red-500' : ''}`}>
                      <option value="">Gender *</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {formErrors.gender && <p className="text-xs text-red-400 mt-1">Required</p>}
                  </div>
                </div>
              </div>

              <button onClick={submitBooking}
                className="w-full gradient-btn text-white py-3 rounded-xl font-semibold mt-6 hover:opacity-90 hover:scale-105 transition">
                Confirm Booking — RM {cls.price}
              </button>
            </div>
          </div>
        ) : cls ? (
          /* Class Detail */
          <div className="animate-fadeIn">
            <button onClick={() => setSelected(null)} className={`text-sm ${sub} mb-4 hover:text-[#6C63FF]`}>← Back to classes</button>
            <div className={`${card} border rounded-2xl p-6`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className={`text-xl font-bold ${text} font-heading`}>{cls.title}</h2>
                  <div className={`text-sm ${sub} mt-1`}>by {cls.tutor}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm text-yellow-400"><Star size={14} fill="currentColor" /> {cls.rating}</span>
                    <span className={`text-xs ${sub}`}>({cls.reviews} reviews)</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]`}>{cls.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00D4AA]">RM {cls.price}</div>
                  <div className={`text-xs ${sub}`}>{cls.duration} hours</div>
                </div>
              </div>

              <p className={`text-sm ${sub} mb-6`}>{cls.description}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 flex items-center gap-3`}>
                  <Monitor size={18} className="text-[#6C63FF]" />
                  <div>
                    <div className={`text-xs ${sub}`}>Delivery</div>
                    <div className={`text-sm font-medium ${text}`}>{cls.delivery} · {cls.platform}</div>
                  </div>
                </div>
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 flex items-center gap-3`}>
                  <Clock size={18} className="text-[#00D4AA]" />
                  <div>
                    <div className={`text-xs ${sub}`}>Duration</div>
                    <div className={`text-sm font-medium ${text}`}>{cls.duration} hours</div>
                  </div>
                </div>
                <div className={`${dark ? 'bg-[#0D0D0D]' : 'bg-[#F5F5F5]'} rounded-xl p-4 flex items-center gap-3`}>
                  <Users size={18} className="text-[#FF6B35]" />
                  <div>
                    <div className={`text-xs ${sub}`}>Reviews</div>
                    <div className={`text-sm font-medium ${text}`}>{cls.reviews} students</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${text} mb-2`}>Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {cls.topics.map(t => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]">{t}</span>
                  ))}
                </div>
              </div>

              <button onClick={() => setBooking(true)}
                className="w-full gradient-btn text-white py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition">
                Enroll Now — RM {cls.price}
              </button>
            </div>
          </div>
        ) : (
          /* Class Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <button key={c.id} onClick={() => setSelected(c.id)}
                className={`text-left ${card} border rounded-2xl p-5 hover:border-[#6C63FF] transition glow-hover`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]">{c.category}</span>
                  <span className="flex items-center gap-1 text-xs text-yellow-400"><Star size={12} fill="currentColor" /> {c.rating}</span>
                </div>
                <h3 className={`font-semibold ${text} text-sm mb-1`}>{c.title}</h3>
                <div className={`text-xs ${sub} mb-3`}>{c.tutor}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#00D4AA]">RM {c.price}</span>
                  <span className={`text-xs ${sub}`}>{c.duration}h · {c.delivery}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
