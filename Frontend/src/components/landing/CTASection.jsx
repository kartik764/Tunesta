import { useNavigate } from "react-router-dom";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="rounded-4xl border border-white/10 bg-linear-to-r from-violet-600/20 to-fuchsia-600/10 px-8 py-20 text-center backdrop-blur-xl">
        <p className="mb-4 text-violet-400">
          Ready to Start?
        </p>

        <h2 className="text-5xl font-bold">
          Listen Together Today
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Build collaborative rooms, create shared queues and experience music
          with your friends in real time.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-10 rounded-xl bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
}

export default CTASection;