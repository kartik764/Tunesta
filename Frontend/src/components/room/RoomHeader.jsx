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
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111118]/80 p-4 shadow-xl shadow-black/20 backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute -left-16 top-0 h-36 w-36 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-4 sm:gap-6">
        <div className="flex min-w-0 flex-wrap items-center gap-5 sm:gap-8">
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
          className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          Leave Room
        </button>
      </div>
    </div>
  );
}