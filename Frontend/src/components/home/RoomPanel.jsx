import { motion } from "framer-motion";
import {
  Users,
  Plus,
  LogIn,
  Sparkles,
  Radio,
  ArrowRight,
} from "lucide-react";

function RoomPanel({
  roomInput,
  setRoomInput,
  handleCreateRoom,
  handleJoinRoom,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-2xl"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -top-20 right-0 h-44 w-44 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
                <Users size={20} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Music Rooms
                </h3>
                <p className="text-sm text-zinc-400">
                  Listen together in real time
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Radio size={12} />
            Live
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Sparkles size={15} className="text-violet-400" />
            Room ID
          </label>

          <div className="group relative">
            <input
              type="text"
              placeholder="Paste or enter room code..."
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-black/30"
            />

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-all duration-300 group-focus-within:ring-violet-500/40" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateRoom}
            className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3.5 font-medium text-white shadow-lg shadow-violet-900/30 transition-all hover:from-violet-500 hover:to-purple-500"
          >
            <Plus size={18} />

            <span>Create</span>

            <ArrowRight
              size={16}
              className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            />
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinRoom}
            className="group flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 font-medium text-zinc-200 transition-all hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
          >
            <LogIn size={18} />

            <span>Join</span>

            <ArrowRight
              size={16}
              className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            />
          </motion.button>
        </div>

        {/* Bottom Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Start a collaborative session
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Invite friends, build a shared queue and enjoy synchronized
                playback.
              </p>
            </div>

            <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
              <Users size={20} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default RoomPanel;