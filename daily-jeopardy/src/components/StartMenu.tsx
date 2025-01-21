import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface StartMenuProps {
  setScreen: (screen: "start" | "solo" | "multiplayer" | "game") => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ setScreen }) => {
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
        Welcome to Jeopardy!
      </Typography>
      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={() => setScreen("solo")}
      >
        Solo Play
      </Button>
      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        disabled // Disable the multiplayer button
      >
        Multiplayer (Coming Soon)
      </Button>
    </Box>
  );
};

export default StartMenu;
