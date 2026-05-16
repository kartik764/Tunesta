import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import "./Style.css";
import "./Utility.css";

const Playbar = ({
  songs,
  isplaying,
  currentsong,
  audioref,
  setisplaying,
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
}) => {
  const isRoomMode = !!roomId;
  const isListener = isRoomMode && !isHost;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }

    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    mins = String(mins).padStart(2, "0");
    secs = String(secs).padStart(2, "0");

    return `${mins}:${secs}`;
  };

  // We could also write the function directly without using the useEffect hook, but the main fact is that when the audioref get's connected to our audio player(DVD player), then only we wanted this function to work that's why it is imp to use this useEffect hook.

  // loadedmetadata and the timeupdate are two event listeners that helps us to access the data like the duration, time, dimensions and majorily they are used for the audio and the video tags of the HTML.

  // The loadedmetadata tells us that when the enough data is loaded to know the duration this event get's fired and the function inside it starts working and the timeupdate event listener regularly get's fired when the time changes, and all these time would come in seconds so we have customised a function name formaTime which helps us to convert that seconds in to the format which is usually used in the music players.

  // This durationinseconds and currentTimein seconds we are calculating it just to move our circle because, in this useeffect hook that is below, we are direcly setting the duration in the formattedtime and that is a string so if we have to move our circle we cannot divide the currenttime with duration in string, therfore we are also setting them in seconds just for that.

  // If we want that next songs plays when the current song ends, then we have to make sure that in this useffect hook the one dependency should be handlenextbutton also, because in the hook itself we have added an event listener 'ended' that will se that if the current song is ended it will call the handlenextbutto() function.

  // Till the time the dependency was audioref, this useeffect hook was running only for one time just only when the playbar component was rendering in the start, and in that render we have made event listener's like the timeupdate, which internally was changing the currenttime and duration states, which made the app.jsx component to again render but the fact was that this useffect hook was not running at that time because it had only the dependency of the audioref and by the state changes the audioref was not changing. So the error was that in this useeffect hook the currentindex was being at 0 only when outside this hook the currentindex was changing so because of which when the currentsong ends it was having the currentindex as 0 and thereby the next song was not playing, so as the rectification to this problem was just to add another dependency of the handlenextbutton also that is making this hook to again and again run when the song changes.

  useEffect(() => {
    const audio = audioref.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
      setdurationInSeconds(audio.duration);
    };

    console.log("⏱ time:", audioref.current.currentTime);
    const onTimeUpdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setcurrentTimeInSeconds(audio.currentTime);
    };

    const onEnded = () => {
      // LOCAL MODE
      if (!roomId) {
        handleNextButton();
        return;
      }

      // ROOM MODE
      if (!isHost) return;

      // play next queued song
      socket.emit("play_next", roomId);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    // 🔥 VERY IMPORTANT CLEANUP
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [handleNextButton]);

  useEffect(() => {
    if (!audioref.current) return;

    audioref.current.volume = volume;
  }, [volume]);

  // e is a special object that gives information about the click.
  // We don't have to remember the functions, only the thing we have to remember is the logic that is:
  // on how much percentage on the seekbar we are clicking, so for that we have to calculate the width
  // on which we clicked on the seekbar / the total offsetwidth of the seekbar: This will give us the
  // percentage and when we will multiply that percentage with the duration it will give us the exact
  // seconds on which we have to go and then we can eaisly pass them in to our respective functions
  // to update the respective states.

  const handleseek = (e) => {
    // 🔥 BLOCK LISTENER
    if (isListener) return;

    if (audioref.current && audioref.current.duration > 0) {
      // 1. This would give us the div element of the seekbar.
      const seekbar = e.currentTarget;

      // 2. Calculation of how much this div element left edge is far from the screen's left edge.
      const faraway = seekbar.getBoundingClientRect().left;

      // 3. Calculation of where the click happened. here clientX is a property of the click which tells us the exact horizontal position where the click happened, Therefore by subtracting them we got to know that click position w.r.t to the left of the seekbar.
      const clickPosition = e.clientX - faraway;

      // 4. Calculation of the seekpercentage
      const seekpercentage = clickPosition / seekbar.offsetWidth;

      // 5. Calculation of the time corresponding to this percentage and assigining it to the currenTime
      const newTime = seekpercentage * audioref.current.duration;

      //SET TIME
      audioref.current.currentTime = newTime;

      // 🔥 SYNC ONLY IF HOST
      if (roomId && isHost) {
        socket.emit("seek", {
          roomId,
          time: newTime,
        });
      }
    }
  };

  return (
    <>
      <div>
        <div
          className="seekbar"
          onClick={handleseek}
          style={{
            pointerEvents: isListener ? "none" : "auto",
            opacity: isListener ? 0.6 : 1,
          }}
        >
          <div
            className="circle"
            style={{
              left:
                audioref.current && duration != "00:00"
                  ? `${(currentTimeInSeconds / durationInSeconds) * 100}%`
                  : `0%`,
            }}
          ></div>
        </div>

        <div className="abovebar">
          <div className="songinfo">
            {currentsong ? currentsong.name : "Select an Album"}
          </div>
          <div className="songbuttons">
            <img
              width="35"
              id="previous"
              src="/img/previoussong.svg"
              alt="previoussong"
              onClick={() => {
                // ✅ LOCAL MODE
                if (!roomId) {
                  handlePrevButton();
                  return;
                }

                // ✅ ROOM MODE
                if (!isHost) return;

                handlePrevButton();
              }}
            />
            <img
              width="35"
              id="play"
              src={isplaying ? "/img/pausesong.svg" : "/img/playsong.svg"}
              alt="play-pause"
              onClick={() => {
                if (!currentsong) return;

                //LOCAL MODE
                if (!roomId) {
                  if (!audioref.current) return;

                  if (isplaying) {
                    audioref.current.pause();
                    setisplaying(false);
                  } else {
                    audioref.current.play().catch(() => {});
                    setisplaying(true);
                  }
                  return;
                }

                //ROOM MODE
                if (!isHost) return;

                if (isplaying) {
                  socket.emit("pause", {
                    roomId,
                    time: audioref.current.currentTime,
                  });
                } else {
                  socket.emit("play", {
                    roomId,
                    song: currentsong,
                    time: audioref.current.currentTime,
                    sentAt: Date.now(),
                  });
                }
              }}
            />
            <img
              width="35"
              id="next"
              src="/img/nextsong.svg"
              alt="nextsong"
              onClick={() => {
                if (!roomId) {
                  handleNextButton();
                  return;
                }

                if (!isHost) return;

                handleNextButton();
              }}
            />
          </div>
          <div className="timeandvolume">
            <div className="songtime">
              {currentTime}/{duration}
            </div>

            <div className="volume">
              <img
                src={
                  volume === 0 ? "/img/volume-mute.svg" : "/img/volume-on.svg"
                }
                onClick={() => muteplaytoggle()}
                alt="volume-on"
              />
              <div className="range">
                <input
                  type="range"
                  name="vou"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  disabled={isListener}
                  onChange={(e) => {
                    // if (!isHost) return;
                    const vol = parseFloat(e.target.value);

                    // 🔥 LOCAL MODE
                    if (!roomId) {
                      setVolume(vol);
                      return;
                    }

                    // 🔥 ROOM MODE (only host)
                    if (!isHost) return;

                    setVolume(vol);

                    socket.emit("volume_change", {
                      roomId,
                      volume: vol,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Playbar;
