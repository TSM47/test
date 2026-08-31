import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, Moon, Sun, Monitor, Check, 
  Volume2, Smartphone, Sliders, Globe, Save
} from 'lucide-react';
import { UserSettings } from '../../types';
import { cn } from '../../lib/utils';

interface PreferencesTabProps {
  settings: UserSettings;
  onUpdate: (updated: Partial<UserSettings>) => void;
  onToggleNotification: (key: keyof UserSettings['notifications']) => void;
}

export function PreferencesTab({ settings, onUpdate, onToggleNotification }: PreferencesTabProps) {
  const [savedToast, setSavedToast] = useState(false);

  const triggerToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const NOTIFICATIONS_LIST: {
    key: keyof UserSettings['notifications'];
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      key: 'workout',
      title: 'Przypomnienia o Treningu',
      description: 'Powiadomienie na 30 minut przed planowaną sesją treningową.',
      icon: '🏋️'
    },
    {
      key: 'water',
      title: 'Poranny Rytuał & Nawodnienie',
      description: 'Przypomnienia o regularnym piciu wody w ciągu dnia i porannej szklance.',
      icon: '💧'
    },
    {
      key: 'summary',
      title: 'Wieczorne Podsumowanie Dnia',
      description: 'Krótki raport o zrealizowanych kaloriach, białku i zaliczonych nawykach o 21:00.',
      icon: '📊'
    },
    {
      key: 'meals',
      title: 'Pora Posiłków',
      description: 'Szybkie powiadomienie z pytaniem o zarejestrowanie obiadu lub kolacji.',
      icon: '🥗'
    },
    {
      key: 'clubStreak',
      title: 'Alerty o Passie w Klubie (Streak)',
      description: 'Ostrzeżenie o ryzyku utraty dziennej passy w społeczności.',
      icon: '🔥'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Notifications Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Powiadomienia & Alerty Dyscypliny</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Skonfiguruj inteligentne przypomnienia push i powiadomienia w przeglądarce
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-3">
          {NOTIFICATIONS_LIST.map((item) => {
            const isEnabled = settings.notifications[item.key];

            return (
              <div
                key={item.key}
                onClick={() => {
                  onToggleNotification(item.key);
                  triggerToast();
                }}
                className="p-4 bg-zinc-50/80 hover:bg-zinc-50 rounded-2xl border border-zinc-200/60 transition-all flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-lg shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{item.title}</h4>
                    <p className="text-xs text-zinc-500 font-medium">{item.description}</p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div
                  className={cn(
                    "w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 flex items-center",
                    isEnabled ? "bg-zinc-950" : "bg-zinc-200"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out",
                      isEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Units & Localization Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Jednostki Miar & Formatowanie</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Wybierz preferowany system miar dla wagi, płynów i dystansu
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-2">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Jednostka Wagi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ weightUnit: 'kg' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.weightUnit === 'kg' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                kg (Kilogramy)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ weightUnit: 'lbs' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.weightUnit === 'lbs' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                lbs (Funty)
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-2">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Jednostka Wzrostu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ heightUnit: 'cm' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.heightUnit === 'cm' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                cm (Centymetry)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ heightUnit: 'in' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.heightUnit === 'in' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                in (Cale)
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-2">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Jednostka Płynów
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ waterUnit: 'ml' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.waterUnit === 'ml' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                ml / litry
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ waterUnit: 'oz' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.waterUnit === 'oz' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                fl oz
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-2">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Jednostka Dystansu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ distanceUnit: 'km' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.distanceUnit === 'km' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                km (Kilometry)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ distanceUnit: 'mi' })}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  settings.distanceUnit === 'mi' ? "bg-zinc-950 text-white shadow-2xs" : "bg-white text-zinc-700 hover:bg-zinc-100"
                )}
              >
                mi (Mile)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Appearance Theme Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Motyw Wizualny Aplikacji</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Wybierz estetykę interfejsu dopasowaną do Twojego środowiska pracy
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Sliders className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'light', title: 'Jasny Styl (Clean Bento)', desc: 'Klasyczna, wysoka przejrzystość i kontrast', icon: Sun },
            { id: 'dark', title: 'Ciemny Akcent (Obsidian)', desc: 'Eleganckie czernie i mniejsze zmęczenie wzroku', icon: Moon },
            { id: 'system', title: 'Systemowy (Automatyczny)', desc: 'Dopasowanie do ustawień systemu operacyjnego', icon: Monitor },
          ].map((themeItem) => {
            const isSelected = settings.theme === themeItem.id;
            const IconComponent = themeItem.icon;

            return (
              <button
                key={themeItem.id}
                type="button"
                onClick={() => {
                  onUpdate({ theme: themeItem.id as any });
                  triggerToast();
                }}
                className={cn(
                  "p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between",
                  isSelected
                    ? "bg-zinc-950 text-white border-zinc-900 shadow-md"
                    : "bg-zinc-50/80 hover:bg-zinc-50 text-zinc-900 border-zinc-200/70"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isSelected ? "bg-white/15 text-white" : "bg-white border border-zinc-200 text-zinc-700")}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Aktywny
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{themeItem.title}</h4>
                  <p className={cn("text-xs font-medium mt-0.5", isSelected ? "text-zinc-400" : "text-zinc-500")}>
                    {themeItem.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
