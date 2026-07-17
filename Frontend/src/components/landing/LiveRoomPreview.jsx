import { useNavigate } from "react-router-dom";
import { Users, Music2, Play } from "lucide-react";
import { motion } from "framer-motion";

function LiveRoomPreview() {
  const navigate = useNavigate();

  return (
    <section
      id="live-room"
      className="mx-auto grid max-w-7xl gap-14 px-6 py-28 lg:grid-cols-2"
    >
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <p className="mb-4 text-violet-400">Live Rooms</p>

        <h2 className="text-5xl font-bold leading-tight">
          Music is better
          <span className="text-violet-500"> together.</span>
        </h2>

        <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
          Create rooms, invite friends, build a shared queue and listen in
          perfect sync.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-10 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
        >
          Create Your Room
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Room</p>
            <h3 className="text-xl font-bold">GE23ZX</h3>
          </div>

          <div className="rounded-xl bg-violet-600 p-3">
            <Users />
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 p-8">
          <Music2 size={60} />
          <h3 className="mt-5 text-2xl font-bold">Baarish</h3>
          <p className="text-violet-100">Now Playing</p>
        </div>

        <button className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 transition hover:bg-violet-500">
          <Play size={18} fill="white" />
          Play
        </button>

        <div className="space-y-3">
          {["Baarish", "Dil Se", "Nazm Nazm", "Jogi"].map((song) => (
            <div
              key={song}
              className="rounded-xl bg-white/5 px-4 py-3 text-zinc-300"
            >
              {song}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default LiveRoomPreview;