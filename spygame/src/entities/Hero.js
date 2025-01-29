import { useContext, useEffect, useState } from 'react';
import {
  GRID_SIZE,
  EVENT_FIRE_WEAPON,
  ENTITY_UPDATE
} from "../CONSTANTS";
import { angleBetween, posToPix } from '../METHODS';
import spySprite from '../images/spy.png'
//import { ThemeContext } from "../App";
import { AppContext } from '../App';
import { GameContext } from "../screens/GameScreen";

const HERO_TICK_DURATION = 100;

export default function Hero(props) {
  const { initPos, boundaryCollision, sceneryCollision, updateFromHero } = props;
  const [ pos, setPos ] = useState(initPos);
  const [ aim, setAim ] = useState(0);

  const {xOffset, yOffset} = useContext(AppContext);
  const { gameStateActive } = useContext(GameContext);

  // TRACKING MOVEMENT KEYS HELD DOWN
  const [ leftKeyDown, setLeftKeyDown ] = useState(false);
  const [ rightKeyDown, setRightKeyDown ] = useState(false);
  const [ upKeyDown, setUpKeyDown ] = useState(false);
  const [ downKeyDown, setDownKeyDown ] = useState(false);
  const [ moveKeysDown, setMoveKeysDown ] = useState(0);
  const [ intervalId, setIntervalId ] = useState(0);
  const [ ticksElapsed, setTicksElapsed ] = useState(0);

  const updatePos = (h, v) => {
    setPos(pos => {
      const newPos =  {x: pos.x + h, y: pos.y + v};
      if(!boundaryCollision(newPos) && !sceneryCollision(newPos)) {
        return {x: pos.x + h, y: pos.y + v};
      }
      return pos;
    });

    updateFromHero("hero", ENTITY_UPDATE.MOVE, {pos});
  }

  const handleKeyDown = e => {
    if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && !leftKeyDown) {
      setLeftKeyDown(true);
      checkStartTick();
    }
    if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && !rightKeyDown) {
      setRightKeyDown(true);
      checkStartTick();
    }
    if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && !upKeyDown) {
      setUpKeyDown(true);
      checkStartTick();
    }
    if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && !downKeyDown) {
      setDownKeyDown(true);
      checkStartTick();
    }
  }

  const handleKeyUp = e => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      setLeftKeyDown(false);
      checkStopTick();
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      setRightKeyDown(false);
      checkStopTick();
    }
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      setUpKeyDown(false);
      checkStopTick();
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      setDownKeyDown(false);
      checkStopTick();
    }
  }

  const checkStartTick = () => { 
    if(moveKeysDown === 0) {
      moveTick();
      let newIntervalId = setInterval(() => {
        setTicksElapsed(ticksElapsed => ticksElapsed + 1);
      }, HERO_TICK_DURATION);
      setIntervalId(newIntervalId);
    }
    setMoveKeysDown(moveKeysDown => moveKeysDown + 1);
  }

  const checkStopTick = () => {
    if(moveKeysDown === 1) {
      clearInterval(intervalId);
    }
    setTicksElapsed(0);
    setMoveKeysDown(moveKeysDown => moveKeysDown - 1);
  }

  const moveTick = () => {
    if (!gameStateActive) return;
    if (leftKeyDown) {
      updatePos(-1, 0);
    }
    if (rightKeyDown) {
      updatePos(1, 0);
    }
    if (upKeyDown) {
      updatePos(0, -1);
    }
    if (downKeyDown) {
      updatePos(0, 1);
    }
  }

  const handleMouseMove = e => {
    if (!gameStateActive) return;
    const ox = e.clientX - xOffset - pos.x * GRID_SIZE - GRID_SIZE / 2;
    const oy = e.clientY - yOffset - pos.y * GRID_SIZE - GRID_SIZE / 2;
    let rot = Math.atan(oy/ox);
    if (ox < 0) {
      if (oy < 0) {
        rot -= Math.PI;
      } else {
        rot += Math.PI;
      }
    }

    rot = angleBetween({x: pos.x * GRID_SIZE + GRID_SIZE / 2, y: pos.y * GRID_SIZE + GRID_SIZE / 2}, {x: e.clientX - xOffset, y: e.clientY - yOffset})
    setAim(rot);
  }

  const handleMouseDown = e => {
    dispatchEvent(new CustomEvent(EVENT_FIRE_WEAPON, {detail: {pos, aim}}))
  }

  useEffect(() => {
    moveTick(ticksElapsed);
  }, [ticksElapsed]);

  // LISTENERS
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  })

  return (
    <div className="hero" style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
    }}>
      <img src={spySprite} alt="hero" width={GRID_SIZE} height={GRID_SIZE}></img>
      {/* <br></br><span style={{width: "48px", fontSize: "12px", textAlign: "center", color: "#FFFFFF"}}>{`(${pos.x}, ${pos.y})`}</span>
      <br></br><span style={{width: "48px", fontSize: "12px", textAlign: "center", color: "#FFFFFF"}}>{`${Math.round(aim / Math.PI / 2 * 360)} deg`}</span> */}
    </div>
  );
}
