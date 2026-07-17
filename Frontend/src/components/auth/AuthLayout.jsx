import { Music4, Users, Disc3 } from "lucide-react";
import { motion } from "framer-motion";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090F] text-white">
      {/* Background Glow */}
      <div className="absolute -left-30 -top-30 h-105 w-105 rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="absolute -bottom-37.5 -right-25 h-87.5 w-87.5 rounded-full bg-fuchsia-500/10 blur-[120px]" />

      <div className="relative grid min-h-screen lg:grid-cols-[55%_45%]">
        {/* LEFT PANEL */}

        <div className="hidden flex-col justify-center px-16 py-12 lg:flex">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <Disc3 size={16} />
              Tunesta
            </span>

            <h1 className="mt-6 text-6xl font-bold leading-tight">
              Upload.
              <br />
              Stream.
              <br />
              Listen Together.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
              Create albums, upload your favourite songs, build shared queues
              and enjoy synchronized listening with friends in real time.
            </p>
          </motion.div>

          <div className="mt-14 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.5,
              }}
              className="w-85 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <Music4 className="text-violet-400" size={20} />

                <span className="text-sm text-violet-300">Album</span>
              </div>

              <h3 className="text-xl font-semibold">Punjabi Hits</h3>

              <p className="mt-2 text-sm text-zinc-400">25 Songs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="ml-28 w-85 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <Users className="text-violet-400" size={20} />

                <span className="text-sm text-violet-300">Live Room</span>
              </div>

              <h3 className="font-semibold">Room ID : ge23zx</h3>

              <p className="mt-2 text-sm text-zinc-400">
                Now Playing : Baarish
              </p>

              <div className="mt-5 flex -space-x-2">
                {["A", "B", "C", "D"].map((user) => (
                  <div
                    key={user}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#111118] bg-violet-600 text-sm font-semibold"
                  >
                    {user}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
            }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111118]/90 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <h2 className="text-center text-3xl font-bold">{title}</h2>

            <p className="mt-3 text-center text-zinc-400">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
