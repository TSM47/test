const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.push('../App.tsx'); // Also update App.tsx

const replacements = [
  { from: /bg-white/g, to: 'bg-[#111111]/80 backdrop-blur-md' },
  { from: /bg-stone-50/g, to: 'bg-white/5' },
  { from: /bg-\[\#2A2A2A\]/g, to: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' },
  { from: /text-\[\#2A2A2A\]/g, to: 'text-white' },
  { from: /text-stone-700/g, to: 'text-zinc-200' },
  { from: /text-stone-600/g, to: 'text-zinc-300' },
  { from: /text-stone-500/g, to: 'text-zinc-400' },
  { from: /text-stone-400/g, to: 'text-zinc-500' },
  { from: /border-stone-100/g, to: 'border-white/10' },
  { from: /border-stone-200/g, to: 'border-white/10' },
  { from: /bg-\[\#F9F9F8\]/g, to: 'bg-transparent' }, // Was used in App.tsx mainly
  { from: /hover:bg-stone-50/g, to: 'hover:bg-white/10' },
  { from: /hover:bg-stone-100/g, to: 'hover:bg-white/20' },
  { from: /shadow-\[0_2px_10px_-3px_rgba\(0,0,0,0\.03\)\]/g, to: 'shadow-[0_0_30px_rgba(79,70,229,0.1)]' },
  { from: /bg-\[\#D4C9B7\]\/20/g, to: 'bg-blue-500/10' },
  { from: /border-\[\#D4C9B7\]\/30/g, to: 'border-blue-500/20' },
  { from: /bg-\[\#8B9D8B\]/g, to: 'bg-cyan-400' },
  { from: /border-\[\#8B9D8B\]/g, to: 'border-cyan-400' },
  { from: /text-\[\#8B9D8B\]/g, to: 'text-cyan-400' },
  { from: /bg-orange-50/g, to: 'bg-orange-500/20' },
  { from: /bg-orange-100/g, to: 'bg-orange-500/30' },
  { from: /text-orange-600/g, to: 'text-orange-400' },
  { from: /text-orange-700/g, to: 'text-orange-300' },
  { from: /bg-blue-50/g, to: 'bg-blue-500/20' },
  { from: /bg-blue-100/g, to: 'bg-blue-500/30' },
  { from: /text-blue-600/g, to: 'text-blue-400' },
  { from: /text-blue-700/g, to: 'text-blue-300' },
  { from: /bg-green-50/g, to: 'bg-emerald-500/20' },
  { from: /bg-green-100/g, to: 'bg-emerald-500/30' },
  { from: /text-green-600/g, to: 'text-emerald-400' },
  { from: /text-green-700/g, to: 'text-emerald-300' },
  { from: /bg-red-50/g, to: 'bg-rose-500/20' },
  { from: /text-red-500/g, to: 'text-rose-400' },
  { from: /bg-yellow-50/g, to: 'bg-amber-500/20' },
  { from: /text-yellow-600/g, to: 'text-amber-400' },
  { from: /bg-purple-50/g, to: 'bg-purple-500/20' },
  { from: /text-purple-600/g, to: 'text-purple-400' },
  { from: /bg-stone-100/g, to: 'bg-white/10' },
  { from: /text-stone-300/g, to: 'text-zinc-500' },
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content);
}
console.log('Replaced styles in components.');
