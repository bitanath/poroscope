'use client';
import { ReactLenis,useLenis } from '@studio-freight/react-lenis';
import { useRef, useState } from 'react';
import { LightBoard } from '../ui/lightboard';

import Background from '../sections/Background';
import { Dock } from '../sections/Dock';

import { Card } from '../sections/Champion';
import { Image } from '@aws-amplify/ui-react';
import TextAnimation from '@/components/ui/scroll-text';
import HorizontalScroller from '../sections/Horizontal';

interface SummaryProps {
  signOut: () => void;
}


export default function Summary({signOut}:SummaryProps): JSX.Element {
  const container = useRef(null);
  const [dockVisible,setDockVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [kda,_] = useState({kills:1000,deaths:100,assists:10})

  useLenis(lenis=>{
    setDockVisible(lenis.progress > 0.1)
  })

  return (
    <ReactLenis root>
      <Dock visible={dockVisible} signOut={signOut}/>
      <main className='bg-white' ref={container}>
        <div className='wrapper group'>
          <section className='text-white h-screen w-full bg-slate-950 grid place-content-center relative top-0'>
            <div className="absolute inset-0 z-0">
              <Background opacity={0.24}/>
            </div>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-10'></div>
            
              <div className="relative z-20">
                <div className="flex justify-center">
                  <div className="w-32 h-32 md:w-24 md:h-24 lg:w-20 lg:h-20" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                    <Image 
                    src='https://ddragon.leagueoflegends.com/cdn/15.22.1/img/profileicon/6923.png' 
                    alt='Profile Image'
                    className="w-full h-full object-cover"
                    />
                </div>
              </div>
              <h1 className='1xl:text-xl text-3xl px-8 font-semibold text-center tracking-tight leading-[120%] mb-2'>Welcome Summoner!</h1>
              <TextAnimation
                as='p'
                letterAnime={true}
                text="In 2025 you played 202 ranked games, 350 ARAM games and 700 unranked games ✨"
                classname='max-w-screen text-white 2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]'
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
              <h1 className='dock-trigger xl:text-xl text-2xl px-8 font-semibold text-center tracking-tight leading-[120%] mt-20'>MadSkilzz, This is your Rift Rewind 👇</h1>
            </div>
          </section>
          
          <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                <div className="absolute top-0 left-0 right-0 max-w-full w-full bg-black lightboard">
                    <LightBoard rows={25} lightSize={3} gap={2} text={`CSPM:${kda.kills}  GSPD:${kda.deaths}  GPM:${kda.assists}`} font="default" updateInterval={200} colors={{ background: "#1a1a1a", textDim: "#00ffff", drawLine: "#0000ff", textBright: "#9e85bf", }} />
                </div>
                <TextAnimation
                    text="It's been a good year! You beat 413 unique players, playing with the same team 121 times."
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-7xl text-6xl max-w-screen mx-auto font-medium capitalize p-16'
                  />
                <div className="absolute bottom-0 left-0 right-0 max-w-full w-full bg-black lightboard">
                    <LightBoard rows={25} lightSize={3} gap={2} text={`Kills:${kda.kills}  Deaths:${kda.deaths}  Assists:${kda.assists}`} font="default" updateInterval={200} colors={{ background: "#1a1a1a", textDim: "#00ffff", drawLine: "#0000ff", textBright: "#9e85bf", }} />
                </div>
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
            
        </div>

        <div className="wrapper">
            <HorizontalScroller></HorizontalScroller>
        </div>

        <section className='text-white w-full bg-slate-950 sticky'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              <Card name='Hecarim' index={0} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Nunu' index={1} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Nidalee' index={2} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Graves' index={3} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-xl md:text-4xl pl-16 font-medium text-right tracking-tight leading-[120%]'>
                These champions were your crowning glory! TF-IDF metric tells you how much better you were than opponents. 👑
              </h1>
            </div>
          </div>
        </section>

        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                
                    <TextAnimation
                    text="But it hasn't always been smooth sailing."
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-md mx-auto font-medium capitalize'
                    />
                
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>
        <section className='text-white w-full bg-slate-950 sticky'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              <Card name='Lulu' index={4} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Aatrox' index={5} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Jax' index={6} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Corki' index={7} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-xl md:text-4xl pl-16 font-medium text-right tracking-tight leading-[120%]'>
                These champions unalived you the most. Compared and normalized against your opponents and Teammates. 💀
              </h1>
            </div>
          </div>
        </section>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                    <TextAnimation
                    text="These champions were the best over all the games we analysed. Specific to the games you played."
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-md mx-auto font-medium capitalize'
                    />
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>
        <section className='text-white w-full bg-slate-950 sticky'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              <Card name='Neeko' index={8} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Rek27Sai' index={9} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Xerath' index={10} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
              <Card name='Xin_Zhao' index={11} activeIndex={activeCardIndex} setActiveIndex={setActiveCardIndex} />
              <div className='h-screen'></div>
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-xl md:text-4xl pl-16 font-medium text-right tracking-tight leading-[120%]'>
                Give up and go home now lol, there's no beating these dudes. 😈
              </h1>
            </div>
          </div>
        </section>
        <div className='h-[50vh] bg-slate-950 text-black grid place-content-center sticky'></div>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                    <TextAnimation
                    text='Want more? We have more!'
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
                
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>
        <div className="wrapper">
            <HorizontalScroller></HorizontalScroller>
        </div>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center text-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                <Image src="/octocat.svg" maxWidth={120} maxHeight={120} alt="Fork us on Github" className='w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-20' style={{ transform: 'translateX(-50%)', marginLeft: '50%' }}></Image>
                    <TextAnimation
                    text="❤️ for Scrolling. Our project is open source! Fork it."
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-3/4 p-8 mx-auto font-medium capitalize'
                    />
            </section>
            
        </div>
        <footer className='group bg-slate-950'>
          <h1 className='text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-linear-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
          </h1>
        </footer>
      </main>
    </ReactLenis>
  );
}


