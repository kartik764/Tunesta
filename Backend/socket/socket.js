const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected : ", socket.id);

    // =========================
    // ROOM
    // =========================
    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          host: socket.id,
          song: null,
          time: 0,
          startedAt: null,
          isPlaying: false,
          volume: 1,
          queue: [],
        };
      }

      const room = rooms[roomId];

      const existingUser = room.users.find((u) => u.username === username);

      const wasHost = existingUser && room.host === existingUser.socketId;

      room.users = room.users.filter((u) => u.username !== username);

      room.users.push({
        socketId: socket.id,
        username,
      });

      if (wasHost) {
        room.host = socket.id;
      }

      if (!room.host) {
        room.host = socket.id;
      }

      io.to(roomId).emit("room_users", room.users);
      io.to(roomId).emit("host_info", room.host);

      let currentTime = room.time;

      if (room.isPlaying && room.startedAt) {
        currentTime += (Date.now() - room.startedAt) / 1000;
      }

      socket.emit("sync_state", {
        song: room.song,
        time: currentTime,
        isPlaying: room.isPlaying,
        volume: room.volume,
        queue: room.queue,
      });
    });

    socket.on("leave_room", (roomId) => {
      if (!rooms[roomId]) return;

      const leavingUser = rooms[roomId].users.find(
        (u) => u.socketId === socket.id,
      );

      if (leavingUser) {
        socket.to(roomId).emit("user_left", leavingUser.username);
      }

      socket.leave(roomId);

      rooms[roomId].users = rooms[roomId].users.filter(
        (u) => u.socketId !== socket.id,
      );

      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
        return;
      }

      io.to(roomId).emit("room_users", rooms[roomId].users);

      if (rooms[roomId].host === socket.id) {
        rooms[roomId].host = rooms[roomId].users[0].socketId || null;

        io.to(roomId).emit("host_info", rooms[roomId].host);
      }
    });

    socket.on("disconnect", () => {
      for (let roomId in rooms) {
        const leavingUser = rooms[roomId].users.find(
          (u) => u.socketId === socket.id,
        );

        if (!leavingUser) continue;

        setTimeout(() => {
          if (!rooms[roomId]) return;
          const userStillPresent = rooms[roomId].users.find(
            (u) => u.username === leavingUser.username,
          );

          if (userStillPresent && userStillPresent.socketId !== socket.id) {
            return;
          }

          rooms[roomId].users = rooms[roomId].users.filter(
            (u) => u.username !== leavingUser.username,
          );

          if (rooms[roomId].users.length === 0) {
            delete rooms[roomId];
            return;
          }

          if (rooms[roomId].host === socket.id) {
            rooms[roomId].host = rooms[roomId].users[0]?.socketId || null;
          }

          io.to(roomId).emit("room_users", rooms[roomId].users);
          io.to(roomId).emit("host_info", rooms[roomId].host);
        }, 3000);
      }
    });

    // =========================
    // PLAYBACK
    // =========================
    socket.on("play", ({ roomId, song, time }) => {
      if (!rooms[roomId]) return;

      const room = rooms[roomId];

      if (room.host !== socket.id) return;

      room.song = song;
      room.time = time;
      room.startedAt = Date.now();
      room.isPlaying = true;

      io.to(roomId).emit("play", {
        song,
        time,
        sentAt: Date.now(),
      });
    });

    socket.on("pause", ({ roomId, time }) => {
      if (!rooms[roomId]) return;

      const room = rooms[roomId];

      if (room.host !== socket.id) return;

      room.time = time;
      room.startedAt = null;
      room.isPlaying = false;

      io.to(roomId).emit("pause", { time });
    });

    socket.on("seek", ({ roomId, time }) => {
      if (!rooms[roomId]) return;

      if (rooms[roomId].host !== socket.id) return;

      rooms[roomId].time = time;
      if (rooms[roomId].isPlaying) {
        rooms[roomId].startedAt = Date.now();
      }

      io.to(roomId).emit("seek", {
        time,
        sentAt: Date.now(),
      });
    });

    socket.on("volume_change", ({ roomId, volume }) => {
      if (!rooms[roomId]) return;

      if (rooms[roomId].host !== socket.id) return;

      rooms[roomId].volume = volume;

      io.to(roomId).emit("volume_change", volume);
    });

    // =========================
    // QUEUE
    // =========================
    socket.on("add_to_queue", ({ roomId, song }) => {
      if (!rooms[roomId]) return;

      const room = rooms[roomId];

      // Song already playing
      if (room.song && room.song.path === song.path) {
        socket.emit("queue_error", "Song is already playing.");
        return;
      }

      room.queue.forEach((queuedSong) => {});

      // Song already in queue
      const alreadyQueued = room.queue.some(
        (queuedSong) => queuedSong.path === song.path,
      );

      if (alreadyQueued) {
        socket.emit("queue_error", "Song is already in the queue.");
        return;
      }

      room.queue.push(song);

      io.to(roomId).emit("queue_updated", room.queue);
    });

    socket.on("remove_from_queue", ({ roomId, index }) => {
      if (!rooms[roomId]) return;

      // only host can remove
      if (rooms[roomId].host !== socket.id) return;

      rooms[roomId].queue.splice(index, 1);

      io.to(roomId).emit("queue_updated", rooms[roomId].queue);
    });

    socket.on("play_next", ({ roomId }) => {
      if (!rooms[roomId]) return;

      const room = rooms[roomId];

      // Only host can play next
      if (room.host !== socket.id) return;

      // Queue empty
      if (room.queue.length === 0) {
        room.song = null;
        room.time = 0;
        room.startedAt = null;
        room.isPlaying = false;

        io.to(roomId).emit("queue_finished");

        return;
      }

      // Remove first song
      const nextSong = room.queue.shift();

      // Update room state
      room.song = nextSong;
      room.time = 0;
      room.startedAt = Date.now();
      room.isPlaying = true;

      // Everyone starts playing
      io.to(roomId).emit("play", {
        song: nextSong,
        time: 0,
        sentAt: Date.now(),
      });

      //Everyone gets updated queue
      io.to(roomId).emit("queue_updated", room.queue);
    });
  });
};

export default socketHandler;
