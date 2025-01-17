import { GRID_SIZE, GRID_HEIGHT, GRID_WIDTH } from "./CONSTANTS";

export const randomIntBetween = (min, max) => {
  const range = max - min;
  return min + Math.round(Math.random() * range);
}

export const randomPos = () => {
  return {
    x: randomIntBetween(0, GRID_WIDTH),
    y: randomIntBetween(0, GRID_HEIGHT)
  }
}

export const pixToPos = pix => {
  return {x: Math.floor(pix.left / GRID_SIZE ), y: Math.floor(pix.top / GRID_SIZE )}
}