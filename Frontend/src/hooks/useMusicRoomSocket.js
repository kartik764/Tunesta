import { useState, useEffect } from "react";
import { socket } from "../socket/socket";

const useMusicRoomSocket = ({ roomId, username }) => {
  const [users, setUsers] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    console.log("Join effect running");
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
      console.log("Host received:", host);
    };

    socket.on("room_users", handleUsers);
    socket.on("host_info", handleHost);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("room_users", handleUsers);
      socket.off("host_info", handleHost);
    };
  }, [roomId, username]);

  useEffect(() => {
    console.log("hostId:", hostId);
    console.log("socket.id:", socket.id);

    if (!socket.id || !hostId) return;

    console.log("Comparison:", socket.id === hostId);

    setIsHost(socket.id === hostId);
  }, [hostId]);

  const leaveRoom = () => {
    socket.emit("leave_room", roomId);
  };

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
