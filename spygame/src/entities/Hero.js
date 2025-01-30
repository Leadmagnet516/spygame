import { forwardRef, useContext, useEffect, useState } from 'react';
import {
  GRID_SIZE,
  EVENT_FIRE_WEAPON,
  ENTITY_UPDATE
} from "../CONSTANTS";
import spySprite from '../images/spy.png'
import { AppContext } from '../App';
import { GameContext } from "../screens/GameScreen";
import useMovementKeys from "../hooks/useMovementKeys";
import useMouseAim from "../hooks/useMouseAim";
import useTickInterval from "../hooks/useTickInterval";
import useGridPosition from "../hooks/useGridPosition";

const Hero = forwardRef((props, ref) => {
  const { initPos, boundaryCollision, sceneryCollision, npcCollision, updateFromHero } = props;
  //const [ pos, setPos ] = useState(initPos);
  const {xOffset, yOffset} = useContext(AppContext);
  const { gameStateActive } = useContext(GameContext);
  const { leftKeyDown, rightKeyDown, upKeyDown, downKeyDown } = useMovementKeys();
  const { pos, updatePos } = useGridPosition("hero", initPos, updateFromHero, [boundaryCollision, sceneryCollision, npcCollision]);
  const { aim, mouseDown } = useMouseAim(xOffset, yOffset, pos);

/*   const updatePos = movement => {
    console.log("updatePos");
    setPos(pos => {
      const newPos =  {x: pos.x + movement.hor, y: pos.y + movement.ver};
      if(!boundaryCollision(newPos) && !sceneryCollision(newPos) && !npcCollision(newPos)) {
        return {x: pos.x + movement.hor, y: pos.y + movement.ver};
      }
      return pos;
    });

    updateFromHero("hero", ENTITY_UPDATE.MOVE, {pos});
  } */

  const onTick = () => {
    if (!gameStateActive) return;
    let movement = {hor: 0, ver: 0};

    if (leftKeyDown) {
      movement.hor -= 1;
    }
    if (rightKeyDown) {
      movement.hor += 1;
    }
    if (upKeyDown) {
      movement.ver -= 1;
    }
    if (downKeyDown) {
      movement.ver += 1;
    }

    if (movement.hor !== 0 || movement.ver !== 0) {
      updatePos(movement)
    }
    
  }

  useTickInterval(onTick);

  useEffect(() => {
    onTick();
  }, [leftKeyDown, rightKeyDown, upKeyDown, downKeyDown]);

  useEffect(() => {
    if(mouseDown) {
      dispatchEvent(new CustomEvent(EVENT_FIRE_WEAPON, {detail: {pos, aim}}))
    }
  }, [mouseDown]);

  return (
    <div className="entity hero" style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
    }}>
      <img src={spySprite} alt="hero" width={GRID_SIZE} height={GRID_SIZE}></img>
    </div>
  );
})

export default Hero;