import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Download, Upload, RotateCcw, Database, ShieldAlert, 
  CheckCircle2, AlertTriangle, FileText, Check, Sparkles, Trash2
} from 'lucide-react';
import { TrackerData } from '../../types';
import { cn } from '../../lib/utils';

interface DataBackupTabProps {
  data: TrackerData;
  onExport: () => void;
  onImport: (jsonStr: string) => { success: boolean; message: string };
  onReset: () => void;
}

export function DataBackupTab({ data, onExport, onImport, onReset }: DataBackupTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = onImport(content);
        setImportStatus(res);
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportClick = () => {
    onExport();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    onReset();
    setShowResetConfirm(false);
    setImportStatus({ success: true, message: 'Baza danych została zresetowana do wartości początkowych.' });
    setTimeout(() => setImportStatus(null), 4000);
  };

  const foodCount = data.food?.length || 0;
  const workoutCount = data.workouts?.length || 0;
  const habitLogsCount = data.habitLogs?.length || 0;
  const waterLogsCount = data.waterLogs?.length || 0;
  const customFoodsCount = data.customFoods?.length || 0;

  return (
    <div className="space-y-8">
      {/* Status banner if imported/reset */}
      {importStatus && (
        <div
          className={cn(
            "p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all",
            importStatus.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          )}
        >
          <div className="flex items-center gap-3">
            {importStatus.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-xs font-bold">{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-xs font-bold underline"
          >
            Zamknij
          </button>
        </div>
      )}

      {/* 1. Database Stats Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Status Pamięci Podręcznej & Statystyki</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Szczegółowy bilans zarejestrowanych rekordów w lokalnym magazynie
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Posiłki</span>
            <span className="text-xl font-black text-zinc-900">{foodCount}</span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Serie Ćwiczeń</span>
            <span className="text-xl font-black text-zinc-900">{workoutCount}</span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Logi Nawyków</span>
            <span className="text-xl font-black text-zinc-900">{habitLogsCount}</span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Logi Wody</span>
            <span className="text-xl font-black text-zinc-900">{waterLogsCount}</span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Własne Dania</span>
            <span className="text-xl font-black text-zinc-900">{customFoodsCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Backup Export & Import Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 tracking-tight mb-1">
              Eksportuj Kopię Zapasową (JSON)
            </h4>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Pobierz kompletny plik JSON zawierający całą historię Twojej diety, treningów, serii siłowych, nawyków oraz ustawień.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportClick}
            className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {exportSuccess ? (
              <><Check className="w-4 h-4 text-emerald-400" /> Pobrano plik Lumina Backup!</>
            ) : (
              <><Download className="w-4 h-4" /> Pobierz Kopię Zapasową .JSON</>
            )}
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 tracking-tight mb-1">
              Przywróć Dane z Pliku (JSON)
            </h4>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Wczytaj wcześniej pobrany plik kopii zapasowej, aby natychmiast przywrócić wszystkie rekordy na tym lub innym urządzeniu.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-zinc-700" />
              Wybierz plik .JSON do przywrócenia
            </button>
          </div>
        </div>
      </div>

      {/* 3. Danger Zone Bento Box */}
      <div className="p-6 md:p-8 rounded-[2.5rem] bg-rose-50/70 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h4 className="text-sm font-bold text-rose-950 uppercase tracking-wider">Strefa Niebezpieczna</h4>
          </div>
          <p className="text-xs text-rose-800 font-medium">
            Reset bazy przywraca początkowe dane przykładowe z 14 dniami historii.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-3 bg-white border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-rose-600" />
          Zresetuj do Danych Początkowych
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl border border-zinc-200 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Czy na pewno chcesz zresetować bazę?</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Ta operacja zresetuje wszystkie zarejestrowane serie, posiłki i nawyki do domyślnych danych startowych. Przed resetem zalecamy pobranie kopii zapasowej.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-colors"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Tak, zresetuj bazę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
