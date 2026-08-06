import { Trash2, ListMusic, Play } from "lucide-react";

export default function QueuePanel({
  queue,
  isHost,
  playNextInQueue,
  removeFromQueue,
}) {
  return (
    <div className="flex h-[calc(100vh-250px)] flex-col rounded-3xl border border-white/10 bg-[#111118]/80 p-5 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="text-violet-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Queue</h2>
        </div>

        <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-300">
          {queue.length}
        </span>
      </div>

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto pr-2">
        {queue.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-zinc-500">
            Queue is empty
          </div>
        ) : (
          queue.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white">
                  {index + 1}. {song.name}
                </p>
              </div>

              {isHost && (
                <button
                  onClick={() => removeFromQueue(index)}
                  className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isHost && (
        <button
          onClick={playNextInQueue}
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3 font-medium text-white transition hover:bg-violet-500"
        >
          <Play size={18} />
          Play Queue
        </button>
      )}
    </div>
  );
}
