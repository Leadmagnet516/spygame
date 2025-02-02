import Hero from '../entities/Hero';
import NpcLayer from '../layers/NpcLayer';
import SceneryLayer from '../layers/SceneryLayer';
import FxLayer from '../layers/FxLayer';
import HudLayer from '../layers/HudLayer';
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_STATE,
  ACTION_CHANGE_GAME_STATE,
  EVENT_OPEN_MODAL,
  EVENT_CLOSE_MODAL,
  ENTITY_UPDATE
} from '../CONSTANTS';
import {
  angleBetween,
  distanceBetween
 } from '../METHODS';
import * as Level from '../world/levels/1/1_Silo.json';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPrevGameState, selectGameStateActive } from '../SELECTORS';

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
    
    return collision ? 'bnd' : '';
  }

  const sceneryCollision = pos => {
    let collision = false;

    Scenery.forEach(scn => {
      if (pos.x >= scn.x1 && pos.x <= scn.x2 &&
        pos.y >= scn.y1 && pos.y <= scn.y2 ) {
        collision = true;
      }
    })

    return collision ? 'scn' : '';
  }

  const npcCollision = pos => {
    const npcs = npcLayerRef.current.getNpcs();
    let collision = '';

    npcs.forEach(npc => {
      if (npc.alive && pos.x === npc.pos.x && pos.y === npc.pos.y ) {
        collision = npc.id;
      }
    })

    return collision;
  }

  const entityCollision = pos => {
    let collision = '';
    
    if (pos === heroPos) {
      collision = 'hero';
    } else {
      collision = npcCollision(pos);
    }

    return collision;
  }

  // INTER-LAYER INTERACTIONS
  const [ susList, setSusList ] = useState([
    {
      id: 'hero',
      type: 'foe',
      pos: InitHero.pos
    }
  ]);
  const [ heroPos, setHeroPos ] = useState({});
  const updateFromHero = (id, type, props) => {
    if (type === ENTITY_UPDATE.MOVE) {
      setHeroPos(props.pos);
    }
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
        angle1: angleBetween(pos, {x: scn.x1, y: scn.y1}),
        angle2: angleBetween(pos, {x: scn.x2, y: scn.y2}),
        dist: distanceBetween(pos, {x: scn.x1, y: scn.y1}),
      }
    });
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
      <NpcLayer ref={npcLayerRef} initNpcs={Npcs} susList={susList} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} entityCollision={entityCollision} sceneryJuxt={sceneryJuxt}></NpcLayer>
      <Hero ref={heroRef} initPos={InitHero.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} npcCollision={npcCollision} updateFromHero={updateFromHero}></Hero>
      <FxLayer ref={fxLayerRef} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} entityCollision={entityCollision}></FxLayer>
      <HudLayer ref={hudLayerRef}></HudLayer>
    </div>
  );
}
