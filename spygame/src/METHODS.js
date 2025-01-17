  import { GRID_HEIGHT, GRID_WIDTH } from "./CONSTANTS";
  
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