import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useRoom() {
  const navigate = useNavigate();

  const [roomInput, setRoomInput] = useState("");

  const handleCreateRoom = () => {
    const roomCode = Math.random().toString(36).substring(2, 8);

    sessionStorage.setItem("activeRoom", roomCode);
    navigate(`/room/${roomCode}`);
    setRoomInput("");
  };

  const handleJoinRoom = () => {
    if (!roomInput.trim()) {
      alert("Enter Room ID");
      return;
    }

    sessionStorage.setItem("activeRoom", roomInput);
    navigate(`/room/${roomInput}`);
    setRoomInput("");
  };

  return {
    roomInput,
    setRoomInput,
    handleCreateRoom,
    handleJoinRoom,
  };
}