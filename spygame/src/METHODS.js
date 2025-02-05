import { GRID_SIZE, GRID_HEIGHT, GRID_WIDTH } from './CONSTANTS';

export const randomIntBetween = (min, max) => {
  const range = max - min;
  return min + Math.round(Math.random() * range);
}

export const randomPos = () => {
  return {
    x: randomIntBetween(0, GRID_WIDTH - 1),
    y: randomIntBetween(0, GRID_HEIGHT - 1)
  }
}

export const pixToPos = pix => {
  return {x: Math.floor(pix.left / GRID_SIZE ), y: Math.floor(pix.top / GRID_SIZE )}
}

export const posToPix = pos => {
  return {
    left: pos.x * GRID_SIZE,
    top: pos.y * GRID_SIZE
  }
}

export const posIsInArea = (pos, area) => {
  return (
    pos.x >= area.x1 &&
    pos.x <= area.x2 &&
    pos.y >= area.y1 &&
    pos.y <= area.y2
  )
}

export const radToDeg = rad => {
  return rad / (Math.PI * 2) * 360;
}

export const angleBetweenPos = (pos1, pos2) => {
  const ox = pos2.x - pos1.x;
  const oy = pos2.y - pos1.y;
  let angle = Math.atan(oy/ox);

  if (ox < 0) {
    if (oy < 0) {
      angle -= Math.PI;
    } else {
      angle += Math.PI;
    }
  }

  return angle;
}

export const shortestArcBetween = (angle1, angle2) => {
  let norm1 = normalizeToZero(angle1);
  let norm2 = normalizeToZero(angle2);

  return norm2 - norm1;
}

export const normalizeToZero = angle => {
  let norm = angle;
  while (norm < 0) norm += 2 * Math.PI;
  return norm % Math.PI;
}

export const normalizeToAngle = (angle1, angle2) => {
  let norm = angle1 - angle2;
  while (norm < 0) norm += 2 * Math.PI;
  return norm;
}

export const angleIsWithinArc = (angle, arcLimit1, arcLimit2) => {
 const aNorm = normalizeToAngle(angle, arcLimit1);
 const a2Norm = normalizeToAngle(arcLimit2, arcLimit1);
 return ((a2Norm < Math.PI && aNorm < a2Norm) ||
         (a2Norm > Math.PI && aNorm > a2Norm));
}

export const distanceBetween = (pos1, pos2) => {
  const ox = pos2.x - pos1.x;
  const oy = pos2.y - pos1.y;

  return Math.sqrt(ox * ox + oy * oy);
}