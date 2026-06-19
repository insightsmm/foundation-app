import React from 'react';
import { BookOpen, Clock, CheckCircle, BarChart, Download, PlayCircle } from 'lucide-react';

export default function AcademyPage() {
  const modules = [
    {
      id: 'CSM 101',
      title: 'Clarity Install',
      type: 'Foundation Module',
      lessons: 6,
      duration: '60 min',
      objectives: 8,
      description: 'You cannot build a content system on a blurry foundation. This module installs absolute clarity on your offer, audience, and unique mechanism.',
      color: 'gold'
    },
    {
      id: 'CSM 102',
      title: 'TPO Install',
      type: 'Framework Module',
      lessons: 6,
      duration: '60 min',
      objectives: 6,
      description: 'The Teach-Proof-Offer Method is the operating system of your entire content strategy. Learn how to bridge the gap between attention and revenue.',
      color: 'gold'
    },
    {
      id: 'CSM 201',
      title: 'Content Creation',
      type: 'Production Module',
      lessons: 5,
      duration: '54 min',
      objectives: 5,
      description: 'The strategy is installed. This module removes every barrier to production, giving you a repeatable workflow for high-quality vertical video.',
      color: 'gold'
    },
    {
      id: 'CSM 202',
      title: 'Consistency System',
      type: 'Systems Module',
      lessons: 3,
      duration: '36 min',
      objectives: 4,
      description: 'Consistency is architecture, not willpower. Install the TPO content calendar and the feedback loops required to stay in the game.',
      color: 'gold'
    },
    {
      id: 'CSM 301',
      title: 'Conversion + ManyChat',
      type: 'Revenue Module',
      lessons: 4,
      duration: '46 min',
      objectives: 4,
      description: 'Posting is not the business — conversation is. This module builds the bridge between your views and your CRM using DM automation.',
      color: 'gold'
    },
    {
      id: 'CSM 401',
      title: 'Optimize + Local Flywheel',
      type: 'Capstone Module',
      lessons: 4,
      duration: '48 min',
      objectives: 3,
      description: 'This is where the system becomes a machine. Learn to read data, optimize hooks, and install the flywheel that keeps growing without you.',
      color: 'gold'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-800 py-4 px-8 flex justify-between items-center bg-black sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#C5A059] rounded flex items-center justify-center font-bold text-black">I</div>
          <span className="text-xl font-bold tracking-tight">Insight <span className="text-[#C5A059]">Academy</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="text-white">Catalog</a>
          <a href="#" className="hover:text-white transition-colors">My Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Resources</a>
        </div>
        <button className="bg-[#C5A059] text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-[#D4B375] transition-colors">
          Start Learning
        </button>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-8 max-w-7xl mx-auto border-b border-gray-900">
        <div className="max-w-3xl">
          <div className="text-[#C5A059] text-sm font-bold tracking-widest uppercase mb-4">Course Catalog</div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">TPO Content Mastery</h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            A complete, university-style curriculum for scaling high-ticket offers via vertical video systems. Six modules, built to be taken in order.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-900">
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Modules</div>
              <div className="text-2xl font-bold">6 Modules</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Lessons</div>
              <div className="text-2xl font-bold">28 Lessons</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Duration</div>
              <div className="text-2xl font-bold">304 Minutes</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Assessments</div>
              <div className="text-2xl font-bold">26 Quizzes</div>
            </div>
          </div>
        </div>
      </header>

      {/* Curriculum Grid */}
      <main className="py-20 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Curriculum</h2>
            <p className="text-gray-500">Six Modules, Built to Be Taken in Order</p>
          </div>
          <div className="text-[#C5A059] flex items-center gap-2 cursor-pointer hover:underline text-sm font-bold">
            <Download size={16} />
            Download Workbook
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, idx) => (
            <div key={module.id} className="group bg-zinc-950 border border-zinc-900 rounded-2xl p-8 hover:border-[#C5A059] transition-all duration-300 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black italic">{idx + 1}</span>
              </div>
              <div className="mb-6">
                <div className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#C5A059]/30 inline-block px-2 py-1 rounded">
                  {module.type}
                </div>
                <div className="text-gray-500 text-xs font-mono mb-1">{module.id}</div>
                <h3 className="text-2xl font-bold group-hover:text-[#C5A059] transition-colors">{module.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                {module.description}
              </p>
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-900 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <PlayCircle size={14} className="text-[#C5A059]" />
                  {module.lessons} Lessons
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#C5A059]" />
                  {module.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center font-bold text-gray-400">I</div>
            <span className="text-lg font-bold text-gray-500">Insight Social Media Academy</span>
          </div>
          <div className="text-gray-600 text-sm">
            © 2025 Insight Social Media Management · TPO Method, 3Cs, and Local Flywheel are proprietary frameworks.
          </div>
        </div>
      </footer>
    </div>
  );
}
