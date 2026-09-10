import { useState, useEffect } from "react";

import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { cn } from "../lib/utils";

import { useToast } from "../hooks/use-toast";

import { EMOJIS, ME } from "../lib/mockData";

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  compact = false,
  platform,
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("onespace-token");

  if (!token) return;

  fetch("http://localhost:5000/api/auth/me", {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setCurrentUser(data.user);
      }
    })
    .catch((error) => {
      console.error("Failed to load current user:", error);
    });
}, []);

  const handleLike = () => {
    setJustLiked(true);
    onLike(post.id);
    setTimeout(() => setJustLiked(false), 400);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;

    onComment(post.id, commentText.trim());
    setCommentText("");
    setShowEmojis(false);
  };

  const handleShare = () => {
    onShare(post.id);

    toast({
      title: "Post shared 🚀",
      description: "Your post was shared successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-card overflow-hidden transition-colors duration-300 ${
        platform === "x"
          ? "border-green-500/20 hover:border-green-500/50"
          : "border-pink-dim hover:border-pink/50"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          
            <img
              src={
  post.user?.avatar?.startsWith("/uploads/")
    ? `http://localhost:5000${post.user.avatar}`
    : post.user?.avatar || "/default-avatar.png"
}
                alt={post.user.name}
                className={`h-10 w-10 rounded-full border-2 object-cover ${
                platform === "x" ? "border-green-500/40" : "border-pink/40"  
            }`}
         />


          <div>
            <p className="text-sm font-bold">{post.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {post.user.handle} · {post.time}
            </p>
          </div>
        </div>

        <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div
          className={`mx-4 mb-3 overflow-hidden rounded-xl border ${
            platform === "x"
              ? "border-green-500/20"
              : "border-pink-dim"
          }`}
        >
          <img
            src={post.image}
            alt=""
            className="w-full max-h-80 object-contain rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 pb-3 border-t border-white/5 pt-3">
        <motion.button
          onClick={handleLike}
          animate={justLiked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
            post.liked
              ? "text-pink bg-pink/10"
              : "text-muted-foreground hover:text-pink hover:bg-pink/8"
          )}
        >
          <Heart className={cn("h-4 w-4", post.liked && "fill-current")} />
          <span>{post.likes}</span>
        </motion.button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
            showComments
              ? "text-blue-400 bg-blue-400/10"
              : "text-muted-foreground hover:text-blue-400 hover:bg-blue-400/8"
          )}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-green-400 hover:bg-green-400/8 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>{post.shares}</span>
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="px-4 py-3 space-y-3">
              {post.comments.length > 0 && (
                <div className="space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2">
                      <img
                        src={
                         c.user.avatar?.startsWith("/uploads/")
                          ? `http://localhost:5000${c.user.avatar}`
                          : c.user.avatar || "/default-avatar.png"
                      }
                            alt=""
                            className={`h-7 w-7 rounded-full border object-cover shrink-0 ${
                            platform === "x"
                            ? "border-green-500/20"
                            : "border-pink/20"
                        }`}
                      />

                      <div className="flex-1 rounded-xl bg-muted/60 px-3 py-2">
                        <span className="text-xs font-semibold text-pink">
                          {c.user.name}{" "}
                        </span>

                        <span className="text-xs text-foreground">
                          {c.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment input */}
              <div className="flex items-center gap-2">
                <img
                  src={
                    currentUser?.profilePicture
                    ? `http://localhost:5000${currentUser.profilePicture}`
                    : "/default-avatar.png"
                 }
                     alt={currentUser?.username || "me"}
                     className={`h-7 w-7 rounded-full border object-cover shrink-0 ${
                     platform === "x"
                     ? "border-green-500/30"
                     : "border-pink/30"
               }`}
             />
                <div className="relative flex-1">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleComment()
                    }
                    placeholder="Write a comment…"
                    className={`w-full rounded-xl border bg-muted/60 px-3 py-2 pr-16 text-xs placeholder:text-muted-foreground focus:outline-none ${
                      platform === "x"
                        ? "border-green-500/20 focus:border-green-500/50"
                        : "border-pink-dim focus:border-pink/50"
                    }`}
                  />

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setShowEmojis(!showEmojis)}
                      className="text-base leading-none hover:scale-110 transition-transform"
                    >
                      😊
                    </button>

                    <button
                      onClick={handleComment}
                      className="text-pink hover:text-pink/80 transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Emoji picker */}
              <AnimatePresence>
                {showEmojis && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex flex-wrap gap-1.5 rounded-xl border bg-popover p-2 ${
                      platform === "x"
                        ? "border-green-500/20"
                        : "border-pink-dim"
                    }`}
                  >
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => {
                          setCommentText((t) => t + e);
                          setShowEmojis(false);
                        }}
                        className="text-lg hover:scale-125 transition-transform"
                      >
                        {e}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

