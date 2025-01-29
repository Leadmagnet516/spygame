import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_NPC_HIT,
  ENTITY_UPDATE,
  ENTITY_MOOD
 } from "../CONSTANTS";
 import {
  angleBetween,
  distanceBetween
 } from "../METHODS";
 import Enemy from "../entities/Enemy";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { GameContext } from "../screens/GameScreen";

const NpcLayer = forwardRef((props, ref) => {
  const { initNpcs, susList, boundaryCollision, sceneryCollision, sceneryJuxt } = props;
  const [ npcs, setNpcs ] = useState(initNpcs.map((npc, idx) => {
    return {
      id: `npc_${idx}`,
      ...npc,
      damageTaken: 0,
      alive: true,
      mood: ENTITY_MOOD.OK
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

  const checkSusList = npc => {
    let susInView = [];
    susList.forEach(sus => {
      npc.mood = ENTITY_MOOD.OK;  // Temporary; implement a cooldown timer

      // CHECK WHETHER SUS IS OUTSIDE NPC'S VISUAL RANGE
      const dist = distanceBetween(sus.pos, npc.pos) 
      if (dist > npc.fov.range) {
        //console.log(`${npc.id} has failed to spot ${sus.id} because of distance`);
        return;
      }

      // CHECK WHETHER SUS IS OUTSIDE NPC'S ANGLE OF VISION
      const dir = angleBetween(npc.pos, sus.pos);

      let arc = Math.abs(npc.aim - dir) % Math.PI;
      if (arc > Math.PI - npc.fov.field / 2) {
        arc -= Math.PI * 2;
      }

      if (arc > npc.fov.field / 2) {
        //console.log(`${npc.id} has failed to spot ${sus.id} at ${dir} while aiming ${npc.aim}`);
        return;
      }

      // CHECK WHETHER NPC'S VIEW OF SUS IS BLOCKED BY SCENERY
      const scenery = sceneryJuxt(npc.pos);
      const arcMin = .05;
      let blocked = false;

      scenery.forEach(scn => {
        if (Math.abs(scn.dir - dir) < arcMin && scn.dist <= dist) {
          blocked = true;
          return;
        }
      })

      if (blocked) {
        //console.log(`${npc.id} has failed to spot ${sus.id} because of scenery`);
        return;
      }
      
      // ACT ON SUS-NESS!
      //console.log(`${npc.id} has spotted ${sus.id} at direction ${dir}`)
      susInView.push(sus);
      switch(sus.type) {
        case "foe":
          npc.mood = ENTITY_MOOD.COMBAT;
          //npc.aim = dir;
          break;
        case "hazard":
          npc.mood = ENTITY_MOOD.SUS;
          break;
        default:
      }
    })

    return npc;
  }

  const updateFromNpc = (id, updateType, props) => {
    setNpcs(npcs.map(npc => {
      if(npc.id === id) {
        let updatedNpc;
        switch(updateType) {
          case ENTITY_UPDATE.MOVE:
            updatedNpc = checkSusList({
              ...npc,
              pos: props.pos || npc.pos,
            });
            break;
          case ENTITY_UPDATE.AIM:
            updatedNpc = checkSusList({
              ...npc,
              aim: props.aim || npc.aim
            });
            break;
          case ENTITY_UPDATE.DEAD:
            updatedNpc = {
              ...npc,
              alive: false
            }
            break;
          default:
            updatedNpc = npc;
            break;
          }
        return updatedNpc;
      } else {
        return npc;
      }
    }));
  }

  useEffect(() => {
    npcs.forEach(npc => {
      checkSusList(npc);
    })
  }, [susList])

  // LISTENERS
  useEffect(() => {
    window.addEventListener(EVENT_NPC_HIT, handleNpcHit);
    return(() => {
      window.removeEventListener(EVENT_NPC_HIT, handleNpcHit);
    })
  });

  // TEMPLATE
  return (
    <div className="npc-layer" style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`
    }}>
      {
        npcs.map((npc, idx) => {
          return (
            <Enemy key={npc.id} npc={npc} damageTaken={npc.damageTaken} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} updateFromNpc={updateFromNpc}></Enemy>
          )
        })
      }
    </div>
  );
})

export default NpcLayer;
