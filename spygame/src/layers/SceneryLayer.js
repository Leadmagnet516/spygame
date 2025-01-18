import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT
 } from "../CONSTANTS";

const GAMESTATE_WIDTH = GRID_WIDTH * GRID_SIZE;
const GAMESTATE_HEIGHT = GRID_HEIGHT * GRID_SIZE;

export default function SceneryLayer(props) {
  const { scenery } = props;
  return (
    <div className="scenery_layer" style={{
      width: `${GAMESTATE_WIDTH}px`,
      height: `${GAMESTATE_HEIGHT}px`,
      position: 'absolute'
    }}>
      {
        scenery.map((scn, idx) => {
          return (
            <div className="scenery" key={`scn_${idx}`} style={{
              width: `${GRID_SIZE}px`,
              height: `${GRID_SIZE}px`,
              position: "absolute",
              left: `${scn.x * GRID_SIZE}px`,
              top: `${scn.y * GRID_SIZE}px`
            }}></div>
          )
        })
      }
    </div>
  );
}
