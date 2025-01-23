import Hero from "../entities/Hero";
import NpcLayer from "../layers/NpcLayer";
import SceneryLayer from "../layers/SceneryLayer";
import FxLayer from "../layers/FxLayer";
import HudLayer from "../layers/HudLayer";

import {
  GRID_WIDTH,
  GRID_HEIGHT,
  GAME_WIDTH,
  GAME_HEIGHT
} from "../CONSTANTS";
import {
  angleBetween,
  distanceBetween
 } from "../METHODS";
import { Level } from "../levels/level1";
import { useEffect, useRef, useState } from 'react';

const REF_HERO = "Hero";
const REF_CHARACTERS = "Characters";
const REF_SCENERY = "Scenery";
const REF_FX = "Effects";
const REF_HUD = "Hud";

export default function GameScreen() {
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

  return (
    <div className="game-screen" style={{width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, position: 'absolute'}}>
      <Hero ref={heroRef} initPos={InitHero.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} updateFromHero={updateFromHero}></Hero>
      <NpcLayer ref={NpcLayerRef} initNpcs={Npcs} susList={susList} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} sceneryJuxt={sceneryJuxt}></NpcLayer>
      <SceneryLayer ref={sceneryLayerRef} scenery={Scenery}></SceneryLayer>
      <FxLayer ref={fxLayerRef} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} enemyCollision={enemyCollision}></FxLayer>
      <HudLayer ref={hudLayerRef}></HudLayer>
    </div>
  );
}
