import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { format, subDays, isSameDay } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Line } from 'recharts';
import { Flame, Dumbbell, Target, Activity, Droplet, Award, Zap, TrendingUp, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const { data } = useData();

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Last 7 days data aggregation
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      
      const dayFood = data.food.filter(f => f.date === dateStr);
      const calories = dayFood.reduce((sum, item) => sum + item.calories, 0);
      
      const dayWorkouts = data.workouts.filter(w => w.date === dateStr);
      const workoutVolume = dayWorkouts.reduce((sum, w) => sum + (w.sets * w.reps * w.weight), 0);
      
      const dayWater = data.waterLogs.find(w => w.date === dateStr);
      const waterAmount = dayWater ? dayWater.amount : 0;

      const activeHabits = data.habits.length;
      const completedHabits = data.habitLogs.filter(l => l.date === dateStr && l.completed).length;
      const habitScore = activeHabits > 0 ? (completedHabits / activeHabits) * 100 : 0;

      return {
        name: format(d, 'EEE'),
        calories,
        volume: workoutVolume,
        water: waterAmount,
        habitScore,
        date: dateStr
      };
    });
  }, [data]);

  // Today's Macros
  const todayFood = data.food.filter(f => f.date === todayStr);
  const totalProtein = todayFood.reduce((s, i) => s + i.protein, 0);
  const totalCarbs = todayFood.reduce((s, i) => s + i.carbs, 0);
  const totalFat = todayFood.reduce((s, i) => s + i.fat, 0);

  const macroData = [
    { name: 'Białko', value: totalProtein, color: '#f43f5e' }, // rose-500
    { name: 'Węgle', value: totalCarbs, color: '#fb923c' },   // orange-400
    { name: 'Tłuszcze', value: totalFat, color: '#38bdf8' }, // sky-400
  ].filter(m => m.value > 0);

  // General Stats
  const totalWorkouts7Days = useMemo(() => {
    const dates = new Set(data.workouts
      .filter(w => new Date(w.date) >= subDays(new Date(), 7))
      .map(w => w.date)
    );
    return dates.size;
  }, [data.workouts]);

  const bestStreak = useMemo(() => {
    if (data.habits.length === 0) return 0;
    // Just a mock max streak based on existing logs for UI demo
    return data.habitLogs.length > 0 ? 12 : 0;
  }, [data]);

  // Radar Chart - "Balance"
  const balanceData = useMemo(() => {
    // 0-100 scores
    const diet = totalProtein > 0 || totalCarbs > 0 ? 85 : 20; // simplified
    const training = totalWorkouts7Days > 0 ? Math.min((totalWorkouts7Days / 4) * 100, 100) : 10;
    
    const todayWater = data.waterLogs.find(w => w.date === todayStr)?.amount || 0;
    const water = Math.min((todayWater / 2500) * 100, 100);

    const habitsTotal = data.habits.length;
    const habitsCompleted = data.habitLogs.filter(l => l.date === todayStr && l.completed).length;
    const habits = habitsTotal > 0 ? (habitsCompleted / habitsTotal) * 100 : 0;

    return [
      { subject: 'Trening', A: training, fullMark: 100 },
      { subject: 'Dieta', A: diet, fullMark: 100 },
      { subject: 'Nawodnienie', A: water || 15, fullMark: 100 },
      { subject: 'Nawyki', A: habits || 10, fullMark: 100 },
      { subject: 'Regeneracja', A: 75, fullMark: 100 }, // Mock static
    ];
  }, [totalProtein, totalCarbs, totalWorkouts7Days, data, todayStr]);

  const luminaScore = Math.round(balanceData.reduce((acc, curr) => acc + curr.A, 0) / 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col gap-6 max-w-7xl mx-auto"
    >
      <header className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
            Wyniki
          </h1>
          <p className="text-zinc-500 font-medium mt-2 text-lg">
            Kompleksowa analiza Twojego stylu życia
          </p>
        </div>
      </header>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-zinc-950 text-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Lumina Score</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-black tracking-tight">{luminaScore}</span>
              <span className="text-xl font-bold text-zinc-500">/ 100</span>
            </div>
            <p className="text-sm font-medium text-zinc-400 max-w-[200px]">Twój ogólny wskaźnik zdrowia i aktywności na dziś.</p>
          </div>
          <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center rotate-3">
             <Zap className={cn("w-12 h-12 md:w-16 md:h-16", luminaScore > 70 ? "text-yellow-400" : "text-zinc-500")} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 flex flex-col justify-between">
          <div className="bg-orange-100 p-3 rounded-2xl w-max mb-4">
            <Dumbbell className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Treningi</p>
            <h3 className="text-3xl font-black text-zinc-900">{totalWorkouts7Days}</h3>
            <p className="text-xs font-bold text-orange-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> W ostatnich 7 dniach</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 flex flex-col justify-between">
          <div className="bg-purple-100 p-3 rounded-2xl w-max mb-4">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Top Passa</p>
            <h3 className="text-3xl font-black text-zinc-900">{bestStreak} <span className="text-lg text-zinc-400">dni</span></h3>
            <p className="text-xs font-bold text-zinc-400 mt-2">Utrzymanych nawyków</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart (Balance) */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 lg:col-span-1 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-zinc-900 text-lg">Balans formy</h3>
            <p className="text-sm font-medium text-zinc-500">Twój 5-wymiarowy profil</p>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={balanceData}>
                <PolarGrid stroke="#e4e4e7" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Wynik" dataKey="A" stroke="#18181b" strokeWidth={2} fill="#18181b" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Combined Chart (Volume + Calories) */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-zinc-900 text-lg">Objętość vs Odżywianie</h3>
              <p className="text-sm font-medium text-zinc-500">Korelacja wysiłku do spożycia (7 dni)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-zinc-900"></div> Objętość (kg)</div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-400"></div> Kalorie (kcal)</div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#a1a1aa' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#a1a1aa' }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                <Tooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar yAxisId="left" dataKey="volume" name="Objętość" fill="#18181b" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="calories" name="Kalorie" stroke="#fb923c" strokeWidth={3} dot={{ r: 4, fill: '#fb923c', strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Macros Pie Chart */}
        <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Makroskładniki</h3>
            <p className="text-zinc-400 font-medium mb-6 text-sm">Rozkład dzisiejszych kalorii w diecie</p>
            
            <div className="space-y-4">
              {macroData.map((macro, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="font-bold text-sm">{macro.name}</span>
                  </div>
                  <span className="font-black text-lg">{macro.value}g</span>
                </div>
              ))}
              {macroData.length === 0 && (
                <div className="text-zinc-500 font-medium py-6 text-center border border-dashed border-white/10 rounded-2xl text-sm">
                  Brak wpisów z dzisiaj
                </div>
              )}
            </div>
          </div>
          
          <div className="h-[200px] w-[200px] relative">
            {macroData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#27272a', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-600">
                <Target className="w-8 h-8 opacity-20" />
              </div>
            )}
          </div>
        </div>

        {/* Water / Habits mini area charts */}
        <div className="grid grid-rows-2 gap-6">
          <div className="bg-blue-500/10 p-6 rounded-[2rem] border border-blue-500/20 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-10">
               <Droplet className="w-48 h-48 text-blue-600" />
             </div>
             <div className="relative z-10 flex justify-between items-start mb-4">
               <div>
                 <h3 className="font-bold text-blue-900 text-lg">Nawodnienie</h3>
                 <p className="text-sm font-semibold text-blue-600/80">Ostatnie 7 dni (ml)</p>
               </div>
               <div className="p-2 bg-blue-500/20 rounded-xl text-blue-600">
                 <Droplet className="w-5 h-5" />
               </div>
             </div>
             <div className="h-[80px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #bfdbfe', backgroundColor: '#fff', color: '#1e3a8a' }}
                  />
                  <Area type="monotone" dataKey="water" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-500/20 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-10">
               <CalendarDays className="w-48 h-48 text-emerald-600" />
             </div>
             <div className="relative z-10 flex justify-between items-start mb-4">
               <div>
                 <h3 className="font-bold text-emerald-900 text-lg">Skuteczność Nawyków</h3>
                 <p className="text-sm font-semibold text-emerald-600/80">Ostatnie 7 dni (%)</p>
               </div>
               <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-600">
                 <Activity className="w-5 h-5" />
               </div>
             </div>
             <div className="h-[80px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days}>
                  <defs>
                    <linearGradient id="colorHabit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #a7f3d0', backgroundColor: '#fff', color: '#064e3b' }}
                  />
                  <Area type="monotone" dataKey="habitScore" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorHabit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
