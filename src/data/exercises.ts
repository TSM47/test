export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: 'Klatka' | 'Plecy' | 'Nogi' | 'Barki' | 'Ramiona' | 'Brzuch' | 'Inne';
  secondaryMuscles?: string[];
  equipment: 'Sztanga' | 'Hantle' | 'Wyciąg' | 'Maszyna' | 'Masa ciała' | 'Kettlebell';
  difficulty: 'Początkujący' | 'Średniozaawansowany' | 'Zaawansowany';
  icon: string;
  description: string;
  instructions: string[];
  tip?: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
}

export const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // KLATKA
  {
    id: 'ex_bench_press',
    name: 'Wyciskanie sztangi leżąc na ławce poziomej',
    muscleGroup: 'Klatka',
    secondaryMuscles: ['Triceps', 'Przedni akton barku'],
    equipment: 'Sztanga',
    difficulty: 'Średniozaawansowany',
    icon: '🏋️‍♂️',
    description: 'Królewskie ćwiczenie siłowe na klatkę piersiową budujące masę i siłę górnej części ciała.',
    instructions: [
      'Połóż się stabilnie na ławce, stopy mocno wparte w podłoże, ściągnij i opuść łopatki.',
      'Chwyć sztangę nieco szerzej niż szerokość barków.',
      'Zdejmij sztangę i opuszczaj ją w sposób kontrolowany do dolnej części mostka.',
      'Dynamicznie wypchnij sztangę w górę, nie tracąc spięcia łopatek.'
    ],
    tip: 'Pamiętaj o lekkim mostkowaniu i wkręcaniu stóp w podłogę (tzw. leg drive).',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 80
  },
  {
    id: 'ex_incline_dumbbell_press',
    name: 'Wyciskanie hantli na ławce skośnej dodatniej',
    muscleGroup: 'Klatka',
    secondaryMuscles: ['Przedni akton barku', 'Triceps'],
    equipment: 'Hantle',
    difficulty: 'Średniozaawansowany',
    icon: '💪',
    description: 'Doskonałe ćwiczenie akcentujące górne (obojczykowe) włókna mięśnia piersiowego większego.',
    instructions: [
      'Ustaw kąt ławki na 30-45 stopni.',
      'Usiądź z hantlami na kolanach i pomóż sobie nogami zarzucić je do pozycji wyjściowej.',
      'Prowadź łokcie pod kątem ok. 45-60 stopni do tułowia.',
      'Wyciskaj hantle w górę po lekkim łuku, mocno napinając klatkę w szczytowej fazie.'
    ],
    tip: 'Nie ustawiaj ławki powyżej 45 stopni, by nie przenieść pracy na przednie aktony barków.',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 28
  },
  {
    id: 'ex_dips_chest',
    name: 'Pompki na poręczach (Dips) z pochyleniem',
    muscleGroup: 'Klatka',
    secondaryMuscles: ['Triceps', 'Przedni akton barku'],
    equipment: 'Masa ciała',
    difficulty: 'Zaawansowany',
    icon: '🤸‍♂️',
    description: 'Potężne wielostawowe ćwiczenie kalisteniczne na dół klatki i siłę pchania.',
    instructions: [
      'Wskocz na poręcze, zablokuj ramiona i pochyl tułów do przodu o ok. 20-30 stopni.',
      'Opuszczaj się powoli, rozszerzając lekko łokcie na boki, aż poczujesz rozciągnięcie klatki.',
      'Wypchnij się dynamicznie w górę do pozycji wyjściowej.'
    ],
    tip: 'Im większe pochylenie tułowia w przód, tym większy akcent na klatkę zamiast tricepsa.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0
  },
  {
    id: 'ex_cable_crossover',
    name: 'Rozpiętki na wyciągu bramowym (Cable Flyes)',
    muscleGroup: 'Klatka',
    secondaryMuscles: ['Przedni akton barku'],
    equipment: 'Wyciąg',
    difficulty: 'Początkujący',
    icon: '🎯',
    description: 'Ćwiczenie izolowane zapewniające stałe napięcie mięśniowe w pełnym zakresie ruchu.',
    instructions: [
      'Ustaw bloczki na wysokości klatki lub wyżej, zrób krok w przód w wykroku.',
      'Z lekko ugiętymi łokciami przyciągaj rączki wyciągu do siebie na wysokości mostka.',
      'Mocno zepnij klatkę na 1 sekundę w punkcie maksymalnego spięcia.'
    ],
    tip: 'Skup się na zbliżaniu do siebie bicepsów, nie tylko dłoni.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 15
  },

  // PLECY
  {
    id: 'ex_deadlift',
    name: 'Martwy ciąg klasyczny (Conventional Deadlift)',
    muscleGroup: 'Plecy',
    secondaryMuscles: ['Nogi', 'Pośladki', 'Prostowniki grzbietu', 'Przedramiona'],
    equipment: 'Sztanga',
    difficulty: 'Zaawansowany',
    icon: '⚡',
    description: 'Fundamentalne ćwiczenie budujące całościową siłę tylnej taśmy anatomicznej.',
    instructions: [
      'Stań ze stopami na szerokość bioder, sztanga nad środkiem stóp.',
      'Ugnij biodra i kolana, chwyć sztangę tuż poza szerokością nóg.',
      'Ściągnij łopatki, weź wdech przeponowy i napnij tłocznię brzuszną (bracing).',
      'Pchaj ziemię stopami i prostuj biodra, prowadząc sztangę blisko piszczeli i ud.'
    ],
    tip: 'Pamiętaj o neutralnej pozycji kręgosłupa szyjnego i lędźwiowego – nie przeprostowuj się na górze.',
    defaultSets: 4,
    defaultReps: 5,
    defaultWeight: 120
  },
  {
    id: 'ex_barbell_row',
    name: 'Wiosłowanie sztangą w opadzie tułowia',
    muscleGroup: 'Plecy',
    secondaryMuscles: ['Biceps', 'Tył barku', 'Prostowniki grzbietu'],
    equipment: 'Sztanga',
    difficulty: 'Średniozaawansowany',
    icon: '🚣‍♂️',
    description: 'Kluczowe ćwiczenie na grubość i gęstość mięśni najszerszych i czworobocznych.',
    instructions: [
      'Pochyl tułów do kąta ok. 45 stopni przy lekko ugiętych kolanach i prostych plecach.',
      'Chwyć sztangę nachwytem lub podchwytem.',
      'Pociągnij sztangę w kierunku pępka / dolnych żeber, prowadząc łokcie blisko tułowia.',
      'Zatrzymaj ruch na szczycie i opuść w pełnym rozciągnięciu.'
    ],
    tip: 'Inicjuj ruch ściągnięciem łopatek, a nie szarpnięciem z ramion.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 70
  },
  {
    id: 'ex_pullups',
    name: 'Podciąganie na drążku nachwytem (Pull-Ups)',
    muscleGroup: 'Plecy',
    secondaryMuscles: ['Biceps', 'Przedramiona', 'Brzuch'],
    equipment: 'Masa ciała',
    difficulty: 'Zaawansowany',
    icon: '🧗‍♂️',
    description: 'Najlepsze ćwiczenie kalisteniczne na szerokość mięśni najszerszych grzbietu (tzw. skrzydła).',
    instructions: [
      'Chwyć drążek nachwytem nieco szerzej niż szerokość barków.',
      'Rozpocznij od aktywnego zwisu (opuszczenie i ściągnięcie łopatek).',
      'Podciągnij się płynnie tak, aby broda znalazła się ponad drążkiem.',
      'Kontroluj powolne opuszczanie do pełnego zwisu.'
    ],
    tip: 'Wyobraź sobie, że ciągniesz łokcie w dół do kieszeni spodni.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 0
  },
  {
    id: 'ex_lat_pulldown',
    name: 'Ściąganie drążka wyciągu górnego do klatki',
    muscleGroup: 'Plecy',
    secondaryMuscles: ['Biceps', 'Tył barku'],
    equipment: 'Wyciąg',
    difficulty: 'Początkujący',
    icon: '🏗️',
    description: 'Świetna alternatywa i uzupełnienie podciągania pozwalająca na precyzyjną kontrolę obciążenia.',
    instructions: [
      'Usiądź na maszynie, zablokuj uda pod wałkami.',
      'Chwyć drążek szerokim nachwytem i odchyl tułów o ok. 10 stopni w tył.',
      'Ściągaj drążek płynnie w dół do górnej części klatki piersiowej.',
      'Wracaj powoli, czując rozciąganie najszerszego grzbietu.'
    ],
    tip: 'Nie bujaj tułowiem w przód i w tył – ruch ma pochodzić wyłącznie z pracy pleców.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 55
  },

  // NOGI
  {
    id: 'ex_barbell_squat',
    name: 'Przysiad ze sztangą na plecach (Back Squat)',
    muscleGroup: 'Nogi',
    secondaryMuscles: ['Pośladki', 'Brzuch', 'Prostowniki grzbietu', 'Łydki'],
    equipment: 'Sztanga',
    difficulty: 'Zaawansowany',
    icon: '🏋️',
    description: 'Niezrównany król ćwiczeń dolnych partii ciała stymulujący wyrzut hormonów anabolicznych.',
    instructions: [
      'Umieść sztangę na mięśniach czworobocznych (high bar) lub nieco niżej (low bar).',
      'Stopy rozstaw na szerokość barków, palce lekko skierowane na zewnątrz.',
      'Zainicjuj ruch jednoczesnym zgięciem bioder i kolan, schodząc co najmniej do kąta 90 stopni.',
      'Pchaj dynamicznie przez całą stopę, wracając do pozycji stojącej.'
    ],
    tip: 'Prowadź kolana dokładnie w linii palców u stóp, nie pozwól im schodzić się do środka.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 100
  },
  {
    id: 'ex_romanian_deadlift',
    name: 'Rumuński martwy ciąg z hantlami/sztangą (RDL)',
    muscleGroup: 'Nogi',
    secondaryMuscles: ['Pośladki', 'Prostowniki grzbietu'],
    equipment: 'Hantle',
    difficulty: 'Średniozaawansowany',
    icon: '🦵',
    description: 'Najlepsze ćwiczenie izolująco-rozciągające na mięśnie kulszowo-goleniowe i pośladki.',
    instructions: [
      'Trzymaj hantle przed udami, kolana lekko ugięte (zablokowane w stałym kącie).',
      'Cofaj biodra maksymalnie w tył, utrzymując idealnie proste plecy.',
      'Schodź ciężarem poniżej kolan do momentu mocnego rozciągnięcia dwugłowych.',
      'Wypchnij biodra w przód, mocno napinając pośladki na górze.'
    ],
    tip: 'Ruch to hinge (zawias biodrowy), a nie przysiad – kolana nie zginają się mocniej w trakcie opuszczania.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 32
  },
  {
    id: 'ex_leg_press',
    name: 'Wypychanie ciężaru na suwnicy (Leg Press)',
    muscleGroup: 'Nogi',
    secondaryMuscles: ['Pośladki', 'Czworogłowe'],
    equipment: 'Maszyna',
    difficulty: 'Początkujący',
    icon: '🚜',
    description: 'Bezpieczne dla kręgosłupa budowanie potężnej objętości mięśni nóg.',
    instructions: [
      'Usiądź stabilnie na suwnicy, plecy i pośladki dociśnięte do oparcia.',
      'Ustaw stopy na platformie na szerokość bioder.',
      'Zwolnij blokadę i uginaj kolana do kąta prostego.',
      'Wypchnij platformę, pamiętając, by NIE blokować kolan w przeproście.'
    ],
    tip: 'Nigdy nie odrywaj odcinka lędźwiowego od oparcia podczas najgłębszej fazy ruchu.',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeight: 160
  },
  {
    id: 'ex_walking_lunges',
    name: 'Wykroki chodzone z hantlami (Walking Lunges)',
    muscleGroup: 'Nogi',
    secondaryMuscles: ['Pośladki', 'Stabilizatory'],
    equipment: 'Hantle',
    difficulty: 'Średniozaawansowany',
    icon: '🚶‍♂️',
    description: 'Jednonóżne ćwiczenie wyrównujące asymetrie siłowe i budujące kształtne pośladki i uda.',
    instructions: [
      'Zrób długi krok w przód, obniżając biodra, aż oba kolana osiągną kąt ok. 90 stopni.',
      'Tylne kolano powinno zatrzymać się tuż nad podłogą.',
      'Odepchnij się z przedniej pięty i płynnie przejdź do kolejnego wykroku drugą nogą.'
    ],
    tip: 'Utrzymuj tułów prosto z lekkim pochyleniem w przód dla większego zaangażowania pośladków.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 16
  },

  // BARKI
  {
    id: 'ex_overhead_press',
    name: 'Wyciskanie żołnierskie nad głowę (OHP)',
    muscleGroup: 'Barki',
    secondaryMuscles: ['Triceps', 'Górna klatka', 'Brzuch'],
    equipment: 'Sztanga',
    difficulty: 'Zaawansowany',
    icon: '👑',
    description: 'Klasyczny sprawdzian siły barków i stabilizacji tułowia w pozycji stojącej.',
    instructions: [
      'Zdejmij sztangę ze stojaka na wysokość górnej części klatki.',
      'Napnij pośladki, brzuch i zablokuj nogi.',
      'Wypchnij sztangę pionowo w górę, odchylając lekko głowę, a po minięciu czoła schowaj głowę pod sztangę.',
      'Zablokuj ciężar nad głową i powoli opuść.'
    ],
    tip: 'Nie wyginaj odcinka lędźwiowego w łuk – siła ma płynąć ze spiętego korpusu i barków.',
    defaultSets: 4,
    defaultReps: 6,
    defaultWeight: 50
  },
  {
    id: 'ex_lateral_raises',
    name: 'Wznosy hantli bokiem (Lateral Raises)',
    muscleGroup: 'Barki',
    secondaryMuscles: ['Kaptury'],
    equipment: 'Hantle',
    difficulty: 'Początkujący',
    icon: '🦅',
    description: 'Kluczowe ćwiczenie izolowane nadające barkom szerokość i kształt kul armatnich (boczny akton).',
    instructions: [
      'Stań prosto z hantlami po bokach, łokcie minimalnie ugięte.',
      'Unoś ramiona w bok do wysokości barków, prowadząc ruch łokciami.',
      'W szczytowym momencie dłoń powinna być w linii lub nieco poniżej łokcia.',
      'Opuszczaj powoli przez 2-3 sekundy.'
    ],
    tip: 'Wykonuj ruch w płaszczyźnie łopatki (ok. 15-20 stopni w przód od linii prostej ciała).',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeight: 10
  },
  {
    id: 'ex_face_pulls',
    name: 'Face Pulls na wyciągu z liną',
    muscleGroup: 'Barki',
    secondaryMuscles: ['Tył barku', 'Rotatory', 'Górne plecy'],
    equipment: 'Wyciąg',
    difficulty: 'Początkujący',
    icon: '🏹',
    description: 'Niezbędne ćwiczenie prozdrowotne na tył barku i stożek rotatorów, dbające o zdrowie stawów barkowych.',
    instructions: [
      'Ustaw wyciąg na wysokości twarzy z podwójną liną.',
      'Chwyć końce liny kciukami skierowanymi w tył.',
      'Przyciągaj linę do wysokości oczu/czoła, jednocześnie rozrywając końce liny na zewnątrz i rotując ramiona w tył.'
    ],
    tip: 'Wykonuj z mniejszym ciężarem i pełną rotacją zewnętrzną ramion na końcu ruchu.',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 25
  },

  // RAMIONA (BICEPS & TRICEPS)
  {
    id: 'ex_bicep_curls',
    name: 'Uginanie przedramion z hantlami z supinacją',
    muscleGroup: 'Ramiona',
    secondaryMuscles: ['Przedramiona'],
    equipment: 'Hantle',
    difficulty: 'Początkujący',
    icon: '💪',
    description: 'Klasyczne ćwiczenie na szczyt i masę bicepsa z pełnym wykorzystaniem funkcji supinacji.',
    instructions: [
      'Stań stabilnie z hantlami chwyconymi chwytem neutralnym (młotkowym).',
      'W trakcie unoszenia obracaj nadgarstek na zewnątrz (supinacja) tak, by mały palec był wyżej.',
      'Mocno zepnij biceps na szczycie i opuszczaj powoli.'
    ],
    tip: 'Trzymaj łokcie stabilnie przyklejone do boków tułowia, nie wysuwaj ich w przód.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 14
  },
  {
    id: 'ex_tricep_pushdown',
    name: 'Prostowanie ramion na wyciągu z linką (Tricep Pushdown)',
    muscleGroup: 'Ramiona',
    secondaryMuscles: ['Przedramiona'],
    equipment: 'Wyciąg',
    difficulty: 'Początkujący',
    icon: '⚡',
    description: 'Izolowane ćwiczenie na głowę boczną i przyśrodkową tricepsa.',
    instructions: [
      'Chwyć linę wyciągu górnego, pochyl się lekko w przód i zablokuj łokcie przy żebrach.',
      'Prostuj ramiona w dół, na samym dole rozszerzając końce liny na boki.',
      'Wracaj do kąta 90 stopni bez odrywania łokci.'
    ],
    tip: 'Zatrzymaj pełny wyprost ramion na 1 sekundę dla maksymalnego spięcia tricepsów.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 25
  },
  {
    id: 'ex_hammer_curls',
    name: 'Uginanie przedramion chwytem młotkowym (Hammer Curls)',
    muscleGroup: 'Ramiona',
    secondaryMuscles: ['Mięsień ramienny', 'Przedramiona'],
    equipment: 'Hantle',
    difficulty: 'Początkujący',
    icon: '🔨',
    description: 'Buduje grubość ramienia poprzez zaangażowanie mięśnia ramiennego (brachialis) oraz ramienno-promieniowego.',
    instructions: [
      'Trzymaj hantle chwytem młotkowym (kciuki skierowane w górę).',
      'Unieś hantle bez skręcania nadgarstków.',
      'Kontroluj fazę opuszczania.'
    ],
    tip: 'Świetnie sprawdza się w budowaniu szerokości ramienia widzianego z przodu.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 14
  },

  // BRZUCH / CORE
  {
    id: 'ex_hanging_leg_raises',
    name: 'Wznosy nóg w zwisie na drążku (Hanging Leg Raises)',
    muscleGroup: 'Brzuch',
    secondaryMuscles: ['Zginacze bioder', 'Przedramiona'],
    equipment: 'Masa ciała',
    difficulty: 'Zaawansowany',
    icon: '🔥',
    description: 'Jedno z najskuteczniejszych ćwiczeń na dolne rejony mięśnia prostego brzucha i core.',
    instructions: [
      'Zawiśnij swobodnie na drążku nachwytem.',
      'Zainicjuj ruch podwinięciem miednicy i unoszeniem prostych lub ugiętych nóg do poziomu klatki.',
      'Opuszczaj nogi powoli, nie pozwalając ciału na rozbujanie.'
    ],
    tip: 'Kluczem jest zawijanie miednicy do pępka, a nie samo machanie nogami w stawach biodrowych.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0
  },
  {
    id: 'ex_ab_wheel_rollout',
    name: 'Rozjazdy kółkiem na brzuch (Ab Wheel Rollout)',
    muscleGroup: 'Brzuch',
    secondaryMuscles: ['Core', 'Najszerszy grzbietu'],
    equipment: 'Masa ciała',
    difficulty: 'Zaawansowany',
    icon: '⚙️',
    description: 'Ekstremalnie wymagające ćwiczenie antywyprostne budujące pancerny gorset mięśniowy.',
    instructions: [
      'Klęknij na macie, trzymając kółko oburącz pod barkami.',
      'Napnij mocno pośladki i brzuch (pozycja hollow body).',
      'Wytaczaj kółko w przód tak daleko, jak jesteś w stanie utrzymać neutralne lędźwie.',
      'Przyciągnij kółko z powrotem pracą mięśni brzucha.'
    ],
    tip: 'Nigdy nie dopuść do zapadnięcia się lędźwi w dół – jeśli czujesz ból pleców, zmniejsz zasięg ruchu.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0
  },
  {
    id: 'ex_plank',
    name: 'Deska klasyczna (Plank)',
    muscleGroup: 'Brzuch',
    secondaryMuscles: ['Barki', 'Pośladki'],
    equipment: 'Masa ciała',
    difficulty: 'Początkujący',
    icon: '🪵',
    description: 'Podstawowe ćwiczenie izometryczne wzmacniające głębokie mięśnie stabilizujące tułów.',
    instructions: [
      'Oprzyj się na przedramionach i palcach stóp.',
      'Ciało powinno tworzyć idealną linię prostą od głowy do pięt.',
      'Mocno napnij brzuch, pośladki i czworogłowe ud, oddychaj miarowo.'
    ],
    tip: 'Lepszy jest 30-sekundowy maksymalnie spięty plank niż 2 minuty luźnego wiszenia na stawach.',
    defaultSets: 3,
    defaultReps: 60,
    defaultWeight: 0
  }
];

export interface PredefinedRoutine {
  id: string;
  name: string;
  category: 'FBW' | 'Push/Pull/Legs' | 'Góra/Dół' | 'Kalistenika' | 'Szybki Trening';
  level: 'Początkujący' | 'Średniozaawansowany' | 'Zaawansowany';
  duration: string;
  description: string;
  icon: string;
  exercises: {
    exercise: string;
    muscleGroup: 'Klatka' | 'Plecy' | 'Nogi' | 'Barki' | 'Ramiona' | 'Brzuch' | 'Inne';
    sets: number;
    reps: number;
    weight: number;
  }[];
}

export const PREDEFINED_ROUTINES: PredefinedRoutine[] = [
  {
    id: 'rout_fbw_a',
    name: 'FBW Klasyk – Zestaw A (Masa & Siła)',
    category: 'FBW',
    level: 'Średniozaawansowany',
    duration: '60 min',
    description: 'Kompletny trening całego ciała oparty na głównych bojach wielostawowych.',
    icon: '⚡',
    exercises: [
      { exercise: 'Przysiad ze sztangą na plecach (Back Squat)', muscleGroup: 'Nogi', sets: 4, reps: 8, weight: 90 },
      { exercise: 'Wyciskanie sztangi leżąc na ławce poziomej', muscleGroup: 'Klatka', sets: 4, reps: 8, weight: 75 },
      { exercise: 'Wiosłowanie sztangą w opadzie tułowia', muscleGroup: 'Plecy', sets: 4, reps: 8, weight: 65 },
      { exercise: 'Wyciskanie żołnierskie nad głowę (OHP)', muscleGroup: 'Barki', sets: 3, reps: 8, weight: 45 },
      { exercise: 'Uginanie przedramion z hantlami z supinacją', muscleGroup: 'Ramiona', sets: 3, reps: 10, weight: 14 },
      { exercise: 'Wznosy nóg w zwisie na drążku (Hanging Leg Raises)', muscleGroup: 'Brzuch', sets: 3, reps: 12, weight: 0 },
    ]
  },
  {
    id: 'rout_push_power',
    name: 'Push Day – Klatka, Barki & Triceps',
    category: 'Push/Pull/Legs',
    level: 'Zaawansowany',
    duration: '65 min',
    description: 'Intensywny dzień pchania stymulujący przednią taśmę obręczy barkowej i ramiona.',
    icon: '🔥',
    exercises: [
      { exercise: 'Wyciskanie sztangi leżąc na ławce poziomej', muscleGroup: 'Klatka', sets: 4, reps: 6, weight: 85 },
      { exercise: 'Wyciskanie hantli na ławce skośnej dodatniej', muscleGroup: 'Klatka', sets: 4, reps: 10, weight: 28 },
      { exercise: 'Pompki na poręczach (Dips) z pochyleniem', muscleGroup: 'Klatka', sets: 3, reps: 10, weight: 0 },
      { exercise: 'Wznosy hantli bokiem (Lateral Raises)', muscleGroup: 'Barki', sets: 4, reps: 15, weight: 10 },
      { exercise: 'Prostowanie ramion na wyciągu z linką (Tricep Pushdown)', muscleGroup: 'Ramiona', sets: 3, reps: 12, weight: 25 },
    ]
  },
  {
    id: 'rout_pull_hypertrophy',
    name: 'Pull Day – Grzbiet, Tył Barku & Biceps',
    category: 'Push/Pull/Legs',
    level: 'Zaawansowany',
    duration: '65 min',
    description: 'Gęstość i szerokość pleców połączona z potężnym treningiem ramion.',
    icon: '🧗‍♂️',
    exercises: [
      { exercise: 'Martwy ciąg klasyczny (Conventional Deadlift)', muscleGroup: 'Plecy', sets: 4, reps: 5, weight: 130 },
      { exercise: 'Podciąganie na drążku nachwytem (Pull-Ups)', muscleGroup: 'Plecy', sets: 4, reps: 8, weight: 0 },
      { exercise: 'Wiosłowanie sztangą w opadzie tułowia', muscleGroup: 'Plecy', sets: 3, reps: 10, weight: 70 },
      { exercise: 'Face Pulls na wyciągu z liną', muscleGroup: 'Barki', sets: 3, reps: 15, weight: 25 },
      { exercise: 'Uginanie przedramion chwytem młotkowym (Hammer Curls)', muscleGroup: 'Ramiona', sets: 3, reps: 10, weight: 14 },
    ]
  },
  {
    id: 'rout_legs_core',
    name: 'Legs & Core – Potęga Dolnych Partii',
    category: 'Push/Pull/Legs',
    level: 'Średniozaawansowany',
    duration: '60 min',
    description: 'Kompleksowy trening nóg, pośladków oraz mięśni głębokich korpusu.',
    icon: '🦵',
    exercises: [
      { exercise: 'Przysiad ze sztangą na plecach (Back Squat)', muscleGroup: 'Nogi', sets: 4, reps: 6, weight: 100 },
      { exercise: 'Rumuński martwy ciąg z hantlami/sztangą (RDL)', muscleGroup: 'Nogi', sets: 3, reps: 10, weight: 34 },
      { exercise: 'Wypychanie ciężaru na suwnicy (Leg Press)', muscleGroup: 'Nogi', sets: 3, reps: 12, weight: 160 },
      { exercise: 'Wykroki chodzone z hantlami (Walking Lunges)', muscleGroup: 'Nogi', sets: 3, reps: 12, weight: 16 },
      { exercise: 'Rozjazdy kółkiem na brzuch (Ab Wheel Rollout)', muscleGroup: 'Brzuch', sets: 3, reps: 10, weight: 0 },
    ]
  },
  {
    id: 'rout_upper_power',
    name: 'Upper Body – Góra Ciała Power',
    category: 'Góra/Dół',
    level: 'Średniozaawansowany',
    duration: '55 min',
    description: 'Zbalansowany trening wszystkich partii góry ciała w systemie Upper/Lower.',
    icon: '🦾',
    exercises: [
      { exercise: 'Wyciskanie sztangi leżąc na ławce poziomej', muscleGroup: 'Klatka', sets: 4, reps: 8, weight: 80 },
      { exercise: 'Ściąganie drążka wyciągu górnego do klatki', muscleGroup: 'Plecy', sets: 4, reps: 10, weight: 60 },
      { exercise: 'Wyciskanie żołnierskie nad głowę (OHP)', muscleGroup: 'Barki', sets: 3, reps: 8, weight: 45 },
      { exercise: 'Rozpiętki na wyciągu bramowym (Cable Flyes)', muscleGroup: 'Klatka', sets: 3, reps: 12, weight: 15 },
      { exercise: 'Uginanie przedramion z hantlami z supinacją', muscleGroup: 'Ramiona', sets: 3, reps: 10, weight: 14 },
      { exercise: 'Prostowanie ramion na wyciągu z linką (Tricep Pushdown)', muscleGroup: 'Ramiona', sets: 3, reps: 12, weight: 25 },
    ]
  },
  {
    id: 'rout_quick_core',
    name: 'Szybki Trening – Pancerny Brzuch & Core (15 min)',
    category: 'Szybki Trening',
    level: 'Początkujący',
    duration: '15 min',
    description: 'Ekspresowy zestaw na mięśnie proste, skośne oraz stabilizację tułowia.',
    icon: '⏱️',
    exercises: [
      { exercise: 'Wznosy nóg w zwisie na drążku (Hanging Leg Raises)', muscleGroup: 'Brzuch', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Rozjazdy kółkiem na brzuch (Ab Wheel Rollout)', muscleGroup: 'Brzuch', sets: 3, reps: 10, weight: 0 },
      { exercise: 'Deska klasyczna (Plank)', muscleGroup: 'Brzuch', sets: 3, reps: 60, weight: 0 },
    ]
  }
];
