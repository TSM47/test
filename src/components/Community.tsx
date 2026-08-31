import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plus, KeyRound, Sparkles, MapPin, Globe, Lock, 
  ArrowRight, ShieldCheck, Trophy, Flame, Search, CheckCircle2, 
  ChevronRight, Zap, Copy, Check, Share2, LogOut, MessageSquare, 
  Activity, Target, Award, Dumbbell, Clock, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Club } from '../types';
import { INITIAL_MEMBERS, INITIAL_PUBLIC_CLUBS } from '../data/clubsData';
import { ClubBentoHero } from './club/ClubBentoHero';
import { ClubFeed } from './club/ClubFeed';
import { ClubLeaderboard } from './club/ClubLeaderboard';
import { ClubChallenges } from './club/ClubChallenges';
import { ClubOnboarding } from './club/ClubOnboarding';
import { CreateClubModal, JoinClubModal, ShareClubSuccessModal } from './club/ClubModals';

type ClubTab = 'feed' | 'leaderboard' | 'challenges' | 'settings';

export function Community() {
  const { 
    data, 
    createClub, 
    joinClubByCode, 
    selectClub, 
    leaveClub, 
    addClubPost, 
    toggleLikePost, 
    toggleJoinChallenge 
  } = useData();

  const [activeTab, setActiveTab] = useState<ClubTab>('feed');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [createdClubSuccess, setCreatedClubSuccess] = useState<Club | null>(null);

  // Copied state for header quick action
  const [copiedCodeHeader, setCopiedCodeHeader] = useState(false);
  const [copiedLinkHeader, setCopiedLinkHeader] = useState(false);

  const currentClub = data.currentClub;
  const publicClubs = data.userClubs || INITIAL_PUBLIC_CLUBS;
  const posts = data.clubPosts || [];
  const challenges = data.clubChallenges || [];
  const members = INITIAL_MEMBERS;

  const handleCopyHeaderCode = () => {
    if (!currentClub) return;
    navigator.clipboard.writeText(currentClub.code);
    setCopiedCodeHeader(true);
    setTimeout(() => setCopiedCodeHeader(false), 2000);
  };

  const handleCopyHeaderLink = () => {
    if (!currentClub) return;
    navigator.clipboard.writeText(currentClub.inviteLink);
    setCopiedLinkHeader(true);
    setTimeout(() => setCopiedLinkHeader(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* If user hasn't selected/joined a club yet, show Onboarding Screen */}
      {!currentClub ? (
        <ClubOnboarding
          onOpenCreateModal={() => setIsCreateOpen(true)}
          onOpenJoinModal={() => setIsJoinOpen(true)}
          onJoinByCode={joinClubByCode}
          onSelectPublicClub={selectClub}
          publicClubs={publicClubs}
        />
      ) : (
        /* Active Club Dashboard */
        <div className="space-y-8">
          
          {/* Main Club Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                  {currentClub.icon} {currentClub.city}
                </span>
                <span className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 text-[11px] font-bold flex items-center gap-1">
                  {currentClub.isPrivate ? <Lock className="w-3 h-3 text-zinc-500" /> : <Globe className="w-3 h-3 text-zinc-500" />}
                  {currentClub.isPrivate ? 'Prywatny' : 'Publiczny'}
                </span>
                <button
                  onClick={handleCopyHeaderCode}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors"
                  title="Kliknij, aby skopiować kod klubu"
                >
                  {copiedCodeHeader ? <Check className="w-3 h-3 text-emerald-600" /> : <KeyRound className="w-3 h-3 text-zinc-500" />}
                  KOD: {currentClub.code}
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">
                {currentClub.name}
              </h1>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Społeczność dyscypliny &bull; {currentClub.memberCount} członków &bull; {currentClub.category}
              </p>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCopyHeaderLink}
                className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                {copiedLinkHeader ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedLinkHeader ? 'Skopiowano Link!' : 'Zaproś do Klubu'}
              </button>

              <button
                onClick={() => setIsJoinOpen(true)}
                className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5" />
                Zmień Klub
              </button>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Załóż Nowy
              </button>
            </div>
          </header>

          {/* Top Bento Grid Hero Cards */}
          <ClubBentoHero
            club={currentClub}
            members={members}
            onOpenInviteModal={handleCopyHeaderLink}
            onOpenLeaveModal={leaveClub}
          />

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-4 overflow-x-auto scrollbar-none">
            {[
              { id: 'feed' as ClubTab, label: 'Tablica & Aktywność', icon: MessageSquare, count: posts.length },
              { id: 'leaderboard' as ClubTab, label: 'Ranking & Podium', icon: Trophy, count: members.length },
              { id: 'challenges' as ClubTab, label: 'Wyzwania Zespołowe', icon: Target, count: challenges.length },
              { id: 'settings' as ClubTab, label: 'Zarządzanie Klubem', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                    isActive
                      ? "bg-zinc-950 text-white shadow-md"
                      : "bg-white border border-zinc-200/80 text-zinc-600 hover:bg-zinc-50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-orange-400" : "text-zinc-500")} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold ml-0.5",
                      isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'feed' && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <ClubFeed
                  posts={posts}
                  onAddPost={addClubPost}
                  onToggleLike={toggleLikePost}
                />
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <ClubLeaderboard members={members} />
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <ClubChallenges
                  challenges={challenges}
                  onToggleJoin={toggleJoinChallenge}
                />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-6 max-w-3xl"
              >
                <div className="pb-4 border-b border-zinc-100">
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                    Szczegóły & Ustawienia Klubu
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Zarządzaj dostępem, kodem zaproszeń oraz statusem członkostwa
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Code box */}
                  <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                        9-Znakowy Kod Społeczności
                      </span>
                      <span className="font-mono text-xl font-black text-zinc-900 tracking-wider">
                        {currentClub.code}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyHeaderCode}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 w-max"
                    >
                      {copiedCodeHeader ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCodeHeader ? 'Skopiowano!' : 'Kopiuj Kod'}
                    </button>
                  </div>

                  {/* Invite Link */}
                  <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                        Link z Zaproszeniem
                      </span>
                      <span className="text-xs font-semibold text-zinc-700 truncate block">
                        {currentClub.inviteLink}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyHeaderLink}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 w-max shrink-0"
                    >
                      {copiedLinkHeader ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      {copiedLinkHeader ? 'Skopiowano Link!' : 'Kopiuj Link'}
                    </button>
                  </div>

                  {/* Club info summary */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Miasto</span>
                      <span className="text-sm font-bold text-zinc-900">{currentClub.city}</span>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Widoczność</span>
                      <span className="text-sm font-bold text-zinc-900">
                        {currentClub.isPrivate ? 'Prywatna 🔒' : 'Publiczna 🌐'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Opuść ten klub</h4>
                    <p className="text-xs text-zinc-400">Możesz w każdej chwili dołączyć ponownie za pomocą kodu.</p>
                  </div>
                  <button
                    onClick={leaveClub}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Opuść Klub
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <CreateClubModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createClub}
        onCreatedSuccess={(newClub) => {
          setCreatedClubSuccess(newClub);
        }}
      />

      <JoinClubModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoin={joinClubByCode}
        onSelectPublicClub={selectClub}
        publicClubs={publicClubs}
      />

      <ShareClubSuccessModal
        club={createdClubSuccess}
        isOpen={!!createdClubSuccess}
        onClose={() => setCreatedClubSuccess(null)}
      />
    </motion.div>
  );
}
