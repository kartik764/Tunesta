function Seekbar({
  currentTime,
  duration,
  currentTimeInSeconds,
  durationInSeconds,
  handleSeek,
  isListener,
}) {
  const progress =
    durationInSeconds > 0
      ? (currentTimeInSeconds / durationInSeconds) * 100
      : 0;

  return (
    <div className="mb-5">
      <div
        onClick={handleSeek}
        className={`group relative h-1.5 w-full rounded-full bg-white/10 transition ${
          isListener
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        {/* Progress */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-violet-500"
          style={{
            width: `${progress}%`,
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 opacity-0 shadow-lg shadow-violet-500/40 transition group-hover:opacity-100"
          style={{
            left: `calc(${progress}% - 8px)`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}

export default Seekbar;