import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Users,
  Music2,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row"
    >
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
          <Music2 size={16} />
          Real-Time Collaborative Music
        </div>

        <h1 className="text-5xl font-black leading-tight md:text-7xl">
          Listen
          <span className="text-violet-500"> Together.</span>
          <br />
          Anywhere.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
          Create collaborative music rooms, build shared queues and enjoy
          perfectly synchronized playback with friends across the world.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
          >
            Get Started
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 transition hover:bg-white/5"
          >
            <PlayCircle size={18} />
            Explore
          </button>
        </div>

        <div className="mt-14 flex flex-wrap gap-5">
          {[
            ["120+", "Active Rooms"],
            ["10K+", "Songs"],
            ["500+", "Users"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl"
            >
              <h2 className="text-3xl font-bold">{value}</h2>
              <p className="mt-1 text-sm text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 justify-center"
      >
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#171720]/80 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold">Now Playing</h3>
            <Users size={18} className="text-violet-400" />
          </div>

          <div className="mb-6 flex aspect-square items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-600 text-6xl">
            🎵
          </div>

          <h2 className="text-2xl font-bold">Midnight City</h2>
          <p className="text-zinc-400">M83</p>

          <div className="mt-6 h-2 rounded-full bg-zinc-700">
            <div className="h-full w-2/3 rounded-full bg-violet-500"></div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6">
            <button className="rounded-full bg-violet-600 p-4 transition hover:scale-110 hover:bg-violet-500">
              <Play fill="white" size={20} />
            </button>
          </div>

          <div className="mt-8">
            <h4 className="mb-3 font-semibold">Shared Queue</h4>

            {[
              "Blinding Lights",
              "Heat Waves",
              "Sunflower",
            ].map((song) => (
              <div
                key={song}
                className="mb-3 rounded-xl bg-white/5 px-4 py-3 text-zinc-300"
              >
                {song}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;