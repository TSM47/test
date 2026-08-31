import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { format, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Activity, Dumbbell, Flame, Check, Target, Zap, Droplets, Trophy, 
  TrendingUp, ChevronRight, Apple, Plus, Sparkles, ArrowRight,
  Clock, CheckCircle2, Circle, Utensils, BarChart3, AlertCircle,
  Calendar, RotateCcw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { TabType, FoodEntry, WorkoutEntry } from '../types';

interface OverviewProps {
  key?: string;
  onNavigate?: (tab: TabType) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { data, toggleHabit, addWater, addFood, addWorkout } = useData();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFormatted = format(new Date(), 'EEEE, d MMMM', { locale: pl });
  
  // State for Quick Modals
  const [showQuickFoodModal, setShowQuickFoodModal] = useState(false);
  const [showQuickWorkoutModal, setShowQuickWorkoutModal] = useState(false);
  const [chartMetric, setChartMetric] = useState<'calories' | 'volume' | 'water'>('calories');

  // Quick Food Form State
  const [quickFood, setQuickFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'Przekąska' as FoodEntry['mealType']
  });

  // Quick Workout Form State
  const [quickWorkout, setQuickWorkout] = useState({
    exercise: '',
    muscleGroup: 'Klatka' as WorkoutEntry['muscleGroup'],
    sets: '3',
    reps: '10',
    weight: '50'
  });

  // Today calculations
  const todayFood = useMemo(() => data.food.filter(f => f.date === today), [data.food, today]);
  const totalCalories = useMemo(() => todayFood.reduce((sum, item) => sum + item.calories, 0), [todayFood]);
  const totalProtein = useMemo(() => todayFood.reduce((sum, item) => sum + item.protein, 0), [todayFood]);
  const totalCarbs = useMemo(() => todayFood.reduce((sum, item) => sum + item.carbs, 0), [todayFood]);
  const totalFat = useMemo(() => todayFood.reduce((sum, item) => sum + item.fat, 0), [todayFood]);

  const todayWater = useMemo(() => {
    return data.waterLogs
      .filter(w => w.date === today)
      .reduce((sum, w) => sum + w.amount, 0);
  }, [data.waterLogs, today]);

  const todayWorkouts = useMemo(() => data.workouts.filter(w => w.date === today), [data.workouts, today]);
  const todayVolume = useMemo(() => {
    return todayWorkouts.reduce((sum, w) => sum + (w.sets * w.reps * w.weight), 0);
  }, [todayWorkouts]);
  const todaySets = useMemo(() => todayWorkouts.reduce((sum, w) => sum + w.sets, 0), [todayWorkouts]);

  const activeHabits = data.habits;
  const todayHabitLogs = useMemo(() => data.habitLogs.filter(l => l.date === today && l.completed), [data.habitLogs, today]);
  const completedHabitsCount = todayHabitLogs.length;
  const habitRate = activeHabits.length > 0 ? Math.round((completedHabitsCount / activeHabits.length) * 100) : 0;

  // Targets
  const CALORIES_TARGET = 2500;
  const PROTEIN_TARGET = 160;
  const CARBS_TARGET = 280;
  const FAT_TARGET = 70;
  const WATER_TARGET = 2500;

  const caloriesRemaining = Math.max(0, CALORIES_TARGET - totalCalories);
  const caloriesPercent = Math.min(100, Math.round((totalCalories / CALORIES_TARGET) * 100));

  // 7-day multi-metric chart data
  const weeklyTrendData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayName = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'][d.getDay()];

      const dayFood = data.food.filter(f => f.date === dateStr);
      const dayCals = dayFood.reduce((s, item) => s + item.calories, 0);

      const dayWorkouts = data.workouts.filter(w => w.date === dateStr);
      const dayVol = dayWorkouts.reduce((s, item) => s + (item.sets * item.reps * item.weight), 0);

      const dayWater = data.waterLogs.filter(w => w.date === dateStr).reduce((s, item) => s + item.amount, 0);

      return {
        day: dayName,
        date: dateStr,
        calories: dayCals,
        volume: dayVol,
        water: dayWater
      };
    });
  }, [data.food, data.workouts, data.waterLogs]);

  // Handle Quick Food Submit
  const handleQuickFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFood.name.trim()) return;

    addFood({
      date: today,
      name: quickFood.name.trim(),
      calories: parseInt(quickFood.calories) || 0,
      protein: parseInt(quickFood.protein) || 0,
      carbs: parseInt(quickFood.carbs) || 0,
      fat: parseInt(quickFood.fat) || 0,
      mealType: quickFood.mealType
    });

    setQuickFood({ name: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'Przekąska' });
    setShowQuickFoodModal(false);
  };

  // Handle Quick Workout Submit
  const handleQuickWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickWorkout.exercise.trim()) return;

    addWorkout({
      date: today,
      exercise: quickWorkout.exercise.trim(),
      muscleGroup: quickWorkout.muscleGroup,
      sets: parseInt(quickWorkout.sets) || 1,
      reps: parseInt(quickWorkout.reps) || 1,
      weight: parseFloat(quickWorkout.weight) || 0
    });

    setQuickWorkout({ exercise: '', muscleGroup: 'Klatka', sets: '3', reps: '10', weight: '50' });
    setShowQuickWorkoutModal(false);
  };

  // Dynamic Coach Tip
  const coachInsight = useMemo(() => {
    if (totalCalories === 0 && todayWater === 0 && completedHabitsCount === 0) {
      return {
        title: "Rozpocznij dzień z energią!",
        desc: "Wypij pierwszą szklankę wody i oznacz pierwszy poranny nawyk, aby uruchomić swój streak.",
        icon: Sparkles,
        badge: "Start Dnia"
      };
    }
    if (todayWorkouts.length > 0 && todayWater < 1500) {
      return {
        title: "Pamiętaj o hydratacji po treningu!",
        desc: `Świetny trening (${todayVolume.toLocaleString()} kg tonażu). Uzupełnij płyny – Twój bilans to obecnie ${(todayWater/1000).toFixed(1)}L z ${WATER_TARGET/1000}L.`,
        icon: Droplets,
        badge: "Regeneracja"
      };
    }
    if (totalProtein >= PROTEIN_TARGET * 0.8) {
      return {
        title: "Świetna podaż białka!",
        desc: `Osiągnąłeś już ${totalProtein}g białka dzisiaj. Twoje mięśnie mają optymalne warunki do anabolizmu i regeneracji.`,
        icon: Trophy,
        badge: "Makro Mistrz"
      };
    }
    if (habitRate >= 80) {
      return {
        title: "Imponująca dyscyplina!",
        desc: `Zrealizowałeś ${completedHabitsCount} z ${activeHabits.length} nawyków dzisiaj (${habitRate}%). Utrzymaj ten rytm do wieczora!`,
        icon: Zap,
        badge: "Dyscyplina"
      };
    }
    return {
      title: "Plan na resztę dnia",
      desc: `Pozostało Ci ${caloriesRemaining} kcal do zrealizowania zapotrzebowania oraz ${Math.max(0, WATER_TARGET - todayWater)} ml wody.`,
      icon: Activity,
      badge: "Podsumowanie"
    };
  }, [totalCalories, todayWater, completedHabitsCount, todayWorkouts, todayVolume, totalProtein, habitRate, activeHabits.length, caloriesRemaining]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full flex flex-col gap-8 max-w-7xl mx-auto pb-12"
    >
      {/* Top Header & Date Bar */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            <span className="capitalize">{todayFormatted}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900">
            Dzień dobry, Wojowniku! 👋
          </h1>
          <p className="text-zinc-500 font-medium mt-1.5 text-base sm:text-lg">
            Oto Twój panel dowodzenia: stan kalorii, dyscyplina nawyków, woda oraz dzisiejsza aktywność.
          </p>
        </div>

        {/* Quick Nav Shortcut to Statistics */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('stats')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border border-zinc-200/90 shadow-sm text-zinc-900 font-black text-xs sm:text-sm hover:bg-zinc-950 hover:text-white transition-all self-start lg:self-auto group"
          >
            <BarChart3 className="w-4 h-4 text-lime-600 group-hover:text-lime-400 transition-colors" />
            <span>Pełne Centrum Statystyk</span>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          </button>
        )}
      </header>

      {/* ========================================================================= */}
      {/* SZYBKIE AKCJE (QUICK ACTIONS TOOLBAR) */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider text-zinc-900">Szybkie Akcje & Logowanie</span>
          </div>
          <span className="text-[11px] font-bold text-zinc-400">1 kliknięcie</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Quick Water +250ml */}
          <button
            onClick={() => addWater(today, 250)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-cyan-50/80 hover:bg-cyan-100/80 border border-cyan-200/60 text-cyan-900 transition-all text-left group active:scale-95"
          >
            <div className="p-2.5 bg-cyan-500 text-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black">+250 ml Wody</div>
              <div className="text-[10px] font-bold text-cyan-600">Szklanka płynu</div>
            </div>
          </button>

          {/* Quick Water +500ml */}
          <button
            onClick={() => addWater(today, 500)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 text-blue-900 transition-all text-left group active:scale-95"
          >
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black">+500 ml Wody</div>
              <div className="text-[10px] font-bold text-blue-600">Butelka sportowa</div>
            </div>
          </button>

          {/* Quick Food Log Modal Trigger */}
          <button
            onClick={() => setShowQuickFoodModal(true)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/60 text-orange-900 transition-all text-left group active:scale-95"
          >
            <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black">+ Dodaj Posiłek</div>
              <div className="text-[10px] font-bold text-orange-600">Szybkie kalorie</div>
            </div>
          </button>

          {/* Quick Workout Log Modal Trigger */}
          <button
            onClick={() => setShowQuickWorkoutModal(true)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white transition-all text-left group active:scale-95 shadow-sm"
          >
            <div className="p-2.5 bg-lime-400 text-zinc-950 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black">+ Zapisz Serię</div>
              <div className="text-[10px] font-bold text-lime-400">Trening siłowy</div>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BENTO GRID GLÓWNY (BOGATE KAFELKI) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* HERO TILE: Bilans Energetyczny Dnia (Col 12 / md:col 7) */}
        <div className="md:col-span-7 bg-zinc-950 rounded-[2.5rem] p-7 md:p-8 text-white relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900 flex flex-col justify-between">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-lime-400/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <Flame className="w-4 h-4 text-lime-400" />
                <span className="text-xs font-bold tracking-wide uppercase text-lime-400">Bilans Kaloryczny Dnia</span>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                Cel: <strong className="text-white">{CALORIES_TARGET}</strong> kcal
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <div className="text-5xl md:text-6xl font-black tracking-tight text-white">
                  {totalCalories} <span className="text-2xl font-bold text-zinc-500">kcal</span>
                </div>
                <p className="text-zinc-400 text-sm font-medium mt-1">
                  {caloriesRemaining > 0 
                    ? `Pozostało jeszcze ${caloriesRemaining} kcal do osiągnięcia celu dziennego.`
                    : `Cel kaloryczny osiągnięty! (+${Math.abs(caloriesRemaining)} kcal nadwyżki).`
                  }
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-center self-start sm:self-auto">
                <div className="text-xl font-black text-lime-400">{caloriesPercent}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Realizacji</div>
              </div>
            </div>
          </div>

          {/* Progress Bar & Meal Breakdown */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2">
                <span>0 kcal</span>
                <span>{caloriesPercent}% celu</span>
                <span>{CALORIES_TARGET} kcal</span>
              </div>
              <div className="w-full bg-zinc-800/80 rounded-full h-3.5 p-0.5 overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${caloriesPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full shadow-[0_0_12px_rgba(132,204,22,0.6)]"
                />
              </div>
            </div>

            {/* Meal Distribution Mini Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {(['Śniadanie', 'Obiad', 'Kolacja', 'Przekąska'] as const).map((mType) => {
                const mealCals = todayFood
                  .filter(f => f.mealType === mType)
                  .reduce((sum, f) => sum + f.calories, 0);
                return (
                  <div key={mType} className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">{mType}</div>
                    <div className="text-sm font-black text-white mt-0.5">{mealCals} <span className="text-[10px] text-zinc-400 font-normal">kcal</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAKROSKŁADNIKI (Col 12 / md:col 5) */}
        <div className="md:col-span-5 bg-white rounded-[2.5rem] p-7 md:p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Apple className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-zinc-900">Makroskładniki Dziś</h3>
              </div>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('food')}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
                >
                  Dieta <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs font-medium text-zinc-500 mb-6">
              Bieżący podział podaży białka, węglowodanów i tłuszczy.
            </p>

            <div className="space-y-4">
              {/* Białko */}
              <div>
                <div className="flex justify-between items-center text-xs font-black mb-1.5">
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Białko
                  </span>
                  <span className="text-zinc-900">{totalProtein}g <span className="text-zinc-400 font-medium">/ {PROTEIN_TARGET}g</span></span>
                </div>
                <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalProtein / PROTEIN_TARGET) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Węglowodany */}
              <div>
                <div className="flex justify-between items-center text-xs font-black mb-1.5">
                  <span className="text-orange-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Węglowodany
                  </span>
                  <span className="text-zinc-900">{totalCarbs}g <span className="text-zinc-400 font-medium">/ {CARBS_TARGET}g</span></span>
                </div>
                <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalCarbs / CARBS_TARGET) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Tłuszcze */}
              <div>
                <div className="flex justify-between items-center text-xs font-black mb-1.5">
                  <span className="text-sky-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Tłuszcze
                  </span>
                  <span className="text-zinc-900">{totalFat}g <span className="text-zinc-400 font-medium">/ {FAT_TARGET}g</span></span>
                </div>
                <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalFat / FAT_TARGET) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>Stosunek energii:</span>
            <span className="text-zinc-900 font-black">
              {totalCalories > 0 
                ? `${Math.round((totalProtein * 4 / totalCalories) * 100)}% B • ${Math.round((totalCarbs * 4 / totalCalories) * 100)}% W • ${Math.round((totalFat * 9 / totalCalories) * 100)}% T`
                : 'Brak danych'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ŚRODKOWY RZĄD: TRENING DNI & NAWODNIENIE & NAWYKI */}
        {/* ========================================================================= */}

        {/* TRENING DZISIAJ (md:col 4) */}
        <div className="md:col-span-4 bg-white rounded-[2.5rem] p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">Trening Dnia</h3>
                  <p className="text-[11px] font-bold text-zinc-400">Siła & Tonaż</p>
                </div>
              </div>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('gym')}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900"
                >
                  Otwórz <ChevronRight className="w-3.5 h-3.5 inline" />
                </button>
              )}
            </div>

            <div className="my-4">
              <div className="text-3xl font-black text-zinc-900">
                {todayVolume > 0 ? (
                  <>
                    {(todayVolume / 1000).toFixed(2)} <span className="text-sm font-bold text-zinc-400">tony ({todayVolume} kg)</span>
                  </>
                ) : (
                  <span className="text-zinc-400 text-xl font-bold">Brak treningu</span>
                )}
              </div>
              <div className="text-xs font-semibold text-zinc-500 mt-1 flex items-center gap-2">
                <span>{todaySets} wykonanych serii</span>
                <span>•</span>
                <span>{todayWorkouts.length} ćwiczeń</span>
              </div>
            </div>

            {/* List of today's exercises */}
            <div className="space-y-2 mt-4">
              {todayWorkouts.slice(0, 3).map((w, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl text-xs">
                  <span className="font-bold text-zinc-800 truncate max-w-[140px]">{w.exercise}</span>
                  <span className="font-black text-zinc-900">{w.sets}×{w.reps} @ {w.weight}kg</span>
                </div>
              ))}
              {todayWorkouts.length === 0 && (
                <div className="py-4 text-center text-xs font-semibold text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  Dzisiaj jeszcze nie trenowałeś.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowQuickWorkoutModal(true)}
            className="w-full mt-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-lime-400" /> Dodaj serię treningową
          </button>
        </div>

        {/* NAWODNIENIE DZISIAJ (md:col 4) */}
        <div className="md:col-span-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-[2.5rem] p-7 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-white/20 text-white rounded-2xl backdrop-blur-sm">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Nawodnienie</h3>
                  <p className="text-[11px] font-bold text-cyan-100">Bilans płynów</p>
                </div>
              </div>
              <span className="text-xs font-black text-cyan-100 bg-black/20 px-2.5 py-1 rounded-full">
                {Math.round((todayWater / WATER_TARGET) * 100)}%
              </span>
            </div>

            <div className="my-3">
              <div className="text-3xl font-black text-white">
                {(todayWater / 1000).toFixed(2)} <span className="text-lg font-bold text-cyan-100">/ 2.5 L</span>
              </div>
              <p className="text-xs font-medium text-cyan-100 mt-1">
                {todayWater >= WATER_TARGET 
                  ? '🎉 Cel nawodnienia zrealizowany!' 
                  : `Brakuje jeszcze ${WATER_TARGET - todayWater} ml.`}
              </p>
            </div>

            {/* Visual Wave Progress */}
            <div className="w-full bg-black/20 rounded-full h-3 my-4 overflow-hidden p-0.5 border border-white/20">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (todayWater / WATER_TARGET) * 100)}%` }}
                className="bg-white h-full rounded-full shadow-sm"
              />
            </div>
          </div>

          {/* Quick Buttons Inside Water Card */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => addWater(today, 250)}
              className="py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> 250 ml
            </button>
            <button
              onClick={() => addWater(today, 500)}
              className="py-2.5 bg-white text-blue-900 hover:bg-cyan-50 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" /> 500 ml
            </button>
          </div>
        </div>

        {/* NAWYKI I DYSCYPLINA (md:col 4) */}
        <div className="md:col-span-4 bg-white rounded-[2.5rem] p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">Nawyki Dnia</h3>
                  <p className="text-[11px] font-bold text-zinc-400">Interaktywny Check-in</p>
                </div>
              </div>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('habits')}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900"
                >
                  Wszystkie <ChevronRight className="w-3.5 h-3.5 inline" />
                </button>
              )}
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div className="text-3xl font-black text-zinc-900">
                {completedHabitsCount}<span className="text-lg font-bold text-zinc-400">/{activeHabits.length}</span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                {habitRate}% zrobione
              </span>
            </div>

            {/* Interactive Habit List */}
            <div className="space-y-2 mt-2">
              {activeHabits.slice(0, 4).map((h) => {
                const isDone = todayHabitLogs.some(l => l.habitId === h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabit(h.id, today)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all text-left group",
                      isDone 
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-950" 
                        : "bg-zinc-50 border-zinc-200/60 text-zinc-700 hover:bg-zinc-100"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{h.icon || '✨'}</span>
                      <span className={cn("truncate max-w-[150px]", isDone && "line-through text-zinc-500")}>
                        {h.name}
                      </span>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center transition-all",
                      isDone ? "bg-emerald-600 text-white" : "border-2 border-zinc-300 group-hover:border-zinc-500"
                    )}>
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] font-semibold text-zinc-400 text-center mt-3">
            Kliknij nawyk, aby natychmiast go oznaczyć.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* DOLNY RZĄD: 7-DNIOWY WYKRES TRENDÓW & COACH TIP & DZISIEJSZE WPISY */}
        {/* ========================================================================= */}

        {/* 7-DNIOWY WYKRES (md:col 8) */}
        <div className="md:col-span-8 bg-white rounded-[2.5rem] p-7 md:p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-zinc-900" />
                <h3 className="text-lg font-extrabold text-zinc-900">Trend Ostatnich 7 Dni</h3>
              </div>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">
                Przegląd dynamiki Twojej formy w ujęciu tygodniowym.
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setChartMetric('calories')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  chartMetric === 'calories' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Kalorie
              </button>
              <button
                onClick={() => setChartMetric('volume')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  chartMetric === 'volume' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Tonaż (kg)
              </button>
              <button
                onClick={() => setChartMetric('water')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  chartMetric === 'water' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Woda (ml)
              </button>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'calories' ? (
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="areaCalsTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#71717a' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="calories" name="Kalorie (kcal)" stroke="#f97316" strokeWidth={3} fill="url(#areaCalsTrend)" />
                </AreaChart>
              ) : chartMetric === 'volume' ? (
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#71717a' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="volume" name="Objętość (kg)" fill="#18181b" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              ) : (
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#71717a' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="water" name="Woda (ml)" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* COACH MINDSET & DZISIEJSZA AKTYWNOŚĆ (md:col 4) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Smart Coach Insight Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-[2.5rem] p-7 border border-zinc-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <coachInsight.icon className="w-5 h-5 text-lime-400" />
                <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Lumina AI Coach</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 text-[10px] font-black uppercase">
                {coachInsight.badge}
              </span>
            </div>

            <h4 className="text-base font-black text-white mb-1.5 relative z-10">
              {coachInsight.title}
            </h4>
            <p className="text-xs text-zinc-300 font-medium leading-relaxed relative z-10">
              {coachInsight.desc}
            </p>
          </div>

          {/* Dzisiejsza Oś Czasu (Ostatnie wpisy) */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-zinc-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" /> Dziennik Dnia
                </h4>
                <span className="text-[10px] font-bold text-zinc-400">
                  {todayFood.length + todayWorkouts.length} wpisów
                </span>
              </div>

              <div className="space-y-2">
                {todayFood.slice(-2).map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-orange-500 font-black">🥗</span>
                      <span className="font-bold text-zinc-800 truncate max-w-[130px]">{f.name}</span>
                    </div>
                    <span className="font-black text-zinc-900 shrink-0">{f.calories} kcal</span>
                  </div>
                ))}

                {todayWorkouts.slice(-1).map(w => (
                  <div key={w.id} className="flex items-center justify-between p-2.5 bg-blue-50/60 rounded-xl text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-blue-500 font-black">🏋️</span>
                      <span className="font-bold text-zinc-800 truncate max-w-[130px]">{w.exercise}</span>
                    </div>
                    <span className="font-black text-blue-900 shrink-0">{w.sets}×{w.reps}</span>
                  </div>
                ))}

                {todayFood.length === 0 && todayWorkouts.length === 0 && (
                  <div className="py-4 text-center text-xs font-semibold text-zinc-400">
                    Brak dzisiejszych wpisów. Użyj szybkich akcji na górze!
                  </div>
                )}
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('stats')}
                className="w-full mt-3 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                Zobacz wszystkie analizy <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* QUICK FOOD MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showQuickFoodModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900">Szybki Posiłek</h3>
                    <p className="text-xs font-semibold text-zinc-400">Dodaj do dzisiejszego bilansu</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowQuickFoodModal(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuickFoodSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Nazwa posiłku / produktu
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Shake proteinowy z bananem"
                    value={quickFood.name}
                    onChange={(e) => setQuickFood({ ...quickFood, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Kalorie (kcal)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="np. 350"
                      value={quickFood.calories}
                      onChange={(e) => setQuickFood({ ...quickFood, calories: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-bold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Typ posiłku
                    </label>
                    <select
                      value={quickFood.mealType}
                      onChange={(e) => setQuickFood({ ...quickFood, mealType: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-bold text-zinc-900"
                    >
                      <option value="Śniadanie">Śniadanie</option>
                      <option value="Obiad">Obiad</option>
                      <option value="Kolacja">Kolacja</option>
                      <option value="Przekąska">Przekąska</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-rose-600 uppercase mb-1">Białko (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={quickFood.protein}
                      onChange={(e) => setQuickFood({ ...quickFood, protein: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-orange-600 uppercase mb-1">Węgle (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={quickFood.carbs}
                      onChange={(e) => setQuickFood({ ...quickFood, carbs: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-sky-600 uppercase mb-1">Tłuszcz (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={quickFood.fat}
                      onChange={(e) => setQuickFood({ ...quickFood, fat: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowQuickFoodModal(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm shadow-md"
                  >
                    Zapisz posiłek
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* QUICK WORKOUT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showQuickWorkoutModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-zinc-900 text-lime-400 rounded-xl">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900">Zapisz Serię Treningową</h3>
                    <p className="text-xs font-semibold text-zinc-400">Dodaj ćwiczenie do dzisiejszego treningu</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowQuickWorkoutModal(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuickWorkoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Nazwa ćwiczenia
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Wyciskanie sztangi leżąc"
                    value={quickWorkout.exercise}
                    onChange={(e) => setQuickWorkout({ ...quickWorkout, exercise: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Partia mięśniowa
                  </label>
                  <select
                    value={quickWorkout.muscleGroup}
                    onChange={(e) => setQuickWorkout({ ...quickWorkout, muscleGroup: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-bold text-zinc-900"
                  >
                    <option value="Klatka">Klatka</option>
                    <option value="Plecy">Plecy</option>
                    <option value="Nogi">Nogi</option>
                    <option value="Barki">Barki</option>
                    <option value="Ramiona">Ramiona</option>
                    <option value="Brzuch">Brzuch</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Serie</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quickWorkout.sets}
                      onChange={(e) => setQuickWorkout({ ...quickWorkout, sets: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Powtórzenia</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quickWorkout.reps}
                      onChange={(e) => setQuickWorkout({ ...quickWorkout, reps: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Ciężar (kg)</label>
                    <input
                      type="number"
                      required
                      step="0.5"
                      min="0"
                      value={quickWorkout.weight}
                      onChange={(e) => setQuickWorkout({ ...quickWorkout, weight: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-center"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl text-center text-xs font-bold text-zinc-500">
                  Wygenerowany tonaż: <span className="text-zinc-900 font-extrabold">
                    {((parseInt(quickWorkout.sets) || 0) * (parseInt(quickWorkout.reps) || 0) * (parseFloat(quickWorkout.weight) || 0))} kg
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickWorkoutModal(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm shadow-md"
                  >
                    Zapisz serię
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
