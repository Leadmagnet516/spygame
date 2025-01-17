import Hero from "./entities/Hero";
import Enemy from "./entities/Enemy";
import Bullet from "./fx/Bullet";
import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT
 } from "./CONSTANTS";
 import { SCENERY, ENEMIES } from "./levels/level1";
import { useRef, useState } from 'react';

const GAMESTATE_WIDTH = GRID_WIDTH * GRID_SIZE;
const GAMESTATE_HEIGHT = GRID_HEIGHT * GRID_SIZE;

export default function GameState() {
  const initHeroPos = {x: 20, y: 20};
  const [fx, setFx ] = useState([]);

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
    let collision = false;

    ENEMIES.forEach(enm => {
      if (pos.x === enm.x && pos.y === enm.y ) {
        collision = true;
      }
    })

    return collision;
  }

  const fireWeapon = (pos, aim) => {
    setFx(fx.concat(
      {
        type: "Bullet",
        initPos: pos,
        aim
      }
    ));
  }

  return (
    <div className="game-state" style={{width: `${GAMESTATE_WIDTH}px`, height: `${GAMESTATE_HEIGHT}px`}}>
    <Hero initPos={initHeroPos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} fireWeapon={fireWeapon}></Hero>
      <div key="enemy_layer">
        {
          ENEMIES.map((enm, idx) => {
            return (
              <Enemy key={`enemy_${idx}`} initPos={enm}></Enemy>
            )
          })
        }
      </div>
      <div key="scenery_layer">
        {
          SCENERY.map((scn, idx) => {
            return (
              <div className="scenery" key={`scenery${idx}`} style={{
                width: `${GRID_SIZE}px`,
                height: `${GRID_SIZE}px`,
                position: "absolute",
                left: `${scn.x * GRID_SIZE}px`,
                top: `${scn.y * GRID_SIZE}px`
              }}></div>
            )
          })
        }
      </div>
      <div key="fx_layer">
        {
          fx.map((fxi, idx) => {
            console.log(`Bullet fx_${idx} fired`)
            return (
              <Bullet initPos={fxi.initPos} aim={fxi.aim} id={`fx_${idx}`} key={`fx_${idx}`} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} enemyCollision={enemyCollision}></Bullet>
            )
          })
        }
      </div>
    </div>
  );
}
