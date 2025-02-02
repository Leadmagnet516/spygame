import { forwardRef, useContext, useEffect } from 'react';
import {
  GRID_SIZE,
  EVENT_FIRE_WEAPON
} from '../CONSTANTS';
import spySprite from '../images/spy.png'
import { AppContext } from '../App';
import useMovementKeys from '../hooks/useMovementKeys';
import useMouseAim from '../hooks/useMouseAim';
import useTickInterval from '../hooks/useTickInterval';
import useGridPosition from '../hooks/useGridPosition';
import { useSelector } from 'react-redux';
import { selectGameStateActive } from '../SELECTORS';

const Hero = forwardRef((props, ref) => {
  const { initPos, boundaryCollision, sceneryCollision, npcCollision, updateFromHero } = props;
  const {xOffset, yOffset} = useContext(AppContext);
  const gameStateActive = useSelector(selectGameStateActive);
  const { leftKeyDown, rightKeyDown, upKeyDown, downKeyDown } = useMovementKeys();
  const { pos, updatePos } = useGridPosition('hero', initPos, updateFromHero, [boundaryCollision, sceneryCollision, npcCollision]);
  const { aim, mouseDown } = useMouseAim(xOffset, yOffset, pos);

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
    <div className='entity hero' style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
    }}>
      <img src={spySprite} alt='hero' width={GRID_SIZE} height={GRID_SIZE}></img>
    </div>
  );
})

export default Hero;