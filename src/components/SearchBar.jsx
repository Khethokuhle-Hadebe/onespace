import { Search } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  color = "pink",
}) {

  const isGreen = color === "green";

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          isGreen ? "text-green-500" : "text-pink"
        }`}
      />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full
          rounded-full
          border
          bg-background
          py-2
          pl-10
          pr-4
          text-sm
          outline-none
          transition-all

          ${
            isGreen
              ? `
                border-green-500/40
                focus:border-green-500
                focus:ring-2
                focus:ring-green-500/20
              `
              : `
                border-pink/40
                focus:border-pink
                focus:ring-2
                focus:ring-pink/20
              `
          }
        `}
      />
    </div>
  );
}