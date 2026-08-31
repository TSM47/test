import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Flame, Sparkles, Medal, Search, Crown, 
  Shield, UserCheck, ChevronUp, MapPin, Award
} from 'lucide-react';
import { ClubMember } from '../../types';
import { cn } from '../../lib/utils';

interface ClubLeaderboardProps {
  members: ClubMember[];
}

export function ClubLeaderboard({ members }: ClubLeaderboardProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'streak' | 'xp'>('streak');

  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === 'streak') return b.streak - a.streak;
    return b.xp - a.xp;
  });

  const filteredMembers = sortedMembers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.city.toLowerCase().includes(search.toLowerCase()) ||
    m.status.toLowerCase().includes(search.toLowerCase())
  );

  const top1 = sortedMembers[0];
  const top2 = sortedMembers[1];
  const top3 = sortedMembers[2];

  return (
    <div className="space-y-8">
      {/* 1. Podium 1st, 2nd, 3rd Bento Box */}
      <div className="bg-zinc-950 text-white p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl border border-zinc-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-[11px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" /> Podium Liderów
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Najbardziej Konsekwentni Członkowie
            </h3>
          </div>

          <div className="flex gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setSortBy('streak')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                sortBy === 'streak' ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
              )}
            >
              Passa (Dni) 🔥
            </button>
            <button
              onClick={() => setSortBy('xp')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                sortBy === 'xp' ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
              )}
            >
              Punkty XP ✨
            </button>
          </div>
        </div>

        {/* Podium visualization */}
        <div className="flex items-end justify-center gap-4 md:gap-8 pt-6 pb-2">
          
          {/* 2nd Place */}
          {top2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center flex-1 max-w-[140px]"
            >
              <div className="relative mb-3">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-sm font-bold text-zinc-200 shadow-md">
                  {top2.avatar}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-400 text-zinc-950 text-xs font-black flex items-center justify-center shadow-sm">
                  2
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[120px]">{top2.name}</span>
              <div className="text-xs font-bold text-orange-400 flex items-center gap-1 mt-0.5">
                {sortBy === 'streak' ? (
                  <><Flame className="w-3.5 h-3.5 fill-orange-400" /> {top2.streak} dni</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 text-amber-300" /> {top2.xp} XP</>
                )}
              </div>
              <div className="w-full h-24 mt-3 bg-gradient-to-t from-zinc-900 to-zinc-800/80 rounded-t-2xl border-t border-zinc-700 flex items-center justify-center text-zinc-500 font-bold text-xs">
                Srebro
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {top1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center flex-1 max-w-[160px]"
            >
              <div className="relative mb-3">
                <div className="w-18 h-18 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 flex items-center justify-center text-xl font-black shadow-[0_0_30px_rgba(245,158,11,0.35)] border-2 border-amber-300">
                  {top1.avatar}
                </div>
                <span className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-amber-400 text-zinc-950 text-sm font-black flex items-center justify-center shadow-lg border-2 border-zinc-950">
                  👑
                </span>
              </div>
              <span className="text-sm font-black text-white truncate max-w-[140px]">{top1.name}</span>
              <div className="text-sm font-black text-amber-400 flex items-center gap-1 mt-0.5">
                {sortBy === 'streak' ? (
                  <><Flame className="w-4 h-4 fill-orange-500 text-orange-500" /> {top1.streak} dni passy</>
                ) : (
                  <><Sparkles className="w-4 h-4 text-amber-300" /> {top1.xp} XP</>
                )}
              </div>
              <div className="w-full h-36 mt-3 bg-gradient-to-t from-amber-500/20 to-orange-500/30 rounded-t-2xl border-t-2 border-amber-400 flex flex-col items-center justify-center text-amber-300 font-black text-sm shadow-inner">
                <span>ZŁOTO</span>
                <span className="text-[10px] text-amber-400/80 font-semibold">Lider Klubu</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center flex-1 max-w-[140px]"
            >
              <div className="relative mb-3">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-200 shadow-md">
                  {top3.avatar}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow-sm">
                  3
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[120px]">{top3.name}</span>
              <div className="text-xs font-bold text-orange-400 flex items-center gap-1 mt-0.5">
                {sortBy === 'streak' ? (
                  <><Flame className="w-3.5 h-3.5 fill-orange-400" /> {top3.streak} dni</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 text-amber-300" /> {top3.xp} XP</>
                )}
              </div>
              <div className="w-full h-18 mt-3 bg-gradient-to-t from-zinc-900 to-zinc-800/60 rounded-t-2xl border-t border-zinc-700 flex items-center justify-center text-zinc-500 font-bold text-xs">
                Brąz
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* 2. Full Members Roster & Table */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h4 className="text-lg font-bold text-zinc-900 tracking-tight">Lista Członków Klubu ({members.length})</h4>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Śledź dyscyplinę i postępy swoich znajomych z klubu</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj członka..."
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Member cards / table */}
        <div className="space-y-3">
          {filteredMembers.map((member, index) => {
            const rank = index + 1;
            return (
              <div
                key={member.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                  member.isCurrentUser 
                    ? "bg-amber-50/50 border-amber-200 shadow-sm" 
                    : "bg-zinc-50/50 border-zinc-200/80 hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={cn(
                    "w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0",
                    rank === 1 ? "bg-amber-400 text-zinc-950 shadow-sm" :
                    rank === 2 ? "bg-zinc-300 text-zinc-950" :
                    rank === 3 ? "bg-amber-700 text-white" :
                    "bg-zinc-200 text-zinc-600"
                  )}>
                    {rank}
                  </span>

                  <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                    {member.avatar}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-zinc-900 truncate">
                        {member.name}
                      </h5>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                        member.role === 'Lider' ? "bg-orange-100 text-orange-800" :
                        member.role === 'Weteran' ? "bg-purple-100 text-purple-800" :
                        "bg-zinc-200 text-zinc-700"
                      )}>
                        {member.role}
                      </span>
                      {member.isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                          TY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-medium truncate mt-0.5">
                      {member.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-0 border-zinc-200/60 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Passa</div>
                    <div className="text-sm font-bold text-zinc-900 flex items-center md:justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      {member.streak} dni
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dyscyplina</div>
                    <div className="text-sm font-bold text-amber-600 flex items-center justify-end gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {member.xp.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
