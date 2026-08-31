import { useState, useEffect } from 'react';
import { TrackerData, FoodEntry, WorkoutEntry, Habit, HabitLog, Routine, Club, ClubPost, ClubChallenge, UserSettings } from '../types';
import { format, subDays } from 'date-fns';
import { INITIAL_PUBLIC_CLUBS, INITIAL_POSTS, INITIAL_CHALLENGES, generateClubCode, generateInviteLink } from '../data/clubsData';

const STORAGE_KEY = 'lumina_tracker_data';

const initialUserSettings: UserSettings = {
  name: 'Albert',
  lastName: 'Sobczak',
  email: 'albertsobczak6@gmail.com',
  avatar: 'AS',
  city: 'Warszawa',
  bio: 'Dyscyplina i systematyczność każdego dnia. Trening siłowy 4x w tygodniu.',
  weight: 82,
  targetWeight: 80,
  height: 185,
  age: 26,
  gender: 'male',
  activityLevel: 'high',
  dietType: 'Zbilansowana (Wysokobiałkowa)',
  dailyCalorieTarget: 2600,
  dailyProteinTarget: 180,
  dailyCarbsTarget: 290,
  dailyFatTarget: 75,
  dailyWaterTarget: 2800,
  weightUnit: 'kg',
  heightUnit: 'cm',
  waterUnit: 'ml',
  distanceUnit: 'km',
  theme: 'light',
  notifications: {
    workout: true,
    water: true,
    summary: true,
    meals: false,
    clubStreak: true
  },
  connectedDevices: {
    appleWatch: true,
    garmin: false,
    strava: true,
    polar: false,
    suunto: false,
    fitbit: false
  },
  subscriptionPlan: 'pro',
  subscriptionRenewDate: '15 września 2026 r.'
};

const generateInitialData = (): TrackerData => {
  const today = new Date();
  const food: FoodEntry[] = [];
  const workouts: WorkoutEntry[] = [];
  const habitLogs: HabitLog[] = [];
  const waterLogs: { date: string; amount: number }[] = [];

  const habits: Habit[] = [
    { id: 'h1', name: 'Trening siłowy / cardio', category: 'Zdrowie', icon: '🏋️', createdAt: Date.now() },
    { id: 'h2', name: 'Czytanie książki 20 min', category: 'Rozwój', icon: '📚', createdAt: Date.now() },
    { id: 'h3', name: 'Medytacja & Oddech', category: 'Umysł', icon: '🧘', createdAt: Date.now() },
    { id: 'h4', name: 'Sen min. 7.5h', category: 'Zdrowie', icon: '🌙', createdAt: Date.now() },
    { id: 'h5', name: 'Zero cukru dodanego', category: 'Zdrowie', icon: '🥗', createdAt: Date.now() },
  ];

  // Seed last 14 days
  for (let i = 13; i >= 0; i--) {
    const dStr = format(subDays(today, i), 'yyyy-MM-dd');
    const dayOfWeek = subDays(today, i).getDay();

    // Food
    const baseCals = 2350 + (i % 3) * 120;
    food.push(
      {
        id: `f_${i}_1`,
        date: dStr,
        name: 'Owsianka proteinowa z borówkami i masłem orzechowym',
        calories: Math.round(baseCals * 0.3),
        protein: 42,
        carbs: 65,
        fat: 14,
        mealType: 'Śniadanie',
        createdAt: Date.now() - i * 86400000 + 1000
      },
      {
        id: `f_${i}_2`,
        date: dStr,
        name: 'Pieczona pierś z kurczaka, ryż basmati i warzywa',
        calories: Math.round(baseCals * 0.45),
        protein: 64,
        carbs: 88,
        fat: 16,
        mealType: 'Obiad',
        createdAt: Date.now() - i * 86400000 + 2000
      },
      {
        id: `f_${i}_3`,
        date: dStr,
        name: 'Twaróg chudy z orzechami włoskimi i miodem',
        calories: Math.round(baseCals * 0.25),
        protein: 45,
        carbs: 25,
        fat: 18,
        mealType: 'Kolacja',
        createdAt: Date.now() - i * 86400000 + 3000
      }
    );

    // Workouts (approx 4-5 days a week)
    if (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 5) {
      if (dayOfWeek === 1) {
        workouts.push(
          { id: `w_${i}_1`, date: dStr, exercise: 'Wyciskanie sztangi leżąc', muscleGroup: 'Klatka', sets: 4, reps: 8, weight: 100 + (13 - i), createdAt: Date.now() },
          { id: `w_${i}_2`, date: dStr, exercise: 'Wyciskanie hantli na skosie', muscleGroup: 'Klatka', sets: 3, reps: 10, weight: 36, createdAt: Date.now() },
          { id: `w_${i}_3`, date: dStr, exercise: 'Wznosy bokiem na barki', muscleGroup: 'Barki', sets: 4, reps: 15, weight: 14, createdAt: Date.now() },
          { id: `w_${i}_4`, date: dStr, exercise: 'Prostowanie ramion na wyciągu', muscleGroup: 'Ramiona', sets: 3, reps: 12, weight: 35, createdAt: Date.now() }
        );
      } else if (dayOfWeek === 2) {
        workouts.push(
          { id: `w_${i}_1`, date: dStr, exercise: 'Martwy ciąg klasyczny', muscleGroup: 'Plecy', sets: 4, reps: 6, weight: 160 + (13 - i), createdAt: Date.now() },
          { id: `w_${i}_2`, date: dStr, exercise: 'Podciąganie z obciążeniem', muscleGroup: 'Plecy', sets: 4, reps: 8, weight: 15, createdAt: Date.now() },
          { id: `w_${i}_3`, date: dStr, exercise: 'Uginanie ramion z hantlami', muscleGroup: 'Ramiona', sets: 3, reps: 10, weight: 18, createdAt: Date.now() }
        );
      } else if (dayOfWeek === 4) {
        workouts.push(
          { id: `w_${i}_1`, date: dStr, exercise: 'Przysiady ze sztangą', muscleGroup: 'Nogi', sets: 4, reps: 8, weight: 130 + (13 - i), createdAt: Date.now() },
          { id: `w_${i}_2`, date: dStr, exercise: 'Wykroki chodzone', muscleGroup: 'Nogi', sets: 3, reps: 12, weight: 24, createdAt: Date.now() },
          { id: `w_${i}_3`, date: dStr, exercise: 'Wspięcia na łydki stojąc', muscleGroup: 'Nogi', sets: 4, reps: 15, weight: 80, createdAt: Date.now() }
        );
      } else if (dayOfWeek === 5) {
        workouts.push(
          { id: `w_${i}_1`, date: dStr, exercise: 'Żołnierskie wyciskanie OHP', muscleGroup: 'Barki', sets: 4, reps: 8, weight: 65 + (13 - i), createdAt: Date.now() },
          { id: `w_${i}_2`, date: dStr, exercise: 'Wiosłowanie sztangą w opadzie', muscleGroup: 'Plecy', sets: 4, reps: 8, weight: 90, createdAt: Date.now() },
          { id: `w_${i}_3`, date: dStr, exercise: 'Allahy na wyciągu klęcząc', muscleGroup: 'Brzuch', sets: 3, reps: 15, weight: 45, createdAt: Date.now() }
        );
      }
    }

    // Water
    waterLogs.push({
      date: dStr,
      amount: 2250 + (i % 4) * 250
    });

    // Habits
    habits.forEach((h, hIdx) => {
      const isDone = (i + hIdx) % 5 !== 0; // ~80% completion
      if (isDone) {
        habitLogs.push({
          id: `hl_${i}_${h.id}`,
          habitId: h.id,
          date: dStr,
          completed: true
        });
      }
    });
  }

  const initialCustomFoods: TrackerData['customFoods'] = [
    { id: 'cf_1', name: 'Pierś z kurczaka (gotowana/pieczona)', category: 'Białkowe', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingUnit: '100g', servingGrams: 100, icon: '🍗', createdAt: Date.now() },
    { id: 'cf_2', name: 'Jaja kurze całe (klasa L)', category: 'Białkowe', calories: 170, protein: 15, carbs: 1.2, fat: 12, servingUnit: '2 sztuki (120g)', servingGrams: 120, icon: '🥚', createdAt: Date.now() },
    { id: 'cf_3', name: 'Skyr naturalny wysokobiałkowy', category: 'Białkowe', calories: 95, protein: 18, carbs: 6, fat: 0.2, servingUnit: 'kubek (150g)', servingGrams: 150, icon: '🥛', createdAt: Date.now() },
    { id: 'cf_4', name: 'Odżywka białkowa WPC 80', category: 'Białkowe', calories: 120, protein: 24, carbs: 2.2, fat: 1.8, servingUnit: 'miarka (30g)', servingGrams: 30, icon: '🥤', createdAt: Date.now() },
    { id: 'cf_5', name: 'Łosoś atlantycki pieczony', category: 'Białkowe', calories: 310, protein: 30, carbs: 0, fat: 20, servingUnit: 'filet (150g)', servingGrams: 150, icon: '🐟', createdAt: Date.now() },
    { id: 'cf_6', name: 'Twaróg chudy', category: 'Białkowe', calories: 86, protein: 18, carbs: 3.5, fat: 0.5, servingUnit: '100g', servingGrams: 100, icon: '🧀', createdAt: Date.now() },
    { id: 'cf_7', name: 'Ryż basmati / jaśminowy (suchy)', category: 'Węglowodanowe', calories: 350, protein: 8, carbs: 77, fat: 1, servingUnit: '100g', servingGrams: 100, icon: '🍚', createdAt: Date.now() },
    { id: 'cf_8', name: 'Płatki owsiane górskie', category: 'Węglowodanowe', calories: 375, protein: 13, carbs: 62, fat: 7, servingUnit: '100g', servingGrams: 100, icon: '🥣', createdAt: Date.now() },
    { id: 'cf_9', name: 'Kasza gryczana / jaglana (sucha)', category: 'Węglowodanowe', calories: 340, protein: 12, carbs: 65, fat: 3, servingUnit: '100g', servingGrams: 100, icon: '🌾', createdAt: Date.now() },
    { id: 'cf_10', name: 'Ziemniaki gotowane / pieczone', category: 'Węglowodanowe', calories: 150, protein: 4, carbs: 34, fat: 0.2, servingUnit: 'porcja (200g)', servingGrams: 200, icon: '🥔', createdAt: Date.now() },
    { id: 'cf_11', name: 'Banan świeży', category: 'Owoce & Warzywa', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, servingUnit: '1 sztuka (120g)', servingGrams: 120, icon: '🍌', createdAt: Date.now() },
    { id: 'cf_12', name: 'Masło orzechowe 100% orzechy', category: 'Tłuszczowe', calories: 150, protein: 7, carbs: 4, fat: 12.5, servingUnit: 'łyżka (25g)', servingGrams: 25, icon: '🥜', createdAt: Date.now() },
    { id: 'cf_13', name: 'Oliwa z oliwek Extra Virgin', category: 'Tłuszczowe', calories: 88, protein: 0, carbs: 0, fat: 10, servingUnit: 'łyżka (10g)', servingGrams: 10, icon: '🫒', createdAt: Date.now() },
    { id: 'cf_14', name: 'Tortilla Fit z kurczakiem i warzywami', category: 'Dania Gotowe', calories: 450, protein: 38, carbs: 42, fat: 12, servingUnit: '1 wrap (300g)', servingGrams: 300, icon: '🌯', createdAt: Date.now() },
    { id: 'cf_15', name: 'Poke Bowl z łososiem, ryżem i awokado', category: 'Dania Gotowe', calories: 580, protein: 35, carbs: 65, fat: 18, servingUnit: '1 miska (400g)', servingGrams: 400, icon: '🥗', createdAt: Date.now() },
  ];

  return {
    food,
    workouts,
    routines: [
      {
        id: 'r1',
        name: 'Push Day (Klatka, Barki, Triceps)',
        exercises: [
          { exercise: 'Wyciskanie sztangi leżąc', muscleGroup: 'Klatka', sets: 4, reps: 8 },
          { exercise: 'Wyciskanie hantli na ławce skośnej', muscleGroup: 'Klatka', sets: 3, reps: 10 },
          { exercise: 'OHP (Wyciskanie Żołnierskie)', muscleGroup: 'Barki', sets: 4, reps: 8 },
          { exercise: 'Wznosy ramion bokiem', muscleGroup: 'Barki', sets: 4, reps: 15 },
          { exercise: 'Francuskie wyciskanie', muscleGroup: 'Ramiona', sets: 3, reps: 12 }
        ],
        createdAt: Date.now()
      },
      {
        id: 'r2',
        name: 'Pull Day (Plecy, Biceps, Tył Barku)',
        exercises: [
          { exercise: 'Martwy ciąg klasyczny', muscleGroup: 'Plecy', sets: 4, reps: 6 },
          { exercise: 'Podciąganie na drążku z obciążeniem', muscleGroup: 'Plecy', sets: 4, reps: 8 },
          { exercise: 'Wiosłowanie sztangą w opadzie', muscleGroup: 'Plecy', sets: 4, reps: 10 },
          { exercise: 'Uginanie przedramion z hantlami', muscleGroup: 'Ramiona', sets: 3, reps: 12 }
        ],
        createdAt: Date.now()
      }
    ],
    habits,
    habitLogs,
    waterLogs,
    customFoods: initialCustomFoods,
    currentClub: null,
    userClubs: INITIAL_PUBLIC_CLUBS,
    clubPosts: INITIAL_POSTS,
    clubChallenges: INITIAL_CHALLENGES,
    userSettings: initialUserSettings
  };
};

export function useData() {
  const [data, setData] = useState<TrackerData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.food) && (parsed.food.length > 0 || parsed.workouts?.length > 0)) {
          if (!parsed.routines) parsed.routines = [];
          if (!parsed.waterLogs) parsed.waterLogs = [];
          if (!parsed.customFoods || parsed.customFoods.length === 0) {
            parsed.customFoods = generateInitialData().customFoods;
          }
          if (!parsed.userClubs || parsed.userClubs.length === 0) {
            parsed.userClubs = INITIAL_PUBLIC_CLUBS;
          }
          if (!parsed.clubPosts || parsed.clubPosts.length === 0) {
            parsed.clubPosts = INITIAL_POSTS;
          }
          if (!parsed.clubChallenges || parsed.clubChallenges.length === 0) {
            parsed.clubChallenges = INITIAL_CHALLENGES;
          }
          if (!parsed.userSettings) {
            parsed.userSettings = initialUserSettings;
          } else {
            parsed.userSettings = { ...initialUserSettings, ...parsed.userSettings };
          }
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return generateInitialData();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addFood = (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    setData(prev => ({ ...prev, food: [...prev.food, newEntry] }));
  };

  const deleteFood = (id: string) => {
    setData(prev => ({ ...prev, food: prev.food.filter(f => f.id !== id) }));
  };

  const addCustomFood = (item: Omit<TrackerData['customFoods'][0], 'id' | 'createdAt'>) => {
    const newItem: TrackerData['customFoods'][0] = {
      ...item,
      id: 'cf_' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    setData(prev => ({
      ...prev,
      customFoods: [newItem, ...(prev.customFoods || [])]
    }));
  };

  const deleteCustomFood = (id: string) => {
    setData(prev => ({
      ...prev,
      customFoods: (prev.customFoods || []).filter(c => c.id !== id)
    }));
  };

  const updateCustomFood = (id: string, updated: Partial<TrackerData['customFoods'][0]>) => {
    setData(prev => ({
      ...prev,
      customFoods: (prev.customFoods || []).map(c => c.id === id ? { ...c, ...updated } : c)
    }));
  };

  const addWorkout = (entry: Omit<WorkoutEntry, 'id' | 'createdAt'>) => {
    const newEntry: WorkoutEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    setData(prev => ({ ...prev, workouts: [...prev.workouts, newEntry] }));
  };

  const deleteWorkout = (id: string) => {
    setData(prev => ({ ...prev, workouts: prev.workouts.filter(w => w.id !== id) }));
  };

  const addRoutine = (entry: Omit<Routine, 'id' | 'createdAt'>) => {
    const newRoutine: Routine = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    setData(prev => ({ ...prev, routines: [...prev.routines, newRoutine] }));
  };

  const deleteRoutine = (id: string) => {
    setData(prev => ({ ...prev, routines: prev.routines.filter(r => r.id !== id) }));
  };

  const addHabit = (
    name: string, 
    category: Habit['category'] = 'Inne', 
    icon?: string,
    timeOfDay?: Habit['timeOfDay'],
    description?: string,
    targetFrequency?: string
  ) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      category,
      icon: icon || '✨',
      timeOfDay: timeOfDay || 'Cały Dzień',
      description: description || '',
      targetFrequency: targetFrequency || 'Codziennie (7x/tydz)',
      createdAt: Date.now(),
    };
    setData(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const updateHabit = (id: string, updated: Partial<Habit>) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, ...updated } : h)
    }));
  };

  const deleteHabit = (id: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
      habitLogs: prev.habitLogs.filter(l => l.habitId !== id),
    }));
  };

  const toggleHabit = (habitId: string, date: string) => {
    setData(prev => {
      const existingLogIndex = prev.habitLogs.findIndex(l => l.habitId === habitId && l.date === date);
      
      if (existingLogIndex >= 0) {
        const newLogs = [...prev.habitLogs];
        newLogs[existingLogIndex] = {
          ...newLogs[existingLogIndex],
          completed: !newLogs[existingLogIndex].completed
        };
        return { ...prev, habitLogs: newLogs };
      } else {
        const newLog: HabitLog = {
          id: Math.random().toString(36).substring(2, 9),
          habitId,
          date,
          completed: true,
        };
        return { ...prev, habitLogs: [...prev.habitLogs, newLog] };
      }
    });
  };

  const addWater = (date: string, amount: number) => {
    setData(prev => ({
      ...prev,
      waterLogs: [...prev.waterLogs, { date, amount }]
    }));
  };

  const resetWater = (date: string) => {
    setData(prev => ({
      ...prev,
      waterLogs: prev.waterLogs.filter(w => w.date !== date)
    }));
  };

  // CLUB ACTIONS
  const createClub = (
    name: string,
    city: string,
    isPrivate: boolean,
    category: string = 'Nawyki & Dyscyplina',
    description: string = '',
    icon: string = '⚡'
  ): Club => {
    const code = generateClubCode(city);
    const newClub: Club = {
      id: `club_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code,
      name: name.trim(),
      city: city.trim(),
      isPrivate,
      category,
      description: description.trim() || `Oficjalny klub dyscypliny i nawyków dla ${city}.`,
      icon: icon || '⚡',
      createdAt: Date.now(),
      memberCount: 1,
      inviteLink: generateInviteLink(code),
      isOwner: true
    };

    setData(prev => ({
      ...prev,
      currentClub: newClub,
      userClubs: [newClub, ...(prev.userClubs || INITIAL_PUBLIC_CLUBS).filter(c => c.id !== newClub.id)]
    }));

    return newClub;
  };

  const joinClubByCode = (inputCode: string): { success: boolean; message: string; club?: Club } => {
    const cleanCode = inputCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Check in user clubs or initial public clubs
    const allClubs = [...(data.userClubs || INITIAL_PUBLIC_CLUBS), ...INITIAL_PUBLIC_CLUBS];
    const found = allClubs.find(c => c.code.replace(/[^A-Z0-9]/g, '').toUpperCase() === cleanCode);

    if (found) {
      const updatedClub: Club = { ...found, memberCount: found.memberCount + 1 };
      setData(prev => ({
        ...prev,
        currentClub: updatedClub,
        userClubs: [updatedClub, ...(prev.userClubs || []).filter(c => c.id !== updatedClub.id)]
      }));
      return { success: true, message: `Pomyślnie dołączono do klubu: ${found.name}!`, club: updatedClub };
    }

    // Dynamic match if 6-9 chars provided
    if (cleanCode.length >= 6) {
      const formattedCode = cleanCode.length === 9 
        ? `${cleanCode.substring(0,3)}-${cleanCode.substring(3,6)}-${cleanCode.substring(6,9)}`
        : cleanCode;

      const dynamicClub: Club = {
        id: `club_joined_${Date.now()}`,
        code: formattedCode,
        name: `Społeczność ${cleanCode.substring(0, 3)} Power Club`,
        city: 'Polska',
        isPrivate: true,
        category: 'Nawyki & Dyscyplina',
        description: 'Prywatna społeczność dołączona poprzez specjalny 9-znakowy kod.',
        icon: '🛡️',
        createdAt: Date.now(),
        memberCount: 12,
        inviteLink: generateInviteLink(formattedCode),
        isOwner: false
      };

      setData(prev => ({
        ...prev,
        currentClub: dynamicClub,
        userClubs: [dynamicClub, ...(prev.userClubs || [])]
      }));

      return { success: true, message: `Pomyślnie dołączono do prywatnego klubu (${formattedCode})!`, club: dynamicClub };
    }

    return { success: false, message: 'Nie znaleziono klubu o podanym kodzie. Upewnij się, że kod ma 9 znaków.' };
  };

  const selectClub = (club: Club) => {
    setData(prev => ({
      ...prev,
      currentClub: club
    }));
  };

  const leaveClub = () => {
    setData(prev => ({
      ...prev,
      currentClub: null
    }));
  };

  const addClubPost = (content: string, type: ClubPost['type'] = 'post', stats?: ClubPost['stats']) => {
    const newPost: ClubPost = {
      id: `post_${Date.now()}`,
      authorName: 'Ty (Ty)',
      authorAvatar: 'TY',
      authorRole: data.currentClub?.isOwner ? 'Założyciel Klubu' : 'Weteran',
      timeAgo: 'Przed chwilą',
      content: content.trim(),
      type,
      stats,
      likesCount: 1,
      liked: true,
      commentsCount: 0
    };

    setData(prev => ({
      ...prev,
      clubPosts: [newPost, ...(prev.clubPosts || INITIAL_POSTS)]
    }));
  };

  const toggleLikePost = (postId: string) => {
    setData(prev => ({
      ...prev,
      clubPosts: (prev.clubPosts || INITIAL_POSTS).map(post => {
        if (post.id === postId) {
          const isLiked = post.liked;
          return {
            ...post,
            liked: !isLiked,
            likesCount: isLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1
          };
        }
        return post;
      })
    }));
  };

  const toggleJoinChallenge = (challengeId: string) => {
    setData(prev => ({
      ...prev,
      clubChallenges: (prev.clubChallenges || INITIAL_CHALLENGES).map(c => {
        if (c.id === challengeId) {
          const isJoined = c.joined;
          return {
            ...c,
            joined: !isJoined,
            participantsCount: isJoined ? Math.max(0, c.participantsCount - 1) : c.participantsCount + 1
          };
        }
        return c;
      })
    }));
  };

  // SETTINGS & PROFILE ACTIONS
  const updateUserSettings = (updated: Partial<UserSettings>) => {
    setData(prev => ({
      ...prev,
      userSettings: {
        ...(prev.userSettings || initialUserSettings),
        ...updated
      }
    }));
  };

  const toggleDeviceSync = (device: keyof UserSettings['connectedDevices']) => {
    setData(prev => {
      const current = prev.userSettings?.connectedDevices || initialUserSettings.connectedDevices;
      return {
        ...prev,
        userSettings: {
          ...(prev.userSettings || initialUserSettings),
          connectedDevices: {
            ...current,
            [device]: !current[device]
          }
        }
      };
    });
  };

  const toggleNotification = (key: keyof UserSettings['notifications']) => {
    setData(prev => {
      const current = prev.userSettings?.notifications || initialUserSettings.notifications;
      return {
        ...prev,
        userSettings: {
          ...(prev.userSettings || initialUserSettings),
          notifications: {
            ...current,
            [key]: !current[key]
          }
        }
      };
    });
  };

  const exportDataToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lumina-backup-${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataFromJson = (jsonData: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && (Array.isArray(parsed.food) || Array.isArray(parsed.workouts))) {
        setData(parsed);
        return { success: true, message: 'Dane zostały pomyślnie zaimportowane i przywrócone!' };
      }
      return { success: false, message: 'Nieprawidłowy format pliku kopii zapasowej.' };
    } catch (e) {
      return { success: false, message: 'Błąd podczas parsowania pliku JSON.' };
    }
  };

  const resetAllData = () => {
    const fresh = generateInitialData();
    setData(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  return {
    data,
    addFood,
    deleteFood,
    addWorkout,
    deleteWorkout,
    addRoutine,
    deleteRoutine,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    addWater,
    resetWater,
    addCustomFood,
    deleteCustomFood,
    updateCustomFood,
    createClub,
    joinClubByCode,
    selectClub,
    leaveClub,
    addClubPost,
    toggleLikePost,
    toggleJoinChallenge,
    updateUserSettings,
    toggleDeviceSync,
    toggleNotification,
    exportDataToJson,
    importDataFromJson,
    resetAllData
  };
}
