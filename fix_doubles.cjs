const fs = require('fs');
const dir = 'src/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(dir + file, 'utf8');
  content = content.replace(/border border-zinc-200\/60 border border-zinc-200/g, 'border border-zinc-200/60');
  content = content.replace(/border border-zinc-200\/60 shadow-sm/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60');
  content = content.replace(/shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-zinc-200\/60 border border-zinc-200 mb-8/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 mb-8');
  fs.writeFileSync(dir + file, content);
}
console.log('Fixed double classes');
