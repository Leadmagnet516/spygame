import { useEffect, useState } from "react";
import { GRID_SIZE } from "../CONSTANTS";
import { angleBetween } from "../METHODS";

export default function useMouseAim(xOffset, yOffset, pos) {
  const [ aim, setAim ] = useState(0);
  const [ mouseDown, setMouseDown ] = useState(false);

  const handleMouseMove = e => {
    setAim(angleBetween({x: pos.x * GRID_SIZE + GRID_SIZE / 2, y: pos.y * GRID_SIZE + GRID_SIZE / 2}, {x: e.clientX - xOffset, y: e.clientY - yOffset}));
  }

  const handleMouseDown = e => {
    setMouseDown(true);
  }

  const handleMouseUp = e => {
    setMouseDown(false);
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  })

  return { aim, mouseDown };
}