import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, MessageSquare, Dumbbell, Sparkles, Trophy, 
  Send, Plus, Flame, Check, Medal, Activity, Clock, Share2
} from 'lucide-react';
import { ClubPost } from '../../types';
import { cn } from '../../lib/utils';

interface ClubFeedProps {
  posts: ClubPost[];
  onAddPost: (content: string, type: ClubPost['type'], stats?: ClubPost['stats']) => void;
  onToggleLike: (postId: string) => void;
}

export function ClubFeed({ posts, onAddPost, onToggleLike }: ClubFeedProps) {
  const [filter, setFilter] = useState<'wszystko' | 'treningi' | 'nawyki' | 'rekordy'>('wszystko');
  const [isPosting, setIsPosting] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState<ClubPost['type']>('post');
  
  // Custom stats inputs for post creation
  const [stat1Label, setStat1Label] = useState('Objętość');
  const [stat1Val, setStat1Val] = useState('');
  const [stat2Label, setStat2Label] = useState('Ciężar');
  const [stat2Val, setStat2Val] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    let stats: ClubPost['stats'] | undefined = undefined;
    if (stat1Val.trim() || stat2Val.trim()) {
      stats = [];
      if (stat1Val.trim()) stats.push({ label: stat1Label, value: stat1Val.trim() });
      if (stat2Val.trim()) stats.push({ label: stat2Label, value: stat2Val.trim() });
    }

    onAddPost(newContent, postType, stats);
    setNewContent('');
    setStat1Val('');
    setStat2Val('');
    setIsPosting(false);
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'treningi') return p.type === 'workout';
    if (filter === 'nawyki') return p.type === 'habit';
    if (filter === 'rekordy') return p.type === 'pr';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Create Post Banner / Trigger */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm">
        {!isPosting ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              TY
            </div>
            <button
              onClick={() => setIsPosting(true)}
              className="flex-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-400 font-medium text-left px-5 py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-between"
            >
              <span>Podziel się dzisiejszym treningiem, nawykiem lub rekordem...</span>
              <Plus className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Nowy wpis w klubie
              </span>
              <div className="flex gap-1">
                {(['post', 'workout', 'pr', 'habit'] as const).map(t => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setPostType(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                      postType === t ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    )}
                  >
                    {t === 'post' && 'Wpis 💬'}
                    {t === 'workout' && 'Trening 🏋️'}
                    {t === 'pr' && 'Rekord (PR) 🏆'}
                    {t === 'habit' && 'Nawyk ✨'}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={
                postType === 'pr' 
                  ? 'Opisz swój nowy rekord życiowy (np. 150 kg w martwym ciągu po 8 tyg!)...'
                  : postType === 'workout'
                  ? 'Jak poszedł dzisiejszy trening siłowy lub cardio?'
                  : 'Napisz cokolwiek motywującego dla członków klubu...'
              }
              rows={3}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all placeholder:text-zinc-400 resize-none"
              autoFocus
            />

            {/* Optional Stats row */}
            {(postType === 'workout' || postType === 'pr') && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                <div>
                  <input
                    type="text"
                    value={stat1Label}
                    onChange={(e) => setStat1Label(e.target.value)}
                    placeholder="Etykieta 1"
                    className="w-full text-[10px] font-bold uppercase text-zinc-400 bg-transparent outline-none mb-1"
                  />
                  <input
                    type="text"
                    value={stat1Val}
                    onChange={(e) => setStat1Val(e.target.value)}
                    placeholder="np. 7 400 kg lub 140 kg"
                    className="w-full bg-white border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-900 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={stat2Label}
                    onChange={(e) => setStat2Label(e.target.value)}
                    placeholder="Etykieta 2"
                    className="w-full text-[10px] font-bold uppercase text-zinc-400 bg-transparent outline-none mb-1"
                  />
                  <input
                    type="text"
                    value={stat2Val}
                    onChange={(e) => setStat2Val(e.target.value)}
                    placeholder="np. 1h 15m lub +5 kg"
                    className="w-full bg-white border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-900 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 rounded-xl transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={!newContent.trim()}
                className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                Opublikuj <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Feed Filters */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[2rem] border border-zinc-200/80 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-900">Tablica Aktywności</h3>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'wszystko', label: 'Wszystko' },
            { id: 'treningi', label: 'Treningi' },
            { id: 'rekordy', label: 'Rekordy (PR)' },
            { id: 'nawyki', label: 'Nawyki' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                filter === tab.id
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-sm space-y-4"
          >
            {/* Author header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-bold shadow-inner shrink-0",
                  post.type === 'pr' ? "bg-orange-100 text-orange-700" :
                  post.type === 'workout' ? "bg-blue-100 text-blue-700" :
                  post.type === 'habit' ? "bg-emerald-100 text-emerald-700" :
                  "bg-zinc-100 text-zinc-700"
                )}>
                  {post.authorAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-zinc-900">{post.authorName}</h4>
                    {post.authorRole && (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold">
                        {post.authorRole}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400">{post.timeAgo}</span>
                </div>
              </div>

              {/* Type pill */}
              <div>
                {post.type === 'pr' && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full flex items-center gap-1 border border-orange-200">
                    <Trophy className="w-3 h-3 text-orange-600" /> Nowy Rekord PR
                  </span>
                )}
                {post.type === 'workout' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full flex items-center gap-1 border border-blue-200">
                    <Dumbbell className="w-3 h-3 text-blue-600" /> Trening
                  </span>
                )}
                {post.type === 'habit' && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Nawyk
                  </span>
                )}
              </div>
            </div>

            {/* Post Content */}
            <p className="text-sm font-medium text-zinc-700 leading-relaxed">
              {post.content}
            </p>

            {/* Stats badges */}
            {post.stats && post.stats.length > 0 && (
              <div className="flex flex-wrap gap-3 p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
                {post.stats.map((s, idx) => (
                  <div key={idx} className="pr-4 border-r border-zinc-200 last:border-0">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.label}</div>
                    <div className="text-sm font-bold text-zinc-900">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer actions */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all",
                    post.liked ? "bg-red-50 text-red-600" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", post.liked && "fill-red-500 text-red-500")} />
                  <span>{post.likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 px-3 py-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-zinc-400">
                Klub Dyscypliny
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
