import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Sparkles, Shield, Globe, Lock, Users, MapPin, Tag, ArrowRight, Share2, Link as LinkIcon, KeyRound } from 'lucide-react';
import { POLISH_CITIES, CLUB_CATEGORIES, CLUB_ICONS } from '../../data/clubsData';
import { Club } from '../../types';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, city: string, isPrivate: boolean, category: string, description: string, icon: string) => Club;
  onCreatedSuccess: (club: Club) => void;
}

export function CreateClubModal({ isOpen, onClose, onCreate, onCreatedSuccess }: CreateClubModalProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState(POLISH_CITIES[0]);
  const [customCity, setCustomCity] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState(CLUB_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Wpisz nazwę klubu');
      return;
    }

    const finalCity = city === 'Inne miasto...' ? (customCity.trim() || 'Polska') : city;
    const newClub = onCreate(name, finalCity, isPrivate, category, description, icon);
    onCreatedSuccess(newClub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-xl w-full shadow-2xl border border-zinc-200/80 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-xl shadow-sm">
              ✨
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Załóż Nowy Klub</h3>
              <p className="text-xs font-semibold text-zinc-400">Stwórz społeczność dyscypliny i zapraszaj znajomych</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {/* Icon & Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
              Ikona i Nazwa Klubu *
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-2xl cursor-pointer hover:bg-zinc-200 transition-colors shadow-inner">
                  {icon}
                </div>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="np. Warszawa Iron & Discipline"
                className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3.5 rounded-2xl text-sm font-semibold outline-none transition-all placeholder:text-zinc-400"
                autoFocus
              />
            </div>
            {/* Quick Icon Selector */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {CLUB_ICONS.map(ic => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${
                    icon === ic ? 'bg-zinc-900 text-white scale-110 shadow-sm' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Miasto Klubu *
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3.5 rounded-2xl text-sm font-semibold outline-none transition-all cursor-pointer"
            >
              {POLISH_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Inne miasto...">Inne miasto...</option>
            </select>

            {city === 'Inne miasto...' && (
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Wpisz nazwę swojej miejscowości..."
                className="w-full mt-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              />
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-zinc-500" /> Główny Profil & Kategoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3.5 rounded-2xl text-sm font-semibold outline-none transition-all cursor-pointer"
            >
              {CLUB_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Visibility / Privacy Toggle */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
              Widoczność Społeczności
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  !isPrivate 
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <Globe className="w-4 h-4" /> Publiczna
                </div>
                <p className={`text-[11px] leading-relaxed ${!isPrivate ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  Widoczna w katalogu miast. Każdy może dołączyć.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isPrivate 
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <Lock className="w-4 h-4" /> Prywatna 🔒
                </div>
                <p className={`text-[11px] leading-relaxed ${isPrivate ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  Ukryta. Dołączenie tylko przez 9-znakowy kod lub link.
                </p>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
              Opis / Motto Klubu
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="np. Wstajemy o 5:30, zero wymówek, budujemy nawyki mistrzów..."
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all placeholder:text-zinc-400 resize-none"
            />
          </div>

          {/* Info note */}
          <div className="p-4 bg-zinc-100 rounded-2xl flex items-start gap-3 border border-zinc-200/80 text-zinc-600 text-xs">
            <KeyRound className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
            <p>
              Po utworzeniu klubu automatycznie wygenerujemy Twój unikalny <strong>9-znakowy kod</strong> oraz <strong>link z zaproszeniem</strong> do przesłania znajomym.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3.5 rounded-2xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-100 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="w-2/3 py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              Utwórz Klub <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface JoinClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => { success: boolean; message: string; club?: Club };
  onSelectPublicClub: (club: Club) => void;
  publicClubs: Club[];
}

export function JoinClubModal({ isOpen, onClose, onJoin, onSelectPublicClub, publicClubs }: JoinClubModalProps) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setMessage({ text: 'Wpisz 9-znakowy kod klubu', isError: true });
      return;
    }

    const res = onJoin(code);
    if (res.success) {
      setMessage({ text: res.message, isError: false });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setMessage({ text: res.message, isError: true });
    }
  };

  const handleQuickJoin = (club: Club) => {
    onSelectPublicClub(club);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-xl w-full shadow-2xl border border-zinc-200/80 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-lg shadow-sm">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Dołącz do Klubu</h3>
              <p className="text-xs font-semibold text-zinc-400">Wpisz kod zaproszenia lub wybierz otwartą społeczność</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Code Input Form */}
        <form onSubmit={handleJoinByCode} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Wprowadź 9-znakowy Kod Społeczności
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                  if (val.length === 3 && !val.includes('-')) val = `${val}-`;
                  if (val.length === 7 && val.split('-').length === 2) val = `${val}-`;
                  setCode(val);
                  setMessage(null);
                }}
                maxLength={11}
                placeholder="np. WAW-78A-9X2"
                className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3.5 rounded-2xl text-base font-mono font-bold tracking-widest outline-none transition-all placeholder:text-zinc-400 placeholder:font-sans placeholder:tracking-normal"
                autoFocus
              />
              <button
                type="submit"
                className="bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                Dołącz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 mt-2">
              Format: 3 znaki prefiksu miasta + 6 znaków unikalnych (np. WAW-9X4-7K2)
            </p>
          </div>

          {message && (
            <div className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
              message.isError 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${message.isError ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {message.text}
            </div>
          )}
        </form>

        {/* Public clubs list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Popularne Społeczności Publiczne
            </h4>
            <span className="text-xs font-bold text-zinc-400">Polska</span>
          </div>

          <div className="space-y-2.5">
            {publicClubs.slice(0, 4).map((club) => (
              <div
                key={club.id}
                className="p-4 rounded-2xl border border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {club.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-zinc-900 truncate">{club.name}</h5>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-bold shrink-0">
                        {club.city}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{club.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickJoin(club)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Dołącz
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface ShareClubSuccessModalProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareClubSuccessModal({ club, isOpen, onClose }: ShareClubSuccessModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !club) return null;

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-zinc-200/80 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
          🎉
        </div>

        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">
          Klub został utworzony!
        </h3>
        <p className="text-sm font-semibold text-zinc-500 mb-6">
          Twój klub <strong>{club.name}</strong> jest już aktywny. Zaproś znajomych do rywalizacji i wspólnego budowania dyscypliny!
        </p>

        <div className="space-y-4 mb-6 text-left">
          {/* 9-character code box */}
          <div className="p-4 bg-zinc-950 text-white rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              <span>Specjalny 9-Znakowy Kod Klubu</span>
              <span className="text-emerald-400">Aktywny</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-2xl font-black tracking-widest text-white">
                {club.code}
              </span>
              <button
                onClick={() => copyToClipboard(club.code, 'code')}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Skopiowano!' : 'Kopiuj Kod'}
              </button>
            </div>
          </div>

          {/* Invite link box */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-400" /> Link z Zaproszeniem
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                readOnly
                value={club.inviteLink}
                className="bg-transparent text-xs font-semibold text-zinc-700 w-full truncate outline-none"
              />
              <button
                onClick={() => copyToClipboard(club.inviteLink, 'link')}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Skopiowano link!' : 'Kopiuj Link'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-zinc-950 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-md"
        >
          Przejdź do Pulpitu Klubu
        </button>
      </motion.div>
    </div>
  );
}
