import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Plus, KeyRound, Sparkles, MapPin, Globe, Lock, 
  ArrowRight, ShieldCheck, Trophy, Flame, Search, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { Club } from '../../types';
import { POLISH_CITIES } from '../../data/clubsData';

interface ClubOnboardingProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
  onJoinByCode: (code: string) => { success: boolean; message: string; club?: Club };
  onSelectPublicClub: (club: Club) => void;
  publicClubs: Club[];
}

export function ClubOnboarding({
  onOpenCreateModal,
  onOpenJoinModal,
  onJoinByCode,
  onSelectPublicClub,
  publicClubs
}: ClubOnboardingProps) {
  const [quickCode, setQuickCode] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [codeFeedback, setCodeFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) {
      setCodeFeedback({ text: 'Wpisz 9-znakowy kod społeczności', isError: true });
      return;
    }
    const res = onJoinByCode(quickCode);
    if (!res.success) {
      setCodeFeedback({ text: res.message, isError: true });
    }
  };

  const filteredClubs = publicClubs.filter(club => {
    const matchesCity = selectedCity === 'Wszystkie' || club.city.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-zinc-950 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-xl border border-zinc-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-zinc-200 text-xs font-bold border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Kluby & Społeczności Dyscypliny
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Buduj nawyki i formę <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-lime-400">
              razem ze swoim klubem.
            </span>
          </h1>

          <p className="text-sm md:text-base text-zinc-300 font-medium leading-relaxed">
            Rywalizuj na passy dni, bierz udział we wspólnych wyzwaniach tonażowych i wymieniaj się doświadczeniem z pasjonatami zdrowego stylu życia w swoim mieście.
          </p>
        </div>
      </div>

      {/* Two Primary Action Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Create New Club */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
              🏛️
            </div>

            <div>
              <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-[11px] font-bold rounded-full border border-orange-200/60 mb-2">
                Dla Liderów & Grup Znajomych
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Załóż Nowy Klub
              </h3>
              <p className="text-sm text-zinc-500 font-medium mt-1.5 leading-relaxed">
                Wpisz nazwę klubu, wybierz miasto i określ czy klub jest <strong>publiczny</strong> czy <strong>prywatny</strong>. Otrzymasz unikalny <strong>9-znakowy kod</strong> oraz <strong>link zaproszenia</strong>.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Generowanie unikalnego kodu zaproszeń (np. <strong>WAW-9X4-7K2</strong>)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tablica aktywności, wyzwania tonażowe i rankingi</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6">
            <button
              onClick={onOpenCreateModal}
              className="w-full py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <Plus className="w-4 h-4" /> Załóż Własny Klub <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </motion.div>

        {/* Card 2: Join Existing Club with Code */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
              <KeyRound className="w-7 h-7 text-blue-600" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-200/60 mb-2">
                Dołącz przez Kod
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Dołącz do Klubu
              </h3>
              <p className="text-sm text-zinc-500 font-medium mt-1.5 leading-relaxed">
                Masz 9-znakowy kod społeczności od znajomego lub trenera? Wpisz go poniżej i natychmiast zsynchronizuj swoje postępy.
              </p>
            </div>

            {/* Quick Code Form */}
            <form onSubmit={handleQuickJoin} className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickCode}
                  onChange={(e) => {
                    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                    if (val.length === 3 && !val.includes('-')) val = `${val}-`;
                    if (val.length === 7 && val.split('-').length === 2) val = `${val}-`;
                    setQuickCode(val);
                    setCodeFeedback(null);
                  }}
                  maxLength={11}
                  placeholder="np. WAW-78A-9X2"
                  className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-mono font-bold tracking-wider outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  Dołącz <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {codeFeedback && (
                <div className={`p-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                  codeFeedback.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${codeFeedback.isError ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {codeFeedback.text}
                </div>
              )}
            </form>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Nie posiadasz kodu?</span>
            <button
              onClick={onOpenJoinModal}
              className="text-xs font-bold text-zinc-900 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              Przeglądaj wszystkie kluby <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Public Clubs Catalog Section */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Odkryj Otwarte Społeczności w Polsce</h3>
            <p className="text-xs font-medium text-zinc-400 mt-0.5">Wybierz klub w swoim mieście i dołącz 1-kliknięciem</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj klubu lub miasta..."
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Wszystkie', 'Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań'].map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCity === city
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="p-5 rounded-2xl border border-zinc-200/90 hover:border-zinc-400 bg-zinc-50/60 hover:bg-white transition-all flex flex-col justify-between shadow-sm group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                    {club.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-zinc-200/80 text-zinc-800 text-[10px] font-bold rounded-full">
                      {club.city}
                    </span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> {club.memberCount}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-zinc-900 group-hover:text-orange-600 transition-colors">
                    {club.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500">
                  <span>KOD: {club.code}</span>
                  <span className="text-zinc-400 font-sans font-semibold">{club.category}</span>
                </div>
              </div>

              <div className="pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => onSelectPublicClub(club)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Wejdź do Klubu <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
