import { useCallback, useEffect, useRef, useState } from 'react';

const useInView = ({ threshold = 0.15, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(node);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    observerRef.current = observer;
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => () => {
    if (observerRef.current) observerRef.current.disconnect();
  }, []);

  return [ref, isVisible];
};

export default useInView;
