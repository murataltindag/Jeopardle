import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (replace with your client URL in production)
    methods: ["GET", "POST"],
  },
});

let lobbies = {}; // Store all lobbies and their states

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a lobby
  socket.on("joinLobby", ({ lobbyId, playerName }) => {
    if (!lobbies[lobbyId]) {
      lobbies[lobbyId] = { players: {}, leader: playerName };
    }
  
    lobbies[lobbyId].players[playerName] = 0; // Initialize score
    socket.join(lobbyId);
  
    // Assign the first player as the leader
    io.to(lobbyId).emit("setLeader", lobbies[lobbyId].leader);
  
    io.to(lobbyId).emit("updateScores", lobbies[lobbyId].players);
  });
  
  // Start the game
  socket.on("startGame", (lobbyId) => {
    // Notify all players in the lobby to start the game
    io.to(lobbyId).emit("startGame");
  });
  
  

  // Handle buzz
  socket.on("buzz", ({ playerName }) => {
    const lobbyId = Array.from(socket.rooms).find((room) => room !== socket.id);
    const lobby = lobbies[lobbyId];
  
    if (lobby && !lobby.buzzedPlayer) {
      lobby.buzzedPlayer = playerName; // Set the first player to buzz
      io.to(lobbyId).emit("buzzerPressed", playerName); // Notify everyone
      console.log(`${playerName} buzzed in lobby: ${lobbyId}`);
    }
  });  

  // Select a question
  socket.on("questionSelected", ({ category, value }) => {
    const lobbyId = Array.from(socket.rooms).find((room) => room !== socket.id);
    const lobby = lobbies[lobbyId];

    if (lobby) {
      lobby.currentQuestion = { category, value };
      lobby.buzzedPlayer = null; // Reset the buzzer for the new question
      io.to(lobbyId).emit("questionSelected", { category, value });
      console.log(`Question selected in lobby ${lobbyId}: ${category} - ${value}`);
    }
  });

  // Update scores
  socket.on("updateScores", ({ playerName, score }) => {
    const lobbyId = Array.from(socket.rooms).find((room) => room !== socket.id);
    const lobby = lobbies[lobbyId];
  
    if (lobby && lobby.players[playerName] !== undefined) {
      lobby.players[playerName] += score; // Update the player's score
      lobby.buzzedPlayer = null; // Reset the buzzer for the next round
      io.to(lobbyId).emit("updateScores", lobby.players);
    }
  });
  

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove player from lobbies
    Object.keys(lobbies).forEach((lobbyId) => {
      const lobby = lobbies[lobbyId];
      const player = Object.keys(lobby.players).find((playerName) =>
        Object.values(io.sockets.sockets).some((s) => s.id === socket.id)
      );

      if (player) {
        delete lobby.players[player];
        io.to(lobbyId).emit("updateScores", lobby.players);
        console.log(`${player} left lobby ${lobbyId}`);
      }

      // Delete the lobby if it's empty
      if (Object.keys(lobby.players).length === 0) {
        delete lobbies[lobbyId];
        console.log(`Lobby ${lobbyId} deleted`);
      }
    });
  });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
