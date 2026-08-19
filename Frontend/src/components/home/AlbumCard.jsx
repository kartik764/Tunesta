import { motion } from "framer-motion";
import { Play, Music2, Disc3 } from "lucide-react";

function AlbumCard({
  album,
  handleAlbumClick,
}) {
  const cover = album.cover.startsWith("http")
    ? album.cover
    : `${import.meta.env.VITE_API_URL}${album.cover}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={() => handleAlbumClick(album)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-xl"
    >
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/15 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* Cover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={cover}
          alt={album.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-70 transition group-hover:opacity-90" />

        {/* Floating Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileHover={{}}
          className="absolute bottom-4 right-4"
        >
          <button className="flex h-11 w-11 translate-y-4 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-xl shadow-violet-900/40 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Play
              size={18}
              fill="currentColor"
              className="ml-1"
            />
          </button>
        </motion.div>

        {/* Album Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md">
          <Disc3
            size={14}
            className="text-violet-400"
          />

          <span className="text-xs font-medium text-zinc-200">
            Album
          </span>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <Music2
              size={15}
              className="text-violet-400"
            />

            <span className="text-xs uppercase tracking-[0.25em]">
              Tunesta Library
            </span>
          </div>

          <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-white">
            {album.title}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 p-4">
        <p className="line-clamp-2 text-xs leading-5 text-zinc-400">
          {album.description}
        </p>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Ready to Play
          </span>

          <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 transition group-hover:border-violet-500/40 group-hover:bg-violet-500/20">
            Listen
          </div>
        </div>
      </div>

      {/* Hover Border */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition duration-300 group-hover:ring-violet-500/30" />
    </motion.div>
  );
}

export default AlbumCard;