function WelcomeBanner() {
  const email = sessionStorage.getItem("user_email") || "User";

  return (
    <div className="mb-10 rounded-3xl bg-linear-to-r from-violet-600/20 to-fuchsia-600/10 p-8">
      <p className="text-violet-400">
        Welcome Back 👋
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        {email.split("@")[0]}
      </h1>

      <p className="mt-3 max-w-xl text-zinc-400">
        Continue listening, upload new tracks or create a room with your friends.
      </p>
    </div>
  );
}

export default WelcomeBanner;