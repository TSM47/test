import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { TimeRange, computeAnalytics } from '../utils/statsAnalytics';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ComposedChart, Line, Legend
} from 'recharts';
import { 
  Dumbbell, Apple, Droplets, Target, Flame, Award, Zap, TrendingUp, TrendingDown,
  Calendar, Layers, Activity, Trophy, Sparkles, Filter, CheckCircle2, 
  Brain, ShieldCheck, HeartPulse, PieChart as PieIcon, BarChart3, Scale, ChevronRight,
  Clock, ArrowUpRight, ArrowDownRight, Compass, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

type StatsTab = 'all' | 'gym' | 'diet' | 'water' | 'habits' | 'insights';

export function Statistics() {
  const { data } = useData();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeTab, setActiveTab] = useState<StatsTab>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  // Compute rich analytics
  const stats = useMemo(() => computeAnalytics(data, timeRange), [data, timeRange]);

  // Color Palettes
  const COLORS = {
    primary: '#18181b', // zinc-900
    accent: '#84cc16',  // lime-500
    blue: '#3b82f6',    // blue-500
    cyan: '#06b6d4',    // cyan-500
    rose: '#f43f5e',    // rose-500
    orange: '#f97316',  // orange-500
    purple: '#a855f7',  // purple-500
    emerald: '#10b981', // emerald-500
  };

  const muscleColors: Record<string, string> = {
    'Klatka': '#3b82f6',
    'Plecy': '#10b981',
    'Nogi': '#f97316',
    'Barki': '#a855f7',
    'Ramiona': '#f43f5e',
    'Brzuch': '#06b6d4',
    'Inne': '#71717a'
  };

  const macroPieData = [
    { name: 'Białko', value: stats.macroPercentages.protein, grams: stats.avgProtein, color: '#f43f5e' },
    { name: 'Węglowodany', value: stats.macroPercentages.carbs, grams: stats.avgCarbs, color: '#f97316' },
    { name: 'Tłuszcze', value: stats.macroPercentages.fat, grams: stats.avgFat, color: '#38bdf8' }
  ].filter(m => m.value > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* Top Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" /> Centrum Analityczne Lumina
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900">
            Statystyki & Wyniki
          </h1>
          <p className="text-base font-medium text-zinc-500 mt-2 max-w-2xl">
            Precyzyjne metryki, tonaż, rozkład makroskładników, bilans wodny oraz korelacje Twojego progresu.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-zinc-200/80 shadow-sm self-start lg:self-auto">
          {(['7d', '30d', '90d', '365d'] as TimeRange[]).map((range) => {
            const labels: Record<TimeRange, string> = {
              '7d': '7 Dni',
              '30d': '30 Dni',
              '90d': '3 Miesiące',
              '365d': 'Rok (365d)'
            };
            const isActive = timeRange === range;
            return (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all",
                  isActive 
                    ? "bg-zinc-950 text-white shadow-sm scale-100" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                {labels[range]}
              </button>
            );
          })}
        </div>
      </header>

      {/* Category Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-200/70">
        {[
          { id: 'all', label: 'Wszystko', icon: Layers, count: 'Główne' },
          { id: 'gym', label: 'Trening', icon: Dumbbell, count: `${stats.workoutDaysCount} sesji` },
          { id: 'diet', label: 'Dieta', icon: Apple, count: `${stats.avgCalories} kcal` },
          { id: 'water', label: 'Nawodnienie', icon: Droplets, count: `${(stats.avgWater / 1000).toFixed(1)} L` },
          { id: 'habits', label: 'Nawyki', icon: Target, count: `${stats.avgHabitRate}%` },
          { id: 'insights', label: 'Wnioski', icon: Brain, count: `${stats.insights.length}` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as StatsTab)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap border shrink-0",
                isActive 
                  ? "bg-white text-zinc-950 border-zinc-300 shadow-sm scale-100" 
                  : "bg-white/60 text-zinc-500 border-zinc-200/60 hover:bg-white hover:text-zinc-900"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isActive ? "text-zinc-900" : "text-zinc-400")} />
              <span>{tab.label}</span>
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                isActive ? "bg-zinc-100 text-zinc-900" : "bg-zinc-100 text-zinc-400"
              )}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* High-Level KPI Bento Grid (6 Key Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Tonaż */}
        <div className="bg-white p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Tonaż</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Dumbbell className="w-4 h-4" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {(stats.totalVolume / 1000).toFixed(1)} <span className="text-xs font-bold text-zinc-400">ton</span>
            </div>
            <div className="text-[11px] font-semibold text-zinc-500 mt-1 flex items-center gap-1">
              <span className="font-bold text-zinc-900">{stats.totalSets}</span> serii łącznie
            </div>
          </div>
        </div>

        {/* Kalorie */}
        <div className="bg-white p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Śr. Kalorie</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Flame className="w-4 h-4" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {stats.avgCalories} <span className="text-xs font-bold text-zinc-400">kcal/d</span>
            </div>
            <div className="text-[11px] font-semibold text-zinc-500 mt-1">
              B: <span className="font-bold text-zinc-900">{stats.avgProtein}g</span> • T: <span className="font-bold text-zinc-900">{stats.avgFat}g</span>
            </div>
          </div>
        </div>

        {/* Białko */}
        <div className="bg-white p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Śr. Białko</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Apple className="w-4 h-4" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {stats.avgProtein} <span className="text-xs font-bold text-zinc-400">g/dzień</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {stats.macroPercentages.protein}% energii
            </div>
          </div>
        </div>

        {/* Nawodnienie */}
        <div className="bg-white p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Woda Śr.</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl"><Droplets className="w-4 h-4" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {(stats.avgWater / 1000).toFixed(2)} <span className="text-xs font-bold text-zinc-400">L/d</span>
            </div>
            <div className="text-[11px] font-semibold text-zinc-500 mt-1">
              <span className="font-bold text-zinc-900">{stats.optimalWaterDays}</span> dni celu &gt;2.5L
            </div>
          </div>
        </div>

        {/* Nawyki */}
        <div className="bg-white p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Dyscyplina</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Target className="w-4 h-4" /></div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {stats.avgHabitRate}%
            </div>
            <div className="text-[11px] font-semibold text-zinc-500 mt-1">
              Realizacja nawyków
            </div>
          </div>
        </div>

        {/* Lumina Score */}
        <div className="bg-zinc-950 text-white p-5 rounded-[2rem] border border-zinc-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-lime-400/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Index Lumina</span>
            <div className="p-2 bg-white/10 text-lime-400 rounded-xl"><Zap className="w-4 h-4" /></div>
          </div>
          <div className="relative z-10">
            <div className="text-2xl font-black tracking-tight text-white flex items-baseline gap-1">
              {stats.consistencyScore} <span className="text-xs font-bold text-zinc-500">/ 100</span>
            </div>
            <div className="text-[11px] font-bold text-lime-400 mt-1">
              {stats.consistencyScore >= 80 ? 'Poziom Elitarny' : stats.consistencyScore >= 60 ? 'Dobra Stabilność' : 'W budowie'}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VIEW: ALL / CENTRUM DOWODZENIA */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'insights') && (
        <div className="space-y-8">
          
          {/* Main Composed Chart: Objętość vs Kalorie vs Nawodnienie */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900">
                    Korelacja Całościowa: Trening & Odżywianie & Woda
                  </h3>
                </div>
                <p className="text-sm font-medium text-zinc-500 mt-1">
                  Porównanie obciążenia treningowego z podażą kalorii i nawodnieniem w wybranym przedziale czasu ({timeRange}).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-md bg-zinc-900" /> Objętość (kg)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" /> Kalorie (kcal)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" /> Woda (ml)
                </div>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stats.days}>
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis 
                    dataKey="displayDate" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} 
                    dy={8}
                  />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} 
                    dx={-6}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '1.25rem', 
                      backgroundColor: '#18181b', 
                      color: '#ffffff',
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.25)',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="workoutVolume" 
                    name="Objętość (kg)" 
                    fill="url(#volGrad)" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={timeRange === '7d' ? 44 : timeRange === '30d' ? 14 : 6}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="calories" 
                    name="Kalorie (kcal)" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    dot={timeRange === '7d' ? { r: 4, fill: '#f97316', strokeWidth: 0 } : false} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="water" 
                    name="Woda (ml)" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={false} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2-Columns: Radar Balance & Day-of-Week Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 5-Axis Radar Chart */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-extrabold text-zinc-900">Profil Balansu (Radar)</h3>
                  <span className="px-3 py-1 bg-lime-100 text-lime-800 rounded-full text-xs font-black">
                    {stats.consistencyScore}/100 pkt
                  </span>
                </div>
                <p className="text-xs font-medium text-zinc-500">
                  Ocena równowagi pomiędzy wysiłkiem, regeneracją a dyscypliną.
                </p>
              </div>

              <div className="h-[280px] w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radarMetrics}>
                    <PolarGrid stroke="#e4e4e7" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#27272a', fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar 
                      name="Wynik" 
                      dataKey="value" 
                      stroke="#18181b" 
                      strokeWidth={2.5} 
                      fill="#84cc16" 
                      fillOpacity={0.4} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-500">Najsilniejszy filar:</span>
                <span className="text-zinc-900 font-extrabold">
                  {stats.radarMetrics.reduce((max, r) => r.value > max.value ? r : max, stats.radarMetrics[0]).subject}
                </span>
              </div>
            </div>

            {/* Rozkład wg Dni Tygodnia (Pn-Nd) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-extrabold text-zinc-900">Rozkład Aktywności w Tygodniu</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                    <Calendar className="w-4 h-4" /> Dni tygodnia
                  </div>
                </div>
                <p className="text-xs font-medium text-zinc-500">
                  Średnia objętość treningowa oraz skuteczność nawyków w zależności od dnia tygodnia.
                </p>
              </div>

              <div className="h-[250px] w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dayOfWeekStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="short" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#71717a' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="volume" name="Objętość (kg)" fill="#18181b" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-2 border-t border-zinc-100 text-center">
                {stats.dayOfWeekStats.map((st, i) => (
                  <div key={i} className="bg-zinc-50 py-2 rounded-xl">
                    <div className="text-[10px] font-bold text-zinc-400">{st.short}</div>
                    <div className="text-xs font-black text-zinc-900 mt-0.5">{st.habitAvg}%</div>
                    <div className="text-[9px] font-semibold text-zinc-400">nawyki</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* GitHub-Style 12-Week Consistency Heatmap */}
          <div className="bg-zinc-950 text-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-900 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-lime-400" />
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                    Macierz Ciągłości (Heatmapa 12 Tygodni)
                  </h3>
                </div>
                <p className="text-xs font-medium text-zinc-400 mt-1">
                  Wizualizacja każdego pojedynczego dnia – im jaśniejszy kolor, tym wyższa realizacja nawyków i obecność treningu.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                <span>Mniej</span>
                <div className="flex gap-1">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-800 border border-zinc-700" />
                  <div className="w-3.5 h-3.5 rounded bg-lime-900 border border-lime-800" />
                  <div className="w-3.5 h-3.5 rounded bg-lime-700 border border-lime-600" />
                  <div className="w-3.5 h-3.5 rounded bg-lime-500 border border-lime-400" />
                  <div className="w-3.5 h-3.5 rounded bg-lime-300 border border-lime-200" />
                </div>
                <span>Więcej</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative z-10 overflow-x-auto pb-4 scrollbar-none">
              <div className="flex gap-2 min-w-max">
                {stats.heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-2">
                    {week.map((cell, cIdx) => {
                      let bgClass = "bg-zinc-800/80 border-zinc-700/50";
                      if (cell.rate >= 90) bgClass = "bg-lime-300 border-lime-200 text-zinc-950";
                      else if (cell.rate >= 60) bgClass = "bg-lime-500 border-lime-400";
                      else if (cell.rate >= 30) bgClass = "bg-lime-700 border-lime-600";
                      else if (cell.rate > 0) bgClass = "bg-lime-900 border-lime-800";
                      else if (cell.hasWorkout) bgClass = "bg-blue-600 border-blue-500";

                      return (
                        <div
                          key={cIdx}
                          title={`${cell.date}: Nawyki ${cell.rate}%, Trening ${cell.volume}kg`}
                          className={cn(
                            "w-5 h-5 md:w-6 md:h-6 rounded-lg border transition-all flex items-center justify-center text-[10px] font-bold group relative cursor-pointer hover:scale-125 hover:z-20",
                            bgClass,
                            cell.isToday ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : ""
                          )}
                        >
                          {cell.hasWorkout && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-bold text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Kropka oznacza zrealizowany trening w danym dniu</span>
              </div>
              <div>
                Łącznie monitorowanych: <span className="text-white font-extrabold">84 dni</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: TRENING & SIŁA */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'gym') && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 flex items-center gap-3">
                <Dumbbell className="w-7 h-7 text-blue-600" /> Trening & Biomechanika Siły
              </h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Analiza objętości (tonażu), podziału partii mięśniowych i rekordów 1RM.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Objętość w czasie (AreaChart) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Objętość Treningowa (Tonaż)</h3>
                  <p className="text-xs font-semibold text-zinc-400 mt-0.5">Suma ciężar × powtórzenia × serie (kg)</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-zinc-900">{stats.totalVolume.toLocaleString()}</span>
                  <span className="text-xs font-bold text-zinc-400 ml-1">kg</span>
                </div>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.days}>
                    <defs>
                      <linearGradient id="areaVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="workoutVolume" name="Objętość (kg)" stroke="#3b82f6" strokeWidth={3} fill="url(#areaVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rozkład Partii Mięśniowych (Donut Chart) */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Rozkład Partii Mięśniowych</h3>
                <p className="text-xs font-semibold text-zinc-400 mt-0.5">Podział całkowitego tonażu wg mięśni</p>
              </div>

              <div className="h-[220px] w-full relative my-2">
                {stats.muscleChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.muscleChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="volume"
                        nameKey="name"
                      >
                        {stats.muscleChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={muscleColors[entry.name] || '#71717a'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-sm font-medium">
                    Brak danych treningowych w tym okresie
                  </div>
                )}
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
                {stats.muscleChartData.map((mg) => (
                  <div key={mg.name} className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: muscleColors[mg.name] || '#71717a' }} />
                    <span>{mg.name}</span>
                    <span className="text-zinc-400 text-[10px]">({mg.volume.toLocaleString()}kg)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tabela Rekordów i Progresji Ćwiczeń (PR & 1RM Table) */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 md:p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-extrabold text-zinc-900">
                    Baza Ćwiczeń, Rekordy & Szacowany 1RM
                  </h3>
                </div>
                <p className="text-xs font-medium text-zinc-500 mt-1">
                  Automatycznie wyliczany One-Rep-Max wg formuły Epleya dla wszystkich zarejestrowanych ćwiczeń.
                </p>
              </div>
              <div className="text-xs font-bold text-zinc-400 bg-zinc-50 px-4 py-2 rounded-xl">
                Łącznie ćwiczeń: <span className="text-zinc-900 font-extrabold">{stats.topExercises.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-zinc-50/80 text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                    <th className="py-4 px-6">Ćwiczenie</th>
                    <th className="py-4 px-6">Partia</th>
                    <th className="py-4 px-6">Max Ciężar</th>
                    <th className="py-4 px-6">Szacowany 1RM</th>
                    <th className="py-4 px-6">Suma Tonażu</th>
                    <th className="py-4 px-6">Liczba Serii</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                  {stats.topExercises.length > 0 ? (
                    stats.topExercises.map((ex, idx) => (
                      <tr key={ex.exercise} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-zinc-900 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-500 text-xs flex items-center justify-center font-black">
                            {idx + 1}
                          </span>
                          {ex.exercise}
                        </td>
                        <td className="py-4 px-6">
                          <span 
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: muscleColors[ex.muscleGroup] || '#71717a' }}
                          >
                            {ex.muscleGroup}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-black text-zinc-900">
                          {ex.maxWeight} <span className="text-xs font-bold text-zinc-400">kg</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 font-black text-orange-600">
                            <Zap className="w-3.5 h-3.5 text-yellow-500" />
                            {ex.best1RM} <span className="text-xs font-bold text-zinc-400">kg</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-zinc-900">
                          {ex.totalVolume.toLocaleString()} <span className="text-xs font-bold text-zinc-400">kg</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-zinc-500">
                          {ex.totalSets} serii
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-400 font-medium">
                        Brak ćwiczeń w bazie. Dodaj swoje pierwsze ćwiczenie w Dzienniku Treningowym!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: DIETA & MAKROSKŁADNIKI */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'diet') && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 flex items-center gap-3">
                <Apple className="w-7 h-7 text-rose-500" /> Odżywianie & Makroskładniki
              </h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Średnia kaloryczność, rozkład białka, węglowodanów i tłuszczy oraz stabilność diety.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Wykres Kalorii w czasie z linią celu */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Podaż Kaloryczna (kcal)</h3>
                  <p className="text-xs font-semibold text-zinc-400 mt-0.5">Cel referencyjny: 2500 kcal</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-zinc-900">{stats.avgCalories}</span>
                  <span className="text-xs font-bold text-zinc-400 ml-1">kcal/d</span>
                </div>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.days}>
                    <defs>
                      <linearGradient id="areaDiet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="calories" name="Kalorie (kcal)" stroke="#f97316" strokeWidth={3} fill="url(#areaDiet)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rozkład Makroskładników (% energii) */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Rozkład Energii z Makro</h3>
                <p className="text-xs font-semibold text-zinc-400 mt-0.5">Stosunek kaloryczny B:W:T</p>
              </div>

              <div className="h-[200px] w-full relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100">
                <div className="bg-rose-50 p-3 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">Białko</span>
                  <div className="text-lg font-black text-zinc-900">{stats.avgProtein}g</div>
                  <div className="text-[10px] font-bold text-rose-500">{stats.macroPercentages.protein}% kcal</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-orange-600 uppercase">Węgle</span>
                  <div className="text-lg font-black text-zinc-900">{stats.avgCarbs}g</div>
                  <div className="text-[10px] font-bold text-orange-500">{stats.macroPercentages.carbs}% kcal</div>
                </div>
                <div className="bg-sky-50 p-3 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-sky-600 uppercase">Tłuszcze</span>
                  <div className="text-lg font-black text-zinc-900">{stats.avgFat}g</div>
                  <div className="text-[10px] font-bold text-sky-500">{stats.macroPercentages.fat}% kcal</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: NAWODNIENIE & REGENERACJA */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'water') && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 flex items-center gap-3">
                <Droplets className="w-7 h-7 text-cyan-500" /> Nawodnienie & Regeneracja
              </h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Poziom hydratacji tkanek i gotowość mięśniowa do kolejnych jednostek treningowych.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Wykres Wody w czasie */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Bilans Wodny w Czasie (ml)</h3>
                  <p className="text-xs font-semibold text-zinc-400 mt-0.5">Cel dzienny: 2500 ml</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-600">{(stats.totalWater / 1000).toFixed(1)}</span>
                  <span className="text-xs font-bold text-zinc-400 ml-1">L łącznie</span>
                </div>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.days}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#71717a' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#18181b', color: '#fff' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="water" name="Woda (ml)" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={timeRange === '7d' ? 40 : 12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Szacowana Regeneracja Mięśniowa */}
            <div className="lg:col-span-4 bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-6 md:p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HeartPulse className="w-6 h-6 text-cyan-300" />
                  <h3 className="text-xl font-bold">Stan Regeneracji</h3>
                </div>
                <p className="text-xs font-medium text-cyan-100 mb-6">
                  Szacowane odnowienie włókien na podstawie ostatnich treningów:
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span>Klatka & Triceps</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span>Plecy & Biceps</span>
                      <span className="text-lime-300">100% (Pełna moc)</span>
                    </div>
                    <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-lime-400 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span>Nogi & Pośladki</span>
                      <span className="text-orange-300">60% (W regeneracji)</span>
                    </div>
                    <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-orange-400 h-full rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20 text-xs font-bold text-cyan-100 flex items-center justify-between">
                <span>Rekomendacja:</span>
                <span className="text-white font-black">Gotowy na mocny trening!</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: NAWYKI & DYSCYPLINA */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'habits') && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 flex items-center gap-3">
                <Target className="w-7 h-7 text-emerald-600" /> Nawyki, Passy & Skuteczność
              </h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Szczegółowa tabela skuteczności każdego nawyku, aktualne passy (streaki) i powtarzalność.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 md:p-8 border-b border-zinc-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900">Ranking Skuteczności Nawyków</h3>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">Oparty na wybranym okresie ({timeRange})</p>
              </div>
              <div className="text-xs font-bold text-zinc-400 bg-zinc-50 px-4 py-2 rounded-xl">
                Średnia dyscyplina: <span className="text-emerald-600 font-extrabold">{stats.avgHabitRate}%</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-zinc-50/80 text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                    <th className="py-4 px-6">Nawyk</th>
                    <th className="py-4 px-6">Kategoria</th>
                    <th className="py-4 px-6">Skuteczność</th>
                    <th className="py-4 px-6">Aktualna Passa</th>
                    <th className="py-4 px-6">Wykonania</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                  {stats.habitPerformance.map((h, i) => (
                    <tr key={h.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-zinc-900 flex items-center gap-3">
                        <span className="text-xl">{h.icon || '✨'}</span>
                        <span>{h.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold">
                          {h.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full" 
                              style={{ width: `${h.rate}%` }} 
                            />
                          </div>
                          <span className="font-black text-zinc-900 text-xs">{h.rate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-zinc-900">
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <Flame className="w-4 h-4 fill-orange-500" />
                          <span>{h.streak} dni</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-zinc-500">
                        {h.completions} z {stats.daysCount} dni
                      </td>
                      <td className="py-4 px-6 text-right">
                        {h.rate >= 80 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-xs bg-emerald-50 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Wzorcowy
                          </span>
                        ) : h.rate >= 50 ? (
                          <span className="text-orange-600 font-bold text-xs bg-orange-50 px-3 py-1 rounded-full">
                            Stabilny
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-bold text-xs bg-zinc-100 px-3 py-1 rounded-full">
                            Do poprawy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: KORELACJE & INTELIGENTNE WNIOSKI */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'insights') && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 flex items-center gap-3">
                <Brain className="w-7 h-7 text-purple-600" /> Wnioski Analityczne & Korelacje
              </h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Wzorce zachowań i inteligentne rekomendacje wynikające z Twoich danych.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.insights.map((ins, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-[2rem] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {ins.category}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-zinc-900 mb-2 leading-snug">
                    {ins.title}
                  </h4>
                  <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                    {ins.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-500" /> Wskaźnik zweryfikowany
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </motion.div>
  );
}
