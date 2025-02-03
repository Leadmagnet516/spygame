import {
  GRID_SIZE,
  ENTITY_UPDATE,
  ENTITY_MOOD,
  ACTION_UPDATE_NPC_STATE
 } from '../CONSTANTS';
import { randomIntBetween } from '../METHODS';
import { useEffect, useState } from 'react';
import enemySprite from '../images/enemy.png'
import useGridPosition from '../hooks/useGridPosition';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameStateActive } from '../SELECTORS';
import useSusDetection from '../hooks/useSusDetection';

const ENEMY_TICK_DURATION = 1000;
const ODDS_AGAINST_MOVING = 2;
const ODDS_AGAINST_AIMING = 4;
const MAX_AIM_CHANGE = 1;
const BASE_HITPOINTS = 100;

export default function Enemy(props) {
  const { npc, damageTaken, alive, boundaryCollision, sceneryCollision, entityCollision, susList } = props;
  const { id, fov } = npc;
  const [ mood, setMood ] = useState(npc.mood);
  const { pos, updatePos } = useGridPosition(id, npc.pos, [boundaryCollision, sceneryCollision, entityCollision]);
  const [ flash, setFlash ] = useState(false);
  const [ aim, setAim ] = useState(npc.aim);
  const gameStateActive = useSelector(selectGameStateActive);
  const dispatch = useDispatch();
  const { checkSus } = useSusDetection();

  const updateAim = newAim => {
    setAim(newAim);
  }

  const handleHit = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 50);
  }

  useEffect(() => {
    if(!alive) {
      return(() => {})
    }
    handleHit();
  }, [damageTaken, alive])

  useEffect(() => {
    dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {id, pos}})
  }, [pos])

  useEffect(() => {
    const susInView = checkSus(npc, susList);
    if (susInView.length > 0 && mood !== ENTITY_MOOD.COMBAT) {
      setMood(ENTITY_MOOD.COMBAT);
      dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {mood: ENTITY_MOOD.COMBAT}})
    } else if (susInView.length === 0 && mood === ENTITY_MOOD.COMBAT) {
      setMood(ENTITY_MOOD.OK);
      dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {mood: ENTITY_MOOD.OK}})
    }
  }, susList)

  useEffect(() => {
    // TODO: Implement pathing
  }, [gameStateActive])

  let fovWidth = fov.range * GRID_SIZE;
  let fovHeight = Math.sin(fov.field) * fov.range * GRID_SIZE;
  return (
    <div className='entity enemy' style={{
      position: 'absolute',
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      filter: `brightness(${flash ? '1.5' : '1'}) hue-rotate(${npc.kind === 'technician' ? '90deg' : '0deg'})`,
      transform: `${alive ? 'none' : 'rotate(90deg)'}`
    }}>
      <img src={enemySprite} alt='hero' width={GRID_SIZE} height={GRID_SIZE}></img>
      <div className='fov-cone' style={{left: `${GRID_SIZE/2}px`, top: `${4 - fovHeight/2}px`, width: `${fovWidth}px`, height: `${fovHeight}px`, display: `${alive ? 'block' : 'none'}`, transform: `rotate(${aim}rad)`, transformOrigin: 'center left'}}>
        <div className='fov-boundary' style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: '.3', transform: `rotate(${-fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.SUS ? '#AA0' : mood === ENTITY_MOOD.COMBAT ? '#F00' : '#0A0'}`}}></div>
        <div className='fov-boundary' style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: '.3', transform: `rotate(${fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.SUS ? '#AA0' : mood === ENTITY_MOOD.COMBAT ? '#F00' : '#0A0'}`}}></div>
      </div>
    </div>
  );
}
