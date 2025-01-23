import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  EVENT_NPC_HIT,
  EVENT_NPC_MOVED
 } from "../CONSTANTS";
 import Enemy from "../entities/Enemy";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const GameScreen_WIDTH = GRID_WIDTH * GRID_SIZE;
const GameScreen_HEIGHT = GRID_HEIGHT * GRID_SIZE;

const NpcLayer = forwardRef((props, ref) => {
  const { initNpcs, boundaryCollision, sceneryCollision } = props;
  const [ npcs, setNpcs ] = useState(initNpcs.map((npc, idx) => {
    return {
      id: `npc_${idx}`,
      ...npc,
      damageTaken: 0,
      alive: true
    }
  }));

  useImperativeHandle(ref, () => ({
    getNpcs() {
      return npcs;
    }
  }));

  const handleNpcHit = e => {
    const { id, damage } = e.detail;
    setNpcs(npcs.map(npc => {
      if(npc.id === id) {
        return {
          ...npc,
          damageTaken: npc.damageTaken + damage
        }
      } else {
        return npc;
      }
    }));
  }

  const handleNpcDead = id => {
    setNpcs(npcs.map(npc => {
      if(npc.id === id) {
        return {
          ...npc,
          alive: false
        }
      } else {
        return npc;
      }
    }));
  }

  const handleNpcMoved = (id, pos) => {
    console.log(`NPC ${id} has moved to ${pos.x}, ${pos.y}`);
    setNpcs(npcs.map(npc => {
      if(npc.id === id) {
        return {
          ...npc,
          pos
        }
      } else {
        return npc;
      }
    }));
  }

  useEffect(() => {
    const handleNpcMoved = e => {
      const { id, pos } = e.detail;
      const idx = npcs.findIndex(npc => npc.id === id);
      npcs[idx].pos = pos;
    }

    window.addEventListener(EVENT_NPC_MOVED, handleNpcMoved);
    window.addEventListener(EVENT_NPC_HIT, handleNpcHit);
    return(() => {
      window.removeEventListener(EVENT_NPC_MOVED, handleNpcMoved);
      window.removeEventListener(EVENT_NPC_HIT, handleNpcHit);
    })
  });
  return (
    <div className="npc-layer" style={{
      width: `${GameScreen_WIDTH}px`,
      height: `${GameScreen_HEIGHT}px`
    }}>
      {
        npcs.map((npc, idx) => {
          return (
            <Enemy id={npc.id} key={npc.id} damageTaken={npcs[idx].damageTaken} initPos={npc.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} handleNpcMoved={handleNpcMoved} handleNpcDead={handleNpcDead}></Enemy>
          )
        })
      }
    </div>
  );
})

export default NpcLayer;
