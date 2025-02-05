import { useEffect, useState } from 'react';

export default function useTickInterval(callback, ms) {
  const [ ticksElapsed, setTicksElapsed ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicksElapsed(ticksElapsed + 1);
      callback();
    }, ms);
    return () => {
      clearInterval(interval);
    }
  }, [ticksElapsed]);
}