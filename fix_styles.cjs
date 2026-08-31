const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.push('../App.tsx');

const replacements = [
  { from: /bg-\[\#111111\]\/80 backdrop-blur-md/g, to: 'bg-white/5 backdrop-blur-2xl' },
  { from: /border-white\/50/g, to: 'border-white/10' },
  { from: /stroke="#2A2A2A"/g, to: 'stroke="#a855f7"' }, // purple-500
  { from: /fill="#2A2A2A"/g, to: 'fill="#a855f7"' },
  { from: /stroke="#8B9D8B"/g, to: 'stroke="#22d3ee"' }, // cyan-400
  { from: /fill="#8B9D8B"/g, to: 'fill="#22d3ee"' },
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content);
}
console.log('Fixed styles.');
