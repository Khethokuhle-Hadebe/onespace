import { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Globe, Home, Bell, User, Settings, LogOut } from "lucide-react";

import { motion } from "framer-motion";

import { cn } from "../lib/utils";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_AVATAR = "/default-avatar.png";

const NAV = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Globe, label: "X Feed", path: "/x" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

    export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("onespace-token");

    if (!token) return;

    fetch(`${API_URL}/api/auth/me`, {
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
        console.error("Failed to load sidebar user:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("onespace-token");
    localStorage.removeItem("onespace-user");
    navigate("/auth");
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-pink-dim bg-card/60 backdrop-blur-sm">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink to-purple-600 shadow-lg shadow-pink/30">
          <Globe className="h-5 w-5 text-white" />
        </div>

        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-pink to-purple-400 bg-clip-text text-transparent">
          OneSpace
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          return (
            <Link key={item.label} to={item.path}>
              <motion.div
                whileHover={{ x: 3 }}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-pink/10 text-pink border border-pink/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive && "text-pink"
                  )}
                />

                <span>{item.label}</span>

                {item.label === "X Feed" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-pink/20 text-[10px] font-bold text-pink">
                    X
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <Link to="/profile">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="m-3 rounded-xl border border-pink-dim bg-muted/30 p-3 cursor-pointer transition-colors hover:border-pink/40 hover:bg-pink/5"
        >
          <div className="flex items-center gap-3">
            <img
  src={
    currentUser?.profilePicture
      ? `${API_URL}${currentUser.profilePicture}`
      : DEFAULT_AVATAR
  }
  alt={currentUser?.username || "profile"}
  className="h-9 w-9 rounded-full border-2 border-pink/50 object-cover"
/>
<div className="min-w-0">
  <p className="truncate text-sm font-semibold">
    {currentUser?.displayName || currentUser?.username || "User"}
  </p>
  <p className="truncate text-xs text-muted-foreground">
    {currentUser?.username ? `@${currentUser.username}` : ""}
  </p>
</div>
          </div>
        </motion.div>
      </Link>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}

