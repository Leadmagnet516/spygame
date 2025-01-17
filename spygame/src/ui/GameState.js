import Hero from "../entities/Hero";
import Enemy from "../entities/Enemy";
import {
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT
 } from "../CONSTANTS";
 import  {
  randomPos
 } from "../METHODS";
import { useEffect, useState } from 'react';

const GAMESTATE_WIDTH = GRID_WIDTH * GRID_SIZE;
const GAMESTATE_HEIGHT = GRID_HEIGHT * GRID_SIZE;

export default function GameState() {
  const [ heroPos, setHeroPos ] = useState({x: 0, y: 0});
  const [ enemy1Pos, setEnemy1Pos ] = useState(randomPos());
  const [ enemy2Pos, setEnemy2Pos ] = useState(randomPos());
  const [ enemy3Pos, setEnemy3Pos ] = useState(randomPos());

  const updateLoc = (h, v) => {
    let x = heroPos.x + h;
    let y = heroPos.y + v;
    setHeroPos({x, y});
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  })

  return (
    <div className="game-state" style={{width: `${GAMESTATE_WIDTH}px`, height: `${GAMESTATE_HEIGHT}px`}}>
      <Hero pos={heroPos}></Hero>
      <Enemy pos={enemy1Pos}></Enemy>
      <Enemy pos={enemy2Pos}></Enemy>
      <Enemy pos={enemy3Pos}></Enemy>
    </div>
  );
}
