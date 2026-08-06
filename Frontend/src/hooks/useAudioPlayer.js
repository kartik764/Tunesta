import { useEffect } from "react";

export default function useAudioPlayer({
  audioref,
  currentSong,
  isPlaying,
  volume,
}) {
  // Effect 1 — Load a new song
  useEffect(() => {

    if (!audioref.current || !currentSong) return;

    const src = currentSong.path.startsWith("http")
      ? currentSong.path
      : `${import.meta.env.VITE_API_URL}${currentSong.path}`;

    if (audioref.current.src !== src) {
      audioref.current.src = src;
      audioref.current.load();
    }
  }, [currentSong]);

  // Effect 2 — Play / Pause
  useEffect(() => {

    if (!audioref.current) return;

    if (isPlaying) {
      audioref.current
        .play()
        .then(() => console.log("Play success"))
        .catch((err) => console.error("Play failed", err));
    } else {
      audioref.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Effect 3 — Volume
  useEffect(() => {
    if (!audioref.current) return;

    audioref.current.volume = volume;
  }, [volume, audioref]);
}
