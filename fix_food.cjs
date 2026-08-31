const fs = require('fs');

const content = `import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';
import { Plus, Trash2, Apple, ChevronDown, Droplets, Target, Flame, PieChart as PieChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodEntry } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

export function FoodTracker() {
  const { data, addFood, deleteFood, addWater, resetWater } = useData();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<'dziennik' | 'przepisy'>('dziennik');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<FoodEntry['mealType']>('Śniadanie');
  
  const dailyFood = data.food.filter(f => f.date === date);
  const totalCals = dailyFood.reduce((s, i) => s + i.calories, 0);
  const totalProtein = dailyFood.reduce((s, i) => s + i.protein, 0);
  const totalCarbs = dailyFood.reduce((s, i) => s + i.carbs, 0);
  const totalFat = dailyFood.reduce((s, i) => s + i.fat, 0);

  const waterAmount = data.waterLogs?.filter(w => w.date === date).reduce((sum, w) => sum + w.amount, 0) || 0;
  const WATER_GOAL = 2500;
  const CALORIE_GOAL = 2500;
  const PROTEIN_GOAL = 160;
  const CARBS_GOAL = 250;
  const FAT_GOAL = 70;

  const mealTypes: FoodEntry['mealType'][] = ['Śniadanie', 'Obiad', 'Kolacja', 'Przekąska'];

  const MOCK_RECIPES = [
    { id: 1, name: 'Owsianka Białkowa', cals: 450, p: 35, c: 55, f: 10, type: 'Śniadanie', time: '10 min', icon: '🥣' },
    { id: 2, name: 'Kurczak z Ryżem', cals: 600, p: 50, c: 70, f: 12, type: 'Obiad', time: '25 min', icon: '🍗' },
    { id: 3, name: 'Sałatka z Łososiem', cals: 400, p: 25, c: 15, f: 28, type: 'Kolacja', time: '15 min', icon: '🥗' },
    { id: 4, name: 'Szejk Bananowy', cals: 350, p: 25, c: 40, f: 12, type: 'Przekąska', time: '5 min', icon: '🥤' },
    { id: 5, name: 'Omlet z Warzywami', cals: 320, p: 20, c: 10, f: 22, type: 'Śniadanie', time: '15 min', icon: '🍳' },
    { id: 6, name: 'Wołowina z Kaszą', cals: 700, p: 45, c: 80, f: 20, type: 'Obiad', time: '30 min', icon: '🥩' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;
    addFood({
      date,
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      mealType,
    });
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowAddForm(false);
  };

  const addRecipe = (recipe: typeof MOCK_RECIPES[0]) => {
    addFood({
      date,
      name: recipe.name,
      calories: recipe.cals,
      protein: recipe.p,
      carbs: recipe.c,
      fat: recipe.f,
      mealType: recipe.type as FoodEntry['mealType']
    });
    setActiveTab('dziennik');
  };

  const getMealData = (type: FoodEntry['mealType']) => dailyFood.filter(f => f.mealType === type);

  const macroPieData = [
    { name: 'Białko', value: totalProtein, color: '#f43f5e' }, // rose
    { name: 'Węgle', value: totalCarbs, color: '#fb923c' },   // orange
    { name: 'Tłuszcze', value: totalFat, color: '#38bdf8' }, // sky
  ].filter(m => m.value > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">Dieta</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">Śledź kalorie, makroskładniki i nawodnienie</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex bg-zinc-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('dziennik')}
              className={cn("px-5 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'dziennik' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900")}
            >
              Dziennik
            </button>
            <button 
              onClick={() => setActiveTab('przepisy')}
              className={cn("px-5 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'przepisy' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900")}
            >
              Baza Posiłków
            </button>
          </div>
          
          {activeTab === 'dziennik' && (
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white border border-zinc-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-zinc-900 outline-none shadow-sm focus:border-zinc-400 focus:shadow-md transition-all w-full sm:w-auto"
            />
          )}
        </div>
      </header>

      {activeTab === 'dziennik' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Energy Balance Hero */}
          <div className="bg-zinc-950 text-white rounded-[2.5rem] p-6 md:p-10 mb-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
                {/* Calories Donut */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center justify-center relative">
                   <div className="w-48 h-48 relative">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                        <circle 
                          cx="96" cy="96" r="88" 
                          stroke="currentColor" 
                          strokeWidth="12" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 88}
                          strokeDashoffset={2 * Math.PI * 88 * (1 - Math.min(totalCals / CALORIE_GOAL, 1))}
                          className={cn("transition-all duration-1000 ease-out", totalCals > CALORIE_GOAL ? "text-rose-500" : "text-white")} 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-black">{totalCals}</span>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">/ {CALORIE_GOAL} kcal</span>
                     </div>
                   </div>
                </div>

                {/* Macros Breakdown */}
                <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center gap-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold">Makroskładniki</h3>
                     <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                       <Target className="w-4 h-4"/> Twój Cel
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {/* Protein */}
                     <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Białko</div>
                            <div className="text-2xl font-black">{totalProtein}<span className="text-sm font-bold text-zinc-500">g</span></div>
                          </div>
                          <div className="text-xs font-bold text-zinc-500">{PROTEIN_GOAL}g</div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min((totalProtein / PROTEIN_GOAL) * 100, 100)}%\` }} />
                        </div>
                     </div>
                     {/* Carbs */}
                     <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Węglowodany</div>
                            <div className="text-2xl font-black">{totalCarbs}<span className="text-sm font-bold text-zinc-500">g</span></div>
                          </div>
                          <div className="text-xs font-bold text-zinc-500">{CARBS_GOAL}g</div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min((totalCarbs / CARBS_GOAL) * 100, 100)}%\` }} />
                        </div>
                     </div>
                     {/* Fat */}
                     <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Tłuszcze</div>
                            <div className="text-2xl font-black">{totalFat}<span className="text-sm font-bold text-zinc-500">g</span></div>
                          </div>
                          <div className="text-xs font-bold text-zinc-500">{FAT_GOAL}g</div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-sky-400 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min((totalFat / FAT_GOAL) * 100, 100)}%\` }} />
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-zinc-900">Twój Jadłospis</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Dodaj Posiłek
                </button>
              </div>

              <AnimatePresence>
                {showAddForm && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-200/80 mb-6">
                      <h4 className="text-lg font-bold text-zinc-900 mb-6">Nowy wpis do dziennika</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Rodzaj posiłku</label>
                          <div className="relative">
                            <select 
                              value={mealType}
                              onChange={(e) => setMealType(e.target.value as any)}
                              className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900"
                            >
                              {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Nazwa produktu</label>
                          <input 
                            type="text" 
                            placeholder="np. Owsianka z malinami" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-semibold"
                          />
                        </div>
                      </div>
                      
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Wartości odżywcze</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="relative">
                          <input type="number" placeholder="Kcal" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-semibold pl-12" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">🔥</div>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="Białko" value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-semibold pl-10" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-400">B</div>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="Węgle" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-semibold pl-10" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400">W</div>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="Tłuszcz" value={fat} onChange={(e) => setFat(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-semibold pl-10" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-400">T</div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 border-t border-zinc-100 pt-6">
                        <button 
                          type="button" 
                          onClick={() => setShowAddForm(false)}
                          className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                          Anuluj
                        </button>
                        <button 
                          type="submit"
                          className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors"
                        >
                          Zapisz posiłek
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Meals List */}
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {dailyFood.length === 0 && !showAddForm ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center py-20 text-zinc-500 font-medium flex flex-col items-center gap-4 bg-zinc-50/50 rounded-[2.5rem] border-2 border-zinc-100 border-dashed"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Apple className="w-8 h-8 text-zinc-400" />
                      </div>
                      <p className="text-base">Nie dodano jeszcze żadnych posiłków na ten dzień.</p>
                      <button onClick={() => setShowAddForm(true)} className="text-zinc-900 font-bold underline decoration-2 decoration-zinc-200 hover:decoration-zinc-900 transition-all underline-offset-4">Dodaj pierwszy posiłek</button>
                    </motion.div>
                  ) : (
                    mealTypes.map(type => {
                      const meals = getMealData(type);
                      if (meals.length === 0) return null;
                      
                      const typeCals = meals.reduce((s, m) => s + m.calories, 0);
                      const typeProtein = meals.reduce((s, m) => s + m.protein, 0);

                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          key={type}
                          className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-200/60 overflow-hidden"
                        >
                          <div className="bg-zinc-50/80 px-6 py-4 flex justify-between items-center border-b border-zinc-100">
                            <h3 className="text-lg font-bold text-zinc-900">{type}</h3>
                            <div className="flex gap-4">
                               <span className="text-sm font-black text-zinc-900">{typeCals} <span className="text-zinc-500 font-semibold text-xs">kcal</span></span>
                               <span className="text-sm font-black text-rose-500 hidden sm:inline">{typeProtein}g <span className="text-rose-400/70 font-semibold text-xs">Białka</span></span>
                            </div>
                          </div>
                          <div className="divide-y divide-zinc-100">
                            {meals.map(item => (
                              <motion.div 
                                layout
                                key={item.id}
                                className="px-6 py-5 flex items-center justify-between group hover:bg-zinc-50/50 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-bold text-base text-zinc-900 mb-1.5">{item.name}</div>
                                  <div className="flex gap-4 items-center">
                                    <div className="bg-zinc-100 px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-900">
                                      {item.calories} kcal
                                    </div>
                                    <div className="text-xs font-bold flex gap-3">
                                      <span className="text-rose-500">{item.protein}g B</span>
                                      <span className="text-orange-500">{item.carbs}g W</span>
                                      <span className="text-sky-500">{item.fat}g T</span>
                                    </div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => deleteFood(item.id)}
                                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Water Tracker Neo-Bento */}
              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-white/30">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">Nawodnienie</h3>
                  <p className="text-blue-200 text-sm font-semibold mb-6">Cel: {WATER_GOAL / 1000}L dziennie</p>
                  
                  <div className="text-5xl font-black mb-8 tracking-tighter">
                    {waterAmount}<span className="text-xl font-bold text-blue-300 ml-1">ml</span>
                  </div>
                  
                  <div className="w-full space-y-3 mb-6">
                    <button 
                      onClick={() => addWater(date, 250)} 
                      className="w-full bg-white text-blue-600 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex justify-between px-6 items-center"
                    >
                      <span>Szklanka</span>
                      <span className="opacity-60">+250 ml</span>
                    </button>
                    <button 
                      onClick={() => addWater(date, 500)} 
                      className="w-full bg-blue-500/50 hover:bg-blue-500/80 text-white py-3.5 rounded-2xl text-sm font-bold border border-white/20 backdrop-blur-sm transition-all flex justify-between px-6 items-center"
                    >
                      <span>Butelka</span>
                      <span className="opacity-60">+500 ml</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => resetWater(date)} 
                    className="text-blue-300 hover:text-white text-xs font-bold underline underline-offset-4 decoration-blue-400/50 transition-colors"
                  >
                    Resetuj dzisiejszy wynik
                  </button>
                </div>
              </div>

              {/* TDEE Summary Box */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 relative overflow-hidden">
                <h2 className="text-lg font-bold text-zinc-900 mb-2">Twoje Zapotrzebowanie</h2>
                <p className="text-xs font-semibold text-zinc-400 mb-8 uppercase tracking-wider">Metabolizm i aktywność</p>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-zinc-100 pb-3">
                    <span className="text-sm font-bold text-zinc-500">BMR (Spoczynkowe)</span>
                    <span className="font-black text-zinc-900 text-lg">1850 <span className="text-xs font-bold text-zinc-400">kcal</span></span>
                  </div>
                  <div className="flex justify-between items-end border-b border-zinc-100 pb-3">
                    <span className="text-sm font-bold text-zinc-500">TDEE (Całkowite)</span>
                    <span className="font-black text-zinc-900 text-lg">{CALORIE_GOAL} <span className="text-xs font-bold text-zinc-400">kcal</span></span>
                  </div>
                  <div className="pt-2">
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/60 text-center text-sm font-bold text-zinc-900 flex items-center justify-center gap-2">
                      <Target className="w-4 h-4 text-zinc-500" />
                      Cel: Utrzymanie wagi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RECIPES.map(recipe => (
              <motion.div 
                key={recipe.id}
                whileHover={{ y: -4 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 flex flex-col h-full group"
              >
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
                  {recipe.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2 leading-tight">{recipe.name}</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">{recipe.type} • {recipe.time}</p>
                
                <div className="grid grid-cols-4 gap-3 mb-8 mt-auto">
                  <div className="bg-zinc-50 py-3 rounded-xl text-center border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Kcal</div>
                    <div className="text-sm font-black text-zinc-900">{recipe.cals}</div>
                  </div>
                  <div className="bg-rose-50/50 py-3 rounded-xl text-center border border-rose-100/50">
                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Białko</div>
                    <div className="text-sm font-black text-rose-900">{recipe.p}g</div>
                  </div>
                  <div className="bg-orange-50/50 py-3 rounded-xl text-center border border-orange-100/50">
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Węgle</div>
                    <div className="text-sm font-black text-orange-900">{recipe.c}g</div>
                  </div>
                  <div className="bg-sky-50/50 py-3 rounded-xl text-center border border-sky-100/50">
                    <div className="text-[10px] font-bold text-sky-500 uppercase tracking-wider mb-1">Tłuszcz</div>
                    <div className="text-sm font-black text-sky-900">{recipe.f}g</div>
                  </div>
                </div>

                <button 
                  onClick={() => addRecipe(recipe)}
                  className="w-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Dodaj do dziennika
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
`

fs.writeFileSync('src/components/FoodTracker.tsx', content);
