import { useState } from 'react';

export default function useGridPosition(id, initPos, collisionTestCallbacks) {
  const [ pos, setPos ] = useState(initPos);
  const [ collisionVictimId, setCollisionVictimId ] = useState('');

  const testCollisions = (newPos, tests) => {
    let collision = '';

    tests.forEach(callback => {
      const collisionTestResult = callback(newPos);

      if (collisionTestResult.length > 0 && collisionTestResult !== id) {
        collision = collisionTestResult;
      }
    });

    return collision;
  }

  const updatePos = (movement, enableSlipping = false, forcedNewPos) => {
    const { hor, ver } = movement;
    const newPos =  forcedNewPos || {x: pos.x + Math.round(hor), y: pos.y + Math.round(ver)};
    const originalCollision = testCollisions(newPos, collisionTestCallbacks);
    let slipPos = {}, slipCollision = ''

    if (enableSlipping && originalCollision) {
      slipPos = {x: pos.x, y: pos.y + Math.sign(ver)};
      slipCollision = testCollisions(slipPos, collisionTestCallbacks);

      if (slipCollision) {  
        slipPos = {x: pos.x + Math.sign(hor), y: pos.y};
        slipCollision = testCollisions(slipPos, collisionTestCallbacks);
      }
    }

    if (!originalCollision) {
      setPos(newPos);
      setCollisionVictimId('');
    } else if (enableSlipping) {
      if (slipCollision) {
        setCollisionVictimId(originalCollision);
      } else {
        setPos(slipPos)
        setCollisionVictimId('');
      }
    } else {
      setCollisionVictimId(originalCollision);
    }
  }

  return { pos, updatePos, collisionVictimId };
}