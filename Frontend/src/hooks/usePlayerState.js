import { useState, useRef } from "react";

const usePlayerState = () => {
  // =========================
  // 🔹 PLAYER STATES
  // =========================

  const [songs, setSongs] = useState([]);

  const [isplaying, setIsPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentsong, setCurrentSong] = useState(null);

  // =========================
  // 🔹 TIME STATES
  // =========================

  const [duration, setDuration] = useState("00:00");

  const [currentTime, setCurrentTime] = useState("00:00");

  const [currentTimeInSeconds, setcurrentTimeInSeconds] = useState(0);

  const [durationInSeconds, setdurationInSeconds] = useState(0);

  // =========================
  // 🔹 AUDIO STATES
  // =========================

  const [volume, setVolume] = useState(1);

  const audioref = useRef(null);

  // =========================
  // 🔹 PLAYER FUNCTIONS
  // =========================

  const handleNextButton = () => {
    if (songs.length === 0) return;

    const nextIndex = (currentIndex + 1) % songs.length;

    const nextSong = songs[nextIndex];

    setCurrentIndex(nextIndex);

    setCurrentSong(nextSong);

    setIsPlaying(true);
  };

  const handlePrevButton = () => {
    if (songs.length === 0) return;

    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;

    const prevSong = songs[prevIndex];

    setCurrentIndex(prevIndex);

    setCurrentSong(prevSong);

    setIsPlaying(true);
  };

  const muteplaytoggle = (roomId = null, socket = null) => {
    const newVolume = volume === 0 ? 1 : 0;

    setVolume(newVolume);

    // 🔥 sync room volume
    if (roomId && socket) {
      socket.emit("volume_change", newVolume);
    }
  };

  // =========================
  // 🔹 RETURN EVERYTHING
  // =========================

  return {
    // SONGS
    songs,
    setSongs,

    currentsong,
    setCurrentSong,

    currentIndex,
    setCurrentIndex,

    // PLAYBACK
    isplaying,
    setIsPlaying,

    // TIME
    duration,
    setDuration,

    currentTime,
    setCurrentTime,

    currentTimeInSeconds,
    setcurrentTimeInSeconds,

    durationInSeconds,
    setdurationInSeconds,

    // AUDIO
    volume,
    setVolume,

    audioref,

    // FUNCTIONS
    handleNextButton,
    handlePrevButton,
    muteplaytoggle,
  };
};

export default usePlayerState;
