import React from "react";
import "./Style.css";
import "./Utility.css";

const Sidebar = ({
  songs,
  handlesongclick,
  handleclosebutton,
  handleOpenUpload,
  setIsSearchMode,
  isSearchMode,
  roomId,
  setRoomId,
  handleCreateRoom,
  handleJoinRoom,
  handleLeaveRoom,
  roomUsers,
  isHost,
  roomInput,
  setRoomInput,
}) => {
  return (
    <>
      <div className="close" onClick={handleclosebutton}>
        <img width="30" className="invert" src="/img/close.svg" alt="close" />
      </div>

      {/* 👤 USER PROFILE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          margin: "10px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            background: "#1DB954",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {sessionStorage.getItem("user_email")?.[0]?.toUpperCase() || "U"}
        </div>

        {/* Email */}
        <span
          style={{
            fontSize: "13px",
            color: "#ccc",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sessionStorage.getItem("user_email") || "User"}
        </span>
      </div>

      <div className="home glass-effect round m-1 p-1">
        <div className="logo">
          <img
            width="54px"
            className="invert"
            src="/img/logo1.svg"
            alt="logo"
          />
        </div>
        <ul>
          <li
            onClick={() => setIsSearchMode(false)}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              color: !isSearchMode ? "#1DB954" : "white",
              fontWeight: !isSearchMode ? "bold" : "normal",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <img className="invert" src="/img/home.svg" alt="Home" />
            Home
          </li>

          <li
            onClick={() => setIsSearchMode(true)}
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              color: isSearchMode ? "#1DB954" : "white",
              fontWeight: isSearchMode ? "bold" : "normal",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <img className="invert" src="/img/search.svg" alt="Search" />
            Search
          </li>
        </ul>

        <div
          style={{
            background: "#2a2a2a",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <h3
            style={{
              color: "#1DB954",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            🎧 Rooms
          </h3>

          {/* Input */}
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "6px",
              border: "none",
              marginBottom: "8px",
              background: "#1e1e1e",
              color: "white",
            }}
          />

          {/* Buttons */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={handleCreateRoom}
              disabled={roomInput.trim() !== ""}
              style={{
                flex: 1,
                background: roomInput.trim() !== "" ? "#555" : "#1DB954",
                border: "none",
                padding: "6px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: roomInput.trim() !== "" ? "not-allowed" : "pointer",

                opacity: roomInput.trim() !== "" ? 0.6 : 1,
              }}
            >
              Create
            </button>

            <button
              onClick={handleJoinRoom}
              style={{
                flex: 1,
                background: "#1DB954",
                border: "none",
                padding: "6px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              
            >
              Join
            </button>
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#aaa",
              fontSize: "12px",
            }}
          >
            {roomId && (
              <>
                <div style={{ color: "#1DB954", fontSize: "12px" }}>
                  Room: {roomId}
                </div>

                <div style={{ color: "#fff", marginTop: "4px" }}>
                  {isHost ? "👑 You are Host" : "🎧 Listener"}
                </div>
              </>
            )}
          </div>

          <div>
            {roomId ? `👥 ${roomUsers?.length || 0} users` : "Not in room"}
          </div>
        </div>
      </div>

      <div
        className="library glass-effect round m-1 p-1"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="heading">
          <img className="invert" src="/img/playlist.svg" alt="playlist" />
          <h3>Your library</h3>
        </div>

        {/* --- MODIFIED UPLOAD BUTTON --- */}
        {/* Centered, Glassmorphism Background, Prominent */}
        <div
          onClick={handleOpenUpload}
          style={{
            cursor: "pointer",
            marginTop: "15px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "12px",
            backgroundColor: "#1DB954", // ✅ primary green
            color: "black",
            borderRadius: "8px",
            width: "90%",
            alignSelf: "center",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.backgroundColor = "#1ed760";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#1DB954";
          }}
        >
          <div className="home-icon">
            <img
              className="invert"
              src="/img/plus.svg"
              alt="Upload"
              style={{ width: "20px" }}
            />
          </div>
          <div
            className="home-text"
            style={{ fontWeight: "bold", fontSize: "15px" }}
          >
            Upload Song
          </div>
        </div>
        {/* ----------------------------- */}

        <div className="songlist">
          <ul>
            {songs.map((song, index) => {
              return (
                <li
                  key={song.path}
                  onClick={() => handlesongclick(song, index)}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    marginBottom: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#2a2a2a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <img className="invert" src="img/music.svg" alt="" />
                  <div className="info">
                    <div>{song.name}</div>
                    <div>Tunesta</div>
                  </div>
                  <div className="playnow">
                    <span>Play now</span>
                    <img className="invert" src="img/playsong.svg" alt="" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/*for now i have not added any footer section... */}
      </div>
    </>
  );
};

export default Sidebar;
