import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Target, Users, Clock, Sparkles, 
  CheckCircle2, Flame, Dumbbell, Droplets, Award, ArrowRight
} from 'lucide-react';
import { ClubChallenge } from '../../types';
import { cn } from '../../lib/utils';

interface ClubChallengesProps {
  challenges: ClubChallenge[];
  onToggleJoin: (id: string) => void;
}

export function ClubChallenges({ challenges, onToggleJoin }: ClubChallengesProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Wyzwania Zespołowe Klubu</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Wspólnie realizujcie cele i zdobywajcie dodatkowe punkty dyscypliny XP dla klubu
            </p>
          </div>
          <span className="px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full flex items-center gap-1.5 border border-orange-200">
            <Trophy className="w-3.5 h-3.5" /> Aktywne Wyzwania: {challenges.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch) => {
            const percentage = Math.min(100, Math.round((ch.current / ch.target) * 100));
            return (
              <motion.div
                key={ch.id}
                whileHover={{ y: -3 }}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all flex flex-col justify-between shadow-sm relative overflow-hidden",
                  ch.joined ? "bg-white border-zinc-900 shadow-md" : "bg-zinc-50/70 border-zinc-200"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm",
                      ch.category === 'Trening' ? "bg-orange-100 text-orange-600" :
                      ch.category === 'Woda' ? "bg-blue-100 text-blue-600" :
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      {ch.category === 'Trening' && <Dumbbell className="w-5 h-5" />}
                      {ch.category === 'Woda' && <Droplets className="w-5 h-5" />}
                      {ch.category === 'Nawyki' && <Sparkles className="w-5 h-5" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" /> +{ch.rewardXP} XP
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-zinc-900 leading-snug">
                      {ch.title}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium mt-1.5 leading-relaxed">
                      {ch.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-600">
                        {ch.current.toLocaleString()} / {ch.target.toLocaleString()} {ch.unit}
                      </span>
                      <span className="text-zinc-900">{percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-200/80 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          percentage >= 100 ? "bg-emerald-500" : "bg-zinc-950"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 pt-2 border-t border-zinc-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {ch.daysLeft} dni do końca
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {ch.participantsCount} uczestników
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-5">
                  <button
                    onClick={() => onToggleJoin(ch.id)}
                    className={cn(
                      "w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                      ch.joined 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                        : "bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm"
                    )}
                  >
                    {ch.joined ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bierzesz Udział</>
                    ) : (
                      <>Dołącz do Wyzwania <ArrowRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
