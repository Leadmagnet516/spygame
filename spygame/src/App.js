import './App.css';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  MODAL_ID,
  APP_STATE,
  ACTION_RESET_GAME_INSTANCE,
  ACTION_TOGGLE_MODAL
} from './CONSTANTS';
import SplashScreen from './screens/SplashScreen';
import GameScreen from './screens/GameScreen';
import { createContext, useEffect, useState } from 'react';
import usePrevious from './hooks/usePrevious';
import PauseModal from './screens/PauseModal';
import { selectedActiveModalId } from './SELECTORS';
import { useDispatch, useSelector } from 'react-redux';
import ObjectiveCompleteModal from './screens/ObectiveCompleteModal';
import GameOverModal from './screens/GameOverModal';

/* const importScreen = screen => {
  console.log('importScreen', screen);
  lazy(() =>
    import(`./screens/${screen}`)
      .then(data => console.log('Loaded', data))
      .catch(() => console.log('uh oh'))
      .finally(() => console.log('Yeah I don't know what happened here'))
  )
} */

export const AppContext = createContext({appState: APP_STATE.NULL, xOffset: 0, yOffset: 0});

function App() {
  const [ appState, setAppState ] = useState(APP_STATE.SPLASH);
  const prevAppState = usePrevious(appState);
  const [ xOffset, setXOffset ] = useState(0);
  const [ yOffset, setYOffset ] = useState(0);
  const activeModalId = useSelector(selectedActiveModalId);
  const dispatch = useDispatch();

  const splashToGame = () => {
    dispatch({ type: ACTION_RESET_GAME_INSTANCE, payload: false });
    
    setTimeout(() => {
      setAppState(APP_STATE.GAME);
    }, 100)
  }

  const handleLeaveGame = () => {
    setAppState(APP_STATE.SPLASH);
  }

  const handleWindowResize = () => {
    setXOffset((window.innerWidth - GAME_WIDTH) / 2);
    setYOffset(20);
  }

  useEffect(() => {
    if (activeModalId === null) {
      setAppState(prevAppState || APP_STATE.SPLASH);
    } else {
      setAppState(APP_STATE.MODAL);
    }
  }, [activeModalId])

  // LISTENERS
  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  });

  return (
    <AppContext.Provider value={{appState, xOffset, yOffset}}>
      <div className='App' style={{width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`}}>
          <div className='splash0screen-container container' style={{display: appState === APP_STATE.SPLASH ? 'block' : 'none'}}>
            <SplashScreen splashToGame={splashToGame}></SplashScreen>
          </div>
            <div className='game-screen-container container' style={{display: appState === APP_STATE.GAME || (prevAppState === APP_STATE.GAME && appState === APP_STATE.MODAL) ? 'block' : 'none'}}>
              <GameScreen appInGameState={appState === APP_STATE.GAME} handleLeaveGame={handleLeaveGame} ></GameScreen>
            </div>
          <div className='modal-layer-container container' style={{display: appState === APP_STATE.MODAL ? 'block' : 'none'}}>
            {
              activeModalId === MODAL_ID.PAUSE ?
                  <PauseModal activeModalId={activeModalId} handleLeaveGame={handleLeaveGame}></PauseModal>
              : activeModalId === MODAL_ID.OBJECTIVE_COMPLETE ?
                  <ObjectiveCompleteModal activeModalId={activeModalId} handleLeaveGame={handleLeaveGame}></ObjectiveCompleteModal>
              : activeModalId === MODAL_ID.GAME_OVER ?
                  <GameOverModal activeModalId={activeModalId} handleLeaveGame={handleLeaveGame}></GameOverModal>
              : null
            }
          </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
