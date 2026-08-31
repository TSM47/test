export type TabType = 'overview' | 'stats' | 'dashboard' | 'food' | 'gym' | 'habits' | 'community' | 'settings';

export interface FoodEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'Śniadanie' | 'Obiad' | 'Kolacja' | 'Przekąska';
  createdAt: number;
}

export interface WorkoutEntry {
  id: string;
  date: string;
  exercise: string;
  muscleGroup: 'Klatka' | 'Plecy' | 'Nogi' | 'Barki' | 'Ramiona' | 'Brzuch' | 'Inne';
  sets: number;
  reps: number;
  weight: number;
  createdAt: number;
}

export interface RoutineExercise {
  exercise: string;
  muscleGroup: 'Klatka' | 'Plecy' | 'Nogi' | 'Barki' | 'Ramiona' | 'Brzuch' | 'Inne';
  sets: number;
  reps: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  category: 'Zdrowie' | 'Rozwój' | 'Umysł' | 'Trening' | 'Regeneracja' | 'Inne';
  icon?: string;
  timeOfDay?: 'Rano' | 'Popołudnie' | 'Wieczór' | 'Cały Dzień';
  targetFrequency?: string;
  description?: string;
  createdAt: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface CustomFoodItem {
  id: string;
  name: string;
  category: 'Białkowe' | 'Węglowodanowe' | 'Tłuszczowe' | 'Dania Gotowe' | 'Owoce & Warzywa' | 'Inne';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingUnit: string; // np. 100g, 1 porcja, 1 sztuka, 30g
  servingGrams?: number;
  icon?: string;
  createdAt: number;
}

export interface ClubMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Lider' | 'Weteran' | 'Członek';
  streak: number;
  xp: number;
  city: string;
  joinedDate: string;
  status: string;
  isCurrentUser?: boolean;
}

export interface ClubChallenge {
  id: string;
  title: string;
  category: 'Trening' | 'Nawyki' | 'Woda' | 'Kroki';
  target: number;
  current: number;
  unit: string;
  daysLeft: number;
  participantsCount: number;
  joined?: boolean;
  rewardXP: number;
  description: string;
}

export interface ClubPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  timeAgo: string;
  content: string;
  type: 'workout' | 'habit' | 'pr' | 'post';
  stats?: {
    label: string;
    value: string;
  }[];
  likesCount: number;
  liked?: boolean;
  commentsCount: number;
}

export interface Club {
  id: string;
  code: string; // np. "LUM-9X4-7K2" (9 cyfrowo-literowych znaków)
  name: string;
  city: string;
  isPrivate: boolean;
  category: string;
  description: string;
  icon: string;
  createdAt: number;
  memberCount: number;
  inviteLink: string;
  isOwner?: boolean;
}

export interface UserSettings {
  name: string;
  lastName: string;
  email: string;
  avatar: string;
  city: string;
  bio: string;
  weight: number; // kg
  targetWeight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete';
  dietType: string;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  dailyWaterTarget: number; // ml
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'in';
  waterUnit: 'ml' | 'oz';
  distanceUnit: 'km' | 'mi';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    workout: boolean;
    water: boolean;
    summary: boolean;
    meals: boolean;
    clubStreak: boolean;
  };
  connectedDevices: {
    appleWatch: boolean;
    garmin: boolean;
    strava: boolean;
    polar: boolean;
    suunto: boolean;
    fitbit: boolean;
  };
  subscriptionPlan: 'free' | 'pro' | 'lifetime';
  subscriptionRenewDate: string;
}

export interface TrackerData {
  food: FoodEntry[];
  workouts: WorkoutEntry[];
  routines: Routine[];
  habits: Habit[];
  habitLogs: HabitLog[];
  waterLogs: { date: string; amount: number }[];
  customFoods: CustomFoodItem[];
  currentClub?: Club | null;
  userClubs?: Club[];
  clubPosts?: ClubPost[];
  clubChallenges?: ClubChallenge[];
  userSettings?: UserSettings;
}

