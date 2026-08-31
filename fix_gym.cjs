const fs = require('fs');

const content = `import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';
import { Trash2, Dumbbell, ChevronDown, Activity, Play, Plus, Timer, Zap, Target, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutEntry, Routine, RoutineExercise } from '../types';
import { cn } from '../lib/utils';

export function GymTracker() {
  const { data, addWorkout, deleteWorkout, addRoutine, deleteRoutine } = useData();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<'trening' | 'plany'>('trening');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [exercise, setExercise] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<WorkoutEntry['muscleGroup']>('Klatka');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  // Routine creation state
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);

  const dailyWorkouts = data.workouts.filter(w => w.date === date);
  const totalVolume = dailyWorkouts.reduce((acc, w) => acc + (w.sets * w.reps * w.weight), 0);
  const totalSets = dailyWorkouts.reduce((acc, w) => acc + w.sets, 0);

  const muscleGroups: WorkoutEntry['muscleGroup'][] = ['Klatka', 'Plecy', 'Nogi', 'Barki', 'Ramiona', 'Brzuch', 'Inne'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise || !sets || !reps || !weight) return;
    
    addWorkout({
      date,
      exercise,
      muscleGroup,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)
    });
    
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setShowAddForm(false);
  };

  const getGroupedWorkouts = () => {
    const grouped: Record<string, typeof dailyWorkouts> = {};
    muscleGroups.forEach(mg => {
      const wks = dailyWorkouts.filter(w => w.muscleGroup === mg);
      if (wks.length > 0) grouped[mg] = wks;
    });
    return grouped;
  };

  const groupedWorkouts = getGroupedWorkouts();
  const trainedMuscles = Object.keys(groupedWorkouts);

  const handleAddRoutineExercise = () => {
    if (!exercise || !sets || !reps) return;
    setRoutineExercises(prev => [...prev, {
      exercise,
      muscleGroup,
      sets: Number(sets),
      reps: Number(reps)
    }]);
    setExercise('');
    setSets('');
    setReps('');
  };

  const handleSaveRoutine = () => {
    if (!routineName || routineExercises.length === 0) return;
    addRoutine({
      name: routineName,
      exercises: routineExercises
    });
    setIsCreatingRoutine(false);
    setRoutineName('');
    setRoutineExercises([]);
  };

  const startRoutine = (routine: Routine) => {
    routine.exercises.forEach(ex => {
      addWorkout({
        date,
        exercise: ex.exercise,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets,
        reps: ex.reps,
        weight: 0 // Default 0 for new planned sets
      });
    });
    setActiveTab('trening');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">Trening</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">Zapisuj swoje wyniki, analizuj objętość i buduj plany</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex bg-zinc-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => { setActiveTab('trening'); setIsCreatingRoutine(false); }}
              className={cn("px-5 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'trening' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900")}
            >
              Dziennik
            </button>
            <button 
              onClick={() => setActiveTab('plany')}
              className={cn("px-5 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'plany' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900")}
            >
              Gotowe Zestawy
            </button>
          </div>
          
          {activeTab === 'trening' && (
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white border border-zinc-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-zinc-900 outline-none shadow-sm focus:border-zinc-400 focus:shadow-md transition-all w-full sm:w-auto"
            />
          )}
        </div>
      </header>

      {activeTab === 'trening' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Training Hero */}
          <div className="bg-zinc-950 text-white rounded-[2.5rem] p-6 md:p-10 mb-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
                <div className="md:col-span-5 flex flex-col justify-center">
                   <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Dzisiejsza Objętość</h3>
                   <div className="flex items-baseline gap-2 mb-6">
                     <span className="text-6xl font-black tracking-tight">{totalVolume.toLocaleString()}</span>
                     <span className="text-xl font-bold text-zinc-500">kg</span>
                   </div>
                   <div className="flex gap-4">
                     <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl"><Activity className="w-5 h-5 text-white" /></div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Serie</div>
                          <div className="text-xl font-black">{totalSets}</div>
                        </div>
                     </div>
                     <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl"><Timer className="w-5 h-5 text-white" /></div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Czas</div>
                          <div className="text-xl font-black">65 <span className="text-xs font-bold text-zinc-500">min</span></div>
                        </div>
                     </div>
                   </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-white">Trenowane partie</h3>
                     <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                       <Target className="w-4 h-4"/> Rozkład
                     </div>
                  </div>
                  
                  {trainedMuscles.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {trainedMuscles.map(mg => (
                        <div key={mg} className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          {mg}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-zinc-500 border border-dashed border-white/20 p-6 rounded-2xl text-center">
                       Dodaj ćwiczenia, aby zobaczyć zaangażowane partie mięśniowe.
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-zinc-900">Dziennik Ćwiczeń</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Dodaj Ćwiczenie
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
                      <h4 className="text-lg font-bold text-zinc-900 mb-6">Nowe ćwiczenie</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <div className="md:col-span-1">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Partia</label>
                          <div className="relative">
                            <select 
                              value={muscleGroup}
                              onChange={(e) => setMuscleGroup(e.target.value as any)}
                              className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900"
                            >
                              {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Nazwa ćwiczenia</label>
                          <input 
                            type="text" 
                            placeholder="np. Wyciskanie sztangi leżąc" 
                            value={exercise}
                            onChange={(e) => setExercise(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-semibold text-zinc-900"
                          />
                        </div>
                      </div>
                      
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Parametry serii</label>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="relative">
                          <input type="number" placeholder="Serie" value={sets} onChange={(e) => setSets(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900 pl-10" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">S</div>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="Powtórzenia" value={reps} onChange={(e) => setReps(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900 pl-10" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">P</div>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="Ciężar (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900 pl-10" />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">KG</div>
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
                          Dodaj do dziennika
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Workouts List */}
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {dailyWorkouts.length === 0 && !showAddForm ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center py-20 text-zinc-500 font-medium flex flex-col items-center gap-4 bg-zinc-50/50 rounded-[2.5rem] border-2 border-zinc-100 border-dashed"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Dumbbell className="w-8 h-8 text-zinc-400" />
                      </div>
                      <p className="text-base">Nie wykonałeś dziś jeszcze żadnego ćwiczenia.</p>
                      <button onClick={() => setShowAddForm(true)} className="text-zinc-900 font-bold underline decoration-2 decoration-zinc-200 hover:decoration-zinc-900 transition-all underline-offset-4">Rozpocznij trening</button>
                    </motion.div>
                  ) : (
                    Object.entries(groupedWorkouts).map(([mg, wks]) => {
                      const mgVolume = wks.reduce((a, w) => a + (w.sets * w.reps * w.weight), 0);
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          key={mg}
                          className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-200/60 overflow-hidden"
                        >
                          <div className="bg-zinc-50/80 px-6 py-4 flex justify-between items-center border-b border-zinc-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-200/80 flex items-center justify-center text-zinc-600">
                                 <Target className="w-4 h-4" />
                              </div>
                              <h3 className="text-lg font-bold text-zinc-900">{mg}</h3>
                            </div>
                            <div className="flex gap-4">
                               <span className="text-sm font-black text-zinc-900">{mgVolume.toLocaleString()} <span className="text-zinc-500 font-semibold text-xs">kg obj.</span></span>
                            </div>
                          </div>
                          <div className="divide-y divide-zinc-100">
                            {wks.map(item => {
                              const oneRM = item.weight > 0 ? Math.round(item.weight * (1 + item.reps / 30)) : 0;
                              return (
                                <motion.div 
                                  layout
                                  key={item.id}
                                  className={cn("px-6 py-5 flex items-center justify-between group hover:bg-zinc-50/50 transition-colors", item.weight === 0 ? "bg-orange-50/30" : "")}
                                >
                                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="w-24 border-l-2 border-zinc-200 pl-4">
                                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{item.sets} <span className="lowercase">x</span> {item.reps}</p>
                                      {item.weight === 0 ? (
                                        <p className="text-sm font-bold mt-1 text-orange-500">Wpisz ciężar</p>
                                      ) : (
                                        <p className="text-xl font-black mt-0.5 text-zinc-900">{item.weight} <span className="text-sm font-bold text-zinc-400">kg</span></p>
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-base font-bold text-zinc-900">{item.exercise}</h3>
                                      {item.weight > 0 && (
                                        <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-zinc-400">
                                          <Zap className="w-3 h-3 text-yellow-500" />
                                          Szacowany 1RM: <span className="text-zinc-700">{oneRM} kg</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => deleteWorkout(item.id)}
                                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Recovery Status */}
              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/30">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Regeneracja</h3>
                  </div>
                  
                  <div className="space-y-6">
                     <div>
                       <div className="flex justify-between items-center mb-2 text-xs font-bold text-blue-100 uppercase tracking-wider">
                         <span>Klatka piersiowa</span>
                         <span className="text-white">85%</span>
                       </div>
                       <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                         <div className="bg-white h-full rounded-full" style={{ width: '85%' }} />
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-2 text-xs font-bold text-blue-100 uppercase tracking-wider">
                         <span>Plecy</span>
                         <span className="text-white">100%</span>
                       </div>
                       <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                         <div className="bg-green-400 h-full rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" style={{ width: '100%' }} />
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-2 text-xs font-bold text-blue-100 uppercase tracking-wider">
                         <span>Nogi</span>
                         <span className="text-orange-300">40%</span>
                       </div>
                       <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                         <div className="bg-orange-400 h-full rounded-full" style={{ width: '40%' }} />
                       </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* PRs Box */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900">Ostatnie Rekordy</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
                    <div>
                      <h4 className="font-bold text-zinc-900">Martwy Ciąg</h4>
                      <p className="text-xs font-semibold text-zinc-400 mt-1">2 dni temu</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-zinc-900">180 <span className="text-sm font-bold text-zinc-400">kg</span></span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
                    <div>
                      <h4 className="font-bold text-zinc-900">Wyciskanie leżąc</h4>
                      <p className="text-xs font-semibold text-zinc-400 mt-1">5 dni temu</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-zinc-900">110 <span className="text-sm font-bold text-zinc-400">kg</span></span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/60 text-center text-sm font-bold text-zinc-900 flex items-center justify-center gap-2">
                      Cała historia rekordów
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isCreatingRoutine ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button 
                onClick={() => setIsCreatingRoutine(true)}
                className="bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all text-zinc-500 hover:text-zinc-900 min-h-[300px]"
              >
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center">
                   <Plus className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">Stwórz Zestaw</span>
              </button>

              {data.routines.map(routine => (
                <motion.div 
                  key={routine.id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 flex flex-col group h-full relative"
                >
                  <div className="absolute top-6 right-6">
                    <button 
                      onClick={() => deleteRoutine(routine.id)}
                      className="p-2.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-4 pr-10 leading-tight">{routine.name}</h3>
                  
                  <div className="flex-1 space-y-3 mb-8">
                    {routine.exercises.slice(0, 4).map((ex, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-50 pb-2">
                        <span className="font-bold text-zinc-700 truncate mr-2"><span className="text-zinc-400 mr-2">{i + 1}.</span>{ex.exercise}</span>
                        <span className="text-zinc-500 font-black shrink-0 bg-zinc-50 px-2.5 py-1 rounded-lg">{ex.sets}x{ex.reps}</span>
                      </div>
                    ))}
                    {routine.exercises.length > 4 && (
                      <div className="text-xs font-bold text-zinc-400 pt-2 text-center bg-zinc-50 py-2 rounded-xl">
                        + {routine.exercises.length - 4} więcej ćwiczeń
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => startRoutine(routine)}
                    className="w-full bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white text-zinc-900 px-4 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 mt-auto"
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Wykonaj Dzisiaj
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-200/80">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-extrabold text-zinc-900">Kreator Zestawu</h2>
                  <button onClick={() => setIsCreatingRoutine(false)} className="text-sm font-bold text-zinc-500 hover:text-zinc-900 bg-zinc-100 px-4 py-2 rounded-xl transition-colors">Anuluj</button>
                </div>
                
                <div className="mb-10">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Nazwa planu treningowego</label>
                  <input 
                    type="text" 
                    placeholder="np. FBW Wtorek" 
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-colors text-lg font-black text-zinc-900"
                  />
                </div>

                <div className="bg-zinc-50 p-6 md:p-8 rounded-[2rem] border-2 border-dashed border-zinc-200 mb-10">
                  <h3 className="text-base font-bold text-zinc-900 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-zinc-500" /> Dodaj ćwiczenie do planu</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1 relative">
                      <select 
                        value={muscleGroup}
                        onChange={(e) => setMuscleGroup(e.target.value as any)}
                        className="w-full appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900"
                      >
                        {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        placeholder="Nazwa ćwiczenia (np. Przysiady)" 
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold text-zinc-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative">
                       <input type="number" placeholder="Serie" value={sets} onChange={(e) => setSets(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold pl-10" />
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">S</div>
                    </div>
                    <div className="relative">
                       <input type="number" placeholder="Powt." value={reps} onChange={(e) => setReps(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 outline-none focus:border-zinc-400 focus:shadow-sm transition-colors text-sm font-bold pl-10" />
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">P</div>
                    </div>
                    <button 
                      onClick={handleAddRoutineExercise}
                      type="button"
                      className="md:col-span-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      Zapisz ćwiczenie w zestawie
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-10">
                  {routineExercises.length > 0 && (
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Podgląd zestawu</h3>
                  )}
                  {routineExercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-zinc-200 p-4 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-500">{i + 1}</div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm">{ex.exercise}</h4>
                          <p className="text-xs font-bold text-zinc-400 mt-0.5">{ex.muscleGroup}</p>
                        </div>
                      </div>
                      <div className="bg-zinc-100 px-3 py-1.5 rounded-lg text-sm font-black text-zinc-700">{ex.sets}x{ex.reps}</div>
                    </div>
                  ))}
                  {routineExercises.length === 0 && (
                    <div className="text-center py-10 text-zinc-400 font-medium text-sm bg-zinc-50 rounded-3xl">
                       Twój zestaw jest jeszcze pusty.
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSaveRoutine}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white px-6 py-5 rounded-2xl font-black transition-colors shadow-lg disabled:shadow-none text-lg"
                  disabled={!routineName || routineExercises.length === 0}
                >
                  Zapisz Zestaw
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
`

fs.writeFileSync('src/components/GymTracker.tsx', content);
