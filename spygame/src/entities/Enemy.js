import { GRID_SIZE } from "../CONSTANTS";
import { randomPos } from "../METHODS";

export default function Enemy(params) {
  let { initPos } = params;

  if (!initPos) {
    initPos = randomPos();
  }

  return (
    <div className="enemy" style={{
      width: `${GRID_SIZE}px`,
      height: `${GRID_SIZE}px`,
      position: "absolute",
      left: `${initPos.x * GRID_SIZE}px`,
      top: `${initPos.y * GRID_SIZE}px`
    }}></div>
  );
}
