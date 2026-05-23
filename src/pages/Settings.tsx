import { useState, useEffect } from 'react';
import { CheckCircle, Sun, Moon, Trash2, ShieldCheck, Zap } from 'lucide-react';

export default function Settings({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm animate-fadeIn flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border ${
          toast.type === 'success'
            ? 'bg-green-500/15 border-green-500/30 text-green-400'
            : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100 transition">✕</button>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${text} font-heading mb-8`}>Settings</h1>

        {/* Theme */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${text}`}>Theme</div>
              <div className={`text-sm ${sub}`}>Toggle between dark and light mode</div>
            </div>
            <button onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${card} border hover:opacity-80 transition`}>
              {dark ? <Moon size={16} className="text-[#6C63FF]" /> : <Sun size={16} className="text-[#FF6B35]" />}
              <span className={`text-sm ${text}`}>{dark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* AI Features Status */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4 flex items-center gap-2`}>
            <Zap size={20} className="text-[#6C63FF]" /> AI Features
          </h2>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <CheckCircle size={20} className="text-green-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-green-400">AI Connected</div>
              <div className={`text-xs ${sub} mt-0.5`}>All AI features are active. Powered by Gemini 1.5 Flash.</div>
            </div>
          </div>
          <p className={`text-xs ${sub} mt-3 flex items-start gap-1.5`}>
            <ShieldCheck size={13} className="text-[#6C63FF] shrink-0 mt-0.5" />
            AI requests are processed securely through the SigmaJob backend. Your data is never stored or shared.
          </p>
        </div>

        {/* Privacy */}
        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${text}`}>Profile Visibility</div>
                <div className={`text-sm ${sub}`}>Make profile visible to employers</div>
              </div>
              <ToggleSwitch dark={dark} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${text}`}>Email Notifications</div>
                <div className={`text-sm ${sub}`}>Email me about new job matches</div>
              </div>
              <ToggleSwitch dark={dark} defaultOn />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${card} border border-red-500/30 rounded-2xl p-6 mb-6`}>
          <h2 className={`text-lg font-bold text-red-400 font-heading mb-4`}>Danger Zone</h2>
          <p className={`text-sm ${sub} mb-4`}>Clear all saved data including saved jobs, skill progress, and profile.</p>
          <button onClick={() => {
            if (confirm('Are you sure? This will clear all your saved data and cannot be undone.')) {
              const keys = ['saved_jobs', 'exchange_verified', 'talent_pool_profile'];
              keys.forEach(k => localStorage.removeItem(k));
              // Clear skill progress keys
              Object.keys(localStorage).filter(k => k.startsWith('skill_progress_')).forEach(k => localStorage.removeItem(k));
              alert('All data cleared!');
            }
          }}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition flex items-center gap-2">
            <Trash2 size={16} /> Clear All Saved Data
          </button>
        </div>

        {/* About */}
        <div className={`${card} border rounded-2xl p-6`}>
          <h2 className={`text-lg font-bold ${text} font-heading mb-4`}>About SigmaJob</h2>
          <p className={`text-sm ${sub} mb-2`}>
            SigmaJob v3 — Work Smarter. Grow Faster. Connect Better.
          </p>
          <p className={`text-sm ${sub}`}>
            Built with real market data from DOSM 2025, WEF Future of Jobs 2025, Robert Walters 2025,
            QS World Rankings 2025, and more.
          </p>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ dark, defaultOn = false }: { dark: boolean; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)}
      className={`w-12 h-6 rounded-full transition-colors ${on ? 'bg-[#6C63FF]' : dark ? 'bg-white/10' : 'bg-gray-300'} relative`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${on ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
    </button>
  );
}