const io = require("socket.io")(4000, {
    cors: { origin: "*" },
  });
  
  let lobbies = {};
  
  io.on("connection", (socket) => {
    socket.on("joinLobby", ({ lobbyId, playerName }) => {
      if (!lobbies[lobbyId]) {
        lobbies[lobbyId] = { players: {}, currentPlayer: null };
      }
      lobbies[lobbyId].players[playerName] = 0; // Initialize score
      socket.join(lobbyId);
      io.to(lobbyId).emit("updateScores", lobbies[lobbyId].players);
    });
  
    socket.on("buzz", ({ playerName }) => {
      const lobbyId = Array.from(socket.rooms)[1]; // Get the lobby ID
      lobbies[lobbyId].currentPlayer = playerName;
      io.to(lobbyId).emit("buzzerPressed", playerName);
    });
  
    socket.on("updateScores", ({ playerName, score }) => {
      const lobbyId = Array.from(socket.rooms)[1];
      lobbies[lobbyId].players[playerName] += score;
      io.to(lobbyId).emit("updateScores", lobbies[lobbyId].players);
    });
  });
  