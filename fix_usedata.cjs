const fs = require('fs');
let content = fs.readFileSync('src/hooks/useData.ts', 'utf8');

// Change "Wypij 2L wody" to "Idź na spacer"
content = content.replace(/Wypij 2L wody/g, 'Idź na spacer');

// Also update the icon property based on habits
content = content.replace(/id: 'h1', name: 'Idź na spacer', category: 'Zdrowie', createdAt: Date.now\(\) }/g, "id: 'h1', name: 'Idź na spacer', category: 'Zdrowie', icon: '🏃‍♂️', createdAt: Date.now() }");
content = content.replace(/id: 'h2', name: 'Czytaj 15 minut', category: 'Rozwój', createdAt: Date.now\(\) }/g, "id: 'h2', name: 'Czytaj 15 minut', category: 'Rozwój', icon: '📚', createdAt: Date.now() }");
content = content.replace(/id: 'h3', name: 'Medytacja', category: 'Umysł', createdAt: Date.now\(\) }/g, "id: 'h3', name: 'Medytacja', category: 'Umysł', icon: '🧘‍♀️', createdAt: Date.now() }");

// And for the new habits addition
content = content.replace(/const addHabit = \(name: string, category: Habit\['category'\] = 'Inne'\) => {/g, "const addHabit = (name: string, category: Habit['category'] = 'Inne', icon?: string) => {");
content = content.replace(/category,\n      createdAt: Date.now\(\),\n    };/g, "category,\n      icon: icon || '✨',\n      createdAt: Date.now(),\n    };");

fs.writeFileSync('src/hooks/useData.ts', content);
