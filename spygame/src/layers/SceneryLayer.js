import {
  GRID_SIZE,
  GAME_WIDTH,
  GAME_HEIGHT
 } from "../CONSTANTS";

export default function SceneryLayer(props) {
  const { scenery } = props;
  return (
    <div className="scenery_layer" style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
      {
        scenery.map((scn, idx) => {
          return (
            <div className="scenery" key={`scn_${idx}`} style={{
              width: `${GRID_SIZE}px`,
              height: `${GRID_SIZE}px`,
              position: "absolute",
              left: `${scn.pos.x * GRID_SIZE}px`,
              top: `${scn.pos.y * GRID_SIZE}px`
            }}></div>
          )
        })
      }
    </div>
  );
}
