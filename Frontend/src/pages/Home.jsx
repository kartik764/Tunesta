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

  const { roomInput, setRoomInput, handleCreateRoom, handleJoinRoom } =
    useRoom();

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

      {/* Whole page scrolls */}
      <div className="min-h-screen w-full overflow-x-hidden">
        {/* Fixed sidebar */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"} absolute top-0 left-0 z-40 w-80 max-w-[86vw] shadow-2xl shadow-black/40 lg:z-20 lg:block lg:w-80 lg:max-w-none lg:shadow-none`}
        >
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

        {/* Main page content */}
        <div className="min-w-0 lg:ml-80">
          <div className="overflow-x-hidden p-3 sm:p-5 lg:p-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
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

              <div className="w-full rounded-xl">
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
        </div>

        {/* Playbar is now part of normal page flow */}
        {/* <div className="w-screen">
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
        </div> */}
      </div>
    </>
  );
};

export default Home;
