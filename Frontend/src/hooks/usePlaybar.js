import { useEffect } from "react";
import { socket } from "../socket";

const usePlaybar = ({
  audioref,
  roomId,
  isHost,
  volume,
  setDuration,
  setCurrentTime,
  setcurrentTimeInSeconds,
  setdurationInSeconds,
  handleNextButton,
}) => {
  const isRoomMode = !!roomId;
  const isListener = isRoomMode && !isHost;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");

    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const audio = audioref.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
      setdurationInSeconds(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setcurrentTimeInSeconds(audio.currentTime);
    };

    const onEnded = () => {
      // Local Mode
      if (!roomId) {
        handleNextButton();
        return;
      }

      // Listener cannot control playback
      if (!isHost) return;

      socket.emit("play_next", roomId);
    };

    audio.addEventListener(
      "loadedmetadata",
      onLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      onTimeUpdate
    );

    audio.addEventListener(
      "ended",
      onEnded
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        onLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        onTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        onEnded
      );
    };
  }, [handleNextButton]);

  useEffect(() => {
    if (!audioref.current) return;

    audioref.current.volume = volume;
  }, [volume]);

  const handleSeek = (e) => {
    if (isListener) return;

    if (
      !audioref.current ||
      audioref.current.duration <= 0
    )
      return;

    const seekbar = e.currentTarget;

    const rect = seekbar.getBoundingClientRect();

    const clickPosition = e.clientX - rect.left;

    const percentage =
      clickPosition / seekbar.offsetWidth;

    const newTime =
      percentage * audioref.current.duration;

    audioref.current.currentTime = newTime;

    if (roomId && isHost) {
      socket.emit("seek", {
        roomId,
        time: newTime,
      });
    }
  };

  return {
    isListener,
    handleSeek,
  };
};

export default usePlaybar;