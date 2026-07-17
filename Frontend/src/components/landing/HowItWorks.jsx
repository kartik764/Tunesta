import { Music, Users, ListMusic, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Music,
    title: "Create Room",
    description: "Start a music room instantly and become the host.",
  },
  {
    icon: Users,
    title: "Invite Friends",
    description: "Share your room code and let everyone join.",
  },
  {
    icon: ListMusic,
    title: "Build Queue",
    description: "Everyone contributes songs to the shared playlist.",
  },
  {
    icon: Headphones,
    title: "Listen Together",
    description: "Enjoy perfectly synchronized playback in real time.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-6 py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <p className="mb-4 text-violet-400">How It Works</p>

        <h2 className="text-5xl font-bold">
          Music Together in
          <span className="text-violet-500"> 4 Steps</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
          Tunesta makes collaborative music effortless—from creating a room
          to enjoying synchronized playback.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:border-violet-500/30"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
                <Icon size={24} />
              </div>

              <h3 className="mb-3 text-2xl font-semibold">
                {step.title}
              </h3>

              <p className="leading-7 text-zinc-400">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;