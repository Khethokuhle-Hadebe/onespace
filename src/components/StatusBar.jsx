import { Plus } from "lucide-react";

export default function StatusBar() {
  const statuses = [
    {
      id: 1,
      name: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face",
      own: true,
    },
    {
      id: 2,
      name: "Sarah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Michael",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Jessica",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <div className="rounded-2xl border border-pink-dim bg-card p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
          >
            <div className="relative">
              <div className="h-16 w-16 rounded-full p-[2px] bg-pink">
                <img
                  src={status.avatar}
                  alt={status.name}
                  className="h-full w-full rounded-full object-cover border-2 border-background"
                />
              </div>

              {status.own && (
                <button
                  className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-white border border-background"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
            </div>

            <span className="text-xs text-center">
              {status.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}