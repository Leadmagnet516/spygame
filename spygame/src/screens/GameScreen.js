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
import { Level } from "../levels/level1";
import { useEffect, useRef } from 'react';

const REF_HERO = "Hero";
const REF_CHARACTERS = "Characters";
const REF_SCENERY = "Scenery";
const REF_FX = "Effects";
const REF_HUD = "Hud";

export default function GameScreen() {
  const heroRef = useRef(REF_HERO);
  const NpcLayerRef = useRef(REF_CHARACTERS);
  const sceneryLayerRef = useRef(REF_SCENERY);
  const fxLayerRef = useRef(REF_FX);
  const hudLayerRef = useRef(REF_HUD);

  const { Scenery, Npcs, InitHero } = Level;

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
      if (pos.x === scn.x && pos.y === scn.y ) {
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

  return (
    <div className="game-screen" style={{width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, position: 'absolute'}}>
      <Hero ref={heroRef} initPos={InitHero.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision}></Hero>
      <NpcLayer ref={NpcLayerRef} initNpcs={Npcs} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision}></NpcLayer>
      <SceneryLayer ref={sceneryLayerRef} scenery={Scenery}></SceneryLayer>
      <FxLayer ref={fxLayerRef} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} enemyCollision={enemyCollision}></FxLayer>
      <HudLayer ref={hudLayerRef}></HudLayer>
    </div>
  );
}
