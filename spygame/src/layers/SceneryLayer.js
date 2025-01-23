import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT
 } from "../CONSTANTS";

const GameScreen_WIDTH = GRID_WIDTH * GRID_SIZE;
const GameScreen_HEIGHT = GRID_HEIGHT * GRID_SIZE;

export default function SceneryLayer(props) {
  const { scenery } = props;
  return (
    <div className="scenery_layer" style={{
      width: `${GameScreen_WIDTH}px`,
      height: `${GameScreen_HEIGHT}px`,
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
