import { GRID_SIZE } from "../CONSTANTS";

export default function Hero(params) {
  const { pos } = params;
  return (
    <div className="hero" style={{
      width: `${GRID_SIZE}px`,
      height: `${GRID_SIZE}px`,
      position: "absolute",
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`
    }}></div>
  );
}
