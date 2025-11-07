import React from "react"
import * as HoverCardPrimitives from "@radix-ui/react-hover-card"

import { cn } from "../../lib/utils"

interface TrackerBlockProps {
  key?: string | number
  type: 'win' | 'loss' | 'abort'
  name: string
  hoverEffect?: boolean
  defaultBackgroundColor?: string
}

const Block = ({
  type,
  name,
  defaultBackgroundColor,
  hoverEffect,
}: TrackerBlockProps) => {
  const [open, setOpen] = React.useState(false)
  
  const getColor = (type: 'win' | 'loss' | 'abort') => {
    switch (type) {
      case 'win': return 'bg-emerald-600'
      case 'loss': return 'bg-red-600'
      case 'abort': return 'bg-gray-400'
    }
  }

  return (
    <HoverCardPrimitives.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={0}
      tremor-id="tremor-raw"
    >
      <HoverCardPrimitives.Trigger onClick={() => setOpen(true)} asChild>
        <div className="size-full overflow-hidden transition first:rounded-l-lg last:rounded-r-lg">
          <div
            className={cn(
              "size-full",
              getColor(type) || defaultBackgroundColor,
              hoverEffect ? "hover:opacity-50" : "",
            )}
          />
        </div>
      </HoverCardPrimitives.Trigger>
      <HoverCardPrimitives.Portal>
        <HoverCardPrimitives.Content
          sideOffset={10}
          side="top"
          align="center"
          avoidCollisions
          className={cn(
            "w-auto rounded-md px-2 py-1 text-sm shadow-md",
            "text-white dark:text-gray-900",
            "bg-gray-900 dark:bg-gray-50",
          )}
        >
          {name}
        </HoverCardPrimitives.Content>
      </HoverCardPrimitives.Portal>
    </HoverCardPrimitives.Root>
  )
}


interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrackerBlockProps[]
  defaultBackgroundColor?: string
  hoverEffect?: boolean
}

const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(
  (
    {
      data = [],
      defaultBackgroundColor = "bg-gray-400 dark:bg-gray-400",
      className,
      hoverEffect,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("group flex h-8 w-full items-center", className)}
        {...props}
      >
        {data.map((props, index) => (
          <Block
            key={props.key ?? index}
            defaultBackgroundColor={defaultBackgroundColor}
            hoverEffect={hoverEffect}
            {...props}
          />
        ))}
      </div>
    )
  },
)

Tracker.displayName = "Tracker"

const data = [
  { type: 'win', name: 'Victory vs Team Alpha' },
  { type: 'loss', name: 'Defeat vs Team Beta' },
  { type: 'win', name: 'Victory vs Team Gamma' },
  { type: 'abort', name: 'Draw vs Team Delta' },
  { type: 'win', name: 'Victory vs Team Echo' },
  { type: 'loss', name: 'Defeat vs Team Foxtrot' },
  { type: 'win', name: 'Victory vs Team Golf' },
  { type: 'win', name: 'Victory vs Team Hotel' },
  { type: 'loss', name: 'Defeat vs Team India' },
  { type: 'abort', name: 'Draw vs Team Juliet' },
  { type: 'win', name: 'Victory vs Team Kilo' },
  { type: 'loss', name: 'Defeat vs Team Lima' },
  { type: 'win', name: 'Victory vs Team Mike' },
  { type: 'win', name: 'Victory vs Team November' },
  { type: 'loss', name: 'Defeat vs Team Oscar' },
  { type: 'abort', name: 'Draw vs Team Papa' },
  { type: 'win', name: 'Victory vs Team Quebec' },
  { type: 'loss', name: 'Defeat vs Team Romeo' },
  { type: 'win', name: 'Victory vs Team Sierra' },
  { type: 'win', name: 'Victory vs Team Tango' },
  { type: 'loss', name: 'Defeat vs Team Uniform' },
  { type: 'abort', name: 'Draw vs Team Victor' },
  { type: 'win', name: 'Victory vs Team Whiskey' },
  { type: 'loss', name: 'Defeat vs Team X-ray' },
  { type: 'win', name: 'Victory vs Team Yankee' },
  { type: 'win', name: 'Victory vs Team Zulu' },
  { type: 'loss', name: 'Defeat vs Storm Eagles' },
  { type: 'abort', name: 'Draw vs Fire Dragons' },
  { type: 'win', name: 'Victory vs Ice Wolves' },
  { type: 'loss', name: 'Defeat vs Thunder Hawks' },
  { type: 'win', name: 'Victory vs Shadow Panthers' },
  { type: 'win', name: 'Victory vs Lightning Bolts' },
  { type: 'loss', name: 'Defeat vs Crimson Tigers' },
  { type: 'abort', name: 'Draw vs Golden Lions' },
  { type: 'win', name: 'Victory vs Silver Sharks' },
  { type: 'loss', name: 'Defeat vs Dark Ravens' },
  { type: 'win', name: 'Victory vs Bright Phoenix' },
  { type: 'win', name: 'Victory vs Steel Rhinos' },
  { type: 'loss', name: 'Defeat vs Wild Boars' },
  { type: 'abort', name: 'Draw vs Swift Falcons' },
  { type: 'win', name: 'Victory vs Mighty Bears' },
  { type: 'loss', name: 'Defeat vs Fierce Cobras' },
  { type: 'win', name: 'Victory vs Royal Stallions' },
  { type: 'win', name: 'Victory vs Savage Leopards' },
  { type: 'loss', name: 'Defeat vs Ancient Owls' },
  { type: 'abort', name: 'Draw vs Mystic Foxes' },
  { type: 'win', name: 'Victory vs Blazing Meteors' },
  { type: 'loss', name: 'Defeat vs Frozen Glaciers' },
  { type: 'win', name: 'Victory vs Roaring Tsunamis' },
  { type: 'win', name: 'Victory vs Soaring Eagles' },
  { type: 'loss', name: 'Defeat vs Crushing Avalanche' },
  { type: 'abort', name: 'Draw vs Burning Inferno' },
  { type: 'win', name: 'Victory vs Shining Stars' },
  { type: 'loss', name: 'Defeat vs Raging Storms' },
  { type: 'win', name: 'Victory vs Calm Oceans' },
  { type: 'win', name: 'Victory vs Solid Rocks' },
  { type: 'loss', name: 'Defeat vs Flying Comets' },
  { type: 'abort', name: 'Draw vs Dancing Flames' },
  { type: 'win', name: 'Victory vs Howling Winds' },
  { type: 'loss', name: 'Defeat vs Falling Rain' },
  { type: 'win', name: 'Victory vs Rising Sun' }
] as const


export const Formbar = () => (
  <>
    <Tracker className="hidden w-full lg:flex" data={data.slice(0,60)} />
    <Tracker
      className="hidden w-full sm:flex lg:hidden"
      data={data.slice(0, 40)}
    />
    <Tracker className="flex w-full sm:hidden" data={data.slice(0, 30)} />
  </>
)