import { Crown, Copy, LogOut, Music2 } from "lucide-react";
import { toast } from "react-toastify";

export default function RoomHeader({
  roomId,
  isHost,
  currentSongName,
  leaveRoom,
}) {
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch {
      toast.error("Failed to copy Room ID");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-8">
          {/* Host */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
              <Crown size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Host
              </p>

              <h2 className="text-lg font-semibold text-white">
                {isHost ? "You" : "Participant"}
              </h2>
            </div>
          </div>

          {/* Room */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
              #
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Room ID
              </p>

              <div className="mt-1 flex items-center gap-3">
                <span className="text-lg font-semibold text-white">
                  {roomId}
                </span>

                <button
                  onClick={copyRoomId}
                  className="rounded-lg border border-violet-500/20 p-2 text-violet-400 transition hover:bg-violet-500/10"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Song */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
              <Music2 size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Now Playing
              </p>

              <p className="text-lg font-semibold text-white">
                {currentSongName}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={leaveRoom}
          className="flex items-center gap-2 rounded-2xl bg-red-500/15 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/25"
        >
          <LogOut size={18} />
          Leave Room
        </button>
      </div>
    </div>
  );
}