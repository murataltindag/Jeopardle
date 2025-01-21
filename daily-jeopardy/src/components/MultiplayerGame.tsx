import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Paper, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import io from "socket.io-client";

interface MultiplayerGameProps {
  lobbyId: string;
  playerName: string;
  isLeader: boolean;
}

const categories = ["Science", "History", "Movies", "Sports", "Tech"];
const values = [200, 400, 600, 800, 1000];
const clues: { [key: string]: { clue: string; answer: string }[] } = {
  Science: [
    { clue: "This force keeps planets in orbit.", answer: "What is gravity?" },
    { clue: "This process allows plants to convert sunlight into energy.", answer: "What is photosynthesis?" },
    { clue: "This is the smallest unit of matter.", answer: "What is an atom?" },
    { clue: "This molecule carries genetic instructions.", answer: "What is DNA?" },
    { clue: "This region of space has a gravitational pull so strong that nothing can escape.", answer: "What is a black hole?" },
  ],
  History: [
    { clue: "He was exiled to the island of Elba in 1814.", answer: "Who is Napoleon?" },
    { clue: "This cultural movement is known as the 'rebirth' of art and learning.", answer: "What is the Renaissance?" },
    { clue: "This global conflict lasted from 1939 to 1945.", answer: "What is World War II?" },
    { clue: "This geopolitical tension divided the world into two camps after WWII.", answer: "What is the Cold War?" },
    { clue: "She was the last active ruler of the Ptolemaic Kingdom of Egypt.", answer: "Who is Cleopatra?" },
  ],
  Movies: [
    { clue: "This sci-fi film features the concept of dreams within dreams.", answer: "What is Inception?" },
    { clue: "This 1972 movie is considered one of the greatest mafia films of all time.", answer: "What is The Godfather?" },
    { clue: "This 1977 space opera introduced Luke Skywalker.", answer: "What is Star Wars?" },
    { clue: "This 1999 movie featured Neo in a digital world.", answer: "What is The Matrix?" },
    { clue: "This James Cameron film became the highest-grossing movie of all time.", answer: "What is Titanic?" },
  ],
  Sports: [
    { clue: "This is the most popular sport worldwide.", answer: "What is soccer?" },
    { clue: "This event features athletes from around the globe competing in various disciplines.", answer: "What are the Olympics?" },
    { clue: "This American pastime involves bases and home runs.", answer: "What is baseball?" },
    { clue: "This bat-and-ball game is popular in countries like India and Australia.", answer: "What is cricket?" },
    { clue: "This sport has positions like point guard and shooting guard.", answer: "What is basketball?" },
  ],
  Tech: [
    { clue: "This field focuses on creating intelligent machines.", answer: "What is AI?" },
    { clue: "This is a device that processes information and performs calculations.", answer: "What is a computer?" },
    { clue: "This global network connects millions of private, public, academic, and business networks.", answer: "What is the Internet?" },
    { clue: "This programming language is named after a type of snake.", answer: "What is Python?" },
    { clue: "This technology underpins cryptocurrencies like Bitcoin.", answer: "What is blockchain?" },
  ],
};

const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ lobbyId, playerName }) => {
  const [socket] = useState(() => io("http://localhost:4000"));
  const [buzzerState, setBuzzerState] = useState<string | null>(null);
  const [selectedClue, setSelectedClue] = useState<{ clue: string; answer: string; value: number } | null>(null);
  const [scores, setScores] = useState<{ [player: string]: number }>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLeader, setIsLeader] = useState(false); // Track if the user is the leader
  const [buzzerEnabled, setBuzzerEnabled] = useState(false); // Control when the buzzer appears

  useEffect(() => {
    socket.emit("joinLobby", { lobbyId, playerName });

    // Check if the user is the leader
    socket.on("setLeader", (leader: string) => {
      setIsLeader(leader === playerName);
    });

    socket.on("buzzerPressed", (player: string) => {
      setBuzzerState(player); // Show who buzzed first
    });

    socket.on("updateScores", (updatedScores: { [player: string]: number }) => {
      setScores(updatedScores); // Update scores
    });

    return () => {
      socket.disconnect();
    };
  }, [lobbyId, playerName, socket]);

  const handleSelectClue = (category: string, value: number) => {
    if (!isLeader) return; // Only the leader can select a question

    const clueIndex = values.indexOf(value);
    setSelectedClue({ ...clues[category][clueIndex], value });
    setShowAnswer(false);
    setBuzzerState(null);
    setBuzzerEnabled(false); // Disable buzzer initially

    // Emit the question selection to the server
    socket.emit("questionSelected", { category, value });

    // Enable the buzzer after 3 seconds
    setTimeout(() => setBuzzerEnabled(true), 3000);
  };

  const handleBuzzerPress = () => {
    if (!buzzerEnabled || buzzerState) return; // Prevent multiple buzzes
    socket.emit("buzz", { playerName });
  };

  const handleSubmitAnswer = (correct: boolean) => {
    if (correct) {
      socket.emit("updateScores", { playerName, score: selectedClue?.value || 0 });
    } else {
      socket.emit("updateScores", { playerName, score: -(selectedClue?.value || 0) });
    }
    setShowAnswer(true);
    setBuzzerEnabled(false); // Reset the buzzer
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
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Multiplayer Jeopardy
      </Typography>
      <Grid container spacing={2} sx={{ maxWidth: "90%", margin: "0 auto" }}>
        {categories.map((category, categoryIndex) => (
          <Grid item xs={12} key={categoryIndex}>
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Paper
                elevation={4}
                sx={{
                  padding: 2,
                  backgroundColor: "#4a4a4a",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  minWidth: 150,
                  margin: 1,
                }}
              >
                {category}
              </Paper>
              {values.map((value, valueIndex) => (
                <Paper
                  key={valueIndex}
                  elevation={4}
                  sx={{
                    padding: 2,
                    backgroundColor: "#1e88e5",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    minWidth: 150,
                    margin: 1,
                    cursor: isLeader ? "pointer" : "not-allowed",
                    "&:hover": isLeader ? { backgroundColor: "#1565c0" } : undefined,
                  }}
                  onClick={() => handleSelectClue(category, value)}
                >
                  ${value}
                </Paper>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedClue && (
        <Dialog open={true} onClose={() => setSelectedClue(null)}>
          <DialogTitle>Jeopardy Clue</DialogTitle>
          <DialogContent>
            <Typography>{selectedClue.clue}</Typography>
            {buzzerEnabled && !buzzerState && (
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                onClick={handleBuzzerPress}
              >
                Buzz
              </Button>
            )}
            {buzzerState && !showAnswer && (
              <>
                <Typography sx={{ marginTop: 2 }}>{buzzerState}, it's your turn to answer!</Typography>
                <Button
                  sx={{ marginTop: 2 }}
                  variant="contained"
                  onClick={() => handleSubmitAnswer(true)}
                >
                  Correct
                </Button>
                <Button
                  sx={{ marginTop: 2, marginLeft: 2 }}
                  variant="outlined"
                  onClick={() => handleSubmitAnswer(false)}
                >
                  Incorrect
                </Button>
              </>
            )}
            {buzzerState && showAnswer && (
              <Typography sx={{ marginTop: 2, color: "blue" }}>
                Correct Answer: {selectedClue.answer}
              </Typography>
            )}
          </DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Button variant="contained" onClick={() => setSelectedClue(null)}>
              Close
            </Button>
          </Box>
        </Dialog>
      )}

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Scores:</Typography>
        {Object.entries(scores).map(([player, score]) => (
          <Typography key={player}>
            {player}: {score} points
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default MultiplayerGame;
