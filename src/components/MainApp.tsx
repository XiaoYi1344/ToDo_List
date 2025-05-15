// MainApp.tsx
import { useState, useEffect } from "react";
import DoorEntry from "./Door";
import App from "../App";

const MainApp = () => {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    document.title = `To-Do List`
    
  }, [])

  return unlocked ? (
    <App onBackToDoor={() => setUnlocked(false)} />
  ) : (
    <DoorEntry onUnlock={() => setUnlocked(true)} />
  );
};

export default MainApp;
