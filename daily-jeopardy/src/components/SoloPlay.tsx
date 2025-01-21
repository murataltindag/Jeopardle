import React, { useState, useEffect } from "react";
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
import questionsDatabase from "../data/questionsDatabase.json";

interface Clue {
  clue: string;
  answer: string;
}

interface QuestionsDatabase {
  [key: string]: Clue[];
}

const App = () => {
  const values = [200, 400, 600, 800, 1000];

  // State to hold the selected categories and clues
  const [categories, setCategories] = useState<string[]>([]);
  const [clues, setClues] = useState<{ [key: string]: Clue[] }>({});

  // Randomize categories once when the component mounts
  useEffect(() => {
    const allCategories = Object.keys(questionsDatabase);
    const randomCategories = allCategories.sort(() => 0.5 - Math.random()).slice(0, 5);
    setCategories(randomCategories);

    // Build the clues object based on the selected categories
    const selectedClues = randomCategories.reduce((acc, category) => {
      acc[category] = (questionsDatabase as QuestionsDatabase)[category];
      return acc;
    }, {} as { [key: string]: Clue[] });

    setClues(selectedClues);
  }, []);

  const [open, setOpen] = useState(false);
  const [selectedClue, setSelectedClue] = useState<{ clue: string; answer: string; category: string; value: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState(""); // User's input
  const [feedback, setFeedback] = useState<string | null>(null); // Feedback message

  // Track the state of each question
  const [questionState, setQuestionState] = useState<{
    [category: string]: { [value: number]: { attempts: number; reveal: boolean } };
  }>({});

  const handleOpen = (category: string, value: number, clue: Clue) => {
    setSelectedClue({ ...clue, category, value });
    setOpen(true);
    setUserAnswer("");
    setFeedback(null);

    // Ensure the state for this question exists
    setQuestionState((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [value]: prevState[category]?.[value] || { attempts: 0, reveal: false },
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
              <Button
                variant="outlined"
                onClick={() => handleRevealAnswer(selectedClue?.category || "", selectedClue?.value || 0)}
              >
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
