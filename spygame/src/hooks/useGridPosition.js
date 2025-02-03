import { useState } from 'react';
import { ENTITY_UPDATE } from '../CONSTANTS';

export default function useGridPosition(id, initPos, collisionTestCallbacks) {
  const [ pos, setPos ] = useState(initPos);
  const [ collisionVictimId, setCollisionVictimId ] = useState('');

  const updatePos = movement => {
    const newPos =  {x: pos.x + movement.hor, y: pos.y + movement.ver};
    let collision = '';

    collisionTestCallbacks.forEach(callback => {
      const collisionTestResult = callback(newPos);

      if (collisionTestResult.length > 0 && collisionTestResult !== id) {
        collision = collisionTestResult;
      }
    });

    if (collision) {
      setCollisionVictimId(collision);
    } else {
      setPos(newPos);
      setCollisionVictimId('');
    }
  }

  return { pos, updatePos, collisionVictimId };
}