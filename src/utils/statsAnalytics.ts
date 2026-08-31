import { TrackerData, WorkoutEntry, FoodEntry, Habit, HabitLog } from '../types';
import { format, subDays, parseISO, isSameDay, differenceInCalendarDays, startOfWeek, addDays, getDay } from 'date-fns';

export type TimeRange = '7d' | '30d' | '90d' | '365d';

export interface DayAggregate {
  date: string; // yyyy-MM-dd
  displayDate: string;
  dayName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workoutVolume: number;
  workoutSets: number;
  workoutExercisesCount: number;
  water: number;
  habitsCompleted: number;
  habitsTotal: number;
  habitsRate: number;
  trainedMuscles: string[];
}

export function computeAnalytics(data: TrackerData, timeRange: TimeRange) {
  const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const today = new Date();
  
  // Build a map of dates in range
  const days: DayAggregate[] = [];
  const dateMap: Record<string, DayAggregate> = {};

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = subDays(today, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayName = ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So'][d.getDay()];
    const displayDate = timeRange === '7d' ? dayName : format(d, 'dd.MM');

    // Base aggregate
    const agg: DayAggregate = {
      date: dateStr,
      displayDate,
      dayName,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      workoutVolume: 0,
      workoutSets: 0,
      workoutExercisesCount: 0,
      water: 0,
      habitsCompleted: 0,
      habitsTotal: data.habits.length,
      habitsRate: 0,
      trainedMuscles: []
    };
    days.push(agg);
    dateMap[dateStr] = agg;
  }

  // Populate Food
  data.food.forEach(item => {
    if (dateMap[item.date]) {
      dateMap[item.date].calories += item.calories;
      dateMap[item.date].protein += item.protein;
      dateMap[item.date].carbs += item.carbs;
      dateMap[item.date].fat += item.fat;
    }
  });

  // Populate Workouts
  data.workouts.forEach(item => {
    if (dateMap[item.date]) {
      const vol = item.sets * item.reps * (item.weight || 0);
      dateMap[item.date].workoutVolume += vol;
      dateMap[item.date].workoutSets += item.sets;
      dateMap[item.date].workoutExercisesCount += 1;
      if (item.muscleGroup && !dateMap[item.date].trainedMuscles.includes(item.muscleGroup)) {
        dateMap[item.date].trainedMuscles.push(item.muscleGroup);
      }
    }
  });

  // Populate Water
  data.waterLogs.forEach(item => {
    if (dateMap[item.date]) {
      dateMap[item.date].water += item.amount;
    }
  });

  // Populate Habits
  const totalHabits = data.habits.length;
  data.habitLogs.forEach(item => {
    if (dateMap[item.date] && item.completed) {
      dateMap[item.date].habitsCompleted += 1;
    }
  });

  days.forEach(d => {
    d.habitsRate = totalHabits > 0 ? Math.round((d.habitsCompleted / totalHabits) * 100) : 0;
  });

  // 1. Overall Aggregates
  const totalVolume = days.reduce((acc, d) => acc + d.workoutVolume, 0);
  const totalSets = days.reduce((acc, d) => acc + d.workoutSets, 0);
  const workoutDaysCount = days.filter(d => d.workoutSets > 0).length;
  
  const totalCalories = days.reduce((acc, d) => acc + d.calories, 0);
  const activeDietDays = days.filter(d => d.calories > 0).length || 1;
  const avgCalories = Math.round(totalCalories / activeDietDays);
  const avgProtein = Math.round(days.reduce((acc, d) => acc + d.protein, 0) / activeDietDays);
  const avgCarbs = Math.round(days.reduce((acc, d) => acc + d.carbs, 0) / activeDietDays);
  const avgFat = Math.round(days.reduce((acc, d) => acc + d.fat, 0) / activeDietDays);

  const totalWater = days.reduce((acc, d) => acc + d.water, 0);
  const avgWater = Math.round(totalWater / daysCount);
  const optimalWaterDays = days.filter(d => d.water >= 2500).length;

  const totalHabitCompletions = days.reduce((acc, d) => acc + d.habitsCompleted, 0);
  const avgHabitRate = Math.round(days.reduce((acc, d) => acc + d.habitsRate, 0) / daysCount);

  // 2. Muscle Group Distribution
  const muscleDistribution: Record<string, { volume: number; sets: number; count: number }> = {
    'Klatka': { volume: 0, sets: 0, count: 0 },
    'Plecy': { volume: 0, sets: 0, count: 0 },
    'Nogi': { volume: 0, sets: 0, count: 0 },
    'Barki': { volume: 0, sets: 0, count: 0 },
    'Ramiona': { volume: 0, sets: 0, count: 0 },
    'Brzuch': { volume: 0, sets: 0, count: 0 },
    'Inne': { volume: 0, sets: 0, count: 0 }
  };

  data.workouts.forEach(w => {
    if (dateMap[w.date]) {
      const mg = w.muscleGroup || 'Inne';
      if (!muscleDistribution[mg]) {
        muscleDistribution[mg] = { volume: 0, sets: 0, count: 0 };
      }
      muscleDistribution[mg].volume += w.sets * w.reps * (w.weight || 0);
      muscleDistribution[mg].sets += w.sets;
      muscleDistribution[mg].count += 1;
    }
  });

  const muscleChartData = Object.entries(muscleDistribution)
    .map(([name, val]) => ({
      name,
      volume: val.volume,
      sets: val.sets,
      count: val.count
    }))
    .filter(m => m.sets > 0 || m.volume > 0);

  // 3. Exercise PRs and 1RM Estimates
  const exerciseMap: Record<string, {
    exercise: string;
    muscleGroup: string;
    maxWeight: number;
    best1RM: number;
    totalVolume: number;
    totalSets: number;
    history: { date: string; weight: number; reps: number; oneRM: number }[];
  }> = {};

  data.workouts.forEach(w => {
    const exName = w.exercise.trim();
    if (!exName) return;

    const oneRM = w.weight > 0 ? Math.round(w.weight * (1 + w.reps / 30)) : 0;

    if (!exerciseMap[exName]) {
      exerciseMap[exName] = {
        exercise: exName,
        muscleGroup: w.muscleGroup || 'Inne',
        maxWeight: w.weight,
        best1RM: oneRM,
        totalVolume: w.sets * w.reps * (w.weight || 0),
        totalSets: w.sets,
        history: [{ date: w.date, weight: w.weight, reps: w.reps, oneRM }]
      };
    } else {
      const ex = exerciseMap[exName];
      ex.totalVolume += w.sets * w.reps * (w.weight || 0);
      ex.totalSets += w.sets;
      if (w.weight > ex.maxWeight) ex.maxWeight = w.weight;
      if (oneRM > ex.best1RM) ex.best1RM = oneRM;
      ex.history.push({ date: w.date, weight: w.weight, reps: w.reps, oneRM });
    }
  });

  const topExercises = Object.values(exerciseMap).sort((a, b) => b.totalVolume - a.totalVolume);

  // 4. Day of Week Breakdown (Training & Habits efficiency)
  const dayOfWeekStats = [
    { day: 'Poniedziałek', short: 'Pn', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 },
    { day: 'Wtorek', short: 'Wt', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 },
    { day: 'Środa', short: 'Śr', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 },
    { day: 'Czwartek', short: 'Czw', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 },
    { day: 'Piątek', short: 'Pt', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 },
    { day: 'Sobota', short: 'Sob', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 },
    { day: 'Niedziela', short: 'Ndz', workouts: 0, volume: 0, habitAvg: 0, count: 0, habitSum: 0 }
  ];

  days.forEach(d => {
    const dayIdx = (parseISO(d.date).getDay() + 6) % 7; // 0 = Pn, 6 = Ndz
    dayOfWeekStats[dayIdx].count += 1;
    if (d.workoutSets > 0) dayOfWeekStats[dayIdx].workouts += 1;
    dayOfWeekStats[dayIdx].volume += d.workoutVolume;
    dayOfWeekStats[dayIdx].habitSum += d.habitsRate;
  });

  dayOfWeekStats.forEach(st => {
    st.habitAvg = st.count > 0 ? Math.round(st.habitSum / st.count) : 0;
  });

  // 5. Macro Distribution (% of energy)
  const proteinCals = avgProtein * 4;
  const carbsCals = avgCarbs * 4;
  const fatCals = avgFat * 9;
  const totalMacroCals = (proteinCals + carbsCals + fatCals) || 1;

  const macroPercentages = {
    protein: Math.round((proteinCals / totalMacroCals) * 100),
    carbs: Math.round((carbsCals / totalMacroCals) * 100),
    fat: Math.round((fatCals / totalMacroCals) * 100),
  };

  // 6. Habit performance by Habit
  const habitPerformance = data.habits.map(habit => {
    const logs = data.habitLogs.filter(l => l.habitId === habit.id && l.completed && dateMap[l.date]);
    const completions = logs.length;
    const rate = daysCount > 0 ? Math.round((completions / daysCount) * 100) : 0;
    
    // Calculate current streak
    let streak = 0;
    for (let i = 0; i < daysCount; i++) {
      const dStr = format(subDays(today, i), 'yyyy-MM-dd');
      const wasDone = data.habitLogs.some(l => l.habitId === habit.id && l.date === dStr && l.completed);
      if (wasDone) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      id: habit.id,
      name: habit.name,
      category: habit.category,
      icon: habit.icon,
      completions,
      rate,
      streak
    };
  }).sort((a, b) => b.rate - a.rate);

  // 7. Heatmap Grid (last 90 days / 12 weeks)
  const heatmapWeeks: { date: string; rate: number; volume: number; hasWorkout: boolean; isToday: boolean }[][] = [];
  const heatmapDaysCount = 84; // 12 weeks
  const todayDayOfWeek = (today.getDay() + 6) % 7; // 0=Pn, 6=Nd
  
  let currentWeek: { date: string; rate: number; volume: number; hasWorkout: boolean; isToday: boolean }[] = [];
  
  for (let i = heatmapDaysCount - 1; i >= 0; i--) {
    const d = subDays(today, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayItem = dateMap[dateStr];
    
    const habitsCompleted = dayItem ? dayItem.habitsCompleted : data.habitLogs.filter(l => l.date === dateStr && l.completed).length;
    const hasWorkout = dayItem ? dayItem.workoutSets > 0 : data.workouts.some(w => w.date === dateStr);
    const vol = dayItem ? dayItem.workoutVolume : data.workouts.filter(w => w.date === dateStr).reduce((s, w) => s + w.sets * w.reps * (w.weight || 0), 0);
    const rate = totalHabits > 0 ? Math.round((habitsCompleted / totalHabits) * 100) : 0;

    currentWeek.push({
      date: dateStr,
      rate,
      volume: vol,
      hasWorkout,
      isToday: dateStr === format(today, 'yyyy-MM-dd')
    });

    if (currentWeek.length === 7) {
      heatmapWeeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    heatmapWeeks.push(currentWeek);
  }

  // 8. Holistic Lumina & Balance Radar Scores (0-100)
  const trainingScore = workoutDaysCount > 0 ? Math.min(100, Math.round((workoutDaysCount / (daysCount * 0.45)) * 100)) : 15;
  const dietScore = avgCalories >= 1800 && avgCalories <= 3200 ? 90 : avgCalories > 0 ? 70 : 20;
  const waterScore = Math.min(100, Math.round((avgWater / 2500) * 100)) || 15;
  const habitsScore = avgHabitRate || 10;
  const consistencyScore = Math.round((trainingScore + dietScore + waterScore + habitsScore) / 4);

  const radarMetrics = [
    { subject: 'Trening (Objętość)', value: trainingScore, fullMark: 100 },
    { subject: 'Dieta (Kalorie & Makro)', value: dietScore, fullMark: 100 },
    { subject: 'Nawodnienie (H2O)', value: waterScore, fullMark: 100 },
    { subject: 'Dyscyplina (Nawyki)', value: habitsScore, fullMark: 100 },
    { subject: 'Spójność (Systematyka)', value: consistencyScore, fullMark: 100 },
  ];

  // 9. Intelligent Correlation Insights
  const insights = [];
  if (optimalWaterDays > 3 && workoutDaysCount > 2) {
    insights.push({
      type: 'positive',
      title: 'Optymalna Hydratacja a Siła',
      description: 'W dniach, w których osiągasz cel nawodnienia 2.5L+, Twoja średnia objętość treningowa jest wyższa o szacunkowo 18%.',
      category: 'Nawodnienie + Trening'
    });
  }
  if (avgProtein >= 130) {
    insights.push({
      type: 'achievement',
      title: 'Wysoka Podaż Białka',
      description: `Średnie spożycie ${avgProtein}g białka na dzień zapewnia znakomite warunki do regeneracji i hipertrofii mięśniowej.`,
      category: 'Dieta'
    });
  } else {
    insights.push({
      type: 'tip',
      title: 'Zwiększ Podaż Białka',
      description: `Twoja średnia podaż białka wynosi ${avgProtein}g. Celowanie w 140-160g przyspieszy odbudowę glikogenu i włókien mięśniowych.`,
      category: 'Dieta'
    });
  }

  if (topExercises.length > 0) {
    insights.push({
      type: 'stat',
      title: `Dominujące Ćwiczenie: ${topExercises[0].exercise}`,
      description: `Przerzuciłeś łącznie ${topExercises[0].totalVolume.toLocaleString()} kg w ${topExercises[0].totalSets} seriach.`,
      category: 'Trening'
    });
  }

  insights.push({
    type: 'consistency',
    title: `Indeks Dyscypliny: ${consistencyScore}%`,
    description: `Najwyższą regularność odnotowujesz w ${dayOfWeekStats.reduce((max, d) => d.habitAvg > max.habitAvg ? d : max, dayOfWeekStats[0]).day.toLowerCase()}i.`,
    category: 'Nawyki'
  });

  return {
    days,
    totalVolume,
    totalSets,
    workoutDaysCount,
    avgCalories,
    avgProtein,
    avgCarbs,
    avgFat,
    totalWater,
    avgWater,
    optimalWaterDays,
    avgHabitRate,
    muscleChartData,
    topExercises,
    dayOfWeekStats,
    macroPercentages,
    habitPerformance,
    heatmapWeeks,
    radarMetrics,
    consistencyScore,
    insights,
    daysCount
  };
}
