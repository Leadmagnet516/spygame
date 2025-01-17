import { GRID_SIZE } from "../CONSTANTS";
import { randomPos } from "../METHODS";

export default function Enemy(params) {
  let { pos } = params;

  if (!pos) {
    pos = randomPos();
  }

  return (
    <div className="enemy" style={{
      width: `${GRID_SIZE}px`,
      height: `${GRID_SIZE}px`,
      position: "absolute",
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`
    }}></div>
  );
}
