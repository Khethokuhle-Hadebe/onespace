import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, Share2, Bell } from "lucide-react";
import { cn } from "../lib/utils";
import MobileNav from "../components/MobileNav";
import MeekaAvatar from "../assets/avatars/Meeka.jpg";
import MrDlaminiAvatar from "../assets/avatars/Mr Dlamini.jpg";
import SindiAvatar from "../assets/avatars/Sindi.jpg";
import ZamaAvatar from "../assets/avatars/Zama.jpg";

const NOTIFS = [
  {
    id: 1,
    type: "like",
    name: "Meeka",
    avatar: MeekaAvatar,
    text: "liked your post",
    time: "2m",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    name: "Mr Dlamini",
    avatar: MrDlaminiAvatar,
    text: "commented on your photo",
    time: "15m",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    name: "Sindi",
    avatar: SindiAvatar,
    text: "started following you",
    time: "1h",
    read: false,
  },
  {
    id: 4,
    type: "share",
    name: "Zama",
    avatar: ZamaAvatar,
    text: "shared your post",
    time: "3h",
    read: true,
  },
  {
    id: 5,
    type: "like",
    name: "Meeka",
    avatar: MeekaAvatar,
    text: "liked your comment",
    time: "5h",
    read: true,
  },
];

const icons = { like: Heart, comment: MessageCircle, follow: UserPlus, share: Share2 };
const colors = { like: "text-pink bg-pink/15", comment: "text-blue-400 bg-blue-400/15", follow: "text-green-400 bg-green-400/15", share: "text-purple-400 bg-purple-400/15" };

export default function Notifications() {
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <div className="sticky top-0 z-30 border-b border-pink-dim bg-background/90 backdrop-blur-md px-4 py-4">
        <h1 className="flex items-center gap-2 text-lg font-bold">
          <Bell className="h-5 w-5 text-pink" /> Notifications
        </h1>
      </div>

      <div className="mx-auto max-w-xl px-4 py-4 space-y-2">
        {NOTIFS.map((n, i) => {
          const Icon = icons[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-300 hover:scale-[1.01] hover:border-pink/40 hover:bg-pink/10",
                n.read ? "border-pink-dim bg-card" : "border-pink/30 bg-pink/5"
              )}
            >
              <img src={n.avatar} alt={n.name} className="h-9 w-9 rounded-full border border-pink/30 object-cover" />
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", colors[n.type])}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm"><span className="font-semibold">{n.name}</span> <span className="text-muted-foreground">{n.text}</span></p>
                <p className="text-xs text-muted-foreground">{n.time} ago</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-pink shrink-0" />}
            </motion.div>
          );
        })}
      </div>
      <MobileNav />
    </div>
  );
}