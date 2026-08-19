import { Trash2, ListMusic, Play } from "lucide-react";

export default function QueuePanel({
  queue,
  isHost,
  playNextInQueue,
  removeFromQueue,
}) {
  return (
    <div className="flex min-w-0 flex-col px-1 sm:px-2">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <ListMusic className="text-violet-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Queue</h2>
        </div>

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
          {queue.length}
        </span>
      </div>

      <div className="mt-2 space-y-3 pr-2">
        {queue.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/5 bg-white/[0.015] py-7 text-center text-sm text-zinc-500">
            Queue is empty
          </div>
        ) : (
          queue.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.025] p-3 transition hover:bg-white/[0.06]"
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
