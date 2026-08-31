import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { format, subDays, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Plus, Trash2, Apple, ChevronDown, Droplets, Target, Flame, 
  Search, BookOpen, UtensilsCrossed, Sparkles, ChefHat, Clock,
  Filter, Check, ArrowRight, X, Calculator, Scale, ChevronLeft, ChevronRight,
  TrendingUp, Award, Layers, Zap, Info, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodEntry, CustomFoodItem } from '../types';
import { FITNESS_RECIPES, Recipe } from '../data/recipes';
import { cn } from '../lib/utils';

type FoodTab = 'dziennik' | 'baza' | 'przepisy' | 'kalkulator';

export function FoodTracker() {
  const { data, addFood, deleteFood, addWater, resetWater, addCustomFood, deleteCustomFood } = useData();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<FoodTab>('dziennik');
  
  // Quick Add Meal Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetMealType, setTargetMealType] = useState<FoodEntry['mealType']>('Śniadanie');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Custom Food Creator Modal State
  const [showCreateCustomModal, setShowCreateCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    category: 'Białkowe' as CustomFoodItem['category'],
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingUnit: '100g',
    servingGrams: '100',
    icon: '🥗'
  });

  // Custom Food Quick Add to Diary State (Multiplier & meal type)
  const [selectedCustomFood, setSelectedCustomFood] = useState<CustomFoodItem | null>(null);
  const [customPortionCount, setCustomPortionCount] = useState<number>(1);
  const [customTargetMeal, setCustomTargetMeal] = useState<FoodEntry['mealType']>('Śniadanie');

  // Custom Food Tab Filters & Search
  const [customSearch, setCustomSearch] = useState('');
  const [customCategoryFilter, setCustomCategoryFilter] = useState<string>('Wszystkie');

  // Recipe Search & Detailed Modal State
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState<string>('Wszystkie');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeTargetMeal, setRecipeTargetMeal] = useState<FoodEntry['mealType']>('Obiad');

  // TDEE / Macro Calculator State
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcAge, setCalcAge] = useState('25');
  const [calcWeight, setCalcWeight] = useState('78');
  const [calcHeight, setCalcHeight] = useState('180');
  const [calcActivity, setCalcActivity] = useState<number>(1.55); // Umiarkowana
  const [calcGoal, setCalcGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');

  // Success Flash Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  // Calculations for current date
  const dailyFood = useMemo(() => data.food.filter(f => f.date === date), [data.food, date]);
  const totalCals = useMemo(() => dailyFood.reduce((s, i) => s + i.calories, 0), [dailyFood]);
  const totalProtein = useMemo(() => dailyFood.reduce((s, i) => s + i.protein, 0), [dailyFood]);
  const totalCarbs = useMemo(() => dailyFood.reduce((s, i) => s + i.carbs, 0), [dailyFood]);
  const totalFat = useMemo(() => dailyFood.reduce((s, i) => s + i.fat, 0), [dailyFood]);

  const waterAmount = useMemo(() => {
    return data.waterLogs?.filter(w => w.date === date).reduce((sum, w) => sum + w.amount, 0) || 0;
  }, [data.waterLogs, date]);

  // Dynamic Macro Targets
  const CALORIE_GOAL = 2500;
  const PROTEIN_GOAL = 160;
  const CARBS_GOAL = 280;
  const FAT_GOAL = 70;
  const WATER_GOAL = 2500;

  const caloriesRemaining = Math.max(0, CALORIE_GOAL - totalCals);
  const caloriesPercent = Math.min(100, Math.round((totalCals / CALORIE_GOAL) * 100));

  const mealTypes: FoodEntry['mealType'][] = ['Śniadanie', 'Obiad', 'Kolacja', 'Przekąska'];

  // Manual Food Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !calories) return;
    
    addFood({
      date,
      name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      mealType: targetMealType,
    });

    showToast(`Dodano "${name.trim()}" do posiłku: ${targetMealType}`);
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowAddForm(false);
  };

  // Create Custom Food Item Submit
  const handleCreateCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.name.trim() || !customForm.calories) return;

    addCustomFood({
      name: customForm.name.trim(),
      category: customForm.category,
      calories: parseInt(customForm.calories) || 0,
      protein: parseInt(customForm.protein) || 0,
      carbs: parseInt(customForm.carbs) || 0,
      fat: parseInt(customForm.fat) || 0,
      servingUnit: customForm.servingUnit || '100g',
      servingGrams: parseInt(customForm.servingGrams) || 100,
      icon: customForm.icon || '🥗'
    });

    showToast(`Zapisano "${customForm.name.trim()}" w Twojej Bazie Posiłków!`);
    setCustomForm({
      name: '',
      category: 'Białkowe',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servingUnit: '100g',
      servingGrams: '100',
      icon: '🥗'
    });
    setShowCreateCustomModal(false);
  };

  // Add Custom Food from Database to Diary
  const handleAddCustomToDiary = (item: CustomFoodItem, portionMultiplier: number, mType: FoodEntry['mealType']) => {
    const mult = portionMultiplier || 1;
    const finalName = mult === 1 
      ? `${item.name} (${item.servingUnit})` 
      : `${item.name} (${mult}x ${item.servingUnit})`;

    addFood({
      date,
      name: finalName,
      calories: Math.round(item.calories * mult),
      protein: Math.round(item.protein * mult),
      carbs: Math.round(item.carbs * mult),
      fat: Math.round(item.fat * mult),
      mealType: mType
    });

    showToast(`Dodano ${finalName} (${Math.round(item.calories * mult)} kcal) do dziennika!`);
    setSelectedCustomFood(null);
    setCustomPortionCount(1);
  };

  // Add Recipe to Diary
  const handleAddRecipeToDiary = (recipe: Recipe, mType: FoodEntry['mealType']) => {
    addFood({
      date,
      name: `${recipe.title}`,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      mealType: mType
    });

    showToast(`Dodano przepis "${recipe.title}" (${recipe.calories} kcal) do ${mType}!`);
    setSelectedRecipe(null);
    setActiveTab('dziennik');
  };

  // Filtered Custom Foods
  const filteredCustomFoods = useMemo(() => {
    const list = data.customFoods || [];
    return list.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(customSearch.toLowerCase());
      const matchCategory = customCategoryFilter === 'Wszystkie' || item.category === customCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [data.customFoods, customSearch, customCategoryFilter]);

  // Filtered Recipes
  const filteredRecipes = useMemo(() => {
    return FITNESS_RECIPES.filter(recipe => {
      const matchSearch = recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
        recipe.description.toLowerCase().includes(recipeSearch.toLowerCase()) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(recipeSearch.toLowerCase()));
      
      const matchCategory = recipeCategoryFilter === 'Wszystkie' || 
        recipe.category === recipeCategoryFilter ||
        recipe.tags.includes(recipeCategoryFilter);

      return matchSearch && matchCategory;
    });
  }, [recipeSearch, recipeCategoryFilter]);

  // TDEE / BMR Calculation
  const calculatedTDEE = useMemo(() => {
    const w = parseFloat(calcWeight) || 75;
    const h = parseFloat(calcHeight) || 175;
    const a = parseFloat(calcAge) || 25;

    // Mifflin-St Jeor
    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr += calcGender === 'male' ? 5 : -161;

    let tdee = bmr * calcActivity;
    if (calcGoal === 'cut') tdee -= 400;
    if (calcGoal === 'bulk') tdee += 350;

    const targetKcal = Math.round(tdee);
    const targetProtein = Math.round(w * (calcGoal === 'cut' ? 2.2 : 2.0));
    const targetFat = Math.round((targetKcal * 0.25) / 9);
    const remainingCalsForCarbs = targetKcal - (targetProtein * 4 + targetFat * 9);
    const targetCarbs = Math.max(50, Math.round(remainingCalsForCarbs / 4));

    return {
      bmr: Math.round(bmr),
      tdee: targetKcal,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat
    };
  }, [calcGender, calcAge, calcWeight, calcHeight, calcActivity, calcGoal]);

  const getMealData = (type: FoodEntry['mealType']) => dailyFood.filter(f => f.mealType === type);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8 pb-16"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-zinc-950 text-white border border-lime-400/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold"
          >
            <div className="p-1.5 bg-lime-400 text-zinc-950 rounded-xl">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header & Tab Navigation */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-950 text-xs font-black uppercase tracking-wider mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
            <span>Kreator Formy & Odżywianie</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900">
            Dieta & Makroskładniki
          </h1>
          <p className="text-sm sm:text-base font-medium text-zinc-500 mt-1">
            Kompleksowy dziennik kalorii, baza własnych produktów, baza fit-przepisów oraz kalkulator TDEE.
          </p>
        </div>

        {/* Date Selector for Diary */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white p-2 rounded-2xl border border-zinc-200/80 shadow-sm self-start lg:self-auto">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-600 transition-colors"
            title="Poprzedni dzień"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSetToday}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-black transition-all",
              date === format(new Date(), 'yyyy-MM-dd')
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            Dzisiaj
          </button>

          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition-all cursor-pointer"
          />

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-600 transition-colors"
            title="Następny dzień"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-200/70">
        {[
          { id: 'dziennik', label: 'Dziennik Dnia', icon: Apple, badge: `${dailyFood.length} wpisów` },
          { id: 'baza', label: 'Baza Posiłków', icon: BookOpen, badge: `${(data.customFoods || []).length} produktów` },
          { id: 'przepisy', label: 'Wyszukaj Przepisy', icon: ChefHat, badge: `${FITNESS_RECIPES.length} dań` },
          { id: 'kalkulator', label: 'Kalkulator TDEE & Makro', icon: Calculator, badge: 'Optymalizacja' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FoodTab)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap border shrink-0",
                isActive 
                  ? "bg-zinc-950 text-white border-zinc-950 shadow-sm" 
                  : "bg-white text-zinc-600 border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isActive ? "text-lime-400" : "text-zinc-400")} />
              <span>{tab.label}</span>
              <span className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                isActive ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-400"
              )}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. ZAKŁADKA: DZIENNIK DNIA */}
      {/* ========================================================================= */}
      {activeTab === 'dziennik' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Quick Actions Strip */}
          <div className="bg-white p-4 sm:p-5 rounded-[2rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                  Dziennik na dzień: {format(new Date(date), 'd MMMM yyyy (EEEE)', { locale: pl })}
                </h4>
                <p className="text-xs font-medium text-zinc-500">
                  {dailyFood.length > 0 ? `Zalogowano ${dailyFood.length} pozycji (${totalCals} kcal).` : 'Brak wpisów – zacznij od śniadania!'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setTargetMealType('Śniadanie');
                  setShowAddForm(true);
                }}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-lime-400" /> Szybki Wpis
              </button>

              <button
                onClick={() => setActiveTab('baza')}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-zinc-600" /> Dodaj z Bazy
              </button>

              <button
                onClick={() => setActiveTab('przepisy')}
                className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200/60 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <ChefHat className="w-3.5 h-3.5 text-orange-600" /> Wybierz Przepis
              </button>
            </div>
          </div>

          {/* Energy Balance Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* HERO TILE: Energy & Donut (md:col 7) */}
            <div className="md:col-span-7 bg-zinc-950 text-white rounded-[2.5rem] p-7 md:p-8 relative overflow-hidden shadow-xl border border-zinc-900 flex flex-col justify-between">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-lime-400/10 blur-3xl rounded-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold tracking-wide uppercase text-orange-400">Bilans Kalorii</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">
                    Dzienny Cel: <strong className="text-white">{CALORIE_GOAL}</strong> kcal
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Calorie Stats */}
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="text-5xl md:text-6xl font-black tracking-tight text-white">
                      {totalCals} <span className="text-2xl font-bold text-zinc-500">kcal</span>
                    </div>
                    <p className="text-zinc-400 text-xs sm:text-sm font-medium">
                      {caloriesRemaining > 0 
                        ? `Pozostało jeszcze ${caloriesRemaining} kcal do osiągnięcia zapotrzebowania.`
                        : `Osiągnięto cel kaloryczny (+${Math.abs(caloriesRemaining)} kcal nadwyżki).`
                      }
                    </p>
                  </div>

                  {/* Donut Graphic */}
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/10" />
                      <circle 
                        cx="64" cy="64" r="54" 
                        stroke="currentColor" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - Math.min(totalCals / CALORIE_GOAL, 1))}
                        className={cn("transition-all duration-1000 ease-out", totalCals > CALORIE_GOAL ? "text-rose-500" : "text-lime-400")} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-white">{caloriesPercent}%</span>
                      <span className="text-[9px] font-bold uppercase text-zinc-400">Celu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Breakdown Pills */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {mealTypes.map((mType) => {
                    const mCals = dailyFood.filter(f => f.mealType === mType).reduce((s, f) => s + f.calories, 0);
                    return (
                      <div key={mType} className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">{mType}</div>
                        <div className="text-sm font-black text-white mt-0.5">{mCals} <span className="text-[10px] text-zinc-400 font-normal">kcal</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MAKROSKŁADNIKI & WODA (md:col 5) */}
            <div className="md:col-span-5 bg-white rounded-[2.5rem] p-7 md:p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                      <Apple className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-zinc-900">Makroskładniki Dziś</h3>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">B / W / T</span>
                </div>

                <div className="space-y-4">
                  {/* Białko */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-black mb-1.5">
                      <span className="text-rose-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Białko
                      </span>
                      <span className="text-zinc-900">{totalProtein}g <span className="text-zinc-400 font-medium">/ {PROTEIN_GOAL}g</span></span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (totalProtein / PROTEIN_GOAL) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Węglowodany */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-black mb-1.5">
                      <span className="text-orange-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Węglowodany
                      </span>
                      <span className="text-zinc-900">{totalCarbs}g <span className="text-zinc-400 font-medium">/ {CARBS_GOAL}g</span></span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (totalCarbs / CARBS_GOAL) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Tłuszcze */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-black mb-1.5">
                      <span className="text-sky-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Tłuszcze
                      </span>
                      <span className="text-zinc-900">{totalFat}g <span className="text-zinc-400 font-medium">/ {FAT_GOAL}g</span></span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (totalFat / FAT_GOAL) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Water Sub-Row */}
              <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-zinc-700">Woda:</span>
                  <span className="text-xs font-black text-blue-600">{waterAmount} ml</span>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => addWater(date, 250)}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-bold transition-colors"
                  >
                    +250ml
                  </button>
                  <button 
                    onClick={() => addWater(date, 500)}
                    className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold transition-colors"
                  >
                    +500ml
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Meals List Breakdown */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-zinc-900">Jadłospis Dnia ({mealTypes.length} posiłki)</h3>
              <button
                onClick={() => {
                  setTargetMealType('Śniadanie');
                  setShowAddForm(true);
                }}
                className="text-xs font-black text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj dowolny posiłek
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealTypes.map(type => {
                const meals = getMealData(type);
                const typeCals = meals.reduce((s, m) => s + m.calories, 0);
                const typeProtein = meals.reduce((s, m) => s + m.protein, 0);
                const typeCarbs = meals.reduce((s, m) => s + m.carbs, 0);
                const typeFat = meals.reduce((s, m) => s + m.fat, 0);

                return (
                  <div 
                    key={type}
                    className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-200/70 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Header of Meal */}
                      <div className="bg-zinc-50/80 px-5 py-3.5 flex justify-between items-center border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-zinc-900" />
                          <h4 className="text-sm font-black text-zinc-900">{type}</h4>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black text-zinc-900">{typeCals} kcal</span>
                          <span className="text-[11px] font-bold text-rose-500">({typeProtein}g B)</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-zinc-100 p-2">
                        {meals.map(item => (
                          <div 
                            key={item.id}
                            className="p-3 flex items-center justify-between rounded-xl hover:bg-zinc-50/80 transition-colors group"
                          >
                            <div className="flex-1 pr-3">
                              <div className="font-bold text-xs sm:text-sm text-zinc-900">{item.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-zinc-100 text-zinc-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                                  {item.calories} kcal
                                </span>
                                <div className="text-[10px] font-bold text-zinc-500 flex gap-2">
                                  <span className="text-rose-500">{item.protein}g B</span>
                                  <span className="text-orange-500">{item.carbs}g W</span>
                                  <span className="text-sky-500">{item.fat}g T</span>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => deleteFood(item.id)}
                              className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-80 group-hover:opacity-100"
                              title="Usuń wpis"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {meals.length === 0 && (
                          <div className="py-6 text-center text-xs font-semibold text-zinc-400">
                            Brak dań w tej porze posiłku.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meal footer button */}
                    <div className="p-3 bg-zinc-50/50 border-t border-zinc-100 flex gap-2">
                      <button
                        onClick={() => {
                          setTargetMealType(type);
                          setShowAddForm(true);
                        }}
                        className="flex-1 py-2 bg-white hover:bg-zinc-900 hover:text-white text-zinc-700 border border-zinc-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xl"
                      >
                        <Plus className="w-3.5 h-3.5" /> Dodaj do {type}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ZAKŁADKA: BAZA WŁASNYCH POSIŁKÓW & PRODUKTÓW */}
      {/* ========================================================================= */}
      {activeTab === 'baza' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Top Bar for Database */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-zinc-900" />
                <h3 className="text-xl font-black text-zinc-900">Baza Własnych Posiłków & Produktów</h3>
              </div>
              <p className="text-xs sm:text-sm font-medium text-zinc-500">
                Twoja osobista biblioteka składników i dań. Wybierz porcję i dodaj 1 kliknięciem do dzisiejszego dziennika.
              </p>
            </div>

            <button
              onClick={() => setShowCreateCustomModal(true)}
              className="px-5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <Plus className="w-4 h-4 text-lime-400" /> Stwórz Własny Produkt / Posiłek
            </button>
          </div>

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Szukaj w bazie (np. pierś z kurczaka, owsianka, łosoś)..."
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                className="w-full bg-white border border-zinc-200/90 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-sm"
              />
              {customSearch && (
                <button 
                  onClick={() => setCustomSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {['Wszystkie', 'Białkowe', 'Węglowodanowe', 'Tłuszczowe', 'Dania Gotowe', 'Owoce & Warzywa'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCustomCategoryFilter(cat)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                    customCategoryFilter === cat
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                      : "bg-white text-zinc-600 border-zinc-200/80 hover:bg-zinc-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Custom Foods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCustomFoods.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2rem] p-5 sm:p-6 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2.5 bg-zinc-50 rounded-2xl border border-zinc-100">{item.icon || '🥗'}</span>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-tight">{item.name}</h4>
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{item.category} • {item.servingUnit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCustomFood(item.id)}
                      className="text-zinc-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Usuń z bazy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nutrients Box */}
                  <div className="grid grid-cols-4 gap-2 my-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-100 text-center">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase">Kcal</div>
                      <div className="text-sm font-black text-zinc-900">{item.calories}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-rose-500 uppercase">Białko</div>
                      <div className="text-sm font-black text-rose-600">{item.protein}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-orange-500 uppercase">Węgle</div>
                      <div className="text-sm font-black text-orange-600">{item.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-sky-500 uppercase">Tłuszcz</div>
                      <div className="text-sm font-black text-sky-600">{item.fat}g</div>
                    </div>
                  </div>
                </div>

                {/* Quick Add To Diary Button */}
                <button
                  onClick={() => {
                    setSelectedCustomFood(item);
                    setCustomPortionCount(1);
                  }}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-lime-400" /> Dodaj do dziennika
                </button>
              </div>
            ))}

            {filteredCustomFoods.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-zinc-200 p-8">
                <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-zinc-800">Nie znaleziono produktu w bazie</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                  Możesz utworzyć nowy produkt lub posiłek za pomocą przycisku &quot;Stwórz Własny Produkt&quot; powyżej.
                </p>
                <button
                  onClick={() => setShowCreateCustomModal(true)}
                  className="mt-4 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-lime-400" /> Dodaj teraz
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ZAKŁADKA: WYSZUKAJ PRZEPISY & GOTOWE POSIŁKI */}
      {/* ========================================================================= */}
      {activeTab === 'przepisy' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-[2.5rem] p-7 md:p-9 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-black/20 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                <ChefHat className="w-3.5 h-3.5 text-amber-200" />
                <span>Baza Gotowych Przepisów Fit</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Zbilansowane Przepisy z Pełnym Makro
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 font-medium mt-1">
                Wybieraj spośród przetestowanych dań wysokobiałkowych. Kliknij przepis, aby zobaczyć składniki, sposób przygotowania oraz dodać porcję do swojego dziennika!
              </p>
            </div>
            
            <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
              <div className="text-3xl font-black">{FITNESS_RECIPES.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-100">Gotowych receptur</div>
            </div>
          </div>

          {/* Search & Tag Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Szukaj przepisu (np. omlet, chilli, wrap z tuńczykiem, łosoś, szejk)..."
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                className="w-full bg-white border border-zinc-200/90 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-sm"
              />
              {recipeSearch && (
                <button 
                  onClick={() => setRecipeSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {['Wszystkie', 'Śniadanie', 'Obiad', 'Kolacja', 'Przekąska', 'Wysokobiałkowe', 'Szybkie'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setRecipeCategoryFilter(tag)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                    recipeCategoryFilter === tag
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                      : "bg-white text-zinc-600 border-zinc-200/80 hover:bg-zinc-50"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-[2.5rem] p-6 sm:p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar of Recipe Card */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                      {recipe.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-black uppercase">
                        {recipe.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-400">
                        <Clock className="w-3 h-3" /> {recipe.time}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-zinc-900 leading-snug mb-2 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium line-clamp-2 mb-4">
                    {recipe.description}
                  </p>

                  {/* Macros Box */}
                  <div className="grid grid-cols-4 gap-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-100 text-center mb-5">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase">Kcal</div>
                      <div className="text-sm font-black text-zinc-900">{recipe.calories}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-rose-500 uppercase">Białko</div>
                      <div className="text-sm font-black text-rose-600">{recipe.protein}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-orange-500 uppercase">Węgle</div>
                      <div className="text-sm font-black text-orange-600">{recipe.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-sky-500 uppercase">Tłuszcz</div>
                      <div className="text-sm font-black text-sky-600">{recipe.fat}g</div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setRecipeTargetMeal(recipe.category);
                    }}
                    className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" /> Składniki & Krok po kroku
                  </button>
                  <button
                    onClick={() => handleAddRecipeToDiary(recipe, recipe.category)}
                    className="px-3.5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1 shadow-sm"
                    title="Dodaj bezpośrednio do dziennika"
                  >
                    <Plus className="w-3.5 h-3.5 text-lime-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ZAKŁADKA: KALKULATOR TDEE / BMR & MAKRO */}
      {/* ========================================================================= */}
      {activeTab === 'kalkulator' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form (lg:col 6) */}
            <div className="lg:col-span-6 bg-white p-7 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-lime-100 text-lime-800 rounded-2xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Kalkulator Zapotrzebowania (BMR / TDEE)</h3>
                  <p className="text-xs font-medium text-zinc-500">Wprowadź swoje parametry ciała, aby obliczyć idealny bilans.</p>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Płeć</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcGender('male')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black border transition-all",
                      calcGender === 'male' ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    👨 Mężczyzna
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGender('female')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black border transition-all",
                      calcGender === 'female' ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    👩 Kobieta
                  </button>
                </div>
              </div>

              {/* Age, Weight, Height */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1.5">Wiek (lata)</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1.5">Waga (kg)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1.5">Wzrost (cm)</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Poziom Aktywności</label>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs sm:text-sm font-bold text-zinc-900 bg-zinc-50"
                >
                  <option value={1.2}>Siedzący tryb życia (brak treningów)</option>
                  <option value={1.375}>Niska aktywność (1-2 treningi w tyg.)</option>
                  <option value={1.55}>Umiarkowana aktywność (3-4 treningi w tyg.)</option>
                  <option value={1.725}>Wysoka aktywność (5-6 ciężkich treningów)</option>
                  <option value={1.9}>Bardzo wysoka (sportowiec wyczynowy / praca fizyczna)</option>
                </select>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Główny Cel Sylwetkowy</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCalcGoal('cut')}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      calcGoal === 'cut' ? "bg-rose-50 border-rose-300 text-rose-950 font-black shadow-sm" : "bg-zinc-50 border-zinc-200 text-zinc-600 font-bold"
                    )}
                  >
                    <div className="text-sm font-black">Redukcja</div>
                    <div className="text-[10px] text-rose-600">-400 kcal</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGoal('maintain')}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      calcGoal === 'maintain' ? "bg-lime-50 border-lime-300 text-lime-950 font-black shadow-sm" : "bg-zinc-50 border-zinc-200 text-zinc-600 font-bold"
                    )}
                  >
                    <div className="text-sm font-black">Utrzymanie</div>
                    <div className="text-[10px] text-lime-700">0 kcal</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGoal('bulk')}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      calcGoal === 'bulk' ? "bg-blue-50 border-blue-300 text-blue-950 font-black shadow-sm" : "bg-zinc-50 border-zinc-200 text-zinc-600 font-bold"
                    )}
                  >
                    <div className="text-sm font-black">Budowa Masy</div>
                    <div className="text-[10px] text-blue-600">+350 kcal</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Output Results Hero (lg:col 6) */}
            <div className="lg:col-span-6 bg-zinc-950 text-white p-7 md:p-8 rounded-[2.5rem] shadow-xl border border-zinc-900 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-lime-400 mb-6">
                  <Scale className="w-4 h-4" /> Twoje Rekomendowane Zapotrzebowanie
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-xs font-bold text-zinc-400 uppercase">BMR (Podstawowe)</div>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-1">{calculatedTDEE.bmr} <span className="text-sm font-normal text-zinc-400">kcal</span></div>
                  </div>
                  <div className="bg-lime-400/10 p-4 rounded-2xl border border-lime-400/20">
                    <div className="text-xs font-bold text-lime-400 uppercase">TDEE Docelowe</div>
                    <div className="text-2xl sm:text-3xl font-black text-lime-400 mt-1">{calculatedTDEE.tdee} <span className="text-sm font-normal text-lime-300">kcal</span></div>
                  </div>
                </div>

                {/* Macro Target Breakdown */}
                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-300 mb-3">
                  Sugerowany Podział Makroskładników:
                </h4>

                <div className="space-y-3">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-white">Białko (2.0-2.2g / kg m.c.)</span>
                    </div>
                    <span className="text-sm font-black text-rose-400">{calculatedTDEE.protein}g <span className="text-xs text-zinc-400">({calculatedTDEE.protein * 4} kcal)</span></span>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-xs font-bold text-white">Węglowodany (paliwo energetyczne)</span>
                    </div>
                    <span className="text-sm font-black text-orange-400">{calculatedTDEE.carbs}g <span className="text-xs text-zinc-400">({calculatedTDEE.carbs * 4} kcal)</span></span>
                  </div>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-sky-500" />
                      <span className="text-xs font-bold text-white">Tłuszcze (gospodarka hormonalna)</span>
                    </div>
                    <span className="text-sm font-black text-sky-400">{calculatedTDEE.fat}g <span className="text-xs text-zinc-400">({calculatedTDEE.fat * 9} kcal)</span></span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    showToast(`Zaktualizowano profil diety: Cel ${calculatedTDEE.tdee} kcal dziennie.`);
                    setActiveTab('dziennik');
                  }}
                  className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-zinc-950 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg active:scale-98"
                >
                  Przejdź do Dziennika i realizuj ten cel
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SZYBKI WPIS RĘCZNY POSIŁKU */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAddForm && (
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
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900">Nowy Wpis w Dzienniku</h3>
                    <p className="text-xs font-semibold text-zinc-400">Data: {date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Pora posiłku
                  </label>
                  <select
                    value={targetMealType}
                    onChange={(e) => setTargetMealType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900 bg-zinc-50"
                  >
                    {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Nazwa posiłku lub produktu
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Omlet z 3 jaj z awokado i pieczywem"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Wartość energetyczna (Kcal)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="np. 450"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-bold text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-rose-600 uppercase mb-1">Białko (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-orange-600 uppercase mb-1">Węgle (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-sky-600 uppercase mb-1">Tłuszcz (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm shadow-md"
                  >
                    Zapisz wpis
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: TWORZENIE WŁASNEGO PRODUKTU / POSIŁKU W BAZIE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCreateCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-zinc-950 text-lime-400 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-zinc-900">Stwórz Własny Produkt</h3>
                    <p className="text-xs font-semibold text-zinc-400">Dodaj do swojej trwałej bazy dań</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateCustomModal(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Nazwa produktu / dania
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Twaróg półtłusty z miodem"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Kategoria
                    </label>
                    <select
                      value={customForm.category}
                      onChange={(e) => setCustomForm({ ...customForm, category: e.target.value as any })}
                      className="w-full px-3 py-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 bg-zinc-50"
                    >
                      <option value="Białkowe">Białkowe</option>
                      <option value="Węglowodanowe">Węglowodanowe</option>
                      <option value="Tłuszczowe">Tłuszczowe</option>
                      <option value="Dania Gotowe">Dania Gotowe</option>
                      <option value="Owoce & Warzywa">Owoce & Warzywa</option>
                      <option value="Inne">Inne</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Jednostka porcji
                    </label>
                    <input
                      type="text"
                      placeholder="np. 100g, 1 miska, 1 szt."
                      value={customForm.servingUnit}
                      onChange={(e) => setCustomForm({ ...customForm, servingUnit: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Kalorie w tej porcji (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="np. 220"
                    value={customForm.calories}
                    onChange={(e) => setCustomForm({ ...customForm, calories: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-black text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-rose-600 uppercase mb-1">Białko (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customForm.protein}
                      onChange={(e) => setCustomForm({ ...customForm, protein: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-orange-600 uppercase mb-1">Węgle (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customForm.carbs}
                      onChange={(e) => setCustomForm({ ...customForm, carbs: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-sky-600 uppercase mb-1">Tłuszcz (g)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customForm.fat}
                      onChange={(e) => setCustomForm({ ...customForm, fat: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateCustomModal(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm shadow-md"
                  >
                    Zapisz w Bazie
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: SZYBKIE DODAWANIE Z BAZY DO DZIENNIKA (Z PORCJOWANIEM) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedCustomFood && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2 bg-zinc-50 rounded-2xl">{selectedCustomFood.icon || '🥗'}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-zinc-900">{selectedCustomFood.name}</h3>
                    <p className="text-xs text-zinc-400 font-bold">Baza: {selectedCustomFood.servingUnit}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomFood(null)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 my-4">
                {/* Meal Select */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Docelowy posiłek:</label>
                  <select
                    value={customTargetMeal}
                    onChange={(e) => setCustomTargetMeal(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900 bg-zinc-50"
                  >
                    {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Multiplier Presets */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1.5">Wielkość porcji:</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[0.5, 1, 1.5, 2].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCustomPortionCount(val)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-black border transition-all",
                          customPortionCount === val ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        )}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-500">Własny mnożnik:</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={customPortionCount}
                      onChange={(e) => setCustomPortionCount(parseFloat(e.target.value) || 1)}
                      className="w-24 px-3 py-1.5 border border-zinc-200 rounded-xl text-xs font-black text-center"
                    />
                  </div>
                </div>

                {/* Scaled Nutrients Summary */}
                <div className="bg-zinc-950 text-white p-4 rounded-2xl">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase mb-1">Po przeliczeniu:</div>
                  <div className="text-2xl font-black text-lime-400 mb-2">
                    {Math.round(selectedCustomFood.calories * customPortionCount)} <span className="text-xs font-bold text-zinc-400">kcal</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-300">
                    <span>Białko: <strong className="text-rose-400">{Math.round(selectedCustomFood.protein * customPortionCount)}g</strong></span>
                    <span>Węgle: <strong className="text-orange-400">{Math.round(selectedCustomFood.carbs * customPortionCount)}g</strong></span>
                    <span>Tłuszcz: <strong className="text-sky-400">{Math.round(selectedCustomFood.fat * customPortionCount)}g</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomFood(null)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 font-bold text-xs text-zinc-600 hover:bg-zinc-50"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCustomToDiary(selectedCustomFood, customPortionCount, customTargetMeal)}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-lime-400" /> Dodaj do dnia
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: SZCZEGÓŁY PRZEPISU & KROK PO KROKU */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-4xl shrink-0">
                    {selectedRecipe.icon}
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-950 text-[10px] font-black uppercase">
                      {selectedRecipe.category} • {selectedRecipe.time}
                    </span>
                    <h3 className="text-xl font-black text-zinc-900 mt-1">{selectedRecipe.title}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Macro Bar */}
              <div className="grid grid-cols-4 gap-2 bg-zinc-950 text-white p-4 rounded-2xl text-center mb-6">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Kalorie</div>
                  <div className="text-lg font-black text-lime-400">{selectedRecipe.calories} kcal</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Białko</div>
                  <div className="text-lg font-black text-rose-400">{selectedRecipe.protein}g</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Węglowodany</div>
                  <div className="text-lg font-black text-orange-400">{selectedRecipe.carbs}g</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Tłuszcze</div>
                  <div className="text-lg font-black text-sky-400">{selectedRecipe.fat}g</div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="mb-6">
                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-orange-500" /> Składniki ({selectedRecipe.ingredients.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-zinc-50 rounded-xl text-xs">
                      <span className="font-bold text-zinc-800">{ing.name}</span>
                      <span className="font-black text-orange-600 bg-white px-2 py-0.5 rounded-md border border-zinc-200/60 shrink-0">
                        {ing.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Instructions */}
              <div className="mb-6">
                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-500" /> Sposób przygotowania:
                </h4>
                <div className="space-y-2.5">
                  {selectedRecipe.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-3 text-xs leading-relaxed">
                      <div className="w-6 h-6 rounded-full bg-zinc-900 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </div>
                      <p className="text-zinc-700 font-medium pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Tip */}
              {selectedRecipe.tip && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 font-medium flex items-start gap-2.5 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Wskazówka:</strong> {selectedRecipe.tip}
                  </div>
                </div>
              )}

              {/* Add to Diary Controls in Modal */}
              <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-zinc-500">Dodaj do:</span>
                  <select
                    value={recipeTargetMeal}
                    onChange={(e) => setRecipeTargetMeal(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 bg-zinc-50"
                  >
                    {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 font-bold text-xs text-zinc-600 hover:bg-zinc-50"
                  >
                    Zamknij
                  </button>
                  <button
                    onClick={() => handleAddRecipeToDiary(selectedRecipe, recipeTargetMeal)}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-lime-400" /> Dodaj do dziennika
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
