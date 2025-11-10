import { useRef, useEffect, useCallback, memo } from 'react';
import { CometCard } from '@/components/ui/comet-card';

interface CardProps {
  name: string;
  stat?: string | undefined | null;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const Card: React.FC<CardProps> = memo(({ name, stat, index, activeIndex, setActiveIndex }) => {
  const cardRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.intersectionRatio > 0.5) {
      setActiveIndex(index);
    } else if (entry.intersectionRatio < 0.5 && index === activeIndex && index > 0) {
      setActiveIndex(index - 1);
    }
  }, [index, setActiveIndex, activeIndex]);

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, { 
        threshold: [0.5],
        rootMargin: '0px'
      });
    }

    if (cardRef.current) {
      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current && observerRef.current) {
        observerRef.current.unobserve(cardRef.current);
      }
    };
  }, [handleIntersection]);

  const isVisible = index >= activeIndex;

  return (
    <figure 
      ref={cardRef}
      className={`sticky top-0 h-screen grid place-content-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 invisible'
      }`}
    >
      <CometCard className="overflow-visible!">
        <div
          className="flex w-60 md:w-80 cursor-pointer flex-col items-stretch rounded-2xl border-0 pt-2 bg-[radial-gradient(circle,#0891b2_0%,#ffffff_100%)]"
          aria-label="View invite F7RA"
        >
          <div className="mx-2 flex-1 border border-gray-200 rounded-xl">
            <div className="relative mt-2 aspect-3/4 w-full">
              <img
                loading="lazy"
                className="absolute h-full md:w-[420px] md:max-w-[420px] w-[240px] max-w-[240px] md:transform -translate-x-6 md:-translate-x-18 z-150 -translate-y-10 md:-translate-y-2 object-cover"
                alt={`${name} background`}
                src={`/${name}.png`}
                style={{
                  opacity: 1,
                  display: "block",
                  scale: "1.14",
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex shrink-0 items-center justify-between p-4 font-mono text-black">
            <div className="text-[8px] md:text-xs">{name}</div>
            <div className="text-[6px] md:text-xs text-gray-800 opacity-50">{stat || 'MVP Killer'}</div>
          </div>
        </div>
      </CometCard>
    </figure>
  );
});

Card.displayName = 'Card';

