function WelcomeBanner() {
  const email = sessionStorage.getItem("user_email") || "User";

  return (
    <div className="rounded-3xl bg-linear-to-r from-violet-600/20 to-fuchsia-600/10 px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-violet-400">
        Welcome Back 👋
      </p>

      <h1 className="mt-1 break-words text-3xl font-bold sm:text-4xl">
        {email.split("@")[0]}
      </h1>

      <p className="mt-1 max-w-xl text-zinc-400">
        Continue listening, upload new tracks or create a room with your friends.
      </p>
    </div>
  );
}

export default WelcomeBanner;
