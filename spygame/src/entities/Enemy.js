import {
  GRID_SIZE,
  ENTITY_MOOD,
  ENTITY_HABIT,
  ACTION_UPDATE_NPC_STATE,
  TICK_MS,
 } from '../CONSTANTS';
import {
  distanceBetween,
  angleBetweenPos,
  shortestArcBetween,
  angleIsWithinArc
} from '../METHODS';
import { useEffect, useState } from 'react';
import enemySprite from '../images/enemy.png'
import useGridPosition from '../hooks/useGridPosition';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameStateActive } from '../SELECTORS';
import useSusDetection from '../hooks/useSusDetection';
import useTickInterval from '../hooks/useTickInterval';
import usePrevious from '../hooks/usePrevious';

const NPC_MOVE_MS = 500;
const NPC_SCAN_SPEED = .01;

export default function Enemy(props) {
  const { npc, damageTaken, alive, boundaryCollision, sceneryCollision, entityCollision, susList } = props;
  const { id, fov, patrol } = npc;
  const [ mood, setMood ] = useState(npc.mood);
  const { pos, updatePos } = useGridPosition(id, patrol[0].pos, [boundaryCollision, sceneryCollision, entityCollision]);
  const [ flash, setFlash ] = useState(false);
  const [ aim, setAim ] = useState(3.14);
  const gameStateActive = useSelector(selectGameStateActive);
  const dispatch = useDispatch();
  const { checkSus } = useSusDetection();
  const [ step, setStep ] = useState(0);
  const [ habit, setHabit ] = useState(ENTITY_HABIT.IDLE);
  const prevHabit = usePrevious(habit);

  const [ aimChangeRate, setAimChangeRate ] = useState(0);
  const [ scanReps, setScanReps ] = useState(0);
  const [ aimNext, setAimNext ] = useState(0);

  const goToNextStep = () => {
    const nextStep = step + 1 >= patrol.length ? 0 : step + 1
    setStep(nextStep);
    setHabit(patrol[nextStep].habit);

    const { baseAim } = patrol[nextStep];
    setAimNext(baseAim);
    setAimChangeRate(shortestArcBetween(aim, baseAim)/30);
  }

  const onMoveTick = () => {
    if (!gameStateActive || !alive || habit !== ENTITY_HABIT.MOVE) return;

    const distToPatrolPoint = distanceBetween(pos, patrol[step].pos);
    if (distToPatrolPoint <= 0) {
      goToNextStep();
      return;
    }
    const xToPatrolPoint = patrol[step].pos.x - pos.x;
    const yToPatrolPoint = patrol[step].pos.y - pos.y
    const hor = Math.round(xToPatrolPoint/distToPatrolPoint);
    const ver = Math.round(yToPatrolPoint/distToPatrolPoint);

    updatePos({hor, ver});
  }

  useTickInterval(onMoveTick, NPC_MOVE_MS);

  const onTick = () => {
    // TODO: refactor this rat's nest
    let newAim;
    switch(habit) {
      case ENTITY_HABIT.SCAN :
        const {baseAim, scan} = patrol[step];
        if(!angleIsWithinArc(aim, baseAim - scan, baseAim + scan)) {
          newAim = aim + aimChangeRate;
          if (Math.abs(shortestArcBetween(newAim, aimNext)) < Math.abs(aimChangeRate)) {
            newAim = aimNext;
            setAimChangeRate(0);
          }
          updateAim(newAim);
        } else {
          if (Math.abs(aimChangeRate) !== NPC_SCAN_SPEED) setAimChangeRate(NPC_SCAN_SPEED);
          const { baseAim, scan, reps } = patrol[step];
          newAim = aim + aimChangeRate
          if (newAim >= baseAim + scan || newAim <= baseAim - scan) {
            const scanRepsCompleted = scanReps + .5;
            setScanReps(scanRepsCompleted);
            if (scanRepsCompleted >= reps) {
              setAimChangeRate(0);
              setScanReps(0);
              goToNextStep()
            } else {
              setAimChangeRate(-aimChangeRate);
            }
          }
          updateAim(newAim);
        }
        break;
      default :
        if (aim !== aimNext) {
          newAim = aim + aimChangeRate;
          if (Math.abs(shortestArcBetween(newAim, aimNext)) < Math.abs(aimChangeRate)) {
            newAim = aimNext;
            setAimChangeRate(0);
          }
          updateAim(newAim);
        }
        break;
    }
  }

  useTickInterval(onTick, TICK_MS);

  const updateAim = newAim => {
    setAim(newAim);
    dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {id, aim: newAim}});
    checkSusList();
  }

  const checkSusList = () => {
    const susInView = checkSus(npc, susList);
    if (susInView.length > 0 && mood !== ENTITY_MOOD.COMBAT) {
      setMood(ENTITY_MOOD.COMBAT);
      dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {mood: ENTITY_MOOD.COMBAT}})
    } else if (susInView.length === 0 && mood === ENTITY_MOOD.COMBAT) {
      setMood(ENTITY_MOOD.OK);
      dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {mood: ENTITY_MOOD.OK}})
    }
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
    checkSusList();
  }, [ susList, pos] )

  useEffect(() => {
    goToNextStep();
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
        <div className='fov-boundary' style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: '.3', transform: `rotate(${-fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.ALERT ? '#AA0' : mood === ENTITY_MOOD.COMBAT ? '#F00' : '#0A0'}`}}></div>
        <div className='fov-boundary' style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: '.3', transform: `rotate(${fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.ALERT ? '#AA0' : mood === ENTITY_MOOD.COMBAT ? '#F00' : '#0A0'}`}}></div>
      </div>
    </div>
  );
}
