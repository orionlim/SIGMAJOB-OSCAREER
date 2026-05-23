import { Link } from 'react-router-dom';
import { Key, ArrowRight } from 'lucide-react';

export default function ApiKeyMissing({ dark }: { dark: boolean }) {
  const card = dark ? 'bg-[#1A1A2E] border-[#2A2A3E]' : 'bg-white border-[#E0E0E0]';
  const text = dark ? 'text-white' : 'text-gray-900';
  const sub = dark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${card} border rounded-2xl p-8 text-center max-w-md mx-auto animate-fadeIn`}>
      <div className="w-14 h-14 rounded-2xl bg-orange-500/15 flex items-center justify-center mx-auto mb-4">
        <Key size={28} className="text-orange-400" />
      </div>
      <h3 className={`text-lg font-bold ${text} font-heading mb-2`}>
        Gemini API Key Required
      </h3>
      <p className={`text-sm ${sub} mb-5 leading-relaxed`}>
        This feature is powered by Google Gemini AI. Add your free API key in Settings to get started.
      </p>
      <Link
        to="/settings"
        className="inline-flex items-center gap-2 gradient-btn text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 hover:scale-105 transition"
      >
        Go to Settings <ArrowRight size={16} />
      </Link>
      <p className={`text-xs ${sub} mt-4`}>
        Get a free key from{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
          className="text-[#6C63FF] hover:underline">Google AI Studio ↗</a>
      </p>
    </div>
  );
}
