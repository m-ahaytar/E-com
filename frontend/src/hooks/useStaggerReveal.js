import { useEffect, useState } from 'react';
import useInView from './useInView';

const useStaggerReveal = ({ itemCount = 0, baseDelay = 80, threshold, rootMargin, triggerOnce = true } = {}) => {
  const [containerRef, isVisible] = useInView({ threshold, rootMargin, triggerOnce });
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!isVisible || revealedCount >= itemCount) return;

    const timer = setTimeout(() => {
      setRevealedCount((prev) => Math.min(prev + 1, itemCount));
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [isVisible, revealedCount, itemCount, baseDelay]);

  const visibilityArray = Array.from({ length: itemCount }, (_, i) => i < revealedCount);

  return [containerRef, isVisible, visibilityArray, revealedCount];
};

export default useStaggerReveal;
