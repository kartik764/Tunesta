import { motion } from "framer-motion";
import { Menu, LogOut, Music2, Volume2, Sparkles } from "lucide-react";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket";

function Topbar({ handlehamburgerclick, currentSong, roomId }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (roomId) {
      socket.emit("leave_room", roomId);
    }

    socket.disconnect();
    logout();

    toast.info("Logged out successfully 👋");

    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-2xl"
    >
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -left-16 top-0 h-36 w-36 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative flex items-center justify-between px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{
              scale: 1.08,
              rotate: 90,
            }}
            whileTap={{
              scale: 0.94,
            }}
            onClick={handlehamburgerclick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
          >
            <Menu size={20} />
          </motion.button>

          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-violet-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
                Now Playing
              </span>
            </div>

            <div className="mt-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                {currentSong ? <Volume2 size={18} /> : <Music2 size={18} />}
              </div>

              <div>
                <h2 className="max-w-sm truncate text-base font-semibold text-white">
                  {currentSong ? currentSong.name : "No song playing"}
                </h2>

                <p className="text-sm text-zinc-400">
                  {currentSong
                    ? "Streaming with your room"
                    : "Choose a song to begin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Live Badge */}
          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 md:flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live Session
          </motion.div>

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={handleLogout}
            className="group flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
          >
            <LogOut
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />

            <span className="hidden font-medium sm:block">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Topbar;
