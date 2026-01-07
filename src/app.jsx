import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Camera, 
  X, 
  ChevronDown, 
  Trophy, 
  Target, 
  Calendar,
  CheckCircle2,
  Circle,
  LayoutDashboard,
  Upload,
  Sparkles,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

// --- Constants & Config ---

// Theme configurations
const THEMES = {
  default: {
    name: 'Default',
    bg: 'from-slate-50 via-white to-blue-50/30',
    headerBg: 'bg-slate-900',
    cardBg: 'bg-white',
    primaryText: 'text-slate-800',
    accent: 'blue'
  },
  dark: {
    name: 'Dark',
    bg: 'from-slate-900 via-slate-800 to-slate-900',
    headerBg: 'bg-black',
    cardBg: 'bg-slate-800',
    primaryText: 'text-white',
    accent: 'purple'
  },
  vibrant: {
    name: 'Vibrant',
    bg: 'from-purple-50 via-pink-50 to-blue-50',
    headerBg: 'bg-gradient-to-r from-purple-600 to-pink-600',
    cardBg: 'bg-white',
    primaryText: 'text-slate-800',
    accent: 'purple'
  },
  ocean: {
    name: 'Ocean',
    bg: 'from-blue-50 via-cyan-50 to-teal-50',
    headerBg: 'bg-gradient-to-r from-cyan-600 to-teal-600',
    cardBg: 'bg-white/95',
    primaryText: 'text-slate-800',
    accent: 'cyan'
  }
};

// Refined palette for a softer, more "premium" look
const WEEK_COLORS = {
  1: { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-600', fill: '#eff6ff', stroke: '#3b82f6', ring: 'focus:ring-blue-200' },
  2: { bg: 'bg-pink-50/50', border: 'border-pink-100', text: 'text-pink-600', fill: '#fdf2f8', stroke: '#ec4899', ring: 'focus:ring-pink-200' },
  3: { bg: 'bg-teal-50/50', border: 'border-teal-100', text: 'text-teal-600', fill: '#f0fdfa', stroke: '#14b8a6', ring: 'focus:ring-teal-200' },
  4: { bg: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-600', fill: '#fefce8', stroke: '#f59e0b', ring: 'focus:ring-amber-200' },
  5: { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-600', fill: '#eef2ff', stroke: '#6366f1', ring: 'focus:ring-indigo-200' },
};

const DEFAULT_HABITS = Array(10).fill(null).map((_, i) => ({
  id: `h-${i}`,
  name: i === 0 ? "Read 10 pages" : i === 1 ? "Drink 3L water" : i === 2 ? "Workout 30 mins" : "",
  checks: {} 
}));

const DEFAULT_WEEKLY_HABITS = Array(5).fill(null).map((_, i) => ({
  id: `wh-${i}`,
  week: 1, 
  name: "",
  completed: false
}));

const DAYS_IN_MONTH = 31;

// --- Helper Components ---

const ProgressBar = ({ percent, colorClass = "bg-blue-500" }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
    <div 
      className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass} shadow-sm`} 
      style={{ width: `${percent}%` }}
    ></div>
  </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 px-1">
    {Icon && <Icon size={16} className="text-blue-500" />}
    <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
      {title}
    </h2>
    <div className="h-px bg-gray-100 flex-1 ml-4"></div>
  </div>
);

export default function App() {
  // --- State ---
  const [showInstructions, setShowInstructions] = useState(true);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2026");
  const [affirmationImage, setAffirmationImage] = useState(null);
  const [theme, setTheme] = useState("default"); // default, dark, vibrant, ocean
  
  // Habits Data
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [weeklyHabits, setWeeklyHabits] = useState({
    1: [...DEFAULT_WEEKLY_HABITS],
    2: [...DEFAULT_WEEKLY_HABITS],
    3: [...DEFAULT_WEEKLY_HABITS],
    4: [...DEFAULT_WEEKLY_HABITS],
    5: [...DEFAULT_WEEKLY_HABITS],
  });
  
  const [monthlyHabits, setMonthlyHabits] = useState([
    { id: 'm1', name: 'Finish project A', completed: false },
    { id: 'm2', name: 'Save $500', completed: false },
    { id: 'm3', name: 'Read 2 books', completed: false },
  ]);

  const [reflection, setReflection] = useState("");

  // --- Calculations ---
  const chartData = useMemo(() => {
    return Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
      const day = i + 1;
      const totalActiveHabits = habits.filter(h => h.name.trim() !== "").length;
      if (totalActiveHabits === 0) return { day, progress: 0 };
      
      const completedCount = habits.reduce((acc, habit) => {
        return acc + (habit.checks[day] ? 1 : 0);
      }, 0);
      
      return {
        day,
        progress: Math.round((completedCount / totalActiveHabits) * 100)
      };
    });
  }, [habits]);

  const totalCompletionRate = useMemo(() => {
    const totalDays = chartData.length;
    const totalProgressSum = chartData.reduce((acc, curr) => acc + curr.progress, 0);
    return (totalProgressSum / totalDays).toFixed(1);
  }, [chartData]);

  const weeklyProgress = useMemo(() => {
    let total = 0;
    let completed = 0;
    Object.values(weeklyHabits).forEach(weekList => {
      weekList.forEach(task => {
        if (task.name.trim()) {
          total++;
          if (task.completed) completed++;
        }
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [weeklyHabits]);

  // --- Handlers ---
  const toggleHabitCheck = (habitIndex, day) => {
    const newHabits = [...habits];
    newHabits[habitIndex].checks[day] = !newHabits[habitIndex].checks[day];
    setHabits(newHabits);
  };

  const updateHabitName = (index, newName) => {
    const newHabits = [...habits];
    newHabits[index].name = newName;
    setHabits(newHabits);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAffirmationImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getWeekForDay = (day) => {
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;
    return 5;
  };

  // --- Render Helpers ---

  const renderDayHeader = () => {
    const days = [];
    for (let i = 1; i <= DAYS_IN_MONTH; i++) {
      const weekNum = getWeekForDay(i);
      const styles = WEEK_COLORS[weekNum];
      days.push(
        <div key={i} className={`flex-1 min-w-[32px] text-center border-r border-gray-100/50 ${styles.bg} first:rounded-tl-none last:rounded-tr-none`}>
          <div className={`text-[9px] font-bold ${styles.text} uppercase pt-1.5 opacity-80`}>
            {['S','M','T','W','T','F','S'][(i-1)%7]}
          </div>
          <div className="text-[11px] font-medium text-gray-500 pb-1.5">{i}</div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme].bg} text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20 transition-all duration-500`}>
      
      {/* 1. Instruction Bar - Sleek & Dismissible */}
      {showInstructions && (
        <div className={`${THEMES[theme].headerBg} text-slate-300 text-[11px] py-2 px-6 flex justify-between items-center shadow-sm relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
          <div className="flex items-center gap-2 z-10">
            <Sparkles size={12} className="text-yellow-400" />
            <span className="tracking-wide font-medium">Welcome to your new dashboard. customize your month below.</span>
          </div>
          <div className="flex items-center gap-4 z-10">
            <div className="flex gap-2 border-l border-slate-600 pl-4">
              {Object.keys(THEMES).map(key => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`text-[10px] px-2 py-1 rounded transition-all ${theme === key ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
                  title={THEMES[key].name}
                >
                  {THEMES[key].name}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowInstructions(false)} 
              className="hover:text-white transition-colors z-10"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">

        {/* 2. Header Section */}
        <header className="flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="flex gap-8 items-center">
            {/* Date Controls */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/50 w-44 flex-shrink-0 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-4">
                <label className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase block mb-1">Month</label>
                <input 
                  value={month} 
                  onChange={(e) => setMonth(e.target.value)} 
                  className="w-full font-bold text-xl text-slate-800 bg-transparent border-b border-transparent group-hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-colors placeholder-slate-300"
                />
              </div>
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase block mb-1">Year</label>
                <input 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)} 
                  className="w-full font-bold text-xl text-slate-800 bg-transparent border-b border-transparent group-hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-colors placeholder-slate-300"
                />
              </div>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-6xl md:text-8xl font-light text-slate-800 tracking-tight leading-none drop-shadow-sm">
                {month}
              </h1>
              <div className="flex items-center gap-3 mt-3 opacity-60">
                <div className="h-px w-12 bg-slate-400"></div>
                <span className="text-xs tracking-[0.4em] font-semibold text-slate-500 uppercase">Habit Dashboard</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-2 text-right">
             <div className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-500 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Auto-saving enabled
             </div>
             <p className="text-[10px] text-slate-400 uppercase tracking-widest">v2.4 Pro</p>
          </div>
        </header>

        {/* 3. Dashboard Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Affirmation Card */}
          <div className="lg:col-span-3">
            <div className={`${THEMES[theme].cardBg} rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 h-full min-h-[240px] overflow-hidden relative group transition-all hover:shadow-lg`}>
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[10px] font-bold text-slate-600 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                  VISION BOARD
                </span>
              </div>
              
              {affirmationImage ? (
                <div className="relative h-full w-full">
                   <img src={affirmationImage} alt="Vision" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                   <button 
                    onClick={() => setAffirmationImage(null)}
                    className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                   >
                     <X size={16} />
                   </button>
                </div>
              ) : (
                <label className="flex-1 h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/50 cursor-pointer hover:bg-slate-50 transition-colors p-8 text-center border-2 border-dashed border-slate-200 hover:border-blue-300 m-2 rounded-2xl">
                   <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(99,102,241,0.2)] mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                     <Camera size={24} />
                   </div>
                   <span className="text-sm font-semibold text-slate-600">Upload Visual Anchor</span>
                   <span className="text-xs text-slate-400 mt-2 max-w-[180px] leading-relaxed">
                     "Visualizing your goal is the first step to achieving it."
                   </span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Chart Card */}
          <div className={`lg:col-span-6 ${THEMES[theme].cardBg} rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 p-6 flex flex-col relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div>
                 <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Consistency Trend</h3>
                 <p className="text-xs text-slate-400 mt-1">Your daily completion rate over time</p>
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Trophy size={12} />
                On Track
              </div>
            </div>
            <div className="flex-1 w-full min-h-[180px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px'}} 
                    itemStyle={{color: '#4f46e5', fontSize: '12px', fontWeight: 'bold'}}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorProgress)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Card */}
          <div className={`lg:col-span-3 ${THEMES[theme].cardBg} rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group`}>
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-80"></div>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-4 z-10">Daily Progress</h3>
            
            <div className="relative z-10 mb-4">
               <span className="text-7xl font-light text-slate-800 tracking-tight">
                {chartData[chartData.length - 1]?.progress || 0}
               </span>
               <span className="text-2xl text-slate-300 font-light ml-1">%</span>
            </div>

            <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Month Avg</span>
                 <span className="text-sm font-bold text-indigo-600">{totalCompletionRate}%</span>
               </div>
               <ProgressBar percent={totalCompletionRate} colorClass="bg-gradient-to-r from-blue-500 to-indigo-600" />
            </div>
          </div>
        </div>

        {/* 4. MAIN MATRIX: Daily Habits */}
        <div className={`${THEMES[theme].cardBg} rounded-3xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="bg-slate-800/5 px-6 py-4 border-b border-slate-200 backdrop-blur-sm flex justify-between items-center">
             <h2 className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase flex items-center gap-2">
               <LayoutDashboard size={14} className="text-blue-500"/> 
               Daily Habits
             </h2>
             <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] p-6"> 
              
              {/* Table Header */}
              <div className="flex border-b border-slate-100 pb-2">
                <div className="w-72 pl-4 pr-6 pb-2 font-bold text-[10px] text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-end">
                  Habit Name
                </div>
                
                {/* Day Columns */}
                <div className="flex flex-1">
                  {renderDayHeader()}
                </div>
                
                <div className="w-24 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-end justify-center pb-2 pl-4">
                  Progress
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-1 mt-2">
                {habits.map((habit, hIndex) => (
                  <div key={habit.id} className="flex items-center hover:bg-slate-50/80 rounded-lg transition-colors group py-1.5 px-1">
                    {/* Habit Name Input */}
                    <div className="w-72 px-3 flex-shrink-0 flex items-center relative">
                      <span className="text-xs text-slate-300 font-mono w-6 text-right mr-4 group-hover:text-blue-400 transition-colors">{String(hIndex + 1).padStart(2, '0')}</span>
                      <input 
                        type="text" 
                        value={habit.name}
                        placeholder={`Define habit ${hIndex + 1}...`}
                        onChange={(e) => updateHabitName(hIndex, e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder-slate-300 focus:outline-none border-b border-transparent focus:border-blue-300 transition-all py-1"
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-1 gap-[1px]">
                      {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
                        const day = i + 1;
                        const weekNum = getWeekForDay(day);
                        const isChecked = habit.checks[day];
                        const weekColor = WEEK_COLORS[weekNum];

                        return (
                          <div key={day} className="flex-1 flex items-center justify-center">
                            <button
                              onClick={() => toggleHabitCheck(hIndex, day)}
                              className={`w-6 h-6 rounded-md transition-all duration-300 flex items-center justify-center relative group/btn outline-none focus:ring-2 focus:ring-offset-1 ${weekColor.ring} ${
                                isChecked 
                                  ? `${weekColor.bg} ${weekColor.text} shadow-sm scale-90` 
                                  : 'hover:bg-slate-100 hover:scale-110'
                              }`}
                            >
                               {isChecked ? (
                                 <CheckCircle2 size={14} strokeWidth={3} />
                               ) : (
                                 <div className={`w-1 h-1 rounded-full bg-slate-200 group-hover/btn:bg-slate-300 transition-colors`}></div>
                               )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress Stats for Row */}
                    <div className="w-24 pl-6 flex-shrink-0 flex items-center justify-center">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                          style={{ width: `${(Object.values(habit.checks).filter(Boolean).length / DAYS_IN_MONTH) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Weekly & Monthly Split */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* LEFT: Weekly Habits */}
          <div className="space-y-4">
            <SectionHeader title="Weekly Sprints" icon={Target} />
            
            <div className={`${THEMES[theme].cardBg} rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col gap-6`}>
              {/* Weekly Checkboxes */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((weekNum) => (
                  <div key={weekNum} className={`group border border-slate-100 rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-slate-200 ${THEMES[theme].cardBg}`}>
                    <div className={`px-4 py-3 ${WEEK_COLORS[weekNum].bg} flex justify-between items-center`}>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${WEEK_COLORS[weekNum].text}`}>Week {weekNum}</span>
                       <div className="flex gap-2">
                          {weeklyHabits[weekNum].map((t, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${t.completed ? WEEK_COLORS[weekNum].text.replace('text-', 'bg-') : 'bg-white/50'}`}></div>
                          ))}
                       </div>
                    </div>
                    <div className="p-4 space-y-3">
                       {weeklyHabits[weekNum].map((task, idx) => (
                         <div key={idx} className="flex items-center gap-3 group/item">
                           <button 
                            onClick={() => {
                              const updated = {...weeklyHabits};
                              updated[weekNum][idx].completed = !task.completed;
                              setWeeklyHabits(updated);
                            }}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              task.completed 
                                ? `${WEEK_COLORS[weekNum].text.replace('text-', 'bg-')} border-${WEEK_COLORS[weekNum].text.split('-')[1]}-600 text-white` 
                                : 'border-slate-300 text-transparent hover:border-blue-400'
                            }`}
                           >
                             <CheckCircle2 size={14} />
                           </button>
                           <input 
                             type="text" 
                             className={`flex-1 text-xs font-medium bg-transparent focus:outline-none transition-colors ${task.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}
                             placeholder="Add task..."
                             value={task.name}
                             onChange={(e) => {
                               const updated = {...weeklyHabits};
                               updated[weekNum][idx].name = e.target.value;
                               setWeeklyHabits(updated);
                             }}
                           />
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly Progress Summary */}
              <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-200">
                {[1, 2, 3, 4, 5].map(week => {
                  const completed = weeklyHabits[week].filter(t => t.completed && t.name.trim()).length;
                  const total = weeklyHabits[week].filter(t => t.name.trim()).length;
                  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
                  
                  return (
                    <div key={week} className="text-center">
                      <div className={`text-sm font-bold ${WEEK_COLORS[week].text}`}>{percent}%</div>
                      <div className="text-[10px] text-slate-400">W{week}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Monthly & Reflection */}
          <div className="flex flex-col gap-6">
            
            {/* Monthly Goals */}
            <div>
              <SectionHeader title="Monthly Focus" icon={CheckCircle2} />
              <div className={`${THEMES[theme].cardBg} rounded-3xl shadow-sm border border-slate-200 p-6 relative overflow-hidden`}>
                <div className="space-y-4 relative z-10">
                  {monthlyHabits.map((habit, idx) => (
                    <div key={habit.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                       <button
                         onClick={() => {
                           const updated = [...monthlyHabits];
                           updated[idx].completed = !updated[idx].completed;
                           setMonthlyHabits(updated);
                         }}
                         className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                           habit.completed ? 'border-green-500 bg-green-500 text-white scale-110' : 'border-slate-200 text-transparent hover:border-blue-300'
                         }`}
                       >
                         <CheckCircle2 size={14} />
                       </button>
                       <div className="flex-1">
                         <input 
                           value={habit.name}
                           onChange={(e) => {
                             const updated = [...monthlyHabits];
                             updated[idx].name = e.target.value;
                             setMonthlyHabits(updated);
                           }}
                           className={`w-full font-medium text-sm bg-transparent focus:outline-none transition-colors ${habit.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}
                         />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflection Area */}
            <div className="flex-1 flex flex-col">
              <SectionHeader title="Monthly Reflection" icon={LayoutDashboard} />
              <div className={`${THEMES[theme].cardBg} rounded-3xl shadow-sm border border-slate-200 p-1 flex-1 relative group hover:shadow-md transition-shadow`}>
                <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-green-50 text-green-600 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">Saved</div>
                </div>
                <textarea
                  className="w-full h-full min-h-[200px] resize-none focus:outline-none text-slate-600 text-sm p-6 rounded-[20px] bg-slate-50/50 focus:bg-white transition-colors leading-loose"
                  placeholder="Reflect on your wins and challenges..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  style={{
                    backgroundImage: 'linear-gradient(transparent 95%, #e2e8f0 95%)',
                    backgroundSize: '100% 32px',
                    lineHeight: '32px'
                  }}
                ></textarea>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-center py-8 opacity-60">
           <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-[0.3em]">
             <span>Designed for Growth</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>2026</span>
           </div>
        </div>

      </div>
    </div>
  );
}
