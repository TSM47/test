const fs = require('fs');

const files = [
  'src/components/Overview.tsx',
  'src/components/Dashboard.tsx',
  'src/components/FoodTracker.tsx',
  'src/components/GymTracker.tsx',
  'src/components/HabitTracker.tsx',
  'src/components/Community.tsx',
  'src/components/Settings.tsx',
  'src/components/Sidebar.tsx',
  'src/components/Auth.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Upgrade standard white tiles
  content = content.replace(/bg-white p-6 md:p-8 rounded-\[2rem\] (border border-zinc-200 )?shadow-sm/g, 'bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60');
  content = content.replace(/bg-white p-6 rounded-\[2rem\] shadow-sm border border-zinc-200/g, 'bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60');
  content = content.replace(/bg-white p-4 md:p-8 rounded-\[2rem\] shadow-sm border border-zinc-200/g, 'bg-white p-4 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60');
  content = content.replace(/bg-white p-5 rounded-\[2rem\] shadow-sm border border-zinc-200/g, 'bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60');
  
  // Also target standard tiles without specific padding matching
  content = content.replace(/bg-white rounded-\[2rem\] (p-\d+ )?border border-zinc-200/g, (match, p1) => {
     return `bg-white rounded-[2rem] ${p1 || ''}shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60`;
  });

  // Upgrade dark tiles
  content = content.replace(/bg-zinc-950( text-white)? p-6 md:p-8 rounded-\[2rem\] shadow-sm/g, 'bg-zinc-950 text-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900');
  content = content.replace(/bg-zinc-950 rounded-\[2rem\] p-8 text-white(.*?)shadow-xl/g, 'bg-zinc-950 rounded-[2rem] p-8 text-white$1shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900');
  content = content.replace(/bg-zinc-950 p-6 md:p-8 rounded-\[2rem\] border border-zinc-800 shadow-xl text-white/g, 'bg-zinc-950 p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900 text-white');
  content = content.replace(/bg-zinc-950 p-5 rounded-\[2rem\] shadow-sm text-white/g, 'bg-zinc-950 p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900 text-white');

  // Upgrade subtle grey tiles
  content = content.replace(/bg-zinc-100 rounded-\[2rem\] p-6 border border-zinc-200/g, 'bg-zinc-50 rounded-[2rem] p-6 shadow-sm border border-zinc-200/60');
  content = content.replace(/bg-zinc-50 p-6 md:p-8 rounded-\[2rem\] border border-zinc-200/g, 'bg-zinc-50 p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-200/60');
  
  // Make inputs pop a bit more when hovered/focused
  content = content.replace(/focus:border-black\/10/g, 'focus:border-zinc-300 focus:shadow-sm');

  fs.writeFileSync(file, content);
}
console.log('Done upgrading tiles.');
