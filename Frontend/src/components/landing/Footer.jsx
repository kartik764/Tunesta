import { Music2 } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-2">
            <Music2 size={18} />
          </div>

          <div>
            <h2 className="font-bold text-xl">Tunesta</h2>
            <p className="text-sm text-zinc-400">
              Collaborative Music Streaming
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-zinc-400">
          <a href="#hero" className="hover:text-white">
            Home
          </a>

          <a href="#how-it-works" className="hover:text-white">
            Features
          </a>

          <a href="#live-room" className="hover:text-white">
            Live Room
          </a>
        </div>

        <p className="text-sm text-zinc-500">
          © 2026 Tunesta
        </p>
      </div>
    </footer>
  );
}
export default Footer;