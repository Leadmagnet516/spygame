import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ENTITY_MOOD,
  ACTION_SET_NPCS,
  ACTION_UPDATE_NPC_STATE
 } from '../CONSTANTS';
 import {
  angleBetween,
  distanceBetween,
  angleIsWithinArc,
 } from '../METHODS';
 import { selectNpcStates, selectSusList } from '../SELECTORS';
 import Enemy from '../entities/Enemy';
import { useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NpcLayer(props, ref)  {
  const { initNpcs, boundaryCollision, sceneryCollision, heroCollision } = props;
  const npcStates = useSelector(selectNpcStates);
  const susList = useSelector(selectSusList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: ACTION_SET_NPCS, payload: (initNpcs.map((npc, idx) => {
      return {
        id: `npc_${idx}`,
        ...npc,
        damageTaken: 0,
        alive: true,
        mood: ENTITY_MOOD.OK
      }
    }))})
  }, [])

  const checkSusList = npc => {
    /* let susInView = [];
    susList.forEach(sus => {
      npc.mood = ENTITY_MOOD.OK;  // Temporary; implement a cooldown timer

      // CHECK WHETHER SUS IS OUTSIDE NPC'S VISUAL RANGE
      const dist = distanceBetween(sus.pos, npc.pos) 
      if (dist > npc.fov.range) {
        return;
      }

      // CHECK WHETHER SUS IS OUTSIDE NPC'S ANGLE OF VISION
      const dir = angleBetween(npc.pos, sus.pos);
      const halfFov = npc.fov.field / 2;
      const npcArcLimit1 = npc.aim - halfFov;
      const npcArcLimit2 = npc.aim + halfFov;
      if(!angleIsWithinArc(dir, npcArcLimit1, npcArcLimit2)) {
        return;
      }

      // CHECK WHETHER NPC'S VIEW OF SUS IS BLOCKED BY SCENERY
      const scenery = sceneryJuxt(npc.pos);
      let blocked = false;

      scenery.forEach(scn => {
        if (scn.dist >= dist) return;

        if (angleIsWithinArc(dir, scn.angle1, scn.angle2)) {
          blocked = true;
        }
      })

      if (blocked) {
        return;
      }

      // ACT ON SUS-NESS!
      susInView.push(sus);
      switch(sus.type) {
        case 'foe':
          npc.mood = ENTITY_MOOD.COMBAT;
          break;
        case 'hazard':
          npc.mood = ENTITY_MOOD.SUS;
          break;
        default:
      }
    }) */

    return npc;
  }

  const updateFromNpc = (id, updateType, props) => {
    /* setNpcs(npcs.map(npc => {
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
    })); */
  }
/* 
  useEffect(() => {
    npcStates.forEach(npc => {
      checkSusList(npc);
    })
  }, [susList])
 */
  // TEMPLATE
  return (
    <div className='npc-layer' style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`
    }}>
      {
        npcStates.map((npc, idx) => {
          return (
            <Enemy key={npc.id} npc={npc} damageTaken={npc.damageTaken} alive={npc.alive} mood={npc.mood} boundaryCollision={boundaryCollision} sceneryCollision={sceneryCollision} heroCollision={heroCollision} susList={susList}></Enemy>
          )
        })
      }
    </div>
  );
}
