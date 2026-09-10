import { useState } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import MobileNav from "../components/MobileNav";
import useLocalStorage from "../hooks/useLocalStorage";
import { X_POSTS } from "../lib/mockData";
import { Globe, TrendingUp } from "lucide-react";

const TRENDS = [
  { tag: "#OpenSource", count: "14.2K" },
  { tag: "#AITools", count: "9.8K" },
  { tag: "#BuildInPublic", count: "7.1K" },
  { tag: "#WebDev", count: "5.4K" },
];

export default function XFeed() {
  const [posts, setPosts] = useLocalStorage("onespace-x-posts", X_POSTS);
  const [tab, setTab] = useState("for-you");
  const [searchTerm, setSearchTerm] = useState("");

  const handlePost = (newPost) => setPosts([newPost, ...posts]);
  const handleLike = (id) =>
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  const handleComment = (id, text) =>
    setPosts(posts.map(p => p.id === id ? {
      ...p,
      comments: [...p.comments, {
        id: Date.now().toString(),
        user: { name: "You", handle: "@you", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" },
        text, time: "Just now"
      }]
    } : p));
  const handleShare = (id) =>
    setPosts(posts.map(p => p.id === id ? { ...p, shares: p.shares + 1 } : p));

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-green-500/20 bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-3 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Globe className="h-4 w-4 text-background" />
            </div>
            <h1 className="text-lg font-bold">X Feed</h1>
          </div>
          {/* Tabs */}
          <div className="flex">
            {["for-you", "following"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative flex-1 pb-3 text-sm font-medium capitalize transition-colors"
                style={{ color: tab === t ? "#22c55e" : "hsl(var(--muted-foreground))" }}
              >
                {t.replace("-", " ")}
                {tab === t && (
                  <motion.div layoutId="x-tab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-green-500"/>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-4 flex gap-6">
        {/* Feed */}
        <div className="flex-1 space-y-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search XFeed..."
            color="green"
/>
          <CreatePost
            onPost={handlePost}
            placeholder="What's happening?"
            platform="x"
          />
       <div className="space-y-3">
  {tab === "following" ? (
    <div className="rounded-2xl border border-green-500/20 bg-card p-8 text-center">
      <h2 className="text-lg font-bold text-green-500">
        You're all caught up
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Posts from accounts you follow will appear here.
      </p>
    </div>
  ) : posts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    ).length === 0 ? (
    <div className="rounded-2xl border border-green-500/20 bg-card p-8 text-center">
      <h2 className="text-lg font-bold text-green-500">
        No posts found
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try searching for something else on XFeed.
      </p>
    </div>
  ) : (
    posts
      .filter(
        (post) =>
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.user.handle.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <PostCard
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            compact
            platform="x"
          />
        </motion.div>
      ))
  )}
</div>
        </div>

        {/* Trends sidebar */}
        <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-green-500/20 bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Trending
            </h3>
            <div className="space-y-3">
              {TRENDS.map((t) => (
                <div key={t.tag} className="group cursor-pointer">
                  <p className="text-sm font-semibold group-hover:text-green-500 transition-colors">{t.tag}</p>
                  <p className="text-xs text-muted-foreground">{t.count} posts</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <MobileNav />
    </div>
  );
}