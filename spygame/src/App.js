import './App.css';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_SHOW_MODAL
} from './CONSTANTS';
import SplashScreen from './screens/SplashScreen';
import GameScreen from './screens/GameScreen';
import { createContext, useEffect, useMemo, useState } from "react";

const STATE = {
  SPLASH: "SplashScreenState",
  GAME: "GameScreenState",
  MODAL: "ModalState",
  NULL: "NullState",
  PANTS: "PantsState"
}

/* const importScreen = screen => {
  console.log("importScreen", screen);
  lazy(() =>
    import(`./screens/${screen}`)
      .then(data => console.log("Loaded", data))
      .catch(() => console.log("uh oh"))
      .finally(() => console.log("Yeah I don't know what happened here"))
  )
} */

export const GameContext = createContext({appState: STATE.NULL, xOffset: 0, yOffset: 0});

function App() {
  const [ appState, setAppState ] = useState(STATE.SPLASH);
  const [ prevAppState, setPrevAppState ] = useState(STATE.NULL);
  const [ xOffset, setXOffset ] = useState(0);
  const [ yOffset, setYOffset ] = useState(0);

  const toggleAppState = newState => {
    setPrevAppState(appState);
    setAppState(newState);
  }

  const splashToGame = () => {
    toggleAppState(STATE.GAME);
  }

  const handleModalOpen = () => {
    toggleAppState(STATE.MODAL);
  }

  const handleModalClose = () => {
    toggleAppState(prevAppState);
  }

  const handleWindowResize = () => {
    setXOffset((window.innerWidth - GAME_WIDTH) / 2);
    setYOffset(20);
  }

  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  });

  useEffect(() => {
    window.addEventListener(EVENT_SHOW_MODAL, handleModalOpen)

    return () => {
      window.removeEventListener(EVENT_SHOW_MODAL, handleModalOpen);
    }
  }, [appState]);

  return (
    <div className="App" style={{width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`}}>
        <div className="splash0screen-container container" style={{display: appState === STATE.SPLASH ? "block" : "none"}}>
          <SplashScreen splashToGame={splashToGame}></SplashScreen>
        </div>
        <GameContext.Provider value={{appState, xOffset, yOffset}}>
          <div className="game-screen-container container" style={{display: appState === STATE.GAME ? "block" : "none"}}>
            <GameScreen></GameScreen>
          </div>
        </GameContext.Provider>
        <div className="modal-layer-container container" style={{display: appState === STATE.MODAL ? "block" : "none"}}>
          <button type="button" onClick={handleModalClose}>Close Modal</button>
        </div>
    </div>
  );
}

export default App;
