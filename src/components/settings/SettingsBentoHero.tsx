import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Sparkles, Trophy, CreditCard, ShieldCheck, 
  Flame, Watch, Droplets, Target, ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import { UserSettings } from '../../types';

interface SettingsBentoHeroProps {
  settings: UserSettings;
  onOpenTab: (tab: 'profil' | 'cele' | 'synchronizacja' | 'subskrypcja') => void;
}

export function SettingsBentoHero({ settings, onOpenTab }: SettingsBentoHeroProps) {
  const activeDevicesCount = Object.values(settings.connectedDevices).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* 1. Main Dark Hero Bento Card */}
      <div className="bg-zinc-950 text-white p-8 md:p-10 rounded-[2.5rem] md:col-span-12 lg:col-span-6 relative overflow-hidden shadow-xl border border-zinc-900 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/20 flex items-center justify-center text-xl font-black text-white shadow-inner backdrop-blur-md">
                {settings.avatar || `${settings.name[0] || 'A'}${settings.lastName[0] || 'S'}`}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-zinc-200 text-[10px] font-bold tracking-wider uppercase">
                    {settings.city || 'Warszawa'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-400/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    Lumina Pro
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                  {settings.name} {settings.lastName}
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  {settings.email}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-zinc-300 font-medium leading-relaxed max-w-xl">
            {settings.bio || 'Dyscyplina i systematyczność każdego dnia. Trening siłowy 4x w tygodniu.'}
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
                Waga / Cel
              </span>
              <span className="text-base font-black text-white flex items-center gap-1">
                {settings.weight}kg <span className="text-zinc-500 font-normal">→</span> {settings.targetWeight}kg
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
                Cel Dzienny
              </span>
              <span className="text-base font-black text-amber-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {settings.dailyCalorieTarget} kcal
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
                Nawodnienie
              </span>
              <span className="text-base font-black text-blue-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                {settings.dailyWaterTarget} ml
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bento Card: Targets & Nutrition Macro Split */}
      <div className="bg-white p-7 md:p-8 rounded-[2.5rem] md:col-span-6 lg:col-span-3 border border-zinc-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-zinc-900" /> Bilans Makro
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
              {settings.dietType}
            </span>
          </div>

          {/* Macro Mini Bars */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
              <span className="font-bold text-zinc-600">Białko</span>
              <span className="font-mono font-bold text-blue-600">{settings.dailyProteinTarget} g</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
              <span className="font-bold text-zinc-600">Węglowodany</span>
              <span className="font-mono font-bold text-amber-600">{settings.dailyCarbsTarget} g</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
              <span className="font-bold text-zinc-600">Tłuszcze</span>
              <span className="font-mono font-bold text-rose-600">{settings.dailyFatTarget} g</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenTab('cele')}
          className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          Dostosuj Cele & Makro <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Bento Card: Wearables & Subscription Quick Status */}
      <div className="bg-white p-7 md:p-8 rounded-[2.5rem] md:col-span-6 lg:col-span-3 border border-zinc-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Watch className="w-3.5 h-3.5 text-zinc-900" /> Urządzenia & Pro
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Aktywne ({activeDevicesCount})
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 mb-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-600">Plan konta</span>
              <span className="font-bold text-zinc-900">Lumina Pro</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-600">Odnawia się</span>
              <span className="font-semibold text-zinc-500">{settings.subscriptionRenewDate}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/60">
              <span className="font-bold text-zinc-600">Smartwatch</span>
              <span className="font-bold text-emerald-600">Apple Watch (Sync OK)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenTab('synchronizacja')}
          className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Zarządzaj Integracjami
        </button>
      </div>

    </div>
  );
}
