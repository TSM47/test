export interface Recipe {
  id: string;
  title: string;
  category: 'Śniadanie' | 'Obiad' | 'Kolacja' | 'Przekąska';
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  difficulty: 'Łatwe' | 'Średnie' | 'Zaawansowane';
  icon: string;
  description: string;
  servings: number;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  tip?: string;
}

export const FITNESS_RECIPES: Recipe[] = [
  {
    id: 'rec_1',
    title: 'Proteinowa Owsianka Snickers z Masłem Orzechowym',
    category: 'Śniadanie',
    tags: ['Wysokobiałkowe', 'Szybkie', 'Śniadania'],
    calories: 520,
    protein: 42,
    carbs: 58,
    fat: 14,
    time: '10 min',
    difficulty: 'Łatwe',
    icon: '🥣',
    description: 'Kremowa owsianka na mleku migdałowym z odżywką czekoladową, orzechami i bananem.',
    servings: 1,
    ingredients: [
      { name: 'Płatki owsiane górskie', amount: '60g' },
      { name: 'Odżywka białkowa WPC (czekolada/karmel)', amount: '30g' },
      { name: 'Mleko 1.5% lub napój migdałowy', amount: '200ml' },
      { name: 'Masło orzechowe 100%', amount: '15g' },
      { name: 'Banan pokrojony w plastry', amount: '1/2 sztuki (60g)' },
      { name: 'Cynamon cejloński', amount: 'szczypta' }
    ],
    steps: [
      'Płatki owsiane zalej mlekiem i gotuj na małym ogniu przez ok. 5 minut do zgęstnienia.',
      'Zdejmij garnek z ognia, odczekaj minutę i energicznie wymieszaj z odżywką białkową (nie gotuj wrzącej odżywki, by nie ściąć białka).',
      'Przełóż do miski, udekoruj plastrami banana i łyżką masła orzechowego.'
    ],
    tip: 'Dodaj szczyptę soli himalajskiej, aby podbić smak karmelowo-orzechowy!'
  },
  {
    id: 'rec_2',
    title: 'Puszysty Omlet Biszkoptowy z Owocami Leśnymi',
    category: 'Śniadanie',
    tags: ['Wysokobiałkowe', 'Szybkie', 'Śniadania', 'Keto / Low-Carb'],
    calories: 390,
    protein: 34,
    carbs: 22,
    fat: 18,
    time: '12 min',
    difficulty: 'Łatwe',
    icon: '🍳',
    description: 'Ekspresowy omlet z ubitych białek podany ze skyrem i borówkami.',
    servings: 1,
    ingredients: [
      { name: 'Jaja całe (klasa L)', amount: '3 sztuki' },
      { name: 'Skyr naturalny lub waniliowy', amount: '100g' },
      { name: 'Mąka owsiana / orkiszowa', amount: '20g' },
      { name: 'Świeże borówki lub maliny', amount: '80g' },
      { name: 'Erytrytol / ksylitol', amount: '1 łyżeczka' },
      { name: 'Olej kokosowy lub oliwa w sprayu', amount: '1g' }
    ],
    steps: [
      'Oddziel białka od żółtek. Białka ubij na sztywną pianę z odrobiną erytrytolu.',
      'W osobnej misce wymieszaj żółtka z mąką, a następnie delikatnie połącz szpatułką z pianą z białek.',
      'Smaż na małym ogniu pod przykryciem ok. 4-5 minut z każdej strony.',
      'Podawaj posmarowany skyrem i obsypany owocami leśnymi.'
    ],
    tip: 'Przykrycie patelni pokrywką jest kluczem do uzyskania 3-centymetrowej puszystości.'
  },
  {
    id: 'rec_3',
    title: 'Pieczona Pierś z Kurczaka w Ziołach, Ryż Basmati & Szparagi',
    category: 'Obiad',
    tags: ['Wysokobiałkowe', 'Obiady', 'Bezlaktozowe'],
    calories: 580,
    protein: 54,
    carbs: 68,
    fat: 9,
    time: '25 min',
    difficulty: 'Łatwe',
    icon: '🍗',
    description: 'Klasyk kulturystyczny w wersji restauracyjnej z chrupiącymi warzywami.',
    servings: 1,
    ingredients: [
      { name: 'Pierś z kurczaka bez skóry', amount: '220g' },
      { name: 'Ryż basmati (suchy)', amount: '75g' },
      { name: 'Szparagi zielone / fasolka szparagowa', amount: '150g' },
      { name: 'Oliwa z oliwek z pierwszego tłoczenia', amount: '8g' },
      { name: 'Czosnek, papryka wędzona, rozmaryn', amount: 'do smaku' },
      { name: 'Sok z cytryny', amount: '1 łyżka' }
    ],
    steps: [
      'Kurczaka natrzyj oliwą, czosnkiem, wędzoną papryką, solą i rozmarynem.',
      'Piecz w piekarniku nagrzanym do 190°C przez 18-20 minut lub smaż na patelni grillowej.',
      'W tym czasie ugotuj ryż basmati w osolonej wodzie (12 minut) oraz zblanszuj szparagi.',
      'Podawaj skropione sokiem ze świeżej cytryny.'
    ],
    tip: 'Daj mięsu odpocząć 3 minuty po upieczeniu przed pokrojeniem – zachowa 100% soczystości.'
  },
  {
    id: 'rec_4',
    title: 'Pikantne Chilli con Carne z Chudej Wołowiny',
    category: 'Obiad',
    tags: ['Wysokobiałkowe', 'Obiady', 'Meal Prep'],
    calories: 640,
    protein: 52,
    carbs: 62,
    fat: 18,
    time: '30 min',
    difficulty: 'Średnie',
    icon: '🍲',
    description: 'Aromatyczny gulasz z mielonej wołowiny z czerwoną fasolą, kuminem i pomidorami.',
    servings: 1,
    ingredients: [
      { name: 'Mielona wołowina chuda (np. ligawa/udziec)', amount: '180g' },
      { name: 'Czerwona fasola z puszki (odsączona)', amount: '100g' },
      { name: 'Krojone pomidory w puszce (passata)', amount: '200g' },
      { name: 'Kukurydza konserwowa', amount: '40g' },
      { name: 'Cebula czerwona & ząbek czosnku', amount: '1 sztuka' },
      { name: 'Kumin, oregano, chilli, kakao gorzkie', amount: 'po 1/2 łyżeczki' }
    ],
    steps: [
      'Zeszklij posiekaną cebulę i czosnek na patelni, dodaj wołowinę i podsmażaj do zbrązowienia.',
      'Dodaj przyprawy (kumin, oregano, chilli, szczyptę kakao), smaż przez 1 minutę.',
      'Wlej passatę pomidorową, dodaj fasolę i kukurydzę. Gotuj na małym ogniu przez 15-20 minut.',
      'Doskonale smakuje z ryżem lub jako farsz do pełnoziarnistej tortilli.'
    ],
    tip: 'Odrobinę gorzkiego kakao pogłębia smak i nadaje meksykański charakter sosowi.'
  },
  {
    id: 'rec_5',
    title: 'Wrap Fit z Tuńczykiem, Awokado i Jajkiem na Twardo',
    category: 'Kolacja',
    tags: ['Szybkie', 'Kolacje', 'Wysokobiałkowe'],
    calories: 460,
    protein: 40,
    carbs: 38,
    fat: 16,
    time: '8 min',
    difficulty: 'Łatwe',
    icon: '🌯',
    description: 'Błyskawiczna kolacja bogata w kwasy Omega-3 i zdrowe tłuszcze nienasycone.',
    servings: 1,
    ingredients: [
      { name: 'Tortilla pełnoziarnista duża', amount: '1 sztuka (60g)' },
      { name: 'Tuńczyk w sosie własnym (odsączony)', amount: '120g' },
      { name: 'Jajko ugotowane na twardo', amount: '1 sztuka' },
      { name: 'Awokado dojrzałe', amount: '40g (1/4 sztuki)' },
      { name: 'Jogurt grecki 0% lub skyr', amount: '2 łyżki (40g)' },
      { name: 'Rukola i pomidorki koktajlowe', amount: 'garść' }
    ],
    steps: [
      'Tuńczyka rozgnieć widelcem razem z awokado, posiekanym jajkiem i jogurtem.',
      'Dopraw solą morską, świeżo mielonym pieprzem i sokiem z limonki.',
      'Rozsmaruj farsz na tortilli, dodaj rukolę i pomidorki, zawiń ciasno w rulon.',
      'Podpiecz na suchej patelni grillowej przez 2 minuty dla chrupkości.'
    ]
  },
  {
    id: 'rec_6',
    title: 'Pieczony Łosoś w Glazurze Miodowo-Sojowej z Komosą Ryżową',
    category: 'Obiad',
    tags: ['Obiady', 'Wysokobiałkowe', 'Zdrowe Tłuszcze'],
    calories: 610,
    protein: 44,
    carbs: 48,
    fat: 26,
    time: '20 min',
    difficulty: 'Średnie',
    icon: '🐟',
    description: 'Soczysty filet łososia norweskiego z chrupiącą skórką i zbalansowanym sosem.',
    servings: 1,
    ingredients: [
      { name: 'Filet ze świeżego łososia', amount: '180g' },
      { name: 'Komosa ryżowa (quinoa) lub ryż jaśminowy', amount: '60g' },
      { name: 'Sos sojowy ciemny o obniżonej zawartości soli', amount: '1 łyżka' },
      { name: 'Miód naturalny lub syrop klonowy', amount: '1 łyżeczka (8g)' },
      { name: 'Starty imbir i ząbek czosnku', amount: 'po 1/2 łyżeczki' },
      { name: 'Brokuł gotowany na parze', amount: '150g' }
    ],
    steps: [
      'Wymieszaj sos sojowy, miód, starty imbir i czosnek.',
      'Posmaruj łososia marynatą i piecz w 200°C przez 12-14 minut.',
      'W międzyczasie ugotuj komosę ryżową (15 min) i brokuły na parze (5 min).',
      'Ułóż wszystko na talerzu i polej pozostałym sosem z pieczenia.'
    ]
  },
  {
    id: 'rec_7',
    title: 'Bananowy Szejk Anaboliczny Post-Workout',
    category: 'Przekąska',
    tags: ['Szybkie', 'Przekąski & Szejki', 'Wysokobiałkowe', 'Przed/Po Treningu'],
    calories: 420,
    protein: 38,
    carbs: 52,
    fat: 7,
    time: '3 min',
    difficulty: 'Łatwe',
    icon: '🥤',
    description: 'Błyskawiczna regeneracja glikogenu i mięśni po ciężkiej sesji na siłowni.',
    servings: 1,
    ingredients: [
      { name: 'Odżywka białkowa WPC (wanilia lub banan)', amount: '35g' },
      { name: 'Dojrzały banan', amount: '1 sztuka (120g)' },
      { name: 'Płatki owsiane błyskawiczne', amount: '30g' },
      { name: 'Mleko 1.5% lub napój owsiany', amount: '250ml' },
      { name: 'Kakao naturalne odtłuszczone', amount: '1 łyżeczka' },
      { name: 'Kostki lodu', amount: '4 sztuki' }
    ],
    steps: [
      'Wszystkie składniki umieść w kielichu blendera.',
      'Miksuj na najwyższych obrotach przez 45 sekund do uzyskania gładkiego koktajlu.',
      'Wypij bezpośrednio po przygotowaniu.'
    ],
    tip: 'Zblendowane płatki owsiane nadają gęstą konsystencję milkshake’a!'
  },
  {
    id: 'rec_8',
    title: 'Twarogowy Kociołek Szefa z Rzodkiewką i Szczypiorkiem',
    category: 'Kolacja',
    tags: ['Szybkie', 'Kolacje', 'Keto / Low-Carb', 'Wysokobiałkowe'],
    calories: 320,
    protein: 44,
    carbs: 12,
    fat: 8,
    time: '5 min',
    difficulty: 'Łatwe',
    icon: '🧀',
    description: 'Klasyczny, lekki twaróg ze świeżymi chrupiącymi warzywami i nasionami lnu.',
    servings: 1,
    ingredients: [
      { name: 'Twaróg chudy lub półtłusty', amount: '200g' },
      { name: 'Jogurt naturalny / kefir', amount: '60g' },
      { name: 'Rzodkiewka świeża', amount: '5 sztuk (posiekana)' },
      { name: 'Szczypiorek i koperek', amount: '2 łyżki' },
      { name: 'Siemię lniane mielone lub nasiona chia', amount: '10g' },
      { name: 'Sól kamienna i świeży czarny pieprz', amount: 'do smaku' }
    ],
    steps: [
      'Twaróg rozgnieć widelcem w misce z jogurtem/kefirem.',
      'Dodaj posiekaną rzodkiewkę, szczypiorek, siemię lniane, sól i pieprz.',
      'Dokładnie wymieszaj. Idealne solo lub z kromką chleba żytniego na zakwasie.'
    ]
  },
  {
    id: 'rec_9',
    title: 'Fit Bowl z Tofu w Sosie Teriyaki i Edamame',
    category: 'Obiad',
    tags: ['Obiady', 'Wegetariańskie', 'Wysokobiałkowe'],
    calories: 510,
    protein: 36,
    carbs: 58,
    fat: 14,
    time: '18 min',
    difficulty: 'Średnie',
    icon: '🥗',
    description: 'Chrupiące tofu w marynacie teriyaki podane na ryżu jaśminowym z warzywami.',
    servings: 1,
    ingredients: [
      { name: 'Tofu naturalne twarde (odciśnięte)', amount: '180g' },
      { name: 'Mąka ziemniaczana / skrobia', amount: '1 łyżka (do chrupkości)' },
      { name: 'Ryż jaśminowy (suchy)', amount: '65g' },
      { name: 'Fasolka edamame ugotowana', amount: '60g' },
      { name: 'Sos teriyaki / sojowy + czosnek', amount: '2 łyżki' },
      { name: 'Olej sezamowy', amount: '5g' }
    ],
    steps: [
      'Tofu pokrój w kostkę, obtocz w skrobi ziemniaczanej i podsmaż na oleju sezamowym na złoto.',
      'Wlej sos teriyaki i zredukuj na patelni przez 1 minutę aż obklei tofu.',
      'Ułóż na ugotowanym ryżu obok edamame i posyp prażonym sezamem.'
    ]
  },
  {
    id: 'rec_10',
    title: 'Proteinowy Deser Skyr-Lava z Masłem Migdałowym i Malinami',
    category: 'Przekąska',
    tags: ['Szybkie', 'Przekąski & Szejki', 'Keto / Low-Carb'],
    calories: 280,
    protein: 30,
    carbs: 18,
    fat: 8,
    time: '4 min',
    difficulty: 'Łatwe',
    icon: '🍓',
    description: 'Słodka, zdrowa przekąska zaspokajająca ochotę na słodycze bez grama cukru.',
    servings: 1,
    ingredients: [
      { name: 'Skyr naturalny gęsty', amount: '200g' },
      { name: 'Odżywka białkowa o smaku białej czekolady/maliny', amount: '15g' },
      { name: 'Ciepłe maliny (mrożone lub świeże zblendowane)', amount: '80g' },
      { name: 'Masło migdałowe lub z orzechów nerkowca', amount: '10g' }
    ],
    steps: [
      'Wymieszaj skyr z odżywką białkową na gładką aksamitną masę.',
      'Maliny podgrzej krótko w rondelku lub mikrofali i polej nimi wierzch skyru.',
      'Zwieńcz strużką masła migdałowego.'
    ]
  }
];
