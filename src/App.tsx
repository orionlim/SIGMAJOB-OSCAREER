import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Community from './pages/Community';
import Classes from './pages/Classes';
import Trends from './pages/Trends';
import Universities from './pages/Universities';
import CareerExploration from './pages/CareerExploration';
import AiTrends from './pages/AiTrends';
import CareerCoach from './pages/CareerCoach';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SkillTree from './pages/SkillTree';
import Messages from './pages/Messages';
import Fields from './pages/Fields';
import Settings from './pages/Settings';
import Exchange from './pages/Exchange';
import TalentPool from './pages/TalentPool';
import Profile from './pages/Profile';
import StudentProfile from './pages/StudentProfile';

export default function App() {
  const { dark, toggle } = useTheme();

  return (
    <BrowserRouter>
      <div className={dark ? 'bg-[#1C1C1C] text-white' : 'bg-[#F8F7F4] text-[#1C1C1C]'}>
        <Navbar dark={dark} toggleTheme={toggle} />
        <Routes>
          <Route path="/" element={<Home dark={dark} />} />
          <Route path="/jobs" element={<Jobs dark={dark} />} />
          <Route path="/community" element={<Community dark={dark} />} />
          <Route path="/classes" element={<Classes dark={dark} />} />
          <Route path="/trends" element={<Trends dark={dark} />} />
          <Route path="/universities" element={<Universities dark={dark} />} />
          <Route path="/career-exploration" element={<CareerExploration dark={dark} />} />
          <Route path="/ai-trends" element={<AiTrends dark={dark} />} />
          <Route path="/career-coach" element={<CareerCoach dark={dark} />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer dark={dark} />} />
          <Route path="/skill-tree" element={<SkillTree dark={dark} />} />
          <Route path="/messages" element={<Messages dark={dark} />} />
          <Route path="/fields" element={<Fields dark={dark} />} />
          <Route path="/settings" element={<Settings dark={dark} toggleTheme={toggle} />} />
          <Route path="/exchange" element={<Exchange dark={dark} />} />
          <Route path="/talent-pool" element={<TalentPool dark={dark} />} />
          <Route path="/profile" element={<Profile dark={dark} />} />
          <Route path="/student-profile" element={<StudentProfile dark={dark} />} />
          <Route path="*" element={
            <div className={`${dark ? 'bg-[#1C1C1C] text-white' : 'bg-[#F8F7F4]'} min-h-screen flex flex-col items-center justify-center pt-16`}>
              <div className="text-8xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent mb-4">404</div>
              <p className="text-gray-400 mb-6">This page doesn't exist.</p>
              <a href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white font-semibold hover:opacity-90 transition">Go Home</a>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}