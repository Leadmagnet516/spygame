import { useState } from 'react';
import { ENTITY_MOOD } from '../CONSTANTS';
import { angleBetween, angleIsWithinArc, distanceBetween } from '../METHODS';

export default function useSusList() {
  const [ susList, setSusList ] = useState([]);

  function addSus(sus) {
    setSusList(a => [...a, sus]);
  }

  function updateSus(id, ...props) {

  }

  function checkSusList(npc, sceneryJuxt) {
    let susInView = [];
    susList.forEach(sus => {
      npc.mood = ENTITY_MOOD.OK;  // Temporary; implement a cooldown timer

      // CHECK WHETHER SUS IS OUTSIDE NPC'S VISUAL RANGE
      const dist = distanceBetween(sus.pos, npc.pos) 
      if (dist > npc.fov.range) {
        return npc;
      }

      // CHECK WHETHER SUS IS OUTSIDE NPC'S ANGLE OF VISION
      const dir = angleBetween(npc.pos, sus.pos);
      const halfFov = npc.fov.field / 2;
      const npcArcLimit1 = npc.aim - halfFov;
      const npcArcLimit2 = npc.aim + halfFov;
      if(!angleIsWithinArc(dir, npcArcLimit1, npcArcLimit2)) {
        return npc;
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
        return npc;
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
    })

    return npc;
  }

  return {addSus, checkSusList}
}