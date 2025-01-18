import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  EVENT_NPC_MOVED
 } from "../CONSTANTS";
 import {
  randomPos
 } from "../METHODS";
 import Enemy from "../entities/Enemy";
import { useEffect } from "react";

const GAMESTATE_WIDTH = GRID_WIDTH * GRID_SIZE;
const GAMESTATE_HEIGHT = GRID_HEIGHT * GRID_SIZE;

export default function NpcLayer(props) {
  const { npcs, boundaryCollision, sceneryCollision, reportNpcPositions } = props;
  const npcPositions = []

  npcs.forEach(npc => {
    const pos = randomPos();
    npc.pos = pos;
    npcPositions.push({
      id: npc.id,
      pos
    })
  })

  reportNpcPositions(npcPositions);

  useEffect(() => {
    const handleNpcMoved = e => {
      const { id, pos } = e.detail;
      const idx = npcPositions.findIndex(npc => npc.id === id);
      npcPositions[idx].pos = pos;
      reportNpcPositions(npcPositions);
    }

    window.addEventListener(EVENT_NPC_MOVED, handleNpcMoved)
    return(() => {
      window.removeEventListener(EVENT_NPC_MOVED, handleNpcMoved);
    })
  });
  return (
    <div className="npc-layer" style={{
      width: `${GAMESTATE_WIDTH}px`,
      height: `${GAMESTATE_HEIGHT}px`
    }}>
      {
        npcs.map((npc, idx) => {
          return (
            <Enemy id={`npc_${idx}`} key={`npc_${idx}`} initPos={npc.pos} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision}></Enemy>
          )
        })
      }
    </div>
  );
}
