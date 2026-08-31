import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, Facebook, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export function Auth({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);

  const handleSocialLogin = () => {
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Lumina.</h1>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/80 relative overflow-hidden min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-1"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Witaj ponownie</h2>
                  <p className="text-sm font-medium text-zinc-500">Zaloguj się lub utwórz nowe konto, aby kontynuować podróż do lepszej wersji siebie.</p>
                </div>

                <div className="space-y-4 mt-auto mb-auto">
                  <button onClick={handleSocialLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 text-zinc-900 py-3.5 rounded-[2rem] text-sm font-bold transition-all shadow-sm">
                    <GoogleIcon />
                    Kontynuuj z Google
                  </button>
                  <button onClick={handleSocialLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 text-zinc-900 py-3.5 rounded-[2rem] text-sm font-bold transition-all shadow-sm">
                    <Apple className="w-5 h-5" fill="currentColor" />
                    Kontynuuj z Apple
                  </button>
                  <button onClick={handleSocialLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 text-zinc-900 py-3.5 rounded-[2rem] text-sm font-bold transition-all shadow-sm">
                    <Facebook className="w-5 h-5 text-[#1877F2]" fill="currentColor" stroke="none" />
                    Kontynuuj z Facebook
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    Rejestrując się, akceptujesz <br/><a href="#" className="text-zinc-900 underline hover:text-blue-600 transition-colors">Regulamin</a> oraz <a href="#" className="text-zinc-900 underline hover:text-blue-600 transition-colors">Politykę prywatności</a>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-1"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Ostatni krok</h2>
                  <p className="text-sm font-medium text-zinc-500">Uzupełnij swoje dane fizyczne, abyśmy mogli precyzyjnie spersonalizować Twoje cele.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Imię</label>
                      <input required type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-colors text-sm font-bold text-zinc-900" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Nazwisko</label>
                      <input required type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-colors text-sm font-bold text-zinc-900" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Data urodzenia</label>
                    <input required type="date" className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-colors text-sm font-bold text-zinc-900" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Waga (kg)</label>
                      <input required type="number" step="0.1" className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-colors text-sm font-bold text-zinc-900" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Wzrost (cm)</label>
                      <input required type="number" className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-colors text-sm font-bold text-zinc-900" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Płeć</label>
                    <select required defaultValue="" className="w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-colors text-sm font-bold text-zinc-900 appearance-none">
                      <option value="" disabled>Wybierz płeć</option>
                      <option value="male">Mężczyzna</option>
                      <option value="female">Kobieta</option>
                    </select>
                  </div>

                  <div className="pt-2 mt-auto">
                    <button type="submit" className="w-full bg-zinc-950 hover:opacity-90 hover:scale-[1.02] text-white py-4 rounded-[2rem] text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      Przejdź do aplikacji <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
