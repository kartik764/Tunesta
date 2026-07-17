import { Music2 } from "lucide-react";

function SongInfo({ currentsong }) {
  const cover =
    currentsong?.cover &&
    (currentsong.cover.startsWith("http")
      ? currentsong.cover
      : `${import.meta.env.VITE_API_URL}${currentsong.cover}`);

  return (
    <div className="flex items-center gap-4 min-w-0">
      <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#1A1A24] border border-white/10 flex items-center justify-center shrink-0">
        {cover ? (
          <img
            src={cover}
            alt={currentsong?.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Music2
            size={22}
            className="text-violet-400"
          />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-white">
          {currentsong?.name || "Select an Album"}
        </h3>

        <p className="truncate text-xs text-zinc-400">
          {currentsong?.albumTitle || "Tunesta Music"}
        </p>
      </div>
    </div>
  );
}

export default SongInfo;