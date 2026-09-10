import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings as Cog, Moon, Bell, Lock, Palette, Globe } from "lucide-react";
import { Switch } from "../components/ui/switch";
import MobileNav from "../components/MobileNav";

const SETTINGS = [
  { icon: Moon, label: "Dark Mode", desc: "Always on for OneSpace", key: "dark", value: true },
  { icon: Bell, label: "Notifications", desc: "Push & email alerts", key: "notifs", value: true },
  { icon: Lock, label: "Private Account", desc: "Only followers see your posts", key: "private", value: false },
  { icon: Globe, label: "Public Profile", desc: "Discoverable on search", key: "public", value: true },
  { icon: Palette, label: "Compact Feed", desc: "Denser post layout", key: "compact", value: false },
];

export default function Settings() {
  const [vals, setVals] = useState(() => {
  const saved = localStorage.getItem("onespace-settings");

  return saved
    ? JSON.parse(saved)
    : Object.fromEntries(SETTINGS.map((s) => [s.key, s.value]));
});

useEffect(() => {
  localStorage.setItem("onespace-settings", JSON.stringify(vals));

  document.documentElement.classList.toggle("dark", vals.dark);
}, [vals]);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <div className="sticky top-0 z-30 border-b border-pink-dim bg-background/90 backdrop-blur-md px-4 py-4">
        <h1 className="flex items-center gap-2 text-lg font-bold"><Cog className="h-5 w-5 text-pink" /> Settings</h1>
      </div>

      <div
       className={`mx-auto max-w-xl px-4 py-4 ${
       vals.compact ? "space-y-1" : "space-y-2"
    }`}
   >
        {SETTINGS.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center justify-between rounded-2xl border border-pink-dim bg-card p-4 transition-all duration-300 hover:scale-[1.01] hover:border-pink/40 hover:bg-pink/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink/10 border border-pink/20">
                <s.icon className="h-4 w-4 text-pink" />
              </div>
              <div>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
            <Switch checked={vals[s.key]} onCheckedChange={v => setVals({ ...vals, [s.key]: v })} />
          </motion.div>
        ))}
      </div>
      <MobileNav />
    </div>
  );
}