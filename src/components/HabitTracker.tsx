import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { format, subDays, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Trash2, Flame, Award, Trophy, Plus, Check, Calendar as CalendarIcon, 
  BarChart3, Sparkles, Clock, Target, BookOpen, Sun, Moon, Sunrise, 
  Zap, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Filter, 
  HelpCircle, Edit3, X, Play, Pause, RotateCcw, Volume2, Info, Star, Compass, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Habit, HabitLog } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, 
  YAxis, Tooltip, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { PREDEFINED_HABITS_CATALOG, HabitTemplate } from '../data/habitsCatalog';

type HabitTab = 'today' | 'catalog' | 'matrix' | 'focus';

// Play pleasant web audio chime
function playChime(type: 'complete' | 'uncheck' | 'timer') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'complete') {
      // Pleasant uplifting major chord arpeggio
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.24); // C6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'uncheck') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.00, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'timer') {
      // Singing bell / gong
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.start(now);
      osc.stop(now + 1.2);
    }
  } catch (err) {
    // AudioContext blocked or not supported
  }
}

export function HabitTracker() {
  const { data, addHabit, updateHabit, deleteHabit, toggleHabit } = useData();

  const [activeTab, setActiveTab] = useState<HabitTab>('today');
  
  // Date State for Daily Log
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Filtering & Search
  const [categoryFilter, setCategoryFilter] = useState<string>('Wszystkie');
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catalog Filters
  const [catalogCategory, setCatalogCategory] = useState<string>('Wszystkie');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<HabitTemplate | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Habit['category']>('Zdrowie');
  const [formIcon, setFormIcon] = useState('💧');
  const [formTimeOfDay, setFormTimeOfDay] = useState<NonNullable<Habit['timeOfDay']>>('Cały Dzień');
  const [formFrequency, setFormFrequency] = useState('Codziennie (7x/tydz)');
  const [formDescription, setFormDescription] = useState('');

  // Chart Range
  const [chartRange, setChartRange] = useState<'7' | '14' | '30' | '90'>('14');

  // Focus Timer / Pomodoro
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60); // 25 min default
  const [timerLeft, setTimerLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'deep' | 'meditation' | 'box_breath'>('pomodoro');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories: Habit['category'][] = ['Zdrowie', 'Rozwój', 'Umysł', 'Trening', 'Regeneracja', 'Inne'];
  const iconOptions = ['💧', '🚶‍♂️', '🧘‍♀️', '🥗', '💪', '📚', '🧠', '🛌', '📝', '🚫', '🚿', '📵', '🌬️', '🤸‍♂️', '🎯', '✨', '⚡', '☕'];
  const timesOfDay: NonNullable<Habit['timeOfDay']>[] = ['Rano', 'Popołudnie', 'Wieczór', 'Cały Dzień'];

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsTimerRunning(false);
            playChime('timer');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const selectTimerPreset = (mode: 'pomodoro' | 'deep' | 'meditation' | 'box_breath', seconds: number) => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTimerDuration(seconds);
    setTimerLeft(seconds);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 7 Days Rolling Window around selectedDate
  const currentDaysWindow = useMemo(() => {
    const centerDate = parseISO(selectedDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(centerDate, 6 - i);
      const dStr = format(d, 'yyyy-MM-dd');
      return {
        dateStr: dStr,
        dayName: format(d, 'EEEEEE', { locale: pl }).toUpperCase(),
        dayNum: format(d, 'd'),
        fullDayName: format(d, 'EEEE', { locale: pl }),
        isToday: isSameDay(d, new Date()),
        isSelected: dStr === selectedDate
      };
    });
  }, [selectedDate]);

  // Habit Streak Calculation
  const getStreak = (habitId: string) => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const d = format(subDays(today, i), 'yyyy-MM-dd');
      const isCompleted = data.habitLogs.some(l => l.habitId === habitId && l.date === d && l.completed);
      if (isCompleted) {
        streak++;
      } else if (i === 0) {
        // If today is not completed yet, don't break streak if yesterday was completed
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  // Best streak overall
  const longestStreakHabit = useMemo(() => {
    if (data.habits.length === 0) return { habit: null, streak: 0 };
    let best = { habit: data.habits[0], streak: getStreak(data.habits[0].id) };
    data.habits.forEach(h => {
      const s = getStreak(h.id);
      if (s > best.streak) {
        best = { habit: h, streak: s };
      }
    });
    return best;
  }, [data.habits, data.habitLogs]);

  // Selected Day Stats
  const selectedDayLogs = useMemo(() => {
    return data.habitLogs.filter(l => l.date === selectedDate && l.completed);
  }, [data.habitLogs, selectedDate]);

  const totalActiveHabits = data.habits.length;
  const completedSelectedDayCount = selectedDayLogs.length;
  const completionRate = totalActiveHabits > 0 ? Math.round((completedSelectedDayCount / totalActiveHabits) * 100) : 0;

  // XP / Discipline Score for the selected day
  const disciplineScore = completedSelectedDayCount * 25 + (completionRate === 100 && totalActiveHabits > 0 ? 50 : 0);

  // Motivational Badge / Title based on completion
  const habitStatus = useMemo(() => {
    if (totalActiveHabits === 0) return { title: 'Brak nawyków', desc: 'Dodaj swój pierwszy cel z katalogu lub stwórz własny' };
    if (completionRate === 100) return { title: 'Perfekcyjny Dzień! 🏆', desc: 'Wszystkie 100% nawyków zrealizowane. Mistrzowska dyscyplina!' };
    if (completionRate >= 75) return { title: 'Świetny Rytm! 🔥', desc: 'Prawie kompletna lista. Utrzymaj tę energię do wieczora.' };
    if (completionRate >= 50) return { title: 'Dobra Robota! ⚡', desc: 'Półmetek osiągnięty. Jeszcze kilka kroków do pełni sukcesu.' };
    if (completedSelectedDayCount > 0) return { title: 'Dobry Początek ✨', desc: 'Pierwsze nawyki odhaczone. Kontynuuj budowanie impetu.' };
    return { title: 'Czas na Działanie 🎯', desc: 'Zacznij od najprostszego nawyku, aby nabrać rozpędu.' };
  }, [completionRate, totalActiveHabits, completedSelectedDayCount]);

  // Filtered Habits for selected day
  const filteredHabits = useMemo(() => {
    return data.habits.filter(habit => {
      const matchCat = categoryFilter === 'Wszystkie' || habit.category === categoryFilter;
      const matchTime = timeOfDayFilter === 'Wszystkie' || (habit.timeOfDay || 'Cały Dzień') === timeOfDayFilter;
      const matchSearch = !searchQuery.trim() || 
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchTime && matchSearch;
    });
  }, [data.habits, categoryFilter, timeOfDayFilter, searchQuery]);

  // Handle Habit Toggle with Sound
  const handleToggle = (habitId: string, date: string) => {
    const isAlreadyDone = data.habitLogs.some(l => l.habitId === habitId && l.date === date && l.completed);
    toggleHabit(habitId, date);
    if (isAlreadyDone) {
      playChime('uncheck');
    } else {
      playChime('complete');
    }
  };

  // Form Open for New
  const handleOpenAddModal = (template?: HabitTemplate) => {
    setEditingHabitId(null);
    if (template) {
      setFormName(template.name);
      setFormCategory(template.category);
      setFormIcon(template.icon);
      setFormTimeOfDay(template.timeOfDay);
      setFormFrequency(template.targetFrequency);
      setFormDescription(template.description);
    } else {
      setFormName('');
      setFormCategory('Zdrowie');
      setFormIcon('💧');
      setFormTimeOfDay('Cały Dzień');
      setFormFrequency('Codziennie (7x/tydz)');
      setFormDescription('');
    }
    setIsModalOpen(true);
  };

  // Form Open for Edit
  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setFormName(habit.name);
    setFormCategory(habit.category);
    setFormIcon(habit.icon || '✨');
    setFormTimeOfDay(habit.timeOfDay || 'Cały Dzień');
    setFormFrequency(habit.targetFrequency || 'Codziennie (7x/tydz)');
    setFormDescription(habit.description || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingHabitId) {
      updateHabit(editingHabitId, {
        name: formName.trim(),
        category: formCategory,
        icon: formIcon,
        timeOfDay: formTimeOfDay,
        targetFrequency: formFrequency,
        description: formDescription.trim()
      });
    } else {
      addHabit(
        formName.trim(),
        formCategory,
        formIcon,
        formTimeOfDay,
        formDescription.trim(),
        formFrequency
      );
    }
    setIsModalOpen(false);
  };

  // Add from Catalog directly
  const handleAddFromCatalog = (template: HabitTemplate) => {
    // Check if already added
    const exists = data.habits.some(h => h.name.toLowerCase() === template.name.toLowerCase());
    if (exists) {
      alert(`Nawyk "${template.name}" znajduje się już na Twojej liście!`);
      return;
    }
    addHabit(
      template.name,
      template.category,
      template.icon,
      template.timeOfDay,
      template.description,
      template.targetFrequency
    );
    setSelectedCatalogItem(null);
    setActiveTab('today');
    playChime('complete');
  };

  // Trend Chart Data
  const trendData = useMemo(() => {
    const range = parseInt(chartRange);
    return Array.from({ length: range }).map((_, i) => {
      const d = subDays(new Date(), (range - 1) - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const completedOnDay = data.habitLogs.filter(l => l.date === dateStr && l.completed).length;
      const rate = totalActiveHabits > 0 ? Math.round((completedOnDay / totalActiveHabits) * 100) : 0;
      return {
        date: format(d, 'd.MM'),
        fullDate: format(d, 'd MMMM yyyy', { locale: pl }),
        rate,
        completed: completedOnDay,
        total: totalActiveHabits
      };
    });
  }, [data.habitLogs, chartRange, totalActiveHabits]);

  // Heatmap for Matrix (Last 35 days)
  const heatmapDays = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => {
      const d = subDays(new Date(), 34 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const completed = data.habitLogs.filter(l => l.date === dateStr && l.completed).length;
      const rate = totalActiveHabits > 0 ? (completed / totalActiveHabits) : 0;
      return {
        date: d,
        dateStr,
        completed,
        rate,
        dayNum: format(d, 'd'),
        monthName: format(d, 'MMM', { locale: pl })
      };
    });
  }, [data.habitLogs, totalActiveHabits]);

  // Consistency Score per Habit
  const habitConsistencyList = useMemo(() => {
    const days30 = Array.from({ length: 30 }).map((_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));
    
    return data.habits.map(h => {
      const completedCount = days30.filter(d => 
        data.habitLogs.some(l => l.habitId === h.id && l.date === d && l.completed)
      ).length;
      const rate = Math.round((completedCount / 30) * 100);
      const streak = getStreak(h.id);

      return {
        habit: h,
        completedCount,
        rate,
        streak
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [data.habits, data.habitLogs]);

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return PREDEFINED_HABITS_CATALOG.filter(item => {
      const matchCat = catalogCategory === 'Wszystkie' || item.category === catalogCategory;
      return matchCat;
    });
  }, [catalogCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8 pb-16"
    >
      {/* Header & Sub-Navigation */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2.5 bg-zinc-900 text-white rounded-2xl shadow-sm">
              <Zap className="w-5 h-5 text-amber-400" />
            </span>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">Nawyki & Dyscyplina</h2>
          </div>
          <p className="text-sm font-semibold text-zinc-500">
            Buduj atomowe nawyki, śledź passy i kształtuj niezłomną rutynę dzień po dniu
          </p>
        </div>

        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/80 overflow-x-auto self-start lg:self-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'today'
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
            )}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Dziennik & Dziś
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              activeTab === 'today' ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
            )}>
              {completedSelectedDayCount}/{totalActiveHabits}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'catalog'
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
            )}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            Baza Szablonów
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              activeTab === 'catalog' ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
            )}>
              {PREDEFINED_HABITS_CATALOG.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'matrix'
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
            )}
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Macierz & Trendy
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
              activeTab === 'focus'
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
            )}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            Timer Skupienia
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* TAB 1: DZIENNIK & DZIŚ (BENTO GRID)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'today' && (
        <div className="space-y-8">
          {/* Top Bento Grid Hero */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* HERO TILE (Dark Card) */}
            <div className="md:col-span-6 lg:col-span-5 bg-zinc-950 text-white p-7 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-800/80 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Realizacja Dnia
                  </span>
                  <span className="text-xs font-bold text-zinc-400">
                    {format(parseISO(selectedDate), 'd MMMM yyyy', { locale: pl })}
                  </span>
                </div>

                <div className="flex items-center gap-6 my-2">
                  <div className="relative w-28 h-28 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Ukończone', value: completedSelectedDayCount || (totalActiveHabits === 0 ? 0 : 0.001), color: '#10b981' },
                            { name: 'Pozostałe', value: Math.max(0, totalActiveHabits - completedSelectedDayCount), color: '#27272a' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={52}
                          stroke="none"
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#27272a" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black tracking-tight">{completionRate}%</span>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Celu</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{habitStatus.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{habitStatus.desc}</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">Zrobione</span>
                  <span className="text-lg font-black text-white">{completedSelectedDayCount} z {totalActiveHabits} nawyków</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Dyscyplina XP</span>
                  <span className="text-lg font-black text-amber-400">+{disciplineScore} pkt</span>
                </div>
              </div>
            </div>

            {/* STREAK & FLAME TILE */}
            <div className="md:col-span-3 lg:col-span-3 bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                    <Flame className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">
                    Najdłuższa Passa
                  </span>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Rekordowy Streak</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-4xl font-black text-zinc-900">{longestStreakHabit.streak}</h3>
                  <span className="text-sm font-bold text-zinc-400">dni pod rząd</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Top Lider:</span>
                <p className="text-xs font-black text-zinc-800 truncate mt-0.5">
                  {longestStreakHabit.habit ? `${longestStreakHabit.habit.icon || '✨'} ${longestStreakHabit.habit.name}` : 'Brak danych'}
                </p>
              </div>
            </div>

            {/* DISCIPLINE / COMPLETION ARCHIVE TILE */}
            <div className="md:col-span-3 lg:col-span-4 bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 border border-purple-100">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => handleOpenAddModal()}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Dodaj nawyk
                  </button>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Wykonane w sumie</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-4xl font-black text-zinc-900">
                    {data.habitLogs.filter(l => l.completed).length}
                  </h3>
                  <span className="text-sm font-bold text-zinc-400">odhaczonych</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500">
                <span>Aktywne cele: <strong>{totalActiveHabits}</strong></span>
                <span className="text-emerald-600 font-black">
                  {data.habitLogs.filter(l => l.completed).length > 50 ? 'Poziom: Tytan Dyscypliny' : 'Poziom: Praktyk Rytuałów'}
                </span>
              </div>
            </div>
          </div>

          {/* Date Selector Strip (Rolling 7 Days) */}
          <div className="bg-white p-4 md:p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(format(subDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))}
                className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors border border-zinc-200/60"
                title="Poprzedni dzień"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  isSameDay(parseISO(selectedDate), new Date())
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                )}
              >
                Dzisiaj
              </button>
              <button
                onClick={() => setSelectedDate(format(addDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))}
                className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors border border-zinc-200/60"
                title="Następny dzień"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 7-Day Day Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-center">
              {currentDaysWindow.map((d) => (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[3.2rem] py-2 px-1.5 rounded-2xl transition-all border",
                    d.isSelected
                      ? "bg-zinc-900 border-zinc-900 text-white shadow-md scale-105"
                      : d.isToday
                        ? "bg-amber-50 border-amber-300 text-amber-950 font-bold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider",
                    d.isSelected ? "text-zinc-400" : d.isToday ? "text-amber-700" : "text-zinc-400"
                  )}>
                    {d.dayName}
                  </span>
                  <span className="text-base font-black mt-0.5">{d.dayNum}</span>
                </button>
              ))}
            </div>

            {/* Quick Filter Search & Category */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Szukaj nawyku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-48 bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs font-semibold placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Category & Time of Day Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Kategoria:
              </span>
              {['Wszystkie', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                    categoryFilter === cat
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
              <span className="text-[11px] font-bold text-zinc-500 px-2">Pora:</span>
              {['Wszystkie', 'Rano', 'Popołudnie', 'Wieczór'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeOfDayFilter(t)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                    timeOfDayFilter === t
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  {t === 'Rano' && '🌅 '}
                  {t === 'Popołudnie' && '☀️ '}
                  {t === 'Wieczór' && '🌙 '}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Habits Bento Grid List */}
          {filteredHabits.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] border border-zinc-200/80 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-3xl mx-auto flex items-center justify-center text-3xl">
                ✨
              </div>
              <div>
                <h4 className="text-lg font-bold text-zinc-900">Brak nawyków w wybranej kategorii</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                  Nie masz jeszcze dodanych nawyków spełniających powyższe kryteria. Dodaj swój cel lub skorzystaj z gotowych szablonów.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAddModal()}
                  className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Stwórz własny nawyk
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="bg-zinc-100 text-zinc-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Przeglądaj katalog szablonów
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHabits.map((habit) => {
                const isCompleted = data.habitLogs.some(
                  l => l.habitId === habit.id && l.date === selectedDate && l.completed
                );
                const streak = getStreak(habit.id);

                return (
                  <motion.div
                    key={habit.id}
                    layout
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggle(habit.id, selectedDate)}
                    className={cn(
                      "relative p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[175px] group select-none overflow-hidden",
                      isCompleted 
                        ? "bg-zinc-950 border-zinc-900 text-white shadow-xl shadow-zinc-950/10" 
                        : "bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg shadow-sm"
                    )}
                  >
                    {/* Background glow when completed */}
                    {isCompleted && (
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                    )}

                    {/* Top Row: Icon, Category & Actions */}
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110",
                          isCompleted ? "bg-white/10 text-white" : "bg-zinc-50 border border-zinc-200/60"
                        )}>
                          {habit.icon || '✨'}
                        </div>
                        <div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                            isCompleted ? "bg-white/10 text-emerald-300" : "bg-zinc-100 text-zinc-600"
                          )}>
                            {habit.category}
                          </span>
                          {habit.timeOfDay && (
                            <span className={cn(
                              "text-[10px] font-bold ml-1.5",
                              isCompleted ? "text-zinc-400" : "text-zinc-400"
                            )}>
                              • {habit.timeOfDay}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(habit);
                          }}
                          className={cn(
                            "p-2 rounded-xl transition-colors",
                            isCompleted ? "text-zinc-400 hover:text-white hover:bg-white/10" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                          )}
                          title="Edytuj nawyk"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Czy na pewno chcesz usunąć nawyk "${habit.name}"?`)) {
                              deleteHabit(habit.id);
                            }
                          }}
                          className={cn(
                            "p-2 rounded-xl transition-colors",
                            isCompleted ? "text-zinc-400 hover:text-rose-400 hover:bg-white/10" : "text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                          )}
                          title="Usuń nawyk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle: Name & Description */}
                    <div className="my-3 relative z-10">
                      <h4 className={cn(
                        "text-base font-bold tracking-tight line-clamp-2 leading-snug",
                        isCompleted ? "text-white" : "text-zinc-900"
                      )}>
                        {habit.name}
                      </h4>
                      {habit.description && (
                        <p className={cn(
                          "text-xs line-clamp-1 mt-1 font-medium",
                          isCompleted ? "text-zinc-400" : "text-zinc-500"
                        )}>
                          {habit.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Row: Streak & Checkmark */}
                    <div className="flex items-center justify-between pt-2 border-t relative z-10 border-current/10">
                      <div className="flex items-center gap-2">
                        {streak > 0 ? (
                          <div className={cn(
                            "flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-lg",
                            isCompleted ? "bg-amber-500/20 text-amber-300" : "bg-amber-50 text-amber-700"
                          )}>
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{streak} {streak === 1 ? 'dzień' : 'dni'} passy</span>
                          </div>
                        ) : (
                          <span className={cn("text-[11px] font-bold", isCompleted ? "text-zinc-400" : "text-zinc-400")}>
                            {habit.targetFrequency || 'Codziennie'}
                          </span>
                        )}
                      </div>

                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                        isCompleted 
                          ? "bg-emerald-400 text-zinc-950 scale-110 shadow-lg shadow-emerald-400/30" 
                          : "border-2 border-zinc-200 text-transparent group-hover:border-zinc-400"
                      )}>
                        <Check className={cn("w-4 h-4 transition-transform", isCompleted ? "scale-100" : "scale-0")} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KATALOG INSPIRACJI & SZABLONY                                      */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* Banner Hero */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-8 rounded-[2rem] border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Baza Naukowo Potwierdzonych Nawyków
              </span>
              <h3 className="text-2xl md:text-3xl font-black mt-3 mb-2 tracking-tight">
                Zbuduj System Zwycięskich Rutyn
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Zainspiruj się sprawdzonymi nawykami z dziedziny neurobiologii, medycyny stylu życia i metodologii *Atomic Habits*. Kliknij dowolny nawyk, aby poznać mechanizm jego działania i dodać go do swojego dziennika 1-kliknięciem.
              </p>
            </div>
          </div>

          {/* Category Filter for Catalog */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['Wszystkie', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCatalogCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                  catalogCategory === cat
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((template) => {
              const isAlreadyAdded = data.habits.some(h => h.name.toLowerCase() === template.name.toLowerCase());

              return (
                <div
                  key={template.id}
                  className="bg-white p-6 rounded-[2rem] border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl border border-zinc-100">
                        {template.icon}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-md">
                          {template.category}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/60">
                          {template.timeOfDay}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h4>

                    <p className="text-xs text-zinc-500 font-medium mt-2 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Scientific / Practical Benefit callout */}
                    <div className="mt-3.5 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-[11px] text-zinc-600 leading-normal">
                      <strong className="text-zinc-900 block mb-0.5">🧠 Dlaczego warto:</strong>
                      {template.whyItWorks}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      {template.targetFrequency}
                    </span>

                    {isAlreadyAdded ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                        <Check className="w-3.5 h-3.5" /> W Twoim planie
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddFromCatalog(template)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Dodaj nawyk
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MACIERZ & TRENDY (HEATMAP & ANALYTICS)                              */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-8">
          {/* Consistency Table & Streaks */}
          <div className="bg-white p-7 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Spójność & Wskaźnik Ukończenia (Ostatnie 30 Dni)</h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Ranking dyscypliny dla poszczególnych nawyków</p>
              </div>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200/60 self-start md:self-auto">
                Sortowane według skuteczności
              </span>
            </div>

            {habitConsistencyList.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs font-bold">
                Brak nawyków do wyświetlenia statystyk.
              </div>
            ) : (
              <div className="space-y-4">
                {habitConsistencyList.map((item) => (
                  <div 
                    key={item.habit.id}
                    className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-[220px]">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-xs border border-zinc-200/60">
                        {item.habit.icon || '✨'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{item.habit.name}</h4>
                        <span className="text-[10px] font-semibold text-zinc-500">{item.habit.category} • {item.habit.timeOfDay || 'Cały Dzień'}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Rate */}
                    <div className="flex-1 max-w-md">
                      <div className="flex justify-between text-xs font-bold text-zinc-600 mb-1.5">
                        <span>Skuteczność: <strong>{item.rate}%</strong></span>
                        <span className="text-zinc-400">{item.completedCount} / 30 dni</span>
                      </div>
                      <div className="h-2.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            item.rate >= 80 ? "bg-emerald-500" : item.rate >= 50 ? "bg-amber-500" : "bg-rose-500"
                          )}
                          style={{ width: `${item.rate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-xl border border-zinc-200 text-xs font-bold text-amber-700">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.streak} dni passy</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Area Chart: Completion Trend */}
          <div className="bg-white p-7 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Trend Realizacji Celów</h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Dzienna efektywność wyrażona w % ukończenia</p>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200/60 self-start md:self-auto">
                {(['7', '14', '30', '90'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      chartRange === r
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    {r} dni
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="habitRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#a1a1aa' }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#a1a1aa' }} 
                    dx={-10} 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '1rem', 
                      backgroundColor: '#18181b',
                      color: '#ffffff',
                      border: 'none', 
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.3)' 
                    }}
                    formatter={(value: any) => [`${value}% ukończenia`, 'Dyscyplina']}
                    labelStyle={{ fontWeight: 'bold', color: '#a1a1aa', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#habitRateGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heatmap Activity Grid (35 Days) */}
          <div className="bg-white p-7 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Siatka Aktywności (Ostatnie 5 Tygodni)</h3>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">Wizualna mapa intensywności odhaczania nawyków</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                <span>Mniej</span>
                <div className="w-3 h-3 rounded-sm bg-zinc-100 border border-zinc-200" />
                <div className="w-3 h-3 rounded-sm bg-emerald-200" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                <div className="w-3 h-3 rounded-sm bg-emerald-600" />
                <span>Więcej</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {heatmapDays.map((day) => {
                let bgClass = "bg-zinc-100 text-zinc-400 border border-zinc-200/60";
                if (day.rate >= 0.9) bgClass = "bg-emerald-600 text-white font-bold";
                else if (day.rate >= 0.6) bgClass = "bg-emerald-400 text-emerald-950 font-bold";
                else if (day.rate > 0) bgClass = "bg-emerald-200 text-emerald-900 font-semibold";

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => {
                      setSelectedDate(day.dateStr);
                      setActiveTab('today');
                    }}
                    className={cn(
                      "p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105",
                      bgClass
                    )}
                    title={`${day.dateStr}: ${day.completed} ukończonych nawyków (${Math.round(day.rate * 100)}%)`}
                  >
                    <span className="text-[10px] uppercase opacity-70">{day.monthName}</span>
                    <span className="text-sm font-black">{day.dayNum}</span>
                    <span className="text-[9px] mt-0.5 opacity-90">{Math.round(day.rate * 100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TIMER SKUPIENIA & POMODORO (DEEP WORK)                             */}
      {/* ========================================================================= */}
      {activeTab === 'focus' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-zinc-950 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-zinc-800 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                  Strefa Głębokiej Koncentracji
                </span>
                <h3 className="text-2xl font-bold text-white mt-3">Timer Skupienia & Medytacji</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Włącz stan flow, wykonaj nawyk czytania, medytacji lub sesję Deep Work bez powiadomień.
                </p>
              </div>

              {/* Mode Presets */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => selectTimerPreset('pomodoro', 25 * 60)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    timerMode === 'pomodoro' ? "bg-amber-400 text-zinc-950 font-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  )}
                >
                  🍅 Pomodoro (25 min)
                </button>
                <button
                  onClick={() => selectTimerPreset('deep', 50 * 60)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    timerMode === 'deep' ? "bg-blue-400 text-zinc-950 font-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  )}
                >
                  🧠 Deep Work (50 min)
                </button>
                <button
                  onClick={() => selectTimerPreset('meditation', 10 * 60)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    timerMode === 'meditation' ? "bg-emerald-400 text-zinc-950 font-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  )}
                >
                  🧘‍♀️ Medytacja (10 min)
                </button>
                <button
                  onClick={() => selectTimerPreset('box_breath', 5 * 60)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    timerMode === 'box_breath' ? "bg-purple-400 text-zinc-950 font-black shadow-md" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  )}
                >
                  🌬️ Oddech (5 min)
                </button>
              </div>

              {/* Large Digital Clock Display */}
              <div className="my-6">
                <div className="text-7xl md:text-8xl font-black font-mono tracking-tight text-white drop-shadow-md">
                  {formatTimer(timerLeft)}
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">
                  {isTimerRunning ? '🔥 Trwa pełne skupienie' : 'Gotowy do startu'}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={cn(
                    "px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-xl",
                    isTimerRunning
                      ? "bg-zinc-800 text-white hover:bg-zinc-700"
                      : "bg-white text-zinc-950 hover:bg-zinc-100 hover:scale-105"
                  )}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  {isTimerRunning ? 'Wstrzymaj' : 'Rozpocznij Sesję'}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerLeft(timerDuration);
                  }}
                  className="p-4 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-2xl transition-all"
                  title="Zresetuj czas"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT HABIT                                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-zinc-200 max-w-lg w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-xl">
                    {formIcon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {editingHabitId ? 'Edytuj Nawyk' : 'Nowy Nawyk'}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">Zdefiniuj parametry i porę realizacji</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 block">
                    Nazwa nawyku *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Szklanka wody z cytryną rano"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 block">
                      Kategoria
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 outline-none focus:border-zinc-400"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 block">
                      Pora Dnia
                    </label>
                    <select
                      value={formTimeOfDay}
                      onChange={(e) => setFormTimeOfDay(e.target.value as any)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 outline-none focus:border-zinc-400"
                    >
                      {timesOfDay.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 block">
                    Ikona
                  </label>
                  <div className="flex gap-2 flex-wrap bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
                    {iconOptions.map((ico) => (
                      <button
                        key={ico}
                        type="button"
                        onClick={() => setFormIcon(ico)}
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all",
                          formIcon === ico
                            ? "bg-zinc-900 text-white shadow-md scale-110"
                            : "bg-white border border-zinc-200 hover:bg-zinc-100"
                        )}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 block">
                    Częstotliwość docelowa
                  </label>
                  <input
                    type="text"
                    placeholder="np. Codziennie (7x/tydz) lub Pn - Pt (5x/tydz)"
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 block">
                    Opis / Notatka motywacyjna (Opcjonalnie)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Wskazówka dlaczego warto lub wyzwalacz (trigger) nawyku..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {editingHabitId ? 'Zapisz Zmiany' : 'Dodaj Nawyk'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
