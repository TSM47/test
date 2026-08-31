const fs = require('fs');
let content = fs.readFileSync('src/components/Community.tsx', 'utf8');

// Upgrade the card container
content = content.replace(/bg-zinc-950 text-white p-8 rounded-\[2rem\] relative overflow-hidden shadow-xl/g, 'bg-zinc-950 text-white p-8 rounded-[2rem] relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-900');

// Fix text colors inside the dark card
content = content.replace(/text-zinc-900\/30/g, 'text-white/30');
content = content.replace(/mt-3 text-zinc-900/g, 'mt-3 text-white');

// Fix background colors inside the dark card
content = content.replace(/bg-black\/5/g, 'bg-white/10');
content = content.replace(/bg-zinc-50 rounded-t-xl/g, 'bg-white/10 rounded-t-xl');
content = content.replace(/bg-zinc-50 rounded-full blur-3xl/g, 'bg-white/10 rounded-full blur-3xl');
content = content.replace(/bg-orange-500\/200/g, 'bg-orange-500');

fs.writeFileSync('src/components/Community.tsx', content);
console.log('Fixed leaderboard');
