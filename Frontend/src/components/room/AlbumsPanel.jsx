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
    <div className="flex h-[calc(100vh-250px)] flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#111118]/80 p-6 backdrop-blur-xl">

      <div>
        <h2 className="mb-5 text-xl font-semibold text-white">Albums</h2>

        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {albums.map((album, index) => (
            <button
              key={index}
              onClick={() => handleAlbumClick(album)}
              className={`group overflow-hidden rounded-2xl border transition ${
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
        <div className="flex-1 overflow-y-auto">
          <h2 className="mb-4 text-xl font-semibold text-white">Songs</h2>

          <div className="space-y-3">
            {selectedAlbum.songs.map((song, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4"
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
