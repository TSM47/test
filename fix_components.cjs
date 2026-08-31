const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !['Overview.tsx', 'Dashboard.tsx', 'Sidebar.tsx'].includes(f));

const replacements = [
  // General colors and background resets for light Neo-Bento
  { from: /bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500/g, to: 'bg-zinc-950' },
  { from: /bg-white\/5 backdrop-blur-2xl/g, to: 'bg-white' },
  { from: /bg-white\/5/g, to: 'bg-zinc-50' },
  { from: /border-white\/10/g, to: 'border-zinc-200' },
  { from: /border-white\/5/g, to: 'border-zinc-100' },
  { from: /text-white\/40/g, to: 'text-zinc-400' },
  { from: /text-white\/20/g, to: 'text-zinc-500' },
  { from: /text-white\/60/g, to: 'text-zinc-500' },
  { from: /text-white\/80/g, to: 'text-zinc-700' },
  { from: /text-white/g, to: 'text-zinc-900' },
  { from: /bg-\[\#050505\]\/90/g, to: 'bg-white/90' },
  { from: /bg-\[\#050505\]/g, to: 'bg-white' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-zinc-100' },
  { from: /hover:bg-white\/20/g, to: 'hover:bg-zinc-200' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-zinc-100' },
  { from: /rounded-xl/g, to: 'rounded-2xl' },
  { from: /rounded-2xl/g, to: 'rounded-[2rem]' },
  { from: /text-cyan-400/g, to: 'text-blue-600' },
  { from: /bg-cyan-400\/20/g, to: 'bg-blue-100' },
  { from: /bg-cyan-400/g, to: 'bg-blue-500' },
  { from: /border-cyan-400/g, to: 'border-blue-500' },
  { from: /text-purple-400/g, to: 'text-zinc-900' },
  { from: /bg-purple-400/g, to: 'bg-zinc-900' },
  { from: /bg-purple-400\/20/g, to: 'bg-zinc-100' },
  { from: /text-pink-400/g, to: 'text-rose-600' },
  { from: /bg-pink-400/g, to: 'bg-rose-500' },
  { from: /bg-rose-500\/10/g, to: 'bg-rose-100' },
  { from: /text-zinc-900\/50/g, to: 'text-zinc-400' },
  { from: /text-zinc-900\/40/g, to: 'text-zinc-400' },
  { from: /text-zinc-900\/20/g, to: 'text-zinc-500' },
  { from: /text-zinc-900\/80/g, to: 'text-zinc-700' },
  { from: /shadow-\[0_0_30px_rgba\(79,70,229,0\.1\)\]/g, to: 'shadow-sm' },
  { from: /shadow-\[0_0_20px_rgba\(168,85,247,0\.4\)\]/g, to: 'shadow-sm' }
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content);
}
console.log('Fixed other components.');
