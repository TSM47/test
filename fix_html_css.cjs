const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/Space\+Grotesk:wght@[^&]+/, 'Plus+Jakarta+Sans:wght@400;500;600;700;800');
html = html.replace(/Cosmic Tracker/g, 'Bento Flow');
fs.writeFileSync('index.html', html);

let css = `@import "tailwindcss";

@layer base {
  body {
    @apply bg-[#EAE9E5] text-zinc-900 antialiased;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
}
`;
fs.writeFileSync('src/index.css', css);
console.log("HTML and CSS reset.");
