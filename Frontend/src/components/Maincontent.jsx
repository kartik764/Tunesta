import React from "react";
import "./Style.css";
import "./Utility.css";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Maincontent = ({
  albums,
  handleAlbumClick,
  handlehamburgerclick,
  query,
  setQuery,
  isSearchMode,
  currentsong,
  roomId,
  setRoomId,
  roomUsers,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (roomId) {
      socket.emit("leave_room", roomId);
    }
    socket.disconnect();
    logout();
    toast.info("Logged out successfully. See you soon! 👋");
    navigate("/login");
  };

  return (
    <>
      <div
        className="header glass-effect"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          gap: "10px",
        }}
      >
        {/* LEFT: Hamburger */}
        <div onClick={handlehamburgerclick} style={{ cursor: "pointer" }}>
          <span style={{ fontSize: "26px", color: "white" }}>☰</span>
        </div>

        {/* CENTER: Now Playing */}
        <div
          style={{
            color: "#1DB954",
            fontWeight: "bold",
            fontSize: "14px",
            textAlign: "center",
            flex: 1,
          }}
        >
          {currentsong ? `🎵 ${currentsong.name}` : "No song playing"}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            background: "#1DB954",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="MusicPlaylists">
        <h1>Tunesta's Albums</h1>

        {isSearchMode && (
          <input
            type="text"
            placeholder="Search songs or albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              background: "#2a2a2a",
              color: "white",
            }}
          />
        )}

        {/* Albums */}
        <div className="cardcontainer">
          {Array.isArray(albums) && albums.length > 0 ? (
            albums.map((album) => (
              <div
                key={album._id}
                className="card glass-effect interactive-card"
                onClick={() => handleAlbumClick(album)}
              >
                <div className="play">
                  <svg height="50" width="50" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#1DB954" />
                    <polygon points="9,7 17,12 9,17" fill="#000000" />
                  </svg>
                </div>

                <img
                  src={
                    album.cover.startsWith("http")
                      ? album.cover
                      : `${import.meta.env.VITE_API_URL}${album.cover}`
                  }
                  alt="album cover"
                />

                <h2>{album.title}</h2>
                <p>{album.description}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "white", marginTop: "20px" }}>
              No results found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Maincontent;
