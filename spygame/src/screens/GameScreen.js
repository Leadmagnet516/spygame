import Hero from "../entities/Hero";
import NpcLayer from "../layers/NpcLayer";
import SceneryLayer from "../layers/SceneryLayer";
import FxLayer from "../layers/FxLayer";
import HudLayer from "../layers/HudLayer";
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_STATES,
  EVENT_CHANGE_GAME_STATE,
  EVENT_OPEN_MODAL,
  EVENT_CLOSE_MODAL
} from "../CONSTANTS";
import {
  angleBetween,
  distanceBetween
 } from "../METHODS";
import { Level } from "../levels/level1";
import { createContext, useEffect, useRef, useState } from 'react';

const REF_HERO = "Hero";
const REF_CHARACTERS = "Characters";
const REF_SCENERY = "Scenery";
const REF_FX = "Effects";
const REF_HUD = "Hud";

export const GameContext = createContext({ gameState: GAME_STATES.INACTIVE });

export default function GameScreen( props ) {
  const { gameStateActive } = props;
  const [ gameState, setGameState ] = useState(gameStateActive ? GAME_STATES.ACTIVE : GAME_STATES.INACTIVE);
  const [ prevGameState, setPrevGameState ] = useState(GAME_STATES.NULL);

  // DEFINE REFS
  const heroRef = useRef(REF_HERO);
  const NpcLayerRef = useRef(REF_CHARACTERS);
  const sceneryLayerRef = useRef(REF_SCENERY);
  const fxLayerRef = useRef(REF_FX);
  const hudLayerRef = useRef(REF_HUD);

  // LEVEL ATTRIBUTES
  const { Scenery, Npcs, InitHero } = Level;

  // COLLISION DETECTION
  const boundaryCollision = pos => {
    let collision = false;

    if (pos.x < 0 ||
      pos.y < 0 ||
      pos.x >= GRID_WIDTH ||
      pos.y >= GRID_HEIGHT
    ) {
      collision = true;
    }
    
    return collision;
  }

  const sceneryCollision = pos => {
    let collision = false;

    Scenery.forEach(scn => {
      if (pos.x === scn.pos.x && pos.y === scn.pos.y ) {
        collision = true;
      }
    })

    return collision;
  }

  const enemyCollision = pos => {
    const npcs = NpcLayerRef.current.getNpcs();
    let collision = '';

    npcs.forEach(npc => {
      if (npc.alive && pos.x === npc.pos.x && pos.y === npc.pos.y ) {
        collision = npc.id;
      }
    })

    return collision;
  }

  // INTER-LAYER INTERACTIONS
  const [ susList, setSusList ] = useState([
    {
      id: "hero",
      type: "foe",
      pos: InitHero.pos
    }
  ]);
  const updateFromHero = (id, type, props) => {
    setSusList(susList => {
      return susList.map(sus => {
        if (sus.id === id) {
          return {
            ...sus,
            pos: props.pos
          }
        } else {
          return sus;
        }
      })
    });
  }
  const sceneryJuxt = pos => {
    return Scenery.map(scn => {
      return {
        dir: angleBetween(pos, scn.pos),
        dist: distanceBetween(pos, scn.pos)
      }
    });
  }

  // GAMESTATE MANAGEMENT
  const handleChangeGamestate = e => {
    setPrevGameState(gameState);
    setGameState(e.detail.newState);
  }

  const handleOpenModal = e => {
    if (gameState === GAME_STATES.ACTIVE) {
      setPrevGameState(GAME_STATES.ACTIVE);
      setGameState(GAME_STATES.PAUSED)
    }
  }

  const handleCloseModal = e => {
    if (prevGameState === GAME_STATES.ACTIVE) {
      setPrevGameState(GAME_STATES.PAUSED);
      setGameState(GAME_STATES.ACTIVE);
    }
  }

  useEffect(() => {
    setGameState(gameStateActive ? GAME_STATES.ACTIVE : GAME_STATES.INACTIVE);
  }, [gameStateActive])

  // LISTENERS
  useEffect(() => {
    window.addEventListener(EVENT_CHANGE_GAME_STATE, handleChangeGamestate);
    window.addEventListener(EVENT_OPEN_MODAL, handleOpenModal);
    window.addEventListener(EVENT_CLOSE_MODAL, handleCloseModal);

    return () => {
      window.removeEventListener(EVENT_CHANGE_GAME_STATE, handleChangeGamestate);
      window.removeEventListener(EVENT_OPEN_MODAL, handleOpenModal);
      window.removeEventListener(EVENT_CLOSE_MODAL, handleCloseModal);
    }
  });

  return (
    <GameContext.Provider value={{gameStateActive: gameState === GAME_STATES.ACTIVE}}>
      <div className="game-screen" style={{width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, position: 'absolute'}}>
        <Hero ref={heroRef} initPos={InitHero.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} updateFromHero={updateFromHero}></Hero>
        <NpcLayer ref={NpcLayerRef} initNpcs={Npcs} susList={susList} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} sceneryJuxt={sceneryJuxt}></NpcLayer>
        <SceneryLayer ref={sceneryLayerRef} scenery={Scenery}></SceneryLayer>
        <FxLayer ref={fxLayerRef} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} enemyCollision={enemyCollision}></FxLayer>
        <HudLayer ref={hudLayerRef}></HudLayer>
      </div>
    </GameContext.Provider>
  );
}
