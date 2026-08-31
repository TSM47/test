import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, Users, Copy, Check, Share2, Trophy, ShieldCheck, 
  MapPin, Globe, Lock, Sparkles, ArrowUpRight, Zap, Target, Award
} from 'lucide-react';
import { Club, ClubMember } from '../../types';

interface ClubBentoHeroProps {
  club: Club;
  members: ClubMember[];
  onOpenInviteModal: () => void;
  onOpenLeaveModal: () => void;
}

export function ClubBentoHero({ club, members, onOpenInviteModal, onOpenLeaveModal }: ClubBentoHeroProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(club.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(club.inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Find top streak leader
  const sortedByStreak = [...members].sort((a, b) => b.streak - a.streak);
  const topLeader = sortedByStreak[0] || { name: 'Marek Nowak', streak: 42, avatar: 'MN' };
  const currentMember = members.find(m => m.isCurrentUser) || { streak: 14, xp: 2850 };
  const currentRank = sortedByStreak.findIndex(m => m.isCurrentUser) + 1 || 4;

  const totalXP = members.reduce((sum, m) => sum + m.xp, 14250);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* 1. Main Dark Hero Bento Card */}
      <div className="bg-zinc-950 text-white p-8 md:p-10 rounded-[2.5rem] md:col-span-12 lg:col-span-6 relative overflow-hidden shadow-xl border border-zinc-900 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl shadow-inner backdrop-blur-md">
                {club.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-zinc-200 text-[10px] font-bold tracking-wider uppercase">
                    {club.city}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold flex items-center gap-1 border border-orange-500/30">
                    {club.isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                    {club.isPrivate ? 'Prywatny' : 'Publiczny'}
                  </span>
                  {club.isOwner && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Twój Klub (Lider)
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                  {club.name}
                </h2>
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-zinc-300 font-medium leading-relaxed max-w-xl">
            {club.description}
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
                Członkowie
              </span>
              <span className="text-lg font-black text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-400" /> {club.memberCount}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
                Punkty Dyscypliny
              </span>
              <span className="text-lg font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> {totalXP.toLocaleString()} XP
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
                Aktywność Dziś
              </span>
              <span className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> 88%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key 9-Character Code & Invite Card (Prominent requirement) */}
      <div className="bg-white p-7 md:p-8 rounded-[2.5rem] md:col-span-6 lg:col-span-3 border border-zinc-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-zinc-900" /> Kod & Zaproszenia
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              9-znakowy kod
            </span>
          </div>

          {/* The 9-character code box */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 text-center mb-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              Specjalny Kod Społeczności
            </span>
            <div className="font-mono text-xl font-black text-zinc-900 tracking-widest select-all">
              {club.code}
            </div>
          </div>

          <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4">
            Podaj ten kod znajomemu, aby mógł natychmiast dołączyć do klubu w aplikacji.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={copyCode}
            className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? 'Skopiowano Kod!' : 'Kopiuj Kod Klubu'}
          </button>

          <button
            onClick={copyLink}
            className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Skopiowano Link!' : 'Kopiuj Link Zaproszenia'}
          </button>
        </div>
      </div>

      {/* 3. Streak & Leaderboard Hero Card */}
      <div className="bg-white p-7 md:p-8 rounded-[2.5rem] md:col-span-6 lg:col-span-3 border border-zinc-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-orange-500" /> Lider Dyscypliny
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
              Passa Dni
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
              {topLeader.avatar}
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                Rekord Klubu #1
              </div>
              <h4 className="font-bold text-sm text-zinc-900">{topLeader.name}</h4>
              <div className="text-xs font-bold text-zinc-700 flex items-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                {topLeader.streak} dni bez przerwy
              </div>
            </div>
          </div>
        </div>

        {/* User's position summary */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center justify-center">
              #{currentRank}
            </span>
            <span className="font-bold text-zinc-800">Twoja Passa:</span>
          </div>
          <span className="font-bold text-orange-600 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> {currentMember.streak} dni
          </span>
        </div>
      </div>

    </div>
  );
}
