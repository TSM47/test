export interface HabitTemplate {
  id: string;
  name: string;
  category: 'Zdrowie' | 'Rozwój' | 'Umysł' | 'Trening' | 'Regeneracja' | 'Inne';
  icon: string;
  timeOfDay: 'Rano' | 'Popołudnie' | 'Wieczór' | 'Cały Dzień';
  targetFrequency: string;
  description: string;
  whyItWorks: string;
  habitTip: string;
}

export const PREDEFINED_HABITS_CATALOG: HabitTemplate[] = [
  // ZDROWIE
  {
    id: 'hab_water_morning',
    name: 'Szklanka wody z solą kłodawską / cytryną po przebudzeniu',
    category: 'Zdrowie',
    icon: '💧',
    timeOfDay: 'Rano',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Nawodnienie komórkowe organizmu i uzupełnienie elektrolitów bezpośrednio po nocy.',
    whyItWorks: 'Po 7-8 godzinach snu organizm jest odwodniony. Wczesne nawodnienie pobudza perystaltykę jelit i aktywuje metabolizm.',
    habitTip: 'Przygotuj pełną szklankę wody na szafce nocnej przed pójściem spać.'
  },
  {
    id: 'hab_10k_steps',
    name: '10 000 kroków dziennie (NEAT)',
    category: 'Zdrowie',
    icon: '🚶‍♂️',
    timeOfDay: 'Cały Dzień',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Utrzymanie wysokiej spontanicznej aktywności fizycznej poza treningiem.',
    whyItWorks: 'NEAT (Non-Exercise Activity Thermogenesis) odpowiada za lwią część dziennego wydatku energetycznego i wspiera zdrowie układu krążenia.',
    habitTip: 'Wybieraj schody zamiast windy i rozmawiaj przez telefon na stojąco lub spacerując.'
  },
  {
    id: 'hab_no_sugar',
    name: 'Zero dodanego cukru i słodzonych napojów',
    category: 'Zdrowie',
    icon: '🚫',
    timeOfDay: 'Cały Dzień',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Wyeliminowanie ukrytych cukrów prostych dla stabilnej glikemii i stałego poziomu energii.',
    whyItWorks: 'Unikanie gwałtownych skoków insuliny chroni przed popołudniowym zjazdem energetycznym i napadami wilczego głodu.',
    habitTip: 'Zastąp słodzone napoje wodą z miętą, naparami ziołowymi lub kawą/herbatą bez cukru.'
  },
  {
    id: 'hab_cold_shower',
    name: 'Zimny prysznic (1-2 minuty na koniec)',
    category: 'Zdrowie',
    icon: '🚿',
    timeOfDay: 'Rano',
    targetFrequency: '5x w tygodniu',
    description: 'Krótka ekspozycja na zimno w celu wyrzutu dopaminy, noradrenaliny i pobudzenia układu odpornościowego.',
    whyItWorks: 'Hormetyczny stres zimnem zwiększa poziom dopaminy o ponad 200% i utrzymuje skupienie przez kolejne 3-4 godziny.',
    habitTip: 'Zacznij od ciepłego prysznica i zakończ ostatnimi 30-60 sekundami lodowatego strumienia na kark i klatkę.'
  },

  // UMYSŁ
  {
    id: 'hab_mindfulness',
    name: 'Medytacja & Świadomy oddech (10 minut)',
    category: 'Umysł',
    icon: '🧘‍♀️',
    timeOfDay: 'Rano',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Trening uważności i redukcja poziomu kortyzolu poprzez techniki oddechowe (np. Box Breathing 4-4-4-4).',
    whyItWorks: 'Stymulacja nerwu błędnego obniża tętno spoczynkowe, redukuje lęk i wzmacnia korę przedczołową odpowiedzialną za silną wolę.',
    habitTip: 'Usiądź wygodnie w ciszy natychmiast po porannej toalecie – nie sprawdzaj jeszcze powiadomień w telefonie.'
  },
  {
    id: 'hab_deep_work',
    name: 'Blok Pracy Głębokiej (Deep Work 60-90 min)',
    category: 'Umysł',
    icon: '🧠',
    timeOfDay: 'Popołudnie',
    targetFrequency: 'Pn - Pt (5x/tydz)',
    description: 'Praca w pełnym skupieniu nad najważniejszym zadaniem bez rozpraszaczy i powiadomień.',
    whyItWorks: 'Stan flow i brak przełączania kontekstu (tzw. attention residue) pozwala wykonać pracę 3x szybciej i z najwyższą jakością.',
    habitTip: 'Włącz tryb „Nie przeszkadzać”, zamknij wszystkie zbędne karty w przeglądarce i schowaj telefon do innego pokoju.'
  },
  {
    id: 'hab_gratitude_journal',
    name: 'Dziennik wdzięczności (3 rzeczy, za które dziękuję)',
    category: 'Umysł',
    icon: '📝',
    timeOfDay: 'Wieczór',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Zapisanie 3 konkretnych sytuacji, osób lub momentów z minionego dnia budujących pozytywne nastawienie.',
    whyItWorks: 'Przeprogramowuje mózg z automatycznego mechanizmu wypatrywania zagrożeń (negativity bias) na dostrzeganie obfitości.',
    habitTip: 'Trzymaj notes i długopis na poduszce – zapisuj przed zgaszeniem światła.'
  },

  // ROZWÓJ
  {
    id: 'hab_reading_book',
    name: 'Czytanie wartościowej książki (min. 20 stron / 15 min)',
    category: 'Rozwój',
    icon: '📚',
    timeOfDay: 'Wieczór',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Codzienna dawka wiedzy z zakresu psychologii, biznesu, biomechaniki lub literatury pięknej.',
    whyItWorks: 'Czytanie 20 stron dziennie daje ponad 7 000 stron rocznie – to odpowiednik ok. 25-30 przeczytanych książek w ciągu roku!',
    habitTip: 'Zastąp wieczorne przeglądanie social mediów czytaniem przy ciepłym świetle.'
  },
  {
    id: 'hab_plan_tomorrow',
    name: 'Zaplanowanie Top 3 zadań na jutrzejszy dzień',
    category: 'Rozwój',
    icon: '🎯',
    timeOfDay: 'Wieczór',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Ustalenie 3 kluczowych priorytetów przed snem, by obudzić się z jasnym planem działania.',
    whyItWorks: 'Usuwa paraliż decyzyjny o poranku (decision fatigue) i pozwala wejść w nowy dzień z pełną determinacją.',
    habitTip: 'Zasada 1-3-5: Wybierz 1 wielkie zadanie, 3 średnie i 5 małych spraw.'
  },
  {
    id: 'hab_language_study',
    name: 'Nauka języka obcego (15 minut fiszek / podcastu)',
    category: 'Rozwój',
    icon: '🌍',
    timeOfDay: 'Popołudnie',
    targetFrequency: 'Pn - Pt (5x/tydz)',
    description: 'Systematyczna powtórka słownictwa i osłuchiwanie się z językiem obcym.',
    whyItWorks: 'Algorytmy powtórek przestrzennych (spaced repetition) najskuteczniej utrwalają wiedzę w pamięci długotrwałej.',
    habitTip: 'Wykorzystaj martwe momenty w ciągu dnia – np. podróż komunikacją miejską lub spacer.'
  },

  // TRENING & CIAŁO
  {
    id: 'hab_daily_stretching',
    name: 'Poranne rozciąganie & Mobilność stawów (10 min)',
    category: 'Trening',
    icon: '🤸‍♂️',
    timeOfDay: 'Rano',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Dynamiczne otwarcie bioder, klatki piersiowej i rotacje kręgosłupa piersiowego.',
    whyItWorks: 'Zwiększa przepływ mazi stawowej, redukuje sztywność powięzi i przygotowuje układ nerwowy do obciążeń dnia.',
    habitTip: 'Połącz rozciąganie z parzeniem porannej kawy lub herbaty (technika habit stacking).'
  },
  {
    id: 'hab_post_meal_walk',
    name: '10-minutowy lekki spacer po głównym posiłku',
    category: 'Trening',
    icon: '🏃‍♂️',
    timeOfDay: 'Popołudnie',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Niski wysiłek fizyczny zaraz po obiedzie lub kolacji.',
    whyItWorks: 'Praca mięśni nóg powoduje natychmiastowe wychwytywanie glukozy z krwi bez udziału insuliny, wypłaszczając krzywą cukrową.',
    habitTip: 'Wystarczy 10 minut spokojnego marszu wokół bloku lub biura.'
  },
  {
    id: 'hab_pushups_daily',
    name: 'Seria pompek / podciągnięć w ciągu dnia',
    category: 'Trening',
    icon: '💪',
    timeOfDay: 'Popołudnie',
    targetFrequency: '5x w tygodniu',
    description: 'Krótki bodziec siłowy podtrzymujący napięcie mięśniowe i postawę.',
    whyItWorks: 'Greasing the groove – częste, niesubmaksymalne powtórzenia budują siłę układu nerwowego bez przemęczenia.',
    habitTip: 'Zrób 20 pompek za każdym razem, gdy wstajesz od biurka po dłuższej sesji.'
  },

  // REGENERACJA & SEN
  {
    id: 'hab_sleep_8h',
    name: '7.5 - 8.5h jakościowego snu (Stałe pory)',
    category: 'Regeneracja',
    icon: '🛌',
    timeOfDay: 'Wieczór',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Kładzenie się i wstawanie o stałych porach dla optymalizacji rytmu dobowego.',
    whyItWorks: 'Fazy snu NREM i REM to fundament syntezy białek mięśniowych, regeneracji neuroprzekaźników i konsolidacji pamięci.',
    habitTip: 'Ustaw budzik na porę kładzenia się do łóżka na 45 minut przed planowanym zaśnięciem.'
  },
  {
    id: 'hab_digital_curfew',
    name: 'Cyfrowa godzina policyjna (Zero ekranów 45 min przed snem)',
    category: 'Regeneracja',
    icon: '📵',
    timeOfDay: 'Wieczór',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Odcięcie niebieskiego światła i stymulujących treści z telefonu/komputera przed snem.',
    whyItWorks: 'Brak niebieskiego światła umożliwia naturalny wyrzut melatoniny przez szyszynkę, skracając czas zasypiania i pogłębiając sen.',
    habitTip: 'Połóż telefon poza zasięgiem rąk z łóżka, np. na komodzie lub w drugim pokoju.'
  },
  {
    id: 'hab_bedroom_air',
    name: 'Wywietrzenie sypialni i temperatura 18-19°C',
    category: 'Regeneracja',
    icon: '🌬️',
    timeOfDay: 'Wieczór',
    targetFrequency: 'Codziennie (7x/tydz)',
    description: 'Obniżenie temperatury w sypialni i dostarczenie świeżego tlenu.',
    whyItWorks: 'Do zainicjowania głębokiego snu temperatura rdzenia ciała musi spaść o ok. 1°C. Chłodne otoczenie znacząco ułatwia ten proces.',
    habitTip: 'Otwórz okno na oścież na 10 minut przed wejściem do sypialni.'
  }
];
