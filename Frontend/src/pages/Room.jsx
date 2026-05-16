import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Playbar from "../components/Playbar";
import usePlayerState from "../hooks/usePlayerState";
import { toast } from "react-toastify";
import { socket } from "../socket";

const Room = () => {
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

  const { roomId } = useParams();
  const prevUserCount = useRef(0);
  const navigate = useNavigate();

  //LOCAL ROOM STATES

  const [albums, setAlbums] = useState([]); //stores all album
  const [users, setUsers] = useState([]); //stores room participants
  const [hostId, setHostId] = useState(null); //tracks room host socket ID
  const [isHost, setIsHost] = useState(false); //current user is host or not
  const [currentSongName, setCurrentSongName] = useState("No Song Playing");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [queue, setQueue] = useState([]);

  // EFFECTS

  //   1. FETCH ALBUMS
  // │   │   ├── get JWT token
  // │   │   ├── fetch /albums
  // │   │   ├── verify auth
  // │   │   └── store albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const token =
          //gets JWT token from browser storage(either from session or local)
          sessionStorage.getItem("tunesta_usertoken") ||
          localStorage.getItem("tunesta_usertoken");

        console.log("TOKEN:", token);

        //calls backend via api request
        const res = await fetch(`${import.meta.env.VITE_API_URL}/albums`, {
          headers: {
            // sends jwt token to be, be verifies user
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            //invalid token
            console.log("Unauthorized -> redirect login");
            return;
          }
          console.log("Album fetch failed:", res.status);
          return;
        }

        const data = await res.json(); //convert be res into object
        setAlbums(Array.isArray(data) ? data : []); //stores album
      } catch (err) {
        console.log("Failed to fetch albums");
      }
    };

    fetchAlbums();
  }, []);

  //   2. REFRESH RECOVERY
  // │   │   ├── check sessionStorage
  // │   │   └── restore room after refresh
  useEffect(() => {
    const savedRoom = sessionStorage.getItem("activeRoom");

    if (savedRoom && roomId !== savedRoom) {
      navigate(`/room/${savedRoom}`);
    }
  }, []);

  //   3. AUDIO UNLOCK
  // │   │   ├── muted autoplay trick
  // │   │   ├── browser autoplay permission
  // │   │   └── remove click listener
  useEffect(() => {
    //unlock browser audio playback
    const unlockAudio = () => {
      if (!audioref.current) return; //ensure audio element exists before using it

      audioref.current.muted = true; //browser allows muted autoplay

      audioref.current
        .play() //play audio silently
        .then(() => {
          audioref.current.pause(); //stops silent playback instantly
          audioref.current.currentTime = 0; //reset audio
          audioref.current.muted = false; // future playback works normally

          console.log("🔓 Audio unlocked");
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio); //remove click listener
    };

    window.addEventListener("click", unlockAudio); //add click listener

    return () => window.removeEventListener("click", unlockAudio); //prevents memory leaks when component unmounts
  }, []);

  //   4. SOCKET CONNECT + JOIN
  // │   │   ├── ensure socket connected
  // │   │   ├── emit join_room
  // │   │   └── send username + roomId
  useEffect(() => {
    //runs when roomId changes
    if (!socket.connected) socket.connect(); //ensure connection

    socket.emit("join_room", {
      //send req to be, add user to room
      roomId,
      username: sessionStorage.getItem("user_email") || "Anonymous",
    });

    //on unmount, leave the room
    return () => {};
  }, [roomId]);

  const prevUsersCount = useRef(0);

  //    5. ROOM LISTENERS
  // │   │   │
  // │   │   ├── room_users
  // │   │   │   ├── update users
  // │   │   │   ├── join toast
  // │   │   │   └── previous count tracking
  // │   │   │
  // │   │   ├── host_info
  // │   │   │   └── update hostId
  // │   │   │
  // │   │   └── user_left
  // │   │       └── leave toast
  useEffect(() => {
    const handleUsers = (updatedUsers) => {
      // Someone joined
      if (updatedUsers.length > prevUsersCount.current) {
        const latestUser = updatedUsers[updatedUsers.length - 1];

        if (latestUser.username !== sessionStorage.getItem("user_email")) {
          toast.success(`${latestUser.username} joined the room 🎉`);
        }
      }

      prevUsersCount.current = updatedUsers.length;

      setUsers(updatedUsers);
    };

    const handleHost = (host) => {
      setHostId(host);
    };

    const handleUserLeft = (username) => {
      if (username !== sessionStorage.getItem("user_email")) {
        toast.info(`${username} left the room 👋`);
      }
    };

    socket.on("room_users", handleUsers);
    socket.on("host_info", handleHost);
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("room_users", handleUsers);
      socket.off("host_info", handleHost);
      socket.off("user_left", handleUserLeft);
    };
  }, []);

  // 6. HOST CHECK
  // │   │   ├── compare socket.id
  // │   │   └── determine isHost

  useEffect(() => {
    if (!socket.id || !hostId) return;
    setIsHost(socket.id === hostId);
  }, [hostId]);

  //    7. PLAY EVENT
  // │   │   ├── receive play event
  // │   │   ├── latency compensation
  // │   │   ├── sync audio src
  // │   │   ├── sync currentTime
  // │   │   └── play audio

  useEffect(() => {
    const handleHost = (host) => {
      console.log("👑 Host received:", host);
      setHostId(host);
    };

    socket.on("host_info", handleHost);

    return () => socket.off("host_info", handleHost);
  }, []);

  //Play Event
  useEffect(() => {
    const handlePlay = ({ song, time, sentAt }) => {
      console.log("🎵 PLAY EVENT RECEIVED");
      console.log("SONG:", song);

      if (!audioref.current) return;

      // IMPORTANT
      if (!song || !song.path) {
        console.log("❌ Invalid song object:", song);
        return;
      }

      const src = song.path.startsWith("http")
        ? song.path
        : `${import.meta.env.VITE_API_URL}${song.path}`;

      console.log("SRC:", src);

      console.log("CURRENT AUDIO SRC:", audioref.current.src);

      if (audioref.current.src !== src) {
        console.log("🆕 NEW SONG");
        audioref.current.src = src;
      } else {
        console.log("▶ RESUMING SAME SONG");
      }

      // latency compensation
      const delay = sentAt ? (Date.now() - sentAt) / 1000 : 0;
      console.log("DELAY:", delay);
      audioref.current.currentTime = time + delay;

      console.log("⏯ CALLING PLAY()");

      audioref.current
        .play()
        .then(() => {
          console.log("✅ Audio synced successfully");
        })
        .catch((err) => {
          console.log("❌ Playback failed:", err);
        });

      setIsPlaying(true);
      setCurrentSong(song);
      setCurrentSongName(song.name);
    };

    socket.on("play", handlePlay);

    return () => socket.off("play", handlePlay);
  }, []);

  // queue
  useEffect(() => {
    socket.on("queue_updated", (updatedQueue) => {
      setQueue(updatedQueue);
    });

    return () => socket.off("queue_updated");
  }, []);

  //    8. PAUSE EVENT
  // │   │   ├── pause audio
  // │   │   └── sync pause time
  useEffect(() => {
    socket.on("pause", (time) => {
      if (!audioref.current) return;

      audioref.current.pause();
      audioref.current.currentTime = time || 0;

      setIsPlaying(false);
    });

    return () => socket.off("pause");
  }, []);

  //   9. SEEK EVENT
  // │   │   ├── receive seek time
  // │   │   └── update currentTime
  useEffect(() => {
    socket.on("seek", ({ time, sentAt }) => {
      if (!audioref.current) return;

      const delay = (Date.now() - sentAt) / 1000;
      audioref.current.currentTime = time + delay;
    });

    return () => socket.off("seek");
  }, []);

  //    10. VOLUME EVENT
  // │       └── sync volume
  useEffect(() => {
    socket.on("volume_change", (vol) => {
      setVolume(vol);
    });

    return () => socket.off("volume_change");
  }, []);

  //FUNCTIONS

  //   leaveRoom()
  // │   │   ├── clear sessionStorage
  // │   │   ├── emit leave_room
  // │   │   └── navigate home

  const leaveRoom = () => {
    sessionStorage.removeItem("activeRoom");
    socket.emit("leave_room", roomId);
    navigate("/");
  };

  //   handlePlayClick()
  // │   │   ├── host-only
  // │   │   ├── play audio
  // │   │   └── emit play event
  const handlePlayClick = () => {
    if (!isHost || !audioref.current) return;

    audioref.current.play();
    setIsPlaying(true);

    socket.emit("play", {
      roomId,
      song: currentsong,
      time: audioref.current.currentTime,
      sentAt: Date.now(),
    });
  };

  const handlePauseClick = () => {
    if (!isHost || !audioref.current) return;

    audioref.current.pause();

    socket.emit("pause", {
      roomId,
      time: audioref.current.currentTime,
    });
  };

  //   playTestSong()
  // │   │   └── emit test song
  const playTestSong = () => {
    if (!isHost) return;

    const songUrl =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    socket.emit("play", {
      roomId,
      song: {
        name: "Test Song",
        path: songUrl,
      },
      time: 0,
      sentAt: Date.now(),
    });
  };

  //    handleSeek()
  // │   │   ├── host-only
  // │   │   └── emit seek event
  const handleSeek = () => {
    if (!isHost || !audioref.current) return;

    socket.emit("seek", {
      roomId,
      time: audioref.current.currentTime,
      sentAt: Date.now(),
    });
  };

  //    handleAlbumClick()
  // │   │   └── set selected album
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  //   handleSongClick()
  // │       ├── host-only
  // │       ├── select song
  // │       └── emit play event
  const handleSongClick = (song) => {
    if (!isHost) return;

    socket.emit("play", {
      roomId,
      song,
      time: 0,
      sentAt: Date.now(),
    });
  };

  const playNextInQueue = () => {
    console.log("▶ Play Queue clicked");
    console.log("Socket connected:", socket.connected);

    socket.emit("play_next", roomId);
  };

  return (
    <div
      className="container flex"
      style={{ height: "100vh", flexDirection: "column" }}
    >
      {/* TOP BAR
│   │   ├── host indicator
│   │   ├── room ID
│   │   ├── copy button
│   │   ├── current song
│   │   └── leave room button */}

      <div className="room-topbar glass-effect">
        {/* HOST */}
        <div className="topbar-section">
          <div className="topbar-icon">👑</div>

          <div>
            <div className="topbar-label">Host</div>

            <div className="topbar-value">{isHost ? "You" : "Someone"}</div>
          </div>
        </div>

        {/* ROOM ID */}
        <div className="topbar-section">
          <div className="topbar-icon">👥</div>

          <div>
            <div className="topbar-label">Room ID</div>

            <div className="topbar-value">{roomId}</div>
          </div>

          <button
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              alert("Room ID copied!");
            }}
          >
            Copy
          </button>
        </div>

        {/* SONG */}
        <div className="topbar-section">
          <div className="topbar-icon">🎵</div>

          <div>
            <div className="topbar-label">Now Playing</div>

            <div className="topbar-value">{currentSongName}</div>
          </div>
        </div>

        {/* LEAVE */}
        <button className="leave-room-btn" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>

      {/*   MAIN LAYOUT */}
      <div className="room-layout" style={{ flex: 1, display: "flex" }}>
        {/* 🎶 LEFT: QUEUE */}
        <div className="room-users" style={{ width: "20%", padding: "15px" }}>
          <h3>🎶 Queue</h3>

          <div style={{ marginTop: "10px", color: "#aaa" }}>
            {queue.map((song, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#1a1a1a",
                  padding: "8px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}
              >
                <span>
                  {i + 1}. {song.name}
                </span>

                {isHost && (
                  <button
                    onClick={() =>
                      socket.emit("remove_from_queue", {
                        roomId,
                        index: i,
                      })
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL
│   │   │   │
│   │   │   ├── albums section
│   │   │   ├── songs section
│   │   │   ├── hidden audio element
│   │   │   ├── Playbar component
│   │   │   └── host controls */}
        <div
          className="room-center"
          style={{
            width: "60%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3>Albums</h3>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              {Array.isArray(albums) &&
                albums.map((album, i) => (
                  <div
                    key={i}
                    className="album-card"
                    onClick={() => handleAlbumClick(album)}
                    style={{
                      border:
                        selectedAlbum?.title === album.title
                          ? "2px solid #1DB954"
                          : "none",
                    }}
                  >
                    <img
                      src={
                        album.cover.startsWith("http")
                          ? album.cover
                          : `${import.meta.env.VITE_API_URL}${album.cover}`
                      }
                      alt="album"
                    />

                    <div className="play-overlay">▶</div>

                    <p>{album.title}</p>
                  </div>
                ))}
            </div>
          </div>

          {selectedAlbum && (
            <div style={{ marginTop: "20px" }}>
              <h3>🎵 Songs</h3>

              {selectedAlbum.songs.map((song, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px",
                    marginBottom: "6px",
                    borderRadius: "6px",
                    background: "#1a1a1a",

                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>🎶 {song.name}</span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button onClick={() => isHost && handleSongClick(song)}>
                      ▶
                    </button>

                    <button
                      onClick={() =>
                        socket.emit("add_to_queue", {
                          roomId,
                          song: {
                            name: song.name,
                            path: song.path,
                          },
                        })
                      }
                    >
                      ➕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="glass-effect"
            style={{
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#aaa" }}>Music player</p>

            <audio ref={audioref} />

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
              isHost={isHost}
              roomId={roomId}
            />

            {isHost && (
              <button
                onClick={playNextInQueue}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#1DB954",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ▶ Play Queue
              </button>
            )}
          </div>
        </div>

        {/* 👥 RIGHT: USERS */}
        <div className="left" style={{ width: "20%", padding: "15px" }}>
          <h3>👥 Users</h3>

          <div style={{ marginTop: "10px" }}>
            {users.map((u, i) => (
              <div
                key={i}
                className="glass-effect"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}
              >
                {u.username} {u.socketId === hostId && "👑"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
