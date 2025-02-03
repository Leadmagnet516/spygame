import Hero from '../entities/Hero';
import NpcLayer from '../layers/NpcLayer';
import SceneryLayer from '../layers/SceneryLayer';
import FxLayer from '../layers/FxLayer';
import HudLayer from '../layers/HudLayer';
import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_STATE,
  ACTION_CHANGE_GAME_STATE,
  EVENT_OPEN_MODAL,
  EVENT_CLOSE_MODAL,
} from '../CONSTANTS';
import * as Level from '../world/levels/1/1_Silo.json';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPrevGameState, selectGameStateActive, selectHeroState, selectNpcStates, selectSceneryBlocks } from '../SELECTORS';

const REF_HERO = 'Hero';
const REF_CHARACTERS = 'Characters';
const REF_SCENERY = 'Scenery';
const REF_FX = 'Effects';
const REF_HUD = 'Hud';

export default function GameScreen( props ) {
  const gameStateActive = useSelector(selectGameStateActive);
  const prevGameState = useSelector(selectPrevGameState);
  const dispatch = useDispatch();

  // DEFINE REFS
  const heroRef = useRef(REF_HERO);
  const npcLayerRef = useRef(REF_CHARACTERS);
  const sceneryLayerRef = useRef(REF_SCENERY);
  const fxLayerRef = useRef(REF_FX);
  const hudLayerRef = useRef(REF_HUD);

  // LEVEL ATTRIBUTES
  const { Objective, Scenery, Npcs, InitHero } = Level;

  // COLLISION DETECTION
  const heroState = useSelector(selectHeroState);
  const npcStates = useSelector(selectNpcStates);
  const sceneryBlocks = useSelector(selectSceneryBlocks);

  const boundaryCollision = pos => {
    let collision = false;

    if (pos.x < 0 ||
      pos.y < 0 ||
      pos.x >= GRID_WIDTH ||
      pos.y >= GRID_HEIGHT
    ) {
      collision = true;
    }
    
    return collision ? 'bnd' : '';
  }

  const sceneryCollision = pos => {
    let collision = false;

    sceneryBlocks.forEach(scn => {
      if (pos.x >= scn.x1 && pos.x <= scn.x2 &&
        pos.y >= scn.y1 && pos.y <= scn.y2 ) {
        collision = true;
      }
    })

    return collision ? 'scn' : '';
  }

  const npcCollision = pos => {
    let collision = '';

    npcStates.forEach(npc => {
      if (npc.alive && pos.x === npc.pos.x && pos.y === npc.pos.y ) {
        collision = npc.id;
      }
    })

    return collision;
  }

  const entityCollision = pos => {
    let collision = '';
    
    if (pos === heroState.pos) {
      collision = 'hero';
    } else {
      collision = npcCollision(pos);
    }

    return collision;
  }

  // GAMESTATE MANAGEMENT
  const handleOpenModal = e => {
    if (gameStateActive) {
      dispatch({type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.PAUSED});
    }
  }

  const handleCloseModal = e => {
    if (prevGameState === GAME_STATE.ACTIVE) {
      dispatch({type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.ACTIVE});
    }
  }

  useEffect(() => {
    if (props.appInGameState) {
      dispatch({ type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.ACTIVE});
    }
  }, [props.appInGameState])

  // LISTENERS
  useEffect(() => {
    window.addEventListener(EVENT_OPEN_MODAL, handleOpenModal);
    window.addEventListener(EVENT_CLOSE_MODAL, handleCloseModal);

    return () => {
      window.removeEventListener(EVENT_OPEN_MODAL, handleOpenModal);
      window.removeEventListener(EVENT_CLOSE_MODAL, handleCloseModal);
    }
  });

  return (
    <div className='game-screen' style={{width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, position: 'absolute'}}>
      <SceneryLayer ref={sceneryLayerRef} scenery={Scenery}></SceneryLayer>
      <NpcLayer ref={npcLayerRef} initNpcs={Npcs} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} entityCollision={entityCollision}></NpcLayer>
      <Hero ref={heroRef} initPos={InitHero.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} npcCollision={npcCollision}></Hero>
      <FxLayer ref={fxLayerRef} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} entityCollision={entityCollision}></FxLayer>
      <HudLayer ref={hudLayerRef}>
        <div style={{position: "absolute", width: `${GRID_SIZE}px`, height: `${GRID_SIZE}px`, left: `${Objective.objectiveMarker.x * GRID_SIZE +10}px`, top: `${Objective.objectiveMarker.y * GRID_SIZE}px`, color: "#F00", fontWeight: "bold", fontSize: "24px"}}>
          { Objective.objectiveMarker.marker}
        </div>
    </HudLayer>
    </div>
  );
}
