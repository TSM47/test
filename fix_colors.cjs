const fs = require('fs');

const files = [
  'src/components/HabitTracker.tsx',
  'src/components/FoodTracker.tsx',
  'src/components/GymTracker.tsx',
  'src/components/Settings.tsx',
  'src/components/Community.tsx',
  'src/components/Auth.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix bg-zinc-950 text-zinc-900 (should be text-white)
  content = content.replace(/bg-zinc-950 text-zinc-900/g, 'bg-zinc-950 text-white');
  
  // Fix button text inside bg-zinc-950
  content = content.replace(/bg-zinc-950 hover:opacity-90 hover:scale-\[1.02\] text-zinc-900/g, 'bg-zinc-950 hover:opacity-90 hover:scale-[1.02] text-white');

  // Any text-zinc-900 inside dark elements? We'll just replace 'bg-zinc-950' elements' text manually if needed.
  // Actually, since I did a blind text-white -> text-zinc-900 replace earlier, almost all text is zinc-900 now.
  // This is fine for light mode EXCEPT where bg is dark (like bg-zinc-950).
  content = content.replace(/className="(.*?)bg-zinc-950(.*?)"/g, (match, p1, p2) => {
    let newClass = match.replace(/text-zinc-900/g, 'text-white').replace(/text-zinc-500/g, 'text-zinc-400');
    if (!newClass.includes('text-white') && !newClass.includes('text-zinc-')) {
       newClass = newClass.replace(/bg-zinc-950/, 'bg-zinc-950 text-white');
    }
    return newClass;
  });

  fs.writeFileSync(file, content);
}
console.log('Fixed text contrast on dark backgrounds.');
