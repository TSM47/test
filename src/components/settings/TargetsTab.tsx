import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, Flame, Droplets, Dumbbell, Sparkles, 
  Check, Save, RefreshCw, Zap, PieChart
} from 'lucide-react';
import { UserSettings } from '../../types';
import { cn } from '../../lib/utils';

interface TargetsTabProps {
  settings: UserSettings;
  onUpdate: (updated: Partial<UserSettings>) => void;
}

export function TargetsTab({ settings, onUpdate }: TargetsTabProps) {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Total macro calories check
  const proteinKcal = (formData.dailyProteinTarget || 0) * 4;
  const carbsKcal = (formData.dailyCarbsTarget || 0) * 4;
  const fatKcal = (formData.dailyFatTarget || 0) * 9;
  const macroSumKcal = proteinKcal + carbsKcal + fatKcal;
  const diffKcal = (formData.dailyCalorieTarget || 0) - macroSumKcal;

  const proteinPercent = Math.round((proteinKcal / (macroSumKcal || 1)) * 100);
  const carbsPercent = Math.round((carbsKcal / (macroSumKcal || 1)) * 100);
  const fatPercent = Math.round((fatKcal / (macroSumKcal || 1)) * 100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Preset calculators
  const applyPreset = (type: 'redukcja' | 'utrzymanie' | 'masa' | 'high_protein' | 'keto') => {
    const weight = formData.weight || 80;
    
    if (type === 'redukcja') {
      const cals = 2100;
      const protein = Math.round(weight * 2.3); // 2.3g
      const fat = Math.round(weight * 0.8); // 0.8g
      const carbs = Math.round((cals - (protein * 4) - (fat * 9)) / 4);
      setFormData(prev => ({
        ...prev,
        dailyCalorieTarget: cals,
        dailyProteinTarget: protein,
        dailyCarbsTarget: carbs,
        dailyFatTarget: fat,
        dietType: 'Redukcja (-400 kcal)'
      }));
    } else if (type === 'utrzymanie') {
      const cals = 2600;
      const protein = Math.round(weight * 2.0);
      const fat = Math.round(weight * 1.0);
      const carbs = Math.round((cals - (protein * 4) - (fat * 9)) / 4);
      setFormData(prev => ({
        ...prev,
        dailyCalorieTarget: cals,
        dailyProteinTarget: protein,
        dailyCarbsTarget: carbs,
        dailyFatTarget: fat,
        dietType: 'Zbilansowana (Utrzymanie)'
      }));
    } else if (type === 'masa') {
      const cals = 3100;
      const protein = Math.round(weight * 2.0);
      const fat = Math.round(weight * 1.1);
      const carbs = Math.round((cals - (protein * 4) - (fat * 9)) / 4);
      setFormData(prev => ({
        ...prev,
        dailyCalorieTarget: cals,
        dailyProteinTarget: protein,
        dailyCarbsTarget: carbs,
        dailyFatTarget: fat,
        dietType: 'Nadwyżka kaloryczna (+350 kcal)'
      }));
    } else if (type === 'high_protein') {
      const cals = 2500;
      const protein = Math.round(weight * 2.6); // bardzo wysokie białko
      const fat = 65;
      const carbs = Math.round((cals - (protein * 4) - (fat * 9)) / 4);
      setFormData(prev => ({
        ...prev,
        dailyCalorieTarget: cals,
        dailyProteinTarget: protein,
        dailyCarbsTarget: carbs,
        dailyFatTarget: fat,
        dietType: 'Wysokobiałkowa (Siłowa)'
      }));
    } else if (type === 'keto') {
      const cals = 2400;
      const carbs = 30; // max 30g
      const protein = Math.round(weight * 1.8);
      const fat = Math.round((cals - (protein * 4) - (carbs * 4)) / 9);
      setFormData(prev => ({
        ...prev,
        dailyCalorieTarget: cals,
        dailyProteinTarget: protein,
        dailyCarbsTarget: carbs,
        dailyFatTarget: fat,
        dietType: 'Ketogeniczna (Low-Carb)'
      }));
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* 1. Nutrition Targets Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Dzienne Cele Żywieniowe & Makro</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Dostosuj limit kalorii i podział makroskładników na każdy dzień
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase text-zinc-400 mr-1">Gotowe profile:</span>
            {[
              { id: 'redukcja', label: 'Redukcja 🔥' },
              { id: 'utrzymanie', label: 'Utrzymanie ⚖️' },
              { id: 'masa', label: 'Masa 📈' },
              { id: 'high_protein', label: 'High Protein 🥩' },
              { id: 'keto', label: 'Keto 🥑' },
            ].map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Macro Bar */}
        <div className="p-5 bg-zinc-50/90 rounded-2xl border border-zinc-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-700">Podział energii ze składników odżywczych</span>
            <span className="text-zinc-500">
              Suma: {macroSumKcal} kcal {diffKcal !== 0 && `(Różnica: ${diffKcal > 0 ? `+${diffKcal}` : diffKcal} kcal)`}
            </span>
          </div>

          {/* Segmented bar */}
          <div className="w-full h-4 bg-zinc-200 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div
              style={{ width: `${proteinPercent}%` }}
              className="h-full bg-blue-500 rounded-l-full transition-all duration-500"
              title={`Białko: ${proteinPercent}%`}
            />
            <div
              style={{ width: `${carbsPercent}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`Węglowodany: ${carbsPercent}%`}
            />
            <div
              style={{ width: `${fatPercent}%` }}
              className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
              title={`Tłuszcze: ${fatPercent}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 bg-blue-50/80 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Białko ({proteinPercent}%)</span>
              <span className="text-xs font-black text-blue-900">{formData.dailyProteinTarget}g ({proteinKcal} kcal)</span>
            </div>
            <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Węgle ({carbsPercent}%)</span>
              <span className="text-xs font-black text-amber-900">{formData.dailyCarbsTarget}g ({carbsKcal} kcal)</span>
            </div>
            <div className="p-2 bg-rose-50/80 rounded-xl border border-rose-100">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Tłuszcze ({fatPercent}%)</span>
              <span className="text-xs font-black text-rose-900">{formData.dailyFatTarget}g ({fatKcal} kcal)</span>
            </div>
          </div>
        </div>

        {/* Target inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Cel Kaloryczny (kcal)
            </label>
            <div className="relative">
              <Flame className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={formData.dailyCalorieTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyCalorieTarget: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Białko (g)
            </label>
            <input
              type="number"
              value={formData.dailyProteinTarget}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyProteinTarget: parseInt(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Węglowodany (g)
            </label>
            <input
              type="number"
              value={formData.dailyCarbsTarget}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyCarbsTarget: parseInt(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Tłuszcze (g)
            </label>
            <input
              type="number"
              value={formData.dailyFatTarget}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyFatTarget: parseInt(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Hydration & Habits Daily Target Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Cel Nawodnienia & Nawyków</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Ustal minimalną ilość płynów wypijanych każdego dnia
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Dzienny Cel Nawodnienia (ml)
            </label>
            <div className="relative">
              <Droplets className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="100"
                value={formData.dailyWaterTarget}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyWaterTarget: parseInt(e.target.value) || 0 }))}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
                required
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1.5">
              Rekomendowane: ok. 35 ml na 1 kg masy ciała ({Math.round(formData.weight * 35)} ml dla Ciebie).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Nazwa Strategii Dietetycznej
            </label>
            <input
              type="text"
              value={formData.dietType}
              onChange={(e) => setFormData(prev => ({ ...prev, dietType: e.target.value }))}
              placeholder="np. Zbilansowana / Redukcja"
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
            />
            <p className="text-xs text-zinc-400 mt-1.5">
              Etykieta wyświetlana na Twojej karcie profilu w klubie.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-zinc-400">
          Zmiany zostaną natychmiast uwzględnione w kalkulatorze kalorii na stronie Start i Dieta.
        </span>

        <button
          type="submit"
          className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          {savedSuccess ? (
            <><Check className="w-4 h-4 text-emerald-400" /> Zapisano Cele!</>
          ) : (
            <><Save className="w-4 h-4" /> Zapisz Cele</>
          )}
        </button>
      </div>
    </form>
  );
}
