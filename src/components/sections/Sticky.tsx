'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import { useRef, useEffect, useState } from 'react';

import { Card } from './Card';
import ClashCard from './ClashCard';
import { animate, scroll } from 'motion';
import TextAnimation from '@/components/ui/scroll-text';
import HorizontalScroller from './Horizontal';


export default function Sticky(): JSX.Element {
    const container = useRef(null);
    const ulRef = useRef<HTMLUListElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const items = document.querySelectorAll('li');

    if (ulRef.current) {
      const controls = animate(
        ulRef.current,
        {
          transform: ['none', `translateX(-${items.length - 1}00vw)`],
        } as any
      );
      const section = document.querySelector('section');
      if (section) {
        scroll(controls, { target: section });
      }
    }

    const segmentLength = 1 / items.length;
    items.forEach((item, i) => {
      const header = item.querySelector('h2');

      if (header) {
        const section = document.querySelector('section');
        if (section) {
          scroll(animate([header] as any, { x: [800, -800] } as any), {
            target: section,
            offset: [
              [i * segmentLength, 1],
              [(i + 1) * segmentLength, 0],
            ],
          });
        }
      }
    });
  }, []);

  return (
    <ReactLenis root>
      <main className='bg-black' ref={container}>
        <div className='wrapper'>
          <section className='text-white h-screen w-full bg-slate-950 grid place-content-center sticky top-0'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
            {/* <h1 className='2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]'> */}
              <TextAnimation
                as='p'
                letterAnime={true}
                text="In 2025 you played 202 ranked games ✨"
                classname='text-7xl max-w-screen text-white lowercase 2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]'
                variants={{
                    hidden: { filter: 'blur(4px)', opacity: 0, y: 20 },
                    visible: {
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.2,
                    },
                    },
                }}
                />
            {/* </h1> */}
            <h1 className='1xl:text-xl text-3xl px-8 font-semibold text-center tracking-tight leading-[120%] mt-40'>which means 👇</h1>
          </section>
          <div className='h-[200vh] bg-slate-950 text-white grid place-content-center'></div>
          <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                {/* <h1 className='2xl:text-7xl text-4xl px-8 font-semibold text-center tracking-tight leading-[120%]'> */}
                    <TextAnimation
                    text='Thats 50 ARAM, 75 league and 80 Fillie.'
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-8xl text-7xl max-w-screen mx-auto font-medium capitalize'
                    />
                {/* </h1> */}
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
            
        </div>
        <div className="wrapper">
            <HorizontalScroller></HorizontalScroller>
        </div>

        <section className='text-white w-full bg-slate-950'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              <StickyCard image='/Hecarim.png' index={0} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <StickyCard image='/Nunu.png' index={1} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <StickyCard image='/Nidalee.png' index={2} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <StickyCard image='/Graves.png' index={3} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-4xl px-8 font-medium text-right tracking-tight leading-[120%]'>
                Copied & Paste Every Component you want and make an creative
                website 😎
              </h1>
            </div>
          </div>
        </section>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                {/* <h1 className='2xl:text-7xl text-4xl px-8 font-semibold text-center tracking-tight leading-[120%]'> */}
                    <TextAnimation
                    text='Terimaki Jaiho.'
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-8xl text-7xl max-w-md mx-auto font-medium capitalize'
                    />
                {/* </h1> */}
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>
        
        <section className='text-white w-full bg-slate-950'>
            <div className='grid gap-2'>
              <figure className='grid place-content-center -skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
              <figure className='grid place-content-center skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
              <figure className='grid place-content-center -skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
              <figure className='grid place-content-center skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
            </div>
          
        </section>

        <section className='text-white w-full bg-slate-950'>
          <div className='grid grid-cols-2'>
            <div className='sticky top-0 h-screen flex items-center justify-center'>
              <h1 className='2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]'>
                Thanks To Scroll.
                <br /> Now Scroll Up Again☝️🏿
              </h1>
            </div>
            <div className='grid gap-2'>
              <figure className='grid place-content-center -skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
              <figure className='grid place-content-center skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
              <figure className='grid place-content-center -skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
              <figure className='grid place-content-center skew-x-12'>
                <ClashCard></ClashCard>
              </figure>
            </div>
          </div>
        </section>



        <footer className='group bg-slate-950'>
          <h1 className='text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-linear-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
          </h1>
        </footer>
      </main>
    </ReactLenis>
  );
}


interface StickyCardProps {
  image: string;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const StickyCard: React.FC<StickyCardProps> = ({ image, index, activeIndex, setActiveIndex }) => {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.5) {
          setActiveIndex(index);
        } else if (entry.intersectionRatio < 0.5 && index === activeIndex && index > 0) {
          setActiveIndex(index - 1);
        }
      },
      { threshold: [0.5] }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index, setActiveIndex, activeIndex]);

  const isVisible = index >= activeIndex;

  return (
    <figure 
      ref={cardRef}
      className={`sticky top-0 h-screen grid place-content-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Card image={image} />
    </figure>
  );
};
