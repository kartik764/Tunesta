import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";
import AuthLayout from "../components/auth/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please enter both email and password.");
      return;
    }

    const loadingToast = toast.loading("Logging in...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
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
        toast.success("Welcome to Tunesta! 🎵");

        login(data.user, data.token);

        sessionStorage.setItem(
          "tunesta_usertoken",
          data.token
        );

        sessionStorage.setItem(
          "user_email",
          email
        );

        navigate("/");
      } else {
        toast.error(
          "Check your credentials and try again."
        );
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
      title="Welcome Back"
      subtitle="Sign in to continue listening together."
    >
      <form
        onSubmit={handlelogin}
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
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-zinc-300">
            <Lock
              size={16}
              className="text-violet-400"
            />
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          <LogIn size={18} />
          Log In
        </button>

        <p className="pt-2 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;