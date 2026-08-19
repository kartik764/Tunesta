import { Plus, Play } from "lucide-react";
import { socket } from "../../socket/socket";

export default function AlbumsPanel({
  albums,
  selectedAlbum,
  handleAlbumClick,
  handleSongClick,
  isHost,
  roomId,
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5 px-1 sm:px-2">

      <div>
        <h2 className="mb-4 border-b border-white/5 pb-3 text-xl font-semibold text-white">Albums</h2>

        <div className="grid max-h-[620px] grid-cols-2 gap-4 overflow-y-auto pr-2 sm:grid-cols-3 xl:grid-cols-4">
          {albums.map((album, index) => (
            <button
              key={index}
              onClick={() => handleAlbumClick(album)}
              className={`group overflow-hidden rounded-2xl border bg-white/2 transition duration-300 hover:-translate-y-1 hover:bg-white/5 ${
                selectedAlbum?.title === album.title
                  ? "border-violet-500"
                  : "border-white/10"
              }`}
            >
              <img
                src={
                  album.cover.startsWith("http")
                    ? album.cover
                    : `${import.meta.env.VITE_API_URL}${album.cover}`
                }
                alt={album.title}
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="p-3">
                <p className="truncate font-medium text-white">{album.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedAlbum && (
        <div className="mt-2 pr-1">
          <h2 className="mb-4 border-b border-white/5 pb-3 text-xl font-semibold text-white">Songs</h2>

          <div className="space-y-2">
            {selectedAlbum.songs.map((song, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-white/4 bg-white/2.5 p-3"
              >
                <div>
                  <p className="font-medium text-white">{song.name}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={!isHost}
                    onClick={() => handleSongClick(song)}
                    className="rounded-xl bg-violet-600 p-2 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Play size={16} />
                  </button>

                  <button
                    onClick={() =>
                      socket.emit("add_to_queue", {
                        roomId,
                        song: {
                          name: song.name,
                          path: song.path,
                        },
                      })
                    }
                    className="rounded-xl border border-white/10 p-2 text-white transition hover:bg-white/10"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
