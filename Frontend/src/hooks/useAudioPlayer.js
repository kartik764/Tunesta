import { useEffect } from "react";

export default function useAudioPlayer({
  audioref,
  currentsong,
  isplaying,
  volume,
}) {
  // Sync volume
  useEffect(() => {
    if (!audioref.current) return;

    audioref.current.volume = volume;
  }, [volume, audioref]);

  // Load & play current song
  useEffect(() => {
    if (!audioref.current || !currentsong) return;

    const src = currentsong.path.startsWith("http")
      ? currentsong.path
      : `${import.meta.env.VITE_API_URL}${currentsong.path}`;

    if (audioref.current.src !== src) {
      audioref.current.src = src;
    }

    if (isplaying) {
      audioref.current.play().catch(() => {});
    } else {
      audioref.current.pause();
    }
  }, [currentsong, isplaying, audioref]);
}