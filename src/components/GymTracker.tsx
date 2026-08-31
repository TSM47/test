import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { format, subDays, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Plus, Trash2, Dumbbell, ChevronDown, Activity, Play, Timer, Zap, 
  Target, Trophy, Search, BookOpen, Clock, ChevronLeft, ChevronRight, 
  Check, ArrowRight, X, Calculator, Scale, Flame, RefreshCw, 
  Sparkles, Filter, Info, ShieldAlert, Award, Layers, RotateCcw, 
  Volume2, Bell, CheckCircle2, ChevronUp, Pause, ListPlus, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutEntry, Routine, RoutineExercise } from '../types';
import { EXERCISE_DATABASE, PREDEFINED_ROUTINES, ExerciseDefinition, PredefinedRoutine } from '../data/exercises';
import { cn } from '../lib/utils';
import { playBeepSound } from '../utils/audio';

type GymTab = 'dziennik' | 'baza' | 'plany' | 'kalkulator' | 'stoper';

export function GymTracker() {
  const { data, addWorkout, deleteWorkout, addRoutine, deleteRoutine } = useData();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<GymTab>('dziennik');
  
  // Custom Exercises state (in addition to predefined)
  const [customExercisesList, setCustomExercisesList] = useState<ExerciseDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('fit_custom_exercises');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Success Flash Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick Add Workout Form Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<WorkoutEntry['muscleGroup']>('Klatka');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('60');

  // Exercise Database search & filter state
  const [dbSearch, setDbSearch] = useState('');
  const [dbMuscleFilter, setDbMuscleFilter] = useState<string>('Wszystkie');
  const [dbEquipmentFilter, setDbEquipmentFilter] = useState<string>('Wszystkie');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<ExerciseDefinition | null>(null);

  // Quick Add from Database Modal
  const [quickAddExercise, setQuickAddExercise] = useState<ExerciseDefinition | null>(null);
  const [quickAddSets, setQuickAddSets] = useState('3');
  const [quickAddReps, setQuickAddReps] = useState('10');
  const [quickAddWeight, setQuickAddWeight] = useState('60');

  // Custom Exercise Creator Modal
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState<WorkoutEntry['muscleGroup']>('Klatka');
  const [newExEquipment, setNewExEquipment] = useState<ExerciseDefinition['equipment']>('Sztanga');
  const [newExDifficulty, setNewExDifficulty] = useState<ExerciseDefinition['difficulty']>('Średniozaawansowany');
  const [newExDesc, setNewExDesc] = useState('');
  const [newExTip, setNewExTip] = useState('');

  // Routine creation state
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [routineCategory, setRoutineCategory] = useState<PredefinedRoutine['category']>('FBW');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [customRoutineExName, setCustomRoutineExName] = useState('');
  const [customRoutineExMuscle, setCustomRoutineExMuscle] = useState<WorkoutEntry['muscleGroup']>('Klatka');
  const [customRoutineExSets, setCustomRoutineExSets] = useState('3');
  const [customRoutineExReps, setCustomRoutineExReps] = useState('10');

  // 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState<string>('100');
  const [calcReps, setCalcReps] = useState<string>('6');
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg barbell
  const [targetBarbellWeight, setTargetBarbellWeight] = useState<string>('100');

  // Rest Timer State
  const [restTimerDuration, setRestTimerDuration] = useState<number>(90); // seconds
  const [restTimerSecondsLeft, setRestTimerSecondsLeft] = useState<number>(90);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Workout Session Stopwatch State
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Combine database exercises with custom exercises
  const allExercises = useMemo(() => {
    return [...EXERCISE_DATABASE, ...customExercisesList];
  }, [customExercisesList]);

  // Day Navigation helpers
  const handlePrevDay = () => {
    const current = new Date(date);
    setDate(format(subDays(current, 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const current = new Date(date);
    setDate(format(addDays(current, 1), 'yyyy-MM-dd'));
  };

  const handleSetToday = () => {
    setDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // Current Day's Workouts & Calculations
  const dailyWorkouts = useMemo(() => data.workouts.filter(w => w.date === date), [data.workouts, date]);
  const totalVolume = useMemo(() => dailyWorkouts.reduce((acc, w) => acc + (w.sets * w.reps * w.weight), 0), [dailyWorkouts]);
  const totalSets = useMemo(() => dailyWorkouts.reduce((acc, w) => acc + w.sets, 0), [dailyWorkouts]);
  const totalReps = useMemo(() => dailyWorkouts.reduce((acc, w) => acc + (w.sets * w.reps), 0), [dailyWorkouts]);
  const totalExercisesCount = dailyWorkouts.length;
  const estimatedCaloriesBurned = useMemo(() => Math.round(totalSets * 18 + totalVolume * 0.015), [totalSets, totalVolume]);

  const muscleGroups: WorkoutEntry['muscleGroup'][] = ['Klatka', 'Plecy', 'Nogi', 'Barki', 'Ramiona', 'Brzuch', 'Inne'];

  // Muscle Volume Distribution
  const muscleVolumeMap = useMemo(() => {
    const map: Record<string, number> = {};
    muscleGroups.forEach(m => { map[m] = 0; });
    dailyWorkouts.forEach(w => {
      map[w.muscleGroup] = (map[w.muscleGroup] || 0) + (w.sets * w.reps * w.weight);
    });
    return map;
  }, [dailyWorkouts]);

  const trainedMuscles = useMemo(() => {
    return (Object.entries(muscleVolumeMap) as [string, number][]).filter(([_, vol]) => vol > 0);
  }, [muscleVolumeMap]);

  // Grouped Workouts for current day
  const groupedWorkouts = useMemo(() => {
    const grouped: Record<string, WorkoutEntry[]> = {};
    muscleGroups.forEach(mg => {
      const wks = dailyWorkouts.filter(w => w.muscleGroup === mg);
      if (wks.length > 0) grouped[mg] = wks;
    });
    return grouped;
  }, [dailyWorkouts]);

  // Rest Timer interval effect
  useEffect(() => {
    if (isRestTimerRunning) {
      restTimerRef.current = setInterval(() => {
        setRestTimerSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(restTimerRef.current as NodeJS.Timeout);
            setIsRestTimerRunning(false);
            if (soundEnabled) {
              playBeepSound('success');
            }
            showToast('⏰ Czas odpoczynku dobiegł końca! Gotowy na kolejną serię?');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isRestTimerRunning, soundEnabled]);

  // Session Stopwatch effect
  useEffect(() => {
    if (isSessionRunning) {
      sessionTimerRef.current = setInterval(() => {
        setSessionSeconds(s => s + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isSessionRunning]);

  // Start Rest Timer with specific seconds
  const startRestTimerWith = (seconds: number) => {
    setRestTimerDuration(seconds);
    setRestTimerSecondsLeft(seconds);
    setIsRestTimerRunning(true);
    if (soundEnabled) {
      playBeepSound('short');
    }
    showToast(`Uruchomiono stoper odpoczynku: ${seconds}s`);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Manual Form Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim() || !sets || !reps) return;
    
    addWorkout({
      date,
      exercise: exerciseName.trim(),
      muscleGroup,
      sets: Number(sets) || 1,
      reps: Number(reps) || 1,
      weight: Number(weight) || 0
    });
    
    showToast(`Dodano ćwiczenie: ${exerciseName.trim()} (${sets}s x ${reps}p x ${weight}kg)`);
    setExerciseName('');
    setShowAddForm(false);
  };

  // Quick Add Exercise from DB
  const handleQuickAddFromDb = () => {
    if (!quickAddExercise) return;
    addWorkout({
      date,
      exercise: quickAddExercise.name,
      muscleGroup: quickAddExercise.muscleGroup,
      sets: Number(quickAddSets) || 1,
      reps: Number(quickAddReps) || 1,
      weight: Number(quickAddWeight) || 0
    });
    showToast(`Dodano "${quickAddExercise.name}" do dzisiejszego treningu!`);
    setQuickAddExercise(null);
  };

  // Duplicate / Repeat set
  const handleAddExtraSet = (item: WorkoutEntry) => {
    addWorkout({
      date,
      exercise: item.exercise,
      muscleGroup: item.muscleGroup,
      sets: 1,
      reps: item.reps,
      weight: item.weight
    });
    showToast(`Dodano kolejną serię do: ${item.exercise}`);
  };

  // Create custom exercise
  const handleCreateCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newExercise: ExerciseDefinition = {
      id: `custom_ex_${Date.now()}`,
      name: newExName.trim(),
      muscleGroup: newExMuscle,
      equipment: newExEquipment,
      difficulty: newExDifficulty,
      icon: '💪',
      description: newExDesc.trim() || 'Własne ćwiczenie użytkownika.',
      instructions: ['Wykonuj ćwiczenie z dbałością o prawidłową technikę i kontrolę oddechu.'],
      tip: newExTip.trim() || 'Pamiętaj o zachowaniu stałego napięcia mięśniowego.',
      defaultSets: 3,
      defaultReps: 10,
      defaultWeight: 50
    };

    const updated = [newExercise, ...customExercisesList];
    setCustomExercisesList(updated);
    try {
      localStorage.setItem('fit_custom_exercises', JSON.stringify(updated));
    } catch {
      // ignore
    }

    showToast(`Utworzono nowe ćwiczenie: ${newExName.trim()}`);
    setNewExName('');
    setNewExDesc('');
    setNewExTip('');
    setShowCreateExerciseModal(false);
  };

  // Add exercise to routine builder
  const handleAddRoutineExercise = () => {
    if (!customRoutineExName.trim() || !customRoutineExSets || !customRoutineExReps) return;
    setRoutineExercises(prev => [...prev, {
      exercise: customRoutineExName.trim(),
      muscleGroup: customRoutineExMuscle,
      sets: Number(customRoutineExSets),
      reps: Number(customRoutineExReps)
    }]);
    setCustomRoutineExName('');
  };

  // Save custom routine
  const handleSaveRoutine = () => {
    if (!routineName.trim() || routineExercises.length === 0) return;
    addRoutine({
      name: routineName.trim(),
      exercises: routineExercises
    });
    showToast(`Zapisano zestaw: ${routineName.trim()}`);
    setIsCreatingRoutine(false);
    setRoutineName('');
    setRoutineExercises([]);
  };

  // Start pre-made or user routine in today's log
  const startRoutine = (exercises: { exercise: string; muscleGroup: WorkoutEntry['muscleGroup']; sets: number; reps: number; weight?: number }[], name: string) => {
    exercises.forEach(ex => {
      addWorkout({
        date,
        exercise: ex.exercise,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || 0
      });
    });
    showToast(`Załadowano plan "${name}" do dziennika na dzień ${date}!`);
    setActiveTab('dziennik');
  };

  // 1RM Calculation formulas
  const numWeight = Number(calcWeight) || 0;
  const numReps = Number(calcReps) || 1;

  // Epley: weight * (1 + reps / 30)
  const epley1RM = Math.round(numWeight * (1 + numReps / 30));
  // Brzycki: weight * (36 / (37 - reps))
  const brzycki1RM = numReps < 37 ? Math.round(numWeight * (36 / (37 - numReps))) : epley1RM;
  // Lombardi: weight * (reps ^ 0.10)
  const lombardi1RM = Math.round(numWeight * Math.pow(numReps, 0.10));
  // Lander: (100 * weight) / (101.3 - 2.67123 * reps)
  const lander1RM = Math.round((100 * numWeight) / (101.3 - 2.67123 * numReps));
  // Average of 1RM estimates
  const avg1RM = Math.round((epley1RM + brzycki1RM + lombardi1RM + lander1RM) / 4);

  // Barbell Plates Breakdown Calculation
  const targetW = Number(targetBarbellWeight) || barWeight;
  const weightPerSide = Math.max(0, (targetW - barWeight) / 2);
  
  const platesBreakdown = useMemo(() => {
    let remaining = weightPerSide;
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const result: { plate: number; count: number; color: string }[] = [];

    const plateColors: Record<number, string> = {
      25: 'bg-red-500 text-white',
      20: 'bg-blue-600 text-white',
      15: 'bg-yellow-500 text-zinc-900',
      10: 'bg-emerald-500 text-white',
      5: 'bg-zinc-100 text-zinc-900 border border-zinc-300',
      2.5: 'bg-zinc-800 text-white',
      1.25: 'bg-zinc-400 text-zinc-900'
    };

    availablePlates.forEach(plate => {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        result.push({ plate, count, color: plateColors[plate] });
        remaining = +(remaining - count * plate).toFixed(2);
      }
    });

    return { result, remaining, weightPerSide };
  }, [weightPerSide]);

  // Filtered exercises for database tab
  const filteredDatabaseExercises = useMemo(() => {
    return allExercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
        ex.description.toLowerCase().includes(dbSearch.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(dbSearch.toLowerCase());
      
      const matchesMuscle = dbMuscleFilter === 'Wszystkie' || ex.muscleGroup === dbMuscleFilter;
      const matchesEquip = dbEquipmentFilter === 'Wszystkie' || ex.equipment === dbEquipmentFilter;

      return matchesSearch && matchesMuscle && matchesEquip;
    });
  }, [allExercises, dbSearch, dbMuscleFilter, dbEquipmentFilter]);

  // Personal Records (PRs) computed from all historical workouts
  const personalRecords = useMemo(() => {
    const prMap: Record<string, { maxWeight: number; date: string; reps: number; oneRM: number }> = {};
    
    data.workouts.forEach(w => {
      const current1RM = Math.round(w.weight * (1 + w.reps / 30));
      if (!prMap[w.exercise] || current1RM > prMap[w.exercise].oneRM) {
        prMap[w.exercise] = {
          maxWeight: w.weight,
          date: w.date,
          reps: w.reps,
          oneRM: current1RM
        };
      }
    });

    // Top PRs sorted by 1RM
    return Object.entries(prMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.oneRM - a.oneRM)
      .slice(0, 5);
  }, [data.workouts]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-zinc-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border border-zinc-700/50 flex items-center gap-3 text-sm font-semibold"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" /> Dziennik Siłowy & Treningi
            </span>
            <span className="text-xs font-semibold text-zinc-400">• Objętość & Plany</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">Trening & Siła</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">
            Zapisuj serie, kontroluj tonaż, korzystaj z bazy ćwiczeń i wykonuj gotowe zestawy.
          </p>
        </div>

        {/* Date Selector & Day Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-zinc-200/80 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={handlePrevDay} 
              title="Poprzedni dzień"
              className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSetToday}
              className="px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Dzisiaj
            </button>
            <button 
              onClick={handleNextDay} 
              title="Następny dzień"
              className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-zinc-200/80 px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-900 outline-none shadow-sm focus:border-zinc-400 focus:shadow-md transition-all"
          />
        </div>
      </header>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex bg-zinc-100/90 p-1.5 rounded-2xl overflow-x-auto no-scrollbar gap-1 border border-zinc-200/50">
        <button 
          onClick={() => setActiveTab('dziennik')}
          className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2",
            activeTab === 'dziennik' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <Activity className="w-4 h-4" /> Dziennik Treningu
          {dailyWorkouts.length > 0 && (
            <span className="bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {dailyWorkouts.length}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('baza')}
          className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2",
            activeTab === 'baza' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <BookOpen className="w-4 h-4" /> Baza Ćwiczeń
          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {allExercises.length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('plany')}
          className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2",
            activeTab === 'plany' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <Layers className="w-4 h-4" /> Gotowe Plany & Zestawy
          <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {PREDEFINED_ROUTINES.length + data.routines.length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('kalkulator')}
          className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2",
            activeTab === 'kalkulator' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <Calculator className="w-4 h-4" /> Kalkulator 1RM & Sztangi
        </button>

        <button 
          onClick={() => setActiveTab('stoper')}
          className={cn(
            "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2",
            activeTab === 'stoper' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <Timer className="w-4 h-4" /> Stoper & Minutnik Przerw
          {isRestTimerRunning && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DZIENNIK TRENINGU (BENTO GRID) */}
      {/* ========================================================================= */}
      {activeTab === 'dziennik' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* BENTO GRID: Hero volume, Recovery status, Mini rest timer, PRs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* HERO TILE: Dark background with volume, sets, reps & muscle breakdown */}
            <div className="md:col-span-8 bg-zinc-950 text-white rounded-[2.5rem] p-7 md:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-zinc-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-blue-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Objętość & Statystyki Dnia</h2>
                      <p className="text-xs font-semibold text-zinc-300">
                        {format(new Date(date), "EEEE, d MMMM yyyy", { locale: pl })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/30"
                    >
                      <Plus className="w-3.5 h-3.5" /> Dodaj Ćwiczenie
                    </button>
                  </div>
                </div>

                {/* Big Metric Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Całkowity Tonaż</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">{totalVolume.toLocaleString()}</span>
                      <span className="text-xs font-bold text-zinc-400">kg</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Wykonane Serie</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">{totalSets}</span>
                      <span className="text-xs font-bold text-zinc-400">serii</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Powtórzenia</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">{totalReps}</span>
                      <span className="text-xs font-bold text-zinc-400">powt.</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Szacowane Kalorie</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400">{estimatedCaloriesBurned}</span>
                      <span className="text-xs font-bold text-zinc-400">kcal</span>
                    </div>
                  </div>
                </div>

                {/* Muscle distribution bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-400" /> Zaangażowane Partie Mięśniowe
                    </span>
                    <span className="text-zinc-300">{trainedMuscles.length} trenowane partie</span>
                  </div>

                  {trainedMuscles.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {trainedMuscles.map(([mg, vol]) => {
                        const pct = Math.round((vol / (totalVolume || 1)) * 100);
                        return (
                          <div 
                            key={mg} 
                            className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-white">{mg}</span>
                            <span className="text-zinc-400 font-semibold text-[11px]">
                              {vol.toLocaleString()} kg ({pct}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-zinc-500 italic py-1">
                      Brak zarejestrowanych ćwiczeń na ten dzień. Dodaj ćwiczenie lub wybierz gotowy plan.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SIDE COLUMN: Mini Rest Timer & Recovery */}
            <div className="md:col-span-4 flex flex-col gap-6">
              
              {/* Quick Rest Timer Card */}
              <div className="bg-white p-6 rounded-[2rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Szybki Minutnik Odpoczynku</h3>
                      <p className="text-[11px] font-semibold text-zinc-400">Między seriami</p>
                    </div>
                  </div>
                  {isRestTimerRunning && (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">
                      W toku
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-2xl border border-zinc-100 mb-3">
                  <span className="text-2xl font-black text-zinc-900 tracking-tight">
                    {formatTime(restTimerSecondsLeft)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isRestTimerRunning ? (
                      <button 
                        onClick={() => setIsRestTimerRunning(false)}
                        className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-zinc-800"
                      >
                        <Pause className="w-3.5 h-3.5" /> Stop
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsRestTimerRunning(true)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-500 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" /> Start
                      </button>
                    )}
                    <button 
                      onClick={() => { setIsRestTimerRunning(false); setRestTimerSecondsLeft(restTimerDuration); }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-200/50"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 60, 90, 120].map((s) => (
                    <button 
                      key={s}
                      onClick={() => startRestTimerWith(s)}
                      className={cn(
                        "py-1.5 text-xs font-bold rounded-xl border transition-all",
                        restTimerDuration === s && isRestTimerRunning 
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                      )}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Recovery Status */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-bold">Regeneracja Partii</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      Status
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1 text-blue-100">
                        <span>Klatka & Triceps</span>
                        <span className="text-white">90% (Gotowa)</span>
                      </div>
                      <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1 text-blue-100">
                        <span>Plecy & Biceps</span>
                        <span className="text-white">100% (Świeże)</span>
                      </div>
                      <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1 text-blue-100">
                        <span>Nogi & Pośladki</span>
                        <span className="text-amber-200">55% (Odpoczynek)</span>
                      </div>
                      <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: '55%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-blue-100/80 mt-4 font-medium">
                  💡 Rekomendacja na dziś: Dzień pchania (Push) lub trening pleców.
                </p>
              </div>
            </div>
          </div>

          {/* QUICK MANUAL ADD FORM (COLLAPSIBLE) */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <form 
                  onSubmit={handleManualSubmit}
                  className="bg-white p-6 md:p-8 rounded-[2rem] border border-zinc-200/90 shadow-lg mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-extrabold text-zinc-900">Dodaj Ćwiczenie do Dziennika</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="p-2 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                    <div className="md:col-span-4">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Partia Mięśniowa</label>
                      <div className="relative">
                        <select 
                          value={muscleGroup}
                          onChange={(e) => setMuscleGroup(e.target.value as any)}
                          className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                        >
                          {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="md:col-span-8">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Nazwa Ćwiczenia</label>
                      <input 
                        type="text" 
                        placeholder="np. Wyciskanie sztangi leżąc" 
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Liczba Serii</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={sets} 
                          onChange={(e) => setSets(e.target.value)} 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 pl-10" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">S</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Powtórzenia</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={reps} 
                          onChange={(e) => setReps(e.target.value)} 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 pl-10" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">P</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Ciężar (kg)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={weight} 
                          onChange={(e) => setWeight(e.target.value)} 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 pl-10" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">KG</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                    <button 
                      type="button"
                      onClick={() => { setShowAddForm(false); setActiveTab('baza'); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Wybierz z Bazy Ćwiczeń
                    </button>

                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddForm(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                      >
                        Anuluj
                      </button>
                      <button 
                        type="submit"
                        disabled={!exerciseName.trim()}
                        className="bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Zapisz Ćwiczenie
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WORKOUTS LOG CARDS (GROUPED BY MUSCLE) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">Wykonane Ćwiczenia</h3>
                <p className="text-xs font-semibold text-zinc-400">Serie i tonaż dla wybranego dnia</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Dodaj Ćwiczenie
                </button>
              </div>
            </div>

            {dailyWorkouts.length === 0 ? (
              <div className="text-center py-16 px-6 bg-zinc-50/70 rounded-[2.5rem] border-2 border-dashed border-zinc-200/80 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/60">
                  <Dumbbell className="w-7 h-7" />
                </div>
                <div className="max-w-md">
                  <h4 className="text-base font-bold text-zinc-900">Brak treningu na ten dzień</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Nie zarejestrowałeś jeszcze żadnego ćwiczenia w dniu {date}. Dodaj ćwiczenie ręcznie, wybierz z katalogu lub załaduj gotowy plan.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Dodaj Ćwiczenie
                  </button>
                  <button 
                    onClick={() => setActiveTab('plany')}
                    className="px-5 py-2.5 bg-white text-zinc-800 border border-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-600" /> Wybierz Gotowy Plan
                  </button>
                  <button 
                    onClick={() => setActiveTab('baza')}
                    className="px-5 py-2.5 bg-white text-zinc-800 border border-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Baza Ćwiczeń
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {(Object.entries(groupedWorkouts) as [string, WorkoutEntry[]][]).map(([mg, items]) => {
                  const groupVolume = items.reduce((acc, item) => acc + (item.sets * item.reps * item.weight), 0);
                  const groupSets = items.reduce((acc, item) => acc + item.sets, 0);

                  return (
                    <div 
                      key={mg}
                      className="bg-white rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
                    >
                      {/* Group Header */}
                      <div className="bg-zinc-50/80 px-6 py-4 flex items-center justify-between border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-zinc-900">{mg}</h4>
                            <span className="text-[11px] font-semibold text-zinc-400">{items.length} ćwiczeń • {groupSets} serii</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-zinc-900">{groupVolume.toLocaleString()}</span>
                          <span className="text-xs font-bold text-zinc-400 ml-1">kg obj.</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-zinc-100">
                        {items.map(item => {
                          const oneRM = item.weight > 0 ? Math.round(item.weight * (1 + item.reps / 30)) : 0;
                          const itemVolume = item.sets * item.reps * item.weight;

                          return (
                            <div 
                              key={item.id}
                              className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-zinc-50/60 transition-colors"
                            >
                              <div className="flex items-start sm:items-center gap-4 flex-1">
                                <div className="w-20 sm:w-24 border-l-2 border-blue-500 pl-3 shrink-0">
                                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                    {item.sets} <span className="lowercase">x</span> {item.reps}
                                  </span>
                                  <div className="flex items-baseline gap-0.5 mt-0.5">
                                    <span className="text-lg font-black text-zinc-900">{item.weight}</span>
                                    <span className="text-xs font-bold text-zinc-400">kg</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <h5 className="text-sm font-bold text-zinc-900">{item.exercise}</h5>
                                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-400">
                                    <span className="text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md text-[11px] font-bold">
                                      Tonaż: {itemVolume.toLocaleString()} kg
                                    </span>
                                    {item.weight > 0 && (
                                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-amber-500" /> Szac. 1RM: {oneRM} kg
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <button 
                                  onClick={() => handleAddExtraSet(item)}
                                  title="Dodaj kolejną serię"
                                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Plus className="w-3 h-3" /> Seria
                                </button>
                                <button 
                                  onClick={() => startRestTimerWith(90)}
                                  title="Uruchom 90s odpoczynku"
                                  className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                >
                                  <Timer className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteWorkout(item.id)}
                                  title="Usuń wpis"
                                  className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* HISTORICAL PRS SUMMARY BOX */}
          {personalRecords.length > 0 && (
            <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-900">Osobiste Rekordy Siłowe (PRs)</h3>
                    <p className="text-xs font-semibold text-zinc-400">Najwyższe szacowane maksima na 1 powtórzenie</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('kalkulator')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Kalkulator 1RM <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalRecords.map((pr, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-zinc-900 truncate max-w-[170px]">{pr.name}</h4>
                      <p className="text-[11px] font-semibold text-zinc-400 mt-0.5">
                        Zapis: {pr.maxWeight}kg x {pr.reps}p ({pr.date})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-600">{pr.oneRM}</span>
                      <span className="text-[10px] font-bold text-zinc-400 ml-1">kg 1RM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BAZA ĆWICZEŃ (EXERCISE DATABASE) */}
      {/* ========================================================================= */}
      {activeTab === 'baza' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Top Bar: Search, Filters, Add custom exercise */}
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Wyszukaj ćwiczenie po nazwie, partii lub sprzęcie..." 
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>

              <button 
                onClick={() => setShowCreateExerciseModal(true)}
                className="bg-zinc-900 text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" /> Dodaj Własne Ćwiczenie
              </button>
            </div>

            {/* Muscle Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <span className="text-xs font-bold text-zinc-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Partie:
              </span>
              {['Wszystkie', ...muscleGroups].map(mg => (
                <button 
                  key={mg}
                  onClick={() => setDbMuscleFilter(mg)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0",
                    dbMuscleFilter === mg 
                      ? "bg-zinc-900 text-white shadow-sm" 
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70"
                  )}
                >
                  {mg}
                </button>
              ))}
            </div>

            {/* Equipment Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <span className="text-xs font-bold text-zinc-400 shrink-0 mr-1">Sprzęt:</span>
              {['Wszystkie', 'Sztanga', 'Hantle', 'Wyciąg', 'Masa ciała', 'Maszyna'].map(eq => (
                <button 
                  key={eq}
                  onClick={() => setDbEquipmentFilter(eq)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0",
                    dbEquipmentFilter === eq 
                      ? "bg-blue-600 text-white" 
                      : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                  )}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatabaseExercises.map(ex => (
              <motion.div 
                key={ex.id}
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl shadow-inner">
                      {ex.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                        {ex.muscleGroup}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {ex.equipment}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-zinc-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {ex.name}
                  </h4>

                  <p className="text-xs font-medium text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                    {ex.description}
                  </p>

                  {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {ex.secondaryMuscles.slice(0, 3).map((sm, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                          +{sm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedExerciseModal(ex)}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" /> Technika
                  </button>

                  <button 
                    onClick={() => {
                      setQuickAddExercise(ex);
                      setQuickAddSets(ex.defaultSets.toString());
                      setQuickAddReps(ex.defaultReps.toString());
                      setQuickAddWeight(ex.defaultWeight.toString());
                    }}
                    className="flex-1 bg-zinc-900 hover:bg-blue-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Dodaj
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDatabaseExercises.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border border-zinc-200/80 p-8">
              <p className="text-zinc-500 font-semibold text-sm">Nie znaleziono ćwiczeń dla podanych kryteriów.</p>
              <button 
                onClick={() => { setDbSearch(''); setDbMuscleFilter('Wszystkie'); setDbEquipmentFilter('Wszystkie'); }}
                className="mt-3 text-blue-600 font-bold text-xs hover:underline"
              >
                Zresetuj filtry
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GOTOWE PLANY & ZESTAWY (ROUTINES) */}
      {/* ========================================================================= */}
      {activeTab === 'plany' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Header Action: Create custom routine */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-zinc-200/80 shadow-sm">
            <div>
              <h3 className="text-lg font-extrabold text-zinc-900">Zestawy & Plany Treningowe</h3>
              <p className="text-xs font-semibold text-zinc-400">Wybierz gotowy sprawdzony schemat lub stwórz swój własny split</p>
            </div>

            <button 
              onClick={() => setIsCreatingRoutine(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Kreator Własnego Planu
            </button>
          </div>

          {/* Routine Creation Modal / Section */}
          <AnimatePresence>
            {isCreatingRoutine && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white p-7 md:p-9 rounded-[2.5rem] border border-zinc-200/90 shadow-xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <ListPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-zinc-900">Stwórz Własny Zestaw Treningowy</h3>
                      <p className="text-xs font-semibold text-zinc-400">Zdefiniuj ćwiczenia, liczbę serii i powtórzeń</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCreatingRoutine(false)}
                    className="p-2 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Nazwa Planu</label>
                    <input 
                      type="text" 
                      placeholder="np. Push Day (Klatka + Barki + Triceps)"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Kategoria</label>
                    <div className="relative">
                      <select 
                        value={routineCategory}
                        onChange={(e) => setRoutineCategory(e.target.value as any)}
                        className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                      >
                        {['FBW', 'Push/Pull/Legs', 'Góra/Dół', 'Kalistenika', 'Szybki Trening'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Add Exercise to Routine Builder Form */}
                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 space-y-4">
                  <h4 className="text-xs font-black text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Dodaj ćwiczenie do zestawu:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                      <input 
                        type="text" 
                        placeholder="Nazwa ćwiczenia (np. Przysiady)"
                        value={customRoutineExName}
                        onChange={(e) => setCustomRoutineExName(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="md:col-span-3 relative">
                      <select 
                        value={customRoutineExMuscle}
                        onChange={(e) => setCustomRoutineExMuscle(e.target.value as any)}
                        className="w-full appearance-none bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 outline-none focus:border-zinc-400"
                      >
                        {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    <div className="md:col-span-2">
                      <input 
                        type="number" 
                        placeholder="Serie"
                        value={customRoutineExSets}
                        onChange={(e) => setCustomRoutineExSets(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        type="button"
                        onClick={handleAddRoutineExercise}
                        disabled={!customRoutineExName.trim()}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        + Dodaj
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exercises in builder */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Ćwiczenia w planie ({routineExercises.length})
                  </span>
                  {routineExercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-zinc-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 font-black text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-zinc-900">{ex.exercise}</h5>
                          <span className="text-[10px] font-semibold text-zinc-400">{ex.muscleGroup}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-lg">
                          {ex.sets} x {ex.reps}
                        </span>
                        <button 
                          onClick={() => setRoutineExercises(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-zinc-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {routineExercises.length === 0 && (
                    <p className="text-xs text-zinc-400 italic py-2">Plan jest pusty. Dodaj przynajmniej 1 ćwiczenie.</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button 
                    onClick={() => setIsCreatingRoutine(false)}
                    className="px-5 py-2.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl"
                  >
                    Anuluj
                  </button>
                  <button 
                    onClick={handleSaveRoutine}
                    disabled={!routineName.trim() || routineExercises.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 text-white px-7 py-2.5 rounded-xl text-xs font-black shadow-md shadow-blue-900/20 transition-all"
                  >
                    Zapisz Plan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PREDEFINED PROFESSIONAL PLANS */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Profesjonalne Plany Treningowe
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREDEFINED_ROUTINES.map(plan => (
                <div 
                  key={plan.id}
                  className="bg-white p-6 md:p-7 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between group hover:border-blue-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-2xl shadow-sm">
                        {plan.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                          {plan.category}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {plan.duration}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-black text-zinc-900 mb-2 leading-tight">
                      {plan.name}
                    </h4>
                    <p className="text-xs font-medium text-zinc-500 mb-6 line-clamp-2">
                      {plan.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Rozkład ćwiczeń ({plan.exercises.length}):
                      </span>
                      {plan.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-50">
                          <span className="font-semibold text-zinc-700 truncate mr-2">
                            <span className="text-zinc-400 mr-1.5">{i + 1}.</span> {ex.exercise}
                          </span>
                          <span className="text-zinc-500 font-bold bg-zinc-100 px-2 py-0.5 rounded text-[10px] shrink-0">
                            {ex.sets}x{ex.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => startRoutine(plan.exercises, plan.name)}
                    className="w-full bg-zinc-900 group-hover:bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Wykonaj w dniu {date}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* USER CUSTOM SAVED ROUTINES */}
          {data.routines.length > 0 && (
            <div className="space-y-4 pt-6">
              <h4 className="text-base font-extrabold text-zinc-900">Twoje Własne Plany ({data.routines.length})</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.routines.map(routine => (
                  <div 
                    key={routine.id}
                    className="bg-white p-6 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between group relative"
                  >
                    <div className="absolute top-6 right-6">
                      <button 
                        onClick={() => deleteRoutine(routine.id)}
                        className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Usuń plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center mb-4">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-black text-zinc-900 mb-4 pr-8">{routine.name}</h4>

                      <div className="space-y-2 mb-6">
                        {routine.exercises.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-zinc-50">
                            <span className="font-semibold text-zinc-700 truncate mr-2">
                              {i + 1}. {ex.exercise}
                            </span>
                            <span className="text-zinc-500 font-bold bg-zinc-100 px-2 py-0.5 rounded text-[10px] shrink-0">
                              {ex.sets}x{ex.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => startRoutine(routine.exercises, routine.name)}
                      className="w-full bg-zinc-900 hover:bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Wykonaj w dniu {date}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KALKULATOR 1RM & SZTANGI / TALERZY */}
      {/* ========================================================================= */}
      {activeTab === 'kalkulator' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 1RM CALCULATOR */}
            <div className="lg:col-span-7 bg-white p-7 md:p-9 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-900">Kalkulator 1RM (One Rep Max)</h3>
                  <p className="text-xs font-semibold text-zinc-400">Wylicz maksymalny ciężar na 1 powtórzenie z uznanych formuł</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Podniesiony Ciężar (kg)</label>
                  <input 
                    type="number" 
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3.5 text-base font-black text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Liczba Powtórzeń</label>
                  <input 
                    type="number" 
                    value={calcReps}
                    onChange={(e) => setCalcReps(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3.5 text-base font-black text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Main 1RM Result Banner */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl text-white flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    Średni Szacowany 1RM
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-blue-400">{avg1RM}</span>
                    <span className="text-lg font-bold text-zinc-400">kg</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs font-semibold text-zinc-300">Formuła Epley: <span className="font-bold text-white">{epley1RM} kg</span></div>
                  <div className="text-xs font-semibold text-zinc-300">Formuła Brzycki: <span className="font-bold text-white">{brzycki1RM} kg</span></div>
                  <div className="text-xs font-semibold text-zinc-300">Formuła Lander: <span className="font-bold text-white">{lander1RM} kg</span></div>
                </div>
              </div>

              {/* Training Percentages Table */}
              <div>
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider mb-3">
                  Tabela Procentowa dla Periodyzacji Treningowej
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { pct: 95, reps: '1-2 powt.', desc: 'Siła absolutna' },
                    { pct: 90, reps: '3-4 powt.', desc: 'Budowanie siły' },
                    { pct: 85, reps: '5-6 powt.', desc: 'Siła / Hipertrofia' },
                    { pct: 80, reps: '7-8 powt.', desc: 'Hipertrofia mięśni' },
                    { pct: 75, reps: '9-10 powt.', desc: 'Masa & Objętość' },
                    { pct: 70, reps: '11-12 powt.', desc: 'Wytrzymałość siłowa' },
                  ].map(row => {
                    const weightAtPct = Math.round(avg1RM * (row.pct / 100));
                    return (
                      <div key={row.pct} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span className="text-blue-600">{row.pct}%</span>
                          <span className="text-zinc-900 font-extrabold">{weightAtPct} kg</span>
                        </div>
                        <div className="text-[10px] font-semibold text-zinc-400 mt-1 flex justify-between">
                          <span>{row.reps}</span>
                          <span>{row.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BARBELL PLATE CALCULATOR */}
            <div className="lg:col-span-5 bg-white p-7 md:p-9 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900">Kalkulator Talerzy na Gryf</h3>
                    <p className="text-xs font-semibold text-zinc-400">Jakie talerze założyć po każdej stronie sztangi</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Docelowy Ciężar Całkowity (kg)</label>
                    <input 
                      type="number" 
                      value={targetBarbellWeight}
                      onChange={(e) => setTargetBarbellWeight(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3.5 text-base font-black text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Waga Gryfu</label>
                    <div className="flex gap-2">
                      {[
                        { weight: 20, label: 'Olimpijski (20 kg)' },
                        { weight: 15, label: 'Damski (15 kg)' },
                        { weight: 10, label: 'Krótki (10 kg)' },
                      ].map(bar => (
                        <button 
                          key={bar.weight}
                          onClick={() => setBarWeight(bar.weight)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-xs font-bold border transition-all",
                            barWeight === bar.weight 
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" 
                              : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                          )}
                        >
                          {bar.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weight Per Side Summary */}
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Ciężar na stronę</span>
                    <span className="text-2xl font-black text-zinc-900">{platesBreakdown.weightPerSide} kg</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-500">
                    Gryf: {barWeight} kg
                  </span>
                </div>

                {/* Plates Needed List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Talerze po JEDNEJ stronie:
                  </span>

                  {platesBreakdown.result.length > 0 ? (
                    <div className="space-y-2">
                      {platesBreakdown.result.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 bg-white">
                          <div className="flex items-center gap-3">
                            <span className={cn("px-3 py-1 rounded-lg text-xs font-black shadow-sm", p.color)}>
                              {p.plate} kg
                            </span>
                            <span className="text-xs font-bold text-zinc-700">Talerz {p.plate} kg</span>
                          </div>
                          <span className="text-sm font-black text-zinc-900">x {p.count} szt.</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">Sam pusty gryf ({barWeight} kg).</p>
                  )}
                </div>
              </div>

              <div className="text-[11px] font-medium text-zinc-400 text-center">
                * Pamiętaj o równomiernym rozłożeniu talerzy i użyciu zacisków bezpieczeństwa.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STOPER & MINUTNIK PRZERW (TIMERS) */}
      {/* ========================================================================= */}
      {activeTab === 'stoper' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* REST TIMER LARGE */}
            <div className="lg:col-span-7 bg-white p-7 md:p-10 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col items-center justify-between space-y-8">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900">Minutnik Odpoczynku Między Seriami</h3>
                    <p className="text-xs font-semibold text-zinc-400">Kontroluj czas regeneracji i gęstość treningową</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold",
                    soundEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-100 text-zinc-400 border-zinc-200"
                  )}
                  title={soundEnabled ? "Dźwięk włączony" : "Dźwięk wyłączony"}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Big Digital Clock Display */}
              <div className="relative flex flex-col items-center justify-center my-4">
                <div className="w-56 h-56 rounded-full border-8 border-zinc-100 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                  <span className="text-5xl font-black text-zinc-900 tracking-tight">
                    {formatTime(restTimerSecondsLeft)}
                  </span>
                  <span className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                    {isRestTimerRunning ? 'Odpoczynek' : 'Wstrzymany'}
                  </span>
                </div>
              </div>

              {/* Presets */}
              <div className="w-full space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block text-center">
                  Wybierz czas odpoczynku:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {[30, 45, 60, 90, 120].map(s => (
                    <button 
                      key={s}
                      onClick={() => startRestTimerWith(s)}
                      className={cn(
                        "py-3 rounded-2xl text-xs font-black border transition-all",
                        restTimerDuration === s 
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-md" 
                          : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                      )}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="w-full flex gap-3">
                {isRestTimerRunning ? (
                  <button 
                    onClick={() => setIsRestTimerRunning(false)}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Pause className="w-4 h-4" /> Wstrzymaj Odliczanie
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsRestTimerRunning(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                  >
                    <Play className="w-4 h-4" /> Wznów / Uruchom
                  </button>
                )}

                <button 
                  onClick={() => { setIsRestTimerRunning(false); setRestTimerSecondsLeft(restTimerDuration); }}
                  className="px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>

            {/* SESSION STOPWATCH */}
            <div className="lg:col-span-5 bg-zinc-950 text-white p-7 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Stoper Sesji Treningowej</h3>
                    <p className="text-xs font-semibold text-zinc-400">Zmierz całkowity czas dzisiejszego treningu</p>
                  </div>
                </div>

                <div className="my-8 text-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                    Czas Treningu
                  </span>
                  <div className="text-5xl font-black text-white font-mono tracking-tight">
                    {formatTime(sessionSeconds)}
                  </div>
                </div>

                <div className="flex gap-3">
                  {isSessionRunning ? (
                    <button 
                      onClick={() => setIsSessionRunning(false)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                    >
                      <Pause className="w-4 h-4" /> Pauza
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsSessionRunning(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
                    >
                      <Play className="w-4 h-4" /> Start Sesji
                    </button>
                  )}

                  <button 
                    onClick={() => { setIsSessionRunning(false); setSessionSeconds(0); }}
                    className="px-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="relative z-10 text-xs text-zinc-400 font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                💡 Wskazówka: Optymalny trening siłowy powinien trwać od 45 do 75 minut, aby zapobiec nadmiernemu wyrzutowi kortyzolu.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXERCISE TECHNIQUE & INSTRUCTIONS */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedExerciseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 md:p-9 shadow-2xl border border-zinc-200 relative"
            >
              <button 
                onClick={() => setSelectedExerciseModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {selectedExerciseModal.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700">
                      {selectedExerciseModal.muscleGroup}
                    </span>
                    <span className="text-xs font-bold text-zinc-400">• {selectedExerciseModal.equipment}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900">{selectedExerciseModal.name}</h3>
                </div>
              </div>

              <p className="text-sm font-medium text-zinc-600 mb-6 leading-relaxed">
                {selectedExerciseModal.description}
              </p>

              {/* Instructions steps */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                  Instrukcja Krok po Kroku:
                </h4>
                <div className="space-y-2.5">
                  {selectedExerciseModal.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs font-semibold text-zinc-800">
                      <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach Tip */}
              {selectedExerciseModal.tip && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 font-semibold mb-6 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block mb-0.5">Wskazówka Trenera:</span>
                    {selectedExerciseModal.tip}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-zinc-100">
                <button 
                  onClick={() => setSelectedExerciseModal(null)}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Zamknij
                </button>
                <button 
                  onClick={() => {
                    const ex = selectedExerciseModal;
                    setSelectedExerciseModal(null);
                    setQuickAddExercise(ex);
                    setQuickAddSets(ex.defaultSets.toString());
                    setQuickAddReps(ex.defaultReps.toString());
                    setQuickAddWeight(ex.defaultWeight.toString());
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-900/20"
                >
                  + Dodaj do Dnia ({date})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: QUICK ADD FROM DATABASE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickAddExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2.5rem] max-w-md w-full p-7 md:p-8 shadow-2xl border border-zinc-200 relative"
            >
              <button 
                onClick={() => setQuickAddExercise(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl">
                  {quickAddExercise.icon}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                    Dodaj do Dnia ({date})
                  </span>
                  <h3 className="text-base font-black text-zinc-900 leading-tight">{quickAddExercise.name}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Serie</label>
                    <input 
                      type="number" 
                      value={quickAddSets}
                      onChange={(e) => setQuickAddSets(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Powt.</label>
                    <input 
                      type="number" 
                      value={quickAddReps}
                      onChange={(e) => setQuickAddReps(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Ciężar (kg)</label>
                    <input 
                      type="number" 
                      value={quickAddWeight}
                      onChange={(e) => setQuickAddWeight(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 text-xs font-semibold text-zinc-600 flex justify-between">
                  <span>Szacowany tonaż:</span>
                  <span className="font-bold text-zinc-900">
                    {(Number(quickAddSets) * Number(quickAddReps) * Number(quickAddWeight)).toLocaleString()} kg
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setQuickAddExercise(null)}
                  className="flex-1 py-3 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors"
                >
                  Anuluj
                </button>
                <button 
                  onClick={handleQuickAddFromDb}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Zapisz do Dziennika
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: CREATE CUSTOM EXERCISE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCreateExerciseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2.5rem] max-w-lg w-full p-7 md:p-9 shadow-2xl border border-zinc-200 relative"
            >
              <button 
                onClick={() => setShowCreateExerciseModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-900">Nowe Własne Ćwiczenie</h3>
                  <p className="text-xs font-semibold text-zinc-400">Dodaj do prywatnej bazy ćwiczeń</p>
                </div>
              </div>

              <form onSubmit={handleCreateCustomExercise} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Nazwa Ćwiczenia</label>
                  <input 
                    type="text" 
                    placeholder="np. Wznosy hantli na ławce skośnej"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Partia Główna</label>
                    <div className="relative">
                      <select 
                        value={newExMuscle}
                        onChange={(e) => setNewExMuscle(e.target.value as any)}
                        className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 outline-none"
                      >
                        {muscleGroups.map(mg => <option key={mg} value={mg}>{mg}</option>)}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Sprzęt</label>
                    <div className="relative">
                      <select 
                        value={newExEquipment}
                        onChange={(e) => setNewExEquipment(e.target.value as any)}
                        className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-900 outline-none"
                      >
                        {['Sztanga', 'Hantle', 'Wyciąg', 'Maszyna', 'Masa ciała', 'Kettlebell'].map(eq => (
                          <option key={eq} value={eq}>{eq}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Krótki Opis</label>
                  <input 
                    type="text" 
                    placeholder="np. Ćwiczenie akcentujące boczny akton barku"
                    value={newExDesc}
                    onChange={(e) => setNewExDesc(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Wskazówka Techniczna</label>
                  <input 
                    type="text" 
                    placeholder="np. Prowadź łokcie powyżej nadgarstków"
                    value={newExTip}
                    onChange={(e) => setNewExTip(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-zinc-100">
                  <button 
                    type="button"
                    onClick={() => setShowCreateExerciseModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl"
                  >
                    Anuluj
                  </button>
                  <button 
                    type="submit"
                    disabled={!newExName.trim()}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Zapisz Ćwiczenie
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
