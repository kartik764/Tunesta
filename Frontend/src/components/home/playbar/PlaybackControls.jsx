import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";

function PlaybackControls({
  roomId,
  isHost,
  currentsong,
  isplaying,
  audioref,
  setisplaying,
  handlePrevButton,
  handleNextButton,
  socket,
}) {
  const handlePrevious = () => {
    // LOCAL MODE
    if (!roomId) {
      handlePrevButton();
      return;
    }

    // ROOM MODE
    if (!isHost) return;

    handlePrevButton();
  };

  const handleNext = () => {
    // LOCAL MODE
    if (!roomId) {
      handleNextButton();
      return;
    }

    // ROOM MODE
    if (!isHost) return;

    handleNextButton();
  };

  const handlePlayPause = () => {
    if (!currentsong) return;

    // LOCAL MODE
    if (!roomId) {
      if (!audioref.current) return;

      if (isplaying) {
        audioref.current.pause();
        setisplaying(false);
      } else {
        audioref.current.play().catch(() => {});
        setisplaying(true);
      }

      return;
    }

    // ROOM MODE
    if (!isHost) return;

    if (isplaying) {
      socket.emit("pause", {
        roomId,
        time: audioref.current.currentTime,
      });
    } else {
      socket.emit("play", {
        roomId,
        song: currentsong,
        time: audioref.current.currentTime,
        sentAt: Date.now(),
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={handlePrevious}
        disabled={roomId && !isHost}
        className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SkipBack size={22} />
      </button>

      <button
        onClick={handlePlayPause}
        disabled={!currentsong || (roomId && !isHost)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 transition hover:scale-105 hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isplaying ? (
          <Pause
            size={24}
            fill="currentColor"
          />
        ) : (
          <Play
            size={24}
            fill="currentColor"
            className="ml-1"
          />
        )}
      </button>

      <button
        onClick={handleNext}
        disabled={roomId && !isHost}
        className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SkipForward size={22} />
      </button>
    </div>
  );
}

export default PlaybackControls;