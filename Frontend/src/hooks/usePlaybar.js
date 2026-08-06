import { useEffect } from "react";
import { socket } from "../socket/socket";

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
  // DERIVED VALUES
  const isRoomMode = !!roomId;
  const isListener = isRoomMode && !isHost;

  // HELPERS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");

    return `${mins}:${secs}`;
  };

  // AUDIO EVENTS
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

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);

      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [audioref]);

  // AUDIO SETTINGS
  useEffect(() => {
    if (!audioref.current) return;

    audioref.current.volume = volume;
  }, [volume]);

  // ACTIONS
  const handleSeek = (e) => {
    if (isListener) return;

    if (!audioref.current || audioref.current.duration <= 0) return;

    const seekbar = e.currentTarget;

    const rect = seekbar.getBoundingClientRect();

    const clickPosition = e.clientX - rect.left;

    const percentage = clickPosition / seekbar.offsetWidth;

    const newTime = percentage * audioref.current.duration;

    audioref.current.currentTime = newTime;

    if (roomId && isHost) {
      socket.emit("seek", {
        roomId,
        time: newTime,
      });
    }
  };

  // RETURNS
  return {
    isListener,
    handleSeek,
  };
};

export default usePlaybar;
