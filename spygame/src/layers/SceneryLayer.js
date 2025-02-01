import {
  GRID_SIZE,
  GAME_WIDTH,
  GAME_HEIGHT
} from "../CONSTANTS";
import siloBg from "../world/levels/1/Silo.png";
import { GameContext } from "../screens/GameScreen";

export default function SceneryLayer(props) {
  const { scenery } = props;
  return (
    <div className="scenery_layer" style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
    <img src={siloBg} alt="bg" width={GAME_WIDTH} height={GAME_HEIGHT}></img>
      {/* {
        scenery.map((scn, idx) => {
          return (
            <div className="scenery" key={`scn_${idx}`} style={{
              width: `${(scn.x2 - scn.x1 + 1) * GRID_SIZE}px`,
              height: `${(scn.y2 - scn.y1 + 1) * GRID_SIZE}px`,
              position: "absolute",
              left: `${scn.x1 * GRID_SIZE}px`,
              top: `${scn.y1 * GRID_SIZE}px`
            }}></div>
          )
        })
      } */}
    </div>
  );
}
