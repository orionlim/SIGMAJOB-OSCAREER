import { useState, useMemo } from 'react';
import { MessageCircle, ArrowUp, ArrowDown, Plus, X, Share2 } from 'lucide-react';
import { seedPosts } from '../data/marketData';

const categories = ['All', 'Salary Talk', 'Career Switch', 'Healthcare', 'Industry Trends', 'Universities', 'AI & Tech', 'Job Hunting'];
type SortMode = 'hot' | 'new' | 'top' | 'rising';

const seedComments: Record<string, { author: string; text: string; time: string; upvotes: number }[]> = {
  p1: [
    { author: 'Wei Ming', text: 'RM 6,500 for 3 years is actually decent for a local startup. MNCs pay RM 8K-10K for mid-level.', time: '1h ago', upvotes: 12 },
    { author: 'Faridah', text: 'Don\'t forget stock options! Many startups offer ESOP that can be worth more than salary.', time: '2h ago', upvotes: 8 },
    { author: 'Kenny', text: 'Check Robert Walters salary guide. They list mid-level SWE at RM 72K-108K/year.', time: '3h ago', upvotes: 5 },
  ],
  p2: [
    { author: 'Hannah', text: 'Cybersecurity is definitely the move. NACSA says we need 70K more professionals.', time: '2h ago', upvotes: 15 },
    { author: 'Amir', text: 'I switched from SWE to cybersec 2 years ago. Best decision. Less competition, higher pay.', time: '3h ago', upvotes: 10 },
    { author: 'Siti', text: 'Just got my CISSP. The learning curve is steep but SO worth it.', time: '5h ago', upvotes: 7 },
  ],
  p3: [
    { author: 'Dr. Ramesh', text: 'Nurses are critically underpaid given the shortage. MOH needs to address this urgently.', time: '3h ago', upvotes: 20 },
    { author: 'Lin', text: 'Private hospitals pay better. Sunway starts at RM 3K+ for fresh grads.', time: '4h ago', upvotes: 9 },
    { author: 'Priya (OP)', text: 'Thanks everyone! Considering private sector now.', time: '5h ago', upvotes: 6 },
  ],
};

export default function Community({ dark }: { dark: boolean }) {
  const [posts, setPosts] = useState(seedPosts);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortMode>('hot');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Salary Talk');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Record<string, { author: string; text: string; time: string; upvotes: number }[]>>(seedComments);
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [shareToast, setShareToast] = useState(false);

  const bg = dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]';
  const card = dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]';
  const text = dark ? 'text-white' : 'text-[#1C1C1C]';
  const sub = dark ? 'text-gray-400' : 'text-[#6B6B6B]';
  const input = dark ? 'bg-[#1C1C1C] border-[#3A3A3A] text-white' : 'bg-white border-[#E5E2DB] text-[#1C1C1C]';

  const filtered = useMemo(() => {
    const base = filter === 'All' ? posts : posts.filter(p => p.category === filter);
    switch (sortBy) {
      case 'hot':
      case 'top': return [...base].sort((a, b) => (upvoteCounts[b.id] || b.upvotes) - (upvoteCounts[a.id] || a.upvotes));
      case 'rising': return [...base].sort(() => Math.random() - 0.5);
      case 'new': default: return base;
    }
  }, [posts, filter, sortBy, upvoteCounts]);

  const selPost = selectedPost ? posts.find(p => p.id === selectedPost) : null;

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const post = {
      id: 'p' + Date.now(),
      author: 'You',
      avatar: 'YO',
      title: newTitle,
      content: newContent,
      category: newCategory,
      upvotes: 1,
      comments: 0,
      time: 'Just now',
    };
    setPosts([post, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowCreate(false);
  };

  const handlePostUpvote = (postId: string) => {
    setUpvoteCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] || (posts.find(p => p.id === postId)?.upvotes || 0)) + 1
    }));
  };

  const handlePostDownvote = (postId: string) => {
    setUpvoteCounts(prev => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] || (posts.find(p => p.id === postId)?.upvotes || 0)) - 1)
    }));
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedPost) return;
    const newComments = { ...comments };
    if (!newComments[selectedPost]) newComments[selectedPost] = [];
    newComments[selectedPost] = [
      ...newComments[selectedPost],
      { author: 'You', text: newComment.trim(), time: 'Just now', upvotes: 1 }
    ];
    setComments(newComments);
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/community');
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  return (
    <div className={`${bg} min-h-screen pt-16`}>
      {shareToast && (
        <div className="fixed top-20 right-4 z-50 bg-green-500/15 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm animate-fadeIn">
          Link copied!
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${text} font-heading`}>Community</h1>
            <p className={`${sub} mt-1`}>Career discussions, salary talk, industry insights</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="gradient-btn text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus size={16} /> New Post
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition ${filter === c ? 'gradient-btn text-white' : `${card} border ${text}`}`}>{c}</button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {([{ id: 'hot' as SortMode, label: '🔥 Hot' }, { id: 'new' as SortMode, label: '🆕 New' }, { id: 'top' as SortMode, label: '⬆️ Top' }, { id: 'rising' as SortMode, label: '📈 Rising' }]).map(s => (
            <button key={s.id} onClick={() => setSortBy(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${sortBy === s.id ? 'bg-[#6C63FF] text-white' : `${dark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}`}>{s.label}</button>
          ))}
        </div>

        {showCreate && (
          <div className={`${card} border rounded-2xl p-6 mb-6 animate-fadeIn`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${text}`}>Create Post</h2>
              <button onClick={() => setShowCreate(false)}><X size={20} className={sub} /></button>
            </div>
            <input placeholder="Post title..." value={newTitle} onChange={e => setNewTitle(e.target.value)}
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-[#6C63FF]`} />
            <textarea placeholder="Share your thoughts..." value={newContent} onChange={e => setNewContent(e.target.value)} rows={4}
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-[#6C63FF] resize-none`} />
            <div className="flex items-center gap-3">
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className={`${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={handleCreate} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Post</button>
            </div>
          </div>
        )}

        {selPost ? (
          <div className="animate-fadeIn">
            <button onClick={() => setSelectedPost(null)} className={`text-sm ${sub} mb-4 hover:text-[#6C63FF]`}>← Back to posts</button>
            <div className={`${card} border rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] text-sm font-bold">{selPost.avatar}</div>
                <div>
                  <div className={`font-medium ${text}`}>{selPost.author}</div>
                  <div className={`text-xs ${sub}`}>{selPost.time} · {selPost.category}</div>
                </div>
              </div>
              <h2 className={`text-xl font-bold ${text} font-heading mb-3`}>{selPost.title}</h2>
              <p className={`text-sm ${sub} mb-6 leading-relaxed`}>{selPost.content}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePostUpvote(selPost.id)} className={`p-1 rounded hover:bg-white/5`}>
                    <ArrowUp size={16} className="text-[#6C63FF]" />
                  </button>
                  <span className={`text-sm font-bold ${text}`}>{upvoteCounts[selPost.id] || selPost.upvotes}</span>
                  <button onClick={() => handlePostDownvote(selPost.id)} className={`p-1 rounded hover:bg-white/5`}>
                    <ArrowDown size={16} className={sub} />
                  </button>
                </div>
                <span className={`text-sm ${sub} flex items-center gap-1`}><MessageCircle size={16} /> {(comments[selPost.id]?.length || selPost.comments)} comments</span>
                <button onClick={handleShare} className={`text-sm ${sub} flex items-center gap-1 hover:text-[#6C63FF]`}>
                  <Share2 size={16} /> Share
                </button>
              </div>

              {/* Comments */}
              <div className={`border-t ${dark ? 'border-[#2A2A3E]' : 'border-[#E0E0E0]'} pt-4`}>
                <h3 className={`text-sm font-semibold ${text} mb-3`}>Comments</h3>
                <div className="space-y-3 mb-4">
                  {(comments[selPost.id] || []).map((c, i) => (
                    <div key={i} className={`${dark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-3`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${text}`}>{c.author}</span>
                        <span className={`text-xs ${sub}`}>{c.time}</span>
                      </div>
                      <p className={`text-sm ${sub}`}>{c.text}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUp size={12} className="text-[#6C63FF]" />
                        <span className={`text-xs ${sub}`}>{c.upvotes}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addComment()}
                    className={`flex-1 ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF]`} />
                  <button onClick={addComment} className="gradient-btn text-white px-4 py-2.5 rounded-xl text-sm font-medium">Post Comment</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <button key={p.id} onClick={() => setSelectedPost(p.id)}
                className={`w-full text-left ${card} border rounded-2xl p-5 hover:border-[#6C63FF] transition`}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <ArrowUp size={16} className="text-[#6C63FF] cursor-pointer hover:scale-110" />
                    <span className={`text-sm font-bold ${text}`}>{upvoteCounts[p.id] || p.upvotes}</span>
                    <ArrowDown size={16} className={`${sub} cursor-pointer hover:scale-110`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] text-xs font-bold">{p.avatar}</div>
                      <span className={`text-xs ${sub}`}>{p.author} · {p.time}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF]">{p.category}</span>
                    </div>
                    <h3 className={`font-semibold ${text} text-sm mb-1`}>{p.title}</h3>
                    <p className={`text-xs ${sub} line-clamp-2`}>{p.content}</p>
                    <div className={`text-xs ${sub} mt-2 flex items-center gap-1`}>
                      <MessageCircle size={12} /> {p.comments} comments
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}