import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PostSkeleton from "../components/PostSkeleton";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import MobileNav from "../components/MobileNav";
import { Globe, Sparkles, Plus } from "lucide-react";
import ZilethiweAvatar from "../assets/avatars/Zilethiwe.jpg";
import MeekaAvatar from "../assets/avatars/Meeka.jpg";
import MrDlaminiAvatar from "../assets/avatars/Mr Dlamini.jpg";
import SindiAvatar from "../assets/avatars/Sindi.jpg";
import ZamaAvatar from "../assets/avatars/Zama.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const STORIES = [
  { name: "Zilethiwe", avatar: ZilethiweAvatar },
  { name: "Meeka", avatar: MeekaAvatar },
  { name: "Mr Dlamini", avatar: MrDlaminiAvatar },
  { name: "Sindi", avatar: SindiAvatar },
  { name: "Zama", avatar: ZamaAvatar },
];
export default function Home() {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [showStoryModal, setShowStoryModal] = useState(false);
const [storyImage, setStoryImage] = useState(null);
const [storyText, setStoryText] = useState("");
const [savedStory, setSavedStory] = useState(null);
const fileRef = useRef(null);
const [currentUsername, setCurrentUsername] = useState("");
useEffect(() => {
  const storedUser = localStorage.getItem("onespace-user");

  if (!storedUser) return;

  const user = JSON.parse(storedUser);
  setCurrentUsername(user.username);
  const storyKey = `onespace-story-${user.username}`;
  const storedStory = localStorage.getItem(storyKey);

  if (storedStory) {
    setSavedStory(JSON.parse(storedStory));
  }
  const fetchPosts = async () => {
    try {
     const token = localStorage.getItem("onespace-token");

const response = await fetch(`${API_URL}/api/posts`, {
  headers: {
    Authorization: token,
  },
});
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to load posts");
      }

      const formattedPosts = data.posts.map((post) => ({
        id: post._id,

        user: {
          name: post.user?.username || "OneSpace User",
          handle: post.user?.username
          ? `@${post.user.username}`
          : "@user",
          avatar: post.user?.profilePicture || "/default-avatar.png",
        },
        content: post.content,

                image: post.image
          ? post.image.startsWith("http")
            ? post.image
            : `${API_URL}${post.image}`
          : null,

       likes: post.likes || 0,
       comments: (post.comments || []).map((comment, index) => ({
       id: `${post._id}-comment-${index}`,
       user: {
       name: comment.user?.username || "OneSpace User",
       handle: comment.user?.username
      ? `@${comment.user.username}`
      : "@user",
      avatar: comment.user?.profilePicture || "/default-avatar.png",
  },
      text: comment.text,
      time: comment.createdAt
      ? new Date(comment.createdAt).toLocaleString()
      : "Just now",
  })),
        shares: post.shares || 0,

        liked: post.liked || false,

        platform: "onespace",

        time: new Date(post.createdAt).toLocaleString(),
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, []);

  const handlePost = async (newPost) => {
  try {
    const token = localStorage.getItem("onespace-token");

    if (!token) {
      alert("Please log in again.");
      return;
    }

    const formData = new FormData();

formData.append("content", newPost.content || "");

if (newPost.imageFile) {
  formData.append("image", newPost.imageFile);
}

const response = await fetch(`${API_URL}/api/posts`, {
  method: "POST",
  headers: {
    Authorization: token,
  },
  body: formData,
});

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create post");
    }

    const savedPost = {
      id: data.post._id,
      user: {
        name: data.post.user?.username || "You",
        handle: data.post.user?.username
          ? `@${data.post.user.username}`
          : "@you",
        avatar: data.post.user?.profilePicture || "/default-avatar.png",
      },
      content: data.post.content,
            image: data.post.image
        ? data.post.image.startsWith("http")
          ? data.post.image
          : `${API_URL}${data.post.image}`
        : null,
      likes: data.post.likes || 0,
      comments: [],
      shares: data.post.shares || 0,
      liked: false,
      platform: "onespace",
      time: "Just now",
    };

    setPosts((currentPosts) => [savedPost, ...currentPosts]);
  } catch (error) {
    console.error("Failed to create post:", error);
    alert(error.message);
  }
};

  const handleLike = async (id) => {
  try {
    const token = localStorage.getItem("onespace-token");

    if (!token) {
      alert("Please log in again.");
      return;
    }

    const response = await fetch(
      `${API_URL}/api/posts/${id}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to like post");
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: data.liked,
              likes: data.likes,
            }
          : post
      )
    );
  } catch (error) {
    console.error("Failed to like post:", error);
    alert(error.message);
  }
};

  const handleComment = async (id, text) => {
  try {
    const token = localStorage.getItem("onespace-token");

    if (!token) {
      alert("Please log in again.");
      return;
    }

    const response = await fetch(
      `${API_URL}/api/posts/${id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add comment");
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: data.comments.map((comment, index) => ({
                id: `${id}-comment-${index}`,
                user: {
                  name: comment.user?.username || "OneSpace User",
                  handle: comment.user?.username
                  ? `@${comment.user.username}`
                  : "@user",
                  avatar: comment.user?.profilePicture || "/default-avatar.png",
               },
                text: comment.text,
                time: new Date(comment.createdAt).toLocaleString(),
              })),
            }
          : post
      )
    );
  } catch (error) {
    console.error("Failed to add comment:", error);
    alert(error.message);
  }
};

  const handleShare = async (id) => {
  try {
    const token = localStorage.getItem("onespace-token");

    if (!token) {
      alert("Please log in again.");
      return;
    }

    const response = await fetch(`${API_URL}/api/posts/${id}/share`, {
      method: "PATCH",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to share post");
    }

    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === id
          ? { ...post, shares: data.shares }
          : post
      )
    );
  } catch (error) {
    console.error("Failed to share post:", error);
    alert(error.message);
  }
};

  const handleStoryImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setStoryImage(reader.result);
  };

  reader.readAsDataURL(file);
};

const handleAddStory = () => {
  if (!storyImage) return;

  const newStory = {
    text: storyText.trim(),
    image: storyImage,
    createdAt: new Date().toISOString(),
  };

  const storedUser = localStorage.getItem("onespace-user");

if (!storedUser) return;

const user = JSON.parse(storedUser);
const storyKey = `onespace-story-${user.username}`;

localStorage.setItem(storyKey, JSON.stringify(newStory));
  setSavedStory(newStory);

  setShowStoryModal(false);
  setStoryText("");
  setStoryImage(null);
};

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-pink-dim bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden">
            <Globe className="h-6 w-6 text-pink" />
            <span className="text-lg font-black bg-gradient-to-r from-pink to-purple-400 bg-clip-text text-transparent">OneSpace</span>
          </div>
          <h1 className="hidden lg:block text-lg font-bold">Home</h1>
          <div className="flex items-center gap-1.5 rounded-full border border-pink/25 bg-pink/8 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-pink" />
            <span className="text-xs font-semibold text-pink">For You</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-4 space-y-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search OneSpace..."
          color="pink"
       />

        {/* Stories */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {STORIES.map((s) => (
            <motion.div
             key={s.name}
             whileHover={{ scale: 1.05 }}
             className="flex shrink-0 flex-col items-center gap-1.5 cursor-pointer relative"
          >
              <div className="rounded-full p-0.5 bg-gradient-to-tr from-pink via-purple-500 to-orange-400">
                <div className="rounded-full p-0.5 bg-background">
                  <div className="relative">
                  <img
                   src={
                     s.name === "Zilethiwe" && savedStory?.image
                     ? savedStory.image
                     : s.name === "Zilethiwe"
                     ? "/default-avatar.png"
                     : s.avatar
                   }
                    alt={s.name}
                    className="h-12 w-12 rounded-full object-cover"
                />
                  {s.name === "Zilethiwe" && (
                  <button
                    onClick={() => setShowStoryModal(true)}
                    className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-white shadow-md hover:scale-110 transition-transform"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
           </div>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">
              {s.name === "Zilethiwe" && currentUsername ? currentUsername : s.name}
             </span>
            </motion.div>
          ))}
        </div>

        <CreatePost onPost={handlePost} />

        <div className="space-y-4">
  {loading ? (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  ) : posts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    ).length > 0 ? (
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <PostCard
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          </motion.div>
        ))
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-pink-dim bg-card p-10 text-center"
      >
        <div className="mb-3 text-4xl">🔍</div>

        <h3 className="text-lg font-bold">No posts found</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Try searching for something else.
        </p>
      </motion.div>
    )}
</div>
      </div>

        {showStoryModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md rounded-3xl border border-pink/20 bg-card p-5 shadow-2xl"
    >
      <h2 className="text-lg font-bold mb-4">Create Story</h2>

      <div className="space-y-4">
        <textarea
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          placeholder="Say something..."
          className="w-full rounded-2xl border border-pink-dim bg-transparent p-3 text-sm focus:outline-none focus:border-pink"
          rows={3}
        />

        {storyImage && (
          <img
            src={storyImage}
            alt="Story preview"
            className="w-full max-h-72 rounded-2xl object-cover"
          />
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleStoryImage}
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-2xl border border-pink/20 bg-pink/10 py-3 text-sm font-semibold text-pink hover:bg-pink/20 transition-colors"
        >
          Upload Story Image
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setShowStoryModal(false)}
            className="flex-1 rounded-2xl border border-pink-dim py-3 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAddStory}
            className="flex-1 rounded-2xl bg-pink py-3 text-sm font-semibold text-white hover:bg-pink/90 transition-colors"
          >
            Share Story
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}

      <MobileNav />
    </div>
  );
}