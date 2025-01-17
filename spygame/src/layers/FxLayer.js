import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  EVENT_FIRE_WEAPON,
  EVENT_BULLET_COLLISION,
  EVENT_BULLET_HIT_ENEMY
 } from "../CONSTANTS";
import Bullet from "../fx/Bullet";
import { useEffect, useState } from "react";

const GAMESTATE_WIDTH = GRID_WIDTH * GRID_SIZE;
const GAMESTATE_HEIGHT = GRID_HEIGHT * GRID_SIZE;

const FxLayer = (props, ref) => {
  const { boundaryCollision, sceneryCollision, enemyCollision } = props;
  const [fx, setFx ] = useState([]);

  const createBullet = (pos, aim) => {
    setFx([...fx, {
        fxType: "bull",
        id: `fx_${fx.length}${Math.random()}`,  // Dumb hack to make IDs more unique
        initPos: pos,
        aim
      }]
    );
  }

  const destroyBullet = id => {
    const newFx = fx.filter(fxi => fxi.id !== id);
    setFx(newFx);
  }

  useEffect(() => {
    const handleFireWeapon = e => {
      const { pos, aim } = e.detail;
      createBullet(pos, aim);
    }

    const handleBulletCollision = e => {
      if (e.detail.victimId) {
        dispatchEvent(new CustomEvent(EVENT_BULLET_HIT_ENEMY, {detail: {id: e.detail.victimId}}));
      }
      destroyBullet(e.detail.bulletId);
    }

    window.addEventListener(EVENT_FIRE_WEAPON, handleFireWeapon);
    window.addEventListener(EVENT_BULLET_COLLISION, handleBulletCollision);
    return(() => {
      window.removeEventListener(EVENT_FIRE_WEAPON, handleFireWeapon);
      window.removeEventListener(EVENT_BULLET_COLLISION, handleBulletCollision);
    })
  })
  
  return (
    <div className="fx_layer" style={{
      width: `${GAMESTATE_WIDTH}px`,
      height: `${GAMESTATE_HEIGHT}px`
    }}>
    {
      fx.map((fxi) => {
        if(fxi.fxType === 'bull') {
          return (
            <Bullet initPos={fxi.initPos} aim={fxi.aim} id={fxi.id} key={fxi.id} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} enemyCollision={enemyCollision}></Bullet>
          )
        }
        return {};
      })
    }
    </div>
  );
}

export default FxLayer;