export default function useAlbumPlayer({
  setSongs,
  setCurrentSong,
  setCurrentIndex,
  setIsPlaying,
}) {
  const handleAlbumClick = (album) => {
    if (!album?.songs?.length) return;

    setSongs(album.songs);
    setCurrentSong(album.songs[0]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const handleSongClick = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  return {
    handleAlbumClick,
    handleSongClick,
  };
}