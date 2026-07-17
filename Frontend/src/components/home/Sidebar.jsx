import {
  Home,
  Search,
  Music2,
  Upload,
  UserCircle2,
  X,
} from "lucide-react";

import { motion } from "framer-motion";
import RoomPanel from "./RoomPanel";

const Sidebar = ({
  songs,
  handlesongclick,
  handleclosebutton,
  handleOpenUpload,
  setIsSearchMode,
  isSearchMode,
  roomInput,
  setRoomInput,
  handleCreateRoom,
  handleJoinRoom,
}) => {
  const email = sessionStorage.getItem("user_email") || "user@tunesta.com";

  const username = email.split("@")[0];

  return (
    <aside className="flex h-full w-80 flex-col border-r border-white/10 bg-[#0A0A10] text-white">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 p-6">

        <div>

          <h1 className="text-2xl font-bold tracking-wide text-violet-500">
            Tunesta
          </h1>

          <p className="mt-1 text-xs text-zinc-500">
            Collaborative Music
          </p>

        </div>

        <button
          onClick={handleclosebutton}
          className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
        >
          <X size={18} />
        </button>

      </div>

      {/* Profile */}

      <div className="m-5 rounded-3xl border border-white/10 bg-white/5 p-5">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>

          <div>

            <h3 className="font-semibold capitalize">
              {username}
            </h3>

            <p className="text-xs text-zinc-400 truncate max-w-37.5">
              {email}
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <div className="px-5">

        <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
          Navigation
        </p>

        <div className="space-y-2">

          <button
            onClick={() => setIsSearchMode(false)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              !isSearchMode
                ? "bg-violet-600 text-white"
                : "hover:bg-white/5 text-zinc-300"
            }`}
          >
            <Home size={18} />
            Home
          </button>

          <button
            onClick={() => setIsSearchMode(true)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              isSearchMode
                ? "bg-violet-600 text-white"
                : "hover:bg-white/5 text-zinc-300"
            }`}
          >
            <Search size={18} />
            Search
          </button>

        </div>

      </div>

      {/* Room */}

      <div className="px-5 pt-6">

        <RoomPanel
          roomInput={roomInput}
          setRoomInput={setRoomInput}
          handleCreateRoom={handleCreateRoom}
          handleJoinRoom={handleJoinRoom}
        />

      </div>

      {/* Upload */}

      <div className="px-5 pt-6">

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenUpload}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-4 font-semibold shadow-lg shadow-violet-900/40"
        >
          <Upload size={18} />
          Upload Music
        </motion.button>

      </div>

      {/* Library */}

      <div className="mt-8 flex-1 overflow-hidden px-5">

        <div className="mb-5 flex items-center gap-2">

          <Music2
            className="text-violet-400"
            size={18}
          />

          <h3 className="font-semibold">
            Your Library
          </h3>

        </div>

        <div className="space-y-3 overflow-y-auto pr-2">

          {songs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
              Upload songs to build your library.
            </div>
          )}

          {songs.map((song, index) => (
            <motion.button
              key={song.path}
              whileHover={{ x: 4 }}
              onClick={() => handlesongclick(song, index)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/3 p-4 text-left transition hover:border-violet-500/30 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20">
                  <Music2 size={18} />
                </div>

                <div>

                  <p className="line-clamp-1 text-sm font-medium">
                    {song.name}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Tunesta
                  </p>

                </div>

              </div>

              <div className="text-xs text-violet-400">
                ▶
              </div>

            </motion.button>
          ))}

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;