import { useEffect, useState } from 'react';

export default function useTickInterval(callback, ms) {
  const [ ticksElapsed, setTicksElapsed ] = useState(0);

  useEffect(() => {
    callback(ticksElapsed);
  }, [ticksElapsed])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTicksElapsed(ticksElapsed => ticksElapsed + 1);
    }, ms);
    return () => {
      clearInterval(interval);
    }
  }, []);
}