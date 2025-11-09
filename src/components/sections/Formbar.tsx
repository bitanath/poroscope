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
        className={cn("group flex h-8 w-full items-center gap-0.5", className)}
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

interface FormbarProps {
  data: Array<{ type: 'win' | 'loss' | 'abort'; name: string }>;
}

export const Formbar = ({ data }: FormbarProps) => (
  <>
    <Tracker className="hidden w-full lg:flex" data={data.slice(0,60)} />
    <Tracker
      className="hidden w-full sm:flex lg:hidden"
      data={data.slice(0, 40)}
    />
    <Tracker className="flex w-full sm:hidden" data={data.slice(0, 30)} />
  </>
)

