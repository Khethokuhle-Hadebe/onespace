import { Link, useLocation } from "react-router-dom";
import { Home, Globe, Bell, User } from "lucide-react";
import { cn } from "../lib/utils";

const ITEMS = [
  { icon: Home, path: "/" },
  { icon: Globe, path: "/", label: "Space" },
  { icon: Home, path: "/x", label: "X" },
  { icon: Bell, path: "/notifications" },
  { icon: User, path: "/profile" },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex border-t border-pink-dim bg-card/95 backdrop-blur-sm lg:hidden">
      {ITEMS.map((item, i) => {
        const active = pathname === item.path;
        return (
          <Link key={i} to={item.path} className="flex flex-1 items-center justify-center py-3">
            <item.icon className={cn("h-5 w-5 transition-colors", active ? "text-pink" : "text-muted-foreground")} />
          </Link>
        );
      })}
    </nav>
  );
}