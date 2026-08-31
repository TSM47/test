import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, Sparkles, CheckCircle2, ShieldCheck, 
  Download, ArrowUpRight, Zap, Trophy, Flame, Check
} from 'lucide-react';
import { UserSettings } from '../../types';
import { cn } from '../../lib/utils';

interface SubscriptionTabProps {
  settings: UserSettings;
  onUpdate: (updated: Partial<UserSettings>) => void;
}

const INVOICES = [
  { id: 'INV-2026-08', date: '15 sierpnia 2026', amount: '29,00 zł', status: 'Opłacono', item: 'Lumina Pro — Dostęp Miesięczny' },
  { id: 'INV-2026-07', date: '15 lipca 2026', amount: '29,00 zł', status: 'Opłacono', item: 'Lumina Pro — Dostęp Miesięczny' },
  { id: 'INV-2026-06', date: '15 czerwca 2026', amount: '29,00 zł', status: 'Opłacono', item: 'Lumina Pro — Dostęp Miesięczny' },
  { id: 'INV-2026-05', date: '15 maja 2026', amount: '29,00 zł', status: 'Opłacono', item: 'Lumina Pro — Dostęp Miesięczny' },
];

const PRO_FEATURES = [
  'Nieograniczone tworzenie i dołączanie do klubów ze specjalnym 9-znakowym kodem',
  'Zaawansowane statystyki progresji siłowej 1RM (One Rep Max) i wykresy objętości',
  'Automatyczna synchronizacja ze smartwatchami Apple Watch, Garmin i Strava',
  'Kalkulator BMR/TDEE wg wzoru Mifflina-St Jeora z podziałem makro',
  'Inteligentne przypomnienia o nawodnieniu i serii roboczej',
  'Własna baza posiłków i produktów z kodami kreskowymi',
  'Eksport i kopia zapasowa danych do pliku JSON bez limitów'
];

export function SubscriptionTab({ settings, onUpdate }: SubscriptionTabProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadInvoice = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([`Faktura ${id}\nData: 2026-08-15\nKwota: 29.00 PLN\nStatus: Opłacona`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `faktura_${id}.txt`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* 1. Pro Status Bento Box */}
      <div className="bg-zinc-950 text-white p-8 md:p-10 rounded-[2.5rem] border border-zinc-900 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-zinc-950 text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-zinc-950" />
                  CZŁONKOSTWO PRO AKTYWNE
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-xs font-bold">
                  29,00 zł / miesiąc
                </span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight mt-3">
                Lumina Performance Pro
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                Kolejne automatyczne odnowienie subskrypcji: <span className="text-white font-bold">{settings.subscriptionRenewDate}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/10"
              >
                Zmień Plan
              </button>
              <button
                type="button"
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-zinc-950" /> Dożywotni VIP
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-white/10">
            {PRO_FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Payment Method Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Metoda Płatności</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Karta płatnicza powiązana z Twoim kontem
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-xs tracking-wider shadow-inner">
              VISA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-zinc-900">•••• •••• •••• 4821</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Domyślna
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Wygasa: 08/2028 • Bank Polski</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-900 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              Edytuj
            </button>
            <button
              type="button"
              className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              Dodaj nową kartę
            </button>
          </div>
        </div>
      </div>

      {/* 3. Invoices History Table Bento Box */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Historia Rozliczeń & Faktury</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Pobierz faktury VAT w formacie PDF/TXT
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Download className="w-5 h-5" />
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-zinc-900">{inv.item}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">{inv.date} • Identyfikator: {inv.id}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-zinc-900">{inv.amount}</span>
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(inv.id)}
                  disabled={downloadingId === inv.id}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Download className={cn("w-3 h-3 text-zinc-600", downloadingId === inv.id && "animate-bounce")} />
                  {downloadingId === inv.id ? 'Pobieranie...' : 'Pobierz'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
