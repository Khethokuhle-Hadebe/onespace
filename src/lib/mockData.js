import ZilethiweAvatar from "../assets/avatars/Zilethiwe.jpg";
import MeekaAvatar from "../assets/avatars/Meeka.jpg";
import MrDlaminiAvatar from "../assets/avatars/Mr Dlamini.jpg";
import SindiAvatar from "../assets/avatars/Sindi.jpg";
import ZamaAvatar from "../assets/avatars/Zama.jpg";

console.log(MeekaAvatar);
console.log(MrDlaminiAvatar);
console.log(SindiAvatar);
console.log(ZamaAvatar);

export const ME = {
  id: "me",
  name: "You",
  handle: "@you",
  avatar: ZilethiweAvatar,
};

export const SAMPLE_POSTS = [
  {
    id: "p1",
    user: { name: "Meeka Segal", handle: "@meekasegal", avatar: MeekaAvatar},
    content: "Golden hour never hits the same twice ✨🌅 Feeling grateful for every sunset.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=500&fit=crop",
    likes: 312, comments: [], shares: 24, liked: false, platform: "onespace",
    time: "2h ago",
  },
  {
    id: "p2",
    user: { name: "Simphiwe Dlamini", handle: "@Simphiwedlamini", avatar: MrDlaminiAvatar},
    content: "Just dropped my new EP 🎵🔥 Three years of work in 8 tracks. Link in bio.",
    image: null,
    likes: 891, comments: [
      { id: "c1", user: { name: "Luna Park", handle: "@Lunapark", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }, text: "This is absolutely fire!! 🔥🔥", time: "1h ago" }
    ], shares: 156, liked: true, platform: "onespace",
    time: "5h ago",
  },
  {
    id: "p3",
    user: { name: "Sindi Thabede", handle: "@Sindithabede", avatar: SindiAvatar},
    content: "City lights and midnight rides 🌃🛵 Tokyo never sleeps and neither do I.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&h=500&fit=crop",
    likes: 1204, comments: [], shares: 78, liked: false, platform: "onespace",
    time: "8h ago",
  },
];

export const X_POSTS = [
  {
    id: "x1",
    user: { name: "Zama Ngema", handle: "@Zamangema", avatar: ZamaAvatar},
    content: "Hot take: The best code you'll ever write is the code you delete. Simplicity wins every time.",
    image: null,
    likes: 2840, comments: [
      { id: "xc1", user: { name: "Aria", handle: "@aria", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }, text: "So true! Less is always more 🙌", time: "30m ago" }
    ], shares: 410, liked: false, platform: "x",
    time: "1h ago",
  },
  {
    id: "x2",
    user: { name: "Meeka Segal", handle: "@meekasegal", avatar: MeekaAvatar },
    content: "Thread 🧵 10 things nobody tells you about building an audience from zero:\n\n1. Consistency beats perfection\n2. Your niche will find YOU\n3. Engage before you post...",
    image: null,
    likes: 5621, comments: [], shares: 1230, liked: true, platform: "x",
    time: "3h ago",
  },
  {
    id: "x3",
    user: { name: "Simphiwe Dlamini", handle: "@simphiwedlamini", avatar: MrDlaminiAvatar },
    content: "AI isn't replacing creativity — it's a new paintbrush. The artist still matters. 🎨",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=700&h=400&fit=crop",
    likes: 3102, comments: [], shares: 670, liked: false, platform: "x",
    time: "6h ago",
  },
];

export const EMOJIS = ["❤️", "🔥", "😍", "🙌", "✨", "😂", "🎉", "👏", "💯", "🤩", "😭", "💀", "👀", "🫶", "💫"];