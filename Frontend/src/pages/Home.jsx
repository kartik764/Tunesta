import React, { useState } from "react";

import Sidebar from "../components/home/Sidebar";
import Maincontent from "../components/home/Maincontent";
import Playbar from "../components/home/Playbar";
import FileModal from "../components/home/FileModal";
import CursorGlow from "../components/home/CursorGlow";
import Topbar from "../components/home/Topbar";

import usePlayerState from "../hooks/usePlayerState";
import useAlbums from "../hooks/useAlbums";
import useAudioUnlock from "../hooks/useAudioUnlock";
import useAudioPlayer from "../hooks/useAudioPlayer";
import useSearch from "../hooks/useSearch";
import useRoom from "../hooks/useRoom";
import useAlbumPlayer from "../hooks/useAlbumPlayer";

const Home = () => {
  /* =========================
     UI
  ========================= */

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  /* =========================
     Albums
  ========================= */

  const { albums, fetchAlbums } = useAlbums();

  const { query, setQuery, filteredAlbums } = useSearch(albums);

  /* =========================
     Rooms
  ========================= */

  const {
    roomInput,
    setRoomInput,
    handleCreateRoom,
    handleJoinRoom,
  } = useRoom();

  /* =========================
     Player State
  ========================= */

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

  /* =========================
     Custom Hooks
  ========================= */

  useAudioUnlock(audioref);

  useAudioPlayer({
    audioref,
    currentSong,
    isPlaying,
    volume,
  });

  const { handleAlbumClick, handleSongClick } = useAlbumPlayer({
    setSongs,
    setCurrentSong,
    setCurrentIndex,
    setIsPlaying,
  });

  /* =========================
     UI
  ========================= */

  return (
    <>
      <FileModal
        isUploadOpen={isUploadOpen}
        handleCloseUpload={() => setIsUploadOpen(false)}
        fetchalbums={fetchAlbums}
      />

      <CursorGlow />

      <div className="container flex">
        <div className={`left ${isMenuOpen ? "sidebaropen" : ""}`}>
          <Sidebar
            songs={songs}
            handlesongclick={handleSongClick}
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
          <Topbar
            handlehamburgerclick={() => setIsMenuOpen(true)}
            currentSong={currentSong}
          />

          <Maincontent
            albums={filteredAlbums}
            handleAlbumClick={handleAlbumClick}
            query={query}
            setQuery={setQuery}
            isSearchMode={isSearchMode}
          />

          <div className="playbar">
            <Playbar
              songs={songs}
              isPlaying={isPlaying}
              currentSong={currentSong}
              audioref={audioref}
              setisPlaying={setIsPlaying}
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
    </>
  );
};

export default Home;