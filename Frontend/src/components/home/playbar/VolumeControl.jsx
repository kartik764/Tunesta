import { Volume2, VolumeX } from "lucide-react";

function VolumeControl({
  volume,
  setVolume,
  muteplaytoggle,
  roomId,
  isHost,
  isListener,
  socket,
}) {
  
  // ====================================================
  // ACTIONS
  // ====================================================
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);

    if (roomId && !isHost) return;

    setVolume(vol);

    if (roomId) {
      socket.emit("volume_change", {
        roomId,
        volume: vol,
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={muteplaytoggle}
        disabled={isListener}
        className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        disabled={isListener}
        onChange={handleVolumeChange}
        className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-500 sm:w-28 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

export default VolumeControl;
