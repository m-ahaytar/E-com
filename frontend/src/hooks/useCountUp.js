import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const useCountUp = ({ end, duration = 1500, startOn = true }) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startTime = useRef(null);
  const endRef = useRef(end);

  useEffect(() => {
    if (!startOn) {
      endRef.current = end;
      return;
    }

    endRef.current = end;
    startTime.current = null;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      setValue(easeOutCubic(progress) * end);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, startOn]);

  return Math.round(value);
};

export default useCountUp;
