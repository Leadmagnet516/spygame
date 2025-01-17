import { useEffect, useState } from 'react';
import {
  GRID_SIZE
} from "../CONSTANTS";

export default function Hero(params) {
  const { initPos, boundaryCollision, sceneryCollision, fireWeapon } = params;
  const [ pos, setPos ] = useState(initPos);
  const [ aim, setAim ] = useState(0);

  const updateLoc = (h, v) => {
    const newPos =  {x: pos.x + h, y: pos.y + v};
    if(!boundaryCollision(newPos) && !sceneryCollision(newPos)) {
      setPos(newPos);
    }
  }

  useEffect(() => {
    const handleKeyDown = e => {
      switch(e.key) {
        case "ArrowLeft" :
          updateLoc(-1, 0);
          break;
        case "ArrowRight" :
          updateLoc(1, 0);
          break;
        case "ArrowUp" :
          updateLoc(0, -1);
          break;
        case "ArrowDown" :
          updateLoc(0, 1);
          break;
        default :
          break;
      }
    }

    const handleMouseMove = e => {
      const ox = e.clientX - pos.x * GRID_SIZE - GRID_SIZE / 2;
      const oy = e.clientY - pos.y * GRID_SIZE - GRID_SIZE / 2;
      let rot = Math.atan(oy/ox);
      if (ox < 0) {
        if (oy < 0) {
          rot -= Math.PI;
        } else {
          rot += Math.PI;
        }
      }
      setAim(rot);
    }

    const handleMouseDown = e => {
      fireWeapon(pos, aim);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  })

  return (
    <div className="hero" style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      transform: `rotate(${aim}rad)`
    }}></div>
  );
}
