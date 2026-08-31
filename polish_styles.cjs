const fs = require('fs');

const files = [
  'src/components/HabitTracker.tsx',
  'src/components/FoodTracker.tsx',
  'src/components/GymTracker.tsx',
  'src/components/Settings.tsx',
  'src/components/Community.tsx',
  'src/components/Auth.tsx',
  'src/components/Dashboard.tsx',
  'src/components/Overview.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace some dark mode leftovers
  content = content.replace(/bg-white\/10/g, 'bg-black/5');
  content = content.replace(/bg-white\/20/g, 'bg-black/10');
  content = content.replace(/border-white\/30/g, 'border-black/10');
  content = content.replace(/border-white\/20/g, 'border-black/10');
  content = content.replace(/border-white\/10/g, 'border-black/5');
  
  // Fix button text on white backgrounds
  content = content.replace(/text-white text-zinc-900/g, 'text-zinc-900');
  content = content.replace(/text-white\/50/g, 'text-zinc-500');

  // Fix border-black/5 inside dark containers back to white/10 (in Overview and Dashboard mostly)
  content = content.replace(/className="(.*?)bg-zinc-950(.*?)border-black\/5(.*?)"/g, 'className="$1bg-zinc-950$2border-white/10$3"');
  content = content.replace(/className="(.*?)bg-zinc-950(.*?)bg-black\/5(.*?)"/g, 'className="$1bg-zinc-950$2bg-white/10$3"');
  content = content.replace(/className="(.*?)bg-zinc-950(.*?)bg-black\/10(.*?)"/g, 'className="$1bg-zinc-950$2bg-white/20$3"');

  fs.writeFileSync(file, content);
}
console.log('Polished remaining light mode styles.');
