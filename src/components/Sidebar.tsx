import React from 'react';
import { Activity, Apple, Dumbbell, BarChart3, Home, Users, Settings as SettingsIcon } from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'overview' as TabType, label: 'Start', icon: Home },
    { id: 'stats' as TabType, label: 'Statystyka', icon: BarChart3 },
    { id: 'food' as TabType, label: 'Dieta', icon: Apple },
    { id: 'gym' as TabType, label: 'Trening', icon: Dumbbell },
    { id: 'habits' as TabType, label: 'Nawyki', icon: Activity },
    { id: 'community' as TabType, label: 'Klub', icon: Users },
  ];

  const bottomNavItems = [
    { id: 'settings' as TabType, label: 'Ustawienia', icon: SettingsIcon },
  ];

  const allItems = [...navItems, ...bottomNavItems];

  return (
    <>
      {/* Mobile Floating Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-white p-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-200 z-50">
        <ul className="flex justify-around items-center">
          {allItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 relative",
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-800"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 bg-zinc-900 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Floating Pill Nav (Side) */}
      <nav className="hidden md:flex flex-col items-center fixed top-8 right-8 z-50">
        <div className="bg-white p-3 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={item.label}
                className={cn(
                  "relative p-4 rounded-full flex items-center justify-center transition-all duration-300 group",
                  isActive ? "text-white" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-zinc-900 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="w-6 h-6 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Tooltip */}
                <span className="absolute right-full mr-4 bg-zinc-900 text-white text-xs px-3 py-2 rounded-xl opacity-0 -translate-x-4 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 font-bold tracking-wide shadow-xl whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
          
          <div className="w-10 h-px bg-zinc-200 mx-auto my-2" />
          
          {bottomNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={item.label}
                className={cn(
                  "relative p-4 rounded-full flex items-center justify-center transition-all duration-300 group",
                  isActive ? "text-white" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-zinc-900 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="w-6 h-6 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Tooltip */}
                <span className="absolute right-full mr-4 bg-zinc-900 text-white text-xs px-3 py-2 rounded-xl opacity-0 -translate-x-4 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 font-bold tracking-wide shadow-xl whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
