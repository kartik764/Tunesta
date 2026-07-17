import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Music2 } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-5">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl"
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <div className="rounded-xl bg-violet-600 p-2">
            <Music2 size={18} />
          </div>

          <span className="text-xl font-bold tracking-wide">
            Tunesta
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          <a href="#hero" className="transition hover:text-white">
            Home
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#live-room"
            className="transition hover:text-white"
          >
            Live Room
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-white/10 px-5 py-2 text-sm transition hover:bg-white/5"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold transition hover:bg-violet-500"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-7xl rounded-2xl border border-white/10 bg-[#171720] p-5 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-4">
            <a href="#hero">Home</a>
            <a href="#how-it-works">Features</a>
            <a href="#live-room">Live Room</a>

            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-white/10 py-3"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-violet-600 py-3"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;