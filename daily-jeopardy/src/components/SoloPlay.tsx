import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";

const App = () => {
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

  const [open, setOpen] = useState(false);
  const [selectedClue, setSelectedClue] = useState<{ clue: string; answer: string; category: string; value: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState(""); // User's input
  const [feedback, setFeedback] = useState<string | null>(null); // Feedback message

  // Track the state of each question
  const [questionState, setQuestionState] = useState<{
    [category: string]: { [value: number]: { attempts: number; reveal: boolean } };
  }>({
    Science: {},
    History: {},
    Movies: {},
    Sports: {},
    Tech: {},
  });

  const handleOpen = (category: string, value: number, clue: { clue: string; answer: string }) => {
    setSelectedClue({ ...clue, category, value });
    setOpen(true);
    setUserAnswer("");
    setFeedback(null);

    // Ensure the state for this question exists
    setQuestionState((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [value]: prevState[category][value] || { attempts: 0, reveal: false },
      },
    }));
  };

  const handleClose = () => {
    setSelectedClue(null);
    setOpen(false);
  };

  const handleSubmitAnswer = (category: string, value: number) => {
    const currentState = questionState[category][value];
    if (userAnswer.trim().toLowerCase() === selectedClue?.answer.trim().toLowerCase()) {
      setFeedback("Correct!");
      setQuestionState((prevState) => ({
        ...prevState,
        [category]: {
          ...prevState[category],
          [value]: { ...currentState, reveal: true }, // Mark the question as revealed
        },
      }));
    } else {
      const newAttempts = currentState.attempts + 1;
      setFeedback(
        newAttempts >= 3
          ? "Out of attempts! Reveal the answer to proceed."
          : `Incorrect! You have ${3 - newAttempts} attempt(s) remaining.`
      );
      setQuestionState((prevState) => ({
        ...prevState,
        [category]: {
          ...prevState[category],
          [value]: { ...currentState, attempts: newAttempts },
        },
      }));
    }
  };

  const handleRevealAnswer = (category: string, value: number) => {
    setFeedback(`The correct answer is: ${selectedClue?.answer}`);
    setQuestionState((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [value]: { ...prevState[category][value], reveal: true },
      },
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#282c34",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ color: "#fff", marginBottom: 3 }}
      >
        Daily Jeopardy
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: "90%",
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {categories.map((category) => (
          <Grid item xs={12} key={category}>
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

              {values.map((value) => {
                const state = questionState[category]?.[value] || {};
                return (
                  <Paper
                    key={value}
                    elevation={4}
                    sx={{
                      padding: 2,
                      backgroundColor: state.reveal ? "#616161" : "#1e88e5",
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      minWidth: 150,
                      margin: 1,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: state.reveal ? "#616161" : "#1565c0",
                      },
                    }}
                    onClick={() => handleOpen(category, value, clues[category][values.indexOf(value)])}
                  >
                    ${value}
                  </Paper>
                );
              })}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Jeopardy Clue</DialogTitle>
        <DialogContent>
          <Typography>{selectedClue?.clue}</Typography>
          {!questionState[selectedClue?.category || ""]?.[selectedClue?.value || 0]?.reveal ? (
            <>
              <TextField
                fullWidth
                label="Your Answer"
                variant="outlined"
                sx={{ marginTop: 2 }}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              {feedback && (
                <Typography
                  sx={{
                    marginTop: 2,
                    color: feedback.startsWith("Correct") ? "green" : "red",
                  }}
                >
                  {feedback}
                </Typography>
              )}
            </>
          ) : (
            <Typography sx={{ marginTop: 2, color: "blue" }}>
              {`Correct Answer: ${selectedClue?.answer}`}
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
          {!questionState[selectedClue?.category || ""]?.[selectedClue?.value || 0]?.reveal && (
            <>
              <Button
                variant="contained"
                sx={{ marginRight: 2 }}
                onClick={() => handleSubmitAnswer(selectedClue?.category || "", selectedClue?.value || 0)}
                disabled={questionState[selectedClue?.category || ""]?.[selectedClue?.value || 0]?.attempts >= 3}
              >
                Submit
              </Button>
              <Button variant="outlined" onClick={() => handleRevealAnswer(selectedClue?.category || "", selectedClue?.value || 0)}>
                Reveal Answer
              </Button>
            </>
          )}
          {questionState[selectedClue?.category || ""]?.[selectedClue?.value || 0]?.reveal && (
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default App;
