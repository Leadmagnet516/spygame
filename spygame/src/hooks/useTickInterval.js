import { useEffect, useState } from "react";
import { TICK_SIZE } from "../CONSTANTS";

export default function useTickInterval(callback) {
  const [ ticksElapsed, setTicksElapsed ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicksElapsed(ticksElapsed + 1);
      callback();
    }, TICK_SIZE);
    return () => {
      clearInterval(interval);
    }
  }, [ticksElapsed]);
}