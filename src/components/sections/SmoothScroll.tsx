import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue
} from "motion/react";

interface UseScrollPercentageOptions {
  threshold?: number;
}

const useScrollPercentage = ({ threshold = 0.1 }: UseScrollPercentageOptions = {}): [React.RefObject<HTMLDivElement>, number] => {
  const [percentage, setPercentage] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const handleScroll = (): void => {
            if (ref.current) {
              const rect = ref.current.getBoundingClientRect();
              const windowHeight = window.innerHeight;
              const elementHeight = rect.height;
              const scrolled = Math.max(0, windowHeight - rect.top);
              const total = windowHeight + elementHeight;
              const percentage = Math.min(1, scrolled / total);
              setPercentage(percentage);
            }
          };

          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, percentage];
};

const SmoothScroll: React.FC = () => {
  const scrollRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState<number>(0);
  const [viewportW, setViewportW] = useState<number>(0);

  const scrollPerc: MotionValue<number> = useMotionValue(0);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      setScrollRange(scrollRef.current.scrollWidth);
    }
  }, []);

  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      setViewportW(entry.contentRect.width);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => onResize(entries));
    if (ghostRef.current) {
      resizeObserver.observe(ghostRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [onResize]);

  const [containerRef, percentage] = useScrollPercentage({
    threshold: 0.1
  });

  useEffect(() => {
    console.log("Scroll percentage",percentage)
    scrollPerc.set(percentage * 1.4);
  }, [percentage, scrollPerc]);

  const transform = useTransform(
    scrollPerc,
    [0, 1],
    [0, -scrollRange + viewportW]
  );
  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);

  return (
    <div ref={containerRef} className="relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.section
          ref={scrollRef}
          style={{ x: spring }}
          className="flex"
        >
          <div className="flex gap-4">
            <div className="w-240 h-120 bg-neutral shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-red-400 shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-blue-400 shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-green-400 shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-yellow-400 shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-purple-400 shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-pink-400 shrink-0 rounded-lg" />
            <div className="w-240 h-120 bg-neutral shrink-0 rounded-lg" />
          </div>
        </motion.section>
      </div>
      {/* Multiply the scroll range times each div individually */}
      <div ref={ghostRef} style={{ height: 560 * 8 }} className="w-full" />
    </div>
  );
};

export default SmoothScroll;