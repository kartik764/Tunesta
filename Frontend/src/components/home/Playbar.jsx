// Imports
import SongInfo from "./playbar/SongInfo";
import PlaybackControls from "./playbar/PlaybackControls";
import Seekbar from "./playbar/Seekbar";
import VolumeControl from "./playbar/VolumeControl";

// Hook
import usePlaybar from "../../hooks/usePlaybar";

// Socket
import { socket } from "../../socket/socket";

const Playbar = ({
  currentSong,
  playSong,
  pauseSong,
  isPlaying,
  audioref,
  setisPlaying,
  handleNextButton,
  handlePrevButton,
  duration,
  setDuration,
  currentTime,
  setCurrentTime,
  volume,
  setVolume,
  muteplaytoggle,
  currentTimeInSeconds,
  setcurrentTimeInSeconds,
  durationInSeconds,
  setdurationInSeconds,
  isHost,
  roomId,
  handleSongEnded,
}) => {
  // =========================
  // PLAYBAR HOOK
  // =========================

  const { isListener, handleSeek } = usePlaybar({
    audioref,
    roomId,
    isHost,
    volume,
    setDuration,
    setCurrentTime,
    setcurrentTimeInSeconds,
    setdurationInSeconds,
  });

  return (
    <div className="sticky bottom-0 mt-6 rounded-3xl border border-white/10 bg-[#111118]/90 backdrop-blur-2xl px-6 py-5">
      <Seekbar
        currentTime={currentTime}
        duration={duration}
        currentTimeInSeconds={currentTimeInSeconds}
        durationInSeconds={durationInSeconds}
        handleSeek={handleSeek}
        isListener={isListener}
      />

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-1/3">
          <SongInfo currentSong={currentSong} />
        </div>

        <div className="flex justify-center lg:w-1/3">
          <PlaybackControls
            roomId={roomId}
            isHost={isHost}
            playSong={playSong}
            pauseSong={pauseSong}
            currentSong={currentSong}
            isPlaying={isPlaying}
            audioref={audioref}
            setisPlaying={setisPlaying}
            handlePrevButton={handlePrevButton}
            handleNextButton={handleNextButton}
          />
        </div>

        <div className="flex justify-end lg:w-1/3">
          <VolumeControl
            volume={volume}
            setVolume={setVolume}
            muteplaytoggle={muteplaytoggle}
            roomId={roomId}
            isHost={isHost}
            isListener={isListener}
            socket={socket}
          />
        </div>
      </div>

      {roomId && (
        <div className="mt-4 flex items-center justify-center">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isHost
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {isHost ? `Host • Room ${roomId}` : `Listening in Room ${roomId}`}
          </span>
        </div>
      )}

      <audio ref={audioref} onEnded={handleSongEnded} />
    </div>
  );
};

export default Playbar;
