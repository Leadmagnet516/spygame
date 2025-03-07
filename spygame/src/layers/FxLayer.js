import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_FIRE_WEAPON,
  EVENT_BULLET_COLLISION,
  EVENT_NPC_HIT
} from '../CONSTANTS';
import Bullet from '../fx/Bullet';
import { useEffect, useState } from 'react';
import { GameContext } from '../screens/GameScreen';

const FxLayer = (props, ref) => {
  const { boundaryCollision, sceneryCollision, entityCollision } = props;
  const [fx, setFx ] = useState([]);

  const createBullet = (pos, aim, shooterId) => {
    setFx([...fx, {
        fxType: 'bull',
        id: `fx_${fx.length}${Math.random()}`,  // Dumb hack to make IDs more unique
        initPos: pos,
        aim,
        shooterId
      }]
    );
  }

  const destroyBullet = id => {
    const newFx = fx.filter(fxi => fxi.id !== id);
    setFx(newFx);
  }

  // LISTENERS
  // TODO: Move handlers outside useEffect
  useEffect(() => {
    const handleFireWeapon = e => {
      const { pos, aim, shooterId } = e.detail;
      createBullet(pos, aim, shooterId);
    }

    const handleBulletCollision = e => {
      const { bulletId, victimId, damage } = e.detail;
      if (victimId) {
        dispatchEvent(new CustomEvent(EVENT_NPC_HIT, {detail: {id: victimId, damage}}));
      }
      destroyBullet(bulletId);
    }

    window.addEventListener(EVENT_FIRE_WEAPON, handleFireWeapon);
    window.addEventListener(EVENT_BULLET_COLLISION, handleBulletCollision);
    return(() => {
      window.removeEventListener(EVENT_FIRE_WEAPON, handleFireWeapon);
      window.removeEventListener(EVENT_BULLET_COLLISION, handleBulletCollision);
    })
  })
  
  return (
    <div className='fx_layer' style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
    {
      fx.map((fxi) => {
        if(fxi.fxType === 'bull') {
          return (
            <Bullet initPos={fxi.initPos} aim={fxi.aim} id={fxi.id} shooterId={fxi.shooterId} key={fxi.id} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} entityCollision={entityCollision}></Bullet>
          )
        }
        return {};
      })
    }
    </div>
  );
}

export default FxLayer;