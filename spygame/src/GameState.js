import Hero from "./entities/Hero";
import CharacterLayer from "./layers/CharacterLayer";
import SceneryLayer from "./layers/SceneryLayer";
import FxLayer from "./layers/FxLayer";

import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT
 } from "./CONSTANTS";
 import { SCENERY, npcs } from "./levels/level1";
import { useRef } from 'react';

const GAMESTATE_WIDTH = GRID_WIDTH * GRID_SIZE;
const GAMESTATE_HEIGHT = GRID_HEIGHT * GRID_SIZE;

const REF_HERO = "Hero";
const REF_CHARACTERS = "Characters";
const REF_SCENERY = "Scenery";
const REF_FX = "Effects";

export default function GameState() {
  console.log(`Mounting GameState at ${GAMESTATE_WIDTH} / ${GAMESTATE_HEIGHT}`)
  const heroRef = useRef(REF_HERO);
  const characterLayerRef = useRef(REF_CHARACTERS);
  const sceneryLayerRef = useRef(REF_SCENERY);
  const fxLayerRef = useRef(REF_FX);

  const initHeroPos = {x: 20, y: 20};
  let npcPositions = [];

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

    SCENERY.forEach(scn => {
      if (pos.x === scn.x && pos.y === scn.y ) {
        collision = true;
      }
    })

    return collision;
  }


  const enemyCollision = pos => {
    let collision = '';

    npcPositions.forEach(npc => {
      if (pos.x === npc.pos.x && pos.y === npc.pos.y ) {
        collision = npc.id;
      }
    })

    return collision;
  }

  const reportNpcPositions = npcPos => {
    console.log('npcs reported at', npcPos);
    npcPositions = npcPos;
  }

  return (
    <div className="game-state" style={{width: `${GAMESTATE_WIDTH}px`, height: `${GAMESTATE_HEIGHT}px`}}>
      <Hero ref={heroRef} initPos={initHeroPos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision}></Hero>
      <CharacterLayer ref={characterLayerRef} npcs={npcs} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} reportNpcPositions={reportNpcPositions}></CharacterLayer>
      <SceneryLayer ref={sceneryLayerRef} scenery={SCENERY}></SceneryLayer>
      <FxLayer ref={fxLayerRef} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} enemyCollision={enemyCollision}></FxLayer>
    </div>
  );
}
