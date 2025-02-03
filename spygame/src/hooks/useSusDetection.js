import { angleBetween, angleIsWithinArc, distanceBetween } from '../METHODS';
import { useSelector } from 'react-redux';
import { selectSceneryBlocks } from '../SELECTORS';

export default function useSusDetection() {
  const sceneryBlocks = useSelector(selectSceneryBlocks);

  const sceneryJuxt = pos => {
    return sceneryBlocks.map(scn => {
      return {
        angle1: angleBetween(pos, {x: scn.x1, y: scn.y1}),
        angle2: angleBetween(pos, {x: scn.x2, y: scn.y2}),
        dist: distanceBetween(pos, {x: scn.x1, y: scn.y1}),
      }
    });
  }

  const checkSus = (npc, susList) => {
    let susInView = [];
    susList.forEach(sus => {
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
    })

    return susInView;
  }

  return {checkSus}
}