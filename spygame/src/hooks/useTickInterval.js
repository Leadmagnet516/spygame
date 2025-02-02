import { useEffect, useState } from 'react';
import { TICK_MS } from '../CONSTANTS';

export default function useTickInterval(callback) {
  const [ ticksElapsed, setTicksElapsed ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicksElapsed(ticksElapsed + 1);
      callback();
    }, TICK_MS);
    return () => {
      clearInterval(interval);
    }
  }, [ticksElapsed]);
}