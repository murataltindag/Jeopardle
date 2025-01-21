import React, { useState } from "react";
import StartMenu from "./components/StartMenu";
import SoloPlay from "./components/SoloPlay";
import MultiplayerLobby from "./components/MultiplayerLobby";
import MultiplayerGame from "./components/MultiplayerGame";

const App: React.FC = () => {
  const [screen, setScreen] = useState<"start" | "solo" | "multiplayer" | "game">("start");
  const [gameData, setGameData] = useState<{ lobbyId: string; playerName: string; isLeader: boolean } | null>(null);

  const renderScreen = () => {
    switch (screen) {
      case "solo":
        return <SoloPlay />;
      case "multiplayer":
        return (
          <MultiplayerLobby
            setScreen={setScreen}
            setGameData={setGameData}
          />
        );
      case "game":
        return gameData ? (
          <MultiplayerGame
            lobbyId={gameData.lobbyId}
            playerName={gameData.playerName}
            isLeader={gameData.isLeader}
          />
        ) : (
          <div>Error: Game data missing</div>
        );
      default:
        return <StartMenu setScreen={setScreen} />;
    }
  };

  return <div>{renderScreen()}</div>;
};

export default App;
