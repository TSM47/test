import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { Statistics } from './components/Statistics';
import { FoodTracker } from './components/FoodTracker';
import { GymTracker } from './components/GymTracker';
import { HabitTracker } from './components/HabitTracker';
import { Community } from './components/Community';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { TabType } from './types';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lumina_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isAuthenticated) {
    return (
      <Auth onComplete={() => {
        localStorage.setItem('lumina_auth', 'true');
        setIsAuthenticated(true);
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE9E5] text-zinc-900 selection:bg-lime-300 selection:text-lime-900 flex justify-center relative">
      {/* Navigation Sidebar / Bottom Bar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="w-full max-w-7xl p-4 md:p-8 pt-6 pb-28 md:pb-8 flex flex-col md:pr-32">
        <main className="w-full flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <Overview key="overview" onNavigate={setActiveTab} />}
            {(activeTab === 'stats' || activeTab === 'dashboard') && <Statistics key="stats" />}
            {activeTab === 'food' && <FoodTracker key="food" />}
            {activeTab === 'gym' && <GymTracker key="gym" />}
            {activeTab === 'habits' && <HabitTracker key="habits" />}
            {activeTab === 'community' && <Community key="community" />}
            {activeTab === 'settings' && <Settings key="settings" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
