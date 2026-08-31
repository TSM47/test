import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Watch, Smartphone, Activity, Zap, CheckCircle2, 
  XCircle, RefreshCw, ShieldCheck, ArrowUpRight, Check, Heart, Flame
} from 'lucide-react';
import { UserSettings } from '../../types';
import { cn } from '../../lib/utils';

interface DevicesTabProps {
  settings: UserSettings;
  onToggleDevice: (device: keyof UserSettings['connectedDevices']) => void;
}

interface DeviceCardData {
  id: keyof UserSettings['connectedDevices'];
  name: string;
  category: string;
  icon: string;
  badge: string;
  description: string;
  syncFeatures: string[];
}

const DEVICES: DeviceCardData[] = [
  {
    id: 'appleWatch',
    name: 'Apple Health & Watch',
    category: 'Ekosystem Apple',
    icon: '⌚',
    badge: 'Zalecane',
    description: 'Automatyczny odczyt spalonych kalorii aktywnych, tętna spoczynkowego oraz treningów siłowych z aplikacji Fitness.',
    syncFeatures: ['Kalorie aktywne', 'Tętno (BPM)', 'Kroki', 'Analiza snu']
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    category: 'Zegarki Sportowe',
    icon: '🧭',
    badge: 'Popularne',
    description: 'Bezpośrednia synchronizacja biegów, kolarstwa, statusu regeneracji Body Battery i pułapu tlenowego VO2 Max.',
    syncFeatures: ['Dystans & GPS', 'Body Battery', 'Treningi siłowe', 'Spalone kcal']
  },
  {
    id: 'strava',
    name: 'Strava',
    category: 'Społeczność & GPS',
    icon: '🏃',
    badge: 'Połączono',
    description: 'Automatyczny import tras biegowych, segmentów i aktywności na świeżym powietrzu prosto do Twojego profilu w klubie.',
    syncFeatures: ['Trasy GPS', 'Średnie tempo', 'Segmenty', 'Kudosy']
  },
  {
    id: 'polar',
    name: 'Polar Flow',
    category: 'Pasy & Czujniki Tętna',
    icon: '❤️',
    badge: 'Pulsometry',
    description: 'Ultra-precyzyjny pomiar tętna podczas serii roboczych i optymalizacja czasu przerw między podejściami.',
    syncFeatures: ['Pasy H10 / Verity', 'Strefy tętna', 'Obciążenie kardio']
  },
  {
    id: 'suunto',
    name: 'Suunto App',
    category: 'Zegarki Outdoorowe',
    icon: '🏔️',
    badge: 'Outdoor',
    description: 'Synchronizacja przewyższeń, wędrówek górskich oraz treningów wytrzymałościowych w trudnym terenie.',
    syncFeatures: ['Przewyższenia', 'Wędrówki', 'Pułap tlenowy']
  },
  {
    id: 'fitbit',
    name: 'Fitbit / Google Fit',
    category: 'Trackery Aktywności',
    icon: '📊',
    badge: 'Google Fit',
    description: 'Śledzenie kroków, stref cardio oraz automatyczne przypomnienia o regularnym nawodnieniu w ciągu dnia.',
    syncFeatures: ['Kroki dziennie', 'Aktywne minuty', 'Woda & Sen']
  },
];

export function DevicesTab({ settings, onToggleDevice }: DevicesTabProps) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessId, setSyncSuccessId] = useState<string | null>(null);

  const handleSyncNow = (deviceId: string) => {
    setSyncingId(deviceId);
    setTimeout(() => {
      setSyncingId(null);
      setSyncSuccessId(deviceId);
      setTimeout(() => setSyncSuccessId(null), 3000);
    }, 1200);
  };

  const activeCount = Object.values(settings.connectedDevices).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* 1. Header Bento Info Card */}
      <div className="bg-zinc-950 text-white p-7 md:p-8 rounded-[2.5rem] border border-zinc-900 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              {activeCount} Aktywne połączenia
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-[10px] font-bold">
              Bluetooth & API Sync
            </span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Urządzenia & Aplikacje Treningowe
          </h3>
          <p className="text-xs text-zinc-400 font-medium max-w-xl">
            Połącz swoje smartwatche i sensory, aby automatycznie importować tętno, spalone kalorie i serie treningowe w czasie rzeczywistym.
          </p>
        </div>

        <button
          onClick={() => handleSyncNow('all')}
          disabled={syncingId !== null}
          className="px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
        >
          <RefreshCw className={cn("w-4 h-4 text-orange-600", syncingId === 'all' && "animate-spin")} />
          {syncingId === 'all' ? 'Synchronizowanie...' : 'Wymuś Pełną Synchronizację ⚡'}
        </button>
      </div>

      {/* 2. Devices Grid Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEVICES.map((device) => {
          const isConnected = settings.connectedDevices[device.id];
          const isSyncing = syncingId === device.id;
          const isSuccess = syncSuccessId === device.id;

          return (
            <div
              key={device.id}
              className={cn(
                "p-6 rounded-[2.5rem] border transition-all shadow-xs flex flex-col justify-between relative overflow-hidden",
                isConnected 
                  ? "bg-white border-zinc-200/90 shadow-sm" 
                  : "bg-zinc-50/60 border-zinc-200/50 opacity-80 hover:opacity-100"
              )}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-2xl shadow-2xs">
                    {device.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      {device.category}
                    </span>
                    {isConnected ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Połączono
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600">
                        Rozłączono
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-zinc-900 tracking-tight mb-1">
                  {device.name}
                </h4>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4">
                  {device.description}
                </p>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 mb-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Odczytywane metryki:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.syncFeatures.map((f, fIdx) => (
                      <span key={fIdx} className="text-[10px] font-semibold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-200/60 shadow-2xs">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100">
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSyncNow(device.id)}
                      disabled={isSyncing}
                      className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className={cn("w-3 h-3 text-zinc-700", isSyncing && "animate-spin")} />
                      {isSyncing ? 'Pobieranie...' : isSuccess ? 'Zsynchronizowano!' : 'Synchronizuj'}
                    </button>
                    <button
                      onClick={() => onToggleDevice(device.id)}
                      className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                      title="Odłącz urządzenie"
                    >
                      Odłącz
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onToggleDevice(device.id)}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Połącz z aplikacją
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div className="p-5 bg-white rounded-[2rem] border border-zinc-200/80 shadow-xs flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="text-xs">
          <h5 className="font-bold text-zinc-900">Prywatność i Szyfrowanie Danych Medycznych</h5>
          <p className="text-zinc-500 font-medium mt-0.5">
            Wszystkie dane telemetryczne (tętno, spalone kalorie, trasy GPS) są przetwarzane lokalnie i szyfrowane end-to-end zgodnie z RODO i standardami Apple HealthKit / Google Health Connect.
          </p>
        </div>
      </div>
    </div>
  );
}
