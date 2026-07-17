import { useEffect } from "react";

export default function useAudioUnlock(audioref) {
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioref.current) return;

      audioref.current.muted = true;

      audioref.current
        .play()
        .then(() => {
          audioref.current.pause();
          audioref.current.currentTime = 0;
          audioref.current.muted = false;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () =>
      window.removeEventListener("click", unlockAudio);
  }, [audioref]);
}