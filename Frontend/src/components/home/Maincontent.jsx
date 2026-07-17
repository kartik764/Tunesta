import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import WelcomeBanner from "./WelcomeBanner";
import SearchBar from "./SearchBar";
import AlbumGrid from "./AlbumGrid";

const Maincontent = ({
  albums,
  handleAlbumClick,
  query,
  setQuery,
  isSearchMode,
}) => {
  return (
    <main className="relative flex-1 overflow-y-auto">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-96 right-0 h-96 w-96 rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <WelcomeBanner />
        </motion.div>

        {/* Search */}
        <AnimatePresence mode="wait">
          {isSearchMode && (
            <motion.div
              key="search"
              initial={{
                opacity: 0,
                y: -12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.25,
              }}
              className="rounded-3xl border border-white/10 bg-[#111118]/80 p-5 backdrop-blur-2xl"
            >
              <div className="mb-5 flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-violet-400"
                />

                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
                  Search Library
                </h2>
              </div>

              <SearchBar
                query={query}
                setQuery={setQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Album Grid */}
        <motion.section
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.4,
          }}
        >
          <AlbumGrid
            albums={albums}
            handleAlbumClick={handleAlbumClick}
          />
        </motion.section>
      </div>
    </main>
  );
};

export default Maincontent;