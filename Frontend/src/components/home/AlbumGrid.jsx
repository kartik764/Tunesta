import { motion } from "framer-motion";
import {
  Music2,
  Library,
  Disc3,
  SearchX,
} from "lucide-react";

import AlbumCard from "./AlbumCard";

function AlbumGrid({
  albums,
  handleAlbumClick,
}) {
  if (!albums.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#111118]/80 p-6 text-center backdrop-blur-2xl sm:min-h-80 sm:p-10"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10">
          <SearchX
            size={36}
            className="text-violet-400"
          />
        </div>

        <h2 className="text-2xl font-semibold text-white">
          No albums found
        </h2>

        <p className="mt-3 max-w-md text-zinc-400">
          We couldn't find anything matching your search.
          Try another keyword or upload a new album to your
          library.
        </p>
      </motion.div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <Library
              size={16}
              className="text-violet-400"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              Your Collection
            </span>
          </div>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Browse Albums
          </h2>

          <p className="mt-2 text-zinc-400">
            Discover your uploaded music and continue
            listening together.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111118]/70 px-5 py-3 backdrop-blur-xl">
          <Disc3
            size={18}
            className="text-violet-400"
          />

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Albums
            </p>

            <p className="font-semibold text-white">
              {albums.length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Album Grid */}
      <motion.div
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="grid max-h-190 grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {albums.map((album) => (
          <motion.div
            key={album._id}
            variants={{
              hidden: {
                opacity: 0,
                y: 24,
              },
              show: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <AlbumCard
              album={album}
              handleAlbumClick={handleAlbumClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#111118]/60 px-4 py-4 text-center text-zinc-400 backdrop-blur-xl sm:flex-row sm:gap-3 sm:px-6 sm:text-left"
      >
        <Music2
          size={18}
          className="text-violet-400"
        />

        <span className="text-sm">
          Select an album to start listening with your room.
        </span>
      </motion.div>
    </section>
  );
}

export default AlbumGrid;
