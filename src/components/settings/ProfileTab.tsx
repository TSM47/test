import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, MapPin, Mail, Sparkles, Activity, 
  Scale, Ruler, Heart, Check, Save, Info, Zap, Calculator
} from 'lucide-react';
import { UserSettings } from '../../types';
import { cn } from '../../lib/utils';

interface ProfileTabProps {
  settings: UserSettings;
  onUpdate: (updated: Partial<UserSettings>) => void;
}

export function ProfileTab({ settings, onUpdate }: ProfileTabProps) {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live BMI & TDEE (Mifflin-St Jeor) Calculation
  const heightMeters = (formData.height || 180) / 100;
  const bmi = Number(((formData.weight || 75) / (heightMeters * heightMeters)).toFixed(1));

  let bmiCategory = 'Prawidłowa masa ciała';
  let bmiColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (bmi < 18.5) {
    bmiCategory = 'Niedowaga';
    bmiColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Nadwaga';
    bmiColor = 'text-orange-700 bg-orange-50 border-orange-200';
  } else if (bmi >= 30) {
    bmiCategory = 'Otyłość';
    bmiColor = 'text-red-700 bg-red-50 border-red-200';
  }

  // BMR Formula
  // Mężczyźni: BMR = (10 * waga) + (6.25 * wzrost) - (5 * wiek) + 5
  // Kobiety: BMR = (10 * waga) + (6.25 * wzrost) - (5 * wiek) - 161
  const bmrBase = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age);
  const bmr = formData.gender === 'female' ? Math.round(bmrBase - 161) : Math.round(bmrBase + 5);

  const activityMultipliers: Record<UserSettings['activityLevel'], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    athlete: 1.9
  };

  const calculatedTdee = Math.round(bmr * activityMultipliers[formData.activityLevel]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const applyCalculatedTdee = () => {
    setFormData(prev => ({
      ...prev,
      dailyCalorieTarget: calculatedTdee,
      dailyProteinTarget: Math.round(prev.weight * 2.2), // 2.2g per kg
      dailyFatTarget: Math.round(prev.weight * 0.9), // 0.9g per kg
      dailyCarbsTarget: Math.round((calculatedTdee - (prev.weight * 2.2 * 4) - (prev.weight * 0.9 * 9)) / 4)
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* 1. Personal Identity Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Dane Profilu & Tożsamość</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Twoje imię, adres e-mail i lokalizacja w klubie</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
          <div className="relative group">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
              {formData.avatar || `${formData.name[0] || 'A'}${formData.lastName[0] || 'S'}`}
            </div>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-bold text-base text-zinc-900">{formData.name} {formData.lastName}</h4>
            <p className="text-xs text-zinc-500 font-medium">{formData.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200 rounded-full text-[11px] font-bold text-zinc-700 mt-1 shadow-2xs">
              <MapPin className="w-3 h-3 text-orange-500" />
              {formData.city || 'Warszawa, Polska'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Imię
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Nazwisko
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Adres E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Miasto / Region
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="np. Warszawa"
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Motto / Opis Dyscypliny
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={2}
              placeholder="Twój cel lub motto widoczne w klubie..."
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Anthropometrics & Body Stats Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Parametry Ciała & Aktywność</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Wymiary służące do dokładnego wyliczania zapotrzebowania kalorycznego
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Live BMI & BMR Indicator Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              Wskaźnik BMI
            </span>
            <div className="text-2xl font-black text-zinc-900">{bmi}</div>
            <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border", bmiColor)}>
              {bmiCategory}
            </span>
          </div>

          <div className="space-y-1 sm:border-l border-zinc-200 sm:pl-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              BMR (Metabolizm spoczynkowy)
            </span>
            <div className="text-2xl font-black text-zinc-900">{bmr} <span className="text-xs font-bold text-zinc-400">kcal/dzień</span></div>
            <span className="text-[11px] font-semibold text-zinc-500">Mifflin-St Jeor</span>
          </div>

          <div className="space-y-1 sm:border-l border-zinc-200 sm:pl-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              TDEE (Całkowite zapotrzebowanie)
            </span>
            <div className="text-2xl font-black text-orange-600">{calculatedTdee} <span className="text-xs font-bold text-zinc-400">kcal</span></div>
            <button
              type="button"
              onClick={applyCalculatedTdee}
              className="text-[11px] font-bold text-zinc-900 hover:text-orange-600 underline flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-orange-500" /> Zastosuj w celach
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Aktualna Waga (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Waga Docelowa (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.targetWeight}
              onChange={(e) => setFormData(prev => ({ ...prev, targetWeight: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Wzrost (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Wiek (lata)
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Płeć biologiczna
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all appearance-none"
            >
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
              <option value="other">Inna</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Poziom Aktywności
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value as any }))}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all appearance-none"
            >
              <option value="sedentary">Siedzący (brak treningów)</option>
              <option value="light">Lekki (1-2 treningi / tydz)</option>
              <option value="moderate">Umiarkowany (3-4 treningi / tydz)</option>
              <option value="high">Wysoki (5-6 treningów / tydz)</option>
              <option value="athlete">Zawodowy (codziennie 2x trening)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-zinc-400">
          Wszystkie dane są bezpiecznie zapisywane w pamięci urządzenia.
        </span>

        <button
          type="submit"
          className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          {savedSuccess ? (
            <><Check className="w-4 h-4 text-emerald-400" /> Zapisano zmiany!</>
          ) : (
            <><Save className="w-4 h-4" /> Zapisz Profil</>
          )}
        </button>
      </div>
    </form>
  );
}
