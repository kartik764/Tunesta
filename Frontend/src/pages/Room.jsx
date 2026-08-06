import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { socket } from "../socket/socket";

import usePlayerState from "../hooks/usePlayerState";
import useMusicRoomSocket from "../hooks/useMusicRoomSocket";

import Playbar from "../components/home/Playbar";
import RoomHeader from "../components/room/RoomHeader";
import QueuePanel from "../components/room/QueuePanel";
import UsersPanel from "../components/room/UsersPanel";
import AlbumsPanel from "../components/room/AlbumsPanel";

// ======================================================
// COMPONENT
// ======================================================

const Room = () => {
  // ====================================================
  // HOOKS
  // ====================================================

  // Custom Hooks
  const {
    songs,
    setSongs,

    currentSong,
    setCurrentSong,

    currentIndex,
    setCurrentIndex,

    isPlaying,
    setIsPlaying,

    duration,
    setDuration,

    currentTime,
    setCurrentTime,

    currentTimeInSeconds,
    setcurrentTimeInSeconds,

    durationInSeconds,
    setdurationInSeconds,

    volume,
    setVolume,

    audioref,

    handleNextButton,
    handlePrevButton,
    muteplaytoggle,
  } = usePlayerState();

  // Routing
  const { roomId } = useParams();
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  // Room
  const [albums, setAlbums] = useState([]);
  const [queue, setQueue] = useState([]);

  // Player
  const [currentSongName, setCurrentSongName] = useState("No Song Playing");

  // UI
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // ====================================================
  // DERIVED VALUES
  // ====================================================

  const token =
    sessionStorage.getItem("tunesta_usertoken") ||
    localStorage.getItem("tunesta_usertoken");

  const username = sessionStorage.getItem("user_email") || "Anonymous";

  // ====================================================
  // SOCKET HOOK
  // ====================================================

  const { users, hostId, isHost, leaveRoom, playSong, pauseSong } =
    useMusicRoomSocket({
      roomId,
      username,
    });

  // =========================
  // ROOM SETUP
  // =========================

  // Fetch Albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/albums`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            return;
          }

          return;
        }

        const data = await res.json();

        setAlbums(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load albums");
      }
    };
    fetchAlbums();
  }, []);

  // Refresh Recovery
  useEffect(() => {
    const savedRoom = sessionStorage.getItem("activeRoom");

    if (savedRoom && roomId !== savedRoom) {
      navigate(`/room/${savedRoom}`);
    }
  }, []);

  // Audio Unlock
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

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // ====================================================
  // SOCKET LISTENERS
  // ====================================================

  // User Left
  useEffect(() => {
    const handleUserLeft = (username) => {
      if (username !== sessionStorage.getItem("user_email")) {
        toast.info(`${username} left the room 👋`);
      }
    };
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("user_left", handleUserLeft);
    };
  }, []);

  // Play
  useEffect(() => {
    const handlePlay = ({ song, time, sentAt }) => {
      if (!audioref.current) {
        return;
      }

      setCurrentSong(song);

      setCurrentSongName(song.name);

      const songPath = song.path.startsWith("http")
        ? song.path
        : `${import.meta.env.VITE_API_URL}${song.path}`;

      audioref.current.src = songPath;

      const latency = (Date.now() - sentAt) / 1000;

      audioref.current.currentTime = time + latency;

      audioref.current.play().then().catch(() => {});

      setIsPlaying(true);
    };

    socket.on("play", handlePlay);

    return () => {
      socket.off("play", handlePlay);
    };
  }, []);

  // Pause
  useEffect(() => {
    const handlePause = ({ time }) => {
      if (!audioref.current) return;

      audioref.current.pause();
      audioref.current.currentTime = time;

      setCurrentTime(time);
      setcurrentTimeInSeconds(time);
      setIsPlaying(false);
    };

    socket.on("pause", handlePause);

    return () => {
      socket.off("pause", handlePause);
    };
  }, []);

  // Seek
  useEffect(() => {
    const handleSeek = ({ time }) => {
      if (!audioref.current) return;

      audioref.current.currentTime = time;

      setCurrentTime(time);
      setcurrentTimeInSeconds(time);
    };

    socket.on("seek", handleSeek);

    return () => {
      socket.off("seek", handleSeek);
    };
  }, []);

  // Volume
  useEffect(() => {
    const handleVolume = (newVolume) => {
      if (!audioref.current) return;

      audioref.current.volume = newVolume;
      setVolume(newVolume);
    };

    socket.on("volume_change", handleVolume);

    return () => {
      socket.off("volume_change", handleVolume);
    };
  }, []);

  // Queue Finished
  useEffect(() => {
    const handleQueueFinished = () => {
      if (audioref.current) {
        audioref.current.pause();
        audioref.current.src = "";
        audioref.current.currentTime = 0;
      }

      setCurrentSong(null);
      setCurrentSongName("No Song Playing");
      setIsPlaying(false);

      setCurrentTime(0);
      setcurrentTimeInSeconds(0);
    };

    socket.on("queue_finished", handleQueueFinished);

    return () => {
      socket.off("queue_finished", handleQueueFinished);
    };
  }, []);

  // Queue Updated
  useEffect(() => {
    const handleQueueUpdated = (updatedQueue) => {
      setQueue(updatedQueue);
    };

    socket.on("queue_updated", handleQueueUpdated);

    return () => {
      socket.off("queue_updated", handleQueueUpdated);
    };
  }, []);

  // Queue Error
  useEffect(() => {
    const handleQueueError = (message) => {
      toast.warning(message);
    };

    socket.on("queue_error", handleQueueError);

    return () => {
      socket.off("queue_error", handleQueueError);
    };
  }, []);

  // Sync State
  useEffect(() => {
    const handleSyncState = ({ song, time, isPlaying, volume, queue }) => {
      if (!audioref.current) return;

      // Queue
      setQueue(queue);

      // Volume
      audioref.current.volume = volume;
      setVolume(volume);

      // Nothing playing
      if (!song) return;

      // Current song
      setCurrentSong(song);
      setCurrentSongName(song.name);

      const songPath = song.path.startsWith("http")
        ? song.path
        : `${import.meta.env.VITE_API_URL}${song.path}`;

      audioref.current.src = songPath;

      // Sync time
      audioref.current.currentTime = time;

      setCurrentTime(time);
      setcurrentTimeInSeconds(time);

      if (isPlaying) {
        audioref.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    socket.on("sync_state", handleSyncState);

    return () => {
      socket.off("sync_state", handleSyncState);
    };
  }, []);

  // ====================================================
  // ROOM ACTIONS
  // ====================================================

  const handleLeaveRoom = () => {
    leaveRoom();

    sessionStorage.removeItem("activeRoom");

    navigate("/home");
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  // ====================================================
  // PLAYBACK
  // ====================================================

  const handleSongClick = (song) => {
    if (!isHost) return;

    playSong({
      song,
      time: 0,
    });
  };

  const handleSongEnded = () => {
    // Local mode
    if (!roomId) {
      handleNextButton();
      return;
    }

    // Room mode
    if (!isHost) return;
    playNextInQueue();
  };

  const playNextInQueue = () => {
    if (!isHost) return;

    socket.emit("play_next", {
      roomId,
    });
  };

  // ====================================================
  // QUEUE
  // ====================================================

  const handleQueueSongClick = (song) => {
    socket.emit("add_to_queue", {
      roomId,
      song,
    });
  };

  const removeFromQueue = (index) => {
    socket.emit("remove_from_queue", {
      roomId,
      index,
    });
  };

  return (
    <div className="min-h-screen bg-[#09090F] text-white">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-6 p-6 pb-36">
        <RoomHeader
          roomId={roomId}
          isHost={isHost}
          currentSongName={currentSongName}
          leaveRoom={handleLeaveRoom}
        />

        <div className="grid flex-1 grid-cols-[280px_minmax(0,1fr)_280px] gap-6">
          <QueuePanel
            queue={queue}
            isHost={isHost}
            playNextInQueue={playNextInQueue}
            removeFromQueue={removeFromQueue}
          />

          <AlbumsPanel
            albums={albums}
            selectedAlbum={selectedAlbum}
            handleAlbumClick={handleAlbumClick}
            handleSongClick={handleSongClick}
            isHost={isHost}
            roomId={roomId}
          />

          <UsersPanel users={users} hostId={hostId} />
        </div>
      </div>

      <Playbar
        songs={songs}
        currentSong={currentSong}
        playSong={playSong}
        pauseSong={pauseSong}
        isplaying={isPlaying}
        audioref={audioref}
        setisplaying={setIsPlaying}
        handleNextButton={handleNextButton}
        handlePrevButton={handlePrevButton}
        handleSongEnded={handleSongEnded}
        duration={duration}
        setDuration={setDuration}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        volume={volume}
        setVolume={setVolume}
        muteplaytoggle={muteplaytoggle}
        currentTimeInSeconds={currentTimeInSeconds}
        setcurrentTimeInSeconds={setcurrentTimeInSeconds}
        durationInSeconds={durationInSeconds}
        setdurationInSeconds={setdurationInSeconds}
        isHost={isHost}
        roomId={roomId}
      />
    </div>
  );
};

export default Room;
