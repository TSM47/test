import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Target, Watch, Sliders, Sparkles, 
  Database, ShieldCheck, Check, Save, Zap, Bell, Globe
} from 'lucide-react';
import { useData } from '../hooks/useData';
import { SettingsBentoHero } from './settings/SettingsBentoHero';
import { ProfileTab } from './settings/ProfileTab';
import { TargetsTab } from './settings/TargetsTab';
import { DevicesTab } from './settings/DevicesTab';
import { PreferencesTab } from './settings/PreferencesTab';
import { SubscriptionTab } from './settings/SubscriptionTab';
import { DataBackupTab } from './settings/DataBackupTab';
import { cn } from '../lib/utils';

export type SettingsActiveTab = 'profil' | 'cele' | 'synchronizacja' | 'wyglad' | 'subskrypcja' | 'kopia';

export function Settings() {
  const { 
    data, 
    updateUserSettings, 
    toggleDeviceSync, 
    toggleNotification, 
    exportDataToJson, 
    importDataFromJson, 
    resetAllData 
  } = useData();

  const [activeTab, setActiveTab] = useState<SettingsActiveTab>('profil');

  const settings = data.userSettings || {
    name: 'Albert',
    lastName: 'Sobczak',
    email: 'albertsobczak6@gmail.com',
    avatar: 'AS',
    city: 'Warszawa',
    bio: 'Dyscyplina i systematyczność każdego dnia. Trening siłowy 4x w tygodniu.',
    weight: 82,
    targetWeight: 80,
    height: 185,
    age: 26,
    gender: 'male',
    activityLevel: 'high',
    dietType: 'Zbilansowana (Wysokobiałkowa)',
    dailyCalorieTarget: 2600,
    dailyProteinTarget: 180,
    dailyCarbsTarget: 290,
    dailyFatTarget: 75,
    dailyWaterTarget: 2800,
    weightUnit: 'kg',
    heightUnit: 'cm',
    waterUnit: 'ml',
    distanceUnit: 'km',
    theme: 'light',
    notifications: {
      workout: true,
      water: true,
      summary: true,
      meals: false,
      clubStreak: true
    },
    connectedDevices: {
      appleWatch: true,
      garmin: false,
      strava: true,
      polar: false,
      suunto: false,
      fitbit: false
    },
    subscriptionPlan: 'pro',
    subscriptionRenewDate: '15 września 2026 r.'
  };

  const TABS: { id: SettingsActiveTab; label: string; icon: any; badge?: string }[] = [
    { id: 'profil', label: 'Profil & Ciało', icon: User },
    { id: 'cele', label: 'Cele & Makro', icon: Target },
    { id: 'synchronizacja', label: 'Urządzenia & Sync', icon: Watch, badge: '2 aktywne' },
    { id: 'wyglad', label: 'Preferencje & Alerty', icon: Sliders },
    { id: 'subskrypcja', label: 'Subskrypcja Pro', icon: Sparkles, badge: 'PRO' },
    { id: 'kopia', label: 'Kopia & Baza', icon: Database },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 1. Header with Title & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-zinc-200/80 text-zinc-800 text-[10px] font-bold tracking-wider uppercase">
              Centrum Konfiguracji
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-800 text-[10px] font-bold border border-amber-400/30">
              Konto Zweryfikowane
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 mt-1.5">
            Ustawienia & Profil
          </h2>
          <p className="text-xs md:text-sm font-medium text-zinc-500 mt-0.5">
            Zarządzaj swoimi celami kalorycznymi, biometrią, integracjami zegarków i kopiami zapasowymi
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-4 py-2 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs text-xs font-bold text-zinc-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Lokalna baza zsynchronizowana
          </div>
        </div>
      </div>

      {/* 2. Top Bento Summary Grid */}
      <SettingsBentoHero 
        settings={settings} 
        onOpenTab={(tab) => setActiveTab(tab as SettingsActiveTab)} 
      />

      {/* 3. Bento Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/80 shadow-xs overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 relative",
                isActive
                  ? "bg-zinc-950 text-white shadow-md"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-amber-400" : "text-zinc-500")} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-extrabold",
                  isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Active Tab Content Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profil' && (
            <ProfileTab settings={settings} onUpdate={updateUserSettings} />
          )}

          {activeTab === 'cele' && (
            <TargetsTab settings={settings} onUpdate={updateUserSettings} />
          )}

          {activeTab === 'synchronizacja' && (
            <DevicesTab settings={settings} onToggleDevice={toggleDeviceSync} />
          )}

          {activeTab === 'wyglad' && (
            <PreferencesTab 
              settings={settings} 
              onUpdate={updateUserSettings} 
              onToggleNotification={toggleNotification}
            />
          )}

          {activeTab === 'subskrypcja' && (
            <SubscriptionTab settings={settings} onUpdate={updateUserSettings} />
          )}

          {activeTab === 'kopia' && (
            <DataBackupTab 
              data={data}
              onExport={exportDataToJson}
              onImport={importDataFromJson}
              onReset={resetAllData}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
