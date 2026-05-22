import { useEffect, useRef, useState } from 'react';

const useScrollProgress = () => {
  const [state, setState] = useState({ scrollY: 0, scrollProgress: 0, scrollDelta: 0 });
  const rafRef = useRef(null);
  const lastY = useRef(0);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY || 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setState({
        scrollY: y,
        scrollProgress: Math.min(y / max, 1),
        scrollDelta: y - lastY.current,
      });
      lastY.current = y;
      rafRef.current = null;
    };

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return state;
};

export default useScrollProgress;
