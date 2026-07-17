import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "../components/auth/AuthLayout";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success(
          "Signup Successful! Welcome to Tunesta 🎵"
        );

        navigate("/login");
      } else {
        toast.error(data.message || "Signup Failed!");
      }
    } catch (e) {
      toast.dismiss(loadingToast);

      toast.error(
        "Something went wrong. Please try again later."
      );

      console.log(e);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Tunesta and start listening together."
    >
      <form
        onSubmit={handleSignup}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-zinc-300">
            <Mail
              size={16}
              className="text-violet-400"
            />
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500"
            required
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-zinc-300">
            <Lock
              size={16}
              className="text-violet-400"
            />
            Create Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500"
            required
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          <UserPlus size={18} />
          Create Account
        </button>

        <p className="pt-2 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;