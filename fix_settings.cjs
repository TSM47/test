const fs = require('fs');
let content = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// 1. Update imports for icons (Need to add Watch or Activity or similar)
content = content.replace(/import { User, Bell, Palette, Scale, Moon, Sun, Monitor, CreditCard, Settings2 } from 'lucide-react';/g, "import { User, Bell, Palette, Scale, Moon, Sun, Monitor, CreditCard, Settings2, Watch, Check, RefreshCw } from 'lucide-react';");

// 2. Update type SettingsTab
content = content.replace(/type SettingsTab = 'profil' \| 'ogolne' \| 'subskrypcja' \| 'wyglad' \| 'powiadomienia' \| 'jednostki';/g, "type SettingsTab = 'profil' | 'ogolne' | 'subskrypcja' | 'wyglad' | 'powiadomienia' | 'synchronizacja';");

// 3. Update tabs array
content = content.replace(/{ id: 'jednostki' as SettingsTab, label: 'Jednostki', icon: Scale },/g, "{ id: 'synchronizacja' as SettingsTab, label: 'Synchronizuj', icon: Watch },");

// 4. Update 'ogolne' tab to include units
const unitsContent = `
                  <div className="pt-6 border-t border-zinc-100">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 mb-1">Preferencje Jednostek</h3>
                      <p className="text-xs font-medium text-zinc-500 mb-6">Wybierz, jak chcesz widzieć swoje statystyki.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Waga</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-zinc-300 focus:shadow-sm transition-colors text-sm font-medium text-zinc-900 appearance-none">
                          <option value="kg">Kilogramy (kg)</option>
                          <option value="lbs">Funt (lbs)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Odległość</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-zinc-300 focus:shadow-sm transition-colors text-sm font-medium text-zinc-900 appearance-none">
                          <option value="km">Kilometry (km)</option>
                          <option value="mi">Mile (mi)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Płyny</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-zinc-300 focus:shadow-sm transition-colors text-sm font-medium text-zinc-900 appearance-none">
                          <option value="ml">Mililitry (ml)</option>
                          <option value="oz">Uncje (oz)</option>
                        </select>
                      </div>
                    </div>
                  </div>
`;

// Insert units into 'ogolne' before the button
content = content.replace(/<button className="bg-zinc-950 text-white px-6 py-3 rounded-\[2rem\] text-sm font-semibold transition-colors hover:opacity-90 hover:scale-\[1.02\]">\s*Aktualizuj parametry\s*<\/button>/g, unitsContent + '\n                  <button className="bg-zinc-950 text-white px-6 py-3 rounded-[2rem] text-sm font-semibold transition-colors hover:opacity-90 hover:scale-[1.02] mt-8">\n                    Aktualizuj parametry\n                  </button>');

// 5. Replace 'jednostki' tab with 'synchronizacja'
const syncContent = `{activeTab === 'synchronizacja' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">Synchronizacja Urządzeń</h3>
                    <p className="text-xs font-medium text-zinc-500">Podłącz swój zegarek sportowy lub aplikację, by automatycznie pobierać aktywności.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-zinc-200 rounded-[2rem] p-6 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-black rounded-[1.2rem] flex items-center justify-center">
                          <Watch className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Podłączono
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900">Apple Watch</h4>
                        <p className="text-sm font-medium text-zinc-500 mb-4">Pobieranie tętna, kroków i treningów</p>
                        <button className="w-full py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 rounded-[2rem] text-sm font-bold transition-colors">
                          Konfiguruj
                        </button>
                      </div>
                    </div>

                    <div className="border border-zinc-200 rounded-[2rem] p-6 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-[1.2rem] flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-xs font-bold">
                          Rozłączony
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900">Garmin Connect</h4>
                        <p className="text-sm font-medium text-zinc-500 mb-4">Synchronizuj biegi, jazdy i parametry zdrowia</p>
                        <button className="w-full py-3 bg-black hover:bg-black/90 text-white rounded-[2rem] text-sm font-bold transition-colors">
                          Połącz z Garmin
                        </button>
                      </div>
                    </div>

                    <div className="border border-zinc-200 rounded-[2rem] p-6 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-red-600 rounded-[1.2rem] flex items-center justify-center text-white font-bold text-xl">
                          P
                        </div>
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-xs font-bold">
                          Rozłączony
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900">Polar Flow</h4>
                        <p className="text-sm font-medium text-zinc-500 mb-4">Synchronizacja treningów interwałowych</p>
                        <button className="w-full py-3 bg-black hover:bg-black/90 text-white rounded-[2rem] text-sm font-bold transition-colors">
                          Połącz z Polar
                        </button>
                      </div>
                    </div>

                    <div className="border border-zinc-200 rounded-[2rem] p-6 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-[1.2rem] flex items-center justify-center text-white font-bold text-xl">
                          S
                        </div>
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-xs font-bold">
                          Rozłączony
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900">Suunto</h4>
                        <p className="text-sm font-medium text-zinc-500 mb-4">Mapy, trasy i zaawansowane statystyki</p>
                        <button className="w-full py-3 bg-black hover:bg-black/90 text-white rounded-[2rem] text-sm font-bold transition-colors">
                          Połącz z Suunto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}`;

const searchJednostki = `{activeTab === 'jednostki' && (`;
const idx = content.indexOf(searchJednostki);

if (idx !== -1) {
  // Find the end of the jednostki block. It ends just before `            </motion.div>`
  const endIdx = content.indexOf('            </motion.div>', idx);
  content = content.substring(0, idx) + syncContent + '\n' + content.substring(endIdx);
}

fs.writeFileSync('src/components/Settings.tsx', content);
