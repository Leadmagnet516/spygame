import { useEffect, useState } from 'react';

export default function useMovementKeys() {
  const [ leftKeyDown, setLeftKeyDown ] = useState(false);
  const [ rightKeyDown, setRightKeyDown ] = useState(false);
  const [ upKeyDown, setUpKeyDown ] = useState(false);
  const [ downKeyDown, setDownKeyDown ] = useState(false);

  const handleKeyDown = e => {
    if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && !leftKeyDown) {
      setLeftKeyDown(true);
    }
    if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && !rightKeyDown) {
      setRightKeyDown(true);
    }
    if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && !upKeyDown) {
      setUpKeyDown(true);
    }
    if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && !downKeyDown) {
      setDownKeyDown(true);
    }
  }

  const handleKeyUp = e => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      setLeftKeyDown(false);
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      setRightKeyDown(false);
    }
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      setUpKeyDown(false);
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      setDownKeyDown(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  })

  return { leftKeyDown, rightKeyDown, upKeyDown, downKeyDown};
}