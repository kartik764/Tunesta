// ====================================================
// IMPORTS
// ====================================================

import { useState, useEffect } from "react";
import { socket } from "../socket/socket";

// ====================================================
// HOOK
// ====================================================

const useMusicRoomSocket = ({ roomId, username }) => {
  // ====================================================
  // STATE
  // ====================================================

  const [users, setUsers] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [isHost, setIsHost] = useState(false);

  // ====================================================
  // CONNECTION
  // ====================================================
  useEffect(() => {
    if (!roomId) return;

    const joinRoom = () => {
      socket.emit("join_room", {
        roomId,
        username,
      });
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
      socket.once("connect", joinRoom);
    }

    const handleUsers = (updatedUsers) => {
      setUsers(updatedUsers);
    };

    const handleHost = (host) => {
      setHostId(host);
    };

    socket.on("room_users", handleUsers);
    socket.on("host_info", handleHost);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("room_users", handleUsers);
      socket.off("host_info", handleHost);
    };
  }, [roomId, username]);

  // HOST
  useEffect(() => {
    if (!socket.id || !hostId) return;

    setIsHost(socket.id === hostId);
  }, [hostId]);

  // ROOM ACTIONS
  const leaveRoom = () => {
    socket.emit("leave_room", roomId);
  };

  // PLAYBACK
  const playSong = ({ song, time }) => {
    socket.emit("play", {
      roomId,
      song,
      time,
    });
  };

  const pauseSong = (time) => {
    socket.emit("pause", {
      roomId,
      time,
    });
  };

  // ====================================================
  // RETURN
  // ====================================================
  return {
    users,
    hostId,
    isHost,
    leaveRoom,
    playSong,
    pauseSong,
  };
};

export default useMusicRoomSocket;
