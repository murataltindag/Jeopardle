import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import io from "socket.io-client";

interface MultiplayerLobbyProps {
  setScreen: (screen: "start" | "solo" | "multiplayer" | "game") => void;
  setGameData: (data: { lobbyId: string; playerName: string; isLeader: boolean }) => void;
}

const socket = io("http://localhost:4000");

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ setScreen, setGameData }) => {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [leader, setLeader] = useState<string | null>(null);

  useEffect(() => {
    // Listen for the leader assignment
    socket.on("setLeader", (assignedLeader: string) => {
      setLeader(assignedLeader);
    });

    // Listen for the startGame event
    socket.on("startGame", () => {
      setGameData({
        lobbyId: lobbyId || "",
        playerName,
        isLeader: leader === playerName,
      });
      setScreen("game");
    });

    return () => {
      socket.off("setLeader");
      socket.off("startGame");
    };
  }, [lobbyId, playerName, leader, setGameData, setScreen]);

  const createLobby = () => {
    const id = Math.random().toString(36).substring(2, 8); // Generate a random lobby ID
    setLobbyId(id);
    socket.emit("joinLobby", { lobbyId: id, playerName });
  };

  const joinLobby = () => {
    if (lobbyId) {
      socket.emit("joinLobby", { lobbyId, playerName });
    }
  };

  const startGame = () => {
    if (lobbyId && playerName) {
      setGameData({
        lobbyId,
        playerName,
        isLeader: true, // The leader is starting the game
      });
      socket.emit("startGame", lobbyId); // Notify the server to start the game
      setScreen("game");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#282c34",
        color: "#fff",
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: 4 }}>
        Multiplayer Lobby
      </Typography>

      {!lobbyId ? (
        <>
          <TextField
            label="Your Name"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <Button variant="contained" onClick={createLobby} sx={{ marginBottom: 2 }}>
            Create Lobby
          </Button>
          <TextField
            label="Lobby ID"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            value={lobbyId || ""}
            onChange={(e) => setLobbyId(e.target.value)}
          />
          <Button variant="contained" onClick={joinLobby}>
            Join Lobby
          </Button>
        </>
      ) : (
        <>
          <Typography>Your Lobby ID:</Typography>
          <Typography variant="h5" sx={{ marginTop: 2, marginBottom: 4, color: "yellow" }}>
            {lobbyId}
          </Typography>
          <Typography>Leader: {leader || "Assigning..."}</Typography>
          <Button
            variant="contained"
            onClick={startGame}
            disabled={!playerName || !leader || leader !== playerName} // Allow only the leader to start
          >
            Start Game
          </Button>
        </>
      )}
    </Box>
  );
};

export default MultiplayerLobby;
