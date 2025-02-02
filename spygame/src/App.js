import './App.css';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_OPEN_MODAL,
  EVENT_CLOSE_MODAL,
  APP_STATE,
  ACTION_CHANGE_GAME_STATE,
  GAME_STATE
} from './CONSTANTS';
import SplashScreen from './screens/SplashScreen';
import GameScreen from './screens/GameScreen';
import { createContext, useEffect, useState } from 'react';
import usePrevious from './hooks/usePrevious';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

  const toggleAppState = newState => {
    setAppState(newState);
  }

  const splashToGame = () => {
    setAppState(APP_STATE.GAME);
    dispatch({ type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.ACTIVE})
  }

  const handleOpenModal = () => {
    setAppState(APP_STATE.MODAL);
  }

  const handleCloseModal = () => {
    setAppState(prevAppState);
  }

  const handleWindowResize = () => {
    setXOffset((window.innerWidth - GAME_WIDTH) / 2);
    setYOffset(20);
  }

  useEffect(() => {
    window.addEventListener(EVENT_OPEN_MODAL, handleOpenModal);
    window.addEventListener(EVENT_CLOSE_MODAL, handleCloseModal);

    return () => {
      window.removeEventListener(EVENT_OPEN_MODAL, handleOpenModal);
      window.removeEventListener(EVENT_CLOSE_MODAL, handleCloseModal);
    }
  }, [appState]);

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
            <div className='game-screen-container container' style={{display: appState === APP_STATE.GAME ? 'block' : 'none'}}>
              <GameScreen gameStateActive={appState === APP_STATE.GAME} ></GameScreen>
            </div>
          <div className='modal-layer-container container' style={{display: appState === APP_STATE.MODAL ? 'block' : 'none'}}>
            <button type='button' onClick={handleCloseModal}>Close Modal</button>
          </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
