import { Club, ClubMember, ClubChallenge, ClubPost } from '../types';

export const POLISH_CITIES = [
  'Warszawa',
  'Kraków',
  'Wrocław',
  'Poznań',
  'Gdańsk',
  'Gdynia / Sopot',
  'Katowice / Śląsk',
  'Łódź',
  'Szczecin',
  'Lublin',
  'Bydgoszcz / Toruń',
  'Rzeszów',
  'Białystok',
  'Olsztyn',
  'Kielce',
  'Zielona Góra / Gorzów',
  'Opole',
  'Częstochowa',
  'Online / Cała Polska'
];

export const CLUB_CATEGORIES = [
  'Nawyki & Dyscyplina',
  'Trening Siłowy & Gym',
  'Zdrowa Dieta & Redukcja',
  'Klub 5:00 Rano & Rozwój',
  'Bieganie & Cardio',
  'Regeneracja & Zimne Kąpiele',
  'Praca Głęboka & Biohacking'
];

export const CLUB_ICONS = ['⚡', '🦁', '🔥', '🛡️', '⚔️', '🏔️', '💎', '🚀', '🧠', '🏋️‍♂️', '🐺', '👑', '🧘‍♂️', '🏆', '🎯'];

// Generates an uppercase 9-character alphanumeric code: XXX-XXX-XXX
export function generateClubCode(cityName?: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pick = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  
  let prefix = 'LUM';
  if (cityName) {
    const clean = cityName.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (clean.length >= 3) prefix = clean.substring(0, 3);
  }

  return `${prefix}-${pick(3)}-${pick(3)}`;
}

export function generateInviteLink(code: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://remixlumina.app';
  return `${baseUrl}/?club=${code.replace(/-/g, '')}`;
}

export const INITIAL_PUBLIC_CLUBS: Club[] = [
  {
    id: 'club_waw_iron',
    code: 'WAW-78A-9X2',
    name: 'Warszawa Iron & Discipline',
    city: 'Warszawa',
    isPrivate: false,
    category: 'Trening Siłowy & Gym',
    description: 'Największa warszawska społeczność pasjonatów ciężkiego treningu, czystej diety i wczesnych poranków. Wspólne sparingi objętościowe i cotygodniowy ranking siły.',
    icon: '⚡',
    createdAt: Date.now() - 60 * 86400000,
    memberCount: 148,
    inviteLink: 'https://remixlumina.app/?club=WAW78A9X2',
    isOwner: false
  },
  {
    id: 'club_krk_routine',
    code: 'KRK-44B-10Z',
    name: 'Kraków Morning Routine & Flow',
    city: 'Kraków',
    isPrivate: false,
    category: 'Nawyki & Dyscyplina',
    description: 'Wstajemy przed świtem, wdrażamy medytację, 10 000 kroków po Bulwarach Wiślanych i pracę głęboką bez social mediów. Dołącz do krakowskiego kręgu!',
    icon: '🦁',
    createdAt: Date.now() - 45 * 86400000,
    memberCount: 96,
    inviteLink: 'https://remixlumina.app/?club=KRK44B10Z',
    isOwner: false
  },
  {
    id: 'club_wro_power',
    code: 'WRO-99K-33P',
    name: 'Wrocław Power & Kalistenika',
    city: 'Wrocław',
    isPrivate: false,
    category: 'Trening Siłowy & Gym',
    description: 'Dźwigamy na siłowni i trenujemy na parkach kalistenicznych nad Odrą. Rywalizujemy w objętości wyciskania i martwego ciągu.',
    icon: '🔥',
    createdAt: Date.now() - 30 * 86400000,
    memberCount: 112,
    inviteLink: 'https://remixlumina.app/?club=WRO99K33P',
    isOwner: false
  },
  {
    id: 'club_gda_endurance',
    code: 'GDA-55T-88M',
    name: 'Trójmiasto Endurance & Morsy',
    city: 'Gdańsk',
    isPrivate: false,
    category: 'Regeneracja & Zimne Kąpiele',
    description: 'Poranne biegi wzdłuż Zatoki Gdańskiej, regeneracja w Bałtyku i budowanie twardego układu nerwowego przez ekspozycję na chłód.',
    icon: '🏔️',
    createdAt: Date.now() - 25 * 86400000,
    memberCount: 74,
    inviteLink: 'https://remixlumina.app/?club=GDA55T88M',
    isOwner: false
  },
  {
    id: 'club_poz_5am',
    code: 'POZ-12R-77X',
    name: 'Poznań 5:00 AM Club',
    city: 'Poznań',
    isPrivate: false,
    category: 'Klub 5:00 Rano & Rozwój',
    description: 'Złota godzina 5:00 - 6:00 rano przeznaczona na ruch, czytanie literatury i planowanie dnia z zasadą Top 3 priorytety.',
    icon: '💎',
    createdAt: Date.now() - 20 * 86400000,
    memberCount: 83,
    inviteLink: 'https://remixlumina.app/?club=POZ12R77X',
    isOwner: false
  }
];

export const INITIAL_MEMBERS: ClubMember[] = [
  {
    id: 'm_curr',
    name: 'Ty (Ty)',
    avatar: 'TY',
    role: 'Weteran',
    streak: 14,
    xp: 2850,
    city: 'Warszawa',
    joinedDate: '3 tyg. temu',
    status: 'Dzisiaj: 4/5 nawyków + Trening Push zaliczony! 💪',
    isCurrentUser: true
  },
  {
    id: 'm_1',
    name: 'Marek Nowak',
    avatar: 'MN',
    role: 'Lider',
    streak: 42,
    xp: 5420,
    city: 'Warszawa',
    joinedDate: '2 mies. temu',
    status: 'Martwy ciąg 185 kg zaliczony. Nie ma wymówek.'
  },
  {
    id: 'm_2',
    name: 'Anna Kowalska',
    avatar: 'AK',
    role: 'Weteran',
    streak: 28,
    xp: 4190,
    city: 'Warszawa',
    joinedDate: '1.5 mies. temu',
    status: '12 500 kroków i sesja mobilności bioder 🧘‍♀️'
  },
  {
    id: 'm_3',
    name: 'Piotr Wiśniewski',
    avatar: 'PW',
    role: 'Członek',
    streak: 21,
    xp: 3200,
    city: 'Warszawa',
    joinedDate: '3 tyg. temu',
    status: 'Blok Deep Work 90 min bez social mediów 🧠'
  },
  {
    id: 'm_4',
    name: 'Kasia Lewandowska',
    avatar: 'KL',
    role: 'Członek',
    streak: 18,
    xp: 2950,
    city: 'Warszawa',
    joinedDate: '2 tyg. temu',
    status: 'Bieg 6.5 km o 6:30 rano 🏃‍♀️'
  },
  {
    id: 'm_5',
    name: 'Tomasz Zieliński',
    avatar: 'TZ',
    role: 'Członek',
    streak: 9,
    xp: 1650,
    city: 'Warszawa',
    joinedDate: '1 tydz. temu',
    status: 'Buduję nawyk picia 3 litrów wody dziennie 💧'
  }
];

export const INITIAL_CHALLENGES: ClubChallenge[] = [
  {
    id: 'c_1',
    title: 'Wyzwanie Tygodnia: 25 000 kg Objętości',
    category: 'Trening',
    target: 25000,
    current: 18450,
    unit: 'kg',
    daysLeft: 3,
    participantsCount: 32,
    joined: true,
    rewardXP: 500,
    description: 'Wspólnie z członkami klubu przerzucamy 25 ton na siłowni w ciągu 7 dni. Każda wykonana seria zasila licznik klubu!'
  },
  {
    id: 'c_2',
    title: 'Żelazna Passa: 7 Dni 100% Nawyków',
    category: 'Nawyki',
    target: 7,
    current: 5,
    unit: 'dni',
    daysLeft: 2,
    participantsCount: 45,
    joined: true,
    rewardXP: 750,
    description: 'Odhaczaj wszystkie swoje zaplanowane nawyki bez ani jednego dnia przerwy przez cały tydzień.'
  },
  {
    id: 'c_3',
    title: 'Hydratacja Mistrzów: 2.5L Wody Dziennie',
    category: 'Woda',
    target: 100,
    current: 78,
    unit: '%',
    daysLeft: 4,
    participantsCount: 56,
    joined: false,
    rewardXP: 300,
    description: 'Utrzymuj optymalne nawodnienie komórkowe przez cały tydzień pracy.'
  }
];

export const INITIAL_POSTS: ClubPost[] = [
  {
    id: 'p_1',
    authorName: 'Marek Nowak',
    authorAvatar: 'MN',
    authorRole: 'Lider Klubu',
    timeAgo: '20 min temu',
    type: 'pr',
    content: '🔥 Nowy rekord życiowy w wyciskaniu sztangi leżąc! 140 kg poszło gładko po 6 tygodniach periodyzacji falowej. Pamiętajcie o stałej technice i napinaniu łopatek.',
    stats: [
      { label: 'Ćwiczenie', value: 'Wyciskanie leżąc' },
      { label: 'Ciężar 1RM', value: '140.0 kg' },
      { label: 'Poprawa', value: '+5.0 kg' }
    ],
    likesCount: 18,
    liked: true,
    commentsCount: 4
  },
  {
    id: 'p_2',
    authorName: 'Anna Kowalska',
    authorAvatar: 'AK',
    authorRole: 'Weteran',
    timeAgo: '1 godz. temu',
    type: 'workout',
    content: 'Zakończona sesja Nóg i Pośladków. Przysiady 4x8 95kg + hip thrusty 4x10 130kg. Nogi z waty, ale satysfakcja 100%.',
    stats: [
      { label: 'Objętość', value: '7 850 kg' },
      { label: 'Czas sesji', value: '1h 10m' },
      { label: 'Spalone kcal', value: '~480 kcal' }
    ],
    likesCount: 14,
    liked: false,
    commentsCount: 2
  },
  {
    id: 'p_3',
    authorName: 'Piotr Wiśniewski',
    authorAvatar: 'PW',
    authorRole: 'Członek',
    timeAgo: '3 godz. temu',
    type: 'habit',
    content: '21. dzień z rzędu bez cukru i z 15 minutami medytacji oddechowej zaraz po przebudzeniu. Poziom skupienia w pracy jest nieporównywalny!',
    stats: [
      { label: 'Passa dni', value: '21 dni 🔥' },
      { label: 'Nawyk', value: 'Czysta dieta & Medytacja' }
    ],
    likesCount: 22,
    liked: true,
    commentsCount: 5
  },
  {
    id: 'p_4',
    authorName: 'Kasia Lewandowska',
    authorAvatar: 'KL',
    authorRole: 'Członek',
    timeAgo: 'Wczoraj',
    type: 'post',
    content: 'Wskazówka na dzisiaj: przygotujcie torbę na trening i szklankę wody z cytryną już wieczorem. Usuwając tarcie decyzyjne o 6:00 rano, szansa na opuszczenie treningu spada niemal do zera.',
    likesCount: 29,
    liked: false,
    commentsCount: 7
  }
];
