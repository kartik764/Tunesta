import Maincontent from "../components/Maincontent";
import { useNavigate } from "react-router-dom";
import Playbar from "../components/Playbar";
import Sidebar from "../components/Sidebar";
import FileModal from "../components/FileModal";
import CursorGlow from "../components/Mousemove";
import usePlayerState from "../hooks/usePlayerState";
import React, { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  // =========================
  // 🔹 BASIC STATES
  // =========================
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [roomInput, setRoomInput] = useState("");

  const {
    songs,
    setSongs,

    currentsong,
    setCurrentSong,

    currentIndex,
    setCurrentIndex,

    isplaying,
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

  // =========================
  // 🔹 UI STATES
  // =========================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // =========================
  // 🔹 FILTER ALBUMS
  // =========================
  const filteredAlbums = (albums || []).filter((album) => {
    const searchText = query.toLowerCase();
    return (
      album.title.toLowerCase().includes(searchText) ||
      album.songs.some((song) => song.name.toLowerCase().includes(searchText))
    );
  });

  // =========================
  // 🔹 FETCH ALBUMS
  // =========================
  const fetchalbums = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/albums`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("tunesta_usertoken")}`,
        },
      });

      if (!res.ok) {
        console.log("❌ Album fetch failed:", res.status);
        return;
      }

      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.log("🚨 Backend not reachable yet...");
    }
  };

  useEffect(() => {
    fetchalbums();
  }, []);

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

          console.log("🔓 Audio unlocked");
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  // =========================
  // 🔹 APPLY VOL TO AUDIO
  // =========================
  useEffect(() => {
    if (audioref.current) {
      audioref.current.volume = volume;
    }
  }, [volume]);

  // LOCAL PLAYER
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
  }, [isplaying, currentsong]);

  // =========================
  // 🔹 ROOM ACTIONS
  // =========================
  const handleCreateRoom = () => {
    const roomCode = Math.random().toString(36).substring(2, 8);

    navigate(`/room/${roomCode}`);
    sessionStorage.setItem("activeRoom", roomCode);
    setRoomInput("");
  };

  const handleJoinRoom = () => {
    if (!roomInput) return alert("Enter room ID");

    navigate(`/room/${roomInput}`);
    sessionStorage.setItem("activeRoom", roomInput);
    setRoomInput("");
  };

  // =========================
  // 🔹 SONG HANDLERS
  // =========================
  const handleAlbumClick = (album) => {
    if (!album.songs.length) return;

    const song = album.songs[0];

    setSongs(album.songs);
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentIndex(0);
  };

  const handlesongclick = (song, index) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentIndex(index);
  };

  // =========================
  // 🔹 UI
  // =========================
  return (
    <>
      <FileModal
        isUploadOpen={isUploadOpen}
        handleCloseUpload={() => setIsUploadOpen(false)}
        fetchalbums={fetchalbums}
      />

      <CursorGlow />

      <div className="container flex">
        <div className={`left ${isMenuOpen ? "sidebaropen" : ""}`}>
          <Sidebar
            songs={songs}
            handlesongclick={handlesongclick}
            handleclosebutton={() => setIsMenuOpen(false)}
            handleOpenUpload={() => setIsUploadOpen(true)}
            setIsSearchMode={setIsSearchMode}
            isSearchMode={isSearchMode}
            roomInput={roomInput}
            setRoomInput={setRoomInput}
            handleCreateRoom={handleCreateRoom}
            handleJoinRoom={handleJoinRoom}
          />
        </div>

        <div className="right">
          <Maincontent
            albums={filteredAlbums}
            handleAlbumClick={handleAlbumClick}
            handlehamburgerclick={() => setIsMenuOpen(true)}
            query={query}
            setQuery={setQuery}
            isSearchMode={isSearchMode}
            currentsong={currentsong}
          />

          <div className="playbar">
            <Playbar
              songs={songs}
              isplaying={isplaying}
              currentsong={currentsong}
              audioref={audioref}
              setisplaying={setIsPlaying}
              handleNextButton={handleNextButton}
              handlePrevButton={handlePrevButton}
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
            />
          </div>
        </div>
      </div>
      <audio ref={audioref} />
    </>
  );
};

export default Home;
