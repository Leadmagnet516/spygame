import {
  GRID_SIZE,
  ENTITY_MOOD,
  ENTITY_TASK,
  ACTION_UPDATE_NPC_STATE,
  TICK_MS,
  SUS_LEVEL,
  EVENT_FIRE_WEAPON
 } from '../CONSTANTS';
import {
  distanceBetween,
  angleBetweenPos,
  shortestArcBetween,
  angleIsWithinArc
} from '../METHODS';
import { useEffect, useState } from 'react';
import useGridPosition from '../hooks/useGridPosition';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameStateActive } from '../SELECTORS';
import useSusDetection from '../hooks/useSusDetection';
import useTickInterval from '../hooks/useTickInterval';

import guard_n2 from '../images/guard_-2.png';
import guard_n1 from '../images/guard_-1.png';
import guard_0 from '../images/guard_0.png';
import guard_p1 from '../images/guard_1.png';
import guard_p2 from '../images/guard_2.png';
import guard_dead from '../images/guard_dead.png';

const TICKS_PER_MOVE = 50;
const SCAN_SPEED = .01;
const COOLDOWN_MS = 10000;
const CHANCE_TO_FIRE_WEAPON = .01;

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
  const [ habit, setHabit ] = useState(ENTITY_TASK.IDLE);
  const [ knownSus, setKnownSus ] = useState([]);

  const [ aimChangeRate, setAimChangeRate ] = useState(0);
  const [ scanReps, setScanReps ] = useState(0);
  const [ aimNext, setAimNext ] = useState(0);
  const [ timeTilCooldown, setTimeTilCooldown ] = useState(0);
  const [ destination, setDestination ] = useState({});
  const [ showSprite, setShowSprite ] = useState(0);

  // PATROL STEP MANAGEMENT
  const goToNextStep = () => {
    const nextStep = step + 1 >= patrol.length ? 0 : step + 1
    setStep(nextStep);
    goToStep(nextStep);
  }

  const returnToPatrol = () => {
    goToStep(step);
  }

  const goToStep = whichStep => {
    const { habit, baseAim } = patrol[whichStep];
    setHabit(habit);
    if (habit === ENTITY_TASK.MOVE) {
      setDestination(patrol[whichStep].pos);
    }

    setAimNext(baseAim);
    setAimChangeRate(shortestArcBetween(aim, baseAim)/30);
  }

  // TICK-BASED STUFF
  const onMoveTick = () => {
    if (!gameStateActive ||
        !alive ||
        (habit !== ENTITY_TASK.MOVE && habit !== ENTITY_TASK.COMBAT && habit !== ENTITY_TASK.SEARCH)) return;

    const distToDest = distanceBetween(pos, destination);
    if (distToDest <= 0) {
      if (mood === ENTITY_MOOD.OK) goToNextStep();
      return;
    }
    const xToPatrolPoint = destination.x - pos.x;
    const yToPatrolPoint = destination.y - pos.y;
    const hor = xToPatrolPoint/distToDest;
    const ver = yToPatrolPoint/distToDest;

    updatePos({hor, ver}, true);
  }

  const updateCooldown = () => {
    const ttc = timeTilCooldown - TICK_MS;
    setTimeTilCooldown(ttc);
    if (ttc <= 0) {
      forgetSus();
      updateMood(ENTITY_MOOD.OK);
      returnToPatrol();
    }
  }

  const goTowardSus = sus => {
    if(destination !== knownSus[0].pos) {
      setHabit(ENTITY_TASK.MOVE);
      setDestination(knownSus[0].pos);
    }
    updateAim(angleBetweenPos(pos, knownSus[0].pos));
  }

  const onTick = ticksElapsed => {
    if (!gameStateActive || !alive) return;
    // TODO: refactor this rat's nest

    let primeSus;
    switch(mood) {
      case ENTITY_MOOD.AGGRESSIVE :
        updateCooldown();
        primeSus = knownSus[0];
        if (primeSus && primeSus.pos) {
          goTowardSus(primeSus)
         }

        if (Math.random() < CHANCE_TO_FIRE_WEAPON) {
          dispatchEvent(new CustomEvent(EVENT_FIRE_WEAPON, {detail: {pos, aim, shooterId: id}}))
        }
        break;
      case ENTITY_MOOD.ALERTED :
        updateCooldown();
        primeSus = knownSus[0];
        if (primeSus && primeSus.pos) {
         goTowardSus(primeSus)
        }
        
        break;
      case ENTITY_MOOD.OK :
      default :
      let newAim;
      switch(habit) {
        case ENTITY_TASK.SCAN :
          const {baseAim, scan} = patrol[step];
          if(!angleIsWithinArc(aim, baseAim - scan, baseAim + scan)) {
            newAim = aim + aimChangeRate;
            if (Math.abs(shortestArcBetween(newAim, aimNext)) < Math.abs(aimChangeRate)) {
              newAim = aimNext;
              setAimChangeRate(0);
            }
            updateAim(newAim);
          } else {
            if (Math.abs(aimChangeRate) !== SCAN_SPEED) setAimChangeRate(SCAN_SPEED);
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
      break;
    }

    if (ticksElapsed % TICKS_PER_MOVE === 0) onMoveTick();
  }

  useTickInterval(onTick, TICK_MS);

  // UPDATERS
  const updateAim = newAim => {
    setAim(newAim);
    const sprite = Math.round(aim * (4 / Math.PI));
    setShowSprite(sprite);
    dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {id, aim: newAim}});
    checkSusInView();
  }

  const updateMood = newMood => {
    setMood(newMood);
    dispatch({ type: ACTION_UPDATE_NPC_STATE, payload: {newMood}})
  }

  // THREAT DETECTION
  const checkSusInView = () => {
    const susInView = checkSus(npc, susList);

    susInView.forEach(sus => {
      const alreadyKnown = checkAndUpdateKnownSus(sus);

      // If this is a newly-noticed sus and our alert level is too low, crank it up
      if (!alreadyKnown && mood < sus.susLevel) {
        updateMood(sus.susLevel);
      }

      // If this is a newly-noticed sus and/or a foe is still in view, reset the cooldown timer
      if (!alreadyKnown || sus.susLevel > SUS_LEVEL.ANOMALY) {
        setTimeTilCooldown(COOLDOWN_MS);
      }
    })
  }

  /**
   * @param {Object} susViewed - A suspicious item currently within enemy's FOV
   * @returns {boolean} - Do we know about this one already?
   */
  const checkAndUpdateKnownSus = susViewed => {
    const ind = knownSus.findIndex(sus => sus.id === susViewed.id);

    if ( ind === -1) {
      // This is a new one. Add it to the knownSus list and alert caller that it wasn't there already
      setKnownSus(knownSus => [
        ...knownSus,
        {
          id: susViewed.id,
          pos: susViewed.pos,
          susLevel: susViewed.susLevel,
          ignoreAfterCooldown: susViewed.susLevel === SUS_LEVEL.ANOMALY // No need to get set off EVERY time you find the same dead body
        }
      ].sort((a, b) => a.susLevel > b.susLevel));

      return false;
    }

    setKnownSus(knownSus => knownSus.map((sus, idx) => {
      return idx === ind ? {
        ...sus,
        pos: susViewed.pos
      } : sus;
    }));

    return true;
  }

  const forgetSus = () => {
    setKnownSus(knownSus => knownSus.filter(sus => sus.ignoreAfterCooldown));
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
    checkSusInView();
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
      filter: `brightness(${flash ? '1.5' : '1'}) hue-rotate(${npc.kind === 'technician' ? '90deg' : '0deg'})`
    }}>
      <div style={{display: alive ? 'block' : 'none'}}>
        <img src={guard_0} alt='guard' width={64} height={48} style={{display: showSprite === -4 || showSprite === 4 ? 'block' : 'none', transform: 'scaleX(-1) translateX(6px)'}}></img>
        <img src={guard_n1} alt='guard' width={64} height={48} style={{display: showSprite === -3 || showSprite === 5 ? 'block' : 'none', transform: 'scaleX(-1) translateX(6px)'}}></img>
        <img src={guard_n2} alt='guard' width={64} height={48} style={{display: showSprite === -2 ? 'block' : 'none'}}></img>
        <img src={guard_n1} alt='guard' width={64} height={48} style={{display: showSprite === -1 ? 'block' : 'none'}}></img>
        <img src={guard_0} alt='guard' width={64} height={48} style={{display: showSprite === 0 ? 'block' : 'none'}}></img>
        <img src={guard_p1} alt='guard' width={64} height={48} style={{display: showSprite === 1 ? 'block' : 'none'}}></img>
        <img src={guard_p2} alt='guard' width={64} height={48} style={{display: showSprite === 2 ? 'block' : 'none'}}></img>
        <img src={guard_p1} alt='guard' width={64} height={48} style={{display: showSprite === 3 || showSprite === -5 ? 'block' : 'none', transform: 'scaleX(-1) translateX(6px)'}}></img>
      </div>
      <img src={guard_dead} alt='guard' width={64} height={48} style={{display: alive ? 'none' : 'block'}}></img>
      <div className='fov-cone' style={{left: `${GRID_SIZE/2}px`, top: `${4 - fovHeight/2}px`, width: `${fovWidth}px`, height: `${fovHeight}px`, display: `${alive ? 'block' : 'none'}`, transform: `rotate(${aim}rad)`, transformOrigin: 'center left'}}>
        <div className='fov-boundary' style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: '.3', transform: `rotate(${-fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.ALERTED ? '#AA0' : mood === ENTITY_MOOD.AGGRESSIVE ? '#F00' : '#0A0'}`}}></div>
        <div className='fov-boundary' style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: '.3', transform: `rotate(${fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.ALERTED ? '#AA0' : mood === ENTITY_MOOD.AGGRESSIVE ? '#F00' : '#0A0'}`}}></div>
      </div>
    </div>
  );
}
