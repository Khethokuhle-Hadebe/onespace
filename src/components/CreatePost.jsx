import { useState, useRef, useEffect } from "react";
import { Image, Send, Smile, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ME, EMOJIS } from "../lib/mockData";
import { cn } from "../lib/utils";

export default function CreatePost({ onPost, placeholder = "What's happening in your world?",
   platform = "onespace" }) {

  const [text, setText] = useState("");

  const [image, setImage] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [focused, setFocused] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const fileRef = useRef(null);
  const emojiRef = useRef(null);

 useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      emojiRef.current &&
      !emojiRef.current.contains(event.target)
    ) {
      setShowEmojis(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
     const token = localStorage.getItem("onespace-token");

     if (!token) return;

     

      const response = await fetch("http://localhost:5000/api/auth/me", {
       headers: {
       Authorization: token,
     },
      });

      const data = await response.json();

      if (response.ok && data.success) {
       setCurrentUser(data.user);
}
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  fetchCurrentUser();
}, []);

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setImage({
    file,
    preview: url,
  });
  setFocused(true);
};

  const submit = () => {
    if (!text.trim() && !image) return;
    onPost({
  id: Date.now().toString(),
  user: ME,
  content: text.trim(),
  image: image?.preview || null,
  imageFile: image?.file || null,
  likes: 0,
  comments: [],
  shares: 0,
  liked: false,
  platform,
  time: "Just now",
});
    setText("");
    setImage(null);
    setShowEmojis(false);
    setFocused(false);
  };

  return (
    <div className={cn(
   "rounded-2xl border bg-card transition-colors duration-300",
     platform === "x"
    ? focused
      ? "border-green-500/50 shadow-lg shadow-green-500/10"
      : "border-green-500/20"
     : focused
      ? "border-pink/50 shadow-lg shadow-pink/10"
      : "border-pink-dim"
  )}>
      <div className="flex gap-3 p-4">
        <img
  src={
    currentUser?.profilePicture
  ? `http://localhost:5000${currentUser.profilePicture}`
  : "/default-avatar.png"
  }
  alt={currentUser?.username || "me"}
  className={`h-10 w-10 rounded-full border-2 object-cover shrink-0 ${
    platform === "x" ? "border-green-500/40" : "border-pink/40"
  }`}
/>
        <div className="flex-1 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
             if (!text && !image && !showEmojis) {
            setFocused(false);
           }
        }}
            placeholder={placeholder}
            rows={focused ? 3 : 1}
            className="w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none leading-relaxed"
          />

          {image && (
             <div className={`relative overflow-hidden rounded-xl border ${
              platform === "x" ? "border-green-500/20" : "border-pink-dim"
           }`}>
              <img
                src={image.preview}
                alt="preview"
                className="w-full max-h-80 object-contain rounded-lg"
            /> 
              <button
                onClick={() => setImage(null)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <AnimatePresence>
            {showEmojis && (
              <motion.div
                ref={emojiRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`flex flex-wrap gap-1.5 rounded-xl border bg-muted/50 p-2 ${
                platform === "x" ? "border-green-500/20" : "border-pink-dim"
              }`}
              >
                {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setText(t => t + e)}
              className="text-xl hover:scale-125 transition-transform"
           >
              {e}
            </button>
          ))}
              </motion.div>
            )}
          </AnimatePresence>

         <div className="flex items-center justify-between border-t border-white/8 pt-3">
  <div className="flex items-center gap-1">
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
    />

    <button
      type="button"
      onClick={() => {
        setFocused(true);
        fileRef.current?.click();
      }}
      className={`rounded-lg p-2 text-muted-foreground transition-colors ${
        platform === "x"
          ? "hover:text-green-500 hover:bg-green-500/10"
          : "hover:text-pink hover:bg-pink/10"
      }`}
    >
      <Image className="h-4 w-4" />
    </button>

    <button
      type="button"
      onClick={() => {
        setFocused(true);
        setShowEmojis((prev) => !prev);
      }}
      className={cn(
        "rounded-lg p-2 transition-colors",
        platform === "x"
          ? showEmojis
            ? "text-green-500 bg-green-500/10"
            : "text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
          : showEmojis
            ? "text-pink bg-pink/10"
            : "text-muted-foreground hover:text-pink hover:bg-pink/10"
      )}
    >
      <Smile className="h-4 w-4" />
    </button>

    {text && (
      <span className="ml-2 text-xs text-muted-foreground">
        {text.length}/280
      </span>
    )}
  </div>

  <div className="flex gap-2">
    {(text || image) && (
      <button
        type="button"
        onClick={() => {
          setText("");
          setImage(null);
          setShowEmojis(false);
          setFocused(false);
        }}
        className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/5 transition-colors"
      >
        Cancel
      </button>
    )}

    <button
      onClick={submit}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
        platform === "x"
          ? "bg-green-500 shadow-md shadow-green-500/30 hover:bg-green-500/90"
          : "bg-pink shadow-md shadow-pink/30 hover:bg-pink/90"
      }`}
    >
      <Send className="h-3.5 w-3.5" />
      Post
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}